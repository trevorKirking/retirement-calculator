import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Retirement dashboard app", () => {
  function remainingAtEndValue() {
    return screen.getAllByText("Remaining at end")[0].parentElement?.querySelector("strong");
  }

  it("renders Innovest branding and core dashboard surfaces", () => {
    render(<App />);

    expect(screen.getAllByLabelText("Innovest")[0]).toBeInTheDocument();
    expect(screen.getAllByText(/version 2/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: /retirement projection/i })[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/projection chart/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /print summary/i })[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Base Case/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Increase Contributions/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Retire Later/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText("Retirement cash flow controls")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Annual spending input mode" })).toBeInTheDocument();
    expect(screen.getAllByText(/withdrawal-rate income/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/contributions stop at age 67/i)).toBeInTheDocument();
  });

  it("updates mode and scenario labels from user interaction", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /today's dollars/i }));
    expect(screen.getAllByText("Today's dollars")[0]).toBeInTheDocument();

    const scenarioName = screen.getByLabelText("Scenario name");
    await user.clear(scenarioName);
    await user.type(scenarioName, "Client Conservative Case");
    expect(screen.getAllByText("Client Conservative Case")[0]).toBeInTheDocument();
  });

  it("switches annual spending between dollar and percent entry", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Percent" }));

    expect(await screen.findByLabelText(/Annual spending \(% of current income\)/i)).toHaveValue(60.5634);
    expect(screen.getByText(/effective \$86,000 per year/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dollars" }));

    expect(screen.getByLabelText(/Annual spending drawdown/i)).toHaveValue(86000);
  });

  it("applies annual return to account inputs and projection results", async () => {
    const user = userEvent.setup();
    render(<App />);

    const allAccountAnnualReturn = screen.getByLabelText(/Apply annual return to accounts/i);
    const accountAnnualReturns = screen.getAllByLabelText(/^Annual return/i);
    const initialRemainingAtEnd = remainingAtEndValue()?.textContent;

    await user.clear(allAccountAnnualReturn);
    await user.type(allAccountAnnualReturn, "9");

    expect(allAccountAnnualReturn).toHaveValue(9);
    for (const accountAnnualReturn of accountAnnualReturns) {
      expect(accountAnnualReturn).toHaveValue(9);
    }
    expect(remainingAtEndValue()).not.toHaveTextContent(initialRemainingAtEnd ?? "");
  });

  it("shows validation feedback for invalid ages", async () => {
    const user = userEvent.setup();
    render(<App />);

    const currentAge = screen.getByLabelText("Current age");
    await user.clear(currentAge);
    await user.type(currentAge, "70");

    expect(screen.getByRole("alert")).toHaveTextContent("Current age must be less than retirement age.");
  });

  it("shows an empty chart state when all scenarios are hidden", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /hide base case/i }));
    await user.click(screen.getByRole("button", { name: /hide increase contributions/i }));
    await user.click(screen.getByRole("button", { name: /hide retire later/i }));

    expect(screen.getAllByText("No enabled scenarios selected.")).toHaveLength(2);
    expect(screen.getByText("Enable a scenario")).toBeInTheDocument();
  });
});
