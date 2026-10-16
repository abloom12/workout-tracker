import type { exercise_setup } from '../../schemas/exercise.js';

export type ExerciseSetupSeed = Pick<
  typeof exercise_setup.$inferSelect,
  'code' | 'name' | 'load_convention' | 'is_unilateral'
> & {
  exercise: string;
  equipment: string;
  grip: string;
  attachment: string | null;
};
