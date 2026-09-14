# Đặc tả — Quy trình duyệt chuyên môn nội dung STEM, chạy trước cho môn Sinh

**Ngày:** 2026-09-14 · **Trạng thái:** chờ người dùng duyệt
**Nguồn gốc:** nợ mở trong `PROGRESS.md` sau PR #893/#900/#901 — 0/294 bài STEM có người chuyên
môn đọc, 442/665 câu (66,5%) là trắc nghiệm mà **không cổng máy nào kiểm được tính đúng kiến
thức** (xem `TRAPS.md` mục 4, `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`).

**Approved for implementation:** ĐÃ CHỐT ô ⓪.5 (người dùng trả lời 2026-09-14):
**Q1 = duyệt trong `/admin`** · **Q2 = AI được sàng lọc, nhưng phải làm THẬT KỸ** · Q3 xong ở #902.
Đặc tả đã viết lại theo hai câu trả lời này — phần thay đổi đánh dấu "CHỐT Q1/Q2" ở dưới.

## 0. Một câu

Biến "duyệt chuyên môn" từ một lời hứa trong tài liệu thành **dữ liệu có cấu trúc, có cổng CI
canh, chia lô làm được**, và chạy thử trọn vẹn trên môn Sinh — môn rủi ro nhất.

## 0.5. BA CÂU HỎI PHẢI CHỐT TRƯỚC (không tự quyết thay)

Đây là việc chạm tới **nội dung dạy người thật**, nên ba điều dưới đây tôi không tự quyết:

| #      | Câu hỏi                                                                           | Vì sao cần bạn quyết                                                                                                                                                                         | Đề xuất của tôi                                                                    |
| ------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Q1** | Ai là người duyệt, duyệt ở đâu?                                                   | **ĐÃ CHỐT: duyệt trong `/admin`.** Đổi hẳn kiến trúc so với bản nháp đầu (phiếu markdown): bản ghi duyệt nay là **dữ liệu chạy (Postgres)**, không phải dữ liệu trong mã nguồn — xem ô ②bis. |
| **Q2** | AI có được sàng lọc vòng 1 không?                                                 | **ĐÃ CHỐT: có, nhưng phải làm THẬT KỸ.** "Thật kỹ" được định nghĩa đo được ở ô ③bis — không để là lời hứa. AI vẫn TUYỆT ĐỐI không được ghi `reviewed`.                                       |
| **Q3** | ~~Có hiện nhãn "bản nháp" cho người học không?~~ **ĐÃ XONG, không cần quyết nữa** | PR #902 (2026-09-14) đã làm: hộp cảnh báo "Bản nháp — chưa duyệt chuyên môn" đầu trang bài + dòng tóm tắt ở trang danh sách, có test canh.                                                   | Không còn là câu hỏi — nhưng nó ĐỔI ô ② của đặc tả này, xem cảnh báo phạm vi ở đó. |

## ① Phạm vi

**LÀM:**

- Thêm **bản ghi duyệt có kiểm chứng được** (ai duyệt, ngày nào, theo bộ tiêu chí phiên bản mấy,
  phiếu nào) ở một trường MỚI `review?`, **giữ nguyên** enum `reviewStatus` mà giao diện của
  PR #902 đang đọc (lý do ở ô ②).
- Khai kiểu đó **một lần** ở `packages/core-contracts/` cho cả 4 môn dùng chung (đúng khuôn
  `stemLesson.ts` đã có), không chép 4 bản.
- Viết **bộ tiêu chí duyệt môn Sinh** (ô ③) — thứ người duyệt cầm theo khi đọc.
- **Chia lô môn Sinh theo chương** + thứ tự ưu tiên đo được (ô ②).
- Cổng CI canh không ai lật được `reviewed` một cách ẩu (ô ⑤).
- **Màn duyệt trong app (CHỐT Q1):** khối duyệt chỉ-admin đặt cuối mỗi bài học + bảng tổng ở
  `/admin`, ghi vào Postgres, có `npm run review:sync` đưa kết quả về repo (ô ②bis).
- **Khâu AI sàng lọc vòng 1 (CHỐT Q2)** với 5 ràng buộc đo được + ca thử 13 câu chứng minh nó
  không phải rác (ô ③bis).
