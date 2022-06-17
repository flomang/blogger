import { PrismaClient, Prisma } from '@prisma/client';
import moment from "moment";

const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }): Promise<{ body: any, status: number }> {
	const terms = ["%bill%", "%gas%", "%grocery%", "%food%", "%people%"];
	const month = url.searchParams.get('month');
	let filter = url.searchParams.get('filter');

	if (filter != null) {
		filter = filter.split(',').map(x => x.toLowerCase());
		filter = '%(' + filter.join('|') + ')%';
	}

	let transactions;
	if (month == null) {
		if (filter == null) {
			transactions = await prisma.$queryRaw`select * from transactions order by day desc limit 100`;
		} else {
			if (filter == '%(misc)%') {
				transactions = await prisma.$queryRaw`select * from transactions where description not like all(${terms}) order by day desc limit 100`;
			} else if (filter.includes('misc')) {
				transactions = await prisma.$queryRaw`select * from transactions where description similar to ${filter} or description not like all(${terms}) order by day desc limit 100`;
			} else {
				transactions = await prisma.$queryRaw`select * from transactions where description similar to ${filter} order by day desc limit 100`;
			}
		}
	} else {
		if (filter == null) {
			transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} order by day desc`;
		} else {
			if (filter == '%(misc)%') {
				transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} and description not like all (${terms}) order by day desc`;
			} else if (filter.includes('misc')) {
				transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} and (description similar to ${filter} or description not like all (${terms})) order by day desc`;
			} else {
				transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} and description similar to ${filter} order by day desc`;
			}
		}
	}


	// read all stored months as yyyy-mm
	let months_array = await prisma.$queryRaw`select ARRAY(select distinct(to_char(day, 'YYYY-MM')) as month from transactions order by month)`;
	let months = months_array[0].array;

	let bills = await get_monthly_sums(months, terms[0]);
	let gas = await get_monthly_sums(months, terms[1]);
	let grocery = await get_monthly_sums(months, terms[2]);
	let food = await get_monthly_sums(months, terms[3]);
	let people = await get_monthly_sums(months, terms[4]);
	let misc = await get_monthly_sums_not(months, terms);

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

async function get_monthly_sums(months: string[], description: string): Promise<number[]> {
	let results: { month: string, sum: string }[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description like ${description} group by m.month`;

	let amounts = [];
	months.forEach(function (month) {
		let foo = results.find(element => element.month == month)
		if (foo == undefined) {
			amounts.push(0);
		} else {
			amounts.push((parseInt(foo.sum) / 100).toFixed(2));
		}

	});

	return amounts;
}

async function get_monthly_sums_not(months: string[], terms: string[]): Promise<number[]> {
	let results: { month: string, sum: string }[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description not like all(${terms}) group by m.month`;

	let amounts = [];
	months.forEach(function (month) {
		let foo = results.find(element => element.month == month)
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
