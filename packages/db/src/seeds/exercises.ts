import type { exercise } from '../schemas/exercise.js';

export const exercises = [
  // Chest
  { code: 'bench_press', name: 'Bench Press' },
  { code: 'chest_fly', name: 'Chest Fly' },
  { code: 'decline_bench_press', name: 'Decline Bench Press' },
  { code: 'decline_chest_fly', name: 'Decline Chest Fly' },
  { code: 'decline_push_up', name: 'Decline Push-Up' },
  { code: 'dips', name: 'Dips' },
  { code: 'floor_press', name: 'Floor Press' },
  { code: 'incline_bench_press', name: 'Incline Bench Press' },
  { code: 'incline_chest_fly', name: 'Incline Chest Fly' },
  { code: 'incline_push_up', name: 'Incline Push-Up' },
  { code: 'larsen_press', name: 'Larsen Press' },
  { code: 'push_up', name: 'Push-Up' },
  // Back
  { code: 'bent_over_row', name: 'Bent-Over Row' },
  { code: 'chest_supported_row', name: 'Chest-Supported Row' },
  { code: 'chin_up', name: 'Chin-Up' },
  { code: 'inverted_row', name: 'Inverted Row' },
  { code: 'lat_pulldown', name: 'Lat Pulldown' }, // TODO
  { code: 'muscle_up', name: 'Muscle-Up' },
  { code: 'pendlay_row', name: 'Pendlay Row' },
  { code: 'pull_up', name: 'Pull-Up' },
  { code: 'pullover', name: 'Pullover' },
  { code: 'seated_row', name: 'Seated Row' }, // TODO
  { code: 'shrug', name: 'Shrug' },
  { code: 'straight_arm_pulldown', name: 'Straight-Arm Pulldown' }, // TODO
  // Shoulders
  { code: 'arnold_press', name: 'Arnold Press' },
  { code: 'face_pull', name: 'Face Pull' }, // TODO
  { code: 'front_raise', name: 'Front Raise' },
  { code: 'handstand_push_up', name: 'Handstand Push-Up' },
  { code: 'lateral_raise', name: 'Lateral Raise' },
  { code: 'overhead_press', name: 'Overhead Press' },
  { code: 'pike_push_up', name: 'Pike Push-Up' }, // TODO
  { code: 'push_press', name: 'Push Press' },
  { code: 'reverse_fly', name: 'Reverse Fly' },
  { code: 'seated_front_raise', name: 'Seated Front Raise' },
  { code: 'seated_lateral_raise', name: 'Seated Lateral Raise' },
  { code: 'seated_overhead_press', name: 'Seated Overhead Press' },
  { code: 'upright_row', name: 'Upright Row' },
  // Biceps
  { code: 'biceps_curl', name: 'Biceps Curl' },
  { code: 'concentration_curl', name: 'Concentration Curl' }, // TODO
  { code: 'drag_curl', name: 'Drag Curl' },
  { code: 'hammer_curl', name: 'Hammer Curl' },
  { code: 'incline_curl', name: 'Incline Curl' },
  { code: 'preacher_curl', name: 'Preacher Curl' },
  { code: 'wrist_curl', name: 'Wrist Curl' }, // TODO
  { code: 'wrist_extension', name: 'Wrist Extension' }, // TODO
  // Triceps
  { code: 'jm_press', name: 'JM Press' },
  { code: 'overhead_triceps_extension', name: 'Overhead Triceps Extension' },
  { code: 'triceps_kickback', name: 'Triceps Kickback' },
  { code: 'triceps_pushdown', name: 'Triceps Pushdown' },
  // Legs
  { code: 'back_squat', name: 'Back Squat' },
  { code: 'box_squat', name: 'Box Squat' },
  { code: 'bulgarian_split_squat', name: 'Bulgarian Split Squat' }, // TODO
  { code: 'deadlift', name: 'Deadlift' },
  { code: 'forward_lunge', name: 'Forward Lunge' }, // TODO
  { code: 'front_squat', name: 'Front Squat' },
  { code: 'glute_bridge', name: 'Glute Bridge' },
  { code: 'glute_kickback', name: 'Glute Kickback' }, // TODO
  { code: 'goblet_squat', name: 'Goblet Squat' },
  { code: 'good_morning', name: 'Good Morning' },
  { code: 'hip_abduction', name: 'Hip Abduction' }, // TODO
  { code: 'hip_adduction', name: 'Hip Adduction' }, // TODO
  { code: 'hip_thrust', name: 'Hip Thrust' },
  { code: 'lateral_lunge', name: 'Lateral Lunge' }, // TODO
  { code: 'nordic_curl', name: 'Nordic Curl' },
  { code: 'pistol_squat', name: 'Pistol Squat' }, // TODO
  { code: 'pull_through', name: 'Pull-Through' }, // TODO
  { code: 'reverse_lunge', name: 'Reverse Lunge' }, // TODO
  { code: 'reverse_nordic_curl', name: 'Reverse Nordic Curl' },
  { code: 'romanian_deadlift', name: 'Romanian Deadlift' },
  { code: 'seated_calf_raise', name: 'Seated Calf Raise' },
  { code: 'sissy_squat', name: 'Sissy Squat' },
  { code: 'split_squat', name: 'Split Squat' }, // TODO
  { code: 'standing_calf_raise', name: 'Standing Calf Raise' },
  { code: 'step_up', name: 'Step-Up' }, // TODO
  { code: 'stiff_leg_deadlift', name: 'Stiff-Leg Deadlift' },
  { code: 'sumo_deadlift', name: 'Sumo Deadlift' },
  { code: 'walking_lunge', name: 'Walking Lunge' }, // TODO
  { code: 'zercher_squat', name: 'Zercher Squat' },
  // Core
  { code: 'bird_dog', name: 'Bird Dog' }, // TODO
  { code: 'crunch', name: 'Crunch' },
  { code: 'dead_bug', name: 'Dead Bug' }, // TODO
  { code: 'farmers_carry', name: 'Farmer’s Carry' },
  { code: 'hanging_knee_raise', name: 'Hanging Knee Raise' },
  { code: 'hanging_leg_raise', name: 'Hanging Leg Raise' },
  { code: 'l_sit', name: 'L-Sit' },
  { code: 'pallof_press', name: 'Pallof Press' }, // TODO
  { code: 'plank', name: 'Plank' },
  { code: 'reverse_crunch', name: 'Reverse Crunch' },
  { code: 'side_plank', name: 'Side Plank' }, // TODO
  { code: 'suitcase_carry', name: 'Suitcase Carry' }, // TODO
  // Olympic lifts
  { code: 'hang_clean', name: 'Hang Clean' },
  { code: 'power_clean', name: 'Power Clean' },
  { code: 'snatch', name: 'Snatch' },
] satisfies (typeof exercise.$inferInsert)[];
