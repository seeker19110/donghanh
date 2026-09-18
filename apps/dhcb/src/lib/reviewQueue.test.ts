import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Chặn đồng bộ cloud: reviewQueue kéo theo srs.ts/mistakes.ts, test phải chạy offline.
vi.mock('./progressSync.js', () => ({ pushProgress: vi.fn() }))

import { buildReviewQueue, nhanMon, type ReviewSources } from './reviewQueue'
import { ReviewQueueSchema } from '@dhcb/core-contracts/reviewItem'
import { SRS_SESSION_CAP, type SRSCard } from './srs'
import { REVIEW_SPACING_MS, type Mistake } from './mistakes'
import type { DictEntry } from '../types'
import * as srs from './srs'
import * as progSrs from './programmingSrs'
import * as mistakes from './mistakes'

const NOW = 1_760_000_000_000
const W = (word: string): DictEntry => ({ word }) as DictEntry

function the(due: number, difficulty = 5): SRSCard {
  return {
    due,
    stability: 1,
    difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: 1,
    lapses: 0,
    state: 2,
    last_review: null,
  } as SRSCard
}

function loi(id: string, over: Partial<Mistake> = {}): Mistake {
  return {
    id,
    wrong: `câu sai ${id}`,
    corrected: 'câu đúng',
    explanation: 'giải thích',
    source: 'chat',
    dir: 'A',
    createdAt: NOW - 86_400_000,
    count: 1,
    lastReviewedAt: null,
    reviewCount: 0,
    ...over,
  } as Mistake
}

const NGUON_SAN_SANG: ReviewSources['sourcesState'] = {
  'english.srs': 'ready',
  'programming.srs': 'ready',
  'stem.srs': 'ready',
  'english.mistakes': 'ready',
  'learning.evidence': 'unavailable',
}

function nguon(over: Partial<ReviewSources> = {}): ReviewSources {
  return {
    uid: 'u1',
    englishDueWords: [],
    englishDueGrammarIds: [],
    programmingDueCards: [],
    stemDueCards: [],
    englishMistakesDue: [],
    srsCards: {},
    sourcesState: NGUON_SAN_SANG,
    englishLevelId: 'A1',
    ...over,
  }
}

