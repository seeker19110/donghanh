// stemSrs — Thẻ SRS bốn môn STEM (Toán · Lí · Hoá · Sinh), nối vào HỆ SRS CHUNG của app.
//
// Cùng khuôn với `programmingSrs.ts`: không dựng hệ nhắc lại riêng, chỉ thêm một NAMESPACE khoá
// (`stem:`) trong kho `srs_${uid}` để thẻ STEM không đụng từ vựng tiếng Anh, bài ngữ pháp
// (`grammar:`) hay thẻ Lập trình (`prog:`) đang sống chung kho.
//
// Khoá một thẻ: `stem:<mã môn>:<mã bài>:<số thứ tự thẻ>` — có mã môn vì bốn môn có thể trùng mã
// bài, và có số thứ tự vì mỗi thẻ phải có lịch ôn RIÊNG (đó là toàn bộ giá trị của SRS).
//
// KHÁC `programmingSrs` ở một điểm quan trọng: chỉ mục STEM (file sinh) KHÔNG có `srsCardCount`,
// và đặc tả S12 §7 Q5 chọn KHÔNG thêm. Nên "học viên đang có những thẻ STEM nào" chỉ có kho SRS
// biết — `getDueStemCards` liệt kê khoá theo tiền tố (`getSrsKeysByPrefix`) thay vì dựng từ chỉ mục.
// Hệ quả đúng mong muốn: thẻ CHỈ tồn tại sau khi bài đã hoàn thành có bằng chứng (S11), mở trang
// bài học không tạo ra thẻ nào.
import { addToSRS, reviewWord, getDueBy, getSrsKeysByPrefix, type Rating } from './srs'
import { STEM_SUBJECTS, duongDanBaiHoc } from './stemLessonRoutes'
import type { StemLessonLike, StemSubjectId } from '@dhcb/core-contracts/stemLesson'

/** Một thẻ trong hàng đợi — đủ để chấm và biết thuộc bài nào, CHƯA có nội dung. */
export interface StemSrsCardRef {
  /** Khoá SRS — dùng khi chấm (`reviewStemCard`). */
  key: string
  subjectId: StemSubjectId
  lessonId: string
  lessonTitle: string
  index: number
}

/** Thẻ đã có nội dung, đủ để dựng màn ôn. */
export interface StemSrsCard extends StemSrsCardRef {
  hoi: string
  dap: string
}

const TIEN_TO = 'stem:'

// Hạ chữ thường TOÀN BỘ khoá: addToSRS/reviewWord bên trong đã tự hạ, nên đọc bằng khoá còn chữ
// hoa là GHI một đằng ĐỌC một nẻo — thẻ không bao giờ đến hạn, hỏng im lặng (bẫy đã mắc thật ở
// mạch ngữ pháp, audit 2026-08-12).
export function stemCardKey(subjectId: string, lessonId: string, index: number): string {
  return `${TIEN_TO}${subjectId}:${lessonId}:${index}`.toLowerCase()
}

/** Tách khoá ngược lại thành môn · bài · số thứ tự. Khoá lạ → `undefined` (không ném). */
export function parseStemCardKey(
  key: string,
): { subjectId: StemSubjectId; lessonId: string; index: number } | undefined {
  if (!key.startsWith(TIEN_TO)) return undefined
  const phan = key.slice(TIEN_TO.length).split(':')
  if (phan.length !== 3) return undefined
  const [subjectId, lessonId, so] = phan
  const index = Number(so)
  if (!subjectId || !lessonId || !Number.isInteger(index) || index < 0) return undefined
  if (!(subjectId in STEM_SUBJECTS)) return undefined
  return { subjectId: subjectId as StemSubjectId, lessonId, index }
}

/**
 * Đưa TOÀN BỘ thẻ của một bài STEM vào vòng ôn.
 *
 * CHỈ được gọi khi bài đã hoàn thành CÓ BẰNG CHỨNG (màn kết quả của S11, `evidence.passed`) —
 * không gọi khi mở trang bài học, không gọi khi lượt làm bị từ chối. Số thẻ đọc từ `srsCards`
 * của chính bài (nạp lười), không thêm trường đếm vào chỉ mục (§7 Q5 phương án a).
 * Trả về số thẻ đã đưa vào vòng ôn (0 nếu bài không có thẻ hoặc không nạp được).
 */
