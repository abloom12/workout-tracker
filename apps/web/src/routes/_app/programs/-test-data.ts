export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  modifiers?: string[];
};
export type Workout = { day: number; name: string; exercises: Exercise[] };

export const TEST_WORKOUTS: [Workout, ...Workout[]] = [
  {
    day: 1,
    name: 'Upper strength',
    exercises: [
      {
        name: 'Bench press',
        sets: 4,
        reps: '5–6',
        rest: '3:00',
        modifiers: ['Chains'],
      },
      { name: 'Weighted pull-up', sets: 4, reps: '5–6', rest: '3:00' },
      { name: 'Dumbbell row', sets: 3, reps: '8–10', rest: '1:30' },
    ],
  },
  {
    day: 2,
    name: 'Lower strength',
    exercises: [
      {
        name: 'Back squat',
        sets: 4,
        reps: '5–6',
        rest: '3:00',
        modifiers: ['Pause · 2s'],
      },
      { name: 'Romanian deadlift', sets: 3, reps: '6–8', rest: '2:00' },
      { name: 'Calf raise', sets: 3, reps: '12–15', rest: '1:00' },
    ],
  },
  {
    day: 3,
    name: 'Upper volume',
    exercises: [
      { name: 'Incline dumbbell press', sets: 3, reps: '8–12', rest: '1:30' },
      { name: 'Lat pulldown', sets: 3, reps: '10–12', rest: '1:30' },
      { name: 'Lateral raise', sets: 3, reps: '12–15', rest: '0:45' },
    ],
  },
  {
    day: 4,
    name: 'Lower volume',
    exercises: [
      { name: 'Leg press', sets: 3, reps: '10–12', rest: '2:00' },
      { name: 'Leg curl', sets: 3, reps: '10–15', rest: '1:00' },
      { name: 'Hip thrust', sets: 3, reps: '8–12', rest: '1:30' },
    ],
  },
];

export const addingWorkout =
  TEST_WORKOUTS.find((workout) => workout.day === 2) ?? TEST_WORKOUTS[0];
