// import { useState } from 'react';
// import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { GripVertical, Pencil, Search, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  // CardAction,
  // CardContent,
  // CardDescription,
  // CardFooter,
  // CardHeader,
  // CardTitle,
} from '@/components/ui/card';
// import { Empty, EmptyTitle } from '@/components/ui/empty';
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupInput,
// } from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { Workout } from './-test-data';
import { TEST_WORKOUTS } from './-test-data';

export const Route = createFileRoute('/_app/programs/')({
  loader: ({ context }) =>
    context.queryClient.query(context.trpc.exercise.list.queryOptions()),
  pendingComponent: () => <Spinner />,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ProgramBuilder />
      {/*<ExercisePicker />*/}
    </div>
  );
}

function ProgramBuilder() {
  return (
    <Card className="@container/itinerary p-3">
      <div className="relative">
        <span
          aria-hidden="true"
          className="border-border pointer-events-none absolute top-5 bottom-5 left-[19px] border-l-2 border-dashed"
        />

        <ol className="relative flex flex-col gap-3">
          {TEST_WORKOUTS.map((workout) => (
            <WorkoutCard key={workout.day} workout={workout} />
          ))}
        </ol>
      </div>
    </Card>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets,
    0,
  );

  return (
    <li className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-start gap-3">
      <span
        aria-hidden="true"
        className="bg-card border-border relative z-10 flex size-10 items-center justify-center rounded-full border text-sm font-semibold tabular-nums"
      >
        {workout.day}
      </span>

      <section className="grid-cols-[minmax(0, 1fr)_24px] grid">
        <header className="col-start-1 row-start-1">
          <div className="flex items-start justify-between gap-1">
            <h2 aria-label={`Day ${workout.day}, ${workout.name}`}>
              {workout.name}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Edit the name of day ${workout.day}, ${workout.name}`}
              title="Edit workout name"
              className="text-muted-foreground"
            >
              <Pencil aria-hidden="true" />
            </Button>
          </div>
          <p className="text-muted-foreground text-[10px] leading-relaxed tabular-nums">
            {workout.exercises.length} exercises · {totalSets} sets
          </p>
        </header>

        <div className="col-start-1 row-start-2">
          <ItemGroup>
            {workout.exercises.map((exercise, index) => (
              <Item id={index.toString()}>
                <ItemMedia></ItemMedia>
                <ItemContent>
                  <ItemTitle>{exercise.name}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </section>
    </li>
  );
}

function ExercisePicker() {
  return (
    <div>
      <div>Exercises....</div>
    </div>
  );
}
