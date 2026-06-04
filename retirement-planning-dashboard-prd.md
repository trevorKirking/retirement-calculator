# Product Requirements Document: Retirement Planning Dashboard

## 1. Product Overview

The product is an interactive retirement planning dashboard for financial consultants to use live during client meetings. It helps a consultant show a client how different savings, contribution, inflation, return, account, and Social Security assumptions may affect projected retirement outcomes.

The dashboard should be fast, visual, easy to adjust during a conversation, and polished enough to use in front of clients. It is not meant to replace a full financial planning system at launch. The first version should be a focused meeting tool that helps explain scenarios clearly.

## 2. Problem Statement

Financial consultants often need to explain retirement projections in a way clients can understand quickly. Static spreadsheets are flexible but hard to present clearly. Many retirement calculators are consumer-facing, too simple, or not designed for live side-by-side scenario discussion.

This product gives consultants a guided, interactive dashboard where they can:

- Enter client assumptions.
- Add retirement accounts.
- Change inputs in real time.
- Compare multiple retirement scenarios.
- Show projected outcomes on a clear chart.
- Include or exclude Social Security.
- Create a simple client-facing summary.

## 3. Target Users

### Primary User: Financial Consultant

The consultant uses the tool during client meetings. They need speed, clarity, and confidence. They should be able to adjust numbers while talking without breaking the flow of the meeting.

Needs:

- Quick input controls.
- Clear chart updates.
- Easy side-by-side comparison.
- Ability to explain assumptions.
- Simple export or print summary.
- Professional appearance.

### Secondary User: Client

The client views the dashboard during the meeting but may not directly operate it.

Needs:

- Understand what the chart means.
- See how actions affect retirement outcome.
- Compare realistic options.
- Avoid being overwhelmed by technical details.

## 4. Product Goals

- Provide a clean dashboard for projecting retirement balances over time.
- Allow consultants to create and compare multiple retirement scenarios.
- Support multiple account types per client.
- Include adjustable assumptions such as return, inflation, contribution, retirement age, and Social Security.
- Show both future dollars and inflation-adjusted today's dollars.
- Make the tool usable live in a client conversation.
- Provide a simple printable or exportable meeting summary.

## 5. Non-Goals For MVP

- Full tax planning engine.
- Estate planning.
- Insurance needs analysis.
- Portfolio construction or asset allocation optimization.
- Account aggregation from banks or brokerages.
- Automated investment recommendations.
- Compliance archiving system.
- Monte Carlo simulations in the first release, unless added as a later enhancement.

## 6. Success Metrics

- Consultant can create a base case scenario in under 3 minutes.
- Consultant can add a comparison scenario in under 60 seconds.
- Chart updates within 300 milliseconds after changing a normal input.
- Users can clearly identify projected retirement balance, total contributions, and investment growth.
- Consultants can export or print a client summary without manual formatting.
- Internal test users prefer the dashboard over a spreadsheet for live client explanation.

## 7. Core User Workflow

1. Consultant opens the dashboard before or during a meeting.
2. Consultant enters basic client information:
   - Client name, optional.
   - Current age.
   - Retirement age.
   - Current annual income, optional.
   - Desired retirement income, optional.
3. Consultant adds one or more accounts:
   - Account name.
   - Account type.
   - Current balance.
   - Monthly contribution.
   - Employer match, optional.
   - Expected annual return.
4. Consultant adjusts global assumptions:
   - Inflation rate.
   - General return assumption.
   - Contribution growth.
   - Retirement age.
   - Social Security included or excluded.
5. Dashboard calculates projected balances.
6. Consultant creates optional comparison scenarios:
   - Higher contribution.
   - Different return assumption.
   - Later retirement age.
   - Social Security disabled.
7. Consultant uses the chart and summary cards to discuss outcomes.
8. Consultant exports or prints a meeting summary.

## 8. MVP Feature Requirements

### 8.1 Client Assumptions Panel

The dashboard must allow entry of:

