import { Link, useRouterState } from '@tanstack/react-router';
import { Dumbbell, LayoutDashboard, ShieldCheck, Table2 } from 'lucide-react';

import type { User } from '@/lib/auth-client';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';

const navigation = [
  { title: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { title: 'Programs', to: '/programs', icon: Table2 },
  { title: 'Exercises', to: '/exercises', icon: Dumbbell },
] as const;

const adminNavigation = [
  { title: 'Overview', to: '/admin' },
  { title: 'Users', to: '/admin/users' },
  { title: 'Catalogue', to: '/admin/catalogue' },
] as const;

export function SidebarNavigation({ user }: { user: User }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === item.to || pathname.startsWith(`${item.to}/`)
                  }
                >
                  <Link to={item.to} onClick={() => setOpenMobile(false)}>
                    <item.icon aria-hidden="true" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {user.role?.split(',').includes('admin') && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === '/admin' || pathname.startsWith('/admin/')
                  }
                >
                  <Link
                    to="/admin"
                    activeOptions={{ exact: true }}
                    onClick={() => setOpenMobile(false)}
                  >
                    <ShieldCheck aria-hidden="true" />
                    <span>Admin</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub aria-label="Admin navigation">
                  {adminNavigation.map((item) => (
                    <SidebarMenuSubItem key={item.to}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={
                          pathname === item.to || pathname === `${item.to}/`
                        }
                      >
                        <Link
                          to={item.to}
                          activeOptions={{ exact: true }}
                          onClick={() => setOpenMobile(false)}
                        >
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
