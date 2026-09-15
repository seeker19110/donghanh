import { describe, it, expect } from 'vitest'
import { OutlineSchema, isOutlineLeaf, type Outline, type OutlineNode } from './outline.js'

// Cây tối thiểu hợp lệ: level → chapter → lesson.
function cayMau(nodes?: OutlineNode[]): Outline {
  return {
    rootId: 'level:p1',
    subjectId: 'programming',
    builtAt: 1_700_000_000_000,
    nodes: nodes ?? [
      {
        nodeId: 'level:p1',
        subjectId: 'programming',
        contentId: 'p1',
        kind: 'level',
        title: 'Nhập môn tư duy',
        order: 0,
        availability: 'available',
        progress: 'not-started',
      },
      {
        nodeId: 'chapter:p1-u1',
        parentId: 'level:p1',
        subjectId: 'programming',
        contentId: 'p1-u1',
        kind: 'chapter',
        title: 'Unit 1',
        order: 0,
        availability: 'available',
        progress: 'not-started',
      },
      {
        nodeId: 'lesson:p1-u1-l1',
        parentId: 'chapter:p1-u1',
        subjectId: 'programming',
        contentId: 'p1-u1-l1',
        kind: 'lesson',
        title: 'Bài 1',
        order: 0,
        href: '/lap-trinh/bai-hoc/p1-u1-l1--bai-1',
        availability: 'available',
        progress: 'not-started',
      },
    ],
  }
}

describe('OutlineSchema', () => {
  it('nhận cây hợp lệ', () => {
    expect(() => OutlineSchema.parse(cayMau())).not.toThrow()
  })

  it('từ chối nodeId trùng', () => {
    const nodes = cayMau().nodes.slice() as OutlineNode[]
    nodes.push({ ...nodes[2]!, order: 1 })
    expect(() => OutlineSchema.parse(cayMau(nodes))).toThrow(/nodeId trùng/)
  })

  it('từ chối order trùng trong cùng cha', () => {
    const nodes = cayMau().nodes.slice() as OutlineNode[]
    nodes.push({ ...nodes[2]!, nodeId: 'lesson:p1-u1-l2', contentId: 'p1-u1-l2' })
    expect(() => OutlineSchema.parse(cayMau(nodes))).toThrow(/order trùng/)
  })

  it('cho phép order trùng khi KHÁC cha', () => {
    const nodes = cayMau().nodes.slice() as OutlineNode[]
    nodes.push(
      {
        nodeId: 'chapter:p1-u2',
        parentId: 'level:p1',
        subjectId: 'programming',
        contentId: 'p1-u2',
        kind: 'chapter',
        title: 'Unit 2',
        order: 1,
        availability: 'available',
        progress: 'not-started',
      },
      { ...nodes[2]!, nodeId: 'lesson:p1-u2-l1', parentId: 'chapter:p1-u2', contentId: 'p1-u2-l1' },
    )
    expect(() => OutlineSchema.parse(cayMau(nodes))).not.toThrow()
  })

  it('từ chối parentId trỏ nút không có thật', () => {
    const nodes = cayMau().nodes.slice() as OutlineNode[]
    nodes[2] = { ...nodes[2]!, parentId: 'chapter:khong-co' }
    expect(() => OutlineSchema.parse(cayMau(nodes))).toThrow(/parentId không tồn tại/)
  })

  it('từ chối rootId không nằm trong nodes', () => {
    const cay = { ...cayMau(), rootId: 'level:p9' }
    expect(() => OutlineSchema.parse(cay)).toThrow(/rootId/)
  })

  it('lá mở BẮT BUỘC có href', () => {
    const nodes = cayMau().nodes.slice() as OutlineNode[]
    const khongHref = { ...nodes[2]! }
    delete khongHref.href
    nodes[2] = khongHref
    expect(() => OutlineSchema.parse(cayMau(nodes))).toThrow(/lá mở phải có href/)
  })

  it('lá KHOÁ không cần href', () => {
    const nodes = cayMau().nodes.slice() as OutlineNode[]
    const khongHref = { ...nodes[2]! }
    delete khongHref.href
    nodes[2] = { ...khongHref, availability: 'locked', lockReason: 'Còn 3 bài ở P1 nữa là mở' }
    expect(() => OutlineSchema.parse(cayMau(nodes))).not.toThrow()
  })

  it('completed/in-progress BẮT BUỘC có evidenceSource', () => {
    for (const progress of ['completed', 'in-progress'] as const) {
      const nodes = cayMau().nodes.slice() as OutlineNode[]
      nodes[2] = { ...nodes[2]!, progress }
      expect(() => OutlineSchema.parse(cayMau(nodes))).toThrow(/evidenceSource/)
      nodes[2] = { ...nodes[2]!, progress, evidenceSource: 'programming.progress' }
      expect(() => OutlineSchema.parse(cayMau(nodes))).not.toThrow()
    }
  })

  it('unknown/not-started KHÔNG cần evidenceSource', () => {
    const nodes = cayMau().nodes.slice() as OutlineNode[]
    nodes[2] = { ...nodes[2]!, progress: 'unknown' }
    expect(() => OutlineSchema.parse(cayMau(nodes))).not.toThrow()
  })

  it('từ chối cây rỗng', () => {
    expect(() => OutlineSchema.parse({ ...cayMau(), nodes: [] })).toThrow()
  })
})

describe('isOutlineLeaf', () => {
  it('chỉ lesson và activity là lá', () => {
    expect(isOutlineLeaf({ kind: 'lesson' })).toBe(true)
    expect(isOutlineLeaf({ kind: 'activity' })).toBe(true)
    expect(isOutlineLeaf({ kind: 'chapter' })).toBe(false)
    expect(isOutlineLeaf({ kind: 'level' })).toBe(false)
  })
})