- Chạy thử **lô đầu tiên** trọn vẹn để kiểm quy trình có dùng được không.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- **Không sửa một câu nội dung nào trong đợt này.** Đợt này dựng _quy trình_; sửa nội dung là
  việc của từng lô sau đó. Trộn hai thứ vào một PR thì không ai review nổi.
- **Không làm lại nhãn "bản nháp" trên giao diện** — PR #902 đã làm xong. Đợt này chỉ phải
  **giữ cho nó không gãy** khi bản ghi duyệt được thêm vào (xem ② và ⑤).
- **Không cho app đọc trạng thái duyệt từ DB lúc chạy** — lý do ở ②bis.
- **Không để AI sửa nội dung**, kể cả khi nó chắc chắn mình đúng (③bis điều 4).
- **Không đụng ba môn Toán/Lí/Hoá trong đợt này** ngoài phần kiểu dùng chung. Môn Sinh chạy
  trước để tìm chỗ hỏng của quy trình với chi phí nhỏ nhất.
- **Không tự động hoá việc phán đúng/sai kiến thức bằng AI.** Đây là bất biến, xem ⑤.

## ② Điểm chạm + kế hoạch chia lô

### Điểm chạm file

| Việc          | Đường dẫn                                                                          | Ghi chú                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Thêm          | `packages/core-contracts/lessonReview.ts`                                          | Kiểu + Zod schema bản ghi duyệt, dùng chung 4 môn                                                               |
| Thêm          | `packages/core-contracts/lessonReview.test.ts`                                     | Ca biên của schema                                                                                              |
| Sửa           | `packages/subject-biology/lessonTypes.ts`                                          | Thêm đúng một dòng `review: LessonReviewSchema.optional()`                                                      |
| Sửa           | `packages/subject-{math,physics,chemistry}/lessonTypes.ts`                         | Cùng một dòng đó, để 4 môn cùng khuôn; dữ liệu 3 môn này KHÔNG đụng                                             |
| **KHÔNG sửa** | `packages/core-contracts/stemLesson.ts`                                            | `ReviewStatus` giữ nguyên — giao diện của PR #902 đọc trường này; đây chính là lý do chọn phương án thêm trường |
| **KHÔNG sửa** | `apps/dhcb/src/pages/learning/StemLessonView.tsx:191` · `StemLessonList.tsx:54-55` | Ba chỗ so sánh `=== 'draft'`; phương án dưới đây cố ý giữ chúng nguyên vẹn                                      |
| **KHÔNG sửa** | `scripts/gen-stem-lesson-index.ts`                                                 | Chỉ mục nạp lười chỉ mang `reviewStatus`; bản ghi duyệt là dữ liệu vận hành, không cần lên chỉ mục              |
| Sửa           | `packages/subject-*/lessons.test.ts`                                               | Ca canh bản ghi duyệt hợp lệ                                                                                    |
| Thêm          | `docs/review/sinh/README.md` + `docs/review/sinh/lo-01-*.md`                       | Phiếu duyệt từng lô, người duyệt điền                                                                           |
| Thêm          | `scripts/review-status.ts` + `npm run review:status`                               | In tiến độ duyệt thật từ registry                                                                               |
| Sửa           | `PROGRESS.md`                                                                      | Nợ chuyển từ "chưa có quy trình" sang "đang chạy lô n/24"                                                       |

**CẢNH BÁO PHẠM VI — viết lại sau khi PR #902 merge (2026-09-14).** Lúc đặc tả này được soạn,
`reviewStatus` chỉ có Zod schema và test đọc tới, nên đổi hình nó là việc gói dữ liệu thuần.
PR #902 **đã nối nó ra giao diện**: ba chỗ so sánh `=== 'draft'` ở bảng trên, cộng chỉ mục nạp
lười. Đổi enum thành bản ghi có cấu trúc nay là **breaking change chạm cả UI**.

**Quyết định kỹ thuật rút ra:** GIỮ `reviewStatus: 'draft' | 'reviewed'` NGUYÊN như cũ, và để bản
ghi duyệt chi tiết ở một trường **mới, không bắt buộc** — `review?: LessonReview`. Giao diện
không phải sửa một dòng nào, không phải chụp lại Tầng 8b; cổng CI canh hai trường luôn ăn khớp
(⑤). Thừa một trường, đổi lấy việc không đụng UI đang chạy thật — đánh đổi đáng.

