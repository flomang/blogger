import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalize_amounts(months: string[], amounts: { month: string, sum: string }[]): number[] {
	let normalized = [];
	months.forEach(function (month) {
		let foo = amounts.find(element => element.month == month)
		if (foo == undefined) {
			normalized.push(0);
		} else {
			normalized.push((parseInt(foo.sum) / 100).toFixed(2));
		}

	});

	return normalized;
}

async function get_monthly_sums(months: string[], description: string): Promise<number[]> {
	const results: { month: string, sum: string }[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description like ${description} group by m.month`;

	return normalize_amounts(months, results);
}

async function get_monthly_sums_not(months: string[], terms: string[]): Promise<number[]> {
	const results: { month: string, sum: string }[] = await prisma.$queryRaw`
	with months as (
		select distinct(to_char(day, 'YYYY-MM')) as month from transactions
	)
	select m.month, sum(amount) from months m left join transactions t on to_char(t.day, 'YYYY-MM') = m.month where description not like all(${terms}) group by m.month`;

	return normalize_amounts(months, results);
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ url }): Promise<{ body: any, status: number }> {
	// TODO implement profile ID in queries
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
	const months_array = await prisma.$queryRaw`select ARRAY(select distinct(to_char(day, 'YYYY-MM')) as month from transactions order by month)`;
	const months = months_array[0].array;

	const bills = await get_monthly_sums(months, terms[0]);
	const gas = await get_monthly_sums(months, terms[1]);
	const grocery = await get_monthly_sums(months, terms[2]);
	const food = await get_monthly_sums(months, terms[3]);
	const people = await get_monthly_sums(months, terms[4]);
	const misc = await get_monthly_sums_not(months, terms);

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


// request is standard request object: https://developer.mozilla.org/en-US/docs/Web/API/Request
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }): Promise<{ body: any, status: number }> {

	// TODO how to make body params more obvious?
	const data = await request.json();
	const now = new Date();

	const response = await prisma.transaction.create({
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
