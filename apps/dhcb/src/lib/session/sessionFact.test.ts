import { describe, expect, it } from 'vitest'
import { buildSessionFact, type SessionOutcome } from './sessionFact'

const base: SessionOutcome = {
  subjectId: 'english',
  contentId: 'l1',
  kind: 'lesson',
  steps: 5,
  durationSec: 60,
}

const KINDS: SessionOutcome['kind'][] = [
  'lesson',
  'quiz',
  'speaking',
  'writing',
  'review',
  'project-step',
]

describe('buildSessionFact', () => {
  // AC-1: bảng ≥ 12 ca (6 kind × có/không newItems)
  const cases: [string, SessionOutcome][] = []
  for (const kind of KINDS) {
    cases.push([
      `${kind} không newItems`,
      { ...base, kind, correct: 4, total: 5, newItems: undefined },
    ])
    cases.push([
      `${kind} có newItems`,
      { ...base, kind, correct: 4, total: 5, newItems: ['apple', 'banana'] },
    ])
  }

  it.each(cases)('%s: lead có số, không % / band / trình độ / "Tuyệt vời!" trơ', (_, outcome) => {
    const fact = buildSessionFact(outcome)
    expect(fact.lead).toMatch(/\d/)
    expect(fact.lead).not.toMatch(/%|band|trình độ|Tuyệt vời!$/)
  })

  it('detail chỉ có khi có newItems', () => {
    expect(buildSessionFact({ ...base, newItems: undefined }).detail).toBeUndefined()
    expect(buildSessionFact({ ...base, newItems: [] }).detail).toBeUndefined()
    expect(buildSessionFact({ ...base, newItems: ['xin chào'] }).detail).toContain('xin chào')
  })

  it('detail nêu đúng số mục khi nhiều hơn 1 newItem', () => {
    const fact = buildSessionFact({ ...base, newItems: ['a', 'b', 'c'] })
    expect(fact.detail).toContain('a')
    expect(fact.detail).toContain('2 mục khác')
  })

  it('quiz/review dùng đúng số câu đúng/tổng khi có correct+total', () => {
    const fact = buildSessionFact({ ...base, kind: 'quiz', correct: 3, total: 5 })
    expect(fact.lead).toContain('3/5')
  })

  it('lesson không có correct/total vẫn đếm được số thẻ', () => {
    const fact = buildSessionFact({ ...base, kind: 'lesson', steps: 7 })
    expect(fact.lead).toContain('7')
  })
})
