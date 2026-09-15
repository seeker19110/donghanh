// learningSession.test.ts — khung phiên học (nháp + vị trí đang học) trên CÙNG thiết bị.
//
// Bất biến canh ở đây (đặc tả docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md §⑤):
//   - Nháp CÓ CHỦ SỞ HỮU: đọc bằng danh tính khác trả `empty`, không lộ chữ của người trước.
//   - Bản ghi hỏng KHÔNG bị xoá ngầm; nháp quá dài thì BÁO chứ không bị cắt.
//   - Prune chỉ đụng khoá `dhcb_lsession_v1_*` đã quá hạn, không đụng khoá của module khác.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  LearningSessionSchema,
  MAX_SESSION_CHARS,
  SESSION_TTL_MS,
  __resetSessionMemory,
  clearSession,
  contentFingerprint,
  isSessionStorageAvailable,
  listResumableSessions,
  moveGuestSessionsTo,
  pruneExpiredSessions,
  readSession,
  saveSession,
  sessionKey,
  type SessionKeyParts,
  type SessionOwner,
} from './learningSession'

const T0 = 1_700_000_000_000
const guest: SessionOwner = { kind: 'guest', id: 'guest_9f1c' }
const account: SessionOwner = { kind: 'account', id: '42' }
const parts: SessionKeyParts = { owner: account, subjectId: 'programming', contentId: 'p1-u4-l1' }
const FP = 'v-abc'

beforeEach(() => {
  localStorage.clear()
  __resetSessionMemory()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function validSession(over: Record<string, unknown> = {}) {
  return {
    version: 1,
    subjectId: 'programming',
    contentId: 'p1-u4-l1',
    contentVersion: FP,
    owner: account,
    stepIndex: 2,
    draft: { code: 'print(1)' },
    startedAt: T0,
    updatedAt: T0,
    ...over,
  }
}

describe('hợp đồng phong bì v1 (Zod)', () => {
  it('bản ghi hợp lệ parse được', () => {
    expect(LearningSessionSchema.safeParse(validSession()).success).toBe(true)
  })

  it('thiếu trường bắt buộc → không hợp lệ', () => {
    const bad = validSession()
    delete (bad as Record<string, unknown>).contentVersion
    expect(LearningSessionSchema.safeParse(bad).success).toBe(false)
  })

  it('version lạ (2) → không hợp lệ', () => {
    expect(LearningSessionSchema.safeParse(validSession({ version: 2 })).success).toBe(false)
  })

  it('ownerId rỗng → không hợp lệ', () => {
    const bad = validSession({ owner: { kind: 'account', id: '' } })
    expect(LearningSessionSchema.safeParse(bad).success).toBe(false)
  })

  it('updatedAt < startedAt → không hợp lệ', () => {
    expect(LearningSessionSchema.safeParse(validSession({ updatedAt: T0 - 1 })).success).toBe(false)
  })

  it('JSON hỏng → invalid và KHÔNG bị xoá ngầm', () => {
    const key = sessionKey(parts)
    localStorage.setItem(key, '{khong-phai-json')
    expect(readSession(parts, FP, T0).status).toBe('invalid')
    expect(localStorage.getItem(key)).toBe('{khong-phai-json')
  })
})

describe('lưu và đọc', () => {
  it('lưu rồi đọc lại → ready, đúng nháp và bước', () => {
    const saved = saveSession(parts, { contentVersion: FP, stepIndex: 3, draft: { code: 'a' } }, T0)
    expect(saved.status).toBe('saved')
    const read = readSession(parts, FP, T0)
    expect(read.status).toBe('ready')
    if (read.status !== 'ready') throw new Error('phải là ready')
    expect(read.session.stepIndex).toBe(3)
    expect(read.session.draft).toEqual({ code: 'a' })
  })

  it('khoá đúng khuôn dhcb_lsession_v1_<kind>:<id>_<subject>_<content>', () => {
    expect(sessionKey(parts)).toBe('dhcb_lsession_v1_account:42_programming_p1-u4-l1')
  })

  it('lưu lại thì GIỮ startedAt của bản đầu, updatedAt theo lần ghi mới', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: {} }, T0)
    saveSession(parts, { contentVersion: FP, stepIndex: 1, draft: {} }, T0 + 5_000)
    const read = readSession(parts, FP, T0 + 5_000)
    if (read.status !== 'ready') throw new Error('phải là ready')
    expect(read.session.startedAt).toBe(T0)
    expect(read.session.updatedAt).toBe(T0 + 5_000)
  })

  it('clearSession xoá đúng khoá của mình', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: {} }, T0)
    clearSession(parts)
    expect(readSession(parts, FP, T0).status).toBe('empty')
  })
})

