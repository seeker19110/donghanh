import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
let root: Root
let container: HTMLDivElement
function render(node: ReactNode) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(node))
  return { rerender: (next: ReactNode) => act(() => root.render(next)) }
}
function cleanup() {
  act(() => root?.unmount())
  container?.remove()
}
const fireEvent = { click: (element: HTMLElement) => act(() => element.click()) }
const screen = {
  queryByRole: (_role: string, { name }: { name: string | RegExp }) =>
    [...container.querySelectorAll('button')].find((el) => {
      const text = el.getAttribute('aria-label') ?? el.textContent?.trim() ?? ''
      return typeof name === 'string' ? text === name : name.test(text)
    }) ?? null,
  getByRole: (role: string, opts: { name: string | RegExp }) => {
    const found = screen.queryByRole(role, opts)
    if (!found) throw new Error(`Missing button ${String(opts.name)}`)
    return found
  },
  getByText: (text: string | RegExp) => {
    const found = [...container.querySelectorAll('*')].find((el) =>
      typeof text === 'string' ? el.textContent?.trim() === text : text.test(el.textContent ?? ''),
    )
    if (!found) throw new Error(`Missing text ${String(text)}`)
    return found
  },
}

import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import PronunciationCheck from './PronunciationCheck'
import DetailedPronunciationCheck from './DetailedPronunciationCheck'
import { startListening } from '../lib/stt'
import { assessPronunciationClient } from '../lib/pronounceAssessApi'
import { startAudioRecording } from '../lib/audioRecorder'
import { pronounceFeedback } from '../lib/pronounceScore'

vi.mock('../lib/stt', () => ({ isSTTSupported: () => true, startListening: vi.fn(() => vi.fn()) }))
vi.mock('../lib/tts', () => ({ speak: vi.fn() }))
vi.mock('../lib/audioRecorder', () => ({
  isAudioRecordingSupported: () => true,
  startAudioRecording: vi.fn(),
  MAX_PRONOUNCE_RECORD_SEC: 30,
  AUDIO_REC_ERR_PERMISSION: 'permission',
}))
vi.mock('../lib/pronounceAssessApi', () => ({ assessPronunciationClient: vi.fn() }))
afterEach(cleanup)
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
})

