# 0302 — 2026-09-14 — Nền quy trình duyệt chuyên môn: hợp đồng, bảng DB, API, hai công cụ

**PR:** (điền khi tạo) · **Nhánh:** `claude/optimistic-pasteur-goh7vb`
**Đặc tả:** `docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md` (PR #903) — Approved
for implementation, ô ⓪.5 đã chốt.

## Việc đã làm

Phần **NỀN** của quy trình duyệt (người dùng chọn tách đôi: nền trước, giao diện sau). Không có
giao diện nào trong đợt này, nên không có gì đến tay người học.

| Thành phần                                      | Đường dẫn                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| Hợp đồng bản ghi duyệt + 7 tiêu chí `sinh-v1`   | `packages/core-contracts/lessonReview.ts`                          |
| Băm nội dung (SHA-256, JSON tất định)           | `packages/core-contracts/lessonReviewHash.ts`                      |
| Luật ăn khớp hai trường, viết MỘT lần cho 4 môn | `packages/core-contracts/lessonReviewGuard.ts`                     |
| Bảng bàn làm việc của người duyệt               | `postgres/migrations/0078_stem_lesson_reviews.sql`                 |
| API admin đọc/ghi lượt duyệt                    | `apps/server/src/api/admin/admin-stem-review.ts`                   |
| DB → file dữ liệu repo, mặc định chỉ in diff    | `scripts/review-sync.ts` · `npm run review:sync`                   |
| Đọc tiến độ thật từ registry                    | `scripts/review-status.ts` · `npm run review:status`               |
| Trường `review?` (không bắt buộc)               | `packages/subject-{math,physics,chemistry,biology}/lessonTypes.ts` |

## Quyết định

1. **Luật ăn khớp gom vào MỘT hàm `timLoiDuyet`, không chép 4 bản.** Bản đầu tôi viết 3 ca test
   chép tay vào từng môn rồi bỏ đi ngay: bốn bản chép tay sẽ trôi khỏi nhau **đúng như bốn bản
   cổng tự chấm đã trôi** (audit 2026-09-14 tìm ra Hoá đúng, Toán/Lí mù, Sinh không có).
2. **Cổng phải được thử bằng DỮ LIỆU GIẢ.** Cổng chạy trên dữ liệu thật hiện xanh vì chưa bài nào
   được duyệt — xanh rỗng, không chứng minh được gì. `lessonReviewGuard.test.ts` cố ý làm sai 7
   kiểu (lật `reviewed` không bản ghi · có bản ghi mà quên lật · còn tiêu chí trượt · máy tự
   phong · sửa lý thuyết sau khi duyệt · **sửa đáp án** sau khi duyệt · nhiều bài sai cùng lúc)
   và đòi cổng bắt được cả 7. Đây là cách duy nhất không lặp lại `TRAPS.md` mục 4.
3. **Băm chỉ ba phần nội dung** (`theory` · `workedExample` · `checkQuestions`), KHÔNG băm cả bài.
   `title`/`hook`/`srsCards`/`animation` sửa được mà không làm sai kiến thức đã xác nhận; bắt
   duyệt lại vì một chữ trong `hook` chỉ tạo nhiễu, rồi người ta sẽ duyệt lại lấy lệ và cổng mất
   giá trị.
4. **`review:sync` mặc định KHÔNG ghi gì** — chỉ in ra sẽ đổi gì; phải `-- --ap-dung` mới ghi. Nó
   cũng không commit. Gặp bất kỳ bất thường nào (không tìm thấy tệp chương, không đổi được trạng
   thái) thì **ném lỗi và dừng**, không ghi dở dang.
5. **Ba nơi cùng một luật, cố ý:** Zod (`LessonReviewSchema`) · ràng buộc `CHECK` trong migration
   0078 · schema thân yêu cầu của API. Một client hỏng không ghi được bản ghi "đã duyệt" rỗng ruột.

## Hai lỗi THẬT trong mã của chính đợt này, do test bắt

1. **`2026-02-30` lọt qua kiểm tra ngày.** `new Date('2026-02-30')` KHÔNG phải Invalid Date — JS
   lặng lẽ cuộn sang 2026-03-02, nên kiểm "không NaN" là chưa đủ. Sửa: kiểm **khứ hồi** (in ngược
   ra phải khớp nguyên văn). Sửa xong lộ tiếp lỗi thứ hai: `toISOString()` **ném RangeError** với
   Invalid Date thật (`2026-13-01`), phải chặn NaN trước.
2. **Băm phụ thuộc thứ tự khoá.** `answer` là object nên thứ tự khoá trong mã nguồn lọt được vào
   `JSON.stringify`; ai đó sắp lại field là cả loạt bài bị đòi duyệt lại oan. Sửa: JSON tất định,
   sắp khoá theo alphabet ở mọi độ sâu — nhưng **giữ nguyên thứ tự mảng**, vì thứ tự câu hỏi và
   thứ tự bước giải LÀ nội dung.

## Bằng chứng kiểm chứng

(điền sau khi chạy — xem mô tả PR)

## Còn nợ

- **Giao diện chưa có** — khối duyệt trong trang bài học + bảng tổng `/admin` là PR kế tiếp, phải
  qua a11y 5 theme và Tầng 8b.
- **Khâu AI sàng lọc chưa làm** — theo đúng thứ tự đã bàn: làm sau khi lô 1 duyệt tay xong, để có
  14 câu người đã đọc làm thước đo cho ca thử 13 câu, thay vì AI tự chấm bài của chính nó.
- Nợ nội dung không đổi: `npm run review:status` in ra **0/294 bài đã duyệt · 442/665 câu trắc
  nghiệm (66,5%)**.
