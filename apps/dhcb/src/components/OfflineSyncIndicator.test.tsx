// OfflineSyncIndicator.test.tsx — dải báo trạng thái đọc HÀNG ĐỢI THẬT (S09-2, AC-13/AC-17).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const UID = '11111111-1111-4111-8111-111111111111'
vi.mock('../context/useAuth', () => ({ useAuth: () => ({ user: { id: UID } }) }))
vi.mock('@core/authHeader', () => ({ getAuthHeader: () => ({}) }))

import OfflineSyncIndicator from './OfflineSyncIndicator'
import { enqueue, flush, __resetOutboxForTests, registerKindHandler } from '../lib/syncOutbox'

let container: HTMLDivElement
let root: Root

function setOnline(value: boolean): void {
  Object.defineProperty(navigator, 'onLine', { value, configurable: true })
}

async function mount(): Promise<void> {
  await act(async () => {
    root.render(<OfflineSyncIndicator />)
  })
}

beforeEach(() => {
  localStorage.clear()
  __resetOutboxForTests()
  registerKindHandler('english', { buildRequest: () => ({ url: '/api/progress', body: {} }) })
  setOnline(true)
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
  __resetOutboxForTests()
})

describe('OfflineSyncIndicator', () => {
  it('có mạng + hàng đợi rỗng → không hiện gì (0 DOM)', async () => {
    await mount()
    expect(container.textContent).toBe('')
  })

  it('mất mạng + có mục chờ → hiện đúng SỐ MỤC THẬT trong hàng đợi', async () => {
    setOnline(false)
    enqueue(UID, 'english')
    enqueue(UID, 'evidence', { id: 'e1' })
    await mount()
    expect(container.textContent).toContain('2 mục chờ đồng bộ')
    expect(container.querySelector('[role="status"]')).not.toBeNull()
  })

  it('hết phiên đăng nhập (401) → nói rõ phải đăng nhập lại, không im lặng', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('unauthorized', { status: 401 })),
    )
    enqueue(UID, 'english')
    await act(async () => {
      await flush(UID)
    })
    await mount()
    expect(container.textContent).toContain('đăng nhập lại')
  })

  it('hàng đợi của chủ KHÁC đổi → dải này không đổi số', async () => {
    setOnline(false)
    enqueue(UID, 'english')
    await mount()
    expect(container.textContent).toContain('1 mục chờ đồng bộ')
    await act(async () => {
      enqueue('22222222-2222-4222-8222-222222222222', 'english')
    })
    expect(container.textContent).toContain('1 mục chờ đồng bộ')
  })
})
