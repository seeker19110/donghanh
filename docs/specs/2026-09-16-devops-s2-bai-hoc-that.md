# Đặc tả — `devops-s2`: container, CI release, IaC và cloud policy

> Trạng thái: **APPROVED FOR IMPLEMENTATION**. Goal `GOAL-2026-ASA`, lát cắt `M3/S1`.

## Phạm vi

`devops-s2` có bốn unit/8 lesson Python MÔ PHỎNG, deterministic và bounded:

| Unit      | Module                        | Hợp đồng và ca biên bắt buộc                                                                                                    |
| --------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u178` | Container policy + provenance | Dockerfile/image fixture; root, secret layer, base không pinned hoặc SBOM/digest thiếu phải `deny`.                             |
| `p6-u179` | CI release + canary           | Quality gate song song, artifact immutable gắn commit; gate fail/commit mismatch không promote; health threshold kích rollback. |
| `p6-u180` | IaC plan/state                | Create/update/delete, remote-state lock, drift và destructive approval; concurrent apply/missing approval fail closed.          |
| `p6-u181` | IAM + cost                    | Least-privilege evaluator, allow-list và cost estimate bounded; wildcard admin/action lạ/budget breach deny hoặc alert.         |

Mỗi unit gồm 2 lesson 8 bước, Make visible/hidden/negative case, worked/Predict chạy Python thật,
SRS ≥2 thẻ, artifact homework phân biệt simulator với môi trường Linux/cloud thật.

## Ranh giới

Không chạy Docker, shell, Terraform, Kubernetes, cloud SDK/API, filesystem/network/subprocess hay
secret thật. Input là cấu trúc fixture nhỏ, không là manifest production. Simulator không cấp quyền,
deploy, destroy, scan hoặc ước lượng cloud bill thật.

## Nghiệm thu và integration

- `curriculum.ts`, `lessons.ts`, generated `lessonsLazy.ts` có bốn unit trên.
- `SPEC_STAGE_UNITS['devops-s2']` đúng `['p6-u178','p6-u179','p6-u180','p6-u181']` và stage test
  chỉ mở CTA khi tất cả unit có bài.
- `devopsS2Lessons.test.ts` kiểm 8 lesson/Python/visible+hidden và markers `root`, `secret`,
  `digest`, `immutable`, `rollback`, `lock`, `drift`, `wildcard`, `budget`; runnable code không
  external I/O.
- Make dùng `match: 'contains'` vì runner echo stdin; mọi parse/state thiếu phải output fail-closed
  xác định, không ném exception hoặc treo.

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/devopsS2Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npm run typecheck && npm run lint && npm run format:check && npm test
```

Rollback: revert toàn source slice, generate lại index; không tái dùng ID và không xoá progress hay
artifact. Rủi ro lớn nhất là đánh đồng fixture policy với quyền/deployment thật; nhãn MÔ PHỎNG,
semantic gate và rubric Linux/cloud ngoài sandbox là lớp chặn.