describe('cách ly theo chủ sở hữu', () => {
  it('owner khác KIND → empty (không lộ là có nháp)', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 1, draft: { code: 'bi-mat' } }, T0)
    const other = { ...parts, owner: { kind: 'guest', id: '42' } as SessionOwner }
    expect(readSession(other, FP, T0).status).toBe('empty')
  })

  it('owner khác ID → empty', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 1, draft: {} }, T0)
    const other = { ...parts, owner: { kind: 'account', id: '43' } as SessionOwner }
    expect(readSession(other, FP, T0).status).toBe('empty')
  })

  it('khách và tài khoản cùng bài là HAI khoá, không ghi đè nhau', () => {
    const guestParts: SessionKeyParts = { ...parts, owner: guest }
    saveSession(guestParts, { contentVersion: FP, stepIndex: 1, draft: { code: 'khach' } }, T0)
    saveSession(parts, { contentVersion: FP, stepIndex: 5, draft: { code: 'tai-khoan' } }, T0)
    const g = readSession(guestParts, FP, T0)
    const a = readSession(parts, FP, T0)
    if (g.status !== 'ready' || a.status !== 'ready') throw new Error('cả hai phải ready')
    expect(g.session.draft).toEqual({ code: 'khach' })
    expect(a.session.draft).toEqual({ code: 'tai-khoan' })
  })

  it('đăng xuất (khách mới) → empty; đăng nhập lại đúng tài khoản → ready', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 2, draft: { code: 'x' } }, T0)
    const newGuest: SessionKeyParts = { ...parts, owner: { kind: 'guest', id: 'guest_moi' } }
    expect(readSession(newGuest, FP, T0).status).toBe('empty')
    expect(readSession(parts, FP, T0).status).toBe('ready')
  })
})

describe('TTL 7 ngày tính từ updatedAt', () => {
  it('đúng biên updatedAt + TTL vẫn còn dùng được', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: {} }, T0)
    expect(readSession(parts, FP, T0 + SESSION_TTL_MS).status).toBe('ready')
  })

  it('quá 1 ms → expired', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: {} }, T0)
    expect(readSession(parts, FP, T0 + SESSION_TTL_MS + 1).status).toBe('expired')
  })

  it('prune xoá đúng khoá hết hạn và trả số đã xoá', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: {} }, T0)
    saveSession(
      { ...parts, contentId: 'p1-u4-l2' },
      { contentVersion: FP, stepIndex: 0, draft: {} },
      T0 + SESSION_TTL_MS,
    )
    expect(pruneExpiredSessions(T0 + SESSION_TTL_MS + 1)).toBe(1)
    expect(localStorage.getItem(sessionKey(parts))).toBeNull()
    expect(readSession({ ...parts, contentId: 'p1-u4-l2' }, FP, T0 + SESSION_TTL_MS)).toMatchObject(
      {
        status: 'ready',
      },
    )
  })

  it('prune KHÔNG đụng khoá của module khác', () => {
    localStorage.setItem('et_learned_42', '["hello"]')
    localStorage.setItem('srs_42', '{}')
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: {} }, T0)
    const before = localStorage.length
    expect(pruneExpiredSessions(T0 + SESSION_TTL_MS + 1)).toBe(1)
    expect(localStorage.length).toBe(before - 1)
    expect(localStorage.getItem('et_learned_42')).toBe('["hello"]')
    expect(localStorage.getItem('srs_42')).toBe('{}')
  })
})

