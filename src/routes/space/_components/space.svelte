<script>
  import { onMount } from "svelte";
  import { PixiSpace } from "./pixi-space.js";

  // bind the canvas element i.e bind:this={canvas} 
  let canvas;
  onMount(() => {
    // must only load this on the client because pixijs is a client only library
    new PixiSpace({canvas: canvas});
  });
</script>

<style>
  canvas {
    width: 100%;
    margin: 0 auto;
  }
</style>

<div class="content" bp="padding">
  <canvas bind:this={canvas} />
</div>
