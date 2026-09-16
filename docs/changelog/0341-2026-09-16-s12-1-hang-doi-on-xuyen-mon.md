# 0341 — S12-1: hàng đợi ôn xuyên môn + thẻ SRS STEM + hub `/goc-hoc-tap/on-tap`

**Ngày:** 2026-09-16  
**Phạm vi:** slice S12-1 của goal `learning-ux` — đặc tả
[`docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md`](../specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md)
(Approved for implementation). KHÔNG làm S12-2 (sổ lỗi + migration `0084`) và S12-3 (tiến độ theo môn).

## Đã làm

- **Golden snapshot SRS chụp Ở COMMIT ĐẦU TIÊN**, trên `main` sạch trước mọi thay đổi khác
  (`apps/dhcb/src/lib/srs.golden.test.ts` + `__snapshots__`): chuỗi `again→hard→good→good→easy`
  trên 3 namespace thẻ, mốc thời gian cố định. Mọi thay đổi công thức FSRS về sau đều đỏ test này.
- `packages/core-contracts/reviewItem.ts` — hợp đồng `ReviewItem`/`ReviewQueue` + Zod: `href` phải
  là route nội bộ, `courseId` kéo theo `?khoa=`, `kind:'mistake'` bắt buộc `mistakeId`,
  `evidenceSource` trong allowlist 5 nguồn.
- `apps/dhcb/src/lib/reviewRoutes.ts` — module LÁ giữ các hàm dựng URL ôn tập + đọc `?cap=`, tách
  khỏi `reviewQueue.ts`: trang chỉ cần một đường dẫn (Trang chủ, trang cấp CEFR) không được kéo
  theo bộ dựng hàng đợi — nó import bảng bốn môn STEM và sổ lỗi.
- `apps/dhcb/src/lib/reviewQueue.ts` — `buildReviewQueue` **thuần, đồng bộ**: khử trùng theo
  `subjectId+contentId` (lỗi thắng thẻ) → `dueAt` tăng dần → lỗi trước thẻ → `difficulty` giảm dần
  → cắt cap. Kèm `docCapTuQuery` dùng chung; `CefrLevelPage` gọi lại đúng hàm này (hành vi `?cap=`
  của trang cấp KHÔNG đổi, bản `docCapTuQueryTuyChon`).
- `apps/dhcb/src/lib/stemSrs.ts` — namespace `stem:<môn>:<bài>:<số>` trên kho SRS chung; thẻ chỉ
  vào vòng ôn qua `addStemLessonCardsToSrs` (gọi từ màn kết quả S11 khi bài ĐẠT), nên mở trang bài
  học không tạo thẻ nào.
- Tách `apps/dhcb/src/components/FlashcardReview.tsx` từ `ProgrammingReview.tsx`; thêm trang
  `ReviewHub.tsx` (`/goc-hoc-tap/on-tap`) và `StemReview.tsx` (`/goc-hoc-tap/:subjectId/on-tap`),
  cả hai `RequireAccount`.
- `srs.ts` chỉ được thêm phần ĐỌC: `'stem:'` vào `NAMESPACE_KHONG_PHAI_TU_VUNG` +
  `getSrsSnapshot`/`getSrsKeysByPrefix`. Không đổi `reviewWord`, `getDueBy`, `SRS_SESSION_CAP`,
  `LEECH_THRESHOLD`, `NEW_CARD_DELAY_MS`.
- Luồng comeback trỏ về hub với `?cap=5` (trước đây chỉ SRS môn Anh); sidebar thêm mục "Ôn tập"
  cấp nền tảng (không có mục con); breadcrumb có đốt cha Góc học tập; hai cổng a11y thêm
  `/goc-hoc-tap/on-tap` và `/goc-hoc-tap/physics/on-tap`.

## Quyết định tự chọn (đặc tả để ngỏ)

