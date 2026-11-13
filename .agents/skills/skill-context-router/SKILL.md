---
name: skill-context-router
description: Meta-skill for context-aware skill discovery and routing. Use at the start of any task to determine which skills to load.
---

# Skill Context Router

Purpose: Route to the right skills based on your current task context.
When to Use: At the start of any development task to identify which skills to load.

## Task Mapping

| Task                            | Read                                  |
| ------------------------------- | ------------------------------------- |
| Library-specific implementation | `.agents/references/intent-skills.md` |

For library work, run the matching commands from the Intent mapping.
Load only relevant skills, including any prerequisites they specify.

For more detailed project-skill matching, consult
`references/skill-registry.yaml`.

If no project skill matches, inspect the relevant source and documentation.
Do not assume a skill exists just because the task needs one.
