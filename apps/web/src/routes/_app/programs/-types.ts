export type Program = { id: number; name: string; workouts: Workout[] };

type Workout = { id: number; name: string; exercises: Exercise[] };

type Exercise = { id: number; exerciseSetupId: number };

export type ExerciseProgression = {
  exerciseId: number;
  progressions: Prescription[];
};

type Prescription = { id: number; setGroups: SetGroup[] };

type SetGroupType = 'warmpup' | 'working' | 'top' | 'backoff';

type SetGroup = { id: number; type: SetGroupType; sets: number; reps: number };
