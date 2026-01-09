import { OpenaiBaseService } from './openai.base.service';

export class MimoService extends OpenaiBaseService {
  constructor(opts: { apiKey: string; baseUrl?: string; timeout?: number; model?: string }) {
    const baseUrl = opts.baseUrl || 'https://api.xiaomimimo.com';
    const model = opts.model || 'mimo-v2-flash';
    super({ ...opts, baseUrl, model });
  }
}
