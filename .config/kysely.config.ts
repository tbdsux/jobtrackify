/* eslint-disable @typescript-eslint/no-explicit-any */

import { Kysely, PostgresDialect } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';

const dialect = new PostgresDialect({
	pool: new Pool({
		database: process.env.POSTGRES_DB,
		host: process.env.POSTGRES_HOST,
		port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD
	})
});

const db = new Kysely<any>({
	dialect
});

export default defineConfig({
	// replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
	kysely: db,
	migrations: {
		migrationFolder: 'db_migrations'
	}
	//   plugins: [],
	//   seeds: {
	//     seedFolder: "seeds",
	//   }
});
