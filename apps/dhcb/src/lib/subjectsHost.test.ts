// Test canh gác cho lib/subjectsHost.ts sau khi cơ chế đa host bị gỡ (2026-09-20).
//
// BẤT BIẾN chính của đợt việc này: KHÔNG có điều hướng đổi origin nữa. Mọi lối vào Góc học tập
// phải gọi `navigate()` với một đường dẫn TƯƠNG ĐỐI; nếu ai đó dựng lại cơ chế subdomain,
// `window.location.assign` sẽ bị gọi và các test dưới đây đỏ.

import { describe, it, expect, vi } from 'vitest'
import {
  subjectsPath,
  goToSubjects,
  navigateTo,
  normalizeLegacySubjectsPath,
  goToSubjectHome,
  duongDanMonTiengAnh,
  SUBJECTS_PREFIX,
  LEGACY_SUBJECTS_PREFIX,
} from './subjectsHost'

describe('subjectsPath', () => {
  it('một đường dẫn chuẩn duy nhất cho danh mục và từng môn', () => {
    expect(SUBJECTS_PREFIX).toBe('/goc-hoc-tap')
    expect(subjectsPath()).toBe('/goc-hoc-tap')
    expect(subjectsPath('mathematics')).toBe('/goc-hoc-tap/mathematics')
    expect(subjectsPath('physics')).toBe('/goc-hoc-tap/physics')
    expect(subjectsPath('chemistry')).toBe('/goc-hoc-tap/chemistry')
    expect(subjectsPath('biology')).toBe('/goc-hoc-tap/biology')
  })

  it('Tiếng Anh và Lập trình cùng tiền tố, cùng host — không còn ngoại lệ ownership', () => {
    expect(subjectsPath('english')).toBe('/goc-hoc-tap/english')
    expect(duongDanMonTiengAnh()).toBe('/goc-hoc-tap/english')
    expect(subjectsPath('programming')).toBe('/goc-hoc-tap/programming')
  })
})

describe('normalizeLegacySubjectsPath', () => {
  it.each(['/mon-hoc', '/subjects', '/phong-hoc', '/hoc-mon-hoc'])(
    '%s → /goc-hoc-tap',
    (legacy) => {
      expect(normalizeLegacySubjectsPath(legacy)).toBe('/goc-hoc-tap')
      expect(normalizeLegacySubjectsPath(`${legacy}/physics`)).toBe('/goc-hoc-tap/physics')
      expect(normalizeLegacySubjectsPath(`${legacy}/physics/bai-hoc/abc`)).toBe(
        '/goc-hoc-tap/physics/bai-hoc/abc',
      )
    },
  )

  it.each(['/hoc-tieng-anh', '/tieng-anh', '/english'])(
    'alias Tiếng Anh %s → trang tổng quan môn',
    (p) => {
      expect(normalizeLegacySubjectsPath(p)).toBe('/goc-hoc-tap/english')
      expect(normalizeLegacySubjectsPath(`${p}/x`)).toBe('/goc-hoc-tap/english/x')
    },
  )

  // Khớp theo BIÊN đoạn: tiền tố cũ không được nuốt một route khác chỉ vì trùng đầu chuỗi.
  it.each([
    '/mon-hoc-abc',
    '/subjectsx',
    '/phong-hoc-nhom',
    '/goc-hoc-tap',
    '/tien-do',
    '/english-abc',
  ])('%s KHÔNG phải tiền tố cũ', (p) => {
    expect(normalizeLegacySubjectsPath(p)).toBeNull()
  })
})

describe('goToSubjects / goToSubjectHome — luôn điều hướng TRONG app', () => {
  it('danh mục', () => {
    const navigate = vi.fn()
    goToSubjects(navigate)
    expect(navigate).toHaveBeenCalledWith('/goc-hoc-tap')
  })

  // Đúng ca từng bị đẩy sang `hoc-tap.donghanhcungban.org` trước khi gỡ cơ chế đa host.
  it.each(['mathematics', 'physics', 'chemistry', 'biology', 'english', 'programming'])(
    'môn %s → đường dẫn tương đối, không có URL tuyệt đối',
    (id) => {
      const navigate = vi.fn()
      goToSubjectHome(navigate, id)
      expect(navigate).toHaveBeenCalledWith(`/goc-hoc-tap/${id}`)
      expect(navigate.mock.calls[0]![0]).not.toMatch(/^https?:/)
    },
  )
})

describe('navigateTo', () => {
  it('path đúng bằng tiền tố cũ → đường dẫn chuẩn', () => {
    const navigate = vi.fn()
    navigateTo(navigate, LEGACY_SUBJECTS_PREFIX)
    expect(navigate).toHaveBeenCalledWith('/goc-hoc-tap')
  })

  it('path có tiền tố cũ + mã môn → đường dẫn chuẩn của môn', () => {
    const navigate = vi.fn()
    navigateTo(navigate, `${LEGACY_SUBJECTS_PREFIX}/mathematics`)
    expect(navigate).toHaveBeenCalledWith('/goc-hoc-tap/mathematics')
  })

  it('alias Tiếng Anh cũ → trang tổng quan môn', () => {
    const navigate = vi.fn()
    navigateTo(navigate, '/hoc-tieng-anh')
    expect(navigate).toHaveBeenCalledWith('/goc-hoc-tap/english')
  })

  it('path khác không liên quan → navigate thẳng, không quy đổi', () => {
    const navigate = vi.fn()
    navigateTo(navigate, '/progress')
    expect(navigate).toHaveBeenCalledWith('/progress')
  })
})
