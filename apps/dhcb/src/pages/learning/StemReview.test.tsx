import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from 'react-router-dom'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import type { StemSrsCard } from '../../lib/stemSrs'
import StemReview from './StemReview'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const mocks = vi.hoisted(() => ({
  uid: 'u1',
  hydrate: vi.fn<() => Promise<StemSrsCard[]>>(),
  rate: vi.fn(),
}))
vi.mock('../../components/Layout', () => ({ default: () => null }))
vi.mock('../../context/useAuth', () => ({ useAuth: () => ({ user: { id: mocks.uid } }) }))
vi.mock('../../lib/stemSrs', async (original) => ({
  ...(await original<typeof import('../../lib/stemSrs')>()),
  hydrateStemCards: mocks.hydrate,
  reviewStemCard: mocks.rate,
}))

function deferred() {
  let resolve!: (cards: StemSrsCard[]) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<StemSrsCard[]>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}
function card(subjectId: 'physics' | 'chemistry', suffix = '0'): StemSrsCard {
  return {
    key: `stem:${subjectId}:l1:${suffix}`,
    subjectId,
    lessonId: 'l1',
    lessonTitle: 'Bài mẫu',
    index: Number(suffix),
    hoi: `Câu ${subjectId} ${suffix}`,
    dap: 'Đáp mẫu',
  }
}

describe('StemReview cô lập phiên theo người học, môn và cap', () => {
  let root: Root
  let container: HTMLDivElement
  let navigate: NavigateFunction
  function Controls() {
    navigate = useNavigate()
    return null
  }
  function render() {
    act(() =>
      root.render(
        <MemoryRouter initialEntries={['/goc-hoc-tap/physics/on-tap?cap=1']}>
          <Controls />
          <Routes>
            <Route path="/goc-hoc-tap/:subjectId/on-tap" element={<StemReview />} />
          </Routes>
        </MemoryRouter>,
      ),
    )
  }
  function click(label: string) {
    const button = [...container.querySelectorAll('button')].find((b) =>
      b.textContent?.includes(label),
    )
    expect(button).toBeDefined()
    act(() => button!.click())
  }
  beforeEach(() => {
    mocks.uid = 'u1'
    mocks.hydrate.mockReset()
    mocks.rate.mockReset()
    localStorage.clear()
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each(['route', 'user', 'cap'] as const)(
    'đổi %s ẩn thẻ cũ, reset mặt đáp án và chỉ chấm phiên mới',
    async (change) => {
      const first = deferred(),
        next = deferred()
      mocks.hydrate.mockReturnValueOnce(first.promise).mockReturnValueOnce(next.promise)
      render()
      await act(async () => first.resolve([card('physics')]))
      click('Xem đáp án')
      expect(container.textContent).toContain('Đáp mẫu')
      if (change === 'user') {
        mocks.uid = 'u2'
        render()
      } else
        act(() =>
          navigate(
            change === 'route'
              ? '/goc-hoc-tap/chemistry/on-tap?cap=1'
              : '/goc-hoc-tap/physics/on-tap?cap=2',
          ),
        )
      expect(container.textContent).toContain('Đang tải thẻ')
      expect(container.textContent).not.toContain('Câu physics')
      expect(container.textContent).not.toContain('Đáp mẫu')
      expect(mocks.rate).not.toHaveBeenCalled()
      const current = card(change === 'route' ? 'chemistry' : 'physics', '1')
      await act(async () => next.resolve([current]))
      expect(container.textContent).toContain(current.hoi)
      click('Xem đáp án')
      click('Nhớ được')
      expect(mocks.rate).toHaveBeenCalledExactlyOnceWith(mocks.uid, current.key, 'good')
      expect(container.textContent).toContain('Xong phiên ôn')
      expect(mocks.hydrate).toHaveBeenCalledTimes(2)
    },
  )

  it('response môn cũ đến muộn không thay hàng đợi môn mới', async () => {
    const old = deferred(),
      current = deferred()
    mocks.hydrate.mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise)
    render()
    act(() => navigate('/goc-hoc-tap/chemistry/on-tap?cap=1'))
    await act(async () => current.resolve([card('chemistry')]))
    await act(async () => old.resolve([card('physics')]))
    expect(container.textContent).toContain('Câu chemistry')
    expect(container.textContent).not.toContain('Câu physics')
  })

  it('lỗi hydrate có retry, không hiện thẻ cũ và phiên rỗng có đường về bài học', async () => {
    const first = deferred(),
      retry = deferred()
    mocks.hydrate.mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise)
    render()
    await act(async () => first.reject(new Error('offline')))
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('Không tải được')
    click('Tải lại thẻ')
    expect(container.textContent).toContain('Đang tải thẻ')
    await act(async () => retry.resolve([]))
    expect(container.textContent).toContain('Hôm nay không có thẻ nào tới hạn')
    expect(container.textContent).toContain('Xem bài học môn Vật lí')
    expect(mocks.rate).not.toHaveBeenCalled()
  })
})