- **Hub KHÔNG nạp từ điển.** Số từ vựng/ngữ pháp đến hạn đọc thẳng từ kho SRS (khoá không mang
  tiền tố namespace) qua `getSrsSnapshot`, đúng cảnh báo §8 của đặc tả về việc `getDueWords` cần
  cả từ điển. Vì thế `srs.ts` được thêm hai hàm CHỈ ĐỌC thay vì để trang tự mở `localStorage` —
  tự mở sẽ đọc phải bản cũ khi `memCache` đang giữ bản mới của phiên.
- **Cấp CEFR cho href "Ôn ngay" suy từ mã bài ngữ pháp đến hạn** (`a1-be` → `a1`); không suy được
  thì dẫn về `/lo-trinh-hoc` để người học tự chọn, không đoán bừa một cấp.
- **Nhóm trong hub tách theo môn VÀ theo loại** (thẻ / lỗi đã mắc) vì hai loại ôn ở hai màn khác
  nhau — gộp một dòng thì nút "Ôn ngay" chỉ dẫn đúng một nửa.
- `REVIEW_SPACING_MS` được `lib/mistakes.ts` xuất ra thay vì khai lại trong `reviewQueue.ts`, để
  hàng đợi và sổ lỗi không thể lệch nhau.

## Sửa trong lúc gộp `main` (#944 #945 #950 #952)

- **Khử trùng suýt xoá mất thẻ.** Bản đầu gộp theo `subjectId+contentId`, nên HAI thẻ khác nhau
  của cùng một bài bị gộp làm một — đúng thứ làm nên SRS (mỗi thẻ một lịch ôn riêng) bị xoá mất.
  Nay: mục lỗi vẫn thắng thẻ của cùng nội dung, nhưng các thẻ khác nhau đều được giữ; chỉ CÙNG
  một `srsKey` lọt hai lần mới giữ bản đến hạn sớm hơn. Hai ca test canh.
- Ca test "dây nối S11-3": bài STEM ĐẠT → thêm thẻ → thẻ đến hạn → hàng đợi có nhóm môn đó
  (`stemSrs.test.ts`). Ngày S11-3 gọi `addStemLessonCardsToSrs`, nếu tên hàm/khuôn khoá lệch thì
  ca này đỏ ngay thay vì phải phát hiện bằng mắt trên giao diện.

## Kiểm chứng

- `npm run typecheck` (sau `rm -rf packages/*/dist dist dist-server`) ✅ · `npm run lint`
  (0 cảnh báo) ✅ · `npm run format` ✅ · `npm run build` ✅.
- `npm run test:coverage` trên cây ĐÃ GỘP `main`: 655 file, **13310 test xanh** (2 skip) —
  statements 94.09%, branches 90.05%, functions 94.45%, lines 94.61%.
- Test mới: `reviewItem.test.ts` 11 ca · `reviewQueue.test.ts` 18 ca · `reviewRoutes.test.ts` 5 ca ·
  `stemSrs.test.ts` 13 ca · `FlashcardReview.test.tsx` 8 ca · `srs.golden.test.ts` 3 snapshot.
- Golden snapshot SRS chạy lại SAU mỗi lần gộp `main` — không đổi, tức công thức FSRS nguyên vẹn.
- E2E: `review-hub.spec.ts` 4/4 · `session-cap.spec.ts` xanh ·
  `comeback.spec.ts` xanh khi dev server đã ấm; ca "vắng 5 ngày" **đỏ ngẫu nhiên khi chạy nguội** —
  tái hiện y hệt với `Home.tsx` NGUYÊN BẢN của `main`, nên là flaky sẵn có của `main` (banner chờ
  giáo trình nạp xong, hết 5s), không phải do slice này ·
  `programming-lesson.spec.ts` ca thẻ SRS xanh (bằng chứng tách `FlashcardReview` không đổi hành
  vi) · `a11y.spec.ts` 25/25 nhóm `goc-hoc-tap` · `a11y-aaa.spec.ts` 15/15 các route ôn tập.
- Ảnh Tầng 8b 1440/390/320px cho hub (rỗng + có hàng đợi) và màn ôn thẻ STEM: đã nhìn thật, không
  tràn ngang, không lặp nội dung.
