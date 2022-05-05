<script context="module">
  // https://sapper.svelte.dev/docs/#this_redirect
  export async function preload(page, session) {
    console.log("preload" + session);
    const { user } = session;


    if (!user) {
      return this.redirect(302, "signin");
    }

    return { user };
  }
</script>

<script>
  import Tabs from "./_components/Tabs.svelte";
  import { session } from "../../stores/stores";
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
    <Tabs />
  </div>
</div>
