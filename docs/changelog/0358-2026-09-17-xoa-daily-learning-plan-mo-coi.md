# 0358 — 2026-09-17 — Xoá `dailyLearningPlan.ts` mồ côi sau PR #929

**PR:** (điền khi tạo) · **Loại:** chore dọn dẹp, không đổi hành vi người dùng.

## Bối cảnh

Một agent điều tra trước đó phát hiện `apps/dhcb/src/lib/dailyLearningPlan.ts`
(`buildDailyLearningPlan`) đã bị `Home.tsx` bỏ hoàn toàn từ PR #929 (commit `8d5abe41`, "Góc học
tập slice 02+03+04", 2026-09-15) để chuyển sang `getDailyLearned`/`getDailyMax` của
`apps/dhcb/src/lib/curriculum.ts`. Xác nhận lại bằng:

- `npm run codemap -- impact apps/dhcb/src/lib/dailyLearningPlan.ts` — không còn ai import ngoài
  chính file test của nó.
- `grep -rln "dailyLearningPlan" apps/ packages/` — chỉ khớp `dailyLearningPlan.ts` và
  `dailyLearningPlan.test.ts` trong mã nguồn (phần còn lại là tài liệu ở `docs/specs/`).

Năm đặc tả `docs/specs/2026-09-15-learning-ux-*.md` (foundation, s06, s08, s10, s11) coi file
này là "bất biến phải giữ nguyên"/"test canh" — nhưng đều ghi ngày 2026-09-15, ĐÚNG ngày PR #929
thay thế logic đó, nên các mục đó đã lỗi thời ngay từ lúc viết (một đặc tả tự ghi "→ 6 file bị
ảnh hưởng" nhưng thực tế nay chỉ còn 1 file mồ côi — chính nó).

**Đây là quyết định của chủ dự án**, được hỏi trực tiếp sau khi agent điều tra báo cáo mâu thuẫn
giữa đặc tả và thực trạng mã nguồn — không phải AI tự ý xoá.

## Đã làm

- Xoá `apps/dhcb/src/lib/dailyLearningPlan.ts` và `apps/dhcb/src/lib/dailyLearningPlan.test.ts`.
- Sửa ghi chú (không xoá nội dung đặc tả) tại đúng những đoạn nhắc `dailyLearningPlan.ts`/
  `buildDailyLearningPlan` như bất biến/test phải giữ xanh trong 5 đặc tả:
  - `docs/specs/2026-09-15-learning-ux-foundation.md`
  - `docs/specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md`
  - `docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md`
  - `docs/specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md`
  - `docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md`

  Mỗi chỗ được đánh dấu **"ĐÃ LỖI THỜI (2026-09-17)"** kèm lý do (PR #929) và trỏ tới PR dọn dẹp
  này, giữ nguyên phần còn lại của đặc tả làm hồ sơ khảo sát tại thời điểm viết.

- `PROGRESS.md` không nhắc tới `dailyLearningPlan.ts` (đã grep xác nhận) — không cần sửa.

## Bằng chứng kiểm chứng

```
npm run typecheck        # PASS (tsc apps/dhcb + api + e2e + hub)
npm run lint              # PASS, 0 cảnh báo
npm run build              # PASS (app + server + hub)
npm run test:coverage      # PASS — Statements 94.02% · Branches 89.83% · Functions 94.35% · Lines 94.58%
npm run codemap -- impact apps/dhcb/src/lib/curriculum.ts   # 35 file, không đổi so với trước (Home.tsx
                                                              đã dùng curriculum.ts từ PR #929, việc xoá
                                                              file mồ côi không thêm ảnh hưởng nào)
```

## Quyết định

Xoá file logic cũ không còn ai dùng thay vì giữ lại "phòng khi cần" — giữ code chết chỉ khiến
người đọc sau này (kể cả agent) tưởng nhầm nó vẫn là nguồn sự thật, như 5 đặc tả trên đã chứng
minh. Ghi chú lỗi thời trong đặc tả thay vì xoá đoạn, để giữ nguyên bối cảnh khảo sát lịch sử.
