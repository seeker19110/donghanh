# Đặc tả — `devops-s4`: nền tảng nội bộ, chuỗi cung ứng, phục vụ mô hình và văn hoá vận hành

> Ngày: 2026-09-17 · Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT**
> Goal: `docs/goals/2026-09-15-ai-systems-architect.md` — lát cắt `M5/S1`.
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`.

## 0. Một câu

Lấp chặng rỗng duy nhất của Giai đoạn 5 (AI Platform, Serving & Agent Runtime): `devops-s4` có bốn
unit / tám bài Python MÔ PHỎNG để người học quyết định được về lối đi lát sẵn, xuất xứ tạo tác,
sức chứa–chi phí phục vụ mô hình và văn hoá vận hành.

## 1. Vì sao lát cắt này ghép "nền tảng nội bộ" với "phục vụ mô hình"

Giai đoạn 5 của đặc tả chương trình (`2026-09-15-khoa-kien-truc-su-phan-mem-ai.md` §4) gồm bốn
chặng: `devops-s4`, `security-s1..s2`, `principal-s1..s2`. Ba trong bốn đã có bài. Phần agent
runtime, hợp đồng công cụ, ngân sách vòng lặp và cổng phát hành mô hình **đã nằm ở `ai-s4`**
(`p6-u174…u177`, PR #976) — soạn lại ở đây sẽ tạo hai nguồn sự thật cho cùng kiến thức, đúng rủi ro
"nhân bản nội dung giữa 4 tầng curriculum" trong risk register.

**Quyết định:** `devops-s4` giữ đúng bốn module đã khai trong `specializations/devops.ts`
(dòng 225–275) — nền tảng cho lập trình viên · chuỗi cung ứng · quy mô và chi phí · văn hoá vận hành
— và lấy **phục vụ mô hình làm lab cụ thể** cho hai module giữa. Không trùng `ai-s4`, vẫn phủ đủ
"serving, GPU, observability, FinOps" mà milestone M5 đòi.

## ① Phạm vi

**LÀM:**

- Bốn unit `p6-u198…p6-u201`, mỗi unit hai lesson theo vòng 8 bước.
- Simulator Python deterministic, bounded, fail closed; mỗi Make có ca hiện, ca ẩn, ca âm.
- Nối `SPEC_STAGE_UNITS['devops-s4']`, curriculum, registry, `lessonsLazy.ts`.
- Semantic gate `devopsS4Lessons.test.ts`.
- **Nối `devops-s4` vào `principal-ai-p4`**, sau `devops-s3`.

**KHÔNG LÀM:**

- Không gọi GPU, cluster, model server (vLLM/TGI/Triton/Ollama), model registry, provider AI trả
  phí, cloud billing API hay bất kỳ endpoint thật nào.
- Không tải/chạy/huấn luyện/lượng tử hoá mô hình thật. Mọi con số sức chứa là **ước lượng từ công
  thức trên fixture**, không phải benchmark.
- Không ký tạo tác thật, không sinh/đọc khoá thật, không chạm secret thật.
- Không khoá vendor: tên công cụ chỉ xuất hiện như ví dụ có thể thay thế, nguyên lý mới là nội dung
  bắt buộc (guardrail "nội dung tool-specific nhanh lỗi thời" trong goal).
- Không đụng `ai-s4` đã có; không lặp lại hợp đồng tool-loop/agent budget của `p6-u176`.

## ② Điểm chạm

| Việc | Đường dẫn file                                               | Ghi chú                                |
| ---- | ------------------------------------------------------------ | -------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u198.ts`             | Lối đi lát sẵn & DORA                  |
| Thêm | `packages/subject-programming/lessons/p6u199.ts`             | SBOM, ký, xuất xứ, xoay vòng bí mật    |
| Thêm | `packages/subject-programming/lessons/p6u200.ts`             | Sức chứa & chi phí phục vụ mô hình     |
| Thêm | `packages/subject-programming/lessons/p6u201.ts`             | Đo lường vận hành AI & post-mortem     |
| Thêm | `packages/subject-programming/devopsS4Lessons.test.ts`       | Semantic gate                          |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts` | Thêm khoá `devops-s4`                  |
| Sửa  | `packages/subject-programming/lessons.ts`                    | Đăng ký 4 unit                         |
| Sửa  | `packages/subject-programming/curriculum.ts`                 | Gắn unit vào bậc P6                    |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                | **SINH LẠI**, không gõ tay             |
| Sửa  | `packages/subject-programming/learningPaths/principal-ai.ts` | Thêm `devops-s4` vào `principal-ai-p4` |

**Ảnh hưởng lan ra:** như lát `devops-s3` — `stageUnits.test.ts`, `lessonsLazy.test.ts`,
`lessonsPython.test.ts`, `ProgrammingPathPage.tsx` (mẫu số chặng của P4). Chạy
`npm run codemap -- impact packages/subject-programming/lessons.ts` trước khi sửa.

## ③ Hợp đồng dữ liệu

```ts
const DEVOPS_S4_UNIT_IDS = ['p6-u198', 'p6-u199', 'p6-u200', 'p6-u201'] as const
SPEC_STAGE_UNITS['devops-s4'] = [...DEVOPS_S4_UNIT_IDS]
```

| Unit      | Module                                     | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u198` | `devops-s4-m1` Nền tảng cho lập trình viên | Khuôn mẫu dịch vụ + cổng tự phục vụ; tính bốn chỉ số DORA trên nhật ký phát hành bounded. Dịch vụ đi vòng qua khuôn mẫu → `deny` kèm nêu cổng bị bỏ; lead time âm hoặc lệch đồng hồ → `invalid`; mẫu nhỏ hơn ngưỡng → `unknown`, **cấm** quy về 0; khôi phục chưa xong không được tính vào MTTR.                                                                                                                                              |
| `p6-u199` | `devops-s4-m2` Bảo mật chuỗi cung ứng      | Tạo tác (gồm **mô hình và tập dữ liệu**) phải có SBOM, chữ ký, xuất xứ build, digest cố định, giấy phép. Thiếu bất kỳ mục nào → `deny`; digest không khớp → `deny`; bí mật quá hạn xoay vòng → `rotate` + chặn phát hành; hai luật chính sách mâu thuẫn → thứ tự ưu tiên tất định. **Không in giá trị bí mật**, chỉ tham chiếu.                                                                                                               |
| `p6-u200` | `devops-s4-m3` Quy mô và chi phí           | Ước lượng bộ nhớ GPU theo công thức (trọng số + KV cache = f(số lớp, số đầu, độ dài ngữ cảnh, số luồng song song, độ rộng lượng tử hoá)); gộp lô; định tuyến thác nhỏ→lớn có dự phòng; chi phí trên mỗi lần thành công. Cấu hình vượt ngân sách bộ nhớ → `reject` kèm số thiếu; thác không bao giờ leo thang hoặc luôn leo thang → gắn cờ; mẫu số lần thành công = 0 → `unknown`, cấm chia; chuỗi dự phòng có vòng → chặn bằng trần vòng lặp. |
| `p6-u201` | `devops-s4-m4` Văn hoá vận hành            | Phân rã độ trễ (thời gian tới token đầu, độ trễ giữa các token) và span truy hồi/mô hình/công cụ; post-mortem không đổ lỗi; đo việc thủ công lặp lại; chuẩn bị sự kiện tải cao. Phân vị tính trên ít hơn ngưỡng mẫu → `unknown`; span thiếu cha → fail closed; post-mortem thiếu dòng thời gian / nguyên nhân gốc / chủ sở hữu hành động / ngày review → `incomplete`; ước lượng toil âm → `invalid`.                                         |

