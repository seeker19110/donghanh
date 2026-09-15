// apps/dhcb/src/components/Home/HomeUniversalAiBar.test.tsx — Cổng canh "hỏi nhanh trung thực".
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-foundation.md §④ A (slice S02).
//
// VÌ SAO CẦN: bản trước của ô này giả vờ có AI — hiện trạng thái "đang phân tích và trích xuất
// lời giải" rồi in đoạn văn viết sẵn. Kiểu hồi quy đó rất dễ quay lại (chỉ cần một PR "thêm lại
// phần xem trước câu trả lời cho sinh động"), và KHÔNG cổng nào khác trong dự án bắt được: mã
// vẫn biên dịch, vẫn lint sạch, ảnh chụp trang vẫn đẹp. Nên canh bằng test render thật.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import HomeUniversalAiBar from './HomeUniversalAiBar'
import { suggestDestination } from '../../lib/learningDestination'
import { AuthContext, type AuthContextValue } from '../../context/authContext'
import { readDraft, __resetDraftMemory } from '../../lib/learningQuestionDraft'
import type { User } from '../../types'

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})
vi.mock('../../lib/stt', () => ({
  startListening: vi.fn(() => () => {}),
  isSTTSupported: () => false,
}))
vi.mock('@core/ToastProvider', () => ({
  useToast: () => ({ info: vi.fn(), error: vi.fn(), success: vi.fn() }),
}))

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement
let root: Root | undefined

function authValue(kind: 'anonymous' | 'guest' | 'account'): AuthContextValue {
  const user =
    kind === 'anonymous'
      ? null
      : ({ id: kind === 'guest' ? 'guest_abc' : 'user-1', name: 'Test' } as User)
  return { user, loading: false, refresh: async () => {}, isGuest: kind === 'guest' }
}

async function render(kind: 'anonymous' | 'guest' | 'account' = 'account') {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root.render(
      <AuthContext.Provider value={authValue(kind)}>
        <MemoryRouter>
          <HomeUniversalAiBar />
        </MemoryRouter>
      </AuthContext.Provider>,
    )
  })
  return container
}

function findByText(selector: string, text: string): HTMLElement | undefined {
  return [...container.querySelectorAll<HTMLElement>(selector)].find((el) =>
    (el.textContent ?? '').includes(text),
  )
}

async function ask(question: string) {
  const input = container.querySelector('input')
  if (!input) throw new Error('không thấy ô nhập')
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(
      globalThis.HTMLInputElement.prototype,
      'value',
    )?.set
    setter?.call(input, question)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await act(async () => {
    container.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }))
  })
}

beforeEach(() => {
  navigate.mockClear()
  sessionStorage.clear()
  __resetDraftMemory()
})

afterEach(async () => {
  // Nhóm test hàm thuần không render gì — không có root để tháo.
  if (!root) return
  await act(async () => root!.unmount())
  container.remove()
  root = undefined
})

describe('suggestDestination — tìm từ khoá, không phải phân loại bằng AI', () => {
  it('đưa câu hỏi Toán về môn Toán', () => {
    expect(suggestDestination('Giải phương trình x + 2 = 5').route).toBe('/goc-hoc-tap/mathematics')
  })

  it('không khớp từ khoá nào thì về Bạn Đồng Hành', () => {
    const d = suggestDestination('Hôm nay tôi thấy hơi mệt')
    expect(d.route).toBe('/ban-dong-hanh')
    expect(d.isCompanion).toBe(true)
  })

  it('không bao giờ trả về đích ngoài các route nội bộ đã liệt kê', () => {
    for (const q of ['toán', 'vật lý', 'ipa', 'phỏng vấn', 'linh tinh']) {
      expect(suggestDestination(q).route.startsWith('/')).toBe(true)
    }
  })
})

