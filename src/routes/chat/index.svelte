<script context="module">
  // https://sapper.svelte.dev/docs/#this_redirect
  export async function preload(page, session) {
    const { user } = session;

    //if (!user) {
    //  return this.redirect(302, "signin");
    //}

    return { user };
  }
</script>

<script>
  import Tabs from "./_components/Tabs.svelte";
  //import Hls from "hls.js";
  import { onMount } from "svelte";

  onMount(async () => {
    //var video = document.getElementById("video");
    //if (Hls.isSupported()) {
    //  var hls = new Hls();
    //  hls.loadSource("http://localhost:8080/media/1/stream/");
    //  hls.attachMedia(video);
    //  hls.on(Hls.Events.MANIFEST_PARSED, function() {
    //    video.play();
    //  });
    //} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    //  video.src = "http://localhost:8080/media/1/stream/";
    //  video.addEventListener("loadedmetadata", function() {
    //    video.play();
    //  });
    //}
  });

  export let user;

  let time = 0;
  let duration;
  let paused = true;

  let showControls = true;
  let showControlsTimeout;

  function handleMousemove(e) {
    // Make the controls visible, but fade out after
    // 2.5 seconds of inactivity
    clearTimeout(showControlsTimeout);
    showControlsTimeout = setTimeout(() => (showControls = false), 2500);
    showControls = true;

    if (!(e.buttons & 1)) return; // mouse not down
    if (!duration) return; // video not loaded yet

    const { left, right } = this.getBoundingClientRect();
    time = (duration * (e.clientX - left)) / (right - left);
  }

  function handleMousedown(e) {
    // we can't rely on the built-in click event, because it fires
    // after a drag — we have to listen for clicks ourselves

    function handleMouseup() {
      if (paused) e.target.play();
      else e.target.pause();
      cancel();
    }

    function cancel() {
      e.target.removeEventListener("mouseup", handleMouseup);
    }

    e.target.addEventListener("mouseup", handleMouseup);

    setTimeout(cancel, 200);
  }

  function format(seconds) {
    if (isNaN(seconds)) return "...";

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) seconds = "0" + seconds;

    return `${minutes}:${seconds}`;
  }
</script>

<style>
  .content {
    display: flex;
  }

  .video-stream {
    position: relative;
  }

  .controls {
    position: absolute;
    top: 0;
    width: 100%;
    transition: opacity 1s;
  }

  .info {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .controls .info span {
    padding: 0.2em 0.5em;
    color: white;
    text-shadow: 0 0 8px black;
    font-size: 1.4em;
    opacity: 0.7;
  }

  .time {
    width: 3em;
  }

  .time:last-child {
    text-align: right;
  }

  progress {
    display: block;
    width: 100%;
    height: 10px;
    -webkit-appearance: none;
    appearance: none;
  }

  progress::-webkit-progress-bar {
    background-color: rgba(0, 0, 0, 0.2);
  }

  progress::-webkit-progress-value {
    background-color: rgba(255, 255, 255, 0.6);
  }

  .channel-content {
    width: 100%;
  }
</style>


<div class="content">
  <div class="channel-content">
    <Tabs {user} />
  </div>
</div>
