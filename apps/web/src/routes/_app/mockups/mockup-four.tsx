import { createFileRoute } from '@tanstack/react-router';
import { ArrowDown, Plus, Search, Trash2 } from 'lucide-react';

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
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/mockup-four')({
  component: RouteComponent,
});

type Exercise = { name: string; sets: number; reps: string };

type Workout = {
  day: number;
  name: string;
  exercises: [Exercise, Exercise, Exercise];
};

const workouts: [Workout, ...Workout[]] = [
  {
    day: 1,
    name: 'Push',
    exercises: [
      { name: 'Bench press', sets: 4, reps: '6–8' },
      { name: 'Incline dumbbell press', sets: 3, reps: '8–12' },
      { name: 'Cable fly', sets: 3, reps: '12–15' },
    ],
  },
  {
    day: 2,
    name: 'Pull',
    exercises: [
      { name: 'Pull-up', sets: 4, reps: '6–10' },
      { name: 'Chest-supported row', sets: 3, reps: '8–12' },
      { name: 'Face pull', sets: 3, reps: '12–15' },
    ],
  },
  {
    day: 3,
    name: 'Legs',
    exercises: [
      { name: 'Back squat', sets: 4, reps: '5–8' },
      { name: 'Romanian deadlift', sets: 3, reps: '8–10' },
      { name: 'Standing calf raise', sets: 3, reps: '12–15' },
    ],
  },
  {
    day: 4,
    name: 'Full body',
    exercises: [
      { name: 'Trap bar deadlift', sets: 3, reps: '5–6' },
      { name: 'Dumbbell bench press', sets: 3, reps: '8–12' },
      { name: 'Seated cable row', sets: 3, reps: '8–12' },
    ],
  },
];

const addingWorkout = workouts.find((workout) => workout.day === 3) ?? workouts[0];
const exerciseCount = workouts.reduce(
  (total, workout) => total + workout.exercises.length,
  0,
);
const suggestedExercises = [
  'Leg press',
  'Leg curl',
  'Bulgarian split squat',
  'Leg extension',
];

function RouteComponent() {
  return (
    <div className="flex min-w-0 flex-col gap-5 p-2">
      <ProgramHeader />
      <ProgramWorksheet />
      <ExercisePicker />
      <p className="text-muted-foreground text-[11px]">
        Static concept · Inputs and buttons are visual only.
      </p>
    </div>
  );
}

function ProgramHeader() {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <p className="text-muted-foreground text-[10px] font-medium tracking-[0.16em] uppercase">
          Program / Weekly worksheet
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Strength foundations
        </h1>
        <p className="text-muted-foreground text-xs">
          Your whole program. Nothing tucked away.
        </p>
      </div>
      <Badge variant="outline" className="h-6 text-[11px] font-normal">
        {workouts.length} days · {exerciseCount} exercises
      </Badge>
    </header>
  );
}

