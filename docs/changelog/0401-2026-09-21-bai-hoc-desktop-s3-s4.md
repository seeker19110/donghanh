# 0401 — 2026-09-21 — Bài học thật chặng `desktop-s3` và `desktop-s4`

- **PR:** (điền số sau khi tạo)
- **Đặc tả:** `docs/specs/2026-09-21-desktop-s1-s4-bai-hoc-that.md` (Approved for implementation, 2026-09-21)
- **PR trước cùng đặc tả:** `docs/changelog/0399-2026-09-21-bai-hoc-desktop-s1-s2.md`

## Việc đã làm

Khép nốt hướng Desktop: sau PR này hướng có **4/4 chặng có bài học thật**, không còn mảng trắng nào.

- Thêm 8 unit `p6-u282…p6-u289`, mỗi unit 2 bài, tổng 16 bài Python MÔ PHỎNG:
  - `desktop-s3`: dữ liệu lớn trên máy đơn (ngân sách nạp tệp, ảo hoá danh sách, chỉ mục toàn văn
    và chỉ mục cũ hơn dữ liệu) · tối ưu khởi động và bộ nhớ (ngân sách `startupMs`/RAM nghỉ, và
    cách ĐO cho ra số đáng tin: đủ mẫu, trung vị, máy cấu hình thấp) · hệ plugin (hộp cát là luật
    tuyệt đối, phiên bản API, plugin crash trong hộp cát là `allow: host survives`, quyền tối
    thiểu) · kiểm thử desktop (ma trận ba nền tảng + luồng cài đặt/cập nhật, test giao diện ổn
    định thay vì chờ theo giây).
  - `desktop-s4`: phân phối và cấp phép (phát hiện lùi đồng hồ, giấy phép, kích hoạt offline, dùng
    thử và hoàn tiền) · cập nhật an toàn (health-check đỏ → `rollback` ưu tiên tuyệt đối,
    `rolloutPercent` ngoài miền → `invalid`, di trú dữ liệu có đường hạ cấp) · bảo mật máy khách
    (chữ ký, quyền quản trị, phụ thuộc có lỗ hổng, dữ liệu rời máy phải có cho phép + mã hoá +
    phạm vi tối thiểu) · hỗ trợ người dùng (triage có che nội dung người dùng, đòi gói chẩn đoán,
    `affectedUserCount`; lộ trình theo bằng chứng chứ không theo người nói to nhất).
- Thêm hai semantic gate `desktopS3Lessons.test.ts` / `desktopS4Lessons.test.ts` cùng khuôn với
  hai gate của PR trước.
- Nối `SPEC_STAGE_UNITS['desktop-s3'|'desktop-s4']`, đăng ký vào `lessons.ts`, gắn vào bậc P6
  trong `curriculum.ts`, sinh lại `lessonsLazy.ts`.

## Quyết định

- Giữ nguyên hai quyết định của PR trước: **một unit một module**, và **KHÔNG nối `desktop-*` vào
  `learningPaths/*.ts`** (quyết định ⑧.2 của đặc tả).
- `rollback` là **kết luận hợp lệ**, không phải thất bại — chỉ dùng ở `desktop-s4-m2`, nơi máy
  người dùng đã nhận bản hỏng và không sửa nóng được như web.
- Mọi ngưỡng số (500MB tệp lớn, 10000 dòng, 2000ms khởi động, 400MB RAM nghỉ, 10 mẫu đo, 5% flaky,
  14 ngày hoàn tiền, 5 người yêu cầu) là hằng số DẠY HỌC, nêu rõ trong `theory`.

## Bằng chứng kiểm chứng

- `npm run gen:lesson-index` → `549 bài · 246 unit`
- `npx vitest run` cho `desktopS3Lessons` · `desktopS4Lessons` · `stageUnits` · `lessonsLazy` ·
  `lessonsPython` → **1131/1131 xanh** (trong đó `lessonsPython` chạy `python3` thật)
- `npm run typecheck` · `npm run lint` · `npm run format:check` · `npm test` · `npm run build` →
  xem bảng trong mô tả PR
