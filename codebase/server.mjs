import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { appendFile, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const codebaseDir = path.join(rootDir, "codebase");
const evalDir = path.join(rootDir, "eval");
const port = Number(process.env.PORT || 3000);
const maxBodyBytes = 16_000;
const providerCooldownMs = Number(process.env.PROVIDER_COOLDOWN_MS || 60_000);
const traceFileName = path.basename(process.env.TRACE_FILE || "cp3-trace.jsonl");
const providerCooldowns = new Map();

class ProviderError extends Error {
  constructor(provider, status, message) {
    super(message);
    this.name = "ProviderError";
    this.provider = provider;
    this.status = status;
  }
}

class ProviderOutputError extends Error {
  constructor(provider, message) {
    super(message);
    this.name = "ProviderOutputError";
    this.provider = provider;
    this.status = 0;
  }
}

function loadDotEnv() {
  return readFile(path.join(rootDir, ".env"), "utf8")
    .then((contents) => {
      for (const rawLine of contents.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) continue;
        const separator = line.indexOf("=");
        if (separator < 1) continue;
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
        if (process.env[key] === undefined) process.env[key] = value;
      }
    })
    .catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
}

await loadDotEnv();

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function text(response, statusCode, payload, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, { "Content-Type": contentType, "Cache-Control": "no-store" });
  response.end(payload);
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new Error("Request is too large.");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Request must be valid JSON.");
  }
}

