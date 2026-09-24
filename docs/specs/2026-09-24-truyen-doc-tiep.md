# Đặc tả: "Đọc tiếp" cho Truyện (nhớ truyện đang đọc dở)

**Trạng thái:** Approved for implementation

**Ngày:** 2026-09-24

**Nguồn:** đặc tả TỰ VIẾT cho việc được giao trực tiếp trong phiên (không qua quy trình đặc tả
chuẩn). Chủ dự án đã uỷ quyền cho AI tự quyết chi tiết UX và tự đi hết quy trình PR trong phiên
này. Nợ gốc: `PROGRESS.md` — mục audit UI/UX lần 2 (`docs/changelog/0419-*.md`), dòng "Đọc tiếp"
ở Truyện cần cơ chế lưu truyện đang đọc".

## 0. Một câu

Người học đọc dở một truyện, rời trang rồi quay lại thì thấy nhãn "Đọc tiếp · N%" trên thẻ và
được mở đúng đoạn đang đọc, thay vì phải đọc lại từ đầu.

## ① Phạm vi

**LÀM:**

- Lưu vị trí đọc (chỉ số ĐOẠN, theo `groupLinesByParagraph`) của từng truyện vào localStorage
  trong lúc cuộn đọc.
- Thẻ truyện ở `/…/truyen` hiện nhãn "Đọc tiếp · đã đọc N%" (chiều B: "Continue · N% read") +
  thanh tiến độ mảnh cho truyện đang đọc dở.
- Mở truyện đang đọc dở → tự cuộn tới đoạn đã lưu, hiện dòng "Đang đọc tiếp từ đoạn X/Y" ngay đầu
  đoạn đó (kèm nút "Đọc lại từ đầu"), đưa tiêu điểm vào dòng báo cho trình đọc màn hình.
- Chạm mốc cuối truyện (sau cả phần "bài học rút ra") hoặc đoạn cuối → xoá trạng thái đọc dở.
- Chạy đúng cho cả chiều A (đọc tiếng Anh) và chiều B (đọc tiếng Việt).

**KHÔNG LÀM (quan trọng ngang mục trên):**

- KHÔNG đồng bộ đa thiết bị qua `learning_progress`/`progressSync.ts`: cần thêm cột CSDL +
  migration + nhánh hợp nhất ở server, quá tay cho dữ liệu tạm giá trị thấp (mất thì truyện chỉ
  trở về "bắt đầu"). Nếu sau này cần, thêm một cột JSON vào `learning_progress` theo đúng khuôn
  các trường đang đồng bộ ở đó.
- KHÔNG lưu vị trí theo câu/pixel (đoạn là đơn vị ổn định khi đổi cỡ màn hình, đổi khuôn
  desktop/mobile, bật/tắt bản dịch).
- KHÔNG đổi luồng "Phát tất cả" (audio), không thêm mục "Đã đọc xong" lên thẻ.
- KHÔNG đụng schema CSDL, API, `storage.ts` (file dùng chung nóng; tiến độ theo tính năng trong dự
  án đã theo khuôn một file riêng ở `lib/` như `cefrProgress.ts`).

## ② Điểm chạm

| Việc | Đường dẫn file                                                     | Ghi chú                                      |
| ---- | ------------------------------------------------------------------ | -------------------------------------------- |
| Thêm | `apps/dhcb/src/lib/storyProgress.ts`                               | get/save/clear + % ; Zod kiểm dữ liệu đọc ra |
| Thêm | `apps/dhcb/src/lib/storyProgress.test.ts`                          | ca biên: chưa đọc / đọc dở / đọc xong / hỏng |
| Sửa  | `apps/dhcb/src/pages/subjects/english/StoryReader.tsx`             | cuộn tới đoạn đã lưu + IntersectionObserver  |
| Thêm | `apps/dhcb/src/pages/subjects/english/StoryReader.resume.test.tsx` | luồng đọc tiếp, cả hai chiều A/B             |
| Sửa  | `apps/dhcb/src/components/StoryCard.tsx`                           | nhãn "Đọc tiếp · N%" + thanh tiến độ         |
| Thêm | `apps/dhcb/src/components/StoryCard.test.tsx`                      | có/không nhãn, chiều A/B                     |
| Sửa  | `apps/dhcb/src/pages/subjects/english/Stories.tsx`                 | đọc map tiến độ một lần, truyền xuống thẻ    |

