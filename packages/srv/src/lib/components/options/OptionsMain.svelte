<script lang="ts">
  import GeneralOptions from '$lib/components/options/GeneralOptions.svelte';
  import ProviderOptions from '$lib/components/options/ProviderOptions.svelte';
  import Sidebar from '$lib/components/options/Sidebar.svelte';
  import ExternalLink from '$lib/components/base/ExternalLink.svelte';
  import Oval from '$lib/components/base/Oval.svelte';
  import type { TOvalExtOptions } from './schema';
  import type { TOptionsHandlers } from './type';

  let active = $state('General');

  type Props = {
    options: TOvalExtOptions;
    // this is ugly way to avoid display not-up-to-date view
    //  ¯\_(ツ)_/¯
    optionsLoaded: boolean;
  } & Pick<
    TOptionsHandlers,
    'onDeleteProvider' | 'onAddProvider' | 'onSelectActiveProvider' | 'onKvChange'
  >;

  let {
    options,
    optionsLoaded,
    onDeleteProvider,
    onAddProvider,
    onSelectActiveProvider,
    onKvChange
  }: Props = $props();
</script>

<div class="mx-auto max-w-3xl space-y-2 p-4 text-foreground">
  <div class="flex justify-end"><Oval /></div>
  <div class="ogrid">
    <Sidebar onclickitem={(key) => (active = key)} {active} />
    <div class="py-1.5">
      {#if optionsLoaded}
        {#if active === 'General'}
          <GeneralOptions
            isUsingBuiltInProvider={!options.llmProvider.activeKey}
            {onKvChange}
            targetLanguage={options.targetLanguage}
          />
        {:else if active === 'Provider'}
          <ProviderOptions
            value={options.llmProvider}
            {onDeleteProvider}
            {onAddProvider}
            {onSelectActiveProvider}
          />
        {:else if active === 'About'}
          <div><ExternalLink href="https://github.com/haishanh/oval">GitHub</ExternalLink></div>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .ogrid {
    display: grid;
    grid-template-columns: max-content minmax(100px, 1fr);
    gap: 20px;
  }
</style>
