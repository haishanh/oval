<script lang="ts">
  import { screenshot, title } from './state.svelte';
  import Stage from '$lib/components/Stage.svelte';

  type Props = {
    handleClose?: () => void;
  };

  let { handleClose }: Props = $props();
</script>

{#if screenshot.b64ImgSrc}
  <Stage imgSrc={screenshot.b64ImgSrc} title={title.title} onClickClose={handleClose} />
{/if}
