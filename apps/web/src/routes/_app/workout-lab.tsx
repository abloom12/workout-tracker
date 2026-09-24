import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Check, Plus, Save, Search, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { trpc } from '@/lib/trpc';

export const Route = createFileRoute('/_app/workout-lab')({
  component: WorkoutLabPage,
});

type ExerciseSummary = { id: number; name: string };

type WorkoutDraft = { id: string; name: string; exerciseIds: number[] };

type TrainingSplitDraft = { name: string; workouts: WorkoutDraft[] };

function createWorkout(id: string): WorkoutDraft {
  return { id, name: '', exerciseIds: [] };
}

const initialSplit: TrainingSplitDraft = {
  name: '',
  workouts: [createWorkout('workout-1')],
};

function buildPrototypeState(split: TrainingSplitDraft) {
  return {
    name: split.name.trim(),
    workouts: split.workouts.map((workout, position) => ({
      position,
      name: workout.name.trim(),
      exerciseIds: workout.exerciseIds,
    })),
  };
}

type PrototypeState = ReturnType<typeof buildPrototypeState>;

function WorkoutLabPage() {
  const exercisesQuery = useQuery(trpc.exercise.list.queryOptions());
  const [split, setSplit] = useState<TrainingSplitDraft>(initialSplit);
  const [savedState, setSavedState] = useState<PrototypeState | null>(null);
  const [workoutPendingRemoval, setWorkoutPendingRemoval] = useState<
    string | null
  >(null);

  const exercises = exercisesQuery.data ?? [];
  const pendingWorkout = split.workouts.find(
    ({ id }) => id === workoutPendingRemoval,
  );

  const updateWorkout = (
    workoutId: string,
    update: (workout: WorkoutDraft) => WorkoutDraft,
  ) => {
    setSplit((current) => ({
      ...current,
      workouts: current.workouts.map((workout) =>
        workout.id === workoutId ? update(workout) : workout,
      ),
    }));
  };

  const addWorkout = () => {
    setSplit((current) => ({
      ...current,
      workouts: [...current.workouts, createWorkout(crypto.randomUUID())],
    }));
  };

  const removeWorkout = (workoutId: string) => {
    setSplit((current) => {
      if (current.workouts.length === 1) return current;

      return {
        ...current,
        workouts: current.workouts.filter(({ id }) => id !== workoutId),
      };
    });
    setWorkoutPendingRemoval(null);
  };

  const requestWorkoutRemoval = (workout: WorkoutDraft) => {
    if (split.workouts.length === 1) return;

    if (workout.name.trim() || workout.exerciseIds.length > 0) {
      setWorkoutPendingRemoval(workout.id);
      return;
    }

    removeWorkout(workout.id);
  };

  const savePrototype = () => {
    const nextSavedState = buildPrototypeState(split);

    console.info('Training Split prototype state', nextSavedState);
    setSavedState(nextSavedState);
  };

  return (
    <section
      className="mx-auto w-full max-w-[100rem] px-4 py-6 sm:px-6 lg:px-8"
      aria-labelledby="workout-lab-title"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm font-medium">
              Product playground
            </p>
            <Badge variant="outline">Local state only</Badge>
          </div>
          <h1
            id="workout-lab-title"
            className="mt-2 text-3xl font-semibold tracking-tight"
          >
            Workout lab
          </h1>
        </div>

        <Button type="button" onClick={savePrototype}>
          <Save aria-hidden="true" />
          Preview save
        </Button>
      </header>

      <div className="mt-6 w-full max-w-md space-y-2">
        <Label htmlFor="split-name">Training Split name</Label>
        <Input
          id="split-name"
          value={split.name}
          placeholder="For example, Push Pull Legs"
          autoComplete="off"
          onChange={(event) =>
            setSplit((current) => ({ ...current, name: event.target.value }))
          }
        />
      </div>

      <div
        className="mt-6 overflow-x-auto pb-4"
        role="region"
        aria-label="Training Split Workouts"
        tabIndex={0}
      >
        <div className="flex min-w-max items-stretch gap-4">
          {split.workouts.map((workout, workoutIndex) => (
            <Card
              key={workout.id}
              className="border-foreground/30 w-[21rem] shrink-0 border ring-0"
              aria-label={`Workout ${workoutIndex + 1}`}
            >
              <CardContent className="flex min-h-[28rem] flex-col">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={`workout-name-${workout.id}`}>
                      Workout name
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={split.workouts.length === 1}
                      aria-label={`Remove ${workout.name.trim() || `Workout ${workoutIndex + 1}`} from Split`}
                      onClick={() => requestWorkoutRemoval(workout)}
                    >
                      <Trash2 aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                  <Input
                    id={`workout-name-${workout.id}`}
                    value={workout.name}
                    placeholder={
                      workoutIndex === 0 ? 'Push'
                      : workoutIndex === 1 ?
                        'Pull'
                      : workoutIndex === 2 ?
                        'Legs'
                      : `Workout ${workoutIndex + 1}`
                    }
                    autoComplete="off"
                    onChange={(event) =>
                      updateWorkout(workout.id, (current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </div>

                <h3 className="mt-5 text-sm font-medium">Exercise order</h3>

                <ScrollArea className="mt-3 h-[20rem]">
                  {workout.exerciseIds.length === 0 ?
                    <div className="border-border mr-3 flex h-[19rem] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                      <p className="font-medium">No Exercises yet</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Add movements for this part of the Split.
                      </p>
                    </div>
                  : <ItemGroup className="pr-3">
                      {workout.exerciseIds.map((exerciseId, exerciseIndex) => {
                        const exercise = exercises.find(
                          ({ id }) => id === exerciseId,
                        );
                        const exerciseName =
                          exercise?.name ?? `Unknown Exercise ${exerciseId}`;

                        return (
                          <Item
                            key={exerciseId}
                            role="listitem"
                            variant="outline"
                            size="sm"
                          >
                            <span className="text-muted-foreground w-4 shrink-0 text-xs tabular-nums">
                              {exerciseIndex + 1}
                            </span>
                            <ItemContent>
                              <ItemTitle>{exerciseName}</ItemTitle>
                            </ItemContent>
                            <ItemActions className="gap-0">
                              <Button
                                type="button"
                                size="icon-xs"
                                variant="ghost"
                                aria-label={`Remove ${exerciseName}`}
                                onClick={() =>
                                  updateWorkout(workout.id, (current) => ({
                                    ...current,
                                    exerciseIds: current.exerciseIds.filter(
                                      (_, index) => index !== exerciseIndex,
                                    ),
                                  }))
                                }
                              >
                                <Trash2 aria-hidden="true" />
                              </Button>
                            </ItemActions>
                          </Item>
                        );
                      })}
                    </ItemGroup>
                  }
                </ScrollArea>
              </CardContent>

              <CardFooter>
                <ExercisePicker
                  workoutId={workout.id}
                  workoutName={workout.name || `Workout ${workoutIndex + 1}`}
                  exercises={exercises}
                  existingExerciseIds={workout.exerciseIds}
                  isError={exercisesQuery.isError}
                  isPending={exercisesQuery.isPending}
                  onRetry={() => void exercisesQuery.refetch()}
                  onAdd={(exerciseIds) =>
                    updateWorkout(workout.id, (current) => {
                      const existingIds = new Set(current.exerciseIds);
                      const newIds = exerciseIds.filter(
                        (exerciseId) => !existingIds.has(exerciseId),
                      );

                      return {
                        ...current,
                        exerciseIds: [...current.exerciseIds, ...newIds],
                      };
                    })
                  }
                />
              </CardFooter>
            </Card>
          ))}
          <Button
            type="button"
            variant="outline"
            className="border-foreground/40 min-h-[32rem] w-[21rem] shrink-0 self-stretch border-dashed text-base"
            onClick={addWorkout}
          >
            <Plus aria-hidden="true" />
            Add another Workout
          </Button>
        </div>
      </div>

      {savedState && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm font-medium">
            Last prototype save
          </summary>
          <pre className="bg-muted mt-3 max-h-64 overflow-auto rounded-lg p-3 text-xs">
            {JSON.stringify(savedState, null, 2)}
          </pre>
        </details>
      )}

      <AlertDialog
        open={workoutPendingRemoval !== null}
        onOpenChange={(open) => {
          if (!open) setWorkoutPendingRemoval(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingWorkout?.name ?? 'This Workout'} and its Exercise order
              will be removed from the prototype Split.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Workout</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (workoutPendingRemoval) {
                  removeWorkout(workoutPendingRemoval);
                }
              }}
            >
              Remove Workout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function ExercisePicker({
  exercises,
  existingExerciseIds,
  isError,
  isPending,
  onAdd,
  onRetry,
  workoutId,
  workoutName,
}: {
  exercises: ExerciseSummary[];
  existingExerciseIds: number[];
  isError: boolean;
  isPending: boolean;
  onAdd: (exerciseIds: number[]) => void;
  onRetry: () => void;
  workoutId: string;
  workoutName: string;
}) {
  const [search, setSearch] = useState('');
  const [pendingExerciseIds, setPendingExerciseIds] = useState<number[]>([]);
  const existingIds = new Set(existingExerciseIds);
  const pendingIds = new Set(pendingExerciseIds);
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLocaleLowerCase().includes(normalizedSearch),
  );

  const toggleExercise = (exerciseId: number) => {
    setPendingExerciseIds((current) =>
      current.includes(exerciseId) ?
        current.filter((id) => id !== exerciseId)
      : [...current, exerciseId],
    );
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setSearch('');
          setPendingExerciseIds([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Plus aria-hidden="true" />
          Add Exercises
        </Button>
      </DialogTrigger>

      <DialogContent className="grid max-h-[85vh] grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Exercises to {workoutName}</DialogTitle>
          <DialogDescription>
            Search the curated library and add multiple Exercises at once.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor={`exercise-search-${workoutId}`} className="sr-only">
            Search Exercises
          </Label>
          <InputGroup>
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={`exercise-search-${workoutId}`}
              value={search}
              placeholder="Search Exercises…"
              autoComplete="off"
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
        </div>

        <ScrollArea className="h-[min(55vh,30rem)] rounded-lg border">
          <div className="space-y-2 p-3">
            {isPending && (
              <div
                className="text-muted-foreground flex items-center gap-2 p-3"
                aria-live="polite"
              >
                <Spinner className="size-4" />
                Loading Exercises…
              </div>
            )}

            {isError && (
              <div className="space-y-3 p-3" role="alert">
                <p className="text-destructive text-sm">
                  Could not load Exercises.
                </p>
                <Button type="button" variant="outline" onClick={onRetry}>
                  Retry
                </Button>
              </div>
            )}

            {!isPending && !isError && filteredExercises.length === 0 && (
              <p className="text-muted-foreground p-3 text-sm">
                No Exercises match that search.
              </p>
            )}

            {!isPending &&
              !isError &&
              filteredExercises.map((exercise) => {
                const isExisting = existingIds.has(exercise.id);
                const isPendingSelection = pendingIds.has(exercise.id);

                return (
                  <Item
                    key={exercise.id}
                    asChild
                    variant={isPendingSelection ? 'muted' : 'outline'}
                  >
                    <button
                      type="button"
                      className="cursor-pointer text-left disabled:cursor-not-allowed"
                      disabled={isExisting}
                      aria-pressed={isExisting ? undefined : isPendingSelection}
                      onClick={() => toggleExercise(exercise.id)}
                    >
                      <ItemContent>
                        <ItemTitle>{exercise.name}</ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        {isExisting ?
                          <Badge variant="secondary">Added</Badge>
                        : isPendingSelection ?
                          <Check aria-hidden="true" />
                        : <Plus aria-hidden="true" />}
                      </ItemActions>
                    </button>
                  </Item>
                );
              })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={pendingExerciseIds.length === 0}
              onClick={() => onAdd(pendingExerciseIds)}
            >
              {pendingExerciseIds.length === 0 ?
                'Add selected'
              : `Add ${pendingExerciseIds.length} Exercise${pendingExerciseIds.length === 1 ? '' : 's'}`
              }
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
