<script>
  import Chat from "./Chat.svelte";
  import { onMount, onDestroy } from "svelte";
  import { Tank } from "./tank";

  export let user;
  // bind the canvas element i.e bind:this={canvas} 
  let sketch;
  let canvas;
  onMount(() => {
    // must only load this on the client because pixijs is a client only library
    sketch = new Tank({canvas: canvas});
  });

  //onDestroy(() => sketch.destroy());
</script>

<div class="trollbox">
  <div class="trollbox-header">
    <span class="trollbox-header-title"> trollbox </span>
  </div>
  <div class="content">
    <canvas class="fish-tank" bind:this={canvas} />
    <div class="chat">
      <Chat {user} />
    </div>
  </div>
</div>

<style>
  .trollbox {
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
    height: 50px;
    line-height: 50px;
    background-color: rgba(165, 165, 205, 0.10);
  }

  .trollbox-header-title {
    margin-left: 1em;
    margin-right: 1em;
    border-color: rgb(0, 0, 0);
  }

  .fish-tank {
    width: 70%;
  }

  .chat {
    flex-grow: 1;
  }

  .content {
    display: flex;
    flex-direction: row;
  }
</style>
