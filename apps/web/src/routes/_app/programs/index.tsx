import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Dumbbell, GripVertical, Search, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Route = createFileRoute('/_app/programs/')({
  loader: ({ context }) =>
    context.queryClient.query(context.trpc.exercise.list.queryOptions()),
  pendingComponent: () => <Spinner />,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Tabs defaultValue="program">
      <TabsList variant="line">
        <TabsTrigger value="program">Program</TabsTrigger>
      </TabsList>

      <TabsContent
        value="program"
        className="grid min-w-0 items-start lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <SplitBuilder />
        <ExercisePicker />
      </TabsContent>
    </Tabs>
  );
}

function SplitBuilder() {
  const [workouts, setWorkouts] = useState<{ id: string }[]>([]);

  function addWorkout() {
    const workout = { id: crypto.randomUUID() };

    setWorkouts((previous) => [...previous, workout]);
  }

  function deleteWorkout(id: string) {
    setWorkouts((previous) => previous.filter((workout) => workout.id !== id));
  }

  return (
    <div className="relative min-w-0">
      <Button type="button" onClick={addWorkout}>
        Add workout
      </Button>

      <ScrollArea type="always" className="w-full">
        <div className="flex w-max items-stretch gap-4 pt-4 pb-6">
          {workouts.length === 0 ?
            <EmptyWorkoutCard />
          : workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                onDelete={() => deleteWorkout(workout.id)}
              />
            ))
          }
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

type WorkoutCardProps = { onDelete: () => void };
function WorkoutCard({ onDelete }: WorkoutCardProps) {
  return (
    <Card className="w-72">
      <CardHeader>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <GripVertical aria-hidden="true" className="size-3.5" />
          Day 1
        </div>
        <CardTitle className="text-lg font-semibold">title</CardTitle>
        <CardDescription className="col-span-2 text-xs">
          description
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            onClick={onDelete}
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash aria-hidden="true" className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent className="min-h-72">
        <ItemGroup>
          <WorkoutExerciseItem />
        </ItemGroup>
      </CardContent>

      <CardFooter>idk yet</CardFooter>
    </Card>
  );
}

function EmptyWorkoutCard() {
  return (
    <Card className="w-72">
      <CardContent className="min-h-72"></CardContent>
    </Card>
  );
}

function WorkoutExerciseItem() {
  return (
    <Item>
      <ItemMedia></ItemMedia>
      <ItemContent></ItemContent>
      <ItemActions></ItemActions>
    </Item>
  );
}

function ExercisePicker() {
  const { trpc } = Route.useRouteContext();

  const { data: exercises } = useSuspenseQuery(
    trpc.exercise.list.queryOptions(),
  );

  return (
    <Card className="h-full min-w-0 lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-semibold">
          <Dumbbell aria-hidden="true" className="size-4" />
          Exercise Library
        </CardTitle>
        <CardDescription className="text-xs">
          Find an exercise. Add it to your split.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <InputGroup>
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search exercises…"
            aria-label="Search exercises"
            readOnly
          />
        </InputGroup>

        <ItemGroup aria-label="Exercises">
          {exercises.map((exercise) => (
            <Item key={exercise.id} role="listitem" variant="outline">
              <ItemContent>
                <ItemTitle>{exercise.name}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
