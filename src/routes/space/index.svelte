<script context="module">
  // https://sapper.svelte.dev/docs/#this_redirect
	export async function preload(page, session) {
		const { user } = session;

		if (!user) {
			return this.redirect(302, 'signin');
		}

		return;
	}
</script>

<script>
  import { onMount } from "svelte";

  let pixiComponent;
  //  pixi.js is a client side library. We only load this onMount
  // i.e. when the client browser loads this page 
  onMount(async () => {
    const module = await import ('./_components/space.svelte');
	  pixiComponent = module.default;
  });
</script>

<svelte:component this={pixiComponent}/>
