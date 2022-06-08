import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del({ request }): Promise<{body: any, status: number}> {
	let id = request.url.match(/(\d+).json/)[0];
	id = parseInt(id.split('.')[0]);

	let res = await prisma.transaction.delete({
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
export async function patch({ request }): Promise<{body: any, status: number}> {

	// TODO how to make body params more obvious?
	let id = request.url.match(/(\d+).json/)[0];
	id = parseInt(id.split('.')[0]);

	const data = await request.formData();
	let date = data.has('date') ? new Date(data.get('date')) : undefined;
	let amount = data.has('amount') ? parseFloat(data.get('amount')) * 100 : undefined;
	let title = data.has('title') ? data.get('title') : undefined;
	let description = data.has('description') ? data.get('description') : undefined;


	let now = new Date();
	let body = await prisma.transaction.update({
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