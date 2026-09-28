# Workout Session History vs. Mutable Workout Templates

## The problem

A `workout_session` currently stores a foreign key to a `workout`:

```dbml
Table workout_session {
  id int [pk, increment]
  owner_id uuid [not null]
  workout_id int [not null]
  completed timestamp [not null]
}
```

This means a historical workout session points back to the same `workout` row that is still being used as an editable workout template.

That creates a potential historical-data problem because the `workout` and `workout_exercise` records can change after a session has already been completed.

## Example

Suppose workout `id = 10` initially looks like this:

```text
Push Day

1. Bench Press
2. Overhead Press
3. Tricep Pushdown
```

The user completes that workout on September 25.

A session is recorded:

```text
workout_session
----------------
id: 100
workout_id: 10
completed: 2026-09-25
```

Later, the user edits the `Push Day` workout template:

```text
Push Day

1. Bench Press
2. Incline Bench Press
3. Tricep Pushdown
```

The user replaced Overhead Press with Incline Bench Press.

However, historical session `100` still has:

```text
workout_id = 10
```

and workout `10` now represents the new version of the template.

If the application reconstructs the historical session by joining:

```text
workout_session
→ workout
→ workout_exercise
→ exercise
```

it may incorrectly make the old session appear as though Incline Bench Press was part of the workout on September 25, even though Overhead Press was actually part of the template at that time.

In other words, the foreign key preserves the identity of the workout, but it does **not preserve the historical state of that workout**.

## Why `workout_set` helps

The current schema already mitigates part of this problem because actual performed sets reference an exercise directly:

```dbml
Table workout_set {
  exercise_id int [not null]
  workout_session_id int [not null]
  ...
}
```

Therefore, if the user actually performed Overhead Press, the historical set rows still reference Overhead Press even if the workout template is edited later.

This means actual performance data remains intact.

However, it does not preserve everything about the workout as it existed at the time.

For example, the historical record may lose:

- exercises that were scheduled but skipped
- original exercise ordering
- exercises that had zero completed sets
- template-specific instructions
- planned set/rep targets
- rest-time targets
- workout notes or exercise notes
- supersets or grouping information
- any other template metadata added later

The distinction is:

```text
workout / workout_exercise
    = what the workout template currently looks like

workout_session / workout_set
    = what the user actually performed
```

Those are related, but they are not necessarily sufficient to reconstruct exactly what the workout looked like when the session began.

## General issue: mutable templates vs. immutable history

Workout templates are naturally mutable.

Users will want to:

- add exercises
- remove exercises
- reorder exercises
- rename workouts
- change programming
- update rep ranges
- change set counts

Historical workout sessions should generally be treated as immutable records.

A session should answer:

> What happened during this workout on this date?

That answer should not change because the user edited a workout template several weeks later.

Therefore, historical records should eventually avoid depending on mutable template data for information that needs to remain historically accurate.

## Possible future solutions

### Option 1: Snapshot the workout when the session starts

When a `workout_session` is created, copy the relevant workout structure into session-specific records.

For example:

```text
workout
    ↓
workout_exercise

        snapshot at session creation

workout_session
    ↓
workout_session_exercise
    ↓
workout_set
```

A possible table could look like:

```dbml
Table workout_session_exercise {
  id int [pk, increment]
  workout_session_id int [not null]
  exercise_id int [not null]
  position int [not null]
}
```

When the workout starts, each current `workout_exercise` is copied into `workout_session_exercise`.

Historical sessions would then preserve:

- which exercises were included
- their order
- exercises that were skipped
- the workout structure at that point in time

Additional programmed values could also be copied into this table later.

This is probably the simplest long-term solution.

### Option 2: Version workout templates

Instead of modifying a workout definition in place, every meaningful edit creates a new version.

Conceptually:

```text
workout
    ↓
workout_version
    ↓
workout_version_exercise
```

A session would reference:

```text
workout_version_id
```

rather than just:

```text
workout_id
```

For example:

```text
Push Day
├── version 1
│   ├── Bench Press
│   ├── Overhead Press
│   └── Tricep Pushdown
│
└── version 2
    ├── Bench Press
    ├── Incline Bench Press
    └── Tricep Pushdown
```

The September 25 session could permanently reference version 1, while future sessions use version 2.

This provides stronger historical modeling but adds more complexity.

### Option 3: Store denormalized snapshot data

Another possibility is storing historical details directly on session records, potentially as structured JSON.

For example:

```text
workout_session.template_snapshot
```

could contain:

```json
{
  "name": "Push Day",
  "exercises": [
    { "exercise_id": 1, "position": 1 },
    { "exercise_id": 4, "position": 2 },
    { "exercise_id": 7, "position": 3 }
  ]
}
```

This makes snapshots easy to create but makes relational querying and integrity enforcement more difficult.

## Likely future direction

For this application, a `workout_session_exercise` table is likely the best next step if accurate historical reconstruction becomes important.

The model would become:

```text
workout
    ↓
workout_exercise
    ↓
used as the template when starting a workout


workout_session
    ↓
workout_session_exercise
    ↓
workout_set
```

`workout_session_exercise` would represent:

> This exercise was part of this specific workout session.

`workout_set` would represent:

> This specific set was performed for that exercise.

Eventually, it may also make sense for `workout_set` to reference `workout_session_exercise` rather than referencing both `workout_session` and `exercise` independently.

That would produce a hierarchy like:

```text
workout_session
    ↓
workout_session_exercise
    ↓
workout_set
```

This more closely models the real-world structure of a completed workout.

## MVP decision

This does **not need to be solved immediately**.

The current schema already preserves the most important performance data because each `workout_set` records:

- the session
- the exercise
- the weight
- the reps
- the set number
- the set type

Therefore, actual performed sets will not silently change when the workout template changes.

For the MVP, keep the current design.

Revisit this when the application needs to accurately reconstruct the exact workout plan or structure that existed at the time a historical session was performed.
