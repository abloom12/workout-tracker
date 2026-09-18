import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({ to: '/login', search: { redirect: '/settings' } });
    }

    return { session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
