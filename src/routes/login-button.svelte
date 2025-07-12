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

<Button variant="default" onclick={handleSignInGithub}>Sign in with GitHub</Button>
