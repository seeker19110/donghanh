# 0397 — 2026-09-21 — Bài học thật cho chặng `algo-s3` và `algo-s4` (hướng Thuật toán)

> PR: #1094 · Nhánh: `claude/bai-hoc-algo-s3-s4`
> Đặc tả: `docs/specs/2026-09-21-algo-s3-s4-bai-hoc-that.md` (Approved for implementation,
> chủ dự án duyệt 2026-09-21)

## Việc đã làm

Lấp hai chặng rỗng CUỐI của hướng Thuật toán — hướng NỀN cắt ngang — bằng **tám unit / mười
sáu bài Python** mô phỏng, bounded và tất định. Hướng `algo` nay đủ bốn chặng S1–S4.

`algo-s3` (`p6-u226..p6-u229`), mỗi unit bám đúng một module:

- `p6-u226` / `algo-s3-m1` — quy hoạch động: đặt trạng thái trước khi gõ code, ba lô 0/1
  bottom-up một chiều, LIS một chiều và giảm chiều bộ nhớ.
- `p6-u227` / `algo-s3-m2` — chuỗi: KMP đếm khớp chồng nhau (oracle brute-force), băm đa thức
  HAI BỘ tự viết, khoảng cách chỉnh sửa.
- `p6-u228` / `algo-s3-m3` — toán rời rạc: luỹ thừa/nghịch đảo mô-đun, sàng nguyên tố, giao
  đoạn thẳng bằng tích có hướng SỐ NGUYÊN.
- `p6-u229` / `algo-s3-m4` — truy vấn khoảng: cây phân đoạn cập nhật lười (range-add /
  range-sum) và sparse table RMQ tĩnh từ chối cập nhật sau build.

`algo-s4` (`p6-u230..p6-u233`):

- `p6-u230` / `algo-s4-m1` — Bloom filter: băm tự viết, không âm tính giả, đo tỉ lệ báo nhầm
  qua năm hạt giống và so `k=1` với `k=3`.
- `p6-u231` / `algo-s4-m2` — NP-khó: tham lam theo tỉ suất + cận trên ba lô phân số + cải
  thiện cục bộ, khai rõ `khong-kiem-tra-toi-uu` khi vượt trần vét cạn.
- `p6-u232` / `algo-s4-m3` — bộ nhớ và song song MÔ PHỎNG BẰNG SỐ HỌC: đếm số lần đổi khối
  row-major/column-major, chia tải k phần.
- `p6-u233` / `algo-s4-m4` — phỏng vấn: làm rõ trường thiếu ĐẦU TIÊN theo thứ tự cố định,
  ước lượng dung lượng bằng công thức đóng, checklist giả định/đánh đổi/ví dụ.

Điểm chạm: tám file `packages/subject-programming/lessons/p6u226.ts`…`p6u233.ts` (mới), hai
cổng ngữ nghĩa `algoS3Lessons.test.ts` + `algoS4Lessons.test.ts` (mới), đăng ký vào
`lessons.ts` · `curriculum.ts` · `specializations/stageUnits.ts` (+ test), sinh lại
`lessonsLazy.ts` bằng `npm run gen:lesson-index`.

## Quyết định

- **Không nối `algo-s3`/`algo-s4` vào `learningPaths/*`** — theo đúng mục ⑧ quyết định 2 của
  đặc tả: hai chặng đứng độc lập, vào qua trang hướng chuyên sâu, để không đổi mẫu số tiến độ
  của lộ trình `principal-ai`.
- **Một PR cho cả hai chặng** (đề xuất mặc định ở mục ⑦ bước 5) — hai chặng độc lập nhau nên
  gộp không ảnh hưởng hợp đồng, và chung một nhật ký gọn hơn.
- **Negative control của `p6-u229` dùng chuỗi thao tác DỰNG SẴN, không sinh ngẫu nhiên.** Đo
  thật: 200 hạt giống sinh ngẫu nhiên KHÔNG lần nào rơi vào khuôn "cập nhật phủ trọn rồi truy
  vấn một phần" — khuôn duy nhất làm lộ lỗi quên push-down. Bản đối chứng ĐÚNG vẫn chạy trên
  100 chuỗi thao tác có hạt giống như đặc tả yêu cầu.
- **Dữ liệu va chạm băm của `p6-u227`**: cặp `"ad"`/`"ba"` trùng giá trị băm với cơ số 3,
  mô-đun 101 — tìm bằng máy, không đoán. Một hash đếm 40 trong khi đáp án đúng là 20.
- Mọi ngẫu nhiên trong code chạy được dùng LCG tự viết (`x = (x * 1103515245 + 12345) %
2147483648`), KHÔNG dùng `random`, `hash()` built-in, `float`, đồng hồ tường hay
  thread/process thật — có gate chuỗi cấm canh trong cả hai cổng ngữ nghĩa.

## Bằng chứng kiểm chứng

| Lệnh                                               | Kết quả thật                                    |
| -------------------------------------------------- | ----------------------------------------------- |
| `npm run gen:lesson-index`                         | `533 bài · 238 unit`                            |
| `npx vitest run …/algoS3Lessons.test.ts`           | 8 passed                                        |
| `npx vitest run …/algoS4Lessons.test.ts`           | 8 passed                                        |
| `npx vitest run …/lessonsPython.test.ts -t p6-u22` | 24 passed (code mẫu + worked example + Predict) |
| `npm run typecheck` (sau khi xoá `dist/`)          | 0 lỗi                                           |
| `npm run lint`                                     | 0 cảnh báo                                      |
| `npm run format:check`                             | All matched files use Prettier code style       |
| `npm test`                                         | toàn bộ xanh                                    |
| `npm run build`                                    | xanh                                            |

**Ba lỗi nội dung do `lessonsPython.test.ts` bắt được ở lượt chạy TOÀN BỘ** (lượt lọc
`-t 'p6-u22'` ban đầu KHÔNG phủ `p6-u230..u233` — bài học: lọc theo tiền tố dễ hụt dải id):

1. `p6-u231-l2` — bộ dữ liệu ca hiện thực ra KHÔNG hề cải thiện (`cai-thien: 0`), tức là ca
   "chứng minh cải thiện cục bộ có tác dụng" lại không chứng minh gì. Thay bằng `1:2,1:3,4:6`
   với sức chứa 5, tìm bằng máy: hai nước đổi liên tiếp nâng 5 → 9.
2. `p6-u230-l1` và `p6-u233-l1` — lựa chọn Predict viết kèm lời bình nên không khớp output
   thô; riêng `p6-u233-l1` còn có hai lựa chọn SAI là chuỗi con của đáp án đúng
   (`172800000` nằm trong `1728000000`). Đã đổi sang lựa chọn là output thô, rời nhau.

Các negative control đều ĐÃ THẬT SỰ ĐỎ trước khi được sửa cho đúng — cổng không xanh rỗng:
bản DP duyệt tăng dần, bản một hash trên dữ liệu va chạm, bản `float ==` ở ca thẳng hàng toạ
độ lớn, bản quên push-down, `k=1` của Bloom filter, bản bỏ cải thiện cục bộ, và cách chia dồn
phần dư — tất cả đều bị oracle bắt sai.

## Còn để ngỏ

Artifact rubric 80/15/5 của hai chặng (thi đấu thật ≥10 kỳ cho `algo-s3`, cải thiện đo được
≥10 lần ở hệ thống thật cho `algo-s4`) KHÔNG nằm trong phạm vi đợt này — lesson là bệ tập
luyện, rubric vẫn phải nộp riêng.
