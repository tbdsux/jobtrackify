<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import Header from '$lib/components/header.svelte';
	import { Button } from '$lib/components/ui/button';

	const handleSignInGithub = async () => {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/dashboard'
		});
	};
</script>

<svelte:head>
	<title>Welcome | JobTrackify</title>
</svelte:head>

<main class="mx-auto flex w-4/5 flex-col items-center space-y-12 py-24">
	<Header className="" />

	<div class="space-y-4 text-center">
		<p>Signin to your account to manage and track <br />your job applications</p>
		<Button onclick={handleSignInGithub}>Signin with Github</Button>
	</div>
</main>
