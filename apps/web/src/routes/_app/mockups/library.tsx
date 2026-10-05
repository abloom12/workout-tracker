import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Dumbbell, Plus, Search, Ticket } from 'lucide-react';

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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockups/library')({
  component: RouteComponent,
});

type Exercise = { name: string; detail: string };

type Variant = 'original' | 'cards' | 'compact' | 'tiles' | 'tickets';

type Comparison = {
  variant: Variant;
  title: string;
  category: string;
  description: string;
};

const workoutName = 'Upper A';

const exercises: Exercise[] = [
  { name: 'Incline dumbbell press', detail: 'Chest · Dumbbell' },
  { name: 'Cable fly', detail: 'Chest · Cable' },
  { name: 'Chest-supported row', detail: 'Back · Dumbbell' },
  { name: 'Lat pulldown', detail: 'Back · Cable' },
  { name: 'Face pull', detail: 'Shoulders · Cable' },
  { name: 'Dumbbell curl', detail: 'Biceps · Dumbbell' },
  { name: 'Triceps pushdown', detail: 'Triceps · Cable' },
  { name: 'Hammer curl', detail: 'Biceps · Dumbbell' },
];

const comparisons: Comparison[] = [
  {
    variant: 'original',
    title: 'Original',
    category: 'Mockup 2',
    description: 'The current library, unchanged.',
  },
  {
    variant: 'cards',
    title: 'Soft rows',
    category: 'Close',
    description: 'Same layout. Each exercise gets a clearer boundary.',
  },
  {
    variant: 'compact',
    title: 'Compact list',
    category: 'Close',
    description: 'Less framing. More exercises in the same height.',
  },
  {
    variant: 'tiles',
    title: 'Exercise tiles',
    category: 'Different',
    description: 'Two-column browsing. The whole tile is the add button.',
  },
  {
    variant: 'tickets',
    title: 'Move dispenser',
    category: 'Wild',
    description: 'Exercises as tear-off strips, ready for your workout.',
  },
];

