# 0334 — 2026-09-15 — Ổn định test `python3` của môn Lập trình dưới tải CI

**PR:** #(điền khi tạo) · **Loại:** `test`, chỉ sửa MỘT file test, không đụng mã sản phẩm,
không đụng `.github/workflows/ci.yml`, không đổi giao diện/API/hạn mức/schema.

Trả nợ kỹ thuật ghi ở `PROGRESS.md` (mục 🟡 2026-09-15, đo khi chạy cổng của PR S10-1, xem
`docs/changelog/0332-2026-09-15-s10-1-sua-lifecycle-companion.md`).

## Vấn đề

`packages/subject-programming/lessonsPython.test.ts` đỏ oan vì hết giờ ở ca `p5-s2` khi chạy
TOÀN BỘ suite song song, nhưng chạy riêng file thì xanh sạch. Mỗi lần như vậy tốn nguyên một
vòng CI của một PR chẳng liên quan.

## Nguyên nhân gốc — đo chứ không đoán

File này có **bốn** khối `it.each` cùng sinh tiến trình `python3` thật, nhưng hằng số
`PYTHON_TEST_TIMEOUT_MS = 30_000` chỉ được truyền cho **hai** khối đầu. Hai khối còn lại
(`Predict khớp output thật` và `code tham chiếu đạt HẾT milestone check`) vẫn chạy với mặc định
5s của Vitest. Ca `p5-s2` nằm đúng ở khối cuối cùng đó.

Đo thật lúc máy rảnh (`npx vitest run packages/subject-programming/lessonsPython.test.ts
--reporter=verbose`, 4 nhân):

| Ca chậm nhất                                      | Khối                     | Thời gian | Hạn cũ    | Biên độ  |
| ------------------------------------------------- | ------------------------ | --------- | --------- | -------- |
| `p5-u6-l1 — code mẫu đạt HẾT test-case`           | có `PYTHON_TEST_TIMEOUT` | 1.866 ms  | 30.000 ms | **16×**  |
| `p5-s2 — code tham chiếu đạt HẾT milestone check` | **KHÔNG** có timeout     | 1.604 ms  | 5.000 ms  | **3,1×** |

Hai ca nặng gần bằng nhau nhưng một ca có 16× biên độ, ca kia chỉ 3,1×. Dưới tải toàn suite
(nhiều worker Vitest + nhiều tiến trình `python3` giành 4 nhân), 3,1× không đủ — đúng ca đó
hết giờ. Đây là bất đối xứng trong chính file test, không phải lỗi nội dung bài học.

## Hướng đã chọn: (A) nới timeout — vì sao không chọn (B) tách job CI riêng

- Số đo trên nói rõ đây **không** phải "test quá nặng cho một job", mà là hai khối bị bỏ sót
  khi áp hằng số timeout. Sửa đúng chỗ sót là sửa tận gốc; tách job CI chỉ giấu nó đi.
- Tách job riêng còn đắt hơn: thêm một job con nối vào `needs` của `quality` (luật `CLAUDE.md`
  §11.1) nghĩa là thêm một lượt checkout + `npm ci` + build gói (~vài phút) vào đường tới hạn
  của MỌI PR, để giải quyết một ca 1,6 giây.
- Vì vậy PR này **không đụng** `.github/workflows/ci.yml`, không phải cân nhắc luật §11.1.

## Đã sửa gì

`packages/subject-programming/lessonsPython.test.ts` — truyền `PYTHON_TEST_TIMEOUT_MS` cho cả
hai khối còn thiếu, kèm comment tiếng Việt ghi lại số đo và lý do. **Không skip, không disable,
không quarantine, không giảm số ca chạy**: vẫn 568/568 ca của file, chỉ khác ở hạn giờ.

## Bằng chứng kiểm chứng

Chạy riêng file (trước và sau khi sửa): 568/568 xanh.

Ba lượt `npm run test:coverage` liên tiếp SAU khi sửa:

| Lượt | Test Files       | Tests                 | Thời gian | Kết quả      |
| ---- | ---------------- | --------------------- | --------- | ------------ |
| 1    | 631 passed (631) | 12.866 passed (12866) | 184,48s   | ✅ xanh sạch |
| 2    | 631 passed (631) | 12.866 passed (12866) | 173,18s   | ✅ xanh sạch |
| 3    | 631 passed (631) | 12.866 passed (12866) | 177,45s   | ✅ xanh sạch |

**3/3 lượt xanh, 0 file đỏ, 0 ca đỏ.** Coverage của cả ba lượt giống hệt nhau: 94,41 stmts /
90,32 branches / 94,87 funcs / 94,91 lines — trên sàn 93/89/93/93.

### Đo thêm: nhân hệ số tải để thấy rõ bất đối xứng

Chạy riêng file này trong khi ép 8 vòng lặp bận trên máy 4 nhân (gấp đôi số nhân):

| Ca                      | Máy rảnh | Dưới tải ×2 | Hệ số | Hạn cũ    | Còn cách ngưỡng  |
| ----------------------- | -------- | ----------- | ----- | --------- | ---------------- |
| `p5-u6-l1` (có timeout) | 1.866 ms | 3.761 ms    | 2,0×  | 30.000 ms | rất xa           |
| `p5-s2` (thiếu timeout) | 1.604 ms | 2.688 ms    | 1,7×  | 5.000 ms  | **chỉ 1,9× nữa** |

Tải thật của CI nặng hơn nhiều (631 file test chạy song song, không chỉ 1 file + vòng lặp bận),
nên `p5-s2` chỉ cần hệ số 3,1× là đỏ — trong khi `p5-u6-l1` phải tới 16×, tức không bao giờ.
Đó chính xác là lý do luôn là `p5-s2` đỏ chứ không phải ca nặng nhất file.

Cổng: build · typecheck · lint (0 cảnh báo) · format · test:coverage — xem mô tả PR.
