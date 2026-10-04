import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  Dumbbell,
  GripVertical,
  Layers3,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_app/mockup')({
  component: RouteComponent,
});

type WorkoutExercise = { name: string; prescription: string };

type Workout = {
  day: number;
  name: string;
  focus: string;
  dropPreview?: boolean;
  exercises: WorkoutExercise[];
};

const workouts: Workout[] = [
  {
    day: 1,
    name: 'Push A',
    focus: 'Chest · Shoulders · Triceps',
    exercises: [
      { name: 'Barbell bench press', prescription: '4 × 6–8' },
      { name: 'Incline dumbbell press', prescription: '3 × 8–12' },
      { name: 'Seated shoulder press', prescription: '3 × 8–12' },
      { name: 'Cable lateral raise', prescription: '3 × 12–15' },
      { name: 'Triceps pushdown', prescription: '3 × 10–15' },
    ],
  },
  {
    day: 2,
    name: 'Pull A',
    focus: 'Back · Rear delts · Biceps',
    dropPreview: true,
    exercises: [
      { name: 'Weighted pull-up', prescription: '4 × 6–8' },
      { name: 'Chest-supported row', prescription: '3 × 8–12' },
      { name: 'Lat pulldown', prescription: '3 × 10–12' },
      { name: 'Reverse pec deck', prescription: '3 × 12–15' },
      { name: 'Incline dumbbell curl', prescription: '3 × 10–15' },
    ],
  },
  {
    day: 3,
    name: 'Legs A',
    focus: 'Quads · Hamstrings · Calves',
    exercises: [
      { name: 'Barbell back squat', prescription: '4 × 6–8' },
      { name: 'Romanian deadlift', prescription: '3 × 8–10' },
      { name: 'Leg press', prescription: '3 × 10–12' },
      { name: 'Seated leg curl', prescription: '3 × 10–15' },
      { name: 'Standing calf raise', prescription: '3 × 12–20' },
    ],
  },
  {
    day: 4,
    name: 'Push B',
    focus: 'Shoulders · Chest · Triceps',
    exercises: [
      { name: 'Overhead press', prescription: '4 × 6–8' },
      { name: 'Dumbbell bench press', prescription: '3 × 8–12' },
      { name: 'Cable chest fly', prescription: '3 × 10–15' },
      { name: 'Dumbbell lateral raise', prescription: '3 × 12–15' },
      { name: 'Overhead triceps extension', prescription: '3 × 10–15' },
    ],
  },
  {
    day: 5,
    name: 'Pull B',
    focus: 'Back · Rear delts · Biceps',
    exercises: [
      { name: 'Barbell row', prescription: '4 × 6–8' },
      { name: 'Neutral-grip pulldown', prescription: '3 × 8–12' },
      { name: 'Seated cable row', prescription: '3 × 10–12' },
      { name: 'Face pull', prescription: '3 × 12–15' },
      { name: 'Hammer curl', prescription: '3 × 10–15' },
    ],
  },
  {
    day: 6,
    name: 'Legs B',
    focus: 'Hamstrings · Glutes · Quads',
    exercises: [
      { name: 'Front squat', prescription: '4 × 6–8' },
      { name: 'Bulgarian split squat', prescription: '3 × 8–12' },
      { name: 'Hip thrust', prescription: '3 × 8–12' },
      { name: 'Lying leg curl', prescription: '3 × 10–15' },
      { name: 'Seated calf raise', prescription: '3 × 12–20' },
    ],
  },
];

const libraryExercises = [
  { name: 'Seated cable row', detail: 'Back · Cable' },
  { name: 'Lat pulldown', detail: 'Back · Cable' },
  { name: 'Barbell row', detail: 'Back · Barbell' },
  { name: 'Face pull', detail: 'Rear delts · Cable' },
  { name: 'Dumbbell curl', detail: 'Biceps · Dumbbell' },
  { name: 'Hammer curl', detail: 'Biceps · Dumbbell' },
  { name: 'Straight-arm pulldown', detail: 'Back · Cable' },
];

function RouteComponent() {
  return (
    // Leave room for the app header, outlet padding, and desktop inset margins.
    <div className="flex h-[calc(100dvh-4.75rem)] min-h-0 min-w-0 flex-col gap-3 overflow-hidden p-2 md:h-[calc(100dvh-5.75rem)]">
      <ProgramHeader />
      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_280px]">
        <SplitBoard />
        <ExerciseLibrary />
      </div>
    </div>
  );
}

function ProgramHeader() {
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Build your split
        </h1>
        <Badge variant="secondary">Draft</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm">
          Save draft
        </Button>
        <Button type="button" size="sm">
          Save program
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}

