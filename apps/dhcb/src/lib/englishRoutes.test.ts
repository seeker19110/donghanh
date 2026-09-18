import { describe, expect, it } from 'vitest'
import {
  ENGLISH_PREFIX,
  duongDanBaiHocAnh,
  duongDanCauThongDung,
  duongDanLuyenNghe,
  duongDanLuyenNoi,
  duongDanLuyenViet,
  duongDanLoTrinh,
  duongDanOnThi,
  duongDanSoTayLoiSai,
  duongDanThuThach,
  duongDanTroTruyen,
  duongDanTruyen,
  duongDanTuDien,
} from './englishRoutes'

describe('englishRoutes', () => {
  it('dùng một tiền tố chuẩn cho mọi công cụ', () => {
    expect(duongDanLoTrinh()).toBe(`${ENGLISH_PREFIX}/lo-trinh`)
    expect(duongDanLoTrinh('A2')).toBe(`${ENGLISH_PREFIX}/lo-trinh/a2`)
    expect(duongDanBaiHocAnh()).toBe(`${ENGLISH_PREFIX}/bai-hoc`)
    expect(duongDanTroTruyen()).toBe(`${ENGLISH_PREFIX}/tro-truyen`)
    expect(duongDanLuyenNoi()).toBe(`${ENGLISH_PREFIX}/luyen-noi`)
    expect(duongDanLuyenViet()).toBe(`${ENGLISH_PREFIX}/luyen-viet`)
    expect(duongDanLuyenNghe()).toBe(`${ENGLISH_PREFIX}/luyen-nghe`)
    expect(duongDanTuDien()).toBe(`${ENGLISH_PREFIX}/tu-dien`)
    expect(duongDanOnThi()).toBe(`${ENGLISH_PREFIX}/on-thi`)
    expect(duongDanTruyen()).toBe(`${ENGLISH_PREFIX}/truyen`)
    expect(duongDanCauThongDung()).toBe(`${ENGLISH_PREFIX}/cau-thong-dung`)
    expect(duongDanSoTayLoiSai()).toBe(`${ENGLISH_PREFIX}/so-tay-loi-sai`)
    expect(duongDanThuThach()).toBe(`${ENGLISH_PREFIX}/thu-thach`)
  })

  it('encode từ điển, không để slash hoặc query tạo thêm đoạn URL', () => {
    expect(duongDanTuDien('hello world/a?b')).toBe(
      `${ENGLISH_PREFIX}/tu-dien/hello%20world%2Fa%3Fb`,
    )
    expect(duongDanTruyen('story-1')).toBe(`${ENGLISH_PREFIX}/truyen/story-1`)
  })
})
