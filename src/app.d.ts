// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from 'better-auth';
import type { User } from 'kysely-codegen';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: Session;
			user?: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
