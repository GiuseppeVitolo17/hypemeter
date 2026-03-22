# Hypemeter — project constitution

Spec-driven workflow (see [docs/SPEC_KIT.md](../../docs/SPEC_KIT.md)) complements normal development.

## Principles

1. **User-visible correctness** — scores, labels, and cached data must match documented behavior; add tests for parsers and financial/signal math.
2. **Performance** — prefer `unstable_cache` / `revalidate` for expensive fetches; avoid blocking the home page on flaky third parties.
3. **Resilience** — external APIs (Jina, CardTrader, RSS) fail often; degrade gracefully (placeholders, fallbacks, debug routes behind flags).
4. **TypeScript** — strict types for shared payloads (`DayStatsResponse`, market overlays, etc.).
5. **Mobile** — chart and key metrics must remain readable at `max-width: 767px`.

## When to use spec-kit slash commands

Use `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` for **multi-step features**; skip for tiny fixes.
