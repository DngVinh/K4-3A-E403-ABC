# CP1-CP6 completion status — VLearn FixFirst

Ngày rà soát: 18/09/2026

Tài liệu này đối chiếu repo nhóm với yêu cầu checkpoint trong README đề bài.
`Hoàn tất` nghĩa là repo đã có bằng chứng nội bộ tương ứng hoặc nhóm đã xác
nhận artifact bên ngoài đã được quay và nộp. `Cần bổ sung` nghĩa là chưa có
bằng chứng hoặc xác nhận tương ứng; không được tự tạo dữ liệu thay thế.

## Bảng đối chiếu

| Mốc | Yêu cầu | Bằng chứng trong repo | Trạng thái |
|---|---|---|---|
| CP1 | Canvas 4 ô, đội trưởng, repo công khai, 2 willing users | `README.md`, `TEAMMATES.md`, `spec.md` §1-§2 và §1 mục 04, `notes/vlearn-mining.md` | Hoàn tất tài liệu; cụm Role 4, phòng E403 |
| CP2 | Luồng hoạt động bấm được hoặc sơ đồ/video | `codebase/index.html`, `codebase/app.js`, `spec.md` mục CP2 và checklist kiểm định | Hoàn tất |
| CP3 | Video thao tác 30 giây và số đo | `codebase/README.md`, `eval/README.md`, `eval/results/cp3-results.json`, `eval/results/cp4-results.json`, các trace đã làm sạch | Hoàn tất; video đã quay và gửi theo xác nhận nhóm, file không lưu trong repo |
| CP4 | Chốt quality bar, kết quả đo, tự khai phần chưa xong | `spec.md` §7 và §9, `eval/results/cp4-results.json`, `eval/runs/cp4-trace-locked-final.jsonl`, `eval/cp4-reviewer-checklist.md` | Hoàn tất; 2 reviewer độc lập đã Pass 30/30 case |
| CP5 | Validation thật, slide PDF 6 trang, video backup | `validation/README.md`, `validation/preview.md`, `demo-slides.pdf` | Hoàn tất; video backup đã quay và gửi theo xác nhận nhóm, file không lưu trong repo |
| CP6 | Thuyết trình, không nộp thêm | `demo/cp6-speaking-notes.md` | Đã chuẩn bị tài liệu nói; không có artifact bắt buộc để upload |

## Evidence map theo tiêu chí chấm

| Khối | Điểm | Nơi kiểm tra |
|---|---:|---|
| R1 - Bằng chứng và impact | 15 | `notes/vlearn-mining.md`, `spec.md` §1-§2 |
| R2 - Lát cắt và thiết kế | 15 | `spec.md` §4, `codebase/README.md` |
| R3 - Chỗ khó và rủi ro | 11 | `spec.md` §5-§6 |
| R4 - Kiểm thử | 15 | `spec.md` §7, `eval/README.md`, `eval/` |
| R5 - Prototype chạy được | 8 | `codebase/`, `codebase/README.md`, `demo-slides.pdf` |
| R6 - Người ngoài dùng thử | 8 | `validation/README.md`, `validation/preview.md` |
| R7 - Quy trình và repo | 3 | `README.md`, `TEAMMATES.md`, cấu trúc repo |

## Checklist trước khi nộp / trình bày

- [x] README đã điền lớp, phòng, track, tên nhóm và thành viên.
- [x] `spec.md` có quality bar, kết quả CP4 và phần chưa hoàn tất.
- [x] CP5 validation có 5 participant ẩn danh, 2 người từ CP1, quote và quyết định.
- [x] Có `demo-slides.pdf` đúng 6 trang.
- [x] Không commit data pack, raw chatlog, raw transcript, API key hoặc thông tin định danh không cần thiết.
- [x] Hai reviewer xác nhận độc lập phần hint không lộ đáp án ở CP4.
- [x] Video thao tác CP3 khoảng 30 giây đã quay và gửi.
- [x] Video demo backup CP5 đã quay và gửi.
- [x] Cả 4 thành viên xác nhận reflection trong `reflection/`.
- [x] Đã xác định link form là thông tin bên ngoài repo; chỉ điền vào `README.md` nếu nhóm nhận được URL chính thức và muốn lưu tham chiếu.
- [x] Cập nhật cụm thi Role 4 và phòng E403.

## Quy tắc trung thực khi hoàn thiện

Không đổi các mục `[ ]` thành `[x]` nếu chưa có artifact hoặc xác nhận tương
ứng. Video, reviewer sign-off, reflection cá nhân và link form là dữ liệu bên
ngoài repo; không tự tạo URL hoặc dữ liệu thay thế khi BTC chưa cung cấp.
