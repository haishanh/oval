<script lang="ts">
  import { browser } from '#imports';
  import PopupMain from '$lib/components/popup/PopupMain.svelte';
  import { MessageType } from '@/utils/message';
</script>

<PopupMain
  onclickoptions={() => browser.runtime.openOptionsPage()}
  onclicksummarize={() => {
    browser.runtime.sendMessage({ type: MessageType.Summarize }).then(() => {
      setTimeout(() => {
        window.close();
      });
    });
  }}
/>
