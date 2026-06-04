import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const outputDir = "test-results/browser-smoke";
await mkdir(outputDir, { recursive: true });

const preview = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--configLoader", "runner", "--port", "4174"],
  {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env
  }
);

preview.stdout.on("data", (chunk) => process.stdout.write(`[preview] ${chunk}`));
preview.stderr.on("data", (chunk) => process.stderr.write(`[preview] ${chunk}`));

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch("http://127.0.0.1:4174/");
      if (response.ok) return;
    } catch {
      // Continue polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Vite preview did not become ready on http://127.0.0.1:4174/");
}

try {
  await waitForServer();
  const browser = await chromium.launch({ channel: "chrome" });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await desktop.goto("http://127.0.0.1:4174/");
  await desktop.screenshot({ path: `${outputDir}/desktop.png`, fullPage: true });
  const desktopText = await desktop.getByRole("heading", { name: /retirement projection/i }).textContent();
  if (!desktopText) throw new Error("Desktop smoke failed: heading not rendered.");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await mobile.goto("http://127.0.0.1:4174/");
  const hasOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  if (hasOverflow) throw new Error("Mobile smoke failed: horizontal overflow detected.");
  await mobile.screenshot({ path: `${outputDir}/mobile.png`, fullPage: true });

  const print = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  await print.goto("http://127.0.0.1:4174/");
  await print.emulateMedia({ media: "print" });
  await print.screenshot({ path: `${outputDir}/print.png`, fullPage: true });
  const disclaimerVisible = await print.getByText("This projection is for informational purposes only").isVisible();
  if (!disclaimerVisible) throw new Error("Print smoke failed: disclaimer not visible.");

  await browser.close();
  preview.kill();
  console.log(`Browser smoke passed. Screenshots saved to ${outputDir}.`);
} catch (error) {
  preview.kill();
  console.error(error);
  process.exit(1);
}
