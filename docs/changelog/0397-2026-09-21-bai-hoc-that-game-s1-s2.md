# 0397 — 2026-09-21 — Bài học thật chặng `game-s1` và `game-s2` (hướng Lập trình Game)

PR: (điền sau khi mở) · Nhánh: `claude/bai-hoc-game-s1-s2`
Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md` (Approved for implementation, 2026-09-21)

## Việc đã làm

Hướng `game` trước đợt này HOÀN TOÀN TRẮNG: bản đồ 4 chặng × 4 module đầy đủ nhưng không một
unit bài học nào, nên học viên chọn hướng này gặp mảng rỗng. PR này lấp hai chặng đầu.

- 8 unit mới, mỗi unit bám ĐÚNG một module (không gộp), mỗi unit 2 lesson Python theo vòng 8 bước:
  - `game-s1` → `p6-u242` vòng lặp game (delta time, máy trạng thái nhân vật, nhập liệu trừu
    tượng) · `p6-u243` toán cho game (chuẩn hoá véc-tơ, AABB, va chạm hình tròn, nội suy camera)
    · `p6-u244` cảm giác chơi (coyote time, jump buffer, tham số gia tốc/ma sát) · `p6-u245`
    tài nguyên và phát hành (ngân sách atlas, bản lưu có phiên bản).
  - `game-s2` → `p6-u246` kiến trúc ECS (lọc theo thành phần, luật ghi) · `p6-u247` vật lý bước
    cố định và phát lại tất định (bộ tích luỹ, hash trạng thái) · `p6-u248` AI trong game (tầm
    quan sát, tìm đường A*) · `p6-u249` nội dung và công cụ (validator màn chơi, hạt giống).
- Mọi simulator là MÔ PHỎNG Python thuần, tất định, bounded, fail closed; mỗi Make có ca hiện,
  ca ẩn và ca âm `invalid:`; output một dòng `"<decision>: <reason>"`.
- Nối `SPEC_STAGE_UNITS['game-s1'|'game-s2']`, `lessons.ts`, `curriculum.ts` (bậc P6); sinh lại
  `lessonsLazy.ts` bằng `npm run gen:lesson-index`.
- Cổng ngữ nghĩa mới `gameS1S2Lessons.test.ts`: cấm I/O ngoài/mạng/đồng hồ hệ thống, buộc mọi
  ngẫu nhiên đi qua `random.Random(seed)` cục bộ (chỉ `p6-u249`), buộc nhãn MÔ PHỎNG và buộc mỗi
  bài có mốc bài tập NGOÀI sandbox (Godot/Unity thật).
- `specializations/stageUnits.test.ts`: `specHasLessons('game')` đổi từ `false` sang `true`, ca
  "hướng chưa có bài" chuyển sang `embedded`.

## Quyết định

- KHÔNG nối `game-s*` vào bất kỳ `learningPaths/*.ts` nào (mục ⑧ của đặc tả, chủ dự án duyệt):
  hướng game đứng độc lập, vào qua trang hướng chuyên sâu.
- Không chạy engine/GPU/shader/thiết bị thật trong sandbox; phần đó nằm ở rubric bài tập về nhà.

## Bằng chứng kiểm chứng

- `npm run gen:lesson-index` → "Đã sinh packages/subject-programming/lessonsLazy.ts: 533 bài · 238 unit"
- `npx vitest run gameS1S2Lessons.test.ts specializations/stageUnits.test.ts lessonsLazy.test.ts` → 36/36 xanh
- `npx vitest run lessonsPython.test.ts lessons.test.ts curriculum.test.ts specializations.test.ts unitTracks.test.ts` → 1088/1088 xanh (Python thật)
- `npm run typecheck` → 0 lỗi · `npm run lint` → 0 cảnh báo · `npm test` → xanh · `npm run build` → xanh
