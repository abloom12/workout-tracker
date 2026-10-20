export type PlannedSetDraft = {
  id: string;
  setType: 'warmup' | 'working';
  repsMin: number | null;
  repsMax: number | null;
  isAmrap: boolean;
  targetWeightLb: number | null;
  durationSeconds: number | null;
};

export type WorkoutExerciseDraft = {
  id: string;
  setupId: number;
  sets: PlannedSetDraft[];
};

export type WorkoutDraft = { name: string; exercises: WorkoutExerciseDraft[] };

export type WorkoutDraftWithId = WorkoutDraft & { id: string };

export type EditorDraft = {
  split: { name: string; workoutIds: string[] };
  workoutsById: Record<string, WorkoutDraft>;
};
