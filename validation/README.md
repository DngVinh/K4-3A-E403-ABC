# CP5 validation log — VLearn FixFirst

Validation thật đã hoàn tất ngày **18/09/2026** với 5 học viên ngoài nhóm.
Participant ID được ẩn danh; không lưu thông tin định danh không cần thiết.
Báo cáo chi tiết: [`preview.md`](preview.md).

## Protocol

- Số người cần test: tối thiểu 5 người ngoài nhóm; trong đó 2 người đã khai từ CP1.
- Task: chọn Tokenization → trả lời → xem chẩn đoán → mở citation → tự sửa → explain-back.
- Mỗi phiên ghi thời lượng, điểm kẹt, quote nguyên văn và quyết định sau test.
- Không ghi API key, câu trả lời thô nếu không cần cho phân tích, hoặc thông tin định danh không cần thiết.

## Participant log

| Participant ID | CP1 willing? | Task | Citation | Self-correct | Explain-back | Time | Stuck point | Decision |
|---|---|---|---|---|---:|---:|---|---|
| P01 | Có | Hoàn tất | Có, sau khi được giải thích | Có | 3/3 | 04:32 | Chưa nhận ra evidence là nguồn tham chiếu | Làm nút evidence nổi bật hơn. |
| P02 | Có | Hoàn tất | Có | Có | 2/3 | 05:08 | Hiểu hint như đáp án cần chép | Thêm nhãn hint không phải đáp án. |
| P03 | Không | Hoàn tất | Không | Có | 2/3 | 03:55 | Bỏ qua citation trước khi sửa | Làm rõ vai trò citation. |
| P04 | Không | Hoàn tất một phần | Có | Có | 1/3 | 06:21 | Không biết cần nói lại những ý nào | Thêm checklist E1-E3. |
| P05 | Không | Hoàn tất | Có | Có | 3/3 | 04:47 | Chờ loading ở bước chẩn đoán | Giữ loading timeline, đo riêng thời gian chờ. |

## Summary

- Người dùng hoàn tất toàn bộ task: **4/5**
- Người dùng mở citation/evidence: **4/5**
- Người dùng tự sửa được: **5/5**
- Người dùng explain-back đạt tối thiểu 2/3 tiêu chí: **4/5**
- Explain-back đạt đủ 3/3 tiêu chí: **2/5**
- Người dùng biết bắt đầu từ đâu: **5/5**
- Người dùng phân biệt hint với đáp án ngay lần đầu: **3/5**
- Thời gian trung vị: **04:47**
- Vấn đề lặp lại nhiều nhất: **citation chưa đủ nổi bật; explain-back cần checklist rõ hơn**

## Decisions after testing

- Giữ flow `attempt → diagnose → hint → self-correct → explain-back` vì 5/5
  người biết bắt đầu từ đâu và 5/5 người tự sửa được.
- Làm rõ CTA citation/evidence và cách gọi **Căn cứ đã xác minh**.
- Thêm nhãn cho hint: **Gợi ý để bạn tự sửa, không phải đáp án mẫu**.
- Hiển thị checklist E1-E3 trước bước explain-back.
- Giữ loading timeline và đo riêng thời gian chờ AI ở vòng tiếp theo.

Kết luận và các quyết định này đã được cập nhật vào `spec.md` §9.
