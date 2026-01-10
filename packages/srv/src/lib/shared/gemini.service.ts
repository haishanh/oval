import { createAsyncIterableFromSSEResponse } from './sse.util';
import ky, { type KyInstance } from 'ky';

type GeminiResponseCandidate = {
  content: {
    parts: {
      text: string;
      thought?: boolean;
    }[];
  };
};

type GeminiResponse = {
  candidates: GeminiResponseCandidate[];
};

type GeminiStreamData = {
  candidates: GeminiResponseCandidate[];
  usageMetadata: UsageMetadata;
  /** like "gemini-2.5-flash" */
  modelVersion: string;
  responseId: string;
};

type UsageMetadata = {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: { modality: string; tokenCount: number }[];
  thoughtsTokenCount: number;
};

const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com';

export class GeminiService {
  private ky: KyInstance;
  private model: string;

  constructor(
    readonly opts: {
      /** API Key */
      apiKey: string;
      /** Base URL */
      baseUrl?: string;
      timeout?: number;
      /** default model */
      model?: string;
    },
  ) {
    const prefixUrl = opts.baseUrl || DEFAULT_BASE_URL;
    const timeout = opts.timeout || 70000;

    this.model = opts.model || 'gemini-2.5-flash-lite';

    const headers = {
      'Content-Type': 'application/json',
      'x-goog-api-key': opts.apiKey,
    };
    this.ky = ky.create({ prefixUrl, headers, timeout });
  }

  static buildGenerateContentRequestBody(text: string, instruction?: string) {
    const contents = [{ parts: [{ text }] }];
    return {
      ...(instruction
        ? {
            system_instruction: { parts: [{ text: instruction }] },
          }
        : undefined),
      contents,
      generationConfig: {
        thinkingConfig: {
          includeThoughts: false,
          // thinkingLevel: 'low',
        },
      },
    };
  }

  async generateContent(json: unknown, providedModel?: string) {
    const model = providedModel || this.model;
    const endpoint = `v1beta/models/${model}:generateContent`;
    return await this.ky.post<GeminiResponse>(endpoint, { json }).json();
  }

  async streamGenerateContent(json: unknown, providedModel?: string) {
    const model = providedModel || this.model;
    const endpoint = `v1beta/models/${model}:streamGenerateContent`;
    return await this.ky.post(endpoint, { json, searchParams: { alt: 'sse' } });
  }

  static createAsyncIterableTextStreamFromResponse(res: Response): AsyncIterable<string> {
    return {
      async *[Symbol.asyncIterator]() {
        const ai = GeminiService.createAsyncIterableStreamFromGeminiResponse(res);
        for await (const json of ai) {
          const t = json.candidates?.[0]?.content?.parts[0]?.text || '';
          yield t;
        }
      },
    };
  }

  static createAsyncIterableStreamFromGeminiResponse(res: Response): AsyncIterable<GeminiStreamData> {
    const sep = '\r\n\r\n';
    return createAsyncIterableFromSSEResponse(res, sep, parseDataLine);
  }
}

function parseDataLine(ln: string) {
  try {
    return JSON.parse(ln.substring(6)) as GeminiStreamData;
  } catch (e) {
    console.error(e);
    console.log(`Unable to parse [${ln.substring(6)}] (content in []) as JSON`);
  }
}
