---
title: 'Retirement Spending Mode Toggle'
type: 'feature'
created: '2026-06-08'
status: 'done'
baseline_commit: '1c3d66f5c8ac4e7f10631d106e148523f9f543bc'
context:
  - '../../DESIGN.md'
  - '../../retirement-planning-dashboard-prd.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The retirement cash-flow panel only accepts annual post-retirement spending as a dollar amount, but advisors need to switch between direct dollars and a percentage-based spending assumption.

**Approach:** Add a selected-scenario spending mode that can use either fixed dollars or a percent of the client's current annual income. Preserve the current dollar behavior by default, keep the withdrawal-rate income estimate separate, and make the effective annual spending visible wherever results are summarized.

## Boundaries & Constraints

**Always:** Keep projection math in pure domain functions, preserve existing dollar-mode defaults, make percent mode drive depletion and monthly gap calculations, and keep the UI clear that this is the spending drawdown input.

**Ask First:** Any change that makes percent mode use portfolio balance, desired income, or another base instead of current annual income.

**Never:** Do not merge this with the withdrawal-rate income estimate, remove dollar entry, add persistence, or change Social Security offset behavior.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dollar mode | Spending mode is dollars and annual spending is 86000 | Projection uses 86000 before any retirement spending inflation | Negative dollars show the existing validation error |
| Percent mode | Spending mode is percent and current annual income is 142000 with 60.6% selected | Projection uses about 86000 as effective annual spending before inflation | Negative percent shows a spending validation error |
| Mode switch | User switches from dollars to percent or back | The current effective spending is converted so results do not jump unexpectedly | If current income is zero, percent conversion becomes 0% |

</frozen-after-approval>

## Code Map

- `src/domain/types.ts` -- Scenario type owns the spending mode and percent value.
- `src/domain/defaults.ts` -- Default scenarios preserve current dollar behavior and carry equivalent percent defaults.
- `src/domain/projection.ts` -- Projection resolves effective spending from mode before depletion, summaries, and validation.
- `src/App.tsx` -- Retirement cash-flow panel exposes the Dollars/Percent switch and displays effective spending.
- `src/styles.css` -- Segmented spending-mode control layout.
- `src/domain/projection.test.ts` -- Domain coverage for percent mode and validation.
- `src/App.test.tsx` -- React coverage for the mode switch.
- `tests/e2e/retirement-dashboard.spec.ts` -- Browser smoke coverage for the visible toggle.

## Tasks & Acceptance

**Execution:**
- [x] `src/domain/types.ts` -- add retirement spending mode types and fields -- supports durable scenario state.
- [x] `src/domain/defaults.ts` -- add default percent values without changing dollar-mode behavior -- preserves current projections.
- [x] `src/domain/projection.ts` -- resolve effective annual spending from dollars or percent of current annual income -- makes percent mode affect depletion.
- [x] `src/App.tsx` and `src/styles.css` -- add the toggle and mode-specific input in the cash-flow panel -- gives advisors the requested workflow.
- [x] `src/domain/projection.test.ts`, `src/App.test.tsx`, and `tests/e2e/retirement-dashboard.spec.ts` -- add coverage for percent mode -- prevents regressions.

**Acceptance Criteria:**
- Given the selected scenario is in dollar mode, when the dashboard loads, then annual spending remains the existing dollar amount and existing projections do not change.
- Given the selected scenario is switched to percent mode, when the percent value or current annual income changes, then depletion results and summaries use the computed annual spending.
- Given the user switches between dollars and percent, when the switch happens, then the effective spending value is converted to avoid an unexpected jump in results.

## Spec Change Log

## Verification

**Commands:**
- `npm.cmd run test` -- expected: all unit and component tests pass.
- `npm.cmd run build` -- expected: TypeScript and Vite build pass.
- `npm.cmd run e2e` -- expected: Playwright flow passes.

## Suggested Review Order

**Projection Behavior**

- Effective spending is resolved from dollars or percent of current income.
  [`projection.ts:49`](../../src/domain/projection.ts#L49)

- Projection receives current income without breaking numeric start-year callers.
  [`projection.ts:112`](../../src/domain/projection.ts#L112)

- Validation follows the selected spending mode.
  [`projection.ts:274`](../../src/domain/projection.ts#L274)

**UI Binding**

- Current income now feeds scenario projections.
  [`App.tsx:444`](../../src/App.tsx#L444)

- Mode switching converts the current effective amount.
  [`App.tsx:471`](../../src/App.tsx#L471)

- The cash-flow card exposes Dollars and Percent entry.
  [`App.tsx:622`](../../src/App.tsx#L622)

- Percent mode displays effective annual spending in summaries.
  [`App.tsx:725`](../../src/App.tsx#L725)

**Scenario State And Tests**

- Scenario type carries both spending modes.
  [`types.ts:44`](../../src/domain/types.ts#L44)

- Defaults keep dollar mode while storing equivalent percent values.
  [`defaults.ts:28`](../../src/domain/defaults.ts#L28)

- Domain test proves percent mode drives spending.
  [`projection.test.ts:121`](../../src/domain/projection.test.ts#L121)

- Component test exercises the mode switch.
  [`App.test.tsx:36`](../../src/App.test.tsx#L36)

- E2E verifies Percent mode in Chromium.
  [`retirement-dashboard.spec.ts:13`](../../tests/e2e/retirement-dashboard.spec.ts#L13)
