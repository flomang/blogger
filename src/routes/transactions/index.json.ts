import { PrismaClient, Prisma } from '@prisma/client';
import moment from "moment";

const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ request }): Promise<{ body: any, status: number }> {
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

	//let bills = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%bill%' and day >= ${month} and day < ${next}`;
	//let gas = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%gas%' and day >= ${month} and day < ${next}`;
	//let grocery = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%grocery%' and day >= ${month} and day < ${next}`;
	//let food = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%food%' and day >= ${month} and day < ${next}`;
	//let people = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%people%' and day >= ${month} and day < ${next}`;
	//let fun = await prisma.$queryRaw`SELECT sum(amount) FROM transactions where description like '%fun%' and day >= ${month} and day < ${next}`;

	////bills = parseInt(bills[0].sum);
	//gas = parseInt(gas[0].sum);
	//grocery = parseInt(grocery[0].sum);
	//food = parseInt(food[0].sum);
	//people = parseInt(people[0].sum);
	//fun = parseInt(fun[0].sum);

	// read all stored months as yyyy-mm
	let months_array  = await prisma.$queryRaw`select ARRAY(select distinct(to_char(day, 'YYYY-MM')) from transactions)`;
	let months = months_array[0].array;
	
	let bills = await get_monthly_amount(months, "%bill%");
	let gas = await get_monthly_amount(months, "%gas%");
	let grocery = await get_monthly_amount(months, "%grocery%");
	let food = await get_monthly_amount(months, "%food%");
	let people = await get_monthly_amount(months, "%people%");
	let fun = await get_monthly_amount(months, "%fun%");
	let tags = ["%bill%", "%gas%", "%grocery%", "%food%", "%people%"];
	let misc = await get_monthly_amounts_not_int_tag(months, tags);
	console.log(misc);

	const status = 200;
	const body = {
		transactions,
		bills,
		gas,
		grocery,
		food,
		people,
		misc,
		months,
	}

	return {
		body,
		status
	};
}

async function get_monthly_amount(months: string[], tag: string): Promise<number[]> {
	let results: {month: string, sum: string}[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description like ${tag} group by m.month`;

	let amounts = [];
	months.forEach(function (month) {
		let foo = results.find( element => element.month == month)
		if (foo == undefined) {
			amounts.push(0);
		} else {
			amounts.push((parseInt(foo.sum) / 100).toFixed(2));
		}

	});

	return amounts;
}

async function get_monthly_amounts_not_int_tag(months: string[], tags: string[]): Promise<number[]> {
	let results: {month: string, sum: string}[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description not like all(${tags}) group by m.month`;

	let amounts = [];
	months.forEach(function (month) {
		let foo = results.find( element => element.month == month)
		if (foo == undefined) {
			amounts.push(0);
		} else {
			amounts.push((parseInt(foo.sum) / 100).toFixed(2));
		}

	});

	return amounts;
}

// request is standard request object: https://developer.mozilla.org/en-US/docs/Web/API/Request
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }): Promise<{ body: any, status: number }> {

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
