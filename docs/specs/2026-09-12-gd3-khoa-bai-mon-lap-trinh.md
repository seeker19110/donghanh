# Đặc tả GĐ3 — Khoá bài tuần tự môn Lập trình (Free), VIP học tự do

**Ngày:** 2026-09-12 · **Trạng thái:** ✅ Đã chốt đủ — sẵn sàng thi hành ·
**Phụ thuộc:** GĐ1 + GĐ2a merge trước

## 0. Một câu

Người dùng **Free** phải học tuần tự môn Lập trình (hết bài trước mới mở bài sau); **VIP** vào
bài nào cũng được.

## 0.0. Đã chốt (chủ dự án, 2026-09-12)

1. **Đơn vị khoá:** tuyến tính theo độ khó tăng dần — "từ đơn giản đến nâng cao", tức theo
   **bậc P1 → P6**. Không khoá mịn tới từng bài trong bậc.
2. **Ngưỡng mở bậc sau: hoàn thành ≥70% số bài của bậc trước** (không đòi 100%, không đòi đạt
   quiz mọi chặng). Con số 70% **trùng với `UNLOCK_PCT` của môn Anh** — dùng chung một ngưỡng
   cho cả nền tảng, người học không phải nhớ hai luật khác nhau.
3. **Phạm vi: CHỈ xương sống P1→P6.** Hướng chuyên sâu (14 hướng), khoá ngắn và lộ trình mục tiêu
   **KHÔNG khoá** — chúng là nội dung song song, không phải bậc tuyến tính, khoá tuần tự ở đó vô
   nghĩa. (Đây là khuyến nghị trong bản nháp, chủ dự án không phản đối khi chốt hai mục trên.)

## 0.1. Bối cảnh khảo sát mã (giữ lại làm hồ sơ)

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

Cả ba câu hỏi của bản nháp **đã được trả lời ở §0.0** — giữ phần khảo sát trên làm căn cứ.

## ① Phạm vi

### LÀM

1. Free: bậc `P(n+1)` khoá cho tới khi **≥70% số bài của bậc `P(n)`** có `status='completed'`.
   P1 luôn mở.
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

1. Free hoàn thành **đúng 70%** số bài P1 → P2 mở. Ở **69%** → P2 vẫn khoá và **hiện đúng số bài
   còn thiếu**. (Test cả hai phía ngưỡng — đây là ca biên hay sai nhất.)
2. VIP chưa học gì → P1–P6 đều mở.
3. User đã từng học P3 trước khi luật ra đời → P3 vẫn mở sau khi deploy (grandfather).
4. Hàm compute là **thuần**, có test ca biên: bậc rỗng (chưa có bài nào soạn) → **không khoá bậc
   sau** (nếu không, bậc chưa có nội dung sẽ khoá vĩnh viễn toàn bộ phần sau — lỗi chí mạng).
5. Hướng chuyên sâu / khoá ngắn / lộ trình mục tiêu **vẫn mở bình thường** cho Free, không bị
   khoá lây (test canh: mở trang hướng chuyên sâu với user chưa học bài nào → vào được).
6. Cổng a11y AA/AAA xanh với ổ khoá + chữ giải thích.

## ⑤ Bất biến không được phá

- **Bậc chưa soạn nội dung không được khoá đường đi của người học** (ca biên §④.4).
- Không hồi tố: không ai mất quyền đã có.
- Compute thuần / persist tách riêng (khuôn `cefrProgress.ts`).

## ⑥ Quy ước dự án liên quan

- `feat(programming): ...` → mô tả PR trỏ file đặc tả này + "Approved for implementation".
- **Ngưỡng 70% dùng chung với môn Anh** — nếu sau này đổi, đổi ở MỘT nơi (hằng số chung), đừng
  để hai con số 70 rời rạc ở hai môn.
- Chạm giao diện → **Tầng 8b bắt buộc** (ảnh 1440px + 390px trước/sau).
- Không sửa `feedbackPrompt.ts` nên không cần `eval:code-feedback`.

## Nghiệm thu

- [x] Đã chốt 3 quyết định (§0.0): bậc P1→P6 · ngưỡng ≥70% bài · chỉ xương sống — chủ dự án 2026-09-12
- [ ] 6 tiêu chí §④ đạt, đặc biệt ca biên 69% vs 70% · [ ] Có ảnh chụp Tầng 8b