**Ra:** một dòng `"<decision>: <reason>"`, `decision ∈ {allow, deny, reject, rotate, unknown, invalid, incomplete}`.

**Ca lỗi:** giống bảng ở đặc tả `devops-s3` §③ — input sai kiểu/thiếu trường → `invalid`; mẫu dưới
ngưỡng → `unknown`; trạng thái lạ → fail closed; không ném exception, không treo.

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('devops-s4').length === 4`, 8 lesson Python, mỗi Make có ca hiện + ẩn + âm
- [ ] Code mẫu và ca Predict chạy Python thật, qua hết test-case — `lessonsPython.test.ts`
- [ ] Gate chứng minh ranh giới: không I/O ngoài, không tên vendor nào xuất hiện trong **code chạy
      được** (chỉ được nhắc trong phần giải thích, kèm chữ "có thể thay bằng")
- [ ] Markers bắt buộc: `golden path`, `dora`, `sbom`, `signature`, `provenance`, `digest`,
      `rotate`, `kv cache`, `quantization`, `gpu`, `cascade`, `fallback`, `cost-per-success`,
      `ttft`, `span`, `postmortem`, `toil`
- [ ] Không có câu nào tuyên bố simulator là benchmark GPU, hoá đơn cloud thật hay cam kết độ trễ
      của model thật — gate kiểm bằng danh sách cụm từ cấm
- [ ] Công thức bộ nhớ GPU có ca kiểm chứng ngược: đổi độ dài ngữ cảnh gấp đôi thì KV cache gấp đôi
- [ ] `principal-ai-p4` có `devops-s4`; `getSpecStage` tra được; không vòng lặp `requires`
- [ ] `lessonsLazy.ts` sinh lại bằng lệnh, không sửa tay

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/devopsS4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                            | Test nào canh nó                      |
| --------------------------------------------------- | ------------------------------------- |
| Chỉ khai chặng có bài khi unit thật đã tồn tại      | `specializations/stageUnits.test.ts`  |
| Chỉ mục nạp lười khớp registry đồng bộ              | `lessonsLazy.test.ts`                 |
| Mọi lesson Python có code mẫu qua hết test-case     | `lessonsPython.test.ts`               |
| Không nhân bản hợp đồng agent/tool-loop của `ai-s4` | `devopsS4Lessons.test.ts` (viết mới)  |
| Nội dung không khoá vendor                          | `devopsS4Lessons.test.ts` (viết mới)  |
| Id đã phát hành không đổi, không tái dùng           | `learningPaths/learningPaths.test.ts` |

## ⑥ Quy ước dự án liên quan

- `npm run gen:lesson-index` sau mọi thay đổi bài học.
- Make dùng `match: 'contains'` vì runner echo stdin.
- Cổng CI là `npm run test:coverage`.
- Import nội bộ gói có đuôi `.js`; xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi.
- Comment tiếng Việt, giải thích "vì sao".

## ⑦ Rollout và rollback

Một PR cho cả lát cắt. Rollback = revert trọn PR + sinh lại chỉ mục; không xoá tiến độ/artifact,
không tái dùng id. Rủi ro lớn nhất: người học tưởng ước lượng bộ nhớ GPU là cam kết vận hành thật.
Ba lớp chặn: nhãn MÔ PHỎNG, gate cấm cụm từ benchmark/cam kết, và bài tập về nhà bắt buộc đo trên
hạ tầng thật NGOÀI sandbox rồi so với ước lượng.

## ⑧ Câu hỏi duyệt

1. Đồng ý cấp dải `p6-u198…p6-u201`?
2. Đồng ý cách chia ở mục 1 — `devops-s4` giữ bốn module nền tảng, lấy phục vụ mô hình làm lab, và
   **không** soạn lại agent runtime vì `ai-s4` đã phủ?
3. Đồng ý thêm `devops-s4` vào `principal-ai-p4` (lộ trình lên 29 chặng)?

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
