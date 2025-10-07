<script lang="ts">
	import { useQueryProSub } from '$lib/query-hooks/query-pro-sub';
	import { Badge } from './ui/badge';

	const queryProSub = useQueryProSub();
</script>

{#if queryProSub.isPending}
	<span> </span>
{:else if queryProSub.data?.success && queryProSub.data.data.hasPro}
	<Badge>PRO</Badge>
{:else}
	<Badge variant="outline">Free</Badge>
{/if}
