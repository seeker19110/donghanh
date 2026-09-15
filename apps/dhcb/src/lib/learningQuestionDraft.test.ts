// Test canh cho nháp câu hỏi học tập — đặc tả §④ A, §⑤ (S02 phải viết regression test).
import { describe, it, expect, beforeEach } from 'vitest'
import {
  MAX_QUESTION_LENGTH,
  DRAFT_TTL_MS,
  validateQuestion,
  saveDraft,
  readDraft,
  clearDraft,
  peekGuestDraft,
  claimGuestDraft,
  isDraftStorageAvailable,
  __resetDraftMemory,
  type DraftOwner,
} from './learningQuestionDraft'

const GUEST: DraftOwner = { kind: 'guest', id: 'guest_abc' }
const ACCOUNT: DraftOwner = { kind: 'account', id: 'user-1' }
const OTHER_ACCOUNT: DraftOwner = { kind: 'account', id: 'user-2' }
const KEY = 'dhcb_learning_question_draft_v1'

beforeEach(() => {
  sessionStorage.clear()
  __resetDraftMemory()
})

describe('validateQuestion — giữ nguyên văn', () => {
  it('từ chối chuỗi rỗng và chuỗi chỉ có khoảng trắng', () => {
    expect(validateQuestion('')).toEqual({ ok: false, reason: 'empty' })
    expect(validateQuestion('   \n\t ')).toEqual({ ok: false, reason: 'empty' })
  })

  it('giữ NGUYÊN VĂN dấu tiếng Việt, xuống dòng và khoảng trắng canh lề', () => {
    const raw = '  Giải phương trình x + 2 = 5\n  rồi giải thích?  '
    const result = validateQuestion(raw)
    expect(result).toEqual({ ok: true, question: raw })
  })

  it('báo lỗi khi quá dài thay vì tự cắt bớt', () => {
    const tooLong = 'a'.repeat(MAX_QUESTION_LENGTH + 1)
    expect(validateQuestion(tooLong)).toEqual({ ok: false, reason: 'too-long' })
    expect(validateQuestion('a'.repeat(MAX_QUESTION_LENGTH)).ok).toBe(true)
  })
})

describe('saveDraft / readDraft', () => {
  it('lưu rồi đọc lại đúng nguyên văn cho cùng chủ sở hữu', () => {
    const saved = saveDraft('Câu hỏi có dấu?\nDòng hai', ACCOUNT)
    expect(saved.status).toBe('saved')
    const read = readDraft(ACCOUNT)
    expect(read.status).toBe('ready')
    if (read.status !== 'ready') throw new Error('unreachable')
    expect(read.draft.question).toBe('Câu hỏi có dấu?\nDòng hai')
    expect(read.draft.target).toBe('companion')
    expect(read.draft.source).toBe('home')
  })

  it('không lưu khi câu hỏi không hợp lệ', () => {
    expect(saveDraft('   ', ACCOUNT)).toEqual({ status: 'invalid', reason: 'empty' })
    expect(sessionStorage.getItem(KEY)).toBeNull()
  })

  it('không đưa câu hỏi vào localStorage lâu dài', () => {
    saveDraft('Bí mật của tôi', ACCOUNT)
    const dump = JSON.stringify(localStorage)
    expect(dump).not.toContain('Bí mật của tôi')
  })
})

describe('cách ly theo chủ sở hữu', () => {
  it('tài khoản khác KHÔNG đọc được nháp, và cũng không biết là có nháp', () => {
    saveDraft('Câu hỏi riêng tư', ACCOUNT)
    expect(readDraft(OTHER_ACCOUNT)).toEqual({ status: 'empty' })
  })

  it('đăng xuất về khách không prefill nháp của tài khoản cũ', () => {
    saveDraft('Câu hỏi của tài khoản', ACCOUNT)
    expect(readDraft(GUEST)).toEqual({ status: 'empty' })
  })

  it('nháp của khách không tự chảy sang tài khoản khi chưa có thao tác rõ ràng', () => {
    saveDraft('Câu hỏi của khách', GUEST)
    expect(readDraft(ACCOUNT)).toEqual({ status: 'empty' })
  })

  it('claimGuestDraft gán nháp khách cho tài khoản khi được gọi tường minh', () => {
    saveDraft('Câu hỏi của khách', GUEST)
    expect(peekGuestDraft().status).toBe('ready')
    const moved = claimGuestDraft(ACCOUNT.id)
    expect(moved?.question).toBe('Câu hỏi của khách')
    expect(readDraft(ACCOUNT).status).toBe('ready')
    // Đã thuộc về tài khoản thì không còn là nháp khách nữa.
    expect(peekGuestDraft()).toEqual({ status: 'empty' })
  })

  it('claimGuestDraft không tạo nháp khi khách chẳng có gì', () => {
    expect(claimGuestDraft(ACCOUNT.id)).toBeNull()
    expect(readDraft(ACCOUNT)).toEqual({ status: 'empty' })
  })

  it('peekGuestDraft không lộ nháp của một TÀI KHOẢN cho phiên khách sau đó', () => {
    saveDraft('Câu hỏi của tài khoản', ACCOUNT)
    expect(peekGuestDraft()).toEqual({ status: 'empty' })
    expect(claimGuestDraft(OTHER_ACCOUNT.id)).toBeNull()
  })

  it('nháp khách quá hạn không được gán cho tài khoản', () => {
    const t0 = 1_700_000_000_000
    saveDraft('Câu hỏi cũ của khách', GUEST, t0)
    expect(peekGuestDraft(t0 + DRAFT_TTL_MS + 1)).toEqual({ status: 'expired' })
    expect(claimGuestDraft(ACCOUNT.id, t0 + DRAFT_TTL_MS + 1)).toBeNull()
  })
})

