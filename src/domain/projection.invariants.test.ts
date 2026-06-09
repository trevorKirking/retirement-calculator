import fc from "fast-check";
import { defaultScenarios } from "./defaults";
import { projectScenario, validateScenario } from "./projection";
import type { Account, Scenario } from "./types";

const FUZZ_OPTIONS = { numRuns: 250, seed: 20260609 };

function cloneDefaultAccount(patch: Partial<Account> = {}): Account {
  return {
    ...defaultScenarios[0].accounts[0],
    ...patch
  };
}

function scenarioWith(patch: Partial<Scenario>): Scenario {
  return {
    ...defaultScenarios[0],
    ...patch,
    accounts: patch.accounts ?? defaultScenarios[0].accounts.map((account) => ({ ...account }))
  };
}

function expectFiniteNonNegative(value: number) {
  expect(Number.isFinite(value)).toBe(true);
  expect(value).toBeGreaterThanOrEqual(0);
}

const rate = (min: number, max: number) => fc.integer({ min: min * 100, max: max * 100 }).map((value) => value / 100);

const accountArbitrary: fc.Arbitrary<Account> = fc
  .record({
    currentBalance: fc.integer({ min: 0, max: 2_000_000 }),
    monthlyContribution: fc.integer({ min: 0, max: 8_000 }),
    annualContributionIncrease: rate(0, 8),
    annualReturn: rate(0, 12),
    employerMatchEnabled: fc.boolean(),
    employerMatchPercent: fc.integer({ min: 0, max: 200 }),
    employerMatchCap: fc.integer({ min: 0, max: 2_000 })
  })
  .map((account) =>
    cloneDefaultAccount({
      id: "acct-fuzz",
      name: "Fuzz account",
      ...account
    })
  );

const validScenarioArbitrary = fc
  .record({
    currentAge: fc.integer({ min: 25, max: 70 }),
    yearsUntilRetirement: fc.integer({ min: 1, max: 25 }),
    retirementYears: fc.integer({ min: 1, max: 35 }),
    inflationRate: rate(0, 8),
    withdrawalRate: rate(0, 10),
    retirementAnnualSpending: fc.integer({ min: 0, max: 240_000 }),
    retirementSpendingInflationAdjusted: fc.boolean(),
    socialSecurityEnabled: fc.boolean(),
    socialSecurityMonthlyBenefit: fc.integer({ min: 0, max: 8_000 }),
    socialSecurityStartAge: fc.integer({ min: 62, max: 75 }),
    socialSecurityCola: rate(0, 6),
    accounts: fc.array(accountArbitrary, { minLength: 1, maxLength: 3 })
  })
  .map(({ yearsUntilRetirement, retirementYears, ...values }) =>
    scenarioWith({
      ...values,
      retirementAge: values.currentAge + yearsUntilRetirement,
      projectionEndAge: values.currentAge + yearsUntilRetirement + retirementYears,
      retirementSpendingMode: "dollars"
    })
  );

