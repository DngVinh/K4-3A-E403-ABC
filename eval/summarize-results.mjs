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
const pendingReviews = report.records.filter((record) => record.reviewer_1 === "pending" || record.reviewer_2 === "pending");
if (pendingReviews.length === 0) {
  console.log("Reviewer thủ công: đã hoàn tất cho toàn bộ case trong artifact.");
} else {
  console.log(`Reviewer thủ công: còn ${pendingReviews.length} case chưa được hai reviewer xác nhận độc lập.`);
}
