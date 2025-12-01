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

const DEFAULT_BASE_URL = 'https://api.x.ai';

export class GrokService {
  private ky: KyInstance;

  constructor(opts: {
    /** API Key */
    apiKey: string;
    /** Base URL */
    baseUrl?: string;
  }) {
    const prefixUrl = opts.baseUrl || DEFAULT_BASE_URL;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`
    };
    this.ky = ky.create({ prefixUrl, headers });
  }

  async complete(
    messages: {
      content: string;
      role: string;
    }[],
    model = 'grok-4-1-fast-non-reasoning'
  ) {
    const json = { messages, model, stream: true, temperature: 0.4 };
    return await this.ky.post('v1/chat/completions', { json, timeout: 70000 });
  }

  static createAsyncIterableTextStreamFromResponse(res: Response): AsyncIterable<string> {
    return {
      async *[Symbol.asyncIterator]() {
        const ai = GrokService.createAsyncIterableStreamFromResponse(res);
        for await (const chunk of ai) {
          const fr = chunk?.choices?.[0]?.finish_reason;
          if (!fr) {
            yield chunk?.choices?.[0]?.delta?.content || '';
          } else if (fr !== 'stop') {
            console.log('Unexpected finish_reason:', fr);
          }
        }
      }
    };
  }

  static createAsyncIterableStreamFromResponse(res: Response): AsyncIterable<GrokChunk> {
    const reader = res.body?.getReader();
    if (!reader) throw new Error('res.body is not readable');

    const sep = '\n\n';
    const decoder = new TextDecoder('utf-8');
    let left = '';

    const ai = {
      async *[Symbol.asyncIterator]() {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const decoded = decoder.decode(value, { stream: true });
            const withLeft = left + decoded;
            const dataLines = withLeft.split(sep);

            if (dataLines.length === 1) {
              left += decoded;
              continue;
            }
            left = dataLines.pop() || '';

            for (const ln of dataLines) {
              if (!ln.startsWith('data: ')) continue;
              const t = parseDataLine(ln);
              if (t) yield t;
            }
          }
        } catch (error) {
          console.error('Error consuming stream:', error);
        } finally {
          // Release the lock on the stream
          reader.releaseLock();
        }

        if (left) {
          const text = parseDataLine(left);
          if (text) yield text;
        }
      }
    };
    return ai;
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
