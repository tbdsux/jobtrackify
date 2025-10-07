<script lang="ts">
	import { browser } from '$app/environment';
	import { Toaster } from '$lib/components/ui/sonner';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />

<QueryClientProvider client={queryClient}>
	<TooltipProvider delayDuration={0} skipDelayDuration={0}>
		{@render children()}
	</TooltipProvider>
</QueryClientProvider>
