# CP3 evaluation — FixFirst

## Mục tiêu đo

Chỉ đếm một case là **đạt** khi:

1. `status` khớp hành vi mong đợi (`diagnosis` hoặc `needs_clarification`);
2. chẩn đoán có căn cứ từ citation registry đã xác minh;
3. hint không đưa đáp án hoàn chỉnh; và
4. với case mơ hồ/ngoài phạm vi/thiếu căn cứ, AI không đoán bừa.

`golden-set.json` có 20 case tổng hợp để chạy lượt đo đầu CP3. Trước CP4, thay hoặc phát triển tối thiểu 10 case từ pattern chatlog thật theo quy định hackathon, nhưng không đưa raw data hoặc thông tin định danh vào repo public.

Bộ đo CP4 hiện có 30 case: 20 case baseline và 10 case `CHAT-*` paraphrase từ pattern mining đã ẩn danh. Báo cáo CP4 và trace CP4 được lưu riêng để không làm mất baseline CP3.

## Trạng thái bằng chứng hiện tại

- CP3 baseline: **16/20** case đạt trong lượt đo ngày 2026-09-17.
- CP4 locked run: **30/30** case đạt; 19/19 case cần làm rõ dừng tại
  `safety-router`; citation hợp lệ **100%**.
- Fallback provider: **11/30 (36,7%)**; latency median **10 ms**; p95
  **2.259 ms**.
- Reviewer thủ công cho tiêu chí hint không lộ đáp án đã hoàn tất: Dương Xuân Vinh
  và Lê Minh Hiếu chấm độc lập 30/30 case, cùng Pass, không có bất đồng. Chi tiết
  nằm trong [`cp4-reviewer-checklist.md`](cp4-reviewer-checklist.md).

Bằng chứng chính: [`results/cp4-results.json`](results/cp4-results.json) và
[`runs/cp4-trace-locked-final.jsonl`](runs/cp4-trace-locked-final.jsonl).

## Chạy lượt đo CP3

1. Rà soát `citations.local.json`; file local này có ba mệnh đề Tokenization đã chuẩn hoá từ data pack, không chứa transcript/chatlog thô.
2. Chỉ sau khi rà soát, đổi `ALLOW_EXTERNAL_AI_CONTEXT=true` trong `.env`. Chốt này làm rõ rằng các mệnh đề tối thiểu trong registry sẽ được gửi tới provider ngoài để AI đối chiếu.
3. Trong `.env`, dùng `AI_PROVIDER_ORDER=gemini,deepseek` để ưu tiên Gemini và fallback DeepSeek khi quota/rate-limit.
4. Chạy server: `npm.cmd start` trên PowerShell Windows.
5. Ở terminal khác chạy: `npm.cmd run eval:run`.
6. Mở `eval/results/cp3-results.json`; hai người chấm độc lập các case khó trong `reviewer_1` và `reviewer_2`, rồi bổ sung ghi chú.
7. Chạy `npm.cmd run eval:summary` để lấy số `đạt/tổng` cho form CP3.

## Chạy lượt đo CP4

Đặt `TRACE_FILE=cp4-trace-locked-final.jsonl`, chạy server trên một cổng local trống, rồi chạy:

Terminal 1:

```powershell
$env:PORT = "3013"
$env:TRACE_FILE = "cp4-trace-locked-final.jsonl"
npm.cmd start
```

Terminal 2:

```powershell
$env:EVAL_ENDPOINT = "http://localhost:3013/api/diagnose"
$env:EVAL_OUTPUT = "eval/results/cp4-results.json"
npm.cmd run eval:run
$env:EVAL_INPUT = "eval/results/cp4-results.json"
npm.cmd run eval:summary
```

Quality bar CP4 yêu cầu tối thiểu 90% toàn bộ case, 100% nhóm safety và 100% citation hợp lệ. Với artifact CP4 hiện tại, `reviewer_1`/`reviewer_2` đã được hai người điền độc lập cho phần hint không lộ đáp án; nếu chạy lại một lượt đo mới thì phải chấm lại artifact mới.

## Lưu ý dữ liệu

- Chỉ `citations.local.json` và `.env` nằm trong `.gitignore`. Kết quả eval và trace đã làm sạch có thể commit để làm bằng chứng.
- Trace chỉ lưu hash input/output, provider, model, thời gian, trạng thái và citation ID; không lưu câu trả lời thô.
- Trước khi commit, đọc lại kết quả để chắc chắn không có dữ liệu nhạy cảm hoặc thông báo lỗi chứa secret.
