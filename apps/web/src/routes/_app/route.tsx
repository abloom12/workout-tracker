import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { getAuthRedirect } from '@/lib/auth-redirect';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: getAuthRedirect(location.pathname) },
      });
    }

    return { session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const isProgramEditor = useRouterState({
    select: ({ matches }) =>
      matches.some(({ routeId }) => routeId === '/_app/programs/'),
  });

  return (
    <SidebarProvider
      className={cn(
        isProgramEditor &&
          'h-screen min-h-0 overflow-hidden supports-[height:100dvh]:h-dvh',
      )}
    >
      <a
        href="#main-content"
        className="bg-background focus:ring-ring sr-only z-50 rounded-md px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-2 focus:outline-none"
      >
        Skip to content
      </a>
      <AppSidebar user={session.user} variant="inset" />
      <SidebarInset
        id="main-content"
        className={cn(isProgramEditor && 'min-h-0 min-w-0 overflow-hidden')}
      >
        <SiteHeader />
        <div
          className={cn(
            'p-2.5',
            isProgramEditor && 'flex min-h-0 flex-1 flex-col overflow-hidden',
          )}
        >
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
