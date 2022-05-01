<script>
  import Chat from "./Chat.svelte";
  // TODO session user
  export let user;
</script>

<style>
  .trollbox {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
    height: 700px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(0, 0, 0);
    position: relative;
  }

  .trollbox-header {
    font-weight: bold;
    height: 50px;
    line-height: 50px;
  }

  .trollbox-header-title {
    margin-left: 1em;
    margin-right: 1em;
  }

</style>

<div class="trollbox">
  <div class="trollbox-header">
    <span
      class="trollbox-header-title">
      trollbox 
    </span>
  </div>
  <div>
    <Chat {user} />
  </div>
</div>
