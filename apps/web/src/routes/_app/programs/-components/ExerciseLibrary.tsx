import { useDraggable } from '@dnd-kit/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { GripVertical, Search } from 'lucide-react';

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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const routeApi = getRouteApi('/_app/programs/');

export function ExerciseLibrary() {
  const { trpc } = routeApi.useRouteContext();
  const { data: exercises } = useSuspenseQuery(
    trpc.exercise.list.queryOptions(),
  );

  return (
    <Card className="min-h-0 min-w-0 overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle>Exercise library</CardTitle>

        <CardDescription className="text-xs">Drag into any day</CardDescription>

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
      </CardHeader>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <CardContent>
          <ul className="space-y-3">
            {exercises.map((exercise) => (
              <Exercise
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

function Exercise({ id, name }: { id: number; name: string }) {
  const { ref, handleRef } = useDraggable({
    id: `library:${id}`,
    type: 'library-exercise',
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
