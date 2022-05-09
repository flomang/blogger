<script>
  import { onMount, onDestroy } from "svelte";
  import { Fountain } from "./fountain";

  // bind the canvas element i.e bind:this={canvas}
  let sketch;
  let canvas;
  onMount(() => {
    // must only load this on the client because pixijs is a client only library
    sketch = new Fountain({ canvas: canvas });
  });

  onDestroy(() => sketch.destroy());
</script>

<div class="content">
  <canvas bind:this={canvas} />
</div>

<style>
  canvas {
    width: 100%;
  }
</style>
