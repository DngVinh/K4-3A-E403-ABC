import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = process.env.EVAL_INPUT || path.join(rootDir, "eval", "results", "cp3-results.json");
const report = JSON.parse(await readFile(reportPath, "utf8"));
const failures = report.records.filter((record) => !record.pass);
console.log(`Kết quả tự động: ${report.metric.passed}/${report.metric.total} (${report.metric.percent}%).`);
console.log(`Case fail: ${failures.map((record) => record.id).join(", ") || "không có"}.`);
if (report.metric.latency_ms) console.log(`Latency median/p95: ${report.metric.latency_ms.median}/${report.metric.latency_ms.p95} ms.`);
if (report.metric.fallback_percent !== undefined) console.log(`Fallback provider: ${report.metric.fallback_cases}/${report.metric.total} case (${report.metric.fallback_percent}%).`);
console.log("Còn cần hai người chấm độc lập các case khó ở reviewer_1 và reviewer_2 trước khi chốt số đo.");
