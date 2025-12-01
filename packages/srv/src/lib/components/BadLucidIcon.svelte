<script lang="ts">
  import * as icons from '@lucide/svelte';
  import { onMount } from 'svelte';

  const BadgeInfo = icons.BadgeInfo;

  let { name, ...props } = $props();

  const Icon = $derived(icons[name as unknown as 'Activity']);

  onMount(() => {
    // TODO do this only in dev mode
    if (!Icon) {
      console.log('icon not found', name);
    }
  });
</script>

{#if Icon}
  <Icon {...props} />
{:else}
  <BadgeInfo {...props} />
{/if}