async function loadCitationRegistry() {
  const registryPath = path.join(evalDir, "citations.local.json");
  let parsed;
  try {
    parsed = JSON.parse(await readFile(registryPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error("Thiếu eval/citations.local.json. Hãy copy file example, rồi điền citation đã xác minh trước khi gọi AI.");
    }
    throw new Error("Không đọc được citation registry: " + error.message);
  }
  if (!Array.isArray(parsed.sources)) throw new Error("Citation registry phải có mảng sources.");
  const verified = parsed.sources.filter((source) => source?.status === "verified" && source.id && source.evidence);
  if (verified.length === 0) {
    throw new Error("Citation registry chưa có nguồn nào status=verified cùng evidence. Không gọi AI khi chưa có căn cứ.");
  }
  return verified;
}

function getProviderOrder() {
  const configured = process.env.AI_PROVIDER_ORDER || process.env.AI_PROVIDER || "deepseek";
  const order = configured.split(",").map((provider) => provider.trim().toLowerCase()).filter(Boolean);
  const supported = new Set(["deepseek", "openai", "gemini", "anthropic"]);
  if (order.some((provider) => !supported.has(provider))) {
    throw new Error("AI_PROVIDER_ORDER chỉ nhận deepseek, openai, gemini hoặc anthropic.");
  }
  return [...new Set(order)];
}

function getProviderConfig(provider) {
  const defaults = {
    deepseek: { key: process.env.DEEPSEEK_API_KEY, model: "deepseek-chat" },
    openai: { key: process.env.OPENAI_API_KEY, model: "gpt-4.1-mini" },
    gemini: { key: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY, model: "gemini-3.6-flash" },
    anthropic: { key: process.env.ANTHROPIC_API_KEY, model: "claude-sonnet-4-5" }
  };
  const providerPrefix = provider.toUpperCase();
  const configuredModel = (process.env[`${providerPrefix}_MODEL`] || "").trim();
  const legacyModel = (process.env.AI_MODEL || "").trim();
  const model = configuredModel || ((process.env.AI_PROVIDER || "").trim().toLowerCase() === provider ? legacyModel : "") || defaults[provider].model;
  const key = defaults[provider].key;
  return { provider, key, model };
}

function getProviderConfigs() {
  const order = getProviderOrder();
  const configs = order.map(getProviderConfig).filter((config) => Boolean(config.key));
  if (configs.length === 0) {
    throw new Error(`Không có API key khả dụng cho provider order: ${order.join(", ")}.`);
  }
  return configs;
}

function assertExternalContextApproval() {
  if ((process.env.ALLOW_EXTERNAL_AI_CONTEXT || "false").trim().toLowerCase() !== "true") {
    throw new Error("Chưa bật ALLOW_EXTERNAL_AI_CONTEXT=true trong .env. Rà soát citation registry trước khi gửi các mệnh đề đã chuẩn hoá tới provider ngoài.");
  }
}

function detectSafetyBoundary({ answer, question }) {
  const corpus = `${question}\n${answer}`.toLowerCase();
  if (/\bbitcoin\b|\bcrypto\b|giá .*ngày mai|chứng khoán|bệnh/.test(corpus)) {
    return "Nội dung nằm ngoài phạm vi Tokenization của bài học.";
  }
  if (/\b(?:bao nhiêu|số lượng|đúng|chính xác)\b.*\btoken\b|\btoken\b.*\b(?:bao nhiêu|số lượng|chính xác)\b|\b\d[\d.,]*\s*token\b/.test(corpus)) {
    return "Câu hỏi yêu cầu một con số cụ thể nhưng registry không có kết quả đếm cho model/tokenizer tương ứng.";
  }
  if (/tự đoán|đoán một câu|đỡ chờ|bỏ qua .*citation|đừng dùng citation|bịa .*citation|mã nguồn hệ thống/.test(corpus)) {
    return "Yêu cầu này muốn hệ thống đoán hoặc bỏ qua nguồn xác minh.";
  }
  const answerCorpus = answer.toLowerCase();
  const tokenizationCue = /\btoken(?:izer|ization)?\b|tách|chia|đơn vị|ký tự|kí tự|chuỗi|khoảng trắng|dấu câu/.test(answerCorpus);
  const clarificationRequest = /giải thích lại|nói rõ hơn|nói rõ thêm|khó hiểu|chưa hiểu|không hiểu|tóm tắt|dễ phân biệt|phân biệt|chưa theo kịp|ví dụ đơn giản/.test(corpus);
  const broadModelQuestion = /\bllm\b|mô hình ngôn ngữ|đặc điểm của mô hình/.test(corpus);
  const concreteClaim = /\b(?:là|luôn|không|chỉ|mỗi|gồm|được)\b|\b(?:tách|chia)\b.*\b(?:token|ký tự|từ|đơn vị)\b/.test(answerCorpus);
  const vagueQuestion = /kiểu nào ấy nhỉ|sai rồi phải không|chưa chắc|không chắc|phải không/.test(corpus);
  if ((clarificationRequest && !concreteClaim) || vagueQuestion || (!tokenizationCue && broadModelQuestion)) {
    return "Câu trả lời chưa nêu một giả định Tokenization cụ thể để chẩn đoán.";
  }
  if (!tokenizationCue && /tokenizer|tokenization/.test(question)) {
    return "Câu trả lời chưa nêu một giả định Tokenization cụ thể để chẩn đoán.";
  }
  return null;
}

function detectSensitiveInput({ answer, question }) {
  const corpus = `${question}\n${answer}`;
  if (/(?:-----BEGIN [^-]+ PRIVATE KEY-----|\b(?:api[_-]?key|password|mật khẩu|secret)\b\s*[:=]|\b(?:sk|ghp|github_pat|AIza)[-_][A-Za-z0-9_-]{12,})/i.test(corpus)) {
    return "Câu trả lời hoặc câu hỏi có vẻ chứa secret/API key.";
  }
  if (/(?<![A-Z0-9._%+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![A-Z0-9.-])/i.test(corpus)) {
    return "Câu trả lời hoặc câu hỏi chứa email cá nhân.";
  }
  if (/(?<!\d)(?:\+?84|0)(?:[\s.-]?\d){8,10}(?!\d)/.test(corpus)) {
    return "Câu trả lời hoặc câu hỏi chứa số điện thoại.";
  }
  return null;
}

function buildSafetyClarification(reason) {
  return {
    status: "needs_clarification",
    misconception: "Chưa thể xác định một giả định Tokenization cụ thể từ thông tin hiện có.",
    diagnosis: `${reason} Hãy thu hẹp câu hỏi về cách tokenizer chia văn bản hoặc cung cấp model cụ thể nếu cần kiểm tra bằng công cụ.`,
    hint: "Hãy viết lại câu hỏi sao cho chỉ cần đối chiếu với khái niệm Tokenization trong bài học.",
    confidence: "low",
    citation: null
  };
}

function buildPrivacyClarification(reason) {
  return {
    status: "needs_clarification",
    misconception: "Không thể gửi dữ liệu nhạy cảm tới provider ngoài.",
    diagnosis: `${reason} Hãy xóa dữ liệu cá nhân hoặc secret rồi thử lại.`,
    hint: "Chỉ gửi nội dung bài học cần chẩn đoán; không nhập email, số điện thoại, API key hoặc mật khẩu.",
    confidence: "low",
    citation: null
  };
}

function diagnosisSchemaExample() {
  return {
    status: "diagnosis",
    misconception: "Giả định cụ thể trong câu trả lời cần kiểm tra",
    diagnosis: "Giải thích ngắn, rõ, không kết luận vượt quá căn cứ",
    hint: "Một gợi ý để người học tự sửa; không nêu đáp án hoàn chỉnh",
    citation_id: "ID nguồn đúng nguyên văn từ registry",
    confidence: "high"
  };
}

function buildPrompts({ answer, question, sources }) {
  const sourceContext = sources.map((source) => ({
    id: source.id,
    label: source.label,
    location: source.location,
    evidence: source.evidence
  }));
  const system = [
    "Bạn là VLearn FixFirst, một trợ lý học tập theo nguyên tắc augment: AI gợi ý, người học tự sửa.",
    "Chỉ dùng các nguồn trong CITATION_REGISTRY. Không được bịa citation hoặc kiến thức ngoài registry.",
    "Nếu không thể chẩn đoán có căn cứ, trả JSON với status=needs_clarification, citation_id là chuỗi rỗng và một câu hỏi làm rõ ngắn trong diagnosis.",
    "Với status=diagnosis, citation_id bắt buộc khớp chính xác một ID trong registry. Hint không được đưa đáp án hoàn chỉnh.",
    "Trả về JSON thuần, không markdown, đúng các khóa: status, misconception, diagnosis, hint, citation_id, confidence.",
    `Ví dụ JSON: ${JSON.stringify(diagnosisSchemaExample())}`
  ].join("\n");
  const user = JSON.stringify({
    task: "Chẩn đoán giả định sai của học viên và đưa một hint ngắn có căn cứ.",
    question,
    learner_answer: answer,
    CITATION_REGISTRY: sourceContext
  });
  return { system, user };
}

function extractJson(content) {
  if (typeof content !== "string" || !content.trim()) throw new Error("Provider trả về nội dung rỗng.");
  const clean = content.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(clean);
  } catch {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(clean.slice(start, end + 1));
    throw new Error("Provider không trả JSON hợp lệ.");
  }
}

function validateDiagnosis(value, sources) {
  const allowedIds = new Set(sources.map((source) => source.id));
  const fields = ["status", "misconception", "diagnosis", "hint", "citation_id", "confidence"];
  if (!value || typeof value !== "object") throw new Error("Response AI phải là một object JSON.");
  for (const field of fields) {
    if (typeof value[field] !== "string") throw new Error(`Response AI thiếu trường ${field}.`);
  }
  if (!["diagnosis", "needs_clarification"].includes(value.status)) throw new Error("status AI không hợp lệ.");
  if (!["high", "medium", "low"].includes(value.confidence)) throw new Error("confidence AI không hợp lệ.");
  if (value.status === "diagnosis" && !allowedIds.has(value.citation_id)) {
    throw new Error("AI trả citation không nằm trong registry đã xác minh.");
  }
  if (value.status === "needs_clarification" && value.citation_id !== "") {
    throw new Error("Response needs_clarification không được gắn citation.");
  }
  for (const field of fields.slice(1)) {
    if (value[field].length > 1_200) throw new Error(`Trường ${field} dài bất thường.`);
  }
  const citation = sources.find((source) => source.id === value.citation_id);
  return {
    status: value.status,
    misconception: value.misconception.trim(),
    diagnosis: value.diagnosis.trim(),
    hint: value.hint.trim(),
    confidence: value.confidence,
    citation: citation ? { id: citation.id, label: citation.label, location: citation.location } : null
  };
}

async function fetchJson(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new ProviderError(options.provider || "unknown", 0, `Network error: ${error.message}`);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const providerMessage = body?.error?.message || body?.message || response.statusText;
    throw new ProviderError(options.provider || "unknown", response.status, `Provider trả lỗi ${response.status}: ${providerMessage}`);
  }
  return body;
}

async function callProvider(config, prompts) {
  if (config.provider === "deepseek" || config.provider === "openai") {
    const endpoint = config.provider === "deepseek"
      ? "https://api.deepseek.com/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const body = await fetchJson(endpoint, {
      provider: config.provider,
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.key}` },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "system", content: prompts.system }, { role: "user", content: prompts.user }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 700
      })
    });
    return { raw: body.choices?.[0]?.message?.content, requestId: body.id || null };
  }

  if (config.provider === "gemini") {
    const body = await fetchJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.key)}`,
      {
        provider: config.provider,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: prompts.system }] },
          contents: [{ role: "user", parts: [{ text: prompts.user }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 700, responseMimeType: "application/json" }
        })
      }
    );
    return { raw: body.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join(""), requestId: body.responseId || null };
  }

  const body = await fetchJson("https://api.anthropic.com/v1/messages", {
    provider: config.provider,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.key,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.model,
      system: prompts.system,
      messages: [{ role: "user", content: prompts.user }],
      max_tokens: 700,
      temperature: 0.2
    })
  });
  return { raw: body.content?.filter((part) => part.type === "text").map((part) => part.text).join(""), requestId: body.id || null };
}

function isFallbackError(error) {
  if (error instanceof ProviderOutputError) return true;
  if (error instanceof ProviderError) {
    return error.status === 0 || error.status === 404 || error.status === 429 || error.status >= 500 || /quota|rate.?limit|resource exhausted|too many requests|insufficient_quota/i.test(error.message);
  }
  return /quota|rate.?limit|resource exhausted|too many requests|insufficient_quota/i.test(error?.message || "");
}

function errorReason(error) {
  if (error instanceof ProviderOutputError) return "invalid_model_output";
  if (error instanceof ProviderError && (error.status === 429 || /quota|rate.?limit|resource exhausted|too many requests|insufficient_quota/i.test(error.message))) return "quota_or_rate_limit";
  if (error instanceof ProviderError && error.status === 404) return "provider_model_or_endpoint";
  if (error instanceof ProviderError && (error.status === 0 || error.status >= 500)) return "transient_provider_error";
  return "provider_error";
}

async function callWithFallback(configs, prompts, sources) {
  const attempts = [];
  let lastError = null;
  for (const config of configs) {
    const cooldownUntil = providerCooldowns.get(config.provider) || 0;
    if (cooldownUntil > Date.now()) {
      attempts.push({ provider: config.provider, outcome: "skipped", reason: "cooldown" });
      continue;
    }
    try {
      const completion = await callProvider(config, prompts);
      let result;
      try {
        result = validateDiagnosis(extractJson(completion.raw), sources);
      } catch (error) {
        throw new ProviderOutputError(config.provider, error.message);
      }
      attempts.push({ provider: config.provider, outcome: "success", reason: null });
      return { config, completion, result, attempts };
    } catch (error) {
      attempts.push({ provider: config.provider, outcome: "fallback", reason: errorReason(error), status: error.status || null });
      lastError = error;
      if (!isFallbackError(error)) throw error;
      providerCooldowns.set(config.provider, Date.now() + providerCooldownMs);
    }
  }
  throw new Error(lastError?.message || "Tất cả provider trong order đều đang tạm thời không khả dụng.");
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function traceCaseId(value) {
  return typeof value === "string" && value.trim() ? `case_${hash(value.trim())}` : "live-demo";
}

async function writeSanitizedTrace(record) {
  const trace = {
    timestamp: new Date().toISOString(),
    event: "diagnose",
    provider: record.provider,
    model: record.model,
    provider_attempts: record.attempts,
    case_id: record.caseId || "live-demo",
    input_sha256_16: hash(record.answer),
    request_id: record.requestId,
    latency_ms: record.latencyMs,
    status: record.result.status,
    confidence: record.result.confidence,
    citation_id: record.result.citation?.id || null,
    result_sha256_16: hash(JSON.stringify(record.result))
  };
  const runsDir = path.join(evalDir, "runs");
  await mkdir(runsDir, { recursive: true });
  await appendFile(path.join(runsDir, traceFileName), JSON.stringify(trace) + "\n", "utf8");
}

async function serveStatic(response, requestPath) {
  const requested = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const absolute = path.resolve(codebaseDir, requested);
  if (!absolute.startsWith(codebaseDir + path.sep)) return text(response, 403, "Forbidden");
  try {
    const fileInfo = await stat(absolute);
    if (!fileInfo.isFile()) return text(response, 404, "Not found");
    const file = await readFile(absolute);
    const type = absolute.endsWith(".html") ? "text/html; charset=utf-8"
      : absolute.endsWith(".js") ? "text/javascript; charset=utf-8"
      : absolute.endsWith(".css") ? "text/css; charset=utf-8"
      : "application/octet-stream";
    text(response, 200, file, type);
  } catch {
    text(response, 404, "Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  if (request.method === "GET" && url.pathname === "/api/health") {
    const order = getProviderOrder();
    const available = order.filter((provider) => Boolean(getProviderConfig(provider).key));
    return json(response, 200, { ok: true, provider_order: order, available_providers: available, ai_ready: available.length > 0 });
  }
  if (request.method === "POST" && url.pathname === "/api/diagnose") {
    const startedAt = Date.now();
    try {
      const body = await readJsonBody(request);
      const answer = typeof body.answer === "string" ? body.answer.trim() : "";
      const question = typeof body.question === "string" ? body.question.trim() : "";
      if (answer.length < 4 || answer.length > 4_000) throw new Error("Câu trả lời cần từ 4 đến 4.000 ký tự.");
      if (!question || question.length > 1_000) throw new Error("Câu hỏi không hợp lệ.");
      const sensitiveInput = detectSensitiveInput({ answer, question });
      if (sensitiveInput) {
        const result = buildPrivacyClarification(sensitiveInput);
        const attempts = [{ provider: "privacy-router", outcome: "blocked", reason: "sensitive_input" }];
        await writeSanitizedTrace({
          provider: "privacy-router",
          model: "deterministic-privacy-guard-v1",
          caseId: traceCaseId(body.case_id),
          answer,
          requestId: null,
          latencyMs: Date.now() - startedAt,
          result,
          attempts
        });
        return json(response, 200, { result, meta: { provider: "privacy-router", model: "deterministic-privacy-guard-v1", providers_attempted: attempts, latency_ms: Date.now() - startedAt } });
      }
      const sources = await loadCitationRegistry();
      const safetyBoundary = detectSafetyBoundary({ answer, question });
      if (safetyBoundary) {
        const result = buildSafetyClarification(safetyBoundary);
        const attempts = [{ provider: "safety-router", outcome: "blocked", reason: "needs_clarification" }];
        await writeSanitizedTrace({
          provider: "safety-router",
          model: "deterministic-guard-v1",
          caseId: traceCaseId(body.case_id),
          answer,
          requestId: null,
          latencyMs: Date.now() - startedAt,
          result,
          attempts
        });
        return json(response, 200, { result, meta: { provider: "safety-router", model: "deterministic-guard-v1", providers_attempted: attempts, latency_ms: Date.now() - startedAt } });
      }
      assertExternalContextApproval();
      const configs = getProviderConfigs();
      const call = await callWithFallback(configs, buildPrompts({ answer, question, sources }), sources);
      const { config, completion, result, attempts } = call;
      await writeSanitizedTrace({
        provider: config.provider,
        model: config.model,
        caseId: traceCaseId(body.case_id),
        answer,
        requestId: completion.requestId,
        latencyMs: Date.now() - startedAt,
        result,
        attempts
      });
      return json(response, 200, { result, meta: { provider: config.provider, model: config.model, providers_attempted: attempts, latency_ms: Date.now() - startedAt } });
    } catch (error) {
      return json(response, 400, { error: error.message || "Không thể chẩn đoán lúc này." });
    }
  }
  if (request.method === "GET") return serveStatic(response, decodeURIComponent(url.pathname));
  return text(response, 405, "Method not allowed");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`FixFirst CP3 chạy tại http://localhost:${port}`);
});
