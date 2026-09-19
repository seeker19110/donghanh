# shellcheck disable=SC2034  # các biến dưới đây CỐ Ý khai để scripts/usage-estimate.sh source vào
# .claude/usage-budget.sh — BUDGET token/5h theo GÓI của bạn (tự hiệu chỉnh)
#
# Copy file này thành `.claude/usage-budget.sh` rồi điền số (file cá nhân, KHÔNG commit — đã
# nằm trong .gitignore qua mẫu ".claude/*"). Có file này thì tính năng ước tính % quota 5h +
# nhắc wind-down (hook Stop usage-guard.sh, CLAUDE.md mục 3) mới bật. Không có file → OVERALL=NA
# → tính năng tự tắt (không báo động sai).
#
# VÌ SAO PHẢI TỰ ĐIỀN: Anthropic không công bố hạn mức token/5h của từng model dạng số máy đọc
# được, và nó phụ thuộc GÓI (Pro / Max 5x / Max 20x). Đây là MẪU SỐ ước tính — tự hiệu chỉnh từ
# kinh nghiệm dùng thật.
#
# Đơn vị: TỔNG token/5h = input + output + cache_creation + CACHE_READ_WEIGHT*cache_read.
# Chỉ cần điền model bạn thực sự dùng; để 0 = bỏ qua model đó.

# Điền số của bạn — chạy 2-3 lần thật, khi CLI báo hết quota mà % ước tính chưa ~100% thì HẠ
# budget model tương ứng; nếu % vọt >100% trước khi bị chặn thì NÂNG lên.
BUDGET_OPUS=0
BUDGET_SONNET=4500000
BUDGET_HAIKU=8000000
BUDGET_FABLE=0

# Trọng số token cache-read so với token thường (cache rẻ hơn) — 0.0..1.0.
# ĐÂY LÀ CẦN GẠT LỚN NHẤT: cache_read thường chiếm phần lớn token. Nếu % lệch nhiều so với thực
# tế, chỉnh số này trước (thử 0.05-0.2).
CACHE_READ_WEIGHT=0.1

# Ngưỡng % để nhắc wind-down (khớp CLAUDE.md mục 3: "≥70%")
WINDDOWN_THRESHOLD=70
