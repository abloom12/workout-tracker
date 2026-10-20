import type { DragEndEvent } from '@dnd-kit/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Dumbbell,
  GripVertical,
  Layers2,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/mockup-playground')({
  component: RouteComponent,
});

type Muscle = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core';
type LibraryExercise = {
  id: string;
  name: string;
  muscle: Muscle;
  equipment: string;
};
type Prescription = {
  exerciseId: string;
  sets: number;
  reps: string;
  rest: number;
  modifier?: string;
};
type WorkoutExercise = Prescription & { id: string };
type WorkoutBlock = {
  id: string;
  title?: string;
  exercises: WorkoutExercise[];
};
type Workout = { id: string; name: string; blocks: WorkoutBlock[] };
type BlockTemplate = {
  id: string;
  name: string;
  description: string;
  exercises: Prescription[];
};
type DropPosition = { workoutId: string; index: number };
type History = { current: Workout[]; past: Workout[][] };
type UpdateWorkouts = (transform: (current: Workout[]) => Workout[]) => void;

const muscleColors: Record<Muscle, string> = {
  Chest: 'bg-emerald-500',
  Back: 'bg-sky-500',
  Legs: 'bg-amber-500',
  Shoulders: 'bg-violet-400',
  Arms: 'bg-rose-400',
  Core: 'bg-stone-400',
};
const muscles = Object.keys(muscleColors) as Muscle[];
const libraryExercises: LibraryExercise[] = [
  { id: 'bench', name: 'Bench press', muscle: 'Chest', equipment: 'Barbell' },
  {
    id: 'pullup',
    name: 'Weighted pull-up',
    muscle: 'Back',
    equipment: 'Pull-up bar',
  },
  { id: 'row', name: 'Dumbbell row', muscle: 'Back', equipment: 'Dumbbell' },
  { id: 'squat', name: 'Back squat', muscle: 'Legs', equipment: 'Barbell' },
  {
    id: 'rdl',
    name: 'Romanian deadlift',
    muscle: 'Legs',
    equipment: 'Barbell',
  },
  { id: 'calf', name: 'Calf raise', muscle: 'Legs', equipment: 'Machine' },
  {
    id: 'incline',
    name: 'Incline dumbbell press',
    muscle: 'Chest',
    equipment: 'Dumbbell',
  },
  { id: 'pulldown', name: 'Lat pulldown', muscle: 'Back', equipment: 'Cable' },
  {
    id: 'lateral',
    name: 'Lateral raise',
    muscle: 'Shoulders',
    equipment: 'Dumbbell',
  },
  { id: 'legpress', name: 'Leg press', muscle: 'Legs', equipment: 'Machine' },
  { id: 'legcurl', name: 'Leg curl', muscle: 'Legs', equipment: 'Machine' },
  { id: 'hipthrust', name: 'Hip thrust', muscle: 'Legs', equipment: 'Barbell' },
  { id: 'fly', name: 'Cable fly', muscle: 'Chest', equipment: 'Cable' },
  {
    id: 'supportedrow',
    name: 'Chest-supported row',
    muscle: 'Back',
    equipment: 'Dumbbell',
  },
  {
    id: 'facepull',
    name: 'Face pull',
    muscle: 'Shoulders',
    equipment: 'Cable',
  },
  { id: 'curl', name: 'Dumbbell curl', muscle: 'Arms', equipment: 'Dumbbell' },
  {
    id: 'pushdown',
    name: 'Triceps pushdown',
    muscle: 'Arms',
    equipment: 'Cable',
  },
  { id: 'hammer', name: 'Hammer curl', muscle: 'Arms', equipment: 'Dumbbell' },
  { id: 'deadbug', name: 'Dead bug', muscle: 'Core', equipment: 'Bodyweight' },
  { id: 'plank', name: 'Plank', muscle: 'Core', equipment: 'Bodyweight' },
];
const blockTemplates: BlockTemplate[] = [
  {
    id: 'push-pull',
    name: 'Push / pull pair',
    description: 'Two complementary movements. One superset.',
    exercises: [
      { exerciseId: 'incline', sets: 3, reps: '8–12', rest: 0 },
      { exerciseId: 'supportedrow', sets: 3, reps: '8–12', rest: 90 },
    ],
  },
  {
    id: 'shoulders',
    name: 'Shoulder finisher',
    description: 'A little extra work for the end of an upper day.',
    exercises: [
      { exerciseId: 'lateral', sets: 3, reps: '12–15', rest: 0 },
      { exerciseId: 'facepull', sets: 3, reps: '12–15', rest: 60 },
    ],
  },
  {
    id: 'core',
    name: 'Core finisher',
    description: 'A ready-to-drop, two-exercise core superset.',
    exercises: [
      { exerciseId: 'deadbug', sets: 3, reps: '10 / side', rest: 0 },
      { exerciseId: 'plank', sets: 3, reps: '30 sec', rest: 60 },
    ],
  },
];
const initialWorkouts: Workout[] = [
  {
    id: 'upper-strength',
    name: 'Upper strength',
    blocks: [
      {
        id: 'b1',
        exercises: [
          {
            id: 'e1',
            exerciseId: 'bench',
            sets: 4,
            reps: '5–6',
            rest: 180,
            modifier: 'Chains',
          },
        ],
      },
      {
        id: 'b2',
        exercises: [
          { id: 'e2', exerciseId: 'pullup', sets: 4, reps: '5–6', rest: 180 },
        ],
      },
      {
        id: 'b3',
        exercises: [
          { id: 'e3', exerciseId: 'row', sets: 3, reps: '8–10', rest: 90 },
        ],
      },
    ],
  },
  {
    id: 'lower-strength',
    name: 'Lower strength',
    blocks: [
      {
        id: 'b4',
        exercises: [
          {
            id: 'e4',
            exerciseId: 'squat',
            sets: 4,
            reps: '5–6',
            rest: 180,
            modifier: 'Pause · 2s',
          },
        ],
      },
      {
        id: 'b5',
        exercises: [
          { id: 'e5', exerciseId: 'rdl', sets: 3, reps: '6–8', rest: 120 },
        ],
      },
      {
        id: 'b6',
        exercises: [
          { id: 'e6', exerciseId: 'calf', sets: 3, reps: '12–15', rest: 60 },
        ],
      },
    ],
  },
  {
    id: 'upper-volume',
    name: 'Upper volume',
    blocks: [
      {
        id: 'b7',
        exercises: [
          { id: 'e7', exerciseId: 'incline', sets: 3, reps: '8–12', rest: 90 },
        ],
      },
      {
        id: 'b8',
        exercises: [
          {
            id: 'e8',
            exerciseId: 'pulldown',
            sets: 3,
            reps: '10–12',
            rest: 90,
          },
        ],
      },
      {
        id: 'b9',
        title: 'Shoulder finisher',
        exercises: [
          { id: 'e9', exerciseId: 'lateral', sets: 3, reps: '12–15', rest: 0 },
          {
            id: 'e10',
            exerciseId: 'facepull',
            sets: 3,
            reps: '12–15',
            rest: 60,
          },
        ],
      },
    ],
  },
  {
    id: 'lower-volume',
    name: 'Lower volume',
    blocks: [
      {
        id: 'b10',
        exercises: [
          {
            id: 'e11',
            exerciseId: 'legpress',
            sets: 3,
            reps: '10–12',
            rest: 120,
          },
        ],
      },
      {
        id: 'b11',
        exercises: [
          {
            id: 'e12',
            exerciseId: 'legcurl',
            sets: 3,
            reps: '10–15',
            rest: 60,
          },
        ],
      },
      {
        id: 'b12',
        exercises: [
          {
            id: 'e13',
            exerciseId: 'hipthrust',
            sets: 3,
            reps: '8–12',
            rest: 90,
          },
        ],
      },
    ],
  },
];

