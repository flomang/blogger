<script>
  import Tabs from "./_components/Tabs.svelte";
  import { user } from "../../stores";
</script>

<style>
  .content {
    display: flex;
  }
</style>


<div class="content">
  <Tabs user={$user} />
</div>
