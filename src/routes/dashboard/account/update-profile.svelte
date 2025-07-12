<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateProfileSchema } from './profile-schema';

	let props: { form: SuperValidated<Infer<typeof updateProfileSchema>> } = $props();

	let process = $state<undefined | string | number>(undefined);

	const form = superForm(props.form, {
		validators: zodClient(updateProfileSchema),
		resetForm: false,
		onUpdate: async ({ form: f }) => {
			console.log('form errs', f.errors);
			if (f.valid) {
				toast.success(`Successfully updated profile!`, { id: process });
				await invalidateAll();
			} else {
				toast.error('Please fix the errors in the form.', { id: process });
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	$effect(() => {
		if ($submitting) {
			process = toast.loading('Updating profile...', {});
		}
	});
</script>

<svelte:head>
	<title>Account | JobTrackify</title>
</svelte:head>

<Card>
	<CardHeader>
		<CardTitle>Manage Profile</CardTitle>
		<CardDescription>Update your profile account name.</CardDescription>
	</CardHeader>

	<CardContent>
		<form method="POST" action="?/updateProfile" use:enhance class="space-y-4">
			<FormField {form} name="name">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Your name</FormLabel>
						<Input {...props} placeholder="Your name, e.g. John Doe" bind:value={$formData.name} />
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>

			<div>
				<FormButton disabled={$submitting}>
					{#if $submitting}
						Updating...
					{:else}
						Update Profile
					{/if}
				</FormButton>
			</div>
		</form>
	</CardContent>
</Card>
