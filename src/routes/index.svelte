<script context="module" lang="ts">
	import { InlineCalendar } from "svelte-calendar";
	import dayjs from "dayjs";

	export const prerender = true;

	const theme = {
		calendar: {
			width: "600px",
			shadow: "0px 0px 30px rgba(0.0, 0.0, 0.0, .3)",
			colors: {
				background: {
					highlight: "#333",
				},
			},
		},
	};

</script>

<script lang="ts">
	import Counter from "$lib/Counter.svelte";
	let today = new Date();
	today.setHours(0);

	let store;
	let count = 0;

	function update_count() {
		let next = $store?.selected.getTime();
		let prev = today.getTime();

		let delta = Math.round((next - prev) / 86400000);
		count = delta;
	}
	function add_week() {
		store.add(1, "week");
		update_count()
	}
	function sub_week() {
		store.add(-1, "week");
		update_count()
	}
	function add_month() {
		store.add(1, "month");
		update_count()
	}
	function sub_month() {
		store.add(-1, "month");
		update_count()
	}
	function add_year() {
		store.add(1, "year");
		update_count()
	}
	function sub_year() {
		store.add(-1, "year");
		update_count()
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<InlineCalendar bind:store {theme} />

	<div class="grid">
		<button on:click={() => sub_year() }>-1y</button>
		<button on:click={() => sub_month() }>-1m</button>
		<button on:click={() => sub_week() }>-1w</button>
		<p class="date">
			{dayjs($store?.selected).format("MM/DD/YYYY")}
		</p>
		<button on:click={() => add_week() }>1w</button>
		<button on:click={() => add_month() }>+1m</button>
		<button on:click={() => add_year() }>+1y</button>
	</div>

	<Counter bind:count bind:store/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.grid {
		background: #333;
		color: #fff;
		display: grid;
		grid-template-columns: auto auto auto 1fr auto auto auto;
		text-align: center;
		align-items: center;
		width: 600px;
	}

	.date {
		color: #fff;
		font-size: 1.3em;
	}

	button {
		background: #5829d6;
		padding: 23px 20px;
		color: #fff;
		font-size: 1.3em;
		border-radius: 1px;
		border: 0;
		box-shadow: 4px 3px 9px rgb(0 0 0 / 20%);
		cursor: pointer;
	}
</style>
