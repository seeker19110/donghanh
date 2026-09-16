# 0344 — 2026-09-16 — Ổn định test flaky `programmingSrs` + `authService` (timeout 5s dưới tải)

**PR:** #(điền khi tạo) · **Loại:** `fix`, sửa test + comment, không đụng logic sản phẩm.

## Vấn đề

1. `apps/dhcb/src/lib/programmingSrs.test.ts` — ca "limit cắt đúng số thẻ cho một phiên ôn" đỏ
   khi chạy full suite dưới tải (quan sát thật: đỏ 2/3 lượt), chạy riêng file luôn xanh. Cùng họ
   với nợ đã trả ở PR #937 (`lessonsPython`) và PR #949 (`seed-all`).
2. Trong lúc xử lý, agent S05-2 chạy `npm run test:coverage` full và phát hiện thêm 3 ca đỏ ở
   `packages/core-auth/authService.test.ts`, CÙNG khuôn `Test timed out in 5000ms`. Chạy riêng
   file đó 70/70 xanh.

## Nguyên nhân gốc — đo chứ không đoán

### `programmingSrs.test.ts`

Ca test lặp `addLessonCardsToSrs(UID, l.id)` cho **cả 381 bài** (`PROGRAMMING_LESSONS`, tổng
~1184 thẻ) chỉ để kiểm tra `getDueProgCards(uid, 3)` cắt đúng 3 thẻ — trong khi chỉ cần NHIỀU
HƠN 3 thẻ là đủ để chứng minh hành vi cắt.

`addLessonCardsToSrs()` → `addToSRS()` → `save()` (`packages/`… thực ra ở
`apps/dhcb/src/lib/srs.ts`) gọi `JSON.stringify(data)` + `localStorage.setItem` **TOÀN BỘ dữ
liệu tích luỹ** cho MỖI thẻ, cộng thêm `pushProgress()` bắn-rồi-quên mỗi lần — nạp cả môn là
**O(n²)**.

Đo thật (`npx vitest run apps/dhcb/src/lib/programmingSrs.test.ts --reporter=verbose`), TRƯỚC
khi sửa: ca "limit cắt đúng số thẻ" **1731ms** trên máy rảnh, đủ sát ngưỡng 5000ms để đỏ dưới
tải full suite.

### `authService.test.ts`

Bốn describe (`hashPassword / verifyPassword`, `createUserWithPassword`, `verifyUserPassword`,
`createUserWithPassword — nhánh thành công`) gọi `bcrypt.hash`/`bcrypt.compare` THẬT với
`BCRYPT_ROUNDS = 12` (không mock) — đúng chi phí bảo mật thật của production, không phải việc
test dựng thừa. Đo thật, chạy riêng file nhiều lượt: mỗi lượt hash/compare dao động
**400ms–1.75s trên máy rảnh**; chạy trong full suite (`--reporter=verbose` toàn repo) một số ca
lên tới **4.2–4.4s**, sát ngưỡng mặc định 5000ms.

## Đã sửa gì

1. **`programmingSrs.test.ts`** — sửa CHO NHANH LÊN thay vì nới ngưỡng: chỉ nạp đúng số bài đầu
   tiên có thẻ để tổng thẻ **vượt** limit (3), dùng type predicate để lọc `srsCards` không `null`
   thay vì `!` khẳng định kiểu, và thêm `expect(tongThe).toBeGreaterThan(3)` để ý định "phải vượt
   limit thật" không âm thầm hỏng về sau. Kết quả: ca đó còn **2–5ms** (giảm ~99.7%).

2. **`authService.test.ts`** — việc bcrypt là chi phí THẬT của production (giảm
   `BCRYPT_ROUNDS` sẽ làm test không còn đo đúng hành vi thật), nên **nới `timeout: 10000`** cho
   đúng 4 describe liên quan, kèm comment tiếng Việt ghi số đo làm căn cứ.

