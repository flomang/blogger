import { PrismaClient, Prisma } from '@prisma/client';
import moment from "moment";

const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get( {request}): Promise<{body: any, status: number}> {
	const data = await request.params
	const transactions = await prisma.transaction.findMany({
		orderBy: [
			{
				day: 'desc',
			},
		]
	});

	let today = moment().startOf('month');
	let month = today.toDate();
	let next = today.add(1, 'month').toDate();
	console.log(month);
	console.log(next);

	let bills = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%bill%' and day >= ${month} and day < ${next}`;
	let gas = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%gas%' and day >= ${month} and day < ${next}`;
	let grocery = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%grocery%' and day >= ${month} and day < ${next}`;
	let food = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%food%' and day >= ${month} and day < ${next}`;
	let people = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%people%' and day >= ${month} and day < ${next}`;
	let fun = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%fun%' and day >= ${month} and day < ${next}`;

	bills = (parseInt(bills[0].sum) / 100).toFixed(2);
	gas = (parseInt(gas[0].sum) / 100).toFixed(2);
	grocery = (parseInt(grocery[0].sum) / 100).toFixed(2);
	food = (parseInt(food[0].sum) / 100).toFixed(2);
	people = (parseInt(food[0].sum) / 100).toFixed(2);
	fun = (parseInt(fun[0].sum) / 100).toFixed(2);

	const status = 200;
	const body = {
		transactions: transactions,
		bills: bills,
		gas: gas,
		grocery: grocery,
		food: food,
		people: people,
		fun: fun,
	}

	return {
		body,
		status
	};
}

// request is standard request object: https://developer.mozilla.org/en-US/docs/Web/API/Request
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }): Promise<{body: any, status: number}> {

	// TODO how to make body params more obvious?
	const data = await request.json();

	let now = new Date();
	let response = await prisma.transaction.create({
		data: {
			profile_id: 1,
			day: new Date(data.date),
			amount: data.amount,
			description: data.description,
			created_at: now,
			updated_at: now,
		}
	});

	if (response) {
		return {
			body: response,
			status: 200,
		}
	}

	return {
		body: "",
		status: 500,
	}
}
