import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import Placement from './Placement'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
const mocks = vi.hoisted(() => ({
  save: vi.fn<(payload: unknown) => Promise<{ ok: boolean }>>(),
  cache: vi.fn(),
  speed: vi.fn(),
}))
vi.mock('../../../components/Layout', () => ({ default: () => null }))
vi.mock('../../../context/useAuth', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }))
vi.mock('../../../lib/cloud', () => ({ saveOnboarding: mocks.save }))
vi.mock('../../../lib/placementResult', () => ({
  getPlacementResult: () => ({
    cefr: 'B1',
    appLevel: 'intermediate',
    lastAt: new Date().toISOString(),
  }),
  savePlacementResult: vi.fn(),
}))
vi.mock('../../../lib/onboarding', () => ({
  cacheOnboarding: mocks.cache,
  getCachedOnboarding: () => ({ goal: 'work', dailyMinutes: 20, ageGroup: 'thanh_nien' }),
  minutesToSpeed: () => 20,
}))
vi.mock('../../../lib/curriculum', () => ({ setDailySpeed: mocks.speed }))

describe('Placement lưu kết quả trung thực', () => {
  let root: Root, container: HTMLDivElement
  beforeEach(() => {
    localStorage.clear()
    mocks.save.mockReset().mockResolvedValue({ ok: true })
    mocks.cache.mockReset()
    mocks.speed.mockReset()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })
  function button(label: RegExp) {
    const found = [...container.querySelectorAll('button')].find((b) =>
      label.test(b.textContent ?? ''),
    )
    if (!found) throw new Error(`Không thấy nút ${label}`)
    return found
  }
  function start(direction: 'A' | 'B' = 'A') {
    localStorage.setItem('et_direction', direction)
    act(() =>
      root.render(
        <MemoryRouter initialEntries={['/placement']}>
          <Routes>
            <Route path="/placement" element={<Placement />} />
            <Route path="/cai-dat" element={<p>ĐÃ-VỀ-CÀI-ĐẶT</p>} />
          </Routes>
        </MemoryRouter>,
      ),
    )
    act(() => button(/Dùng kết quả này|Use this result/).click())
  }
  it.each(['A', 'B'] as const)(
    'chiều %s giữ kết quả khi POST lỗi, retry đúng payload rồi mới cache/nav',
    async (direction) => {
      mocks.save.mockResolvedValueOnce({ ok: false })
      start(direction)
      await act(async () => button(/Tiếp tục|Continue/).click())
      expect(container.querySelector('[role="alert"]')).not.toBeNull()
      expect(container.textContent).toContain('B1')
      expect(container.textContent).not.toContain('ĐÃ-VỀ-CÀI-ĐẶT')
      expect(mocks.cache).not.toHaveBeenCalled()
      expect(mocks.speed).not.toHaveBeenCalled()
      await act(async () => button(/Thử lưu lại|Retry saving/).click())
      expect(mocks.save.mock.calls[0]![0]).toEqual({
        level: 'intermediate',
        goal: 'work',
        dailyMinutes: 20,
        ageGroup: 'thanh_nien',
      })
      expect(mocks.save.mock.calls[1]![0]).toEqual(mocks.save.mock.calls[0]![0])
      expect(mocks.cache).toHaveBeenCalledTimes(1)
      expect(container.textContent).toContain('ĐÃ-VỀ-CÀI-ĐẶT')
    },
  )
  it('double-click một request, response sau unmount không cập nhật cache', async () => {
    let resolve!: (result: { ok: boolean }) => void
    mocks.save.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      }),
    )
    start()
    act(() => {
      const next = button(/Tiếp tục/)
      next.click()
      next.click()
    })
    expect(mocks.save).toHaveBeenCalledTimes(1)
    expect(button(/Đang lưu/).disabled).toBe(true)
    act(() => root.render(<p>ĐÃ-RỜI</p>))
    await act(async () => resolve({ ok: true }))
    expect(mocks.cache).not.toHaveBeenCalled()
    expect(container.textContent).toBe('ĐÃ-RỜI')
  })
})
