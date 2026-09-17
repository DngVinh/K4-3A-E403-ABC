# VLearn mining — CP1 evidence log

Ngày phân tích: 2026-09-16
Scope: `data/vlearn-pack/chatlog/tutor_turns.csv` của bộ dữ liệu bài hackathon. Raw pack được giữ ngoài repository; file này chỉ chứa số liệu tổng hợp và ví dụ ngắn đã ẩn danh.

## Phương pháp

- Đọc `DATA_DICTIONARY.md` trước khi đếm.
- Lọc `cohort_hint=K4` để tập trung vào khóa hiện tại: 3.097 lượt từ 448 học viên.
- Loại `is_preset=True` khi đọc ví dụ định tính; câu mẫu bấm sẵn không được dùng để kết luận về nhu cầu tự phát.
- Đếm `has_citation`, `move_used`, `understanding_level`; giữ `turn_id` dạng `T#####` chỉ để truy vết trong pack, không suy ra danh tính.
- Đọc 35 mẫu đầu tiên có tín hiệu “khó/không hiểu/sai/vì sao/giải thích”, sau đó chọn 5 ví dụ đại diện. Đây là mining ban đầu, cần kiểm chứng bằng user test.

## Kết quả tổng hợp

| Phạm vi | Kết quả |
|---|---:|
| Toàn chatlog | 13.494 lượt hỏi–đáp; 1.617 học viên |
| Cohort K4 | 3.097 lượt; 448 học viên |
| K4 không có citation | 839 lượt |
| K4 dùng `review_concept` | 2.767 lượt |
| K4 dùng `give_hint` | 23 lượt |
| K4 dùng `ask_probing_question` | 6 lượt |
| K4 có `understanding_level` | 6 lượt |

Tín hiệu này không chứng minh tutor luôn trả lời sai. Nó cho thấy flow hiện tại ít ghi nhận mức hiểu và ít dùng hỏi ngược/gợi ý, tạo cơ sở để thử một flow mới bắt đầu bằng bài làm và kết thúc bằng tự sửa.

## Pattern ẩn danh đại diện

Các pattern đã được paraphrase, không giữ nguyên câu chữ hay mã dòng của nguồn:

- Học viên yêu cầu giải thích lại vì phần học khó hiểu.
- Học viên muốn được diễn giải ngắn gọn hoặc tóm tắt lại nội dung.
- Học viên muốn phân biệt rõ sự khác nhau giữa các khái niệm.
- Học viên đặt câu hỏi rộng về đặc điểm của mô hình ngôn ngữ.

Các ví dụ trên cho thấy người học có nhu cầu làm rõ/diễn giải lại, nhưng log hiện tại thường ghi nhận lượt `review_concept` thay vì một chuỗi chẩn đoán lỗi → gợi ý → người học tự sửa. Vì vậy D2 sẽ kiểm tra trực tiếp khả năng tự sửa và giải thích lại, không chỉ đo độ dài/đúng của câu trả lời AI.

## Kết luận cho CP1

Chọn **D2 — VLearn FixFirst**: một học viên làm bài trước khi xem lý thuyết; AI chỉ ra giả định sai, đưa một gợi ý có citation, rồi yêu cầu học viên tự sửa và giải thích lại. CP5 cần tối thiểu 5 học viên thực sự học thử một đoạn bằng prototype để đo kết quả học tập; tên willing users chỉ điền vào form khi đã xác nhận.
