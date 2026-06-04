import { spawn } from "node:child_process";

const preview = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--configLoader", "runner", "--port", "4173"],
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
      const response = await fetch("http://127.0.0.1:4173/");
      if (response.ok) return;
    } catch {
      // Keep polling until preview is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Vite preview did not become ready on http://127.0.0.1:4173/");
}

function runPlaywright() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["node_modules/playwright/cli.js", "test", "--reporter=line"], {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

try {
  await waitForServer();
  const code = await runPlaywright();
  preview.kill();
  process.exit(code);
} catch (error) {
  console.error(error);
  preview.kill();
  process.exit(1);
}
