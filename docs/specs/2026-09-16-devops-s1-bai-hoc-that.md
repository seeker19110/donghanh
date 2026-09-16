# Đặc tả — Bài học thật cho `devops-s1` và Runtime Lab Linux

> Ngày: 2026-09-16  
> Trạng thái: **APPROVED FOR IMPLEMENTATION** — đặc tả khóa tổng đã được chủ dự án duyệt; chủ
> dự án yêu cầu tiếp tục triển khai.  
> Goal: `GOAL-2026-ASA`, lát cắt `M2/S1e`.

## 0. Một câu

Biến chặng Linux/DevOps cơ bản thành tám bài tương tác có state machine tất định: người học biết
khoanh vùng sự cố, kiểm tra cấu hình an toàn, viết automation lũy đẳng và chỉ công nhận backup sau
khi có bằng chứng restore; sau đó thực hành Runtime Lab trên Linux thật, tách biệt với simulator.

## ① Phạm vi

**LÀM:**

- Tạo bốn unit `p6-u154..p6-u157`, mỗi unit phủ đúng một module `devops-s1-m1..m4`; mỗi unit có
  hai bài Python theo vòng hook → theory → worked example → Predict → Parsons → Make → homework → SRS.
- `p6-u154` — **Linux và service**: supervisor/service lifecycle, restart và trace journal;
  triage CPU/RAM/disk/file descriptor, quyền tối thiểu và bề mặt SSH ở mô hình hữu hạn.
- `p6-u155` — **Mạng và HTTPS**: ladder DNS → TCP port → TLS → HTTP, phân biệt điểm lỗi;
  reverse-proxy, exposure firewall và hạn chứng chỉ trong mô hình hữu hạn.
- `p6-u156` — **Automation an toàn**: mô hình fail-fast, lỗi biến cấu hình, trạng thái mong muốn
  lũy đẳng; phát hiện bí mật giả định trong source/history mà không đưa bí mật thật vào lesson.
- `p6-u157` — **Backup và restore**: inventory 3-2-1, freshness/RPO; state machine restore drill,
  RTO và rule không có restore evidence thì chưa protected.
- Đăng ký curriculum, registry thường/lazy và `SPEC_STAGE_UNITS['devops-s1']` khi đủ tám bài;
  CTA trên trang hướng DevOps sẽ tự mở theo mapping.
- Runtime Lab là artifact Linux thật: HTTP server có worker pool, profiler, load test và báo cáo
  memory/I/O. Bài sandbox chuẩn bị tư duy vận hành; rubric artifact không bị thay bằng output mô phỏng.

**KHÔNG LÀM:**

- Không chạy `systemctl`, `journalctl`, SSH, `dig`, `curl`, `ss`, `tcpdump`, Nginx, firewall, TLS,
  backup thật hoặc mở socket/process từ browser/CI.
- Không thêm Bash runtime, VM, cloud account, VPS, chứng chỉ, dependency hay production deploy.
- Không coi simulator vượt test là bằng chứng dựng VPS <30 phút, TLS tự gia hạn, không lộ secret,
  hay backup thực sự restore được; các yêu cầu đó giữ nguyên trong rubric `devops-s1`.
- Không mở sang container/CI-CD/IaC/cloud của `devops-s2`, multi-machine/load balancer thật hoặc
  observability/Kubernetes của chặng sau; không đổi quiz, module, API hay dữ liệu tiến độ.

## ② Điểm chạm

| Việc | Đường dẫn                                                                         |
| ---- | --------------------------------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u154.ts` — Linux service/triage           |
| Thêm | `packages/subject-programming/lessons/p6u155.ts` — DNS/TLS/proxy boundary         |
| Thêm | `packages/subject-programming/lessons/p6u156.ts` — automation/idempotency/secrets |
| Thêm | `packages/subject-programming/lessons/p6u157.ts` — backup/restore/RPO-RTO         |
| Thêm | `packages/subject-programming/devopsS1Lessons.test.ts` — semantic boundary gate   |
| Sửa  | `curriculum.ts`, `lessons.ts`, `lessonsLazy.ts` — bốn unit và tám bài             |
| Sửa  | `specializations/stageUnits.ts` + test — mapping `devops-s1`                      |
| Sửa  | `e2e/programming-path.spec.ts` — trang hướng DevOps có CTA học S1                 |
| Thêm | `docs/changelog/` — bằng chứng implementation                                     |

Ảnh hưởng lan ra: `lessonsPython.test.ts` chạy sample/worked/Predict bằng Python thật; schema,
curriculum, SRS, Markdown và lazy-index tests kiểm chéo dữ liệu. Runtime Lab vẫn cần Linux thật và
minh chứng riêng, không có provider/credential nào được thêm vào repo.

## ③ Hợp đồng dữ liệu

```ts
type DevopsS1ModuleId = 'devops-s1-m1' | 'devops-s1-m2' | 'devops-s1-m3' | 'devops-s1-m4'

const DEVOPS_S1_UNIT_IDS = ['p6-u154', 'p6-u155', 'p6-u156', 'p6-u157'] as const

