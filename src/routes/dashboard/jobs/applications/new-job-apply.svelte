<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import {
		FormButton,
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
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
	import { Textarea } from '$lib/components/ui/textarea';
	import { cn } from '$lib/utils';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { CalendarIcon, PlusIcon, TextCursorInputIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { jobApplicationSchema, jobApplicationStatuses, jobTypes } from './apply-schema';

	let { data }: { data: { form: SuperValidated<Infer<typeof jobApplicationSchema>> } } = $props();

	let open = $state(false);
	let process = $state<undefined | string | number>(undefined);

	const form = superForm(data.form, {
		validators: zodClient(jobApplicationSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Successfully added new job application!`, {
					id: process
				});

				invalidate('/dashboard/jobs/applications');
				open = false;
			} else {
				toast.error('Please fix the errors in the form.', {
					id: process
				});
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let applicationDate = $derived(
		$formData.applicationDate ? parseDate($formData.applicationDate) : undefined
	);
	let nowDatePlaceholder = $state<DateValue>(today(getLocalTimeZone()));

	$effect(() => {
		if ($submitting) {
			process = toast.loading('Submitting your application...');
		}
	});
</script>

<div>
	<Sheet {open} onOpenChange={(v) => (open = v)}>
		<SheetTrigger>
			{#snippet child({ props })}
				<Button {...props}><TextCursorInputIcon /> Add New Application</Button>
			{/snippet}
		</SheetTrigger>

		<SheetContent
			onInteractOutside={(e) => $submitting && e.preventDefault()}
			showCloseButton={false}
			class="overflow-y-auto pt-5 pb-12 sm:max-w-xl"
		>
			<SheetHeader>
				<SheetTitle class="text-xl font-black">Add New Job Application</SheetTitle>
				<SheetDescription>Fill out the details of your new job application.</SheetDescription>
			</SheetHeader>

			<div class="px-4">
				<form method="POST" action="?/addItem" use:enhance class="space-y-4">
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

					<FormField {form} name="status">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Status</FormLabel>
								<Select type="single" bind:value={$formData.status} name={props.name}>
									<SelectTrigger {...props} class="w-full">
										{$formData.status ? jobApplicationStatuses[$formData.status] : 'Select Status'}
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="applied">Applied</SelectItem>
										<SelectItem value="interview">Interview</SelectItem>
										<SelectItem value="offer">Offer</SelectItem>
										<SelectItem value="rejected">Rejected</SelectItem>
										<SelectItem value="applicantRejected">Applicant Rejected</SelectItem>
										<SelectItem value="accepted">Accepted</SelectItem>
									</SelectContent>
								</Select>
							{/snippet}
						</FormControl>
						<FormDescription>
							You can update the status later as your application progresses.
						</FormDescription>
						<FormFieldErrors />
					</FormField>

					<FormField {form} name="applicationDate">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Application Date</FormLabel>
								<Popover>
									<PopoverTrigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-full justify-start pl-4 text-left font-normal',
											!applicationDate && 'text-muted-foreground'
										)}
									>
										{applicationDate
											? df.format(applicationDate.toDate(getLocalTimeZone()))
											: 'Pick a date'}
										<CalendarIcon class="ml-auto size-4 opacity-50" />
									</PopoverTrigger>
									<PopoverContent class="w-auto p-0" side="bottom">
										<Calendar
											type="single"
											value={applicationDate as DateValue}
											bind:placeholder={nowDatePlaceholder}
											minValue={new CalendarDate(1900, 1, 1)}
											maxValue={today(getLocalTimeZone())}
											calendarLabel="Application Date"
											onValueChange={(v) => {
												if (v) {
													$formData.applicationDate = v.toString();
												} else {
													$formData.applicationDate = '';
												}
											}}
										/>
									</PopoverContent>
								</Popover>
								<FormFieldErrors />
								<input hidden value={$formData.applicationDate} name={props.name} />
							{/snippet}
						</FormControl>
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

					<FormField {form} name="notes">
						<FormControl>
							{#snippet children({ props })}
								<FormLabel>Notes</FormLabel>
								<Textarea
									class="h-16 resize-none"
									{...props}
									placeholder="Any additional notes about the application"
									bind:value={$formData.notes}
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
							Add Application
						</FormButton>
					</div>
				</form>
			</div>
		</SheetContent>
	</Sheet>
</div>
