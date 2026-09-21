# 0398 — 2026-09-21 — Bài học thật chặng `game-s3` và `game-s4` (khép kín hướng Lập trình Game)

PR: (điền sau khi mở) · Nhánh: `claude/bai-hoc-game-s3-s4` (nhánh từ `claude/bai-hoc-game-s1-s2`)
Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md` (Approved for implementation, 2026-09-21)

## Việc đã làm

PR thứ hai và cuối của đặc tả. Sau PR này hướng `game` có bài thật ở **đủ bốn chặng S1–S4**,
không còn là một trong ba hướng rỗng hoàn toàn.

- 8 unit mới, mỗi unit bám ĐÚNG một module, mỗi unit 2 lesson Python:
  - `game-s3` → `p6-u250` đường ống dựng hình (gộp lô draw call, thứ tự vẽ đục/trong suốt) ·
    `p6-u251` shader (ngân sách mili-giây khai báo, loại biến uniform/theo đỉnh) · `p6-u252`
    hiệu năng (cắt tỉa trước LOD, ngân sách khung hình 16,6ms chia CPU/GPU) · `p6-u253` 3D nền
    tảng (chuẩn quaternion, hoà trộn hoạt ảnh cùng hệ xương).
  - `game-s4` → `p6-u254` mạng (server quyết định, sequence chống phát lại, chống gian lận) ·
    `p6-u255` công cụ và quy trình đội (đường ống build, ngưỡng tệp lớn) · `p6-u256` thiết kế có
    số liệu (tỉ lệ bỏ cuộc, ngưỡng mẫu là `unknown`, tiêu chí kiếm tiền bóc lột, trần lạm phát) ·
    `p6-u257` phát hành thương mại (checklist nền tảng, bản địa hoá tràn khung UI).
- Nối `SPEC_STAGE_UNITS['game-s3'|'game-s4']`, `lessons.ts`, `curriculum.ts`; sinh lại
  `lessonsLazy.ts` (`npm run gen:lesson-index` → 549 bài · 246 unit).
- Cổng ngữ nghĩa mới `gameS3S4Lessons.test.ts`, canh thêm hai bất biến nặng của lát cắt này:
  `game-s4-m1` server luôn là bên quyết định (mọi output thuộc {allow, deny, reject, invalid},
  không nhánh nào để client tự áp dụng) và `game-s4-m3` ca `unknown` do mẫu dưới ngưỡng KHÔNG
  được kèm bất kỳ con số nào.

## Quyết định

- Không GPU/shader/engine/mạng thật trong sandbox: "shader" là hàm khai báo chi phí mili-giây,
  "khung hình" là số nguyên, độ trễ mạng là tham số của hàm thuần. Phần thật nằm ở homework.
- Giữ nguyên quyết định mục ⑧: KHÔNG nối `game-s*` vào `learningPaths/` nào.

## Bằng chứng kiểm chứng

- `npm run gen:lesson-index` → "Đã sinh packages/subject-programming/lessonsLazy.ts: 549 bài · 246 unit"
- `npx vitest run gameS3S4Lessons.test.ts` → 10/10 xanh
- `npx vitest run lessonsPython.test.ts lessons.test.ts curriculum.test.ts specializations.test.ts unitTracks.test.ts` → 1136/1136 xanh (Python thật)
- `npm run typecheck` → 0 lỗi · `npm run lint` → 0 cảnh báo · `npm test` → xanh · `npm run build` → xanh
