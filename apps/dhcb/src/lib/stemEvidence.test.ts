// stemEvidence.test.ts — Bằng chứng hoàn thành bài STEM phía client (slice S11-2).
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md AC-9…AC-13.
//
// Bất biến canh ở đây:
//   - Khách KHÔNG gọi server; bản ghi của khách nói rõ nó là `local_graded`.
//   - Tài khoản: con số hiện ra là con số SERVER trả về, không phải con số chấm ở máy.
//   - Gửi hỏng thì bài làm KHÔNG mất: vào hàng đợi cùng thiết bị, gửi lại giữ nguyên `attemptId`.
//   - 400 thì BỎ khỏi hàng đợi (gửi lại cũng vẫn sai); 401 thì GIỮ (đăng nhập lại là cứu được).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { StemLessonLike } from '@dhcb/core-learner/stemEvidenceGrader'
import {
  submitStemEvidence,
  flushPendingEvidence,
  fetchCompletionState,
  pushGuestEvidence,
  readPendingEvidence,
  readEvidenceLog,
  hasPendingEvidence,
  mergeCompletionState,
  newAttemptId,
  MAX_PENDING_EVIDENCE,
  EVIDENCE_PENDING_PREFIX,
  EVIDENCE_STATE_PREFIX,
} from './stemEvidence'
import type { CompletionEvidence } from '@dhcb/core-contracts/completionEvidence'

/** Bài giả 2 câu trắc nghiệm — vừa đủ để `gradeStemEvidence` chạy thật (không mock engine chấm). */
const BAI: StemLessonLike = {
  checkQuestions: [
    { answer: { kind: 'choice', correctIds: ['a'] } },
    { answer: { kind: 'choice', correctIds: ['b'] } },
  ],
}

const KHACH = 'guest_abc-123'
const NGUOI = 'u-42'

function nop(uid: string, dapAn: readonly string[]) {
  return submitStemEvidence(
    uid,
    {
      subjectId: 'physics',
      contentId: 'ly10-c2-b10',
      activityKind: 'stem_lesson_check',
      answers: dapAn.map((raw, questionIndex) => ({ questionIndex, raw })),
    },
    BAI,
  )
}

/** Phản hồi server hợp lệ — cố ý cho con số KHÁC bản chấm ở máy để biết UI tin bên nào. */
function serverTra(over: Partial<CompletionEvidence> = {}): CompletionEvidence {
  return {
    schemaVersion: 1,
    subjectId: 'physics',
    contentId: 'ly10-c2-b10',
    activityKind: 'stem_lesson_check',
    attemptId: 'a'.repeat(20),
    clientAt: '2026-09-16T00:00:00.000Z',
    ownerId: NGUOI,
    evidenceKind: 'server_graded',
    correct: 1,
    total: 2,
    ratio: 0.5,
    passed: false,
    serverAt: '2026-09-16T00:00:01.000Z',
    items: [],
    ...over,
  }
}

