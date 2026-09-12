# Đặc tả GĐ3 — Khoá bài tuần tự môn Lập trình (Free), VIP học tự do

**Ngày:** 2026-09-12 · **Trạng thái:** 🟡 BẢN NHÁP — **chưa đủ để thi hành**, còn 3 quyết định
phải chốt (§0.1) · **Phụ thuộc:** GĐ1 + GĐ2 merge trước

## 0. Một câu

Người dùng **Free** phải học tuần tự môn Lập trình (hết bài trước mới mở bài sau); **VIP** vào
bài nào cũng được.

## 0.1. ⛔ BA QUYẾT ĐỊNH PHẢI CHỐT TRƯỚC KHI VIẾT MÃ

Khác môn Anh (đã có sẵn luật khoá cấp để mở rộng), môn Lập trình **chưa có** khái niệm khoá theo
tiến độ ở cấp bài học. Khảo sát mã 2026-09-12:

- ✅ **Đã có** khoá tuần tự ở **trong một dự án**: `ProgrammingProjectPage.tsx:58`
  (`isStageUnlocked` — bước sau mở khi các bước trước xong). Đây là khuôn mẫu tốt để nhân rộng.
- ✅ **Đã có** dữ liệu tiến độ server thật: `programming.lesson_progress` (migration 0064),
  `programming.path_progress` (0073), `programming.spec_stage_progress` (0071) — **có `status`,
  có `completed_at`**, đọc/ghi qua `apps/server/src/api/subjects/programming/progress.ts` (đã
  `validateAuth()`, không tin client).
- ❌ **Chưa có** khoá giữa các **bậc P1→P6**, giữa các **bài trong một bậc**, giữa các **chặng
  S1→S4** của hướng chuyên sâu. `ProgrammingLevelPage.tsx:233` có nhãn "Sắp mở" nhưng đó là
  **nội dung chưa soạn**, không phải khoá theo tiến độ người học.

**Ba câu hỏi:**

1. **Đơn vị khoá là gì?** (a) theo **bậc** P1→P6 (thô, dễ làm, giống CEFR) · (b) theo **từng bài**
   trong bậc (mịn, đúng ý "học hết từ đầu mới mở bài sau", nhưng nhiều bài → dễ gây bí) ·
   (c) cả hai tầng. **Khuyến nghị (a)** cho đợt đầu: ít rủi ro gây tắc, đối xứng với môn Anh.
2. **Điều kiện mở bậc sau là gì?** Môn Anh dùng "thi đạt ≥70%". Môn Lập trình có quiz theo chặng
   (`stageQuizzes.ts`, mỗi chặng 5 câu) — dùng **đạt quiz của mọi chặng trong bậc**? hay chỉ cần
   `lesson_progress.status='completed'` cho hết bài của bậc? Cần chốt **con số ngưỡng**.
3. **Có áp cho hướng chuyên sâu + khoá ngắn + lộ trình mục tiêu không?** Ba thứ này là **nội dung
   song song**, không phải bậc tuyến tính — khoá tuần tự có thể vô nghĩa ở đây. **Khuyến nghị:
   KHÔNG khoá**, chỉ khoá xương sống P1→P6.

## ① Phạm vi (giả định chọn (a) + khoá theo `lesson_progress`)

### LÀM

1. Free: bậc `P(n+1)` khoá cho tới khi **100% bài của bậc `P(n)`** có `status='completed'`. P1 luôn mở.
2. VIP: mọi bậc mở.
3. Grandfather như môn Anh: ai **đã từng** vào học bậc sau trước khi luật này ra đời thì **không
   bị khoá lại** (chống hồi tố — bài học xương máu ghi ở `cefrProgress.ts` dòng 183–188).
4. Giao diện: ổ khoá + câu giải thích "còn N bài ở P(n) nữa là mở" — **không** chỉ hiện ổ khoá câm.

### KHÔNG làm

- Không khoá hướng chuyên sâu / khoá ngắn / lộ trình mục tiêu (xem §0.1 câu 3).
- Không đụng cơ chế khoá bước **trong** một dự án (đã chạy tốt, giữ nguyên).
- Không xoá tiến độ cũ của ai.

## ② Điểm chạm (dự kiến — kiểm lại khi thi hành)

| File                                                                                       | Sửa gì                                                                                                                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/subject-programming/` (file mới, vd `levelLock.ts`)                              | Hàm **thuần** `computeLevelLockMap(levels, progress, plan, everUnlocked)` — theo đúng khuôn `cefrProgress.ts`, tách compute (thuần) khỏi persist |
| `apps/dhcb/src/pages/subjects/programming/ProgrammingHome.tsx`, `ProgrammingLevelPage.tsx` | Đọc lock map, hiện ổ khoá + lời giải thích                                                                                                       |
| `apps/server/src/api/subjects/programming/progress.ts`                                     | (chỉ nếu chọn paywall server-side — xem GĐ2 §0.1)                                                                                                |

Chạy `npm run codemap -- impact packages/subject-programming/lessonsLoader.ts` trước khi sửa.

**Lưu ý bẫy đã biết:** app **không** được import `@dhcb/subject-programming/lessons` (registry
đồng bộ 3 MB) — phải dùng `lessonsLoader` (`LESSON_INDEX` nhẹ). Thêm/đổi bài xong phải chạy
`npm run gen:lesson-index` (CLAUDE.md mục 7).

## ③ Hợp đồng dữ liệu

Dự kiến **không cần migration**: `programming.lesson_progress` đã đủ dữ liệu để tính. Nếu chọn
grandfather bằng cột riêng thì mới cần migration (cân nhắc dùng `localStorage` như môn Anh để
tránh migration ở đợt đầu).

## ④ Tiêu chí chấp nhận

1. Free hoàn thành 100% bài P1 → P2 mở; còn thiếu 1 bài → P2 vẫn khoá và **hiện đúng số bài còn thiếu**.
2. VIP chưa học gì → P1–P6 đều mở.
3. User đã từng học P3 trước khi luật ra đời → P3 vẫn mở sau khi deploy (grandfather).
4. Hàm compute là **thuần**, có test ca biên: bậc rỗng (chưa có bài nào soạn) → **không khoá bậc sau**
   (nếu không, bậc chưa có nội dung sẽ khoá vĩnh viễn toàn bộ phần sau — lỗi chí mạng).
5. Cổng a11y AA/AAA xanh với ổ khoá + chữ giải thích.

## ⑤ Bất biến không được phá

- **Bậc chưa soạn nội dung không được khoá đường đi của người học** (ca biên §④.4).
- Không hồi tố: không ai mất quyền đã có.
- Compute thuần / persist tách riêng (khuôn `cefrProgress.ts`).

## ⑥ Quy ước dự án liên quan

- `feat(programming): ...` → mô tả PR trỏ file đặc tả này + "Approved for implementation".
- Chạm giao diện → **Tầng 8b bắt buộc** (ảnh 1440px + 390px trước/sau).
- Không sửa `feedbackPrompt.ts` nên không cần `eval:code-feedback`.

## Nghiệm thu

- [ ] Đã chốt 3 câu hỏi §0.1 (đơn vị khoá · ngưỡng mở · phạm vi) — ghi quyết định vào đây
- [ ] 5 tiêu chí §④ đạt · [ ] Có ảnh chụp Tầng 8b
