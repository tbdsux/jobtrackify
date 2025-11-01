import { z } from 'zod';

export const maxResumeFileSize = 15 * 1024 * 1024; // 15MB

export const uploadResumeSchema = z.object({
	files: z.array(z.file().max(maxResumeFileSize).mime(['application/pdf'])) // only pdf files for now
});

export type UploadResumeSchema = z.infer<typeof uploadResumeSchema>;
