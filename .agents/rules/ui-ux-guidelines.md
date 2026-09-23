---
description: 'Quy chuẩn UI/UX Đồng Hành — áp dụng cho frontend apps/dhcb/src/** và apps/hub/src/**'
---

# UI/UX FRONTEND RULE — ĐỒNG HÀNH

Khi tạo/sửa/review UI trong `apps/dhcb/src/**` hoặc `apps/hub/src/**`:

1. **Context trước style.** Xác định app, persona/job, device/network, information shape và dominant
   risk. Viết một dominant intent 2–5 từ.
2. **Route quyết định.** Đọc `docs/ui-ux/decision-contract.json` + profile trong
   `docs/ui-ux/apps/`; áp `must-have` và condition match. Không lấy external style preset làm
   điểm xuất phát.
3. **Source of truth.** Token/theme nằm ở `packages/core-ui/theme.css` + Tailwind mapping hiện hữu.
   Không tạo palette/font/spacing source thứ hai; không hardcode hex trong component.
4. **State theo capability.** Xét loading, empty, data/success, error/retry, validation/conflict,
   offline/queued, permission/limit. Không áp “5 states” máy móc nếu state không tồn tại; ghi N/A.
5. **A11y/ergonomics.** Semantic HTML, visible label, accessible name, focus-visible tức thì,
   keyboard order, reduced-motion, không color-only; action mobile chính >=44px.
6. **Motion có nghĩa.** Không thêm `transition-all`; chọn property cụ thể. Pulse/glow/scale chỉ khi
   truyền state/priority thật, không decoration mặc định.
7. **Learning/Companion.** Reading ưu tiên readability; voice phải hiểu được khi motion tắt;
   gamification không che task; AI output không giả authoritative progress/payment state.
8. **Trust/data.** Payment/account có status + recovery rõ; data-heavy UI ưu tiên scanability,
   tabular number và chart semantics hơn decorative card layout.
9. **Review một outcome mỗi lượt.** Ví dụ: “keyboard error summary”, “mobile voice latency”,
   “lesson long reading”; không gom mọi checklist vào một pass.
10. **Verify.** Chạy `npm run check:ui-ux`, `npm run lint`, `npm run typecheck`; thay đổi flow
    quan trọng chạy E2E/axe liên quan.

Chi tiết: `.agents/skills/ui-ux-craftsman/SKILL.md` và `docs/ui-ux/README.md`.
