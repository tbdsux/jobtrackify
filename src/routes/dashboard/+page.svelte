<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Dashboard | JobTrackify</title>
</svelte:head>

<DashboardHeader
	menu={{
		title: 'Dashboard',
		href: '/dashboard'
	}}
/>

<PageContainer>
	<div class="space-y-6">
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl">
					Welcome, <strong>{data.session.user.name}</strong>!
				</CardTitle>
				<CardDescription class="text-lg">
					Here’s a quick overview of your job search progress.
				</CardDescription>
			</CardHeader>
		</Card>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
			<Card>
				<CardHeader>
					<CardTitle class="text-4xl font-black">
						{data.stats.totalApplications}
					</CardTitle>
					<CardDescription class="text-lg">Total Applications</CardDescription>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="text-4xl font-black">
						{data.stats.totalSavedJobs}
					</CardTitle>
					<CardDescription class="text-lg">Total Saved Jobs</CardDescription>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle class="text-4xl font-black">
						{data.stats.totalInterviews}
					</CardTitle>
					<CardDescription class="text-lg">Total Interviews</CardDescription>
				</CardHeader>
			</Card>
		</div>
	</div>
</PageContainer>