describe('giới hạn kích thước: báo chứ không cắt', () => {
  it('đúng ngưỡng MAX_SESSION_CHARS vẫn lưu', () => {
    // Dò dần cho tới khi chuỗi JSON đúng bằng ngưỡng — không đoán số ký tự phần phong bì.
    let padding = MAX_SESSION_CHARS
    let result = saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: 'x' }, T0)
    for (; padding > 0; padding -= 1) {
      result = saveSession(
        parts,
        { contentVersion: FP, stepIndex: 0, draft: 'x'.repeat(padding) },
        T0,
      )
      if (result.status !== 'too-large') break
    }
    expect(result.status).toBe('saved')
    if (result.status !== 'saved') throw new Error('phải lưu được')
    expect(JSON.stringify(result.session).length).toBe(MAX_SESSION_CHARS)
  })

  it('vượt ngưỡng → too-large và bản CŨ giữ nguyên', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 1, draft: { code: 'cu' } }, T0)
    const big = saveSession(
      parts,
      { contentVersion: FP, stepIndex: 2, draft: { code: 'y'.repeat(MAX_SESSION_CHARS) } },
      T0 + 1,
    )
    expect(big.status).toBe('too-large')
    if (big.status !== 'too-large') throw new Error('phải quá lớn')
    expect(big.chars).toBeGreaterThan(MAX_SESSION_CHARS)
    const read = readSession(parts, FP, T0 + 1)
    if (read.status !== 'ready') throw new Error('bản cũ phải còn')
    expect(read.session.draft).toEqual({ code: 'cu' })
  })
})

// Thay `globalThis.localStorage` bằng một Storage giả: `vi.spyOn(Storage.prototype, …)` KHÔNG
// chạm được vào đối tượng thật của happy-dom, nên phải đổi cả tham chiếu.
function stubLocalStorage(store: Storage): () => void {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { value: store, configurable: true })
  return () => {
    if (original) Object.defineProperty(globalThis, 'localStorage', original)
  }
}

/** Storage giả: `setItem` ném lỗi với những khoá khớp `throwOn` (mặc định: mọi khoá). */
function fakeStorage(throwOn: (key: string) => boolean = () => true): Storage {
  const data = new Map<string, string>()
  return {
    get length() {
      return data.size
    },
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (throwOn(k)) throw new Error('QuotaExceededError')
      data.set(k, v)
    },
    removeItem: (k: string) => {
      data.delete(k)
    },
    clear: () => data.clear(),
  } as Storage
}

describe('storage bị chặn', () => {
  it('ghi ném lỗi ngay từ probe → memory-only, vẫn đọc lại được trong cùng lượt tải trang', () => {
    const restore = stubLocalStorage(fakeStorage())
    try {
      expect(isSessionStorageAvailable()).toBe(false)
      const saved = saveSession(
        parts,
        { contentVersion: FP, stepIndex: 4, draft: { code: 'z' } },
        T0,
      )
      expect(saved.status).toBe('memory-only')
      const read = readSession(parts, FP, T0)
      expect(read.status).toBe('ready')
      if (read.status !== 'ready') throw new Error('phải là ready')
      expect(read.session.draft).toEqual({ code: 'z' })
    } finally {
      restore()
    }
  })

  it('QuotaExceededError khi ghi khoá thật → memory-only, không xoá khoá của người khác', () => {
    // Probe qua được (khoá probe không ném), chỉ khoá phiên mới hết chỗ.
    const store = fakeStorage((k) => k.startsWith('dhcb_lsession_v1_'))
    const restore = stubLocalStorage(store)
    try {
      store.setItem('et_learned_42', '["hello"]')
      expect(isSessionStorageAvailable()).toBe(true)
      const saved = saveSession(
        parts,
        { contentVersion: FP, stepIndex: 1, draft: { code: 'q' } },
        T0,
      )
      expect(saved.status).toBe('memory-only')
      expect(readSession(parts, FP, T0).status).toBe('ready')
      expect(store.getItem('et_learned_42')).toBe('["hello"]')
    } finally {
      restore()
    }
  })
})

describe('vân tay nội dung (contentFingerprint)', () => {
  it('tất định: cùng đầu vào → cùng đầu ra', () => {
    expect(contentFingerprint(['p1-u4-l1', 'Tiêu đề', 3])).toBe(
      contentFingerprint(['p1-u4-l1', 'Tiêu đề', 3]),
    )
  })

  it('đổi một ký tự → vân tay khác; ranh giới phần tử không nhập nhèm', () => {
    expect(contentFingerprint(['abc'])).not.toBe(contentFingerprint(['abd'])) // đổi 1 ký tự
    expect(contentFingerprint(['ab', 'c'])).not.toBe(contentFingerprint(['a', 'bc'])) // ghép khác
  })

  it('contentVersion khác → stale và VẪN trả bản ghi để UI mời dùng lại', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 2, draft: { code: 'cu' } }, T0)
    const read = readSession(parts, 'v-moi', T0)
    expect(read.status).toBe('stale')
    if (read.status !== 'stale') throw new Error('phải là stale')
    expect(read.session.draft).toEqual({ code: 'cu' })
  })
})

