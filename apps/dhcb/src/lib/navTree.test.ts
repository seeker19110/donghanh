import { describe, it, expect, beforeEach } from 'vitest'
import {
  ENGLISH_CHILDREN,
  SUBJECT_CHILDREN,
  childIsActive,
  groupContainsPath,
  readOpenGroups,
  toggleGroup,
  writeOpenGroups,
} from './navTree'

describe('navTree — dữ liệu cây điều hướng', () => {
  it('mỗi mục con có ĐÚNG một cách trỏ đích: đường dẫn hoặc id môn học', () => {
    for (const c of [...SUBJECT_CHILDREN, ...ENGLISH_CHILDREN]) {
      expect(Boolean(c.to) !== Boolean(c.subjectId), `mục "${c.label}"`).toBe(true)
      expect(c.paths.length).toBeGreaterThan(0)
    }
  })

  it('Góc học tập liệt kê đủ 6 môn của subjectRegistry', () => {
    expect(SUBJECT_CHILDREN.map((c) => c.subjectId)).toEqual([
      'english',
      'mathematics',
      'physics',
      'chemistry',
      'biology',
      'programming',
    ])
  })
})

// Slice 02 (quyết định chủ dự án 2026-09-15, Q1): 5 công cụ Tiếng Anh DI CHUYỂN vào nhóm
// Góc học tập, lồng dưới mục "Tiếng Anh" — không xoá.
describe('navTree — Tiếng Anh là một môn, công cụ ở cấp 2', () => {
  it('mục "Tiếng Anh" có đúng 12 công cụ cấp 2 và trỏ tới trang tổng quan môn', () => {
    const english = SUBJECT_CHILDREN.find((c) => c.subjectId === 'english')!
    expect(english.children).toBe(ENGLISH_CHILDREN)
    // [Slice 03] đủ 12 công cụ theo thứ tự luồng học (spec 03 §④ AC-3.1).
    expect(ENGLISH_CHILDREN.map((c) => c.label)).toEqual([
      'Lộ trình CEFR',
      'Bài học hôm nay',
      'Trò chuyện',
      'Luyện nói',
      'Luyện viết',
      'Luyện nghe',
      'Từ điển',
      'Câu thông dụng',
      'Truyện song ngữ',
      'Sổ tay lỗi sai',
      'Ôn thi',
      'Thử thách',
    ])
    expect(english.paths).toContain('/goc-hoc-tap/english')
    // Chỉ Tiếng Anh có cấp 2 trong đợt này.
    expect(SUBJECT_CHILDREN.filter((c) => c.children).map((c) => c.subjectId)).toEqual(['english'])
  })

  it('mục cấp 2 cũng tuân luật "đúng một cách trỏ đích"', () => {
    for (const c of ENGLISH_CHILDREN) {
      expect(Boolean(c.to) !== Boolean(c.subjectId), c.label).toBe(true)
      expect(c.children).toBeUndefined()
    }
  })

  it('childIsActive khớp theo BIÊN đoạn', () => {
    const english = SUBJECT_CHILDREN.find((c) => c.subjectId === 'english')!
    expect(childIsActive(english, '/goc-hoc-tap/english')).toBe(true)
    expect(childIsActive(english, '/goc-hoc-tap/english/x')).toBe(true)
    expect(childIsActive(english, '/goc-hoc-tap/english-abc')).toBe(false)
    expect(childIsActive(english, '/goc-hoc-tap/physics')).toBe(false)
  })
})

describe('groupContainsPath — tự mở nhóm chứa trang đang xem', () => {
  it('nhìn xuyên cấp 2: đứng ở công cụ Tiếng Anh thì nhóm Góc học tập mở', () => {
    expect(groupContainsPath(SUBJECT_CHILDREN, '/lo-trinh-hoc/a1')).toBe(true)
    expect(groupContainsPath(SUBJECT_CHILDREN, '/on-thi')).toBe(true)
    expect(groupContainsPath(ENGLISH_CHILDREN, '/cau-thong-dung')).toBe(true)
    expect(groupContainsPath(ENGLISH_CHILDREN, '/tro-truyen')).toBe(true)
    expect(groupContainsPath(ENGLISH_CHILDREN, '/tu-vung/apple')).toBe(true)
    expect(groupContainsPath(ENGLISH_CHILDREN, '/goc-hoc-tap/physics')).toBe(false)
  })

  it('khớp theo BIÊN đoạn — /goc-hoc-tap/english-abc không mở nhóm', () => {
    expect(groupContainsPath(SUBJECT_CHILDREN, '/goc-hoc-tap/english-abc')).toBe(false)
  })

  it('khớp theo tiền tố, kể cả trang con', () => {
    expect(groupContainsPath(SUBJECT_CHILDREN, '/goc-hoc-tap/physics')).toBe(true)
    expect(groupContainsPath(SUBJECT_CHILDREN, '/lap-trinh/bai-hoc/p1')).toBe(true)
    expect(groupContainsPath(SUBJECT_CHILDREN, '/luyen-noi')).toBe(true)
  })

  it('không khớp trang ngoài nhóm', () => {
    expect(groupContainsPath(SUBJECT_CHILDREN, '/tien-do')).toBe(false)
    expect(groupContainsPath(SUBJECT_CHILDREN, '/luyen-tap')).toBe(false)
  })
})

describe('toggleGroup / lưu trạng thái', () => {
  beforeEach(() => localStorage.clear())

  it('bật rồi tắt một nhóm, không đụng nhóm khác', () => {
    expect(toggleGroup([], '/goc-hoc-tap')).toEqual(['/goc-hoc-tap'])
    expect(toggleGroup(['/goc-hoc-tap', '/luyen-tap'], '/goc-hoc-tap')).toEqual(['/luyen-tap'])
  })

  it('ghi rồi đọc lại được', () => {
    writeOpenGroups(['/goc-hoc-tap'])
    expect(readOpenGroups()).toEqual(['/goc-hoc-tap'])
  })

  it('dữ liệu hỏng trong localStorage → coi như chưa mở nhóm nào, không ném lỗi', () => {
    localStorage.setItem('ui_sidebar_groups', '{khong-phai-json')
    expect(readOpenGroups()).toEqual([])
    localStorage.setItem('ui_sidebar_groups', '{"a":1}')
    expect(readOpenGroups()).toEqual([])
    localStorage.setItem('ui_sidebar_groups', '["/goc-hoc-tap", 42]')
    expect(readOpenGroups()).toEqual(['/goc-hoc-tap'])
  })
})
