<script lang="ts">
  import Button from '$lib/components/base/Button.svelte';
  import { Settings2 } from '@lucide/svelte';
</script>

<div class="mx-auto max-w-3xl py-3">
  <Button>foo</Button>
  <Button disabled>foo disabled</Button>
  <Button iconOnly>
    <Settings2 size={14} />
    <span class="sr-only">Options</span>
  </Button>
</div>
