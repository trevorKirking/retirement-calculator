# Visual PRD Site Recreation Guide

Use this guide to recreate the same single-file Visual PRD portal pattern for other projects. It is based on `retirement-planning-dashboard-visual-prd.html` and is designed for static HTML delivery: no build step, no backend, no auth, and no external assets required.

## Purpose

Create a polished PRD website that works as:

- A readable product artifact for humans.
- A copy-paste handoff surface for coding agents.
- A visual mockup and design decision record.
- A BMad-style review board for improving the PRD before implementation.
- A lightweight annotation workspace for accumulating edits.

Default output should be one self-contained file named:

```text
{project-name}-visual-prd.html
```

Place supporting docs in:

```text
docs/
```

## Visual Style

### Overall Feel

- Professional dev-portal artifact.
- Compact, dense, and meeting-ready.
- Calm financial/product planning tone.
- White page with faint blueprint grid background.
- Bronze as the primary accent, teal as the secondary action/status accent, lime as positive/success accent.
- Avoid marketing-page flourishes, oversized decorative cards, gradient blobs, or landing-page hero patterns.

### CSS Tokens

Use these base tokens unless the project has a strong brand palette:

```css
:root {
  --bg: #FFFFFF;
  --paper: #FCFAF4;
  --ink: #504D51;
  --ink-soft: #6e6c70;
  --ink-faint: #9a9799;
  --rule: #e3e1e2;
  --rule-soft: #f2eee5;
  --card: #FFFFFF;
  --bronze: #AF6828;
  --bronze-d: #8D5218;
  --bronze-l: #FBF1E4;
  --teal: #008991;
  --teal-d: #006B71;
  --teal-l: #E0F2F3;
  --lime: #A5B438;
  --lime-l: #EEF3D7;
  --danger: #a8301f;
  --danger-l: #FBE9E6;
  --charcoal: #504D51;
  --code-bg: #f5f3f1;
  --shadow-sm: 0 1px 2px rgba(80, 77, 81, .06);
  --shadow-md: 0 1px 2px rgba(80, 77, 81, .05), 0 4px 12px rgba(80, 77, 81, .07);
  --serif: "Georgia", "Times New Roman", serif;
  --sans: Calibri, "Carlito", "Segoe UI", "Trebuchet MS", -apple-system, BlinkMacSystemFont, sans-serif;
  --mono: "SF Mono", "Menlo", "Consolas", monospace;
}
```

### Typography

- Body: `15px`, `line-height: 1.55`, `var(--sans)`.
- H1: `clamp(30px, 4.4vw, 52px)`.
- H2: `22px`.
- H3: `16px`.
- Eyebrow labels: uppercase, `11px`, bold, bronze, generous letter spacing.
- Keep letter spacing at `0` or slightly positive. Do not use negative letter spacing for compact UI text.

### Layout Rules

- Main wrapper: `.portal-wrap`, max width around `1240px`, centered.
- Page sections are tabs, not separate routes.
- Use full-width page bands and compact cards, not cards inside cards.
- Keep cards at `8px` radius or less.
- On mobile, prevent horizontal overflow and make dense grids single-column.
- Sticky tabbar is allowed; annotation controls float above it.

## Required Page Structure

Use this order for most PRD sites:

1. Masthead
2. Hero banner
3. Sticky tabbar
4. Overview panel
5. Mockup panel
6. Decisions panel
7. Tradeoffs panel
8. BMad Review panel
9. Agent Brief panel
10. Build Order panel
11. Annotation overlay and drawer
12. Inline JavaScript

### HTML Scaffold

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>{Project Name} - Visual PRD</title>
  <style>
    /* CSS tokens and component styles */
  </style>
</head>
<body>
  <div class="portal-wrap">
    <header class="masthead">...</header>
    <section class="hero-banner" id="top">...</section>
    <nav class="tabbar" aria-label="Visual PRD sections">...</nav>
    <main>
      <section class="panel active" id="panel-overview" data-panel="overview">...</section>
      <section class="panel" id="panel-mockup" data-panel="mockup">...</section>
      <section class="panel" id="panel-decisions" data-panel="decisions">...</section>
      <section class="panel" id="panel-tradeoffs" data-panel="tradeoffs">...</section>
      <section class="panel" id="panel-bmad-review" data-panel="bmad-review">...</section>
      <section class="panel" id="panel-agent-brief" data-panel="agent-brief">...</section>
      <section class="panel" id="panel-build-order" data-panel="build-order">...</section>
    </main>
  </div>

  <div class="annotation-layer" id="annotation-layer" aria-hidden="true"></div>
  <button class="annotation-toggle" id="annotation-toggle" type="button">Annotate</button>
  <aside class="annotation-drawer" id="annotation-drawer">...</aside>

  <script>
    /* tab routing, prompt builder, copy buttons, annotation logic */
  </script>
