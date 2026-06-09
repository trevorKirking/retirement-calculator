import type { Account, ProjectionPoint, ProjectionResult, Scenario } from "./types";

export const DEFAULT_START_YEAR = 2026;

export interface ProjectionOptions {
  startYear?: number;
  currentAnnualIncome?: number;
}

interface AccountState {
  account: Account;
  balance: number;
  monthlyContribution: number;
}

export function monthlyReturnFromAnnual(annualReturnPercent: number): number {
  return Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
}

function currentTotal(states: AccountState[]): number {
  return states.reduce((sum, state) => sum + state.balance, 0);
}

function employerMatch(account: Account): number {
  if (!account.employerMatchEnabled) return 0;
  const match = account.monthlyContribution * (account.employerMatchPercent / 100);
  return account.employerMatchCap > 0 ? Math.min(match, account.employerMatchCap) : match;
}

function withdrawProportionally(states: AccountState[], withdrawal: number): number {
  const total = currentTotal(states);
  if (withdrawal <= 0 || total <= 0) return 0;
  const actualWithdrawal = Math.min(total, withdrawal);
  for (const state of states) {
    const share = state.balance / total;
    state.balance = Math.max(0, state.balance - actualWithdrawal * share);
  }
  return actualWithdrawal;
}

function inflate(value: number, ratePercent: number, years: number): number {
  return value * Math.pow(1 + ratePercent / 100, Math.max(0, years));
}

function toTodayDollars(value: number, inflationRate: number, yearsElapsed: number): number {
  return value / Math.pow(1 + inflationRate / 100, Math.max(0, yearsElapsed));
}

export function resolveRetirementAnnualSpending(scenario: Scenario, currentAnnualIncome = 0): number {
  if (scenario.retirementSpendingMode === "percentOfIncome") {
    return Math.max(0, currentAnnualIncome) * (Math.max(0, scenario.retirementSpendingPercentOfIncome) / 100);
  }

  return Math.max(0, scenario.retirementAnnualSpending);
}

function buildPoint(args: {
  scenario: Scenario;
  age: number;
  year: number;
  yearsElapsed: number;
  balance: number;
  totalContributions: number;
  totalWithdrawals: number;
  initialBalance: number;
  annualSpending: number;
  portfolioWithdrawal: number;
  socialSecurityIncome: number;
  depletionAge: number | null;
  depletionYear: number | null;
}): ProjectionPoint {
  const {
    scenario,
    age,
    year,
    yearsElapsed,
    balance,
    totalContributions,
    totalWithdrawals,
    initialBalance,
    annualSpending,
    portfolioWithdrawal,
    socialSecurityIncome,
    depletionAge,
    depletionYear
  } = args;
  const investmentGrowth = Math.max(0, balance + totalWithdrawals - initialBalance - totalContributions);
  const estimatedMonthlyIncome =
    (balance * (scenario.withdrawalRate / 100)) / 12 +
    (scenario.socialSecurityEnabled && age >= scenario.socialSecurityStartAge
      ? scenario.socialSecurityMonthlyBenefit
      : 0);

  return {
    age: Math.round(age * 10) / 10,
    year,
    yearsElapsed,
    totalBalance: balance,
    inflationAdjustedBalance: toTodayDollars(balance, scenario.inflationRate, yearsElapsed),
    totalContributions,
    investmentGrowth,
    estimatedMonthlyIncome,
    annualSpending,
    portfolioWithdrawal,
    socialSecurityIncome,
    depletionAge,
    depletionYear,
    isDepleted: depletionAge !== null
  };
}

