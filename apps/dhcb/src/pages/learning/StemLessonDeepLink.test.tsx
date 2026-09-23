import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useNavigate, type NavigateFunction } from 'react-router-dom'
import { PHYSICS_LOADER } from '@dhcb/subject-physics/lessonsLoader'
import StemLessonView from './StemLessonView'

Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)

vi.mock('../../components/Layout', () => ({ default: () => null }))

const path = '/goc-hoc-tap/physics/bai-hoc/ly10-c1-b1'
let navigate: NavigateFunction
function Navigation() {
  const go = useNavigate()
  useEffect(() => {
    navigate = go
  }, [go])
  return null
}

describe('liên kết câu STEM sau khi tải nội dung', () => {
  let container: HTMLDivElement
  let root: Root
  const scroll = vi.fn()

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(scroll)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
    scroll.mockClear()
  })

  async function open(hash: string) {
    await PHYSICS_LOADER.loadLesson('ly10-c1-b1')
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={[`${path}${hash}`]}>
          <Navigation />
          <Routes>
            <Route
              path="/goc-hoc-tap/:subjectId/bai-hoc/:lessonSlug"
              element={<StemLessonView />}
            />
          </Routes>
        </MemoryRouter>,
      )
    })
  }

  it('deep link thật focus câu sau loader, không chỉ tạo href', async () => {
    await open('#cau-2')
    expect(document.activeElement?.id).toBe('cau-2')
    expect(document.activeElement?.textContent).toContain('Câu 2.')
    expect(scroll).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' })
  })

  it('hash navigation và Back giữ đáp án đã chọn', async () => {
    await open('#cau-1')
    const choice = container
      .querySelector<HTMLButtonElement>('#cau-1')
      ?.parentElement?.querySelector('button')
    expect(choice).toBeTruthy()
    act(() => choice!.click())
    expect(choice!.getAttribute('aria-pressed')).toBe('true')
    await act(async () => navigate('#cau-2'))
    expect(document.activeElement?.id).toBe('cau-2')
    expect(choice!.getAttribute('aria-pressed')).toBe('true')
    await act(async () => navigate(-1))
    expect(document.activeElement?.id).toBe('cau-1')
    expect(choice!.getAttribute('aria-pressed')).toBe('true')
  })

  it.each(['', '#tra-loi-1', '#khac'])('không chiếm focus của hash ngoài câu: %s', async (hash) => {
    await open(hash)
    expect(document.activeElement).toBe(document.body)
    expect(scroll).not.toHaveBeenCalled()
  })

  it.each(['#cau-999', '#cau-0', '#cau-%E0%A4%A'])(
    'hash %s không tồn tại về tiêu đề bài',
    async (hash) => {
      await open(hash)
      expect(document.activeElement?.tagName).toBe('H1')
      expect(document.activeElement?.textContent).toContain('Làm quen với Vật lí')
    },
  )
})
