import type { ReactNode } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, ChevronRight, Layers3, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/split')({
  component: RouteComponent,
});

type Workout = { day: number; name: string; exercises: string[] };

type Variant = 'original' | 'cards' | 'rail' | 'tiles' | 'cartridges';

type Comparison = {
  variant: Variant;
  title: string;
  category: string;
  description: string;
};

const workouts: Workout[] = [
  {
    day: 1,
    name: 'Upper A',
    exercises: ['Bench press', 'Pull-up', 'Dumbbell row', 'Lateral raise'],
  },
  {
    day: 2,
    name: 'Lower A',
    exercises: ['Back squat', 'Romanian deadlift', 'Leg curl'],
  },
  {
    day: 3,
    name: 'Upper B',
    exercises: ['Overhead press', 'Lat pulldown', 'Incline dumbbell press'],
  },
  {
    day: 4,
    name: 'Lower B',
    exercises: ['Hip thrust', 'Split squat', 'Calf raise'],
  },
  {
    day: 5,
    name: 'Full body',
    exercises: ['Goblet squat', 'Push-up', 'Cable row'],
  },
];

const selectedDay = 1;

const comparisons: Comparison[] = [
  {
    variant: 'original',
    title: 'Original',
    category: 'Mockup 2',
    description: 'The current outline, unchanged.',
  },
  {
    variant: 'cards',
    title: 'Defined cards',
    category: 'Close',
    description: 'Same hierarchy. Clearer boundaries between workouts.',
  },
  {
    variant: 'rail',
    title: 'Quiet rail',
    category: 'Close',
    description: 'Same hierarchy. Less framing, one continuous rail.',
  },
  {
    variant: 'tiles',
    title: 'Exercise tiles',
    category: 'Different',
    description: 'Small exercise tiles instead of an indented outline.',
  },
  {
    variant: 'cartridges',
    title: 'Workout cartridges',
    category: 'Wild',
    description: 'A physical stack of workouts. Each holds its own strips.',
  },
];

function RouteComponent() {
  return (
    <div className="flex h-[calc(100dvh-7.5rem)] min-h-0 min-w-0 flex-col gap-4 p-2 md:h-[calc(100dvh-8.5rem)]">
      <header className="shrink-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Your split, five ways
        </h1>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Same five workouts. Same 220px width. Upper A selected in every version.
          Scroll sideways to compare, vertically within each outline.
        </p>
      </header>
      <ScrollArea
        aria-label="Split navigation comparisons"
        className="min-h-0 min-w-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:h-full"
      >
        <div className="flex h-full w-max items-stretch gap-6 p-1 pb-5">
          {comparisons.map((comparison, index) => (
            <ComparisonPanel
              key={comparison.variant}
              comparison={comparison}
              position={index + 1}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function ComparisonPanel({
  comparison,
  position,
}: {
  comparison: Comparison;
  position: number;
}) {
  const headingId = `split-comparison-${comparison.variant}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex h-full min-h-0 w-[220px] shrink-0 flex-col gap-4"
    >
      <header className="h-24 shrink-0 space-y-2 border-b pb-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
            Version {position}
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-[10px]',
              comparison.variant === 'cartridges' &&
                'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400',
            )}
          >
            {comparison.category}
          </Badge>
        </div>
        <h2 id={headingId} className="text-sm font-semibold">
          {comparison.title}
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {comparison.description}
        </p>
      </header>
      <SplitNavigation variant={comparison.variant} />
    </section>
  );
}

function SplitNavigation({ variant }: { variant: Variant }) {
  const headingId = `split-heading-${variant}`;

  return (
    <nav
      aria-labelledby={headingId}
      className="flex min-h-0 flex-1 flex-col gap-3"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 px-1">
        <h3 id={headingId} className="text-sm font-semibold">
          Your split
          <span className="text-muted-foreground ml-2 font-normal">
            {workouts.length} days
          </span>
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Add workout in ${variant} version`}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-1 pb-3',
          variant === 'rail' && 'gap-0',
          variant === 'tiles' && 'gap-3',
          variant === 'cartridges' && 'gap-5 px-2 pt-2',
        )}
      >
        {workouts.map((workout) => (
          <WorkoutEntry key={workout.day} workout={workout} variant={variant} />
        ))}
      </div>
    </nav>
  );
}

function WorkoutEntry({
  workout,
  variant,
}: {
  workout: Workout;
  variant: Variant;
}) {
  switch (variant) {
    case 'original':
      return <OriginalWorkout workout={workout} />;
    case 'cards':
      return <CardWorkout workout={workout} />;
    case 'rail':
      return <RailWorkout workout={workout} />;
    case 'tiles':
      return <TileWorkout workout={workout} />;
    case 'cartridges':
      return <CartridgeWorkout workout={workout} />;
  }
}

function WorkoutButton({
  workout,
  className,
  children,
}: {
  workout: Workout;
  className: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-current={workout.day === selectedDay ? 'page' : undefined}
      aria-label={`Day ${workout.day}, ${workout.name}`}
      className={cn(
        'h-auto w-full min-w-0 shrink-0 flex-col items-stretch text-left whitespace-normal',
        className,
      )}
    >
      {children}
    </Button>
  );
}

function DayNumber({ workout }: { workout: Workout }) {
  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] tabular-nums',
        workout.day === selectedDay
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {workout.day}
    </span>
  );
}

function ExerciseNames({
  workout,
  className,
}: {
  workout: Workout;
  className: string;
}) {
  return (
    <span
      className={cn(
        'text-muted-foreground flex flex-col gap-1 text-xs leading-relaxed font-normal',
        className,
      )}
    >
      {workout.exercises.map((exercise) => (
        <span key={exercise}>{exercise}</span>
      ))}
    </span>
  );
}

