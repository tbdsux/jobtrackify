<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import { Button } from '$lib/components/ui/button/';
	import {
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import {
		displaySize,
		FileDropZone,
		type FileDropZoneProps
	} from '$lib/components/ui/file-drop-zone';
	import { LoaderCircleIcon, XIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { filesProxy, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { maxResumeFileSize, uploadResumeSchema } from './file-schema';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(uploadResumeSchema)
	});

	const { form: formData, enhance, message, submitting } = form;

	const files = filesProxy(form, 'files');

	const onUpload: FileDropZoneProps['onUpload'] = async (uploadedFiles) => {
		files.set([...Array.from($files), ...uploadedFiles]);
	};

	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(`File "${file.name}" was rejected: ${reason}`);
	};

	message.subscribe((msg) => {
		if (msg) {
			toast.success(msg);
		}
	});
</script>

<svelte:head>
	<title>Resumes | JobTrackify</title>
</svelte:head>

<DashboardHeader
	menu={{
		title: 'Resumes',
		href: '/dashboard/resumes'
	}}
/>

<PageContainer>
	<div>
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl font-black">Resumes</CardTitle>
				<CardDescription>
					Manage your resumes, upload new ones, and customize your resume settings.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div>
					<form
						class="flex w-full flex-col gap-2 p-6"
						use:enhance
						method="POST"
						enctype="multipart/form-data"
						action="?/upload"
					>
						<div class="space-y-4">
							<FileDropZone
								{onUpload}
								{onFileRejected}
								fileCount={$files.length ?? 0}
								maxFiles={4}
								accept="application/pdf"
								maxFileSize={maxResumeFileSize}
							/>

							<input name="files" type="file" bind:files={$files} class="hidden" />

							<div class="flex flex-col gap-2">
								{#each Array.from($files) as file, i (file.name)}
									<div class="flex place-items-center justify-between gap-2">
										<div class="flex flex-col">
											<span class="text-sm">{file.name}</span>
											<span class="text-muted-foreground text-xs">{displaySize(file.size)}</span>
										</div>
										{#if !$submitting}
											<Button
												variant="outline"
												size="icon"
												onclick={() => {
													// we use set instead of an assignment since it accepts a File[]
													files.set([
														...Array.from($files).slice(0, i),
														...Array.from($files).slice(i + 1)
													]);
												}}
											>
												<XIcon />
											</Button>
										{/if}
									</div>
								{/each}
							</div>

							{#if $files.length > 0}
								<Button disabled={$submitting} type="submit" class="w-fit">
									{#if $submitting}
										<LoaderCircleIcon class="animate-spin" />

										Uploading...
									{:else}
										Upload Resumes
									{/if}
								</Button>
							{/if}
						</div>
					</form>
				</div>
			</CardContent>
		</Card>

		<hr class="my-8" />

		<div>
			{#if data.userResumes.length === 0}
				<p class="text-muted-foreground text-center">No resumes uploaded yet.</p>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.userResumes as resume}
						<Card>
							<CardHeader>
								<CardTitle>{resume.file_name}</CardTitle>
								<CardDescription>
									Uploaded on
									<span class="underline">
										{new Date(resume.uploaded_at).toLocaleString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</span>
								</CardDescription>
							</CardHeader>
							<CardFooter>
								<Button
									variant="link"
									href={resume.fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									class=""
								>
									View Resume
								</Button>
							</CardFooter>
						</Card>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</PageContainer>
