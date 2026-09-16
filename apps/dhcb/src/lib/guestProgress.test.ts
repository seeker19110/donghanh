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

// ── Nháp phiên học đi theo NGƯỜI, không đi theo danh tính khách (đặc tả S08-1 AC-10) ──
describe('nháp phiên học khi khách đăng nhập', () => {
  const FP = 'v-abc'

  function nhapKey(ownerKind: string, ownerId: string): string {
    return `dhcb_lsession_v1_${ownerKind}:${ownerId}_programming_p1-u4-l1`
  }

  function ghiNhap(
    ownerKind: 'guest' | 'account',
    ownerId: string,
    code: string,
    updatedAt: number,
  ) {
    localStorage.setItem(
      nhapKey(ownerKind, ownerId),
      JSON.stringify({
        version: 1,
        subjectId: 'programming',
        contentId: 'p1-u4-l1',
        contentVersion: FP,
        owner: { kind: ownerKind, id: ownerId },
        stepIndex: 4,
        draft: { code },
        startedAt: updatedAt,
        updatedAt,
      }),
    )
  }

  it('dời nháp của khách sang tài khoản và xoá khoá khách', async () => {
    const guestId = getGuestId()
    ghiNhap('guest', guestId, 'code-cua-khach', Date.now())
    await mergeGuestProgressInto('u-1')
    expect(localStorage.getItem(nhapKey('guest', guestId))).toBeNull()
    const moved = JSON.parse(localStorage.getItem(nhapKey('account', 'u-1')) ?? '{}')
    expect(moved.draft).toEqual({ code: 'code-cua-khach' })
    expect(moved.owner).toEqual({ kind: 'account', id: 'u-1' })
  })

  it('tài khoản đã có nháp mới hơn → giữ bản của tài khoản', async () => {
    const guestId = getGuestId()
    const now = Date.now()
    ghiNhap('guest', guestId, 'cu-hon', now - 10_000)
    ghiNhap('account', 'u-1', 'moi-hon', now)
    await mergeGuestProgressInto('u-1')
    const kept = JSON.parse(localStorage.getItem(nhapKey('account', 'u-1')) ?? '{}')
    expect(kept.draft).toEqual({ code: 'moi-hon' })
    expect(localStorage.getItem(nhapKey('guest', guestId))).toBeNull()
  })

  it('clearGuestKeys dọn sạch khoá nháp của khách — đăng xuất không lộ', () => {
    const guestId = getGuestId()
    ghiNhap('guest', guestId, 'rieng-tu', Date.now())
    localStorage.setItem('et_learned_u-1', '["hello"]')
    clearGuestKeys(guestId)
    expect(localStorage.getItem(nhapKey('guest', guestId))).toBeNull()
    expect(localStorage.getItem('et_learned_u-1')).toBe('["hello"]')
  })
})

// ── Ý ĐỊNH HỌC của khách (slice S05, §③.4) ─────────────────────────────────
const INTENT = {
  schemaVersion: 1,
  subjectIds: ['programming'],
  purpose: 'so_thich',
  createdAt: 1_700_000_000_000,
  updatedAt: 1_700_000_000_000,
}

function mockFetchIntent(server: unknown, onPut?: (body: unknown) => void) {
  return vi.fn(async (url: string, init?: RequestInit) => {
    if (String(url).includes('/api/learner-intent')) {
      if (init?.method === 'PUT') {
        onPut?.(JSON.parse(String(init.body)))
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      }
      return new Response(JSON.stringify({ intent: server }), { status: 200 })
    }
    return new Response('{}', { status: 200 })
  })
}

