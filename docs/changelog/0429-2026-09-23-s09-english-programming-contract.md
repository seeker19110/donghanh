# S09 — Tích hợp contract English và lập trình

Ngày 23/09/2026; docs-only, sau #1135 tại main `3c0ec283`.

- Tích hợp hai audit Astra low trên `b7f56206` vào original spec S09: identity,
  load/invalid/history/focus/audio/role-play của hội thoại mẫu; sáu anchor lập trình,
  URL/resume/stale, kết quả rỗng/từng phần, owner isolation và fixtures thật.
- B2/B3 đóng ở mức DESIGN CONTRACT ONLY. S09 vẫn Draft vì B1 (S04/S05/M2);
  chưa có source/browser/AT evidence. Không tuyên bố coverage CEFR/Chat/Speaking.
- Không sửa source, PROGRESS, goal hoặc fixtures lịch sử. Không migration;
  rollback bằng revert tài liệu.
- Kiểm chứng: Prettier hai file, protocol --ci, spec paths --ci và diff check;
  kết quả chi tiết ghi trong PR. Không chạy browser/provider/pilot cho docs-only.
