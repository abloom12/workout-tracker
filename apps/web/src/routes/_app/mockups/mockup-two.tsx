import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  ChevronRight,
  Dumbbell,
  GripVertical,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from 'lucide-react';

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
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/mockup-two')({
  component: RouteComponent,
});

type WorkoutExercise = {
  name: string;
  detail: string;
  sets: number;
  reps: string;
};

type Workout = {
  day: number;
  name: string;
  focus: string;
  exercises: WorkoutExercise[];
};

const workouts: [Workout, ...Workout[]] = [
  {
    day: 1,
    name: 'Upper A',
    focus: 'Chest & back',
    exercises: [
      { name: 'Bench press', detail: 'Chest · Barbell', sets: 3, reps: '6–8' },
      { name: 'Pull-up', detail: 'Back · Bodyweight', sets: 3, reps: '6–10' },
      { name: 'Dumbbell row', detail: 'Back · Dumbbell', sets: 3, reps: '8–12' },
      {
        name: 'Lateral raise',
        detail: 'Shoulders · Dumbbell',
        sets: 3,
        reps: '12–15',
      },
    ],
  },
  {
    day: 2,
    name: 'Lower A',
    focus: 'Quad emphasis',
    exercises: [
      { name: 'Back squat', detail: 'Quads · Barbell', sets: 3, reps: '6–8' },
      {
        name: 'Romanian deadlift',
        detail: 'Hamstrings · Barbell',
        sets: 3,
        reps: '8–10',
      },
      {
        name: 'Leg curl',
        detail: 'Hamstrings · Machine',
        sets: 3,
        reps: '10–15',
      },
    ],
  },
  {
    day: 3,
    name: 'Upper B',
    focus: 'Shoulders & back',
    exercises: [
      {
        name: 'Overhead press',
        detail: 'Shoulders · Barbell',
        sets: 3,
        reps: '6–8',
      },
      { name: 'Lat pulldown', detail: 'Back · Cable', sets: 3, reps: '8–12' },
      {
        name: 'Incline dumbbell press',
        detail: 'Chest · Dumbbell',
        sets: 3,
        reps: '8–12',
      },
    ],
  },
  {
    day: 4,
    name: 'Lower B',
    focus: 'Glute & hamstring emphasis',
    exercises: [
      { name: 'Hip thrust', detail: 'Glutes · Barbell', sets: 3, reps: '8–12' },
      {
        name: 'Split squat',
        detail: 'Quads · Dumbbell',
        sets: 3,
        reps: '8–12',
      },
      {
        name: 'Calf raise',
        detail: 'Calves · Machine',
        sets: 3,
        reps: '12–20',
      },
    ],
  },
  {
    day: 5,
    name: 'Full body',
    focus: 'A little of everything',
    exercises: [
      {
        name: 'Goblet squat',
        detail: 'Quads · Dumbbell',
        sets: 3,
        reps: '10–12',
      },
      {
        name: 'Push-up',
        detail: 'Chest · Bodyweight',
        sets: 3,
        reps: '10–15',
      },
      { name: 'Cable row', detail: 'Back · Cable', sets: 3, reps: '8–12' },
    ],
  },
];

// A fixed destination keeps this mockup entirely presentational.
const editingWorkout = workouts[0];

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
    <div className="flex min-w-0 flex-col gap-5 p-2 xl:h-[calc(100dvh-8.5rem)] xl:min-h-0">
      <ProgramHeader />
      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_280px] md:gap-6 xl:min-h-0 xl:flex-1 xl:grid-cols-[200px_minmax(0,1fr)_280px] 2xl:grid-cols-[220px_minmax(0,1fr)_300px]">
        <SplitOutline />
        <WorkoutEditor />
        <ExerciseLibrary />
      </div>
    </div>
  );
}

function ProgramHeader() {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Build your split
          </h1>
          <Badge variant="secondary">Draft</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Keep the big picture. Build one workout at a time.
        </p>
      </div>
      <Button type="button">
        Save program
        <ArrowRight aria-hidden="true" />
      </Button>
    </header>
  );
}

function SplitOutline() {
  return (
    <nav
      aria-labelledby="split-outline-heading"
      className="flex min-w-0 flex-col gap-3 md:col-span-2 xl:col-span-1 xl:min-h-0"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 px-1">
        <h2 id="split-outline-heading" className="text-sm font-semibold">
          Your split
          <span className="text-muted-foreground ml-2 font-normal">
            {workouts.length} days
          </span>
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Add workout"
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 xl:min-h-0 xl:flex-col xl:overflow-x-hidden xl:overflow-y-auto xl:px-1">
        {workouts.map((workout) => (
          <WorkoutOutline key={workout.day} workout={workout} />
        ))}
      </div>
    </nav>
  );
}

