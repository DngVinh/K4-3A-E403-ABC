export const lessons = [
  {
    id: "tokenization",
    concept: "Tokenization",
    module: "Module 01",
    lesson: "AI & LLM Foundation · CP3 live lesson",
    description: "Hiểu cách văn bản được chia thành các token trước khi đi vào mô hình.",
    question: "Theo bạn, tokenizer xử lý chuỗi “AI20k” như thế nào? Hãy giải thích ngắn gọn.",
    wrongAnswer: "Tokenizer luôn tách văn bản thành từng ký tự riêng lẻ.",
    correctedAnswer: "Tokenizer chia văn bản thành các token; một token có thể là một từ, một phần của từ hoặc ký hiệu, nên không nhất thiết bằng một ký tự.",
    explainBack: "Mình sai vì đã đồng nhất token với ký tự. Tokenizer có thể gom thành từ hoặc các phần của từ tùy cách nó được xây dựng.",
    duration: "03 phút",
    difficulty: "Cơ bản",
    exercises: "1 bài tập",
    status: "live",
    accent: "violet"
  },
  {
    id: "embeddings",
    concept: "Embeddings",
    module: "Module 02",
    lesson: "AI & LLM Foundation · sắp mở",
    description: "Khám phá cách mô hình biểu diễn ý nghĩa của từ và câu bằng vector.",
    duration: "05 phút",
    difficulty: "Cơ bản",
    exercises: "2 bài tập",
    status: "upcoming",
    accent: "blue"
  },
  {
    id: "context-window",
    concept: "Context window",
    module: "Module 03",
    lesson: "AI & LLM Foundation · sắp mở",
    description: "Tìm hiểu giới hạn thông tin mô hình có thể nhìn thấy trong một lần xử lý.",
    duration: "04 phút",
    difficulty: "Trung bình",
    exercises: "2 bài tập",
    status: "upcoming",
    accent: "orange"
  }
];

export const sampleHistory = [
  { concept: "Prompt design", label: "Đã hoàn tất", date: "Hôm qua", tone: "green" },
  { concept: "AI & LLM Foundation", label: "Đang xem lại", date: "12 tháng 9", tone: "violet" }
];

export const learningStats = {
  completedLessons: 2,
  totalLessons: 8,
  evalPassed: 16,
  evalTotal: 20
};

export const citationEvidence = {
  "T04-049": {
    label: "Day 1 AI & LLM Foundation — Token",
    location: "transcript-04-clean.md · [T04-049]",
    evidence: "Token là đơn vị tính của LLM, không đồng nhất với một từ hay một ký tự; văn bản được chia thành token và sự chia này có thể khác theo ngôn ngữ."
  },
  "T04-050": {
    label: "Day 1 AI & LLM Foundation — Công cụ đếm token",
    location: "transcript-04-clean.md · [T04-050]",
    evidence: "Muốn biết số token chính xác cần dùng công cụ đếm; cách chia token có thể khác giữa các phiên bản mô hình."
  },
  "T06-135-136": {
    label: "Day 1 AI & LLM Foundation — Next-token prediction",
    location: "transcript-06-clean.md · [T06-135]–[T06-136]",
    evidence: "LLM không đọc theo từng ký tự hay từng từ; nó xử lý token và dự đoán token tiếp theo theo xác suất."
  }
};