function mockFetch(
  tra: (input: unknown) => { status: number; body?: unknown },
): ReturnType<typeof vi.fn> {
  const f = vi.fn(async (_url: string, init?: RequestInit) => {
    const { status, body } = tra(init?.body ? JSON.parse(String(init.body)) : undefined)
    return new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', f)
  return f as unknown as ReturnType<typeof vi.fn>
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('khách vãng lai', () => {
  it('KHÔNG gọi server, chấm ở máy và đánh dấu local_graded', async () => {
    const f = mockFetch(() => ({ status: 200 }))
    const kq = await nop(KHACH, ['a', 'b'])

    expect(f).not.toHaveBeenCalled()
    expect(kq.kind).toBe('local')
    if (kq.kind !== 'local') throw new Error('sai nhánh')
    expect(kq.evidence.evidenceKind).toBe('local_graded')
    expect(kq.evidence.correct).toBe(2)
    expect(kq.evidence.passed).toBe(true)
    // Nhật ký giữ CẢ trả lời thô — lúc đăng nhập còn thứ để server chấm lại.
    expect(readEvidenceLog(KHACH)[0]!.input.answers).toHaveLength(2)
  })

  it('trạng thái cục bộ không kéo lùi: đạt rồi làm lại sai vẫn là completed', async () => {
    await nop(KHACH, ['a', 'b'])
    await nop(KHACH, ['b', 'a'])

    const { status, state } = await fetchCompletionState(KHACH, 'physics')
    expect(status).toBe('ready') // khách: localStorage LÀ nguồn sự thật, không chờ mạng
    const row = state.get('ly10-c2-b10')!
    expect(row.status).toBe('completed')
    expect(row.bestRatio).toBe(1)
    expect(row.lastRatio).toBe(0)
    expect(row.attempts).toBe(2)
    expect(row.source).toBe('local')
  })
})

describe('tài khoản — server là người chấm', () => {
  it('lấy con số của SERVER chứ không phải con số chấm ở máy', async () => {
    mockFetch(() => ({ status: 200, body: serverTra() }))
    const kq = await nop(NGUOI, ['a', 'b']) // ở máy là 2/2

    expect(kq.kind).toBe('server')
    if (kq.kind !== 'server') throw new Error('sai nhánh')
    expect(kq.evidence.correct).toBe(1)
    expect(kq.evidence.passed).toBe(false)
    expect(hasPendingEvidence(NGUOI)).toBe(false)
  })

  it('gửi đúng hợp đồng: có attemptId + clientAt, KHÔNG có correct/passed', async () => {
    let daGui: Record<string, unknown> = {}
    mockFetch((body) => {
      daGui = body as Record<string, unknown>
      return { status: 200, body: serverTra() }
    })
    await nop(NGUOI, ['a', 'b'])

    expect(daGui.schemaVersion).toBe(1)
    expect(String(daGui.attemptId)).toMatch(/^[A-Za-z0-9-]{16,64}$/)
    expect(daGui.clientAt).toEqual(expect.any(String))
    expect(daGui).not.toHaveProperty('correct')
    expect(daGui).not.toHaveProperty('passed')
  })
})

describe('hàng đợi gửi lại — cùng thiết bị', () => {
  it('mất mạng: xếp hàng đợi với lý do offline, bài làm không mất', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const kq = await nop(NGUOI, ['a', 'b'])

    expect(kq.kind).toBe('queued')
    if (kq.kind !== 'queued') throw new Error('sai nhánh')
    expect(kq.reason).toBe('offline')
    expect(readPendingEvidence(NGUOI)).toHaveLength(1)
  })

  it('5xx: xếp hàng đợi; gửi lại thành công thì gỡ và giữ NGUYÊN attemptId', async () => {
    mockFetch(() => ({ status: 503, body: { error: 'bận' } }))
    await nop(NGUOI, ['a', 'b'])
    const attemptId = readPendingEvidence(NGUOI)[0]!.input.attemptId

    let guiLai: Record<string, unknown> = {}
    mockFetch((body) => {
      guiLai = body as Record<string, unknown>
      return { status: 200, body: serverTra({ passed: true, correct: 2, ratio: 1 }) }
    })
    expect(await flushPendingEvidence(NGUOI)).toEqual({ sent: 1, kept: 0 })
    expect(guiLai.attemptId).toBe(attemptId) // idempotent: server không sinh dòng thứ hai
    expect(readPendingEvidence(NGUOI)).toHaveLength(0)
    // Gọi flush lần nữa khi hàng đợi rỗng: KHÔNG có request nào rời trình duyệt.
    const f = mockFetch(() => ({ status: 200, body: serverTra() }))
    expect(await flushPendingEvidence(NGUOI)).toEqual({ sent: 0, kept: 0 })
    expect(f).not.toHaveBeenCalled()
  })

  it('401: GIỮ trong hàng đợi, không xoá, không gửi lại tự động tới khi đăng nhập lại', async () => {
    mockFetch(() => ({ status: 401, body: { error: 'Unauthorized' } }))
    const kq = await nop(NGUOI, ['a', 'b'])
    expect(kq.kind === 'queued' && kq.reason).toBe('auth')

    expect(await flushPendingEvidence(NGUOI)).toEqual({ sent: 0, kept: 1 })
    expect(readPendingEvidence(NGUOI)).toHaveLength(1)
  })

  it('400: KHÔNG xếp hàng đợi khi nộp, và bị bỏ khỏi hàng đợi khi flush', async () => {
    mockFetch(() => ({ status: 400, body: { error: 'Bài này chưa có câu tự kiểm tra' } }))
    const kq = await nop(NGUOI, ['a', 'b'])
    expect(kq.kind).toBe('rejected')
    expect(kq.kind === 'rejected' && kq.error).toContain('chưa có câu tự kiểm tra')
    expect(readPendingEvidence(NGUOI)).toHaveLength(0)

    // Bản đã nằm sẵn trong hàng đợi (bài bị xoá sau khi nộp offline) cũng phải được dọn.
    mockFetch(() => ({ status: 503 }))
    await nop(NGUOI, ['a', 'b'])
    expect(readPendingEvidence(NGUOI)).toHaveLength(1)
    const canh = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockFetch(() => ({ status: 400, body: { error: 'CONTENT_NOT_FOUND' } }))
    expect(await flushPendingEvidence(NGUOI)).toEqual({ sent: 0, kept: 0 })
    expect(canh).toHaveBeenCalledWith(expect.stringContaining('[evidence]'))
  })

  it('hàng đợi đầy thì bỏ bản CŨ NHẤT, không bỏ bản vừa nộp', async () => {
    const day = Array.from({ length: MAX_PENDING_EVIDENCE }, (_, i) => ({
      reason: 'server' as const,
      input: {
        schemaVersion: 1 as const,
        subjectId: 'physics' as const,
        contentId: `ly10-c1-b${i + 1}`,
        activityKind: 'stem_lesson_check' as const,
        attemptId: `cu${String(i).padStart(18, '0')}`,
        clientAt: '2026-09-16T00:00:00.000Z',
        answers: [{ questionIndex: 0, raw: 'a' }],
      },
      evidence: serverTra({
        contentId: `ly10-c1-b${i + 1}`,
        attemptId: `cu${String(i).padStart(18, '0')}`,
        evidenceKind: 'local_graded',
        ownerId: NGUOI,
        serverAt: undefined,
      }),
    }))
    localStorage.setItem(EVIDENCE_PENDING_PREFIX + NGUOI, JSON.stringify(day))
    const canh = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mockFetch(() => ({ status: 503 }))
    await nop(NGUOI, ['a', 'b'])

    const hangDoi = readPendingEvidence(NGUOI)
    expect(hangDoi).toHaveLength(MAX_PENDING_EVIDENCE)
    expect(hangDoi[0]!.input.contentId).toBe('ly10-c1-b2') // bản cũ nhất đã rơi
    expect(hangDoi.at(-1)!.input.contentId).toBe('ly10-c2-b10') // bản vừa nộp còn
    expect(canh).toHaveBeenCalledWith(expect.stringContaining('[evidence]'))
  })
})

describe('fetchCompletionState', () => {
  it('server hỏng → status error kèm bộ đệm, KHÔNG im lặng hiện số cũ như vừa đồng bộ', async () => {
    mockFetch(() => ({ status: 200, body: serverTra({ passed: true, correct: 2, ratio: 1 }) }))
    await nop(NGUOI, ['a', 'b'])

    mockFetch(() => ({ status: 500 }))
    const kq = await fetchCompletionState(NGUOI, 'physics')
    expect(kq.status).toBe('error')
    expect(kq.state.get('ly10-c2-b10')?.status).toBe('completed')
  })

  it('server trả danh sách thì bản server THẮNG bộ đệm của môn đó', async () => {
    mockFetch(() => ({ status: 200, body: serverTra({ passed: true, correct: 2, ratio: 1 }) }))
    await nop(NGUOI, ['a', 'b'])

    mockFetch(() => ({
      status: 200,
      body: {
        state: [
          {
            subjectId: 'physics',
            contentId: 'ly10-c3-b1',
            status: 'in_progress',
            bestRatio: 0.5,
            lastRatio: 0.5,
            attempts: 1,
            completedAt: null,
            updatedAt: '2026-09-16T00:00:00.000Z',
            source: 'server',
          },
        ],
      },
    }))
    const kq = await fetchCompletionState(NGUOI, 'physics')
    expect(kq.status).toBe('ready')
    expect([...kq.state.keys()]).toEqual(['ly10-c3-b1'])
    expect(localStorage.getItem(EVIDENCE_STATE_PREFIX + NGUOI)).not.toContain('ly10-c2-b10')
  })
})

describe('đẩy evidence khách lên tài khoản', () => {
  it('gửi trả lời THÔ với attemptId cũ — server là người chấm, không phải localStorage', async () => {
    await nop(KHACH, ['a', 'b'])
    // Khách sửa tay localStorage: bịa một bài "đã đạt" mà chưa từng làm.
    const log = readEvidenceLog(KHACH)
    log[0]!.evidence.passed = true
    log[0]!.evidence.correct = 99
    localStorage.setItem(`dhcb_evidence_${KHACH}`, JSON.stringify(log))

    let daGui: Record<string, unknown> = {}
    mockFetch((body) => {
      daGui = body as Record<string, unknown>
      return { status: 200, body: serverTra() } // server chấm ra 1/2, KHÔNG đạt
    })
    expect(await pushGuestEvidence(KHACH, NGUOI)).toEqual({ sent: 1, failed: 0 })

    expect(daGui).not.toHaveProperty('correct')
    expect(daGui.attemptId).toBe(log[0]!.input.attemptId)
    expect(daGui.answers).toEqual([
      { questionIndex: 0, raw: 'a' },
      { questionIndex: 1, raw: 'b' },
    ])
    const state = await fetchCompletionState(NGUOI, 'physics')
    expect(state.state.get('ly10-c2-b10')?.status).toBe('in_progress')
  })

  it('bản ghi mang ownerId của CHỦ KHÁC thì không được gắn vào tài khoản này', async () => {
    await nop(KHACH, ['a', 'b'])
    const log = readEvidenceLog(KHACH)
    log[0]!.evidence.ownerId = 'guest_nguoi-khac'
    localStorage.setItem(`dhcb_evidence_${KHACH}`, JSON.stringify(log))

    const f = mockFetch(() => ({ status: 200, body: serverTra() }))
    expect(await pushGuestEvidence(KHACH, NGUOI)).toEqual({ sent: 0, failed: 1 })
    expect(f).not.toHaveBeenCalled()
  })

  it('lỗi mạng ở MỘT bản ghi không chặn bản còn lại', async () => {
    await nop(KHACH, ['a', 'b'])
    await submitStemEvidence(
      KHACH,
      {
        subjectId: 'physics',
        contentId: 'ly10-c3-b1',
        activityKind: 'stem_lesson_check',
        answers: [{ questionIndex: 0, raw: 'a' }],
      },
      BAI,
    )

    let lan = 0
    mockFetch(() => {
      lan += 1
      return lan === 1 ? { status: 500 } : { status: 200, body: serverTra() }
    })
    expect(await pushGuestEvidence(KHACH, NGUOI)).toEqual({ sent: 1, failed: 1 })
  })

  it('không đẩy khi uid đích vẫn là khách (không merge vào id khách)', async () => {
    await nop(KHACH, ['a', 'b'])
    const f = mockFetch(() => ({ status: 200, body: serverTra() }))
    expect(await pushGuestEvidence(KHACH, 'guest_khac')).toEqual({ sent: 0, failed: 0 })
    expect(f).not.toHaveBeenCalled()
  })
})

describe('hàm thuần', () => {
  it('mergeCompletionState giữ completedAt của lần đạt ĐẦU TIÊN', () => {
    const dat = serverTra({ passed: true, correct: 2, ratio: 1 })
    const lan1 = mergeCompletionState(undefined, dat, '2026-09-01T00:00:00.000Z')
    const lan2 = mergeCompletionState(lan1, serverTra(), '2026-09-02T00:00:00.000Z')

    expect(lan2.completedAt).toBe('2026-09-01T00:00:00.000Z')
    expect(lan2.status).toBe('completed')
    expect(lan2.bestRatio).toBe(1)
    expect(lan2.attempts).toBe(2)
  })

  it('newAttemptId khớp khuôn hợp đồng kể cả khi crypto.randomUUID vắng mặt', () => {
    expect(newAttemptId()).toMatch(/^[A-Za-z0-9-]{16,64}$/)
    const that = globalThis.crypto
    vi.stubGlobal('crypto', { ...that, randomUUID: undefined })
    expect(newAttemptId()).toMatch(/^[A-Za-z0-9-]{16,64}$/)
  })

  it('localStorage bị chặn thì nộp vẫn chạy, không ném', async () => {
    vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    const kq = await nop(KHACH, ['a', 'b'])
    expect(kq.kind).toBe('local')
  })
})
