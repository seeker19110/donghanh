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

## Quyết định đã chốt trong đợt (chủ dự án, 2026-09-17)

- **Nới trần Initial JS 140 → 150 kB** (`.size-limit.json`) để có chỗ cho các lát P0 (avatar +
  bong bóng Companion, màn guest). Đang 135,4 kB → dư ~14,6 kB; mốc cảnh báo 95% = 142,5 kB. Cập
  nhật dòng trạng thái `PROGRESS.md` và mục G của tài liệu. CSS giữ 20 kB.
- Bổ sung mục F4 "URL của các màn hình mới": chỉ 2 route thật thêm (`/thu-ngay/*` cho demo
  guest), còn lại dùng lại URL sẵn có (`/` cho cả guest, `?xong=1` cho màn sau phiên,
  `/ban-dong-hanh?hoi=`), theo quy ước slug/`<mã>--<slug>` của `CLAUDE.md` mục 7.

## Quyết định chờ chủ dự án

Tài liệu là bản đề xuất, CHƯA "Approved for implementation". Ba điểm cần quyết ở mục G của tài
liệu: đổi nhãn/route điều hướng làm PR riêng, hạ "Nâng cấp" khỏi nhóm chính
sidebar, màu ấm cho theme `kid`.

## Kiểm chứng

Tài liệu + `.size-limit.json`: `npx prettier --check` các file sửa + `npx vitest run scripts/changelog.test.ts`.
