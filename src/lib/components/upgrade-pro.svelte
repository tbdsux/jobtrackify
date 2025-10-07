<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { useQueryProSub } from '$lib/query-hooks/query-pro-sub';
	import { cn } from '$lib/utils';
	import { SparklesIcon } from '@lucide/svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Badge } from './ui/badge';
	import { buttonVariants } from './ui/button';
	import * as Sidebar from './ui/sidebar';

	const queryClient = useQueryClient();
	const queryProSub = useQueryProSub();

	const handleUpgradeSub = async () => {
		await authClient.subscription.upgrade({
			plan: 'pro',
			successUrl: '/dashboard',
			cancelUrl: '/dashboard'
		});

		await queryClient.invalidateQueries({
			queryKey: ['user-pro-sub']
		});
	};

	const handleCancelSub = async () => {
		if (!queryProSub.data?.success) return;
		if (!queryProSub.data.data.hasPro) return;

		const subId = queryProSub.data.data.subscriptionId;

		await authClient.subscription.cancel({
			subscriptionId: subId,
			returnUrl: '/dashboard'
		});

		await queryClient.invalidateQueries({
			queryKey: ['user-pro-sub']
		});

		toast.success(
			'Subscription cancelled successfully. You will retain Pro features until the end of your billing cycle.'
		);
	};
</script>

{#if queryProSub.isPending}
	<div></div>
{:else if queryProSub.data?.success && queryProSub.data.data.hasPro}
	<AlertDialog.Root>
		<Sidebar.MenuButton
			class={cn('hover:text-primary-foreground px-4 py-6', buttonVariants({ variant: 'default' }))}
		>
			{#snippet child({ props })}
				<AlertDialog.Trigger {...props}>
					<SparklesIcon />
					Manage Pro Subscription
				</AlertDialog.Trigger>
			{/snippet}
		</Sidebar.MenuButton>

		<AlertDialog.Content class="sm:max-w-lg">
			<AlertDialog.Header>
				<AlertDialog.Title
					class="inline-flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5"
					><SparklesIcon /> Pro Subscription</AlertDialog.Title
				>
				<AlertDialog.Description>
					<p>
						You are currently subscribed to
						<strong> JobTrackify Pro </strong> until<br />
						<Badge variant="secondary" class="">
							{queryProSub.data.data.periodEnd?.toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</Badge>
					</p>
					<br />

					You have access to the following benefits:
					<ul class="list-disc pl-5">
						<li>Access to advanced reporting features</li>
						<li>Priority customer support</li>
						<li>Increased storage and data retention</li>
						<li>AI support</li>
						<li>Resume and cover letter builder</li>
						<li>And more...</li>
					</ul>

					<br />

					<p>If you wish to cancel your subscription, please click Cancel Subscription below.</p>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Close</AlertDialog.Cancel>
				<AlertDialog.Action onclick={handleCancelSub}>Cancel Subscription</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{:else}
	<AlertDialog.Root>
		<Sidebar.MenuButton
			class={cn('hover:text-primary-foreground px-4 py-6', buttonVariants({ variant: 'default' }))}
		>
			{#snippet child({ props })}
				<AlertDialog.Trigger {...props}>
					<SparklesIcon />
					Upgrade to Pro
				</AlertDialog.Trigger>
			{/snippet}
		</Sidebar.MenuButton>

		<AlertDialog.Content class="sm:max-w-lg">
			<AlertDialog.Header>
				<AlertDialog.Title
					class="inline-flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5"
					><SparklesIcon /> Upgrade to PRO</AlertDialog.Title
				>
				<AlertDialog.Description>
					<p>
						Unlock all features and take your job tracking to the next level with
						<strong> JobTrackify Pro </strong>!
					</p>
					<br />

					You will gain the following benefits:
					<ul class="list-disc pl-5">
						<li>Access to advanced reporting features</li>
						<li>Priority customer support</li>
						<li>Increased storage and data retention</li>
						<li>AI support</li>
						<li>Resume and cover letter builder</li>
						<li>And more...</li>
					</ul>

					<br />

					<p>
						Ready to enhance your job tracking experience? Click Continue to proceed with the
						upgrade.
					</p>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action onclick={handleUpgradeSub}>Continue</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