**Bắt buộc trước khi sửa:** `npm run codemap -- impact packages/subject-biology/lessonTypes.ts`
và `-- impact packages/core-contracts/stemLesson.ts`; dán danh sách bị ảnh hưởng vào PR. Đây là
file dùng chung, đúng loại file mà CLAUDE.md mục 7 bắt tra bản đồ trước.

### Chia lô môn Sinh — 24 chương, 84 bài, 170 câu (đo 2026-09-14)

Thứ tự ưu tiên **không** theo thứ tự lớp, mà theo **mật độ rủi ro**: chương nào nhiều câu nhất và
nội dung dễ sai nhất thì duyệt trước.

| Lô               | Chương                                             | Bài | Câu | Vì sao thứ tự này                                                                                                                                                  |
| ---------------- | -------------------------------------------------- | --- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1 (chạy thử)** | `sinh12-c1` Cơ chế di truyền và biến dị            | 7   | 14  | Chương **nhiều bài nhất của lớp 12**, kiến thức trừu tượng nhất (nhân đôi ADN, phiên mã, dịch mã, đột biến) — dễ sai nhất, và là phép thử tốt nhất cho bộ tiêu chí |
| 2                | `sinh11-c1` Trao đổi chất và chuyển hoá năng lượng | 12  | 24  | Chương **nhiều bài nhất toàn môn**                                                                                                                                 |
| 3                | `sinh12-c2` Tính quy luật của hiện tượng di truyền | 6   | 12  | Bài tập quy luật — nơi đáp án sai hay nấp                                                                                                                          |
| 4                | `sinh10-c6,c7` Phân bào · Vi sinh vật              | 8   | 16  |                                                                                                                                                                    |
| 5                | `sinh12-c6,c7` Tiến hoá · Phát sinh sự sống        | 5   | 10  | Dễ lẫn quan điểm khoa học cũ/mới                                                                                                                                   |
| 6                | `sinh11-c2,c3,c4,c5`                               | 14  | 28  |                                                                                                                                                                    |
| 7                | `sinh10-c1..c5,c8`                                 | 18  | 36  | Phần nền, ít bẫy hơn                                                                                                                                               |
| 8                | `sinh12-c3,c4,c5,c8..c11`                          | 14  | 30  | Sinh thái + ứng dụng, gần đời sống, dễ kiểm                                                                                                                        |

Lô 1 là **cổng của chính đặc tả này**: duyệt xong lô 1 mà bộ tiêu chí ③ tỏ ra thiếu/thừa thì sửa
đặc tả trước, chưa chạy tiếp lô 2.

## ③ Hợp đồng dữ liệu

**Kiểu bản ghi duyệt** (`packages/core-contracts/lessonReview.ts`):

```ts
// GIỮ NGUYÊN trường cũ — giao diện của PR #902 đọc đúng trường này, không đụng vào:
//   reviewStatus: 'draft' | 'reviewed'

// THÊM trường mới, KHÔNG bắt buộc. Bài chưa ai đọc thì vắng mặt trường này.
export const LessonReviewSchema = z.discriminatedUnion('loai', [
  // AI đã sàng lọc (Q2). KHÔNG phải đã duyệt — chỉ là danh sách chỗ đáng ngờ để người đọc nhanh hơn.
  z
    .object({
      loai: z.literal('ai-sang-loc'),
      ngay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      soCoNghiNgo: z.number().int().nonnegative(),
      phieu: z.string().min(1), // đường dẫn phiếu trong docs/review/
    })
    .strict(),

  // Người có chuyên môn đã đọc và chịu trách nhiệm.
  z
    .object({
      loai: z.literal('nguoi-duyet'),
      nguoiDuyet: z.string().min(2).max(100), // tên hoặc bút danh, KHÔNG để trống
      ngay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      phienBanTieuChi: z.string().min(1), // ví dụ 'sinh-v1' — duyệt theo thước nào
      phieu: z.string().min(1),
      bamNoiDung: z.string().length(64), // SHA-256 nội dung tại lúc duyệt — xem ⑤
    })
    .strict(),
])

// Trong mỗi <Subject>LessonSchema, thêm đúng một dòng:
//   review: LessonReviewSchema.optional()
```

