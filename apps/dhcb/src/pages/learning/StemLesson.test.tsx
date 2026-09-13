// Cổng cho hai trang bài học dùng chung của bốn môn STEM.
//
// Chạy trên DỮ LIỆU THẬT (registry của môn), không dựng dữ liệu giả: điều đáng canh ở đây là
// trang và nội dung còn khớp nhau hay không, mà dữ liệu giả thì không nói lên điều đó.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PHYSICS_LOADER } from '@dhcb/subject-physics/lessonsLoader'
import StemLessonList from './StemLessonList'
import StemLessonView from './StemLessonView'
import { duongDanBaiHoc } from '../../lib/stemLessonRoutes'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

vi.mock('../../components/Layout', () => ({ default: () => null }))

describe('trang bài học STEM', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function hien(duongDan: string, khuon: string, trang: React.ReactNode) {
    act(() => {
      root.render(
        <MemoryRouter initialEntries={[duongDan]}>
          <Routes>
            <Route path={khuon} element={trang} />
          </Routes>
        </MemoryRouter>,
      )
    })
  }

  it('danh sách in số bài lấy từ registry thật, không phải con số gõ tay', () => {
    hien('/mon-hoc/physics/bai-hoc', '/mon-hoc/:subjectId/bai-hoc', <StemLessonList />)
    expect(container.textContent).toContain(`${PHYSICS_LOADER.index.length} bài`)
    expect(container.textContent).toContain('Bài học môn Vật lí')
  })

  it('danh sách gom bài theo chương và đánh dấu bài có hoạt ảnh', () => {
    hien('/mon-hoc/physics/bai-hoc', '/mon-hoc/:subjectId/bai-hoc', <StemLessonList />)
    const baiLop10 = PHYSICS_LOADER.listCoreByGrade('10')
    expect(container.textContent).toContain(`Chương ${baiLop10[0]!.chapterNumber}`)
    expect(container.querySelectorAll('a').length).toBe(baiLop10.length)
    const soHoatAnh = baiLop10.filter((b) => b.hasAnimation).length
    expect(container.querySelectorAll('.sr-only').length).toBe(soHoatAnh)
  })

  it('chuyển sang nhánh học sinh giỏi thì hiện chuyên đề kèm cấp', () => {
    hien('/mon-hoc/physics/bai-hoc', '/mon-hoc/:subjectId/bai-hoc', <StemLessonList />)
    const nut = [...container.querySelectorAll('button')].find((b) =>
      b.textContent?.includes('Bồi dưỡng học sinh giỏi'),
    )!
    act(() => nut.click())
    expect(container.textContent).toContain('Cấp trường')
    expect(container.querySelectorAll('a').length).toBe(PHYSICS_LOADER.listAdvanced().length)
  })

  it('đổi lớp thì danh sách đổi theo', () => {
    hien('/mon-hoc/physics/bai-hoc', '/mon-hoc/:subjectId/bai-hoc', <StemLessonList />)
    const nut = [...container.querySelectorAll('button')].find((b) => b.textContent === 'Lớp 12')!
    act(() => nut.click())
    expect(container.querySelectorAll('a').length).toBe(PHYSICS_LOADER.listCoreByGrade('12').length)
  })

  it('mã môn lạ thì chuyển hướng chứ không dựng trang rỗng', () => {
    hien('/mon-hoc/khong-co/bai-hoc', '/mon-hoc/:subjectId/bai-hoc', <StemLessonList />)
    expect(container.textContent).not.toContain('Bài học môn')
  })

  it('trang bài nạp lười xong hiện đủ lý thuyết, ví dụ mẫu và thẻ ôn', async () => {
    const bai = (await PHYSICS_LOADER.loadLesson('ly10-c2-b10'))!
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={[duongDanBaiHoc('physics', bai.id, bai.title)]}>
          <Routes>
            <Route path="/mon-hoc/:subjectId/bai-hoc/:lessonSlug" element={<StemLessonView />} />
          </Routes>
        </MemoryRouter>,
      )
    })
    const chu = container.textContent ?? ''
    expect(chu).toContain(bai.title)
    expect(chu).toContain('Lý thuyết')
    expect(chu).toContain('Ví dụ mẫu')
    expect(chu).toContain(bai.workedExample.answer)
    expect(chu).toContain('Thẻ ôn tập')
    // Bài này có hoạt ảnh — mô tả bằng lời phải hiện cùng.
    expect(chu).toContain(bai.animation!.description)
  })

  it('chấm câu trắc nghiệm ngay tại chỗ và giải thích khi sai', async () => {
    const bai = (await PHYSICS_LOADER.loadLesson('ly10-c2-b10'))!
    const cau = bai.checkQuestions.find((q) => q.answer.kind === 'choice')!
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={[duongDanBaiHoc('physics', bai.id, bai.title)]}>
          <Routes>
            <Route path="/mon-hoc/:subjectId/bai-hoc/:lessonSlug" element={<StemLessonView />} />
          </Routes>
        </MemoryRouter>,
      )
    })

    const dapAnDung = cau.answer.kind === 'choice' ? cau.answer.correctIds[0] : ''
    const nutSai = cau.choices!.find((c) => c.id !== dapAnDung)!
    const nut = [...container.querySelectorAll('button')].find(
      (b) => b.textContent === nutSai.label,
    )!
    act(() => nut.click())

    expect(container.textContent).toContain('Chưa đúng.')
    expect(container.textContent).toContain(cau.explain)
  })

  it('bài không tồn tại thì nói rõ và mời quay lại danh sách', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/mon-hoc/physics/bai-hoc/ly10-c99-b99--khong-co']}>
          <Routes>
            <Route path="/mon-hoc/:subjectId/bai-hoc/:lessonSlug" element={<StemLessonView />} />
          </Routes>
        </MemoryRouter>,
      )
    })
    expect(container.textContent).toContain('Không tìm thấy bài học này')
  })
})
