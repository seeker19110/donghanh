import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VocabListenGuess } from './VocabListenGuess'
import { SentenceScramble } from './SentenceScramble'
import { DictationTyping } from './DictationTyping'
import { FillBlankQuiz } from './FillBlankQuiz'
import { GameResult } from './GameChrome'
import { speak } from '../../../lib/tts'
import type { DictEntry } from '../../../types'

vi.mock('../../../lib/tts', () => ({ speak: vi.fn() }))
vi.mock('@dhcb/core-contracts/shuffle', () => ({ shuffle: <T,>(items: T[]) => [...items] }))
const pool: DictEntry[] = ['cat', 'dog', 'bird', 'fish'].map((word, i) => ({
  word,
  vi: ['mèo', 'chó', 'chim', 'cá'][i]!,
  pos: 'n',
  ex_en: `I see a ${word}`,
  ex_vi: `Tôi thấy một con ${['mèo', 'chó', 'chim', 'cá'][i]}`,
}))
const matrix = [true, false].flatMap((isA) =>
  (['vi', 'en'] as const).map((uiLang) => ({ isA, uiLang })),
)

describe('S04 mini-games: UI độc lập chiều học', () => {
  let container: HTMLDivElement
  let root: Root
  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    vi.clearAllMocks()
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })
  function render(node: ReactNode) {
    act(() => root.render(node))
  }
  function click(text: string) {
    const button = [...container.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === text,
    )
    expect(button, text).toBeTruthy()
    act(() => button!.click())
  }
  function type(value: string) {
    const input = container.querySelector('input')!
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }
  const onExit = vi.fn()
  it.each(matrix)(
    'nghe đoán: $isA / $uiLang giữ options, audio và điểm khi đổi UI',
    ({ isA, uiLang }) => {
      const show = (lang: 'vi' | 'en') =>
        render(<VocabListenGuess pool={pool} isA={isA} uiLang={lang} onExit={onExit} />)
      show(uiLang)
      expect(speak).toHaveBeenLastCalledWith(isA ? 'cat' : 'mèo', isA ? 'en-US' : 'vi-VN')
      expect(container.textContent).toContain(uiLang === 'vi' ? 'Nghe lại' : 'Play again')
      click(isA ? 'mèo' : 'cat')
      const options = [...container.querySelectorAll('button:disabled')].map((b) => b.textContent)
      const calls = vi.mocked(speak).mock.calls.length
      const nextLang = uiLang === 'vi' ? 'en' : 'vi'
      show(nextLang)
      expect([...container.querySelectorAll('button:disabled')].map((b) => b.textContent)).toEqual(
        options,
      )
      expect(speak).toHaveBeenCalledTimes(calls)
      for (let i = 0; i < pool.length; i++) {
        if (i > 0) click(isA ? pool[i]!.vi : pool[i]!.word)
        click(nextLang === 'vi' ? 'Câu tiếp theo →' : 'Next →')
      }
      expect(container.textContent).toContain('4/4')
      click(nextLang === 'vi' ? 'Làm lại' : 'Retry')
      expect(container.textContent).toContain('1/4')
      expect(speak).toHaveBeenLastCalledWith(isA ? 'cat' : 'mèo', isA ? 'en-US' : 'vi-VN')
    },
  )
  it.each(matrix)('điền từ: $isA / $uiLang giữ câu và đáp án đã chọn', ({ isA, uiLang }) => {
    const show = (lang: 'vi' | 'en') =>
      render(<FillBlankQuiz pool={pool} isA={isA} uiLang={lang} onExit={onExit} />)
    show(uiLang)
    const sentence = isA ? 'I see a _____' : 'Tôi thấy một con _____'
    expect(container.textContent).toContain(sentence)
    click(isA ? 'cat' : 'mèo')
    const options = [...container.querySelectorAll('button:disabled')].map((b) => b.textContent)
    const lang = uiLang === 'vi' ? 'en' : 'vi'
    show(lang)
    expect(container.textContent).toContain(sentence)
    expect([...container.querySelectorAll('button:disabled')].map((b) => b.textContent)).toEqual(
      options,
    )
    for (let i = 0; i < pool.length; i++) {
      if (i > 0) click(isA ? pool[i]!.word : pool[i]!.vi)
      click(lang === 'vi' ? 'Câu tiếp theo →' : 'Next →')
    }
    expect(container.textContent).toContain('4/4')
  })
  it.each(matrix)('sắp xếp: $isA / $uiLang giữ câu đang ghép và locale', ({ isA, uiLang }) => {
    const show = (lang: 'vi' | 'en') =>
      render(<SentenceScramble pool={pool} isA={isA} uiLang={lang} onExit={onExit} />)
    show(uiLang)
    click(uiLang === 'vi' ? 'Nghe câu' : 'Listen')
    const target = isA ? pool[0]!.ex_en : pool[0]!.ex_vi
    expect(speak).toHaveBeenLastCalledWith(target, isA ? 'en-US' : 'vi-VN')
    click(target.split(' ')[0]!)
    const lang = uiLang === 'vi' ? 'en' : 'vi'
    show(lang)
    for (const word of target.split(' ').slice(1)) click(word)
    click(lang === 'vi' ? 'Kiểm tra' : 'Check')
    expect(container.textContent).toContain(lang === 'vi' ? 'Chính xác!' : 'Correct!')
    show(uiLang)
    expect(container.textContent).toContain(uiLang === 'vi' ? 'Chính xác!' : 'Correct!')
    expect(speak).toHaveBeenCalledTimes(1)
  })
  it.each(matrix)('chính tả: $isA / $uiLang giữ bản gõ và điểm', ({ isA, uiLang }) => {
    const show = (lang: 'vi' | 'en') =>
      render(<DictationTyping pool={pool} isA={isA} uiLang={lang} onExit={onExit} />)
    show(uiLang)
    const target = isA ? pool[0]!.ex_en : pool[0]!.ex_vi
    expect(speak).toHaveBeenLastCalledWith(target, isA ? 'en-US' : 'vi-VN')
    type(target)
    const lang = uiLang === 'vi' ? 'en' : 'vi'
    show(lang)
    expect(container.querySelector('input')!.value).toBe(target)
    expect(container.querySelector('input')!.placeholder).toBe(
      lang === 'vi' ? 'Gõ lại những gì bạn nghe được...' : 'Type what you heard...',
    )
    click(lang === 'vi' ? 'Kiểm tra' : 'Check')
    expect(container.textContent).toContain('100%')
    show(uiLang)
    expect(container.textContent).toContain('100%')
    expect(container.textContent).toContain(target)
    expect(speak).toHaveBeenCalledTimes(1)
  })
  it.each(matrix)('empty/result: $isA / $uiLang', ({ isA, uiLang }) => {
    for (const Component of [VocabListenGuess, SentenceScramble, DictationTyping, FillBlankQuiz]) {
      render(<Component pool={[]} isA={isA} uiLang={uiLang} onExit={onExit} />)
      expect(container.textContent).toContain(uiLang === 'vi' ? 'Chưa đủ' : 'Not enough')
    }
    render(<GameResult score={2} total={4} uiLang={uiLang} onRetry={() => {}} onExit={onExit} />)
    expect(container.textContent).toContain('2/4')
    expect(container.textContent).toContain(
      uiLang === 'vi' ? 'Điểm phiên luyện tập này' : 'Score for this session',
    )
    click(uiLang === 'vi' ? 'Về Luyện tập' : 'Back to Practice')
    expect(onExit).toHaveBeenCalled()
  })
})
