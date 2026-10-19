import { createFileRoute } from '@tanstack/react-router';
import {
  Dumbbell,
  Pencil,
  Plus,
  Route as RouteIcon,
  Search,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/_app/mockups/mockup-five')({
  component: RouteComponent,
});

type LibraryExercise = { name: string; detail: string };

const libraryExercises = [
  { name: 'Incline dumbbell press', detail: 'Chest · Dumbbell' },
  { name: 'Cable fly', detail: 'Chest · Cable' },
  { name: 'Chest-supported row', detail: 'Back · Dumbbell' },
  { name: 'Lat pulldown', detail: 'Back · Cable' },
  { name: 'Face pull', detail: 'Shoulders · Cable' },
  { name: 'Dumbbell curl', detail: 'Biceps · Dumbbell' },
  { name: 'Triceps pushdown', detail: 'Triceps · Cable' },
  { name: 'Hammer curl', detail: 'Biceps · Dumbbell' },
];

function RouteComponent() {
  return (
    <div className="flex min-w-0 flex-col gap-4 p-2">
      <ProgramHeader />
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <ProgramItinerary />
        <ExerciseLibrary />
      </div>
      <p className="text-muted-foreground text-[11px]">
        Static concept · New-program empty state. Controls are visual only.
      </p>
    </div>
  );
}

function ProgramHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <p className="text-muted-foreground flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] uppercase">
          <RouteIcon aria-hidden="true" className="size-3.5" />
          Training itinerary
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">New program</h1>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Edit program name"
            title="Edit program name"
            className="text-muted-foreground"
          >
            <Pencil aria-hidden="true" />
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Build your program one workout at a time.
        </p>
      </div>
      <Badge variant="outline" className="h-6 text-[11px] font-normal">
        0 workouts · 0 exercises
      </Badge>
    </header>
  );
}

function ProgramItinerary() {
  return (
    <section aria-labelledby="program-workouts-heading" className="min-w-0">
      <Card className="gap-0 p-3 sm:p-4">
        <CardHeader className="mb-3 flex flex-row flex-wrap items-center justify-between gap-3 border-b px-0 pb-3">
          <CardTitle>
            <h2 id="program-workouts-heading">Workouts</h2>
          </CardTitle>
          <Button type="button">
            <Plus aria-hidden="true" />
            Add workout
          </Button>
        </CardHeader>
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyTitle>No workouts yet</EmptyTitle>
            <EmptyDescription>
              Add your first workout to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    </section>
  );
}

function ExerciseLibrary() {
  return (
    <aside
      id="exercise-library-five"
      aria-labelledby="exercise-library-heading-five"
      className="min-w-0 lg:sticky lg:top-4 lg:h-[calc(100dvh-12rem)] lg:min-h-0"
    >
      <Card className="h-full min-h-0 gap-3">
        <ExerciseLibraryHeader />
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <ExerciseLibraryControls />
          <ItemGroup
            aria-label="Exercises"
            className="min-h-0 flex-1 gap-0 overflow-y-auto"
          >
            {libraryExercises.map((exercise) => (
              <ExerciseLibraryRow key={exercise.name} exercise={exercise} />
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </aside>
  );
}

function ExerciseLibraryHeader() {
  return (
    <CardHeader className="shrink-0">
      <CardTitle
        id="exercise-library-heading-five"
        className="flex items-center gap-2 font-semibold"
      >
        <Dumbbell aria-hidden="true" className="size-4" />
        Exercise library
      </CardTitle>
      <CardDescription className="text-xs">
        Browse exercises for your new program.
      </CardDescription>
    </CardHeader>
  );
}

function ExerciseLibraryControls() {
  return (
    <>
      <InputGroup className="shrink-0">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search exercises…"
          aria-label="Search exercises"
          readOnly
        />
      </InputGroup>
      <p className="bg-muted text-muted-foreground shrink-0 rounded-lg px-3 py-2 text-xs">
        Add a workout before adding exercises to your program.
      </p>
      <Separator />
    </>
  );
}

function ExerciseLibraryRow({ exercise }: { exercise: LibraryExercise }) {
  return (
    <Item
      role="listitem"
      size="xs"
      className="shrink-0 flex-nowrap gap-2 px-0 py-3"
    >
      <ItemContent className="min-w-0 gap-1">
        <ItemTitle className="line-clamp-none text-xs leading-relaxed">
          {exercise.name}
        </ItemTitle>
        <ItemDescription className="text-[11px]">
          {exercise.detail}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled
          aria-label={`Add ${exercise.name} to a workout`}
          title="Add a workout first"
        >
          <Plus aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  );
}
