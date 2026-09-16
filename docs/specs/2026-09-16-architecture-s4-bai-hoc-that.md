# Đặc tả — `architecture-s4`: NFR, migration và quản trị kiến trúc có thể kiểm chứng

> Trạng thái: **APPROVED FOR IMPLEMENTATION**. Goal `GOAL-2026-ASA`, lát cắt `M6/S1`.

## Phạm vi

`architecture-s4` gồm bốn unit/8 lesson Python **MÔ PHỎNG**, bounded và deterministic. Mỗi unit
biến một quyết định kiến trúc thành contract có input, kết quả, failure mode và chủ sở hữu rõ ràng.

| Unit      | Module              | Hợp đồng bắt buộc                                                                                                                                              |
| --------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u190` | NFR quality gate    | Đánh giá latency, availability, error-rate và cost theo ngưỡng đo được; metric/threshold thiếu hoặc regression phải `fail`.                                    |
| `p6-u191` | Strangler migration | Mô phỏng feature-flag slice, shadow comparison, dual-read/write compatibility; mismatch hoặc thiếu rollback owner/trigger phải freeze hoặc rollback.           |
| `p6-u192` | Architecture health | Phát hiện dependency cycle, hotspot/module quá lớn và ưu tiên technical-debt theo impact/interest; cycle hay budget regression là violation.                   |
| `p6-u193` | Executable handoff  | Kiểm tra bounded spec/ADR: context, decision, alternatives, owner, acceptance và revisit condition; contract mơ hồ hoặc xung đột boundary không được delegate. |

Mỗi unit có hai lesson 8 bước. Make gồm visible, hidden và negative/edge case; sample/Predict
chạy Python thật; SRS và homework yêu cầu artifact kiến trúc có traceable evidence.

## Ranh giới an toàn và thực dụng

Đây là simulator chính sách, không gọi cloud, database, network, filesystem hoặc subprocess và
không triển khai migration production. Dữ liệu chỉ là fixture nhỏ, không có customer data. Các
contract luôn fail closed khi đo lường, owner, rollback hay compatibility evidence không đủ.

## Nghiệm thu

- Tích hợp bốn unit vào curriculum, registry/lazy index và
  `SPEC_STAGE_UNITS['architecture-s4'] = ['p6-u190','p6-u191','p6-u192','p6-u193']`.
- `architectureS4Lessons.test.ts` kiểm đúng 8 lesson Python, hai lesson/unit, Make visible+hidden,
  marker **MÔ PHỎNG**, và source không dùng I/O.
- Gate semantic chứng minh NFR measurable/fail, shadow mismatch rollback, dependency cycle/debt
  violation, và ADR/spec thiếu owner/acceptance/revisit không handoff được.
- Make dùng `match: 'contains'`; mọi state không xác định đều trả result safe, có reason rõ và
  không tự quyết định promote/deploy.

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/architectureS4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npm run typecheck && npm run lint && npm run format:check && npm test
```

Rollback là revert toàn source slice và generate lại index; không xoá progress/artifact hay tái dùng
ID. Rủi ro chính là biến NFR/ADR thành checklist hình thức: semantic gate bắt buộc evidence đo được,
failure branch và ownership/decision review date.
