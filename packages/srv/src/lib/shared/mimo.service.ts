import { OpenaiBaseService } from './openai.base.service';

const DEFAULT_BASE_URL = 'https://api.xiaomimimo.com';

export class MimoService extends OpenaiBaseService {
  constructor(opts: { apiKey: string; baseUrl?: string; timeout?: number; model?: string }) {
    super({
      ...opts,
      baseUrl: DEFAULT_BASE_URL,
      model: 'mimo-v2-flash',
    });
  }
}
