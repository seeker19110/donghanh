# Đặc tả — `devops-s3`: Kubernetes, GitOps, quan sát và độ tin cậy

> Ngày: 2026-09-17 · Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT**
> Goal: `docs/goals/2026-09-15-ai-systems-architect.md` — lát cắt `M3/S2` (phần còn lại của M3;
> `M3/S1` = `devops-s2` đã merge ở PR #989).
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`.

## 0. Một câu

Lấp chặng rỗng cuối cùng của Giai đoạn 3 (Distributed Systems & Reliability): `devops-s3` có bốn
unit / tám bài Python MÔ PHỎNG để người học quyết định được về workload Kubernetes, GitOps, quan sát
và error budget — thay vì chỉ đọc lý thuyết vận hành.

## ① Phạm vi

**LÀM:**

- Bốn unit `p6-u194…p6-u197`, mỗi unit hai lesson theo vòng 8 bước, bám đúng bốn module của
  `devops-s3` trong `specializations/devops.ts` (dòng 171–222).
- Simulator Python deterministic, bounded, fail closed cho từng cơ chế; mỗi Make có ca hiện, ca ẩn
  và ca âm.
- Nối `SPEC_STAGE_UNITS['devops-s3']`, curriculum, registry bài học và `lessonsLazy.ts`.
- Semantic gate riêng `devopsS3Lessons.test.ts`.
- **Nối `devops-s3` vào lộ trình `principal-ai`** — thêm một `PathStageRef` vào giai đoạn
  `principal-ai-p4`, ngay sau `devops-s2`, kèm câu `why`.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- Không chạy Kubernetes, `kubectl`, Helm, Kustomize, Argo/Flux, Prometheus, Grafana, OpenTelemetry
  collector hay bất kỳ cluster/endpoint thật nào. Bài là MÔ PHỎNG hợp đồng quyết định, không phải
  lab hạ tầng.
- Không network, filesystem, subprocess, biến môi trường, đồng hồ hệ thống hay random toàn cục
  trong code chạy được — cùng ranh giới đã chốt ở `devops-s1`/`devops-s2`.
- Không đụng `devops-s1`/`devops-s2` đã merge, không đổi hay tái dùng unit id đã phát hành
  (`p6-u154…u157`, `p6-u178…u181`).
- Không thêm chaos/fault injection THẬT; chaos chỉ là bảng quyết định có giả thuyết, bán kính ảnh
  hưởng và điều kiện dừng.
- Không hứa simulator là SLO/alert production; nhãn MÔ PHỎNG bắt buộc.

## ② Điểm chạm

| Việc | Đường dẫn file                                                     | Ghi chú                                                    |
| ---- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u194.ts`                   | Workload contract & scheduling                             |
| Thêm | `packages/subject-programming/lessons/p6u195.ts`                   | Config, secret & GitOps desired state                      |
| Thêm | `packages/subject-programming/lessons/p6u196.ts`                   | Metric, log, trace & alert                                 |
| Thêm | `packages/subject-programming/lessons/p6u197.ts`                   | SLI/SLO, error budget & chaos                              |
| Thêm | `packages/subject-programming/devopsS3Lessons.test.ts`             | Semantic gate của lát cắt                                  |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`       | Thêm khoá `devops-s3`                                      |
| Sửa  | `packages/subject-programming/lessons.ts`                          | Đăng ký 4 unit vào registry đồng bộ                        |
| Sửa  | `packages/subject-programming/curriculum.ts`                       | Gắn unit vào bậc P6                                        |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                      | **SINH LẠI** bằng `npm run gen:lesson-index`, không gõ tay |
| Sửa  | `packages/subject-programming/learningPaths/principal-ai.ts`       | Thêm `devops-s3` vào `principal-ai-p4`                     |
| Sửa  | `packages/subject-programming/learningPaths/learningPaths.test.ts` | Kiểm chặng mới tra được và không vòng lặp `requires`       |

**Ảnh hưởng lan ra (chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts` trước khi sửa):**

