export const PROVIDER_GOOGLE_GEMINI = 'Google Gemini';
export const PROVIDER_XAI_GROK = 'xAI Grok';
export const PROVIDER_XIAOMI_MIMO = 'Xiaomi MiMo';

export const PROVIDER_OPTIONS = [PROVIDER_GOOGLE_GEMINI, PROVIDER_XAI_GROK, PROVIDER_XIAOMI_MIMO];

export const DEFAULT_MODEL_GROK = 'grok-4-1-fast-non-reasoning';
export const DEFAULT_MODEL_GEMINI = 'gemini-2.5-flash-preview-09-2025';
export const DEFAULT_MODEL_MIMO = 'mimo-v2-flash';

export const PROVIDER_DEFAULTS = {
  [PROVIDER_GOOGLE_GEMINI]: {
    model: DEFAULT_MODEL_GEMINI,
    apiBaseUrl: 'https://generativelanguage.googleapis.com',
  },
  [PROVIDER_XAI_GROK]: {
    model: DEFAULT_MODEL_GROK,
    apiBaseUrl: 'https://api.x.ai',
  },
  [PROVIDER_XIAOMI_MIMO]: {
    model: DEFAULT_MODEL_MIMO,
    apiBaseUrl: 'https://api.xiaomimimo.com',
  },
};