**Luật ăn khớp hai trường (cổng CI canh, ô ⑤):** `reviewStatus === 'reviewed'` **khi và chỉ khi**
`review?.loai === 'nguoi-duyet'`. Bài mang `ai-sang-loc` vẫn là `draft`, nên người học vẫn thấy
nhãn "Bản nháp" của PR #902 — đúng như phải thế.

**Vì sao `phienBanTieuChi`:** bộ tiêu chí sẽ được sửa sau mỗi lô. Không có trường này thì sang lô
5 không ai biết bài duyệt ở lô 1 đã được đo bằng thước nào, và "đã duyệt" trở lại thành một chữ
không kiểm chứng được — đúng cái bẫy đặc tả này sinh ra để chặn.

**Di trú: KHÔNG CÓ.** Đây là lợi ích chính của phương án thêm trường — 294 bài giữ nguyên
`reviewStatus: 'draft'`, trường `review` vắng mặt cho tới khi có người duyệt thật. Không script
di trú, không đụng 294 file dữ liệu, không rủi ro sửa hỏng nội dung khi mới đang dựng quy trình.

### Bộ tiêu chí duyệt môn Sinh, phiên bản `sinh-v1`

Người duyệt đọc từng bài, trả lời 7 câu. **Một câu "không" = bài chưa đạt**, ghi rõ chỗ sai.

| #   | Câu hỏi                                                                                                               | Vì sao có mặt                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 1   | Nội dung có **đúng chương trình GDPT 2018** môn Sinh lớp tương ứng không (không dạy vượt, không dạy thiếu trọng tâm)? | Bài do AI soạn hay bám sách nước ngoài                         |
| 2   | Có **điểm sai kiến thức** nào không?                                                                                  | Lý do tồn tại của cả quy trình                                 |
| 3   | Với mỗi câu trắc nghiệm: **phương án được đánh dấu có thật sự đúng** không?                                           | 169/170 câu Sinh là trắc nghiệm — không cổng máy nào kiểm được |
| 4   | **Phương án nhiễu** có hợp lý không (không có phương án sai lộ liễu, không có hai phương án cùng đúng)?               | Nhiễu dở làm câu hỏi vô nghĩa dù đáp án đúng                   |
| 5   | **Lời giải `explain`** có giải thích đúng _vì sao_ không, hay chỉ nhắc lại đáp án?                                    | Audit đã tìm thấy 20 giải thích dưới 40 ký tự                  |
| 6   | **Thuật ngữ** có đúng chuẩn tiếng Việt phổ thông trong SGK hiện hành không?                                           | AI hay dùng thuật ngữ dịch tự do                               |
| 7   | Có nội dung **không phù hợp lứa tuổi** hoặc nhạy cảm cần diễn đạt lại không (sinh sản, di truyền học người)?          | Môn Sinh có vùng nội dung này nhiều hơn 3 môn kia              |

**Người duyệt điền ở đâu (CHỐT Q1):** không dùng phiếu markdown nữa. Bảy ô tick + ô "chỗ sai"
hiện **ngay dưới mỗi bài học** cho tài khoản admin, và có bảng tổng ở `/admin`. Xem ②bis.

**Ca lỗi:**

| Tình huống                                     | Hành vi mong đợi                                                                                                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bài không đạt tiêu chí                         | Giữ `draft`, ghi chỗ sai vào phiếu, mở việc sửa nội dung ở PR riêng. **Không** lật `reviewed` kèm ghi chú "sẽ sửa sau"                                                          |
| Người duyệt bỏ trống `nguoiDuyet`              | Zod chặn, CI đỏ                                                                                                                                                                 |
| Ai đó lật `reviewed` mà không có phiếu         | Test ⑤ đỏ với thông báo chỉ đúng file phiếu còn thiếu                                                                                                                           |
| Bài đã `reviewed` nhưng nội dung bị sửa sau đó | Test đỏ, nêu tên bài và bảo "băm nội dung lệch — duyệt lại hoặc hạ về `draft`". **Không tự động hạ**: hạ ngầm thì người sửa không biết mình vừa làm mất hiệu lực một lượt duyệt |

## ②bis. Kiến trúc duyệt trong app (CHỐT Q1 — viết mới 2026-09-14)

