import { auth } from '$lib/auth';
import { db } from '$lib/kysely';
import type { User } from 'kysely-codegen';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const { users, total } = await auth.api.listUsers({
		headers: request.headers,
		query: {
			limit: 1000
		}
	});

	const mapUserSubs = await Promise.all(
		(users as User[]).map(async (user) => {
			const subscriptions = await db
				.selectFrom('subscription')
				.where('stripeCustomerId', '=', user.stripeCustomerId)
				.selectAll()
				.execute();

			return {
				...user,
				hasPro: subscriptions.some((i) => i.status === 'active' && i.plan === 'pro')
			};
		})
	);

	return {
		users: mapUserSubs,
		total
	};
};