describe('hết hạn và dữ liệu hỏng', () => {
  it('nháp quá TTL báo expired và không tự nạp lại', () => {
    const t0 = 1_700_000_000_000
    saveDraft('Câu hỏi cũ', ACCOUNT, t0)
    expect(readDraft(ACCOUNT, t0 + DRAFT_TTL_MS).status).toBe('ready')
    expect(readDraft(ACCOUNT, t0 + DRAFT_TTL_MS + 1)).toEqual({ status: 'expired' })
  })

  it('dữ liệu sai khuôn báo invalid chứ không ném lỗi', () => {
    sessionStorage.setItem(KEY, '{khong-phai-json')
    expect(readDraft(ACCOUNT)).toEqual({ status: 'invalid' })
    sessionStorage.setItem(KEY, JSON.stringify({ version: 9, question: 'x' }))
    expect(readDraft(ACCOUNT)).toEqual({ status: 'invalid' })
  })

  it('target ngoài allowlist bị coi là invalid', () => {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        id: 'd1',
        question: 'x',
        source: 'home',
        owner: ACCOUNT,
        target: 'https://ke-tan-cong.example',
        createdAt: Date.now(),
      }),
    )
    expect(readDraft(ACCOUNT)).toEqual({ status: 'invalid' })
  })
})

describe('clearDraft', () => {
  it('gửi thành công xoá đúng id đã gửi', () => {
    const saved = saveDraft('Câu hỏi 1', ACCOUNT)
    if (saved.status === 'invalid') throw new Error('unreachable')
    clearDraft(saved.draft.id)
    expect(readDraft(ACCOUNT)).toEqual({ status: 'empty' })
  })

  it('KHÔNG xoá nháp mới phát sinh trong lúc chờ phản hồi', () => {
    const first = saveDraft('Câu hỏi 1', ACCOUNT)
    if (first.status === 'invalid') throw new Error('unreachable')
    saveDraft('Câu hỏi 2 gõ trong lúc chờ', ACCOUNT)
    clearDraft(first.draft.id)
    const read = readDraft(ACCOUNT)
    expect(read.status).toBe('ready')
    if (read.status !== 'ready') throw new Error('unreachable')
    expect(read.draft.question).toBe('Câu hỏi 2 gõ trong lúc chờ')
  })

  it('không id thì xoá thẳng (người dùng chủ động xoá)', () => {
    saveDraft('Câu hỏi', ACCOUNT)
    clearDraft()
    expect(readDraft(ACCOUNT)).toEqual({ status: 'empty' })
  })
})

describe('storage bị chặn', () => {
  it('vẫn giữ nháp trong bộ nhớ và báo memory-only', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('storage bị chặn')
      },
    })
    try {
      expect(isDraftStorageAvailable()).toBe(false)
      const saved = saveDraft('Câu hỏi khi bị chặn', ACCOUNT)
      expect(saved.status).toBe('memory-only')
      const read = readDraft(ACCOUNT)
      expect(read.status).toBe('ready')
      if (read.status !== 'ready') throw new Error('unreachable')
      expect(read.draft.question).toBe('Câu hỏi khi bị chặn')
      expect(readDraft(OTHER_ACCOUNT)).toEqual({ status: 'empty' })
    } finally {
      if (original) Object.defineProperty(globalThis, 'sessionStorage', original)
    }
  })

  it('không có nháp nào trong bộ nhớ thì báo unavailable', () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('storage bị chặn')
      },
    })
    try {
      expect(readDraft(ACCOUNT)).toEqual({ status: 'unavailable' })
    } finally {
      if (original) Object.defineProperty(globalThis, 'sessionStorage', original)
    }
  })
})