**Ảnh hưởng lan ra:** `StoryCard` chỉ được `Stories.tsx` dùng; prop mới là tuỳ chọn. `StoryReader`
chỉ thêm hành vi, không đổi route/URL.

## ③ Hợp đồng dữ liệu

localStorage key `et_story_progress` (toàn cục, không theo uid — giống `et_direction`; truyện đọc
được cả khi là khách):

```ts
type StoryProgressMap = Record<
  string, // storyId
  { para: number /* int ≥ 1, < total */; total: number /* int ≥ 2 */; updatedAt: number /* ms */ }
>
```

- `saveStoryProgress(id, para, total)`: `para ≤ 0` hoặc `para ≥ total − 1` → xoá bản ghi; còn lại
  lưu; tối đa 30 truyện (bỏ bản cũ nhất theo `updatedAt`).
- `storyProgressPercent(p)` = `round(para / total × 100)` kẹp trong [1, 99].

**Ca lỗi:**

| Tình huống                                 | Hành vi mong đợi                             |
| ------------------------------------------ | -------------------------------------------- |
| JSON hỏng / không phải object              | coi như rỗng, không ném lỗi                  |
| Một bản ghi sai schema hoặc `para ≥ total` | bỏ riêng bản ghi đó                          |
| Truyện bị sửa ngắn đi (`para ≥ số đoạn`)   | bỏ bản ghi, mở từ đầu                        |
| localStorage đầy/bị chặn                   | bỏ qua, đọc truyện vẫn bình thường           |
| Trình duyệt không có IntersectionObserver  | không theo dõi (vẫn đọc được, chỉ không lưu) |

## ④ Tiêu chí chấp nhận

- [x] Chưa đọc → thẻ không có nhãn; trang mở từ đầu — `StoryCard.test.tsx`, `StoryReader.resume.test.tsx`
- [x] Đọc dở → thẻ hiện "Đọc tiếp · đã đọc N%"; mở trang cuộn tới đúng đoạn + dòng báo có tiêu điểm
- [x] Cuộn tới đoạn khác → lưu đoạn trên cùng đang nằm trong dải đọc
- [x] Chạm mốc cuối → xoá; cuộn ngược lên trong cùng lượt xem không ghi lại
- [x] "Đọc lại từ đầu" → xoá trạng thái, bỏ dòng báo
- [x] Chiều B dùng chung vị trí, nhãn tiếng Anh
- [x] Nút mới có vùng chạm ≥ 44px (`tap-44`), màu từ token `accent`/`zinc` (không hard-code)

**Lệnh chứng minh:**

```bash
npx vitest run apps/dhcb/src/lib/storyProgress.test.ts apps/dhcb/src/components/StoryCard.test.tsx \
  apps/dhcb/src/pages/subjects/english/StoryReader.resume.test.tsx
npm run typecheck && npm run lint && npm test && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                                 | Test nào canh nó              |
| ------------------------------------------------------------------------ | ----------------------------- |
| Không bao giờ có bản ghi ở đoạn 0 hoặc đoạn cuối                         | `storyProgress.test.ts`       |
| Lần báo đầu của observer không ghi đè vị trí đã lưu (cuộn TRƯỚC khi gắn) | `StoryReader.resume.test.tsx` |
| Đã chạm cuối truyện thì lượt xem đó không tạo lại trạng thái đọc dở      | `StoryReader.resume.test.tsx` |

## ⑥ Quy ước dự án liên quan

- Dữ liệu ngoài (localStorage) validate bằng Zod; mọi đọc/ghi bọc try/catch.
- Không `setState` đồng bộ trong effect (luật React Compiler) — vị trí resume đọc trong callback
  async lúc tải truyện.
- Chữ UI đạt AA ở cả 3 theme: dùng cặp `text-accent-300 theme-light:text-accent-800` đang dùng cho
  nhãn cấp CEFR cùng thẻ.
