<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { cn } from '$lib/utils';
	import { jobApplicationsFilterState, type JobApplicationSort } from './state.svelte';

	const handleSelectSort = (sortBy: JobApplicationSort) => {
		jobApplicationsFilterState.sort = sortBy;

		if (sortBy === 'appliedFirst') {
			jobApplicationsFilterState.filter = [];
		}
	};
</script>

<div class="inline-flex h-9 items-center space-x-2">
	<Button
		class={cn({
			'text-muted-foreground': jobApplicationsFilterState.sort !== 'appliedFirst'
		})}
		variant="ghost"
		onclick={() => handleSelectSort('appliedFirst')}>Applied First</Button
	>

	<Separator orientation="vertical" class="h-6" />

	<Button
		class={cn({
			'text-muted-foreground': jobApplicationsFilterState.sort !== 'latestUpdate'
		})}
		variant="ghost"
		onclick={() => handleSelectSort('latestUpdate')}>Latest Update</Button
	>
</div>
