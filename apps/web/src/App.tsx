import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import { routeTree } from '@/routeTree.gen';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  context: { queryClient, trpc },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      {import.meta.env.DEV && (
        <TanStackDevtools
          config={{ hideUntilHover: true }}
          plugins={[formDevtoolsPlugin()]}
        />
      )}
    </QueryClientProvider>
  );
}
