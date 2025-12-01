<script lang="ts">
  import { ExternalLink } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    children?: Snippet;
  }

  let { href = '#', children }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} target="_blank" rel="noopener noreferrer" class="text-oval-green">
  {@render children?.()}
  <i aria-hidden="true">
    <ExternalLink size={16} />
  </i>
</a>

<style>
  a {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }
  i {
    display: inline-flex;
    margin-left: 2px;
  }
</style>
