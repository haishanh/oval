import type { TProviderOptions } from '$lib/components/options/schema';

export const llmProvider = $state<TProviderOptions>({ providers: [], activeKey: '' });

export const targetLanguage = $state<{ current: string }>({ current: '' });