describe('không có lời giải viết sẵn và không giả trạng thái AI suy nghĩ', () => {
  it('câu hỏi Toán chỉ nhận gợi ý nơi học, không nhận lời giải', async () => {
    await render('account')
    await ask('Giải phương trình x + 2 = 5')
    const text = container.textContent ?? ''
    expect(text).toContain('Gợi ý nơi học')
    expect(text).toContain('Môn Toán')
    // Nguyên văn các chuỗi lời giải viết sẵn của bản cũ — không được quay lại.
    expect(text).not.toContain('bảng biến thiên')
    expect(text).not.toContain('Gợi ý Socratic')
    expect(text).not.toContain('đang phân tích')
    expect(text).not.toContain('Phản Hồi Nhanh AI')
    // Không có vòng quay "AI đang nghĩ".
    expect(container.querySelector('.animate-spin')).toBeNull()
  })

  it('giữ nguyên văn câu hỏi có dấu và ký tự đặc biệt', async () => {
    await render('account')
    await ask('Vì sao H₂O + Na → phản ứng mãnh liệt?')
    expect(container.textContent).toContain('Vì sao H₂O + Na → phản ứng mãnh liệt?')
  })

  it('không gọi mạng nào khi chỉ tìm nơi học', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    await render('account')
    await ask('Giải phương trình x + 2 = 5')
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('điều hướng chỉ xảy ra khi người dùng bấm nút mở', async () => {
    await render('account')
    await ask('Luyện phát âm chuẩn IPA')
    expect(navigate).not.toHaveBeenCalled()
    const open = findByText('button', 'Mở Luyện nói')
    await act(async () => open?.click())
    expect(navigate).toHaveBeenCalledWith('/luyen-noi')
  })
})

describe('handoff sang Bạn Đồng Hành', () => {
  it('tài khoản: lưu nháp để trang đích đổ sẵn, không tự gửi', async () => {
    await render('account')
    await ask('Hôm nay tôi thấy hơi mệt')
    const saved = readDraft({ kind: 'account', id: 'user-1' })
    expect(saved.status).toBe('ready')
    if (saved.status !== 'ready') throw new Error('unreachable')
    expect(saved.draft.question).toBe('Hôm nay tôi thấy hơi mệt')
    expect(saved.draft.target).toBe('companion')
  })

  it('khách: hiện CTA đăng nhập, KHÔNG mở thẳng trang cần tài khoản', async () => {
    await render('guest')
    await ask('Hôm nay tôi thấy hơi mệt')
    expect(findByText('button', 'Mở Bạn Đồng Hành')).toBeUndefined()
    const login = findByText('button', 'Đăng nhập để hỏi Bạn Đồng Hành')
    expect(login).toBeDefined()
    // Nháp gắn đúng danh tính khách, không gắn nhầm tài khoản nào.
    const asGuest = readDraft({ kind: 'guest', id: 'guest_abc' })
    expect(asGuest.status).toBe('ready')
    await act(async () => login?.click())
    expect(navigate).toHaveBeenCalledWith('/login')
  })

  it('đích không cần tài khoản thì khách vẫn đi thẳng, không bị chặn đăng nhập', async () => {
    await render('guest')
    await ask('Giải phương trình x + 2 = 5')
    expect(findByText('button', 'Đăng nhập để hỏi Bạn Đồng Hành')).toBeUndefined()
    expect(findByText('button', 'Mở Môn Toán')).toBeDefined()
  })
})

describe('validation', () => {
  it('câu hỏi quá dài bị báo lỗi, không bị cắt bớt và không điều hướng', async () => {
    await render('account')
    await ask('a'.repeat(2001))
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('vượt giới hạn')
    expect(container.textContent).not.toContain('Gợi ý nơi học')
    expect(readDraft({ kind: 'account', id: 'user-1' })).toEqual({ status: 'empty' })
  })

  it('chuỗi chỉ có khoảng trắng không mở gợi ý', async () => {
    await render('account')
    await ask('    ')
    expect(container.textContent).not.toContain('Gợi ý nơi học')
  })
})
