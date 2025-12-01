import { GeminiService } from '$lib/shared/gemini.service';
import { GEMINI_API_KEY } from './env';

export const registry = {
  getGeminiService: newGeminiService()
};

export type Registry = typeof registry;

function newGeminiService() {
  let svc: GeminiService;
  return () => {
    if (!svc) svc = new GeminiService({ apiKey: GEMINI_API_KEY });
    return svc;
  };
}
