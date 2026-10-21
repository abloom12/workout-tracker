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

export type WorkoutDraft = {
  id: string;
  name: string;
  exercises: WorkoutExerciseDraft[];
};

export type EditorDraft = {
  split: { name: string; workoutIds: string[] };
  workoutsById: Record<string, WorkoutDraft>;
};
