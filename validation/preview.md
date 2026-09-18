# CP5 validation — VLearn FixFirst

## Trạng thái validation

| Trường | Giá trị |
|---|---|
| Trạng thái | Đã hoàn tất user test thật |
| Ngày thực hiện | 18/09/2026 |
| Prototype | VLearn FixFirst · Tokenization |
| Số người tham gia | 5 học viên ngoài nhóm |
| CP1 willing user | P01 và P02 |
| Participant ID | Mã ẩn danh, không lưu thông tin định danh không cần thiết |

## 1. Mục tiêu phiên test

Kiểm tra xem học viên có thể đi hết vòng học hay không:

`attempt → diagnose → mở citation → self-correct → explain-back`

Các câu hỏi cần trả lời:

- Học viên có biết bắt đầu từ đâu không?
- Học viên có hiểu citation là căn cứ cho chẩn đoán, không phải đáp án không?
- Học viên có tự sửa được sau khi nhận hint không?
- Học viên có giải thích lại bằng lời của mình không?

## 2. Protocol

| Trường              | Nội dung                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Prototype           | VLearn FixFirst · concept Tokenization                                                                                 |
| Số phiên            | 5 phiên                                                                                                                |
| Task                | Trả lời câu hỏi, xem diagnosis, mở evidence, tự sửa, explain-back                                                      |
| Cách tính thời gian | Từ lúc bấm “Bắt đầu” đến khi gửi explain-back                                                                          |
| Explain-back đạt    | Nhắc đúng: token không đồng nhất với ký tự; tokenizer quyết định cách chia; cùng văn bản có thể tạo số token khác nhau |

### Rubric explain-back

| Mã | Tiêu chí đạt |
|---|---|
| E1 | Không đồng nhất token với một ký tự đơn lẻ. |
| E2 | Nói được token có thể là từ, phần của từ hoặc ký hiệu tùy tokenizer. |
| E3 | Hiểu cách chia token phụ thuộc tokenizer/mô hình, không phải một quy tắc cố định cho mọi chuỗi. |

`2/3` được tính là đạt mức tối thiểu; `3/3` là hoàn tất tốt.

## 3. Participant log

| ID  | CP1 willing? | Task | Diagnosis | Citation | Tự sửa | Explain-back | Thời gian | Điểm kẹt chính | Quote | Quyết định sau phiên |
| --- | ------------ | ---- | --------- | -------- | ------ | ------------ | --------: | -------------- | ----- | -------------------- |
| P01 | Có | Hoàn tất | Đạt | Có, sau khi được giải thích | Có | 3/3 | 04:32 | Không nhận ra “Xem evidence” là nguồn tham chiếu | “À, citation là chỗ để kiểm tra AI dựa vào đâu, không phải câu trả lời mẫu.” | Giữ flow; làm nút evidence nổi bật hơn. |
| P02 | Có | Hoàn tất | Đạt | Có | Có | 2/3 | 05:08 | Ban đầu xem hint như đáp án cần chép lại | “Mình tưởng gợi ý là đáp án rút gọn, nhưng hóa ra phải tự viết lại.” | Thêm nhãn “Gợi ý, chưa phải đáp án”. |
| P03 | Không | Hoàn tất | Đạt | Không | Có | 2/3 | 03:55 | Đọc diagnosis nhưng bỏ qua citation | “Nếu không bắt buộc mở thì mình sẽ đi thẳng xuống phần sửa.” | Làm rõ vai trò citation trước bước tự sửa. |
| P04 | Không | Hoàn tất một phần | Đạt | Có | Có | 1/3 | 06:21 | Không biết cần giải thích lại cả ba ý | “Mình sửa được câu trả lời nhưng không biết phải nói lại đến mức nào.” | Hiển thị checklist E1-E3 trước ô explain-back. |
| P05 | Không | Hoàn tất | Đạt | Có | Có | 3/3 | 04:47 | Chờ loading ở bước chẩn đoán | “Có timeline thì mình biết hệ thống vẫn đang kiểm tra, không bị treo.” | Giữ loading timeline; đo riêng thời gian chờ. |

## 4. Tổng hợp kết quả

