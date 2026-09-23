import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('./progressSync.js', () => ({ pushProgress: vi.fn() }))

import { buildReviewQueue } from './reviewQueue'
import {
  stemCardKey,
  parseStemCardKey,
  addStemLessonCardsToSrs,
  reviewStemCard,
  getAllStemCards,
  getDueStemCards,
  getDueStemCardsForSubject,
  hydrateStemCards,
  duongDanBaiCuaThe,
} from './stemSrs'
import { STEM_SUBJECTS } from './stemLessonRoutes'
import {
  _resetSrsMemCacheForTests,
  getSRSStats,
  getSrsKeysByPrefix,
  getSrsSnapshot,
  addToSRS,
} from './srs'
import type { StemLessonLike, StemSubjectId } from '@dhcb/core-contracts/stemLesson'

const BAI = (id: string, soThe: number): StemLessonLike =>
  ({
    id,
    grade: '10',
    chapterNumber: 1,
    chapterTitle: 'Chương 1',
    lessonNumber: 1,
    title: `Bài ${id}`,
    hook: '',
    theory: '',
    workedExample: { problem: '', steps: [], answer: '' },
    checkQuestions: [],
    srsCards: Array.from({ length: soThe }, (_, i) => ({ hoi: `hỏi ${i}`, dap: `đáp ${i}` })),
    track: 'core',
    reviewStatus: 'draft',
  }) as StemLessonLike

/** Giả loader của một môn — chỉ đổi đúng `loadLesson`/`getSummary`, trả về hàm dọn. */
function gaLoader(subjectId: 'physics' | 'chemistry', bai: Record<string, StemLessonLike>) {
  const loader = STEM_SUBJECTS[subjectId].loader
  const loadSpy = vi
    .spyOn(loader, 'loadLesson')
    .mockImplementation(async (id: string) => bai[id] as never)
  vi.spyOn(loader, 'getSummary').mockImplementation((id: string) =>
    bai[id] ? ({ id, title: bai[id]!.title } as never) : undefined,
  )
  return loadSpy
}

