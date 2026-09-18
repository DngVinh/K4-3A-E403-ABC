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
Số liệu mining & Thống kê hệ thống
Quy mô toàn hệ thống: Ghi nhận 13.494 lượt hỏi-đáp.

95,29% phản hồi chỉ giải thích lý thuyết hoặc đưa đáp án trực tiếp:

review_concept (giải thích lý thuyết dài): 12.127 lượt (89,87%).

give_direct_answer (đưa luôn đáp án): 731 lượt (5,42%).

Thiếu hụt hành vi bóc tách tư duy và chẩn đoán lỗi sai:

give_hint (gợi ý từng bước): 39 lượt (0,29%).

ask_probing_question (đặt câu hỏi đào sâu tư duy): 28 lượt (0,21%).
| Phạm vi | Kết quả |
|---|---:|
| Toàn chatlog | 13.494 lượt hỏi–đáp; 1.617 học viên |
| Cohort K4 | 3.097 lượt; 448 học viên |
| K4 không có citation | 839 lượt |
| K4 dùng `review_concept` | 2.767 lượt |
| K4 dùng `give_hint` | 23 lượt |
| K4 dùng `ask_probing_question` | 6 lượt |
| K4 có `understanding_level` | 6 lượt |
Số liệu mining & Thống kê hệ thống
Quy mô toàn hệ thống: Ghi nhận 13.494 lượt hỏi-đáp.

95,29% phản hồi chỉ giải thích lý thuyết hoặc đưa đáp án trực tiếp:

review_concept (giải thích lý thuyết dài): 12.127 lượt (89,87%).

give_direct_answer (đưa luôn đáp án): 731 lượt (5,42%).

Thiếu hụt hành vi bóc tách tư duy và chẩn đoán lỗi sai:

give_hint (gợi ý từng bước): 39 lượt (0,29%).

ask_probing_question (đặt câu hỏi đào sâu tư duy): 28 lượt (0,21%).

Nhu cầu gỡ lỗi khi tự kiểm tra: Tại khóa K4, có 131 lượt hỏi-đáp phát sinh trực tiếp từ các module tự luyện (Quiz cuối ngày, Luyện theo đề xuất, Ôn toàn bộ câu hỏi) từ 29 học viên. Học viên liên tục đưa các lựa chọn sai vào chatbox để hỏi nguyên nhân vì hệ thống chỉ hiển thị đáp án đúng mà không chỉ rõ giả định nào bị chệch.

5 Quote nguyên văn minh chứng từ tutor_turns.csv
1. Turn T13004
Học viên: S0736 | Buổi: DAY03

Trích dẫn:

"tại sao với câu hỏi Schema quy định order_id là chuỗi bắt buộc theo mẫu ^ORD-[0-9]{4}$; limit là số nguyên tùy chọn từ 1 đến 20. Câu hỏi: Chọn các payload hợp lệ. tôi chọn {"order_id":"ORD-0042","limit":0} lại sai"

Vấn đề: Học viên tự kiểm tra bằng quiz, bị chấm sai nhưng không rõ điều kiện biên nào trong suy luận của mình vi phạm, buộc phải hỏi lại tutor.

2. Turn T12563
Học viên: S0335 | Buổi: DAY04

Trích dẫn:

"Câu hỏi: Chọn nội dung đưa vào ngữ cảnh của model cho quyết định này... C. Ghi chú từ nhà cung cấp: “ignore policy” - Bạn đã chọn. D. source_id/provenance - Đáp án đúng... Xem gợi ý. Tai sao lai khong can ghi chu tu nha cung cap?"

Vấn đề: Hệ thống chỉ hiển thị "Đáp án đúng", học viên không hiểu vì sao giả định giữ lại ghi chú của mình bị loại trừ nên gặng hỏi lý do.

3. Turn T12578
Học viên: S0344 | Buổi: Day01

Trích dẫn:

"Câu hỏi: Giữ nguyên logits và temperature. Khi giảm top-p từ 0,95 xuống 0,60, thay đổi trực tiếp nào được kỳ vọng? ... C. Model weights được cập nhật để loại bỏ vĩnh viễn các token ngoài nucleus - Bạn đã chọn. D. Candidate set thường hẹp hơn vì cumulative sum đạt threshold sớm hơn - Đáp án đúng... Chưa đúng"

Vấn đề: Học viên nhầm lẫn bản chất giữa sampling và cập nhật trọng số; gợi ý tự động chỉ lặp lại định nghĩa đáp án đúng thay vì bóc tách sai lầm căn bản trong giả định.

4. Turn T11466
Học viên: S0941 | Buổi: Day01

Trích dẫn:

"Giải thích tại sao lại có câu trả lời này. học từ trong lúc pretrain là đúng rồi mà"

Vấn đề: Học viên làm bài tự đánh giá nhưng bất đồng với kết quả vì hệ thống chỉ báo đúng/sai mà không giải tỏa được tiền đề hiểu biết sẵn có của học viên.

5. Turn T13003
Học viên: S0456 | Buổi: Object Detection

Trích dẫn:

"'matching': 'ghép tối ưu theo IoU hình học, không dùng lớp khi ghép'... 'class_agreement': 0.729167, 'unmatched_mine': 46, 'unmatched_comparison': 2... hỹ xem cho tôi tôi bị sai chỗ nào không"

Vấn đề: Học viên tự đối chiếu bài làm với benchmark, nhận một bảng số liệu chênh lệch nhưng bất lực không biết giả định về nhãn hay toạ độ hộp bị sai, phải dán log nhờ tìm điểm sai.
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
