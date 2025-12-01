<script lang="ts">
  import PopupMain from '$lib/components/popup/PopupMain.svelte';
  const log = () => {
    console.log('log');
  };
</script>

<PopupMain onclicksummarize={log} />
