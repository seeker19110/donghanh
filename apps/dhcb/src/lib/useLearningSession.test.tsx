// useLearningSession.test.tsx — hook khung phiên học: debounce, flush khi rời trang, hai tab.
//
// Bất biến canh ở đây (đặc tả §④ AC-7, §3.5):
//   - Owner chưa sẵn sàng (`null`) thì KHÔNG ghi gì cả.
//   - Ghi có debounce 500 ms, nhưng rời trang (`pagehide`) là ghi NGAY.
//   - Sự kiện `storage` của tab khác: bản mới hơn thì nhận, cũ hơn/bằng thì bỏ qua; tab nhận
//     KHÔNG ghi lại (không ping-pong).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { z } from 'zod'
import { __resetSessionMemory, sessionKey, type SessionOwner } from './learningSession'
import { SESSION_SAVE_DEBOUNCE_MS, useLearningSession } from './useLearningSession'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const account: SessionOwner = { kind: 'account', id: '42' }
const draftSchema = z.object({ code: z.string() })
type Draft = z.infer<typeof draftSchema>
const KEY = sessionKey({ owner: account, subjectId: 'programming', contentId: 'p1-u4-l1' })

type Api = ReturnType<typeof useLearningSession<Draft>>

// Giữ API của hook trong một ô nhớ (object) thay vì gán lại biến ngoài component — luật
// `react-hooks` cấm gán lại biến khai báo ngoài component/hook.
const hook: { api: Api | null } = { api: null }
const latest = () => hook.api

function Probe({ owner, paused }: { owner: SessionOwner | null; paused?: boolean }) {
  const api = useLearningSession<Draft>({
    owner,
    subjectId: 'programming',
    contentId: 'p1-u4-l1',
    contentVersion: 'v1',
    draftSchema,
    initial: () => ({ stepIndex: 0, draft: { code: 'starter' } }),
    ...(paused === undefined ? {} : { paused }),
  })
  // Ghi ra ô nhớ trong EFFECT, không phải lúc render (luật react-hooks).
  useEffect(() => {
    hook.api = api
  })
  return null
}

let container: HTMLDivElement
let root: Root

function mount(owner: SessionOwner | null = account, paused?: boolean) {
  act(() => root.render(<Probe owner={owner} {...(paused === undefined ? {} : { paused })} />))
}

/** Bản ghi do "tab khác" ghi thẳng vào localStorage. */
function writeFromOtherTab(code: string, updatedAt: number): string {
  const value = JSON.stringify({
    version: 1,
    subjectId: 'programming',
    contentId: 'p1-u4-l1',
    contentVersion: 'v1',
    owner: account,
    stepIndex: 2,
    draft: { code },
    startedAt: 1,
    updatedAt,
  })
  localStorage.setItem(KEY, value)
  return value
}

