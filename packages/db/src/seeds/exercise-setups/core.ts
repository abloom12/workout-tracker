import type { ExerciseSetupSeed } from './types.js';

const floorCoreSetups = [
  {
    code: 'plank_bodyweight_standard',
    attachment: null,
    name: 'Plank',
    exercise: 'plank',
    equipment: 'floor',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
  {
    code: 'crunch_bodyweight_standard',
    attachment: null,
    name: 'Crunch',
    exercise: 'crunch',
    equipment: 'floor',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
  {
    code: 'l_sit_bodyweight_standard',
    attachment: null,
    name: 'L-Sit',
    exercise: 'l_sit',
    equipment: 'floor',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
  {
    code: 'reverse_crunch_bodyweight_standard',
    attachment: null,
    name: 'Reverse Crunch',
    exercise: 'reverse_crunch',
    equipment: 'floor',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
  {
    code: 'bird_dog_floor_standard',
    attachment: null,
    name: 'Bird Dog',
    exercise: 'bird_dog',
    equipment: 'floor',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: true,
  },
  {
    code: 'dead_bug_floor_standard',
    attachment: null,
    name: 'Dead Bug',
    exercise: 'dead_bug',
    equipment: 'floor',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: true,
  },
  {
    code: 'side_plank_floor_standard',
    attachment: null,
    name: 'Side Plank',
    exercise: 'side_plank',
    equipment: 'floor',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: true,
  },
] satisfies ExerciseSetupSeed[];

const fixedBarCoreSetups = [
  {
    code: 'hanging_knee_raise_bodyweight_standard',
    attachment: null,
    name: 'Hanging Knee Raise',
    exercise: 'hanging_knee_raise',
    equipment: 'fixed_bar',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
  {
    code: 'hanging_leg_raise_bodyweight_standard',
    attachment: null,
    name: 'Hanging Leg Raise',
    exercise: 'hanging_leg_raise',
    equipment: 'fixed_bar',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
] satisfies ExerciseSetupSeed[];

const dumbbellCoreSetups = [
  {
    code: 'crunch_dumbbell_standard',
    attachment: null,
    name: 'Dumbbell Crunch',
    exercise: 'crunch',
    equipment: 'dumbbell',
    grip: 'standard',
    load_convention: 'per_implement',
    is_unilateral: false,
  },
  {
    code: 'farmers_carry_dumbbell_standard',
    attachment: null,
    name: 'Dumbbell Farmer’s Carry',
    exercise: 'farmers_carry',
    equipment: 'dumbbell',
    grip: 'standard',
    load_convention: 'per_implement',
    is_unilateral: false,
  },
  {
    code: 'suitcase_carry_dumbbell_standard',
    attachment: null,
    name: 'Dumbbell Suitcase Carry',
    exercise: 'suitcase_carry',
    equipment: 'dumbbell',
    grip: 'standard',
    load_convention: 'per_implement',
    is_unilateral: true,
  },
] satisfies ExerciseSetupSeed[];

const cableCoreSetups = [
  {
    code: 'pallof_press_cable_standard',
    attachment: 'd_handle',
    name: 'Cable Pallof Press',
    exercise: 'pallof_press',
    equipment: 'cable',
    grip: 'standard',
    load_convention: 'total_weight',
    is_unilateral: true,
  },
] satisfies ExerciseSetupSeed[];

const parallelBarsCoreSetups = [
  {
    code: 'l_sit_parallel_bars_standard',
    attachment: null,
    name: 'Parallel Bar L-Sit',
    exercise: 'l_sit',
    equipment: 'parallel_bars',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
] satisfies ExerciseSetupSeed[];

const olympicRingsCoreSetups = [
  {
    code: 'l_sit_olympic_rings_standard',
    attachment: null,
    name: 'Ring L-Sit',
    exercise: 'l_sit',
    equipment: 'olympic_rings',
    grip: 'standard',
    load_convention: 'added_to_bodyweight',
    is_unilateral: false,
  },
] satisfies ExerciseSetupSeed[];

export const coreSetups = [
  ...floorCoreSetups,
  ...fixedBarCoreSetups,
  ...dumbbellCoreSetups,
  ...cableCoreSetups,
  ...parallelBarsCoreSetups,
  ...olympicRingsCoreSetups,
];