**Vấn đề phải giải trước khi viết dòng mã nào.** Nội dung bài học nằm trong **mã nguồn TypeScript**
(`packages/subject-biology/lessons/*.ts`), còn `/admin` chạy trên **Postgres**. Người duyệt bấm
"đạt" trong app thì kết quả rơi vào DB — nhưng cổng CI (ô ⑤) lại chạy trên repo. Nếu không nối
hai bên, sẽ có đúng cái bẫy `TRAPS.md` mục 4 ở dạng mới: DB nói "đã duyệt", repo nói `draft`.

**Cách nối — DB là nơi ghi, repo là nơi chốt:**

1. Người duyệt bấm trong app → ghi vào bảng Postgres `stem_lesson_reviews` (nguồn ghi, sửa được,
   có lịch sử).
2. `npm run review:sync` đọc DB, ghi `review?` + `reviewStatus` vào **file dữ liệu trong repo**,
   in ra diff để người xem trước khi commit.
3. Cổng CI vẫn chạy trên repo như ô ⑤ mô tả. Repo là **nguồn sự thật cuối cùng**; DB là bàn làm
   việc. Không có đường nào cho một bài thành `reviewed` trong app mà không đi qua một commit.

**Vì sao không cho app đọc thẳng trạng thái duyệt từ DB:** nội dung bài học là dữ liệu tĩnh nạp
lười theo chương; cho nhãn "đã duyệt" đến từ DB nghĩa là thêm một lượt gọi mạng cho mỗi trang bài
học, và nhãn sẽ lệch khi DB rớt (nợ Redis đang mở). Repo giữ trạng thái, DB giữ quá trình.

### Điểm chạm thêm

| Việc | Đường dẫn                                                     | Ghi chú                                                                                                                        |
| ---- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Thêm | `postgres/migrations/0078_stem_lesson_reviews.sql`            | `lesson_id` · `mon` · 7 ô tick · `ghi_chu` · `nguoi_duyet` · `bam_noi_dung` · `tao_luc`; khoá chính `(lesson_id, nguoi_duyet)` |
| Thêm | `apps/server/src/api/admin/admin-stem-review.ts` + `.test.ts` | `GET`/`POST`; **bắt buộc** `validateAuth()` rồi `isAdminEmail()` như `admin-settings.ts`                                       |
| Sửa  | `apps/server/src/routes.ts`                                   | Gắn route mới                                                                                                                  |
| Thêm | `apps/dhcb/src/components/admin/StemReviewPanel.tsx`          | Bảng tổng: tiến độ theo lô/chương, mở nhanh bài kế tiếp chưa duyệt                                                             |
| Sửa  | `apps/dhcb/src/pages/learning/StemLessonView.tsx`             | Khối duyệt **chỉ hiện với admin**, đặt CUỐI bài; người học thường không thấy gì khác                                           |
| Thêm | `scripts/review-sync.ts` + `npm run review:sync`              | DB → file dữ liệu repo, in diff, không tự commit                                                                               |

**Ràng buộc bảo mật (CLAUDE.md mục 4.2):** handler tự kiểm `user_id` khớp token qua
`validateAuth()` **rồi mới** kiểm `isAdminEmail()`; không tin cờ admin do client gửi. Route ghi
có `checkRateLimit` + `logSecurityEvent` như các handler admin sẵn có.

**Ràng buộc giao diện:** khối duyệt phải đạt a11y AA như mọi phần còn lại (`e2e/a11y.spec.ts`
quét 15 trang × 5 theme, 0 vi phạm, không có baseline). Vì đợt này **chạm giao diện**, bắt buộc
Tầng 8b: chụp trang thật 1440px + 390px, trước/sau.

## ③bis. "Sàng lọc thật kỹ" nghĩa là gì (CHỐT Q2 — đo được, không phải lời hứa)

Người dùng chốt: AI được sàng lọc vòng 1, **nhưng phải làm thật kỹ**. Để chữ "kỹ" không trôi thành
lời hứa suông, nó được định nghĩa bằng năm ràng buộc kiểm được:

1. **Mỗi câu hỏi được rà RIÊNG, không rà theo bài.** 170 câu là 170 lượt phán, mỗi lượt trả lời
   đủ 7 tiêu chí `sinh-v1`. Cấm kết luận gộp kiểu "chương này ổn".
