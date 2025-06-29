import { z } from 'zod';

export const jobTypes: Record<string, string> = {
	'full-time': 'Full Time',
	'part-time': 'Part Time',
	contract: 'Contract',
	internship: 'Internship',
	freelance: 'Freelance',
	temporary: 'Temporary',
	other: 'Other'
};

export const jobApplicationStatuses: Record<string, string> = {
	applied: 'Applied',
	interview: 'Interview',
	offer: 'Offer',
	rejected: 'Rejected',
	applicantRejected: 'Applicant Rejected',
	accepted: 'Accepted'
};

export const interviewTypes: Record<string, string> = {
	'video-call': 'Video Call',
	'phone-call': 'Phone Call',
	'face-to-face': 'Face to face',
	others: 'Others'
};

export const jobApplicationSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	position: z.string().min(1, 'Position is required'),
	jobLink: z.string().url('Invalid URL format').optional(),
	jobType: z
		.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance', 'temporary', 'other'])
		.optional(),
	status: z.enum(['applied', 'interview', 'offer', 'rejected', 'accepted', 'applicantRejected']),
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
