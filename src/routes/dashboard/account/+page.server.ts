import { auth } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { updateProfileSchema } from './profile-schema';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const formData = {
		name: user.name
	};

	const form = await superValidate(formData, zod4(updateProfileSchema));

	return {
		user,
		form
	};
};

export const actions: Actions = {
	updateProfile: async (event) => {
		const form = await superValidate(event, zod4(updateProfileSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) {
			return fail(401, {
				form,
				error: 'Your must be logged in to update your profile.'
			});
		}

		// Update the user profile name
		const res = await auth.api.updateUser({
			headers: event.request.headers,
			body: {
				name: form.data.name
			}
		});
		if (res.status !== true) {
			return fail(500, {
				form,
				error: 'Failed to update profile. Please try again later.'
			});
		}

		return {
			form
		};
	}
};
