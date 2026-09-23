import { afterEach, describe, expect, it, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'

const { reviewGrammar, bumpDailyQuizPasses } = vi.hoisted(() => ({
  reviewGrammar: vi.fn(),
  bumpDailyQuizPasses: vi.fn(),
}))
vi.mock('../../lib/quizSession', () => ({
  loadQuizSession: () => null,
  saveQuizSession: vi.fn(),
  clearQuizSession: vi.fn(),
}))
vi.mock('./quizBuilders', () => ({
  buildQuiz: () => [
    {
      kind: 'grammar',
      prompt: 'A long sentence?',
      correct: 'Right answer',
      options: ['Wrong answer', 'Right answer'],
      lessonId: 'lesson-1',
    },
  ],
}))
vi.mock('../../lib/srs', () => ({ reviewGrammar: (...args: unknown[]) => reviewGrammar(...args) }))
vi.mock('../../lib/curriculum', () => ({
  getDailyLearned: () => 0,
  getDailyMax: () => 0,
  getDailySpeed: () => 0,
  bumpDailyQuizPasses: (...args: unknown[]) => bumpDailyQuizPasses(...args),
  isQuizPass: () => false,
  QUIZ_PASS_THRESHOLD_PCT: 80,
}))
vi.mock('../../lib/haptics', () => ({ haptics: { success: vi.fn() }, vibrate: vi.fn() }))
vi.mock('../../lib/sound', () => ({ sound: { correct: vi.fn(), wrong: vi.fn() } }))
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../ShareResultCard', () => ({ default: () => null }))
vi.mock('../../lib/shareContent', () => ({ buildQuizShareContent: () => ({}) }))

import { QuizTab } from './QuizTab'

let root: Root | undefined
let host: HTMLDivElement | undefined
afterEach(() => {
  if (root) act(() => root?.unmount())
  host?.remove()
  root = undefined
  host = undefined
  reviewGrammar.mockClear()
  bumpDailyQuizPasses.mockClear()
})

function mountQuiz() {
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  act(() =>
    root?.render(
      <QuizTab
        uid="student"
        isA
        pool={[]}
        grammarPool={[]}
        onOpenLesson={vi.fn()}
        sessionScope="test"
      />,
    ),
  )
  return host
}

function click(button: HTMLButtonElement) {
  act(() => button.click())
}

describe('QuizTab answer contract', () => {
  it('does not grade before selection or grade twice after double activation', () => {
    const view = mountQuiz()
    expect(view.querySelector('h2')?.textContent).toContain('A long sentence?')
    expect(view.querySelector('[role="group"]')).not.toBeNull()
    const options = [...view.querySelectorAll<HTMLButtonElement>('[role="group"] button')]
    click(options[0]!)
    click(options[1]!)
    expect(options[0]?.getAttribute('aria-pressed')).toBe('true')
    expect(options[1]?.getAttribute('aria-disabled')).toBe('true')
    expect(view.textContent).toContain('Chưa đúng')
    expect(view.textContent).toContain('Đáp án đúng: Right answer')
    const next = [...view.querySelectorAll<HTMLButtonElement>('button')].find((button) =>
      button.textContent?.includes('Xem kết quả'),
    )!
    act(() => {
      next.click()
      next.click()
    })
    expect(reviewGrammar).toHaveBeenCalledTimes(1)
    expect(bumpDailyQuizPasses).not.toHaveBeenCalled()
    expect(view.querySelector('h2')?.textContent).toBe('0/1')
    expect(document.activeElement).toBe(view.querySelector('h2'))
    expect(view.textContent).toContain('A long sentence?')
    expect(view.textContent).toContain('Right answer')
  })
})
