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
	import { ExternalLinkIcon } from '@lucide/svelte';
	import type { Selectable } from 'kysely';
	import type { SavedJob } from 'kysely-codegen';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { jobTypes } from '../applications/apply-schema';
	import NewSaveJob from './new-save-job.svelte';
	import RemoveSaveJob from './remove-save-job.svelte';
	import type { removeSaveJobSchema, saveJobSchema, updateSaveJobSchema } from './savejob-schema';
	import UpdateSaveJob from './update-save-job.svelte';

	let {
		data
	}: {
		data: {
			addItemForm: SuperValidated<Infer<typeof saveJobSchema>>;
			updateItemForms: Record<number, SuperValidated<Infer<typeof updateSaveJobSchema>>>;
			removeItemForms: Record<number, SuperValidated<Infer<typeof removeSaveJobSchema>>>;
			savedJobs: Selectable<SavedJob>[];
		};
	} = $props();
</script>

<svelte:head>
	<title>Job Applications | JobTrackify</title>
</svelte:head>

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
				<CardTitle class="text-3xl font-black">My Saved Jobs</CardTitle>
				<CardDescription class="text-lg">
					Here you can view and manage the jobs you have saved for later review.
				</CardDescription>
			</CardHeader>

			<CardContent class="space-y-8">
				<div>
					<NewSaveJob data={{ form: data.addItemForm }} />
				</div>

				<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
					{#each data.savedJobs as item (item.id)}
						<Card
							class="group relative transition-all duration-200 ease-in-out hover:border-neutral-500"
						>
							<CardHeader>
								<CardTitle class="text-xl">
									{item.position}
								</CardTitle>
								<CardDescription class="text-base">
									{item.companyName} - <Badge class="text-sm font-medium uppercase">
										{jobTypes[item.jobType]}
									</Badge>
								</CardDescription>
							</CardHeader>

							<div class="absolute top-2 right-2 inline-flex items-center space-x-2">
								<UpdateSaveJob {item} form={data.updateItemForms[item.id]} />
								<RemoveSaveJob {item} form={data.removeItemForms[item.id]} />
							</div>

							<CardContent class="space-y-6">
								<div class="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-0">
									<div class="space-y-2">
										<Label class="text-muted-foreground">Salary</Label>
										<code class="bg-secondary text-muted-foreground rounded px-3 py-2 text-sm">
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
							</CardContent>

							<CardFooter class="w-full">
								<div
									class="text-muted-foreground flex w-full flex-col items-start justify-between space-y-4 sm:flex-row sm:space-y-0"
								>
									<div></div>

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
