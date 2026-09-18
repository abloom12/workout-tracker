import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { trpc } from '@/lib/trpc';

export const Route = createFileRoute('/')({ component: RouteComponent });

function RouteComponent() {
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Signed out successfully');
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Home</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {session ?
            <>
              <p>Signed in as {session.user.email}</p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/settings">Settings</Link>
                </Button>
                <Button variant="outline" onClick={() => void handleSignOut()}>
                  Sign Out
                </Button>
              </div>
            </>
          : <>
              <p>Welcome. Sign in or create an account to continue.</p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </>
          }

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