// Mỗi file export đúng hai ProgrammingLesson, language: 'python'.
// SPEC_STAGE_UNITS['devops-s1'] === DEVOPS_S1_UNIT_IDS.
```

Mọi simulator nhận input hữu hạn, tất định, tạo state mới mỗi lượt; không đọc file/mạng/process,
không dùng clock hay random toàn cục. Nội dung và UI phải ghi rõ **MÔ PHỎNG**, cùng ranh giới với
Linux/VPS thật.

| Tình huống                              | Hành vi bắt buộc                                                            |
| --------------------------------------- | --------------------------------------------------------------------------- |
| service crash và restart policy bật     | trace chuyển `failed → restarting → running`; không lẫn với health thật     |
| CPU/RAM/disk/fd cạn                     | triage trả nguyên nhân ưu tiên và dữ kiện, không đoán theo một metric       |
| DNS/TCP/TLS/HTTP hỏng ở một tầng        | ladder dừng đúng tầng; tầng sau không được báo “đã kiểm”                    |
| port không trong allow-list             | request bị chặn trước proxy/app; lý do exposure phải hiện trong state       |
| automation gặp command/config lỗi       | dừng với exit khác 0, giữ failure trace; không chạy tiếp giả định sai       |
| chạy desired-state lần hai              | không thêm user/port/record/tác dụng phụ; output nêu `unchanged`            |
| token mẫu nằm source hoặc history       | policy fail, chỉ hiển thị placeholder/redacted fingerprint, không in secret |
| backup không off-site hoặc chưa restore | không đạt `protected`; RPO/RTO chỉ hợp lệ khi có timestamp/evidence         |

## ④ Tiêu chí chấp nhận

- [ ] Có đúng bốn unit, tám lesson, mỗi unit hai lesson và có Make visible/hidden/edge case.
- [ ] Mọi worked example, Predict và sample solution chạy bằng Python thật, output tất định.
- [ ] Service/triage mô hình hóa restart, journal, resource saturation và quyền/exposure mà không
      tuyên bố kiểm tra được host thật.
- [ ] Network ladder phân biệt DNS, TCP, TLS và HTTP; proxy/firewall không mở cổng ngầm.
- [ ] Automation bắt fail-fast/undefined config, chứng minh idempotency lần hai và redacts dấu vết
      secret mẫu; không chứa key/token thật trong fixture, output hoặc test.
- [ ] Backup model bắt buộc off-site + restore evidence, tính RPO/RTO từ dữ liệu mô phỏng và từ chối
      kết luận khi evidence thiếu/stale.
- [ ] Mọi bài ghi “MÔ PHỎNG”; không có Bash/system command/network call hay tuyên bố VPS thật.
- [ ] `unitsOfStage('devops-s1')` trả đúng `p6-u154..p6-u157`; UI hướng DevOps hiện CTA S1.
- [ ] Artifact Runtime Lab và năm rubric Linux/VPS thật giữ nguyên, không tự đánh dấu hoàn thành.

**Lệnh nghiệm thu:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/devopsS1Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming apps/dhcb/src/lib/lessonMarkdown.test.ts
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npx playwright test e2e/programming-path.spec.ts --project=chromium
```

## ⑤ Bất biến

| Bất biến                                                    | Cổng                                    |
| ----------------------------------------------------------- | --------------------------------------- |
| Lesson schema, unit thật, test hiện/ẩn                      | `lessons.test.ts`, `curriculum.test.ts` |
| Python mẫu/đáp án chạy thật                                 | `lessonsPython.test.ts`                 |
| Simulator fail closed và không lộ secret                    | `devopsS1Lessons.test.ts` + review      |
| Không giả Linux/VPS/network/TLS thật                        | `devopsS1Lessons.test.ts` + review      |
| Unit không thuộc hai stage, thứ tự ổn định                  | `stageUnits.test.ts`                    |
| Registry nguồn và lazy đồng bộ                              | `lessonsLazy.test.ts`, generator        |
| SRS không lộ đáp án                                         | `srsCards.test.ts`                      |
| Backup/restore, TLS, secret, idempotency artifact giữ chuẩn | review `details/devops-s1.ts`           |

## ⑥ Quy ước, rollout và rollback

- Nội dung tiếng Việt; code Python không dấu, state transition và evidence tường minh.
- Không dạy “port mở = app healthy”, “TLS = HTTP đã đúng”, hay “backup tồn tại = restore được”.
- Không đưa mẫu bí mật có thể dùng được; dùng placeholder/fingerprint redacted cố định.
- Automation chỉ được gọi idempotent khi lần chạy tiếp theo không đổi state mong muốn.
- Runtime Lab dùng Linux thật, worker pool/load/profiler/report là artifact riêng: learner đính kèm
  code, lệnh chạy, tải, số liệu memory/I/O và kết quả; lesson pass không thay thế evidence đó.

Rollout một PR source sau khi PR spec merge: thêm bài → chạy semantic/Python gates → sinh lazy index
→ cuối cùng mới ánh xạ stage và E2E. Rollback bằng revert trọn PR source, sinh lại lazy index,
không đổi/xóa tiến độ hay tái sử dụng ID. Production deploy ngoài phạm vi nếu không có lệnh riêng.

## Nghiệm thu đặc tả

- Phủ đủ bốn module DevOps S1 và Runtime Lab Linux: có.
- Giữ đúng ranh giới browser simulator với Linux/VPS/TLS/backup thật: có.
- Rủi ro chính: learner hiểu output mô phỏng là hardening/restore thật; đã khóa bằng nhãn, test,
  policy fail-closed và rubric artifact.
- Còn để ngỏ: hạ tầng Bash/Linux sandbox, chấm Runtime Lab thực, container/CI-CD/IaC `devops-s2`.
