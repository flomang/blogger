<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	onMount(async () => {
		goto("/transactions");
	});

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>