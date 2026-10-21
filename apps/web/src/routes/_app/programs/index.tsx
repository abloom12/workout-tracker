import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { createFileRoute } from '@tanstack/react-router';

import { Spinner } from '@/components/ui/spinner';
import type { WorkoutDraft } from './-types';
import {
  ExerciseLibrary,
  ExerciseLibraryItemDragPreview,
} from './-components/ExerciseLibrary';
import { SplitBuilder } from './-components/SplitBuilder';

export const Route = createFileRoute('/_app/programs/')({
  loader: ({ context }) =>
    context.queryClient.query(context.trpc.exercise.list.queryOptions()),
  pendingComponent: () => <Spinner />,
  component: RouteComponent,
});

function RouteComponent() {
  const [workouts, setWorkouts] = useState<WorkoutDraft[]>([]);

  function addWorkout() {
    const workout: WorkoutDraft = {
      id: crypto.randomUUID(),
      name: '',
      exercises: [],
    };

    setWorkouts((current) => [...current, workout]);
  }

  return (
    <DragDropProvider
      onDragStart={(event) => console.log(event)}
      onDragOver={(event) => {
        const { source, target } = event.operation;
        console.debug('[mockup dnd] target changed', {
          sourceId: source?.id ?? null,
          targetId: target?.id ?? null,
        });
      }}
      onDragEnd={(event) => {
        if (event.canceled) return;

        const { source, target } = event.operation;
        if (!source || !target) return;
        if (source.type !== 'library-exercise') return;

        const setupId: unknown = source.data.id;
        const workoutId = target.id;

        if (typeof setupId !== 'number' || typeof workoutId !== 'string') {
          return;
        }

        const exercise = { id: crypto.randomUUID(), setupId, sets: [] };

        setWorkouts((current) =>
          current.map((workout) =>
            workout.id === workoutId ?
              { ...workout, exercises: [...workout.exercises, exercise] }
            : workout,
          ),
        );
      }}
    >
      <div className="@container/program-editor flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] grid-rows-[minmax(0,1fr)] gap-4">
          <SplitBuilder workouts={workouts} onAddWorkout={addWorkout} />
          <ExerciseLibrary />
        </div>
      </div>

      <DragOverlay disabled={(source) => source?.type !== 'library-exercise'}>
        {(source) => {
          if (source.type !== 'library-exercise') return null;

          const name: unknown = source.data.name;
          if (typeof name !== 'string') return null;

          return <ExerciseLibraryItemDragPreview name={name} />;
        }}
      </DragOverlay>
    </DragDropProvider>
  );
}
