import type { inferOutput } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { GripVertical, Search } from 'lucide-react';

import type { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/cn';

type Exercise = inferOutput<typeof trpc.exercise.list>[number];

const muscleGroups = {
  chest: ['Chest'],
  back: ['Lats', 'Traps', 'Upper Back', 'Lower Back'],
  shoulders: ['Front Delts', 'Side Delts', 'Rear Delts'],
  biceps: ['Biceps'],
  triceps: ['Triceps'],
  legs: ['Quads', 'Hamstrings', 'Glutes', 'Adductors', 'Calves'],
  core: ['Core'],
} satisfies Record<string, string[]>;

type MuscleGroup = keyof typeof muscleGroups;

const muscleGroupByName = new Map(
  (Object.keys(muscleGroups) as MuscleGroup[]).flatMap((group) =>
    muscleGroups[group].map((name) => [name, group] as const),
  ),
);

const muscleColors: Record<MuscleGroup, string> = {
  chest: 'bg-blue-500',
  back: 'bg-rose-500',
  shoulders: 'bg-emerald-500',
  biceps: 'bg-violet-500',
  triceps: 'bg-fuchsia-500',
  legs: 'bg-amber-500',
  core: 'bg-slate-500',
};

const routeApi = getRouteApi('/_app/programs/');

export function ExerciseLibrary() {
  const [search, setSearch] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['all']);

  const { trpc } = routeApi.useRouteContext();
  const { data: exercises } = useSuspenseQuery(
    trpc.exercise.list.queryOptions(),
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesMuscles =
      selectedMuscles.includes('all') ||
      exercise.muscles.some((muscle) => {
        if (muscle.role !== 'primary') return false;

        const group = muscleGroupByName.get(muscle.name);
        return group !== undefined && selectedMuscles.includes(group);
      });

    return matchesSearch && matchesMuscles;
  });

  return (
    <Card className="min-h-0 min-w-0 overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle className="mb-2">Exercise library</CardTitle>

        <InputGroup className="mb-2 shrink-0">
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search exercises…"
            aria-label="Search exercises"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </InputGroup>

        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          spacing={1}
          className="flex flex-wrap *:grow"
          value={selectedMuscles}
          onValueChange={(values) => {
            setSelectedMuscles((current) => {
              if (values.includes('all') && !current.includes('all')) {
                return ['all'];
              }

              const muscles = values.filter((value) => value !== 'all');
              return muscles.length > 0 ? muscles : ['all'];
            });
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="chest">Chest</ToggleGroupItem>
          <ToggleGroupItem value="back">Back</ToggleGroupItem>
          <ToggleGroupItem value="shoulders">Shoulders</ToggleGroupItem>
          <ToggleGroupItem value="biceps">Biceps</ToggleGroupItem>
          <ToggleGroupItem value="triceps">Triceps</ToggleGroupItem>
          <ToggleGroupItem value="legs">Legs</ToggleGroupItem>
          <ToggleGroupItem value="core">Core</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <CardContent>
          <ul className="space-y-3">
            {filteredExercises.map((exercise) => (
              <ExerciseLibraryItem
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                muscles={exercise.muscles}
              />
            ))}
          </ul>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

function ExerciseLibraryItem({
  id,
  name,
  muscles,
}: Pick<Exercise, 'id' | 'name' | 'muscles'>) {
  const { ref, handleRef } = useDraggable({
    id: `library:${id}`,
    type: 'library-exercise',
    data: { id, name },
  });

  return (
    <li ref={ref} className="flex items-center rounded-lg border py-3">
      <Button
        ref={handleRef}
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-grab touch-none"
      >
        <GripVertical />
      </Button>

      <div>
        <p className="mb-0.5 text-sm">{name}</p>

        <div className="flex gap-2">
          {muscles
            .filter((muscle) => muscle.role === 'primary')
            .map((muscle) => {
              const group = muscleGroupByName.get(muscle.name);

              return (
                <p
                  key={muscle.id}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-1.5 shrink-0 rounded-full',
                      group !== undefined ?
                        muscleColors[group]
                      : 'bg-stone-400',
                    )}
                  ></span>
                  <span key={muscle.id} className="text-muted-foreground">
                    {muscle.name}
                  </span>
                </p>
              );
            })}
        </div>
      </div>
    </li>
  );
}

export function ExerciseLibraryItemDragPreview({ name }: { name: string }) {
  return (
    <div className="bg-card flex items-center rounded-lg border py-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-grab touch-none"
        tabIndex={-1}
      >
        <GripVertical />
      </Button>
      <p className="mb-0.5 text-sm">{name}</p>
    </div>
  );
}
