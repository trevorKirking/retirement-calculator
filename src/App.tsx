import {
  CopyPlus,
  Eye,
  EyeOff,
  PlusCircle,
  Printer,
  RotateCcw,
  Trash2
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { brandColors, cloneDefaultScenarios, defaultClient, scenarioColors } from "./domain/defaults";
import { formatCompactCurrency, formatCurrency, formatPercent, parseNumber } from "./domain/format";
import {
  compareBestScenario,
  projectScenario,
  validateScenario
} from "./domain/projection";
import type { Account, ClientProfile, DollarMode, ProjectionResult, Scenario } from "./domain/types";

const accountTypes: Account["type"][] = [
  "401(k)",
  "Traditional IRA",
  "Roth IRA",
  "Brokerage",
  "Pension",
  "Cash savings",
  "Other"
];

const projectionDisclaimer =
  "This projection is for informational purposes only and is not a guarantee of future performance. Actual results may vary based on market conditions, taxes, fees, inflation, contribution changes, withdrawals, and other factors.";

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brand-lockup compact" : "brand-lockup"}>
      <svg viewBox="0 0 640 132" role="img" aria-label="Innovest" className="innovest-logo">
        <polygon points="0 0 124 0 62 132" fill="currentColor" />
        <text
          x="168"
          y="84"
          fill="currentColor"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="72"
          fontWeight="400"
          textLength="452"
          lengthAdjust="spacing"
        >
          INNOVEST
        </text>
      </svg>
      {!compact && (
        <div>
          <p className="brand-kicker">Retirement Planning Dashboard</p>
          <p className="brand-subtitle">Advisor meeting cockpit - Version 2</p>
        </div>
      )}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  description
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-shell">
        {prefix && <b>{prefix}</b>}
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(parseNumber(event.target.value))}
        />
        {suffix && <b>{suffix}</b>}
      </div>
      {description && <small>{description}</small>}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

type ChartRow = Record<string, number>;

function mergeChartRows(results: ProjectionResult[], mode: DollarMode) {
  const rows = new Map<number, ChartRow>();
  for (const result of results.filter((item) => item.enabled)) {
    for (const point of result.points) {
      const row = rows.get(point.age) ?? { age: point.age, year: point.year };
      row[result.scenarioId] = mode === "today" ? point.inflationAdjustedBalance : point.totalBalance;
      row[`${result.scenarioId}AnnualSpending`] = point.annualSpending;
      row[`${result.scenarioId}PortfolioWithdrawal`] = point.portfolioWithdrawal;
      row[`${result.scenarioId}SocialSecurity`] = point.socialSecurityIncome;
      rows.set(point.age, row);
    }
  }
  return Array.from(rows.values()).sort((a, b) => a.age - b.age);
}

type ChartPayloadEntry = {
  name: string;
  value: number;
  color?: string;
  dataKey?: string | number;
  payload?: ChartRow;
};

function ChartTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: ChartPayloadEntry[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>Age {label}</strong>
      {payload.map((entry) => {
        const dataKey = String(entry.dataKey ?? "");
        const annualSpending = Number(entry.payload?.[`${dataKey}AnnualSpending`] ?? 0);
        const portfolioWithdrawal = Number(entry.payload?.[`${dataKey}PortfolioWithdrawal`] ?? 0);
        const socialSecurity = Number(entry.payload?.[`${dataKey}SocialSecurity`] ?? 0);
        const hasRetirementCashFlow = annualSpending > 0 || portfolioWithdrawal > 0 || socialSecurity > 0;

        return (
          <div className="tooltip-scenario" key={`${entry.name}-${dataKey}`}>
            <span style={{ color: entry.color ?? brandColors.ink }}>
              {entry.name}: {formatCurrency(entry.value)}
            </span>
            {hasRetirementCashFlow && (
              <small>
                Spend {formatCurrency(annualSpending)} | Draw {formatCurrency(portfolioWithdrawal)} | SS{" "}
                {formatCurrency(socialSecurity)}
              </small>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProjectionChart({
  results,
  selectedScenario,
  mode
}: {
  results: ProjectionResult[];
  selectedScenario: Scenario;
  mode: DollarMode;
}) {
  const rows = useMemo(() => mergeChartRows(results, mode), [results, mode]);
  const enabledResults = results.filter((result) => result.enabled);

  return (
    <section className="chart-panel" aria-label="Projection chart">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Projection Chart</p>
          <h2>Portfolio balance by age</h2>
        </div>
        <span className="mode-pill">{mode === "future" ? "Future dollars" : "Today's dollars"}</span>
      </div>
      {enabledResults.length === 0 ? (
        <div className="chart-frame empty-chart" role="img" aria-label="No enabled scenario chart">
          <strong>No enabled scenarios selected.</strong>
          <span>Show at least one scenario to display the projection line.</span>
        </div>
      ) : (
      <div className="chart-frame" role="img" aria-label="Line chart comparing enabled retirement scenarios">
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={rows} margin={{ top: 18, right: 28, bottom: 8, left: 6 }}>
            <CartesianGrid stroke="#E3E1E2" strokeDasharray="3 3" />
            <XAxis dataKey="age" type="number" domain={["dataMin", "dataMax"]} tickLine={false} />
            <YAxis tickFormatter={formatCompactCurrency} width={74} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <ReferenceLine
              x={selectedScenario.retirementAge}
              stroke={brandColors.ink}
              strokeDasharray="5 5"
              label={{ value: "Retirement", position: "insideTopRight", fill: brandColors.ink }}
            />
            {enabledResults.map((result) => (
              <Line
                key={result.scenarioId}
                dataKey={result.scenarioId}
                name={result.scenarioName}
                type="monotone"
                stroke={result.color}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
            {enabledResults.map((result) => {
              if (!result.summary.depletionAge) return null;
              const point = result.points.find((item) => item.depletionAge === result.summary.depletionAge);
              return (
                <ReferenceDot
                  key={`${result.scenarioId}-depletion`}
                  x={result.summary.depletionAge}
                  y={point ? (mode === "today" ? point.inflationAdjustedBalance : point.totalBalance) : 0}
                  r={6}
                  fill={result.color}
                  stroke="#fff"
                  label={{ value: "Depletion", position: "top", fill: result.color }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      )}
      <p className="chart-note">
        Tooltip values include enabled scenario balances. Retirement and depletion markers are shown directly on the chart.
      </p>
    </section>
  );
}

function SummaryCards({
  projection,
  bestScenario,
  scenario
}: {
  projection: ProjectionResult;
  bestScenario: ProjectionResult | null;
  scenario: Scenario;
}) {
  const { summary } = projection;
  return (
    <section className="summary-grid" aria-label="Selected scenario summary">
      <article className="kpi-card">
        <span>Retirement balance</span>
        <strong>{formatCurrency(summary.retirementBalance)}</strong>
        <small>{formatCurrency(summary.retirementBalanceToday)} today</small>
      </article>
      <article className="kpi-card teal">
        <span>Withdrawal-rate income</span>
        <strong>{formatCurrency(summary.estimatedMonthlyIncome)}</strong>
        <small>
          {formatPercent(scenario.withdrawalRate)} estimate; {summary.monthlyIncomeGap >= 0 ? "surplus" : "gap"}{" "}
          {formatCurrency(Math.abs(summary.monthlyIncomeGap))}
        </small>
      </article>
      <article className="kpi-card">
        <span>Total contributions</span>
        <strong>{formatCurrency(summary.totalContributionsAtRetirement)}</strong>
        <small>{formatCurrency(summary.investmentGrowthAtRetirement)} growth</small>
      </article>
      <article className={summary.depletionAge ? "kpi-card danger" : "kpi-card lime"}>
        <span>Depletion result</span>
        <strong>{summary.depletionAge ? `Age ${summary.depletionAge}` : "No depletion"}</strong>
        <small>
          {summary.depletionYear
            ? `Projected in ${summary.depletionYear}`
            : `${formatCurrency(summary.remainingBalanceAtEnd)} remaining`}
        </small>
      </article>
      <article className="kpi-card">
        <span>Years funded</span>
        <strong>{summary.yearsFunded.toFixed(1)}</strong>
        <small>After retirement</small>
      </article>
      <article className="kpi-card teal">
        <span>Best scenario</span>
        <strong>{bestScenario?.scenarioName ?? "None"}</strong>
        <small>{bestScenario ? formatCurrency(bestScenario.summary.remainingBalanceAtEnd) : "Enable a scenario"}</small>
      </article>
    </section>
  );
}

function AccountEditor({
  account,
  onChange,
  onRemove,
  canRemove
}: {
  account: Account;
  onChange: (patch: Partial<Account>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <article className="account-card">
      <div className="account-head">
        <input
          aria-label={`${account.name} account name`}
          value={account.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
        <select
          aria-label={`${account.name} account type`}
          value={account.type}
          onChange={(event) => onChange({ type: event.target.value as Account["type"] })}
        >
          {accountTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <button className="icon-button ghost" type="button" onClick={onRemove} disabled={!canRemove} aria-label={`Remove ${account.name}`}>
          <Trash2 size={16} />
        </button>
      </div>
      <div className="two-col">
        <NumberField label="Balance" value={account.currentBalance} prefix="$" min={0} onChange={(currentBalance) => onChange({ currentBalance })} />
        <NumberField label="Monthly contribution" value={account.monthlyContribution} prefix="$" min={0} onChange={(monthlyContribution) => onChange({ monthlyContribution })} />
        <NumberField label="Annual return" value={account.annualReturn} suffix="%" min={0} step={0.1} onChange={(annualReturn) => onChange({ annualReturn })} />
        <NumberField label="Contribution increase" value={account.annualContributionIncrease} suffix="%" min={0} step={0.1} onChange={(annualContributionIncrease) => onChange({ annualContributionIncrease })} />
      </div>
      <Toggle label="Employer match" checked={account.employerMatchEnabled} onChange={(employerMatchEnabled) => onChange({ employerMatchEnabled })} />
      {account.employerMatchEnabled && (
        <div className="two-col">
          <NumberField label="Match percent" value={account.employerMatchPercent} suffix="%" min={0} step={1} onChange={(employerMatchPercent) => onChange({ employerMatchPercent })} />
          <NumberField label="Monthly match cap" value={account.employerMatchCap} prefix="$" min={0} onChange={(employerMatchCap) => onChange({ employerMatchCap })} />
        </div>
      )}
    </article>
  );
}

function PrintProjectionChart({ results, mode }: { results: ProjectionResult[]; mode: DollarMode }) {
  const enabled = results.filter((result) => result.enabled);
  if (enabled.length === 0) {
    return (
      <svg className="print-chart" viewBox="0 0 600 220" role="img" aria-label="Printable projection chart">
        <rect width="600" height="220" fill="#FCFAF4" />
        <text x="42" y="104" fill="#504D51" fontSize="16" fontWeight="700">
          No enabled scenarios selected.
        </text>
        <text x="42" y="130" fill="#6E6C70" fontSize="13">
          Show at least one scenario before printing a projection comparison.
        </text>
      </svg>
    );
  }

  const allPoints = enabled.flatMap((result) => result.points);
  const minAge = Math.min(...allPoints.map((point) => point.age));
  const maxAge = Math.max(...allPoints.map((point) => point.age));
  const maxValue = Math.max(
    1,
    ...allPoints.map((point) => (mode === "today" ? point.inflationAdjustedBalance : point.totalBalance))
  );

  return (
    <svg className="print-chart" viewBox="0 0 600 220" role="img" aria-label="Printable projection chart">
      <rect width="600" height="220" fill="#FCFAF4" />
      {[0, 1, 2, 3].map((line) => (
        <line key={line} x1="42" x2="580" y1={36 + line * 42} y2={36 + line * 42} stroke="#E3E1E2" />
      ))}
      {enabled.map((result) => {
        const points = result.points
          .map((point) => {
            const value = mode === "today" ? point.inflationAdjustedBalance : point.totalBalance;
            const x = 42 + ((point.age - minAge) / Math.max(1, maxAge - minAge)) * 538;
            const y = 190 - (value / maxValue) * 152;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");
        return <polyline key={result.scenarioId} fill="none" stroke={result.color} strokeWidth="4" points={points} />;
      })}
      <text x="42" y="24" fill="#504D51" fontSize="14" fontWeight="700">
        Projection chart ({mode === "future" ? "future dollars" : "today's dollars"})
      </text>
      <text x="42" y="210" fill="#6E6C70" fontSize="12">
        Age {minAge} to {maxAge}
      </text>
    </svg>
  );
}

export default function App() {
  const [client, setClient] = useState<ClientProfile>(defaultClient);
  const [scenarios, setScenarios] = useState<Scenario[]>(() => cloneDefaultScenarios());
  const [selectedScenarioId, setSelectedScenarioId] = useState("scenario-base");
  const [dollarMode, setDollarMode] = useState<DollarMode>("future");

  const selectedScenario = scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0];
  const projections = useMemo(() => scenarios.map((scenario) => projectScenario(scenario)), [scenarios]);
  const selectedProjection =
    projections.find((projection) => projection.scenarioId === selectedScenario.id) ?? projections[0];
  const bestScenario = useMemo(() => compareBestScenario(projections), [projections]);
  const validation = validateScenario(selectedScenario);
  const selectedLastPoint = selectedProjection.points[selectedProjection.points.length - 1];

  function updateClient(patch: Partial<ClientProfile>) {
    setClient((current) => ({ ...current, ...patch }));
  }

  function updateSelectedScenario(patch: Partial<Scenario>) {
    setScenarios((current) =>
      current.map((scenario) => (scenario.id === selectedScenario.id ? { ...scenario, ...patch } : scenario))
    );
  }

  function updateAccount(accountId: string, patch: Partial<Account>) {
    updateSelectedScenario({
      accounts: selectedScenario.accounts.map((account) =>
        account.id === accountId ? { ...account, ...patch } : account
      )
    });
  }

  function addAccount() {
    updateSelectedScenario({
      accounts: [
        ...selectedScenario.accounts,
        {
          id: `acct-${Date.now()}`,
          name: "New Account",
          type: "Other",
          currentBalance: 0,
          monthlyContribution: 0,
          annualContributionIncrease: 0,
          annualReturn: selectedScenario.defaultAnnualReturn,
          employerMatchEnabled: false,
          employerMatchPercent: 0,
          employerMatchCap: 0
        }
      ]
    });
  }

  function duplicateScenario() {
    const nextIndex = scenarios.length;
    const duplicated: Scenario = {
      ...selectedScenario,
      id: `scenario-${Date.now()}`,
      name: `${selectedScenario.name} Copy`,
      color: scenarioColors[nextIndex % scenarioColors.length],
      enabled: true,
      accounts: selectedScenario.accounts.map((account) => ({ ...account, id: `${account.id}-${Date.now()}` }))
    };
    setScenarios((current) => [...current, duplicated]);
    setSelectedScenarioId(duplicated.id);
  }

  function removeScenario(id: string) {
    if (scenarios.length <= 1) return;
    const next = scenarios.filter((scenario) => scenario.id !== id);
    setScenarios(next);
    if (selectedScenarioId === id) setSelectedScenarioId(next[0].id);
  }

  function resetDashboard() {
    setClient(defaultClient);
    setScenarios(cloneDefaultScenarios());
    setSelectedScenarioId("scenario-base");
    setDollarMode("future");
  }

  return (
    <>
      <main className="app-shell">
        <header className="masthead">
          <BrandLockup />
          <div className="masthead-actions">
            <button className="secondary-button" type="button" onClick={resetDashboard}>
              <RotateCcw size={17} /> Reset
            </button>
            <button className="primary-button" type="button" onClick={() => window.print()}>
              <Printer size={17} /> Print Summary
            </button>
          </div>
        </header>

        <section className="hero-strip" aria-label="Meeting summary">
          <div>
            <p className="eyebrow">Live advisor meeting tool - Version 2</p>
            <h1>{client.displayName || "Anonymous Client"} retirement projection</h1>
            <p>
              Local-only deterministic projection: contributions stop at retirement, annual spending drives drawdown,
              and withdrawal rate estimates monthly income in {dollarMode === "future" ? "future" : "today's"} dollars.
            </p>
          </div>
          <div className="hero-metric">
            <span>Selected outcome</span>
            <strong>
              {selectedProjection.summary.depletionAge
                ? `Funds to age ${selectedProjection.summary.depletionAge}`
                : "No depletion by end age"}
            </strong>
            <small>Remaining {formatCurrency(selectedProjection.summary.remainingBalanceAtEnd)}</small>
          </div>
        </section>

        <div className="dashboard-grid">
          <aside className="left-rail" aria-label="Client assumptions and accounts">
            <section className="panel">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">Assumptions</p>
                  <h2>Client profile</h2>
                </div>
              </div>
              <label className="field">
                <span>Client display name</span>
                <input value={client.displayName} onChange={(event) => updateClient({ displayName: event.target.value })} />
              </label>
              <div className="two-col">
                <NumberField label="Current age" value={selectedScenario.currentAge} min={18} max={99} onChange={(currentAge) => updateSelectedScenario({ currentAge })} />
                <NumberField label="Retirement age" value={selectedScenario.retirementAge} min={19} max={99} onChange={(retirementAge) => updateSelectedScenario({ retirementAge })} />
                <NumberField label="Projection end age" value={selectedScenario.projectionEndAge} min={selectedScenario.retirementAge + 1} max={110} onChange={(projectionEndAge) => updateSelectedScenario({ projectionEndAge })} />
                <NumberField label="Inflation" value={selectedScenario.inflationRate} suffix="%" min={0} step={0.1} onChange={(inflationRate) => updateSelectedScenario({ inflationRate })} />
              </div>
              <div className="two-col">
                <NumberField label="Current income" value={client.currentAnnualIncome} prefix="$" min={0} onChange={(currentAnnualIncome) => updateClient({ currentAnnualIncome })} />
                <NumberField label="Desired income" value={client.desiredRetirementIncome} prefix="$" min={0} onChange={(desiredRetirementIncome) => updateClient({ desiredRetirementIncome })} />
              </div>
              <div className="cashflow-group" aria-label="Retirement cash flow controls">
                <div className="cashflow-head">
                  <div>
                    <p className="eyebrow">Retirement cash flow</p>
                    <h3>Drawdown inputs</h3>
                  </div>
                  <span>Contributions stop at age {selectedScenario.retirementAge}</span>
                </div>
                <div className="cashflow-controls">
                  <div className="model-control-card">
                    <NumberField
                      label="Annual spending drawdown"
                      value={selectedScenario.retirementAnnualSpending}
                      prefix="$"
                      min={0}
                      description="Feeds post-retirement withdrawals and depletion."
                      onChange={(retirementAnnualSpending) => updateSelectedScenario({ retirementAnnualSpending })}
                    />
                  </div>
                  <div className="model-control-card estimate">
                    <NumberField
                      label="Withdrawal-rate income estimate"
                      value={selectedScenario.withdrawalRate}
                      suffix="%"
                      min={0}
                      step={0.1}
                      description="Estimates monthly income; it does not change drawdown."
                      onChange={(withdrawalRate) => updateSelectedScenario({ withdrawalRate })}
                    />
                  </div>
                </div>
              </div>
              <Toggle
                label="Inflation-adjust retirement spending"
                checked={selectedScenario.retirementSpendingInflationAdjusted}
                onChange={(retirementSpendingInflationAdjusted) =>
                  updateSelectedScenario({ retirementSpendingInflationAdjusted })
                }
              />
              {validation.length > 0 && (
                <div className="validation" role="alert">
                  {validation.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
            </section>

            <section className="panel">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">Accounts</p>
                  <h2>{selectedScenario.accounts.length} account inputs</h2>
                </div>
                <button className="icon-button" type="button" onClick={addAccount} aria-label="Add account">
                  <PlusCircle size={18} />
                </button>
              </div>
              <div className="account-stack">
                {selectedScenario.accounts.map((account) => (
                  <AccountEditor
                    key={account.id}
                    account={account}
                    canRemove={selectedScenario.accounts.length > 1}
                    onChange={(patch) => updateAccount(account.id, patch)}
                    onRemove={() =>
                      updateSelectedScenario({
                        accounts: selectedScenario.accounts.filter((item) => item.id !== account.id)
                      })
                    }
                  />
                ))}
              </div>
            </section>
          </aside>

          <section className="main-stage">
            <SummaryCards projection={selectedProjection} bestScenario={bestScenario} scenario={selectedScenario} />
            <div className="mode-toggle" role="group" aria-label="Dollar display mode">
              <button className={dollarMode === "future" ? "active" : ""} type="button" onClick={() => setDollarMode("future")}>
                Future dollars
              </button>
              <button className={dollarMode === "today" ? "active" : ""} type="button" onClick={() => setDollarMode("today")}>
                Today's dollars
              </button>
            </div>
            <ProjectionChart results={projections} selectedScenario={selectedScenario} mode={dollarMode} />
            <section className="panel details-panel">
              <p className="eyebrow">Selected scenario detail</p>
              <div className="detail-grid">
                <div>
                  <span>Annual spending</span>
                  <strong>{formatCurrency(selectedScenario.retirementAnnualSpending)}</strong>
                </div>
                <div>
                  <span>Withdrawal-rate income</span>
                  <strong>{formatCurrency(selectedProjection.summary.estimatedMonthlyIncome)}</strong>
                </div>
                <div>
                  <span>Social Security offset</span>
                  <strong>{formatCurrency(selectedLastPoint.socialSecurityIncome)}</strong>
                </div>
                <div>
                  <span>Portfolio withdrawal</span>
                  <strong>{formatCurrency(selectedLastPoint.portfolioWithdrawal)}</strong>
                </div>
                <div>
                  <span>Remaining at end</span>
                  <strong>{formatCurrency(selectedProjection.summary.remainingBalanceAtEnd)}</strong>
                </div>
                <div>
                  <span>Contribution phase</span>
                  <strong>Stops at age {selectedScenario.retirementAge}</strong>
                </div>
              </div>
            </section>
          </section>

          <aside className="right-rail" aria-label="Scenarios and Social Security">
            <section className="panel">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">Scenarios</p>
                  <h2>Compare paths</h2>
                </div>
                <button className="icon-button" type="button" onClick={duplicateScenario} aria-label="Duplicate selected scenario">
                  <CopyPlus size={18} />
                </button>
              </div>
              <div className="scenario-stack">
                {scenarios.map((scenario) => {
                  const projection = projections.find((result) => result.scenarioId === scenario.id);
                  return (
                    <article key={scenario.id} className={scenario.id === selectedScenario.id ? "scenario-card selected" : "scenario-card"}>
                      <button className="scenario-main" type="button" onClick={() => setSelectedScenarioId(scenario.id)}>
                        <i style={{ background: scenario.color }} />
                        <span>{scenario.name}</span>
                        <b>{projection ? formatCompactCurrency(projection.summary.remainingBalanceAtEnd) : "$0"}</b>
                      </button>
                      <div className="scenario-actions">
                        <button
                          className="icon-button ghost"
                          type="button"
                          aria-label={scenario.enabled ? `Hide ${scenario.name}` : `Show ${scenario.name}`}
                          onClick={() =>
                            setScenarios((current) =>
                              current.map((item) =>
                                item.id === scenario.id ? { ...item, enabled: !item.enabled } : item
                              )
                            )
                          }
                        >
                          {scenario.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          className="icon-button ghost"
                          type="button"
                          aria-label={`Remove ${scenario.name}`}
                          disabled={scenarios.length <= 1}
                          onClick={() => removeScenario(scenario.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <label className="field">
                <span>Scenario name</span>
                <input value={selectedScenario.name} onChange={(event) => updateSelectedScenario({ name: event.target.value })} />
              </label>
              <NumberField label="Default annual return" value={selectedScenario.defaultAnnualReturn} suffix="%" min={0} step={0.1} onChange={(defaultAnnualReturn) => updateSelectedScenario({ defaultAnnualReturn })} />
            </section>

            <section className="panel">
              <p className="eyebrow">Social Security</p>
              <h2>Offset spending</h2>
              <Toggle label="Include Social Security" checked={selectedScenario.socialSecurityEnabled} onChange={(socialSecurityEnabled) => updateSelectedScenario({ socialSecurityEnabled })} />
              <div className="two-col">
                <NumberField label="Monthly benefit" value={selectedScenario.socialSecurityMonthlyBenefit} prefix="$" min={0} onChange={(socialSecurityMonthlyBenefit) => updateSelectedScenario({ socialSecurityMonthlyBenefit })} />
                <NumberField label="Start age" value={selectedScenario.socialSecurityStartAge} min={62} max={75} onChange={(socialSecurityStartAge) => updateSelectedScenario({ socialSecurityStartAge })} />
                <NumberField label="COLA" value={selectedScenario.socialSecurityCola} suffix="%" min={0} step={0.1} onChange={(socialSecurityCola) => updateSelectedScenario({ socialSecurityCola })} />
              </div>
              <p className="helper">
                Social Security offsets retirement spending after start age. Surplus is not invested by default.
              </p>
            </section>

            <section className="panel export-card">
              <p className="eyebrow">Export</p>
              <h2>Client summary</h2>
              <p>Print summary includes Innovest branding, scenario names, assumptions, results, chart, and disclaimer.</p>
              <button className="primary-button wide" type="button" onClick={() => window.print()}>
                <Printer size={17} /> Print Summary
              </button>
              <p className="helper">Session data remains local unless you choose a browser print/PDF destination.</p>
            </section>
          </aside>
        </div>
      </main>

      <section className="print-summary" aria-label="Print summary">
        <header className="print-header">
          <BrandLockup compact />
          <div>
            <h1>Retirement Projection Summary</h1>
            <p>{client.displayName || "Anonymous Client"} - {new Date().toLocaleDateString()}</p>
          </div>
        </header>
        <PrintProjectionChart results={projections} mode={dollarMode} />
        <div className="print-grid">
          <div><span>Selected scenario</span><strong>{selectedScenario.name}</strong></div>
          <div><span>Retirement age</span><strong>{selectedScenario.retirementAge}</strong></div>
          <div><span>Annual spending</span><strong>{formatCurrency(selectedScenario.retirementAnnualSpending)}</strong></div>
          <div><span>Social Security</span><strong>{selectedScenario.socialSecurityEnabled ? formatCurrency(selectedScenario.socialSecurityMonthlyBenefit, 0) : "Excluded"}</strong></div>
          <div><span>Retirement balance</span><strong>{formatCurrency(selectedProjection.summary.retirementBalance)}</strong></div>
          <div><span>Depletion result</span><strong>{selectedProjection.summary.depletionAge ? `Age ${selectedProjection.summary.depletionAge}` : "No depletion"}</strong></div>
          <div><span>Years funded</span><strong>{selectedProjection.summary.yearsFunded.toFixed(1)}</strong></div>
          <div><span>Remaining at end</span><strong>{formatCurrency(selectedProjection.summary.remainingBalanceAtEnd)}</strong></div>
        </div>
        <h2>Scenario Names</h2>
        <ul className="print-scenarios">
          {projections.map((projection) => (
            <li key={projection.scenarioId}>
              <span style={{ background: projection.color }} />
              {projection.scenarioName} - {projection.enabled ? "enabled" : "hidden"}
            </li>
          ))}
        </ul>
        <p className="disclaimer">{projectionDisclaimer}</p>
      </section>
    </>
  );
}
