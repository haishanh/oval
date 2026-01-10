import { PROVIDER_DEFAULTS, PROVIDER_XIAOMI_MIMO } from '$lib/components/options/constant';
import { OpenaiBaseService } from './openai.base.service';

export class MimoService extends OpenaiBaseService {
  constructor(opts: { apiKey: string; baseUrl?: string; timeout?: number; model?: string }) {
    const fallback = PROVIDER_DEFAULTS[PROVIDER_XIAOMI_MIMO];
    const baseUrl = opts.baseUrl || fallback.apiBaseUrl;
    const model = opts.model || fallback.model;
    super({ ...opts, baseUrl, model });
  }

  // transformInput(input: object) {
  //   return { ...input, thinking: { type: 'enabled' } };
  // }
}

// Errors:
// status: 400
// body:
// {
//     "error": {
//         "code": "421",
//         "message": "Moderation Block",
//         "param": "The request was rejected because it was considered high risk",
//         "type": "content_filter"
//     }
// }
