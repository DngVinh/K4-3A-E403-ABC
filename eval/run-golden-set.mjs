import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const endpoint = process.env.EVAL_ENDPOINT || "http://localhost:3000/api/diagnose";
const outputPath = process.env.EVAL_OUTPUT || path.join(rootDir, "eval", "results", "cp3-results.json");
const question = "Theo bạn, tokenizer xử lý chuỗi “AI20k” như thế nào? Hãy giải thích ngắn gọn.";
const goldenSet = JSON.parse(await readFile(path.join(rootDir, "eval", "golden-set.json"), "utf8"));
const records = [];

for (const testCase of goldenSet.cases) {
  const startedAt = Date.now();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: testCase.answer, question, case_id: testCase.id })
    });
    const body = await response.json();
    const actual = body.result?.status || "error";
    records.push({
      id: testCase.id,
      category: testCase.category,
      expected: testCase.expected,
      actual,
      pass: actual === testCase.expected,
      citation_id: body.result?.citation?.id || null,
      citation_valid: body.result?.status === "needs_clarification" ? body.result?.citation === null : Boolean(body.result?.citation?.id),
      provider: body.meta?.provider || null,
      providers_attempted: body.meta?.providers_attempted || [],
      latency_ms: Date.now() - startedAt,
      reviewer_1: "pending",
      reviewer_2: "pending",
      notes: body.error || ""
    });
  } catch (error) {
    records.push({
      id: testCase.id,
      category: testCase.category,
      expected: testCase.expected,
      actual: "error",
      pass: false,
      citation_id: null,
      citation_valid: false,
      provider: null,
      providers_attempted: [],
      latency_ms: Date.now() - startedAt,
      reviewer_1: "pending",
      reviewer_2: "pending",
      notes: error.message
    });
  }
}

const passed = records.filter((record) => record.pass).length;
const latencies = records.map((record) => record.latency_ms).sort((a, b) => a - b);
const percentile = (values, percentileValue) => values.length === 0 ? null : values[Math.min(values.length - 1, Math.ceil(values.length * percentileValue) - 1)];
const categoryStats = Object.fromEntries([...new Set(records.map((record) => record.category))].map((category) => {
  const scoped = records.filter((record) => record.category === category);
  return [category, { passed: scoped.filter((record) => record.pass).length, total: scoped.length }];
}));
const fallbackCases = records.filter((record) => record.providers_attempted.length > 1 || record.providers_attempted.some((attempt) => attempt.outcome === "fallback")).length;
const output = {
  generated_at: new Date().toISOString(),
  endpoint,
  metric: {
    passed,
    total: records.length,
    percent: Number(((passed / records.length) * 100).toFixed(1)),
    category_stats: categoryStats,
    citation_valid_percent: Number(((records.filter((record) => record.citation_valid).length / records.length) * 100).toFixed(1)),
    fallback_cases: fallbackCases,
    fallback_percent: Number(((fallbackCases / records.length) * 100).toFixed(1)),
    latency_ms: { median: percentile(latencies, 0.5), p95: percentile(latencies, 0.95) }
  },
  records
};
const resultsDir = path.join(rootDir, "eval", "results");
await mkdir(resultsDir, { recursive: true });
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(`Golden-set eval: ${passed}/${records.length} (${output.metric.percent}%). Báo cáo: ${outputPath}`);
