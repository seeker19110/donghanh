// S05 — FillBlankQuiz dùng câu đã kiểm chứng: lọc trước cap, chấm theo id một lần, empty có lối ra.
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FillBlankQuiz } from './FillBlankQuiz'
import type { DictEntry } from '../../../types'

vi.mock('@dhcb/core-contracts/shuffle', () => ({ shuffle: <T,>(items: T[]) => [...items] }))

const e = (word: string, vi: string, ex_en: string, ex_vi = `Câu ${vi}.`): DictEntry => ({
  word,
  vi,
  pos: 'n',
  ex_en,
  ex_vi,
})
const words = [
  'apple',
  'river',
  'window',
  'garden',
  'pencil',
  'mountain',
  'teacher',
  'orange',
  'bridge',
  'candle',
]
const good = words.map((w, i) => e(w, `nghĩa ${i}`, `I see the ${w} now.`))
// Câu lỗi đặt TRƯỚC: "he" chỉ nằm trong "the" (từ con), "cat" xuất hiện hai lần.
const bad = [
  e('he', 'anh ấy', 'Look at the sky.'),
  e('cat', 'mèo', 'A cat and a cat.'),
  e('dog', 'chó', 'No match.'),
]

describe('FillBlankQuiz (S05)', () => {
  let container: HTMLDivElement
  let root: Root
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })
  const onExit = vi.fn()
  const render = (pool: DictEntry[], uiLang: 'vi' | 'en' = 'vi', isA = true) =>
    act(() => root.render(<FillBlankQuiz pool={pool} isA={isA} uiLang={uiLang} onExit={onExit} />))
  const buttons = () => [...container.querySelectorAll('button')]
  const optionButtons = () =>
    [...container.querySelectorAll('[role="group"] button')] as HTMLButtonElement[]
  const question = () => container.querySelector('p[tabindex="-1"]')!.textContent ?? ''

  it('lọc câu lỗi TRƯỚC khi cắt 8: câu lỗi đứng đầu pool không chiếm chỗ', () => {
    render([...bad, ...good])
    expect(container.textContent).toContain('1/8')
    expect(question()).toContain('I see the _____')
    expect(question()).not.toContain('Look at')
  })

  it('pool 4–7 câu hợp lệ: phiên đúng số câu, không đệm', () => {
    render([...bad, ...good.slice(0, 5)])
    expect(container.textContent).toContain('1/5')
  })

  it('dưới 4 câu hợp lệ: màn chưa đủ + nút về Luyện tập, không chấm điểm', () => {
    render([...bad, ...good.slice(0, 3)])
    expect(container.textContent).toContain('Chưa đủ câu ví dụ phù hợp')
    expect(container.textContent).not.toContain('/')
    const back = buttons().find((b) => b.textContent === 'Về Luyện tập')!
    act(() => back.click())
    expect(onExit).toHaveBeenCalled()
  })

  it('bấm hai lần trước khi render lại chỉ chấm một lần; phản hồi bằng chữ; focus sang nút tiếp', () => {
    render(good.slice(0, 4))
    let score = 0
    for (let i = 0; i < 4; i++) {
      const correct = good[i]!.word
      const target = optionButtons().find((b) => b.textContent === correct)!
      act(() => {
        target.click()
        target.click() // lần hai trong cùng tick — guard đồng bộ phải chặn
      })
      score++
      expect(container.querySelector('[role="status"]')!.textContent).toBe('Chính xác!')
      expect(document.activeElement?.textContent).toBe('Câu tiếp theo →')
      act(() => (document.activeElement as HTMLButtonElement).click())
      if (i < 3) expect(document.activeElement).toBe(container.querySelector('p[tabindex="-1"]'))
    }
    expect(container.textContent).toContain(`${score}/4`)
  })

  it('chọn sai: báo đáp án bằng chữ; đổi UI giữ nguyên options; Làm lại reset điểm', () => {
    render(good.slice(0, 4))
    const before = optionButtons().map((b) => b.textContent)
    const wrong = optionButtons().find((b) => b.textContent !== good[0]!.word)!
    act(() => wrong.click())
    expect(container.querySelector('[role="status"]')!.textContent).toBe('Chưa đúng. Đáp án: apple')
    render(good.slice(0, 4), 'en')
    expect(optionButtons().map((b) => b.textContent)).toEqual(before)
    expect(container.querySelector('[role="status"]')!.textContent).toBe('Not quite. Answer: apple')
    for (let i = 0; i < 4; i++) {
      if (i > 0)
        act(() =>
          optionButtons()
            .find((b) => b.textContent === good[i]!.word)!
            .click(),
        )
      act(() =>
        buttons()
          .find((b) => b.textContent === 'Next →')!
          .click(),
      )
    }
    expect(container.textContent).toContain('3/4')
    act(() =>
      buttons()
        .find((b) => b.textContent?.includes('Retry'))!
        .click(),
    )
    expect(container.textContent).toContain('1/4')
    expect(optionButtons().every((b) => !b.disabled)).toBe(true)
  })

  it('chiều B: câu và options mang lang="vi"', () => {
    const pool = ['táo', 'sông', 'cửa', 'vườn'].map((vi, i) =>
      e(words[i]!, vi, 'x', `Tôi thấy ${vi} ở đây.`),
    )
    render(pool, 'en', false)
    expect(question()).toContain('Tôi thấy _____')
    expect(container.querySelector('p[tabindex="-1"]')!.getAttribute('lang')).toBe('vi')
    expect(optionButtons().map((b) => b.getAttribute('lang'))).toEqual(['vi', 'vi', 'vi', 'vi'])
  })
})
