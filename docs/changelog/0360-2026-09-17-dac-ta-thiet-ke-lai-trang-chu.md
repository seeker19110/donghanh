# 0360 — 2026-09-17 — Đặc tả thiết kế lại Trang chủ & trải nghiệm học cốt lõi

**PR:** (điền khi tạo) · **Loại:** docs (research), không đổi mã.

## Việc đã làm

Viết `docs/research/thiet-ke-lai-trang-chu-va-trai-nghiem-hoc-2026-09-17.md` theo yêu cầu của
chủ dự án (vai Senior Product Designer + UX Lead): phong cách "Warm Utility", bảng màu (chỉ THÊM
nhóm token `--w-*` cho Companion, giữ nguyên `--a-*`/`--z-*`), thang typography 5 bậc, 6 nguyên
tắc; sơ đồ trang chủ mobile 390px + desktop 1440px; 5 trạng thái (guest · có tiến độ · rỗng ·
trong phiên · sau phiên); tiến độ 3 tầng (bước/nhịp/chuyện), streak dạng 7 chấm tuần, 4 điểm hiện
diện của Companion; header mobile 8 → 4 khe, sidebar 10 → 7 mục; danh sách 15 component, 2 user
flow, ưu tiên P0/P1/P2.

Mọi đề xuất đối chiếu mã thật: `Home.tsx`, `TodayCard.tsx`, `HomeAiBriefingCard.tsx`,
`DesktopSidebar.tsx`, `BottomNav.tsx`, `Layout.tsx`, `GuestBanner.tsx`, `StartByIntent.tsx`,
`packages/core-ui/theme.ts`. Giữ nguyên các luật bất biến: chẩn đoán không phải màn hình chính,
không mặc định tiếng Anh, một CTA, a11y AAA/AA.

## Quyết định chờ chủ dự án

Tài liệu là bản đề xuất, CHƯA "Approved for implementation". Bốn điểm cần quyết ở mục G của tài
liệu: ngân sách bundle mỏng, đổi nhãn/route điều hướng làm PR riêng, hạ "Nâng cấp" khỏi nhóm chính
sidebar, màu ấm cho theme `kid`.

## Kiểm chứng

Chỉ thêm tài liệu: `npx prettier --check` hai file mới + `npx vitest run scripts/changelog.test.ts`.
