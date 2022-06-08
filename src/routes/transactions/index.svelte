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
			const transactions = await res.json();

			return {
				props: { transactions },
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

	onMount(async () => {
		// document.getElementById("date").addEventListener("keydown", keydown);
		// document
		// 	.getElementById("description")
		// 	.addEventListener("keydown", keydown);
		// document.getElementById("amount").addEventListener("keydown", keydown);
	});

	let open = false;
	let date = "";
	let amount = "";
	let title = "";
	let description = "";

	export let transactions = [];

	let store;
	$: if ($store?.selected) {
		date = dayjs($store?.selected).format("MM/DD/YYYY");
	}

	function keydown(e) {
		if (e.keyCode === 13) {
			e.target.blur();
		}
	}

	async function patch(res: Response, form: HTMLFormElement) {
		const txn = await res.json();

		transactions = transactions.map((t) => {
			if (t.id === txn.id) return txn;
			return t;
		});
	}

	async function handleSubmit() {
		// TODO implement remember me
		let body = JSON.stringify({
			date: date,
			amount: parseFloat(amount) * 100,
			title: title,
			description: description,
		});

		try {
			const res = await fetch("/transactions.json", {
				method: "POST",
				body: body,
			});

			if (res.ok) {
				let created = await res.json();
				let inserted = false;
				for (var i = 0, len = transactions.length; i < len; i++) {
					if (created.day > transactions[i].day) {
						transactions.splice(i, 0, created);
						inserted = true;
						break;
					}
				}

				if (!inserted) {
					transactions = [...transactions, created];
				} else {
					transactions = [...transactions];
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
</script>

<svelte:head>
	<title>Transactions</title>
</svelte:head>

<div class="transactions">
	<h1>Transactions</h1>
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
				<InlineCalendar bind:store {theme} />

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
					<Textfield bind:value={title} label="Title">
						<Icon class="material-icons" slot="leadingIcon"
							>label</Icon
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
			<Button on:click={() => {}}>
				<Label>Cancel</Label>
			</Button>
			<Button on:click={() => handleSubmit()}>
				<Label>Submit</Label>
			</Button>
		</Actions>
	</Dialog>

	<Button on:click={() => (open = true)}>
		<Label>Add Transaction</Label>
	</Button>

	{#each transactions as transaction (transaction.id)}
		<div class="todo">
			<!-- date -->
			<form
				class="text"
				action="/transactions/{transaction.id}.json?_method=patch"
				method="post"
				use:enhance={{
					result: patch,
				}}
			>
				<input
					aria-label="Edit date"
					type="text"
					name="date"
					id="date"
					value={dayjs(transaction.day).format("MM/DD/YYYY")}
				/>
			</form>

			<!-- description -->
			<form
				class="text"
				action="/transactions/{transaction.id}.json?_method=patch"
				method="post"
				use:enhance={{
					result: patch,
				}}
			>
				<input
					aria-label="Edit date"
					type="text"
					name="description"
					id="description"
					value={transaction.description}
				/>
			</form>

			<!-- amount -->
			<form
				class="text"
				action="/transactions/{transaction.id}.json?_method=patch"
				method="post"
				use:enhance={{
					result: patch,
				}}
			>
				<input
					type="text"
					name="amount"
					id="amount"
					value={(transaction.amount / 100).toFixed(2)}
				/>
			</form>

			<!-- delete -->
			<form
				action="/transactions/{transaction.id}.json?_method=delete"
				method="post"
				use:enhance={{
					result: () => {
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

<style>
	.grid {
		background: #333;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr auto;
		text-align: left;
		align-items: left;
		width: 600px;
	}

	.todo {
		display: grid;
		grid-template-columns: 90px 1fr auto 2rem;
		grid-gap: 0.5rem;
		align-items: center;
		padding: 0.5rem;
		background-color: white;
		border-radius: 8px;
		filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
		transform: translate(-1px, -1px);
		transition: filter 0.2s, transform 0.2s;
	}

	#amount {
		text-align: right;
	}

	.transactions {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
		line-height: 1;
	}

	input {
		border: 1px solid transparent;
	}

	input:focus-visible {
		box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.1);
		border: 1px solid #ff3e00 !important;
		outline: none;
	}

	.todo button {
		width: 2em;
		height: 2em;
		border: none;
		background-color: transparent;
		background-position: 50% 50%;
		background-repeat: no-repeat;
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
