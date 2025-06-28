<script lang="ts">
	import DashboardSidebar from '$lib/components/dashboard-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<Sidebar.Provider>
	<DashboardSidebar user={{ name: data.session.user.name, email: data.session.user.email }} />

	<main class="flex flex-col space-y-4 p-4">
		{@render children()}
	</main>
</Sidebar.Provider>
