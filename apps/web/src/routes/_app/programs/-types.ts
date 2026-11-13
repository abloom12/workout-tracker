type Exercise = { id: number };

type Workout = { id: number; name: string; exercises: Exercise[] };

export type Program = { id: number; name: string; workouts: Workout[] };
