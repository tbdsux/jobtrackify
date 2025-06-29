<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { FormButton } from '$lib/components/ui/form';
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
	import { Trash2Icon } from '@lucide/svelte';
	import type { Selectable } from 'kysely';
	import type { SavedJob } from 'kysely-codegen';
	import { toast } from 'svelte-sonner';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { removeSaveJobSchema } from './savejob-schema';

	let props: {
		item: Selectable<SavedJob>;
		form: SuperValidated<Infer<typeof removeSaveJobSchema>>;
	} = $props();

	let open = $state(false);
	let process = $state<undefined | string | number>(undefined);

	const form = superForm(props.form, {
		validators: zodClient(removeSaveJobSchema),
		warnings: { duplicateId: false },
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Successfully removed saved job!`, {
					id: process
				});

				invalidate('/dashboard/jobs/saved');
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
</script>

<div>
	<Sheet>
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<SheetTrigger {...props}>
						{#snippet child({ props })}
							<Button {...props} variant="destructive"><Trash2Icon /></Button>
						{/snippet}
					</SheetTrigger>
				{/snippet}
			</TooltipTrigger>

			<TooltipContent>
				<p>Remove saved job</p>
			</TooltipContent>
		</Tooltip>

		<SheetContent showCloseButton={false} side="bottom" class="pt-10 pb-20">
			<SheetHeader>
				<SheetTitle class="text-center text-xl">Remove Saved Job</SheetTitle>
				<SheetDescription class="text-center">
					Are you sure you want to remove this saved job? This action cannot be undone.
				</SheetDescription>
			</SheetHeader>

			<div class="text-center">
				<strong>{props.item.companyName} - {props.item.position}</strong>
			</div>

			<div class="flex items-center justify-center space-x-2 pt-2">
				<SheetClose>
					<Button variant="outline">Cancel</Button>
				</SheetClose>

				<form method="POST" action="?/removeItem" use:enhance>
					<input hidden value={$formData.id} name="id" />

					<FormButton variant="destructive" disabled={$submitting}>
						<Trash2Icon />
						Yes, Remove Saved Job
					</FormButton>
				</form>
			</div>
		</SheetContent>
	</Sheet>
</div>
