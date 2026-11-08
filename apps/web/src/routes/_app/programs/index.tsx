import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { createFileRoute } from '@tanstack/react-router';
import { cva } from 'class-variance-authority';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/cn';
import {
  ExerciseLibrary,
  ExerciseLibraryItemDragPreview,
} from './-components/exercise-library';

export const Route = createFileRoute('/_app/programs/')({
  loader: ({ context }) =>
    context.queryClient.query(context.trpc.exercise.list.queryOptions()),
  pendingComponent: () => <Spinner />,
  component: ProgramEditor,
});

const layoutVariants = cva('grid', {
  variants: {
    layout: {
      'library-left-editor-right': [
        'grid-cols-[240px_minmax(0,1fr)_340px]',
        'grid-rows-[minmax(0,1fr)]',
        "[grid-template-areas:'library_workout_editor']",
      ],
      'library-right-editor-left': [
        'grid-cols-[340px_minmax(0,1fr)_240px]',
        'grid-rows-[minmax(0,1fr)]',
        "[grid-template-areas:'editor_workout_library']",
      ],
      'library-left-editor-bottom': [
        'grid-cols-[240px_minmax(0,1fr)]',
        'grid-rows-[minmax(0,1fr)_280px]',
        "[grid-template-areas:'library_workout'_'library_editor']",
      ],
      'library-right-editor-bottom': [
        'grid-cols-[minmax(0,1fr)_240px]',
        'grid-rows-[minmax(0,1fr)_280px]',
        "[grid-template-areas:'workout_library'_'editor_library']",
      ],
    },
  },
  defaultVariants: { layout: 'library-left-editor-right' },
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
      <div>I'm the header</div>

      <div
        className={cn(
          layoutVariants({ layout: 'library-left-editor-right' }),
          '@container/program-editor',
        )}
      >
        <div className="min-h-0 min-w-0 overflow-y-auto [grid-area:library]">
          <ExerciseLibrary />
        </div>
        <div className="min-h-0 min-w-0 overflow-auto [grid-area:workout]">
          <div>I'm the grid</div>
        </div>
        <div className="min-h-0 min-w-0 overflow-auto [grid-area:editor]">
          <div>I'm the editor</div>
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
