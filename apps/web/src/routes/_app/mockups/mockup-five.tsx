import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowDownToLine,
  ArrowRight,
  ChevronDown,
  Dumbbell,
  GripVertical,
  Pencil,
  Plus,
  Route as RouteIcon,
  Search,
  Trash2,
  X,
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
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/mockup-five')({
  component: RouteComponent,
});

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  modifiers?: string[];
};

type Workout = { day: number; name: string; exercises: Exercise[] };

type LibraryExercise = { name: string; detail: string };

const workouts: [Workout, ...Workout[]] = [
  {
    day: 1,
    name: 'Upper strength',
    exercises: [
      {
        name: 'Bench press',
        sets: 4,
        reps: '5–6',
        rest: '3:00',
        modifiers: ['Chains'],
      },
      { name: 'Weighted pull-up', sets: 4, reps: '5–6', rest: '3:00' },
      { name: 'Dumbbell row', sets: 3, reps: '8–10', rest: '1:30' },
    ],
  },
  {
    day: 2,
    name: 'Lower strength',
    exercises: [
      {
        name: 'Back squat',
        sets: 4,
        reps: '5–6',
        rest: '3:00',
        modifiers: ['Pause · 2s'],
      },
      { name: 'Romanian deadlift', sets: 3, reps: '6–8', rest: '2:00' },
      { name: 'Calf raise', sets: 3, reps: '12–15', rest: '1:00' },
    ],
  },
  {
    day: 3,
    name: 'Upper volume',
    exercises: [
      {
        name: 'Incline dumbbell press',
        sets: 3,
        reps: '8–12',
        rest: '1:30',
      },
      { name: 'Lat pulldown', sets: 3, reps: '10–12', rest: '1:30' },
      { name: 'Lateral raise', sets: 3, reps: '12–15', rest: '0:45' },
    ],
  },
  {
    day: 4,
    name: 'Lower volume',
    exercises: [
      { name: 'Leg press', sets: 3, reps: '10–12', rest: '2:00' },
      { name: 'Leg curl', sets: 3, reps: '10–15', rest: '1:00' },
      { name: 'Hip thrust', sets: 3, reps: '8–12', rest: '1:30' },
    ],
  },
];

