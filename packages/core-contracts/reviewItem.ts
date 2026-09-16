// reviewItem.ts — HỢP ĐỒNG "một mục cần ôn hôm nay", dùng chung cho mọi môn (slice S12-1).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md §③.1.
//
// VÌ SAO CÓ FILE NÀY: hôm nay việc "cần ôn" nằm rải ở bốn chỗ khác nhau — thẻ từ vựng và bài
// ngữ pháp môn Anh (namespace `grammar:`), thẻ hỏi-đáp môn Lập trình (`prog:`), thẻ STEM
// (`stem:`), và sổ lỗi. Mỗi chỗ có kiểu dữ liệu riêng, nên không nơi nào trả lời được câu
// "hôm nay tôi cần ôn gì trên MỌI môn". Khai MỘT hình dạng mục ôn ở đây; mỗi nguồn chỉ cần
// một phép biến đổi thuần sang hình dạng này, và hàng đợi gộp chỉ còn MỘT luật sắp xếp.
//
// HAI LUẬT chi phối hợp đồng:
//  1. Mục ôn chỉ DẪN TỚI giao diện ôn đã có (`href` là route nội bộ) — S12 không viết lại màn
//     ôn nào, và tuyệt đối không mở đường ghi mới vào kho SRS.
//  2. `title` là chữ để NHẬN RA mục trong hàng đợi (tên từ, tên bài), không bao giờ là nội dung
//     thẻ — hiện sẵn đáp án thì việc ôn mất hết tác dụng.
import { z } from 'zod'

/**
 * Loại mục ôn.
 * · `vocab`/`grammar`: thẻ FSRS môn Anh · `card`: thẻ hỏi-đáp Lập trình/STEM
 * · `mistake`: một mục trong sổ lỗi.
 */
export const ReviewKindSchema = z.enum(['vocab', 'grammar', 'card', 'mistake'])
export type ReviewKind = z.infer<typeof ReviewKindSchema>

/** Nguồn bằng chứng của một mục — mỗi mục phải nói ra mình từ đâu tới, không có mục "trời ơi". */
export const REVIEW_EVIDENCE_SOURCES = [
  'english.srs', // kho `srs_<uid>`: từ vựng và namespace `grammar:`
  'programming.srs', // namespace `prog:`
  'stem.srs', // namespace `stem:` — chỉ có sau khi bài STEM đã hoàn thành (evidence S11)
  'english.mistakes', // bảng english.mistakes (sổ lỗi môn Anh)
  'learning.evidence', // câu sai trong CompletionEvidence.items (S11) — STEM, làm ở S12-2
] as const
export const ReviewEvidenceSourceSchema = z.enum(REVIEW_EVIDENCE_SOURCES)
export type ReviewEvidenceSource = (typeof REVIEW_EVIDENCE_SOURCES)[number]

/** Trạng thái đọc của một nguồn — `error`/`unavailable` phải hiện thành CHỮ, không âm thầm = 0. */
export const ReviewSourceStateSchema = z.enum(['ready', 'error', 'unavailable'])
export type ReviewSourceState = z.infer<typeof ReviewSourceStateSchema>

export interface ReviewItem {
  /** Duy nhất trong hàng đợi: `${kind}:${subjectId}:${contentId}[:${index}]`. */
  itemId: string
  subjectId: string
  contentId: string
  /** Khoá ngắn môn Lập trình → `href` PHẢI giữ `?khoa=` (luật S07). */
  courseId?: string
  kind: ReviewKind
  /** epoch ms. Thẻ SRS: `card.due`; lỗi: `lastReviewedAt + spacing` hoặc `createdAt`. */
  dueAt: number
  evidenceSource: ReviewEvidenceSource
  /** Route NỘI BỘ tới giao diện ôn đã có (giữ `?khoa=`, `?cap=`). */
  href: string
  /** Chữ để nhận ra mục trong hub — KHÔNG phải nội dung thẻ. */
  title: string
  /** Bắt buộc khi `kind === 'mistake'`. */
  mistakeId?: string
  /** Khoá trong kho `srs_<uid>` khi `kind !== 'mistake'` — để giao diện ôn chấm đúng thẻ. */
  srsKey?: string
  /** Đọc từ `SRSCard.difficulty` — CHỈ để sắp xếp, không hiển thị. */
  difficulty?: number
}

export const ReviewItemSchema: z.ZodType<ReviewItem> = z
  .object({
    itemId: z.string().min(1),
    subjectId: z.string().min(1),
    contentId: z.string().min(1),
    courseId: z.string().min(1).optional(),
    kind: ReviewKindSchema,
    dueAt: z.number().finite(),
    evidenceSource: ReviewEvidenceSourceSchema,
    // Route nội bộ: chặn hẳn URL tuyệt đối (`http…`) và `//host` — hàng đợi chỉ dẫn trong app.
    href: z
      .string()
      .startsWith('/')
      .regex(/^\/(?!\/)/, 'href phải là route nội bộ'),
    title: z.string().min(1),
    mistakeId: z.string().min(1).optional(),
    srsKey: z.string().min(1).optional(),
    difficulty: z.number().finite().optional(),
  })
  .superRefine((item, ctx) => {
    if (item.kind === 'mistake' && !item.mistakeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mistakeId'],
        message: 'kind "mistake" bắt buộc có mistakeId',
      })
    }
    // Luật S07 AC-3: nội dung thuộc một khoá ngắn thì đường dẫn phải mang khoá đó, nếu không
    // người học bấm vào là rơi ra ngoài khoá mình đang theo.
    if (item.courseId && !item.href.includes(`?khoa=${item.courseId}`)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['href'],
        message: 'mục có courseId thì href phải chứa ?khoa=<courseId>',
      })
    }
  })

export interface ReviewQueue {
  /** Đã khử trùng, sắp thứ tự và CẮT theo cap. */
  items: readonly ReviewItem[]
  /** Tổng số mục đến hạn TRƯỚC khi cắt cap — để hub nói "còn n mục sau phiên này". */
  totalDue: number
  cap: number
  /** Đếm `totalDue` theo môn. */
  bySubject: Readonly<Record<string, number>>
  builtAt: number
  sourcesState: Readonly<Record<ReviewEvidenceSource, ReviewSourceState>>
}

export const ReviewQueueSchema: z.ZodType<ReviewQueue> = z.object({
  items: z.array(ReviewItemSchema).readonly(),
  totalDue: z.number().int().nonnegative(),
  cap: z.number().int().positive(),
  bySubject: z.record(z.string(), z.number().int().nonnegative()),
  builtAt: z.number().finite(),
  sourcesState: z.object({
    'english.srs': ReviewSourceStateSchema,
    'programming.srs': ReviewSourceStateSchema,
    'stem.srs': ReviewSourceStateSchema,
    'english.mistakes': ReviewSourceStateSchema,
    'learning.evidence': ReviewSourceStateSchema,
  }),
})

/** Dựng `itemId` ở MỘT chỗ — mọi nguồn gọi hàm này để khoá khử trùng luôn cùng khuôn. */
export function reviewItemId(
  kind: ReviewKind,
  subjectId: string,
  contentId: string,
  index?: number,
): string {
  const goc = `${kind}:${subjectId}:${contentId}`
  return index == null ? goc : `${goc}:${index}`
}
