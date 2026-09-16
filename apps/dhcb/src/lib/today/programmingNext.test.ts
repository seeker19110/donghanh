import { describe, it, expect, vi } from 'vitest'
import { TodayItemSchema } from '@dhcb/core-contracts/todayPlan'
import type { Outline, OutlineNode } from '@dhcb/core-contracts/outline'
import type { ProgrammingLessonProgress } from '../programmingProgress'
import { programmingNext } from './programmingNext'

// Mục lục fixture NHỎ: không import registry bài 3 MB (bất biến ngân sách của đặc tả).
function la(contentId: string, order: number, khoa = false): OutlineNode {
  return {
    nodeId: `lesson:${contentId}`,
    parentId: 'level:p3',
    subjectId: 'programming',
    courseId: 'git',
    contentId,
    kind: 'lesson',
    title: `Bài ${contentId}`,
    order,
    href: `/lap-trinh/bai-hoc/${contentId}--bai?khoa=git`,
    availability: khoa ? 'locked' : 'available',
    progress: 'not-started',
  }
}

function outline(nodes: OutlineNode[]): Outline {
  return {
    rootId: 'level:p3',
    subjectId: 'programming',
    courseId: 'git',
    nodes: [
      {
        nodeId: 'level:p3',
        subjectId: 'programming',
        contentId: 'p3',
        kind: 'level',
        title: 'Bậc 3',
        order: 0,
        availability: 'available',
        progress: 'not-started',
      },
      ...nodes,
    ],
    builtAt: 1,
  }
}

const tienDo: ProgrammingLessonProgress[] = [
  { lessonId: 'p1-u1-l1', status: 'completed', completedAt: 1_700_000_000_000 },
  { lessonId: 'p1-u2-l1', status: 'completed', completedAt: 1_700_000_900_000 },
]

describe('programmingNext — theo mục lục S07', () => {
  it('lá kế tiếp trong khoá, giữ ?khoa=', () => {
    const o = outline([la('l1', 0), la('l2', 1)])
    const { next } = programmingNext({ progress: [], outline: o, activeContentId: 'l1' })
    expect(TodayItemSchema.parse(next).href).toContain('?khoa=git')
    expect(next?.contentId).toBe('l2')
    expect(next?.evidenceSource).toBe('outline.next')
    expect(next?.courseId).toBe('git')
  })

  it('lá kế tiếp bị khoá → nhảy tới lá mở đầu tiên sau nó', () => {
    const o = outline([la('l1', 0), la('l2', 1, true), la('l3', 2)])
    const { next } = programmingNext({ progress: [], outline: o, activeContentId: 'l1' })
    expect(next?.contentId).toBe('l3')
  })

  it('toàn bộ phía sau đều khoá → KHÔNG có mục (không lấy bài khoá làm việc chính)', () => {
    const o = outline([la('l1', 0), la('l2', 1, true)])
    expect(
      programmingNext({ progress: [], outline: o, activeContentId: 'l1' }).next,
    ).toBeUndefined()
  })

  it('bài đang đứng không có trong mục lục → rơi về luật cũ toàn môn', () => {
    const o = outline([la('l1', 0), la('l2', 1)])
    const { next } = programmingNext({ progress: [], outline: o, activeContentId: 'khong-co' })
    expect(next?.evidenceSource).toBe('programming.progress')
  })
})

describe('programmingNext — luật cũ pickNextLesson', () => {
  it('chưa học gì → bài đầu tiên của giáo trình, href dựng qua duongDanBaiHoc', () => {
    const { next } = programmingNext({ progress: [] })
    const item = TodayItemSchema.parse(next)
    expect(item.href.startsWith('/lap-trinh/bai-hoc/')).toBe(true)
    expect(item.href).toContain('--')
    expect(item.hint).toBe('Bài chưa học tiếp theo')
  })

  it('có bài đang dở → nhãn "Đang học dở"', () => {
    const dang: ProgrammingLessonProgress[] = [
      { lessonId: 'p1-u2-l1', status: 'in_progress', completedAt: null },
    ]
    expect(programmingNext({ progress: dang }).next?.hint).toBe('Đang học dở')
  })

  it('mốc bằng chứng = lần hoàn thành muộn nhất', () => {
    expect(programmingNext({ progress: tienDo }).lastEvidenceAt).toBe(1_700_000_900_000)
  })

  it('chỉ có bài dở (completedAt null) → không có mốc bằng chứng', () => {
    const dang: ProgrammingLessonProgress[] = [
      { lessonId: 'p1-u1-l1', status: 'in_progress', completedAt: null },
    ]
    expect(programmingNext({ progress: dang }).lastEvidenceAt).toBeUndefined()
  })

  // ── [S06-3] `picked` — chi tiết bậc/ngôn ngữ mà TRANG MÔN cần, để nó không gọi lại
  // `pickNextLesson` và tự sinh ra bản chép thứ hai của luật "học tiếp bài nào".
  it('trả kèm picked khớp đúng bài của mục next', () => {
    const dang: ProgrammingLessonProgress[] = [
      { lessonId: 'p1-u2-l1', status: 'in_progress', completedAt: null },
    ]
    const { next, picked } = programmingNext({ progress: dang })
    expect(picked?.lesson.id).toBe('p1-u2-l1')
    expect(picked?.resuming).toBe(true)
    expect(next?.contentId).toBe(picked?.lesson.id)
    expect(picked?.levelId).toBe('p1')
  })

  it('nhánh mục lục không dựng picked (mục lục không biết khái niệm bậc)', () => {
    const { picked } = programmingNext({
      progress: tienDo,
      outline: outline([la('l1', 0), la('l2', 1)]),
      activeContentId: 'l1',
    })
    expect(picked).toBeUndefined()
  })

  it('không nạp nội dung bài (chỉ dùng chỉ mục nhẹ)', async () => {
    const loader = await import('@dhcb/subject-programming/lessonsLoader')
    const spy = vi.spyOn(loader, 'loadLesson')
    programmingNext({ progress: tienDo })
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
