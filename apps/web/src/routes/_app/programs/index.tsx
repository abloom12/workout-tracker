import { useState } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { createFileRoute } from '@tanstack/react-router';

import { Spinner } from '@/components/ui/spinner';
import type { EditorDraft } from './-types';
import { ExerciseLibrary } from './-components/ExerciseLibrary';
import { SplitBuilder } from './-components/SplitBuilder';

export const Route = createFileRoute('/_app/programs/')({
  loader: ({ context }) =>
    context.queryClient.query(context.trpc.exercise.list.queryOptions()),
  pendingComponent: () => <Spinner />,
  component: RouteComponent,
});

function RouteComponent() {
  const [draft, setDraft] = useState<EditorDraft>({
    split: { name: '', workoutIds: [] },
    workoutsById: {},
  });

  function addWorkout() {
    const id = crypto.randomUUID();

    setDraft((current) => ({
      ...current,
      split: {
        ...current.split,
        workoutIds: [...current.split.workoutIds, id],
      },
      workoutsById: {
        ...current.workoutsById,
        [id]: { name: '', exercises: [] },
      },
    }));
  }

  const workouts = draft.split.workoutIds.map((id) => {
    const workout = draft.workoutsById[id];

    if (!workout) {
      throw new Error(`Missing workout: ${id}`);
    }

    return { id, ...workout };
  });

  return (
    <DragDropProvider>
      <div className="@container/program-editor flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] grid-rows-[minmax(0,1fr)] gap-4">
          <SplitBuilder workouts={workouts} onAddWorkout={addWorkout} />
          <ExerciseLibrary />
        </div>
      </div>

      <DragOverlay disabled={(source) => source?.type !== 'library-exercise'}>
        {(source) => (source.type ? <p>hey</p> : <p>yo</p>)}
      </DragOverlay>
    </DragDropProvider>
  );
}
