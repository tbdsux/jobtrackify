/* eslint-disable @typescript-eslint/no-explicit-any */

import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('resume_upload')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('user_id', 'varchar', (col) => col.references('user.id').onDelete('cascade'))
		.addColumn('file_name', 'varchar', (col) => col.notNull())
		.addColumn('file_key', 'varchar', (col) => col.notNull())
		.addColumn('file_size', 'integer', (col) => col.notNull())
		.addColumn('uploaded_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('resume_upload').execute();
}
