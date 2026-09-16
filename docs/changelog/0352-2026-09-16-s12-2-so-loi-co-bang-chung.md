# 0352 — S12-2: sổ lỗi có bằng chứng (migration `0084` + sổ lỗi STEM đọc từ evidence S11)

- **Ngày:** 2026-09-16
- **PR:** #981
- **Đặc tả:** [`docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md`](../specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md) §9 mục 2 (AC-9 → AC-12)
- **Slice:** S12-2 (S12-1 = `0341`); còn lại của goal: S12-3, S13

## Việc đã làm

1. **`postgres/migrations/0084_mistakes_evidence.sql`** — `english.mistakes` thêm 3 cột
   NULLABLE: `attempt_id uuid`, `content_id text`, `subject_id text not null default 'english'`.
   **KHÔNG đổi `unique (user_id, dedupe_key)`** — lỗi trùng vẫn gộp một dòng như trước, bằng
   chứng chỉ giữ bản MỚI nhất. Lũy đẳng (`add column if not exists`), chạy 2 lần không đổi gì.
2. **`apps/server/src/api/subjects/english/mistakes.ts`** — `MistakeSchema` thêm 3 field tuỳ
   chọn; upsert dùng `coalesce(excluded.attempt_id, english.mistakes.attempt_id)` nên bản mới
   thắng còn `NULL` KHÔNG xoá bằng chứng cũ (máy cũ đồng bộ lên không làm mất móc của máy khác).
3. **`apps/server/src/api/learning/evidence.ts`** — thêm nhánh ĐỌC `?include=attempts`: 200 lượt
   nộp mới nhất của môn, kèm `items` (đúng/sai từng câu). `answers.raw` (chữ người học gõ) KHÔNG
   trả về. `GetQuerySchema` nay `.strict()` và chỉ nhận `include=attempts`. POST không đổi.
4. **`apps/dhcb/src/lib/evidenceMistakes.ts`** (mới, hàm THUẦN) — `mistakesFromEvidence` dựng
   `MistakeEntry[]` từ `CompletionEvidence.items`. Câu trả lời ĐÚNG ở lượt mới hơn thì mục bị
   **gỡ** (sổ lỗi là "còn sai gì"); bản ghi hỏng bị bỏ, không ném. `getDueEvidenceMistakes` +
   `hanOnCuaMuc` dùng CHUNG `REVIEW_SPACING_MS` của `lib/mistakes.ts`.
5. **`apps/dhcb/src/lib/mistakeRoutes.ts`** (mới) — MỘT bảng ánh xạ nguồn lỗi → URL, thêm
   `duongDanCauSaiStem` (bài + `#cau-<i+1>`).
6. **`apps/dhcb/src/pages/core/MistakeBank.tsx`** — bộ lọc môn (Anh · 4 môn STEM · Lập trình),
   nhãn "có bằng chứng · <ngày>" / "ghi tay", nút "Ôn lại lỗi này"; nhóm Lập trình nói thẳng
   "chưa có bằng chứng câu sai".
7. **`apps/dhcb/src/pages/learning/ReviewHub.tsx`** — nối nguồn `learning.evidence` vào hàng đợi
   ôn (AC-12); chỉ hỏi nhật ký của những môn STEM đã từng nộp bài trên máy này.

## Quyết định

- **Route "trò chuyện" là `/tro-truyen`, KHÔNG phải `/tro-chuyen`** như đặc tả AC-11 viết. Lấy
  theo `App.tsx` (route thật) và thêm test đọc `App.tsx` để không ai "sửa cho khớp đặc tả" rồi
  đẻ ra link chết.
- **`attempt_id` giữ kiểu `uuid` theo đặc tả**, nhưng `AttemptIdSchema` của S11 cố ý rộng hơn
  uuid (WebView cũ không có `crypto.randomUUID`). Giá trị không phải uuid rơi về `NULL` ở tầng
  server thay vì làm đổ CẢ mẻ đồng bộ bằng lỗi 500.
- **Hub chỉ fetch nhật ký của môn đã học trên máy** (`monStemDaHocTrenMay`, đọc bộ đệm trạng
  thái đồng bộ). Người chưa học STEM thì hub không phát sinh request nào — giữ đúng cảnh báo
  §8 của đặc tả về việc hub phải nhẹ.
- **Thêm `/so-tay-loi-sai` vào cổng a11y làm lộ một khiếm khuyết CÓ THẬT.** Trang này chưa từng
  được quét. Axe chỉ đúng phần tử và số đo: `<p class="text-xs text-zinc-500 …>` của màn "chưa
  có lỗi nào" chỉ đạt **5.94:1** (fg `#8092aa` / bg `#0a1023`), cần ≥ 7:1 — hỏng ở CẢ 5 theme vì
  `text-zinc-*` là màu CỨNG của Tailwind, không đi qua token nên không đổi theo theme. Sửa theo
  CLAUDE.md §4.5: mọi `<p>` nội dung của trang chuyển sang token `text-content` /
  `text-content-secondary`. KHÔNG đụng token dùng chung (không token nào sai), KHÔNG gỡ route
  khỏi spec. Đo lại: `-g "so-tay-loi-sai"` trên cả hai bộ a11y → **10/10 xanh** (5 theme × 2 bộ).
- **Không sửa `learningReadModelService.ts`** (nợ cột `stats`): S12 không dùng service này làm
  nguồn, nợ vẫn mở như đặc tả §8 ghi.

## Bằng chứng kiểm chứng

- `npm run migrate:pg` chạy **2 lần** trên Postgres thật: lần 1 áp `0084`, lần 2 "không có gì mới".
- `npm run typecheck` · `npm run lint` (0 cảnh báo) · `npx prettier --check .` · `npm run test:coverage`.
- E2E: `e2e/mistake-bank.spec.ts` (4 ca, mới) · `e2e/review-hub.spec.ts` · `e2e/a11y.spec.ts` +
  `e2e/a11y-aaa.spec.ts` (thêm route `/so-tay-loi-sai`).
- Ảnh Tầng 8b 1440 / 390 / 320 px, trước–sau (dán trong mô tả PR).

## Rollback

```sql
alter table english.mistakes drop column if exists attempt_id, drop column if exists content_id, drop column if exists subject_id;
```

Cột nullable/có default nên revert mã trước, drop cột sau đều an toàn.
