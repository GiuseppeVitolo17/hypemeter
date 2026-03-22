# Spec Kit (GitHub) — optional workflow

This repo includes a minimal [Spec-Driven Development](https://github.com/github/spec-kit) setup (`.specify/memory/constitution.md`). For the **full** toolkit (Specify CLI, slash commands, templates), install from upstream:

## Install Specify CLI (recommended)

Requires [uv](https://docs.astral.sh/uv/) and Python 3.11+:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

Then either bootstrap a **new** project:

```bash
specify init my-app --ai cursor-agent
```

Or merge into **this** repo (review changes before committing):

```bash
cd /path/to/hypemeter
specify init --here --ai cursor-agent --force
```

Use `specify check` to verify agent tooling.

## Core slash commands (after `init`)

- `/speckit.constitution` — principles (we keep a hand-written baseline in `.specify/memory/constitution.md`)
- `/speckit.specify` — what to build (requirements)
- `/speckit.plan` — stack & architecture
- `/speckit.tasks` — task list
- `/speckit.implement` — execute tasks

## References

- Upstream repo: [github/spec-kit](https://github.com/github/spec-kit)
- Cursor is listed as a supported agent in their README.
