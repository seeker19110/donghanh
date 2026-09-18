import { describe, it, expect } from 'vitest'
import { SUBJECTS_ON_APP_HOST, isAppHostSubject, subjectHomePath } from './subjectHome.js'
import { listSupportedSubjects } from './subjectRegistry.js'

describe('subjectHome — trang chủ môn và host sở hữu', () => {
  it('Tiếng Anh và Lập trình thuộc app host; bốn môn STEM thuộc danh mục', () => {
    expect(isAppHostSubject('english')).toBe(true)
    expect(isAppHostSubject('programming')).toBe(true)
    for (const id of ['mathematics', 'physics', 'chemistry', 'biology']) {
      expect(isAppHostSubject(id), id).toBe(false)
    }
  })

  it('đường dẫn trang chủ: Tiếng Anh và Lập trình nằm dưới tiền tố Góc học tập', () => {
    expect(subjectHomePath('english')).toBe('/goc-hoc-tap/english')
    expect(subjectHomePath('programming')).toBe('/goc-hoc-tap/programming')
    expect(subjectHomePath('physics')).toBe('/goc-hoc-tap/physics')
  })

  it('mã lạ không ném lỗi — trả đường dẫn dưới Góc học tập để trang không-tìm-thấy lo', () => {
    expect(subjectHomePath('khong-co')).toBe('/goc-hoc-tap/khong-co')
    expect(isAppHostSubject('khong-co')).toBe(false)
  })

  // Chống lệch: mọi môn ghi ở bảng app-host phải là môn THẬT trong registry.
  it('mọi mã trong SUBJECTS_ON_APP_HOST tồn tại trong subjectRegistry', () => {
    const known = new Set(listSupportedSubjects().map((s) => s.id))
    for (const id of Object.keys(SUBJECTS_ON_APP_HOST)) expect(known.has(id), id).toBe(true)
  })

  // Chống prototype pollution kiểu `subjectHomePath('constructor')`.
  it('tên thuộc tính kế thừa của Object không bị coi là môn', () => {
    expect(isAppHostSubject('constructor')).toBe(false)
    expect(subjectHomePath('toString')).toBe('/goc-hoc-tap/toString')
  })
})
