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
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import {
		type ApplicationStatus,
		applicationStatuses,
		type InterviewType,
		interviewTypes,
		type JobType,
		jobTypes
	} from '$lib/modules/job-application';
	import { cn } from '$lib/utils';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { CalendarIcon, PlusIcon } from '@lucide/svelte';
	import type { Selectable } from 'kysely';
	import type { JobApplication } from 'kysely-codegen';
	import { toast } from 'svelte-sonner';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { jobApplicationSchema, type updateJobApplicationSchema } from './apply-schema';

	let props: {
		item: Selectable<JobApplication>;
		form: SuperValidated<Infer<typeof updateJobApplicationSchema>>;
	} = $props();

	let open = $state(false);
	let process = $state<undefined | string | number>(undefined);

	const form = superForm(props.form, {
		validators: zodClient(jobApplicationSchema),
		warnings: { duplicateId: false },
		resetForm: false,
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Successfully updated job application!`, {
					id: process
				});

				invalidate('/dashboard/jobs/applications');
				open = false;
			} else {
				console.error(f.errors);
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
	let interviewDate = $derived(
		$formData.interviewDate ? parseDate($formData.interviewDate) : undefined
	);
	let followupDate = $derived(
		$formData.followupDate ? parseDate($formData.followupDate) : undefined
	);
	let nowDatePlaceholder = $state<DateValue>(today(getLocalTimeZone()));

	$effect(() => {
		if ($submitting) {
			process = toast.loading('Submitting your application...');
		}
	});
</script>

<div>
	<Sheet>
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<SheetTrigger {...props}>
						{#snippet child({ props })}
							<Button {...props} variant="outline">Update Application</Button>
						{/snippet}
					</SheetTrigger>
				{/snippet}
			</TooltipTrigger>

			<TooltipContent>
				<p>Update your application details</p>
			</TooltipContent>
		</Tooltip>

		<SheetContent class="overflow-y-auto pt-5 pb-12 sm:max-w-2xl" showCloseButton={false}>
			<SheetHeader>
				<SheetTitle class="text-xl">Update Job Application</SheetTitle>
				<SheetDescription>
					Update the details of your job application. Make sure to fill in all required fields.
				</SheetDescription>
			</SheetHeader>

			<div class="px-4">
				<form method="POST" action="?/updateItem" use:enhance class="space-y-4">
					<input hidden value={$formData.id} name="id" />

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
										{$formData.jobType ? jobTypes[$formData.jobType as JobType] : 'Select Job Type'}
									</SelectTrigger>
									<SelectContent>
										{#each Object.entries(jobTypes) as [jobtype, value], key (key)}
											<SelectItem value={jobtype}>{value}</SelectItem>
										{/each}
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
										{$formData.status
											? applicationStatuses[$formData.status as ApplicationStatus]
											: 'Select Status'}
									</SelectTrigger>
									<SelectContent>
										{#each Object.entries(applicationStatuses) as [status, value], key (key)}
											<SelectItem value={status}>{value}</SelectItem>
										{/each}
									</SelectContent>
								</Select>
							{/snippet}
						</FormControl>
						<FormDescription>
							You can update the status later as your application progresses.
						</FormDescription>
						<FormFieldErrors />
					</FormField>

					{#if ['interview', 'initial interview'].includes($formData.status as ApplicationStatus)}
						<FormField {form} name="interviewDate">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Interview Date</FormLabel>
									<Popover>
										<PopoverTrigger
											{...props}
											class={cn(
												buttonVariants({ variant: 'outline' }),
												'w-full justify-start pl-4 text-left font-normal',
												!interviewDate && 'text-muted-foreground'
											)}
										>
											{interviewDate
												? df.format(interviewDate.toDate(getLocalTimeZone()))
												: 'Pick a date'}
											<CalendarIcon class="ml-auto size-4 opacity-50" />
										</PopoverTrigger>
										<PopoverContent class="w-auto p-0" side="bottom">
											<Calendar
												type="single"
												value={interviewDate as DateValue}
												bind:placeholder={nowDatePlaceholder}
												minValue={new CalendarDate(1900, 1, 1)}
												calendarLabel="Interview Date"
												onValueChange={(v) => {
													if (v) {
														$formData.interviewDate = v.toString();
													} else {
														$formData.interviewDate = '';
													}
												}}
											/>
										</PopoverContent>
									</Popover>
									<FormFieldErrors />
									<input hidden value={$formData.interviewDate} name={props.name} />
								{/snippet}
							</FormControl>
						</FormField>

						<FormField {form} name="interviewType">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Interview Type</FormLabel>
									<Select type="single" bind:value={$formData.interviewType} name={props.name}>
										<SelectTrigger {...props} class="w-full">
											{$formData.interviewType
												? interviewTypes[$formData.interviewType as InterviewType]
												: 'Select Interview Type'}
										</SelectTrigger>
										<SelectContent>
											{#each Object.entries(interviewTypes) as [itype, value], key (key)}
												<SelectItem value={itype}>{value}</SelectItem>
											{/each}
										</SelectContent>
									</Select>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						</FormField>
					{:else if $formData.status === 'applied'}
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
					{:else}
						<FormField {form} name="followupDate">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Followup Date</FormLabel>
									<Popover>
										<PopoverTrigger
											{...props}
											class={cn(
												buttonVariants({ variant: 'outline' }),
												'w-full justify-start pl-4 text-left font-normal',
												!followupDate && 'text-muted-foreground'
											)}
										>
											{followupDate
												? df.format(followupDate.toDate(getLocalTimeZone()))
												: 'Pick a date'}
											<CalendarIcon class="ml-auto size-4 opacity-50" />
										</PopoverTrigger>
										<PopoverContent class="w-auto p-0" side="bottom">
											<Calendar
												type="single"
												value={followupDate as DateValue}
												bind:placeholder={nowDatePlaceholder}
												minValue={new CalendarDate(1900, 1, 1)}
												maxValue={today(getLocalTimeZone())}
												calendarLabel="Followup Date"
												onValueChange={(v) => {
													if (v) {
														$formData.followupDate = v.toString();
													} else {
														$formData.followupDate = '';
													}
												}}
											/>
										</PopoverContent>
									</Popover>
									<FormFieldErrors />
									<input hidden value={$formData.followupDate} name={props.name} />
								{/snippet}
							</FormControl>
						</FormField>
					{/if}

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
							Update Application
						</FormButton>
					</div>
				</form>
			</div>
		</SheetContent>
	</Sheet>
</div>