describe('stemSrs', () => {
  beforeEach(() => {
    localStorage.clear()
    _resetSrsMemCacheForTests()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('khoá thẻ theo khuôn stem:<môn>:<bài>:<số>, luôn hạ chữ thường', () => {
    expect(stemCardKey('physics', 'LY10-C2-B10', 3)).toBe('stem:physics:ly10-c2-b10:3')
  })

  it('tách khoá ngược lại; khoá lạ trả undefined chứ không ném', () => {
    expect(parseStemCardKey('stem:physics:ly10-c1-b1:0')).toEqual({
      subjectId: 'physics',
      lessonId: 'ly10-c1-b1',
      index: 0,
    })
    for (const k of ['prog:p1:0', 'stem:physics:l1', 'stem:mon-la:l1:0', 'stem:physics:l1:x']) {
      expect(parseStemCardKey(k)).toBeUndefined()
    }
  })

  it('addStemLessonCardsToSrs thêm ĐÚNG số thẻ của bài (đọc từ srsCards, không từ chỉ mục)', async () => {
    gaLoader('physics', { l1: BAI('l1', 3) })
    const soThe = await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    expect(soThe).toBe(3)
    expect(getSrsKeysByPrefix('u1', 'stem:')).toHaveLength(3)
  })

  it('bài không có thẻ / không nạp được → 0 thẻ, không ném', async () => {
    gaLoader('physics', { l1: BAI('l1', 0) })
    expect(await addStemLessonCardsToSrs('u1', 'physics', 'l1')).toBe(0)
    expect(await addStemLessonCardsToSrs('u1', 'physics', 'khong-co')).toBe(0)
    expect(await addStemLessonCardsToSrs('', 'physics', 'l1')).toBe(0)
    expect(getSrsKeysByPrefix('u1', 'stem:')).toHaveLength(0)
  })

  it('thẻ STEM KHÔNG bị đếm vào thống kê từ vựng tiếng Anh', async () => {
    gaLoader('physics', { l1: BAI('l1', 2) })
    await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    addToSRS('u1', 'apple')
    expect(getSRSStats('u1').total).toBe(1)
  })

  it('getDueStemCards chỉ trả thẻ đã đến hạn, có tiêu đề bài', async () => {
    gaLoader('physics', { l1: BAI('l1', 2) })
    await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    expect(getDueStemCards('u1')).toHaveLength(0) // thẻ mới: đến hạn sau 4 giờ
    vi.advanceTimersByTime(5 * 3_600_000)
    const due = getDueStemCards('u1')
    expect(due).toHaveLength(2)
    expect(due[0]!.lessonTitle).toBe('Bài l1')
    expect(due[0]!.subjectId).toBe('physics')
  })

  it('getDueStemCards tôn trọng limit', async () => {
    gaLoader('physics', { l1: BAI('l1', 4) })
    await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    vi.advanceTimersByTime(5 * 3_600_000)
    expect(getDueStemCards('u1', 2)).toHaveLength(2)
  })

  it.each<StemSubjectId>(['mathematics', 'physics', 'chemistry', 'biology'])(
    'lọc %s trước cap=1 dù ba môn khác quá hạn lâu hơn',
    (subjectId) => {
      const subjects: StemSubjectId[] = ['mathematics', 'physics', 'chemistry', 'biology']
      for (const other of subjects.filter((id) => id !== subjectId)) {
        addToSRS('u1', stemCardKey(other, 'l1', 0))
      }
      vi.advanceTimersByTime(1000)
      addToSRS('u1', stemCardKey(subjectId, 'l1', 0))
      vi.advanceTimersByTime(5 * 3_600_000)
      expect(getDueStemCardsForSubject('u1', subjectId, 1).map((card) => card.key)).toEqual([
        stemCardKey(subjectId, 'l1', 0),
      ])
      expect(getDueStemCards('u1')).toHaveLength(4)
      expect(getDueStemCards('u1', 1)[0]!.subjectId).not.toBe(subjectId)
    },
  )

  it('giữ thứ tự due/difficulty, không cap trả đủ; bỏ future, namespace và user khác', () => {
    const due = Date.now() - 1000
    const card = (difficulty: number, at = due) => ({
      due: at,
      stability: 1,
      difficulty,
      elapsed_days: 1,
      scheduled_days: 1,
      learning_steps: 0,
      reps: 2,
      lapses: 0,
      state: 2,
      last_review: due - 86_400_000,
    })
    localStorage.setItem(
      'srs_u1',
      JSON.stringify({
        'stem:physics:l1:0': card(2),
        'stem:physics:l1:1': card(8),
        'stem:physics:l1:2': card(5, due - 1000),
        'stem:physics:l1:3': card(5, Date.now() + 1000),
        'stem:chemistry:l1:0': card(5, due - 2000),
        'stem:invalid:l1:0': card(5),
        'prog:l1:0': card(5),
      }),
    )
    expect(getDueStemCardsForSubject('u1', 'physics', 2).map((c) => c.index)).toEqual([2, 1])
    expect(getDueStemCardsForSubject('u1', 'physics')).toHaveLength(3)
    expect(getDueStemCardsForSubject('u1', 'biology', 1)).toEqual([])
    expect(getDueStemCardsForSubject('u2', 'physics', 1)).toEqual([])
    expect(getDueStemCards('u1')).toHaveLength(4)
  })

  it('reviewStemCard đẩy thẻ ra khỏi hàng đợi (đi đúng đường ghi cũ của hệ SRS)', async () => {
    gaLoader('physics', { l1: BAI('l1', 1) })
    await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    vi.advanceTimersByTime(5 * 3_600_000)
    const [the] = getDueStemCards('u1')
    reviewStemCard('u1', the!.key, 'good')
    expect(getDueStemCards('u1')).toHaveLength(0)
  })

  it('hydrateStemCards chỉ nạp ĐÚNG bài có thẻ đến hạn và bỏ thẻ không còn tồn tại', async () => {
    const load = gaLoader('physics', { l1: BAI('l1', 3), l2: BAI('l2', 1) })
    await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    await addStemLessonCardsToSrs('u1', 'physics', 'l2')
    load.mockClear()
    // Bài l1 bị rút còn 1 thẻ sau khi nội dung được sửa → 2 thẻ kia phải biến mất khỏi màn ôn.
    load.mockImplementation(
      async (id: string) => (id === 'l1' ? BAI('l1', 1) : BAI('l2', 1)) as never,
    )
    vi.advanceTimersByTime(5 * 3_600_000)
    const refs = getDueStemCards('u1').filter((r) => r.lessonId === 'l1')
    const cards = await hydrateStemCards(refs)
    expect(cards).toHaveLength(1)
    expect(cards[0]!.hoi).toBe('hỏi 0')
    expect(load).toHaveBeenCalledTimes(1) // chỉ nạp bài l1, không đụng l2
  })

  it('khoá rác trong kho không làm vỡ danh sách thẻ', () => {
    addToSRS('u1', 'stem:khong-hop-le')
    expect(getAllStemCards('u1')).toHaveLength(0)
  })

  it('đường dẫn mở lại bài dùng chung bảng URL của môn STEM', async () => {
    gaLoader('physics', { l1: BAI('l1', 1) })
    await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    vi.advanceTimersByTime(5 * 3_600_000)
    const [the] = getDueStemCards('u1')
    expect(duongDanBaiCuaThe(the!)).toBe('/goc-hoc-tap/physics/bai-hoc/l1--bai-l1')
  })

  // CÂU HỎI CỦA REVIEWER (S12-1): hub hiện chưa có thẻ STEM vì S11-3 (màn kết quả) chưa gọi
  // `addStemLessonCardsToSrs`. Ca dưới đây là DÂY NỐI: nó đi đúng con đường thật — bài ĐẠT →
  // thêm thẻ → thẻ đến hạn → hàng đợi của hub có nhóm môn đó. Ngày S11-3 nối vào, nếu tên hàm
  // hay khuôn khoá lệch thì ca này đỏ NGAY, không phải chờ phát hiện bằng mắt trên giao diện.
  it('bài STEM đạt → thẻ vào kho → hàng đợi của hub có nhóm môn đó', async () => {
    gaLoader('physics', { l1: BAI('l1', 2) })
    await addStemLessonCardsToSrs('u1', 'physics', 'l1')
    vi.advanceTimersByTime(5 * 3_600_000)

    const q = buildReviewQueue({
      uid: 'u1',
      englishDueWords: [],
      englishDueGrammarIds: [],
      programmingDueCards: [],
      stemDueCards: getDueStemCards('u1'),
      englishMistakesDue: [],
      srsCards: getSrsSnapshot('u1'),
      sourcesState: {
        'english.srs': 'ready',
        'programming.srs': 'ready',
        'stem.srs': 'ready',
        'english.mistakes': 'ready',
        'learning.evidence': 'unavailable',
      },
    })
    expect(q.bySubject.physics).toBe(2)
    expect(q.items[0]!.href).toContain('/goc-hoc-tap/physics/on-tap')
    expect(q.items[0]!.evidenceSource).toBe('stem.srs')
  })

  it('CHƯA đạt bài nào → hàng đợi không có nhóm STEM (không hiện nhóm rỗng giả)', () => {
    const q = buildReviewQueue({
      uid: 'u1',
      englishDueWords: [],
      englishDueGrammarIds: [],
      programmingDueCards: [],
      stemDueCards: getDueStemCards('u1'),
      englishMistakesDue: [],
      srsCards: getSrsSnapshot('u1'),
      sourcesState: {
        'english.srs': 'ready',
        'programming.srs': 'ready',
        'stem.srs': 'ready',
        'english.mistakes': 'ready',
        'learning.evidence': 'unavailable',
      },
    })
    expect(q.bySubject.physics).toBeUndefined()
    expect(q.totalDue).toBe(0)
  })
})