const addingWorkout = workouts.find((workout) => workout.day === 2) ?? workouts[0];
const exerciseCount = workouts.reduce(
  (total, workout) => total + workout.exercises.length,
  0,
);
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
        Static concept · All days stay open. Drag/drop and controls are visual
        only.
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
          <h1 className="text-2xl font-semibold tracking-tight">Strength & size</h1>
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
          Drag exercises between days or reorder within a day.
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
    <section aria-label="All workout days" className="min-w-0">
      <Card className="@container/itinerary gap-0 px-3 py-3 sm:px-4">
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
        className="grid min-w-0 grid-cols-[minmax(0,1fr)_24px] gap-x-3 gap-y-2 border-b pb-3 @xl/itinerary:grid-cols-[140px_minmax(0,1fr)_24px]"
      >
        <DayHeader workout={workout} isAddingHere={isAddingHere} />
        <DayExerciseDropArea workout={workout} isAddingHere={isAddingHere} />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete day ${workout.day}, ${workout.name}`}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive col-start-2 row-start-1 justify-self-end @xl/itinerary:col-start-3"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </section>
    </li>
  );
}

function DayHeader({
  workout,
  isAddingHere,
}: {
  workout: Workout;
  isAddingHere: boolean;
}) {
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets,
    0,
  );

  return (
    <header className="col-start-1 row-start-1 space-y-0.5 pt-0.5 @xl/itinerary:pr-5">
      <div className="flex items-start justify-between gap-1">
        <h2
          id={`itinerary-five-day-${workout.day}`}
          aria-label={`Day ${workout.day}, ${workout.name}`}
          className="min-w-0"
        >
          <Button
            type="button"
            variant="ghost"
            aria-label={`Select day ${workout.day}, ${workout.name} as the exercise destination`}
            aria-pressed={isAddingHere}
            aria-controls="exercise-library-five"
            className={cn(
              'h-auto max-w-full justify-start rounded-sm p-0 text-left text-sm leading-relaxed font-semibold whitespace-normal',
              isAddingHere && 'text-primary',
            )}
          >
            {workout.name}
          </Button>
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
  );
}

function DayExerciseDropArea({
  workout,
  isAddingHere,
}: {
  workout: Workout;
  isAddingHere: boolean;
}) {
  return (
    <div
      className={cn(
        '@container/day col-start-1 row-start-2 min-w-0 rounded-lg border border-dashed px-2 py-1 @xl/itinerary:col-start-2 @xl/itinerary:row-start-1',
        isAddingHere ? 'border-primary/30 bg-primary/[0.025]' : 'border-border',
      )}
    >
      <ItemGroup
        aria-label={`Exercises for ${workout.name}`}
        className="relative gap-2 before:pointer-events-none before:absolute before:top-4 before:bottom-4 before:left-[11px] before:w-px before:bg-border"
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
      <p className="text-muted-foreground mt-1 flex items-center gap-1.5 border-t border-dashed pt-1.5 pb-0.5 text-[10px]">
        <ArrowDownToLine aria-hidden="true" className="size-3" />
        Drop exercises here
      </p>
    </div>
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
      className="grid grid-cols-[24px_minmax(0,1fr)_24px] gap-x-3 gap-y-1 rounded-none border-0 p-0 py-1 @lg/day:grid-cols-[24px_minmax(0,136px)_auto_24px] @3xl/day:grid-cols-[24px_minmax(0,136px)_auto_minmax(0,1fr)_24px]"
    >
      <ItemMedia className="relative z-10 row-start-1 self-center">
        <ExerciseDragHandle
          label={`Drag ${exercise.name} on day ${day} to reorder or move to another day`}
        />
      </ItemMedia>
      <ItemContent className="col-start-2 min-w-0 gap-0">
        <ItemTitle
          id={`${id}-name`}
          className="cursor-grab line-clamp-none text-xs leading-relaxed font-medium active:cursor-grabbing"
        >
          {exercise.name}
        </ItemTitle>
      </ItemContent>
      <ExercisePrescription exercise={exercise} id={id} />
      <ExerciseModifiers exercise={exercise} day={day} />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`Remove ${exercise.name} from day ${day}`}
        title="Remove exercise"
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive col-start-3 row-start-1 justify-self-end @lg/day:col-start-4 @3xl/day:col-start-5"
      >
        <X aria-hidden="true" />
      </Button>
    </Item>
  );
}

function ExercisePrescription({
  exercise,
  id,
}: {
  exercise: Exercise;
  id: string;
}) {
  return (
    <ItemActions className="col-start-2 row-start-2 min-w-0 flex-wrap justify-start gap-x-4 gap-y-1 @lg/day:col-start-3 @lg/day:row-start-1">
      <Field orientation="horizontal" className="w-auto gap-1.5">
        <Input
          id={`${id}-sets`}
          type="number"
          min={1}
          step={1}
          value={exercise.sets}
          readOnly
          className="h-7 w-12 flex-none px-1.5 text-center text-xs tabular-nums [appearance:textfield] md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
      <Field orientation="horizontal" className="w-auto gap-1.5">
        <Input
          id={`${id}-rest`}
          value={exercise.rest}
          placeholder="mm:ss"
          aria-label={`Rest between sets for ${exercise.name}, in minutes and seconds`}
          readOnly
          className="h-7 w-16 flex-none px-1.5 text-center text-xs tabular-nums md:text-xs"
        />
        <FieldLabel
          htmlFor={`${id}-rest`}
          className="text-muted-foreground text-[10px] font-normal"
        >
          rest
        </FieldLabel>
      </Field>
    </ItemActions>
  );
}

function ExerciseDragHandle({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      title={label}
      className="bg-card text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing"
    >
      <GripVertical aria-hidden="true" className="size-3.5" />
    </Button>
  );
}

function ExerciseModifiers({
  exercise,
  day,
}: {
  exercise: Exercise;
  day: number;
}) {
  return (
    <div
      role="group"
      aria-label={`Modifiers for ${exercise.name} on day ${day}`}
      className="col-start-2 row-start-3 flex min-w-0 flex-wrap items-center gap-1.5 @lg/day:col-span-2 @lg/day:row-start-2 @3xl/day:col-span-1 @3xl/day:col-start-4 @3xl/day:row-start-1 @3xl/day:pl-2"
    >
      {(exercise.modifiers ?? []).map((modifier) => (
        <Button
          key={modifier}
          type="button"
          variant="outline"
          size="xs"
          aria-label={`Edit or remove ${modifier} for ${exercise.name} on day ${day}`}
          className="border-primary/20 bg-primary/5 text-primary gap-1 rounded-full px-2 text-[10px] font-normal"
        >
          {modifier}
          <ChevronDown aria-hidden="true" className="size-3" />
        </Button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        aria-label={`Add a modifier to ${exercise.name} on day ${day}`}
        className="text-muted-foreground gap-1 px-1.5 text-[10px] font-normal"
      >
        <Plus aria-hidden="true" className="size-3" />
        Modifier
      </Button>
    </div>
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
          <ItemGroup className="min-h-0 flex-1 gap-0 overflow-y-auto">
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
        Drag into any day, or use +.
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
      <div className="bg-primary/5 text-primary flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs">
        <ArrowRight aria-hidden="true" className="size-3.5" />
        <span>
          Adding to{' '}
          <span className="font-semibold">{addingWorkout.name}</span>
        </span>
      </div>
      <Separator />
    </>
  );
}

function ExerciseLibraryRow({ exercise }: { exercise: LibraryExercise }) {
  return (
    <Item
      role="listitem"
      size="xs"
      className="shrink-0 cursor-grab flex-nowrap gap-2 px-0 py-3 active:cursor-grabbing"
    >
      <ItemMedia>
        <ExerciseDragHandle
          label={`Drag ${exercise.name} from the library into any workout day`}
        />
      </ItemMedia>
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
          aria-label={`Add ${exercise.name} to ${addingWorkout.name}`}
        >
          <Plus aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  );
}
