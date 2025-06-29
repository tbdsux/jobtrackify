import { z } from 'zod';

export const saveJobSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	jobLink: z.string().url('Invalid URL format'),
	position: z.string().min(1, 'Position is required'),
	location: z.string().min(1, 'Location is required'),
	jobType: z.enum(
		['full-time', 'part-time', 'contract', 'internship', 'freelance', 'temporary', 'other'],
		{
			message: 'Job type is required'
		}
	),
	salary: z.string().min(1, 'Salary is required').optional()
});

export type SaveJobSchema = z.infer<typeof saveJobSchema>;

export const updateSaveJobSchema = saveJobSchema.extend({
	id: z.coerce.number()
});

export type UpdateSaveJobSchema = z.infer<typeof updateSaveJobSchema>;

export const removeSaveJobSchema = z.object({
	id: z.coerce.number()
});

export type RemoveSaveJobSchema = z.infer<typeof removeSaveJobSchema>;
