import { citationEvidence, learningStats, lessons, sampleHistory } from "./data.js";

const liveLesson = lessons.find((lesson) => lesson.status === "live") || lessons[0];
const screen = document.querySelector("#screen");
const progressFill = document.querySelector("#progress-fill");
const progressSteps = [...document.querySelectorAll("[data-step]")];
const progressTitle = document.querySelector("#progress-title");
const progressCount = document.querySelector("#progress-count");
const railSteps = [...document.querySelectorAll("[data-rail-step]")];
const resetButton = document.querySelector("#reset-button");
const toast = document.querySelector("#toast");
const drawer = document.querySelector("#citation-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const drawerBody = document.querySelector("#citation-body");
const sessionStorageKey = "vlearn-fixfirst-session-v2";

function readSavedSession() {
  try {
    return JSON.parse(localStorage.getItem(sessionStorageKey) || "null");
  } catch {
    return null;
  }
}

const savedSession = readSavedSession();
let selectedLesson = lessons.find((lesson) => lesson.id === savedSession?.lessonId) || liveLesson;
let answer = selectedLesson.wrongAnswer;
let correction = "";
let explanation = "";
let diagnosisResult = null;
let diagnosisMeta = null;
let toastTimeout;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function saveSession(step, completed = false) {
  try {
    localStorage.setItem(sessionStorageKey, JSON.stringify({
      lessonId: selectedLesson.id,
      lastStep: step,
      completed,
      updatedAt: new Date().toISOString()
    }));
  } catch {
    // Local progress is an enhancement; the learning flow must still work if storage is blocked.
  }
}

function resetExercise() {
  answer = selectedLesson.wrongAnswer;
  correction = "";
  explanation = "";
  diagnosisResult = null;
  diagnosisMeta = null;
}

function syncLessonOverview() {
  const fields = {
    "lesson-symbol-label": selectedLesson.concept === "Tokenization" ? "AI" : selectedLesson.concept.slice(0, 2).toUpperCase(),
    "lesson-name": selectedLesson.concept,
    "lesson-description": selectedLesson.description,
    "lesson-duration": selectedLesson.duration,
    "lesson-difficulty": selectedLesson.difficulty
  };
  Object.entries(fields).forEach(([id, value]) => {
    const element = document.querySelector(`#${id}`);
    if (element) element.textContent = value;
  });
}

function setProgress(step) {
  const percentage = step === 0 ? 0 : Math.min(100, (step / 4) * 100);
  progressFill.style.width = `${percentage}%`;
  progressSteps.forEach((item) => item.classList.toggle("active", Number(item.dataset.step) <= step));
  const progressLabels = [
    ["Bắt đầu để khám phá", "0 / 4 bước"],
    ["Chẩn đoán giả định", "1 / 4 bước"],
    ["Gợi ý để tự sửa", "2 / 4 bước"],
    ["Giải thích bằng lời của bạn", "3 / 4 bước"],
    ["Đã hoàn tất vòng học", "4 / 4 bước"]
  ];
  const [title, count] = progressLabels[step] || progressLabels[0];
  if (progressTitle) progressTitle.textContent = title;
  if (progressCount) progressCount.textContent = count;
  const activeRailStep = Math.min(step, 3);
  railSteps.forEach((item) => {
    const railStep = Number(item.dataset.railStep);
    item.classList.toggle("active", step < 4 && railStep === activeRailStep);
    item.classList.toggle("done", step === 4 || railStep < activeRailStep);
  });
  saveSession(step, step === 4);
}

function render(html, step) {
  setProgress(step);
  screen.innerHTML = `<div class="screen-inner">${html}</div>`;
  screen.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => void handleAction(button.dataset.action, button.dataset));
  });
}

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

function closeCitationDrawer() {
  drawer?.classList.remove("open");
  drawer?.setAttribute("aria-hidden", "true");
  if (drawerBackdrop) drawerBackdrop.hidden = true;
}

