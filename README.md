# K4-3A-E403-ABC

## Thông tin nhóm

- Lớp: K4-3A
- Phòng: E403
- Hướng: Track D — Học tập thích ứng & tương tác trên VLearn
- Slice: D2 — VLearn FixFirst

| Họ và tên | MSSV | Vai trò | Phần việc chính |
|---|---|---|---|
| Lê Minh Hiếu | 2A202602848 | Mining / evidence | Khai thác chatlog, chọn case và trích dẫn |
| Nguyễn Hoàng Lê Nguyên | 2A202602472 | UX / prototype | Flow học thử và giao diện feedback |
| Giang Thế Vũ | 2A202602478 | Prompt / evaluation | Prompt chẩn đoán lỗi, golden set và đo lường |
| Dương Xuân Vinh | 2A202602622 | Đội trưởng / product owner | Điều phối, tích hợp và demo |

## Trạng thái CP1 và CP2

| Mốc | Nội dung cần có | Trạng thái | Bằng chứng |
|---|---|---|---|
| CP1 | Canvas 4 ô, bằng chứng ban đầu, quyết định chọn lát cắt, thành viên và phân công | Đã khôi phục nội dung; còn bổ sung tên willing user | [spec.md](spec.md), [TEAMMATES.md](TEAMMATES.md), [notes/vlearn-mining.md](notes/vlearn-mining.md) |
| CP2 | Prototype/mock cho thấy flow hoạt động từ đầu đến cuối | Đã dựng prototype; cần hoàn tất smoke test và lưu bằng chứng kiểm định | [codebase/index.html](codebase/index.html), [codebase/README.md](codebase/README.md), checklist trong [spec.md](spec.md) |

## Tài liệu

- [Canvas và AI spec](spec.md)
- [Nhật ký mining VLearn đã ẩn danh](notes/vlearn-mining.md)
- [Danh sách thành viên](TEAMMATES.md)
- [Prototype CP2 bấm được](codebase/index.html)
- [Hướng dẫn demo prototype](codebase/README.md)

## Kịch bản demo CP2

1. Mở [codebase/index.html](codebase/index.html) bằng trình duyệt.
2. Chọn concept **Tokenization** và bấm **Bắt đầu làm bài**.
3. Giữ câu trả lời mẫu hoặc nhập câu trả lời riêng, sau đó bấm **Nộp để xem chẩn đoán**.
4. Xem giả định sai, hint và citation fixture.
5. Viết câu trả lời đã sửa rồi gửi.
6. Giải thích lại vì sao câu trả lời ban đầu chưa đúng và bấm hoàn tất.

## Phạm vi hiện tại

- CP1 đã có canvas, evidence log, impact/decision và phân công.
- CP2 là clickable mock dùng fixture Tokenization; chưa gọi AI thật.
- Citation hiện là citation mẫu, sẽ thay bằng mã đoạn transcript/slide đã xác minh ở CP3.
- Không commit raw data hoặc thông tin định danh vào repo public.
