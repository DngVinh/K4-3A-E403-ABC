# CP3 thao tác video - kịch bản 30 giây

## Mục tiêu

Chứng minh prototype gọi AI thật ở bước diagnosis và chỉ hiển thị kết quả có
citation hợp lệ. Video này khác video backup CP5: CP3 ưu tiên chứng minh hệ
thống chạy, CP5 ưu tiên đảm bảo phần pitch có thể chiếu khi mạng hoặc máy lỗi.

## Timeline quay

| Thời gian | Thao tác trên màn hình | Điều phải nhìn thấy |
|---|---|---|
| 0-03 giây | Mở `http://localhost:3000` | Trang VLearn FixFirst và concept Tokenization |
| 03-07 giây | Bấm **Bắt đầu làm bài** | Màn hình attempt, chưa xem lý thuyết |
| 07-13 giây | Nhập câu trả lời: “Tokenizer luôn tách văn bản thành từng ký tự riêng lẻ.” | Câu trả lời được nhập thật |
| 13-17 giây | Bấm **Nộp để xem chẩn đoán** | Loading timeline, hệ thống đang đối chiếu |
| 17-25 giây | Chờ response AI | Diagnosis chỉ ra giả định token = ký tự; provider/status hiện rõ |
| 25-30 giây | Bấm **Xem evidence** | Citation ID `T04-049` hoặc `T04-050`, vị trí nguồn và evidence hiện ra |

## Checklist trước khi quay

- [x] Server chạy bằng provider thật, không dùng mock fallback để thay cho AI call.
- [x] Đã kiểm tra `.env` không xuất hiện trong khung hình.
- [x] Không để API key, email, token hoặc dữ liệu cá nhân trong video.
- [x] Cửa sổ trình duyệt đủ rộng để đọc diagnosis và citation.
- [x] Âm thanh không bắt buộc; nếu có, không đọc secret hoặc thông tin cá nhân.
- [x] File xuất ra khoảng 30 giây, định dạng MP4.

Tên file đề xuất: `vlearn-fixfirst-cp3-operation-30s.mp4`.

**Trạng thái:** đã quay và gửi theo xác nhận của nhóm ngày 18/09/2026; file
video/link nộp nằm ngoài repo này.
