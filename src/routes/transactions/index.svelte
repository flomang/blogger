<script context="module" lang="ts">
	import { InlineCalendar } from "svelte-calendar";
	import dayjs from "dayjs";

	export const prerender = true;

	const theme = {
		calendar: {
			width: "300px",
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
	import Textfield from "@smui/textfield";
	import Icon from "@smui/textfield/icon";
	import HelperText from "@smui/textfield/helper-text";
	let date = "";
	let amount = "";
	let title = "";
	let description = "";

	let store;
	$: if ($store?.selected) {
		date = dayjs($store?.selected).format("MM/DD/YYYY");
	}
</script>

<svelte:head>
	<title>Transactions</title>
</svelte:head>

<section>
	<InlineCalendar bind:store {theme} />

	<div class="grid">
		<div class="date">
			<Textfield disabled bind:value={date} label="Date">
				<Icon class="material-icons" slot="leadingIcon">event</Icon>
			</Textfield>
		</div>
		<div class="input">
			<Textfield bind:value={amount} label="Amount">
				<Icon class="material-icons" slot="leadingIcon">paid</Icon>
			</Textfield>
			<Textfield bind:value={title} label="Title">
				<Icon class="material-icons" slot="leadingIcon">label</Icon>
			</Textfield>
			<Textfield bind:value={description} label="Description">
				<Icon class="material-icons" slot="leadingIcon">article</Icon>
			</Textfield>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: left;
		align-items: left;
		flex: 1;
	}

	.grid {
		background: #333;
		display: grid;
		grid-template-columns: auto auto auto 1fr auto auto auto;
		text-align: left;
		align-items: left;
		width: 300px;
	}
</style>
