import { describe, it, expect, vi } from 'vitest'
import { OutlineSchema } from '@dhcb/core-contracts/outline'
import { PROGRAMMING_LEVELS, nhomUnitTheoTrack } from '@dhcb/subject-programming/curriculum'
import { getShortCourse } from '@dhcb/subject-programming/courses/registry'
import * as lessonsLoader from '@dhcb/subject-programming/lessonsLoader'
import type { LevelLockInfo } from '@dhcb/subject-programming/levelLock'
import {
  buildCourseOutline,
  buildLevelOutline,
  type ProgrammingOutlineCtx,
} from './programmingOutline'

const CTX_RONG: ProgrammingOutlineCtx = {
  progress: [],
  progressState: 'ready',
  lockMap: new Map<string, LevelLockInfo>(),
}

const la = (outline: { nodes: readonly { kind: string }[] }) =>
  outline.nodes.filter((n) => n.kind === 'lesson')

describe('buildLevelOutline', () => {
  it('bậc lạ trả undefined, không ném', () => {
    expect(buildLevelOutline('p9', CTX_RONG)).toBeUndefined()
  })

  it('mọi bậc P1–P6 dựng được cây hợp lệ, đủ unit và đủ bài của chỉ mục', () => {
    for (const level of PROGRAMMING_LEVELS) {
      const outline = buildLevelOutline(level.id, CTX_RONG)!
      OutlineSchema.parse(outline)
      const nutUnit = outline.nodes.filter(
        (n) => n.kind === 'chapter' && n.contentId?.includes('-u'),
      )
      expect(nutUnit).toHaveLength(level.units.length)
      const soBaiThat = level.units.reduce(
        (sum, u) => sum + lessonsLoader.getUnitSummaries(u.id).length,
        0,
      )
      expect(la(outline)).toHaveLength(soBaiThat)
    }
  })

  it('P6 có thêm tầng MẠCH, P1 thì không', () => {
    const p6 = buildLevelOutline('p6', CTX_RONG)!
    const mach = p6.nodes.filter((n) => n.nodeId.includes('-track-'))
    expect(mach).toHaveLength(nhomUnitTheoTrack(PROGRAMMING_LEVELS[5]!.units).length)
    expect(mach.length).toBeGreaterThan(1)
    // 65 unit của P6 vẫn còn đủ, chỉ là nằm dưới mạch.
    const nutUnit = p6.nodes.filter((n) => n.kind === 'chapter' && n.contentId?.startsWith('p6-u'))
    expect(nutUnit).toHaveLength(PROGRAMMING_LEVELS[5]!.units.length)
    expect(nutUnit.every((n) => n.parentId?.includes('-track-'))).toBe(true)

    const p1 = buildLevelOutline('p1', CTX_RONG)!
    expect(p1.nodes.some((n) => n.nodeId.includes('-track-'))).toBe(false)
    expect(
      p1.nodes.filter((n) => n.kind === 'chapter').every((n) => n.parentId === 'level:p1'),
    ).toBe(true)
  })

  it('hôm nay không unit nào rỗng — mọi nút chương đều có bài', () => {
    // Canh dữ liệu: nếu sau này có unit chưa soạn bài, nó phải hiện "sắp mở" (xem
    // programmingOutlineEmptyUnit.test.ts dựng đúng ca đó bằng chỉ mục giả).
    for (const level of PROGRAMMING_LEVELS) {
      const outline = buildLevelOutline(level.id, CTX_RONG)!
      for (const node of outline.nodes) {
        if (node.kind !== 'chapter' || node.nodeId.includes('-track-')) continue
        const coCon = outline.nodes.some((n) => n.parentId === node.nodeId)
        expect(coCon || node.hint === 'sắp mở').toBe(true)
      }
    }
  })

  it('href bài KHÔNG mang ?khoa= khi đi theo bậc', () => {
    const p3 = buildLevelOutline('p3', CTX_RONG)!
    const bai = p3.nodes.find((n) => n.contentId === 'p3-u10-l1')
    expect(bai?.href).toMatch(/^\/lap-trinh\/bai-hoc\/p3-u10-l1--/)
    expect(bai?.href).not.toContain('?khoa=')
  })

  it('tiến độ: có bản ghi → in-progress/completed kèm nguồn bằng chứng; không có → not-started', () => {
    const outline = buildLevelOutline('p1', {
      ...CTX_RONG,
      progress: [
        { lessonId: 'p1-u1-l1', status: 'completed', completedAt: 1 },
        { lessonId: 'p1-u2-l1', status: 'in_progress', completedAt: null },
      ],
    })!
    const l1 = outline.nodes.find((n) => n.contentId === 'p1-u1-l1')
    const l2 = outline.nodes.find((n) => n.contentId === 'p1-u2-l1')
    expect(l1).toMatchObject({ progress: 'completed', evidenceSource: 'programming.progress' })
    expect(l2).toMatchObject({ progress: 'in-progress', evidenceSource: 'programming.progress' })
    const khac = outline.nodes.find((n) => n.contentId === 'p1-u3-l1')
    expect(khac).toMatchObject({ progress: 'not-started' })
    OutlineSchema.parse(outline)
  })

  it('tiến độ chưa tải / lỗi → mọi bài "chưa đo được"', () => {
    for (const progressState of ['loading', 'error'] as const) {
      const outline = buildLevelOutline('p1', {
        ...CTX_RONG,
        progressState,
        progress: [{ lessonId: 'p1-u1-l1', status: 'completed', completedAt: 1 }],
      })!
      expect(la(outline).every((n) => (n as { progress: string }).progress === 'unknown')).toBe(
        true,
      )
    }
  })

  it('bậc khoá: lấy lý do từ LevelLockInfo, bài khoá không có href', () => {
    const info: LevelLockInfo = {
      locked: true,
      requiredLevelId: 'p1',
      doneInRequired: 2,
      neededInRequired: 5,
      remaining: 3,
    }
    const outline = buildLevelOutline('p2', {
      ...CTX_RONG,
      lockMap: new Map([['p2', info]]),
    })!
    OutlineSchema.parse(outline)
    expect(outline.nodes.every((n) => n.availability === 'locked')).toBe(true)
    expect(outline.nodes[0]!.lockReason).toContain('Còn 3 bài ở P1')
    expect(la(outline).every((n) => (n as { href?: string }).href === undefined)).toBe(true)
  })

  it('KHÔNG nạp nội dung bài để dựng cây (bất biến AC-6)', () => {
    const spyLesson = vi.spyOn(lessonsLoader, 'loadLesson')
    const spyUnit = vi.spyOn(lessonsLoader, 'loadUnitLessons')
    for (const level of PROGRAMMING_LEVELS) buildLevelOutline(level.id, CTX_RONG)
    expect(spyLesson).toHaveBeenCalledTimes(0)
    expect(spyUnit).toHaveBeenCalledTimes(0)
    spyLesson.mockRestore()
    spyUnit.mockRestore()
  })
})