describe("projection invariants", () => {
  it.each([
    [64, 65],
    [64.5, 65],
    [64, 65.5]
  ])("keeps drawdown separate from retirement balance for age %s to %s", (currentAge, retirementAge) => {
    const baseline = scenarioWith({
      currentAge,
      retirementAge,
      projectionEndAge: retirementAge + 2,
      retirementAnnualSpending: 0,
      socialSecurityEnabled: false,
      accounts: [
        cloneDefaultAccount({
          currentBalance: 100_000,
          monthlyContribution: 0,
          annualReturn: 0,
          employerMatchEnabled: false
        })
      ]
    });
    const noDrawdown = projectScenario(baseline);
    const highDrawdown = projectScenario({ ...baseline, retirementAnnualSpending: 60_000 });

    expect(highDrawdown.summary.retirementBalance).toBeCloseTo(noDrawdown.summary.retirementBalance, 4);
    expect(highDrawdown.summary.remainingBalanceAtEnd).toBeLessThan(noDrawdown.summary.remainingBalanceAtEnd);
  });

  it("keeps dollar and percent spending modes equivalent when effective spending matches", () => {
    fc.assert(
      fc.property(
        validScenarioArbitrary,
        fc.integer({ min: 1, max: 300_000 }),
        fc.integer({ min: 0, max: 100 }),
        (scenario, currentAnnualIncome, spendingPercent) => {
          const effectiveAnnualSpending = currentAnnualIncome * (spendingPercent / 100);
          const dollarResult = projectScenario(
            {
              ...scenario,
              retirementSpendingMode: "dollars",
              retirementAnnualSpending: effectiveAnnualSpending
            },
            { currentAnnualIncome }
          );
          const percentResult = projectScenario(
            {
              ...scenario,
              retirementSpendingMode: "percentOfIncome",
              retirementSpendingPercentOfIncome: spendingPercent
            },
            { currentAnnualIncome }
          );

          expect(percentResult.summary.annualSpending).toBeCloseTo(dollarResult.summary.annualSpending, 6);
          expect(percentResult.summary.retirementBalance).toBeCloseTo(dollarResult.summary.retirementBalance, 4);
          expect(percentResult.summary.remainingBalanceAtEnd).toBeCloseTo(
            dollarResult.summary.remainingBalanceAtEnd,
            4
          );
          expect(percentResult.summary.depletionAge).toBe(dollarResult.summary.depletionAge);
        }
      ),
      FUZZ_OPTIONS
    );
  });

  it("keeps withdrawal-rate income estimate separate from depletion math", () => {
    fc.assert(
      fc.property(validScenarioArbitrary, (scenario) => {
        const lowerRate = projectScenario({ ...scenario, withdrawalRate: 3 });
        const higherRate = projectScenario({ ...scenario, withdrawalRate: 8 });

        expect(higherRate.summary.remainingBalanceAtEnd).toBeCloseTo(lowerRate.summary.remainingBalanceAtEnd, 4);
        expect(higherRate.summary.depletionAge).toBe(lowerRate.summary.depletionAge);
        expect(higherRate.summary.estimatedMonthlyIncome).toBeGreaterThanOrEqual(
          lowerRate.summary.estimatedMonthlyIncome
        );
      }),
      FUZZ_OPTIONS
    );
  });

  it("does not invest Social Security surplus back into the portfolio", () => {
    const result = projectScenario(
      scenarioWith({
        currentAge: 66,
        retirementAge: 67,
        projectionEndAge: 70,
        retirementAnnualSpending: 12_000,
        socialSecurityEnabled: true,
        socialSecurityMonthlyBenefit: 5_000,
        socialSecurityStartAge: 67,
        accounts: [
          cloneDefaultAccount({
            currentBalance: 100_000,
            monthlyContribution: 0,
            annualReturn: 0,
            employerMatchEnabled: false
          })
        ]
      })
    );

    const finalPoint = result.points[result.points.length - 1];
    expect(finalPoint.totalBalance).toBeCloseTo(100_000, 0);
    expect(finalPoint.portfolioWithdrawal).toBe(0);
  });

  it("keeps valid generated projections finite, non-negative, and age ordered", () => {
    fc.assert(
      fc.property(validScenarioArbitrary, fc.integer({ min: 0, max: 300_000 }), (scenario, currentAnnualIncome) => {
        expect(validateScenario(scenario)).toEqual([]);

        const result = projectScenario(scenario, { currentAnnualIncome });
        let previousAge = -Infinity;

        for (const point of result.points) {
          expect(point.age).toBeGreaterThanOrEqual(previousAge);
          expect(point.age).toBeGreaterThanOrEqual(scenario.currentAge);
          expect(point.age).toBeLessThanOrEqual(scenario.projectionEndAge);
          expectFiniteNonNegative(point.totalBalance);
          expectFiniteNonNegative(point.inflationAdjustedBalance);
          expectFiniteNonNegative(point.totalContributions);
          expectFiniteNonNegative(point.investmentGrowth);
          expectFiniteNonNegative(point.estimatedMonthlyIncome);
          expectFiniteNonNegative(point.annualSpending);
          expectFiniteNonNegative(point.portfolioWithdrawal);
          expectFiniteNonNegative(point.socialSecurityIncome);
          previousAge = point.age;
        }

        expectFiniteNonNegative(result.summary.retirementBalance);
        expectFiniteNonNegative(result.summary.retirementBalanceToday);
        expectFiniteNonNegative(result.summary.totalContributionsAtRetirement);
        expectFiniteNonNegative(result.summary.investmentGrowthAtRetirement);
        expectFiniteNonNegative(result.summary.estimatedMonthlyIncome);
        expectFiniteNonNegative(result.summary.annualSpending);
        expectFiniteNonNegative(result.summary.yearsFunded);
        expectFiniteNonNegative(result.summary.remainingBalanceAtEnd);
      }),
      FUZZ_OPTIONS
    );
  });

  it("stops contributions after the retirement boundary", () => {
    fc.assert(
      fc.property(validScenarioArbitrary, (scenario) => {
        const result = projectScenario(scenario);
        const retirementPoint = result.points.find((point) => point.age >= scenario.retirementAge);
        const finalPoint = result.points[result.points.length - 1];

        expect(retirementPoint).toBeDefined();
        expect(finalPoint.totalContributions).toBeCloseTo(retirementPoint?.totalContributions ?? 0, 4);
      }),
      FUZZ_OPTIONS
    );
  });
});