- Current age.
- Retirement age.
- Projection end age, default 95.
- Current annual income, optional.
- Desired retirement income, optional.
- Annual retirement spending, defaulting to the desired retirement income when entered.
- Inflation rate.
- Default annual return rate.
- Annual contribution increase, optional.

Validation:

- Current age must be less than retirement age.
- Retirement age must be less than projection end age.
- Percent fields must accept decimals.
- Currency fields must be formatted as dollars.
- Annual retirement spending must be zero or greater.

### 8.2 Account Management

The consultant must be able to add, edit, duplicate, and remove accounts.

Each account should support:

- Account name.
- Account type:
  - 401(k)
  - Traditional IRA
  - Roth IRA
  - Brokerage
  - Pension
  - Cash savings
  - Other
- Current balance.
- Monthly contribution.
- Annual contribution increase.
- Expected annual return.
- Employer match toggle.
- Employer match percentage, optional.
- Employer match cap, optional.

MVP calculation can treat accounts similarly unless account-specific tax modeling is explicitly enabled later.

### 8.3 Scenario Management

The consultant must be able to create multiple scenarios from the same client profile.

Scenario features:

- Base scenario created by default.
- Add new scenario.
- Duplicate existing scenario.
- Rename scenario.
- Remove scenario.
- Enable or disable a scenario from the chart.
- Assign each scenario a distinct chart color.

Example scenarios:

- Base Case.
- Increase Contributions.
- Retire Later.
- Lower Market Return.
- No Social Security.

### 8.4 Social Security Toggle

The dashboard must include a Social Security section.

MVP inputs:

- Include Social Security: on/off.
- Estimated monthly Social Security benefit.
- Social Security start age.
- Annual Social Security COLA assumption, default tied to inflation.

MVP behavior:

- When Social Security is on, it should be included in retirement income estimates.
- When Social Security is on, it should offset post-retirement spending after the Social Security start age.
- When Social Security is off, retirement income projections should exclude it.
- The chart should make clear whether displayed income and depletion paths include Social Security.

Future enhancement:

- Estimate Social Security from income history or user age.
- Add spouse Social Security.
- Compare claiming at 62, full retirement age, and 70.

### 8.5 Projection Chart

The chart is the centerpiece of the dashboard.

MVP chart requirements:

- Line chart showing projected total retirement assets by age or year, including the post-retirement spending path.
- Multiple scenario lines visible at once.
- Toggle between:
  - Future dollars.
  - Today's dollars, inflation adjusted.
- Tooltip showing:
  - Age or year.
  - Projected balance.
  - Total contributions.
  - Investment growth.
  - Annual retirement spending and portfolio withdrawal after retirement.
  - Social Security income or spending offset if relevant.
- Clear retirement age marker.
- Depletion marker when a scenario reaches zero before the projection end age.
- Optional goal line showing target retirement assets.

Chart views:

- Account balance over time.
- Post-retirement spending depletion path.
- Retirement income estimate.
- Contributions vs growth breakdown.

MVP should prioritize balance-over-time first, with the same chart continuing after retirement to show whether spending depletes the portfolio.

### 8.6 Summary Cards

The dashboard should show concise cards for the selected scenario.

Required cards:

- Projected balance at retirement.
- Inflation-adjusted balance at retirement.
- Total contributions by retirement.
- Estimated monthly retirement income.
- Gap or surplus versus target income, if target is entered.
- Annual retirement spending.
- Estimated depletion age and year, or "No depletion by projection end" when applicable.
- Years funded after retirement.
- Remaining balance at projection end if the portfolio is not depleted.

Comparison cards:

- Best projected scenario.
- Lowest projected scenario.
- Difference between selected scenarios.

### 8.7 Retirement Income Estimate

The tool should estimate how much monthly income the retirement balance may support.

MVP options:

- Simple withdrawal rate method, default 4%.
- User-adjustable withdrawal rate.
- Monthly retirement income equals annual withdrawal amount divided by 12.
- If Social Security is enabled, add monthly Social Security benefit after the start age.

