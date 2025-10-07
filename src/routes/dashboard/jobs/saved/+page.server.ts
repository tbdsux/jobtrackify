import { auth } from '$lib/auth';
import { db } from '$lib/kysely';
import { fail } from '@sveltejs/kit';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { removeSaveJobSchema, saveJobSchema, updateSaveJobSchema } from './savejob-schema';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	const savedJobs = await db
		.selectFrom('saved_job')
		.selectAll()
		.where('user_id', '=', user.id)
		.orderBy('createdAt', 'desc')
		.execute();

	const addItemForm = await superValidate(zod4(saveJobSchema));
	const updateFormItems = await Promise.all(
		savedJobs.map(async (item) => {
			const formData = {
				id: item.id,
				companyName: item.companyName,
				position: item.position,
				jobLink: item.jobLink ?? undefined,
				location: item.location ?? undefined,
				jobType: item.jobType as
					| 'full-time'
					| 'part-time'
					| 'contract'
					| 'internship'
					| 'freelance'
					| 'temporary'
					| 'other',
				salary: item.salary ?? undefined
			};
			return [item.id, await superValidate(formData, zod4(updateSaveJobSchema))];
		})
	);
	const removeFormItems = await Promise.all(
		savedJobs.map(async (item) => {
			const formData = {
				id: item.id
			};
			return [item.id, await superValidate(formData, zod4(removeSaveJobSchema))];
		})
	);

	return {
		addItemForm,
		updateItemForms: Object.fromEntries(updateFormItems) as Record<
			number,
			SuperValidated<Infer<typeof updateSaveJobSchema>>
		>,
		removeItemForms: Object.fromEntries(removeFormItems) as Record<
			number,
			SuperValidated<Infer<typeof removeSaveJobSchema>>
		>,
		savedJobs
	};
};

export const actions: Actions = {
	addItem: async (event) => {
		const form = await superValidate(event, zod4(saveJobSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) {
			return fail(401, {
				form,
				error: 'You must be logged in to apply for a job.'
			});
		}

		// Save the job details to the database
		const res = await db
			.insertInto('saved_job')
			.values({
				user_id: session.user.id,
				companyName: form.data.companyName,
				jobLink: form.data.jobLink || '',
				position: form.data.position,
				location: form.data.location,
				jobType: form.data.jobType,
				salary: form.data.salary || ''
			})
			.returning(['id'])
			.executeTakeFirst();
		if (!res) {
			return fail(500, {
				form,
				error: 'Failed to save job. Please try again later.'
			});
		}

		return {
			form
		};
	},
	updateItem: async (event) => {
		const form = await superValidate(event, zod4(updateSaveJobSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) {
			return fail(401, {
				form,
				error: 'You must be logged in to update a saved job.'
			});
		}

		const res = await db
			.updateTable('saved_job')
			.set({
				companyName: form.data.companyName,
				jobLink: form.data.jobLink || '',
				position: form.data.position,
				location: form.data.location,
				jobType: form.data.jobType,
				salary: form.data.salary || '',
				updatedAt: new Date()
			})
			.where('id', '=', form.data.id)
			.where('user_id', '=', session.user.id)
			.executeTakeFirst();
		if (!res) {
			return fail(500, {
				form,
				error: 'Failed to update saved job. Please try again later.'
			});
		}

		return {
			form
		};
	},
	removeItem: async (event) => {
		const form = await superValidate(event, zod4(removeSaveJobSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) {
			return fail(401, {
				form,
				error: 'You must be logged in to remove a saved job.'
			});
		}

		const res = await db
			.deleteFrom('saved_job')
			.where('id', '=', form.data.id)
			.where('user_id', '=', session.user.id)
			.executeTakeFirst();
		if (!res) {
			return fail(500, {
				form,
				error: 'Failed to remove saved job. Please try again later.'
			});
		}

		return {
			form
		};
	}
};
