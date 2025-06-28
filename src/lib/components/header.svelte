<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import { cn } from '$lib/utils';

	let props: {
		className?: string;
	} = $props();
</script>

<header class={cn(props.className, '')}>
	<div class="inline-flex items-center space-x-2">
		<img src={logo} alt="jobtrackify logo" class="size-12 rounded-full" />

		<div>
			<h1 class="font-black tracking-wide">JobTrackify</h1>
			<p class="text-muted-foreground text-xs">Track your job applications</p>
		</div>
	</div>
</header>
