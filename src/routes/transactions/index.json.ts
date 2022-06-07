import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('./__types/items').RequestHandler} */
export async function get() {
	const body = await (await prisma.transaction.findMany({
		orderBy: [
			{
				day: 'desc',
			},
		]
	}));
	const status = 200;

	return {
		body,
		status
	};
}

// POST /transactions.json
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {

	const data = await request.json();
	let now = new Date();
	let response = await prisma.transaction.create({
		data: {
			profile_id: 1,
			day: new Date(data.date),
			amount: data.amount,
			title: data.title,
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
		status: 500,
	}
};
