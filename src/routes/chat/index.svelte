<script>
  import Tabs from "./_components/Tabs.svelte";
  import { user } from "../../stores";
</script>

<style>
  .content {
    display: flex;
  }
</style>


<svelte:head>
  <title>fish</title>
</svelte:head>

<div class="content">
  <Tabs user={$user} />
</div>
