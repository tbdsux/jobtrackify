import { env } from '$env/dynamic/private';
import type { Account, Session, User, Verification } from 'better-auth';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export type Database = {
	user: User;
	session: Session;
	account: Account;
	vefification: Verification;
};

const dialect = new PostgresDialect({
	pool: new Pool({
		database: env.POSTGRES_DB,
		host: env.POSTGRES_HOST,
		port: parseInt(env.POSTGRES_PORT || '5432', 10),
		user: env.POSTGRES_USER,
		password: env.POSTGRES_PASSWORD
	})
});

export const db = new Kysely<Database>({
	dialect
});
