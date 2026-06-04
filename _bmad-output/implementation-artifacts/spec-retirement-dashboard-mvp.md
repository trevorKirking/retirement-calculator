---
title: 'Retirement Planning Dashboard MVP'
type: 'feature'
created: '2026-06-04'
status: 'ready-for-dev'
context:
  - '../../retirement-planning-dashboard-prd.md'
  - '../../DESIGN.md'
---

<frozen-after-approval reason="active-goal authorized implementation scope">

## Intent

**Problem:** The repository has a validated PRD, visual PRD, and design contract, but no working dashboard application. The MVP must become a usable advisor meeting tool with tested projection math, scenario comparison, Social Security offset handling, and print/export summary.

**Approach:** Build a React/TypeScript single-page app that follows the PRD and `DESIGN.md`, using deterministic local state, pure projection functions, an accessible advisor cockpit UI, and browser-print-first export.

## Boundaries & Constraints

**Always:** Read `retirement-planning-dashboard-prd.md` and `DESIGN.md`; preserve Innovest bronze/teal/lime branding; keep projection math pure and unit tested; do not send client data to third-party APIs; make saving explicit only if added; include print-friendly summary and disclaimer.

**Ask First:** Hosted backend, authentication, real client persistence, tax modeling, Monte Carlo simulation, account aggregation, or automated financial advice language.

**Never:** Replace Innovest colors with generic SaaS blue; silently persist client data; invest Social Security surplus; claim financial guarantees; ship untested projection math.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Accumulation | Current age 45, retirement 67, accounts with balances and contributions | Monthly contributions and employer match accrue before retirement, then regular contributions stop | Invalid age ordering shows validation feedback |
| Spending depletion | Annual spending exceeds sustainable balance | Projection marks depletion age/year and keeps chart balance at zero after depletion | Summary displays depletion status clearly |
| No depletion | Assets remain positive through projection end | Summary shows remaining balance and "No depletion by projection end" | N/A |
| Social Security offset | Social Security enabled after start age | Benefit offsets portfolio withdrawal and never adds surplus back to portfolio | Tooltip/card shows offset amount |
| Today's dollars | Inflation > 0 and today's dollars selected | Chart and card values display inflation-adjusted balances | Toggle label makes mode explicit |

</frozen-after-approval>

## Code Map

- `src/domain/projection.ts` -- Pure retirement projection, aggregation, depletion, and metric calculations.
- `src/domain/defaults.ts` -- Initial client, scenario, account, and color data.
- `src/App.tsx` -- Advisor cockpit state, controls, chart, summary cards, and print summary.
- `src/styles.css` -- `DESIGN.md` token implementation and responsive/print styling.
- `tests/e2e/retirement-dashboard.spec.ts` -- Browser workflow and print-summary verification.

## Tasks & Acceptance

**Execution:**
- [ ] `package.json` and config files -- create React/Vite/TypeScript app with unit and browser test commands.
- [ ] `src/domain/projection.ts` -- implement monthly accumulation, spending depletion, Social Security offset, today's-dollar conversion, and metrics.
- [ ] `src/App.tsx` and components -- implement advisor cockpit inputs, accounts, scenarios, chart, cards, reset, and print summary.
- [ ] `src/styles.css` -- apply Innovest tokens, accessible dense layout, responsive behavior, and print CSS.
- [ ] `src/domain/projection.test.ts` and UI/E2E tests -- cover math edge cases, UI flows, and print/export content.

**Acceptance Criteria:**
- Given default data, when the app loads, then the Innovest-branded dashboard, chart, scenario rail, accounts, and summary cards are visible.
- Given changed age, contribution, inflation, return, annual spending, or Social Security inputs, when values update, then chart and summary cards update without a spreadsheet.
- Given at least three accounts and three scenarios, when scenarios are toggled, duplicated, renamed, or selected, then enabled scenarios remain visually distinct on the chart.
- Given Social Security is enabled, when benefit exceeds spending, then portfolio withdrawal is never negative and surplus is not invested.
- Given print summary is opened or printed, then the output includes Innovest branding, assumptions, scenarios, results, chart context, and disclaimer.

## Design Notes

Use the advisor cockpit direction: left controls/accounts, center chart/KPIs, right scenarios/Social Security/export. Use Recharts if dependencies install cleanly; otherwise use a custom accessible SVG chart only if dependency installation is blocked.

## Verification

**Commands:**
- `npm.cmd test` -- expected: projection and UI tests pass.
- `npm.cmd run build` -- expected: TypeScript and Vite build succeed.
- `npm.cmd run e2e` -- expected: browser workflow and print/export assertions pass.
- Browser smoke on localhost -- expected: desktop and mobile render without horizontal overflow.
