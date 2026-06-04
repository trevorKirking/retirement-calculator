import type { Account, ClientProfile, Scenario } from "./types";

export const brandColors = {
  bronze: "#AF6828",
  bronzeDark: "#8D5218",
  bronzeLight: "#FBF1E4",
  teal: "#008991",
  tealDark: "#006B71",
  tealLight: "#E0F2F3",
  lime: "#A5B438",
  ink: "#504D51"
};

export const scenarioColors = [
  brandColors.bronze,
  brandColors.teal,
  brandColors.lime,
  "#6E6C70",
  "#A8301F"
];

export const defaultClient: ClientProfile = {
  displayName: "Sample Client",
  currentAnnualIncome: 142000,
  desiredRetirementIncome: 86000
};

export const defaultAccounts: Account[] = [
  {
    id: "acct-401k",
    name: "401(k)",
    type: "401(k)",
    currentBalance: 184000,
    monthlyContribution: 950,
    annualContributionIncrease: 2,
    annualReturn: 6.5,
    employerMatchEnabled: true,
    employerMatchPercent: 50,
    employerMatchCap: 300
  },
  {
    id: "acct-roth",
    name: "Roth IRA",
    type: "Roth IRA",
    currentBalance: 42500,
    monthlyContribution: 300,
    annualContributionIncrease: 1,
    annualReturn: 6.25,
    employerMatchEnabled: false,
    employerMatchPercent: 0,
    employerMatchCap: 0
  },
  {
    id: "acct-brokerage",
    name: "Brokerage",
    type: "Brokerage",
    currentBalance: 28000,
    monthlyContribution: 200,
    annualContributionIncrease: 0,
    annualReturn: 5.75,
    employerMatchEnabled: false,
    employerMatchPercent: 0,
    employerMatchCap: 0
  }
];

export const defaultScenarios: Scenario[] = [
  {
    id: "scenario-base",
    name: "Base Case",
    color: brandColors.bronze,
    enabled: true,
    currentAge: 45,
    retirementAge: 67,
    projectionEndAge: 95,
    inflationRate: 2.6,
    defaultAnnualReturn: 6.25,
    withdrawalRate: 4,
    retirementAnnualSpending: 86000,
    retirementSpendingInflationAdjusted: true,
    socialSecurityEnabled: true,
    socialSecurityMonthlyBenefit: 2100,
    socialSecurityStartAge: 67,
    socialSecurityCola: 2.6,
    accounts: defaultAccounts
  },
  {
    id: "scenario-contrib",
    name: "Increase Contributions",
    color: brandColors.teal,
    enabled: true,
    currentAge: 45,
    retirementAge: 67,
    projectionEndAge: 95,
    inflationRate: 2.6,
    defaultAnnualReturn: 6.25,
    withdrawalRate: 4,
    retirementAnnualSpending: 86000,
    retirementSpendingInflationAdjusted: true,
    socialSecurityEnabled: true,
    socialSecurityMonthlyBenefit: 2100,
    socialSecurityStartAge: 67,
    socialSecurityCola: 2.6,
    accounts: defaultAccounts.map((account) => ({
      ...account,
      id: `${account.id}-contrib`,
      monthlyContribution: Math.round(account.monthlyContribution * 1.32)
    }))
  },
  {
    id: "scenario-later",
    name: "Retire Later",
    color: brandColors.lime,
    enabled: true,
    currentAge: 45,
    retirementAge: 70,
    projectionEndAge: 95,
    inflationRate: 2.6,
    defaultAnnualReturn: 6.25,
    withdrawalRate: 4,
    retirementAnnualSpending: 82000,
    retirementSpendingInflationAdjusted: true,
    socialSecurityEnabled: true,
    socialSecurityMonthlyBenefit: 2400,
    socialSecurityStartAge: 70,
    socialSecurityCola: 2.6,
    accounts: defaultAccounts.map((account) => ({
      ...account,
      id: `${account.id}-later`
    }))
  }
];

export function cloneDefaultScenarios(): Scenario[] {
  return defaultScenarios.map((scenario) => ({
    ...scenario,
    accounts: scenario.accounts.map((account) => ({ ...account }))
  }));
}
