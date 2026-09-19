# 0379 — 2026-09-19 — Sửa lỗ hổng timeout của sandbox chấm bài + script cấu hình `PROGRAMMING_SANDBOX_USER`

## Tóm tắt

Khi thử cấu hình `PROGRAMMING_SANDBOX_USER` (lớp bảo vệ #2 của ADR-0007) bằng một user hệ
thống THẬT trong môi trường phát triển, phát hiện HAI lỗi thật (không phải lý thuyết) trong
`completionSandboxServer.ts` (PR #1038):

1. **Code học viên "biến mất" khi bật sandbox user.** Code được truyền qua biến môi trường
   `DHCB_SANDBOX_CODE`, nhưng `sudo` mặc định `env_reset` — xoá sạch biến tự đặt trước khi exec
   lệnh. Kết quả: `python3 -c ""` chạy rỗng, MỌI bài đều chấm SAI im lặng khi bật user riêng.
   **Sửa:** ghi code ra file thật trong thư mục tạm (đã `chown` sẵn cho user sandbox), chạy
   `python3 <file>` thay vì `-c "$VAR"` — vừa tránh vấn đề `sudo`, vừa tránh escaping/injection.
2. **Timeout không diệt được tiến trình khi đi qua `sudo`.** `execFileSync`'s `timeout` chỉ kill
   tiến trình CON TRỰC TIẾP (`sudo`), không lan xuống cháu (`python3`) — vòng lặp vô hạn của
   học viên chạy VÔ THỜI HẠN dưới user sandbox sau khi Node coi là "đã timeout". Xác nhận bằng
   thực nghiệm: `ps -u <sandbox-user>` vẫn thấy tiến trình `python3` sống sau khi test đã kết
   thúc. **Sửa:** bọc lệnh chấm bằng `timeout(1)` (coreutils) làm lớp NGOÀI CÙNG — nó tự đặt
   process group riêng và kill CẢ NHÓM khi hết giờ, xác nhận bằng thực nghiệm không còn tiến
   trình mồ côi.
3. Thêm `scripts/setup-programming-sandbox-user.sh` (idempotent) — tạo user hệ thống, tự kiểm
   `sudo -n`/`unshare --net` dùng được không, in hướng dẫn 2 dòng còn lại (`.env` + `pm2
restart`). **AI không có SSH vào VPS production trong phiên này — chủ dự án cần tự chạy
   script này trên VPS.**
4. `docs/deploy-vps-ubuntu.md`: thêm mục "User sandbox chấm bài Lập trình (ADR-0007)".

## Issue / outcome

PR #1038 (merged) đã có sandbox chấm lại bài Lập trình nhưng CHƯA TỪNG được test với
`PROGRAMMING_SANDBOX_USER` bật thật — 6 test của `completionSandboxServer.test.ts` khi đó chạy
với biến này RỖNG (fallback = user Node/root), nên hai lỗi trên không lộ ra. Nếu chủ dự án bật
biến này lên VPS TRƯỚC khi có PR này, mọi bài Lập trình P1–P4 sẽ chấm sai/treo tiến trình.

## Research / spec

`docs/adr/0007-completion-evidence-sandbox-lap-trinh.md` (không đổi quyết định, chỉ sửa lỗi thi
hành lớp bảo vệ #2/#3 cho ĐÚNG như đã cam kết).

## Validation

- Tạo user hệ thống THẬT (`useradd --system --no-create-home dhcb-sandbox-test2`) trong môi
  trường phát triển, chạy `PROGRAMMING_SANDBOX_USER=dhcb-sandbox-test2 npx vitest run
packages/subject-programming/completionSandboxServer.test.ts` — 6/6 xanh THẬT (code mẫu đạt,
  code sai rớt, `import os`/`socket` bị chặn, vòng lặp vô hạn bị `timeout(1)` diệt sạch).
- `ps -u dhcb-sandbox-test2` sau khi test xong: KHÔNG còn tiến trình nào (trước khi sửa: 4 tiến
  trình `python3` mồ côi sống sót).
- Chạy `bash scripts/setup-programming-sandbox-user.sh` hai lần liên tiếp trong môi trường phát
  triển — lần 2 xác nhận "Đã có sẵn — bỏ qua" (idempotent thật).
- `npm run typecheck` · `npm run lint` · `npm run build` · `npx vitest run` (toàn bộ, không có
  `PROGRAMMING_SANDBOX_USER`) — 714 file / 15012 test xanh, không hồi quy hành vi mặc định.
- `npx vitest run apps/server/src/api/subjects/programming/progress.test.ts` — 23/23 xanh.

## Rủi ro, rollout và rollback

- **Rủi ro:** cấu hình biến `PROGRAMMING_SANDBOX_USER` trên VPS vẫn là việc THỦ CÔNG (phiên AI
  không có quyền SSH production) — cho tới khi chủ dự án chạy script, hệ thống vẫn ở trạng thái
  fallback AN TOÀN (chạy bằng user Node, có allowlist + timeout đã sửa đúng) chứ không hỏng.
- **Rollout:** không đổi hành vi mặc định (biến rỗng) — chỉ sửa đúng nhánh code trước đây có lỗi
  khi biến được bật, nên deploy PR này không ảnh hưởng gì tới hệ thống hiện tại cho đến khi VPS
  cấu hình biến.
- **Rollback:** revert PR — quay lại code cũ (không ai đang bật `PROGRAMMING_SANDBOX_USER` trên
  VPS nên rollback an toàn tuyệt đối).

## Definition of Done

- [x] Hai lỗi thi hành (env bị `sudo` xoá; timeout không lan xuống cháu tiến trình) đã sửa và
      xác nhận bằng thực nghiệm với user hệ thống thật, không chỉ đọc code suy luận.
- [x] Script cấu hình VPS idempotent, tự kiểm điều kiện tiên quyết (`sudo -n`, `unshare --net`).
- [x] Tài liệu deploy cập nhật bước cấu hình.
- [x] Toàn bộ cổng (build/type/lint/test) xanh thật, không hồi quy hành vi mặc định.
