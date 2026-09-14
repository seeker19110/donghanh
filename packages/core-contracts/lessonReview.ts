// lessonReview.ts — Bản ghi DUYỆT CHUYÊN MÔN của một bài học STEM.
//
// VÌ SAO CÓ FILE NÀY (đặc tả `docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md`):
// 442/665 câu hỏi của 4 môn STEM là trắc nghiệm, và với dạng đó KHÔNG cổng máy nào kiểm được
// phương án đánh dấu có đúng kiến thức hay không — kể cả `core-grading/selfGrade.ts`, vốn chỉ
// kiểm tính nhất quán và tính đúng số học. Việc đó phải do người có chuyên môn đọc. File này
// làm cho kết quả đọc ấy thành DỮ LIỆU KIỂM CHỨNG ĐƯỢC thay vì một chữ `reviewed` không ai
// truy được nguồn.
//
// HAI TRƯỜNG, KHÔNG PHẢI MỘT — và đây là quyết định có chủ đích:
//   - `reviewStatus: 'draft' | 'reviewed'` (ở `stemLesson.ts`) GIỮ NGUYÊN, vì giao diện đang
//     đọc nó để hiện nhãn "Bản nháp — chưa duyệt chuyên môn" (PR #902).
//   - `review?: LessonReview` là trường MỚI, không bắt buộc, mang chi tiết ai duyệt/khi nào.
// Đổi hình trường cũ sẽ là breaking change chạm cả UI lẫn chỉ mục nạp lười; thêm trường thì
// không phải sửa một dòng giao diện nào và không phải di trú 294 file dữ liệu.
// Luật ăn khớp giữa hai trường do test của từng gói môn canh (xem `lessons.test.ts`).
import { z } from 'zod'

/** Ngày theo khuôn YYYY-MM-DD — dùng chung cho mọi mốc thời gian của bản ghi duyệt. */
const NgaySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'ngày phải theo khuôn YYYY-MM-DD')
  // Kiểm KHỨ HỒI, không chỉ kiểm "không NaN": `new Date('2026-02-30')` KHÔNG phải Invalid Date —
  // JS lặng lẽ cuộn sang 2026-03-02. Chỉ khi in ngược ra mà khớp nguyên văn thì ngày mới có thật.
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`)
    // `toISOString()` NÉM RangeError với Invalid Date (vd '2026-13-01'), nên phải chặn trước.
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v)
  }, 'ngày không có thật')

/**
 * Bảy tiêu chí của bộ `sinh-v1` — người duyệt trả lời từng câu cho từng BÀI.
 * Một câu `false` = bài chưa đạt, và khi đó bài KHÔNG được mang `reviewStatus: 'reviewed'`.
 */
export const TIEU_CHI_DUYET = [
  'dungChuongTrinh', // 1. đúng chương trình GDPT 2018 của lớp tương ứng
  'khongSaiKienThuc', // 2. không có điểm sai kiến thức
  'dapAnDung', // 3. phương án được đánh dấu thật sự đúng
  'nhieuHopLy', // 4. phương án nhiễu hợp lý, không có hai phương án cùng đúng
  'giaiThichDung', // 5. lời giải nói ĐƯỢC vì sao, không chỉ nhắc lại đáp án
  'thuatNguChuan', // 6. thuật ngữ đúng chuẩn SGK hiện hành
  'phuHopLuaTuoi', // 7. không có nội dung cần diễn đạt lại theo lứa tuổi
] as const
export type TieuChiDuyet = (typeof TIEU_CHI_DUYET)[number]

export const KetQuaTieuChiSchema = z
  .object(
    Object.fromEntries(TIEU_CHI_DUYET.map((k) => [k, z.boolean()])) as Record<
      TieuChiDuyet,
      z.ZodBoolean
    >,
  )
  .strict()
export type KetQuaTieuChi = z.infer<typeof KetQuaTieuChiSchema>

/** Phiên bản bộ tiêu chí. Bài duyệt ở lô 1 và lô 8 có thể đo bằng hai thước khác nhau —
 *  không ghi lại thì "đã duyệt" mất nghĩa. */
export const PHIEN_BAN_TIEU_CHI = 'sinh-v1'

export const LessonReviewSchema = z.discriminatedUnion('loai', [
  // AI sàng lọc vòng 1. KHÔNG PHẢI ĐÃ DUYỆT — chỉ là danh sách chỗ đáng ngờ để người đọc nhanh
  // hơn. Bài mang loại này vẫn là `draft` và vẫn hiện nhãn "Bản nháp" cho người học.
  z
    .object({
      loai: z.literal('ai-sang-loc'),
      ngay: NgaySchema,
      /** Số câu bị gắn cờ nghi ngờ trong bài. 0 = rà rồi, không thấy gì đáng ngờ. */
      soCoNghiNgo: z.number().int().nonnegative(),
      ghiChu: z.string().max(4000).optional(),
    })
    .strict(),

  // Người có chuyên môn đã đọc và CHỊU TRÁCH NHIỆM.
  z
    .object({
      loai: z.literal('nguoi-duyet'),
      nguoiDuyet: z.string().min(2).max(100),
      ngay: NgaySchema,
      phienBanTieuChi: z.string().min(1).max(50),
      tieuChi: KetQuaTieuChiSchema,
      /** SHA-256 (64 ký tự hex) của phần nội dung bài tại lúc duyệt — xem `bamNoiDungBaiHoc`. */
      bamNoiDung: z.string().regex(/^[0-9a-f]{64}$/, 'bamNoiDung phải là SHA-256 dạng hex'),
      ghiChu: z.string().max(4000).optional(),
    })
    .strict(),
])
export type LessonReview = z.infer<typeof LessonReviewSchema>

/** Bài đạt hết 7 tiêu chí chưa. Một câu `false` là chưa đạt — không có "đạt một phần". */
export function datHetTieuChi(tieuChi: KetQuaTieuChi): boolean {
  return TIEU_CHI_DUYET.every((k) => tieuChi[k])
}

/**
 * Bài này đã được NGƯỜI duyệt và đạt chưa. Dùng ở đúng một chỗ: quyết định
 * `reviewStatus === 'reviewed'` có hợp lệ không.
 *
 * `ai-sang-loc` LUÔN trả false — đây là bất biến của cả quy trình, không phải chi tiết kỹ thuật:
 * máy không bao giờ được tự phong cho nội dung của chính nó là đã duyệt.
 */
export function daDuocNguoiDuyet(review: LessonReview | undefined): boolean {
  return review?.loai === 'nguoi-duyet' && datHetTieuChi(review.tieuChi)
}
