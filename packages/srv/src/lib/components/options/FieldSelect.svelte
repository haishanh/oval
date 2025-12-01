<script lang="ts">
  import { makeId } from '$lib/shared/common.util';
  import type { Snippet } from 'svelte';
  import Select, { type SelectProps } from './Select.svelte';

  let id = '' + makeId();

  let {
    info,
    label,
    ...props
  }: Omit<SelectProps, 'id'> & {
    label: string;
    info?: Snippet;
  } = $props();
</script>

<div class="flex flex-col gap-1">
  <label for={id}>{label}</label>
  <Select placeholder="Based on browser settings" {id} {...props} />
  {#if info}
    <span class="text-sm text-muted-foreground">{@render info()}</span>
  {/if}
</div>
