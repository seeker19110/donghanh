// Cổng cho chỗ GHÉP adapter cây STEM với dữ liệu của app (S07-2).
//
// Chạy trên registry THẬT của môn Vật lí và Sinh học: hai bẫy cần canh đều là bẫy DỮ LIỆU
// (Vật lí có chuyên đề HSG, Sinh học có 0 chuyên đề), mà dữ liệu giả thì không nói lên điều đó.
import { describe, it, expect, vi } from 'vitest'
import { PHYSICS_LOADER } from '@dhcb/subject-physics/lessonsLoader'
import { BIOLOGY_LOADER } from '@dhcb/subject-biology/lessonsLoader'
import { OutlineSchema } from '@dhcb/core-contracts/outline'
import { STEM_SUBJECTS } from '../stemLessonRoutes'
import { buildStemOutlineForApp, idChuongHsg, locNhanh } from './stemOutlineApp'

const LY = STEM_SUBJECTS.physics
const SINH = STEM_SUBJECTS.biology

describe('buildStemOutlineForApp', () => {
  it('cây hợp lệ theo hợp đồng và mỗi bài trỏ tới URL thật của trang bài học', () => {
    const cay = buildStemOutlineForApp(LY, '10')!
    expect(() => OutlineSchema.parse(cay)).not.toThrow()
    const la = cay.nodes.filter((n) => n.kind === 'lesson')
    expect(la.length).toBe(
      PHYSICS_LOADER.listCoreByGrade('10').length + PHYSICS_LOADER.listAdvanced().length,
    )
    expect(la.every((n) => n.href?.startsWith('/goc-hoc-tap/physics/bai-hoc/') === true)).toBe(true)
  })

  it('KHÔNG nạp nội dung bài nào để dựng cây (bất biến AC-6 của S07-1)', () => {
    const spy = vi.spyOn(PHYSICS_LOADER, 'loadLesson')
    buildStemOutlineForApp(LY, '10')
    expect(spy).toHaveBeenCalledTimes(0)
    spy.mockRestore()
  })

  it('bài có hoạt ảnh được đánh dấu bằng CHỮ, không phải bằng màu', () => {
    const cay = buildStemOutlineForApp(LY, '10')!
    const coHoatAnh = cay.nodes.filter((n) => n.hint?.includes('Có hoạt ảnh') === true)
    const soThat = PHYSICS_LOADER.listCoreByGrade('10').filter((b) => b.hasAnimation).length
    expect(coHoatAnh.length).toBeGreaterThanOrEqual(soThat)
    expect(soThat, 'ca test mất nghĩa nếu lớp 10 không còn bài nào có hoạt ảnh').toBeGreaterThan(0)
  })

  it('mọi bài STEM là "chưa đo được" — S07 KHÔNG bịa bằng chứng hoàn thành', () => {
    const cay = buildStemOutlineForApp(LY, '10')!
    expect(cay.nodes.every((n) => n.progress === 'unknown')).toBe(true)
  })

  it('lớp không có bài và môn không có chuyên đề → undefined, không dựng cây rỗng', () => {
    expect(buildStemOutlineForApp(SINH, '99')).toBeUndefined()
  })
})

describe('locNhanh — tách hai tab "chuẩn" và "bồi dưỡng HSG" từ MỘT cây', () => {
  it('nhánh chuẩn bỏ hẳn chương HSG và các bài của nó', () => {
    const cay = locNhanh(buildStemOutlineForApp(LY, '10'), 'physics', 'core')!
    expect(cay.nodes.some((n) => n.nodeId === idChuongHsg('physics'))).toBe(false)
    expect(cay.nodes.filter((n) => n.kind === 'lesson').length).toBe(
      PHYSICS_LOADER.listCoreByGrade('10').length,
    )
  })

  it('nhánh HSG chỉ còn chương bồi dưỡng, và bài mang nhãn cấp bằng chữ', () => {
    const cay = locNhanh(buildStemOutlineForApp(LY, '10'), 'physics', 'advanced')!
    expect(cay.nodes.filter((n) => n.kind === 'chapter').length).toBe(1)
    expect(cay.nodes.filter((n) => n.kind === 'lesson').length).toBe(
      PHYSICS_LOADER.listAdvanced().length,
    )
    expect(cay.nodes.some((n) => n.hint?.includes('Cấp') === true)).toBe(true)
  })

  it('môn KHÔNG có chuyên đề (Sinh học) → nhánh HSG là undefined, không khung rỗng', () => {
    expect(BIOLOGY_LOADER.listAdvanced().length, 'ca test mất nghĩa nếu Sinh có chuyên đề').toBe(0)
    expect(locNhanh(buildStemOutlineForApp(SINH, '10'), 'biology', 'advanced')).toBeUndefined()
  })

  it('không có cây thì trả undefined, không ném', () => {
    expect(locNhanh(undefined, 'physics', 'core')).toBeUndefined()
  })
})
