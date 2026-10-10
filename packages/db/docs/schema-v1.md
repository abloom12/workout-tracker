# Workout App — V1 Schema Criteria

1. Core concepts

- Movement: The core exercise movement, such as bench press, squat, or pull-up.
- Exercise variation: A movement combined with an implement and, where applicable, position and grip. For example, incline
  barbell bench press or neutral-grip pull-up. Only valid combinations are supported.
- Modifier: An addition or execution instruction, such as chains, a weighted vest, or a pause. Modifier values can differ
  between sets.
- Workout: A reusable template containing ordered exercise occurrences and their set prescriptions.
- Workout exercise: One occurrence of an exercise variation within a workout. The same variation can appear multiple times,
  with separate prescriptions—for example, heavy bench first and burnout bench last.
- Planned set: One prescribed set within a workout exercise, containing target reps or a rep range, optional target weight,
  and any planned modifiers. Sets can have different prescriptions.
- Split: A reusable, ordered sequence of workouts. The same workout can appear more than once. A split itself does not define
  training days or rest days.
- Split run: A user’s active use of a split, including a repeating schedule of workout and rest days, a user-defined cycle
  length, and either a finite number of repetitions or indefinite repetition.
- Workout session: An actual training session. It starts from a workout but can differ from its prescription without changing
  the template.
- Workout snapshot: A copy of the workout’s full prescription when a session starts, preserved for a side-by-side
  planned-versus-actual view.
- Session exercise: One exercise occurrence within a session. It can come from the workout or be added or changed for that
  session.
- Recorded set: One set actually performed during a session, stored as its own row with actual reps, weight or
  bodyweight-only status, and any modifiers.

2. Exercises

- exercises define the core movement ex. bench press, pullup, squat
- exercises will get an implement (barbell, dumbbell, olympic rings)
- optionally, exercises will also get a "position" (incline, decline) and grip (reverse, close, wide, neutral)
- exercsies can also have a modifier added ex. chains to bench press, or a "pause"
- an exercise will have a primary adn secondary "target" muscle group
- an exercise will have a movement pattern (horizontal push, vertical pull, etc..)
- the same exercise can show up in numerous workouts

3. Workouts

- a workout can belong to multiple splits
- a workout exercise will be a combo of the core movement, implement, position, grip, etc (as applicable, for example you can't do incline pullups thats not a thing)
- a saved workout contains the ordered exercise combos, planned sets, target reps/rep range, optinal target weight, planned modifiers (pause, chains, etc..)
- exercises can be repeated throughout a workout for example exercise 1 is heavy bench and last exercise of wokrout is a single light burn out set of bench.

3a. Editing Workouts

- a user can edit a workout
- if a workout belongs to multiple splits we let user know and ask if they want to either A. change workout for all splits or B. only edit that workout for that split. If user chooses option B we would make a new copy of the workout and then apply the new workout to whatever split user wanted.

4. Splits

- a split only job is to know what workouts belong to it adn what order they are in
- a split dosen't know about its rest days or waht day of week it lands on.
- a user can set a split as beign "active" as in they are running that split repeated in cycles (think push/pull/legs each week)
- when a split is set to avtive user will choose how many cycles they want to run (how many repeptitions of split) or to just run it indefeinatly. this is how we will generate our "schedule" bc we will have user assign a 7 day week the workotus and rest days to each weekeday and then we can calc easily a scheudle as far out as we want.

5. Sessions and History

- users can start a workout
- from there they will log each set and we should store each set as its own row
- the session does not have to mirror the workout precription. the workout is a tempalte of what is to be done but things can change. this would not edit the tempalte the user would just recrod different things. for example if the skip a set they just dno't recrod it, if they skip an exercsie same thing. if the add an exercise its just for that day and won't cahgne workout tempalte but user will just have records of doing that exercise for however many reps and weight. if a user cahnges exercise same idea, what gets recroded to history is different.
- when a workout session starts we want a snapshot of what the workout template was saying should have been done so the recorded history can be compared so users can see the workouts that they "veered from the plan".

6. weight conventions

- barbell weight includes the bar (user configured bar weight)
- dumbbell weight means weight per dumbell (regardless of single or 2 arm exercise)
- any added weight like chains, or weighted vest is seprate from the main load
- support lb and kg and fractional quantities.
- modifier recrods can very between set (different pause times, different chain weight, etc..)