describe('buildReviewQueue', () => {
  beforeEach(() => {
    localStorage.clear()
    srs._resetSrsMemCacheForTests()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('không nguồn nào có mục → hàng đợi rỗng, totalDue = 0 (không phải lỗi)', () => {
    const q = buildReviewQueue(nguon(), { now: NOW })
    expect(q.items).toHaveLength(0)
    expect(q.totalDue).toBe(0)
    expect(q.bySubject).toEqual({})
    expect(q.cap).toBe(SRS_SESSION_CAP)
    expect(ReviewQueueSchema.safeParse(q).success).toBe(true)
  })

  it('THUẦN: không ghi kho SRS, không ghi sổ lỗi, không đụng localStorage', () => {
    const spyWord = vi.spyOn(srs, 'reviewWord')
    const spyGrammar = vi.spyOn(srs, 'reviewGrammar')
    const spyProg = vi.spyOn(progSrs, 'reviewProgCard')
    const spyMark = vi.spyOn(mistakes, 'markReviewed')
    const spySet = vi.spyOn(Storage.prototype, 'setItem')
    buildReviewQueue(
      nguon({
        englishDueWords: [W('apple')],
        englishMistakesDue: [loi('m1')],
        srsCards: { apple: the(NOW - 1000) },
      }),
      { now: NOW },
    )
    expect(spyWord).not.toHaveBeenCalled()
    expect(spyGrammar).not.toHaveBeenCalled()
    expect(spyProg).not.toHaveBeenCalled()
    expect(spyMark).not.toHaveBeenCalled()
    expect(spySet).not.toHaveBeenCalled()
  })

  it('chỉ nguồn từ vựng Anh: href tới tab Ôn SRS của cấp đang học, kèm cap', () => {
    const q = buildReviewQueue(
      nguon({ englishDueWords: [W('apple')], srsCards: { apple: the(NOW - 10) } }),
      { now: NOW, cap: 5 },
    )
    expect(q.items).toHaveLength(1)
    expect(q.items[0]!.href).toBe('/goc-hoc-tap/english/lo-trinh/a1?tab=srs&cap=5')
    expect(q.items[0]!.kind).toBe('vocab')
    expect(q.items[0]!.srsKey).toBe('apple')
  })

  it('chỉ nguồn ngữ pháp: đọc thẻ dưới namespace grammar:', () => {
    const q = buildReviewQueue(
      nguon({
        englishDueGrammarIds: ['a1-be'],
        srsCards: { 'grammar:a1-be': the(NOW - 500, 8) },
      }),
      { now: NOW },
    )
    expect(q.items[0]!.kind).toBe('grammar')
    expect(q.items[0]!.srsKey).toBe('grammar:a1-be')
    expect(q.items[0]!.difficulty).toBe(8)
  })

  it('chỉ nguồn Lập trình: href tới màn ôn của môn', () => {
    const q = buildReviewQueue(
      nguon({
        programmingDueCards: [
          { key: 'prog:p1-b1:0', lessonId: 'p1-b1', lessonTitle: 'Biến là gì', index: 0 },
        ],
        srsCards: { 'prog:p1-b1:0': the(NOW - 1) },
      }),
      { now: NOW },
    )
    expect(q.items[0]!.href).toBe('/goc-hoc-tap/programming/on-tap')
    expect(q.items[0]!.subjectId).toBe('programming')
  })

  it('chỉ nguồn STEM: href tới màn ôn của đúng môn STEM', () => {
    const q = buildReviewQueue(
      nguon({
        stemDueCards: [
          {
            key: 'stem:physics:ly10-c2-b10:0',
            subjectId: 'physics',
            lessonId: 'ly10-c2-b10',
            lessonTitle: 'Định luật II Newton',
            index: 0,
          },
        ],
        srsCards: { 'stem:physics:ly10-c2-b10:0': the(NOW - 1) },
      }),
      { now: NOW, cap: 7 },
    )
    expect(q.items[0]!.href).toBe('/goc-hoc-tap/physics/on-tap?cap=7')
    expect(q.items[0]!.evidenceSource).toBe('stem.srs')
  })

  it('gộp 4 nguồn: đếm theo môn đúng, mọi mục hợp lệ theo hợp đồng', () => {
    const q = buildReviewQueue(
      nguon({
        englishDueWords: [W('apple')],
        englishDueGrammarIds: ['a1-be'],
        programmingDueCards: [
          { key: 'prog:p1-b1:0', lessonId: 'p1-b1', lessonTitle: 'Biến', index: 0 },
        ],
        stemDueCards: [
          {
            key: 'stem:physics:ly10-c1-b1:0',
            subjectId: 'physics',
            lessonId: 'ly10-c1-b1',
            lessonTitle: 'Chuyển động',
            index: 0,
          },
        ],
        englishMistakesDue: [loi('m1')],
        srsCards: {
          apple: the(NOW - 4000),
          'grammar:a1-be': the(NOW - 3000),
          'prog:p1-b1:0': the(NOW - 2000),
          'stem:physics:ly10-c1-b1:0': the(NOW - 1000),
        },
      }),
      { now: NOW },
    )
    expect(q.totalDue).toBe(5)
    expect(q.bySubject).toEqual({ english: 3, programming: 1, physics: 1 })
    expect(ReviewQueueSchema.safeParse(q).success).toBe(true)
  })

  it('trùng mục: thẻ SRS và lỗi cùng một nội dung chỉ còn MỘT mục kind mistake', () => {
    const q = buildReviewQueue(
      nguon({
        englishDueGrammarIds: ['a1-be'],
        englishMistakesDue: [loi('a1-be')], // id lỗi trùng contentId của thẻ ngữ pháp
        srsCards: { 'grammar:a1-be': the(NOW - 100) },
      }),
      { now: NOW },
    )
    expect(q.items).toHaveLength(1)
    expect(q.totalDue).toBe(1)
    expect(q.items[0]!.kind).toBe('mistake')
  })

  it('hai THẺ KHÁC NHAU của cùng một bài đều được giữ (mỗi thẻ một lịch ôn riêng)', () => {
    const q = buildReviewQueue(
      nguon({
        stemDueCards: [
          {
            key: 'stem:physics:l1:0',
            subjectId: 'physics',
            lessonId: 'l1',
            lessonTitle: 'Bài 1',
            index: 0,
          },
          {
            key: 'stem:physics:l1:1',
            subjectId: 'physics',
            lessonId: 'l1',
            lessonTitle: 'Bài 1',
            index: 1,
          },
        ],
        srsCards: {
          'stem:physics:l1:0': the(NOW - 100),
          'stem:physics:l1:1': the(NOW - 9000),
        },
      }),
      { now: NOW },
    )
    expect(q.items).toHaveLength(2)
    // Quá hạn lâu hơn đứng trước.
    expect(q.items.map((i) => i.srsKey)).toEqual(['stem:physics:l1:1', 'stem:physics:l1:0'])
  })

  it('CÙNG một thẻ lọt vào hai lần: giữ bản đến hạn sớm hơn', () => {
    const the1 = {
      key: 'stem:physics:l1:0',
      subjectId: 'physics' as const,
      lessonId: 'l1',
      lessonTitle: 'Bài 1',
      index: 0,
    }
    const q = buildReviewQueue(
      nguon({
        stemDueCards: [the1, { ...the1 }],
        srsCards: { 'stem:physics:l1:0': the(NOW - 100) },
      }),
      { now: NOW },
    )
    expect(q.items).toHaveLength(1)
  })

  it('thứ tự: quá hạn lâu nhất trước; cùng hạn thì lỗi trước thẻ; rồi khó nhất trước', () => {
    const q = buildReviewQueue(
      nguon({
        englishDueWords: [W('cu'), W('de'), W('kho')],
        englishMistakesDue: [loi('m1', { createdAt: NOW - 5000 })],
        srsCards: {
          cu: the(NOW - 9000, 3),
          de: the(NOW - 5000, 2),
          kho: the(NOW - 5000, 9),
        },
      }),
      { now: NOW },
    )
    expect(q.items.map((i) => i.itemId)).toEqual([
      'vocab:english:cu', // quá hạn lâu nhất
      'mistake:english:m1', // cùng hạn với 2 thẻ dưới → lỗi trước
      'vocab:english:kho', // khó hơn
      'vocab:english:de',
    ])
  })

  it('lỗi đã ôn rồi thì đến hạn sau đúng giãn cách của sổ lỗi', () => {
    const daOn = NOW - REVIEW_SPACING_MS
    const q = buildReviewQueue(
      nguon({ englishMistakesDue: [loi('m1', { lastReviewedAt: daOn })] }),
      { now: NOW },
    )
    expect(q.items[0]!.dueAt).toBe(daOn + REVIEW_SPACING_MS)
  })

  it('cap: cắt items nhưng totalDue vẫn là số TRƯỚC khi cắt', () => {
    const words = Array.from({ length: 10 }, (_, i) => W(`w${i}`))
    const srsCards = Object.fromEntries(words.map((w, i) => [w.word, the(NOW - i * 10)]))
    const q = buildReviewQueue(nguon({ englishDueWords: words, srsCards }), { now: NOW, cap: 3 })
    expect(q.items).toHaveLength(3)
    expect(q.totalDue).toBe(10)
    expect(q.bySubject.english).toBe(10)
  })

  it('cap mặc định là SRS_SESSION_CAP', () => {
    const words = Array.from({ length: 40 }, (_, i) => W(`w${i}`))
    const srsCards = Object.fromEntries(words.map((w, i) => [w.word, the(NOW - i * 10)]))
    const q = buildReviewQueue(nguon({ englishDueWords: words, srsCards }), { now: NOW })
    expect(q.items).toHaveLength(SRS_SESSION_CAP)
  })

  it('thẻ không còn trong kho SRS: coi như đến hạn ngay, không ném', () => {
    const q = buildReviewQueue(nguon({ englishDueWords: [W('apple')] }), { now: NOW })
    expect(q.items[0]!.dueAt).toBe(NOW)
  })

  it('chưa biết cấp CEFR đang học: href về lộ trình, vẫn là route nội bộ', () => {
    const q = buildReviewQueue(
      nguon({
        englishLevelId: undefined,
        englishDueWords: [W('apple')],
        srsCards: { apple: the(NOW - 1) },
      }),
      { now: NOW },
    )
    expect(q.items[0]!.href).toBe('/goc-hoc-tap/english/lo-trinh')
    expect(ReviewQueueSchema.safeParse(q).success).toBe(true)
  })

  it('trạng thái nguồn được chuyển nguyên vẹn (lỗi tải KHÔNG bị hiểu thành 0 mục)', () => {
    const q = buildReviewQueue(
      nguon({ sourcesState: { ...NGUON_SAN_SANG, 'stem.srs': 'error' } }),
      { now: NOW },
    )
    expect(q.sourcesState['stem.srs']).toBe('error')
  })
})

describe('nhãn môn', () => {
  it('hai môn riêng + bốn môn STEM lấy từ bảng chung, mã lạ giữ nguyên', () => {
    expect(nhanMon('english')).toBe('Tiếng Anh')
    expect(nhanMon('programming')).toBe('Lập trình')
    expect(nhanMon('physics')).toBe('Vật lí')
    expect(nhanMon('mon-la')).toBe('mon-la')
  })
})