function RouteComponent() {
  return (
    <div className="flex h-[calc(100dvh-7.5rem)] min-h-0 min-w-0 flex-col gap-4 p-2 md:h-[calc(100dvh-8.5rem)]">
      <header className="shrink-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Exercise library, five ways
        </h1>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Same eight exercises, in the same order. Each library is 300px wide and
          adds to Upper A. Static concepts, not working pickers.
        </p>
      </header>
      <ScrollArea
        aria-label="Exercise library comparisons"
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
  const headingId = `library-comparison-${comparison.variant}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex h-full min-h-0 w-[300px] shrink-0 flex-col gap-4"
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
              comparison.variant === 'tickets' &&
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
      <ExerciseLibrary variant={comparison.variant} />
    </section>
  );
}

function ExerciseLibrary({ variant }: { variant: Variant }) {
  const headingId = `exercise-library-${variant}`;
  const isCompact = variant === 'compact';
  const isDispenser = variant === 'tickets';

  return (
    <aside aria-labelledby={headingId} className="min-h-0 flex-1">
      <Card
        className={cn(
          'h-full min-h-0 gap-3',
          isCompact && 'gap-2 py-3',
          isDispenser &&
            'bg-amber-500/5 ring-amber-500/25 dark:bg-amber-500/10',
        )}
      >
        <CardHeader className="shrink-0">
          <CardTitle
            id={headingId}
            className="flex items-center gap-2 font-semibold"
          >
            {isDispenser ? (
              <Ticket aria-hidden="true" className="size-4" />
            ) : (
              <Dumbbell aria-hidden="true" className="size-4" />
            )}
            Exercise library
          </CardTitle>
          <CardDescription className="text-xs">
            {isCompact ? (
              <>Adding to <span className="font-medium">{workoutName}</span></>
            ) : variant === 'tiles' ? (
              'Click a tile. Add an exercise.'
            ) : isDispenser ? (
              'Pick a move. Take a strip.'
            ) : (
              'Find something for your workout.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent
          className={cn(
            'flex min-h-0 flex-1 flex-col gap-3',
            isCompact && 'gap-2',
          )}
        >
          <LibrarySearch variant={variant} />
          {!isCompact && <DestinationBanner isDispenser={isDispenser} />}
          <Separator />
          {isCompact && (
            <p className="text-muted-foreground shrink-0 text-[11px]">
              {exercises.length} exercises
            </p>
          )}
          <ItemGroup
            aria-label={`Exercises in the ${variant} library`}
            className={cn(
              'min-h-0 flex-1 gap-0 overflow-y-auto',
              variant === 'cards' && 'gap-2',
              variant === 'tiles' &&
                'grid auto-rows-max grid-cols-2 content-start gap-2',
              isDispenser && 'gap-3 px-0.5 py-1',
            )}
          >
            {exercises.map((exercise, index) => (
              <ExerciseEntry
                key={exercise.name}
                exercise={exercise}
                variant={variant}
                position={index + 1}
              />
            ))}
          </ItemGroup>
        </CardContent>
      </Card>
    </aside>
  );
}

function LibrarySearch({ variant }: { variant: Variant }) {
  return (
    <InputGroup
      className={cn('shrink-0', variant === 'tickets' && 'bg-background')}
    >
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Search exercises…"
        aria-label={`Search exercises in the ${variant} library`}
        readOnly
      />
    </InputGroup>
  );
}

function DestinationBanner({ isDispenser }: { isDispenser: boolean }) {
  return (
    <div
      className={cn(
        'bg-primary/5 text-primary flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs',
        isDispenser &&
          'bg-amber-500/15 text-amber-800 dark:text-amber-300',
      )}
    >
      <ArrowRight aria-hidden="true" className="size-3.5" />
      <span>
        Adding to <span className="font-semibold">{workoutName}</span>
      </span>
    </div>
  );
}

function ExerciseEntry({
  exercise,
  variant,
  position,
}: {
  exercise: Exercise;
  variant: Variant;
  position: number;
}) {
  if (variant === 'tiles') {
    return <ExerciseTile exercise={exercise} />;
  }

  if (variant === 'tickets') {
    return <ExerciseTicket exercise={exercise} position={position} />;
  }

  return (
    <Item
      role="listitem"
      size="xs"
      variant={variant === 'cards' ? 'outline' : 'default'}
      className={cn(
        'shrink-0 flex-nowrap gap-2 px-0 py-3',
        variant === 'cards' && 'bg-muted/20 px-2.5 py-2.5',
        variant === 'compact' && 'border-b-border rounded-none border-b py-2',
      )}
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
          variant={variant === 'compact' ? 'ghost' : 'outline'}
          size="icon-sm"
          aria-label={`Add ${exercise.name} to ${workoutName}`}
        >
          <Plus aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  );
}

function ExerciseTile({ exercise }: { exercise: Exercise }) {
  return (
    <Item role="listitem" variant="outline" className="h-full p-0">
      <Button
        type="button"
        variant="ghost"
        aria-label={`Add ${exercise.name} to ${workoutName}`}
        className="h-full min-h-32 w-full min-w-0 flex-col items-stretch justify-between gap-3 rounded-lg p-3 text-left whitespace-normal"
      >
        <span className="text-xs leading-relaxed font-medium">
          {exercise.name}
        </span>
        <span className="flex items-end justify-between gap-2">
          <span className="text-muted-foreground text-[10px] leading-relaxed font-normal">
            {exercise.detail}
          </span>
          <span className="bg-primary/5 text-primary flex size-6 shrink-0 items-center justify-center rounded-md">
            <Plus aria-hidden="true" className="size-3.5" />
          </span>
        </span>
      </Button>
    </Item>
  );
}

function ExerciseTicket({
  exercise,
  position,
}: {
  exercise: Exercise;
  position: number;
}) {
  return (
    <Item
      role="listitem"
      variant="outline"
      className="bg-background relative grid shrink-0 grid-cols-[minmax(0,1fr)_48px] items-stretch gap-0 overflow-hidden rounded-lg border-amber-500/30 p-0 shadow-[0_2px_0_0_var(--color-amber-200)] dark:shadow-[0_2px_0_0_var(--color-amber-900)]"
    >
      <ItemContent className="min-w-0 gap-1.5 p-3">
        <span className="flex items-center justify-between gap-2 text-amber-700 dark:text-amber-400">
          <span className="font-mono text-[9px] tracking-widest uppercase">
            Move / 0{position}
          </span>
          <span
            aria-hidden="true"
            className="h-2 w-9 opacity-40 [background-image:repeating-linear-gradient(90deg,currentColor_0px,currentColor_1px,transparent_1px,transparent_3px)]"
          />
        </span>
        <ItemTitle className="line-clamp-none w-full text-xs leading-relaxed">
          {exercise.name}
        </ItemTitle>
        <ItemDescription className="text-[11px]">
          {exercise.detail}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="border-l border-dashed border-amber-500/40 bg-amber-500/10">
        <Button
          type="button"
          variant="ghost"
          aria-label={`Add ${exercise.name} to ${workoutName}`}
          className="h-full min-h-16 w-full flex-col gap-1 rounded-none border-0 px-1 text-amber-800 hover:bg-amber-500/20 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200"
        >
          <Plus aria-hidden="true" className="size-4" />
          <span className="font-mono text-[9px] tracking-wider uppercase">
            Add
          </span>
        </Button>
      </ItemActions>
    </Item>
  );
}
