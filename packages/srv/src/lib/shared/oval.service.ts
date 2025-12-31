import type { KyInstance } from 'ky';
import ky from 'ky';
import { createAsyncIterableFromSSEResponse } from './sse.util';

const DEFAULT_BASE_URL = 'https://oval-worker.hs.workers.dev';
const DEFAULT_TIMEOUT = 70_000;

export class OvalService {
  private ky: KyInstance;

  constructor(opts: {
    /** API Key */
    apiKey: string;
    /** Base URL */
    baseUrl?: string;
    timeout?: number;
  }) {
    const prefixUrl = opts.baseUrl || DEFAULT_BASE_URL;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    };
    this.ky = ky.create({ prefixUrl, headers, timeout: opts.timeout || DEFAULT_TIMEOUT });
  }

  async generate(input: { content: string; title: string; lang: string }) {
    return await this.ky.post('api/summary/v1', { json: input });
  }

  static createAsyncIterableTextStreamFromResponse(res: Response) {
    const sep = '\n\n';
    return createAsyncIterableFromSSEResponse(res, sep, (str) => {
      const lines = str.split('\n');
      return lines
        .map((l) => {
          if (l.startsWith('data: ')) {
            return l.substring(6);
          }
          return '';
        })
        .join('\n');
    });
  }
}
