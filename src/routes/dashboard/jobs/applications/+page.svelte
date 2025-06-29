<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { ExternalLinkIcon } from '@lucide/svelte';
	import type { Selectable } from 'kysely';
	import type { JobApplication } from 'kysely-codegen';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import {
		jobApplicationSchema,
		jobApplicationStatuses,
		jobTypes,
		removeJobApplicationSchema,
		updateJobApplicationSchema
	} from './apply-schema';
	import NewJobApply from './new-job-apply.svelte';
	import RemoveJobApply from './remove-job-apply.svelte';
	import UpdateJobApply from './update-job-apply.svelte';

	let {
		data
	}: {
		data: {
			addItemForm: SuperValidated<Infer<typeof jobApplicationSchema>>;
			updateItemForms: Record<number, SuperValidated<Infer<typeof updateJobApplicationSchema>>>;
			removeItemForms: Record<number, SuperValidated<Infer<typeof removeJobApplicationSchema>>>;
			jobApplications: Selectable<JobApplication>[];
		};
	} = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
</script>

<svelte:head>
	<title>Job Applications | JobTrackify</title>
</svelte:head>

<DashboardHeader
	menu={{
		title: 'Job Applications',
		href: '/dashboard/jobs/applications'
	}}
/>

<PageContainer>
	<div>
		<Card>
			<CardHeader>
				<CardTitle class="text-3xl font-black">My Job Applications</CardTitle>
				<CardDescription class="text-lg">
					Manage your job applications, track their status, and view details.
				</CardDescription>
			</CardHeader>

			<CardContent class="space-y-8">
				<div class="flex items-center justify-between">
					<NewJobApply data={{ form: data.addItemForm }} />
				</div>

				<div class="grid grid-cols-1 gap-4">
					{#each data.jobApplications as item (item.id)}
						<Card
							class="group relative transition-all duration-200 ease-in-out hover:border-neutral-500"
						>
							<CardHeader class="pt-8 sm:pt-0">
								<CardTitle class="text-xl">{item.position}</CardTitle>
								<CardDescription class="text-base">
									{item.companyName} - <Badge class="text-sm font-medium uppercase">
										{jobApplicationStatuses[item.status]}
									</Badge>{' '}<Badge variant="outline" class="text-sm font-medium uppercase">
										{jobTypes[item.jobType]}
									</Badge>
								</CardDescription>
							</CardHeader>

							<div class="absolute top-2 right-2 inline-flex items-center space-x-2">
								<UpdateJobApply {item} form={data.updateItemForms[item.id]} />
								<RemoveJobApply {item} form={data.removeItemForms[item.id]} />
							</div>

							<CardContent class="space-y-4">
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
									<div class="space-y-2">
										<Label class="text-muted-foreground">Salary</Label>
										<code class="bg-secondary rounded px-3 py-2 text-sm">
											{item.salary ? item.salary : 'Not specified'}
										</code>
									</div>

									<div class="space-y-2">
										<Label class="text-muted-foreground">Location</Label>
										<p
											class="bg-secondary text-muted-foreground inline-flex rounded px-3 py-2 text-sm"
										>
											{item.location ? item.location : 'Not specified'}
										</p>
									</div>
								</div>

								<div class="space-y-2">
									<Label class="text-muted-foreground">Job Link</Label>
									<p
										class="bg-secondary text-muted-foreground flex space-x-2 rounded px-3 py-2 text-sm"
									>
										{#if item.jobLink}
											<a
												href={item.jobLink}
												class="flex w-full items-center justify-between space-x-2 hover:text-white"
												target="_blank"
												rel="noopener noreferrer"
											>
												<span class="max-w-[90%] truncate">
													{item.jobLink}
												</span>
												<ExternalLinkIcon class="size-4" />
											</a>
										{:else}
											<span class="max-w-full"> Not specified </span>
										{/if}
									</p>
								</div>

								<div class="space-y-2">
									<Label class="text-muted-foreground text-xs">Notes</Label>
									<p class="text-muted-foreground bg-secondary rounded-lg px-3 py-2 text-sm">
										{item.notes ? item.notes : 'No notes provided.'}
									</p>
								</div>
							</CardContent>

							<CardFooter class="w-full">
								<div
									class="text-muted-foreground flex w-full flex-col items-start justify-between space-y-4 sm:flex-row sm:space-y-0"
								>
									<p class="text-muted-foreground text-sm">
										Applied on <strong>
											{item.applicationDate
												? df.format(
														parseDate(
															new Date(String(item.applicationDate)).toISOString().split('T')[0]
														)?.toDate(getLocalTimeZone())
													)
												: 'N/A'}
										</strong>
									</p>

									<div class="flex flex-col items-end justify-end">
										<small>
											Added Date: {new Date(String(item.createdAt)).toLocaleString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</small>
										<small>
											Updated Date: {new Date(String(item.updatedAt)).toLocaleString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</small>
									</div>
								</div>
							</CardFooter>
						</Card>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>
</PageContainer>
