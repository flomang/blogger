<script context="module" lang="ts">
	import { enhance } from "$lib/form";
	import type { Load } from "@sveltejs/kit";
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

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch("/transactions.json");

		if (res.ok) {
			const response = await res.json();
			//const transactions = response.transactions;
			//const bills = response.bills;

			return {
				props: response,
			};
		}

		const { message } = await res.json();

		return {
			error: new Error(message),
		};
	};
</script>

<script lang="ts">
	import Textfield from "@smui/textfield";
	import Icon from "@smui/textfield/icon";
	import Dialog, { Title, Content, Actions } from "@smui/dialog";
	import Button, { Label } from "@smui/button";
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import { BitmapFontLoader } from "pixi.js";

	let open = false;
	let date = "";
	let amount = "";
	let description = "";
	let today = new Date();
	today.setHours(0);

	export let transactions = [];
	export let months = [];
	export let bills = [];
	export let gas = [];
	export let grocery = [];
	export let food = [];
	export let people = [];
	export let misc = [];

	let store;
	let ctx;

	const month = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	//let current_month = month[today.getMonth()];
	//console.log(current_month);

	function formatMoney(value: number): string {
		return (value / 100).toFixed(2);
	}

	const footer = (tooltipItems) => {
		let sum = 0;

		tooltipItems.forEach(function (tooltipItem) {
			sum += tooltipItem.parsed.y;
		});
		return "Total: " + sum;
	};

	let myChart;
	let selectedMonth;

	async function getTransactions(params: {}) {
		const url =
			"/transactions.json?" + new URLSearchParams(params).toString();
		console.log(url);
		const res = await fetch(url);

		if (res.ok) {
			const response = await res.json();
			transactions = response.transactions;
			//const transactions = response.transactions;
			//const bills = response.bills;

			//return {
			//	props: response,
			//};
		} else {
			const { message } = await res.json();
			console.log(message);
		}
	}

	async function clickHandler(evt) {
		const points = myChart.getElementsAtEventForMode(
			evt,
			"nearest",
			{ intersect: true },
			true
		);

		if (points.length) {
			const firstPoint = points[0];
			const label = myChart.data.labels[firstPoint.index];
			selectedMonth = label;

			// clicked amount
			const value =
				myChart.data.datasets[firstPoint.datasetIndex].data[
					firstPoint.index
				];

			const datasets = myChart.data.datasets.filter((ds, i) =>
				myChart.isDatasetVisible(i) ? ds : undefined
			);
			const labels = datasets.map((data) => data.label);
			await getTransactions({ month: selectedMonth, labels: labels });
			console.log(labels);
		}
	}

	onMount(async () => {
		ctx = document.getElementById("myChart");
		myChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: months,
				datasets: [
					{
						label: "Bill",
						data: bills,
						backgroundColor: "rgba(255, 99, 132, 0.7)",
						borderColor: "rgba(255, 99, 132, 1)",
						borderWidth: 1,
					},
					{
						label: "Gas",
						data: gas,
						backgroundColor: "rgba(54, 162, 235, 0.6)",
						borderColor: "rgba(54, 162, 235, 1)",
						borderWidth: 1,
					},
					{
						label: "Grocery",
						data: grocery,
						backgroundColor: "rgba(54, 206, 86, 1.0)",
						borderColor: "rgba(54, 206, 86, 1.0)",
						borderWidth: 1,
					},
					{
						label: "Food",
						data: food,
						backgroundColor: "rgba(75, 192, 192, 0.5)",
						borderColor: "rgba(75, 192, 192, 1.0)",
						borderWidth: 1,
					},
					{
						label: "People",
						data: people,
						backgroundColor: "rgba(153, 102, 255, 0.2)",
						borderColor: "rgba(153, 102, 255, 1.0)",
						borderWidth: 1,
					},
					{
						label: "Misc",
						data: misc,
						backgroundColor: "rgba(255, 159, 64, 0.3)",
						borderColor: "rgba(255, 159, 64, 0.3)",
						borderWidth: 1,
					},
				],
			},
			options: {
				onClick: clickHandler,
				interaction: {
					intersect: true,
					mode: "index",
				},
				plugins: {
					tooltip: {
						callbacks: {
							footer: footer,
						},
					},
				},
				scales: {
					x: {
						stacked: true,
					},
					y: {
						beginAtZero: true,
						stacked: true,
					},
				},
			},
		});
	});

	$: if ($store?.selected) {
		date = dayjs($store?.selected).format("MM/DD/YYYY");
	}

	function blurAll() {
		var tmp = document.createElement("input");
		document.body.appendChild(tmp);
		tmp.focus();
		document.body.removeChild(tmp);
	}

	async function patch(res: Response, form: HTMLFormElement) {
		const txn = await res.json();

		transactions = transactions.map((t) => {
			if (t.id === txn.id) return txn;
			return t;
		});
		transactions.sort((a, b) => {
			return a.day > b.day ? -1 : 1;
		});

		blurAll();
	}

	async function handleSubmit() {
		let body = JSON.stringify({
			date: date,
			amount: parseFloat(amount) * 100,
			description: description,
		});

		try {
			const res = await fetch("/transactions.json", {
				method: "POST",
				body: body,
			});

			if (res.ok) {
				let created = await res.json();
				transactions = [...transactions, created];
				transactions.sort((a, b) => {
					return a.day > b.day ? -1 : 1;
				});

				//if (created.description.includes("fun")) {
				//	fun += created.amount;
				//	console.log(fun);
				//}
			}
		} catch (err) {
			console.log(err);
		}
		description = "";
		amount = "";
	}