function WorkoutOutline({ workout }: { workout: Workout }) {
  const isEditing = workout.day === editingWorkout.day;

  return (
    <Button
      type="button"
      variant="ghost"
      aria-current={isEditing ? 'page' : undefined}
      aria-label={`Day ${workout.day}, ${workout.name}`}
      className={cn(
        'h-auto w-48 shrink-0 flex-col items-stretch gap-2.5 rounded-xl border p-3 text-left whitespace-normal xl:w-full',
        isEditing
          ? 'border-primary/25 bg-primary/5 hover:bg-primary/10'
          : 'border-transparent hover:border-border',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] tabular-nums',
              isEditing
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {workout.day}
          </span>
          <span className="text-sm font-semibold">{workout.name}</span>
        </span>
        {isEditing && (
          <ChevronRight aria-hidden="true" className="text-primary size-3.5" />
        )}
      </span>
      <span className="border-border/70 text-muted-foreground ml-2.5 flex flex-col gap-1 border-l pl-4 text-xs font-normal leading-relaxed">
        {workout.exercises.map((exercise) => (
          <span key={exercise.name}>{exercise.name}</span>
        ))}
      </span>
    </Button>
  );
}

function WorkoutEditor() {
  return (
    <section
      aria-labelledby="workout-editor-heading"
      className="min-w-0 xl:min-h-0"
    >
      <Card className="h-full gap-0 xl:min-h-0">
        <CardHeader className="shrink-0 gap-2 px-5 pb-5">
          <p className="text-muted-foreground text-xs font-medium">
            Day {editingWorkout.day}
          </p>
          <CardTitle
            id="workout-editor-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            {editingWorkout.name}
          </CardTitle>
          <CardDescription>{editingWorkout.focus}</CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Workout options"
            >
              <MoreHorizontal aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-4 xl:min-h-0 xl:overflow-y-auto">
          <div className="text-muted-foreground flex items-center gap-2 px-1 text-xs">
            <span>{editingWorkout.exercises.length} exercises</span>
            <span aria-hidden="true">·</span>
            <span>
              {editingWorkout.exercises.reduce(
                (total, exercise) => total + exercise.sets,
                0,
              )}{' '}
              working sets
            </span>
          </div>
          <ItemGroup className="gap-2">
            {editingWorkout.exercises.map((exercise, index) => (
              <WorkoutExerciseRow
                key={exercise.name}
                exercise={exercise}
                position={index + 1}
              />
            ))}
          </ItemGroup>
          <p className="text-muted-foreground mt-auto px-1 pt-8 pb-2 text-xs leading-relaxed">
            Add exercises from the library. Drag the handles to reorder.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function WorkoutExerciseRow({
  exercise,
  position,
}: {
  exercise: WorkoutExercise;
  position: number;
}) {
  const setsId = `mockup-two-exercise-${position}-sets`;
  const repsId = `mockup-two-exercise-${position}-reps`;

  return (
    <Item
      role="listitem"
      variant="outline"
      className="@container/exercise-row block py-4"
    >
      <div className="grid grid-cols-[32px_minmax(0,1fr)_24px] items-center gap-2.5 @[380px]/exercise-row:grid-cols-[32px_minmax(0,1fr)_144px_24px]">
        <ItemMedia className="text-muted-foreground mt-0.5 gap-1">
          <GripVertical aria-hidden="true" className="size-3.5 cursor-grab" />
          <span className="w-3 text-center text-xs tabular-nums">{position}</span>
        </ItemMedia>
        <ItemContent className="min-w-0 gap-1.5">
          <ItemTitle className="line-clamp-none w-full">{exercise.name}</ItemTitle>
          <ItemDescription className="text-xs">{exercise.detail}</ItemDescription>
        </ItemContent>
        <div className="col-start-2 row-start-2 grid w-36 max-w-full grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] gap-2.5 @[380px]/exercise-row:col-start-3 @[380px]/exercise-row:row-start-1">
          <Field className="min-w-0 gap-1">
            <FieldLabel
              htmlFor={setsId}
              className="text-muted-foreground text-[10px] font-normal"
            >
              Sets<span className="sr-only"> for {exercise.name}</span>
            </FieldLabel>
            <Input
              id={setsId}
              defaultValue={exercise.sets}
              readOnly
              className="px-2 text-center tabular-nums"
              inputMode="numeric"
            />
          </Field>
          <Field className="min-w-0 gap-1">
            <FieldLabel
              htmlFor={repsId}
              className="text-muted-foreground text-[10px] font-normal"
            >
              Reps<span className="sr-only"> for {exercise.name}</span>
            </FieldLabel>
            <Input
              id={repsId}
              defaultValue={exercise.reps}
              readOnly
              className="px-2 text-center tabular-nums"
            />
          </Field>
        </div>
        <ItemActions className="col-start-3 row-start-1 @[380px]/exercise-row:col-start-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${exercise.name}`}
          >
            <X aria-hidden="true" />
          </Button>
        </ItemActions>
      </div>
    </Item>
  );
}

function ExerciseLibrary() {
  return (
    <aside
      aria-labelledby="exercise-library-heading"
      className="min-w-0 xl:min-h-0"
    >
      <Card className="h-full gap-3 xl:min-h-0">
        <CardHeader className="shrink-0">
          <CardTitle
            id="exercise-library-heading"
            className="flex items-center gap-2 font-semibold"
          >
            <Dumbbell aria-hidden="true" className="size-4" />
            Exercise library
          </CardTitle>
          <CardDescription className="text-xs">
            Find something for your workout.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 xl:min-h-0">
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
              <span className="font-semibold">{editingWorkout.name}</span>
            </span>
          </div>
          <Separator />
          <ItemGroup className="gap-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
            {libraryExercises.map((exercise) => (
              <Item
                key={exercise.name}
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
                    aria-label={`Add ${exercise.name} to ${editingWorkout.name}`}
                  >
                    <Plus aria-hidden="true" />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </aside>
  );
}
