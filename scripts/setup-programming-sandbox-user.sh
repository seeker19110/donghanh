#!/usr/bin/env bash
# setup-programming-sandbox-user.sh — Tạo user hệ thống RIÊNG cho chấm lại bài Lập trình
# (ADR-0007, lớp bảo vệ #2). CHẠY MỘT LẦN TRÊN VPS, bằng root:
#     bash scripts/setup-programming-sandbox-user.sh
#
# Idempotent: chạy lại nhiều lần không đổi kết quả (kiểm user đã có trước khi tạo).
#
# VÌ SAO CẦN: `scripts/deploy.sh` chạy PM2/Node bằng user root trên VPS này (xem file đó,
# dòng đầu "đang đứng trên VPS, user root") — nghĩa là NẾU KHÔNG cấu hình biến
# PROGRAMMING_SANDBOX_USER, code học viên nộp lên chạy trong tiến trình con nhưng VẪN LÀ ROOT.
# Script này tạo một user KHÔNG có quyền gì (không home, không shell đăng nhập, không sudo) để
# server chạy code đó dưới quyền thấp hơn — lớp bảo vệ ĐỘC LẬP với allowlist Python (lớp #1).
set -euo pipefail

SANDBOX_USER="${PROGRAMMING_SANDBOX_USER:-dhcb-sandbox}"
ENV_FILE="${ENV_FILE:-/var/www/dhcb/.env}"

echo "── Tạo user hệ thống \"$SANDBOX_USER\" (nếu chưa có) ──────────────────"
if id "$SANDBOX_USER" >/dev/null 2>&1; then
  echo "  Đã có sẵn — bỏ qua bước tạo."
else
  useradd --system --no-create-home --shell /usr/sbin/nologin "$SANDBOX_USER"
  echo "  Đã tạo: $(id "$SANDBOX_USER")"
fi

echo ""
echo "── Kiểm \`sudo -n -u $SANDBOX_USER\` chạy được từ root không cần mật khẩu ──"
if sudo -n -u "$SANDBOX_USER" -- true; then
  echo "  OK — root sudo sang user thường không cần mật khẩu (mặc định của sudo, không cần"
  echo "  thêm cấu hình /etc/sudoers vì server đang chạy bằng root)."
else
  echo "  LỖI: \`sudo -n -u $SANDBOX_USER -- true\` thất bại — kiểm lại /etc/sudoers.d/ trên"
  echo "  VPS này (một số bản dựng có thể có chính sách khác mặc định)."
  exit 1
fi

echo ""
echo "── Kiểm \`unshare --net\` có dùng được không (lớp cô lập mạng phụ, best-effort) ──"
if unshare --net -- true 2>/dev/null; then
  echo "  CÓ — server sẽ tự bọc lệnh chấm bằng \`unshare --net\` (đọc trong"
  echo "  completionSandboxServer.ts, dò lại mỗi lần khởi động, không cần cấu hình gì thêm)."
else
  echo "  KHÔNG — ghi nợ kỹ thuật này đã có sẵn trong PROGRESS.md (mục ADR-0007 Quyết định 2)."
  echo "  Cô lập mạng vẫn còn TẦNG CHÍNH (allowlist Python chặn socket/urllib/http/…)."
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  BƯỚC CÒN LẠI (làm TAY, script này KHÔNG tự sửa .env/PM2):"
echo "  1. Thêm vào $ENV_FILE:"
echo "         PROGRAMMING_SANDBOX_USER=$SANDBOX_USER"
echo "  2. Nạp lại biến môi trường cho PM2:"
echo "         pm2 restart dhcb --update-env"
echo "  3. Xác nhận log không có cảnh báo 'không tra được uid/gid':"
echo "         pm2 logs dhcb --lines 50 | grep -i sandbox || echo '(không có cảnh báo — ổn)'"
echo "═══════════════════════════════════════════════════════════════════"