</script>

<svelte:head>
	<title>Transactions</title>
</svelte:head>

<div class="content">
	<Dialog
		bind:open
		aria-labelledby="simple-title"
		aria-describedby="simple-content"
		surface$style="width: 650px; max-width: calc(100vw - 32px);"
	>
		<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
		<Title id="simple-title">Add Transaction</Title>
		<Content id="simple-content">
			<div>
				<InlineCalendar bind:store {theme} selected={today} />

				<div class="grid">
					<Textfield disabled bind:value={date} label="Date">
						<Icon class="material-icons" slot="leadingIcon"
							>event</Icon
						>
					</Textfield>
					<Textfield bind:value={amount} label="Amount">
						<Icon class="material-icons" slot="leadingIcon"
							>paid</Icon
						>
					</Textfield>
					<Textfield bind:value={description} label="Description">
						<Icon class="material-icons" slot="leadingIcon"
							>article</Icon
						>
					</Textfield>
				</div>
			</div>
		</Content>
		<Actions>
			<Button
				on:click={() => {
					amount = "";
					description = "";
				}}
			>
				<Label>Cancel</Label>
			</Button>
			<Button on:click={() => handleSubmit()}>
				<Label>Submit</Label>
			</Button>
		</Actions>
	</Dialog>

	<canvas class="chart" id="myChart" width="1000" height="1000" />
	<div class="transactions">
		<h1>Transactions</h1>
		<Button on:click={() => (open = true)}>
			<Label>Add Transaction</Label>
		</Button>

		<div class="transactions-scrollable">
			{#each transactions as transaction (transaction.id)}
				<div class="transactions-grid">
					<!-- date -->
					<form
						class="text date"
						action="/transactions/{transaction.id}.json?_method=patch"
						method="post"
						use:enhance={{
							result: patch,
						}}
					>
						<input
							type="text"
							name="date"
							class="date"
							value={dayjs(transaction.day).format("MM/DD/YYYY")}
						/>
					</form>

					<!-- description -->
					<form
						class="text description"
						action="/transactions/{transaction.id}.json?_method=patch"
						method="post"
						use:enhance={{
							result: patch,
						}}
					>
						<input
							type="text"
							name="description"
							class="description"
							value={transaction.description}
						/>
					</form>

					<!-- amount -->
					<form
						class="text amount"
						action="/transactions/{transaction.id}.json?_method=patch"
						method="post"
						use:enhance={{
							result: patch,
						}}
					>
						<input
							type="text"
							name="amount"
							class="amount"
							value={(transaction.amount / 100).toFixed(2)}
						/>
					</form>

					<!-- delete -->
					<form
						action="/transactions/{transaction.id}.json?_method=delete"
						method="post"
						use:enhance={{
							result: () => {
								// remove deleted from transactions
								transactions = transactions.filter(
									(t) => t.id !== transaction.id
								);
							},
						}}
					>
						<button class="delete" aria-label="Delete todo" />
					</form>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.content {
		width: 100%;
		max-height: 80vh;
		display: flex;
		flex-direction: row;
		gap: 6px;
	}

	.chart {
		flex-grow: 4; /* default 0 */
		max-width: 60%;
		max-height: 100%;
	}

	.transactions {
		flex-grow: 1; /* default 0 */
		width: 30%;
		max-height: 100%;
		min-width: 420px;
	}

	.transactions-scrollable {
		position: relative;
		overflow-y: auto;
		height: 80%;
	}

	.transactions-grid {
		display: flex;
		align-items: center;
		/* grid-template-columns: 90px 1fr auto 2rem; */
		/* grid-gap: 0.5rem; */
		gap: 0.5rem;
		margin: 0 0 0.5rem 0;
		padding: 0.5rem;
		background-color: white;
		border-radius: 8px;
		filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
		transform: translate(-1px, -1px);
		transition: filter 0.2s, transform 0.2s;
	}

	.transactions button {
		width: 2em;
		height: 2em;
		border: none;
		background-color: transparent;
		background-position: 50% 50%;
		background-repeat: no-repeat;
	}

	.grid {
		background: #333;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		text-align: left;
		align-items: left;
		width: 600px;
	}

	form.date, input.date{
		max-width: 90px;
	}

	form.description {
		display: flex;
		align-items: center;
	}

	input.description {
		flex-grow: 3;
	}

	form.text {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
	}

	form.amount, input.amount {
		text-align: right;
		max-width: 69px;
	}

	input {
		border: 1px solid transparent;
	}

	input:focus-visible {
		box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.1);
		border: 1px solid #ff3e00 !important;
		outline: none;
	}

	.delete {
		background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.5 5V22H19.5V5H4.5Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cpath d='M10 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 10V16.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M2 5H22' stroke='%23676778' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M8 5L9.6445 2H14.3885L16 5H8Z' fill='%23676778' stroke='%23676778' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
		opacity: 0.2;
	}

	.delete:hover,
	.delete:focus {
		transition: opacity 0.2s;
		opacity: 1;
	}
</style>