function ProgramWorksheet() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-3">
        <CardTitle>
          <h2 id="worksheet-heading-four" className="text-sm font-semibold">
            Program worksheet
          </h2>
        </CardTitle>
        <CardDescription className="text-xs">
          Every workout stays open. Set prescriptions right in the sheet.
        </CardDescription>
        <CardAction>
          <Button type="button" size="sm">
            <Plus aria-hidden="true" />
            Add day
          </Button>
        </CardAction>
      </CardHeader>
      <div className="min-w-0 overflow-x-auto">
        <table
          aria-labelledby="worksheet-heading-four"
          className="w-full min-w-[820px] border-collapse text-left"
        >
          <caption className="sr-only">
            All workout days with exercise sets and reps. Use a row&apos;s plus
            button to choose where the exercise picker adds an exercise.
          </caption>
          <thead className="bg-muted/40 text-muted-foreground">
            <tr className="border-b">
              <th
                scope="col"
                className="bg-card sticky left-0 z-10 w-36 px-4 py-2 text-[10px] font-medium"
              >
                Day / Workout
              </th>
              {[1, 2, 3].map((position) => (
                <th
                  key={position}
                  scope="col"
                  className="px-3 py-2 text-[10px] font-medium"
                >
                  Exercise {position}
                </th>
              ))}
              <th scope="col" className="w-14 px-3 py-2">
                <span className="sr-only">Add exercise</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <WorkoutRow key={workout.day} workout={workout} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function WorkoutRow({ workout }: { workout: Workout }) {
  const isAddingHere = workout.day === addingWorkout.day;

  return (
    <tr
      className={cn(
        'border-b last:border-b-0',
        isAddingHere && 'bg-primary/[0.035]',
      )}
    >
      <th
        scope="row"
        className={cn(
          'bg-card sticky left-0 z-10 border-r px-4 py-3 align-middle font-normal',
          isAddingHere && 'bg-accent',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-muted-foreground block text-[10px] tracking-wide uppercase">
              Day {workout.day}
            </span>
            <span className="block text-sm font-semibold">{workout.name}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete day ${workout.day}, ${workout.name}`}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive -mr-2"
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
        {isAddingHere && (
          <span className="text-primary mt-1.5 flex items-center gap-1 text-[10px] font-medium">
            <ArrowDown aria-hidden="true" className="size-3" />
            Adding here
          </span>
        )}
      </th>
      {workout.exercises.map((exercise, index) => (
        <td key={exercise.name} className="px-3 py-3 align-middle">
          <ExerciseCell
            exercise={exercise}
            day={workout.day}
            position={index + 1}
          />
        </td>
      ))}
      <td className="px-3 py-3 align-middle">
        <Button
          type="button"
          variant={isAddingHere ? 'default' : 'outline'}
          size="icon-sm"
          aria-label={`Add an exercise to day ${workout.day}, ${workout.name}`}
          aria-controls="exercise-picker-four"
          aria-pressed={isAddingHere}
        >
          <Plus aria-hidden="true" />
        </Button>
      </td>
    </tr>
  );
}

function ExerciseCell({
  exercise,
  day,
  position,
}: {
  exercise: Exercise;
  day: number;
  position: number;
}) {
  const id = `worksheet-four-day-${day}-exercise-${position}`;

  return (
    <FieldSet aria-labelledby={`${id}-name`} className="min-w-0 gap-0">
      <FieldLegend
        id={`${id}-name`}
        className="mb-2 text-xs leading-relaxed font-medium"
      >
        {exercise.name}
      </FieldLegend>
      <div className="grid grid-cols-[52px_72px] gap-2">
        <Field className="gap-1">
          <FieldLabel
            htmlFor={`${id}-sets`}
            className="text-muted-foreground text-[10px] font-normal"
          >
            Sets
          </FieldLabel>
          <Input
            id={`${id}-sets`}
            type="number"
            min={1}
            step={1}
            value={exercise.sets}
            readOnly
            className="bg-background h-7 px-2 text-xs tabular-nums md:text-xs"
          />
        </Field>
        <Field className="gap-1">
          <FieldLabel
            htmlFor={`${id}-reps`}
            className="text-muted-foreground text-[10px] font-normal"
          >
            Reps
          </FieldLabel>
          <Input
            id={`${id}-reps`}
            value={exercise.reps}
            readOnly
            className="bg-background h-7 px-2 text-xs tabular-nums md:text-xs"
          />
        </Field>
      </div>
    </FieldSet>
  );
}

function ExercisePicker() {
  return (
    <Card
      id="exercise-picker-four"
      role="region"
      aria-labelledby="exercise-picker-heading-four"
      size="sm"
      className="gap-3 border-primary/20 border bg-primary/[0.025]"
    >
      <CardHeader>
        <CardTitle>
          <h2 id="exercise-picker-heading-four" className="text-sm font-semibold">
            Add an exercise
          </h2>
        </CardTitle>
        <CardDescription className="text-xs">
          Use a day&apos;s + to choose where it goes, then pick an exercise here.
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-muted-foreground text-[10px]">Adding to</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Day {addingWorkout.day} · {addingWorkout.name}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-start">
        <InputGroup className="bg-background shrink-0 md:w-48">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search exercises…"
            aria-label="Search exercises to add to the worksheet"
            readOnly
          />
        </InputGroup>
        <div className="flex min-w-0 flex-wrap gap-2">
          {suggestedExercises.map((name) => (
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
