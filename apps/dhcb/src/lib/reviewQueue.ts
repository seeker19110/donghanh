// reviewQueue — GỘP mọi thứ "cần ôn hôm nay" của mọi môn thành MỘT hàng đợi (slice S12-1).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s12-on-lai-so-loi-tien-do.md §③.2.
//
// BA LUẬT LÀM NÊN FILE NÀY:
//  1. HÀM THUẦN, ĐỒNG BỘ. `buildReviewQueue` nhận KẾT QUẢ ĐÃ ĐỌC của từng nguồn, không tự đọc
//     localStorage, không fetch, không ghi gì cả. Nhờ vậy nó test được đến từng ca biên, và
//     không có đường nào để một trang lỡ tay ghi đè lịch ôn khi chỉ định hiển thị hàng đợi.
//  2. CHỈ ĐỌC kho SRS. Ghi kết quả ôn vẫn đi đúng các hàm cũ của từng môn (`reviewWord`,
//     `reviewProgCard`, `reviewStemCard`, `markReviewed`) — S12 không mở đường ghi mới.
//  3. MỘT luật sắp xếp duy nhất, mở thẳng từ `getDueBy` (quá hạn lâu nhất trước, rồi khó nhất).
//     Không có hạn ngạch theo môn: chưa có bằng chứng nào cho thấy người học cần điều đó.
import {
  reviewItemId,
  type ReviewItem,
  type ReviewQueue,
  type ReviewKind,
} from '@dhcb/core-contracts/reviewItem'
import { SRS_SESSION_CAP, type SRSCard } from './srs'
import { REVIEW_SPACING_MS, type Mistake } from './mistakes'
import type { ProgSrsCardRef } from './programmingSrs'
import type { StemSrsCardRef } from './stemSrs'
import { STEM_SUBJECTS } from './stemLessonRoutes'
import { duongDanOnTapStem } from './reviewRoutes'

/**
 * Một mục lỗi đọc từ bằng chứng hoàn thành (S11) — khai theo HÌNH DẠNG ở đây để S12-1 không
 * phải chờ S12-2: `MistakeEntry` của `evidenceMistakes.ts` thoả đúng hình dạng này.
 */
export interface EvidenceMistakeDue {
  entryId: string
  subjectId: string
  contentId: string
  questionIndex: number
  /** epoch ms — thời điểm mục này đến hạn ôn. */
  dueAt: number
  href: string
  title: string
}

export interface ReviewSources {
  uid: string
  /**
   * Từ vựng Anh đến hạn. Nhận hình dạng tối thiểu `{ word }` để nơi gọi có thể truyền thẳng
   * `DictEntry` của `getDueWords(uid, pool)`, HOẶC danh sách khoá đọc từ kho SRS khi không muốn
   * nạp cả từ điển (hub ôn tập). KHÔNG truyền limit ở đây — cap là việc của hàng đợi.
   */
  englishDueWords: readonly { word: string }[]
  /** `getDueGrammarLessonIds(uid, doneIds)`. */
  englishDueGrammarIds: readonly string[]
  /** `getDueProgCards(uid)`. */
  programmingDueCards: readonly ProgSrsCardRef[]
  /** `getDueStemCards(uid)`. */
  stemDueCards: readonly StemSrsCardRef[]
  /** `getDueMistakes(uid)` — sổ lỗi môn Anh. */
  englishMistakesDue: readonly Mistake[]
  /** Câu sai lấy từ evidence S11 (STEM) — S12-2 mới có nguồn, S12-1 luôn rỗng. */
  evidenceMistakesDue?: readonly EvidenceMistakeDue[]
  /** `load(uid)` — chỉ để lấy `due`/`difficulty` của thẻ. CHỈ ĐỌC. */
  srsCards: Readonly<Record<string, SRSCard>>
  sourcesState: ReviewQueue['sourcesState']
  /** Cấp CEFR đang học — để dựng href `?tab=srs` của đúng trang cấp. */
  englishLevelId?: string
}

export interface BuildReviewQueueOptions {
  cap?: number
  now?: number
}

/** Tiêu đề ngắn của một bài ngữ pháp trong hàng đợi — mã bài là thứ người học nhận ra được. */
const nhanNguPhap = (lessonId: string) => `Ngữ pháp · ${lessonId}`

