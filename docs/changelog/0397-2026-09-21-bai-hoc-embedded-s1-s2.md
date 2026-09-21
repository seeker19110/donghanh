# 0397 — Bài học thật chặng `embedded-s1` và `embedded-s2`

- Ngày: 2026-09-21
- PR: #TBD
- Đặc tả: `docs/specs/2026-09-21-embedded-s1-s4-bai-hoc-that.md` (Approved for implementation)

## Việc đã làm

Hướng `embedded` (Nhúng & IoT) trước đợt này HOÀN TOÀN TRẮNG — có bản đồ bốn chặng nhưng chưa có
bài học thật nào. PR này lấp hai chặng đầu: **8 unit `p6-u258`…`p6-u265`, 16 lesson Python**, mỗi
unit bám đúng MỘT module của chặng (không gộp module, vì bốn cơ chế mỗi chặng tách bạch rõ).

- `embedded-s1` — `p6-u258` GPIO/chân thả nổi + ngân sách log UART · `p6-u259` bảng địa chỉ I2C
  theo datasheet + dải PWM · `p6-u260` ISR ngắn/hàng đợi có trần + chống dội phím · `p6-u261` cô
  lập lỗi phần cứng-phần mềm + sổ bằng chứng đo.
- `embedded-s2` — `p6-u262` ngân sách ngăn xếp RTOS + đảo ưu tiên · `p6-u263` khung có checksum +
  đệm cục bộ khi mất kết nối · `p6-u264` cập nhật từ xa A/B (chữ ký, quay lui) · `p6-u265` ngân
  sách pin ra số ngày + ngủ sâu.
- Khuôn dùng chung mới `lessons/embeddedLessonFactory.ts` — nhãn MÔ PHỎNG của hướng này nói rõ
  "không chạm bo mạch/vi điều khiển/bus thật", vì đó là hiểu nhầm nguy hiểm nhất của người học
  nhúng.
- Hai semantic gate mới: `embeddedS1Lessons.test.ts`, `embeddedS2Lessons.test.ts`.
- Nối `SPEC_STAGE_UNITS['embedded-s1'|'embedded-s2']`, đăng ký 8 unit vào `lessons.ts` +
  `curriculum.ts` (bậc P6), sinh lại `lessonsLazy.ts` bằng `npm run gen:lesson-index`.

## Quyết định

- **KHÔNG nối `embedded-s1..s2` vào bất kỳ `learningPaths/*.ts`** — theo quyết định đã duyệt ở
  mục ⑧ của đặc tả: hướng đứng độc lập, học viên vào qua trang hướng chuyên sâu.
- **Không sửa/hạ chuẩn rubric phần cứng thật** trong `embedded.ts` và `specializations/details/*`
  (72 giờ chạy liên tục, ảnh chụp máy phân tích logic, đo dòng thật) — chúng vẫn là bằng chứng
  NGOÀI sandbox; lesson chỉ dạy cơ chế quyết định.
- Mọi simulator dùng lại bảng quyết định đã chốt ở `devops-s3` (`allow`/`deny`/`reject`/`refuse`/
  `rollback`/`unknown`/`invalid`) để ngôn ngữ nhất quán xuyên các hướng hạ tầng/hệ thống.

## Bằng chứng kiểm chứng

- `npm run gen:lesson-index` → `533 bài · 238 unit`, diff chỉ hiện phần sinh.
- `npx vitest run` trên 5 file liên quan (hai gate mới + `lessonsPython` + `stageUnits` +
  `lessonsLazy`) → **5 file, 1081 test xanh**. `lessonsPython.test.ts` chạy Python THẬT nên mọi
  code mẫu và ca Predict đều đã qua toàn bộ test-case.
- `npm run typecheck` · `npm run lint` (max-warnings 0) · `npm run format:check` · `npm test` ·
  `npm run build` — xanh, chi tiết ở mô tả PR.
