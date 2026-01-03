import { createAsyncIterableFromSSEResponse } from './sse.util';
import type { KyInstance } from 'ky';
import ky from 'ky';

type GrokChoice = {
  index: number;
  delta: { content: string };
  // "stop"
  finish_reason?: string;
};

type GrokChunk = {
  id: string;
  // "object":"chat.completion.chunk"
  object: string;
  // "created":1766501400
  // unix epoch in seconds
  created: number;
  // "model":"grok-4-1-fast-non-reasoning"
  model: string;
  choices: GrokChoice[];
  // "system_fingerprint":"fp_9d01d9ad3c"
  system_fingerprint: string;
};

// data: [DONE]

export class OpenaiBaseService {
  private ky: KyInstance;
  private model?: string;

  constructor(
    readonly opts: {
      /** API Key */
      apiKey: string;
      /** Base URL */
      baseUrl: string;
      timeout?: number;
      /** default model */
      model?: string;
    },
  ) {
    const prefixUrl = opts.baseUrl;
    const timeout = opts.timeout || 70000;

    this.model = opts.model;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    };
    this.ky = ky.create({ prefixUrl, headers, timeout });
  }

  async complete(
    messages: {
      content: string;
      role: string;
    }[],
    providedModel?: string,
  ) {
    const model = providedModel || this.model;
    const json = { messages, model, stream: true, temperature: 0.4 };
    return await this.ky.post('v1/chat/completions', { json });
  }

  static createAsyncIterableTextStreamFromResponse(res: Response): AsyncIterable<string> {
    return {
      async *[Symbol.asyncIterator]() {
        const ai = OpenaiBaseService.createAsyncIterableStreamFromResponse(res);
        for await (const chunk of ai) {
          const fr = chunk?.choices?.[0]?.finish_reason;
          if (!fr) {
            yield chunk?.choices?.[0]?.delta?.content || '';
          } else if (fr !== 'stop') {
            console.log('Unexpected finish_reason:', fr);
          }
        }
      },
    };
  }

  static createAsyncIterableStreamFromResponse(res: Response): AsyncIterable<GrokChunk> {
    const sep = '\n\n';
    return createAsyncIterableFromSSEResponse(res, sep, parseDataLine);
  }
}

function parseDataLine(ln: string) {
  const str = ln.substring(6);
  // we dont are about end mark
  if (str === '[DONE]') return;
  try {
    return JSON.parse(ln.substring(6)) as GrokChunk;
  } catch (e) {
    console.error(e);
    console.log(`Unable to parse [${ln.substring(6)}] (content in []) as JSON`);
  }
}
