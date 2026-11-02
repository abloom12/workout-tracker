import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowDownToLine,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleDashed,
  Dumbbell,
  Ellipsis,
  GripVertical,
  Layers,
  Link2,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/cardless')({
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

const program = { name: 'Strength & size', split: 'Upper / lower' };

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
      { name: 'Incline dumbbell press', sets: 3, reps: '8–12', rest: '1:30' },
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

function countSets(workout: Workout) {
  return workout.exercises.reduce(
    (total, exercise) => total + exercise.sets,
    0,
  );
}

const addingWorkout =
  workouts.find((workout) => workout.day === 2) ?? workouts[0];
const exerciseCount = workouts.reduce(
  (total, workout) => total + workout.exercises.length,
  0,
);
const programSetCount = workouts.reduce(
  (total, workout) => total + countSets(workout),
  0,
);
const libraryExercises: LibraryExercise[] = [
  { name: 'Incline dumbbell press', detail: 'Chest · Dumbbell' },
  { name: 'Cable fly', detail: 'Chest · Cable' },
  { name: 'Chest-supported row', detail: 'Back · Dumbbell' },
  { name: 'Lat pulldown', detail: 'Back · Cable' },
  { name: 'Face pull', detail: 'Shoulders · Cable' },
  { name: 'Dumbbell curl', detail: 'Biceps · Dumbbell' },
  { name: 'Triceps pushdown', detail: 'Triceps · Cable' },
  { name: 'Hammer curl', detail: 'Biceps · Dumbbell' },
];

// The negative margins cancel the app shell's p-2.5 so the rail sits flush
// against the right and bottom edges of the inset panel. The min height is the
// viewport minus the shell chrome above this page (inset margin, site header,
// shell padding, mockup nav and its gap), so the rail border reaches the
// bottom of the panel even when the content is short.
function RouteComponent() {
  return (
    <div className="bg-background text-foreground -mx-2.5 -mb-2.5 grid min-w-0 lg:min-h-[calc(100dvh-7.875rem)] lg:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-10 px-4.5 pt-4 pb-10 lg:pr-8">
        <ProgramHeader />
        <ProgramItinerary />
        <p className="text-muted-foreground text-[11px]">
          Static concept · Cardless layout. All days stay open. Drag/drop,
          collapse and controls are visual only.
        </p>
      </div>
      <ProgramRail />
    </div>
  );
}

function ProgramHeader() {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <ProgramBreadcrumb />
        <ProgramHeaderActions />
      </div>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {program.name}
          </h1>
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
        <p className="text-muted-foreground text-sm">
          Training program · {program.split}
        </p>
      </div>
    </header>
  );
}

function ProgramBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm">
        <li className="shrink-0">
          <Link
            to="/programs"
            className="hover:text-foreground focus-visible:ring-ring/50 rounded-sm transition-colors outline-none focus-visible:ring-3"
          >
            Programs
          </Link>
        </li>
        <li aria-hidden="true" className="shrink-0">
          /
        </li>
        <li className="min-w-0">
          <span aria-current="page" className="text-foreground block truncate">
            {program.name}
          </span>
        </li>
      </ol>
    </nav>
  );
}

function ProgramHeaderActions() {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Copy link to program"
        title="Copy link"
      >
        <Link2 aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Favourite program"
        aria-pressed={false}
        title="Favourite"
      >
        <Star aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="More program actions"
        aria-haspopup="menu"
        title="More actions"
      >
        <Ellipsis aria-hidden="true" />
      </Button>
    </div>
  );
}

