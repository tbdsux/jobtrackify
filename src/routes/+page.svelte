<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';

	const handleSignInGithub = async () => {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/dashboard'
		});
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button onclick={handleSignInGithub}>Signin with Github</Button>