function openCitationDrawer(citationId) {
  if (!drawer || !drawerBody) return;
  const citation = diagnosisResult?.citation?.id === citationId ? diagnosisResult.citation : null;
  const source = { ...(citationEvidence[citationId] || {}), ...(citation || {}) };
  drawerBody.innerHTML = `
    <div class="source-status"><span class="verified-icon">✓</span><div><strong>Verified source</strong><span>Citation nằm trong registry đã xác minh</span></div></div>
    <div class="source-id">${escapeHtml(citationId || "—")}</div>
    <h3>${escapeHtml(source.label || "Nguồn tham chiếu")}</h3>
    <p class="source-location">${escapeHtml(source.location || "Registry nội bộ · vị trí chưa công khai")}</p>
    ${source.evidence ? `<div class="source-quote"><span>Evidence</span><p>“${escapeHtml(source.evidence)}”</p></div>` : ""}
    <div class="source-note"><span>⌁</span><p>FixFirst chỉ dùng nguồn này để kiểm tra kết luận. Trace server không lưu câu trả lời thô của người học.</p></div>
  `;
  drawer.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  if (drawerBackdrop) drawerBackdrop.hidden = false;
}

async function handleAction(action, data = {}) {
  if (action === "start") {
    resetExercise();
    renderAttempt();
  }
  if (action === "select-lesson") {
    const lesson = lessons.find((item) => item.id === data.lessonId);
    if (!lesson) return;
    if (lesson.status !== "live") {
      showToast(`${lesson.concept} đang được chuẩn bị citation và bài tập.`);
      return;
    }
    selectedLesson = lesson;
    syncLessonOverview();
    resetExercise();
    renderStart();
  }
  if (action === "diagnose") {
    answer = document.querySelector("#attempt-answer")?.value.trim() || selectedLesson.wrongAnswer;
    await requestDiagnosis();
  }
  if (action === "self-correct") renderCorrection();
  if (action === "explain") {
    correction = document.querySelector("#correction-answer")?.value.trim() || "";
    if (!correction) return renderCorrection();
    renderExplainBack();
  }
  if (action === "complete") {
    explanation = document.querySelector("#explain-answer")?.value.trim() || "";
    if (!explanation) return renderExplainBack();
    renderComplete();
  }
  if (action === "review" && diagnosisResult) renderDiagnosis();
  if (action === "retry-diagnosis") renderAttempt();
  if (action === "use-correction-suggestion") {
    correction = selectedLesson.correctedAnswer;
    renderCorrection();
  }
  if (action === "use-explain-suggestion") {
    explanation = selectedLesson.explainBack;
    renderExplainBack();
  }
  if (action === "open-citation") openCitationDrawer(data.citationId);
}

async function requestDiagnosis() {
  renderLoading();
  try {
    const response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, question: selectedLesson.question, case_id: selectedLesson.id })
    });
    const payload = await response.json();
    if (!response.ok || !payload.result) throw new Error(payload.error || "AI chưa trả về chẩn đoán hợp lệ.");
    diagnosisResult = payload.result;
    diagnosisMeta = payload.meta || null;
    renderDiagnosis();
  } catch (error) {
    diagnosisMeta = null;
    renderAttemptError(error instanceof Error ? error.message : "Không thể kết nối AI lúc này.");
  }
}

function lessonCard(lesson) {
  const isLive = lesson.status === "live";
  return `<button class="lesson-card ${isLive ? "live" : "upcoming"}" type="button" data-action="${isLive ? "start" : "select-lesson"}" data-lesson-id="${escapeHtml(lesson.id)}">
    <span class="lesson-card-icon ${escapeHtml(lesson.accent)}">${lesson.concept === "Tokenization" ? "AI" : lesson.concept.slice(0, 2).toUpperCase()}</span>
    <span class="lesson-card-body"><span class="lesson-card-top"><span>${escapeHtml(lesson.module)}</span><em>${isLive ? "AI thật" : "Sắp mở"}</em></span><strong>${escapeHtml(lesson.concept)}</strong><span>${escapeHtml(lesson.description)}</span><span class="lesson-card-meta">${escapeHtml(lesson.duration)} <i>·</i> ${escapeHtml(lesson.exercises)}</span></span>
    <span class="lesson-card-arrow">${isLive ? "↗" : "⌁"}</span>
  </button>`;
}

