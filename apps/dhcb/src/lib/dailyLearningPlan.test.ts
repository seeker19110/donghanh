import { describe, expect, it } from 'vitest'
import { buildDailyLearningPlan } from './dailyLearningPlan'

describe('buildDailyLearningPlan', () => {
  it('ưu tiên SRS khi có thẻ đến hạn rồi mới tiếp tục bài đang học', () => {
    const plan = buildDailyLearningPlan({
      srsDueCount: 12,
      dailyLearned: 3,
      dailyMax: 10,
      continueLessonLabel: 'Travel basics',
    })

    expect(plan.map((x) => x.kind)).toEqual(['srs_review', 'continue_learning'])
    expect(plan[0]?.estimatedMinutes).toBeGreaterThan(0)
  })

  it('ưu tiên tiếp tục bài khi không có SRS đến hạn', () => {
    const plan = buildDailyLearningPlan({
      srsDueCount: 0,
      dailyLearned: 0,
      dailyMax: 10,
      continueLessonLabel: 'A1 · Gia đình',
    })

    expect(plan[0]?.kind).toBe('continue_learning')
    expect(plan[1]?.kind).toBe('discover_path')
  })

  it('trả một bước khám phá an toàn khi chưa có tín hiệu học', () => {
    const plan = buildDailyLearningPlan({
      srsDueCount: -5,
      dailyLearned: 100,
      dailyMax: 20,
    })

    expect(plan).toHaveLength(1)
    expect(plan[0]?.kind).toBe('discover_path')
  })

  it('không tạo estimated time mất kiểm soát khi backlog SRS rất lớn', () => {
    const plan = buildDailyLearningPlan({
      srsDueCount: 500,
      dailyLearned: 0,
      dailyMax: 20,
      continueLessonLabel: 'A2 · Food',
    })

    expect(plan[0]?.kind).toBe('srs_review')
    expect(plan[0]?.estimatedMinutes).toBeLessThanOrEqual(12)
  })
})