function theSrs(
  srsCards: Readonly<Record<string, SRSCard>>,
  key: string,
  now: number,
): { dueAt: number; difficulty?: number } {
  const card = srsCards[key.toLowerCase()]
  // Thẻ không còn trong kho (dữ liệu vừa bị dọn): coi như đến hạn NGAY, đừng giấu mục đi —
  // giao diện ôn sẽ tự bỏ qua nếu thẻ thật sự không dựng được nội dung.
  return card ? { dueAt: card.due, difficulty: card.difficulty } : { dueAt: now }
}

/** href tới tab "Ôn SRS" của trang cấp CEFR đang học — giữ nguyên luật `?cap=` của trang đó. */
function hrefOnAnh(levelId: string | undefined, cap: number): string {
  if (!levelId) return '/lo-trinh-hoc'
  return `/lo-trinh-hoc/${levelId.toLowerCase()}?tab=srs&cap=${cap}`
}

/** Thứ tự ưu tiên khi cùng `dueAt`: lỗi đã mắc trước thẻ (§③.2 luật 3). */
const UU_TIEN: Record<ReviewKind, number> = { mistake: 0, vocab: 1, grammar: 1, card: 1 }

/**
 * Gộp bốn nguồn thành hàng đợi ôn hôm nay: khử trùng → sắp thứ tự → cắt cap.
 *
 * Thứ tự (một chỗ duy nhất, có test canh): (1) khử trùng theo `subjectId+contentId`, `mistake`
 * thắng thẻ, cùng loại thì giữ mục đến hạn SỚM hơn; (2) `dueAt` tăng dần; (3) `mistake` trước
 * thẻ; (4) `difficulty` giảm dần; (5) cắt `cap`.
 */
export function buildReviewQueue(
  sources: ReviewSources,
  opts: BuildReviewQueueOptions = {},
): ReviewQueue {
  const now = opts.now ?? Date.now()
  const cap = opts.cap ?? SRS_SESSION_CAP
  const tho: ReviewItem[] = []

  // ── Môn Anh: từ vựng ──
  for (const w of sources.englishDueWords) {
    const { dueAt, difficulty } = theSrs(sources.srsCards, w.word, now)
    tho.push({
      itemId: reviewItemId('vocab', 'english', w.word),
      subjectId: 'english',
      contentId: w.word,
      kind: 'vocab',
      dueAt,
      difficulty,
      evidenceSource: 'english.srs',
      href: hrefOnAnh(sources.englishLevelId, cap),
      title: w.word,
      srsKey: w.word.toLowerCase(),
    })
  }

  // ── Môn Anh: bài ngữ pháp (cùng kho SRS, namespace `grammar:`) ──
  for (const lessonId of sources.englishDueGrammarIds) {
    const key = `grammar:${lessonId.toLowerCase()}`
    const { dueAt, difficulty } = theSrs(sources.srsCards, key, now)
    tho.push({
      itemId: reviewItemId('grammar', 'english', lessonId),
      subjectId: 'english',
      contentId: lessonId,
      kind: 'grammar',
      dueAt,
      difficulty,
      evidenceSource: 'english.srs',
      href: hrefOnAnh(sources.englishLevelId, cap),
      title: nhanNguPhap(lessonId),
      srsKey: key,
    })
  }

  // ── Môn Lập trình ──
  for (const c of sources.programmingDueCards) {
    const { dueAt, difficulty } = theSrs(sources.srsCards, c.key, now)
    tho.push({
      itemId: reviewItemId('card', 'programming', c.lessonId, c.index),
      subjectId: 'programming',
      contentId: c.lessonId,
      kind: 'card',
      dueAt,
      difficulty,
      evidenceSource: 'programming.srs',
      href: '/lap-trinh/on-tap',
      title: c.lessonTitle,
      srsKey: c.key,
    })
  }

  // ── Bốn môn STEM ──
  for (const c of sources.stemDueCards) {
    const { dueAt, difficulty } = theSrs(sources.srsCards, c.key, now)
    tho.push({
      itemId: reviewItemId('card', c.subjectId, c.lessonId, c.index),
      subjectId: c.subjectId,
      contentId: c.lessonId,
      kind: 'card',
      dueAt,
      difficulty,
      evidenceSource: 'stem.srs',
      href: duongDanOnTapStem(c.subjectId, cap),
      title: c.lessonTitle,
      srsKey: c.key,
    })
  }

  // ── Sổ lỗi môn Anh ──
  for (const m of sources.englishMistakesDue) {
    tho.push({
      itemId: reviewItemId('mistake', 'english', m.id),
      subjectId: 'english',
      contentId: m.id,
      kind: 'mistake',
      // Đã ôn rồi thì đến hạn sau giãn cách của sổ lỗi; chưa ôn bao giờ thì tính từ lúc mắc lỗi.
      dueAt: m.lastReviewedAt == null ? m.createdAt : m.lastReviewedAt + REVIEW_SPACING_MS,
      evidenceSource: 'english.mistakes',
      href: '/so-tay-loi-sai',
      title: m.wrong || m.corrected || 'Lỗi đã mắc',
      mistakeId: m.id,
    })
  }

  // ── Câu sai từ bằng chứng hoàn thành (STEM) — có nguồn từ S12-2 ──
  for (const e of sources.evidenceMistakesDue ?? []) {
    tho.push({
      itemId: reviewItemId('mistake', e.subjectId, e.contentId, e.questionIndex),
      subjectId: e.subjectId,
      contentId: e.contentId,
      kind: 'mistake',
      dueAt: e.dueAt,
      evidenceSource: 'learning.evidence',
      href: e.href,
      title: e.title,
      mistakeId: e.entryId,
    })
  }

  const daKhuTrung = khuTrung(tho)
  const daSap = [...daKhuTrung].sort(
    (a, b) =>
      a.dueAt - b.dueAt ||
      UU_TIEN[a.kind] - UU_TIEN[b.kind] ||
      (b.difficulty ?? 0) - (a.difficulty ?? 0) ||
      a.itemId.localeCompare(b.itemId),
  )

  const bySubject: Record<string, number> = {}
  for (const it of daSap) bySubject[it.subjectId] = (bySubject[it.subjectId] ?? 0) + 1

  return {
    items: daSap.slice(0, cap),
    totalDue: daSap.length,
    cap,
    bySubject,
    builtAt: now,
    sourcesState: sources.sourcesState,
  }
}

