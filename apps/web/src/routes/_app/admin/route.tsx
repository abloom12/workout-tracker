import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_app/admin')({
  beforeLoad: async () => {
    const { data: session, error } = await authClient.getSession({
      query: { disableCookieCache: true },
    });

    if (error) {
      throw new Error('Unable to verify admin access. Please try again.');
    }

    if (!session) {
      throw redirect({ to: '/login' });
    }

    if (!session.user.role?.split(',').includes('admin')) {
      throw redirect({ to: '/dashboard' });
    }

    return { session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  );
}
