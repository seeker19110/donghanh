import { describe, it, expect, vi } from 'vitest'
import { OutlineSchema, type OutlineNode } from '@dhcb/core-contracts/outline'
import type { StemLessonLike, StemSubjectId } from '@dhcb/core-contracts/stemLesson'
import { MATH_LOADER } from '@dhcb/subject-math/lessonsLoader'
import { PHYSICS_LOADER } from '@dhcb/subject-physics/lessonsLoader'
import { CHEM_LOADER } from '@dhcb/subject-chemistry/lessonsLoader'
import { BIOLOGY_LOADER } from '@dhcb/subject-biology/lessonsLoader'
import type { StemLessonLoader } from '../stemLessonLoader.js'
import { buildStemOutline, type StemOutlineCtx } from './stemOutline.js'

// Chạy trên DỮ LIỆU THẬT của bốn môn (như StemLesson.test.tsx) — chỉ mục nhẹ, không nội dung.
const MON: Array<{ id: StemSubjectId; label: string; loader: StemLessonLoader<StemLessonLike> }> = [
  { id: 'mathematics', label: 'Toán', loader: MATH_LOADER as StemLessonLoader<StemLessonLike> },
  { id: 'physics', label: 'Vật lí', loader: PHYSICS_LOADER as StemLessonLoader<StemLessonLike> },
  { id: 'chemistry', label: 'Hoá học', loader: CHEM_LOADER as StemLessonLoader<StemLessonLike> },
  { id: 'biology', label: 'Sinh học', loader: BIOLOGY_LOADER as StemLessonLoader<StemLessonLike> },
]
const GRADES = ['10', '11', '12']

const ctxCua = (m: (typeof MON)[number]): StemOutlineCtx => ({
  loader: m.loader,
  subjectLabel: m.label,
  buildHref: (lesson) => `/goc-hoc-tap/${m.id}/bai-hoc/${lesson.id}`,
  tierLabel: (tier) => (tier === 'hsg-tinh' ? 'Cấp tỉnh' : (tier ?? '')),
})

const la = (nodes: readonly OutlineNode[]) => nodes.filter((n) => n.kind === 'lesson')

describe('buildStemOutline — dữ liệu thật bốn môn', () => {
  for (const m of MON) {
    it(`${m.label}: không rớt bài nào và cây hợp lệ`, () => {
      const cay = GRADES.map((g) => buildStemOutline(m.id, g, ctxCua(m))).filter(
        (o) => o !== undefined,
      )
      expect(cay.length).toBeGreaterThan(0)
      for (const outline of cay) OutlineSchema.parse(outline)

      // Bài chuẩn của mọi lớp + chuyên đề HSG (đếm MỘT lần) = toàn bộ chỉ mục của môn.
      const coreIds = new Set<string>()
      for (const outline of cay) {
        for (const node of la(outline.nodes)) {
          if (node.parentId?.endsWith('-hsg')) continue
          coreIds.add(node.contentId ?? '')
        }
      }
      const advanced = m.loader.listAdvanced().length
      expect(coreIds.size + advanced).toBe(m.loader.index.length)
    })

    it(`${m.label}: mọi bài là "chưa đo được" và mở`, () => {
      const outline = buildStemOutline(m.id, '10', ctxCua(m))
      expect(outline).toBeDefined()
      for (const node of outline!.nodes) {
        expect(node.progress).toBe('unknown')
        expect(node.availability).toBe('available')
      }
    })
  }

  it('gom chương theo SỐ chương, không theo tiêu đề chương (bẫy Hoá)', () => {
    // Hoá có nhiều chương trùng tiêu đề; số nút chapter phải bằng số `chapterNumber` khác nhau.
    const chem = MON[2]!
    for (const grade of GRADES) {
      const outline = buildStemOutline('chemistry', grade, ctxCua(chem))
      if (!outline) continue
      const soChuongThat = new Set(chem.loader.listCoreByGrade(grade).map((l) => l.chapterNumber))
        .size
      const nutChuong = outline.nodes.filter(
        (n) => n.kind === 'chapter' && n.contentId !== 'hsg',
      ).length
      expect(nutChuong).toBe(soChuongThat)
    }
  })

  it('nhánh HSG vắng hẳn khi môn không có chuyên đề (Sinh học)', () => {
    const bio = MON[3]!
    expect(bio.loader.listAdvanced()).toHaveLength(0)
    const outline = buildStemOutline('biology', '10', ctxCua(bio))
    expect(outline!.nodes.some((n) => n.contentId === 'hsg')).toBe(false)
  })

  it('nhánh HSG là một chương riêng, bài mang nhãn cấp', () => {
    const phys = MON[1]!
    const outline = buildStemOutline('physics', '10', ctxCua(phys))!
    const hsg = outline.nodes.find((n) => n.contentId === 'hsg')
    expect(hsg?.title).toBe('Bồi dưỡng học sinh giỏi')
    const conHsg = outline.nodes.filter((n) => n.parentId === hsg?.nodeId)
    expect(conHsg).toHaveLength(phys.loader.listAdvanced().length)
    expect(conHsg.every((n) => (n.hint ?? '') !== '')).toBe(true)
  })

  it('KHÔNG nạp nội dung bài để dựng cây (bất biến AC-6)', () => {
    const math = MON[0]!
    const spy = vi.spyOn(math.loader, 'loadLesson')
    buildStemOutline('mathematics', '11', ctxCua(math))
    expect(spy).toHaveBeenCalledTimes(0)
    spy.mockRestore()
  })

  it('lớp không có bài và môn không chuyên đề → undefined', () => {
    const bio = MON[3]!
    expect(buildStemOutline('biology', '99', ctxCua(bio))).toBeUndefined()
  })

  it('href do nơi gọi dựng, gắn đúng từng bài', () => {
    const math = MON[0]!
    const outline = buildStemOutline('mathematics', '10', ctxCua(math))!
    for (const node of la(outline.nodes)) {
      expect(node.href).toBe(`/goc-hoc-tap/mathematics/bai-hoc/${node.contentId}`)
    }
  })
})