function OriginalWorkout({ workout }: { workout: Workout }) {
  const isSelected = workout.day === selectedDay;

  return (
    <WorkoutButton
      workout={workout}
      className={cn(
        'gap-2.5 rounded-xl border p-3',
        isSelected
          ? 'border-primary/25 bg-primary/5 hover:bg-primary/10'
          : 'border-transparent hover:border-border',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <DayNumber workout={workout} />
          <span className="text-sm font-semibold">{workout.name}</span>
        </span>
        {isSelected && (
          <ChevronRight aria-hidden="true" className="text-primary size-3.5" />
        )}
      </span>
      <ExerciseNames
        workout={workout}
        className="border-border/70 ml-2.5 border-l pl-4"
      />
    </WorkoutButton>
  );
}

function CardWorkout({ workout }: { workout: Workout }) {
  const isSelected = workout.day === selectedDay;

  return (
    <WorkoutButton
      workout={workout}
      className={cn(
        'gap-2.5 rounded-xl border border-l-3 p-3',
        isSelected
          ? 'border-primary/25 border-l-primary bg-primary/5 hover:bg-primary/10'
          : 'border-border border-l-border bg-card',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <DayNumber workout={workout} />
          <span className="text-sm font-semibold">{workout.name}</span>
        </span>
        <span className="text-muted-foreground text-[10px] font-normal">
          {workout.exercises.length} ex.
        </span>
      </span>
      <ExerciseNames workout={workout} className="border-t pt-2" />
    </WorkoutButton>
  );
}

function RailWorkout({ workout }: { workout: Workout }) {
  const isSelected = workout.day === selectedDay;

  return (
    <WorkoutButton
      workout={workout}
      className={cn(
        'gap-2 rounded-none border-l-2 px-3 py-3',
        isSelected
          ? 'border-l-primary bg-primary/5 hover:bg-primary/10'
          : 'border-l-border',
      )}
    >
      <span className="flex items-center gap-2">
        <span className="text-muted-foreground w-3 text-[10px] font-normal tabular-nums">
          {workout.day}
        </span>
        <span className="text-sm font-semibold">{workout.name}</span>
        {isSelected && (
          <span className="bg-primary ml-auto size-1.5 rounded-full" />
        )}
      </span>
      <ExerciseNames workout={workout} className="pl-5" />
    </WorkoutButton>
  );
}

function TileWorkout({ workout }: { workout: Workout }) {
  const isSelected = workout.day === selectedDay;

  return (
    <WorkoutButton
      workout={workout}
      className={cn(
        'gap-2.5 rounded-xl border p-2.5',
        isSelected
          ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
          : 'border-transparent',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <Layers3 aria-hidden="true" className="text-muted-foreground size-3.5" />
          <span className="text-sm font-semibold">{workout.name}</span>
        </span>
        <span className="text-muted-foreground text-[10px] font-normal">
          Day {workout.day}
        </span>
      </span>
      <span className="flex flex-col gap-1.5">
        {workout.exercises.map((exercise, index) => (
          <span
            key={exercise}
            className="bg-background border-border/70 flex items-start gap-2 rounded-md border px-2 py-1.5"
          >
            <span className="text-muted-foreground pt-0.5 text-[9px] font-normal tabular-nums">
              {index + 1}
            </span>
            <span className="text-xs leading-relaxed font-normal">{exercise}</span>
          </span>
        ))}
      </span>
    </WorkoutButton>
  );
}

function CartridgeWorkout({ workout }: { workout: Workout }) {
  const isSelected = workout.day === selectedDay;

  return (
    <WorkoutButton
      workout={workout}
      className={cn(
        'relative gap-3 rounded-2xl border-2 p-3 pb-4 shadow-[3px_4px_0_0_var(--border)]',
        isSelected
          ? 'rotate-0 border-amber-400 bg-amber-100 text-amber-950 shadow-[3px_4px_0_0_var(--color-amber-400)] hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-100 dark:hover:bg-amber-950'
          : 'border-border bg-muted/40 odd:-rotate-1 even:rotate-1 hover:rotate-0',
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="space-y-1">
          <span className="block font-mono text-[9px] font-normal tracking-widest uppercase opacity-60">
            Workout / 0{workout.day}
          </span>
          <span className="block text-lg leading-tight font-bold tracking-tight">
            {workout.name}
          </span>
        </span>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current/20">
          {isSelected ? (
            <ArrowUpRight aria-hidden="true" className="size-4" />
          ) : (
            <span className="font-mono text-xs">{workout.day}</span>
          )}
        </span>
      </span>
      <span className="flex flex-col gap-1.5 border-t border-dashed border-current/25 pt-3">
        {workout.exercises.map((exercise, index) => (
          <span
            key={exercise}
            className={cn(
              'flex items-center gap-2 rounded-sm border border-current/10 px-2 py-1.5',
              isSelected ? 'bg-white/50 dark:bg-white/5' : 'bg-background',
            )}
          >
            <span className="h-3 w-1 shrink-0 rounded-full bg-current opacity-25" />
            <span className="min-w-0 flex-1 text-xs leading-relaxed font-medium">
              {exercise}
            </span>
            <span className="font-mono text-[9px] font-normal opacity-40">
              {index + 1}
            </span>
          </span>
        ))}
      </span>
      <span className="flex items-center justify-between gap-2 font-mono text-[9px] font-normal tracking-wide uppercase opacity-60">
        <span>{workout.exercises.length} exercise strips</span>
        <span>{isSelected ? 'Open' : 'Pick up'}</span>
      </span>
    </WorkoutButton>
  );
}
