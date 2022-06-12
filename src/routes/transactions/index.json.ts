import { PrismaClient, Prisma } from '@prisma/client';
import moment from "moment";

const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }): Promise<{ body: any, status: number }> {
	const month = url.searchParams.get('month');
	let filter = url.searchParams.get('labels');
	//const terms = filter.map(term => term.toLowerCase());
	if (filter != null) {
		//filter = filter.split(',').map(x => '%' + x.toLowerCase() + '%');
		filter = filter.split(',').map(x => x.toLowerCase());
		filter = '%(' + filter.join('|') + ')%';
	}

	let tags = ["%bill%", "%gas%", "%grocery%", "%food%", "%people%"];

	let transactions;
	if (month == null && filter == null) {
		transactions = await prisma.$queryRaw`select * from transactions order by day desc limit 100`;
	}

	if (month == null && filter != null) {

		if (filter == '%(misc)%') {
			transactions = await prisma.$queryRaw`select * from transactions where description not like all(${tags}) order by day desc limit 100`;
		} else if (filter.includes('misc')) {
			transactions = await prisma.$queryRaw`select * from transactions where description similar to ${filter} or description not like all(${tags}) order by day desc limit 100`;
		} else {
			transactions = await prisma.$queryRaw`select * from transactions where description similar to ${filter} order by day desc limit 100`;
		}
	}

	if (month != null && filter == null) {
		transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} order by day desc`;
	}

	console.log(month);

	if (month != null && filter != null) {
		if (filter == '%(misc)%') {
			transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} and description not like all (${tags}) order by day desc`;
		} else if (filter.includes('misc')) {
			transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} and (description similar to ${filter} or description not like all (${tags})) order by day desc`;
		} else {
			transactions = await prisma.$queryRaw`select * from transactions where to_char(day, 'YYYY-MM') = ${month} and description similar to ${filter} order by day desc`;
		}
	}

	// read all stored months as yyyy-mm
	let months_array = await prisma.$queryRaw`select ARRAY(select distinct(to_char(day, 'YYYY-MM')) as month from transactions order by month)`;
	let months = months_array[0].array;

	let bills = await get_monthly_amount(months, tags[0]);
	let gas = await get_monthly_amount(months, tags[1]);
	let grocery = await get_monthly_amount(months, tags[2]);
	let food = await get_monthly_amount(months, tags[3]);
	let people = await get_monthly_amount(months, tags[4]);
	let misc = await get_monthly_amounts_not_int_tag(months, tags);

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
	let results: { month: string, sum: string }[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description like ${tag} group by m.month`;

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

async function get_monthly_amounts_not_int_tag(months: string[], tags: string[]): Promise<number[]> {
	let results: { month: string, sum: string }[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description not like all(${tags}) group by m.month`;

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
