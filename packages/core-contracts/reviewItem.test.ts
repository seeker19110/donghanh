import { describe, it, expect } from 'vitest'
import {
  ReviewItemSchema,
  ReviewQueueSchema,
  REVIEW_EVIDENCE_SOURCES,
  reviewItemId,
  type ReviewItem,
  type ReviewQueue,
} from './reviewItem.js'

const MUC: ReviewItem = {
  itemId: 'vocab:english:apple',
  subjectId: 'english',
  contentId: 'apple',
  kind: 'vocab',
  dueAt: 1_760_000_000_000,
  evidenceSource: 'english.srs',
  href: '/lo-trinh-hoc/a1?tab=srs&cap=30',
  title: 'apple',
  srsKey: 'apple',
  difficulty: 5.1,
}

const HANG_DOI: ReviewQueue = {
  items: [MUC],
  totalDue: 1,
  cap: 30,
  bySubject: { english: 1 },
  builtAt: 1_760_000_000_000,
  sourcesState: {
    'english.srs': 'ready',
    'programming.srs': 'ready',
    'stem.srs': 'unavailable',
    'english.mistakes': 'ready',
    'learning.evidence': 'unavailable',
  },
}

describe('ReviewItemSchema', () => {
  it('nhận một mục hợp lệ', () => {
    expect(ReviewItemSchema.parse(MUC)).toEqual(MUC)
  })

  it('href phải là route NỘI BỘ (bắt đầu bằng "/", không phải URL ngoài)', () => {
    for (const href of ['https://vidu.com/on-tap', 'lo-trinh-hoc/a1', '//vidu.com/x', '']) {
      expect(ReviewItemSchema.safeParse({ ...MUC, href }).success).toBe(false)
    }
    expect(ReviewItemSchema.safeParse({ ...MUC, href: '/lap-trinh/on-tap' }).success).toBe(true)
  })

  it('dueAt phải là số hữu hạn', () => {
    for (const dueAt of [Number.NaN, Number.POSITIVE_INFINITY, '123']) {
      expect(ReviewItemSchema.safeParse({ ...MUC, dueAt }).success).toBe(false)
    }
  })

  it('có courseId thì href phải mang ?khoa= đúng khoá đó (luật S07)', () => {
    const thieu = { ...MUC, subjectId: 'programming', courseId: 'k1', href: '/lap-trinh/on-tap' }
    expect(ReviewItemSchema.safeParse(thieu).success).toBe(false)
    const du = { ...thieu, href: '/lap-trinh/on-tap?khoa=k1' }
    expect(ReviewItemSchema.safeParse(du).success).toBe(true)
    // ?khoa= của khoá KHÁC cũng là sai — không được dẫn người học ra ngoài khoá đang theo.
    expect(ReviewItemSchema.safeParse({ ...thieu, href: '/x?khoa=k2' }).success).toBe(false)
  })

  it('evidenceSource phải nằm trong allowlist', () => {
    for (const nguon of REVIEW_EVIDENCE_SOURCES) {
      expect(ReviewItemSchema.safeParse({ ...MUC, evidenceSource: nguon }).success).toBe(true)
    }
    expect(ReviewItemSchema.safeParse({ ...MUC, evidenceSource: 'ai.guess' }).success).toBe(false)
  })

  it('kind "mistake" bắt buộc có mistakeId', () => {
    const thieu = { ...MUC, kind: 'mistake' as const, evidenceSource: 'english.mistakes' as const }
    expect(ReviewItemSchema.safeParse(thieu).success).toBe(false)
    expect(ReviewItemSchema.safeParse({ ...thieu, mistakeId: 'm1' }).success).toBe(true)
  })

  it('thiếu trường bắt buộc thì trượt, không ném', () => {
    const thieuTieuDe: Record<string, unknown> = { ...MUC }
    delete thieuTieuDe.title
    expect(ReviewItemSchema.safeParse(thieuTieuDe).success).toBe(false)
  })
})

describe('ReviewQueueSchema', () => {
  it('nhận một hàng đợi hợp lệ', () => {
    expect(ReviewQueueSchema.parse(HANG_DOI).totalDue).toBe(1)
  })

  it('cap phải dương và totalDue không âm', () => {
    expect(ReviewQueueSchema.safeParse({ ...HANG_DOI, cap: 0 }).success).toBe(false)
    expect(ReviewQueueSchema.safeParse({ ...HANG_DOI, totalDue: -1 }).success).toBe(false)
  })

  it('thiếu một nguồn trong sourcesState là hợp đồng hỏng', () => {
    const thieu: Record<string, unknown> = { ...HANG_DOI.sourcesState }
    delete thieu['stem.srs']
    expect(ReviewQueueSchema.safeParse({ ...HANG_DOI, sourcesState: thieu }).success).toBe(false)
  })
})

describe('reviewItemId', () => {
  it('dựng khoá duy nhất theo khuôn, có và không có chỉ số thẻ', () => {
    expect(reviewItemId('vocab', 'english', 'apple')).toBe('vocab:english:apple')
    expect(reviewItemId('card', 'physics', 'ly10-c2-b10', 0)).toBe('card:physics:ly10-c2-b10:0')
  })
})
