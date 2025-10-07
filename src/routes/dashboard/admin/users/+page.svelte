<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import { CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import Card from '$lib/components/ui/card/card.svelte';
	import { userColumns } from './columns';
	import DataTable from './data-table.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Admin - Users | JobTrackify</title>
</svelte:head>

<DashboardHeader
	menu={{
		title: 'Admin - Users',
		href: '/dashboard/admin/users'
	}}
/>

<PageContainer>
	<div>
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl font-black">Admin - Users</CardTitle>
				<CardDescription>
					Manage users, view user details, and perform administrative actions.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<DataTable
					data={data.users.map((item) => ({
						id: item.id,
						name: item.name,
						email: item.email,
						role: item.role ?? 'user',
						subscription: item.hasPro ? 'Pro' : 'Free',
						created_at: new Date(item.createdAt.toString()).toISOString()
					}))}
					columns={userColumns}
				/>
			</CardContent>
		</Card>
	</div>
</PageContainer>
