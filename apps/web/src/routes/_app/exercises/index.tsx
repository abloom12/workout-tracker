import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { Empty, EmptyTitle } from '@/components/ui/empty';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';

export const Route = createFileRoute('/_app/exercises/')({
  loader: ({ context }) =>
    context.queryClient.query(context.trpc.exercise.list.queryOptions()),
  pendingComponent: () => <Spinner />,
  errorComponent: () => <p>Could not load exercises</p>,
  component: RouteComponent,
});

function RouteComponent() {
  const { trpc } = Route.useRouteContext();

  const { data: exercises } = useSuspenseQuery(
    trpc.exercise.list.queryOptions(),
  );

  if (exercises.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No exercises available.</EmptyTitle>
      </Empty>
    );
  }

  return (
    <ItemGroup aria-label="Exercises">
      {exercises.map((exercise) => (
        <Item key={exercise.id} role="listitem" variant="outline">
          <ItemContent>
            <ItemTitle>{exercise.name}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
