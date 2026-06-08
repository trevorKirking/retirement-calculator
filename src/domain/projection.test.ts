import { defaultScenarios } from "./defaults";
import { monthlyReturnFromAnnual, projectScenario, validateScenario } from "./projection";
import type { Scenario } from "./types";

function scenarioWith(patch: Partial<Scenario>): Scenario {
  return {
    ...defaultScenarios[0],
    ...patch,
    accounts: patch.accounts ?? defaultScenarios[0].accounts.map((account) => ({ ...account }))
  };
}

describe("projection engine", () => {
  it("converts annual return to monthly return", () => {
    expect(monthlyReturnFromAnnual(12)).toBeCloseTo(Math.pow(1.12, 1 / 12) - 1, 10);
  });

  it("detects depletion from high retirement spending", () => {
    const result = projectScenario(
      scenarioWith({
        currentAge: 64,
        retirementAge: 65,
        projectionEndAge: 80,
        retirementAnnualSpending: 360000,
        socialSecurityEnabled: false,
        accounts: [
          {
            ...defaultScenarios[0].accounts[0],
            currentBalance: 220000,
            monthlyContribution: 0,
            employerMatchEnabled: false
          }
        ]
      })
    );

    expect(result.summary.depletionAge).not.toBeNull();
    expect(result.summary.remainingBalanceAtEnd).toBe(0);
  });

  it("does not invest Social Security surplus", () => {
    const noSurplus = projectScenario(
      scenarioWith({
        currentAge: 66,
        retirementAge: 67,
        projectionEndAge: 70,
        retirementAnnualSpending: 12000,
        socialSecurityEnabled: true,
        socialSecurityMonthlyBenefit: 5000,
        socialSecurityStartAge: 67,
        accounts: [
          {
            ...defaultScenarios[0].accounts[0],
            currentBalance: 100000,
            monthlyContribution: 0,
            annualReturn: 0,
            employerMatchEnabled: false
          }
        ]
      })
    );

    const firstRetiredPoint = noSurplus.points.find((point) => point.age >= 68);
    expect(firstRetiredPoint?.portfolioWithdrawal).toBe(0);
    expect(firstRetiredPoint?.totalBalance).toBeCloseTo(100000, 0);
  });

  it("stops regular contributions after retirement age", () => {
    const result = projectScenario(
      scenarioWith({
        currentAge: 64,
        retirementAge: 65,
        projectionEndAge: 70,
        retirementAnnualSpending: 0,
        socialSecurityEnabled: false,
        accounts: [
          {
            ...defaultScenarios[0].accounts[0],
            currentBalance: 100000,
            monthlyContribution: 1000,
            annualReturn: 0,
            employerMatchEnabled: false
          }
        ]
      })
    );

    const retirementPoint = result.points.find((point) => point.age >= 65);
    const finalPoint = result.points[result.points.length - 1];

    expect(retirementPoint?.totalContributions).toBeGreaterThan(0);
    expect(finalPoint.totalContributions).toBe(retirementPoint?.totalContributions);
  });

  it("keeps withdrawal-rate income estimate separate from spending depletion", () => {
    const baseline = scenarioWith({
      currentAge: 64,
      retirementAge: 65,
      projectionEndAge: 67,
      retirementAnnualSpending: 60000,
      withdrawalRate: 3,
      socialSecurityEnabled: false,
      accounts: [
        {
          ...defaultScenarios[0].accounts[0],
          currentBalance: 120000,
          monthlyContribution: 0,
          annualReturn: 0,
          employerMatchEnabled: false
        }
      ]
    });
    const lowerRate = projectScenario(baseline);
    const higherRate = projectScenario({ ...baseline, withdrawalRate: 6 });

    expect(higherRate.summary.estimatedMonthlyIncome).toBeGreaterThan(lowerRate.summary.estimatedMonthlyIncome);
    expect(higherRate.summary.depletionAge).toBe(lowerRate.summary.depletionAge);
    expect(higherRate.summary.remainingBalanceAtEnd).toBe(lowerRate.summary.remainingBalanceAtEnd);
  });

  it("uses percent of current income for retirement spending when selected", () => {
    const result = projectScenario(
      scenarioWith({
        currentAge: 64,
        retirementAge: 65,
        projectionEndAge: 66,
        retirementAnnualSpending: 999999,
        retirementSpendingMode: "percentOfIncome",
        retirementSpendingPercentOfIncome: 50,
        retirementSpendingInflationAdjusted: false,
        socialSecurityEnabled: false,
        accounts: [
          {
            ...defaultScenarios[0].accounts[0],
            currentBalance: 100000,
            monthlyContribution: 0,
            annualReturn: 0,
            employerMatchEnabled: false
          }
        ]
      }),
      { currentAnnualIncome: 120000 }
    );

    const finalPoint = result.points[result.points.length - 1];

    expect(result.summary.annualSpending).toBe(60000);
    expect(finalPoint.annualSpending).toBeCloseTo(60000, 0);
  });

  it("calculates today's dollars below future dollars when inflation is positive", () => {
    const result = projectScenario(scenarioWith({ inflationRate: 3 }));
    const finalPoint = result.points[result.points.length - 1];

    expect(finalPoint.inflationAdjustedBalance).toBeLessThan(finalPoint.totalBalance);
  });

  it("validates impossible age ordering", () => {
    expect(validateScenario(scenarioWith({ currentAge: 70, retirementAge: 65 }))).toContain(
      "Current age must be less than retirement age."
    );
  });

  it("validates negative percent spending", () => {
    expect(
      validateScenario(
        scenarioWith({
          retirementSpendingMode: "percentOfIncome",
          retirementSpendingPercentOfIncome: -1
        })
      )
    ).toContain("Annual retirement spending percentage must be zero or greater.");
  });
});
