# Đặc tả — `ai-s2..s4`: ML, deep learning và vận hành AI

> Trạng thái: **APPROVED FOR IMPLEMENTATION**. Goal `GOAL-2026-ASA`, lát cắt `M4/S1`.

## Phạm vi

- `ai-s2`: bốn unit Python deterministic cho baseline/time split và leakage, confusion/threshold,
  feature importance/fairness, cùng lựa chọn mô hình theo cost–quality.
- `ai-s3`: bốn unit cho gradient/checkpoint loss, attention bounded, nhãn/shift, và quyết định
  prompt–fine-tune/quantization bằng bảng eval–latency.
- `ai-s4`: bốn unit cho model release gate/versioning, drift/feedback, agent tool-loop có budget,
  và harm/privacy/incident decision record.
- Mỗi unit gồm hai lesson 8 bước, Make visible/hidden, code mẫu Python chạy thật, SRS, curriculum,
  lazy registry, CTA stage và semantic gate.

## Ranh giới

Không tải/huấn luyện model thật, không gọi API trả phí, GPU, provider, filesystem, network, random
global hoặc dữ liệu người dùng. Các simulator chỉ nhận input bounded, deterministic và fail closed;
artifact ngoài sandbox mới được dùng dataset, framework ML, benchmark, dashboard hay deployment thật.

## Hợp đồng unit

```ts
const AI_S234_UNIT_IDS = [
  'p6-u166',
  'p6-u167',
  'p6-u168',
  'p6-u169',
  'p6-u170',
  'p6-u171',
  'p6-u172',
  'p6-u173',
  'p6-u174',
  'p6-u175',
  'p6-u176',
  'p6-u177',
] as const
```

| Stage | Unit | Hợp đồng simulator và ca biên bắt buộc                                                          |
| ----- | ---- | ----------------------------------------------------------------------------------------------- |
| ai-s2 | 166  | Time split chỉ dùng quá khứ; future/leakage bị từ chối; baseline được so cùng holdout.          |
| ai-s2 | 167  | Confusion/precision/recall/threshold; denominator 0 và class imbalance phải tường minh.         |
| ai-s2 | 168  | Feature contribution và group error trên nhóm bounded; group rỗng/nhạy cảm không được suy rộng. |
| ai-s2 | 169  | Model selection theo metric, latency, cost; dominated option bị loại; tie-break rõ.             |
| ai-s3 | 170  | Loss/gradient finite difference bounded; NaN, epsilon/lr sai và diverged fail closed.           |
| ai-s3 | 171  | Attention trên sequence ngắn; mask/shape/softmax denominator sai bị từ chối.                    |
| ai-s3 | 172  | Label agreement và distribution shift theo histogram; empty group/invalid count fail closed.    |
| ai-s3 | 173  | Prompt/fine-tune/quantization decision matrix; không tuyên bố latency model thật.               |
| ai-s4 | 174  | Version tuple code/data/model và release gate; thiếu approval/eval/rollback không release.      |
| ai-s4 | 175  | Drift, feedback delay và alert threshold; quality unknown không được gọi healthy.               |
| ai-s4 | 176  | Tool loop allow-list, schema, step/cost budget, idempotency key và cancellation.                |
| ai-s4 | 177  | Harm/PII/license risk decision; high risk cần human review/audit trail.                         |

## Nghiệm thu

- [ ] 12 unit / 24 lesson Python, mỗi Make có visible, hidden và negative/edge control.
- [ ] Output contract không bị runner echo làm hỏng: Make dùng `match: 'contains'`.
- [ ] Không có claim simulator là train, serving, GPU benchmark, fairness proof hay compliance quyết định.
- [ ] `SPEC_STAGE_UNITS` map đúng `ai-s2`, `ai-s3`, `ai-s4`; `curriculum.ts`, `lessons.ts` và
      generated `lessonsLazy.ts` đồng bộ.
- [ ] Semantic test chứng minh boundaries: leakage, denominator/NaN, shift, budget exhaustion,
      approval/rollback, PII/human-review đều xuất hiện và code không dùng external I/O.

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/aiS234Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npm run typecheck && npm run lint && npm run format:check && npm test
```

Rollback là revert trọn PR source và generate lại index; không xoá progress/artifact hay tái sử dụng
unit ID. Rủi ro chính là biến simulator thành lời hứa production; nhãn MÔ PHỎNG, contracts,
semantic gate và rubric artifact là các lớp chặn.
