# Đặc tả — Capstone, audit toàn khoá và bằng chứng phát hành

> Ngày: 2026-09-17 · Trạng thái: **APPROVED FOR IMPLEMENTATION** (chủ dự án duyệt ngày 2026-09-17)
> Goal: `docs/goals/2026-09-15-ai-systems-architect.md` — lát cắt `M7/S1`, lát cắt ĐÓNG GOAL.
> Phụ thuộc: M3/S2, M5/S1, M6/S1a, M6/S1b đã merge. Khuôn: `docs/templates/dac-ta-tinh-nang.md`.

## 0. Một câu

Biến capstone từ một dòng chữ mô tả thành hồ sơ 12 thành phần có rubric chấm được, rồi chạy audit
toàn khoá để chứng minh mọi chặng của `principal-ai` có bài thật trước khi đóng goal `GOAL-2026-ASA`.

## 1. Lát cắt này KHÔNG soạn bài học mới

Không cấp unit `p6-u*` nào. Capstone là **hồ sơ bằng chứng** người học tự làm ngoài sandbox, không
phải bài tập trong trình chạy. Toàn bộ việc ở đây là dữ liệu rubric, giao diện, cổng kiểm và bằng
chứng phát hành.

## ① Phạm vi

**LÀM:**

- Kiểu và dữ liệu capstone: 12 thành phần bắt buộc + rubric 100 điểm 8 hạng mục + luật điểm sàn.
- Giao diện capstone ở trang lộ trình: danh sách 12 mục, ô tự chấm, nộp link artifact.
- **Cổng bất biến đóng goal:** test khẳng định MỌI `stageId` mà `principal-ai` tham chiếu đều có
  `unitsOfStage(stageId).length > 0`.
- Audit toàn khoá theo `docs/framework/QUY-TRINH-AUDIT.md`, gồm Tầng 8b (nhìn ảnh chụp thật
  1440px + 390px, trước/sau).
- Bằng chứng phát hành: file changelog mới, cập nhật `PROGRESS.md`, tick mục 7 của goal.

**KHÔNG LÀM:**

- **Không chấm artifact bằng AI.** Quyết định đã chốt ở đợt 3 của `pathArtifactService.ts`; tầng này
  chỉ lưu link + ghi chú người học tự khai. Tự chấm rubric cũng là người học tự khai.
- Không migration CSDL. Capstone dùng lại `phaseId = 'principal-ai-p5'` đã hợp lệ trong registry,
  nên bảng artifact (migration 0074) không đổi.
- Không thêm lộ trình, không đổi `pathId`/`phaseId`/`stageId` đã phát hành.
- Không thêm chặng hay unit mới.
- Không tự chấm điểm ma trận thị giác — điểm cuối là của chủ dự án (đúng luật đã áp ở S13).

## ② Điểm chạm

| Việc | Đường dẫn file                                                        | Ghi chú                                                                                                                                                          |
| ---- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sửa  | `packages/subject-programming/learningPaths/types.ts`                 | Thêm `PathCapstone`, `CapstoneDeliverable`, `RubricCategory`; trường `capstone?` trên `LearningPath` (**tuỳ chọn** → lộ trình khác không khai vẫn render như cũ) |
| Thêm | `packages/subject-programming/learningPaths/capstone.ts`              | Hằng `PRINCIPAL_AI_CAPSTONE`                                                                                                                                     |
| Sửa  | `packages/subject-programming/learningPaths/principal-ai.ts`          | Khai `capstone: PRINCIPAL_AI_CAPSTONE`                                                                                                                           |
| Sửa  | `packages/subject-programming/learningPaths/learningPaths.test.ts`    | Cổng bất biến "mọi chặng có bài" + kiểm tổng điểm rubric = 100                                                                                                   |
| Thêm | `apps/dhcb/src/pages/subjects/programming/PathCapstonePanel.tsx`      | Giao diện, **nạp lười** (xem ⑦ rủi ro bundle)                                                                                                                    |
| Sửa  | `apps/dhcb/src/pages/subjects/programming/ProgrammingPathPage.tsx`    | Gắn panel vào cuối trang                                                                                                                                         |
| Thêm | `apps/dhcb/src/pages/subjects/programming/PathCapstonePanel.test.tsx` | Test giao diện                                                                                                                                                   |
| Thêm | `docs/changelog/NNNN-2026-MM-DD-capstone-va-audit-toan-khoa.md`       | Số lấy bằng `npm run changelog`                                                                                                                                  |
| Sửa  | `docs/goals/2026-09-15-ai-systems-architect.md`                       | Mục 5, mục 6 (iteration mới), mục 7 (final audit)                                                                                                                |
| Sửa  | `PROGRESS.md`                                                         | Chỉ sửa TẠI CHỖ mục "Tiếp theo"/nợ                                                                                                                               |