function getExercise(id: string) {
  return libraryExercises.find((exercise) => exercise.id === id);
}

function getExercises(workout: Workout) {
  return workout.blocks.flatMap((block) => block.exercises);
}

function getSets(exercises: WorkoutExercise[]) {
  return exercises.reduce((total, exercise) => total + exercise.sets, 0);
}

function getMuscleSets(exercises: WorkoutExercise[]) {
  return muscles.map((muscle) => ({
    muscle,
    sets: getSets(
      exercises.filter(
        (exercise) => getExercise(exercise.exerciseId)?.muscle === muscle,
      ),
    ),
  }));
}

function estimateMinutes(workout: Workout) {
  const exercises = getExercises(workout);
  if (!exercises.length) return 0;
  // A rough layout aid: five-minute warm-up, 40 seconds per set, prescribed
  // between-set rests, and one minute to change exercises. Not a time target.
  return Math.round(
    5 +
      exercises.reduce(
        (seconds, exercise) =>
          seconds +
          exercise.sets * 40 +
          Math.max(0, exercise.sets - 1) * exercise.rest +
          60,
        0,
      ) /
        60,
  );
}

function cloneBlock(block: WorkoutBlock): WorkoutBlock {
  return {
    ...block,
    id: crypto.randomUUID(),
    exercises: block.exercises.map((exercise) => ({
      ...exercise,
      id: crypto.randomUUID(),
    })),
  };
}

function blockFromSource(
  sourceId: string,
  workouts: Workout[],
): WorkoutBlock | undefined {
  if (sourceId.startsWith('library:')) {
    const exercise = getExercise(sourceId.slice(8));
    if (!exercise) return;
    return {
      id: crypto.randomUUID(),
      exercises: [
        {
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
          sets: 3,
          reps: '8–12',
          rest: 90,
        },
      ],
    };
  }
  if (sourceId.startsWith('template:')) {
    const template = blockTemplates.find(
      (block) => block.id === sourceId.slice(9),
    );
    if (!template) return;
    return {
      id: crypto.randomUUID(),
      title: template.name,
      exercises: template.exercises.map((exercise) => ({
        ...exercise,
        id: crypto.randomUUID(),
      })),
    };
  }
  return workouts
    .flatMap((workout) => workout.blocks)
    .find((block) => `placed:${block.id}` === sourceId);
}

function placeBlock(
  workouts: Workout[],
  block: WorkoutBlock,
  position: DropPosition,
) {
  const destination = workouts.find(
    (workout) => workout.id === position.workoutId,
  );
  if (!destination) return workouts;
  const oldIndex = destination.blocks.findIndex(
    (candidate) => candidate.id === block.id,
  );
  if (
    oldIndex !== -1 &&
    (position.index === oldIndex || position.index === oldIndex + 1)
  )
    return workouts;
  const insertionIndex =
    oldIndex !== -1 && oldIndex < position.index ?
      position.index - 1
    : position.index;
  return workouts.map((workout) => {
    const blocks = workout.blocks.filter(
      (candidate) => candidate.id !== block.id,
    );
    if (workout.id === position.workoutId)
      blocks.splice(insertionIndex, 0, block);
    return { ...workout, blocks };
  });
}

