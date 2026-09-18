# CP6 speaking notes — VLearn FixFirst

Thời lượng mục tiêu: 7 phút trình bày + 3 phút hỏi đáp.

## Slide 1 - Mở đầu | 30 giây

“VLearn FixFirst giúp học viên học từ câu trả lời đầu tiên của chính mình.
Thay vì xem lý thuyết rồi chép lại đáp án, học viên thử trước, nhận diagnosis
có căn cứ, tự sửa và giải thích lại.”

## Slide 2 - Vấn đề và lựa chọn | 60 giây

“Dữ liệu mining cho thấy 839 trên 3.097 lượt K4 không có citation, trong khi
chỉ có 23 lượt dùng hint và 6 lượt hỏi probing. Điều đó không chứng minh tutor
luôn sai, nhưng cho thấy flow hiện tại ít kiểm tra mức hiểu. Nhóm chọn lát cắt
D2 vì nó tạo một vòng học ngắn và đo được khả năng tự sửa.”

## Slide 3 - Flow sản phẩm | 60 giây

“Flow có năm bước: thử trước, chẩn đoán, mở căn cứ, tự sửa và nói lại. AI chỉ
đưa một hint vừa đủ. Phần quan trọng nhất vẫn là câu trả lời sửa lại và lời
giải thích của người học.”

## Slide 4 - Demo Tokenization | 2 phút 30 giây

“Câu hỏi demo là tokenizer xử lý chuỗi AI20k như thế nào. Câu trả lời sai
đồng nhất token với ký tự. Hệ thống chỉ ra đúng giả định này, gắn citation
T04-049 và cho người học tự viết lại. Kết quả mong muốn không phải một câu AI
trả lời dài hơn, mà là người học nói được vì sao câu đầu chưa đúng.”

## Slide 5 - Validation | 1 phút 30 giây

“Nhóm đã test với 5 học viên ngoài nhóm, trong đó P01 và P02 là willing user
đã khai từ CP1. Có 4 trên 5 người hoàn tất toàn bộ task, 5 trên 5 tự sửa được,
và 4 trên 5 đạt tối thiểu 2 trên 3 tiêu chí explain-back. Điểm kẹt lặp lại là
citation chưa đủ nổi bật, hint dễ bị hiểu như đáp án và explain-back cần
checklist rõ hơn. Nhóm giữ flow và sửa ba điểm này.”

## Slide 6 - Kết luận | 40 giây

“FixFirst tạo giá trị ở ba điểm: làm lộ giả định, cho người học kiểm tra căn
cứ, và buộc việc hiểu lại phải xuất hiện trong câu trả lời của chính họ. Đây
là lý do nhóm giữ lát cắt nhỏ Tokenization thay vì mở rộng thành cả khóa học.”

## Câu hỏi dự kiến

### Vì sao không đưa luôn đáp án đúng?

Vì mục tiêu là đo và tạo việc tự sửa. Hint chỉ mở hướng suy nghĩ; explain-back
cho thấy người học có thực sự hình thành hiểu biết hay chỉ chép lại.

### Citation có đảm bảo AI đúng tuyệt đối không?

Không. Citation bảo đảm diagnosis có căn cứ trong registry đã xác minh; nó không
thay thế việc người học kiểm tra và giải thích lại.

### Nếu AI lỗi hoặc không đủ căn cứ?

Safety router và schema validation chặn kết quả không hợp lệ. Khi thiếu căn cứ,
hệ thống yêu cầu làm rõ thay vì đoán bừa.
