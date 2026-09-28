## Agent skills

### Issue tracker

Backlog.md is this repo's issue tracker. See `docs/agents/issue-tracker.md`. Follow the Backlog.md guidelines in this file.

### Domain docs

This repo uses a single-context domain-doc layout. See `docs/agents/domain.md`.

## Coding standards

Before changing code, read `docs/agents/coding-standards.md` for
repo-wide guidance. Then read the standards doc for every area the
change touches:

| Area             | Standards                         |
| ---------------- | --------------------------------- |
| `apps/web/`      | `apps/web/docs/standards.md`      |
| `apps/server/`   | `apps/server/docs/standards.md`   |
| `packages/api/`  | `packages/api/docs/standards.md`  |
| `packages/auth/` | `packages/auth/docs/standards.md` |
| `packages/db/`   | `packages/db/docs/standards.md`   |

For changes spanning areas, read all applicable docs. Treat the shared
ESLint, Prettier, and TypeScript configurations under `tooling/` as the
source of truth for mechanically enforced rules.

<!-- BACKLOG.MD GUIDELINES START -->
<!-- backlog.md-instructions-version: 1.52.0 -->

<CRITICAL_INSTRUCTION>

## Backlog.md Workflow

This project uses Backlog.md for task and project management.

**At the beginning of each conversation in this project, run `backlog instructions overview` before answering or taking action. Re-read it only if you have not read it yet in the current conversation.**

Use the overview to decide whether to search, read, create, or update Backlog tasks.

Before task lifecycle actions, read the matching detailed guide:

- `backlog instructions task-creation` before creating or splitting tasks
- `backlog instructions task-execution` before planning, changing status or assignee, adding a plan or implementation notes, or implementing task work
- `backlog instructions task-finalization` before checking acceptance criteria, writing final summaries, or moving tasks to terminal statuses

Use `backlog <command> --help` before running unfamiliar commands. Help shows options, fields, and examples.

Do not edit Backlog task, draft, document, decision, or milestone markdown files directly. Use the `backlog` CLI so metadata, relationships, and history stay consistent.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD GUIDELINES END -->
