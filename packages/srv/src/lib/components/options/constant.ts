export const PROVIDER_GOOGLE_GEMINI = 'Google Gemini';
export const PROVIDER_XAI_GROK = 'xAI Grok';
export const PROVIDER_XIAOMI_MIMO = 'Xiaomi MiMo';
export const PROVIDER_NVIDIA_AI = 'NVIDIA AI';

export const PROVIDER_OPTIONS = [
  ///
  PROVIDER_GOOGLE_GEMINI,
  ///
  PROVIDER_XAI_GROK,
  ///
  PROVIDER_XIAOMI_MIMO,
  ///
  PROVIDER_NVIDIA_AI,
] as const;

export const PROVIDER_DEFAULTS = {
  [PROVIDER_GOOGLE_GEMINI]: {
    model: 'gemini-2.5-flash-preview-09-2025',
    apiBaseUrl: 'https://generativelanguage.googleapis.com',
    apiKeyInfo: {
      href: 'https://aistudio.google.com/',
      children: 'Google AI Studio',
    },
  },
  [PROVIDER_XAI_GROK]: {
    model: 'grok-4-1-fast-non-reasoning',
    apiBaseUrl: 'https://api.x.ai',
    apiKeyInfo: {
      href: 'https://console.x.ai/home',
      children: 'xAI Cloud Console',
    },
  },
  [PROVIDER_XIAOMI_MIMO]: {
    model: 'mimo-v2-flash',
    apiBaseUrl: 'https://api.xiaomimimo.com',
    apiKeyInfo: {
      href: 'https://console.x.ai/home',
      children: 'xAI Cloud Console',
    },
  },
  [PROVIDER_NVIDIA_AI]: {
    model: 'minimaxai/minimax-m2',
    apiBaseUrl: 'https://integrate.api.nvidia.com',
    apiKeyInfo: {
      href: 'https://build.nvidia.com/',
      children: 'Nvidia',
    },
  },
};