function ProgramItinerary() {
  return (
    <section
      aria-labelledby="cardless-workouts-heading"
      className="@container/itinerary min-w-0"
    >
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2
            id="cardless-workouts-heading"
            className="text-base font-semibold"
          >
            Workouts
          </h2>
          <p className="text-muted-foreground text-xs">
            Drag exercises between days or reorder within a day.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm">
          <Plus aria-hidden="true" />
          Add workout
        </Button>
      </header>
      <div className="relative">
        <span
          aria-hidden="true"
          className="border-border pointer-events-none absolute top-4 bottom-4 left-[15px] border-l-2 border-dashed"
        />
        <ol className="relative flex flex-col gap-8">
          {workouts.map((workout) => (
            <DayStop key={workout.day} workout={workout} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function DayStop({ workout }: { workout: Workout }) {
  const isAddingHere = workout.day === addingWorkout.day;

  return (
    <li className="grid min-w-0 grid-cols-[32px_minmax(0,1fr)] items-start gap-4">
      <span
        aria-hidden="true"
        className={cn(
          'bg-background border-border relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums',
          isAddingHere && 'border-primary bg-primary text-primary-foreground',
        )}
      >
        {workout.day}
      </span>
      <section
        aria-labelledby={`cardless-day-${workout.day}`}
        className="flex min-w-0 flex-col gap-2"
      >
        <DayHeader workout={workout} isAddingHere={isAddingHere} />
        <DayExerciseDropArea workout={workout} isAddingHere={isAddingHere} />
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
  return (
    <header className="flex min-h-8 flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <div className="flex min-w-0 items-center gap-1">
        <h3
          id={`cardless-day-${workout.day}`}
          aria-label={`Day ${workout.day}, ${workout.name}`}
          className="min-w-0"
        >
          <Button
            type="button"
            variant="ghost"
            aria-label={`Select day ${workout.day}, ${workout.name} as the exercise destination`}
            aria-pressed={isAddingHere}
            aria-controls="cardless-exercise-library"
            className={cn(
              'hover:text-primary h-auto max-w-full justify-start rounded-sm p-0 text-left text-sm leading-relaxed font-semibold whitespace-normal hover:bg-transparent dark:hover:bg-transparent',
              isAddingHere && 'text-primary',
            )}
          >
            {workout.name}
          </Button>
        </h3>
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
      <div className="flex shrink-0 items-center gap-1.5">
        <Badge
          variant="secondary"
          className="text-muted-foreground h-6 rounded-md font-normal tabular-nums"
        >
          <ListChecks aria-hidden="true" />
          {workout.exercises.length} exercises · {countSets(workout)} sets
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete day ${workout.day}, ${workout.name}`}
          title="Delete workout"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
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
    <div className="@container/day min-w-0">
      <ItemGroup
        aria-label={`Exercises for ${workout.name}`}
        className="before:bg-border relative gap-2 before:pointer-events-none before:absolute before:top-4 before:bottom-4 before:left-[11px] before:w-px"
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
      <p
        className={cn(
          'mt-3 flex items-center gap-1.5 text-[11px]',
          isAddingHere ? 'text-primary' : 'text-muted-foreground',
        )}
      >
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
  const id = `cardless-day-${day}-exercise-${position}`;

  return (
    <Item
      role="listitem"
      aria-labelledby={`${id}-name`}
      className="grid grid-cols-[24px_minmax(0,1fr)_24px] gap-x-3 gap-y-1 rounded-none border-0 p-0 py-1 @lg/day:grid-cols-[24px_minmax(0,160px)_auto_24px] @3xl/day:grid-cols-[24px_minmax(0,160px)_auto_minmax(0,1fr)_24px]"
    >
      <ItemMedia className="relative z-10 row-start-1 self-center">
        <ExerciseDragHandle
          label={`Drag ${exercise.name} on day ${day} to reorder or move to another day`}
        />
      </ItemMedia>
      <ItemContent className="col-start-2 min-w-0 gap-0">
        <ItemTitle
          id={`${id}-name`}
          className="line-clamp-none cursor-grab text-xs leading-relaxed font-medium active:cursor-grabbing"
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
          className="h-7 w-12 flex-none [appearance:textfield] px-1.5 text-center text-xs tabular-nums md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
      className="bg-background text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing"
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

function ProgramRail() {
  return (
    <aside
      aria-label="Program details and exercise library"
      className="min-w-0 border-t lg:border-t-0 lg:border-l"
    >
      <div className="flex flex-col lg:sticky lg:top-2 lg:h-[calc(100dvh-1rem)]">
        <ProgramDetails />
        <ExerciseLibrary />
      </div>
    </aside>
  );
}

function RailSection({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        'flex flex-col gap-4 border-b px-4.5 py-5 last:border-b-0 lg:px-5',
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2">
        <h2 id={`${id}-heading`} className="text-base font-semibold">
          {title}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-expanded={true}
          aria-controls={`${id}-content`}
          aria-label={`Collapse ${title.toLowerCase()}`}
          className="text-muted-foreground aria-expanded:text-muted-foreground aria-expanded:bg-transparent"
        >
          <ChevronDown aria-hidden="true" className="size-4" />
        </Button>
      </header>
      <div id={`${id}-content`} className="flex min-h-0 flex-1 flex-col gap-4">
        {children}
      </div>
    </section>
  );
}

function ProgramDetails() {
  return (
    <RailSection
      id="cardless-program-details"
      title="Program details"
      className="shrink-0"
    >
      <dl className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-3 gap-y-3.5 text-sm">
        <DetailRow label="Status">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary font-normal"
          >
            <CircleDashed aria-hidden="true" />
            Draft
          </Badge>
        </DetailRow>
        <DetailRow label="Schedule" icon={CalendarDays}>
          {workouts.length} days per week
        </DetailRow>
        <DetailRow label="Split" icon={Layers}>
          {program.split}
        </DetailRow>
        <DetailRow label="Exercises" icon={Dumbbell}>
          {exerciseCount}
        </DetailRow>
        <DetailRow label="Volume" icon={ListChecks}>
          {programSetCount} sets per week
        </DetailRow>
      </dl>
    </RailSection>
  );
}

function DetailRow({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2 tabular-nums">
        {Icon ?
          <Icon aria-hidden="true" className="size-4 shrink-0" />
        : null}
        <span className="min-w-0 truncate">{children}</span>
      </dd>
    </>
  );
}

function ExerciseLibrary() {
  return (
    <RailSection
      id="cardless-exercise-library"
      title="Exercise library"
      className="lg:min-h-0 lg:flex-1"
    >
      <ExerciseLibraryControls />
      <ItemGroup className="max-h-80 min-h-0 flex-1 gap-0 overflow-y-auto lg:max-h-none">
        {libraryExercises.map((exercise) => (
          <ExerciseLibraryRow key={exercise.name} exercise={exercise} />
        ))}
      </ItemGroup>
    </RailSection>
  );
}

function ExerciseLibraryControls() {
  return (
    <div className="flex shrink-0 flex-col gap-3">
      <p className="text-muted-foreground text-xs">
        Drag into any day, or use +.
      </p>
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
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <ArrowRight aria-hidden="true" className="size-3.5" />
        <span>
          Adding to{' '}
          <span className="text-foreground font-semibold">
            {addingWorkout.name}
          </span>
        </span>
      </p>
    </div>
  );
}

function ExerciseLibraryRow({ exercise }: { exercise: LibraryExercise }) {
  return (
    <Item
      role="listitem"
      size="xs"
      className="shrink-0 cursor-grab flex-nowrap gap-2 rounded-none border-0 px-0 py-2.5 active:cursor-grabbing"
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
