import type { ExerciseSetupSeed } from './types.js';

export const olympicLiftSetups = [
  {
    code: 'power_clean_barbell_standard',
    attachment: null,
    name: 'Power Clean',
    exercise: 'power_clean',
    equipment: 'barbell',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
  {
    code: 'hang_clean_barbell_standard',
    attachment: null,
    name: 'Hang Clean',
    exercise: 'hang_clean',
    equipment: 'barbell',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
  {
    code: 'snatch_barbell_standard',
    attachment: null,
    name: 'Snatch',
    exercise: 'snatch',
    equipment: 'barbell',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
] satisfies ExerciseSetupSeed[];
