<script>
  import { onMount, onDestroy } from "svelte";
  import { PixiSpace } from "./pixi-space";

  // bind the canvas element i.e bind:this={canvas} 
  let sketch;
  let canvas;
  onMount(() => {
    // must only load this on the client because pixijs is a client only library
    sketch = new PixiSpace({canvas: canvas});
  });

  onDestroy(() => sketch.destroy());
</script>

<style>
  canvas {
    width: 100%;
  }
</style>

<div class="content">
  <canvas bind:this={canvas} />
</div>
