// mistakeRoutes.test.ts — MỘT bảng ánh xạ nguồn lỗi → URL (S12-2, AC-11).
//
// Bẫy thật file này canh: đặc tả viết route trò chuyện là `/tro-chuyen`, còn `App.tsx` khai
// `/tro-truyen`. Test so với route THẬT để không ai "sửa cho đúng đặc tả" rồi đẻ ra link chết.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  DUONG_DAN_NGUON_LOI,
  duongDanOnLaiLoiAnh,
  neoCauHoi,
  duongDanCauSaiStem,
} from './mistakeRoutes'

describe('mistakeRoutes', () => {
  it('mọi nguồn lỗi môn Anh đều có đúng một đường dẫn nội bộ', () => {
    const all = Object.values(DUONG_DAN_NGUON_LOI)
    expect(all).toHaveLength(3)
    for (const href of all) expect(href.startsWith('/')).toBe(true)
    expect(new Set(all).size).toBe(3) // không hai nguồn nào trỏ chung một chỗ
  })

  it('đường dẫn đó là route CÓ THẬT trong App.tsx (không phải tên trong đặc tả)', () => {
    const app = readFileSync(join(process.cwd(), 'apps/dhcb/src/App.tsx'), 'utf8')
    for (const href of Object.values(DUONG_DAN_NGUON_LOI)) {
      expect(app, `App.tsx không khai route ${href}`).toContain(`path="${href}"`)
    }
  })

  it('duongDanOnLaiLoiAnh trả đúng màn nguồn', () => {
    expect(duongDanOnLaiLoiAnh('chat')).toBe('/tro-truyen')
    expect(duongDanOnLaiLoiAnh('writing')).toBe('/luyen-viet')
    expect(duongDanOnLaiLoiAnh('speaking')).toBe('/luyen-noi')
  })

  it('neo câu đếm từ 1 cho người đọc, dữ liệu đếm từ 0', () => {
    expect(neoCauHoi(0)).toBe('cau-1')
    expect(neoCauHoi(9)).toBe('cau-10')
  })

  it('URL câu sai STEM: không có tiêu đề thì chỉ mã bài, có thì mang tiêu đề theo quy ước', () => {
    expect(duongDanCauSaiStem('physics', 'ly10-c2-b10', 2)).toBe(
      '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10#cau-3',
    )
    expect(duongDanCauSaiStem('physics', 'ly10-c2-b10', 0, 'Định luật Ôm')).toBe(
      '/goc-hoc-tap/physics/bai-hoc/ly10-c2-b10--dinh-luat-om#cau-1',
    )
  })
})
