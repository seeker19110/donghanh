import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { resolveQuizKey, useQuizKeyboard, type QuizKeyInput } from './useQuizKeyboard.js'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

/** Trạng thái mặc định: 4 đáp án, chưa trả lời, không gõ chữ, không giữ phím bổ trợ. */
function input(over: Partial<QuizKeyInput> = {}): QuizKeyInput {
  return { key: '1', modified: false, typing: false, answered: false, optionCount: 4, ...over }
}

describe('resolveQuizKey', () => {
  it('phím 1..n chọn đúng đáp án tương ứng (đếm từ 0)', () => {
    expect(resolveQuizKey(input({ key: '1' }))).toEqual({ kind: 'pick', index: 0 })
    expect(resolveQuizKey(input({ key: '4' }))).toEqual({ kind: 'pick', index: 3 })
  })

  it('phím ngoài khoảng đáp án không làm gì', () => {
    // Ca biên hai đầu: '0' cho index âm, '4' vượt quá khi chỉ có 3 đáp án.
    expect(resolveQuizKey(input({ key: '0' }))).toBeNull()
    expect(resolveQuizKey(input({ key: '4', optionCount: 3 }))).toBeNull()
    expect(resolveQuizKey(input({ key: 'a' }))).toBeNull()
  })

  it('chuỗi rỗng và khoảng trắng KHÔNG bị Number() hiểu thành số 0', () => {
    // Bẫy thật của JavaScript: Number('') === 0 và Number(' ') === 0, nên nếu chỉ kiểm
    // Number.isInteger thì phím Space lúc chưa trả lời sẽ chọn nhầm đáp án thứ -1 hoặc 0.
    expect(resolveQuizKey(input({ key: ' ' }))).toBeNull()
    expect(resolveQuizKey(input({ key: '' }))).toBeNull()
  })

  it('khi CHƯA trả lời thì Enter/Space không nhảy câu', () => {
    // Chặn cố ý: bấm Enter theo quán tính sẽ bỏ qua câu hỏi mà chưa kịp đọc.
    expect(resolveQuizKey(input({ key: 'Enter' }))).toBeNull()
    expect(resolveQuizKey(input({ key: ' ' }))).toBeNull()
  })

  it('khi ĐÃ trả lời thì Enter và Space sang câu tiếp, phím số ngừng tác dụng', () => {
    expect(resolveQuizKey(input({ key: 'Enter', answered: true }))).toEqual({ kind: 'next' })
    expect(resolveQuizKey(input({ key: ' ', answered: true }))).toEqual({ kind: 'next' })
    expect(resolveQuizKey(input({ key: '2', answered: true }))).toBeNull()
  })

  it('bỏ qua khi người học đang gõ vào ô nhập', () => {
    // Lỗi kinh điển của phím tắt toàn trang: gõ "1" vào ô tìm kiếm lại nhảy sang câu khác.
    expect(resolveQuizKey(input({ typing: true }))).toBeNull()
    expect(resolveQuizKey(input({ key: 'Enter', answered: true, typing: true }))).toBeNull()
  })

  it('bỏ qua khi có phím bổ trợ (Ctrl+1 là lệnh đổi tab của trình duyệt)', () => {
    expect(resolveQuizKey(input({ modified: true }))).toBeNull()
  })
})

// ── Test hook useQuizKeyboard: lắp resolveQuizKey vào window.keydown thật ──────────────
function dispatchKey(key: string, opts: Partial<KeyboardEventInit> = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true, ...opts }))
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(async () => {
    root.unmount()
  })
  container.remove()
})

function Harness({
  optionCount,
  onPick,
  onNext,
  answered,
  enabled,
}: {
  optionCount: number
  onPick: (index: number) => void
  onNext?: () => void
  answered: boolean
  enabled?: boolean
}) {
  useQuizKeyboard({ optionCount, onPick, onNext, answered, enabled })
  return null
}

