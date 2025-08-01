import { applicationStatuses, jobTypes } from '$lib/modules/job-application';
import { z } from 'zod';

export const jobApplicationSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	position: z.string().min(1, 'Position is required'),
	jobLink: z.string().url('Invalid URL format').optional(),
	jobType: z.enum(Object.keys(jobTypes) as [string, ...string[]]).optional(),
	status: z.enum(Object.keys(applicationStatuses) as [string, ...string[]]).optional(),
	applicationDate: z.string().refine((v) => v, { message: 'Application date is required.' }),
	notes: z.string().optional(),
	salary: z.string().min(1, 'Salary is required').optional(),
	location: z.string().optional()
});

export type JobApplicationSchema = z.infer<typeof jobApplicationSchema>;

export const updateJobApplicationSchema = jobApplicationSchema.extend({
	id: z.coerce.number(),
	interviewDate: z
		.string()
		.refine((v) => v, { message: 'Interview date is required.' })
		.optional(),
	interviewType: z.string().optional(),
	followupDate: z
		.string()
		.refine((v) => v, { message: 'Follow-up date is required.' })
		.optional(),
	applicationDate: z
		.string()
		.refine((v) => v, { message: 'Application date is required.' })
		.optional()
});

export type UpdateJobApplicationSchema = z.infer<typeof updateJobApplicationSchema>;

export const removeJobApplicationSchema = z.object({
	id: z.coerce.number()
});

export type RemoveJobApplicationSchema = z.infer<typeof removeJobApplicationSchema>;
