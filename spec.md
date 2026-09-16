# AI SPEC — Discord StuckRadar

Nhóm: K4-3A-E403-ABC · Phòng E403<br>
Track: B — Discord Assistant · Slice: B2<br>
Trạng thái: CP1 draft sau vòng mining dữ liệu

## §1 — Canvas 4 ô

### 1. Thông tin chung

- **Hướng đi:** Track B2 — phát hiện các câu hỏi/vấn đề có nguy cơ bị bỏ sót trên Discord.
- **Job executor:** TA/Mod khi kết thúc ngày học.
- **Quy trình hiện tại:** TA/Mod phải đọc nhiều kênh, dựa vào thread/reply và các daily report để tự tìm câu hỏi chưa rõ trạng thái; các câu hỏi cùng một chủ đề có thể xuất hiện dưới nhiều cách diễn đạt.
- **Mục tiêu của slice:** tạo một danh sách triage có nhóm chủ đề, mức độ ưu tiên, liên kết message và trạng thái để TA/Mod duyệt trước khi xử lý.
- **Phân công:** Hiếu — mining/evidence; Nguyên — UX/prototype; Vũ — technical spec/validation; Vinh — điều phối/product owner.

### 2. Nỗi đau cốt lõi

TA/Mod khó nhận ra và ưu tiên các câu hỏi học viên đang bị bỏ sót giữa nhiều kênh Discord, đặc biệt khi nhiều người lặp lại cùng một câu hỏi về cách nộp bài, daily standup, XP hoặc lỗi thao tác.

**Bằng chứng mining ban đầu** (chi tiết và phương pháp ở [notes/discord-mining.md](notes/discord-mining.md)):

- Pack có 1.092 message trong 3 ngày (779 human, 313 bot); `reply_to` không phản ánh đầy đủ các câu trả lời tự phát nên chưa dùng nó để kết luận “unanswered sau 4 giờ”.
- Trong cụm 26 message gốc có cả từ khóa `daily` và `standup` trong 2 giờ ngày 14/09/2026: 13 author ẩn danh, 23 message mention bot. Phân loại một-intent cho thấy 12 câu hỏi về phạm vi/cách nộp, 7 câu hỏi về nơi/cách gọi lệnh, 2 về deadline, 2 về mẫu/ví dụ, 2 về thời điểm/XP và 1 về lỗi trạng thái của một thành viên.
- Toàn pack có 59 message human nhắc `daily standup`, từ 30 author (57 là message gốc). Đây là số lần nhắc từ khóa, không phải số câu hỏi đã xác nhận duy nhất.
- Bốn daily report hiện có 14 đoạn lỗi chuỗi `nguồn tham chiếu`, 1 đoạn bị cắt cụt, 7 lần xuất hiện nhãn “đã có phản hồi, chưa xác nhận đã xử lý” và 3 cảnh báo “phản hồi tự động chưa phải hướng dẫn chính thức”. Đây là tín hiệu chất lượng report, không phải bằng chứng rằng mọi câu hỏi tương ứng đều chưa được giải quyết.

### 3. Lát cắt giải pháp

**Người dùng** TA/Mod cuối ngày **cần** một bảng triage các câu hỏi/vấn đề Discord được **AI nhóm theo chủ đề và xếp ưu tiên**, kèm message link và bằng chứng thời gian/reply, **giúp** họ **xác định việc cần xử lý trước và giảm bỏ sót câu hỏi lặp lại**.

**Luồng CP1 dự kiến:** ingest message → lọc message human và câu hỏi → gom cụm câu hỏi tương tự → chấm tín hiệu ưu tiên (tuổi, số người lặp lại, thiếu phản hồi rõ ràng, lỗi thao tác) → TA/Mod duyệt/chỉnh nhãn → xuất danh sách việc cần xử lý. Không tự động DM hoặc trả lời học viên trong slice này.

### 4. Cam kết triển khai

- **Mức tự động hóa dự kiến:** bán tự động. AI đề xuất cụm, mức ưu tiên và lý do; TA/Mod là người duyệt cuối.
- **Bằng chứng sẽ xây:** mining pack đã ẩn danh, log các message ID đại diện, quan sát Discord thật và phỏng vấn tối thiểu 20 học viên ngoài nhóm.
- **Willing users:** cần xác nhận tối thiểu 2 học viên ngoài nhóm trước khi nộp form CP1; chưa tự điền tên khi chưa có xác nhận.
- **Ràng buộc dữ liệu:** không commit raw data pack, tên thật, MSSV, email, số điện thoại, mention hoặc nội dung có thể định danh; chỉ giữ số liệu tổng hợp và trích dẫn ngắn đã ẩn danh.

## §2 — Tác động, so sánh ý tưởng và quyết định

| Ý tưởng | Tín hiệu ban đầu | Tác động kỳ vọng | Quyết định |
|---|---|---|---|
| **Discord StuckRadar (B2)** | 26 message daily standup trong 2 giờ, 13 author; 12/26 hỏi phạm vi/cách nộp | Giảm thời gian đọc thủ công, gom câu hỏi lặp và đưa vấn đề có nguy cơ bỏ sót lên đầu hàng đợi | **Chọn** |
| ReportQA | 14 đoạn lỗi chuỗi, 1 đoạn cắt cụt trong 4 daily report; 7 nhãn chưa xác nhận xử lý | Làm report dễ đọc và đáng tin hơn, nhưng chưa trực tiếp ưu tiên vấn đề của học viên | Không chọn cho CP1 |
| XP/attendance exception queue | 40 message human nhắc XP và 37 message nhắc điểm danh; đây là keyword count cần phân loại tiếp | Có thể giảm ticket hỏi điểm/điểm danh, nhưng phạm vi dễ phụ thuộc quyền truy cập và quy định lớp | Để phase sau |

**Lý do chọn:** StuckRadar có tín hiệu lặp lại rõ nhất, bám trực tiếp job của TA/Mod và cho phép kiểm thử với human-in-the-loop mà không tự động tác động đến học viên.

**Giả thuyết tác động cần xác minh ở CP2:** sau khi TA/Mod dùng triage, thời gian tìm câu hỏi cần xử lý và số câu hỏi trùng lặp bị bỏ qua sẽ giảm; cần đo trên log trước/sau và phỏng vấn người dùng.

**Giới hạn hiện tại:** data pack chỉ bao phủ 3 ngày; tên kênh bị ẩn danh; `reply_to` không ghi nhận mọi trao đổi tự phát; cần đối chiếu bằng quan sát Discord thật trước khi chốt ngưỡng “stuck”.
