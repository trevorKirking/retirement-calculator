import fs from "node:fs";

const app = fs.readFileSync("src/App.tsx", "utf8");
const styles = fs.readFileSync("src/styles.css", "utf8");

const checks = [
  ["print summary component", app.includes("print-summary")],
  ["projection disclaimer", app.includes("This projection is for informational purposes only")],
  ["Innovest print brand", app.includes("INNOVEST") && app.includes("Retirement Projection Summary")],
  ["print media CSS", styles.includes("@media print")],
  ["screen controls hidden for print", styles.includes(".app-shell") && styles.includes(".print-summary")]
];

const failed = checks.filter(([, ok]) => !ok);

if (failed.length > 0) {
  console.error("Print verification failed:");
  for (const [name] of failed) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log("Print verification passed.");
