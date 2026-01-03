<script lang="ts">
  import { makeId } from '$lib/shared/common.util';
  import { EyeIcon, EyeOffIcon } from '@lucide/svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    label: string;
    kind?: 'hidden';
    info?: Snippet;
    error?: string;
  } & HTMLInputAttributes;

  let { label, error, kind, info, type = 'text', ...rest }: Props = $props();

  let id = '' + makeId();

  let hidden = $state(true);
</script>

<div class="flex flex-col gap-1">
  <label for={id}>{label}</label>
  <div class="relative">
    <input
      class={[
        'w-full min-w-0 rounded-md border border-input bg-input/20 transition-[color,box-shadow] dark:bg-input/30',
        'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'py-1.5 pl-3',
        kind === 'hidden' ? 'pr-8' : 'pr-3',
      ]}
      {id}
      {...rest}
      type={kind === 'hidden' && hidden ? 'password' : type}
    />
    {#if kind === 'hidden'}
      <span class="absolute top-0 right-0 bottom-0 inline-flex items-center justify-center">
        <button
          type="button"
          onclick={() => {
            hidden = !hidden;
          }}
          class="inline-flex size-8 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
        >
          {#if hidden}
            <EyeIcon size={16} />
          {:else}
            <EyeOffIcon size={16} />
          {/if}
        </button>
      </span>
    {/if}
  </div>
  {#if info}
    <span class="text-sm text-muted-foreground">{@render info()}</span>
  {/if}
  {#if error}
    <span class="text-sm text-red-400">{error}</span>
  {/if}
</div>
