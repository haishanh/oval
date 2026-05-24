import { type Browser, browser, defineBackground } from '#imports';
import { Message, MessageType, type TMessage } from '@/utils/message';
import * as v from 'valibot';
import { GeminiService, SummaryService, OvalService } from 'srv';
import { log } from '@/utils/logger';
import { generate } from 'srv';
import { sleep } from 'srv';
import { OvalExtOptionsSchema, safeParseWith, TProviderOptions } from 'srv';
import {
  PROVIDER_DEFAULTS,
  PROVIDER_GOOGLE_GEMINI,
  PROVIDER_XAI_GROK,
  PROVIDER_XIAOMI_MIMO,
  PROVIDER_NVIDIA_AI,
} from 'srv';
import { STORAGE_KEY } from '@/utils/constant';
import { GrokService } from 'srv';
import { HTTPError } from 'ky';
import { MimoService } from 'srv';
import { NvidiaAiService } from 'srv';
import { OpenaiBaseService } from 'srv';

const ovalApiKey = import.meta.env.VITE_OVAL_API_KEY;
const CONTENT_SCRIPT_FILE = 'content-scripts/content.js';

async function getActiveTab() {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!tab || !tab.id) {
    throw new Error('Unable to get the id of the active tab');
  }
  return [tab.id, tab] as [number, Browser.tabs.Tab];
}

async function sendScreenshot(port: Browser.runtime.Port) {
  const b64ImgSrc = await browser.tabs.captureVisibleTab();
  port.postMessage({
    type: MessageType.Screenshot,
    payload: { b64ImgSrc },
  } satisfies TMessage);
}

async function hasInjectedContentScript(tabId: number) {
  const [result] = await browser.scripting.executeScript({
    target: { tabId },
    func: () => {
      return Boolean(
        (window as Window & { __ovalContentScript?: { initialized: boolean } }).__ovalContentScript
          ?.initialized,
      );
    },
  });

  return result?.result === true;
}

async function ensureContentScriptInjected(tabId: number) {
  if (await hasInjectedContentScript(tabId)) {
    return;
  }

  await browser.scripting.executeScript({
    target: { tabId },
    files: [CONTENT_SCRIPT_FILE],
  });
}

function generateMockSummary() {
  const ai = generate();
  return {
    async *[Symbol.asyncIterator]() {
      for await (const text of ai) {
        await sleep(300);
        yield text;
      }
    },
  };
}

async function getLlmSvc(parsed: TProviderOptions | undefined) {
  if (!parsed) return;

  if (typeof parsed.activeKey !== 'string' || parsed.activeKey === '') return;

  for (const p of parsed.providers) {
    const { key, apiKey, provider } = p;
    if (key === parsed.activeKey) {
      if (provider === PROVIDER_GOOGLE_GEMINI) {
        const d = PROVIDER_DEFAULTS[PROVIDER_GOOGLE_GEMINI];
        const baseUrl = p.apiBaseUrl || d.apiBaseUrl;
        const model = p.model || d.model;
        return new GeminiService({ apiKey, baseUrl, model });
      } else if (provider === PROVIDER_XAI_GROK || provider === PROVIDER_NVIDIA_AI) {
        const d = PROVIDER_DEFAULTS[provider];
        const baseUrl = p.apiBaseUrl || d.apiBaseUrl;
        const model = p.model || d.model;
        return new OpenaiBaseService({ apiKey, baseUrl, model });
      } else if (provider === PROVIDER_XIAOMI_MIMO) {
        const d = PROVIDER_DEFAULTS[provider];
        const baseUrl = p.apiBaseUrl || d.apiBaseUrl;
        const model = p.model || d.model;
        return new MimoService({ apiKey, baseUrl, model });
      }

      if (import.meta.env.DEV) {
        log.error('provider config not handled', p);
      }
    }
  }
}

async function getTargetLanguage(t: string | undefined) {
  if (typeof t === 'string' && t !== '') return t;
  // langs is like ['en-US', 'zh-CN', 'zh', 'en']
  const langs = await browser.i18n.getAcceptLanguages();
  return langs[0];
}