describe('buildCourseOutline', () => {
  it('mã khoá lạ trả undefined', () => {
    expect(buildCourseOutline('khong-co', CTX_RONG)).toBeUndefined()
  })

  it('cây khoá git: đủ chương, đủ bài, mọi nút mang courseId', () => {
    const course = getShortCourse('git')!
    const outline = buildCourseOutline('git', CTX_RONG)!
    OutlineSchema.parse(outline)
    expect(outline.courseId).toBe('git')
    expect(outline.nodes.every((n) => n.courseId === 'git')).toBe(true)
    expect(outline.nodes.filter((n) => n.kind === 'chapter')).toHaveLength(course.chapters.length)
    expect(la(outline)).toHaveLength(course.chapters.reduce((s, c) => s + c.lessonIds.length, 0))
    expect(outline.nodes.every((n) => n.availability === 'available')).toBe(true)
  })

  it('bài chồng lấn P3 ↔ khoá Git: href mang ?khoa=git, cây bậc thì không', () => {
    const courseTree = buildCourseOutline('git', CTX_RONG)!
    const baiTrongKhoa = courseTree.nodes.find((n) => n.contentId === 'p3-u10-l1')
    expect(baiTrongKhoa?.href).toContain('?khoa=git')

    const levelTree = buildLevelOutline('p3', CTX_RONG)!
    const baiTrongBac = levelTree.nodes.find((n) => n.contentId === 'p3-u10-l1')
    expect(baiTrongBac?.href).not.toContain('?khoa=')
    // Cùng một bài, hai ngữ cảnh → nodeId khác nhau nhưng mã nội dung là MỘT.
    expect(baiTrongKhoa?.nodeId).not.toBe(baiTrongBac?.nodeId)
    expect(baiTrongKhoa?.contentId).toBe(baiTrongBac?.contentId)
  })

  it('bài nằm trong HAI khoá (ml ↔ mlds) cho hai href khác nhau', () => {
    const ml = buildCourseOutline('ml', CTX_RONG)!
    const mlds = buildCourseOutline('mlds', CTX_RONG)!
    const a = ml.nodes.find((n) => n.contentId === 'ml-u1-l1')
    const b = mlds.nodes.find((n) => n.contentId === 'ml-u1-l1')
    expect(a?.href).toBeDefined()
    expect(b?.href).toBeDefined()
    expect(a!.href).not.toBe(b!.href)
    expect(a!.href).toContain('?khoa=ml')
    expect(b!.href).toContain('?khoa=mlds')
  })

  it('mọi khoá ngắn dựng được cây hợp lệ', () => {
    for (const id of ['git', 'hermes', 'vibe', 'openclaw', 'ml', 'pyai'] as const) {
      const outline = buildCourseOutline(id, CTX_RONG)!
      expect(outline).toBeDefined()
      OutlineSchema.parse(outline)
    }
  })

  it('KHÔNG nạp nội dung bài để dựng cây khoá (bất biến AC-6)', () => {
    const spyLesson = vi.spyOn(lessonsLoader, 'loadLesson')
    const spyUnit = vi.spyOn(lessonsLoader, 'loadUnitLessons')
    buildCourseOutline('git', CTX_RONG)
    expect(spyLesson).toHaveBeenCalledTimes(0)
    expect(spyUnit).toHaveBeenCalledTimes(0)
    spyLesson.mockRestore()
    spyUnit.mockRestore()
  })
})
