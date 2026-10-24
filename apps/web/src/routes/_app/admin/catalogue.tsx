import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttachmentsTable } from './-components/AttachmentsTable';
import { EquipmentTable } from './-components/EquipmentTable';
import { ExercisesTable } from './-components/ExercisesTable';
import { GripsTable } from './-components/GripsTable';
import { ModifiersTable } from './-components/ModifiersTable';
import { MusclesTable } from './-components/MusclesTable';
import { SetupsTable } from './-components/SetupsTable';

export const Route = createFileRoute('/_app/admin/catalogue')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.query(
        context.trpc.catalogue.exercises.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.setups.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.equipment.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.attachments.list.queryOptions(),
      ),
      context.queryClient.query(
        context.trpc.catalogue.grips.list.queryOptions(),
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
  const { data: setups } = useSuspenseQuery(
    trpc.catalogue.setups.list.queryOptions(),
  );
  const { data: equipment } = useSuspenseQuery(
    trpc.catalogue.equipment.list.queryOptions(),
  );
  const { data: attachments } = useSuspenseQuery(
    trpc.catalogue.attachments.list.queryOptions(),
  );
  const { data: grips } = useSuspenseQuery(
    trpc.catalogue.grips.list.queryOptions(),
  );
  const { data: modifiers } = useSuspenseQuery(
    trpc.catalogue.modifiers.list.queryOptions(),
  );
  const { data: muscles } = useSuspenseQuery(
    trpc.catalogue.muscles.list.queryOptions(),
  );

  const catalogueTabs = [
    {
      value: 'exercises',
      label: 'Exercises',
      content: <ExercisesTable data={exercises} />,
    },
    {
      value: 'setups',
      label: 'Setups',
      content: (
        <SetupsTable
          data={setups}
          options={{ exercises, equipment, grips, attachments }}
        />
      ),
    },
    {
      value: 'equipment',
      label: 'Equipment',
      content: <EquipmentTable data={equipment} />,
    },
    {
      value: 'attachments',
      label: 'Attachments',
      content: <AttachmentsTable data={attachments} />,
    },
    { value: 'grips', label: 'Grips', content: <GripsTable data={grips} /> },
    {
      value: 'modifiers',
      label: 'Modifiers',
      content: <ModifiersTable data={modifiers} />,
    },
    {
      value: 'muscles',
      label: 'Muscles',
      content: <MusclesTable data={muscles} />,
    },
  ];

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
      <Tabs defaultValue="exercises">
        <div className="overflow-x-auto">
          <TabsList aria-label="Catalogue sections">
            {catalogueTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {catalogueTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>{tab.content}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
