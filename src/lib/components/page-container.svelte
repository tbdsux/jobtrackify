<script lang="ts">
	let { children } = $props();
</script>

<div class="h-full w-full">
	{@render children?.()}
</div>