2. **Mỗi kết luận phải kèm CĂN CỨ cụ thể** — dẫn đúng mệnh đề trong bài bị nghi sai và nói sai ở
   chỗ nào. Kết luận không có căn cứ bị coi là chưa rà.
3. **Hai lượt độc lập cho câu bị gắn cờ.** Lượt hai không được thấy kết luận lượt một (tránh
   hiệu ứng mỏ neo). Hai lượt lệch nhau → luôn đẩy lên cho người, không tự hoà giải.
4. **Chỉ được gắn cờ, KHÔNG được sửa nội dung.** AI không tự sửa một chữ nào của bài.
5. **Kết quả ghi dưới dạng `ai-sang-loc`, không bao giờ là `reviewed`.** Bài vẫn `draft`, vẫn hiện
   nhãn "Bản nháp" của PR #902 cho người học.

**Tiêu chí nghiệm thu của chính khâu sàng lọc:** trước khi tin nó, chạy thử trên **10 câu đã biết
đáp án đúng chắc chắn** cộng **3 câu bị cố ý làm sai** (sai kiến thức · đáp án lệch · nhiễu trùng
đáp án). Sàng lọc phải bắt được cả 3 câu sai và **không** báo oan quá 1/10 câu đúng. Không đạt thì
sàng lọc là rác — bỏ, duyệt tay thẳng. Ca thử này nằm trong repo, không phải chạy một lần rồi quên.

> Ghi chú thành thật về giới hạn: khâu này rẻ và đáng làm, nhưng nó **không** rút ngắn được việc
> của người ở những câu AI không gắn cờ — chính AI đã soạn nội dung này, nên nó mù đúng ở chỗ nó
> đã sai. Sàng lọc giúp người đọc nhanh hơn, không giúp người đọc ÍT hơn.

## ④ Tiêu chí chấp nhận

- [ ] `npm run review:status` in đúng tiến độ thật, đọc từ registry: tổng bài/câu, số đã duyệt
      theo từng môn và từng chương, % còn lại. Chạy không cần mạng, không cần DB.
- [ ] Thêm trường `review?` xong mà **294 file dữ liệu không đổi một dòng nào** (`git diff --stat` không liệt kê file nào trong `packages/subject-*/lessons/`), `npm run typecheck` xanh với `dist` đã xoá sạch.
- [ ] Lật thử một bài sang `reviewed` mà thiếu `phieu` → `npm test` **đỏ**, thông báo nêu đúng
      tên bài và trường còn thiếu. (Chứng minh cổng có răng — làm thật rồi hoàn tác.)
- [ ] Sửa nội dung một bài đang `reviewed` → test **đỏ** đòi duyệt lại.
- [ ] Lô 1 (`sinh12-c1`, 7 bài / 14 câu) có phiếu duyệt điền đủ, và trạng thái trong dữ liệu
      khớp phiếu — kiểm bằng `npm run review:status -- --doi-chieu-phieu`.
- [ ] Người KHÔNG phải admin mở bài học: **không thấy khối duyệt** (ca test + ảnh chụp Tầng 8b).
- [ ] Gọi thẳng `POST /api/admin-stem-review` bằng token người thường → **403**, có
      `logSecurityEvent` (ca test trong `admin-stem-review.test.ts`).
- [ ] `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts` xanh với khối duyệt đang hiện (admin), 5 theme.
- [ ] Tầng 8b: ảnh chụp 1440px + 390px trước/sau của trang bài học và `/admin`.
- [ ] Khâu sàng lọc AI đạt ca thử 13 câu của ③bis: bắt đủ 3 câu sai, báo oan ≤ 1/10 câu đúng.
- [ ] `npm run review:sync` in diff và **không** tự commit; chạy hai lần liên tiếp cho cùng kết
      quả (lũy đẳng — Tầng 11 của `QUY-TRINH-AUDIT.md`).
- [ ] `PROGRESS.md` ghi tiến độ theo lô, không còn câu "chưa ai đọc" chung chung.

**Lệnh chứng minh:**

```bash
npm ci
rm -rf packages/*/dist dist dist-server && npm run typecheck
npm run lint && npm run format && npm run test:coverage && npm run build
npm run review:status
npm run codemap -- impact packages/subject-biology/lessonTypes.ts
```

## ⑤ Bất biến không được phá