function renderStart() {
  const history = sampleHistory.map((item) => `<div class="history-item"><span class="history-dot ${escapeHtml(item.tone)}"></span><div><strong>${escapeHtml(item.concept)}</strong><span>${escapeHtml(item.label)}</span></div><time>${escapeHtml(item.date)}</time></div>`).join("");
  const saved = readSavedSession();
  render(`
    <div class="screen-topline"><span class="phase-badge">Không gian học tập</span><span class="step-counter">${saved?.completed ? "Phiên gần nhất đã hoàn tất" : "Chọn một concept để bắt đầu"}</span></div>
    <div class="hero-layout"><div><p class="kicker">Làm bài trước khi học lý thuyết</p><h2>Đừng học thuộc lỗi của mình.</h2><p class="lead">FixFirst giúp bạn nhìn thấy giả định sai, nhận một gợi ý vừa đủ và tự giải thích lại bằng lời của mình.</p><div class="hero-proof"><span class="hero-proof-icon">✓</span><span>AI chỉ kết luận khi có nguồn đã xác minh</span></div></div><div class="hero-visual"><div class="token-orbit"><span>AI</span><span>20k</span><span>→</span><span>token</span></div></div></div>
    <div class="dashboard-section-heading"><div><span class="section-label">BẮT ĐẦU TỪ ĐÂY</span><strong>Chọn một bài học</strong></div><span class="section-helper">${lessons.filter((lesson) => lesson.status === "live").length} bài đang sẵn sàng</span></div>
    <div class="lesson-list">${lessons.map(lessonCard).join("")}</div>
    <div class="dashboard-lower"><div class="dashboard-stat-grid"><div><strong>${learningStats.completedLessons}</strong><span>Bài đã hoàn tất</span></div><div><strong>${learningStats.evalPassed}/${learningStats.evalTotal}</strong><span>Case AI đạt chuẩn</span></div></div><div class="history-preview"><div class="dashboard-section-heading"><div><span class="section-label">GẦN ĐÂY</span><strong>Lịch sử học tập</strong></div><span class="section-helper">Mock data</span></div>${history}</div></div>
  `, 0);
}

function renderAttempt() {
  render(`
    <div class="screen-topline"><span class="phase-badge">Bước 1 · Thử trả lời</span><span class="step-counter">1 câu hỏi · ${escapeHtml(selectedLesson.duration)}</span></div>
    <p class="kicker">Không cần hoàn hảo</p><h2>${escapeHtml(selectedLesson.question.split("?")[0])}?</h2><p class="lead">Hãy viết cách bạn đang hiểu. Không cần tra tài liệu trước — câu trả lời thật giúp AI tìm đúng điểm cần kiểm tra.</p>
    <div class="prompt-card"><span class="prompt-label">CÂU HỎI GỢI MỞ</span><strong>${escapeHtml(selectedLesson.question)}</strong></div>
    <label class="label" for="attempt-answer">Câu trả lời của bạn</label><textarea id="attempt-answer" placeholder="Viết điều bạn đang nghĩ…">${escapeHtml(answer)}</textarea><div class="input-footer"><span>Gợi ý: viết 1–3 câu</span><span>Không có đáp án sai ở bước này</span></div>
    <div class="actions"><button class="primary-button" type="button" data-action="diagnose">Nộp để xem chẩn đoán <span class="button-arrow">↗</span></button></div>
  `, 0);
}

function renderLoading() {
  render(`
    <div class="screen-topline"><span class="phase-badge">Bước 2 · Chẩn đoán</span><span class="step-counter">AI đang làm việc</span></div>
    <div class="loading-state"><div class="loading-visual"><span class="spinner" aria-hidden="true"></span></div><p class="kicker">Kiểm tra có căn cứ</p><h2>Đang tìm giả định cần kiểm tra.</h2><p class="lead">AI đang đối chiếu câu trả lời với citation registry. Kết quả chỉ hiển thị sau khi được kiểm tra.</p><div class="loading-timeline"><div class="loading-step active"><span>01</span><strong>Đọc câu trả lời</strong></div><div class="loading-step active"><span>02</span><strong>Đối chiếu nguồn</strong></div><div class="loading-step"><span>03</span><strong>Tạo gợi ý</strong></div></div></div>
  `, 1);
}

function renderAttemptError(message) {
  render(`
    <div class="screen-topline"><span class="phase-badge">Bước 1 · Thử trả lời</span><span class="step-counter">Có thể thử lại</span></div><p class="kicker">Chưa thể hoàn tất an toàn</p><h2>Giữ lại câu trả lời và thử lần nữa.</h2>
    <div class="alert error"><span class="alert-icon">!</span><div><strong>AI chưa trả kết quả có thể kiểm chứng.</strong><br />${escapeHtml(message)}</div></div>
    <label class="label" for="attempt-answer">Câu trả lời của bạn</label><textarea id="attempt-answer">${escapeHtml(answer)}</textarea><div class="actions"><button class="secondary-button" type="button" data-action="retry-diagnosis">Quay lại và thử lại <span class="button-arrow">↗</span></button></div>
  `, 0);
}

