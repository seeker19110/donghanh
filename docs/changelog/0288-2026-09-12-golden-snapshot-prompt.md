# 0288 — 2026-09-12 — Golden snapshot cho prompt môn Anh + đặc tả đổi mô hình gói (GĐ1–GĐ4)

**PR:** (điền khi tạo) · **Nhánh:** `claude/brave-fermat-usux3s`

## Việc đã làm

### 1. Golden snapshot test cho prompt (áp dụng ý tưởng học từ `seeker19110/claude-agents`)

Người dùng yêu cầu rà repo tham khảo `seeker19110/claude-agents` xem có gì đáng học. Thứ đáng
học nhất và **chưa có trong DHCB**: _golden test cho prompt_ — repo đó coi "prompt là code", mỗi
agent có file golden chứa system prompt đã biên dịch, CI chạy job `golden-check` (`make golden`
rồi `git diff --exit-code`) nên **mọi thay đổi prompt đều lộ ra trong diff**, không thể sửa âm thầm.

Đã áp dụng vào DHCB nhưng **không bê nguyên hạ tầng** (repo kia là Python/pytest tự chế cơ chế
`UPDATE_GOLDEN=1` + header version): DHCB dùng Vitest vốn **đã có sẵn snapshot** — dùng
`toMatchSnapshot()` + cờ `-u` là đạt đúng mục tiêu, không phải viết thêm hạ tầng nào.

- Thêm `apps/dhcb/src/prompts/golden.test.ts` — 14 snapshot phủ 9 hàm dựng prompt:
  `chatSystemPrompt` (chiều A/B + ca có `targetWords` + `ageGroup`), `speakingSystemPrompt` (A/B),
  `writingSystemPrompt` (A/B), `pronunciationScoringPrompt` (A/B), `speakingFullEvaluationPrompt`,
  `chatFullEvaluationPrompt`, `interviewAnswerFeedbackPrompt`, `challengeFeedbackSystemPrompt`,
  `pathCheckSystemPrompt`.
- Snapshot nằm ở `apps/dhcb/src/prompts/__snapshots__/golden.test.ts.snap` (328 dòng).
- Cập nhật `CLAUDE.md` §8: thêm đoạn mô tả cổng mới + lệnh cập nhật snapshot.

**Vì sao BỔ SUNG chứ không THAY THẾ `eval:tutor`** (quyết định trong đợt này):

|                | `eval:tutor` (đã có)                                   | `golden.test.ts` (mới)                              |
| -------------- | ------------------------------------------------------ | --------------------------------------------------- |
| Gọi model thật | Có — tốn phí, cần key                                  | **Không**                                           |
| Chạy ở CI      | Không (chạy tay, dán bảng vào PR)                      | **Có, mọi PR**                                      |
| Bắt được gì    | Chất lượng **đổi có tốt lên không** (recall/precision) | Prompt **đổi cái gì** — kể cả sửa nhầm khi refactor |

Hai cổng trả lời hai câu hỏi khác nhau nên giữ cả hai. Test bất biến sẵn có
(`index.test.ts`, `pathCheckPrompt.test.ts` — kiểm "luôn tiếng Việt", "không lộ đáp án") **cũng
giữ nguyên**: snapshot bắt _mọi_ thay đổi nhưng không nói thay đổi nào là vi phạm luật; test bất
biến nói rõ luật nào bị phá. Xoá chúng đi là mất thông tin.

### 2. Bốn đặc tả cho đợt sau (chưa thi hành trong phiên này)

Người dùng chốt đổi mô hình gói: **xoá gói Pro, chỉ còn Free (hưởng hạn mức Pro cũ, miễn phí) +
VIP (trả phí)**; **VIP được học tự do (nhảy cấp tuỳ ý)**, Free phải đi tuần tự từ đầu; phạm vi
**toàn bộ** (Anh · Lập trình · 4 trụ). Người đang trả Pro → **nâng thành VIP tới hết hạn đã trả**.

Việc quá lớn cho một PR nên chia 4 giai đoạn, mỗi giai đoạn một đặc tả riêng, thi hành ở phiên sau:

- `docs/specs/2026-09-12-gd1-xoa-goi-pro.md`
- `docs/specs/2026-09-12-gd2-vip-hoc-tu-do-mon-anh.md`
- `docs/specs/2026-09-12-gd3-khoa-bai-mon-lap-trinh.md`
- `docs/specs/2026-09-12-gd4-khoa-bai-4-tru.md`

## Quyết định

1. **Dùng Vitest snapshot có sẵn, không tự chế cơ chế golden** — cùng giá trị, 0 dòng hạ tầng mới.
2. **Snapshot không thay `eval:tutor`, không thay test bất biến** — ba thứ bắt ba loại lỗi khác nhau.
3. **GĐ3/GĐ4 tách đặc tả riêng vì là THIẾT KẾ MỚI**, không phải sửa luật có sẵn: môn Lập trình và
   4 trụ hiện **không có** khái niệm khoá/mở bài học theo tiến độ (đã đọc mã xác minh).

## Bằng chứng kiểm chứng

- `npx vitest run apps/dhcb/src/prompts/golden.test.ts -u` → 14 snapshot written, 14/14 pass.
- `npm run typecheck` ✅ · `npm run lint` ✅ (0 cảnh báo) · `npm run format` ✅
- `npm test` → **577 file / 12.197 test pass** (trước đợt này: 576 / 12.183 — tăng đúng 1 file + 14 snapshot)
- Kiểm tay nội dung `.snap`: đúng nguyên văn prompt production (đối chiếu `challenge.ts` dòng 42+).

## Ghi chú cho đợt sau

Hai việc cùng loại **chưa làm** trong đợt này, cố ý để không phình phạm vi:

- Golden snapshot cho `packages/subject-programming/feedbackPrompt.ts` (prompt môn Lập trình,
  có eval riêng `eval:code-feedback`). Hàm `buildCodeFeedbackPrompt` trả về **object** chứ không
  phải string nên cần snapshot khác kiểu một chút — việc nhỏ, làm được ngay khi cần.
- Ý "eval ghi–phát lại offline trong CI" của repo tham khảo: DHCB **đã có phần lớn giá trị đó** qua
  `eval:tutor` + `docs/research/eval-tutor-baseline.md` (golden set + baseline so sánh). Khác biệt
  còn lại là repo kia replay bản ghi **trong CI** để chặn merge. Đáng cân nhắc nhưng cần thiết kế
  riêng (lưu bản ghi ở đâu, khi nào coi là lệch) — **chưa đủ chín để viết đặc tả**, ghi lại ở đây
  để không quên.
