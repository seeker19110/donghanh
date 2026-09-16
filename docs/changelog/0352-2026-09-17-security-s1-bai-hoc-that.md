# Bài học thật `security-s1`

- Thêm bốn unit `p6-u182..u185` và tám bài Python MÔ PHỎNG về threat boundary, least privilege,
  crypto policy/lifecycle, defensive API authorization, identity/session và recovery.
- Nối các unit vào curriculum, registry đồng bộ, lazy index và `SPEC_STAGE_UNITS['security-s1']`;
  thêm semantic gate kiểm cấu trúc, marker phòng thủ và cấm I/O/scan/exploit.
- Mọi fixture malformed, lạ hoặc thiếu bằng chứng đều fail closed. Ca API có whitespace đầu dòng
  được từ chối, không tự `.strip()` làm thay đổi contract.
- Đã chạy `gen:lesson-index` (445 bài/194 unit), 801 test nội dung Python, typecheck, lint,
  format và build đều xanh. Full suite: 13.999 test xanh; 5 lỗi `report-status` phụ thuộc đường
  dẫn `/tmp` khi Node chạy Windows, cộng một timeout Swift khi chạy song song (chạy riêng 44/44).