**Ảnh hưởng lan ra:** chạy
`npm run codemap -- impact packages/subject-programming/learningPaths/types.ts` — `types.ts` là file
dùng chung của cả bốn lộ trình/registry, nên mở rộng phải là **cộng thêm và tuỳ chọn**, không đổi
trường cũ.

## ③ Hợp đồng dữ liệu

**Kiểu mới (cộng thêm, tương thích ngược):**

```ts
/** Một thành phần hồ sơ capstone — người học tự nộp bằng chứng, hệ thống KHÔNG chấm tự động. */
export interface CapstoneDeliverable {
  /** `cap-01`…`cap-12` — ổn định, dùng làm khoá lưu trạng thái tự khai. */
  id: string
  title: string
  /** Làm tới đâu thì tính là xong — câu đo được, không phải lời khuyên. */
  doneWhen: string
}

/** Một hạng mục chấm điểm. Tổng `maxPoints` của mọi hạng mục phải bằng 100 — test canh. */
export interface RubricCategory {
  id: string
  title: string
  maxPoints: number
  /** true = dưới 50% hạng mục này là TRƯỢT dù tổng điểm cao. */
  hardFloor: boolean
}

export interface PathCapstone {
  name: string
  brief: string
  deliverables: CapstoneDeliverable[]
  rubric: RubricCategory[]
  /** Ngưỡng tổng điểm tối thiểu để đạt. */
  passTotal: number
}
```

**Dữ liệu bắt buộc — 12 thành phần** (đúng §5 đặc tả chương trình
`2026-09-15-khoa-kien-truc-su-phan-mem-ai.md`, không thêm không bớt):

`cap-01` tóm tắt bài toán + hành trình người dùng + yêu cầu chức năng/phi chức năng ·
`cap-02` ước lượng sức chứa + trần chi phí · `cap-03` C4 Context/Container/Component/Deployment ·
`cap-04` sơ đồ luồng dữ liệu + ranh giới tin cậy · `cap-05` tối thiểu 10 ADR ·
`cap-06` mô hình đe doạ + ca lạm dụng cho chuỗi dữ liệu–mô hình–công cụ ·
`cap-07` bộ eval vàng + baseline + ngưỡng phát hành + báo cáo hồi quy ·
`cap-08` bằng chứng tải/chaos/khôi phục từ sao lưu · `cap-09` bảng SLO + cảnh báo + sổ tay + một
post-mortem giả lập · `cap-10` TCO ba phương án + kế hoạch rút khỏi nhà cung cấp ·
`cap-11` lộ trình 12 tháng + cấu trúc đội + sổ rủi ro ·
`cap-12` video hoặc biên bản review: 5 phút cho lãnh đạo + 20 phút cho hội đồng kiến trúc.

**Rubric — 8 hạng mục, tổng đúng 100:**

| Hạng mục                 | Điểm | Điểm sàn cứng |
| ------------------------ | ---- | ------------- |
| Đúng đắn                 | 15   | không         |
| Kiến trúc & đánh đổi     | 15   | không         |
| Đánh giá AI              | 15   | **có**        |
| Độ tin cậy               | 15   | **có**        |
| Bảo mật & quyền riêng tư | 15   | **có**        |
| Chi phí & sức chứa       | 10   | không         |
| Vận hành                 | 10   | không         |
| Giao tiếp                | 5    | không         |

