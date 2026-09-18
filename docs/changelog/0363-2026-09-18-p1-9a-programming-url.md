# 0363 — 2026-09-18 — P1-9a: URL môn Lập trình về Góc học tập

PR: (điền số PR khi mở)

## Việc đã làm

- Đổi route chuẩn của môn Lập trình sang `/goc-hoc-tap/programming` và các nhánh con.
- Giữ alias `/lap-trinh/*` bằng redirect có kiểm tra, bảo toàn query string và không redirect vòng.
- Cập nhật page, breadcrumb, navigation, outline, review queue, resume point và today plan để
  sinh URL chuẩn thống nhất.
- Cập nhật test contract cho route chuẩn và alias legacy.

## Chưa làm / nợ để lại

- E2E dùng URL legacy cần được rà lại trong lát tích hợp routing; alias vẫn được giữ để tương thích.
- `learningReadModelService.ts` vẫn chờ quyết định semantics cho các trường summary; không thuộc lát
  P1-9a.

## Bằng chứng đã chạy

- Targeted Vitest: **126/126 pass**.
- TypeScript app: **pass** (`tsc --noEmit -p apps/dhcb/tsconfig.json`).
- Lint: **pass**.
- Prettier và `git diff --check`: **pass**.
- Full `npm test` chưa đạt do failure/timeout tồn tại ngoài lát route, nổi bật
  `scripts/report-status.test.ts` và bộ test Python chạy lâu.
