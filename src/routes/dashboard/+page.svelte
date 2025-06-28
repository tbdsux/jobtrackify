<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<p>dashboard page</p>

<p>{JSON.stringify(data)}</p>
