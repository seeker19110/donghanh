# 0400 — 2026-09-21 — Tối ưu tải LESSON_INDEX ở Trang chủ (sửa hồi quy CLS PR #1088)

> PR: (điền khi tạo)

## Việc đã làm

CI của PR #1088 (`security-s4`) đỏ ở `e2e/home-clarity-evidence.spec.ts` — CLS đo được `0.1030`
so với ngưỡng `0.1000`. Điều tra (xem comment trên PR #1088) tìm ra nguyên nhân: `useTodayPlan.ts`
(dùng ở Trang chủ) import TĨNH `programmingNext.ts`, kéo theo `lessonsLoader.ts` (LESSON_INDEX —
chỉ mục mọi bài học môn Lập trình) và `curriculum.ts` vào đúng chunk đồng bộ của Trang chủ. Hai
file này cộng dồn ~40KB gzip — gần gấp 3 lần trọng lượng riêng của chunk Home (13.7KB gzip) — và
tăng dần theo MỌI PR thêm bài học P6 (hôm nay: `embedded-s1/s2` + `desktop-s1/s2` + `security-s4`
đẩy chỉ mục từ 541 → 557 bài chỉ trong vài giờ).

**Sửa:** chuyển import `programmingNext` trong `useTodayPlan.ts` từ tĩnh sang `import()` động
(`loadProgrammingNext`, cache bằng module-level promise). `plan` (`useMemo`) chỉ CHỜ module này
khi thật sự có tiến độ Lập trình (`progress.length > 0`) — người chưa động tới môn này không phải
chờ chunk đó tải xong mới thấy Trang chủ. Kết quả build đo được: chunk `Home-*.js` giữ nguyên kích
thước riêng (~14KB gzip, không mất code), nhưng `lessonsLoader`/`curriculum`/`programmingNext*`
không còn nằm trong đồ thị import tĩnh của Home — xác nhận qua `dist/js/Home-*.js` giờ tham chiếu
các chunk đó qua mảng `__vite__mapDeps` (cơ chế preload của `import()` động), không còn `import`
tĩnh chặn parse.

## Bằng chứng kiểm chứng

- `npm run typecheck` — sạch.
- `npm run lint` (max-warnings 0) — sạch.
- `npm run format` — Prettier tự sửa 1 dòng dài, đã commit.
- `npx vitest run apps/dhcb/src/lib/today/ apps/dhcb/src/pages/core/ apps/dhcb/src/lib/programmingNextLesson.test.ts`
  → 13 file, 127 test xanh.
- `npm run build` → xanh; đối chiếu `dist/js/Home-*.js` xác nhận `lessonsLoader`/`curriculum` đã
  chuyển sang preload động (`__vite__mapDeps`), không còn static import.
- **`npx playwright test e2e/home-clarity-evidence.spec.ts -g "attach canonical screenshots"`
  → XANH ở máy** (test đã đỏ 2 lần liên tiếp trên CI của PR #1088 trước khi sửa).

## Quyết định

Chủ dự án chọn phương án tối ưu tải `LESSON_INDEX` (thay vì nới ngưỡng CLS) sau khi được trình bày
hai lựa chọn ở PR #1088.

## Còn để ngỏ

Đây là sửa CỤC BỘ cho đúng đường tải của Trang chủ. `lessonsLoader`/`curriculum` vẫn được các
trang môn Lập trình khác (`ProgrammingHome`, `ProgrammingPathPage`…) import tĩnh — hợp lý vì các
trang đó vốn đã lazy-route và thực sự cần toàn bộ chỉ mục ngay khi mở. Nếu `LESSON_INDEX` tiếp tục
phình (mỗi đợt thêm bài học P6 đều cộng dồn), có thể cần tách nhỏ hơn nữa theo bậc/hướng — chưa
làm ở đợt này vì chưa có bằng chứng cần thiết (post-fix, CLS đã về dưới ngưỡng).
