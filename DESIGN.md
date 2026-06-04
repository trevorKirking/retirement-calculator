---
version: "alpha"
name: "Innovest Advisor Cockpit"
description: "A calm, compact retirement planning dashboard for advisor-led client meetings."
colors:
  primary: "#AF6828"
  on-primary: "#FFFFFF"
  secondary: "#008991"
  on-secondary: "#FFFFFF"
  tertiary: "#A5B438"
  on-tertiary: "#2F3210"
  bg: "#FFFFFF"
  paper: "#FCFAF4"
  card: "#FFFFFF"
  ink: "#504D51"
  ink-soft: "#6E6C70"
  ink-faint: "#9A9799"
  rule: "#E3E1E2"
  rule-soft: "#F2EEE5"
  bronze-dark: "#8D5218"
  bronze-light: "#FBF1E4"
  teal-dark: "#006B71"
  teal-light: "#E0F2F3"
  lime-light: "#EEF3D7"
  danger: "#A8301F"
  danger-light: "#FBE9E6"
typography:
  body-md:
    fontFamily: "Calibri, Carlito, Segoe UI, Trebuchet MS, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "1.55"
    letterSpacing: "0"
  label-caps:
    fontFamily: "Calibri, Carlito, Segoe UI, Trebuchet MS, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "11px"
    fontWeight: 900
    lineHeight: "1.2"
    letterSpacing: "0.08em"
  h1:
    fontFamily: "Calibri, Carlito, Segoe UI, Trebuchet MS, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "1"
    letterSpacing: "0"
  h2:
    fontFamily: "Calibri, Carlito, Segoe UI, Trebuchet MS, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: "1.15"
    letterSpacing: "0"
  brand:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: "1"
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "8px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "20px"
  page-max-width: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "38px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "38px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "36px"
---

## Overview

The dashboard should feel like a polished advisor meeting tool: calm, compact,
professional, and clear enough to screen share with a client. It should not feel
like a consumer calculator, marketing landing page, or dense spreadsheet.

Use Innovest branding as the visible source of truth. The app masthead and
print/export summary must include the bronze inverted-triangle mark plus the
INNOVEST wordmark.

The PRD controls product behavior, workflow, acceptance criteria, and financial
calculation requirements. This design contract controls brand expression,
visual hierarchy, component styling, spacing, chart treatment, and interaction
tone. If this file and the PRD appear to conflict, preserve the PRD behavior and
flag the visual conflict before changing the design system.

## Colors

Bronze is the primary brand accent and should carry the Innovest mark, important
outcomes, active navigation, and strong calls to action.

Teal is the secondary action and status color. Use it for selected scenario
states, toggles, chart comparison lines, and secondary buttons.

Lime is a positive or success accent. Use it sparingly for improved outcomes,
no-depletion status, or favorable comparison deltas.

Keep the interface mostly white, paper, ink, and rule colors. The brand colors
should guide attention, not flood the screen. Do not replace Innovest bronze,
teal, and lime with a generic blue SaaS palette.

## Typography

Use the sans stack for all application UI and reserve the serif stack for the
INNOVEST wordmark. Labels should be compact and direct. Do not use negative
letter spacing. Keep client-facing language plain and precise.

## Layout

Use an advisor cockpit layout for the MVP: inputs and accounts on the left,
projection chart and KPI cards in the center, and scenario, Social Security,
cash-flow, export, and reset controls on the right or in adjacent compact panels.

Prioritize scan speed in live meetings. Keep controls aligned and close to the
outcome they affect. On mobile and narrow screens, collapse dense grids to a
single column and prevent horizontal overflow.

## Elevation & Depth

Use borders, paper surfaces, and light shadows to separate work areas. Avoid
heavy shadow stacks. The projection chart is the visual center, so surrounding
panels should support it rather than compete with it.

## Shapes

Cards and controls should use 8px radius or less. Pills are allowed for short
status indicators such as dollar mode, no-depletion status, or contribution
phase. Avoid nested cards unless the inner card is an input group with a clear
modeling purpose.

## Components

Use segmented controls for Future dollars vs Today's dollars and other view
modes. Use toggles for Social Security inclusion and other binary settings. Use
sliders or numeric inputs for rates, ages, and assumption tuning.

Use currency inputs for balances, contributions, annual retirement spending,
and Social Security benefit amounts. Annual spending must be labeled as the
post-retirement drawdown input. Withdrawal rate must be labeled as an income
estimate, not as the annual spending driver.

The projection chart should show retirement age, depletion age or year, and
optional goal markers directly on the chart. Tooltips should explain balance,
annual spending, portfolio withdrawal, Social Security offset, and whether
values are Future dollars or Today's dollars.

Print/export summaries must repeat the Innovest mark and wordmark at the top
and include date, optional client name, scenario names, key assumptions, annual
retirement spending, depletion status, chart, summary results, and the required
informational disclaimer.

## Do's and Don'ts

Do keep the app compact, advisor-facing, and screen-share friendly.

Do make annual-spending depletion, withdrawal-rate income estimate, and Social
Security offset visually distinct.

Do keep client data local unless the user explicitly adds a save, sync, or
export workflow.

Don't use decorative gradient blobs, oversized hero sections, stock imagery, or
purely atmospheric visuals.

Don't silently persist client data.

Don't claim or imply financial guarantees.
