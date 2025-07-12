<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import Hero from './hero.svelte';
</script>

<svelte:head>
	<title>Welcome | JobTrackify</title>
</svelte:head>

<main class="mx-auto flex w-4/5 flex-col items-center space-y-12 py-6">
	<Header className="" />

	<Hero />

	<footer class="flex w-full items-center justify-between p-4 py-12">
		<p class="text-muted-foreground text-sm">&copy; 2025 TBDH.DEV | JobTrackify</p>
	</footer>
</main>