export function projectScenario(
  scenario: Scenario,
  optionsOrStartYear: ProjectionOptions | number = DEFAULT_START_YEAR
): ProjectionResult {
  const startYear = typeof optionsOrStartYear === "number"
    ? optionsOrStartYear
    : optionsOrStartYear.startYear ?? DEFAULT_START_YEAR;
  const currentAnnualIncome =
    typeof optionsOrStartYear === "number" ? 0 : optionsOrStartYear.currentAnnualIncome ?? 0;
  const baseAnnualSpending = resolveRetirementAnnualSpending(scenario, currentAnnualIncome);
  const states: AccountState[] = scenario.accounts.map((account) => ({
    account,
    balance: Math.max(0, account.currentBalance),
    monthlyContribution: Math.max(0, account.monthlyContribution)
  }));

  const initialBalance = currentTotal(states);
  const totalMonths = Math.max(0, Math.round((scenario.projectionEndAge - scenario.currentAge) * 12));
  const points: ProjectionPoint[] = [];
  let totalContributions = 0;
  let totalWithdrawals = 0;
  let depletionAge: number | null = null;
  let depletionYear: number | null = null;
  let retirementBoundaryPoint: ProjectionPoint | null = null;
  let annualSpendingAccumulator = 0;
  let annualWithdrawalAccumulator = 0;
  let annualSocialSecurityAccumulator = 0;

  points.push(
    buildPoint({
      scenario,
      age: scenario.currentAge,
      year: startYear,
      yearsElapsed: 0,
      balance: initialBalance,
      totalContributions,
      totalWithdrawals,
      initialBalance,
      annualSpending: 0,
      portfolioWithdrawal: 0,
      socialSecurityIncome: 0,
      depletionAge,
      depletionYear
    })
  );

  for (let month = 1; month <= totalMonths; month += 1) {
    const previousAge = scenario.currentAge + (month - 1) / 12;
    const age = scenario.currentAge + month / 12;
    const yearsElapsed = Math.floor(month / 12);
    const alreadyRetired = previousAge >= scenario.retirementAge;
    const reachesRetirementThisMonth = previousAge < scenario.retirementAge && age >= scenario.retirementAge;

    if (!alreadyRetired && month > 1 && (month - 1) % 12 === 0) {
      for (const state of states) {
        state.monthlyContribution *= 1 + state.account.annualContributionIncrease / 100;
      }
    }

    if (!alreadyRetired) {
      for (const state of states) {
        const contribution = state.monthlyContribution;
        const match = employerMatch({ ...state.account, monthlyContribution: contribution });
        state.balance += contribution + match;
        totalContributions += contribution + match;
        state.balance *= 1 + monthlyReturnFromAnnual(state.account.annualReturn);
      }

      if (reachesRetirementThisMonth && retirementBoundaryPoint === null) {
        retirementBoundaryPoint = buildPoint({
          scenario,
          age: scenario.retirementAge,
          year: startYear + Math.ceil(month / 12),
          yearsElapsed: Math.max(0, scenario.retirementAge - scenario.currentAge),
          balance: currentTotal(states),
          totalContributions,
          totalWithdrawals,
          initialBalance,
          annualSpending: 0,
          portfolioWithdrawal: 0,
          socialSecurityIncome: 0,
          depletionAge,
          depletionYear
        });
      }
    } else {
      for (const state of states) {
        state.balance *= 1 + monthlyReturnFromAnnual(state.account.annualReturn);
      }

      const yearsRetired = Math.max(0, Math.floor(age - scenario.retirementAge));
      const annualSpending = scenario.retirementSpendingInflationAdjusted
        ? inflate(baseAnnualSpending, scenario.inflationRate, yearsRetired)
        : baseAnnualSpending;
      const monthlySpending = Math.max(0, annualSpending / 12);
      const socialSecurityYears = Math.max(0, Math.floor(age - scenario.socialSecurityStartAge));
      const monthlySocialSecurity =
        scenario.socialSecurityEnabled && age >= scenario.socialSecurityStartAge
          ? inflate(scenario.socialSecurityMonthlyBenefit, scenario.socialSecurityCola, socialSecurityYears)
          : 0;
      const requestedWithdrawal = Math.max(0, monthlySpending - monthlySocialSecurity);
      const actualWithdrawal = withdrawProportionally(states, requestedWithdrawal);
      totalWithdrawals += actualWithdrawal;
      annualSpendingAccumulator += monthlySpending;
      annualWithdrawalAccumulator += actualWithdrawal;
      annualSocialSecurityAccumulator += monthlySocialSecurity;

      if (depletionAge === null && currentTotal(states) <= 0 && requestedWithdrawal > 0) {
        depletionAge = Math.round(age * 10) / 10;
        depletionYear = startYear + Math.ceil(month / 12);
      }
    }

    if (month % 12 === 0 || month === totalMonths) {
      const pointAge = scenario.currentAge + month / 12;
      const pointYear = startYear + Math.ceil(month / 12);
      const pointYearsElapsed = pointYear - startYear;
      points.push(
        buildPoint({
          scenario,
          age: pointAge,
          year: pointYear,
          yearsElapsed: pointYearsElapsed,
          balance: currentTotal(states),
          totalContributions,
          totalWithdrawals,
          initialBalance,
          annualSpending: annualSpendingAccumulator,
          portfolioWithdrawal: annualWithdrawalAccumulator,
          socialSecurityIncome: annualSocialSecurityAccumulator,
          depletionAge,
          depletionYear
        })
      );
      annualSpendingAccumulator = 0;
      annualWithdrawalAccumulator = 0;
      annualSocialSecurityAccumulator = 0;
    }
  }

  const retirementPoint =
    retirementBoundaryPoint ?? points.find((point) => point.age >= scenario.retirementAge) ?? points[points.length - 1];
  const finalPoint = points[points.length - 1];
  const estimatedMonthlyIncome =
    (retirementPoint.totalBalance * (scenario.withdrawalRate / 100)) / 12 +
    (scenario.socialSecurityEnabled && scenario.socialSecurityStartAge <= scenario.retirementAge
      ? scenario.socialSecurityMonthlyBenefit
      : 0);
  const targetMonthlyIncome = baseAnnualSpending / 12;

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    color: scenario.color,
    enabled: scenario.enabled,
    points,
    summary: {
      retirementBalance: retirementPoint.totalBalance,
      retirementBalanceToday: retirementPoint.inflationAdjustedBalance,
      totalContributionsAtRetirement: retirementPoint.totalContributions,
      investmentGrowthAtRetirement: retirementPoint.investmentGrowth,
      estimatedMonthlyIncome,
      monthlyIncomeGap: estimatedMonthlyIncome - targetMonthlyIncome,
      annualSpending: baseAnnualSpending,
      depletionAge,
      depletionYear,
      yearsFunded:
        depletionAge !== null
          ? Math.max(0, depletionAge - scenario.retirementAge)
          : Math.max(0, scenario.projectionEndAge - scenario.retirementAge),
      remainingBalanceAtEnd: finalPoint.totalBalance
    }
  };
}

export function validateScenario(scenario: Scenario): string[] {
  const errors: string[] = [];
  if (scenario.currentAge >= scenario.retirementAge) {
    errors.push("Current age must be less than retirement age.");
  }
  if (scenario.retirementAge >= scenario.projectionEndAge) {
    errors.push("Retirement age must be less than projection end age.");
  }
  if (scenario.retirementSpendingMode === "dollars" && scenario.retirementAnnualSpending < 0) {
    errors.push("Annual retirement spending must be zero or greater.");
  }
  if (scenario.retirementSpendingMode === "percentOfIncome" && scenario.retirementSpendingPercentOfIncome < 0) {
    errors.push("Annual retirement spending percentage must be zero or greater.");
  }
  if (scenario.accounts.length === 0) {
    errors.push("Add at least one account to calculate a projection.");
  }
  return errors;
}

export function compareBestScenario(results: ProjectionResult[]): ProjectionResult | null {
  const enabled = results.filter((result) => result.enabled);
  if (enabled.length === 0) return null;
  return enabled.reduce((best, current) =>
    current.summary.remainingBalanceAtEnd > best.summary.remainingBalanceAtEnd ? current : best
  );
}
