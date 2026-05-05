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
    model: 'gemini-3-flash-preview',
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
    model: 'mimo-v2.5',
    apiBaseUrl: 'https://api.xiaomimimo.com',
    apiKeyInfo: {
      href: 'https://platform.xiaomimimo.com/docs/en-US/welcome',
      children: 'Xiamo MIMO',
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
