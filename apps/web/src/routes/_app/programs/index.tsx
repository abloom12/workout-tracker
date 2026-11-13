import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { createFileRoute } from '@tanstack/react-router';

import { Spinner } from '@/components/ui/spinner';
import {
  ExerciseLibrary,
  ExerciseLibraryItemDragPreview,
} from './-components/exercise-library';
import { SplitBuilder } from './-components/split-builder';

export const Route = createFileRoute('/_app/programs/')({
  loader: ({ context }) =>
    context.queryClient.query(context.trpc.exercise.list.queryOptions()),
  pendingComponent: () => <Spinner />,
  component: ProgramEditor,
});

function ProgramEditor() {
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
      }}
    >
      <div className="flex min-h-0 min-w-0 flex-1">
        <ExerciseLibrary />
        <SplitBuilder />
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
