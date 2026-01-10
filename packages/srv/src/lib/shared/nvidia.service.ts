import { PROVIDER_DEFAULTS, PROVIDER_NVIDIA_AI } from '$lib/components/options/constant';
import { OpenaiBaseService } from './openai.base.service';

export class NvidiaAiService extends OpenaiBaseService {
  constructor(opts: { apiKey: string; baseUrl?: string; timeout?: number; model?: string }) {
    const fallback = PROVIDER_DEFAULTS[PROVIDER_NVIDIA_AI];
    const baseUrl = opts.baseUrl || fallback.apiBaseUrl;
    const model = opts.model || fallback.model;
    super({ ...opts, baseUrl, model });
  }
}
