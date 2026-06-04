---
title: 'Retirement Planning Dashboard UX Design Specification'
created: '2026-06-04'
workflow: 'bmad-create-ux-design'
status: 'complete'
stepsCompleted:
  - discovery
  - inspiration
  - design-system
  - component-strategy
  - responsive-accessibility
---

# UX Design Specification

## Experience Goal

Create a meeting-ready advisor cockpit that lets a consultant adjust assumptions while a client can immediately understand projected retirement outcomes.

## Primary Layout

- Left column: client assumptions, account cards, and validation feedback.
- Center workspace: summary KPI cards, projection chart, chart mode segmented control, and selected-scenario details.
- Right column: scenario list, Social Security controls, annual spending controls, reset, and print summary actions.
- Mobile: collapse to one column in the order summary, chart, assumptions, accounts, scenarios, export.

## Required States

- Empty account list prompt after all accounts are removed.
- Invalid age ordering feedback when current age >= retirement age or retirement age >= projection end age.
- Recalculation status text after input changes.
- Scenario disabled state with visible muted styling.
- Print summary visible in DOM and printable through CSS.

## Design System

Use `DESIGN.md` as source of truth:

- Bronze `#AF6828` for Innovest brand, active nav, primary outcomes, and print brand.
- Teal `#008991` for scenario comparison, toggles, and secondary actions.
- Lime `#A5B438` for positive/no-depletion results.
- White/paper/ink foundation with thin rules and compact cards.

## Accessibility

- Inputs must have labels.
- Buttons must use accessible names.
- Scenario colors need text labels; color cannot be the only identifier.
- Chart must have an accessible text summary near it.
- Print summary must include the projection disclaimer.

## UX Acceptance

- A consultant can scan key outcome, depletion status, and active scenario within the first viewport on desktop.
- A client can distinguish future dollars from today's dollars without reading code-like labels.
- Print summary requires no manual formatting after pressing the print action.
