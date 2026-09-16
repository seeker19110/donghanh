import { describe, it, expect } from 'vitest'

// Các hàm dựng URL + đọc `?cap=` nằm ở module LÁ riêng (`reviewRoutes.ts`): trang chỉ cần một
// đường dẫn thì không được kéo theo cả bộ dựng hàng đợi — xem chú thích đầu file đó.
import {
  docCapTuQuery,
  docCapTuQueryTuyChon,
  duongDanHubOnTap,
  duongDanOnTapStem,
} from './reviewRoutes'
import { SRS_SESSION_CAP } from './srs'

describe('docCapTuQuery', () => {
  const cap = (q: string) => docCapTuQuery(new URLSearchParams(q))

  it('?cap=5 → 5', () => {
    expect(cap('cap=5')).toBe(5)
  })

  it('thiếu / 0 / chữ / âm / thập phân → mặc định SRS_SESSION_CAP', () => {
    for (const q of ['', 'cap=0', 'cap=abc', 'cap=-3', 'cap=2.5']) {
      expect(cap(q)).toBe(SRS_SESSION_CAP)
    }
  })

  it('?cap=999 → kẹp về trần phiên, không cho phiên ôn dài vô hạn', () => {
    expect(cap('cap=999')).toBe(SRS_SESSION_CAP)
  })

  it('fallback truyền vào được dùng khi thiếu ?cap=', () => {
    expect(docCapTuQuery(new URLSearchParams(''), 5)).toBe(5)
  })

  it('bản tuỳ chọn giữ nguyên hành vi trang cấp CEFR: thiếu ?cap= → undefined', () => {
    expect(docCapTuQueryTuyChon(new URLSearchParams(''))).toBeUndefined()
    expect(docCapTuQueryTuyChon(new URLSearchParams('cap=3'))).toBe(3)
    expect(docCapTuQueryTuyChon(new URLSearchParams('cap=abc'))).toBeUndefined()
  })
})

describe('đường dẫn dùng chung', () => {
  it('dựng URL hub và URL ôn STEM ở một chỗ', () => {
    expect(duongDanHubOnTap()).toBe('/goc-hoc-tap/on-tap')
    expect(duongDanHubOnTap(5)).toBe('/goc-hoc-tap/on-tap?cap=5')
    expect(duongDanOnTapStem('physics')).toBe('/goc-hoc-tap/physics/on-tap')
  })
})
