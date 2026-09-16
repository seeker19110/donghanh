# Đặc tả — `security-s1`: threat model, crypto policy, API defense và session

> Trạng thái: **APPROVED FOR IMPLEMENTATION**. Goal `GOAL-2026-ASA`, lát cắt `M4/S1`.

## Phạm vi

`security-s1` gồm bốn unit/8 lesson Python MÔ PHỎNG, deterministic và fail closed:

| Unit      | Module                         | Hợp đồng bắt buộc                                                                                                                                             |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u182` | Threat model + least privilege | Asset/data-flow/trust-boundary fixture phải có owner và boundary; thiếu là `unknown-risk`, không `safe`; actor-resource-action ngoài policy deny.             |
| `p6-u183` | Crypto choice policy           | Phân biệt password hash, encryption và signature bằng metadata; plaintext password, primitive lạ/yếu, salt/rotation thiếu reject; không tự cài crypto.        |
| `p6-u184` | Defensive web/API policy       | Fixture parameter/query/encode và server-side object authorization; hostile synthetic input hoặc foreign object id chỉ safe deny; không payload/scan/exploit. |
| `p6-u185` | Identity/session lifecycle     | Login rotation, expiry, revocation và recovery rate limit; fixation, reuse, revoked/expired token deny; authn không thay authz.                               |

Mỗi unit có hai lesson 8 bước, Make visible/hidden/negative control, sample/Predict Python chạy thật,
SRS và homework artifact threat model hay review ngoài sandbox.

## Ranh giới an toàn

Không quét target, tạo payload tấn công, brute-force, gọi network/filesystem/subprocess, dùng secret
thật hoặc hướng dẫn né phòng thủ. Inputs là fixture đã redacted/bounded. Output chỉ classification,
deny hoặc remediation policy; không tiết lộ token/password/key.

## Nghiệm thu

- Integration bốn unit vào curriculum, registry/lazy index và
  `SPEC_STAGE_UNITS['security-s1'] = ['p6-u182','p6-u183','p6-u184','p6-u185']`.
- Semantic gate xác nhận 8 lesson/Python/visible+hidden, markers `boundary`, `unknown-risk`,
  `salt`, `rotation`, `deny`, `server-side`, `revoked`, `expired`; runnable code cấm I/O và secret output.
- Make dùng `match: 'contains'`; malformed/unknown state luôn fail closed, không crash/hang.

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/securityS1Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npm run typecheck && npm run lint && npm run format:check && npm test
```

Rollback là revert toàn source slice và generate lại index; không xoá progress/artifact hay tái dùng ID.
Rủi ro chính là coi simulator là kiểm thử bảo mật thật; nhãn MÔ PHỎNG, synthetic fixture và rubric
authorized assessment ngoài sandbox là guardrail.
