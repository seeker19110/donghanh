# Đặc tả — `security-s2`: assessment scope, triage và disclosure có trách nhiệm

> Trạng thái: **APPROVED FOR IMPLEMENTATION**. Goal `GOAL-2026-ASA`, lát cắt `M4/S1`.

## Phạm vi

`security-s2` gồm bốn unit/8 lesson Python MÔ PHỎNG, bounded, deterministic và defensive:

| Unit      | Module                      | Hợp đồng bắt buộc                                                                                                                                           |
| --------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u186` | Authorized assessment scope | Ledger có consent, target, time window, test account, non-destructive mode; thiếu/hết hạn/out-of-scope phải `refuse` trước action.                          |
| `p6-u187` | Web/API finding triage      | Fixture đã redacted cho authz/input validation; phân loại evidence tối thiểu thành finding/insufficient, không scan/payload automation.                     |
| `p6-u188` | Exposure + secret triage    | Inventory fixture port/service/config/history; leaked-secret chỉ đưa rotate/revoke recommendation, không in giá trị secret.                                 |
| `p6-u189` | Responsible disclosure      | Report state gồm severity, impact, repro-redacted, remediation, owner/timeline; thiếu consent/redaction/remediation là incomplete, public-before-fix block. |

Mỗi unit có hai lesson 8 bước, Make visible/hidden/negative case, sample/Predict chạy Python thật,
SRS và homework yêu cầu artifact được ủy quyền ngoài sandbox.

## Ranh giới an toàn

Không dò quét, khai thác, tạo payload, brute-force, gọi network/filesystem/subprocess hay thao tác
secret thật. Findings chỉ dùng evidence synthetic/redacted; simulator không trả thao tác tấn công,
target, port thực hay chuỗi bí mật.

## Nghiệm thu

- Integration bốn unit vào curriculum, registry/lazy index và
  `SPEC_STAGE_UNITS['security-s2'] = ['p6-u186','p6-u187','p6-u188','p6-u189']`.
- Semantic gate kiểm 8 lesson/Python/visible+hidden; markers `consent`, `scope`, `refuse`,
  `redacted`, `non-destructive`, `rotate`, `embargo`, `remediation`; executable code cấm I/O,
  scan/payload/exploit vocabulary và secret output.
- Make dùng `match: 'contains'`; any missing authorization/state invalid fail closed.

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/securityS2Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npm run typecheck && npm run lint && npm run format:check && npm test
```

Rollback là revert toàn source slice và generate lại index; không xoá progress/artifact hay tái dùng ID.
Rủi ro là vô tình biến bài phòng thủ thành playbook tấn công; fixture synthetic, contract consent và
semantic gate là guardrail bắt buộc.
