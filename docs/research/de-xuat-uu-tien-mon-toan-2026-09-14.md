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

## 2. Vấn đề gốc rễ tìm thấy khi khảo sát — SỬA LẠI (2026-09-14, sau khi đọc kỹ hơn)

**Đính chính:** khảo sát ban đầu báo "không tồn tại kho kiến thức Toán" — SAI, do tìm sai tên
file. Kho kiến thức Toán **đã tồn tại**, gộp trong `docs/research/kho-kien-thuc-mon-hoc.md` mục
`[5] kho-kien-thuc-toan-gdpt2018.md`, và phần lớp 10-12 **đã đối chiếu SGK thật ngày 2026-08-03**
(ghi rõ ở đầu §5 của file đó) — không phải chưa có tài liệu nguồn.

Lý do gốc 6 chương vẫn bị thủng dù đã có kho kiến thức: **không có cầu nối giữa tài liệu và
code** — chưa ai chuyển từ bảng công thức trong `kho-kien-thuc-mon-hoc.md` §5 thành bài học thật
trong `packages/subject-math/lessons/`. Đã vá phần "không bị chặn": thêm test khoá số chương
tối thiểu vào `packages/subject-math/lessons.test.ts` (không cho xoá âm thầm 18 chương đã có).

## 3. Tên 6 chương thiếu — ĐÃ XÁC ĐỊNH (bạn xác nhận bộ Kết Nối Tri Thức)

Đối chiếu bảng lớp 12 ở `kho-kien-thuc-mon-hoc.md` §5 (thứ tự chương chuẩn bộ Kết Nối Tri Thức,
6 chương/19 bài) với 4 chương đã có bài (1,4,5,6) trong repo:

| Chương | Tên (theo mạch kiến thức đã liệt kê trong kho kiến thức)          | Trạng thái   |
| ------ | ----------------------------------------------------------------- | ------------ |
| 1      | Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số                  | ✅ đã có bài |
| **2**  | **Vectơ và hệ trục toạ độ trong không gian** (Oxyz)               | 🔴 THIẾU     |
| **3**  | **Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm** | 🔴 THIẾU     |
| 4      | Nguyên hàm, tích phân                                             | ✅ đã có bài |
| 5      | Phương trình mặt phẳng, đường thẳng, mặt cầu                      | ✅ đã có bài |
| 6      | Xác suất có điều kiện                                             | ✅ đã có bài |

Lớp 11 (thiếu chương 3, 4, 8) và lớp 10 (thiếu chương 5) chưa đối chiếu chi tiết trong đợt này —
để dành cho phương án B/C (mục 4) sau khi xong lớp 12.

## 4. QUYẾT ĐỊNH (2026-09-14, người dùng chốt)

- **Bộ sách:** Kết Nối Tri Thức.
- **Ưu tiên:** phương án A trước (lớp 12, chương 2-3) — sát kỳ thi tốt nghiệp THPT nhất.
- **Việc 0:** đã làm (mục 2 ở trên) — thêm test khoá số chương vào `lessons.test.ts`, xác định
  đúng tên 6 chương thiếu qua kho kiến thức đã có sẵn (không cần viết file mới).

Đặc tả thi hành cho lớp 12 chương 2-3: `docs/specs/2026-09-14-mon-toan-bo-sung-lop12-c2-c3.md`
— **cần bạn duyệt riêng file đặc tả đó** (ghi "Approved for implementation") trước khi tôi giao
soạn nội dung thật, theo đúng quy ước PR `feat` ở CLAUDE.md mục 11.

Việc B (lớp 10 chương 5, lớp 11 chương 3/4/8) và C (nốt phần còn lại) để dành đặc tả riêng sau
khi lớp 12 đạt cổng.

## 5. Cập nhật (2026-09-14) — chương 2-3 lớp 12 ĐÃ CÓ BÀI (draft)

Đặc tả đã được duyệt "Approved for implementation" và thi hành xong: 7 bài mới trong
`packages/subject-math/lessons/toan12c2.ts` (4 bài) và `toan12c3.ts` (3 bài), toàn bộ
`reviewStatus: 'draft'`. Toán 12 nay đủ cả 6 chương (1-6), không còn thủng ở lớp 12.

**Còn treo:** nội dung vẫn ở trạng thái `draft`, cần người có chuyên môn Toán duyệt qua quy trình
duyệt chuyên môn STEM (PR #904/#905) trước khi coi là chính thức. Lớp 10 (chương 5) và lớp 11
(chương 3, 4, 8) vẫn thủng — chưa làm trong đợt này.
