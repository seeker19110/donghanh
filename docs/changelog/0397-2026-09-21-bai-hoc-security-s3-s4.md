# 0397 — 2026-09-21 — Bài học thật cho hai chặng cuối hướng Bảo mật: `security-s3` và `security-s4`

> PR: (điền số khi mở) · Nhánh: `claude/bai-hoc-security-s3-s4`
> Đặc tả: `docs/specs/2026-09-17-security-s3-bai-hoc-that.md` và
> `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md` (phần `security-s4`; phần `data-s4`
> đã làm ở đợt trước, đợt này không đụng).

## Việc đã làm

Soạn **16 bài học Python MÔ PHỎNG** (8 unit × 2 bài, khuôn 8 bước) cho hai chặng còn rỗng của
hướng `security`, rồi nối vào toàn bộ đường dẫn dữ liệu của môn Lập trình.

**`security-s4` — chặng PHÒNG THỦ (`p6-u206…p6-u209`):**

- `p6-u206` kiến trúc an toàn: cổng ranh giới tin cậy theo zero trust (vị trí mạng KHÔNG phải
  bằng chứng danh tính) · vòng đời khoá, hạn xoay vòng, cổng mô hình đe doạ trước phát hành.
- `p6-u207` phát hiện và ứng cứu: cổng chất lượng luật phát hiện đo trên fixture + ánh xạ ATT&CK ·
  trình tự ngăn chặn → diệt trừ → phục hồi (diệt trừ trước khi thu chứng cứ bị `block`).
- `p6-u208` điều tra số: toàn vẹn chứng cứ và chuỗi lưu giữ (`inadmissible`) · chuẩn hoá mốc về
  UTC kèm cờ bất định, và che dữ liệu cá nhân thô trong báo cáo (`redact`).
- `p6-u209` quản trị và tuân thủ: rủi ro tồn dư + điều kiện để "chấp nhận" hợp lệ · rủi ro bên thứ
  ba và luật **khai đạt mà không có bằng chứng → `not-reported`, cấm quy thành đạt**.

**`security-s3` — vì sao lỗ hổng tồn tại và cách TÌM ra chúng (`p6-u210…p6-u213`):**

- `p6-u210` đọc luồng điều khiển trên **máy đồ chơi 13 lệnh do đặc tả định nghĩa** (không con trỏ
  thô, không địa chỉ tuyệt đối): dựng đồ thị, tìm khối `unreachable` · chạy có trần bước để phát
  hiện vòng lặp không lối thoát (`no-exit`).
- `p6-u211` an toàn bộ nhớ: bộ **PHÁT HIỆN** `oob-write`/`use-after-free`/`double-free`/`leak` trên
  mô hình ô nhớ có nhãn · chạy lại cùng chuỗi đó dưới ngữ nghĩa kiểm biên → mọi lỗi thành
  `prevented` (đó là toàn bộ lập luận "an toàn bộ nhớ là biện pháp gốc rễ", bằng thực nghiệm).
- `p6-u212` tìm lỗi tự động: fuzzer theo độ phủ, hạt giống truyền vào, tất định, hết ngân sách →
  `not-found` (cấm báo "không có lỗi") · thu nhỏ ca lỗi bằng delta-debugging giữ ĐÚNG nhãn lỗi.
- `p6-u213` bảo mật hệ thống hiện đại: chuỗi cung ứng (xuất xứ/chữ ký/lệ thuộc chuyển tiếp) và IAM
  least privilege · bảo mật AI (tiêm lệnh, đầu độc dữ liệu, allow-list công cụ).

**Nối vào hệ thống:** `specializations/stageUnits.ts` (2 khoá mới) · `lessons.ts` (8 unit) ·
`curriculum.ts` (8 unit bậc P6) · `lessonsLazy.ts` (sinh lại bằng `npm run gen:lesson-index`:
533 bài · 238 unit) · `learningPaths/principal-ai.ts` (`security-s3` vào `principal-ai-p4` ngay
sau `security-s2`; `security-s4` vào `principal-ai-p5` TRƯỚC `principal-s3`) · quiz sau chặng cho
cả hai chặng ở `learningPaths/stageQuizzes.ts`.

**Cổng nội dung mới:** `securityS3Lessons.test.ts` và `securityS4Lessons.test.ts`.

## Quyết định trong đợt

1. **Quiz sau chặng là việc BẮT BUỘC kèm theo, không phải phạm vi phình.** `ProgrammingPathPage`
   có bất biến "mọi chặng của `principal-ai` đều có quiz"; thêm hai chặng vào lộ trình mà không
   soạn quiz là làm đỏ cổng đó. Đã thêm 5 câu/chặng và khai vào `stageQuizzes.test.ts`.
2. **`stageUnits.test.ts` đổi ví dụ "chặng chưa có bài"** từ `security-s3` (nay đã có bài) sang
   `game-s1`, để nhánh "chưa soạn trả mảng rỗng" vẫn được canh thật.
3. **Ranh giới cứng của `security-s3` được thi hành bằng máy, không bằng lời hứa.** Danh sách cấm
   ở ④ của đặc tả áp cho TOÀN BỘ chữ của bài (kể cả phần giải thích và thẻ SRS), không riêng code.
4. **Hai bất biến của `p6-u212` được kiểm bằng cách CHẠY LẠI, không bằng cách tin chuỗi kỳ vọng:**
   gate cài lại parser đồ chơi bằng TypeScript rồi tự kiểm ca lỗi đã thu nhỏ vẫn gây đúng nhãn lỗi
   ban đầu; tính tất định kiểm bằng cùng một hạt giống xuất hiện hai lần phải cho kỳ vọng y hệt.

## Bằng chứng kiểm chứng (chạy thật, không phải "chạy ok")

```
npm run gen:lesson-index   → Đã sinh lessonsLazy.ts: 533 bài · 238 unit
npx vitest run securityS3Lessons.test.ts securityS4Lessons.test.ts → 2 files, 21/21 passed
npx vitest run lessonsPython.test.ts → 1048/1048 passed (chạy python3 THẬT cho mọi code mẫu)
npx vitest run specializations/  → 33/33 passed
npm run typecheck          → sạch (4 project, 0 lỗi)
npm run lint               → 0 cảnh báo
npx prettier --check .     → All matched files use Prettier code style
npm test                   → xem mục Validation của PR
npm run build              → xem mục Validation của PR
```

## Rủi ro còn lại

- Rủi ro lớn nhất mà đặc tả `security-s3` nêu — bài giải thích trượt thành bài hướng dẫn khai thác
  — được chặn bằng bốn lớp (thiết kế máy đồ chơi · hướng bài luôn hỏi "phát hiện thế nào" · danh
  sách cấm chặn CI · review). Lớp thứ tư là **chủ dự án đọc diff bài học trước khi merge**, theo
  đề nghị ở ⑦ của đặc tả.
- Đặc tả viết "Mười hai lệnh" nhưng liệt kê đủ **13** lệnh; bài theo danh sách liệt kê (13 lệnh).
