<script context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;

	const theme = {
		calendar: {
			width: '700px',
			shadow: '0px 0px 30px rgba(0.0, 0.0, 0.0, .3)'
		}
	};
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="content">
	<img src="ouija.png" alt="fool.png"/>
	<img src="planchette.png" alt="fool.png"/>
</div>

<style>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
	
</style>
