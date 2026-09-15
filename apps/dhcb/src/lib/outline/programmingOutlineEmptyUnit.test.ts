// Ca "unit chưa soạn bài" — hôm nay 118/118 unit đều đã có bài, nên dựng ca này bằng chỉ mục
// GIẢ. Phải có test: đây đúng là trạng thái mà mục lục cần nói ra ("sắp mở") thay vì im lặng
// bỏ unit đi, và nó sẽ xuất hiện ngay lần đầu có unit mới được khai trước khi soạn bài.
import { describe, it, expect, vi } from 'vitest'

vi.mock('@dhcb/subject-programming/lessonsLoader', async (importOriginal) => {
  const goc = await importOriginal<typeof import('@dhcb/subject-programming/lessonsLoader')>()
  return {
    ...goc,
    // Chỉ unit p1-u1 còn bài; mọi unit khác coi như chưa soạn.
    getUnitSummaries: (unitId: string) => (unitId === 'p1-u1' ? goc.getUnitSummaries(unitId) : []),
  }
})

const { buildLevelOutline } = await import('./programmingOutline')
const { OutlineSchema } = await import('@dhcb/core-contracts/outline')

describe('buildLevelOutline — unit chưa soạn bài', () => {
  it('giữ nút chương với hint "sắp mở" và KHÔNG sinh nút bài rỗng', () => {
    const outline = buildLevelOutline('p1', {
      progress: [],
      progressState: 'ready',
      lockMap: new Map(),
    })!
    OutlineSchema.parse(outline)

    const trong = outline.nodes.filter((n) => n.hint === 'sắp mở')
    expect(trong.length).toBe(9) // 10 unit của P1, chỉ p1-u1 còn bài
    for (const node of trong) {
      expect(node.kind).toBe('chapter')
      expect(outline.nodes.some((n) => n.parentId === node.nodeId)).toBe(false)
    }
    // Unit còn bài vẫn hiện số bài.
    expect(outline.nodes.find((n) => n.contentId === 'p1-u1')?.hint).toBe('1 bài')
  })
})
