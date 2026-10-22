import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
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

const navigation = [
  { label: 'Overview', to: '/admin' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Catalogue', to: '/admin/catalogue' },
] as const;

function RouteComponent() {
  return (
    <section
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby="admin-title"
    >
      <header className="space-y-2">
        <h1 id="admin-title" className="text-3xl font-semibold tracking-tight">
          Administration
        </h1>
        <p className="text-muted-foreground">
          Manage users and the shared exercise catalogue.
        </p>
      </header>
      <nav aria-label="Admin navigation" className="flex flex-wrap gap-2">
        {navigation.map((item) => (
          <Button key={item.to} asChild variant="ghost">
            <Link
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: 'bg-muted text-foreground' }}
              inactiveProps={{ className: 'text-muted-foreground' }}
            >
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Outlet />
    </section>
  );
}
