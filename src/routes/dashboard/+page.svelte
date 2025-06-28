<script lang="ts">
	import DashboardHeader from '$lib/components/dashboard-header.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Dashboard | JobTrackify</title>
</svelte:head>

<DashboardHeader
	menu={{
		title: 'Dashboard',
		href: '/dashboard'
	}}
/>

<PageContainer>
	<p>hello world</p>
</PageContainer>
