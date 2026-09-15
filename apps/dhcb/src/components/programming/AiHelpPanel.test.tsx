// apps/dhcb/src/components/programming/AiHelpPanel.test.tsx
//
// [S10-1, 2026-09-15] Cổng cho lỗi L6 (đặc tả
// `docs/specs/2026-09-15-learning-ux-s10-tro-giang-trong-bai-voice.md` §2.1): panel hỏi AI
// không có `mountedRef` lẫn cơ chế so khớp bài, còn `ProgrammingLessonPage` là CÙNG MỘT
// instance khi `:lessonId` đổi (App.tsx render không `key`). Hệ quả:
//   1. Gợi ý/bậc gợi ý của bài A còn nguyên khi đã sang bài B.
//   2. Response trễ của bài A đổ vào bài B.
//   3. setState sau khi component đã unmount (rời trang giữa lúc chờ AI).
// Ba ca dưới đây viết TRƯỚC khi sửa và đỏ trên mã cũ.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { CodeFeedbackResult } from '../../lib/programmingFeedback'
import AiHelpPanel from './AiHelpPanel'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const requestCodeFeedbackMock = vi.hoisted(() => vi.fn())
vi.mock('../../lib/programmingFeedback', async () => {
  const actual = await vi.importActual<typeof import('../../lib/programmingFeedback')>(
    '../../lib/programmingFeedback',
  )
  return { ...actual, requestCodeFeedback: requestCodeFeedbackMock }
})

/** Một lượt hỏi AI mà test tự quyết định lúc nào trả lời — để mô phỏng "response về trễ". */
function luotHoiChoSan() {
  let traLoi!: (r: CodeFeedbackResult) => void
  const promise = new Promise<CodeFeedbackResult>((resolve) => {
    traLoi = resolve
  })
  return { promise, traLoi }
}

describe('AiHelpPanel — vòng đời khi đổi bài / rời trang (AC-6)', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    requestCodeFeedbackMock.mockReset()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  function hien(lessonId: string, code = 'print(1)') {
    act(() => {
      root.render(<AiHelpPanel lessonId={lessonId} code={code} results={null} passed={false} />)
    })
  }

  async function chay() {
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  function chu() {
    return container.textContent ?? ''
  }

  function nutGoiY(): HTMLButtonElement {
    const found = Array.from(container.querySelectorAll('button')).find((b) =>
      (b.textContent ?? '').includes('Gợi ý bậc'),
    )
    if (!found) throw new Error('Không tìm thấy nút gợi ý')
    return found as HTMLButtonElement
  }

  it('đổi lessonId → bậc gợi ý về 1 và phần trả lời của bài cũ biến mất', async () => {
    requestCodeFeedbackMock.mockResolvedValue({
      ok: true,
      text: 'Gợi ý của BÀI A',
      hintLevel: 1,
    } satisfies CodeFeedbackResult)

    hien('p1-u1-l1')
    act(() => nutGoiY().click())
    await chay()
    expect(chu()).toContain('Gợi ý của BÀI A')
    expect(chu()).toContain('Gợi ý bậc 2/3') // đã lên bậc ở bài A

    hien('p1-u1-l2') // sang bài KHÁC, cùng instance component

    expect(chu()).not.toContain('Gợi ý của BÀI A')
    expect(chu()).toContain('Gợi ý bậc 1/3')
  })

  it('response TRỄ của bài cũ về sau khi đã sang bài mới → bị bỏ, không đổ vào bài mới', async () => {
    const luotA = luotHoiChoSan()
    requestCodeFeedbackMock.mockReturnValueOnce(luotA.promise)

    hien('p1-u1-l1')
    act(() => nutGoiY().click())
    await chay()

    hien('p1-u1-l2') // người học sang bài khác trong lúc AI còn đang nghĩ

    await act(async () => {
      luotA.traLoi({ ok: true, text: 'Gợi ý của BÀI A', hintLevel: 1 })
      await Promise.resolve()
    })

    expect(chu()).not.toContain('Gợi ý của BÀI A')
    expect(chu()).toContain('Gợi ý bậc 1/3')
  })

  it('unmount giữa lúc chờ AI → không setState sau unmount (không cảnh báo React)', async () => {
    const canhBao = vi.spyOn(console, 'error').mockImplementation(() => {})
    const luot = luotHoiChoSan()
    requestCodeFeedbackMock.mockReturnValueOnce(luot.promise)

    hien('p1-u1-l1')
    act(() => nutGoiY().click())
    await chay()

    act(() => root.unmount())
    root = createRoot(container) // để afterEach unmount lần nữa không lỗi

    await act(async () => {
      luot.traLoi({ ok: true, text: 'Gợi ý về muộn', hintLevel: 1 })
      await Promise.resolve()
    })

    expect(canhBao).not.toHaveBeenCalled()
    expect(chu()).not.toContain('Gợi ý về muộn')
  })

  it('CÙNG bài, chỉ đổi code (chạy lại) → giữ nguyên bậc gợi ý đã mở', async () => {
    requestCodeFeedbackMock.mockResolvedValue({
      ok: true,
      text: 'Gợi ý bậc 1',
      hintLevel: 1,
    } satisfies CodeFeedbackResult)

    hien('p1-u1-l1', 'print(1)')
    act(() => nutGoiY().click())
    await chay()
    expect(chu()).toContain('Gợi ý bậc 2/3')

    hien('p1-u1-l1', 'print(2)') // sửa code rồi chạy lại — vẫn là bài đó

    expect(chu()).toContain('Gợi ý bậc 2/3')
    expect(chu()).toContain('Gợi ý bậc 1')
  })
})
