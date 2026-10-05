import { createFileRoute } from '@tanstack/react-router';
import { Plus, Route as RouteIcon, Search, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/mockup-three')({
  component: RouteComponent,
});

type Exercise = { name: string; sets: number; reps: string };

type Workout = { day: number; name: string; exercises: Exercise[] };

const workouts: [Workout, ...Workout[]] = [
  {
    day: 1,
    name: 'Upper strength',
    exercises: [
      { name: 'Bench press', sets: 4, reps: '5–6' },
      { name: 'Weighted pull-up', sets: 4, reps: '5–6' },
      { name: 'Dumbbell row', sets: 3, reps: '8–10' },
    ],
  },
  {
    day: 2,
    name: 'Lower strength',
    exercises: [
      { name: 'Back squat', sets: 4, reps: '5–6' },
      { name: 'Romanian deadlift', sets: 3, reps: '6–8' },
      { name: 'Calf raise', sets: 3, reps: '12–15' },
    ],
  },
  {
    day: 3,
    name: 'Upper volume',
    exercises: [
      { name: 'Incline dumbbell press', sets: 3, reps: '8–12' },
      { name: 'Lat pulldown', sets: 3, reps: '10–12' },
      { name: 'Lateral raise', sets: 3, reps: '12–15' },
    ],
  },
  {
    day: 4,
    name: 'Lower volume',
    exercises: [
      { name: 'Leg press', sets: 3, reps: '10–12' },
      { name: 'Leg curl', sets: 3, reps: '10–15' },
      { name: 'Hip thrust', sets: 3, reps: '8–12' },
    ],
  },
];

const addingWorkout =
  workouts.find((workout) => workout.day === 2) ?? workouts[0];
const exerciseCount = workouts.reduce(
  (total, workout) => total + workout.exercises.length,
  0,
);
const suggestions = ['Front squat', 'Hack squat', 'Leg curl', 'Walking lunge'];

function RouteComponent() {
  return (
    <div className="flex min-w-0 flex-col gap-4 p-2">
      <ProgramHeader />
      <ProgramItinerary />
      <ExerciseTray />
      <p className="text-muted-foreground text-[11px]">
        Static concept · All days stay open. Inputs and buttons are visual only.
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Strength & size
        </h1>
        <p className="text-muted-foreground text-xs">
          Plan the whole journey. Adjust every exercise right where it lives.
        </p>
      </div>
      <Badge variant="outline" className="h-6 text-[11px] font-normal">
        {workouts.length} days · {exerciseCount} exercises
      </Badge>
    </header>
  );
}

function ProgramItinerary() {
  return (
    <section aria-label="All workout days">
      <Card className="gap-0 px-3 py-3 sm:px-4">
        <div className="relative">
          <span
            aria-hidden="true"
            className="border-border pointer-events-none absolute top-5 bottom-5 left-[19px] border-l-2 border-dashed"
          />
          <ol className="relative flex flex-col gap-3">
            {workouts.map((workout) => (
              <DayStop key={workout.day} workout={workout} />
            ))}
          </ol>
          <Button
            type="button"
            variant="ghost"
            aria-label="Add another workout day"
            className="mt-3 h-auto w-full justify-start gap-3 rounded-xl p-0 text-xs font-medium"
          >
            <span className="bg-card border-border relative flex size-10 shrink-0 items-center justify-center rounded-full border border-dashed">
              <Plus aria-hidden="true" className="size-4" />
            </span>
            Add another day
          </Button>
        </div>
      </Card>
    </section>
  );
}

