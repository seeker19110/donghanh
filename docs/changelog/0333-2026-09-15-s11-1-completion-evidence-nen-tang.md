# 0333 — 2026-09-15 — S11-1: hợp đồng `CompletionEvidence`, migration 0082 và `POST /api/learning/evidence`

- **PR:** #TBD (nhánh `claude/laughing-babbage-o25bls-s11-1`)
- **Đặc tả:** `docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md` (S11-1, AC-1…AC-8) — Approved for implementation, §7 chốt theo cột "Đề xuất của AI".
- **Phạm vi:** NỀN TẢNG, **0 thay đổi giao diện**. Nút "Nộp bài" STEM là S11-2, màn kết quả là S11-3.

## Việc đã làm

| Việc                                                    | File                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Hợp đồng versioned (client → server và server → client) | `packages/core-contracts/completionEvidence.ts` (+ test, 15 ca)                 |
| Bảng luật "thế nào là hoàn thành" từng hoạt động        | `packages/core-learner/completionRules.ts` (+ test, 9 ca)                       |
| Chấm lại lượt nộp STEM từ trả lời thô (hàm thuần)       | `packages/core-learner/stemEvidenceGrader.ts` (+ test, 7 ca)                    |
| Hai bảng mới, lũy đẳng, rollback là 2 lệnh `drop table` | `postgres/migrations/0082_completion_evidence.sql` + dòng README                |
| Endpoint `POST \| GET /api/learning/evidence`           | `apps/server/src/api/learning/evidence.ts` (+ test, 17 ca) + 1 dòng `routes.ts` |

## Quyết định khi thi hành

1. **Tên trường phiên bản là `schemaVersion`, không phải `version`.** AC-1 bắt dựng hợp đồng bằng
   `versionedObject` (`packages/core-contracts/version.ts:19`) — hàm đó gắn sẵn `schemaVersion`.
   Khối mã minh hoạ ở đặc tả §③.1 viết `version: z.literal(1)`; lấy AC-1 làm chuẩn để hợp đồng
   mới không mọc thêm một quy ước versioning thứ hai trong cùng gói. Test canh `schemaVersion ≠ 1 → lỗi`.
2. **`passed` so bằng hai số nguyên** (`correct / total ≥ 0.8 - 1e-9`), tính TRƯỚC khi `ratio` bị
   `numeric(4,3)` làm tròn — đúng mục §8 "numeric(4,3) làm tròn ratio". Test 2/3 · 3/4 · 4/5 · 1/1.
3. **Gửi trùng `attemptId` KHÔNG chạy upsert `completion_state`.** Nếu chạy, `attempts` sẽ phình
   theo số lần retry mạng, tức con số "số lần làm" nói dối. Lần 2 đọc lại dòng cũ và trả đúng
   `passed/ratio` lần đầu kèm `duplicate: true`.
4. **Nhật ký lưu cả `raw` của học viên lẫn kết quả chấm của server** trong `answers` jsonb — S12
   lập sổ lỗi từng câu đọc thẳng từ đây, không cần bảng thứ ba.
5. **Câu không được trả lời tính là SAI** (`reason: 'EMPTY'`), `total` là số câu CỦA BÀI. Nếu tính
   theo số câu đã gửi thì bỏ trống câu khó thành cách dễ nhất để đạt ngưỡng.
6. `packages/core-learner` nay tham chiếu `packages/core-grading` (thêm `references` trong
   `tsconfig.json`). Không thêm phụ thuộc npm nào, `package-lock.json` không đổi.

## Bằng chứng kiểm chứng

**Migration lũy đẳng (AC-2)** — Postgres 16 dựng tại chỗ, DB sạch `dhcb_test`, chạy `npm run migrate:pg` HAI lần:

```
# lần 1
[migrate:pg] → 0080_founder_lifetime_vip.sql ... xong
[migrate:pg] → 0082_completion_evidence.sql ... xong
[migrate:pg] ✅ Hoàn tất — đã áp dụng 84 migration lẻ mới.

# lần 2
[migrate:pg] Áp postgres/schema.sql (idempotent) ...
[migrate:pg] ✅ schema.sql xong.
[migrate:pg] Đã áp dụng đủ 84 migration lẻ — không có gì mới.

# \d platform.completion_evidence + \d platform.completion_state trước/sau: diff RỖNG
```

**Idempotency + "không kéo lùi" chạy THẬT trên DB đó (AC-4, AC-5):**

```
-- cùng attempt_id lần 2 → INSERT 0 0, nhật ký vẫn 1 dòng
 so_dong_nhat_ky
-----------------
               1
-- state đang 'completed' 1.0 nhận thêm evidence ratio 0.4:
  status   | best_ratio | last_ratio | attempts | co_completed_at
-----------+------------+------------+----------+-----------------
 completed |      1.000 |      0.400 |        2 | t
```

**Cổng:** `npm run build` · `npm run typecheck` (sau `rm -rf packages/*/dist dist dist-server`) ·
`npm run lint` 0 cảnh báo · `npm run format` · `npm run test:coverage` — xem mô tả PR.

**AC-8 (không đổi payload/endpoint đang có):** `git diff --stat` không chạm
`api/core/progress.ts`, `subjects/programming/progress.ts`, `pathQuiz.ts`, `programmingProgress.ts`,
`cefrProgress.ts`, `vocab.ts`, `srs.ts`, `dailyLearningPlan.ts`; `routes.ts` chỉ +3 dòng (1 import,
1 comment, 1 `app.all`).

## Còn lại của S11

- **S11-2** — client STEM gửi evidence, khách `guest_*`, hàng đợi gửi lại (AC-9…AC-13).
- **S11-3** — `ActivityResult` + mục lục S07 đọc evidence (AC-14…AC-18).
