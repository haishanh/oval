import { createAsyncIterableFromSSEResponse } from './sse.util';
import type { KyInstance } from 'ky';
import ky from 'ky';

type Nullable<T> = T | null;

type CompletionChoice = {
  index: number;
  delta: {
    role: Nullable<string>;
    content: Nullable<string>;
    reasoning_content: Nullable<string>;
  };
  // "stop"
  finish_reason?: string;
};

type CompletionChunk = {
  id: string;
  // "object":"chat.completion.chunk"
  object: string;
  // "created":1766501400
  // unix epoch in seconds
  created: number;
  // "model":"grok-4-1-fast-non-reasoning"
  model: string;
  choices: CompletionChoice[];
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

  transformInput(json: object) {
    return json;
  }

  async complete(
    messages: {
      content: string;
      role: string;
    }[],
    opts?: { model?: string } & unknown,
  ) {
    const input = {
      messages,
      model: opts?.model || this.model,
      stream: true,
      temperature: 0.4,
      ...opts,
    };
    const json = this.transformInput(input);
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

  static createAsyncIterableStreamFromResponse(res: Response): AsyncIterable<CompletionChunk> {
    const sep = '\n\n';
    return createAsyncIterableFromSSEResponse(res, sep, parseDataLine);
  }
}

function parseDataLine(ln: string) {
  const str = ln.substring(6);
  // we dont are about end mark
  if (str === '[DONE]') return;
  try {
    return JSON.parse(ln.substring(6)) as CompletionChunk;
  } catch (e) {
    console.error(e);
    console.log(`Unable to parse [${ln.substring(6)}] (content in []) as JSON`);
  }
}
