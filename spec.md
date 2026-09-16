# AI SPEC — VLearn FixFirst

Nhóm: K4-3A-E403-ABC · Phòng E403<br>
Track: D — Học tập thích ứng & tương tác trên VLearn · Slice: D2<br>
Trạng thái: CP1 draft sau vòng mining VLearn

## §1 — Canvas 4 ô

### 01 · Người dùng & nỗi đau

**Học viên muốn biết mình sai ở đâu, không chỉ biết đáp án đúng.**

- **Job:** Học viên làm bài tập trước khi xem lý thuyết để tự kiểm tra mức hiểu.
- **Pain:** Khi làm sai, học viên thường nhận đáp án hoặc lời giải dài nhưng không biết giả định nào của mình sai, nên dễ lặp lại lỗi.

### 02 · Bằng chứng ban đầu

**Tutor chưa thường xuyên kiểm tra mức hiểu.**

- Chatlog có 13.494 lượt hỏi–đáp từ 1.617 học viên; riêng cohort K4 có 3.097 lượt từ 448 học viên.
- Trong cohort K4: 839 lượt không có citation, chỉ 6 lượt dùng `ask_probing_question`, và chỉ 6 lượt có `understanding_level`.
- Chi tiết phương pháp và 5 ví dụ nguyên văn đã ẩn danh: [notes/vlearn-mining.md](notes/vlearn-mining.md).

> Chỉ dùng data pack được cấp phép; không commit raw data hoặc thông tin định danh vào repo public.

### 03 · Lát cắt & automation

**Làm bài trước, sửa lỗi có căn cứ.**

> **[Học viên] cần [tự sửa bài tập vừa làm sai] được [AI chỉ ra giả định sai và đưa một gợi ý kèm trích dẫn bài giảng] giúp [học viên giải thích lại đúng vì sao mình sai].**

- **Automation:** Augment — AI chẩn đoán và gợi ý; học viên tự sửa. Không đưa ngay đáp án đầy đủ vì chẩn đoán sai có thể khiến học viên học sai.

### 04 · Người thử & phân công

**Có học viên dùng thử, có người chịu trách nhiệm.**

- **Willing users dự kiến:** ít nhất 2 học viên ngoài nhóm; khuyến khích ghi 3 người, sẵn sàng học thử prototype ở CP5.
- **Phân công:** Hiếu — mining/evidence; Nguyên — UX/prototype; Vũ — prompt/evaluation; Vinh — điều phối/demo.

## §2 — Impact & quyết định chọn

| Ứng viên | Bằng chứng ban đầu | Tốn gì / tác động | Quyết định |
|---|---|---|---|
| **D2 VLearn FixFirst** | 448 học viên, 3.097 lượt K4; 839 lượt không citation; 6 lượt hỏi ngược | Học viên có thể nhận lời giải chung chung và lặp lại lỗi; cần một flow chẩn đoán lỗi + tự sửa | **Chọn** |
| A1 Tutor biết-mình-không-biết | 839/3.097 lượt K4 không có citation; nhiều câu trả lời ngoài nguồn | Giảm nguy cơ học viên tin lời giải không có căn cứ, nhưng chưa tạo vòng luyện tập tự sửa | Loại cho lát cắt này |
| D3 Học bằng cách dạy | Chỉ 6/3.097 lượt K4 có `understanding_level` | Có tiềm năng đo hiểu sâu, nhưng flow dài hơn và khó hoàn thiện trong prototype CP2 | Để phase sau |

**Lý do chọn:** D2 bám đúng người dùng học viên, có flow ngắn để demo và cho phép đo kết quả học tập cụ thể: học viên sửa đúng và giải thích lại được.

**Non-goals CP2:** không theo dõi điểm số cá nhân; không công khai lỗi của học viên; không xây cả khóa học; không thay thế giảng viên.

**Kế hoạch CP2:** chọn một khái niệm trong transcript/slide, dựng flow `attempt → diagnose → hint → self-correct → explain-back` bằng dữ liệu giả; CP3 mới tích hợp AI call thật ở bước chẩn đoán.

**Giới hạn:** số liệu hiện tại phản ánh hành vi tutor, chưa chứng minh chắc chắn rằng mọi học viên muốn tính năng này; cần kiểm chứng với học viên thật và đo họ có sửa/giải thích đúng hay không.
