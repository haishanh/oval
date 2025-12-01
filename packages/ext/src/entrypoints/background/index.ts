import { type Browser, browser, defineBackground } from '#imports';
import { Message, MessageType } from '@/utils/message';
import * as z from 'zod';
import { GeminiService, SummaryService } from '$lib/shared/index.service';
import { log } from '@/utils/logger';
import { generate } from '$lib/shared/mock.util';
import { sleep } from '$lib/shared/common.util';
import { OvalExtOptionsSchema, TProviderOptions } from '$lib/components/options/schema';
import { PROVIDER_GOOGLE_GEMINI, PROVIDER_XAI_GROK } from '$lib/components/options/constant';
import { STORAGE_KEY } from '@/utils/constant';
import { GrokService } from '$lib/shared/grok.service';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const geminiSvc = new GeminiService({ apiKey });

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
  } satisfies z.infer<typeof Message>);
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
  if (parsed) {
    if (typeof parsed.activeKey === 'string' && parsed.activeKey !== '') {
      for (const provider of parsed.providers) {
        if (provider.key === parsed.activeKey) {
          if (provider.provider === PROVIDER_GOOGLE_GEMINI) {
            return new GeminiService({
              apiKey: provider.apiKey,
              baseUrl: provider.apiBaseUrl,
            });
          } else if (provider.provider === PROVIDER_XAI_GROK) {
            return new GrokService({
              apiKey: provider.apiKey,
              baseUrl: provider.apiBaseUrl,
            });
          }
        }
      }
    }
  }
  return geminiSvc;
}

async function getSummarySvc(conf: TProviderOptions | undefined) {
  const llmSvc = await getLlmSvc(conf);
  return new SummaryService(llmSvc);
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

  const result = OvalExtOptionsSchema.safeParse(stored);
  const parsed = result.success ? result.data : undefined;
  const lang = await getTargetLanguage(parsed?.targetLanguage);
  const ai =
    mock === '1'
      ? generateMockSummary()
      : (await getSummarySvc(parsed?.llmProvider)).summarize(article, lang);

  for await (const text of ai) {
    port.postMessage({
      type: MessageType.TextChunk,
      payload: { text },
    } satisfies z.infer<typeof Message>);
  }
}

function armListenersOnPort(port: Browser.runtime.Port) {
  port.onDisconnect.addListener(() => {
    log.info('background: port disconnected');
  });
  port.onMessage.addListener((m, port) => {
    const msg = Message.parse(m);
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
  const port = browser.tabs.connect(tabId);
  armListenersOnPort(port);
  // send screenshot data to kick the process
  await sendScreenshot(port);
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((m, _sender, reply) => {
    const msg = Message.parse(m);
    switch (msg.type) {
      case MessageType.Summarize: {
        start().then(() => reply());
        return true;
      }

      default: {
        throw new Error(`Unknown message type: ${m.type}`);
      }
    }
  });

  browser.i18n.getAcceptLanguages().then((langs) => {
    console.log({ langs });
    // ['en-US', 'zh-CN', 'zh', 'en']
  });

  // browser.action.onClicked.addListener(() => {});
});
