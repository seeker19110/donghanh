# 0381 — 2026-09-19 — Vá tạm cổng `npm audit` chịu được sự cố hạ tầng registry

## Tóm tắt

Job `audit` trong `.github/workflows/ci.yml` (bước `npm audit --omit=dev`) đỏ đồng loạt trên
`main` và mọi PR đang mở (kể cả PR #1044) do npm registry lỗi hạ tầng: cả endpoint "quick"
(`/security/audits/quick`, npm tự thông báo "This endpoint is being retired") lẫn endpoint
"bulk" thay thế (`/security/advisories/bulk`, thử bằng `npm@11`) đều trả lỗi (400/503) tại thời
điểm phát hiện — không liên quan tới nội dung `package-lock.json` hay diff của bất kỳ PR nào.
Theo yêu cầu chủ dự án ("vá tạm bước npm audit trong ci.yml đi"), sửa bước này để **chỉ** cho
qua khi lỗi đến từ registry (dấu hiệu `audit endpoint returned an error` trong output `npm
audit`), còn lỗ hổng thật tìm thấy hoặc lỗi khác vẫn CHẶN như cũ.

## Issue / outcome

Trước vá: một lần registry npm hỏng là chặn auto-merge của MỌI PR trong repo (cổng `quality`
bắt buộc), vì `npm audit` không phân biệt được "registry lỗi" với "có lỗ hổng" qua exit code.
Sau vá: registry lỗi → cảnh báo (`::warning::`) + cho qua; lỗ hổng thật hoặc lỗi khác → vẫn đỏ
như trước, không nới lỏng cổng bảo mật thật.

## Research / spec

Không có đặc tả trước — vá hạ tầng CI theo tình huống thực tế phát sinh, dùng `fix` đúng bản
chất theo CLAUDE.md mục 11 BƯỚC 1 (không phải tính năng mới, không cần `docs/specs/`).

## Validation

- Tái hiện lỗi gốc ở máy: `npm audit --omit=dev` → `npm warn audit 400 Bad Request` (registry),
  không phải lỗi lockfile.
- Registry đã tự hồi phục trong lúc chuẩn bị vá (`npm audit --omit=dev` chạy sạch, exit 0) — xác
  nhận script mới vẫn đi đúng nhánh "sạch" (`STATUS -eq 0` → exit 0 ngay, không chạm nhánh vá).
- `npx vitest run scripts/ci-workflow-policy.test.ts` — 7/7 xanh (không phá 4 luật CI ở mục
  11.1: song song, tên job bất biến, E2E chia mảnh, upload chỉ khi đỏ).
- `npm run lint` — xanh (chỉ đổi YAML).

## Rủi ro, rollout và rollback

- **Rủi ro:** nếu dấu hiệu `audit endpoint returned an error` xuất hiện vì lý do KHÁC ngoài lỗi
  registry (ví dụ npm đổi định dạng thông điệp lỗi), cổng có thể cho qua nhầm — chấp nhận được vì
  đây là vá TẠM, có ghi rõ lý do gỡ trong comment tại chỗ; theo dõi qua `status.npmjs.org`.
- **Rollout:** áp dụng ngay khi merge, không cần thao tác gì thêm.
- **Rollback:** revert PR này để quay lại `npm audit --omit=dev` trần.

## Definition of Done

- [x] Cổng vẫn CHẶN khi có lỗ hổng thật hoặc lỗi khác ngoài registry.
- [x] Cổng KHÔNG chặn khi lỗi đến từ registry (đã xác nhận đúng dấu hiệu lỗi thật gặp phải).
- [x] `scripts/ci-workflow-policy.test.ts` vẫn xanh — không phá 4 luật CI mục 11.1.
- [x] Comment tại chỗ giải thích lý do + điều kiện gỡ vá.