it.each([
  [true, 'vi'],
  [true, 'en'],
  [false, 'vi'],
  [false, 'en'],
] as const)('direction %s, UI %s keeps STT and feedback independent', (isA, uiLang) => {
  const target = isA ? 'hello' : 'xin chào'
  render(<PronunciationCheck target={target} lang={isA ? 'en' : 'vi'} isA={isA} uiLang={uiLang} />)
  fireEvent.click(
    screen.getByRole('button', { name: uiLang === 'vi' ? 'Chấm phát âm' : 'Check pronunciation' }),
  )
  const args = vi.mocked(startListening).mock.calls[0]!
  expect(args[0]).toBe(isA ? 'en' : 'vi')
  act(() => args[2](target))
  expect(screen.getByText(new RegExp(pronounceFeedback(100, isA).label))).toBeTruthy()
  expect(screen.queryByRole('button', { name: /beta/ }) !== null).toBe(isA)
})
it('relocalizes both late and stored microphone errors without restarting recognition', () => {
  const props = { target: 'hello', lang: 'en' as const, isA: true }
  const { rerender } = render(<PronunciationCheck {...props} uiLang="vi" />)
  fireEvent.click(screen.getByRole('button', { name: 'Chấm phát âm' }))
  const args = vi.mocked(startListening).mock.calls[0]!
  rerender(<PronunciationCheck {...props} uiLang="en" />)
  act(() => args[2](''))
  expect(screen.getByText('Did not catch that, try again.')).toBeTruthy()
  rerender(<PronunciationCheck {...props} uiLang="vi" />)
  expect(screen.getByText('Không nghe rõ, thử lại nhé.')).toBeTruthy()
  expect(startListening).toHaveBeenCalledTimes(1)
})
it('preserves legacy default UI for WordCard callers', () => {
  render(<PronunciationCheck target="xin chào" lang="vi" isA={false} />)
  expect(screen.getByRole('button', { name: 'Check pronunciation' })).toBeTruthy()
})
it('uses current UI when detailed assessment returns, then relocalizes stored error', async () => {
  let finish!: (value: Awaited<ReturnType<typeof assessPronunciationClient>>) => void
  vi.mocked(assessPronunciationClient).mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve
      }),
  )
  vi.mocked(startAudioRecording).mockResolvedValue({
    stop: vi.fn(async () => ({ blob: new Blob(), durationMs: 500 })),
    cancel: vi.fn(),
  } as Awaited<ReturnType<typeof startAudioRecording>>)
  const { rerender } = render(<DetailedPronunciationCheck target="hello" isA uiLang="vi" />)
  await act(async () => fireEvent.click(screen.getByRole('button', { name: /beta/ })))
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Dừng ghi âm' })))
  rerender(<DetailedPronunciationCheck target="hello" isA uiLang="en" />)
  expect(screen.getByText('Scoring in detail...')).toBeTruthy()
  await act(async () =>
    finish({
      ok: false,
      fallback: false,
      errorCode: 'network',
      message: 'Không kết nối được máy chủ',
    }),
  )
  expect(
    screen.getByText('Cannot reach the server — check your connection and try again.'),
  ).toBeTruthy()
  rerender(<DetailedPronunciationCheck target="hello" isA uiLang="vi" />)
  expect(screen.getByText('Không kết nối được máy chủ — kiểm tra mạng rồi thử lại.')).toBeTruthy()
  expect(assessPronunciationClient).toHaveBeenCalledTimes(1)
})

