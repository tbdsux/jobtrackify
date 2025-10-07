<script>
	import Header from '$lib/components/header.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import GithubLoginButton from '../github-login-button.svelte';
	import { loginSchema, registerSchema } from './auth-schema';

	let { data } = $props();

	const loginForm = superForm(data.loginForm, {
		validators: zod4Client(loginSchema),
		clearOnSubmit: 'none'
	});

	const registerForm = superForm(data.registerForm, {
		validators: zod4Client(registerSchema),
		clearOnSubmit: 'none'
	});

	const {
		form: loginFormData,
		enhance: loginFormEnhance,
		submitting: loginFormSubmitting
	} = loginForm;
	const {
		form: registerFormData,
		enhance: registerFormEnhance,
		submitting: registerFormSubmitting
	} = registerForm;
</script>

<svelte:head>
	<title>Login | JobTrackify</title>
</svelte:head>

<main class="mx-auto flex w-4/5 flex-col items-center space-y-12 py-6">
	<Header />

	<div class="grod-cols-1 grid w-full gap-12 lg:grid-cols-2">
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Login to Your Account</CardTitle>
					<CardDescription>
						Authenticate using your credentials to access the dashboard.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form method="POST" use:loginFormEnhance action="?/login" class="space-y-4">
						<FormField form={loginForm} name="email">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Email</FormLabel>
									<Input
										{...props}
										bind:value={$loginFormData.email}
										type="email"
										placeholder="Enter your email"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						</FormField>

						<FormField form={loginForm} name="password">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Password</FormLabel>
									<Input
										{...props}
										bind:value={$loginFormData.password}
										type="password"
										placeholder="Enter your password"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						</FormField>

						<div>
							<FormButton>
								{#if $loginFormSubmitting}Logging in...{:else}Login{/if}
							</FormButton>
						</div>

						<hr />

						<div class="space-y-4">
							<p class="text-muted-foreground text-sm">Or login using your GitHub account:</p>
							<GithubLoginButton />
						</div>
					</form>
				</CardContent>
			</Card>
		</div>

		<div>
			<Card>
				<CardHeader>
					<CardTitle>Create an Account</CardTitle>
					<CardDescription>Fill in the details below to create a new account.</CardDescription>
				</CardHeader>

				<CardContent>
					<form method="POST" use:registerFormEnhance action="?/register" class="space-y-4">
						<FormField form={registerForm} name="fullname">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Fullname</FormLabel>
									<Input
										{...props}
										bind:value={$registerFormData.fullname}
										placeholder="Enter your fullname"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						</FormField>

						<FormField form={registerForm} name="email">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Email</FormLabel>
									<Input
										{...props}
										bind:value={$registerFormData.email}
										type="email"
										placeholder="Enter your email"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						</FormField>

						<FormField form={registerForm} name="password">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Password</FormLabel>
									<Input
										{...props}
										bind:value={$registerFormData.password}
										type="password"
										placeholder="Enter your password"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						</FormField>

						<FormField form={registerForm} name="confirmPassword">
							<FormControl>
								{#snippet children({ props })}
									<FormLabel>Confirm Password</FormLabel>
									<Input
										{...props}
										bind:value={$registerFormData.confirmPassword}
										type="password"
										placeholder="Confirm your password"
									/>
								{/snippet}
							</FormControl>
							<FormFieldErrors />
						</FormField>

						<div>
							<FormButton>
								{#if $registerFormSubmitting}Creating Account...{:else}Create Account{/if}
							</FormButton>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	</div>

	<footer class="flex w-full items-center justify-between p-4 py-12">
		<p class="text-muted-foreground text-sm">&copy; 2025 TBDH.DEV | JobTrackify</p>
	</footer>
</main>
