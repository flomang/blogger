<script>
  import { onMount, onDestroy } from "svelte";
  import { Fountain } from "./fountain";
  import QRCode from "qrcode";

  let qrcode = document.getElementById("qrcode");

  // QRCode.toCanvas(qrcode, "sample text", function (error) {
  //   if (error) console.error(error);
  //   console.log("success!");
  // });

  // bind the canvas element i.e bind:this={canvas}
  let sketch;
  let canvas;
  onMount(() => {
    // must only load this on the client because pixijs is a client only library
    sketch = new Fountain({ canvas: canvas });

    QRCode.toCanvas(qrcode, "sample text", function (error) {
      if (error) console.error(error);
      console.log("success!");
    });
  });

  onDestroy(() => sketch.destroy());
</script>

<div class="content">
  <canvas bind:this={canvas} />
  <div id="qrcode"></div>
</div>

<style>
  canvas {
    width: 100%;
  }
</style>
