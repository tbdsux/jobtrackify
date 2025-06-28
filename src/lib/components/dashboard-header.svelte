<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { SidebarTrigger } from '$lib/components/ui/sidebar';

	let props: {
		menu: {
			title: string;
			href: string;
		};
	} = $props();
</script>

<div class="flex items-center space-x-2">
	<SidebarTrigger class="cursor-pointer" />

	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href={props.menu.href}>{props.menu.title}</Breadcrumb.Link>
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
