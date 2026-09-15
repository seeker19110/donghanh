// guestProgress.test.ts — Tiến độ khách và đường nó chuyển sang tài khoản thật.
//
// Bất biến canh ở đây (đặc tả §⑤):
//   - Khách KHÔNG BAO GIỜ gửi tiến độ lên server trước khi đăng nhập.
//   - Hợp nhất chỉ TĂNG: tiến độ sẵn có của tài khoản không bao giờ bị bản của khách ghi đè mất.
//   - Luật khoá bậc/cấp của khách dùng ĐÚNG hàm thuần như người đã đăng nhập, không lỏng hơn.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computeLevelLockMap } from '@dhcb/subject-programming/levelLock'

const pushProgressAsync = vi.fn()
const saveLessonProgress = vi.fn()
vi.mock('./progressSync', () => ({ pushProgressAsync }))
vi.mock('./programmingProgress', () => ({ saveLessonProgress }))

const {
  mergeGuestProgressInto,
  hasGuestProgress,
  clearGuestKeys,
  mergeLessonProgress,
  getGuestId,
} = await import('./guestProgress')

beforeEach(() => {
  localStorage.clear()
  pushProgressAsync.mockReset().mockResolvedValue(undefined)
  saveLessonProgress.mockReset().mockResolvedValue(undefined)
})

describe('danh tính khách', () => {
  it('ổn định trong cùng một trình duyệt', () => {
    expect(getGuestId()).toBe(getGuestId())
    expect(getGuestId()).toMatch(/^guest_/)
  })
})

describe('hasGuestProgress', () => {
  it('chưa học gì → false', () => {
    expect(hasGuestProgress(getGuestId())).toBe(false)
  })

  it('khoá tồn tại nhưng RỖNG vẫn là chưa học gì', () => {
    localStorage.setItem(`et_learned_${getGuestId()}`, '[]')
    expect(hasGuestProgress(getGuestId())).toBe(false)
  })

  it('có từ đã thuộc → true', () => {
    localStorage.setItem(`et_learned_${getGuestId()}`, JSON.stringify(['cat']))
    expect(hasGuestProgress(getGuestId())).toBe(true)
  })

  it('uid KHÔNG phải khách → false (không nhầm tài khoản thật thành khách)', () => {
    localStorage.setItem('et_learned_u-1', JSON.stringify(['cat']))
    expect(hasGuestProgress('u-1')).toBe(false)
  })
})

describe('mergeGuestProgressInto', () => {
  it('hợp (union) từ đã thuộc — KHÔNG mất từ tài khoản đã có sẵn', async () => {
    const guest = getGuestId()
    localStorage.setItem(`et_learned_${guest}`, JSON.stringify(['cat', 'dog']))
    localStorage.setItem('et_learned_u-1', JSON.stringify(['bird', 'cat']))

    expect(await mergeGuestProgressInto('u-1')).toBe(true)

    const merged = JSON.parse(localStorage.getItem('et_learned_u-1') ?? '[]') as string[]
    expect([...merged].sort()).toEqual(['bird', 'cat', 'dog'])
  })

  it('đẩy lên server đúng MỘT lần, bằng uid thật', async () => {
    localStorage.setItem(`et_cefr_grammar_${getGuestId()}`, JSON.stringify(['a1-u1-l1']))
    await mergeGuestProgressInto('u-1')
    expect(pushProgressAsync).toHaveBeenCalledExactlyOnceWith('u-1')
  })

  it('xoá sạch dấu vết khách sau khi hợp nhất', async () => {
    const guest = getGuestId()
    localStorage.setItem(`et_learned_${guest}`, JSON.stringify(['cat']))
    localStorage.setItem(`et_usage_${guest}_2026-09-15`, '3')
    await mergeGuestProgressInto('u-1')
    expect(localStorage.getItem(`et_learned_${guest}`)).toBeNull()
    expect(localStorage.getItem(`et_usage_${guest}_2026-09-15`)).toBeNull()
  })

  it('gọi lần hai là no-op — không đẩy server thêm lần nữa', async () => {
    localStorage.setItem(`et_learned_${getGuestId()}`, JSON.stringify(['cat']))
    await mergeGuestProgressInto('u-1')
    pushProgressAsync.mockClear()
    expect(await mergeGuestProgressInto('u-1')).toBe(false)
    expect(pushProgressAsync).not.toHaveBeenCalled()
  })

  it('khách chưa học gì → không đụng gì tới server', async () => {
    expect(await mergeGuestProgressInto('u-1')).toBe(false)
    expect(pushProgressAsync).not.toHaveBeenCalled()
  })

  it('từ chối uid đích là id khách (không tự hợp nhất vào chính mình)', async () => {
    localStorage.setItem(`et_learned_${getGuestId()}`, JSON.stringify(['cat']))
    expect(await mergeGuestProgressInto(getGuestId())).toBe(false)
    expect(pushProgressAsync).not.toHaveBeenCalled()
  })

  it('SRS: thẻ đã ôn của TÀI KHOẢN thắng, thẻ chỉ khách có thì được thêm vào', async () => {
    const guest = getGuestId()
    localStorage.setItem(`srs_${guest}`, JSON.stringify({ cat: { reps: 1 }, dog: { reps: 5 } }))
    localStorage.setItem('srs_u-1', JSON.stringify({ cat: { reps: 9 } }))
    await mergeGuestProgressInto('u-1')
    const srs = JSON.parse(localStorage.getItem('srs_u-1') ?? '{}') as Record<
      string,
      { reps: number }
    >
    expect(srs.cat.reps).toBe(9)
    expect(srs.dog.reps).toBe(5)
  })

  it('bài Lập trình đã xong của khách được đẩy lên server môn đó', async () => {
    localStorage.setItem(
      `dhcb_prog_progress_${getGuestId()}`,
      JSON.stringify([{ lessonId: 'p1-u1-l1', status: 'completed', completedAt: 1 }]),
    )
    await mergeGuestProgressInto('u-1')
    expect(saveLessonProgress).toHaveBeenCalledExactlyOnceWith('u-1', 'p1-u1-l1', 'completed')
  })
})

