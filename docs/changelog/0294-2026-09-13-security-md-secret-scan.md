# 0294 — 2026-09-13 — Thêm SECURITY.md + gate gitleaks quét bí mật

## Bối cảnh

Rà lại repo khung `seeker19110/project-template` (người dùng hỏi có gì hữu ích không). Phần lõi
quy trình (KHUNG 1–3, ADR, chống ảo giác, TRAPS.md) donghanh đã dung hợp từ trước. Phần còn thiếu
đa số là giấy tờ cho dự án nhiều người đóng góp (CODEOWNERS, CODE_OF_CONDUCT, GOVERNANCE) — không
hợp với donghanh (dự án 1 người, không nhận PR ngoài) nên KHÔNG thêm. Hai thứ đáng lấy: file
`SECURITY.md` (chưa có) và workflow `secret-scan.yml` (gitleaks — donghanh trước đây chỉ dựa vào
`.gitignore` + con người tự soát, chưa có cổng tự động).

## Việc đã làm

1. **`SECURITY.md`** (mới): cách báo cáo lỗ hổng (GitHub Security Advisories hoặc email), bảng
   liệt kê ĐÚNG các hàng rào bảo mật donghanh đang chạy thật (Zod, `validateAuth()` thay RLS,
   HMAC+UNIQUE chống trùng webhook SePay, AES-256-GCM cho cache/backup, `ADMIN_EMAILS`, CI) —
   không copy nguyên văn bảng chung chung của khung, viết lại theo đúng kiến trúc thật của repo.
2. **`.github/workflows/secret-scan.yml`** (mới, lấy nguyên từ khung — không cần chỉnh vì đã tổng
   quát): job `gitleaks` chạy trên `push main` + `pull_request → main`, quét toàn bộ lịch sử commit
   tìm API key/token/mật khẩu lỡ commit. **Không phải required check** của branch protection
   (CLAUDE.md mục 11 chỉ có `quality`/`e2e`/`metadata`) — đỏ ở đây là cảnh báo cần xem ngay, không
   tự chặn merge.

## Quyết định

- KHÔNG thêm `CODEOWNERS`/`CODE_OF_CONDUCT.md`/`GOVERNANCE.md`/`SUPPORT.md` — dành cho dự án
  nhiều người đóng góp, không hợp dự án 1 người của donghanh.
- Quy trình git đã có sẵn đầy đủ trước đó (`CLAUDE.md` mục 11, `AGENTS.md`,
  `docs/DEVELOPMENT_WORKFLOW.md`) — không tạo thêm tài liệu trùng lặp, chỉ bổ sung đúng phần gate
  bảo mật còn thiếu (gitleaks).

## Bằng chứng kiểm chứng

- `npx prettier --check SECURITY.md .github/workflows/secret-scan.yml` ✅ (đã `--write` một lần
  cho bảng markdown căn lại độ rộng cột).
- `scripts/ci-workflow-policy.test.ts` chỉ đọc `.github/workflows/ci.yml` — xác nhận file mới
  không chạm test canh đó.
- Workflow mới sẽ chạy thật lần đầu ở PR/push kế tiếp lên `main` (không chạy được cục bộ vì cần
  GitHub Actions runner + `secrets.GITHUB_TOKEN`).