describe('nguồn cho "Học tiếp" (listResumableSessions)', () => {
  it('3 phiên: 1 hết hạn + 1 hỏng → trả 1, mới nhất trước, KHÔNG kèm draft', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 1, draft: { code: 'con-han' } }, T0)
    saveSession(
      { ...parts, contentId: 'p1-u4-l9' },
      { contentVersion: FP, stepIndex: 0, draft: {} },
      T0 - SESSION_TTL_MS - 1,
    )
    localStorage.setItem('dhcb_lsession_v1_account:42_physics_ly10', 'hong')
    const rows = listResumableSessions(account, T0)
    expect(rows).toHaveLength(1)
    expect(rows[0]).toEqual({
      subjectId: 'programming',
      contentId: 'p1-u4-l1',
      stepIndex: 1,
      updatedAt: T0,
    })
  })

  it('sắp theo updatedAt giảm dần và bỏ phiên của chủ khác', () => {
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: {} }, T0)
    saveSession(
      { ...parts, contentId: 'p1-u4-l2', subjectId: 'physics' },
      { contentVersion: FP, stepIndex: 0, draft: {}, courseId: 'k1', stepLabel: 'Tự viết' },
      T0 + 1_000,
    )
    saveSession({ ...parts, owner: guest }, { contentVersion: FP, stepIndex: 0, draft: {} }, T0 + 2)
    const rows = listResumableSessions(account, T0 + 1_000)
    expect(rows.map((r) => r.contentId)).toEqual(['p1-u4-l2', 'p1-u4-l1'])
    expect(rows[0].courseId).toBe('k1')
    expect(rows[0].stepLabel).toBe('Tự viết')
  })
})

describe('khách → tài khoản (moveGuestSessionsTo)', () => {
  it('tài khoản chưa có nháp → lấy bản của khách, khoá khách bị xoá', () => {
    const guestParts: SessionKeyParts = { ...parts, owner: guest }
    saveSession(guestParts, { contentVersion: FP, stepIndex: 3, draft: { code: 'khach' } }, T0)
    expect(moveGuestSessionsTo(guest.id, account.id)).toBe(1)
    const read = readSession(parts, FP, T0)
    if (read.status !== 'ready') throw new Error('phải dời sang tài khoản')
    expect(read.session.draft).toEqual({ code: 'khach' })
    expect(read.session.owner).toEqual(account)
    expect(localStorage.getItem(sessionKey(guestParts))).toBeNull()
  })

  it('tài khoản đã có nháp MỚI HƠN → giữ bản của tài khoản, vẫn dọn khoá khách', () => {
    const guestParts: SessionKeyParts = { ...parts, owner: guest }
    saveSession(guestParts, { contentVersion: FP, stepIndex: 1, draft: { code: 'khach' } }, T0)
    saveSession(parts, { contentVersion: FP, stepIndex: 9, draft: { code: 'cua-toi' } }, T0 + 10)
    expect(moveGuestSessionsTo(guest.id, account.id)).toBe(0)
    const read = readSession(parts, FP, T0 + 10)
    if (read.status !== 'ready') throw new Error('bản tài khoản phải còn')
    expect(read.session.draft).toEqual({ code: 'cua-toi' })
    expect(localStorage.getItem(sessionKey(guestParts))).toBeNull()
  })

  it('bản của khách mới hơn → thắng', () => {
    const guestParts: SessionKeyParts = { ...parts, owner: guest }
    saveSession(parts, { contentVersion: FP, stepIndex: 0, draft: { code: 'cu' } }, T0)
    saveSession(guestParts, { contentVersion: FP, stepIndex: 7, draft: { code: 'khach' } }, T0 + 99)
    expect(moveGuestSessionsTo(guest.id, account.id)).toBe(1)
    const read = readSession(parts, FP, T0 + 99)
    if (read.status !== 'ready') throw new Error('phải là bản của khách')
    expect(read.session.stepIndex).toBe(7)
  })
})
