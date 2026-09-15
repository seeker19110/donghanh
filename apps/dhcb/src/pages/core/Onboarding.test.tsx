// Onboarding.test.tsx — cổng canh slice 04 (spec 03-04 §④ AC-4.5, AC-4.6): onboarding theo MÔN.
//
// Trước slice 04 mọi người mới đều bị hỏi trình độ CEFR + mục tiêu giao tiếp — tức onboarding
// của riêng Tiếng Anh — dù họ muốn học Toán. Nay bước đầu là "Bạn muốn học gì?".
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './Onboarding'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const saveOnboardingMock = vi.hoisted(() => vi.fn(async () => undefined))
const refreshMock = vi.hoisted(() => vi.fn(async () => undefined))
vi.mock('../../lib/cloud', () => ({ saveOnboarding: saveOnboardingMock }))
vi.mock('../../lib/analytics', () => ({ track: () => undefined }))
vi.mock('../../lib/onboarding', () => ({
  cacheOnboarding: () => undefined,
  minutesToSpeed: () => 10,
}))
vi.mock('../../lib/curriculum', () => ({ setDailySpeed: () => undefined }))
vi.mock('../../context/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1', name: 'An', onboarded: false }, refresh: refreshMock }),
}))
vi.mock('../../components/SubjectIllustration', () => ({ default: () => null }))

describe('Onboarding — chọn môn trước', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    saveOnboardingMock.mockClear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function hien() {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/onboarding']}>
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/goc-hoc-tap/mathematics" element={<p>TRANG-TOAN</p>} />
            <Route path="/goc-hoc-tap/english" element={<p>TRANG-TIENG-ANH</p>} />
            <Route path="/" element={<p>TRANG-CHU</p>} />
          </Routes>
        </MemoryRouter>,
      )
    })
  }

  function nut(re: RegExp): HTMLButtonElement {
    const b = Array.from(container.querySelectorAll('button')).find((x) =>
      re.test(x.textContent ?? ''),
    )
    if (!b) throw new Error(`Không thấy nút ${re}`)
    return b as HTMLButtonElement
  }

  async function chay() {
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  it('bước đầu là "Bạn muốn học gì?" với đủ 6 môn; chưa chọn thì chưa có bước nhóm tuổi', () => {
    hien()
    expect(container.textContent).toContain('Bạn muốn học gì?')
    for (const label of ['Tiếng Anh', 'Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Lập trình']) {
      expect(container.textContent, label).toContain(label)
    }
    expect(container.textContent).not.toContain('Bạn thuộc nhóm tuổi nào?')
  })

  it('chọn Toán → chỉ hỏi nhóm tuổi (1/1) rồi hoàn tất, tới trang môn Toán, API nhận giá trị mặc định', async () => {
    hien()
    act(() => nut(/Toán học/).click())
    expect(container.textContent).toContain('Bạn thuộc nhóm tuổi nào?')
    expect(container.textContent).toContain('Bước 1 / 1')
    expect(container.textContent).not.toContain('Trình độ')
    act(() => nut(/Bắt đầu học/).click())
    await chay()
    await chay()
    expect(saveOnboardingMock).toHaveBeenCalledTimes(1)
    expect(saveOnboardingMock.mock.calls[0]![0]).toMatchObject({
      level: 'beginner',
      goal: 'daily',
      dailyMinutes: 10,
      ageGroup: 'nguoi_lon',
    })
    expect(container.textContent).toContain('TRANG-TOAN')
  })

  it('chọn Tiếng Anh → luồng 4 bước như cũ (nhóm tuổi → trình độ …)', () => {
    hien()
    act(() => nut(/Tiếng Anh/).click())
    expect(container.textContent).toContain('Bước 1 / 4')
    act(() => nut(/Tiếp theo/).click())
    expect(container.textContent).toContain('Bước 2 / 4')
  })
})
