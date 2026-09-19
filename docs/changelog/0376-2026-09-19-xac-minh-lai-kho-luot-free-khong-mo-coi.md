# 0376 — Xác minh lại: kho lượt cửa sổ trượt 7 ngày của Free KHÔNG mồ côi hoàn toàn

**Ngày:** 2026-09-19
**Nhánh/PR:** `chore/dep-kho-luot-free-mo-coi`
**Loại việc:** rà soát nợ kỹ thuật (không đổi code nghiệp vụ)

## Bối cảnh

`PROGRESS.md` (mục nợ ghi 2026-09-12, xem `docs/changelog/0289-*.md`) mô tả bảng
`free_daily_credit` + 4 hàm SQL (`grant_daily_bonus_rolling`, `consume_rolling_credit`,
`refund_rolling_credit`) trong `postgres/migrations/0017_free_rolling_credit.sql` là "MỒ CÔI"
sau khi GĐ1 chuyển Free sang hạn mức TỔNG/ngày, và giao việc "dọn ở đợt riêng: gỡ lời gọi
`grant_daily_bonus_rolling` ở `apps/server/src/api/core/progress.ts` TRƯỚC, giữ bảng thêm một
thời gian rồi mới drop".

## Phát hiện khi thi hành

Trước khi gỡ lời gọi, rà lại bằng `grep -rn` toàn repo:

1. **`consume_rolling_credit` / `refund_rolling_credit`: ĐÚNG là mồ côi.** Không còn lời gọi
   TypeScript nào — xác nhận bằng test canh gác đã có sẵn:
   `packages/core-billing/usage.test.ts:121` ("KHÔNG còn dùng kho lượt cửa sổ trượt 7 ngày
   (consume_rolling_credit)") và `:246` ("KHÔNG còn gọi refund_rolling_credit của cơ chế kho
   lượt cũ"). Phần này an toàn để drop ở đợt dọn dẹp sau, không khẩn cấp.

2. **`grant_daily_bonus_rolling`: KHÔNG mồ côi — đang phục vụ tính năng thật đang chạy.**
   `apps/server/src/api/_lib/quests.ts` — nhiệm vụ "Học liên tiếp N ngày"
   (`STREAK_QUEST_KEY = 'streak_5'`) có hàm `getCurrentStreak()` đọc trực tiếp:

   ```sql
   select ... from public.free_daily_credit
   where user_id = $1 and bonus_earned > 0 and day > ... and day <= today
   ```

   rồi đếm streak liên tiếp lùi từ hôm nay. Bảng này CHỈ được ghi bởi lời gọi
   `grant_daily_bonus_rolling` ở `apps/server/src/api/core/progress.ts:428`, mỗi khi phát hiện
   người dùng có học thật (learned/cefrGrammar/cefrDialogues dài ra) — áp dụng cho MỌI gói (Free
   lẫn VIP), không riêng Free.

   Nếu gỡ lời gọi này như giao việc ban đầu yêu cầu: bảng `free_daily_credit` ngừng nhận dòng
   mới → `bonus_earned` không bao giờ >0 sau ngày merge → streak luôn tính ra 0 → nhiệm vụ
   `streak_5` (thưởng thêm hạn mức) **vĩnh viễn không ai claim được nữa**. Đây là lỗi ÂM THẦM —
   không cổng CI nào bắt được vì chưa có test tích hợp `progress.ts` → `quests.ts` cho luồng
   streak thật.

## Quyết định (chốt bởi người điều phối, 2026-09-19)

- **GIỮ NGUYÊN lời gọi `grant_daily_bonus_rolling` ở `progress.ts`** — không gỡ. Bảng
  `free_daily_credit` + hàm này KHÔNG còn là nợ kỹ thuật cần dọn.
- Đóng nợ chính trong `PROGRESS.md` (mô tả gốc 2026-09-12 là sai), giữ lại đúng phần thật sự còn
  mở: `consume_rolling_credit`/`refund_rolling_credit` có thể drop sau, không khẩn cấp.
- Không đổi code nghiệp vụ nào trong đợt này — chỉ sửa tài liệu.

## Bằng chứng đã kiểm

- `grep -rn "grant_daily_bonus_rolling"` → chỉ 1 lời gọi TS sống, tại `progress.ts:428`; còn lại
  là comment/test tham chiếu.
- `grep -rn "consume_rolling_credit\|refund_rolling_credit"` (loại `.sql`) → chỉ xuất hiện trong
  comment + test khẳng định KHÔNG còn gọi (`usage.test.ts:121,246`).
- `apps/server/src/api/_lib/quests.ts` dòng 36-64: `getCurrentStreak` đọc
  `free_daily_credit.bonus_earned`, dùng trong `claimStreakQuest` và endpoint GET quests (hiển
  thị streak hiện tại cho người dùng).
- Cổng CLAUDE.md mục 8 (build/typecheck/lint/test) chạy lại — xem báo cáo xác thực cuối PR.
