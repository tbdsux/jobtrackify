import { env } from '$env/dynamic/private';
import { stripe } from '@better-auth/stripe';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import Stripe from 'stripe';
import { db } from './kysely';

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-08-27.basil'
});

export const auth = betterAuth({
	database: {
		db: db,
		type: 'postgres'
	},
	emailAndPassword: {
		enabled: false
	},
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET
		}
	},
	plugins: [
		stripe({
			stripeClient,
			stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET!,
			createCustomerOnSignUp: true,
			subscription: {
				enabled: true,
				plans: [
					{
						name: 'Pro',
						priceId: 'price_1SFGp82NURWKpvUYMBR5dGAU' // Test price id,
					}
				],
				onSubscriptionComplete: async ({ subscription, plan }) => {
					// Called when a subscription is successfully created
					// await sendWelcomeEmail(subscription.referenceId, plan.name);
					console.log(`Subscription ${subscription.id} for plan ${plan.name} completed`);
				},
				onSubscriptionUpdate: async ({ subscription }) => {
					// Called when a subscription is updated
					console.log(`Subscription ${subscription.id} updated`);
				},
				onSubscriptionCancel: async ({ subscription }) => {
					// Called when a subscription is canceled
					// await sendCancellationEmail(subscription.referenceId);
					console.log(`Subscription ${subscription.id} canceled`);
				},
				onSubscriptionDeleted: async ({ subscription }) => {
					// Called when a subscription is deleted
					console.log(`Subscription ${subscription.id} deleted`);
				}
			}
		}),
		admin()
	],
	trustedOrigins: [...env.BETTER_AUTH_TRUSTED_ORIGINS!.split(',')]
});