function citationMarkup(citation) {
  if (!citation) return `<div class="citation-card"><span class="citation-label">Giới hạn an toàn</span><p>AI chưa đủ căn cứ để kết luận. Hãy bổ sung câu trả lời hoặc nguồn phù hợp.</p></div>`;
  return `<div class="citation-card"><div class="citation-card-main"><span class="citation-label">Căn cứ đã xác minh</span><p><strong>${escapeHtml(citation.id)}</strong> · ${escapeHtml(citation.label)}<br />${escapeHtml(citation.location || "")}</p></div><button class="citation-trigger" type="button" data-action="open-citation" data-citation-id="${escapeHtml(citation.id)}">Xem evidence <span>↗</span></button></div>`;
}

function confidencePercent(confidence) {
  return { high: 88, medium: 64, low: 38 }[confidence] || 50;
}

function explainBackFeedback(text) {
  const normalized = text.toLowerCase();
  const criteria = [
    { label: "Nhận ra giả định ban đầu", pass: /sai|nhầm|đồng nhất|tưởng/.test(normalized) },
    { label: "Dùng đúng khái niệm token", pass: /token|tokenizer/.test(normalized) },
    { label: "Nêu được cách chia linh hoạt", pass: /từ|ký tự|kí tự|phần|ký hiệu|kí hiệu/.test(normalized) }
  ];
  return { criteria, score: criteria.filter((criterion) => criterion.pass).length };
}

function renderDiagnosis() {
  if (!diagnosisResult) return renderAttemptError("Chưa có chẩn đoán AI để hiển thị.");
  const isClarification = diagnosisResult.status === "needs_clarification";
  const attempts = diagnosisMeta?.providers_attempted || [];
  const fallbackNote = attempts.length > 1 ? ` · Đã fallback qua ${attempts.slice(0, -1).map((attempt) => escapeHtml(attempt.provider)).join(", ")}` : "";
  const confidence = escapeHtml(diagnosisResult.confidence);
  render(`
    <div class="screen-topline"><span class="phase-badge">Bước 2 · Chẩn đoán</span><span class="step-counter">Kết quả đã xác minh</span></div><p class="kicker">${isClarification ? "Cần thêm ngữ cảnh" : "Một giả định cần nhìn lại"}</p><h2>${isClarification ? "AI cần thêm thông tin trước khi kết luận" : "Đã tìm thấy một điểm đáng kiểm tra."}</h2>
    <div class="result-layout"><div><div class="alert ${isClarification ? "warning" : "success"}"><span class="alert-icon">${isClarification ? "!" : "✓"}</span><div><strong>${isClarification ? "Không đoán khi chưa đủ căn cứ." : "Không sao nếu câu trả lời chưa đúng."}</strong><br />${escapeHtml(diagnosisResult.diagnosis)}</div></div><div class="diagnosis-card"><p class="wrong">${isClarification ? "CẦN LÀM RÕ" : "GIẢ ĐỊNH CẦN SỬA"}</p><p>${escapeHtml(diagnosisResult.misconception)}</p></div>${citationMarkup(diagnosisResult.citation)}</div><div class="confidence-card"><span>Độ tin cậy</span><div class="confidence-score">${confidence}<small>confidence</small></div><div class="confidence-meter"><span style="width: ${confidencePercent(diagnosisResult.confidence)}%"></span></div><p>Server đã kiểm tra schema và citation trước khi hiển thị.</p></div></div>
    <div class="answer-echo"><span class="result-label">CÂU TRẢ LỜI ĐÃ GỬI</span><p>“${escapeHtml(answer)}”</p></div><p class="model-note">AI: ${escapeHtml(diagnosisMeta?.provider || "unknown")} · ${confidence}${fallbackNote}</p>
    <div class="actions">${isClarification ? `<button class="secondary-button" type="button" data-action="retry-diagnosis">Bổ sung câu trả lời <span class="button-arrow">↗</span></button>` : `<button class="primary-button" type="button" data-action="self-correct">Xem gợi ý và tự sửa <span class="button-arrow">↗</span></button>`}</div>
  `, 1);
}

