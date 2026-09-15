import { describe, it, expect } from 'vitest'
import { TodayItemSchema, type ResumePoint } from '@dhcb/core-contracts/todayPlan'
import type { Outline, OutlineNode } from '@dhcb/core-contracts/outline'
import { stemNext } from './stemNext'

function la(contentId: string, order: number, khoa = false): OutlineNode {
  return {
    nodeId: `lesson:${contentId}`,
    parentId: 'level:10',
    subjectId: 'physics',
    contentId,
    kind: 'lesson',
    title: `Bài ${contentId}`,
    order,
    href: `/vat-ly/bai-hoc/${contentId}--bai`,
    availability: khoa ? 'locked' : 'available',
    progress: 'not-started',
  }
}

const outline: Outline = {
  rootId: 'level:10',
  subjectId: 'physics',
  nodes: [
    {
      nodeId: 'level:10',
      subjectId: 'physics',
      contentId: '10',
      kind: 'level',
      title: 'Lớp 10',
      order: 0,
      availability: 'available',
      progress: 'unknown',
    },
    la('b1', 0),
    la('b2', 1),
  ],
  builtAt: 1,
}

const resume: ResumePoint = {
  sessionId: 's1',
  subjectId: 'physics',
  contentId: 'b1',
  hasDraft: false,
  updatedAt: 1_757_000_000_000,
}

describe('stemNext — không bịa tiến độ', () => {
  it('không phiên → KHÔNG có mục nào (không gợi "Bài 1 lớp 10")', () => {
    expect(stemNext({ subjectId: 'physics', outline })).toEqual({})
  })

  it('có phiên nhưng không mục lục → rỗng', () => {
    expect(stemNext({ subjectId: 'physics', resume })).toEqual({})
  })

  it('bài đang dở không có trong mục lục → rỗng', () => {
    expect(
      stemNext({ subjectId: 'physics', resume: { ...resume, contentId: 'la' }, outline }),
    ).toEqual({})
  })

  it('có phiên + mục lục → lá kế tiếp sau bài đang dở', () => {
    const { next } = stemNext({ subjectId: 'physics', resume, outline })
    expect(TodayItemSchema.parse(next).contentId).toBe('b2')
    expect(next?.evidenceSource).toBe('outline.next')
    expect(next?.subjectId).toBe('physics')
  })

  it('lá cuối rồi → rỗng', () => {
    expect(
      stemNext({ subjectId: 'physics', resume: { ...resume, contentId: 'b2' }, outline }),
    ).toEqual({})
  })

  it('lá kế tiếp bị khoá → rỗng (prevNext đã bỏ lá khoá)', () => {
    const khoa: Outline = { ...outline, nodes: [outline.nodes[0], la('b1', 0), la('b2', 1, true)] }
    expect(stemNext({ subjectId: 'physics', resume, outline: khoa })).toEqual({})
  })
})