Example:

- Retirement balance: $1,000,000.
- Withdrawal rate: 4%.
- Portfolio income: $40,000 per year or $3,333 per month.
- Social Security: $2,000 per month.
- Estimated total income: $5,333 per month.

This withdrawal-rate estimate is an income-support heuristic. It should be labeled separately from the annual retirement spending depletion projection.

### 8.8 Retirement Spending And Depletion

The tool should show how long the projected retirement balance may last once the client begins spending from the portfolio.

MVP inputs:

- Annual retirement spending, entered as dollars per year.
- Spending inflation adjustment toggle, default on.

MVP behavior:

- Spending begins at retirement age.
- Annual spending is converted to monthly spending for projection math.
- When inflation adjustment is on, spending increases annually by the inflation rate.
- If Social Security is enabled, monthly Social Security offsets monthly spending after the Social Security start age.
- Portfolio withdrawal equals monthly spending minus monthly Social Security, never below zero.
- Social Security surplus is not invested by default.
- The projection should show the age and year when the portfolio reaches zero.
- If the portfolio does not reach zero by the projection end age, show the remaining balance at projection end.

### 8.9 Export And Print

The consultant must be able to create a client summary.

MVP export requirements:

- Print-friendly summary page.
- Export as PDF if technically reasonable.
- Include:
  - Client name, optional.
  - Date.
  - Scenario names.
  - Key assumptions.
  - Chart image.
  - Summary results.
  - Annual retirement spending and depletion result.
  - Disclaimer.

Required disclaimer:

"This projection is for informational purposes only and is not a guarantee of future performance. Actual results may vary based on market conditions, taxes, fees, inflation, contribution changes, withdrawals, and other factors."

### 8.10 Privacy And Data Handling

Because this may involve client information, privacy matters from the beginning.

MVP privacy requirements:

- Do not require real client names.
- Allow anonymous sessions.
- Store data locally by default unless a backend is required.
- Provide a clear reset/clear-session option.
- Do not send client data to third-party APIs for the MVP.
- If saved sessions are added, make saving explicit.

Future requirements:

- User authentication.
- Role-based access.
- Encrypted cloud storage.
- Audit logs.
- Compliance retention policies.

## 9. Calculation Requirements

### 9.1 Accumulation Formula

For each month before retirement:

- Start with account balance.
- Add monthly contribution.
- Add employer match, if enabled.
- Apply monthly investment growth.
- Increase contribution annually if contribution growth is enabled.

Annual return should be converted to monthly return:

monthly_return = (1 + annual_return) ^ (1 / 12) - 1

### 9.2 Inflation Adjustment

Future dollars should be converted to today's dollars using:

today_value = future_value / ((1 + inflation_rate) ^ years_elapsed)

The user should be able to switch between future dollars and today's dollars.

### 9.3 Account Aggregation

The dashboard should calculate:

- Each account separately.
- Total projected assets across all accounts.
- Total contributions across all accounts.
- Total investment growth across all accounts.

### 9.4 Retirement Spending And Depletion Phase

After the retirement age, the MVP projection should:

- Apply continued investment return.
- Stop regular contributions unless a scenario explicitly models continued work.
- Convert annual retirement spending to monthly spending.
- Increase spending annually by inflation when `retirementSpendingInflationAdjusted` is true.
- Add Social Security income only as a spending offset after the configured Social Security start age.
- Subtract portfolio withdrawals equal to monthly spending minus monthly Social Security, never below zero.
- Mark depletion when total balance reaches zero.
- Preserve the final zero-balance point for the chart and summary.

The dashboard should calculate:

- Annual spending in future dollars for each projection year.
- Monthly portfolio withdrawal during retirement.
- Estimated depletion age and year when the balance reaches zero.
- Years funded after retirement.
- Remaining balance at projection end if the portfolio is not depleted.

## 10. User Interface Requirements

The UI should feel like a professional meeting tool, not a consumer calculator or dense spreadsheet.

