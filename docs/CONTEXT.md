# Workout Tracker Domain Language

This document defines the shared product language for reusable training structure, scheduling, and performed training. These meanings should remain consistent across user-facing copy, product documentation, APIs, tests, and implementation naming where practical.

## Language

**Exercise**:
A reusable movement from the application's curated library. An Exercise does not contain a user's planned or performed training data.

**Program**:
A long-term training plan corresponding to a macrocycle. A Program contains ordered Training Blocks that organize progression toward a broader training goal.

**Training Block**:
A finite progression phase corresponding to a mesocycle. A Training Block applies planned training progression to a Training Split across numbered Weeks.

**Week**:
A numbered planning period within a Training Block and the initial product's representation of a microcycle. Planned training may vary between Weeks while remaining part of the same Training Block.

**Scheduled Workout**:
A Workout assigned to a specific calendar date. It represents one intended occurrence and remains distinct from both the reusable Workout and the Workout Session that records performance.

**Workout Session**:
The performed occurrence of a Scheduled Workout. It preserves the historical facts needed to show what the user actually did even if the reusable Workout later changes or is deleted.

**Set Log**:
The performed data for one set, including actual reps and weight. A Set Log is historical performance, not a planned prescription.
