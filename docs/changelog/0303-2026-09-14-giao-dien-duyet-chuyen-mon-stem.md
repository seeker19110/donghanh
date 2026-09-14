# 0303 — 2026-09-14 — Giao diện duyệt chuyên môn STEM + sửa lỗ hổng tin client

**PR:** (điền khi tạo) · **Nhánh:** `claude/optimistic-pasteur-goh7vb`
**Đặc tả:** `docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md` (ô ②bis) — phần thi hành
thứ hai sau nền (PR #904).

## Việc đã làm

- **Khối duyệt trong trang bài học** (`LuotDuyetBai.tsx`) — cuối `StemLessonView`, chỉ hiện với
  admin: 7 checkbox tiêu chí `sinh-v1`, ô tên người duyệt, nút ghi. Đọc đúng thứ người học đọc.
- **Tab "Duyệt nội dung STEM" ở `/admin-s`** (`AdminStemReviewPanel.tsx`) — tiến độ theo môn,
  liên kết mở nhanh bài kế tiếp chưa duyệt. Chỉ nạp chỉ mục nhẹ (`loader.index`), không kéo
  registry 2MB vào bundle admin.
- **Sửa lỗ hổng thiết kế nghiêm trọng phát hiện giữa đợt**: bản `admin-stem-review.ts` của #904
  nhận `bamNoiDung` từ thân yêu cầu — một client hỏng (hay cố ý) gửi băm giả là ghi được "đã
  duyệt" cho nội dung đã đổi, phá đúng bất biến mà cả quy trình sinh ra để canh. Đã sửa: **server
  tự nạp registry và tự tính băm**, client không còn gửi và không còn quyền quyết định băm là gì.
- **Migration `0079`** sửa ràng buộc `mon` của `0078`: `stemLesson.ts` chốt id môn là
  `mathematics`/`physics`/`chemistry`/`biology`, nhưng `0078` (viết trước khi đọc file đó) lỡ
  khai `'math'`. Phát hiện ngay sau khi `0078` merge, trước khi có UI ghi dữ liệu. **Không sửa
  lại `0078`** (migration đã merge không viết lại lịch sử) — migration riêng chỉ đổi ràng buộc.
- Mở rộng `mockLogin()` (E2E) với tuỳ chọn `isAdmin` — không đổi hành vi mặc định, mọi test cũ
  không phải sửa.

## Ba lỗi thật, đều do cổng bắt — không cái nào tôi tự thấy trước khi chạy

1. **`'math'` vs `'mathematics'`** — phát hiện lúc đọc `stemLessonRoutes.ts` để viết giao diện,
   sau khi `0078` đã kịp merge. Không phải cổng bắt, nhưng đáng ghi: đọc đủ ngữ cảnh TRƯỚC khi
   viết migration mới sẽ tránh được, thay vì đọc sau.
2. **Băm tin client** — tự phát hiện khi thiết kế `LuotDuyetBai` và nhận ra `bamNoiDungBaiHoc`
   dùng `node:crypto`, không chạy được ở trình duyệt; đường sửa đúng hoá ra tốt hơn thiết kế cũ
   nhiều: bỏ hẳn việc tin client, để server tự tính từ nguồn nó đã có sẵn (registry).
3. **`color-contrast` trên link "Duyệt bài kế tiếp"** — `e2e/a11y.spec.ts` đỏ ở 4/5 theme
   (`text-accent-600` trên `bg-surface-card` chỉ đạt 3,27–4,23:1, dưới sàn AA 4,5:1). Đúng bài
   học mà `packages/core-ui/buttonStyles.ts` đã cảnh báo ở đầu file cho nút — hoá ra áp dụng y
   hệt cho link chữ màu accent. Sửa: đổi sang `text-content` (token đã kiểm chứng AA/AAA), theo
   đúng khuôn `<Link className="underline">` đã dùng ở phần còn lại của `StemLessonView`.
4. **`text-green-600` cứng cho dòng "Đã duyệt bởi..."** — `scripts/fixed-color-contrast-audit.test.ts`
   (cổng canh ~720 tiền lệ đã vá 2026-09-03) đỏ ở 3 theme sáng (3,27–4,19:1). Sửa theo đúng
   tiền lệ đã kiểm chứng ở `UpgradeSection.tsx`: `text-green-400 theme-light:text-green-900`.
5. **`useToast()` gọi vô điều kiện làm vỡ test unit sẵn có của `StemLessonView`.** Gọi hook đó
   trước khi kiểm `user?.isAdmin` đòi MỌI nơi dựng trang bài học — kể cả người dùng thường, kể
   cả `StemLesson.test.tsx` vốn không bọc `<ToastProvider>` — phải có provider đó, dù họ không
   bao giờ thấy khối duyệt. Sửa bằng tách component: `LuotDuyetBai` chỉ kiểm quyền rồi mount
   (hoặc không) `NoiDungLuotDuyetBai` — phần có hook. Người dùng thường giờ không tốn một lượt
   gọi hook, một effect, hay một provider nào cho khối họ không bao giờ thấy.

## Bằng chứng kiểm chứng

```
rm -rf packages/*/dist dist dist-server && npm run typecheck  ✅
npm run lint            ✅  0 cảnh báo
npm run format          ✅
npm run build            ✅  Initial JS 135,44/140 kB (dư 4,56 kB)
npm run test:coverage   ✅  594 tệp / 12378 test — stmt 94,54% · branch 90,62% · func 94,78% · line 94,95%
```

E2E a11y (đã chạy TOÀN BỘ hai file, không chỉ phần mới, để chắc không phá gì cũ):

```
npx playwright test e2e/a11y.spec.ts       ✅  277/277 (AA, 5 theme)
npx playwright test e2e/a11y-aaa.spec.ts   ✅  165/165 (AAA nội dung/tiêu đề, 5 theme)
```

15 ca mới (khối duyệt trong bài + tab admin + ca "người thường không thấy khối duyệt", mỗi loại
× 5 theme) đều nằm trong hai con số trên.

**Tầng 8b — chụp trang thật, trước/sau:** dựng `npm run dev`, chụp bằng Playwright độc lập với
mock đăng nhập admin/không-admin ở 1440px và 390px: trang bài học (thu gọn + mở khối duyệt),
tab admin, và bản không-admin (xác nhận khối biến mất). Đã xem từng ảnh — nội dung đọc được ở
390px, khối duyệt xếp đúng thứ tự sư phạm cuối bài, không đè lên phần tự kiểm tra/thẻ ôn.

Không chạy `eval:tutor`/`eval:code-feedback` (không đụng prompt).

## Còn nợ

Chưa làm: khâu AI sàng lọc vòng 1 (③bis) — theo đúng thứ tự đã chốt, làm sau khi lô 1 duyệt tay
xong để có 14 câu người đã đọc làm thước đo ca thử 13 câu. `npm run review:sync` (DB → repo)
chưa được dùng thật lần nào — sẽ dùng lần đầu khi lô 1 duyệt xong.