async function handleArticleMessage(
  port: Browser.runtime.Port,
  article: { title: string; content: string },
) {
  const mock = import.meta.env.VITE_MOCK_SUMMARY_STREAM;

  const stored = await browser.storage.local.get([
    STORAGE_KEY.LlmProvider,
    STORAGE_KEY.targetLanguage,
  ]);

  const result = safeParseWith(OvalExtOptionsSchema, stored);
  const parsed = result.success ? result.data : undefined;
  const lang = await getTargetLanguage(parsed?.targetLanguage);
  let ai: AsyncIterable<string> | undefined;

  if (mock === '1') {
    ai = generateMockSummary();
  } else {
    const llmSvc = await getLlmSvc(parsed?.llmProvider);
    if (llmSvc) {
      ai = new SummaryService(llmSvc).summarize(article, lang);
    }
  }

  try {
    if (!ai) {
      // fallback to our own
      const ovalSvc = new OvalService({
        apiKey: ovalApiKey,
        // When developing - use local Oval API
        // baseUrl: 'http://localhost:8787',
      });
      const res = await ovalSvc.generate({ content: article.content, title: article.title, lang });
      ai = OvalService.createAsyncIterableTextStreamFromResponse(res);
    }

    let t = '';
    for await (const text of ai) {
      t += text;
      port.postMessage({
        type: MessageType.TextChunk,
        payload: { text },
      } satisfies TMessage);
    }
    log.info(t);
  } catch (e) {
    console.log(e);

    let message = '';

    if (e instanceof TypeError) {
      message = e.message;
    } else if (e instanceof HTTPError) {
      // Example Gemini error:
      //
      // {
      //   "error": {
      //     "code": 400,
      //     "message": "API key not valid. Please pass a valid API key.",
      //     "status": "INVALID_ARGUMENT",
      //     "details": [
      //       {
      //         "@type": "type.googleapis.com/google.rpc.ErrorInfo",
      //         "reason": "API_KEY_INVALID",
      //         "domain": "googleapis.com",
      //         "metadata": {
      //           "service": "generativelanguage.googleapis.com"
      //         }
      //       },
      //       {
      //         "@type": "type.googleapis.com/google.rpc.LocalizedMessage",
      //         "locale": "en-US",
      //         "message": "API key not valid. Please pass a valid API key."
      //       }
      //     ]
      //   }
      // }

      // Example Grok error:
      //
      // {
      //     "code": "Client specified an invalid argument",
      //     "error": "Incorrect API key provided: ***. You can obtain an API key from https://console.x.ai."
      // }

      type GeminiErrorResponse = {
        error?: { code: number; message: string; status: string };
      };
      type GrokErrorResponse = {
        code: string;
        error: string;
      };

      const payload = (await e.response.json().catch(() => ({}))) as
        | GeminiErrorResponse
        | GrokErrorResponse;

      if (typeof payload?.error === 'string') {
        message = payload.error;
      } else {
        const m = payload?.error?.message;
        if (m) message = m;
      }
    }

    if (message === '') message = 'Something went wrong';

    port.postMessage({
      type: MessageType.SummarizeError,
      payload: { message },
    } satisfies TMessage);
  }
}

function armListenersOnPort(port: Browser.runtime.Port) {
  port.onDisconnect.addListener(() => {
    log.info('background: port disconnected');
  });
  port.onMessage.addListener((m, port) => {
    const msg = v.parse(Message, m);
    log.info(`background: got message "${msg.type}"`);
    switch (msg.type) {
      case MessageType.Article: {
        handleArticleMessage(port, msg.payload);
        break;
      }

      default: {
        throw new Error(`Unknown message type: ${msg.type}`);
      }
    }
  });
}

async function start() {
  log.debug('start');
  const [tabId] = await getActiveTab();
  await ensureContentScriptInjected(tabId);
  const port = browser.tabs.connect(tabId);
  armListenersOnPort(port);
  // send screenshot data to kick the process
  await sendScreenshot(port);
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((m, _sender, reply) => {
    const msg = v.parse(Message, m);
    switch (msg.type) {
      case MessageType.Summarize: {
        start()
          .catch((error: unknown) => {
            log.warn('Failed to start summarize flow', error);
          })
          .finally(() => reply());
        return true;
      }

      default: {
        throw new Error(`Unknown message type: ${m.type}`);
      }
    }
  });

  // browser.action.onClicked.addListener(() => {});
});
