# 0404 — 2026-09-21 — Bài học thật cho hai chặng cuối hướng Hệ thống (`systems-s3`, `systems-s4`)

> PR: (điền khi merge) · Đặc tả: `docs/specs/2026-09-21-systems-s3-s4-bai-hoc-that.md`
> (Approved for implementation, 2026-09-21)

## Việc đã làm

Lấp hai chặng rỗng cuối cùng của hướng Hệ thống: **8 unit / 16 bài Python MÔ PHỎNG**, mỗi unit
bám đúng MỘT module của chặng (không gộp module nào).

| Unit      | Module          | Cơ chế mô phỏng                                               |
| --------- | --------------- | ------------------------------------------------------------- |
| `p6-u234` | `systems-s3-m1` | Dòng cache, bước nhảy truy cập, false sharing                 |
| `p6-u235` | `systems-s3-m2` | Nhiễu vi chuẩn quanh trung vị, định luật Amdahl               |
| `p6-u236` | `systems-s3-m3` | Thrash bộ nhớ ảo, cách ly địa chỉ, mật độ syscall             |
| `p6-u237` | `systems-s3-m4` | Hàng rào bộ nhớ, hàng đợi lock-free (rỗng/tràn)               |
| `p6-u238` | `systems-s4-m1` | Bảng ký hiệu (`undeclared-var`), kiểm kiểu (`type-error`)     |
| `p6-u239` | `systems-s4-m2` | GC mark-sweep có chu trình, máy ảo ngăn xếp (`stack-error`)   |
| `p6-u240` | `systems-s4-m3` | Bảng trang hai tiến trình, lập lịch vòng tròn, context switch |
| `p6-u241` | `systems-s4-m4` | Stack canary / ASLR, fuzzing theo độ phủ (`plateau`)          |

- Thêm 8 file `packages/subject-programming/lessons/p6u234.ts … p6u241.ts` + khuôn chung
  `lessons/systemsS3S4LessonFactory.ts` (16 bài cùng hình dạng "đọc fixture → in một dòng
  quyết định", viết vỏ 8 bước một lần thay vì chép 16 lần — đúng tiền lệ `devopsS1LessonFactory.ts`).
- Semantic gate riêng `packages/subject-programming/systemsS3S4Lessons.test.ts`: 16 bài, mỗi unit
  2 bài, mỗi bài có ca hiện + ca ẩn + **ca âm**, `match: 'contains'`, chuỗi cấm
  (`import os`/`open(`/`socket`/`subprocess`/`ctypes`/`threading`/`random`…) không xuất hiện trong
  code thực thi, marker nghiệp vụ bắt buộc theo từng unit, và hai ca fail-closed nguy hiểm nhất
  (vi phạm cách ly bộ nhớ ở u236, tràn bộ đệm không bị phát hiện ở u241).
- Nối `SPEC_STAGE_UNITS['systems-s3'|'systems-s4']`, đăng ký registry `lessons.ts`, thêm 8 unit
  vào bậc P6 trong `curriculum.ts`, sinh lại `lessonsLazy.ts` bằng `npm run gen:lesson-index`.

## Quyết định

- **KHÔNG nối hai chặng vào bất kỳ `learningPaths/*.ts` nào** — theo mục ⑧ của đặc tả (hướng
  `systems` đứng độc lập, vào qua trang hướng chuyên sâu; nối vào lộ trình sẽ đổi mẫu số tiến độ
  hiển thị và cần một đợt có đặc tả riêng).
- Không đụng `systems-s1`/`systems-s2` đã phát hành; dải unit id `p6-u234…u241` đúng như đặc tả
  đã khoá, không tái dùng id cũ.
- Ranh giới MÔ PHỎNG giữ nguyên như `systems-s1`: không biên dịch C/Rust, không perf/eBPF/QEMU/
  fuzzer/nhân thật. Rubric project của hai chặng (tăng tốc ≥ 5 lần đo thật, nhân chạy trên QEMU)
  vẫn là artifact NGOÀI sandbox ở `details/systems-s3.ts`/`systems-s4.ts`.

## Bằng chứng kiểm chứng

- `npm run gen:lesson-index` → `Đã sinh packages/subject-programming/lessonsLazy.ts: 533 bài · 238 unit`
- `npx vitest run systemsS3S4Lessons.test.ts lessonsPython.test.ts stageUnits.test.ts lessonsLazy.test.ts`
  → 1078 test xanh (1048 ca của cổng Python chạy THẬT bằng `python3`)
- `npm run typecheck` → exit 0 · `npm run lint` → exit 0 (max-warnings 0) · `npm test` → toàn bộ xanh
- `npm run build` → exit 0

## Rủi ro còn lại

Người học có thể nhầm simulator (cache, GC, nhân, fuzzing mô phỏng) với công cụ thật. Ba lớp
chặn: nhãn MÔ PHỎNG trong tiêu đề/lý thuyết/đề bài (semantic gate ép), phần "ứng dụng về nhà"
của cả 16 bài đều yêu cầu làm NGOÀI sandbox bằng công cụ thật, và rubric project của chặng.
