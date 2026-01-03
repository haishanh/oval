<script lang="ts">
  import { browser } from '#imports';
  import OptionsMain from '$lib/components/options/OptionsMain.svelte';
  import { OvalExtOptionsSchema } from '$lib/components/options/schema';
  import { llmProvider, targetLanguage } from '$lib/components/options/state.svelte';
  import { STORAGE_KEY } from '@/utils/constant';
  import { onMount } from 'svelte';

  let optionsLoaded = $state(false);

  onMount(() => {
    browser.storage.local
      .get([STORAGE_KEY.LlmProvider, STORAGE_KEY.targetLanguage])
      .then((result) => {
        try {
          const parsed = OvalExtOptionsSchema.parse(result);
          if (parsed.llmProvider) {
            llmProvider.providers = parsed.llmProvider.providers;
            llmProvider.activeKey = parsed.llmProvider.activeKey;
          }
          if (parsed.targetLanguage) {
            targetLanguage.current = parsed.targetLanguage;
          }
        } finally {
          optionsLoaded = true;
        }
      });
  });

  $effect(() => {
    browser.storage.local.set({ [STORAGE_KEY.LlmProvider]: $state.snapshot(llmProvider) });
  });
  $effect(() => {
    browser.storage.local.set({ [STORAGE_KEY.targetLanguage]: targetLanguage.current });
  });
</script>

<OptionsMain
  options={{ llmProvider: llmProvider, targetLanguage: targetLanguage.current }}
  {optionsLoaded}
  onAddProvider={(provider) => {
    llmProvider.providers.push(provider);
  }}
  onEditProvider={(provider) => {
    const index = llmProvider.providers.findIndex((p) => p.key === provider.key);
    if (index !== -1) {
      llmProvider.providers[index] = provider;
    }
  }}
  onDeleteProvider={(key) => {
    llmProvider.providers = llmProvider.providers.filter((provider) => provider.key !== key);
    if (llmProvider.activeKey === key) llmProvider.activeKey = '';
  }}
  onSelectActiveProvider={(key) => {
    llmProvider.activeKey = key;
  }}
  onKvChange={(key, value) => {
    if (key === 'targetLanguage') {
      targetLanguage.current = value;
    }
  }}
/>