describe('useQuizKeyboard (hook)', () => {
  async function mountKeyboard(answered: boolean) {
    const onPick = vi.fn()
    const onNext = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} onNext={onNext} answered={answered} />)
    })
    return { onPick, onNext }
  }

  function press(target: EventTarget, key: string, opts: KeyboardEventInit = {}) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts })
    target.dispatchEvent(event)
    return event
  }

  it.each(['1', 'Enter', ' '])('bỏ repeat, modifier và IME cho phím %s', async (key) => {
    const { onPick, onNext } = await mountKeyboard(key !== '1')
    for (const opts of [
      { repeat: true },
      { ctrlKey: true },
      { altKey: true },
      { metaKey: true },
      { shiftKey: true },
      { isComposing: true },
    ]) {
      expect(press(window, key, opts).defaultPrevented).toBe(false)
    }
    expect(onPick).not.toHaveBeenCalled()
    expect(onNext).not.toHaveBeenCalled()
  })

  it.each(['1', 'Enter', ' '])('tôn trọng control đã preventDefault cho %s', async (key) => {
    const { onPick, onNext } = await mountKeyboard(key !== '1')
    const control = document.createElement('div')
    container.appendChild(control)
    control.addEventListener('keydown', (event) => event.preventDefault())
    expect(press(control, key).defaultPrevented).toBe(true)
    expect(onPick).not.toHaveBeenCalled()
    expect(onNext).not.toHaveBeenCalled()
  })

  it.each([
    '<button><span>Nghe lại</span></button>',
    '<a href="/exit"><span>Thoát</span></a>',
    '<details><summary><span>Mở</span></summary></details>',
    '<div role="button"><span>Mở</span></div>',
    '<div role="slider"><span>Âm lượng</span></div>',
    '<div tabindex="0"><span>Control</span></div>',
    '<button><svg><path /></svg></button>',
  ])('Enter/Space không chiếm control hoặc phần tử con: %s', async (markup) => {
    const { onNext } = await mountKeyboard(true)
    const host = document.createElement('div')
    host.innerHTML = markup
    container.appendChild(host)
    const target = host.querySelector('span, path')!
    expect(press(target, 'Enter').defaultPrevented).toBe(false)
    expect(press(target, ' ').defaultPrevented).toBe(false)
    expect(onNext).not.toHaveBeenCalled()
  })

  it('phím số vẫn chọn đáp án khi focus trong button', async () => {
    const { onPick, onNext } = await mountKeyboard(false)
    const button = document.createElement('button')
    container.appendChild(button)
    button.focus()
    expect(press(button, '3').defaultPrevented).toBe(true)
    expect(onPick).toHaveBeenCalledExactlyOnceWith(2)
    expect(onNext).not.toHaveBeenCalled()
  })

  it.each([
    '<input />',
    '<textarea></textarea>',
    '<select><option>1</option></select>',
    '<div contenteditable=""><span>Soạn thảo</span></div>',
    '<div contenteditable="plaintext-only"><span>Soạn thảo</span></div>',
    '<div role="textbox"><span>Soạn thảo</span></div>',
  ])('vùng nhập giữ cả phím số và Enter/Space: %s', async (markup) => {
    for (const answered of [false, true]) {
      const { onPick, onNext } = await mountKeyboard(answered)
      const host = document.createElement('div')
      host.innerHTML = markup
      container.appendChild(host)
      const target = host.querySelector('span') ?? host.firstElementChild!
      for (const key of ['1', 'Enter', ' ']) {
        expect(press(target, key).defaultPrevented).toBe(false)
      }
      expect(onPick).not.toHaveBeenCalled()
      expect(onNext).not.toHaveBeenCalled()
      host.remove()
    }
  })

  it.each(['<dialog open></dialog>', '<div role="dialog" aria-modal="true"></div>'])(
    'modal giữ phím, kể cả lúc focus chưa chuyển vào modal: %s',
    async (markup) => {
      for (const answered of [false, true]) {
        const { onPick, onNext } = await mountKeyboard(answered)
        const host = document.createElement('div')
        host.innerHTML = markup
        container.appendChild(host)
        for (const target of [window, host.firstElementChild!]) {
          for (const key of ['1', 'Enter', ' ']) {
            expect(press(target, key).defaultPrevented).toBe(false)
          }
        }
        expect(onPick).not.toHaveBeenCalled()
        expect(onNext).not.toHaveBeenCalled()
        host.remove()
      }
    },
  )

  it('modal đã đóng/ẩn không khóa shortcut', async () => {
    const { onPick } = await mountKeyboard(false)
    const host = document.createElement('div')
    host.innerHTML = '<dialog></dialog><div hidden><div aria-modal="true"></div></div>'
    container.appendChild(host)
    expect(press(window, '1').defaultPrevented).toBe(true)
    expect(onPick).toHaveBeenCalledExactlyOnceWith(0)
  })

  it('một event chỉ dispatch một lần qua nhiều listener và StrictMode', async () => {
    const first = vi.fn()
    const second = vi.fn()
    await act(async () => {
      root.render(
        <StrictMode>
          <Harness optionCount={4} onPick={first} answered={false} />
          <Harness optionCount={4} onPick={second} answered={false} />
        </StrictMode>,
      )
    })
    expect(press(window, '2').defaultPrevented).toBe(true)
    expect(first).toHaveBeenCalledExactlyOnceWith(1)
    expect(second).not.toHaveBeenCalled()
  })

  it('rerender dùng callback và trạng thái mới, không giữ listener cũ', async () => {
    const before = await mountKeyboard(false)
    const after = await mountKeyboard(true)
    expect(press(window, '2').defaultPrevented).toBe(false)
    expect(press(window, 'Enter').defaultPrevented).toBe(true)
    expect(before.onPick).not.toHaveBeenCalled()
    expect(before.onNext).not.toHaveBeenCalled()
    expect(after.onPick).not.toHaveBeenCalled()
    expect(after.onNext).toHaveBeenCalledTimes(1)
  })

  it('phím số gọi onPick với đúng chỉ số', async () => {
    const onPick = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered={false} />)
    })
    dispatchKey('2')
    expect(onPick).toHaveBeenCalledWith(1)
  })

  it('Enter khi đã trả lời gọi onNext', async () => {
    const onPick = vi.fn()
    const onNext = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} onNext={onNext} answered />)
    })
    dispatchKey('Enter')
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('không có onNext thì phím Enter không làm gì (không lỗi)', async () => {
    const onPick = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered />)
    })
    expect(() => dispatchKey('Enter')).not.toThrow()
  })

  it('preventDefault được gọi cho Space để không cuộn trang', async () => {
    const onPick = vi.fn()
    const onNext = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} onNext={onNext} answered />)
    })
    const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
    const spy = vi.spyOn(event, 'preventDefault')
    await act(async () => {
      window.dispatchEvent(event)
    })
    expect(spy).toHaveBeenCalled()
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('phím không khớp hành động nào thì không gọi callback, không preventDefault', async () => {
    const onPick = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered={false} />)
    })
    const event = new KeyboardEvent('keydown', { key: 'z', cancelable: true })
    const spy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)
    expect(onPick).not.toHaveBeenCalled()
    expect(spy).not.toHaveBeenCalled()
  })

  it('enabled=false thì không gắn listener nào — phím số không có tác dụng', async () => {
    const onPick = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered={false} enabled={false} />)
    })
    dispatchKey('1')
    expect(onPick).not.toHaveBeenCalled()
  })

  it.each([
    ['INPUT', () => document.createElement('input')],
    ['TEXTAREA', () => document.createElement('textarea')],
    ['SELECT', () => document.createElement('select')],
  ])('đang gõ vào thẻ %s → phím số bị bỏ qua (isTypingTarget)', async (_tag, makeEl) => {
    const onPick = vi.fn()
    const el = makeEl()
    document.body.appendChild(el)
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered={false} />)
    })
    // Dispatch trực tiếp trên `el` để keydown nổi bọt lên window với đúng target là ô nhập.
    el.dispatchEvent(new KeyboardEvent('keydown', { key: '1', cancelable: true, bubbles: true }))
    expect(onPick).not.toHaveBeenCalled()
    el.remove()
  })

  it('đang gõ vào phần tử contentEditable → phím số bị bỏ qua', async () => {
    const onPick = vi.fn()
    const el = document.createElement('div')
    el.contentEditable = 'true'
    document.body.appendChild(el)
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered={false} />)
    })
    el.dispatchEvent(new KeyboardEvent('keydown', { key: '1', cancelable: true, bubbles: true }))
    expect(onPick).not.toHaveBeenCalled()
    el.remove()
  })

  it('gõ trên phần tử KHÔNG phải ô nhập (div thường) → phím số vẫn có tác dụng', async () => {
    const onPick = vi.fn()
    const el = document.createElement('div')
    document.body.appendChild(el)
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered={false} />)
    })
    el.dispatchEvent(new KeyboardEvent('keydown', { key: '1', cancelable: true, bubbles: true }))
    expect(onPick).toHaveBeenCalledWith(0)
    el.remove()
  })

  it('unmount gỡ listener — phím số không còn tác dụng sau khi gỡ', async () => {
    const onPick = vi.fn()
    await act(async () => {
      root.render(<Harness optionCount={4} onPick={onPick} answered={false} />)
    })
    dispatchKey('1')
    expect(onPick).toHaveBeenCalledTimes(1)

    await act(async () => {
      root.unmount()
    })
    dispatchKey('1')
    // Vẫn chỉ 1 lần gọi từ trước khi unmount — listener đã bị gỡ.
    expect(onPick).toHaveBeenCalledTimes(1)
  })
})
