import { describe, it, expect } from 'vitest'
import { computeLevelLockMap, type LevelLessons } from './levelLock.js'
import { requiredToUnlock, UNLOCK_PCT } from '@dhcb/core-learner/unlockThreshold'

/** Bậc giả có `n` bài, id dạng `p1-u1-l3`. */
const bac = (levelId: string, n: number): LevelLessons => ({
  levelId,
  lessonIds: Array.from({ length: n }, (_, i) => `${levelId}-u1-l${i + 1}`),
})

const baiDau = (level: LevelLessons, n: number) => level.lessonIds.slice(0, n)

describe('computeLevelLockMap', () => {
  const p1 = bac('p1', 100)
  const p2 = bac('p2', 10)
  const p3 = bac('p3', 10)
  const levels = [p1, p2, p3]

  it('ngưỡng dùng chung với môn Anh là 70%', () => {
    expect(UNLOCK_PCT).toBe(0.7)
    expect(requiredToUnlock(100)).toBe(70)
    expect(requiredToUnlock(10)).toBe(7)
    // Làm tròn LÊN: 3/5 = 60% chưa đủ.
    expect(requiredToUnlock(5)).toBe(4)
  })

  it('P1 luôn mở, kể cả khi chưa học gì', () => {
    const map = computeLevelLockMap({ levels, completedLessonIds: [], plan: 'free' })
    expect(map.get('p1')?.locked).toBe(false)
    expect(map.get('p2')?.locked).toBe(true)
  })

  it('Free ở 69% bài P1 → P2 vẫn khoá và còn thiếu ĐÚNG 1 bài', () => {
    const map = computeLevelLockMap({
      levels,
      completedLessonIds: baiDau(p1, 69),
      plan: 'free',
    })
    const info = map.get('p2')
    expect(info?.locked).toBe(true)
    expect(info?.requiredLevelId).toBe('p1')
    expect(info?.doneInRequired).toBe(69)
    expect(info?.neededInRequired).toBe(70)
    expect(info?.remaining).toBe(1)
  })

  it('Free ở ĐÚNG 70% bài P1 → P2 mở', () => {
    const map = computeLevelLockMap({
      levels,
      completedLessonIds: baiDau(p1, 70),
      plan: 'free',
    })
    expect(map.get('p2')?.locked).toBe(false)
    // Nhưng P3 thì chưa — chưa học bài nào của P2.
    expect(map.get('p3')?.locked).toBe(true)
    expect(map.get('p3')?.requiredLevelId).toBe('p2')
  })

  it('bậc bị khoá dây chuyền vẫn chỉ ra ĐÚNG bậc đang chặn', () => {
    const map = computeLevelLockMap({ levels, completedLessonIds: [], plan: 'free' })
    expect(map.get('p3')?.requiredLevelId).toBe('p1')
    expect(map.get('p3')?.remaining).toBe(70)
  })

  it('VIP chưa học gì → mọi bậc đều mở', () => {
    const map = computeLevelLockMap({ levels, completedLessonIds: [], plan: 'vip' })
    for (const l of levels) expect(map.get(l.levelId)?.locked).toBe(false)
  })

  it('grandfather: bậc đã từng vào thì không bị khoá lại', () => {
    const map = computeLevelLockMap({
      levels,
      completedLessonIds: [],
      plan: 'free',
      everUnlocked: ['p3'],
    })
    expect(map.get('p3')?.locked).toBe(false)
    // Không "mở lây" sang bậc chưa từng vào.
    expect(map.get('p2')?.locked).toBe(true)
  })

  it('BẤT BIẾN: bậc RỖNG (chưa soạn bài nào) không khoá bậc sau', () => {
    const map = computeLevelLockMap({
      levels: [p1, bac('p2', 0), p3],
      completedLessonIds: baiDau(p1, 70),
      plan: 'free',
    })
    expect(map.get('p2')?.locked).toBe(false)
    expect(map.get('p3')?.locked).toBe(false)
  })

  it('bậc rỗng nằm sau một bậc đang khoá thì vẫn khoá (không thành cửa sau)', () => {
    const map = computeLevelLockMap({
      levels: [p1, bac('p2', 0), p3],
      completedLessonIds: [],
      plan: 'free',
    })
    expect(map.get('p2')?.locked).toBe(true)
    expect(map.get('p3')?.locked).toBe(true)
  })

  it('danh sách bậc rỗng → map rỗng, không ném', () => {
    expect(computeLevelLockMap({ levels: [], completedLessonIds: [], plan: 'free' }).size).toBe(0)
  })

  it('THUẦN: không sửa dữ liệu đầu vào', () => {
    const completed = baiDau(p1, 70)
    const snapshot = [...completed]
    computeLevelLockMap({ levels, completedLessonIds: completed, plan: 'free' })
    expect(completed).toEqual(snapshot)
    expect(p1.lessonIds).toHaveLength(100)
  })
})
