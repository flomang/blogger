import { api } from './_api';
import type { RequestHandler } from '@sveltejs/kit';
import type { Locals } from '$lib/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /transactions/:id.json
// export const patch: RequestHandler<Locals> = async (event) => {
// 	const data = await event.request.formData();

// 	console.log("todo patch");
// 	return api(event, `transactions/${event.locals.id}/${event.params.id}`, {
// 	// 	text: data.has('text') ? data.get('text') : undefined,
// 	// 	done: data.has('done') ? !!data.get('done') : undefined,
// 	});
// };

// DELETE /transactions/:id.json
// export const del: RequestHandler<Locals> = async (event) => {

// 	console.log("todo del");
// 	return api(event, `transactions/${event.locals.id}/${event.params.id}`);
// };

/** @type {import('./__types/items').RequestHandler} */
export async function del({ request }) {
	let id = request.url.match(/(\d+).json/)[0];

	let res = await prisma.transaction.delete({
		where: {
			id: parseInt(id.split('.')[0])
		}
	});

	return {
		body: res,
		status: 200,
	}
}
