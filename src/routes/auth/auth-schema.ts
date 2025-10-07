import z from 'zod';

export const loginSchema = z.object({
	email: z.email({ error: 'Invalid email address' }),
	password: z.string().min(6, 'Password must be at least 6 characters long')
});

export type LoginSchema = typeof loginSchema;

export const registerSchema = z
	.object({
		fullname: z.string().min(2, 'Full name must be at least 2 characters long'),
		email: z.email({ error: 'Invalid email address' }),
		password: z.string().min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type RegisterSchema = typeof registerSchema;
