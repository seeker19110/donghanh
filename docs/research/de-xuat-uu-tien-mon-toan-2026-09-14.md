# Đề xuất ưu tiên bổ sung môn Toán — 2026-09-14

> Tài liệu QUYẾT ĐỊNH, không phải đặc tả thi hành. Mục đích: xin bạn chốt ưu tiên + xác nhận bộ
> sách trước khi giao AI/subagent soạn nội dung — vì soạn sai chương/sai bộ sách thì phải bỏ làm
> lại toàn bộ, tốn công hơn nhiều so với hỏi trước 5 phút.

## 1. Tình trạng đo được (khảo sát trực tiếp `packages/subject-math/lessons/`)

35 bài đã có, phủ các chương sau — 6 chương đang **thủng hoàn toàn** (0 bài):

| Lớp | Có bài (số chương) | **THIẾU**          |
| --- | ------------------ | ------------------ |
| 10  | 1,2,3,4,6,7,8,9    | **chương 5**       |
| 11  | 1,2,5,6,7,9        | **chương 3, 4, 8** |
| 12  | 1,4,5,6            | **chương 2, 3**    |

So sánh quy mô: Toán 35 bài, trong khi Lí 85 bài, Hoá 72 bài — Toán mỏng nhất trong 4 môn STEM
dù là môn nền tảng nhất.

## 2. Vấn đề gốc rễ tìm thấy khi khảo sát

Không tồn tại `docs/research/kho-kien-thuc-toan-gdpt2018.md` (Hoá đã có file tương ứng
`kho-kien-thuc-hoa-gdpt2018.md`, Lí/Sinh cũng có tài liệu nguồn tương tự) — **đây là lý do gốc
khiến 6 chương bị bỏ sót mà không ai phát hiện**: không có bản đồ đối chiếu chương trình để so
sánh. `packages/subject-math/lessons.test.ts` cũng chưa có ngưỡng số bài tối thiểu
(`expect(MATH_LESSONS.length).toBeGreaterThanOrEqual(N)`) như gói Sinh đã làm — nên lỗ hổng
không bị CI chặn, có thể tiếp tục thủng thêm mà không ai biết.

## 3. Vì sao KHÔNG thể tự đoán tên 6 chương thiếu

Chương trình GDPT 2018 môn Toán có 3 bộ sách phổ biến (Kết Nối Tri Thức, Chân Trời Sáng Tạo,
Cánh Diều) đánh số chương **khác nhau** giữa các bộ, và 4 môn STEM khác trong repo cũng không
ghi rõ đang theo bộ sách nào ở nơi tôi tìm được. Đoán sai tên chương → soạn nhầm nội dung → phải
bỏ. Cần bạn xác nhận trước.

## 4. Đề xuất (xin bạn chọn)

**Việc 0 (làm trước mọi thứ, rủi ro thấp, nên làm ngay bất kể chọn phương án nào):**
Thêm `docs/research/kho-kien-thuc-toan-gdpt2018.md` (bản đồ đối chiếu chương trình, theo mẫu
file Hoá đã có) + thêm ngưỡng số bài tối thiểu vào `lessons.test.ts` để khoá không thủng thêm.
→ **đây có thể giao ngay cho subagent**, không cần quyết định thêm.

**Việc 1 (cần bạn chọn TRƯỚC khi giao soạn bài):**

| Phương án                                         | Mô tả                                                                            | Đánh đổi                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A. Ưu tiên lớp 12 (chương 2, 3)                   | Sát kỳ thi tốt nghiệp THPT nhất, giá trị tức thời cao nhất cho học sinh cuối cấp | Chỉ đóng 2/6 chương, lớp 10-11 vẫn thủng                                       |
| B. Ưu tiên theo mạch kiến thức nền (lớp 10 trước) | Chương 5 lớp 10 thường là nền cho chương sau — đóng sớm tránh học sinh hổng gốc  | Chậm giá trị thi cử trước mắt                                                  |
| C. Làm cả 6 chương trong 1 đợt                    | Đóng dứt điểm lỗ hổng, khớp tinh thần "giữ nguyên khuôn 4 môn STEM"              | Khối lượng lớn (~15-20 bài mới ước tính), rủi ro chất lượng nếu dồn vào 1 lượt |

Khuyến nghị của tôi (kỹ sư): **A trước, sau đó B, cuối cùng C nốt phần còn lại** — chia 3 đợt nhỏ
thay vì 1 đợt lớn, đúng nguyên tắc "chia nhỏ" ở CLAUDE.md mục 3. Mỗi đợt đều cần có
`docs/specs/<ngày>-mon-toan-bo-sung-<lop>.md` riêng (đặc tả đủ 6 ô theo khuôn
`docs/templates/dac-ta-tinh-nang.md`) TRƯỚC khi giao soạn, vì nội dung Toán cần đúng chuyên môn
— không thể chỉ đưa brief ngắn như 4 việc mechanical vừa làm trong PR này.

## 5. Việc cần bạn trả lời để tôi tiếp tục

1. Bộ sách giáo khoa đang theo là bộ nào (Kết Nối Tri Thức / Chân Trời Sáng Tạo / Cánh Diều /
   tự biên soạn theo khung GDPT 2018 không theo bộ nào cụ thể)?
2. Chọn phương án ưu tiên ở mục 4 (A/B/C hoặc thứ tự khác)?
3. Có đồng ý làm Việc 0 (bản đồ đối chiếu + ngưỡng test) ngay trong đợt này không, hay để dành
   riêng?
