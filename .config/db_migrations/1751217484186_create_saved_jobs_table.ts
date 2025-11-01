/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('saved_job')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('user_id', 'varchar', (col) => col.references('user.id').onDelete('cascade'))
		.addColumn('position', 'varchar', (col) => col.notNull())
		.addColumn('companyName', 'varchar', (col) => col.notNull())
		.addColumn('jobLink', 'varchar', (col) => col.notNull())
		.addColumn('location', 'varchar', (col) => col.notNull())
		.addColumn('salary', 'varchar', (col) => col.defaultTo('0'))
		.addColumn('jobType', 'varchar', (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('saved_job').execute();
}
