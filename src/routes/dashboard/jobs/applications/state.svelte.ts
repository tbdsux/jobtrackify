import type { ApplicationStatus } from '$lib/modules/job-application';

export type JobApplicationSort = 'latestUpdate' | 'appliedFirst';

export const jobApplicationsFilterState = $state<{
	sort: JobApplicationSort;
	filter: ApplicationStatus[];
}>({
	sort: 'latestUpdate',
	filter: []
});
