<script lang="ts">
	import Header from "$lib/header/Header.svelte";
	import "../app.css";

	let dark = false;
</script>

<svelte:head>
	{#if dark}
		<!-- SMUI Styles -->
		<link
			rel="stylesheet"
			href="/smui.css"
			media="(prefers-color-scheme: light)"
		/>
		<link
			rel="stylesheet"
			href="/smui-dark.css"
			media="screen and (prefers-color-scheme: dark)"
		/>
	{:else}
		<link
			rel="stylesheet"
			href="/smui.css"
		/>
	{/if}
</svelte:head>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>© 2022 Foolish Inc.</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		min-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
