import { env } from '$env/dynamic/private';
import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from 'kysely-codegen';
import { Pool } from 'pg';

const dialect = new PostgresDialect({
	pool: new Pool({
		database: env.POSTGRES_DB,
		host: env.POSTGRES_HOST,
		port: parseInt(env.POSTGRES_PORT || '5432', 10),
		user: env.POSTGRES_USER,
		password: env.POSTGRES_PASSWORD
	})
});

export const db = new Kysely<DB>({
	dialect
});