- `stageUnits.test.ts` (kiểm chéo curriculum ↔ lessons), `lessonsLazy.test.ts`,
  `lessonsPython.test.ts`, `specializations.test.ts`.
- `ProgrammingPathPage.tsx` — số chặng của `principal-ai-p4` đổi từ 8 lên 9, mẫu số tiến độ đổi
  theo; `ProgrammingPathPage.test.tsx` phải được đọc lại, KHÔNG sửa số cho vừa mà phải xác nhận
  con số mới là đúng.

## ③ Hợp đồng dữ liệu

**Vào (hằng biên dịch trong `stageUnits.ts`):**

```ts
const DEVOPS_S3_UNIT_IDS = ['p6-u194', 'p6-u195', 'p6-u196', 'p6-u197'] as const
SPEC_STAGE_UNITS['devops-s3'] = [...DEVOPS_S3_UNIT_IDS]
```

**Hợp đồng từng unit:**

| Unit      | Module                             | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                       |
| --------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u194` | `devops-s3-m1` Kubernetes nền tảng | Workload fixture có request/limit, probe sống/sẵn sàng, HPA, ngân sách gián đoạn. `limit < request` → `reject`; thiếu readiness → không nhận traffic; HPA vượt `maxReplicas` → clamp + cảnh báo; `minAvailable` = 100% khoá drain vĩnh viễn → `deny`.                                                                        |
| `p6-u195` | `devops-s3-m2` Cấu hình và bí mật  | Desired state trong Git so với live state; overlay theo môi trường; vòng reconcile. Thay đổi tay ngoài Git → `drift`, không auto-approve; overlay thiếu khoá bắt buộc → fail closed; reconcile phải HỘI TỤ hoặc báo `no-converge` sau số vòng chặn trên; bí mật chỉ đi bằng tham chiếu/digest, **không bao giờ in giá trị**. |
| `p6-u196` | `devops-s3-m3` Quan sát            | Metric RED/USE, log, trace span cha–con, luật cảnh báo. Nổ số chiều nhãn vượt ngưỡng → `deny`; cảnh báo theo NGUYÊN NHÂN thay vì triệu chứng người dùng → hạ ưu tiên + nêu lý do; span mồ côi/thiếu cha → fail closed; log chứa PII → `redact`.                                                                              |
| `p6-u197` | `devops-s3-m4` Độ tin cậy          | SLI/SLO, tốc độ đốt error budget, chính sách phát hành, thí nghiệm chaos. Budget cạn → `freeze` phát hành; SLO = 100% → `invalid`; cửa sổ đo sai/rỗng → fail closed; chaos thiếu giả thuyết trạng thái ổn định, bán kính ảnh hưởng hoặc điều kiện dừng → `refuse`.                                                           |

**Ra (mọi simulator):** một dòng quyết định xác định, dạng
`"<decision>: <reason>"` với `decision ∈ {allow, deny, reject, refuse, drift, freeze, redact, unknown}`.

**Ca lỗi (là một phần hợp đồng, không phải phụ lục):**

| Tình huống                         | Mã / hành vi | Hành vi mong đợi                                                 |
| ---------------------------------- | ------------ | ---------------------------------------------------------------- |
| Input rỗng, thiếu trường, sai kiểu | `invalid`    | In một dòng `invalid: <trường>`, không ném exception, không treo |
| Mẫu đo ít hơn ngưỡng tối thiểu     | `unknown`    | Trả `unknown`, **cấm** quy về 0 hoặc gọi là "khoẻ mạnh"          |
| Mâu thuẫn giữa hai luật            | —            | Thứ tự ưu tiên tường minh, tất định; không phụ thuộc thứ tự dict |
| Trạng thái không nhận dạng được    | `deny`       | Fail closed                                                      |

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('devops-s3').length === 4`, mỗi unit ≥ 2 lesson — `npx vitest run packages/subject-programming/specializations/stageUnits.test.ts`
- [ ] 8 lesson đều là làn `python`, đều có Make với ca hiện + ca ẩn + ca âm — `npx vitest run packages/subject-programming/devopsS3Lessons.test.ts`
- [ ] Code mẫu và ca Predict chạy Python THẬT và qua toàn bộ test-case — `npx vitest run packages/subject-programming/lessonsPython.test.ts`
- [ ] Không lesson nào chỉ "đọc hiểu": mỗi unit có đủ predict / debug / build / measure / decide
- [ ] Executable code không có `import os`, `import sys`, `open(`, `socket`, `subprocess`, `requests`, `random`, `datetime.now` — gate kiểm bằng chuỗi cấm
- [ ] Markers bắt buộc xuất hiện: `probe`, `request`, `limit`, `drift`, `reconcile`, `cardinality`, `symptom`, `burn`, `error budget`, `blast radius`, `abort`, `freeze`
- [ ] `principal-ai-p4` có `devops-s3`; `getSpecStage('devops-s3')` tra được; `requires` không tạo vòng lặp — `npx vitest run packages/subject-programming/learningPaths/learningPaths.test.ts`
- [ ] `lessonsLazy.ts` được SINH LẠI, không sửa tay — `npm run gen:lesson-index` rồi `git diff` chỉ hiện phần sinh
- [ ] Make dùng `match: 'contains'` (runner echo stdin, so khớp tuyệt đối sẽ đỏ giả)

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/devopsS3Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming/lessonsLazy.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                    | Test nào canh nó                               |
| ----------------------------------------------------------- | ---------------------------------------------- |
| Chỉ khai chặng có bài khi unit thật đã tồn tại              | `specializations/stageUnits.test.ts`           |
| Chỉ mục nạp lười khớp registry đồng bộ                      | `lessonsLazy.test.ts`                          |
| Mọi lesson Python có code mẫu chạy qua hết test-case        | `lessonsPython.test.ts`                        |
| Lộ trình chỉ THAM CHIẾU chặng có thật, không nhúng nội dung | `learningPaths/learningPaths.test.ts`          |
| Id lộ trình/giai đoạn/chặng đã phát hành không đổi          | `learningPaths/learningPaths.test.ts`          |
| Simulator không có I/O ngoài và không in giá trị bí mật     | `devopsS3Lessons.test.ts` (viết mới ở lát này) |

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói dùng đường tương
  đối CÓ đuôi `.js`.
