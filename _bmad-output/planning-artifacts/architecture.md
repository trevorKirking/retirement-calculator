---
title: 'Retirement Planning Dashboard Architecture'
created: '2026-06-04'
workflow: 'bmad-create-architecture'
status: 'complete'
stepsCompleted:
  - context
  - starter
  - decisions
  - patterns
  - validation
---

# Architecture

## Decision Summary

- Build a Vite React/TypeScript SPA.
- Keep all client data in local React state for MVP privacy.
- Keep retirement math in pure domain functions with no React imports.
- Use Recharts for chart rendering when dependencies are available.
- Use browser print CSS as the export implementation.

## Module Boundaries

- `src/domain/`: projection types, defaults, formatting, and pure calculation functions.
- `src/components/`: reusable UI components such as chart, summary cards, controls, and brand lockup.
- `src/App.tsx`: page composition and state orchestration.
- `tests/`: unit, UI, and browser verification.

## State Model

- `client`: optional display name and shared meeting metadata.
- `scenarios`: array of complete scenario objects, each with assumptions and accounts.
- `selectedScenarioId`: controls which scenario is edited and summarized.
- `dollarMode`: `future` or `today`.
- No automatic persistence. Reset restores seeded defaults.

## Projection Rules

- Convert annual return to monthly return with `(1 + annualReturn) ** (1 / 12) - 1`.
- Accumulate contributions and employer match before retirement.
- Stop regular contributions at retirement.
- Apply annual spending monthly after retirement.
- Inflate spending annually when enabled.
- Apply Social Security only as a withdrawal offset after start age.
- Never invest Social Security surplus.
- Mark depletion when total portfolio balance reaches zero.

## Risk Controls

- Unit test projection functions before relying on UI results.
- Keep chart data derived from domain outputs, not duplicated UI math.
- Print/export reads from the same projection result used by the dashboard.
- Accessibility labels and visible summary text backstop chart-only interpretation.
