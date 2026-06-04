# Retirement Planning Dashboard Design Contract

This file is the UI decision guide for implementation agents. Read it with
`retirement-planning-dashboard-prd.md` before making interface, styling, or
component decisions.

The PRD controls product behavior, workflow, acceptance criteria, and financial
calculation requirements. This design contract controls brand expression,
visual hierarchy, component styling, spacing, chart treatment, and interaction
tone. If this file and the PRD appear to conflict, preserve the PRD behavior and
flag the visual conflict before changing the design system.

## Design Intent

The dashboard should feel like a polished advisor meeting tool: calm, compact,
professional, and clear enough to screen share with a client. It should not feel
like a consumer calculator, marketing landing page, or dense spreadsheet.

Use Innovest branding as the visible source of truth. The app masthead and
print/export summary must include the bronze inverted-triangle mark plus the
INNOVEST wordmark.

## Tokens

```yaml
design_tokens:
  color:
    bg: "#FFFFFF"
    paper: "#FCFAF4"
    card: "#FFFFFF"
    ink: "#504D51"
    ink_soft: "#6E6C70"
    ink_faint: "#9A9799"
    rule: "#E3E1E2"
    rule_soft: "#F2EEE5"
    bronze: "#AF6828"
    bronze_dark: "#8D5218"
    bronze_light: "#FBF1E4"
    teal: "#008991"
    teal_dark: "#006B71"
    teal_light: "#E0F2F3"
    lime: "#A5B438"
    lime_light: "#EEF3D7"
    danger: "#A8301F"
    danger_light: "#FBE9E6"
  radius:
    card: "8px"
    control: "6px"
    pill: "999px"
  shadow:
    sm: "0 1px 2px rgba(80, 77, 81, 0.06)"
    md: "0 1px 2px rgba(80, 77, 81, 0.05), 0 4px 12px rgba(80, 77, 81, 0.07)"
  typography:
    sans: "Calibri, Carlito, Segoe UI, Trebuchet MS, -apple-system, BlinkMacSystemFont, sans-serif"
    serif: "Georgia, Times New Roman, serif"
    mono: "SF Mono, Menlo, Consolas, monospace"
    body_size: "15px"
    body_line_height: "1.55"
    h1_size: "clamp(30px, 4.4vw, 52px)"
    h2_size: "22px"
    h3_size: "16px"
  spacing:
    page_max_width: "1240px"
    section_gap: "18px"
    card_padding: "16px"
    dense_control_gap: "8px"
```

## Brand Rules

- Bronze is the primary brand accent and should carry the Innovest mark,
  important outcomes, active navigation, and strong calls to action.
- Teal is the secondary action and status color. Use it for selected scenario
  states, toggles, chart comparison lines, and secondary buttons.
- Lime is a positive/success accent. Use it sparingly for improved outcomes,
  no-depletion status, or favorable comparison deltas.
- Keep the interface mostly white, paper, ink, and rule colors. The brand
  colors should guide attention, not flood the screen.
- Do not replace Innovest bronze/teal/lime with a generic blue SaaS palette.

## Layout Rules

- Use an advisor cockpit layout for the MVP: inputs/accounts on the left,
  projection chart and KPI cards in the center, and scenario/Social
  Security/export controls on the right.
- Prioritize scan speed in live meetings. Keep controls compact, aligned, and
  close to the outcome they affect.
- Cards may frame repeated items, KPI summaries, scenario rows, account rows,
  and print-preview sections. Avoid nested cards.
- Keep card radius at 8px or less.
- On mobile and narrow screens, collapse dense grids to a single column and
  prevent horizontal overflow.

## Component Rules

- Use segmented controls for Future dollars vs Today's dollars and other view
  modes.
- Use toggles for Social Security inclusion and other binary settings.
- Use sliders or numeric inputs for rates, ages, and assumption tuning.
- Use currency inputs for balances, contributions, annual retirement spending,
  and Social Security benefit amounts.
- Use icon buttons for repeated utility actions when the icon is familiar, with
  accessible labels.
- Buttons should be clear commands, not decorative badges.
- Include empty states, validation states, loading/recalculation states, and
  disabled states for controls that depend on missing inputs.

## Chart Rules

- The projection chart is the visual center of the app.
- Scenario lines must be distinct and accessible. Prefer bronze, teal, lime,
  and high-contrast neutral variants before introducing new hues.
- Show retirement age, depletion age/year, and optional goal markers directly
  on the chart.
- Tooltips should explain balance, annual spending, portfolio withdrawal,
  Social Security offset, and whether values are Future dollars or Today's
  dollars.
- Keep chart labels readable during screen sharing. Do not depend on tiny axis
  text for critical meaning.

## Print And Export Rules

- Print/export summaries must repeat the Innovest mark and wordmark at the top.
- The summary should include date, optional client name, scenario names, key
  assumptions, annual retirement spending, depletion age or no-depletion status,
  chart, summary results, and required informational disclaimer.
- Build print CSS before PDF generation.

## Accessibility And Polish

- Use sufficient contrast for all text and data labels.
- Do not use negative letter spacing.
- Text must not overlap or overflow its container on mobile or desktop.
- Keep client-facing language plain. Use precise financial labels, but avoid
  jargon where a meeting participant would need translation.
- Avoid decorative gradient blobs, oversized hero sections, stock imagery, or
  purely atmospheric visuals.
