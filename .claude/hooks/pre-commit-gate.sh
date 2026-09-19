#!/usr/bin/env bash
# pre-commit-gate.sh — PreToolUse hook (matcher: Bash).
#
# VÌ SAO CẦN: CLAUDE.md mục 8 liệt kê đủ cổng commit (Build/Type/Lint/Format/Test) nhưng trước
# hook này chỉ dựa vào tự giác — không có gì chặn thật khi Claude chạy `git commit` với cổng đỏ.
# Tham khảo seeker19110/projects-template .claude/hooks/pre-commit-gate.sh (2026-09-19), nhưng
# KHÔNG dùng lớp "tự dò lệnh theo stack" của template — DHCB là MỘT stack cố định (npm, xem
# CLAUDE.md mục 6) nên gọi thẳng script trong package.json.
#
# PHẠM VI CỐ Ý HẸP HƠN mục 8 (chỉ typecheck + lint + test, KHÔNG chạy `npm run build`): build đầy
# đủ (gen data manifest + tsc 4 project + vite build 2 app + build server) tốn 1-3 phút — chặn nó
# ở MỖI lần commit sẽ làm chậm mọi phiên đến mức phản tác dụng (khuyến khích gõ --no-verify).
# `npm run build` vẫn bị chặn thật ở CI job `build` (bắt buộc để merge, xem mục 9) và ở checklist
# thủ công trước PR (mục 10, Báo cáo xác thực). Format không tự chạy ở đây vì `auto-format.sh`
# (PostToolUse) đã format ngay sau mỗi Edit/Write — chạy lại ở đây là dư.
set -uo pipefail   # cố ý KHÔNG -e: không được làm chết phiên/lượt chạy

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

payload="$(cat)"
cmd=""
if command -v jq >/dev/null 2>&1; then
  cmd="$(printf '%s' "$payload" | jq -r '.tool_input.command // empty' 2>/dev/null)"
else
  echo "[pre-commit-gate] không có jq → không đọc được lệnh, bỏ qua cổng." >&2
  exit 0
fi

# Bỏ phần TRONG DẤU NHÁY trước khi so khớp — tránh chặn oan khi commit message chứa chữ "commit".
cmd_scan="$(printf '%s' "$cmd" | sed "s/'[^']*'//g; s/\"[^\"]*\"//g")"

# Chỉ can thiệp khi thực sự là `git commit` (bỏ qua commit-tree, --help…).
if ! printf '%s' "$cmd_scan" | grep -Eq '(^|[^-])git[[:space:]]+([^|&;]*[[:space:]])?commit([[:space:]]|$)'; then
  exit 0
fi

if printf '%s' "$cmd_scan" | grep -Eq '(^|[[:space:]])--no-verify([[:space:]]|$)'; then
  echo "[pre-commit-gate] phát hiện --no-verify → bỏ qua cổng." >&2
  exit 0
fi

cd "$ROOT" || exit 0

run() { # $1 = nhãn, $2.. = lệnh
  local label="$1"; shift
  echo "[pre-commit-gate] chạy: $label ($*)" >&2
  if ! "$@" >/tmp/pre-commit-gate-out.$$ 2>&1; then
    echo "❌ Cổng ĐỎ: $label. CLAUDE.md mục 8 — sửa hết rồi commit lại." >&2
    tail -n 40 /tmp/pre-commit-gate-out.$$ >&2
    rm -f /tmp/pre-commit-gate-out.$$
    echo "   Bỏ qua có chủ đích: thêm --no-verify vào lệnh git commit." >&2
    exit 2
  fi
  rm -f /tmp/pre-commit-gate-out.$$
}

run "typecheck" npm run typecheck
run "lint" npm run lint
run "test" npm test

# Diff staged lớn → nhắc /code-review, không chặn (cổng máy chỉ bắt lỗi cú pháp).
lines_changed="$(git diff --cached --numstat -- 2>/dev/null | awk '{a+=$1; d+=$2} END{print a+d+0}')"
files_changed="$(git diff --cached --name-only -- 2>/dev/null | grep -c . || true)"
if [ "${lines_changed:-0}" -ge 80 ] || [ "${files_changed:-0}" -ge 5 ]; then
  echo "💡 Diff staged khá lớn (${files_changed} file, ~${lines_changed} dòng đổi). Cân nhắc /code-review trước khi commit để bắt lỗi logic/trùng lặp." >&2
fi

exit 0
