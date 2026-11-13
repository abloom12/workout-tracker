import { Plus } from 'lucide-react';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { WorkoutDraft } from './types';
import { WorkoutCard } from './WorkoutCard';

type SplitBuilderProps = { workouts: WorkoutDraft[]; onAddWorkout: () => void };

export function SplitBuilder({ workouts, onAddWorkout }: SplitBuilderProps) {
  return (
    <div className="@container/itinerary min-h-0 min-w-0 overflow-hidden p-3">
      <div>header</div>

      <ScrollArea className="min-h-0 flex-1">
        <TabsPrimitive.Root>
          <div>
            {workouts.length && (
              <TabsPrimitive.List>
                {workouts.map((workout) => (
                  <TabsPrimitive.Trigger value={workout.id}>
                    {workout.name}
                  </TabsPrimitive.Trigger>
                ))}
              </TabsPrimitive.List>
            )}

            <Button type="button" onClick={onAddWorkout}>
              <Plus aria-hidden="true" />
            </Button>
          </div>

          {workouts.length === 0 ?
            <EmptySplitDisplay />
          : <div className="relative">
              <div className="relative flex flex-col gap-5">
                {workouts.map((workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    position={index + 1}
                    workout={workout}
                  />
                ))}
              </div>
            </div>
          }
        </TabsPrimitive.Root>
      </ScrollArea>
    </div>
  );
}

function EmptySplitDisplay() {
  return (
    <Empty className="min-h-80">
      <EmptyHeader>
        <EmptyTitle>No workouts yet</EmptyTitle>
        <EmptyDescription>
          Add your first workout to get started.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