| Chỉ số                                                | Kết quả |
| ----------------------------------------------------- | ------: |
| Hoàn tất toàn bộ task                                 |     4/5 |
| Mở citation/evidence                                  |     4/5 |
| Tự sửa được câu trả lời                               |     5/5 |
| Explain-back đạt từ 2/3 tiêu chí                      |     4/5 |
| Explain-back đạt đủ 3/3 tiêu chí                      |     2/5 |
| Người dùng biết bắt đầu từ đâu                        |     5/5 |
| Người dùng phân biệt được hint và đáp án ngay lần đầu |     3/5 |
| Thời gian trung vị                                    |   04:47 |

**Cách tính:** mọi tỷ lệ dùng mẫu số 5. “Mở citation/evidence” tính khi người
dùng mở citation ít nhất một lần; “tự sửa được” tính khi câu trả lời sau hint
không còn lặp lại giả định token luôn là một ký tự.

### Insight

1. **Flow cơ bản dễ theo:** 5/5 người bắt đầu được mà không cần hướng dẫn riêng.
2. **Citation chưa đủ nổi bật:** 1 người bỏ qua citation; 1 người không hiểu ngay mục đích của nó.
3. **Hint có nguy cơ bị hiểu thành đáp án:** chỉ 3/5 người phân biệt được ngay từ lần đầu.
4. **Explain-back cần scaffolding:** người dùng sửa được nhưng chưa chắc biết cần giải thích những ý nào.
5. **Loading timeline có ích:** người dùng không nhầm trạng thái chờ với lỗi hệ thống.

## 5. Quyết định thiết kế sau test

### Giữ nguyên

- Giữ thứ tự `làm trước → chẩn đoán → hint → tự sửa → explain-back`.
- Giữ citation drawer vì nó giúp người học kiểm tra căn cứ của diagnosis.
- Giữ loading timeline ở bước gọi AI.

### Đề xuất thay đổi

- Đổi/đồng bộ cách gọi từ “evidence” sang **“Căn cứ đã xác minh”** ở các vị trí dễ thấy.
- Thêm dòng phụ dưới hint: **“Đây là gợi ý để bạn tự sửa, không phải đáp án mẫu.”**
- Trước explain-back, hiển thị checklist 3 tiêu chí cần nói lại.
- Ở phiên test tiếp theo, đo riêng thời gian chờ AI và thời gian người dùng đọc citation.

### Tiêu chí kiểm tra lại ở vòng tiếp theo

- Ít nhất 4/5 người mở citation mà không cần người điều phối nhắc.
- Ít nhất 4/5 người phân biệt được hint với đáp án.
- Ít nhất 4/5 người tự sửa được câu trả lời.
- Nếu kết quả thấp hơn thì ghi nhận và giải thích nguyên nhân.

## 6. Kết luận validation

Trong 5 phiên test thật, 4 người hoàn tất toàn bộ task, 4 người mở
citation/evidence, 5 người tự sửa được và 4 người explain-back đạt tối thiểu
2/3 tiêu chí. Điểm kẹt lặp lại là citation chưa đủ nổi bật, hint dễ bị hiểu
như đáp án và explain-back chưa cho người học biết rõ cần nói lại những ý nào.

Nhóm giữ nguyên flow `attempt → diagnose → hint → self-correct → explain-back`
vì cả 5 người đều biết bắt đầu từ đâu và cả 5 người đều tự sửa được. Nhóm sẽ
sửa cách hiển thị citation, phân biệt hint với đáp án và thêm checklist E1-E3
ở bước explain-back.

## 7. Checklist bằng chứng cần lưu

- [x] Ngày thực hiện 18/09/2026 và participant ID không định danh.
- [x] Task và phiên bản prototype đã dùng.
- [x] Thời lượng và các bước người dùng hoàn thành.
- [x] Điểm kẹt quan sát được, ghi bằng ngôn ngữ trung tính.
- [x] Quote nguyên văn sau khi đã bỏ thông tin định danh không cần thiết.
- [x] Quyết định thiết kế và lý do dựa trên quan sát.

## 8. Trạng thái lưu bằng chứng

- [x] Đủ 5 học viên ngoài nhóm.
- [x] Có 2 CP1 willing user: P01 và P02.
- [x] Có thời lượng, điểm kẹt, quote và quyết định cho từng phiên.
- [x] Có summary và kết luận dựa trên số liệu thực tế.
- [x] Không lưu thông tin định danh không cần thiết.
- [x] Log chính được đồng bộ tại `validation/README.md`.
