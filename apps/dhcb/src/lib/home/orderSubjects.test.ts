// orderSubjects.test.ts — bảng ca cho AC-1 (P1-8) + bất biến "không mặc định tiếng Anh".
import { describe, it, expect } from 'vitest'
import { orderSubjects } from './orderSubjects'
import type { SubjectEntry } from '@dhcb/core-learner/subjectEntry'

function entry(id: string, order: number): SubjectEntry {
  return { id, label: id, order, ctaPath: `/${id}`, status: 'live' }
}

// Cố ý đặt `english` KHÔNG ở vị trí đầu (giống registry thật `SUPPORTED_SUBJECTS`, xem
// packages/core-learner/subjectRegistry.ts) để bài test dưới đây thật sự kiểm được bất biến
// "không mặc định tiếng Anh" — nếu hàm lỡ mặc định đẩy english lên đầu, ca `seen=[]` sẽ đỏ.
const REGISTRY: SubjectEntry[] = [
  entry('programming', 0),
  entry('english', 1),
  entry('mathematics', 2),
  entry('physics', 3),
  entry('chemistry', 4),
  entry('biology', 5),
]

describe('orderSubjects (P1-8 AC-1)', () => {
  it('seen=[] giữ nguyên thứ tự registry — KHÔNG đưa english lên đầu (không mặc định tiếng Anh)', () => {
    const result = orderSubjects(REGISTRY, [])
    expect(result.map((e) => e.id)).toEqual(REGISTRY.map((e) => e.id))
    expect(result[0]?.id).not.toBe('english')
    expect(result[0]?.id).toBe('programming')
  })

  it("seen=['mathematics'] → mathematics lên đầu, phần còn lại giữ nguyên thứ tự", () => {
    const result = orderSubjects(REGISTRY, ['mathematics'])
    expect(result.map((e) => e.id)).toEqual([
      'mathematics',
      'programming',
      'english',
      'physics',
      'chemistry',
      'biology',
    ])
  })

  it('id lạ trong seen bị bỏ qua, không gây lỗi, không đổi thứ tự', () => {
    const result = orderSubjects(REGISTRY, ['khong-ton-tai'])
    expect(result.map((e) => e.id)).toEqual(REGISTRY.map((e) => e.id))
  })

  it('nhiều môn trong seen: giữ đúng thứ tự registry trong nhóm "đang học"', () => {
    const result = orderSubjects(REGISTRY, ['biology', 'english'])
    // Đúng thứ tự registry (english trước biology) dù seen liệt kê ngược.
    expect(result.map((e) => e.id)).toEqual([
      'english',
      'biology',
      'programming',
      'mathematics',
      'physics',
      'chemistry',
    ])
  })

  it('seen chứa toàn bộ id → thứ tự không đổi', () => {
    const result = orderSubjects(
      REGISTRY,
      REGISTRY.map((e) => e.id),
    )
    expect(result.map((e) => e.id)).toEqual(REGISTRY.map((e) => e.id))
  })

  it('mảng entries rỗng → trả mảng rỗng', () => {
    expect(orderSubjects([], ['english'])).toEqual([])
  })

  it('ổn định: gọi lại nhiều lần cho cùng input ra cùng kết quả', () => {
    const a = orderSubjects(REGISTRY, ['chemistry'])
    const b = orderSubjects(REGISTRY, ['chemistry'])
    expect(a).toEqual(b)
  })

  it("seen=['english'] CÓ bằng chứng thật — english được phép lên đầu (khác ca seen=[])", () => {
    const result = orderSubjects(REGISTRY, ['english'])
    expect(result[0]?.id).toBe('english')
  })

  it('không thay đổi mảng gốc (không mutate entries đầu vào)', () => {
    const copy = [...REGISTRY]
    orderSubjects(REGISTRY, ['physics'])
    expect(REGISTRY).toEqual(copy)
  })
})