function SplitBoard() {
  return (
    <section
      aria-labelledby="mockup-split-heading"
      className="flex min-h-0 min-w-0 flex-col gap-3"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <h2
            id="mockup-split-heading"
            className="flex items-center gap-2 font-semibold"
          >
            <Layers3 aria-hidden="true" className="size-4" />
            Your training days
          </h2>
        </div>
        <Button type="button" variant="outline" size="sm">
          <Plus aria-hidden="true" />
          Add day
        </Button>
      </div>

      <div className="relative min-h-0 min-w-0 flex-1">
        <ScrollArea
          type="always"
          className="h-full w-full rounded-xl [&_[data-slot=scroll-area-viewport]>div]:h-full"
          aria-label="Training days"
        >
          <div className="flex h-full w-max items-stretch gap-3 p-1 pb-4">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.day} workout={workout} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent"
        />
      </div>
    </section>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Card
      className={cn(
        'border-t-muted-foreground/25 h-full min-h-0 w-64 shrink-0 gap-0 overflow-hidden border-t-4 pt-3 shadow-none',
        workout.dropPreview &&
          'border-t-amber-500 bg-amber-500/5 ring-2 ring-amber-500/70',
      )}
    >
      <CardHeader className="shrink-0 gap-1 pb-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <GripVertical aria-hidden="true" className="size-3.5" />
          Day {workout.day}
        </div>
        <CardTitle className="text-lg font-semibold">{workout.name}</CardTitle>
        <CardDescription className="col-span-2 text-xs">
          {workout.focus}
        </CardDescription>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Remove Day ${workout.day} · ${workout.name}`}
          >
            <Trash2 aria-hidden="true" className="size-3.5" />
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 py-2">
        <div className="text-muted-foreground flex shrink-0 items-center justify-between px-1 text-[11px]">
          <span>5 exercises</span>
          <span>16 working sets</span>
        </div>
        <ItemGroup className="min-h-0 flex-1 gap-2 overflow-y-auto">
          {workout.exercises.map((exercise, index) => (
            <Item
              key={exercise.name}
              role="listitem"
              variant="muted"
              size="xs"
              className="shrink-0 flex-nowrap gap-1.5 px-2 py-2"
            >
              <ItemMedia className="text-muted-foreground gap-1">
                <GripVertical
                  aria-hidden="true"
                  className="size-3 cursor-grab"
                />
                <span className="w-3 text-center text-[10px] tabular-nums">
                  {index + 1}
                </span>
              </ItemMedia>
              <ItemContent className="min-w-0 gap-1">
                <ItemTitle className="line-clamp-none w-full text-xs leading-snug">
                  {exercise.name}
                </ItemTitle>
                <ItemDescription className="text-xs tabular-nums">
                  {exercise.prescription}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground/60 hover:text-destructive"
                  aria-label={`Remove ${exercise.name} from ${workout.name}`}
                >
                  <X aria-hidden="true" />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
      <CardFooter className="shrink-0 bg-transparent p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-between text-xs"
        >
          Edit workout
          <ArrowRight aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function ExerciseLibrary() {
  return (
    <aside
      aria-labelledby="mockup-library-heading"
      className="min-h-0 min-w-0"
    >
      <Card className="h-full min-h-0 gap-3 shadow-none">
        <CardHeader className="shrink-0">
          <CardTitle
            id="mockup-library-heading"
            className="flex items-center gap-2 font-semibold"
          >
            <Dumbbell aria-hidden="true" className="size-4" />
            Exercise library
          </CardTitle>
          <CardDescription className="text-xs">
            Find an exercise. Add it to your split.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
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
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <NativeSelect
              defaultValue="all"
              size="sm"
              className="flex-1"
              aria-label="Filter by muscle group"
            >
              <NativeSelectOption value="all">All muscles</NativeSelectOption>
              <NativeSelectOption value="back">Back</NativeSelectOption>
              <NativeSelectOption value="chest">Chest</NativeSelectOption>
              <NativeSelectOption value="legs">Legs</NativeSelectOption>
            </NativeSelect>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <SlidersHorizontal aria-hidden="true" />
              Filters
            </Button>
          </div>
          <Separator />
          <div className="flex shrink-0 items-center justify-between">
            <p className="text-xs font-medium">Exercises</p>
            <Badge variant="secondary">7</Badge>
          </div>
          <ItemGroup className="min-h-0 flex-1 gap-1 overflow-y-auto">
            {libraryExercises.map((exercise) => (
              <Item
                key={exercise.name}
                role="listitem"
                size="xs"
                className="shrink-0 flex-nowrap gap-2 px-0 py-2"
              >
                <ItemMedia className="text-muted-foreground">
                  <GripVertical
                    aria-hidden="true"
                    className="size-3.5 cursor-grab"
                  />
                </ItemMedia>
                <ItemContent className="min-w-0 gap-1">
                  <ItemTitle className="line-clamp-none text-xs leading-snug">
                    {exercise.name}
                  </ItemTitle>
                  <ItemDescription className="text-[11px]">
                    {exercise.detail}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full shrink-0 text-xs"
          >
            Browse all exercises
            <ArrowRight aria-hidden="true" />
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