function renderCorrection() {
  if (!diagnosisResult) return renderAttemptError("Chưa có chẩn đoán AI để tiếp tục.");
  render(`
    <div class="screen-topline"><span class="phase-badge">Bước 3 · Nhận gợi ý</span><span class="step-counter">Không đưa đáp án ngay</span></div><p class="kicker">Gợi ý vừa đủ</p><h2>Một hint nhỏ để bạn tự đi tiếp.</h2><div class="alert success"><span class="alert-icon">↗</span><div>${escapeHtml(diagnosisResult.hint)}</div></div>${citationMarkup(diagnosisResult.citation)}
    <details class="suggestion-card"><summary><span class="suggestion-label">Mắc kẹt? Mở câu tham khảo</span><span class="details-chevron">⌄</span></summary><p>${escapeHtml(selectedLesson.correctedAnswer)}</p><button class="secondary-button" type="button" data-action="use-correction-suggestion">Dùng câu tham khảo</button></details>
    <label class="label" for="correction-answer">Hãy viết lại câu trả lời</label><textarea id="correction-answer" placeholder="Tự viết câu trả lời đã sửa của bạn…">${escapeHtml(correction)}</textarea><p class="field-note">Câu tham khảo đang được ẩn để bạn có cơ hội tự sửa trước.</p><div class="actions"><button class="primary-button" type="button" data-action="explain">Gửi câu trả lời đã sửa <span class="button-arrow">↗</span></button></div>
  `, 2);
}

function renderExplainBack() {
  render(`
    <div class="screen-topline"><span class="phase-badge">Bước 4 · Tự sửa</span><span class="step-counter">Kiểm tra mức hiểu</span></div><p class="kicker">Nói lại bằng lời của bạn</p><h2>Vì sao câu trả lời ban đầu chưa đúng?</h2><p class="lead">Nếu giải thích được nguyên nhân, bạn đang kiểm tra mức hiểu — không chỉ đổi đáp án.</p><div class="summary-card"><strong>Câu trả lời đã sửa</strong><p>${escapeHtml(correction)}</p></div>
    <details class="suggestion-card"><summary><span class="suggestion-label">Cần một ví dụ tham khảo?</span><span class="details-chevron">⌄</span></summary><p>${escapeHtml(selectedLesson.explainBack)}</p><button class="secondary-button" type="button" data-action="use-explain-suggestion">Dùng câu tham khảo</button></details>
    <label class="label" for="explain-answer">Giải thích bằng lời của bạn</label><textarea id="explain-answer" placeholder="Tự giải thích vì sao mình sai…">${escapeHtml(explanation)}</textarea><p class="field-note">Viết ngắn gọn 1–3 câu. Hãy nhắc tới giả định đã được sửa.</p><div class="actions"><button class="primary-button" type="button" data-action="complete">Hoàn tất vòng học <span class="button-arrow">↗</span></button></div>
  `, 3);
}

function renderComplete() {
  const feedback = explainBackFeedback(explanation);
  const feedbackMarkup = feedback.criteria.map((criterion) => `<div class="feedback-item ${criterion.pass ? "pass" : "needs-work"}"><span>${criterion.pass ? "✓" : "·"}</span><strong>${criterion.label}</strong></div>`).join("");
  render(`
    <div class="screen-topline"><span class="phase-badge">Bước 5 · Hoàn tất</span><span class="step-counter">4 / 4 bước hoàn thành</span></div><div class="success-panel"><span class="success-check">✓</span><strong>Bạn đã đi hết vòng học từ lỗi.</strong><p>Kiến thức mới được tạo ra từ chính câu trả lời của bạn.</p></div><div class="feedback-card"><div class="feedback-card-heading"><div><span class="section-label">TỰ KIỂM TRA NỘI DUNG</span><strong>${feedback.score}/3 tiêu chí đã được nhắc tới</strong></div><span class="feedback-badge">Demo rubric</span></div><div class="feedback-list">${feedbackMarkup}</div><p>Đây là checklist minh bạch cho phiên demo, không phải điểm số cá nhân.</p></div><div class="two-column"><div class="summary-card"><strong>Giả định ban đầu</strong><p>${escapeHtml(answer)}</p></div><div class="summary-card"><strong>Điều đã hiểu lại</strong><p>${escapeHtml(explanation)}</p></div></div><div class="completion-note"><span>✦</span><div><strong>Gợi ý tiếp theo</strong><p>Thử quay lại sau để xem bạn còn giữ được cách giải thích này không.</p></div></div><div class="actions"><button class="secondary-button" type="button" data-action="review">Xem lại chẩn đoán</button><button class="primary-button" type="button" data-action="start">Làm bài khác <span class="button-arrow">↗</span></button></div>
  `, 4);
}

resetButton.addEventListener("click", () => {
  resetExercise();
  renderStart();
});

document.querySelector("#citation-close")?.addEventListener("click", closeCitationDrawer);
drawerBackdrop?.addEventListener("click", closeCitationDrawer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCitationDrawer();
});

syncLessonOverview();
renderStart();