/**
 * Khử trùng theo NỘI DUNG: một mục lỗi và một thẻ của cùng nội dung là CÙNG một việc phải làm,
 * nên chỉ giữ mục lỗi (cụ thể hơn: nó nói rõ sai ở đâu). Nếu không, bài ngữ pháp vừa sai sẽ hiện
 * hai lần và số ở hub lệch số ở tab "Ôn SRS".
 *
 * NHƯNG nhiều THẺ của cùng một bài thì GIỮ NGUYÊN tất cả: mỗi thẻ có lịch ôn riêng — gộp chúng
 * lại là xoá mất chính thứ làm nên SRS. Chỉ khi cùng một thẻ (cùng `srsKey`) xuất hiện hai lần
 * mới giữ bản đến hạn sớm hơn.
 */
function khuTrung(items: readonly ReviewItem[]): ReviewItem[] {
  const khoaNoiDung = (it: ReviewItem) => `${it.subjectId}:${it.contentId.toLowerCase()}`
  const coLoi = new Set(items.filter((it) => it.kind === 'mistake').map(khoaNoiDung))

  const giu = new Map<string, ReviewItem>()
  for (const it of items) {
    // Nội dung đã có mục lỗi thì các thẻ của nội dung đó nhường chỗ.
    if (it.kind !== 'mistake' && coLoi.has(khoaNoiDung(it))) continue
    // Thẻ phân biệt tới từng thẻ (`srsKey`); mục lỗi phân biệt theo nội dung.
    const khoa = it.kind === 'mistake' ? khoaNoiDung(it) : (it.srsKey ?? it.itemId)
    const cu = giu.get(khoa)
    if (!cu || it.dueAt < cu.dueAt) giu.set(khoa, it)
  }
  return [...giu.values()]
}

/** Nhãn môn để hiện trong hub — bốn môn STEM lấy từ bảng chung, hai môn kia khai ở đây. */
export function nhanMon(subjectId: string): string {
  if (subjectId === 'english') return 'Tiếng Anh'
  if (subjectId === 'programming') return 'Lập trình'
  return STEM_SUBJECTS[subjectId as keyof typeof STEM_SUBJECTS]?.label ?? subjectId
}