function RouteComponent() {
  const [history, setHistory] = useState<History>({
    current: initialWorkouts,
    past: [],
  });
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const workouts = history.current;
  const exercises = workouts.flatMap(getExercises);

  const updateWorkouts: UpdateWorkouts = (transform) => {
    setHistory((previous) => {
      const current = transform(previous.current);
      return current === previous.current ?
          previous
        : { current, past: [...previous.past.slice(-29), previous.current] };
    });
  };

  function addWorkout() {
    const workout: Workout = {
      id: crypto.randomUUID(),
      name: 'New workout',
      blocks: [],
    };
    updateWorkouts((current) => [...current, workout]);
    setAnnouncement('New workout added at the end of the cycle.');
  }

  function handleDrop(event: DragEndEvent) {
    setDragSource(null);
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target) return;
    const workoutId: unknown = target.data.workoutId;
    const index: unknown = target.data.index;
    if (
      !String(target.id).startsWith('slot:') ||
      typeof workoutId !== 'string' ||
      !workoutId ||
      typeof index !== 'number' ||
      !Number.isInteger(index) ||
      index < 0
    )
      return;
    const workout = workouts.find((candidate) => candidate.id === workoutId);
    if (!workout || index > workout.blocks.length) return;
    const block = blockFromSource(String(source.id), workouts);
    if (!block) return;
    updateWorkouts((current) =>
      placeBlock(current, block, { workoutId, index }),
    );
    setAnnouncement(
      `${block.title ?? getExercise(block.exercises[0]?.exerciseId ?? '')?.name ?? 'Exercise'} placed in ${workout.name}.`,
    );
  }

  function undo() {
    setHistory((previous) => {
      const current = previous.past.at(-1);
      return current ? { current, past: previous.past.slice(0, -1) } : previous;
    });
    setAnnouncement('Last workout edit undone.');
  }

  return (
    <DragDropProvider
      onDragStart={(event) =>
        setDragSource(String(event.operation.source?.id ?? ''))
      }
      onDragOver={(event) => {
        const { source, target } = event.operation;
        console.debug('[mockup dnd] target changed', {
          sourceId: source?.id ?? null,
          targetId: target?.id ?? null,
        });
      }}
      onDragEnd={handleDrop}
    >
      <div className="dark:border-border dark:bg-muted/15 w-full min-w-0 space-y-7 rounded-2xl border border-stone-200/70 bg-stone-50/70 p-3 sm:p-5 xl:p-7">
        <ProgramHeader
          workoutCount={workouts.length}
          exerciseCount={exercises.length}
          setCount={getSets(exercises)}
          canUndo={history.past.length > 0}
          onUndo={undo}
          onReset={() => {
            updateWorkouts(() => initialWorkouts);
            setAnnouncement('Example workouts restored.');
          }}
        />
        <CycleOverview workouts={workouts} onAddWorkout={addWorkout} />
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px] xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <section
            aria-labelledby="workouts-heading"
            className="order-2 min-w-0 lg:order-1"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 id="workouts-heading" className="text-sm font-semibold">
                  Your workouts
                </h2>
                <Badge
                  variant="secondary"
                  className="rounded-md font-mono text-[10px]"
                >
                  {String(workouts.length).padStart(2, '0')}
                </Badge>
              </div>
              <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                <GripVertical aria-hidden="true" className="size-3.5" />
                Reorder within or move between workouts
              </span>
            </div>
            <div className="dark:before:border-border relative space-y-5 before:absolute before:top-6 before:bottom-6 before:left-[15px] before:border-l before:border-dashed before:border-stone-300 sm:before:left-[19px]">
              {workouts.map((workout, index) => (
                <WorkoutStop
                  key={workout.id}
                  workout={workout}
                  index={index}
                  dragging={dragSource !== null}
                  updateWorkouts={updateWorkouts}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addWorkout}
              className="mt-5 h-11 w-full border-dashed bg-transparent text-xs shadow-none"
            >
              <Plus aria-hidden="true" /> Add another workout
            </Button>
          </section>
          <aside className="order-1 min-w-0 space-y-4 lg:sticky lg:top-4 lg:order-2">
            <ExerciseLibrary />
            <ProgramBalance exercises={exercises} />
          </aside>
        </div>
        <footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-[10px]">
          <span className="flex items-center gap-1.5">
            <RouteIcon aria-hidden="true" className="size-3" /> A program is a
            sequence, not a calendar. Repeat at your own pace.
          </span>
          <span>Playground only · Changes reset when you leave</span>
        </footer>
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
      <DragOverlay dropAnimation={null}>
        {dragSource ?
          <DragPreview sourceId={dragSource} workouts={workouts} />
        : null}
      </DragOverlay>
    </DragDropProvider>
  );
}

function ProgramHeader({
  workoutCount,
  exerciseCount,
  setCount,
  canUndo,
  onUndo,
  onReset,
}: {
  workoutCount: number;
  exerciseCount: number;
  setCount: number;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-5">
      <div>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-900 text-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400">
            <RouteIcon aria-hidden="true" className="size-4" />
          </span>
          <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase">
            Program studio
          </span>
          <span className="h-3 border-l" />
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
            Local draft
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Strength <span className="text-muted-foreground font-normal">&</span>{' '}
          size<span className="text-emerald-600">.</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          A little structure. Room to make it yours.
        </p>
      </div>
      <div className="flex flex-col items-start gap-4 sm:items-end">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canUndo}
            onClick={onUndo}
            className="text-xs"
          >
            <Undo2 aria-hidden="true" /> Undo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="bg-card text-xs"
          >
            <RotateCcw aria-hidden="true" /> Reset example
          </Button>
        </div>
        <div className="text-muted-foreground flex items-center gap-4 text-[11px] tabular-nums">
          <span>
            <strong className="text-foreground font-semibold">
              {workoutCount}
            </strong>{' '}
            workouts
          </span>
          <span>
            <strong className="text-foreground font-semibold">
              {exerciseCount}
            </strong>{' '}
            exercises
          </span>
          <span>
            <strong className="text-foreground font-semibold">
              {setCount}
            </strong>{' '}
            sets / cycle
          </span>
        </div>
      </div>
    </header>
  );
}

