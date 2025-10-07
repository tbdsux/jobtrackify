import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableEmailButton from './data-table-email-button.svelte';

export type UserColumn = {
	id: string;
	name: string;
	email: string;
	role: string;
	subscription: string | null;
	created_at: string;
};

export const userColumns: ColumnDef<UserColumn>[] = [
	{
		id: 'ID',
		accessorKey: 'id',
		header: 'ID'
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'email',
		header: ({ column }) =>
			renderComponent(DataTableEmailButton, {
				onclick: column.getToggleSortingHandler()
			})
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => {
			const snippet = createRawSnippet<[{ role: string }]>((getRole) => {
				const { role } = getRole();

				return {
					render: () =>
						`<span class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent">${role}</span>`
				};
			});

			return renderSnippet(snippet, {
				role: row.original.role ?? 'user'
			});
		}
	},
	{
		accessorKey: 'subscription',
		header: 'Subscription',
		cell: ({ row }) => {
			const snippet = createRawSnippet<[{ subscription: string }]>((getSub) => {
				const { subscription } = getSub();

				if (subscription === 'Pro') {
					return {
						render: () =>
							`<span class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent">${subscription}</span>`
					};
				}

				return {
					render: () =>
						`<span class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground">${subscription}</span>`
				};
			});

			return renderSnippet(snippet, {
				subscription: row.original.subscription ?? 'Free'
			});
		}
	},
	{
		id: 'Created At',
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({ getValue }) =>
			new Date(getValue<string>()).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.id });
		}
	}
];
