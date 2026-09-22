// Cổng canh MỘT bất biến của CodeEditor: div host phải tự khai CẢ nền CẢ màu chữ cố định.
//
// Vì sao cần cổng riêng thay vì tin vào `e2e/a11y.spec.ts`: host render ra RỖNG, CodeMirror mới
// mount vào sau trong effect và tự tiêm style. Trong cửa sổ trước lúc đó, chữ thừa hưởng màu từ
// cha — ở theme nền sáng đó là màu TỐI trên nền `#0a0a0a`. Cửa sổ ấy hẹp nên cổng a11y chỉ bắt
// được khi máy bị tải (đã xảy ra thật: `/lap-trinh/du-an` theme=blue-sky, changelog 0416). Một
// cổng chỉ đỏ khi máy chậm thì không phải cổng. Test này đo tương phản của chính hai màu host
// khai, nên nó đỏ ngay lập tức nếu ai gỡ `text-[...]` hoặc đổi sang cặp màu mất tương phản.
import { describe, expect, it, vi } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { contrastRatio, parseCssColor } from '../../../../scripts/lib/contrast'
import CodeEditor from './CodeEditor'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// CodeMirror không chạy được trong jsdom (đòi đo layout thật), và test này KHÔNG quan tâm tới
// CodeMirror — chỉ quan tâm class trên host lúc render đầu, tức đúng lúc chưa có style editor.
vi.mock('codemirror', () => ({
  EditorView: class {
    static theme = () => []
    static updateListener = { of: () => [] }
    contentDOM = document.createElement('div')
    state = { doc: { toString: () => '' } }
    dispatch() {}
    destroy() {}
  },
  basicSetup: [],
}))

function colorFromClass(className: string, prefix: 'bg' | 'text'): string | null {
  const m = new RegExp(String.raw`(?:^|\s)${prefix}-\[(#[0-9a-fA-F]{3,8})\]`).exec(className)
  return m?.[1] ?? null
}

describe('CodeEditor — host tự khai nền và màu chữ cố định', () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  act(() => {
    createRoot(container).render(<CodeEditor value="" onChange={() => {}} ariaLabel="thử" />)
  })
  const cls = (container.firstElementChild as HTMLElement).className

  it('khai nền cố định bằng mã màu trần, KHÔNG dùng token theme', () => {
    expect(colorFromClass(cls, 'bg')).toBe('#0a0a0a')
  })

  it('khai LUÔN màu chữ cố định — thiếu nó là chữ tối trên nền tối ở theme nền sáng', () => {
    expect(colorFromClass(cls, 'text')).not.toBeNull()
  })

  it('cặp nền/chữ host khai đạt AA (≥ 4.5:1)', () => {
    const bg = parseCssColor(colorFromClass(cls, 'bg')!)
    const fg = parseCssColor(colorFromClass(cls, 'text')!)
    expect(bg).not.toBeNull()
    expect(fg).not.toBeNull()
    expect(contrastRatio(fg!, bg!)).toBeGreaterThanOrEqual(4.5)
  })
})
