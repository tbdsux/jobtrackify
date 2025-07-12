<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import { cn } from '$lib/utils';
	import { FolderGitIcon } from '@lucide/svelte';
	import LoginButton from '../../routes/login-button.svelte';
	import { Button } from './ui/button';

	let props: {
		className?: string;
	} = $props();
</script>

<header class={cn(props.className, 'flex w-full items-center justify-between p-4')}>
	<div class="inline-flex items-center space-x-2">
		<img src={logo} alt="jobtrackify logo" class="size-12 rounded-full" />

		<div>
			<h1 class="font-black tracking-wide">JobTrackify</h1>
		</div>
	</div>

	<div class="inline-flex items-center gap-4">
		<Button
			href="https://github.com/tbdsux/jobtrackify.git"
			target="_blank"
			rel="noopener noreferrer"
			variant="link"
		>
			<FolderGitIcon />

			Github
		</Button>

		<LoginButton />
	</div>
</header>
