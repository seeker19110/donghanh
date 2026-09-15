import { describe, it, expect } from 'vitest'
import { OutlineSchema, type Outline, type OutlineNode } from '@dhcb/core-contracts/outline'
import {
  ancestorChapterIds,
  childrenOf,
  findLeafByContentId,
  findNode,
  flattenLeaves,
  pathTo,
  prevNext,
} from './outlineNav.js'

// Cây mẫu: 1 bậc · 2 chương · 4 bài, trong đó bài thứ 3 bị KHOÁ.
const nodes: OutlineNode[] = [
  {
    nodeId: 'level:p1',
    subjectId: 'programming',
    contentId: 'p1',
    kind: 'level',
    title: 'Bậc 1',
    order: 0,
    availability: 'available',
    progress: 'not-started',
  },
  {
    nodeId: 'chapter:u1',
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
    nodeId: 'lesson:l1',
    parentId: 'chapter:u1',
    subjectId: 'programming',
    contentId: 'l1',
    kind: 'lesson',
    title: 'Bài 1',
    order: 0,
    href: '/a',
    availability: 'available',
    progress: 'completed',
    evidenceSource: 'programming.progress',
  },
  {
    nodeId: 'lesson:l2',
    parentId: 'chapter:u1',
    subjectId: 'programming',
    contentId: 'l2',
    kind: 'lesson',
    title: 'Bài 2',
    order: 1,
    href: '/b',
    availability: 'available',
    progress: 'not-started',
  },
  {
    nodeId: 'chapter:u2',
    parentId: 'level:p1',
    subjectId: 'programming',
    contentId: 'p1-u2',
    kind: 'chapter',
    title: 'Unit 2',
    order: 1,
    availability: 'available',
    progress: 'not-started',
  },
  {
    nodeId: 'lesson:l3',
    parentId: 'chapter:u2',
    subjectId: 'programming',
    contentId: 'l3',
    kind: 'lesson',
    title: 'Bài 3',
    order: 0,
    availability: 'locked',
    lockReason: 'Còn 2 bài nữa là mở',
    progress: 'not-started',
  },
  {
    nodeId: 'lesson:l4',
    parentId: 'chapter:u2',
    subjectId: 'programming',
    contentId: 'l4',
    kind: 'lesson',
    title: 'Bài 4',
    order: 1,
    href: '/d',
    availability: 'available',
    progress: 'not-started',
  },
]
const outline: Outline = {
  rootId: 'level:p1',
  subjectId: 'programming',
  nodes,
  builtAt: 1_700_000_000_000,
}

describe('outlineNav', () => {
  it('cây mẫu hợp lệ theo hợp đồng', () => {
    expect(() => OutlineSchema.parse(outline)).not.toThrow()
  })

  it('findNode / findLeafByContentId', () => {
    expect(findNode(outline, 'chapter:u2')?.title).toBe('Unit 2')
    expect(findNode(outline, 'khong-co')).toBeUndefined()
    expect(findLeafByContentId(outline, 'l4')?.nodeId).toBe('lesson:l4')
    // Chỉ tra LÁ: mã của một chương không trả về gì.
    expect(findLeafByContentId(outline, 'p1-u2')).toBeUndefined()
    expect(findLeafByContentId(outline, undefined)).toBeUndefined()
  })

  it('childrenOf trả con trực tiếp theo order', () => {
    expect(childrenOf(outline, 'level:p1').map((n) => n.nodeId)).toEqual([
      'chapter:u1',
      'chapter:u2',
    ])
    expect(childrenOf(outline, 'lesson:l1')).toEqual([])
  })

  it('pathTo trả đường từ gốc tới nút', () => {
    expect(pathTo(outline, 'lesson:l3').map((n) => n.nodeId)).toEqual([
      'level:p1',
      'chapter:u2',
      'lesson:l3',
    ])
    expect(pathTo(outline, 'level:p1').map((n) => n.nodeId)).toEqual(['level:p1'])
    expect(pathTo(outline, 'khong-co')).toEqual([])
  })

  it('pathTo không treo khi dữ liệu có vòng', () => {
    const vong: Outline = {
      ...outline,
      nodes: [
        { ...nodes[0]!, parentId: 'chapter:u1' },
        { ...nodes[1]! },
        { ...nodes[2]! },
        { ...nodes[3]! },
      ],
    }
    expect(pathTo(vong, 'lesson:l1').length).toBeGreaterThan(0)
  })

  it('flattenLeaves giữ thứ tự học', () => {
    expect(flattenLeaves(outline).map((n) => n.contentId)).toEqual(['l1', 'l2', 'l3', 'l4'])
  })

  it('prevNext BỎ QUA lá đang khoá', () => {
    // l2 → tiếp theo phải là l4 (l3 khoá), không dẫn người học vào ổ khoá.
    expect(prevNext(outline, 'l2').next?.contentId).toBe('l4')
    expect(prevNext(outline, 'l4').prev?.contentId).toBe('l2')
  })

  it('prevNext ở hai đầu cây và với mã lạ', () => {
    expect(prevNext(outline, 'l1').prev).toBeUndefined()
    expect(prevNext(outline, 'l1').next?.contentId).toBe('l2')
    expect(prevNext(outline, 'l4').next).toBeUndefined()
    expect(prevNext(outline, 'khong-co')).toEqual({})
    expect(prevNext(outline, undefined)).toEqual({})
  })

  it('prevNext đứng ngay trên lá khoá vẫn nhảy qua được', () => {
    expect(prevNext(outline, 'l3')).toEqual({
      prev: expect.objectContaining({ contentId: 'l2' }),
      next: expect.objectContaining({ contentId: 'l4' }),
    })
  })
})

describe('ancestorChapterIds — chương phải mở sẵn khi vẽ mục lục', () => {
  it('mở đúng các tầng CHA của bài đang xem, KHÔNG gồm chính bài đó', () => {
    expect(ancestorChapterIds(outline, 'l3')).toEqual(new Set(['level:p1', 'chapter:u2']))
  })

  it('không có bài đang xem (trang bậc/khoá) thì mở sẵn chương ĐẦU, không mở hết', () => {
    expect(ancestorChapterIds(outline, undefined)).toEqual(new Set(['chapter:u1']))
  })

  it('mã bài lạ → không mở gì (cây thu gọn hoàn toàn, không ném lỗi)', () => {
    expect(ancestorChapterIds(outline, 'khong-co')).toEqual(new Set())
  })
})
