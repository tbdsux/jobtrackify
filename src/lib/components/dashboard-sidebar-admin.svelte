<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { UserCogIcon } from '@lucide/svelte';

	const adminMenuItems = [
		{
			title: 'Users',
			url: '/dashboard/admin/users',
			icon: UserCogIcon
		}
	];
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Admin</Sidebar.GroupLabel>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each adminMenuItems as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton class="px-4 py-6 [&>svg]:size-5">
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
