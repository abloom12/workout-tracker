import { useDroppable } from '@dnd-kit/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { ArrowDownToLine, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
// import { InputGroup, InputGroupInput } from '@/components/ui/input-group';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { cn } from '@/lib/cn';
import type { WorkoutDraft, WorkoutExerciseDraft } from '../-types';

const routeApi = getRouteApi('/_app/programs/');

type WorkoutCardProps = { position: number; workout: WorkoutDraft };

export function WorkoutCard({ position, workout }: WorkoutCardProps) {
  const { ref, isDropTarget } = useDroppable({
    id: workout.id,
    data: { id: workout.id, position },
  });

  const name = workout.name.trim() || `Workout Name`;
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );

  return (
    <div className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-start gap-3">
      <span
        aria-hidden="true"
        className="bg-card border-border relative z-10 flex size-10 items-center justify-center rounded-full border text-sm font-semibold tabular-nums"
      >
        {position}
      </span>

      <section className="grid min-w-0 grid-cols-[140px_minmax(0,1fr)_24px] gap-x-3 gap-y-2">
        <header className="">
          <div className="flex items-start justify-between gap-1">
            <h2 aria-label={`Day ${position}, ${name}`}>{name}</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Edit the name of day ${position}, ${name}`}
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

        <div ref={ref}>
          {workout.exercises.length > 0 && (
            <ItemGroup>
              {workout.exercises.map((exercise, index) => (
                <WorkoutExercise
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                />
              ))}
            </ItemGroup>
          )}

          <div
            className={cn(
              'flex items-center justify-center rounded-lg border border-dashed',
              workout.exercises.length === 0 ? 'min-h-40' : 'min-h-10',
            )}
          >
            <div className="text-muted-foreground flex items-center gap-1">
              <ArrowDownToLine aria-hidden="true" className="size-3.5" />
              <p className="text-xs">
                {isDropTarget ?
                  'Release to place here'
                : 'Drop an exercise here'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkoutExercise({
  exercise,
  index,
}: {
  exercise: WorkoutExerciseDraft;
  index: number;
}) {
  const { trpc } = routeApi.useRouteContext();
  const { data: exerciseLibrary } = useSuspenseQuery(
    trpc.exercise.list.queryOptions(),
  );
  const setup = exerciseLibrary.find((entry) => entry.id === exercise.setupId);

  return (
    <Item id={index.toString()}>
      <ItemMedia>{index}</ItemMedia>
      <ItemContent className="flex flex-row gap-2">
        <ItemTitle className="shrink-0">
          {setup?.name ?? 'Unavailable exercise'}
        </ItemTitle>
        <Input />
        <Input />
        <Input />
      </ItemContent>
    </Item>
  );
}
