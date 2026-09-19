# 0380 — 2026-09-19 — Audit sâu UI/UX: mục lục nhảy nhanh trang cấp CEFR + sửa thông điệp bộ lọc rỗng sai logic

## Việc đã làm

Người dùng yêu cầu "audit sâu giao diện và trải nghiệm người dùng". Chạy audit theo Tầng 8b
(`docs/framework/QUY-TRINH-AUDIT.md`): chụp ảnh thật 1440px + 390px `fullPage` cho 13 trang trụ
cột (trang chủ, hub môn học, 3 chế độ học tiếng Anh, lộ trình CEFR, môn Lập trình, hồ sơ, các
trụ Career/Work/Startup/Life, Companion), đo chiều cao bằng máy, trả lời đủ 4 câu hỏi bắt buộc
của Tầng 8b trên mỗi ảnh. Audit là ĐỌC + BÁO CÁO trước, chờ người dùng duyệt việc nào sửa
(mục 1, mục 2 của báo cáo) — hai việc còn lại (banner "Sắp ra mắt" ở `/luyen-noi`, toast đồng bộ
lặp lại mỗi lần điều hướng, vài màn lỗi API nghi do giới hạn môi trường chụp không backend thật)
để nguyên, chưa sửa.

Hai việc được duyệt sửa trong đợt này:

1. **`apps/dhcb/src/pages/subjects/english/CefrLevelPage.tsx`** — trang một cấp CEFR (vd
   `/lo-trinh-hoc/a1`) đo được cao **1440×5584 · 390×6650** (≈6–8 lần khung nhìn), tab "Bài học"
   liệt kê phẳng 15+ "Phần" không có cách nhảy nhanh, chỉ cuộn tay — đúng câu hỏi 2 của Tầng 8b.
   Thêm khối `<details>` "Mục lục N phần" (thu gọn mặc định, chỉ hiện khi >4 unit để không chiếm
   chỗ ở cấp ít unit) ngay dưới thẻ "Học tiếp", mỗi mục bấm `scrollIntoView({behavior:'smooth'})`
   tới đúng `id={cefr-unit-<unitId>}` gắn trên từng `UnitSection` (cả nhánh thu gọn "đã xong" và
   nhánh mở rộng). Thêm `scroll-mt-20` để không bị thanh tab sticky che mất tiêu đề khi cuộn tới.
   Chủ đích **KHÔNG** đổi kiến trúc accordion/sidebar theo mẫu `/lap-trinh/p1` (`ProgrammingLevelPage.tsx`)
   — trang này nhiều state phiên học/tiến độ hơn, đổi kiến trúc là việc lớn rủi ro cao hơn, nên
   chọn cách thêm mục lục nhảy nhanh thuần cộng thêm, không đụng logic/state hiện có. Đã chụp lại
   ảnh xác nhận: chiều cao gần như không đổi (1440×5654, +70px do panel đóng), mục lục hiện đúng
   vị trí, không phá layout.
2. **`apps/dhcb/src/pages/learning/Subjects.tsx`** (trang `/goc-hoc-tap`) — khi bộ lọc "Tất cả
   môn" đang được chọn mà danh mục rỗng, thông báo cũ luôn nói "Thử chọn 'Tất cả môn'" — sai logic
   vì người dùng đang chọn đúng bộ lọc đó rồi. Tách theo `filter === 'all'`: còn "Tất cả môn" thì
   nói thẳng "Hiện chưa có môn học nào trong danh mục.", chỉ gợi ý đổi bộ lọc khi đang lọc
   Ngôn ngữ/STEM. Cập nhật `Subjects.test.tsx` cho cả hai nhánh.

## Issue / outcome

Trước: trang cấp CEFR không có cách nào tới thẳng một Phần giữa danh sách dài ngoài cuộn tay;
thông báo rỗng ở hub môn học gợi ý người dùng làm lại đúng thao tác họ vừa làm. Sau: có mục lục
nhảy nhanh; thông điệp khớp đúng trạng thái bộ lọc đang chọn.

## Research / spec

Không có đặc tả trước (phát hiện qua audit UI/UX trong phiên, không phải tính năng theo kế hoạch)
— đúng tinh thần mục 11 CLAUDE.md dùng `fix`/`refactor` cho việc không có đặc tả trước.
`docs/framework/QUY-TRINH-AUDIT.md` Tầng 8b là quy trình audit đã dùng.

## Validation

`npm run typecheck` 0 lỗi (2 file sửa) · `npx eslint <3 file> --max-warnings 0` sạch ·
`npx vitest run apps/dhcb/src/pages/learning/Subjects.test.tsx` 11/11 xanh (thêm 1 test mới,
sửa 1 test cũ cho đúng ngữ nghĩa) · `npx vitest run apps/dhcb/src/pages/subjects/english` 5/5
xanh · chụp ảnh Playwright thật (Tầng 8b) xác nhận mục lục hiện đúng, chiều cao trang không đổi
bất thường.

## Rủi ro, rollout và rollback

Rủi ro thấp: cả hai đều là thay đổi cộng thêm (mục lục) hoặc sửa chuỗi hiển thị (thông điệp),
không đổi schema/API/logic nghiệp vụ. Rollback: revert commit, không có migration.

## Definition of Done

- [x] Mục lục nhảy nhanh hoạt động đúng, không phá layout 390px/1440px (đã chụp ảnh xác nhận)
- [x] Thông báo bộ lọc rỗng khớp đúng trạng thái filter đang chọn, có test canh
- [x] typecheck/lint/test xanh cho các file đã sửa
- [x] Các phát hiện còn lại của audit (banner "Sắp ra mắt", toast lặp, màn lỗi API nghi do môi
      trường audit) CHƯA sửa — chờ người dùng quyết định, ghi lại ở PROGRESS.md
