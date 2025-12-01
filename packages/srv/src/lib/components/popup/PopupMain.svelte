<script lang="ts">
  import Button from '$lib/components/base/Button.svelte';
  import { Settings2, SparklesIcon } from '@lucide/svelte';

  type Props = {
    onclicksummarize: () => void;
    onclickoptions: () => void;
  };

  let { onclicksummarize, onclickoptions }: Props = $props();
</script>

<div class="mx-auto max-w-sm space-y-2 bg-background p-4 text-foreground">
  <div class="flex justify-end">
    <Button iconOnly onclick={onclickoptions}>
      <Settings2 size={14} />
      <span class="sr-only">Options</span>
    </Button>
  </div>
  <div class="flex justify-center py-4">
    <Button onclick={onclicksummarize}>
      <SparklesIcon size={14} />
      Summarize
    </Button>
  </div>
</div>
