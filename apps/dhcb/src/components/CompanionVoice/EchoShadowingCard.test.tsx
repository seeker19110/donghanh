// Canh nhánh lỗi khi CHẤM lượt shadowing (2026-09-25). Lỗi tải danh sách bài mẫu đã có
// `useCatalogList` + `e2e/companion-catalog-states.spec.ts` canh (PR #1178); còn lượt chấm thì
// trước đây `if (res.ok)` + `console.error` → API lỗi là nút trở lại như chưa bấm, không một chữ
// nào báo cho người học.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import EchoShadowingCard from './EchoShadowingCard'
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const PASSAGE = {
  id: 'unit_passage',
  title: 'Bài mẫu — Giọng Mỹ',
  targetText: 'Stay hungry, stay foolish.',
  speakerAccent: 'us_standard',
  audioUrl: '/audio/unit.mp3',
  bpmPacing: 120,
  syllableCount: 6,
  difficulty: 'beginner',
  schemaVersion: 'v3.0.0',
}

const SESSION = {
  overallShadowingBand: 7.5,
  averageDriftLatencyMs: 410,
  rhythmSyncScore: 91,
  fluencyScore: 88,
  coachingFeedback: 'Giữ nhịp tốt.',
}

let container: HTMLDivElement
let root: Root

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status })
}

/** GET trả danh mục hợp lệ; POST (chấm lượt) do từng ca quyết định. */
function stubFetch(onPost: () => Promise<Response>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init?: RequestInit) =>
      init?.method === 'POST' ? onPost() : json({ passages: [PASSAGE] }),
    ),
  )
}

async function renderAndPractice() {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  await act(async () => {
    root.render(<EchoShadowingCard />)
  })
  const start = [...container.querySelectorAll('button')].find((b) =>
    b.textContent?.includes('Bắt đầu Luyện Shadowing'),
  )
  expect(start).toBeTruthy()
  await act(async () => {
    start?.click()
  })
  // Thẻ mô phỏng 4,5 giây thu âm rồi mới gửi lượt đi chấm.
  await act(async () => {
    await vi.advanceTimersByTimeAsync(4500)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('EchoShadowingCard — lỗi khi chấm lượt', () => {
  it('mất mạng: báo lỗi role=alert, không im lặng', async () => {
    stubFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    await renderAndPractice()
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Chưa chấm được lượt vừa rồi',
    )
  })

  it('máy chủ trả 500: cũng báo lỗi', async () => {
    stubFetch(async () => json({ error: 'x' }, 500))
    await renderAndPractice()
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Chưa chấm được lượt vừa rồi',
    )
  })

  it('chấm thành công: hiện kết quả, không có khung lỗi', async () => {
    stubFetch(async () => json({ session: SESSION }))
    await renderAndPractice()
    expect(container.querySelector('[role="alert"]')).toBeNull()
    expect(container.textContent).toContain('Band: 7.5')
  })
})
