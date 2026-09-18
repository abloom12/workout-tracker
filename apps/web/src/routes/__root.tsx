import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';

import { trpc } from '@/lib/trpc.ts';

type RouterContext = { queryClient: QueryClient; trpc: typeof trpc };

const RootLayout = () => (
  <>
    <Outlet />
    <Toaster />
    {import.meta.env.DEV && <TanStackRouterDevtools />}
  </>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
