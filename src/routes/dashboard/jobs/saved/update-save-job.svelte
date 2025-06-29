<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import {
		Sheet,
		SheetClose,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { PlusIcon } from '@lucide/svelte';
	import type { Selectable } from 'kysely';
	import type { SavedJob } from 'kysely-codegen';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { jobTypes } from '../applications/apply-schema';
	import { updateSaveJobSchema } from './savejob-schema';

	let props: {
		form: SuperValidated<Infer<typeof updateSaveJobSchema>>;
		item: Selectable<SavedJob>;
	} = $props();

	let open = $state(false);
	let process = $state<undefined | string | number>(undefined);

	const form = superForm(props.form, {
		validators: zodClient(updateSaveJobSchema),
		warnings: { duplicateId: false },
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Successfully saved new job!`, { id: process });
				invalidate('/dashboard/jobs/saved');
			} else {
				toast.error('Please fix the errors in the form.', { id: process });
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	$effect(() => {
		if ($submitting) {
			process = toast.loading('Submitting your application...', {});
		}
	});
</script>

<div>
	<Sheet {open} onOpenChange={(v) => (open = v)}>
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<SheetTrigger {...props}>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>Update Saved Job</Button>
						{/snippet}
					</SheetTrigger>
				{/snippet}
			</TooltipTrigger>

			<TooltipContent>
				<p>Update saved job</p>
			</TooltipContent>
		</Tooltip>

		<SheetContent
			showCloseButton={false}
			class="overflow-y-auto pt-5 pb-12 sm:max-w-xl"
			onInteractOutside={(e) => $submitting && e.preventDefault()}
		>
			<SheetHeader>
				<SheetTitle class="text-xl font-black">Save New Job</SheetTitle>
				<SheetDescription>
					Use this form to save a new job for later review. You can add details like the job title,
					company, and location.
				</SheetDescription>
			</SheetHeader>

			<div class="px-4">
				<form method="POST" action="?/updateItem" use:enhance class="space-y-4">
					<input type="hidden" name="id" value={props.item.id} />
					<FormField {form} name="companyName">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Company Name</FormLabel>
								<Input
									{...props}
									placeholder="Company Name, e.g. Acme"
									bind:value={$formData.companyName}
								/>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					</FormField>

					<FormField {form} name="position">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Position</FormLabel>
								<Input
									{...props}
									placeholder="E.g. Software Engineer"
									bind:value={$formData.position}
								/>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					</FormField>

					<FormField {form} name="jobLink">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Job Link</FormLabel>
								<Input
									{...props}
									placeholder="Where did you find the job?"
									bind:value={$formData.jobLink}
								/>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					</FormField>

					<FormField {form} name="jobType">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Job Type</FormLabel>
								<Select type="single" bind:value={$formData.jobType} name={props.name}>
									<SelectTrigger {...props} class="w-full">
										{$formData.jobType ? jobTypes[$formData.jobType] : 'Select Job Type'}
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="full-time">Full Time</SelectItem>
										<SelectItem value="part-time">Part Time</SelectItem>
										<SelectItem value="contract">Contract</SelectItem>
										<SelectItem value="internship">Internship</SelectItem>
										<SelectItem value="temporary">Temporary</SelectItem>
										<SelectItem value="freelance">Freelance</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							{/snippet}
						</FormControl>

						<FormFieldErrors />
					</FormField>

					<FormField {form} name="salary">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Salary</FormLabel>
								<Input
									{...props}
									placeholder="Salary for the job (e.g. $100,000)"
									bind:value={$formData.salary}
								/>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					</FormField>

					<FormField {form} name="location">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Location</FormLabel>
								<Input
									{...props}
									placeholder="Location for the job (Remote, On-site)"
									bind:value={$formData.location}
								/>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					</FormField>

					<div class="flex items-center space-x-2">
						<SheetClose>
							<Button variant="outline" disabled={$submitting}>Cancel</Button>
						</SheetClose>

						<FormButton disabled={$submitting}>
							<PlusIcon />
							{#if $submitting}
								Submitting...
							{:else}
								Update Saved Job
							{/if}
						</FormButton>
					</div>
				</form>
			</div>
		</SheetContent>
	</Sheet>
</div>