export async function addStemLessonCardsToSrs(
  uid: string,
  subjectId: StemSubjectId,
  lessonId: string,
): Promise<number> {
  if (!uid) return 0
  const lesson = await STEM_SUBJECTS[subjectId]?.loader.loadLesson(lessonId)
  const soThe = lesson?.srsCards?.length ?? 0
  for (let i = 0; i < soThe; i++) addToSRS(uid, stemCardKey(subjectId, lessonId, i))
  return soThe
}

/** Chấm một thẻ sau khi học viên tự đánh giá — đi đúng đường ghi CŨ của hệ SRS. */
export function reviewStemCard(uid: string, key: string, rating: Rating): void {
  reviewWord(uid, key, rating)
}

/** Mọi thẻ STEM học viên đang có (chưa nội dung), dựng từ chính kho SRS. */
export function getAllStemCards(uid: string): StemSrsCardRef[] {
  const out: StemSrsCardRef[] = []
  for (const key of getSrsKeysByPrefix(uid, TIEN_TO)) {
    const p = parseStemCardKey(key)
    if (!p) continue // khoá rác/định dạng cũ: bỏ qua, không làm vỡ hàng đợi
    const summary = STEM_SUBJECTS[p.subjectId].loader.getSummary(p.lessonId)
    out.push({
      key,
      subjectId: p.subjectId,
      lessonId: p.lessonId,
      lessonTitle: summary?.title ?? p.lessonId,
      index: p.index,
    })
  }
  return out
}

/** Các thẻ ĐẾN HẠN ôn — phần lọc/sắp xếp dùng chung `getDueBy` của hệ SRS (lib/srs.ts). */
export function getDueStemCards(uid: string, limit?: number): StemSrsCardRef[] {
  return getDueBy(uid, getAllStemCards(uid), (c) => c.key, limit)
}

/** Lọc môn trước giới hạn phiên để thẻ môn khác không chiếm chỗ trong hàng đợi. */
export function getDueStemCardsForSubject(
  uid: string,
  subjectId: StemSubjectId,
  limit?: number,
): StemSrsCardRef[] {
  return getDueBy(
    uid,
    getAllStemCards(uid).filter((card) => card.subjectId === subjectId),
    (card) => card.key,
    limit,
  )
}

/**
 * Nạp nội dung cho các thẻ trong hàng đợi — chỉ tải ĐÚNG những bài có thẻ đến hạn. Thẻ mà bài
 * không còn (nội dung đã sửa, bớt thẻ) bị bỏ khỏi kết quả thay vì hiện thẻ trống.
 */
export async function hydrateStemCards(refs: readonly StemSrsCardRef[]): Promise<StemSrsCard[]> {
  const canNap = new Map<string, { subjectId: StemSubjectId; lessonId: string }>()
  for (const r of refs) canNap.set(`${r.subjectId}:${r.lessonId}`, r)
  const daNap = new Map<string, StemLessonLike | undefined>()
  await Promise.all(
    [...canNap.entries()].map(async ([k, { subjectId, lessonId }]) => {
      daNap.set(k, await STEM_SUBJECTS[subjectId].loader.loadLesson(lessonId))
    }),
  )
  const out: StemSrsCard[] = []
  for (const ref of refs) {
    const lesson = daNap.get(`${ref.subjectId}:${ref.lessonId}`)
    const card = lesson?.srsCards?.[ref.index]
    if (card) out.push({ ...ref, hoi: card.hoi, dap: card.dap })
  }
  return out
}

/** Đường dẫn mở lại bài của một thẻ — dùng chung bảng URL của `stemLessonRoutes.ts`. */
export function duongDanBaiCuaThe(ref: StemSrsCardRef): string {
  return duongDanBaiHoc(ref.subjectId, ref.lessonId, ref.lessonTitle)
}
