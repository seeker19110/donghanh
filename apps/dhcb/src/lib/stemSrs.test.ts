import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('./progressSync.js', () => ({ pushProgress: vi.fn() }))

import {
  stemCardKey,
  parseStemCardKey,
  addStemLessonCardsToSrs,
  reviewStemCard,
  getAllStemCards,
  getDueStemCards,
  hydrateStemCards,
  duongDanBaiCuaThe,
} from './stemSrs'
import { STEM_SUBJECTS } from './stemLessonRoutes'
import { _resetSrsMemCacheForTests, getSRSStats, getSrsKeysByPrefix, addToSRS } from './srs'
import type { StemLessonLike } from '@dhcb/core-contracts/stemLesson'

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
})
