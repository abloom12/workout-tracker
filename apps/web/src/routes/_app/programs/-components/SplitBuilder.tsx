import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { WorkoutDraft } from '../-types';
import { WorkoutCard } from './WorkoutCard';

type SplitBuilderProps = { workouts: WorkoutDraft[]; onAddWorkout: () => void };

export function SplitBuilder({ workouts, onAddWorkout }: SplitBuilderProps) {
  return (
    <Card className="@container/itinerary min-h-0 min-w-0 overflow-hidden p-3">
      <Button type="button" onClick={onAddWorkout}>
        <Plus aria-hidden="true" />
        Add workout
      </Button>

      {workouts.length === 0 ?
        <Empty className="min-h-80">
          <EmptyHeader>
            <EmptyTitle>No workouts yet</EmptyTitle>
            <EmptyDescription>
              Add your first workout to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      : <ScrollArea className="min-h-0 flex-1">
          <div className="relative">
            <span
              aria-hidden="true"
              className="border-border pointer-events-none absolute top-5 bottom-5 left-[19px] border-l-2 border-dashed"
            />

            <ol className="relative flex flex-col gap-3">
              {workouts.map((workout, index) => (
                <WorkoutCard
                  key={workout.id}
                  position={index + 1}
                  workout={workout}
                />
              ))}
            </ol>
          </div>
        </ScrollArea>
      }
    </Card>
  );
}
