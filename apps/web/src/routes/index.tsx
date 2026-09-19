import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { defaultAuthRedirect } from '@/lib/auth-redirect';
import { trpc } from '@/lib/trpc';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (session) {
      throw redirect({ to: defaultAuthRedirect });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Workout Tracker</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Make every workout count. Sign in or create an account to continue.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" size="lg" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button className="flex-1" size="lg" asChild variant="outline">
              <Link to="/signup">Create an account</Link>
            </Button>
          </div>

          <ApiConnectionStatus />
        </CardContent>
      </Card>
    </main>
  );
}

function ApiConnectionStatus() {
  const healthQuery = useQuery(trpc.health.ping.queryOptions());
  const isConnected = healthQuery.data?.ok === true;

  return (
    <div
      className="border-border flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
      aria-live="polite"
    >
      <div>
        <p className="font-medium">API connection</p>
        <p className="text-muted-foreground text-sm">
          {healthQuery.isPending ?
            'Checking API connection…'
          : isConnected ?
            'Fastify and tRPC are connected.'
          : 'API unavailable.'}
        </p>
      </div>
      {healthQuery.isPending ?
        <Badge variant="outline">Checking</Badge>
      : isConnected ?
        <Badge>Connected</Badge>
      : <Button
          size="sm"
          variant="outline"
          onClick={() => void healthQuery.refetch()}
        >
          Retry
        </Button>
      }
    </div>
  );
}
