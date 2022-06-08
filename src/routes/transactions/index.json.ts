import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get(): Promise<{body: any, status: number}> {
	const body = await prisma.transaction.findMany({
		orderBy: [
			{
				day: 'desc',
			},
		]
	});

	const status = 200;

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
		body: "",
		status: 500,
	}
}
