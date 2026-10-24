import { useState } from 'react';
import { useDraggable } from '@dnd-kit/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { GripVertical, Search } from 'lucide-react';

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

    return matchesSearch;
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
              />
            ))}
          </ul>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

function ExerciseLibraryItem({ id, name }: { id: number; name: string }) {
  const { ref, handleRef } = useDraggable({
    id: `library:${id}`,
    type: 'library-exercise',
    data: { id, name },
  });

  return (
    <li ref={ref} className="flex items-center rounded-lg border py-1">
      <Button
        ref={handleRef}
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-grab touch-none"
      >
        <GripVertical />
      </Button>
      <p>{name}</p>
    </li>
  );
}

export function ExerciseLibraryItemDragPreview({ name }: { name: string }) {
  return (
    <div className="bg-card flex items-center rounded-lg border py-1">
      <GripVertical />
      <p>{name}</p>
    </div>
  );
}
