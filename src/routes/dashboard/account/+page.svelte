<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { PageProps } from './$types';
	import UpdateProfile from './update-profile.svelte';

	let { data }: PageProps = $props();
</script>

<DashboardHeader
	menu={{
		title: 'Job Applications',
		href: '/dashboard/jobs/saved'
	}}
/>

<PageContainer>
	<div>
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl font-black">My Account</CardTitle>
				<CardDescription>
					Manage your account settings, profile information, and preferences.
				</CardDescription>
			</CardHeader>

			<CardContent class="space-y-8">
				<Card class="flex flex-row items-center gap-0">
					<CardContent class="">
						<div class="flex items-center">
							<img
								src={data.session.user.image}
								alt={data.session.user.name}
								class="h-12 w-12 rounded-md"
							/>
						</div>
					</CardContent>
					<CardHeader class="w-full px-0">
						<CardTitle>
							{data.session.user.name}
						</CardTitle>
						<CardDescription>
							{data.session.user.email}
						</CardDescription>
					</CardHeader>
				</Card>

				<UpdateProfile form={data.form} />
			</CardContent>
		</Card>
	</div>
</PageContainer>
