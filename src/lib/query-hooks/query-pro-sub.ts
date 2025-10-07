import { authClient } from '$lib/auth-client';
import { createQuery } from '@tanstack/svelte-query';

export const useQueryProSub = () => {
	return createQuery(() => ({
		queryKey: ['user-pro-sub'],
		queryFn: async (): Promise<
			| {
					success: false;
					error: string;
			  }
			| {
					success: true;
					data: {
						hasPro: boolean;
						referenceId?: string;
						subscriptionId?: string;
						periodStart?: Date;
						periodEnd?: Date;
					};
			  }
		> => {
			const { data, error } = await authClient.subscription.list();
			if (error) {
				return {
					success: false,
					error: error.message ?? 'Failed to get subscriptions'
				};
			}

			const hasPro = data.find((sub) => sub.plan === 'pro' && sub.status === 'active');

			return {
				success: true,
				data: {
					hasPro: Boolean(hasPro),
					referenceId: hasPro?.referenceId,
					subscriptionId: hasPro?.id,
					periodEnd: new Date(hasPro?.periodEnd || ''),
					periodStart: new Date(hasPro?.periodStart || '')
				}
			};
		}
	}));
};
