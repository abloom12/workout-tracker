import type { ComponentProps } from 'react';
import { Link } from '@tanstack/react-router';
import { BicepsFlexed } from 'lucide-react';

import type { User } from '@/lib/auth-client';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { SidebarNavigation } from './sidebar-navigation';
import { SidebarUserMenu } from './sidebar-user-menu';

type AppSidebarProps = ComponentProps<typeof Sidebar> & { user: User };

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/dashboard" onClick={() => setOpenMobile(false)}>
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                  <BicepsFlexed aria-hidden="true" />
                </span>
                <span className="truncate text-base font-semibold">
                  Workout Tracker
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarNavigation user={user} />
      <SidebarUserMenu user={user} />
    </Sidebar>
  );
}