describe('hợp nhất Ý ĐỊNH của khách', () => {
  it('khách MỚI chỉ trả lời ý định cũng tính là có tiến độ (quyết định Q4)', () => {
    localStorage.setItem(`dhcb_intent_${getGuestId()}`, JSON.stringify(INTENT))
    expect(hasGuestProgress(getGuestId())).toBe(true)
  })

  it('tài khoản CHƯA có ý định → đẩy bản của khách lên server, giữ createdAt của khách', async () => {
    const guest = getGuestId()
    localStorage.setItem(`dhcb_intent_${guest}`, JSON.stringify(INTENT))
    let sent: unknown = null
    vi.stubGlobal(
      'fetch',
      mockFetchIntent(null, (b) => (sent = b)),
    )

    await mergeGuestProgressInto('u-1')

    expect((sent as { intent: { createdAt: number } }).intent.createdAt).toBe(INTENT.createdAt)
    expect(localStorage.getItem(`dhcb_intent_${guest}`)).toBeNull()
    expect(JSON.parse(localStorage.getItem('dhcb_intent_u-1') ?? 'null')).toMatchObject({
      subjectIds: ['programming'],
    })
    vi.unstubAllGlobals()
  })

  it('tài khoản ĐÃ có ý định → giữ bản server, KHÔNG PUT, xoá bản khách', async () => {
    const guest = getGuestId()
    localStorage.setItem(`dhcb_intent_${guest}`, JSON.stringify(INTENT))
    const server = { ...INTENT, subjectIds: ['english'] }
    const f = mockFetchIntent(server)
    vi.stubGlobal('fetch', f)

    await mergeGuestProgressInto('u-2')

    const puts = f.mock.calls.filter((c) => (c[1] as RequestInit | undefined)?.method === 'PUT')
    expect(puts).toHaveLength(0)
    expect(JSON.parse(localStorage.getItem('dhcb_intent_u-2') ?? 'null')).toMatchObject({
      subjectIds: ['english'],
    })
    expect(localStorage.getItem(`dhcb_intent_${guest}`)).toBeNull()
    vi.unstubAllGlobals()
  })

  it('gọi lần hai là no-op (không PUT thêm lần nào)', async () => {
    localStorage.setItem(`dhcb_intent_${getGuestId()}`, JSON.stringify(INTENT))
    const f = mockFetchIntent(null)
    vi.stubGlobal('fetch', f)

    await mergeGuestProgressInto('u-3')
    const soLanDau = f.mock.calls.length
    await mergeGuestProgressInto('u-3')
    expect(f.mock.calls.length).toBe(soLanDau)
    vi.unstubAllGlobals()
  })
})

