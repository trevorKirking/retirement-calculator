import { expect, test } from "@playwright/test";

test("advisor can view dashboard, change mode, duplicate scenario, and verify print summary", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("img", { name: "Innovest" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /retirement projection/i })).toBeVisible();
  await expect(page.getByRole("region", { name: "Projection chart" })).toBeVisible();

  await page.getByRole("button", { name: "Today's dollars" }).click();
  await expect(page.getByText("Today's dollars").first()).toBeVisible();

  await page.getByRole("button", { name: "Percent" }).click();
  await expect(page.getByLabel(/Annual spending \(% of current income\)/i)).toHaveValue("60.5634");

  await page.getByRole("button", { name: "Duplicate selected scenario" }).click();
  await expect(page.getByLabel("Scenario name")).toHaveValue(/Copy/);

  await page.emulateMedia({ media: "print" });
  await expect(page.getByLabel("Print summary")).toBeVisible();
  await expect(page.getByText("Retirement Projection Summary")).toBeVisible();
  await expect(page.getByText("This projection is for informational purposes only")).toBeVisible();
  await expect(page.getByLabel("Printable projection chart")).toBeVisible();
});

test("mobile viewport has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
