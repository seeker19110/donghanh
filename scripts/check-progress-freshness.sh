#!/usr/bin/env bash
# Kiểm PROGRESS.md có nhắc tên nhánh đã LỖI THỜI (không còn trên remote) mà không kèm nhãn
# giải quyết ("ĐÃ MERGE"/"đã xoá"/gạch ngang) hay không.
#
# VÌ SAO CẦN: PROGRESS.md là văn xuôi cập nhật thủ công — không có gì ép buộc đối chiếu với git
# thật. Từng xảy ra thật (2026-09-03): một mục ghi nhánh X "chưa merge, PHẢI chạy đủ cổng trước
# khi merge" trong khi nhánh đó đã merge từ lâu và không còn tồn tại trên remote. Xem TRAPS.md
# mục 2.
#
# CHỈ kiểm được phần CƠ HỌC (nhánh nêu tên có còn tồn tại trên remote không) — không kiểm được
# nội dung tường thuật có đúng không. Đó là giới hạn cố ý.
#
# Ở dạng CẢNH BÁO (không exit 1) cho tới khi chạy đủ ổn định không có false positive — xem
# docs/specs/2026-09-12-traps-va-kiem-progress-loi-thoi.md mục Rollout.
#
# Chạy: bash scripts/check-progress-freshness.sh
set -uo pipefail

cd "$(git rev-parse --show-toplevel)"

PROGRESS_FILE="PROGRESS.md"

if [ ! -f "$PROGRESS_FILE" ]; then
  echo "OK — không có $PROGRESS_FILE, bỏ qua."
  exit 0
fi

# Nhãn coi là "đã giải quyết" — xuất hiện trong khoảng 3 dòng TRƯỚC hoặc SAU tên nhánh (mục
# thường viết nhiều dòng: nhãn có thể đứng trước "ĐÃ SỬA XONG ... (nhánh `x`)" hoặc sau
# "nhánh `x`)~~ — ✅ ĐÃ MERGE.").
RESOLVED_PATTERN='ĐÃ MERGE|đã merge|không còn nhánh|đã xoá|đã xóa|ĐÃ SỬA XONG|đã sửa xong|~~'

warned=0

# Trích tên nhánh trong backtick, giới hạn đúng tiền tố nhánh dự án hay dùng
# (claude/..., codex/..., fix/..., feat/...) và phần sau CHỈ chữ/số/gạch ngang (không dấu chấm,
# không thêm dấu / — loại trừ đường dẫn file như `scripts/deploy.sh` hay `docs/x.md` vốn cũng
# khớp khuôn "chữ/chữ" nhưng không phải tên nhánh git). grep -n giữ số dòng để trỏ lỗi.
while IFS=: read -r lineno match; do
  branch="$(printf '%s' "$match" | tr -d '`')"

  # Bỏ qua nếu chính dòng đó, hoặc trong khoảng 3 dòng trước/sau, đã có nhãn giải quyết.
  from=$((lineno - 3))
  [ "$from" -lt 1 ] && from=1
  context="$(sed -n "${from},$((lineno + 3))p" "$PROGRESS_FILE")"
  if printf '%s' "$context" | grep -qE "$RESOLVED_PATTERN"; then
    continue
  fi

  if git ls-remote --heads origin "$branch" 2>/dev/null | grep -q .; then
    continue # nhánh vẫn còn trên remote — không có gì lỗi thời
  fi

  echo "::warning file=$PROGRESS_FILE,line=$lineno::Nhánh \`$branch\` được nhắc mà KHÔNG có nhãn giải quyết (ĐÃ MERGE/đã xoá/gạch ngang), và không còn tồn tại trên remote — PROGRESS.md có thể đang lỗi thời. Đối chiếu bằng 'git ls-remote --heads origin $branch' rồi cập nhật mục này."
  warned=1
done < <(grep -noE '`(claude|codex|fix|feat|feature|refactor|chore)/[a-zA-Z0-9-]+`' "$PROGRESS_FILE")

if [ "$warned" -eq 0 ]; then
  echo "OK — không thấy nhánh nào bị nhắc mà lỗi thời."
fi

exit 0
