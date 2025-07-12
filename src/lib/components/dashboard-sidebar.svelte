<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.png';
	import { authClient } from '$lib/auth-client';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { ArchiveIcon, FileUserIcon, LayoutDashboardIcon, UserCogIcon } from '@lucide/svelte';

	const menuItems = [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboardIcon
		},
		{
			title: 'Job Applications',
			url: '/dashboard/jobs/applications',
			icon: FileUserIcon
		},
		{
			title: 'Saved Jobs',
			url: '/dashboard/jobs/saved',
			icon: ArchiveIcon
		}
	];

	let compProps: {
		user: {
			name: string;
			email: string;
		};
	} = $props();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/', {
						invalidateAll: true
					});
				}
			}
		});
	};
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="flex items-center rounded-lg border p-2">
			<div class="inline-flex items-center space-x-2">
				<img src={logo} alt="jobtrackify logo" class="size-12 rounded-full" />

				<div>
					<h1 class="font-black tracking-wide">JobTrackify</h1>
					<p class="text-muted-foreground text-xs">Track your job applications</p>
				</div>
			</div>
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each menuItems as item (item.title)}
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
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="flex items-center justify-between rounded-lg border px-4 py-6"
					>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props}>
								<span>@ {compProps.user.name}</span>
								<UserCogIcon />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-[200px]" align="end">
						<DropdownMenu.Group>
							<DropdownMenu.Label>My Account</DropdownMenu.Label>
							<DropdownMenu.Separator />

							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a {...props} href="/dashboard/account">Profile</a>
								{/snippet}
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={handleLogout}>Logout</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
