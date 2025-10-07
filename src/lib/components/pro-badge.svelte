<script lang="ts">
	import { useQueryProSub } from '$lib/query-hooks/query-pro-sub';
	import { Badge } from './ui/badge';

	const {
		isAdmin
	}: {
		isAdmin: boolean;
	} = $props();

	const queryProSub = useQueryProSub();
</script>

{#if isAdmin}
	<Badge>ADMIN</Badge>
{:else}
	<div>
		{#if queryProSub.isPending}
			<span> </span>
		{:else if queryProSub.data?.success && queryProSub.data.data.hasPro}
			<Badge>PRO</Badge>
		{:else}
			<Badge variant="outline">Free</Badge>
		{/if}
	</div>
{/if}