Luật đạt: tổng ≥ `passTotal` **và** không hạng mục `hardFloor` nào dưới 50% điểm tối đa của nó.

**Trạng thái tự khai:** lưu ở trình duyệt qua `apps/dhcb/src/lib/storage.ts`, khoá
`principal-ai:capstone`. Không gọi API, không migration. Đọc hỏng/JSON sai → coi như rỗng, không
ném lỗi ra UI.

**Nộp bằng chứng:** dùng nguyên `createPathArtifact` hiện có với
`pathId = 'principal-ai'`, `phaseId = 'principal-ai-p5'`.

**Ca lỗi:**

| Tình huống                          | Hành vi mong đợi                                               |
| ----------------------------------- | -------------------------------------------------------------- |
| `localStorage` bị chặn / JSON hỏng  | Panel vẫn render, coi trạng thái là rỗng, không văng lỗi       |
| Điểm tự chấm ngoài `[0, maxPoints]` | Chặn ở ô nhập, hiện thông báo, không lưu giá trị sai           |
| Chưa chấm đủ 8 hạng mục             | Hiện "chưa đủ dữ liệu", **cấm** suy ra tổng điểm từ phần đã có |
| Hạng mục sàn cứng < 50%             | Kết luận TRƯỢT dù tổng ≥ ngưỡng, nêu rõ hạng mục nào           |
| Gọi API artifact lỗi                | Hiện trạng thái lỗi + nút thử lại, không mất nội dung đang gõ  |

## ④ Tiêu chí chấp nhận

- [ ] **Cổng đóng goal:** mọi `stageId` trong `principal-ai` có `unitsOfStage(...).length > 0` —
      `npx vitest run packages/subject-programming/learningPaths/learningPaths.test.ts`
- [ ] `capstone.deliverables.length === 12`, id `cap-01`…`cap-12` không trùng
- [ ] Tổng `maxPoints` của rubric đúng 100; đúng ba hạng mục có `hardFloor`
- [ ] Hàm kết luận trượt/đạt có test ca biên: tổng cao nhưng một hạng mục sàn 49% → TRƯỢT
- [ ] Chưa chấm đủ 8 hạng mục thì không hiện tổng điểm
- [ ] Panel chịu được `localStorage` bị chặn — test mock ném lỗi
- [ ] Lộ trình khác không khai `capstone` vẫn render như cũ (tương thích ngược)
- [ ] a11y: 0 vi phạm AA ở phần tương tác, AAA cho chữ đọc — `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts`
- [ ] **Tầng 8b:** ảnh chụp thật 1440px và 390px, TRƯỚC và SAU, cho trang lộ trình; đã NHÌN từng ảnh
- [ ] **Ngân sách bundle:** initial JS không tăng — xem rủi ro ⑦ — `npm run budget`
- [ ] Audit 11 tầng theo `QUY-TRINH-AUDIT.md` có báo cáo dán vào changelog
- [ ] `PROGRESS.md`, file changelog mới, mục 5–7 của goal đã cập nhật

**Lệnh chứng minh:**

```bash
npx vitest run packages/subject-programming/learningPaths/learningPaths.test.ts
npx vitest run apps/dhcb/src/pages/subjects/programming/PathCapstonePanel.test.tsx
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
npm run budget
npm run test:e2e -- a11y
npm run changelog
```

## ⑤ Bất biến không được phá

