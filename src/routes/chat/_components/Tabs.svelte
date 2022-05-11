<script>
  import Chat from "./Chat.svelte";
  import { onMount } from "svelte";
  import { Aquarium } from "./aquarium";

  export let user;
  // bind the canvas element i.e bind:this={canvas} 
  let sketch;
  let canvas;
  onMount(() => {
    // must only load this on the client because pixijs is a client only library
    sketch = new Aquarium({canvas: canvas});
  });
</script>

<div class="content">
  <div class="trollbox-header">
    <span class="trollbox-header-title"> trollbox </span>
  </div>
  <div class="trollbox">
    <canvas class="fish-tank" bind:this={canvas} />
    <div>
      <Chat {user} />
    </div>
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(0, 0, 0);
    position: relative;
  }

  .trollbox-header {
    width: 100%;
    font-weight: bold;
    line-height: 50px;
    background-color: rgba(165, 165, 205, 0.10);
  }

  .trollbox-header-title {
    margin-left: 1em;
    margin-right: 1em;
  }

  .fish-tank {
    width: 70%;
  }

  .trollbox {
    display: flex;
  }
</style>