</body>
</html>
```

## Core Components

### Masthead

Purpose: identify the artifact.

Include:

- Brand mark with 2-3 project initials.
- Project title.
- Subtitle: `Visual PRD and agent handoff artifact`.
- Metadata block: artifact type, mode, data posture.

### Hero Banner

Purpose: explain the product in one screen without becoming a marketing landing page.

Include:

- Eyebrow: `Planning artifact`.
- H1: literal product category or promise.
- Lede: what the tool does, who it helps, and why it matters.
- Quick links to the most-used tabs.

Keep it text-forward and compact. Do not use decorative hero images unless the project specifically needs a visual asset.

### Sticky Tabbar

Use `data-panel-link` and matching `data-panel` values.

Example:

```html
<a class="tab active" href="#tab=overview" data-panel-link="overview">Overview</a>
<section class="panel active" id="panel-overview" data-panel="overview">...</section>
```

The JS router should:

- Read `#tab={panelId}`.
- Activate the matching `.panel`.
- Add `.active` to every matching `[data-panel-link]`.
- Scroll to top on tab changes.

### Overview Panel

Include:

- Product intent.
- Primary and secondary users.
- Success metrics in `.kpi-strip`.
- Core workflow.
- Core calculation or domain logic.
- Privacy or risk posture.

### Mockup Panel

Include:

- A framed mock application shell.
- Left input area, center chart/result area, right action/scenario area where applicable.
- Static SVG charts are fine for PRD mockups.
- Annotation cards under the mockup explaining the important regions.
- Optional direction tabs for alternate layouts.

The mockup should show the actual product workflow, not placeholder boxes only.

### Decisions Panel

Use a compact table or decision grid.

Include:

- Decision.
- Recommendation.
- Reason.
- Coding-agent annotation.

Keep it decision-complete. A downstream implementer should not need to choose between competing approaches.

### Tradeoffs Panel

Use cards for major tradeoffs.

Each tradeoff should include:

- Recommendation.
- Why this is the default.
- What is intentionally deferred.
- `Copy Prompt` button tied to a hidden `<pre>`.

Typical tradeoffs:

- Storage/persistence.
- Calculation scope.
- Chart library.
- UI density.
- External services.
- Export format.

### BMad Review Panel

Purpose: use BMad personas as a structured PRD quality review before implementation.

Default personas:

- Mary, Analyst: product framing, market assumptions, buyer/user clarity.
- Paige, Technical Writer: terminology, documentation, prompts, disclaimer wording.
- John, Product Manager: MVP scope, non-goals, epics, acceptance criteria.
- Sally, UX Designer: meeting flow, states, accessibility, chart readability.
- Winston, Architect: system boundaries, state model, math/data flow, privacy.
- Amelia, Developer: story slicing, tests, implementation order, code-review checkpoints.

Each persona card should include:

- Persona and role.
- BMad phase.
- What they would inspect.
- Top recommendations.
- Acceptance signal.
- `Copy Prompt` button.

Add one aggregate `Copy All Persona Prompts` panel.

### Agent Brief Panel

Purpose: let the human generate and copy an implementation prompt.

Include controls for:

- Layout direction.
- Storage posture.
- Chart/tooling direction.
- Projection or domain scope.
- Visual tone.
- Optional emphasis.

The generated prompt should be plain text in `<pre id="generated-prompt">`.

Also include:

- Full MVP build prompt.
- Design-only prompt.

### Build Order Panel

Purpose: tell the implementing agent what to build first.

Include:

- 4-6 implementation steps.
- Risk-first order.
- Print/export target.
- Acceptance criteria summary.

For calculation-heavy products, math and fixtures should come before UI polish.

## Copy System

Any copyable content should live in a normal element with an ID:

```html
<button data-copy-target="full-build-prompt" type="button">Copy</button>
<pre id="full-build-prompt">...</pre>
```

Use one shared function:

```js
async function copyTextFrom(id, button) {
  const source = document.getElementById(id);
  if (!source) return;
  const text = source.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.focus();
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }

  const original = button.textContent;
  button.textContent = "Copied";
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}
```

Then bind:

```js
document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => copyTextFrom(button.dataset.copyTarget, button));
});
```

## Annotation System

