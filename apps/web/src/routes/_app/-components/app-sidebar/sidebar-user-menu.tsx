import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  EllipsisVertical,
  LogOut,
  Settings as SettingsIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import type { User } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { authClient } from '@/lib/auth-client';

export function SidebarUserMenu({ user }: { user: User }) {
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.slice(0, 1))
      .slice(0, 2)
      .join('')
      .toUpperCase() || user.email.slice(0, 1).toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      await navigate({ to: '/' });
      toast.success('Signed out successfully');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="rounded-lg">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name} />
                  )}
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </span>
                <EllipsisVertical aria-hidden="true" className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="top"
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="font-normal">
                <span className="grid text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" onClick={() => setOpenMobile(false)}>
                  <SettingsIcon aria-hidden="true" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isSigningOut}
                onSelect={() => void handleSignOut()}
              >
                <LogOut aria-hidden="true" />
                {isSigningOut ? 'Signing out…' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
