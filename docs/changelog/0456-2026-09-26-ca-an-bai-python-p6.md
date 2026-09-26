# Ca test ẩn cho bài Python P6 đọc input; giữ có chủ đích 5 bài dùng hằng

- **Ngày:** 2026-09-26 · **PR:** PR của nhánh `seeker/zealous-allen-ygj0gw` (sau #1181)
- **Loại:** `fix(programming)`. Người dùng giao "tự quyết cho chất lượng cao". Đây là việc "6 bài
  Python P6 không có ca test ẩn" (cảnh báo `KHONG_CA_AN` của `audit:lessons`, soát ở `0454`).

## Quyết định từng bài

- **`p6-u13-l2`: THÊM hai ca ẩn.** Bài đã đọc input từ stdin, nhưng mọi ca công khai đều có trung
  bình chẵn và không ca nào chạy cả chương trình với danh sách rỗng. Hai ca ẩn kiểm đúng phần còn
  thiếu:
  - `10000 / 20000 / 25000` → trung bình 18333,3, phải làm tròn thành `18333`;
  - `n = 0` → chương trình phải in `Trung binh: 0`, không lỗi chia cho 0.
- **5 bài dùng hằng: GIỮ NGUYÊN có chủ đích.**
  - `p6-u13-l1` dạy hàm thuần. Chuyện "đọc input ở vỏ" là chủ đề của chính bài kế tiếp
    `p6-u13-l2`; bắt `l1` đọc stdin là dạy trước bài sau.
  - `p6-u14-l1` (tranh chấp luồng), `p6-u14-l2` (idempotency/retry), `p6-u15-l1` (ước lượng),
    `p6-u15-l2` (post-mortem) cố ý dùng dữ liệu cố định để người học tập trung vào khái niệm.
    Tách chuỗi input chỉ thêm việc vụn làm loãng bài.
  - Rủi ro chép cứng ở bậc P6 thấp: người chép cứng chỉ tự lừa mình.
- **Công cụ rà nói đúng tình trạng:** `KHONG_CA_AN` của bài dùng hằng nay ghi "đề dùng hằng (stdin
  rỗng), chỉ thiết kế lại đề mới chống chép cứng", thay vì gợi ý thêm ca ẩn vô tác dụng.

## Bằng chứng

- Chạy lời giải mẫu bằng `python3` thật: ra `Trung binh: 18333` và `Trung binh: 0`, đúng kỳ vọng.
- `lessonsPython.test.ts -t p6-u13`: 42/42 xanh.
- Chấm bằng chính `gradeTestCase` của app một bài làm chép cứng ba dòng mẫu: qua 3 ca công khai,
  **trượt cả hai ca ẩn mới**.
- `audit:lessons`: `KHONG_CA_AN` 6 → 5, đều là bài dùng hằng đã quyết giữ.
