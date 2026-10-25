import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { ExercisesTable } from './-components/ExercisesTable';

export const Route = createFileRoute('/_app/admin/catalogue')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.query(
        context.trpc.catalogue.exercises.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.equipment.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.attachments.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.exercises.options.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.modifiers.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.muscles.list.queryOptions(),
      ),
    ]),
  pendingComponent: () => <Spinner />,
  errorComponent: CatalogueError,
  component: RouteComponent,
});

function CatalogueError() {
  const router = useRouter();
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Empty>
      <EmptyTitle>Could not load the catalogue.</EmptyTitle>
      <Button
        variant="outline"
        onClick={() => {
          reset();
          void router.invalidate();
        }}
      >
        Retry
      </Button>
    </Empty>
  );
}

function RouteComponent() {
  const { trpc } = Route.useRouteContext();
  const { data: exercises } = useSuspenseQuery(
    trpc.catalogue.exercises.list.queryOptions(),
  );
  const { data: equipment } = useSuspenseQuery(
    trpc.catalogue.equipment.list.queryOptions(),
  );
  const { data: exerciseOptions } = useSuspenseQuery(
    trpc.catalogue.exercises.options.queryOptions(),
  );
  const { data: muscles } = useSuspenseQuery(
    trpc.catalogue.muscles.list.queryOptions(),
  );

  return (
    <section aria-labelledby="admin-catalogue-title" className="space-y-4">
      <div className="space-y-2">
        <h2 id="admin-catalogue-title" className="text-xl font-semibold">
          Catalogue
        </h2>
        <p className="text-muted-foreground">
          Shared definitions used throughout the exercise library.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <ExercisesTable
            data={exercises}
            options={{ ...exerciseOptions, equipment, muscles }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