function CycleOverview({
  workouts,
  onAddWorkout,
}: {
  workouts: Workout[];
  onAddWorkout: () => void;
}) {
  return (
    <section
      aria-labelledby="cycle-heading"
      className="dark:border-border border-y border-stone-200/80 py-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2
          id="cycle-heading"
          className="text-muted-foreground text-[10px] font-semibold tracking-[0.14em] uppercase"
        >
          The cycle at a glance
        </h2>
        <span className="text-muted-foreground text-[10px]">
          Select a workout to jump in{' '}
          <ArrowDown aria-hidden="true" className="ml-1 inline size-3" />
        </span>
      </div>
      <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
        {workouts.map((workout, index) => (
          <Button
            key={workout.id}
            type="button"
            variant="ghost"
            onClick={() =>
              document
                .getElementById(`workout-${workout.id}`)
                ?.scrollIntoView({
                  behavior:
                    (
                      window.matchMedia('(prefers-reduced-motion: reduce)')
                        .matches
                    ) ?
                      'instant'
                    : 'smooth',
                  block: 'start',
                })
            }
            className="bg-card hover:bg-card h-auto min-w-36 flex-1 flex-col items-stretch gap-3 rounded-xl border border-transparent p-3 text-left whitespace-normal shadow-xs hover:border-emerald-600/30 sm:min-w-40"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground font-mono text-[10px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="text-muted-foreground size-3"
              />
            </div>
            <div>
              <span className="block text-xs font-semibold">
                {workout.name || 'Untitled workout'}
              </span>
              <span className="text-muted-foreground mt-1 block text-[10px] font-normal">
                {getExercises(workout).length} exercises ·{' '}
                {getSets(getExercises(workout))} sets
              </span>
            </div>
            <MuscleStrip exercises={getExercises(workout)} />
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={onAddWorkout}
          aria-label="Add a workout to the cycle"
          className="h-auto min-h-28 w-11 shrink-0 border-dashed bg-transparent shadow-none"
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

function MuscleStrip({ exercises }: { exercises: WorkoutExercise[] }) {
  const total = getSets(exercises);
  return (
    <div
      aria-hidden="true"
      className="bg-muted flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full"
    >
      {getMuscleSets(exercises)
        .filter(({ sets }) => sets > 0)
        .map(({ muscle, sets }) => (
          <span
            key={muscle}
            className={cn('h-full rounded-full', muscleColors[muscle])}
            style={{ width: `${(sets / total) * 100}%` }}
          />
        ))}
    </div>
  );
}

function WorkoutStop({
  workout,
  index,
  dragging,
  updateWorkouts,
}: {
  workout: Workout;
  index: number;
  dragging: boolean;
  updateWorkouts: UpdateWorkouts;
}) {
  const exercises = getExercises(workout);

  function duplicateWorkout() {
    const duplicate: Workout = {
      ...workout,
      id: crypto.randomUUID(),
      name: `${workout.name} copy`,
      blocks: workout.blocks.map(cloneBlock),
    };
    updateWorkouts((current) => {
      const next = [...current];
      next.splice(
        current.findIndex((candidate) => candidate.id === workout.id) + 1,
        0,
        duplicate,
      );
      return next;
    });
  }

  return (
    <div
      id={`workout-${workout.id}`}
      className="relative grid min-w-0 scroll-mt-5 grid-cols-[32px_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-3"
    >
      <span className="dark:border-border dark:bg-background relative z-10 mt-5 flex size-8 items-center justify-center rounded-full border border-stone-300 bg-stone-50 font-mono text-[11px] font-medium sm:size-10">
        {String(index + 1).padStart(2, '0')}
      </span>
      <Card className="dark:ring-border @container/workout min-w-0 gap-0 py-0 shadow-xs ring-stone-200/80">
        <CardHeader className="dark:bg-muted/20 flex flex-row items-start justify-between gap-2 border-b bg-stone-50/50 px-3 py-3 @xl/workout:px-4">
          <div className="min-w-0 flex-1">
            <Input
              aria-label={`Workout ${index + 1} name`}
              value={workout.name}
              onChange={(event) => {
                const name = event.target.value;
                updateWorkouts((current) =>
                  current.map((candidate) =>
                    candidate.id === workout.id ?
                      { ...candidate, name }
                    : candidate,
                  ),
                );
              }}
              className="hover:bg-muted/70 -ml-1 h-7 w-full min-w-0 rounded-md border-transparent bg-transparent px-1 text-sm font-semibold shadow-none md:text-sm"
            />
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] tabular-nums">
              <span>{exercises.length} exercises</span>
              <span>{getSets(exercises)} sets</span>
              <span
                className="flex items-center gap-1"
                title="Rough estimate including a five-minute warm-up, 40 seconds per set, rest, and exercise transitions"
              >
                <Clock3 aria-hidden="true" className="size-3" /> ~
                {estimateMinutes(workout)} min
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Options for ${workout.name}`}
                className="text-muted-foreground"
              >
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={duplicateWorkout}>
                <Copy aria-hidden="true" /> Duplicate workout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() =>
                  updateWorkouts((current) =>
                    current.filter((candidate) => candidate.id !== workout.id),
                  )
                }
              >
                <Trash2 aria-hidden="true" /> Delete workout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-2 pt-1 pb-3 @xl/workout:px-3">
          {workout.blocks.map((block, blockIndex) => (
            <div key={block.id}>
              <DropSlot
                id={`slot:${workout.id}:before:${block.id}`}
                workoutId={workout.id}
                index={blockIndex}
                dragging={dragging}
              />
              <PlacedBlock
                block={block}
                workout={workout}
                index={blockIndex}
                updateWorkouts={updateWorkouts}
              />
            </div>
          ))}
          <DropSlot
            id={`slot:${workout.id}:end`}
            workoutId={workout.id}
            index={workout.blocks.length}
            dragging={dragging}
            isLast
            isEmpty={!workout.blocks.length}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function DropSlot({
  id,
  workoutId,
  index,
  dragging,
  isLast = false,
  isEmpty = false,
}: {
  id: string;
  workoutId: string;
  index: number;
  dragging: boolean;
  isLast?: boolean;
  isEmpty?: boolean;
}) {
  const { ref, isDropTarget } = useDroppable({
    id,
    data: { workoutId, index },
  });
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center justify-center rounded-lg transition-colors',
        isLast ? 'mt-3 min-h-10 border border-dashed' : 'h-3.5',
        isEmpty && 'min-h-28',
        isLast && !isDropTarget && 'border-border text-muted-foreground',
        dragging &&
          isLast &&
          'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400',
        isDropTarget &&
          isLast &&
          'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      )}
    >
      {isLast ?
        <span className="pointer-events-none flex items-center gap-2 px-2 text-center text-[10px]">
          <ArrowDownToLine aria-hidden="true" className="size-3.5" />
          {isDropTarget ?
            'Release to place here'
          : isEmpty ?
            'Your next workout starts with one exercise. Drop it here.'
          : 'Drop an exercise or a block here'}
        </span>
      : <span
          className={cn(
            'pointer-events-none absolute inset-x-1 h-px rounded-full',
            dragging && 'bg-emerald-500/15',
            isDropTarget && 'h-0.5 bg-emerald-500',
          )}
        >
          {isDropTarget && (
            <>
              <span className="bg-card absolute -top-1 -left-1 size-2.5 rounded-full border-2 border-emerald-500" />
              <span className="absolute right-0 -translate-y-1/2 rounded-full bg-emerald-700 px-2 py-0.5 text-[9px] font-medium text-white">
                Insert here
              </span>
            </>
          )}
        </span>
      }
    </div>
  );
}

function PlacedBlock({
  block,
  workout,
  index,
  updateWorkouts,
}: {
  block: WorkoutBlock;
  workout: Workout;
  index: number;
  updateWorkouts: UpdateWorkouts;
}) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: `placed:${block.id}`,
  });
  const isSuperset = block.exercises.length > 1;

  function updateExercise(exerciseId: string, patch: Partial<Prescription>) {
    updateWorkouts((current) =>
      current.map((candidate) =>
        candidate.id !== workout.id ?
          candidate
        : {
            ...candidate,
            blocks: candidate.blocks.map((candidateBlock) =>
              candidateBlock.id !== block.id ?
                candidateBlock
              : {
                  ...candidateBlock,
                  exercises: candidateBlock.exercises.map((exercise) =>
                    exercise.id === exerciseId ?
                      { ...exercise, ...patch }
                    : exercise,
                  ),
                },
            ),
          },
      ),
    );
  }

  function removeExercise(exerciseId: string) {
    updateWorkouts((current) =>
      current.map((candidate) =>
        candidate.id !== workout.id ?
          candidate
        : {
            ...candidate,
            blocks: candidate.blocks
              .map((candidateBlock) =>
                candidateBlock.id === block.id ?
                  {
                    ...candidateBlock,
                    exercises: candidateBlock.exercises.filter(
                      (exercise) => exercise.id !== exerciseId,
                    ),
                  }
                : candidateBlock,
              )
              .filter((candidateBlock) => candidateBlock.exercises.length > 0),
          },
      ),
    );
  }

  function move(direction: -1 | 1) {
    updateWorkouts((current) =>
      placeBlock(current, block, {
        workoutId: workout.id,
        index: direction === -1 ? index - 1 : index + 2,
      }),
    );
  }

  function duplicate() {
    const copy = cloneBlock(block);
    updateWorkouts((current) =>
      placeBlock(current, copy, { workoutId: workout.id, index: index + 1 }),
    );
  }

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Options for ${block.title ?? getExercise(block.exercises[0]?.exerciseId ?? '')?.name ?? 'exercise'}`}
          className="text-muted-foreground"
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem disabled={index === 0} onSelect={() => move(-1)}>
          <ArrowUp aria-hidden="true" /> Move up
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={index === workout.blocks.length - 1}
          onSelect={() => move(1)}
        >
          <ArrowDown aria-hidden="true" /> Move down
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={duplicate}>
          <Copy aria-hidden="true" /> Duplicate{' '}
          {isSuperset ? 'superset' : 'exercise'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() =>
            updateWorkouts((current) =>
              current.map((candidate) =>
                candidate.id === workout.id ?
                  {
                    ...candidate,
                    blocks: candidate.blocks.filter(
                      (candidateBlock) => candidateBlock.id !== block.id,
                    ),
                  }
                : candidate,
              ),
            )
          }
        >
          <Trash2 aria-hidden="true" /> Remove{' '}
          {isSuperset ? 'superset' : 'exercise'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div
      ref={ref}
      className={cn(
        'bg-card rounded-lg border',
        isSuperset ?
          'border-amber-300/60 dark:border-amber-600/30'
        : 'border-border/80',
        isDragging && 'opacity-30',
      )}
    >
      {isSuperset && (
        <div className="flex items-center gap-2 rounded-t-lg border-b border-amber-200/60 bg-amber-50/70 px-2 py-2 dark:border-amber-600/20 dark:bg-amber-500/5">
          <DragHandle
            handleRef={handleRef}
            label={`Drag ${block.title ?? 'superset'} as a group`}
          />
          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-[9px] font-semibold tracking-wider text-amber-800 uppercase dark:text-amber-400">
              <Layers2 aria-hidden="true" className="size-3" /> Superset
            </span>
            <span className="mt-0.5 block truncate text-[11px] font-medium">
              {block.title ?? 'Exercise pair'}
            </span>
          </div>
          <span className="text-muted-foreground hidden text-[9px] @sm/workout:inline">
            Moves together
          </span>
          {actions}
        </div>
      )}
      <div className={cn(isSuperset && 'divide-border/60 divide-y')}>
        {block.exercises.map((exercise, exerciseIndex) => (
          <WorkoutExerciseRow
            key={exercise.id}
            exercise={exercise}
            leading={
              isSuperset ?
                <span className="text-muted-foreground flex size-6 items-center justify-center font-mono text-[10px]">
                  A{exerciseIndex + 1}
                </span>
              : <DragHandle
                  handleRef={handleRef}
                  label={`Drag ${getExercise(exercise.exerciseId)?.name ?? 'exercise'} to reorder or move`}
                />
            }
            trailing={
              isSuperset ?
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${getExercise(exercise.exerciseId)?.name ?? 'exercise'} from superset`}
                  onClick={() => removeExercise(exercise.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X aria-hidden="true" className="size-3" />
                </Button>
              : actions
            }
            onChange={(patch) => updateExercise(exercise.id, patch)}
          />
        ))}
      </div>
    </div>
  );
}

function DragHandle({
  handleRef,
  label,
}: {
  handleRef: (element: Element | null) => void;
  label: string;
}) {
  return (
    <Button
      ref={handleRef}
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      title={`${label}. Space to pick up, arrow keys to move, Space to drop, Escape to cancel.`}
      className="text-muted-foreground/70 hover:text-foreground cursor-grab touch-none p-0 active:cursor-grabbing [&>svg]:size-5"
    >
      <GripVertical aria-hidden="true" className="size-5" />
    </Button>
  );
}

function WorkoutExerciseRow({
  exercise,
  leading,
  trailing,
  onChange,
}: {
  exercise: WorkoutExercise;
  leading: ReactNode;
  trailing: ReactNode;
  onChange: (patch: Partial<Prescription>) => void;
}) {
  const definition = getExercise(exercise.exerciseId);
  return (
    <div className="grid min-w-0 grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-x-2 gap-y-2 p-2.5 @xl/workout:grid-cols-[24px_minmax(0,1fr)_210px_24px] @xl/workout:gap-x-3">
      <div className="self-center">{leading}</div>
      <div className="min-w-0">
        <p className="text-xs leading-relaxed font-medium">
          {definition?.name}
        </p>
        <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-[10px]">
          <span
            aria-hidden="true"
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              definition && muscleColors[definition.muscle],
            )}
          />
          {definition?.muscle} <span className="opacity-50">/</span>{' '}
          {definition?.equipment}
        </p>
        <ModifierControl exercise={exercise} onChange={onChange} />
      </div>
      <ExercisePrescription
        exercise={exercise}
        name={definition?.name ?? 'exercise'}
        onChange={onChange}
      />
      <div className="col-start-3 row-start-1 justify-self-end @xl/workout:col-start-4">
        {trailing}
      </div>
    </div>
  );
}

function ModifierControl({
  exercise,
  onChange,
}: {
  exercise: WorkoutExercise;
  onChange: (patch: Partial<Prescription>) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          aria-label={`Edit modifier for ${getExercise(exercise.exerciseId)?.name ?? 'exercise'}`}
          className={cn(
            'mt-1 h-5 gap-1 rounded px-1.5 text-[9px] font-normal',
            exercise.modifier ?
              'dark:bg-muted dark:text-muted-foreground bg-stone-100 text-stone-600'
            : 'text-muted-foreground/70',
          )}
        >
          {exercise.modifier ?? 'Modifier'}
          {exercise.modifier ?
            <ChevronDown aria-hidden="true" className="size-2.5" />
          : <Plus aria-hidden="true" className="size-2.5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel className="text-[10px]">
          Exercise modifier
        </DropdownMenuLabel>
        {['Pause · 2s', 'Slow eccentric', 'Chains'].map((modifier) => (
          <DropdownMenuItem
            key={modifier}
            onSelect={() => onChange({ modifier })}
          >
            {modifier}
            {exercise.modifier === modifier && (
              <Check aria-hidden="true" className="ml-auto size-3" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!exercise.modifier}
          onSelect={() => onChange({ modifier: undefined })}
        >
          No modifier
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ExercisePrescription({
  exercise,
  name,
  onChange,
}: {
  exercise: WorkoutExercise;
  name: string;
  onChange: (patch: Partial<Prescription>) => void;
}) {
  return (
    <div className="col-start-2 row-start-2 grid w-full max-w-[240px] grid-cols-[46px_minmax(66px,1fr)_72px] items-end gap-2 @xl/workout:col-start-3 @xl/workout:row-start-1">
      <Field className="gap-1">
        <FieldLabel
          htmlFor={`${exercise.id}-sets`}
          className="text-muted-foreground text-[9px] font-normal"
        >
          Sets
        </FieldLabel>
        <Input
          id={`${exercise.id}-sets`}
          aria-label={`Sets for ${name}`}
          type="number"
          min={1}
          max={20}
          value={exercise.sets}
          onChange={(event) => {
            const sets = event.target.valueAsNumber;
            if (Number.isInteger(sets) && sets >= 1 && sets <= 20)
              onChange({ sets });
          }}
          className="h-7 px-1 text-center text-[11px] tabular-nums shadow-none md:text-[11px]"
        />
      </Field>
      <Field className="gap-1">
        <FieldLabel
          htmlFor={`${exercise.id}-reps`}
          className="text-muted-foreground text-[9px] font-normal"
        >
          Reps / time
        </FieldLabel>
        <Input
          id={`${exercise.id}-reps`}
          aria-label={`Reps or duration for ${name}`}
          value={exercise.reps}
          onChange={(event) => onChange({ reps: event.target.value })}
          className="h-7 px-1 text-center text-[11px] tabular-nums shadow-none md:text-[11px]"
        />
      </Field>
      <Field className="gap-1">
        <FieldLabel
          htmlFor={`${exercise.id}-rest`}
          className="text-muted-foreground text-[9px] font-normal"
        >
          Rest
        </FieldLabel>
        <NativeSelect
          id={`${exercise.id}-rest`}
          aria-label={`Rest after ${name}`}
          size="sm"
          value={exercise.rest}
          onChange={(event) => onChange({ rest: Number(event.target.value) })}
          className="w-full [&>select]:px-1.5 [&>select]:pr-5 [&>select]:text-[11px] [&>select]:tabular-nums [&>svg]:right-1 [&>svg]:size-3"
        >
          {[0, 30, 45, 60, 90, 120, 180].map((rest) => (
            <NativeSelectOption key={rest} value={rest}>
              {rest === 0 ?
                'None'
              : `${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}`
              }
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
    </div>
  );
}

function ExerciseLibrary() {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState('All');
  const visibleExercises = libraryExercises.filter(
    (exercise) =>
      (muscle === 'All' || exercise.muscle === muscle) &&
      `${exercise.name} ${exercise.equipment} ${exercise.muscle}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const visibleTemplates = blockTemplates.filter((template) =>
    `${template.name} ${template.description} ${template.exercises.map((exercise) => getExercise(exercise.exerciseId)?.name).join(' ')}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <Card className="dark:ring-border gap-0 py-0 shadow-xs ring-stone-200/80">
      <CardHeader className="gap-2.5 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Dumbbell
              aria-hidden="true"
              className="size-4 text-emerald-700 dark:text-emerald-400"
            />{' '}
            The library
          </h2>
          <Badge
            variant="outline"
            className="rounded-md text-[9px] font-normal"
          >
            Drag & drop
          </Badge>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Good workouts start with good building blocks.
        </p>
        <InputGroup className="dark:bg-muted/30 h-8 bg-stone-50/70 shadow-none">
          <InputGroupAddon>
            <Search aria-hidden="true" className="size-3.5" />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find an exercise or block…"
            aria-label="Search the exercise and block library"
            className="text-xs md:text-xs"
          />
          {query && (
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Clear library search"
                onClick={() => setQuery('')}
              >
                <X aria-hidden="true" className="size-3" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>
      </CardHeader>
      <Tabs defaultValue="exercises" className="gap-0">
        <TabsList
          variant="line"
          className="mx-4 mb-3 h-8 w-[calc(100%-2rem)] justify-start border-b px-0"
        >
          <TabsTrigger
            value="exercises"
            className="flex-none px-2 pb-2 text-[11px]"
          >
            Exercises{' '}
            <span className="text-muted-foreground font-mono text-[9px]">
              {libraryExercises.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="blocks"
            className="flex-none px-2 pb-2 text-[11px]"
          >
            <Layers2 aria-hidden="true" className="size-3" /> Blocks{' '}
            <span className="text-muted-foreground font-mono text-[9px]">
              {blockTemplates.length}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="exercises" className="min-w-0">
          <div className="mb-2 flex items-center gap-2 px-4">
            <SlidersHorizontal
              aria-hidden="true"
              className="text-muted-foreground size-3"
            />
            <NativeSelect
              aria-label="Filter exercises by primary muscle"
              value={muscle}
              onChange={(event) => setMuscle(event.target.value)}
              size="sm"
              className="flex-1 [&>select]:h-7 [&>select]:border-0 [&>select]:bg-transparent [&>select]:pl-0 [&>select]:text-[11px]"
            >
              <NativeSelectOption value="All">
                All muscle groups
              </NativeSelectOption>
              {muscles.map((group) => (
                <NativeSelectOption key={group} value={group}>
                  {group}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <span className="text-muted-foreground text-[10px] tabular-nums">
              {visibleExercises.length} shown
            </span>
          </div>
          <ItemGroup className="max-h-72 gap-2 overflow-y-auto px-3 pt-1 pb-3 lg:max-h-[min(440px,48dvh)]">
            {visibleExercises.map((exercise) => (
              <LibraryExerciseCard key={exercise.id} exercise={exercise} />
            ))}
            {!visibleExercises.length && (
              <LibraryEmptyState
                onClear={() => {
                  setQuery('');
                  setMuscle('All');
                }}
              />
            )}
          </ItemGroup>
        </TabsContent>
        <TabsContent value="blocks">
          <p className="text-muted-foreground mb-3 px-4 text-[10px] leading-relaxed">
            Ready-made supersets. Drag one in, then make it your own.
          </p>
          <ItemGroup className="max-h-80 gap-3 overflow-y-auto px-3 pt-1 pb-3 lg:max-h-[min(440px,48dvh)]">
            {visibleTemplates.map((template) => (
              <LibraryBlockCard key={template.id} template={template} />
            ))}
            {!visibleTemplates.length && (
              <LibraryEmptyState onClear={() => setQuery('')} />
            )}
          </ItemGroup>
        </TabsContent>
      </Tabs>
      <div className="text-muted-foreground dark:bg-muted/20 flex items-center gap-2 border-t bg-stone-50/70 px-4 py-2.5 text-[9px] leading-relaxed">
        <GripVertical aria-hidden="true" className="size-3.5 shrink-0" />
        <span>
          Grab a handle. Drop into any workout.
          <br />
          <span className="opacity-70">
            Keyboard: Space to pick up, arrows to move.
          </span>
        </span>
      </div>
    </Card>
  );
}

function LibraryExerciseCard({ exercise }: { exercise: LibraryExercise }) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: `library:${exercise.id}`,
  });
  return (
    <Item
      ref={ref}
      role="listitem"
      variant="outline"
      size="xs"
      className={cn(
        'bg-card group flex-nowrap gap-2 rounded-lg px-2 py-3 shadow-xs transition-[border-color,box-shadow] hover:border-emerald-600/35 hover:shadow-sm',
        isDragging && 'opacity-30',
      )}
    >
      <ItemMedia className="group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-center">
        <DragHandle
          handleRef={handleRef}
          label={`Drag ${exercise.name} into a workout`}
        />
      </ItemMedia>
      <ItemContent className="min-w-0 gap-1">
        <ItemTitle className="line-clamp-none text-[11px] leading-relaxed">
          {exercise.name}
        </ItemTitle>
        <ItemDescription className="flex items-center gap-1.5 text-[10px] group-data-[size=xs]/item:text-[10px]">
          <span
            aria-hidden="true"
            className={cn(
              'size-1.5 shrink-0 rounded-full',
              muscleColors[exercise.muscle],
            )}
          />
          {exercise.muscle}
          <span className="opacity-40">/</span>
          {exercise.equipment}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

function LibraryBlockCard({ template }: { template: BlockTemplate }) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: `template:${template.id}`,
  });
  return (
    <Item
      ref={ref}
      role="listitem"
      variant="outline"
      size="xs"
      className={cn(
        'bg-card relative block overflow-hidden rounded-lg border-amber-300/60 p-0 shadow-xs dark:border-amber-600/30',
        isDragging && 'opacity-30',
      )}
    >
      <div className="flex items-center gap-2 border-b border-amber-200/50 bg-amber-50/60 px-2 py-2 dark:border-amber-600/20 dark:bg-amber-500/5">
        <DragHandle
          handleRef={handleRef}
          label={`Drag ${template.name} into a workout`}
        />
        <div className="min-w-0">
          <span className="text-[8px] font-semibold tracking-wider text-amber-800 uppercase dark:text-amber-400">
            Superset block
          </span>
          <ItemTitle className="line-clamp-none text-[11px]">
            {template.name}
          </ItemTitle>
        </div>
        <Layers2
          aria-hidden="true"
          className="mr-1 ml-auto size-3.5 text-amber-700/60 dark:text-amber-400"
        />
      </div>
      <div className="space-y-2 p-3">
        {template.exercises.map((exercise, index) => (
          <div key={exercise.exerciseId} className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-[9px]">
              A{index + 1}
            </span>
            <span className="text-[10px]">
              {getExercise(exercise.exerciseId)?.name}
            </span>
            <span className="text-muted-foreground ml-auto shrink-0 text-[9px] tabular-nums">
              {exercise.sets} × {exercise.reps}
            </span>
          </div>
        ))}
        <p className="text-muted-foreground border-t pt-2 text-[9px] leading-relaxed">
          {template.description}
        </p>
      </div>
    </Item>
  );
}

function LibraryEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <Search aria-hidden="true" className="text-muted-foreground size-5" />
      <p className="text-muted-foreground text-xs">Nothing here just yet.</p>
      <Button type="button" variant="link" size="xs" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}

function ProgramBalance({ exercises }: { exercises: WorkoutExercise[] }) {
  const distribution = getMuscleSets(exercises);
  const maximum = Math.max(1, ...distribution.map(({ sets }) => sets));
  return (
    <Card className="dark:ring-border hidden gap-3 bg-transparent py-4 shadow-none ring-stone-200/80 lg:flex">
      <CardHeader className="gap-1 px-4">
        <h2 className="text-xs font-semibold">The bigger picture</h2>
        <p className="text-muted-foreground text-[10px]">
          Primary muscle sets · per cycle
        </p>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4">
        {distribution.map(({ muscle, sets }) => (
          <div
            key={muscle}
            className="grid grid-cols-[65px_minmax(0,1fr)_22px] items-center gap-3"
          >
            <span className="text-muted-foreground text-[10px]">{muscle}</span>
            <div className="dark:bg-muted h-1.5 overflow-hidden rounded-full bg-stone-200/60">
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none',
                  muscleColors[muscle],
                )}
                style={{ width: `${(sets / maximum) * 100}%` }}
              />
            </div>
            <span className="text-right font-mono text-[10px] tabular-nums">
              {sets}
            </span>
          </div>
        ))}
        <Separator className="my-3" />
        <p className="text-muted-foreground text-[9px] leading-relaxed">
          A composition check, not a score. Compound movements also train
          muscles beyond the primary group shown.
        </p>
      </CardContent>
    </Card>
  );
}

function DragPreview({
  sourceId,
  workouts,
}: {
  sourceId: string;
  workouts: Workout[];
}) {
  const exercise =
    sourceId.startsWith('library:') ?
      getExercise(sourceId.slice(8))
    : undefined;
  const template =
    sourceId.startsWith('template:') ?
      blockTemplates.find((block) => block.id === sourceId.slice(9))
    : undefined;
  const block = workouts
    .flatMap((workout) => workout.blocks)
    .find((candidate) => `placed:${candidate.id}` === sourceId);
  const name =
    exercise?.name ??
    template?.name ??
    (block && block.exercises.length > 1 ?
      (block.title ?? 'Superset')
    : getExercise(block?.exercises[0]?.exerciseId ?? '')?.name);
  const isGroup =
    template !== undefined ||
    (block !== undefined && block.exercises.length > 1);
  return (
    <div className="bg-card text-card-foreground flex w-64 max-w-[80vw] items-center gap-3 rounded-xl border border-emerald-500/60 p-3 shadow-xl ring-4 ring-emerald-500/10">
      <GripVertical
        aria-hidden="true"
        className="size-5 shrink-0 text-emerald-600"
      />
      <div>
        <p className="text-xs font-semibold">{name}</p>
        <p className="text-muted-foreground mt-1 text-[10px]">
          {isGroup ? 'Superset · moves as one block' : 'Exercise'} · Drop into a
          workout
        </p>
      </div>
    </div>
  );
}
