// import { dirname, resolve } from 'node:path';
// import { loadEnvFile } from 'node:process';
// import { fileURLToPath } from 'node:url';

// import { createDB } from './index.js';
// import {
//   exercise,
//   exercise_attachment,
//   exercise_equipment,
//   exercise_grip,
//   exercise_setup,
//   modifier,
// } from './schema.js';
// import { attachments } from './seeds/attachments.js';
// import { equipment } from './seeds/equipment.js';
// import { exerciseSetups } from './seeds/exercise-setups/index.js';
// import { exercises } from './seeds/exercises.js';
// import { grips } from './seeds/grips.js';
// import { modifiers } from './seeds/modifiers.js';

// function requireId(
//   ids: Map<string, number>,
//   code: string,
//   kind: string,
//   setupCode: string,
// ): number {
//   const id = ids.get(code);

//   if (id === undefined) {
//     throw new Error(
//       `Unknown ${kind} code "${code}" in exercise setup "${setupCode}"`,
//     );
//   }

//   return id;
// }

// const seedDirectory = dirname(fileURLToPath(import.meta.url));

// if (!process.env.DATABASE_URL) {
//   loadEnvFile(resolve(seedDirectory, '../../../apps/server/.env'));
// }

// const databaseURL = process.env.DATABASE_URL;

// if (!databaseURL) {
//   throw new Error('DATABASE_URL is required');
// }

// const db = createDB(databaseURL);

// try {
//   await db.transaction(async (tx) => {
//     for (const seed of exercises) {
//       await tx
//         .insert(exercise)
//         .values(seed)
//         .onConflictDoUpdate({
//           target: exercise.code,
//           set: { name: seed.name },
//         });
//     }

//     for (const seed of equipment) {
//       await tx
//         .insert(exercise_equipment)
//         .values(seed)
//         .onConflictDoUpdate({
//           target: exercise_equipment.code,
//           set: { name: seed.name },
//         });
//     }

//     for (const seed of grips) {
//       await tx
//         .insert(exercise_grip)
//         .values(seed)
//         .onConflictDoUpdate({
//           target: exercise_grip.code,
//           set: { name: seed.name },
//         });
//     }

//     for (const seed of attachments) {
//       await tx
//         .insert(exercise_attachment)
//         .values(seed)
//         .onConflictDoUpdate({
//           target: exercise_attachment.code,
//           set: { name: seed.name },
//         });
//     }

//     for (const seed of modifiers) {
//       await tx
//         .insert(modifier)
//         .values(seed)
//         .onConflictDoUpdate({
//           target: modifier.code,
//           set: { name: seed.name },
//         });
//     }

//     const exerciseRows = await tx
//       .select({ id: exercise.id, code: exercise.code })
//       .from(exercise);
//     const equipmentRows = await tx
//       .select({ id: exercise_equipment.id, code: exercise_equipment.code })
//       .from(exercise_equipment);
//     const gripRows = await tx
//       .select({ id: exercise_grip.id, code: exercise_grip.code })
//       .from(exercise_grip);
//     const attachmentRows = await tx
//       .select({ id: exercise_attachment.id, code: exercise_attachment.code })
//       .from(exercise_attachment);

//     const exerciseIds = new Map(exerciseRows.map((row) => [row.code, row.id]));
//     const equipmentIds = new Map(equipmentRows.map((row) => [row.code, row.id]));
//     const gripIds = new Map(gripRows.map((row) => [row.code, row.id]));
//     const attachmentIds = new Map(attachmentRows.map((row) => [row.code, row.id]));

//     for (const seed of exerciseSetups) {
//       const attachmentId =
//         seed.attachment === null
//           ? null
//           : requireId(attachmentIds, seed.attachment, 'attachment', seed.code);

//       await tx
//         .insert(exercise_setup)
//         .values({
//           code: seed.code,
//           name: seed.name,
//           exercise_id: requireId(exerciseIds, seed.exercise, 'exercise', seed.code),
//           equipment_id: requireId(
//             equipmentIds,
//             seed.equipment,
//             'equipment',
//             seed.code,
//           ),
//           grip_id: requireId(gripIds, seed.grip, 'grip', seed.code),
//           attachment_id: attachmentId,
//           load_convention: seed.load_convention,
//           is_unilateral: seed.is_unilateral,
//         })
//         .onConflictDoUpdate({
//           target: exercise_setup.code,
//           set: { name: seed.name },
//         });
//     }
//   });
// } finally {
//   await db.$client.end();
// }