- Thêm/đổi bài học xong **bắt buộc** chạy `npm run gen:lesson-index`; quên thì `lessonsLazy.test.ts`
  đỏ với đúng câu nhắc đó.
- Comment trong file bài học viết tiếng Việt, giải thích "vì sao", không mô tả lại code.
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), không phải `npm test`.
- Trước lần push cuối: `rm -rf packages/*/dist dist dist-server` rồi chạy lại `npm run typecheck`
  để tái hiện checkout sạch của CI.
- Tiêu đề PR dùng scope chữ thường, ví dụ `feat(programming): ...`; mô tả phải có đủ 6 tiêu đề của
  cổng `metadata` và trỏ tới chính file đặc tả này kèm cụm "Approved for implementation".

## ⑦ Rollout và rollback

Một PR duy nhất cho cả lát cắt. Rollback = revert trọn PR rồi chạy lại `npm run gen:lesson-index`;
KHÔNG xoá tiến độ/artifact của người học và KHÔNG tái sử dụng unit id đã cấp. Rủi ro lớn nhất là
người học nhầm simulator với cluster thật — nhãn MÔ PHỎNG, semantic gate và rubric bài tập về nhà
(yêu cầu dựng cluster thật NGOÀI sandbox) là ba lớp chặn.

## ⑧ Câu hỏi duyệt

1. Đồng ý cấp dải `p6-u194…p6-u197` cho `devops-s3`?
2. Đồng ý **thêm `devops-s3` vào `principal-ai-p4`** (lộ trình đi từ 27 lên 28 chặng)? Thay đổi là
   cộng thêm, không đổi id cũ, nhưng mẫu số tiến độ hiển thị sẽ đổi.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
