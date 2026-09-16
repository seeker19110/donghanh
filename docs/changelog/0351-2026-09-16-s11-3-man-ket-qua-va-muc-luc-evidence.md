# 0351 — S11-3: màn kết quả `ActivityResult` và mục lục STEM đọc evidence

- **Ngày:** 2026-09-16
- **PR:** #969
- **Đặc tả:** [`docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md`](../specs/2026-09-15-learning-ux-s11-completion-evidence.md) §9 mục 3 (AC-14 → AC-18)
- **Slice:** S11-3 — slice CUỐI của S11 (S11-1 `0333`, S11-2 `0348`)

## Việc đã làm

1. **`apps/dhcb/src/components/learning/ActivityResult.tsx`** — màn kết quả dùng chung. Năm
   trạng thái ĐỀU CÓ CHỮ: `passed` (server nói đạt) · `failed` · `local` (khách chấm ở máy) ·
   `pending` (chưa gửi được, phân biệt hết-phiên với mất-mạng) · `error` (server từ chối). Lý
   do sai dịch từ `ReasonCode` của engine chấm sang tiếng Việt ("Thiếu đơn vị", "Chưa tối
   giản"…) — **không gọi AI**. Nút "Làm lại" (lượt sau sinh `attemptId` MỚI) và "Bài tiếp
   theo" (lấy từ `prevNext` của cây S07). Prop `reviewSlot` để trống cho S12.
2. **`apps/dhcb/src/lib/stemResultView.ts`** — hàm THUẦN ánh xạ `SubmitEvidenceResult` → props
   màn kết quả, ghép chi tiết từng câu theo `questionIndex` (không theo thứ tự mảng).
3. **`packages/core-learner/outline/stemOutline.ts`** — `StemOutlineCtx` nhận thêm hai trường
   TUỲ CHỌN `state`/`stateStatus`; chữ ký cũ không đổi (S07-2 và `buildIntentOutlines` chạy
   nguyên).
4. **`apps/dhcb/src/lib/useStemCompletionState.ts`** — đọc `completion_state` một lần khi mở
   trang và lại sau mỗi lượt nộp; không polling. Dùng chung cho `StemLessonList` và
   `StemLessonView`; `stateStatus === 'error'` thì mục lục hiện `LoiTienDo` mời thử lại.

## Quyết định

- **Ba test cũ đổi CÁCH ĐO, không đổi điều được canh.** Chúng đếm mọi request tới
  `/api/learning/evidence`; từ S11-3 trang có đọc trạng thái bằng **GET** (AC-15 đòi đúng thế),
  nên phép đếm cũ bắt nhầm cả việc đọc. Nay đếm **POST** — evidence chỉ sinh ra bởi POST, nên
  bất biến §⑤ ("mở bài / click / AI không sinh evidence") được canh đúng chỗ hơn trước.
- **Chỉ LÁ mang tiến độ.** Nút chương/lớp giữ `unknown`: `OutlineTree` chỉ vẽ huy hiệu trạng
  thái ở lá, tổng hợp lên chương là việc chưa có đặc tả nào yêu cầu.
- **S11 vẫn KHÔNG ghi SRS.** `reviewSlot` để trống; việc gọi `addStemLessonCardsToSrs` (chỉ khi
  `kind === 'server' && passed`) là của S12.

## Bằng chứng kiểm chứng

- `npm run typecheck` ✅ · `npm run lint` ✅ 0 cảnh báo · `npx prettier --check .` ✅
- `npm run test:coverage` ✅ — 13.665 test xanh; 94,29 / 90,18 / 94,79 / 94,80 (sàn 93/89/93/93).
  File mới: `stemResultView.ts` 100/94,4/100/100 · `useStemCompletionState.ts` 100/95,5/100/100
  · `stemOutline.ts` 100/90,9/100/100.
- E2E `stem-evidence.spec.ts` 4/4 ✅ · `outline-stem.spec.ts` 7/7 ✅ (kể cả ca "MỞ BÀI KHÔNG
  PHẢI LÀ HỌC XONG").
- a11y `a11y.spec.ts` + `a11y-aaa.spec.ts`, khối màn kết quả mới: **10/10 xanh, 0 vi phạm**,
  đủ 5 theme.
- Tầng 8b: ảnh 1440 · 390 · 320, TRƯỚC/SAU, đủ **bốn trạng thái** (chưa nộp · nộp đạt · nộp
  không đạt · chờ gửi) — dán trong mô tả PR.
