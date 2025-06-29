import { auth } from '$lib/auth';
import { db } from '$lib/kysely';
import { fail } from '@sveltejs/kit';
import { superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import {
	jobApplicationSchema,
	removeJobApplicationSchema,
	updateJobApplicationSchema
} from './apply-schema';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	const jobApplications = await db
		.selectFrom('job_application')
		.selectAll()
		.where('user_id', '=', session.user.id)
		.orderBy('updatedAt', 'desc')
		.execute();

	const updateItemForms = await Promise.all(
		jobApplications.map(async (item) => {
			const formData = {
				id: item.id,
				companyName: item.companyName,
				position: item.position,
				status: item.status as
					| 'applied'
					| 'interview'
					| 'offer'
					| 'rejected'
					| 'accepted'
					| 'applicantRejected',
				jobLink: item.jobLink ?? undefined,
				applicationDate: item.applicationDate
					? typeof item.applicationDate === 'string'
						? item.applicationDate
						: item.applicationDate.toISOString().split('T')[0]
					: undefined,
				notes: item.notes ?? undefined,
				salary: item.salary ?? undefined,
				location: item.location ?? undefined,
				followupDate: item.followupDate
					? typeof item.followupDate === 'string'
						? item.followupDate
						: item.followupDate.toISOString().split('T')[0]
					: undefined,
				interviewDate: item.interviewDate
					? typeof item.interviewDate === 'string'
						? item.interviewDate
						: item.interviewDate.toISOString().split('T')[0]
					: undefined,
				interviewType: item.interviewType ?? undefined
			};
			return [item.id, await superValidate(formData, zod(updateJobApplicationSchema))];
		})
	);
	const removeItemForms = await Promise.all(
		jobApplications.map(async (item) => {
			return [item.id, await superValidate({ id: item.id }, zod(removeJobApplicationSchema))];
		})
	);

	return {
		addItemForm: await superValidate(zod(jobApplicationSchema)),
		updateItemForms: Object.fromEntries(updateItemForms) as Record<
			number,
			SuperValidated<Infer<typeof updateJobApplicationSchema>>
		>,
		removeItemForms: Object.fromEntries(removeItemForms) as Record<
			number,
			SuperValidated<Infer<typeof removeJobApplicationSchema>>
		>,
		jobApplications
	};
};

export const actions: Actions = {
	addItem: async (event) => {
		const addItemForm = await superValidate(event, zod(jobApplicationSchema));
		if (!addItemForm.valid) {
			return fail(400, {
				addItemForm
			});
		}

		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) {
			return fail(401, {
				addItemForm,
				error: 'You must be logged in to apply for a job.'
			});
		}

		// Save the job application to the database
		const res = await db
			.insertInto('job_application')
			.values({
				user_id: session.user.id,
				companyName: addItemForm.data.companyName,
				position: addItemForm.data.position,
				jobLink: addItemForm.data.jobLink || '',
				status: addItemForm.data.status,
				applicationDate: addItemForm.data.applicationDate,
				followupDate: null,
				interviewDate: null,
				interviewType: '',
				notes: addItemForm.data.notes || '',
				salary: addItemForm.data.salary || '',
				location: addItemForm.data.location || ''
			})
			.returning(['id'])
			.executeTakeFirst();
		if (!res) {
			return fail(500, {
				addItemForm,
				error: 'Failed to save job application. Please try again later.'
			});
		}

		return {
			addItemForm
		};
	},
	updateItem: async (event) => {
		const updateItemForm = await superValidate(event, zod(updateJobApplicationSchema), {
			id: 'updateJobItem'
		});
		if (!updateItemForm.valid) {
			return fail(400, {
				form: updateItemForm
			});
		}

		// TODO ::> add check if item is owned by user?

		const { id, ...updatedData } = updateItemForm.data;
		const updates: Record<string, unknown> = {
			updatedAt: new Date().toISOString()
		};
		for (const [key, value] of Object.entries(updatedData)) {
			if (value !== undefined) {
				updates[key] = value;
			}
		}

		const session = await auth.api.getSession({ headers: event.request.headers });
		if (!session) {
			return fail(401, {
				form: updateItemForm,
				error: 'You must be logged in to apply for a job.'
			});
		}

		// Update
		const res = await db
			.updateTable('job_application')
			.set(updates)
			.where('id', '=', id)
			.where('user_id', '=', session.user.id)
			.executeTakeFirst();
		if (!res) {
			return fail(500, {
				form: updateItemForm,
				error: 'Failed to update job application. Please try again later.'
			});
		}

		return {
			form: updateItemForm
		};
	},
	removeItem: async (event) => {
		const form = await superValidate(event, zod(removeJobApplicationSchema));
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

		// Remove the job application from the database
		const res = await db
			.deleteFrom('job_application')
			.where('id', '=', form.data.id)
			.where('user_id', '=', session.user.id)
			.executeTakeFirst();
		if (!res) {
			return fail(500, {
				form,
				error: 'Failed to remove job application. Please try again later.'
			});
		}

		return {
			form
		};
	}
};
