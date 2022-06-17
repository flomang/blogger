<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";

	// see https://kit.svelte.dev/docs#loading
	export const load: Load = async ({ fetch }) => {
		const res = await fetch("/transactions.json");

		if (res.ok) {
			const response = await res.json();

			//const transactions = response.transactions;
			//const bills = response.bills;
			//const gas = response.gas;
			//const misc = response.misc;

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
	import { enhance } from "$lib/form";
	import dayjs from "dayjs";
	import Button, { Label } from "@smui/button";
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";
	import Dialog from "./Dialog.svelte";

	let myChart;
	let open = false;

	export let transactions = [];
	export let months = [];
	export let bills = [];
	export let gas = [];
	export let grocery = [];
	export let food = [];
	export let people = [];
	export let misc = [];

	// const months = [
	// 	"January",
	// 	"February",
	// 	"March",
	// 	"April",
	// 	"May",
	// 	"June",
	// 	"July",
	// 	"August",
	// 	"September",
	// 	"October",
	// 	"November",
	// 	"December",
	// ];


	// chart footer sum
	const footer = (tooltipItems) => {
		let sum = 0;

		tooltipItems.forEach(function (tooltipItem) {
			sum += tooltipItem.parsed.y;
		});
		return "Total: " + sum;
	};

	const getTransactions = async (params: {}) => {
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

	const clickChartHandler = async (evt) => { 
	//async function clickChartHandler(evt) {
		const points = myChart.getElementsAtEventForMode(
			evt,
			"nearest",
			{ intersect: true },
			true
		);

		if (points.length) {
			const firstPoint = points[0];
			const selectedMonth = myChart.data.labels[firstPoint.index];

			// clicked amount
			// const value =
			// 	myChart.data.datasets[firstPoint.datasetIndex].data[
			// 		firstPoint.index
			// 	];

			const datasets = myChart.data.datasets.filter((ds, i) =>
				myChart.isDatasetVisible(i) ? ds : undefined
			);
			const selectedFilters = datasets.map((data) => data.label);
			await getTransactions({ month: selectedMonth, filter: selectedFilters });
			//console.log(labels);
		}
	}

	const blurAll = () => {
		var tmp = document.createElement("input");
		document.body.appendChild(tmp);
		tmp.focus();
		document.body.removeChild(tmp);
	}

	const patch = async(res: Response, form: HTMLFormElement) => {
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

	onMount(async () => {
		const ctx: any = document.getElementById("myChart");
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
				onClick: clickChartHandler,
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
</script>

<svelte:head>
	<title>Transactions</title>
</svelte:head>

<div class="content">
	<canvas class="chart" id="myChart" width="1000" height="1000" />
	<div class="transactions">
		<div>
			<h1>Transactions</h1>
			<Dialog bind:transactions bind:open>
				<Button on:click={() => (open = true)}>
					<Label>Add Transaction</Label>
				</Button>
			</Dialog>
		</div>

		<div class="transactions-scrollable">
			{#each transactions as transaction (transaction.id)}
				<div class="transaction-entry">
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
		display: flex;
		flex-flow: row wrap;
		gap: 12px;
	}

	.chart {
		padding-top: 103px;
		max-width: 60%;
		max-height: 80vh;
	}

	.transactions {
		flex: 1; 
		max-height: 80vh;
		overflow: hidden;
	}

	.transactions-scrollable {
		overflow-y: auto;
		height: 100%;
	}

	.transaction-entry {
		display: flex;
		align-items: center;
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

	form.date,
	input.date {
		max-width: 90px;
	}

	form.description {
		display: flex;
		align-items: center;
	}

	input.description {
		flex-grow: 1;
	}

	form.text {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
	}

	form.amount,
	input.amount {
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