function DayStop({ workout }: { workout: Workout }) {
  const isAddingHere = workout.day === addingWorkout.day;

  return (
    <li className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-start gap-3">
      <span
        aria-hidden="true"
        className={cn(
          'bg-card border-border relative z-10 flex size-10 items-center justify-center rounded-full border text-sm font-semibold tabular-nums',
          isAddingHere && 'border-primary bg-primary text-primary-foreground',
        )}
      >
        {workout.day}
      </span>
      <section
        aria-labelledby={`itinerary-five-day-${workout.day}`}
        className="grid min-w-0 gap-2 border-b pb-3 md:grid-cols-[156px_minmax(0,1fr)] md:gap-5"
      >
        <header className="space-y-2 pt-0.5">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0 space-y-0.5">
              <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
                Day {workout.day}
              </p>
              <h2
                id={`itinerary-five-day-${workout.day}`}
                aria-label={`Day ${workout.day}, ${workout.name}`}
                className="text-sm leading-relaxed font-semibold"
              >
                {workout.name}
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Delete day ${workout.day}, ${workout.name}`}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
          <Button
            type="button"
            variant={isAddingHere ? 'default' : 'outline'}
            size="xs"
            aria-label={`Add an exercise to day ${workout.day}, ${workout.name}`}
            aria-pressed={isAddingHere}
            aria-controls="exercise-tray-five"
          >
            <Plus aria-hidden="true" />
            Add exercise
          </Button>
        </header>
        <ItemGroup
          aria-label={`Exercises for ${workout.name}`}
          className="before:bg-border @container/day relative gap-0 before:pointer-events-none before:absolute before:top-3.5 before:bottom-3.5 before:left-[5px] before:w-px"
        >
          {workout.exercises.map((exercise, index) => (
            <ExerciseStop
              key={exercise.name}
              exercise={exercise}
              day={workout.day}
              position={index + 1}
            />
          ))}
        </ItemGroup>
      </section>
    </li>
  );
}

function ExerciseStop({
  exercise,
  day,
  position,
}: {
  exercise: Exercise;
  day: number;
  position: number;
}) {
  const id = `itinerary-five-day-${day}-exercise-${position}`;

  return (
    <Item
      role="listitem"
      aria-labelledby={`${id}-name`}
      className="grid grid-cols-[12px_minmax(0,1fr)] gap-x-3 gap-y-1 rounded-none border-0 p-0 py-1 @md/day:grid-cols-[12px_minmax(0,1fr)_auto]"
    >
      <ItemMedia className="bg-card border-border relative z-10 row-start-1 mt-2 size-3 self-start rounded-full border-2" />
      <ItemContent className="col-start-2 min-w-0 gap-0">
        <ItemTitle
          id={`${id}-name`}
          className="line-clamp-none text-xs leading-relaxed font-medium"
        >
          {exercise.name}
        </ItemTitle>
      </ItemContent>
      <ItemActions className="col-start-2 justify-start gap-3 @md/day:col-start-3 @md/day:row-start-1">
        <Field orientation="horizontal" className="w-auto gap-1.5">
          <Input
            id={`${id}-sets`}
            type="number"
            min={1}
            step={1}
            value={exercise.sets}
            readOnly
            className="h-7 w-12 flex-none px-1.5 text-center text-xs tabular-nums md:text-xs"
          />
          <FieldLabel
            htmlFor={`${id}-sets`}
            className="text-muted-foreground text-[10px] font-normal"
          >
            sets
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" className="w-auto gap-1.5">
          <Input
            id={`${id}-reps`}
            value={exercise.reps}
            readOnly
            className="h-7 w-[68px] flex-none px-1.5 text-center text-xs tabular-nums md:text-xs"
          />
          <FieldLabel
            htmlFor={`${id}-reps`}
            className="text-muted-foreground text-[10px] font-normal"
          >
            reps
          </FieldLabel>
        </Field>
      </ItemActions>
    </Item>
  );
}

function ExerciseTray() {
  return (
    <Card
      id="exercise-tray-five"
      role="region"
      aria-labelledby="exercise-tray-heading-five"
      size="sm"
      className="bg-card border-primary/20 sticky bottom-2 z-20 gap-3 border shadow-lg"
    >
      <CardHeader>
        <CardTitle>
          <h2 id="exercise-tray-heading-five" className="text-sm font-semibold">
            Exercise tray
          </h2>
        </CardTitle>
        <CardDescription className="text-xs">
          Choose a day&apos;s Add exercise, then pick a move below.
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-muted-foreground text-[10px]">Adding to</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Day {addingWorkout.day} · {addingWorkout.name}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-start">
        <InputGroup className="shrink-0 md:w-48">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search exercises…"
            aria-label="Search exercises to add to the training itinerary"
            readOnly
          />
        </InputGroup>
        <div className="flex min-w-0 flex-wrap gap-2">
          {suggestions.map((name) => (
            <Button
              key={name}
              type="button"
              variant="outline"
              aria-label={`Add ${name} to day ${addingWorkout.day}, ${addingWorkout.name}`}
              className="gap-2 text-xs"
            >
              {name}
              <Plus aria-hidden="true" className="size-3.5" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
