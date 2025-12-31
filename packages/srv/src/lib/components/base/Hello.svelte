<script lang="ts">
  /**
   * this component is only used for testing symlink based lib sharing
   */

  type Props = {
    name: string;
  };
  let { name }: Props = $props();
</script>

<h1>Hello {name}!</h1>