// ——— [S11-2] Bằng chứng hoàn thành bài STEM của khách ———
//
// Bất biến: khách KHÔNG gửi gì lên server trước khi đăng nhập; lúc đăng nhập thì thứ được gửi là
// TRẢ LỜI THÔ (server chấm lại), không phải cờ `passed` nằm trong localStorage của khách.
describe('evidence STEM của khách', () => {
  const NHAT_KY = 'dhcb_evidence_'
  const TRANG_THAI = 'dhcb_evidence_state_'
  const HANG_DOI = 'dhcb_evidence_pending_'

  function banGhiKhach(guest: string) {
    return [
      {
        input: {
          schemaVersion: 1,
          subjectId: 'physics',
          contentId: 'ly10-c2-b10',
          activityKind: 'stem_lesson_check',
          attemptId: 'attempt-0123456789abcd',
          clientAt: '2026-09-16T00:00:00.000Z',
          answers: [{ questionIndex: 0, raw: 'a' }],
        },
        evidence: {
          schemaVersion: 1,
          subjectId: 'physics',
          contentId: 'ly10-c2-b10',
          activityKind: 'stem_lesson_check',
          attemptId: 'attempt-0123456789abcd',
          clientAt: '2026-09-16T00:00:00.000Z',
          ownerId: guest,
          evidenceKind: 'local_graded',
          // Khách tự sửa localStorage thành "đúng hết" — merge KHÔNG được tin con số này.
          correct: 99,
          total: 1,
          ratio: 1,
          passed: true,
          items: [],
        },
      },
    ]
  }

  it('chỉ có evidence STEM cũng tính là khách đã học (hasGuestProgress)', () => {
    const guest = getGuestId()
    localStorage.setItem(NHAT_KY + guest, JSON.stringify(banGhiKhach(guest)))
    expect(hasGuestProgress(guest)).toBe(true)
  })

  it('clearGuestKeys xoá cả ba khoá evidence — khách sau không kế thừa của khách trước', () => {
    const guest = getGuestId()
    localStorage.setItem(NHAT_KY + guest, JSON.stringify(banGhiKhach(guest)))
    localStorage.setItem(TRANG_THAI + guest, JSON.stringify({ 'physics:ly10-c2-b10': {} }))
    localStorage.setItem(HANG_DOI + guest, JSON.stringify([]))

    clearGuestKeys(guest)

    expect(localStorage.getItem(NHAT_KY + guest)).toBeNull()
    expect(localStorage.getItem(TRANG_THAI + guest)).toBeNull()
    expect(localStorage.getItem(HANG_DOI + guest)).toBeNull()
  })

  it('đăng nhập → đẩy TRẢ LỜI THÔ lên server, server là người chấm', async () => {
    const guest = getGuestId()
    localStorage.setItem(NHAT_KY + guest, JSON.stringify(banGhiKhach(guest)))
    const f = vi.fn(async (url: string) =>
      url.startsWith('/api/learning/evidence')
        ? new Response(
            JSON.stringify({
              schemaVersion: 1,
              subjectId: 'physics',
              contentId: 'ly10-c2-b10',
              activityKind: 'stem_lesson_check',
              attemptId: 'attempt-0123456789abcd',
              clientAt: '2026-09-16T00:00:00.000Z',
              ownerId: 'u-9',
              evidenceKind: 'server_graded',
              correct: 0,
              total: 1,
              ratio: 0,
              passed: false,
              serverAt: '2026-09-16T00:00:01.000Z',
              items: [],
            }),
            { status: 200, headers: { 'content-type': 'application/json' } },
          )
        : new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } }),
    )
    vi.stubGlobal('fetch', f)

    expect(await mergeGuestProgressInto('u-9')).toBe(true)

    const goi = f.mock.calls.filter((c) => String(c[0]).startsWith('/api/learning/evidence'))
    expect(goi).toHaveLength(1)
    const body = JSON.parse(String((goi[0]![1] as RequestInit).body)) as Record<string, unknown>
    expect(body).not.toHaveProperty('passed')
    expect(body).not.toHaveProperty('correct')
    expect(body.answers).toEqual([{ questionIndex: 0, raw: 'a' }])
    // Trạng thái của TÀI KHOẢN lấy từ phản hồi server (0/1, chưa đạt), không phải 99/1 của khách.
    const state = JSON.parse(localStorage.getItem(`${TRANG_THAI}u-9`) ?? '{}') as Record<
      string,
      { status: string; source: string }
    >
    expect(state['physics:ly10-c2-b10']).toMatchObject({ status: 'in_progress', source: 'server' })
    expect(localStorage.getItem(NHAT_KY + guest)).toBeNull()
    vi.unstubAllGlobals()
  })

  it('server lỗi lúc đẩy evidence KHÔNG chặn phần còn lại của việc hợp nhất', async () => {
    const guest = getGuestId()
    localStorage.setItem(NHAT_KY + guest, JSON.stringify(banGhiKhach(guest)))
    localStorage.setItem(`et_learned_${guest}`, JSON.stringify(['cat']))
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )

    expect(await mergeGuestProgressInto('u-10')).toBe(true)

    expect(JSON.parse(localStorage.getItem('et_learned_u-10') ?? '[]')).toEqual(['cat'])
    expect(pushProgressAsync).toHaveBeenCalledWith('u-10')
    vi.unstubAllGlobals()
  })
})