**KHÔNG skip, KHÔNG `.only`, KHÔNG `todo`, KHÔNG xoá assert, KHÔNG quarantine** ở cả hai file.

## Rà thêm — tìm mọi ca cùng rủi ro

Chạy `npx vitest run --reporter=verbose` toàn repo sau khi sửa, lọc mọi ca ≥ 3000ms (60% ngưỡng
mặc định 5000ms):

| File                    | Ca                                 | Thời gian (full suite) | Ngưỡng của ca | Tỉ lệ | Đã xử lý           |
| ----------------------- | ---------------------------------- | ---------------------- | ------------- | ----- | ------------------ |
| `authService.test.ts`   | hashPassword/verifyPassword (2 ca) | 3084ms / 4221ms        | 10000ms (mới) | ≤42%  | ✅ PR này          |
| `authService.test.ts`   | verifyUserPassword (2 ca)          | 3452ms / 4379ms        | 10000ms (mới) | ≤44%  | ✅ PR này          |
| `lessonsPython.test.ts` | p5-s2, p5-u6-l1                    | 4014–4399ms            | 15000ms       | ≤30%  | Đã xử lý ở PR #937 |
| `seed-all.test.ts`      | truyện cổ tích/ngụ ngôn            | 4786ms                 | 10000ms       | 48%   | Đã xử lý ở PR #949 |

Không còn ca nào KHÁC vượt 60% ngưỡng của nó. Danh sách ngắn (≤ 5 ca) nên không cần tách đợt
riêng — toàn bộ đã nằm trong PR này hoặc đã trả nợ ở hai PR trước.

## Bằng chứng kiểm chứng

- Lặp lại `apps/dhcb/src/lib/programmingSrs.test.ts` riêng lẻ **5 lần liên tiếp**
  (`--reporter=verbose`): 45/45 ca xanh, ca "limit cắt đúng số thẻ" luôn 2–5ms.
- `packages/core-auth/authService.test.ts` riêng lẻ: 70/70 xanh, `Duration 7.53s`.
- `npm run test:coverage` full suite: **2 lượt liên tiếp**, cả hai `exit code 0`, ngưỡng coverage
  đạt (Statements 94.07% / Branches 90.07% / Functions 94.41% / Lines 94.6%).
- `npx vitest run --reporter=verbose` full suite sau khi sửa: exit 0, không còn ca nào ngoài
  bảng trên vượt 60% ngưỡng.
- `TRAPS.md` mục 7 ghi lại khuôn lỗi "Test timed out in 5000ms" chỉ đỏ dưới tải — bốn lần lặp lại
  trong một buổi (#937, #949, hai file PR này).

## Rủi ro, rollout và rollback

- **Rủi ro:** không có — chỉ sửa cách test dựng dữ liệu (`programmingSrs`) và nới ngưỡng chờ cho
  đúng chi phí thật (`authService`). Không đụng logic sản phẩm, không đổi `BCRYPT_ROUNDS`.
- **Rollout:** merge bình thường, không cần migration/restart.
- **Rollback:** revert commit.

## Definition of Done

✅ Build: PASS
✅ Typecheck: PASS
✅ Lint: PASS (0 cảnh báo)
✅ Format: PASS
✅ Test:coverage lần 1: PASS (exit 0, coverage đạt ngưỡng)
✅ Test:coverage lần 2: PASS (exit 0, coverage đạt ngưỡng)
✅ `programmingSrs.test.ts` lặp 5 lần riêng lẻ: 45/45 xanh
✅ Rà toàn repo tìm ca cùng rủi ro: xong, bảng trên
✅ `TRAPS.md` mục mới: có
✅ `PROGRESS.md` cập nhật nợ đã trả: có
✅ Changelog mới: có (file này)
✅ Conventional commit: có
✅ Không phá tính năng khác: chỉ sửa 2 file test + 3 file tài liệu