Layout:

- Left panel: inputs and assumptions.
- Main area: chart and summary.
- Right or lower panel: scenario comparison.

Controls:

- Sliders for rates and ages.
- Currency inputs for balances and contributions.
- Toggles for Social Security and today's dollars.
- Tabs or segmented controls for chart views.
- Buttons for add account, duplicate scenario, export, and reset.

Visual style:

- Clean, calm, and professional.
- High contrast numbers.
- Clear chart colors.
- Minimal clutter.
- Large enough text for screen sharing or sitting across a desk.

## 11. Recommended MVP Screens

### Screen 1: Main Dashboard

Includes:

- Client assumptions.
- Account list.
- Scenario controls.
- Projection chart.
- Summary cards.
- Social Security toggle.

### Screen 2: Export Summary

Includes:

- Print-ready projection summary.
- Chart.
- Inputs and assumptions.
- Disclaimers.

### Optional Screen 3: Saved Sessions

Only needed if the first version includes saving and loading client sessions.

## 12. Data Model Draft

### Client

- id
- displayName
- currentAge
- retirementAge
- projectionEndAge
- currentIncome
- desiredRetirementIncome

### Account

- id
- scenarioId
- name
- type
- currentBalance
- monthlyContribution
- annualContributionIncrease
- annualReturn
- employerMatchEnabled
- employerMatchPercent
- employerMatchCap

### Scenario

- id
- name
- color
- inflationRate
- defaultAnnualReturn
- withdrawalRate
- retirementAnnualSpending
- retirementSpendingInflationAdjusted
- socialSecurityEnabled
- socialSecurityMonthlyBenefit
- socialSecurityStartAge
- socialSecurityCola
- accounts

### ProjectionResult

- scenarioId
- year
- age
- totalBalance
- inflationAdjustedBalance
- totalContributions
- investmentGrowth
- estimatedMonthlyIncome
- socialSecurityIncome
- annualSpending
- portfolioWithdrawal
- depletionAge
- isDepleted

## 13. Recommended Tech Stack

For a polished web dashboard:

- Frontend: React or Next.js
- Language: TypeScript
- Charting: Recharts, Nivo, ECharts, or Chart.js
- Styling: Tailwind CSS or a component system
- State management: local React state, Zustand, or Redux Toolkit if needed
- Export: browser print styles first, PDF export later
- Storage: localStorage or IndexedDB for MVP if saving locally

For a faster prototype:

- Streamlit or Dash can work, but they may feel less polished for client-facing use.

Recommended path:

Build the MVP as a React/TypeScript single-page app so the meeting experience feels smooth and professional.

## 14. Potential GitHub Repos To Search For

Useful search terms:

- "retirement calculator react"
- "investment calculator react"
- "compound interest calculator typescript"
- "financial planning dashboard"
- "fire calculator github"
- "monte carlo retirement calculator"
- "retirement planner streamlit"
- "retirement calculator chartjs"

Repo types worth borrowing from:

- Calculation engines for compound growth.
- Financial dashboard UI layouts.
- Scenario comparison interfaces.
- Charting implementations.
- Export-to-PDF examples.

Avoid relying too heavily on:

- Consumer calculators with limited inputs.
- Abandoned repos with old dependencies.
- Projects without clear licenses.
- Apps that mix financial advice language into the logic.

## 15. MVP Acceptance Criteria

The MVP is complete when:

- A consultant can enter a client age, retirement age, starting balance, monthly contribution, return, and inflation rate.
- A consultant can enter annual retirement spending and see how long the portfolio lasts after retirement.
- A consultant can add at least three accounts.
- A consultant can create at least three scenarios.
- The chart shows all enabled scenarios over time, including post-retirement drawdown after retirement age.
- The chart can switch between future dollars and today's dollars.
- Social Security can be toggled on and off per scenario.
- Social Security offsets retirement spending after its start age without investing any surplus.
- Summary cards update immediately when assumptions change.
- Summary cards show depletion age or no-depletion status, years funded, and remaining balance at projection end.
- A print-friendly summary can be generated.
- The app includes the required projection disclaimer.
- The tool can be used in a live meeting without needing a spreadsheet.

