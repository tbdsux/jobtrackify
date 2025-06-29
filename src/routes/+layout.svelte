<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
<TooltipProvider delayDuration={0} skipDelayDuration={0}>
	{@render children()}
</TooltipProvider>
