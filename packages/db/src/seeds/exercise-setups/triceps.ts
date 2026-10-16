import type { ExerciseSetupSeed } from './types.js';

const barbellTricepsSetups = [
  {
    code: 'jm_press_barbell_standard',
    attachment: null,
    name: 'JM Press',
    exercise: 'jm_press',
    equipment: 'barbell',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
  {
    code: 'overhead_triceps_extension_barbell_standard',
    attachment: null,
    name: 'Barbell Overhead Triceps Extension',
    exercise: 'overhead_triceps_extension',
    equipment: 'barbell',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
] satisfies ExerciseSetupSeed[];

const dumbbellTricepsSetups = [
  {
    code: 'overhead_triceps_extension_dumbbell_standard',
    attachment: null,
    name: 'Dumbbell Overhead Triceps Extension',
    exercise: 'overhead_triceps_extension',
    equipment: 'dumbbell',
    grip: 'standard',
    load_convention: 'per_implement',
    is_unilateral: false,
  },
  {
    code: 'triceps_kickback_dumbbell_standard',
    attachment: null,
    name: 'Dumbbell Triceps Kickback',
    exercise: 'triceps_kickback',
    equipment: 'dumbbell',
    grip: 'standard',
    load_convention: 'per_implement',
    is_unilateral: false,
  },
] satisfies ExerciseSetupSeed[];

const cableTricepsSetups = [
  {
    code: 'triceps_pushdown_cable_standard',
    attachment: 'straight_bar',
    name: 'Cable Triceps Pushdown',
    exercise: 'triceps_pushdown',
    equipment: 'cable',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
  {
    code: 'triceps_pushdown_cable_underhand',
    attachment: 'straight_bar',
    name: 'Underhand Cable Triceps Pushdown',
    exercise: 'triceps_pushdown',
    equipment: 'cable',
    grip: 'underhand',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
  {
    code: 'triceps_pushdown_cable_neutral',
    attachment: 'rope',
    name: 'Neutral-Grip Cable Triceps Pushdown',
    exercise: 'triceps_pushdown',
    equipment: 'cable',
    grip: 'neutral',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
  {
    code: 'overhead_triceps_extension_cable_standard',
    attachment: 'rope',
    name: 'Cable Overhead Triceps Extension',
    exercise: 'overhead_triceps_extension',
    equipment: 'cable',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: false,
  },
] satisfies ExerciseSetupSeed[];

export const tricepsSetups = [
  ...barbellTricepsSetups,
  ...dumbbellTricepsSetups,
  ...cableTricepsSetups,
];