## 16. Future Enhancements

- Monte Carlo simulation.
- Tax-aware account modeling.
- Required minimum distributions.
- Roth conversion analysis.
- Spouse or household planning.
- Pension income modeling.
- Healthcare cost assumptions.
- Long-term care assumptions.
- College savings or other goal planning.
- Client portal view.
- Advisor login and saved client records.
- CRM integration.
- Real Social Security estimate flow.
- PDF report templates.
- White-label branding.

## 17. Open Questions

- Should the first version save client sessions, or should it be session-only for privacy?
- Does the consultant need spouse or household planning in the MVP?
- Should the tool model taxes, or only show pre-tax projection estimates at first?
- Should Social Security be entered manually, estimated automatically, or both?
- Should future versions add probability-of-success analysis after the deterministic depletion path is working?
- Does the coworker need this as a local-only app, a web app, or something hosted for multiple advisors?
- Should the first version include Monte Carlo simulation or keep deterministic projections only?

## 18. BMAD Execution Requirement

The implementation agent must use the actual BMad Method BMM process in this repository before and during the build. BMAD is not a loose inspiration layer for this project; it is the required operating process for turning this PRD into implementation artifacts, stories, code, tests, and review outcomes.

BMAD has been installed for Codex in this repository. The expected local artifacts are:

- `_bmad/`
- `.agents/skills/`
- `_bmad/_config/manifest.yaml`

If those artifacts are missing in a future checkout, install BMAD before coding:

```powershell
npx.cmd bmad-method install --directory . --modules bmm --tools codex --yes
```

If `codex` is rejected as a tool id, run BMAD's tool-list command, choose the listed Codex tool id, and repeat the install. Do not proceed as if BMAD was used unless the BMAD artifacts and generated skills are present.

Required BMAD workflow sequence:

1. Orientation and Analysis: start with `bmad-help`. If BMAD identifies upstream analysis gaps, run the recommended analysis workflow before changing implementation scope.
2. Planning: validate this PRD with `bmad-validate-prd`. If material changes are needed, use `bmad-edit-prd` and rerun `bmad-validate-prd`. If a future agent is recreating the PRD from scratch, use `bmad-create-prd`.
3. UX Planning: run `bmad-create-ux-design` because this dashboard is a UI-heavy advisor meeting tool.
4. Solutioning: run `bmad-create-architecture`, then `bmad-create-epics-and-stories`, then `bmad-check-implementation-readiness`.
5. Implementation: run `bmad-sprint-planning`, then build story by story with `bmad-create-story`, story validation, `bmad-dev-story`, and `bmad-code-review`.

During implementation, if BMAD recommends a PRD, UX, architecture, epic/story, test, or code change, the agent must record the recommendation, apply accepted changes to the correct artifact, and rerun the relevant BMAD validation, readiness, or code-review workflow before continuing.

Failure rule:

- If BMAD cannot be installed, invoked, or verified, stop and report the blocker.
- Do not substitute a generic "BMAD-style" process for the actual installed BMAD workflows.
- Do not start feature implementation until BMAD planning and implementation-readiness outputs have no unresolved blocking concerns.

This requirement maps the project to the official BMAD phases: Analysis, Planning, Solutioning, and Implementation.

## 19. Recommended MVP Build Order

1. Build the calculation engine for accumulation and post-retirement depletion.
2. Build account input and aggregation.
3. Build base projection chart with retirement age and depletion markers.
4. Add scenario duplication and comparison.
5. Add annual retirement spending and Social Security offset controls.
6. Add today's dollars vs future dollars toggle.
7. Add summary cards for retirement balance, income estimate, depletion age, years funded, and remaining balance.
8. Add print/export summary.
9. Polish the meeting-ready UI.
10. Test with sample client cases.