| Bất biến                                                | Test nào canh nó                                     |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Mọi chặng của `principal-ai` có bài thật                | `learningPaths/learningPaths.test.ts` (**viết mới**) |
| Tổng rubric = 100 và luật sàn cứng                      | `learningPaths/learningPaths.test.ts` (viết mới)     |
| Lộ trình không khai `capstone` vẫn render               | `ProgrammingPathPage.test.tsx`                       |
| Không chấm artifact bằng AI                             | `pathArtifactService.test.ts`                        |
| Id lộ trình/giai đoạn/chặng đã phát hành không đổi      | `learningPaths/learningPaths.test.ts`                |
| Chữ nội dung đạt AAA, phần tương tác đạt AA, 0 ngoại lệ | `e2e/a11y.spec.ts`, `e2e/a11y-aaa.spec.ts`           |
| Ngân sách kích thước gói                                | `npm run budget` / cổng size-limit                   |

## ⑥ Quy ước dự án liên quan

- Màu lấy từ token `--a-*`/`--z-*`; **không ghi cứng màu**. `text-white` bị đảo ở theme nền sáng —
  nền cố định tối phải dùng `text-[#fff]`.
- Vùng chạm ≥ 44px, thiết kế màn nhỏ trước.
- URL mang tiêu đề: mọi link dựng qua `apps/dhcb/src/lib/programmingRoutes.ts`, không ghép chuỗi tay.
- Mọi handler API tự kiểm `user_id` qua `validateAuth()` — lát này KHÔNG thêm API mới, dùng lại
  endpoint artifact đã có.
- Cổng CI là `npm run test:coverage`. Trước push cuối: `rm -rf packages/*/dist dist dist-server`
  rồi `npm run typecheck`.
- Tiêu đề PR: scope chữ thường; mô tả đủ 6 tiêu đề của cổng `metadata`.

## ⑦ Rủi ro đã biết, phải xử lý chứ không phát hiện lại

1. **Ngân sách bundle đang sát trần.** Nợ kỹ thuật #2 trong `PROGRESS.md`: initial JS 135,4 kB /
   trần 140 kB, đã vượt mốc cảnh báo 133 kB. Panel capstone là màn hình mới có state và form → phải
   **nạp lười** (`React.lazy` + `Suspense`), không import thẳng vào `ProgrammingPathPage`. Đo bằng
   `npm run budget` TRƯỚC và SAU, dán cả hai số vào mô tả PR. Nếu initial JS tăng dù đã nạp lười →
   dừng, báo cáo, không tự nới trần.
2. **Cổng bất biến sẽ ĐỎ nếu chạy trước M3/M5/M6.** Đây là chủ đích: nó chính là thước đo goal.
   Lát cắt này phải là lát cuối.
3. **Lỗi lặp nội dung chỉ lộ ra khi nhìn ảnh.** Chuỗi PR #861/#862/#863 tìm ra bốn lỗi lặp mà không
   cổng nào bắt được. Tầng 8b là bắt buộc, không phải tuỳ chọn.
4. **Ma trận thị giác không tự chấm.** Chụp đủ ảnh, trình bày, để chủ dự án chấm.

## ⑧ Rollout và rollback

Một PR. Rollback = revert trọn PR; dữ liệu artifact của người học KHÔNG bị ảnh hưởng vì lát này
không thêm bảng, không đổi schema, không xoá bản ghi. Trạng thái tự chấm nằm ở trình duyệt nên
revert chỉ làm panel biến mất, không mất dữ liệu phía máy chủ.

Sau khi merge: tick mục 7 của goal, đổi **Kết luận** thành COMPLETE, ghi người xác nhận và ngày —
việc này do **chủ dự án** làm, không phải AI tự tick.

## ⑨ Quyết định đã duyệt (chủ dự án, 2026-09-17)

1. ✅ Capstone dùng lại `phaseId = 'principal-ai-p5'` để không phải migration.
2. ✅ Tự chấm rubric lưu ở trình duyệt (không đồng bộ nhiều thiết bị) cho đợt này; ghi thành nợ nếu
   sau này cần đồng bộ.
3. ✅ `passTotal` = **70**, kèm luật ba hạng mục sàn cứng ≥ 50%.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Số `npm run budget` trước/sau:
- Ma trận thị giác — chủ dự án chấm:
- Còn để ngỏ:
