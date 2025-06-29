/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('job_application')
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('user_id', 'varchar', (col) => col.references('user.id').onDelete('cascade'))
		.addColumn('companyName', 'varchar', (col) => col.notNull())
		.addColumn('position', 'varchar', (col) => col.notNull())
		.addColumn('jobLink', 'varchar', (col) => col.defaultTo(''))
		.addColumn('status', 'varchar', (col) => col.notNull())
		.addColumn('applicationDate', 'date', (col) => col.notNull())
		.addColumn('followupDate', 'date', (col) => col.defaultTo(null))
		.addColumn('interviewDate', 'date', (col) => col.defaultTo(null))
		.addColumn('interviewType', 'varchar', (col) => col.defaultTo(''))
		.addColumn('notes', 'text', (col) => col.defaultTo(''))
		.addColumn('salary', 'varchar', (col) => col.defaultTo('0'))
		.addColumn('location', 'varchar', (col) => col.defaultTo(''))
		.addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('job_application').execute();
}
