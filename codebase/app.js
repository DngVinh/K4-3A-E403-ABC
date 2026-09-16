const fixture = {
  concept: "Tokenization",
  lesson: "AI & LLM Foundation · fixture CP2",
  question: "Theo bạn, tokenizer xử lý chuỗi “AI20k” như thế nào? Hãy giải thích ngắn gọn.",
  wrongAnswer: "Tokenizer luôn tách văn bản thành từng ký tự riêng lẻ.",
  diagnosis: "Bạn đang giả định tokenizer luôn tách theo từng ký tự. Đây là điểm cần kiểm tra lại: tokenizer chia văn bản thành các token theo cách biểu diễn của mô hình, không nhất thiết là từng ký tự.",
  hint: "Hãy thử nghĩ về token như những mảnh văn bản thường xuất hiện cùng nhau, thay vì mặc định mỗi ký tự là một token.",
  citation: "Citation mẫu cho CP2: transcript/slide về Tokenization · sẽ thay bằng mã đoạn [Txx-NNN] đã xác minh ở CP3.",
  correctedAnswer: "Tokenizer chia văn bản thành các token; một token có thể là một từ, một phần của từ hoặc ký hiệu, nên không nhất thiết bằng một ký tự.",
  explainBack: "Mình sai vì đã đồng nhất token với ký tự. Tokenizer có thể gom thành từ hoặc các phần của từ tùy cách nó được xây dựng."
};

const screen = document.querySelector("#screen");
const progressFill = document.querySelector("#progress-fill");
const progressSteps = [...document.querySelectorAll("[data-step]")];
const resetButton = document.querySelector("#reset-button");

let currentStep = 0;
let answer = fixture.wrongAnswer;
let correction = fixture.correctedAnswer;
let explanation = fixture.explainBack;

function setProgress(step) {
  currentStep = step;
  const percentage = step === 0 ? 0 : Math.min(100, (step / 4) * 100);
  progressFill.style.width = `${percentage}%`;
  progressSteps.forEach((item) => item.classList.toggle("active", Number(item.dataset.step) <= step));
}

function render(html, step) {
  setProgress(step);
  screen.innerHTML = `<div class="screen-inner">${html}</div>`;
  screen.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });
}

function handleAction(action) {
  if (action === "start") renderAttempt();
  if (action === "diagnose") {
    answer = document.querySelector("#attempt-answer")?.value.trim() || fixture.wrongAnswer;
    renderDiagnosis();
  }
  if (action === "self-correct") renderCorrection();
  if (action === "explain") {
    correction = document.querySelector("#correction-answer")?.value.trim() || fixture.correctedAnswer;
    renderExplainBack();
  }
  if (action === "complete") {
    explanation = document.querySelector("#explain-answer")?.value.trim() || fixture.explainBack;
    renderComplete();
  }
  if (action === "review") renderDiagnosis();
}

function renderStart() {
  render(`
    <p class="kicker">Làm bài trước khi học lý thuyết</p>
    <h2>Hãy thử giải trước. Sau đó mới tìm ra chỗ mình đang hiểu sai.</h2>
    <p class="lead">FixFirst không đưa ngay đáp án. Prototype này mô phỏng cách AI chỉ ra giả định sai, đưa một gợi ý có căn cứ và để bạn tự sửa.</p>
    <div class="concept-card">
      <strong>${fixture.concept}</strong>
      <span>${fixture.lesson}</span>
      <div class="meta"><span>1 bài tập</span><span>Khoảng 3 phút</span><span>Không tính điểm</span></div>
    </div>
    <div class="actions"><button class="primary-button" type="button" data-action="start">Bắt đầu làm bài</button></div>
  `, 0);
}

function renderAttempt() {
  render(`
    <p class="kicker">Bước 1 · Attempt</p>
    <h2>Tokenizer xử lý “AI20k” như thế nào?</h2>
    <p class="lead">Hãy viết cách bạn đang hiểu. Không cần tra tài liệu trước.</p>
    <div class="prompt-card"><strong>${fixture.question}</strong></div>
    <label class="label" for="attempt-answer">Câu trả lời của bạn</label>
    <textarea id="attempt-answer">${answer}</textarea>
    <div class="actions"><button class="primary-button" type="button" data-action="diagnose">Nộp để xem chẩn đoán</button></div>
  `, 0);
}

function renderDiagnosis() {
  render(`
    <p class="kicker">Bước 2 · Diagnose</p>
    <h2>Đã tìm thấy một giả định cần kiểm tra</h2>
    <div class="alert warning"><span class="alert-icon">!</span><div><strong>Không sao nếu câu trả lời chưa đúng.</strong><br />Mục tiêu là nhìn thấy cách mình đang suy luận.</div></div>
    <div class="diagnosis-card"><p class="wrong">Giả định cần sửa</p><p>${fixture.diagnosis}</p></div>
    <div class="citation-card"><span class="citation-label">Căn cứ</span><p>${fixture.citation}</p></div>
    <div class="actions"><button class="primary-button" type="button" data-action="self-correct">Xem một gợi ý và tự sửa</button></div>
  `, 1);
}

function renderCorrection() {
  render(`
    <p class="kicker">Bước 3 · Hint</p>
    <h2>Một gợi ý nhỏ để bạn tự đi tiếp</h2>
    <div class="alert success"><span class="alert-icon">↗</span><div>${fixture.hint}</div></div>
    <div class="citation-card"><span class="citation-label">Căn cứ</span><p>${fixture.citation}</p></div>
    <label class="label" for="correction-answer">Hãy viết lại câu trả lời</label>
    <textarea id="correction-answer">${correction}</textarea>
    <div class="actions"><button class="primary-button" type="button" data-action="explain">Gửi câu trả lời đã sửa</button></div>
  `, 2);
}

function renderExplainBack() {
  render(`
    <p class="kicker">Bước 4 · Self-correct</p>
    <h2>Giải thích lại bằng lời của bạn</h2>
    <p class="lead">Nếu có thể giải thích vì sao mình sai, bạn đang kiểm tra được mức hiểu — không chỉ đổi đáp án.</p>
    <div class="summary-card"><strong>Câu trả lời đã sửa</strong><p>${correction}</p></div>
    <label class="label" for="explain-answer">Vì sao câu trả lời ban đầu chưa đúng?</label>
    <textarea id="explain-answer">${explanation}</textarea>
    <div class="actions"><button class="primary-button" type="button" data-action="complete">Hoàn tất explain-back</button></div>
  `, 3);
}

function renderComplete() {
  render(`
    <p class="kicker">Bước 5 · Explain-back</p>
    <h2>Bạn đã đi hết vòng học từ lỗi.</h2>
    <div class="alert success"><span class="alert-icon">✓</span><div><strong>Đã tự sửa và giải thích lại.</strong><br />Lần tiếp theo hệ thống có thể lưu lại misconception này để hỗ trợ phù hợp hơn.</div></div>
    <div class="two-column">
      <div class="summary-card"><strong>Giả định ban đầu</strong><p>${fixture.wrongAnswer}</p></div>
      <div class="summary-card"><strong>Điều đã hiểu lại</strong><p>${explanation}</p></div>
    </div>
    <div class="actions"><button class="secondary-button" type="button" data-action="review">Xem lại chẩn đoán</button><button class="primary-button" type="button" data-action="start">Làm bài khác</button></div>
  `, 4);
}

resetButton.addEventListener("click", () => {
  answer = fixture.wrongAnswer;
  correction = fixture.correctedAnswer;
  explanation = fixture.explainBack;
  renderStart();
});

renderStart();
