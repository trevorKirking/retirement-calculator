---
title: 'Story 1.1: Retirement Dashboard MVP Implementation'
created: '2026-06-04'
status: 'done'
epic: '1'
story: '1.1'
story_key: '1-1-retirement-dashboard-mvp-implementation'
---

# Story 1.1: Retirement Dashboard MVP Implementation

## Story

As a financial consultant, I want an Innovest-branded retirement planning dashboard so that I can edit assumptions, accounts, scenarios, annual spending, and Social Security while explaining outcomes live in a client meeting.

## Acceptance Criteria

1. Given the app opens, when the default state loads, then it shows Innovest branding, at least three account examples, at least three scenario examples, KPI cards, a projection chart, and print/export actions.
2. Given account or assumption inputs change, when the user edits values, then projection math, chart lines, and KPI cards update from the same pure calculation result.
3. Given Social Security is enabled, when benefits begin after the configured start age, then Social Security offsets spending and surplus is not invested.
4. Given annual retirement spending is high enough to deplete assets, when the projection runs, then the chart and summary show depletion age/year.
5. Given Future dollars or Today's dollars is selected, when the segmented control changes, then displayed balances use the selected mode.
6. Given print summary is used, when print styles apply, then the summary includes Innovest branding, assumptions, results, scenario names, and disclaimer.

## Tasks/Subtasks

- [x] Create React/Vite/TypeScript scaffold and verification commands.
- [x] Implement pure projection domain model and tests.
- [x] Implement advisor cockpit UI with assumptions, accounts, scenarios, chart, and summary cards.
- [x] Implement Social Security controls and annual spending depletion display.
- [x] Implement print-friendly summary and disclaimer.
- [x] Add unit, UI, and browser verification tests.
- [x] Run build, tests, browser verification, print/export verification, and code review.

## Dev Notes

- Source requirements: `retirement-planning-dashboard-prd.md`, `DESIGN.md`, `_bmad-output/planning-artifacts/architecture.md`, `_bmad-output/planning-artifacts/ux-design-specification.md`.
- Use local React state only. Do not silently persist client data.
- Use Innovest bronze `#AF6828`, teal `#008991`, lime `#A5B438`, and the bronze inverted-triangle/INNOVEST lockup.
- Keep projection math in `src/domain/projection.ts`; React components must consume derived results.
- Browser print is the MVP export path. PDF generation is not required unless technically straightforward after print CSS passes.

## Dev Agent Record

### Debug Log

- 2026-06-04: Created React/Vite/TypeScript app structure, domain projection engine, Innovest UI, tests, and verification scripts.
- 2026-06-04: Fixed projection regression so account `annualReturn: 0` remains zero instead of falling back to scenario defaults.
- 2026-06-04: Code review found the all-scenarios-hidden chart/print edge case; added a clear empty state and regression test.
- 2026-06-04: Visual smoke initially showed live chart lines could be missed during Recharts animation; disabled line animation for deterministic rendering.
- 2026-06-04: Validation passed with `npm.cmd test`, `npm.cmd run build`, `npm.cmd audit --audit-level=moderate --cache .\.npm-cache`, `npm.cmd run verify:print`, `npm.cmd run e2e`, and `npm.cmd run smoke:browser`.

### Completion Notes

- Implemented the Retirement Planning Dashboard MVP as a local-only React app with Innovest bronze/teal/lime styling from `DESIGN.md`.
- Added editable client assumptions, account inputs, scenario comparison, Social Security offset controls, dollar-mode toggle, KPI cards, live chart, and print summary.
- Kept projection math in a pure domain layer and covered annual return conversion, depletion, Social Security surplus handling, today's-dollar conversion, and invalid age validation.
- Added unit/UI tests, Playwright E2E tests, print verification, dependency audit, and browser screenshot smoke verification.
- Residual non-blocking item: Vite reports the main JS chunk at about 570 kB after minification because the MVP uses Recharts/lucide in a single-page bundle.

### Senior Developer Review (AI)

- Outcome: Approved; no unresolved patch or decision-needed findings remain.
- Review target: current working tree for Story 1.1 against the PRD, `DESIGN.md`, UX spec, and architecture artifact.
- Review method: local BMAD-style Blind Hunter, Edge Case Hunter, and Acceptance Auditor lenses. Delegated subagents were not spawned because the available subagent tool requires explicit user permission for delegated agent work.
- Fixed during review: all scenarios hidden produced an unclear live/print chart state; added empty chart rendering in `src/App.tsx`, styles in `src/styles.css`, and a regression assertion in `src/App.test.tsx`.
- Fixed during review: live chart screenshots could capture before line animation finished; disabled Recharts line animation for deterministic browser verification.

## File List

- .gitignore
- _bmad-output/implementation-artifacts/1-1-retirement-dashboard-mvp-implementation.md
- _bmad-output/implementation-artifacts/code-review-report.md
- _bmad-output/implementation-artifacts/spec-retirement-dashboard-mvp.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- _bmad-output/implementation-artifacts/tests/test-summary.md
- _bmad-output/planning-artifacts/architecture.md
- _bmad-output/planning-artifacts/epics.md
- _bmad-output/planning-artifacts/implementation-readiness-report.md
- _bmad-output/planning-artifacts/prd-validation-report.md
- _bmad-output/planning-artifacts/ux-design-specification.md
- index.html
- package-lock.json
- package.json
- playwright.config.js
- scripts/browser-smoke.mjs
- scripts/run-e2e.mjs
- scripts/verify-print-summary.mjs
- src/App.test.tsx
- src/App.tsx
- src/domain/defaults.ts
- src/domain/format.ts
- src/domain/projection.test.ts
- src/domain/projection.ts
- src/domain/types.ts
- src/main.tsx
- src/styles.css
- src/test/setup.ts
- tests/e2e/retirement-dashboard.spec.ts
- tsconfig.json
- vite.config.js

## Change Log

- 2026-06-04: Story created from BMAD epics/readiness output.
- 2026-06-04: Implemented and verified Retirement Planning Dashboard MVP.
- 2026-06-04: Completed BMAD QA summary and code review report.

## Status

done
