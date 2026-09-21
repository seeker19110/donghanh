#!/usr/bin/env bash
# Kiểm tính nhất quán tài liệu điều hành của DHCB:
#   1. Lệnh trong .claude/commands/ ↔ CLAUDE.md khớp hai chiều (thêm lệnh mà quên khai, hoặc
#      CLAUDE.md nhắc /tên lệnh không còn tồn tại).
#   2. Subagent trong .claude/agents/ có frontmatter name: khớp tên file.
# Nguồn: seeker19110/projects-template scripts/check-docs-consistency.sh. Bản gốc còn kiểm
# "mọi đường dẫn trong backtick phải tồn tại" trên toàn repo — thử áp cho DHCB (2026-09-21) cho
# hàng trăm cảnh báo giả: kho docs/research/*.md của DHCB dùng đường dẫn tương đối tường thuật
# (`../CLAUDE.md`, `_lib/aiConfig.ts` mô tả cấu trúc CŨ trước khi tái cấu trúc...) không phải
# tham chiếu cần đúng 100%. Cố ép cổng đó sẽ cần loại trừ hàng chục file — bỏ hẳn phần đó, chỉ
# giữ 2 việc rẻ, sạch, đúng giá trị "lệnh/agent tồn tại thật ↔ được khai đúng".
# Chạy: bash scripts/check-docs-consistency.sh
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

fail=0
is_in() { local needle="$1"; shift; for x in "$@"; do [ "$x" = "$needle" ] && return 0; done; return 1; }

echo "== 1. Lệnh (.claude/commands) ↔ CLAUDE.md khớp hai chiều =="
for cmd in .claude/commands/*.md; do
  [ -e "$cmd" ] || continue
  name="$(basename "$cmd" .md)"
  if ! grep -qF -e "\`$cmd\`" -e "\`/$name\`" CLAUDE.md; then
    echo "::error::Lệnh $cmd chưa được CLAUDE.md khai (thiếu \`$cmd\` hoặc \`/$name\`)"
    fail=1
  fi
done

# Miễn trừ: skill dựng sẵn của Claude Code (không nằm trong .claude/commands/ của repo), và
# đường dẫn URL trong app DHCB viết dạng `/route` giống cú pháp lệnh nhưng không phải lệnh.
BUILTIN_COMMANDS=("code-review" "security-review" "simplify" "loop")
APP_ROUTE_LOOKALIKE=("admin" "ghi-chu")
mapfile -t slashRefs < <(
  grep -hoE '`/[a-z][a-z0-9-]*`' CLAUDE.md | tr -d '`/' | sort -u
)
for name in "${slashRefs[@]}"; do
  is_in "$name" "${BUILTIN_COMMANDS[@]}" && continue
  is_in "$name" "${APP_ROUTE_LOOKALIKE[@]}" && continue
  [ -f ".claude/commands/$name.md" ] && continue
  echo "::error::CLAUDE.md nhắc \`/$name\` nhưng không có .claude/commands/$name.md"
  fail=1
done

echo "== 2. Subagent (.claude/agents) frontmatter name: khớp tên file =="
for f in .claude/agents/*.md; do
  [ -e "$f" ] || continue
  base="$(basename "$f" .md)"
  nm="$(grep -m1 '^name:' "$f" | sed -E 's/^name:[[:space:]]*//; s/[[:space:]]*$//')"
  if [ -z "$nm" ]; then
    echo "::error file=$f::Thiếu frontmatter 'name:' — Claude Code không nạp được subagent này."
    fail=1
  elif [ "$nm" != "$base" ]; then
    echo "::error file=$f::frontmatter name '$nm' lệch tên file '$base' — giao việc theo tên file sẽ không tìm thấy agent."
    fail=1
  fi
done

if [ "$fail" -eq 0 ]; then
  echo "OK — không phát hiện lệnh lệch với CLAUDE.md, hay subagent thiếu/lệch frontmatter."
fi
exit "$fail"