Purpose: allow the human to draw bounding boxes anywhere on the PRD, write edit notes, and copy one accumulated coding-agent prompt.

Required controls:

- `#annotation-toggle`
- `#annotation-layer`
- `#annotation-drawer`
- `#annotation-list`
- `#annotation-priority`
- `#annotation-note`
- `#annotation-agent-prompt`

State shape:

```js
{
  id,
  panelId,
  note,
  priority,
  x,
  y,
  width,
  height,
  viewportWidth,
  viewportHeight,
  scrollX,
  scrollY,
  pageWidth,
  pageHeight
}
```

Behavior:

- Toggle annotation mode with a floating button.
- In draw mode, click-drag creates a numbered box.
- Boxes are stored in memory only.
- Boxes are shown only on the panel where they were drawn.
- The drawer accumulates annotations across all panels.
- Selecting an annotation can jump back to its panel.
- Copy prompt includes note, priority, panel label, page pixels, page-normalized coordinates, and viewport-normalized coordinates.
- Refresh clears annotations.

Important: annotation boxes are visual references only. The generated prompt must say coordinates are not exact CSS requirements.

## Responsive Rules

At `max-width: 1040px`:

- Collapse multi-column mockups and prompt labs to one column.
- Collapse BMad board to one column.
- Remove connecting lines from flow steps.

At `max-width: 820px`:

- Force `html`, `body`, and `.portal-wrap` to avoid horizontal overflow.
- Make tabbar horizontally scrollable.
- Collapse KPI strips, grids, annotations, BMad board, flow, and print grid to one column.
- Move annotation drawer near the bottom above the floating toggle.

## Print Rules

Print should:

- Hide tabbar, buttons, annotation layer, annotation drawer, and form controls.
- Show all panels as block content.
- Remove heavy box shadows.
- Keep copy panels readable with light background and bordered pre blocks.

Use print CSS rather than PDF generation for the first version.

## Content Checklist For A New Project

Before creating the site, gather:

- Product name.
- Primary user.
- Secondary user or viewer.
- Core workflow.
- 3-5 success metrics.
- Domain calculation or data behavior.
- Privacy/security posture.
- MVP non-goals.
- Major tradeoffs.
- Build order.
- Required disclaimer or legal note.
- BMad persona recommendations.
- Full build prompt.
- Design-only prompt.

## Reuse Prompt

Paste this into a coding agent when asking it to create a new Visual PRD site:

```text
Create a self-contained Visual PRD HTML site for {PROJECT_NAME}, following the ProjectAura-style PRD portal pattern.

Use a single static HTML file with inline CSS and JS. Include:
- Masthead with project identity and artifact metadata.
- Compact hero banner with quick links.
- Sticky tabbar using data-panel-link and matching data-panel sections.
- Overview, Mockup, Decisions, Tradeoffs, BMad Review, Agent Brief, and Build Order panels.
- Copy-to-clipboard system using data-copy-target.
- Session-only annotation overlay with bounding boxes, annotation drawer, note/priority editing, and accumulated agent prompt.
- BMad Review panel with Mary, Paige, John, Sally, Winston, and Amelia persona cards plus individual and aggregate copy prompts.
- Responsive CSS for desktop, tablet, and mobile with no horizontal overflow.
- Print CSS that hides controls and keeps content readable.

Use the bronze/teal/lime ProjectAura palette:
bronze #AF6828, teal #008991, lime #A5B438, ink #504D51, paper #FCFAF4.

Keep the design compact, professional, and artifact-like. Do not make a marketing landing page. Do not add external services, auth, backend calls, or silent persistence.

Make the PRD decision-complete: the implementing agent should not need to choose MVP scope, tradeoffs, storage posture, or build order.
```

## QA Checklist

Run these checks before handing off:

- All tabs activate from the tabbar.
- Hero quick links activate the correct panels.
- Every `data-copy-target` points to an existing element.
- Copy buttons change to `Copied` briefly.
- Generated prompt updates when form controls change.
- Annotation mode can draw, select, edit, delete, clear, and copy notes.
- Annotation prompt includes panel labels and normalized coordinates.
- BMad Review has six persona cards and one aggregate prompt.
- Mobile viewport has no horizontal overflow.
- Print mode hides controls and keeps panels readable.

## Suggested File Names

For each project:

```text
{project-slug}-prd.md
{project-slug}-visual-prd.html
docs/visual-prd-site-recreation-guide.md
```

If you need a starter template later, copy the current `retirement-planning-dashboard-visual-prd.html`, then replace the content inside each panel while preserving the CSS, tab router, copy system, BMad board, and annotation system.
