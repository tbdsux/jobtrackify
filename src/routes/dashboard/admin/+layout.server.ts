import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'admin') {
		return redirect(303, '/dashboard');
	}
};
