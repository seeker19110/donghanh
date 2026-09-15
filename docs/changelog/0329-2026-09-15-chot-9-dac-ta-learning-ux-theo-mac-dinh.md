# 0329 — 2026-09-15 — Chốt 9 đặc tả learning-ux theo đề xuất mặc định

**PR:** (điền khi tạo) · **Loại:** docs-only, không source/schema/dependency.

## Đã làm

- Chủ dự án chốt: **lấy toàn bộ cột "Đề xuất của AI (mặc định)" ở §7 làm quyết định cuối** cho cả
  9 đặc tả slice của goal `docs/goals/2026-09-15-learning-ux.md` (S07, S05, S06, S08, S09, S10,
  S11, S12, S13). Không có ý kiến khác trên bất kỳ câu hỏi nào.
- Mỗi file đặc tả: trạng thái `In review` → **`Approved for implementation`**, thêm dòng ghi chốt
  ngay dưới tiêu đề §7, tick đủ ô §19 (Product outcome · UX/a11y · Architecture · Test/rollout),
  điền người duyệt + ngày.
- Bảng goal: cột State của S05–S13 đổi `SPEC` → **`READY`**, link đặc tả ghi
  `(Approved for implementation)`.

## Quyết định

- Thứ tự thi hành giữ nguyên như đã chốt 2026-09-15: **S07 → S08 → S06 → S05 → S10 → S11 → S09 →
  S12 → S13**; trong mỗi slice các PR vẫn TUẦN TỰ (PR sau đọc hợp đồng PR trước).
- Số migration đã đặt trước, không đổi: S05 `0081` · S11 `0082` · S09 `0083` · S12 `0084`.
- Mỗi PR giao MỘT subagent, agent chính review diff + cổng trước khi merge.

## Validation (docs-only)

- `npx prettier --check` các file đổi: PASS.
- `npx vitest run scripts/changelog.test.ts`: PASS.