describe('mergeLessonProgress', () => {
  it('completed KHÔNG bị kéo lùi về in_progress', () => {
    const out = mergeLessonProgress(
      [{ lessonId: 'l1', status: 'completed', completedAt: 10 }],
      [{ lessonId: 'l1', status: 'in_progress', completedAt: null }],
    )
    expect(out).toEqual([{ lessonId: 'l1', status: 'completed', completedAt: 10 }])
  })

  it('in_progress được nâng lên completed', () => {
    const out = mergeLessonProgress(
      [{ lessonId: 'l1', status: 'in_progress', completedAt: null }],
      [{ lessonId: 'l1', status: 'completed', completedAt: 20 }],
    )
    expect(out[0]).toEqual({ lessonId: 'l1', status: 'completed', completedAt: 20 })
  })

  it('bài chỉ có ở một bên vẫn được giữ', () => {
    const out = mergeLessonProgress(
      [{ lessonId: 'l1', status: 'completed', completedAt: 1 }],
      [{ lessonId: 'l2', status: 'completed', completedAt: 2 }],
    )
    expect(out.map((r) => r.lessonId).sort()).toEqual(['l1', 'l2'])
  })
})

describe('clearGuestKeys', () => {
  it('không đụng tới khoá của uid khác', () => {
    const guest = getGuestId()
    localStorage.setItem(`et_learned_${guest}`, '["a"]')
    localStorage.setItem('et_learned_u-1', '["b"]')
    clearGuestKeys(guest)
    expect(localStorage.getItem(`et_learned_${guest}`)).toBeNull()
    expect(localStorage.getItem('et_learned_u-1')).toBe('["b"]')
  })
})

// ── Luật khoá bậc: khách dùng ĐÚNG hàm thuần, chỉ khác nguồn tiến độ ─────────────
describe('khoá bậc với tiến độ localStorage của khách', () => {
  const levels = [
    { levelId: 'p1', lessonIds: ['a', 'b', 'c', 'd'] },
    { levelId: 'p2', lessonIds: ['e', 'f'] },
  ]

  it('khách mới: P1 mở, P2 KHOÁ (không lỏng hơn người đã đăng nhập)', () => {
    const map = computeLevelLockMap({
      levels,
      completedLessonIds: [],
      plan: 'free',
      everUnlocked: null,
    })
    expect(map.get('p1')?.locked).toBe(false)
    expect(map.get('p2')?.locked).toBe(true)
  })

  it('khách học chưa đủ ngưỡng ở P1 → P2 vẫn khoá', () => {
    const map = computeLevelLockMap({
      levels,
      completedLessonIds: ['a', 'b'], // 2/4 = 50% < 70%
      plan: 'free',
      everUnlocked: null,
    })
    expect(map.get('p2')?.locked).toBe(true)
  })

  it('khách học đủ ngưỡng → P2 mở, đúng như tài khoản thật', () => {
    const map = computeLevelLockMap({
      levels,
      completedLessonIds: ['a', 'b', 'c'], // 3/4 = 75% ≥ 70%
      plan: 'free',
      everUnlocked: null,
    })
    expect(map.get('p2')?.locked).toBe(false)
  })
})
