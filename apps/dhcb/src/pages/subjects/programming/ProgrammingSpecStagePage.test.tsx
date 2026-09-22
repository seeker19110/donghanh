// Cổng cho trang CHẶNG của hướng chuyên sâu: hoạt ảnh module phải LỘ RA đúng chỗ.
//
// Vì sao cần: dữ liệu `animation` của module `algo-s1-m1` đã có từ PR #1099 nhưng suốt một
// đợt không ai nhìn thấy — trang chưa gọi renderer. `specStageDetails.test.ts` chứng minh DỮ
// LIỆU qua schema, test này chứng minh TRANG thật sự vẽ nó (và KHÔNG vẽ ở module không có,
// để tránh một khung "Hoạt ảnh minh hoạ" rỗng).
import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { getSpecialization } from '@dhcb/subject-programming/specializations/registry'
import { getSpecStageDetail } from '@dhcb/subject-programming/specializations/stageDetails'
import { PROGRAMMING_PREFIX, duongDanChangHuong } from '../../../lib/programmingRoutes'
import ProgrammingSpecStagePage from './ProgrammingSpecStagePage'

vi.mock('../../../components/Layout', () => ({ default: () => null }))
// Khách chưa đăng nhập: trang không gọi API tiến độ, đúng nhánh renderToStaticMarkup cần.
vi.mock('../../../context/useAuth', () => ({ useAuth: () => ({ user: null, loading: false }) }))

const NHAN_HOAT_ANH = 'Hoạt ảnh minh hoạ'

function render(specId: string, stageId: string) {
  const spec = getSpecialization(specId)!
  const stage = spec.stages.find((s) => s.id === stageId)!
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[duongDanChangHuong(spec, stage)]}>
      <Routes>
        <Route
          path={`${PROGRAMMING_PREFIX}/huong/:specId/:stageId`}
          element={<ProgrammingSpecStagePage />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProgrammingSpecStagePage — hoạt ảnh minh hoạ module', () => {
  it('chặng có module mang animation: vẽ SVG kèm tiêu đề + mô tả bằng lời, đúng SỐ module có', () => {
    const detail = getSpecStageDetail('algo-s1')!
    const coHoatAnh = detail.modules.filter((m) => m.animation)
    expect(coHoatAnh.length, 'algo-s1-m1 phải còn animation (GĐ1)').toBeGreaterThan(0)

    const html = render('algo', 'algo-s1')
    expect(html.split(NHAN_HOAT_ANH).length - 1).toBe(coHoatAnh.length)
    // Đếm SVG có role="img" (renderer hoạt ảnh) — biểu tượng lucide cũng là <svg> nhưng aria-hidden.
    expect(html.split('role="img"').length - 1).toBe(coHoatAnh.length)
    for (const m of coHoatAnh) {
      // Mô tả bằng lời là kênh thông tin cho người tắt hoạt ảnh / đọc màn hình — bắt buộc lộ ra.
      expect(html).toContain(m.animation!.description.replace(/&/g, '&amp;'))
      expect(html).toContain(`aria-label="${m.animation!.title}"`)
    }
  })

  it('chặng KHÔNG có module nào mang animation: không hiện khung rỗng, không có SVG', () => {
    // Tìm động một chặng thật sự trống để không ghim cứng — GĐ2 sẽ lấp dần các chặng.
    const trong = getSpecialization('web')!.stages.find((s) =>
      getSpecStageDetail(s.id)?.modules.every((m) => !m.animation),
    )
    expect(trong, 'không còn chặng nào trống animation — bỏ test này').toBeDefined()

    const html = render('web', trong!.id)
    expect(html).not.toContain(NHAN_HOAT_ANH)
    expect(html).not.toContain('role="img"')
  })
})
