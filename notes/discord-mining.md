# Discord mining — CP1 evidence log

Ngày phân tích: 2026-09-16
Scope: `data/discord-pack/k4_messages.csv` và `k4_daily_reports.md` của bộ dữ liệu bài hackathon. Raw pack được giữ ngoài repository; file này chỉ chứa số liệu tổng hợp và trích dẫn đã ẩn danh.

## Phương pháp

- Đọc data dictionary trước khi phân tích; giữ nguyên các message ID dạng `M#####` và author dạng `D####` chỉ để truy vết trong bộ dữ liệu, không suy ra danh tính.
- Lọc `is_bot=False`, `msg_type=message`, rồi tìm cụm message gốc có cả hai từ khóa `daily` và `standup` trong cửa sổ 08:30–10:30 ngày 14/09/2026 (giờ Việt Nam).
- Phân loại thủ công mỗi message theo một primary intent để tránh đếm một message nhiều lần. Đây là phân loại mining ban đầu, cần kiểm chứng bằng phỏng vấn/quan sát live.
- Không gọi một message là “unanswered” chỉ vì `reply_to` trống: tài liệu dữ liệu ghi rõ nhiều câu trả lời tự phát không được biểu diễn bằng trường này.

## Kết quả tổng hợp

| Phạm vi | Kết quả |
|---|---:|
| Toàn pack | 1.092 message; 779 human; 313 bot |
| Cửa sổ daily standup 2 giờ | 26 message gốc; 13 author; 23 message mention bot |
| Primary intent: phạm vi/cách nộp | 12/26 |
| Primary intent: nơi/cách gọi lệnh | 7/26 |
| Primary intent: deadline | 2/26 |
| Primary intent: mẫu/ví dụ | 2/26 |
| Primary intent: thời điểm/XP | 2/26 |
| Primary intent: lỗi trạng thái thành viên | 1/26 |
| Toàn pack nhắc `daily standup` | 59 human message; 30 author; 57 message gốc |

Sáu nhóm từ khóa rộng cũng cho tín hiệu cần điều tra tiếp: `nộp` 53 message gốc human, `nhóm` 56, `team` 43, `XP` 33, `ticket` 19 và `CVAT` 9. Đây là keyword mentions, không phải số issue duy nhất.

## Trích dẫn đại diện

Các trích dẫn dưới đây giữ nguyên cách viết trong pack nhưng không chứa tên thật hay mã định danh trực tiếp:

1. `M57734` — “[@BOT] quy cách nộp daily standup, cả nhóm có phải nộp ko? hình thức nộp như nào, viết ra sao, có mẫu ko? Nộp vào đâu?”
2. `M65205` — “[@BOT] nộp ở đâu cơ, phần này mình đánh lệnh /daily-standup rồi mà ko được”
3. `M19942` — “[@D9617] anh ơi nhóm em cả team nhận lệnh daily standup hết mà có mỗi em ko được ạ! Anh xem giúp em với”
4. `M21463` — “dạ cho em hỏi là hôm nay em mới nộp daily standup, em nhận được thông báo là em nộp muộn không được điểm danh vậy là hôm qua em tham gia lớp học là không tính điểm danh ạ”
5. `M69343` — “Cho mình hỏi làm sao để được 10xp này vì hôm qua mình cũng tham gia workshop 2 từ đầu đến cuỗi nhưng không thấy được cộng.”

## Baseline chất lượng daily report

Bốn report trong pack có các dấu hiệu cần kiểm tra trước khi dùng làm nguồn duy nhất cho triage: 14 đoạn lỗi chuỗi `nguồn tham chiếu`, 1 đoạn bị cắt cụt, 7 nhãn “đã có phản hồi, chưa xác nhận đã xử lý” và 3 cảnh báo “phản hồi tự động chưa phải hướng dẫn chính thức”. Report không chứa source message ID đầy đủ, vì vậy các số này được ghi nhận như baseline chất lượng output, không dùng để suy ra từng issue chưa giải quyết.

## Kết luận cho CP1

Tín hiệu mạnh nhất là sự lặp lại của các câu hỏi vận hành về daily standup trong một khoảng thời gian ngắn. Vì vậy nhóm chọn **Discord StuckRadar**: AI đề xuất nhóm/chủ đề và mức ưu tiên, còn TA/Mod duyệt trước khi xử lý. CP2 cần bổ sung phỏng vấn ít nhất 20 học viên, xác nhận 2 willing users và quan sát live Discord để đo “stuck” đáng tin cậy hơn.
