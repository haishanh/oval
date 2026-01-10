<script lang="ts">
  import Button from '../base/Button.svelte';
  import { XIcon } from '@lucide/svelte';
  import { Dialog } from 'bits-ui';
  import type { Snippet } from 'svelte';

  let {
    children,
    open = $bindable(),
    onclicktrigger,
  }: {
    children: Snippet;
    open: boolean;
    onclicktrigger?: () => void;
  } = $props();
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger onclick={onclicktrigger}>
    {#snippet child({ props })}
      <Button {...props}>Add provider configuration</Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/30 dark:bg-black/50" />
    <Dialog.Content
      class="fixed top-[20%] left-[50%] z-50 w-full max-w-[min(90vw,800px)] translate-x-[-50%] rounded-xl border border-neutral-200 bg-neutral-50 p-4 pt-0 text-foreground dark:border-neutral-600 dark:bg-neutral-900"
    >
      <Dialog.Title class="flex w-full items-center py-6 font-semibold">New Provider Configuration</Dialog.Title>
      {@render children()}
      <Dialog.Close class="absolute top-3 right-3 cursor-pointer">
        <div><XIcon /><span class="sr-only">Close</span></div>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
