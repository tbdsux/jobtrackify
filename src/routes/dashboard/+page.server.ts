import { db } from '$lib/kysely';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { DashboardStats } from './stats';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();

	const jobApplicationsCount = await db
		.selectFrom('job_application')
		.select((eb) => [
			eb.fn.count('id').as('count'),
			eb.fn.count('id').filterWhere('status', '=', 'interview').as('interviewCount')
		])
		.where('user_id', '=', session.user.id)
		.executeTakeFirst();

	const savedJobsCount = await db
		.selectFrom('saved_job')
		.select((eb) => [eb.fn.count('id').as('count')])
		.where('user_id', '=', session.user.id)
		.executeTakeFirst();

	if (!savedJobsCount || !jobApplicationsCount) {
		error(500, { message: 'Failed to retrieve dashboard statistics' });
	}

	const stats: DashboardStats = {
		totalApplications: Number(jobApplicationsCount.count || 0),
		totalSavedJobs: Number(savedJobsCount.count || 0),
		totalInterviews: Number(jobApplicationsCount.interviewCount || 0)
	};

	return {
		session,
		stats
	};
};