| Bất biến                                                                                               | Test nào canh nó                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hai trường luôn ăn khớp: `reviewStatus === 'reviewed'` ⟺ `review?.loai === 'nguoi-duyet'`              | Ca mới trong mỗi `subject-*/lessons.test.ts`, quét cả 4 môn                                                                                                  |
| Không bài nào `reviewed` mà thiếu `nguoiDuyet` / `ngay` / `phienBanTieuChi` / `phieu` / `bamNoiDung`   | `packages/core-contracts/lessonReview.test.ts` (schema) + ca trong mỗi `subject-*/lessons.test.ts`                                                           |
| Mọi giá trị `phieu` trỏ tới file **có thật** trong `docs/review/`                                      | Ca mới trong `lessons.test.ts` — đọc file thật, không tin chuỗi                                                                                              |
| **Nội dung đổi thì trạng thái duyệt phải hết hiệu lực**                                                | Ca mới: so `bamNoiDung` với SHA-256 tính lại từ `theory` + `checkQuestions` + `workedExample`; lệch → test đỏ, nêu đúng tên bài và đòi duyệt lại             |
| Không có AI trong luồng phán đúng/sai kiến thức; `ai-sang-loc` **không bao giờ** được tính là đã duyệt | Ca canh: `review:status` chỉ đếm `reviewStatus === 'reviewed'`; ca test khẳng định bài `ai-sang-loc` vẫn là `draft` nên vẫn hiện nhãn "Bản nháp" của PR #902 |
| Người thường KHÔNG bao giờ thấy hay ghi được dữ liệu duyệt                                             | `admin-stem-review.test.ts` — ca 403 cho token thường; ca giao diện cho khối duyệt                                                                           |
| Repo là nguồn sự thật cuối: không bài nào `reviewed` trong app mà chưa qua một commit                  | `review:sync` in diff, không tự ghi; ca test lũy đẳng chạy hai lần cùng kết quả                                                                              |
| Cổng tự chấm hiện có (`selfGrade.ts`) vẫn xanh, không bị nới lỏng                                      | `packages/subject-*/lessons.test.ts` sẵn có                                                                                                                  |

**Trường băm nội dung là chi tiết quan trọng nhất của ô này.** Không có nó, quy trình sẽ hỏng
theo đúng kiểu đã hỏng một lần: một đợt sửa nội dung về sau đi qua bài đã duyệt, chữ `reviewed`
ở lại, và không ai biết nó đã hết đúng. Đây là bản sao của bẫy `TRAPS.md` mục 4 ở dạng khác —
trạng thái nói một đằng, dữ liệu một nẻo.

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` **không** đuôi `.js`; import nội bộ gói dùng đường
  tương đối **có** đuôi `.js`.
- `packages/` không được import `apps/` (ESLint chặn).
- Dữ liệu ngoài validate bằng **Zod**, TypeScript `strict`, không `any`.
- Comment tiếng Việt ở chỗ quan trọng; tên biến tiếng Anh dễ hiểu — trừ nơi dự án đã dùng tên
  tiếng Việt (`donViHienThi`, `timLoiTuCham`) thì theo hàng xóm.
- Thêm/xoá gói thì phải `npm install` và commit `package-lock.json`; kiểm bằng `npm ci` = 0
  (`TRAPS.md` mục 3).
- Handler API admin: `validateAuth()` **rồi** `isAdminEmail()`, kèm `checkRateLimit` +
  `logSecurityEvent` — theo đúng mẫu `apps/server/src/api/admin/admin-settings.ts`.
- Chữ nội dung đạt **AAA** (≥ 7:1), phần còn lại **AA**; màu lấy từ token `--a-*`/`--z-*`, không
  ghi cứng. `text-white` bị đảo ở theme sáng — nền tối cố định phải dùng `text-[#fff]`.
- Migration Postgres có phiên bản, rollback được; chạy qua `npm run migrate:pg`.
- PR: tiêu đề conventional commits, mô tả đủ 6 tiêu đề của cổng `metadata`, bật auto-merge ngay
  trong vài giây sau khi tạo, nhật ký đợt việc là **file mới** trong `docs/changelog/`.

---

## Nghiệm thu (điền sau khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Bộ tiêu chí `sinh-v1` sau lô 1 cần sửa gì (đây là mục đích chính của lô chạy thử):
- Còn để ngỏ:
