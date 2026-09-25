// Canh hồi quy cho component DÙNG CHUNG (spec S09 §2.7: "sửa component dùng chung phải kiểm hồi
// quy từng caller"). S09c chỉ thêm prop `landmark` cho bài hội thoại mẫu; Chat.tsx, Speaking.tsx
// và CefrLessonViews.tsx KHÔNG truyền prop này → phải giữ nguyên landmark `<main>` và nội dung.
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { EvaluationResult } from '../types'

// Thẻ chia sẻ vẽ canvas/QR + gọi mạng — không liên quan landmark, thay bằng khung rỗng.
vi.mock('./ShareResultCard', () => ({ default: () => null }))

import EvaluationResultView from './EvaluationResultView'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const DANH_GIA: EvaluationResult = {
  scores: { fluency: 6, lexical: 6.5, grammar: 5.5, overall: 6 },
  errors: [
    {
      original: 'I go to school yesterday',
      corrected: 'I went to school yesterday',
      explanation: 'Quá khứ',
    },
    {
      original: 'I go to school yesterday',
      corrected: 'I went to school yesterday',
      explanation: 'Lặp',
    },
  ],
  strengths: ['Phát âm rõ'],
  suggestions: ['Luyện thì quá khứ'],
  encouragement: 'Cố lên nhé!',
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('EvaluationResultView — tương thích ngược cho Chat/Speaking/CEFR', () => {
  it('không truyền `landmark` (cách Chat/Speaking/CEFR gọi) → vẫn là landmark <main>', () => {
    const onClose = vi.fn()
    act(() => root.render(<EvaluationResultView evaluation={DANH_GIA} onClose={onClose} dir="A" />))
    expect(container.querySelectorAll('main')).toHaveLength(1)
    // Nội dung và nút đóng giữ nguyên.
    expect(container.textContent).toContain('Cố lên nhé!')
    expect(container.textContent).toContain('I went to school yesterday')
    const nut = [...container.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Tiếp tục hội thoại'),
    )
    act(() => nut?.click())
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('`landmark={false}` (bài hội thoại mẫu nhúng) → không sinh <main> lồng, nội dung như cũ', () => {
    act(() =>
      root.render(
        <EvaluationResultView evaluation={DANH_GIA} onClose={() => {}} dir="B" landmark={false} />,
      ),
    )
    expect(container.querySelectorAll('main')).toHaveLength(0)
    expect(container.textContent).toContain('Cố lên nhé!')
    // Hai lỗi có `original` trùng nhau vẫn hiện đủ cả hai (không gộp, không suy lượt).
    expect(container.textContent?.match(/I go to school yesterday/g)).toHaveLength(2)
    expect(container.textContent).toContain('Continue conversation')
  })
})
