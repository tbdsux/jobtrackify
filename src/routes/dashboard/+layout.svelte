<script lang="ts">
	import DashboardSidebar from '$lib/components/dashboard-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<Sidebar.Provider>
	<DashboardSidebar user={{ name: data.session.user.name, email: data.session.user.email }} />

	<main class="flex h-full w-full flex-col space-y-4 px-8 pt-4 pb-8">
		{@render children()}
	</main>
</Sidebar.Provider>
