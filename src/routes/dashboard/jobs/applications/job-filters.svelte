<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '$lib/components/ui/command';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Separator } from '$lib/components/ui/separator';
	import { applicationStatuses, type ApplicationStatus } from '$lib/modules/job-application';
	import { cn } from '$lib/utils';
	import { CheckIcon, PlusCircleIcon } from '@lucide/svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { jobApplicationsFilterState } from './state.svelte';

	let open = $state(false);

	const filters = $derived(new SvelteSet(jobApplicationsFilterState.filter));
</script>

<div>
	<Popover bind:open>
		<PopoverTrigger class="max-w-[500px] justify-start">
			{#snippet child({ props })}
				<Button variant="outline" {...props} role="combobox" aria-expanded={open}>
					<PlusCircleIcon />

					Status

					{#if filters.size > 0}
						<Separator orientation="vertical" class="mx-1 h-8" />

						<div class="inline-flex gap-1 lg:hidden">
							<Badge variant="secondary">{filters.size} selected</Badge>
						</div>

						<div class="hidden gap-1 lg:inline-flex">
							{#if filters.size <= 3}
								{#each filters as filter}
									<Badge variant="secondary">
										{applicationStatuses[filter]}
									</Badge>
								{/each}
							{:else}
								<Badge variant="secondary">{filters.size} selected</Badge>
							{/if}
						</div>
					{/if}
				</Button>
			{/snippet}
		</PopoverTrigger>
		<PopoverContent align="start" class="w-[200px] p-0">
			<Command>
				<CommandInput placeholder="Filter status..." />
				<CommandList>
					<CommandEmpty>No status found.</CommandEmpty>
					<CommandGroup>
						{#each Object.keys(applicationStatuses) as status}
							{@const isSelected = filters.has(status as ApplicationStatus)}

							<CommandItem
								value={status}
								onSelect={() => {
									if (filters.has(status as ApplicationStatus)) {
										filters.delete(status as ApplicationStatus);
									} else {
										filters.add(status as ApplicationStatus);
									}
									const filterValues = Array.from(filters);
									jobApplicationsFilterState.filter = filterValues;

									if (
										jobApplicationsFilterState.sort === 'appliedFirst' &&
										filterValues.length > 0
									) {
										jobApplicationsFilterState.sort = 'latestUpdate';
									}
								}}
							>
								<div
									class={cn(
										'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
										isSelected
											? 'bg-primary text-primary-foreground'
											: 'opacity-50 [&_svg]:invisible'
									)}
								>
									<CheckIcon class="size-4" />
								</div>
								{applicationStatuses[status as ApplicationStatus]}
							</CommandItem>
						{/each}
					</CommandGroup>

					{#if filters.size > 0}
						<CommandSeparator />
						<CommandGroup>
							<CommandItem
								onSelect={() => (jobApplicationsFilterState.filter = [])}
								class="justify-center text-center"
							>
								Clear filters
							</CommandItem>
						</CommandGroup>
					{/if}
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
</div>
