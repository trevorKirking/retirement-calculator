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
});
