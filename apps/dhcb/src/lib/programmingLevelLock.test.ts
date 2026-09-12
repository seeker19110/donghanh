// Cổng cho tầng PERSIST của luật khoá bậc môn Lập trình (GĐ3).
// Luật thuần đã có test riêng ở packages/subject-programming/levelLock.test.ts; ở đây kiểm
// đúng phần file này chịu trách nhiệm: ráp dữ liệu bậc thật, và nhớ quyền đã có (grandfather).
import { describe, it, expect, beforeEach } from 'vitest'
import { PROGRAMMING_LEVELS } from '@dhcb/subject-programming/curriculum'
import {
  buildLevelLessons,
  getLevelsEntered,
  markLevelEntered,
  seedGrandfather,
  levelLockMap,
  loiGiaiThichKhoa,
} from './programmingLevelLock'
import type { ProgrammingLessonProgress } from './programmingProgress'

const UID = 'u-test'

const xong = (lessonId: string): ProgrammingLessonProgress => ({
  lessonId,
  status: 'completed',
  completedAt: 1,
})

beforeEach(() => {
  localStorage.clear()
})

describe('buildLevelLessons', () => {
  it('chỉ gồm XƯƠNG SỐNG P1→P6, đúng thứ tự — không có hướng chuyên sâu/khoá ngắn/lộ trình', () => {
    const levels = buildLevelLessons()
    expect(levels.map((l) => l.levelId)).toEqual(PROGRAMMING_LEVELS.map((l) => l.id))
    // Mọi id bài đều mang tiền tố bậc `p<n>-` → khoá ngắn (`git-…`, `hermes-…`) và chặng hướng
    // chuyên sâu (`web-s2-…`) không lọt vào mẫu số của luật khoá.
    for (const level of levels) {
      for (const id of level.lessonIds) expect(id.startsWith(`${level.levelId}-`)).toBe(true)
    }
  })
})

describe('grandfather', () => {
  it('người học CŨ có tiến độ ở P3 thì P3 được giữ mở sau khi luật ra đời', () => {
    const baiP3 = buildLevelLessons().find((l) => l.levelId === 'p3')?.lessonIds[0]
    expect(baiP3).toBeTruthy()
    seedGrandfather(UID, [xong(baiP3 as string)])
    expect(getLevelsEntered(UID).has('p3')).toBe(true)
    expect(levelLockMap(UID, [xong(baiP3 as string)], 'free').get('p3')?.locked).toBe(false)
  })

  it('tiến độ RỖNG không ghi gì — không "đóng băng" nhầm lúc mạng chưa trả lời', () => {
    seedGrandfather(UID, [])
    expect(getLevelsEntered(UID).size).toBe(0)
  })

  it('markLevelEntered cộng dồn và lũy đẳng', () => {
    markLevelEntered(UID, 'p2')
    markLevelEntered(UID, 'p2')
    markLevelEntered(UID, 'p4')
    expect([...getLevelsEntered(UID)].sort()).toEqual(['p2', 'p4'])
  })
})

describe('levelLockMap', () => {
  it('Free chưa học gì: P1 mở, P2 khoá kèm câu giải thích có số bài còn thiếu', () => {
    const map = levelLockMap(UID, [], 'free')
    expect(map.get('p1')?.locked).toBe(false)
    const p2 = map.get('p2')
    expect(p2?.locked).toBe(true)
    expect(p2?.requiredLevelId).toBe('p1')
    expect(loiGiaiThichKhoa(p2!)).toContain(`Còn ${p2!.remaining} bài ở P1`)
  })

  it('VIP mở hết', () => {
    const map = levelLockMap(UID, [], 'vip')
    for (const level of PROGRAMMING_LEVELS) expect(map.get(level.id)?.locked).toBe(false)
  })

  it('chưa đăng nhập (không uid) vẫn tính được, không ném', () => {
    expect(levelLockMap(undefined, [], 'free').get('p1')?.locked).toBe(false)
  })
})