beforeEach(() => {
  localStorage.clear()
  __resetSessionMemory()
  hook.api = null
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

describe('useLearningSession', () => {
  it('owner null → status loading và KHÔNG ghi gì', () => {
    mount(null)
    expect(latest()?.status).toBe('loading')
    act(() => latest()?.setDraft({ code: 'go-khi-chua-dang-nhap' }))
    act(() => vi.advanceTimersByTime(SESSION_SAVE_DEBOUNCE_MS + 10))
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('có nháp cũ → status restored, đổ đúng bước và nháp', () => {
    writeFromOtherTab('da-go', Date.now() - 1_000)
    mount()
    expect(latest()?.status).toBe('restored')
    expect(latest()?.stepIndex).toBe(2)
    expect(latest()?.draft).toEqual({ code: 'da-go' })
  })

  it('ghi có debounce 500 ms: chưa tới hạn thì chưa ghi', () => {
    mount()
    expect(latest()?.status).toBe('fresh')
    act(() => latest()?.setDraft({ code: 'abc' }))
    act(() => vi.advanceTimersByTime(SESSION_SAVE_DEBOUNCE_MS - 1))
    expect(localStorage.getItem(KEY)).toBeNull()
    act(() => vi.advanceTimersByTime(2))
    expect(JSON.parse(localStorage.getItem(KEY) ?? '{}').draft).toEqual({ code: 'abc' })
  })

  it('pagehide flush NGAY, không chờ hết 500 ms', () => {
    mount()
    act(() => latest()?.setStep(3))
    act(() => {
      window.dispatchEvent(new Event('pagehide'))
    })
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    expect(saved.stepIndex).toBe(3)
  })

  it('tab khác ghi bản MỚI HƠN → nhận, và KHÔNG ghi lại', () => {
    mount()
    act(() => latest()?.setDraft({ code: 'cua-tab-A' }))
    act(() => vi.advanceTimersByTime(SESSION_SAVE_DEBOUNCE_MS + 10))
    const newer = writeFromOtherTab('cua-tab-B', Date.now() + 60_000)
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: newer }))
    })
    expect(latest()?.draft).toEqual({ code: 'cua-tab-B' })
    // Tab nhận không ghi lại: giá trị trong storage vẫn đúng nguyên văn bản của tab B.
    act(() => vi.advanceTimersByTime(SESSION_SAVE_DEBOUNCE_MS + 10))
    expect(localStorage.getItem(KEY)).toBe(newer)
  })

  it('tab khác ghi bản CŨ HƠN → bỏ qua, giữ nguyên chữ đang gõ', () => {
    mount()
    act(() => latest()?.setDraft({ code: 'cua-tab-A' }))
    act(() => vi.advanceTimersByTime(SESSION_SAVE_DEBOUNCE_MS + 10))
    const older = writeFromOtherTab('cu-hon', Date.now() - 60_000)
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: older }))
    })
    expect(latest()?.draft).toEqual({ code: 'cua-tab-A' })
  })

  it('bài đổi nội dung → stale, adoptStale dùng lại nháp cũ', () => {
    writeFromOtherTab('nhap-cu', Date.now() - 1_000)
    localStorage.setItem(
      KEY,
      (localStorage.getItem(KEY) ?? '').replace('"contentVersion":"v1"', '"contentVersion":"v0"'),
    )
    mount()
    expect(latest()?.status).toBe('stale')
    expect(latest()?.draft).toEqual({ code: 'starter' }) // KHÔNG prefill ngầm
    expect(latest()?.staleSession?.draft).toEqual({ code: 'nhap-cu' })
    act(() => latest()?.adoptStale())
    expect(latest()?.draft).toEqual({ code: 'nhap-cu' })
    expect(latest()?.staleSession).toBeNull()
  })

  it('paused: state vẫn đổi trên màn hình nhưng KHÔNG ghi xuống storage', () => {
    // Dùng khi bài đã xong (§7 Q6): nháp vừa bị xoá thì đừng để một lần bấm "Bước tiếp" làm
    // nó sống lại.
    mount(account, true)
    act(() => latest()?.setDraft({ code: 'go-sau-khi-da-xong' }))
    act(() => vi.advanceTimersByTime(SESSION_SAVE_DEBOUNCE_MS + 10))
    expect(latest()?.draft).toEqual({ code: 'go-sau-khi-da-xong' })
    expect(localStorage.getItem(KEY)).toBeNull()
    // Rời trang cũng không ghi.
    act(() => {
      window.dispatchEvent(new Event('pagehide'))
    })
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('clear() xoá nháp và trả state về mặc định', () => {
    mount()
    act(() => latest()?.setDraft({ code: 'xong-bai' }))
    act(() => vi.advanceTimersByTime(SESSION_SAVE_DEBOUNCE_MS + 10))
    expect(localStorage.getItem(KEY)).not.toBeNull()
    act(() => latest()?.clear())
    expect(localStorage.getItem(KEY)).toBeNull()
    expect(latest()?.draft).toEqual({ code: 'starter' })
  })
})
