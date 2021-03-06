import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del({ request }): Promise<{ body: any, status: number }> {
	let id = request.url.match(/(\d+).json/)[0];
	id = parseInt(id.split('.')[0]);

	const res = await prisma.transaction.delete({
		where: {
			id
		}
	});

	return {
		body: res,
		status: 200,
	}
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function patch({ request }): Promise<{ body: any, status: number }> {

	// TODO how to make body params more obvious?
	let id = request.url.match(/(\d+).json/)[0];
	id = parseInt(id.split('.')[0]);

	const data = await request.formData();
	const date = data.has('date') ? new Date(data.get('date')) : undefined;
	const amount = data.has('amount') ? Math.floor(parseFloat(data.get('amount')) * 100) : undefined;
	const description = data.has('description') ? data.get('description') : undefined;

	const now = new Date();
	const body = await prisma.transaction.update({
		data: {
			day: date,
			amount: amount,
			description: description,
			updated_at: now,
		},
		where: {
			id
		}
	});


	return {
		body: body,
		status: 200,
	}
}