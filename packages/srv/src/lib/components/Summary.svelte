<script lang="ts">
  import BadLucidIcon from './BadLucidIcon.svelte';
  import Markdown from 'svelte-exmarkdown';
  type Props = {
    summary: {
      details?: {
        label: string;
        icon?: string;
        info: string;
      }[];
    };
  };
  let { summary }: Props = $props();
</script>

{#each summary.details as detail, idx (idx)}
  {#if idx === 0}
    <div class="my-4"><Markdown md={detail.info} /></div>
  {:else}
    <div class="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 py-3">
      <span
        class="inline-flex size-9 items-center justify-center place-self-center rounded-full bg-arc-blue"
      >
        {#if detail.icon}
          <BadLucidIcon name={detail.icon} size={20} />
        {/if}
      </span>
      <div class="text-lg font-bold">{detail.label}</div>
      <div class="col-start-2 py-1"><Markdown md={detail.info} /></div>
    </div>
  {/if}
{/each}
