---
title: 'Retirement Planning Dashboard Epics and Stories'
created: '2026-06-04'
workflow: 'bmad-create-epics-and-stories'
status: 'complete'
stepsCompleted:
  - validate-prerequisites
  - design-epics
  - create-stories
  - final-validation
---

# Epics And Stories

## Epic 1: Advisor Cockpit MVP

Deliver the complete local dashboard MVP described by the PRD and `DESIGN.md`.

### Story 1.1: Retirement Dashboard MVP Implementation

As a financial consultant, I want an Innovest-branded dashboard where I can edit client assumptions, accounts, scenarios, annual spending, and Social Security so that I can explain retirement outcomes live in a client meeting.

Acceptance criteria:

- Given the app opens, when the default state loads, then it shows Innovest branding, at least three account examples, at least three scenario examples, KPI cards, a projection chart, and print/export actions.
- Given account or assumption inputs change, when the user edits values, then projection math, chart lines, and KPI cards update from the same pure calculation result.
- Given Social Security is enabled, when benefits begin after the configured start age, then Social Security offsets spending and surplus is not invested.
- Given annual retirement spending is high enough to deplete assets, when the projection runs, then the chart and summary show depletion age/year.
- Given Future dollars or Today's dollars is selected, when the segmented control changes, then displayed balances use the selected mode.
- Given print summary is used, when print styles apply, then the summary includes Innovest branding, assumptions, results, scenario names, and disclaimer.

## Epic 2: Future Enhancements

Deferred work only: saved sessions, authentication, taxes, Monte Carlo, account aggregation, spouse planning, and hosted multi-advisor deployment.
