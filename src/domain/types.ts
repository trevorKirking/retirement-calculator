export type DollarMode = "future" | "today";

export type AccountType =
  | "401(k)"
  | "Traditional IRA"
  | "Roth IRA"
  | "Brokerage"
  | "Pension"
  | "Cash savings"
  | "Other";

export interface ClientProfile {
  displayName: string;
  currentAnnualIncome: number;
  desiredRetirementIncome: number;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currentBalance: number;
  monthlyContribution: number;
  annualContributionIncrease: number;
  annualReturn: number;
  employerMatchEnabled: boolean;
  employerMatchPercent: number;
  employerMatchCap: number;
}

export interface Scenario {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
  currentAge: number;
  retirementAge: number;
  projectionEndAge: number;
  inflationRate: number;
  defaultAnnualReturn: number;
  withdrawalRate: number;
  retirementAnnualSpending: number;
  retirementSpendingInflationAdjusted: boolean;
  socialSecurityEnabled: boolean;
  socialSecurityMonthlyBenefit: number;
  socialSecurityStartAge: number;
  socialSecurityCola: number;
  accounts: Account[];
}

export interface ProjectionPoint {
  age: number;
  year: number;
  yearsElapsed: number;
  totalBalance: number;
  inflationAdjustedBalance: number;
  totalContributions: number;
  investmentGrowth: number;
  estimatedMonthlyIncome: number;
  annualSpending: number;
  portfolioWithdrawal: number;
  socialSecurityIncome: number;
  depletionAge: number | null;
  depletionYear: number | null;
  isDepleted: boolean;
}

export interface ProjectionSummary {
  retirementBalance: number;
  retirementBalanceToday: number;
  totalContributionsAtRetirement: number;
  investmentGrowthAtRetirement: number;
  estimatedMonthlyIncome: number;
  monthlyIncomeGap: number;
  annualSpending: number;
  depletionAge: number | null;
  depletionYear: number | null;
  yearsFunded: number;
  remainingBalanceAtEnd: number;
  bestScenarioLabel?: string;
}

export interface ProjectionResult {
  scenarioId: string;
  scenarioName: string;
  color: string;
  enabled: boolean;
  points: ProjectionPoint[];
  summary: ProjectionSummary;
}
