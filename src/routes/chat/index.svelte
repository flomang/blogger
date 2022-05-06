<script>
  import Tabs from "./_components/Tabs.svelte";
  import { user } from "../../stores";
</script>

<style>
  .content {
    display: flex;
  }

  .channel-content {
    width: 100%;
  }
</style>


<div class="content">
  <div class="channel-content">
    <Tabs user={$user} />
  </div>
</div>
