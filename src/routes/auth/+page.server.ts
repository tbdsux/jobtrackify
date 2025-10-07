import { auth } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema, registerSchema } from './auth-schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		// user is already logged in, redirect to dashboard
		throw redirect(303, '/dashboard');
	}

	return {
		loginForm: await superValidate(zod4(loginSchema)),
		registerForm: await superValidate(zod4(registerSchema))
	};
};

export const actions: Actions = {
	register: async (event) => {
		const form = await superValidate(event, zod4(registerSchema));
		if (!form.valid) {
			return fail(400, {
				registerForm: form
			});
		}

		const { fullname, email, password } = form.data;

		try {
			await auth.api.signUpEmail({
				body: {
					name: fullname,
					email,
					password
				},
				headers: event.request.headers
			});
		} catch (err) {
			if (err instanceof APIError) {
				return setError(form, 'email', 'Failed to register user.');
			}

			return fail(500, {
				registerForm: form
			});
		}

		return message(form, 'Registration successful!');
	},

	login: async (event) => {
		const form = await superValidate(event, zod4(loginSchema));
		if (!form.valid) {
			return fail(400, {
				loginForm: form
			});
		}

		const { email, password } = form.data;
		try {
			await auth.api.signInEmail({
				body: {
					email,
					password
				}
			});

			return message(form, 'Registration successful');
		} catch (err) {
			console.error(err);
			if (err instanceof APIError) {
				return setError(form, 'email', 'Invalid email or password');
			}

			return fail(500, {
				loginForm: form
			});
		}
	}
};
