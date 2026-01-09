import { OpenaiBaseService } from './openai.base.service';

export class GrokService extends OpenaiBaseService {
  constructor(opts: { apiKey: string; baseUrl?: string; timeout?: number; model?: string }) {
    const baseUrl = opts.baseUrl || 'https://api.x.ai';
    const model = opts.model || 'grok-4-1-fast-non-reasoning';
    super({ ...opts, baseUrl, model });
  }
}
