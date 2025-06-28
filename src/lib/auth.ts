import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { db } from './kysely';

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
	plugins: [admin()],
	trustedOrigins: [...env.BETTER_AUTH_TRUSTED_ORIGINS!.split(',')]
});