import { Shadowing } from '../pages/learning/practice/Shadowing'
import { ReverseInterview } from '../pages/learning/practice/ReverseInterview'
import { PronounceList } from '../pages/learning/practice/PronounceList'
import { speak } from '../lib/tts'
import type { User } from '../types'
vi.mock('../pages/learning/practice/shared', () => ({
  SESSION_SIZE: 3,
  INTERVIEW_ROUNDS: 3,
  pickExampleSentences: (_pool: unknown, isA: boolean) =>
    isA
      ? ['I like tea', 'I like rice', 'I like books']
      : ['Tôi thích trà', 'Tôi thích cơm', 'Tôi thích sách'],
}))
vi.mock('../lib/ai', () => ({ callClaude: vi.fn(), parseJson: vi.fn() }))
it.each([
  [true, 'vi'],
  [true, 'en'],
  [false, 'vi'],
  [false, 'en'],
] as const)(
  'Shadowing direction %s UI %s preserves target and localizes late errors',
  (isA, uiLang) => {
    const pool: [] = []
    const { rerender } = render(
      <Shadowing pool={pool} isA={isA} uiLang={uiLang} onExit={() => {}} />,
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: uiLang === 'vi' ? 'Bắt đầu — nghe & nói đè theo' : 'Start — listen & speak along',
      }),
    )
    expect(speak).toHaveBeenCalledWith(
      isA ? 'I like tea' : 'Tôi thích trà',
      isA ? 'en-US' : 'vi-VN',
    )
    const args = vi.mocked(startListening).mock.calls[0]!
    expect(args[0]).toBe(isA ? 'en' : 'vi')
    rerender(<Shadowing pool={pool} isA={isA} uiLang="en" onExit={() => {}} />)
    act(() => args[2](''))
    expect(screen.getByText('Did not catch that, try again.')).toBeTruthy()
    rerender(<Shadowing pool={pool} isA={isA} uiLang="vi" onExit={() => {}} />)
    expect(screen.getByText('Không nghe rõ, thử lại nhé.')).toBeTruthy()
    expect(screen.getByText(isA ? 'I like tea' : 'Tôi thích trà')).toBeTruthy()
  },
)
it.each([
  [true, 'vi'],
  [true, 'en'],
  [false, 'vi'],
  [false, 'en'],
] as const)('Interview direction %s UI %s keeps recognition direction', (isA, uiLang) => {
  const user = { id: 'test', plan: 'free' } as User
  const { rerender } = render(
    <ReverseInterview user={user} isA={isA} uiLang={uiLang} onExit={() => {}} />,
  )
  fireEvent.click(
    screen.getByRole('button', {
      name: uiLang === 'vi' ? 'Trả lời bằng giọng nói' : 'Answer by voice',
    }),
  )
  const args = vi.mocked(startListening).mock.calls[0]!
  expect(args[0]).toBe(isA ? 'en' : 'vi')
  rerender(<ReverseInterview user={user} isA={isA} uiLang="en" onExit={() => {}} />)
  act(() => args[2](''))
  expect(screen.getByText('Did not catch that, try again.')).toBeTruthy()
  rerender(<ReverseInterview user={user} isA={isA} uiLang="vi" onExit={() => {}} />)
  expect(screen.getByText('Không nghe rõ, thử lại nhé.')).toBeTruthy()
})
it('PronounceList preserves second item on UI change', () => {
  const items = ['hello', 'goodbye']
  const { rerender } = render(
    <PronounceList items={items} isA lang="en" uiLang="vi" onExit={() => {}} />,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Tiếp theo →' }))
  rerender(<PronounceList items={items} isA lang="en" uiLang="en" onExit={() => {}} />)
  expect(screen.getByText('goodbye')).toBeTruthy()
  expect(screen.getByText('2/2')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Next →' })).toBeTruthy()
})

import { callClaude } from '../lib/ai'
import { interviewAnswerFeedbackPrompt } from '../prompts'
it('Interview pending grading error uses the current UI and keeps direction prompt', async () => {
  let reject!: (reason: Error) => void
  vi.mocked(callClaude).mockImplementation(
    () =>
      new Promise((_resolve, fail) => {
        reject = fail
      }),
  )
  const user = { id: 'test', plan: 'free' } as User
  const { rerender } = render(<ReverseInterview user={user} isA uiLang="vi" onExit={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: 'Trả lời bằng giọng nói' }))
  act(() => vi.mocked(startListening).mock.calls[0]![2]('I enjoy reading'))
  fireEvent.click(screen.getByRole('button', { name: 'AI chấm điểm' }))
  expect(callClaude).toHaveBeenCalledTimes(1)
  expect(vi.mocked(callClaude).mock.calls[0]![1]).toBe(interviewAnswerFeedbackPrompt('A'))
  rerender(<ReverseInterview user={user} isA uiLang="en" onExit={() => {}} />)
  expect(screen.getByRole('button', { name: 'Grading...' })).toBeTruthy()
  await act(async () => reject(new Error('provider unavailable')))
  expect(screen.getByText('Could not grade your answer — try again.')).toBeTruthy()
  rerender(<ReverseInterview user={user} isA uiLang="vi" onExit={() => {}} />)
  expect(screen.getByText('Không chấm được câu trả lời — thử lại.')).toBeTruthy()
  expect(callClaude).toHaveBeenCalledTimes(1)
})

it('Interview double activation starts one provider request', () => {
  vi.mocked(callClaude).mockImplementation(() => new Promise(() => {}))
  const user = { id: 'test', plan: 'free' } as User
  render(<ReverseInterview user={user} isA uiLang="vi" onExit={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: 'Trả lời bằng giọng nói' }))
  act(() => vi.mocked(startListening).mock.calls[0]![2]('I enjoy reading'))
  const grade = screen.getByRole('button', { name: 'AI chấm điểm' })
  act(() => {
    grade.click()
    grade.click()
  })
  expect(callClaude).toHaveBeenCalledTimes(1)
})
