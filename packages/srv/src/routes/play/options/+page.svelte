<script lang="ts">
  import OptionsMain from '$lib/components/options/OptionsMain.svelte';
  import { onMount } from 'svelte';
  import { OvalExtOptionsSchema } from '$lib/components/options/schema';
  import { llmProvider, targetLanguage } from '$lib/components/options/state.svelte';

  const STORAGE_KEY = 'oval';

  let optionsLoaded = $state(false);

  onMount(() => {
    const v = localStorage.getItem(STORAGE_KEY);

    if (v) {
      const parsed = OvalExtOptionsSchema.parse(JSON.parse(v));
      llmProvider.providers = parsed.llmProvider.providers;
      llmProvider.activeKey = parsed.llmProvider.activeKey;
      targetLanguage.current = parsed.targetLanguage;

      optionsLoaded = true;
    }
  });

  $effect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        llmProvider,
        targetLanguage: targetLanguage.current
      })
    );
  });
</script>

<OptionsMain
  options={{ llmProvider: llmProvider, targetLanguage: targetLanguage.current }}
  {optionsLoaded}
  onAddProvider={(provider) => {
    llmProvider.providers.push(provider);
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
    } else {
      throw new Error(`Invalid options key: ${key}`);
    }
  }}
/>
