<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    iconOnly?: boolean;
    children?: Snippet;
  } & HTMLButtonAttributes;
  let { children, iconOnly, ...props }: Props = $props();
</script>

<!-- dark:disabled:text-neutral-500 -->
<button
  {...props}
  class={[
    'cursor-pointer rounded-full border border-neutral-300 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-700',
    'hover:border-neutral-350 hover:bg-neutral-200 active:not-disabled:translate-y-[1%] active:not-disabled:scale-99 dark:hover:bg-neutral-600',
    'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:cursor-not-allowed disabled:border-neutral-300/30 disabled:bg-neutral-50  disabled:text-muted-foreground dark:disabled:border-neutral-800 dark:disabled:bg-neutral-800',
    iconOnly ? 'p-2' : 'inline-flex items-center justify-center gap-1 px-3 py-2'
  ]}
>
  {@render children?.()}
</button>
