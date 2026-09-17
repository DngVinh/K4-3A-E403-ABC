# CP3 prototype — VLearn FixFirst

Prototype này minh họa lát cắt D2 và gọi AI thật ở bước chẩn đoán:

`attempt → diagnose → hint → self-correct → explain-back`

## Cách chạy CP3

Yêu cầu Node 18+ (để dùng `fetch` tích hợp). Không cần cài dependency.

1. Copy `.env.example` thành `.env`, đặt `AI_PROVIDER_ORDER=gemini,deepseek`, rồi điền key cục bộ. Không commit `.env`.
2. Rà soát `eval/citations.local.json`: registry đã có ba mệnh đề Tokenization đã chuẩn hoá, không chứa transcript/chatlog thô.
3. Chỉ sau khi rà soát registry, đổi `ALLOW_EXTERNAL_AI_CONTEXT=true` trong `.env`. Đây là chốt xác nhận vì các mệnh đề trong registry sẽ được gửi tới provider ngoài.
4. Trên PowerShell Windows, chạy `npm.cmd start` (hoặc `npm start` nếu máy không chặn script), rồi mở `http://localhost:3000` trên trình duyệt.

Hỗ trợ adapter `deepseek`, `openai`, `gemini`, `anthropic`. Với `AI_PROVIDER_ORDER=gemini,deepseek`, Gemini được thử trước; khi gặp quota/rate-limit, lỗi mạng hoặc 5xx, request tự chuyển sang DeepSeek. Mỗi provider có thể đặt model riêng bằng `GEMINI_MODEL`, `DEEPSEEK_MODEL`, …

## Kịch bản demo

1. Chọn concept **Tokenization**.
2. Bấm **Bắt đầu làm bài**.
3. Nhập câu trả lời và bấm **Nộp để xem chẩn đoán**.
4. Xem chẩn đoán AI, hint và citation đã được server kiểm tra với registry.
5. Bấm qua bước tự sửa, giải thích lại và hoàn tất.

## Kiểm chứng CP3

- AI chỉ được phép trả citation nằm trong `eval/citations.local.json` có `status: verified`.
- Nếu chưa đủ căn cứ hoặc citation không hợp lệ, server chặn kết quả thay vì hiển thị một chẩn đoán đoán bừa.
- `eval/runs/cp3-trace.jsonl` chỉ lưu trace đã làm sạch (hash input/output, model, thời gian, citation ID), không lưu API key hay câu trả lời thô.
- Chạy `npm.cmd run eval:run` để đo 20 case; xem hướng dẫn tại [`../eval/README.md`](../eval/README.md).
