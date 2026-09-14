// Test review-sync — phần NGUY HIỂM nhất của đợt này: nó ghi vào file dữ liệu bài học.
import { describe, it, expect } from 'vitest'
import { doiTrangThaiTrongTep, doiSangBanGhi, sinhTepReviews } from './review-sync.js'
import {
  TIEU_CHI_DUYET,
  PHIEN_BAN_TIEU_CHI,
  type LessonReview,
} from '@dhcb/core-contracts/lessonReview'

const tieuChiDat = Object.fromEntries(TIEU_CHI_DUYET.map((k) => [k, true]))

// Hai bài liền nhau trong một tệp chương — đúng hình dạng thật của dữ liệu.
const tepMau = `export const SINH12C1 = [
  {
    id: 'sinh12-c1-b1',
    title: 'Nhân đôi ADN',
    reviewStatus: 'draft',
  },
  {
    id: 'sinh12-c1-b2',
    title: 'Phiên mã',
    reviewStatus: 'draft',
  },
]
`

describe('doiTrangThaiTrongTep', () => {
  it('đổi ĐÚNG bài được chỉ định, không đụng bài liền kề', () => {
    const sau = doiTrangThaiTrongTep(tepMau, 'sinh12-c1-b1', 'reviewed')!
    expect(sau).toContain(
      "id: 'sinh12-c1-b1',\n    title: 'Nhân đôi ADN',\n    reviewStatus: 'reviewed',",
    )
    expect(sau).toContain("id: 'sinh12-c1-b2',\n    title: 'Phiên mã',\n    reviewStatus: 'draft',")
  })

  it('đổi được bài ĐỨNG SAU trong cùng tệp', () => {
    const sau = doiTrangThaiTrongTep(tepMau, 'sinh12-c1-b2', 'reviewed')!
    expect(sau).toContain(
      "id: 'sinh12-c1-b1',\n    title: 'Nhân đôi ADN',\n    reviewStatus: 'draft',",
    )
    expect(sau).toContain(
      "id: 'sinh12-c1-b2',\n    title: 'Phiên mã',\n    reviewStatus: 'reviewed',",
    )
  })

  it('hạ ngược về draft được', () => {
    const len = doiTrangThaiTrongTep(tepMau, 'sinh12-c1-b1', 'reviewed')!
    expect(doiTrangThaiTrongTep(len, 'sinh12-c1-b1', 'draft')).toBe(tepMau)
  })

  it('LŨY ĐẲNG: chạy hai lần cho kết quả y hệt', () => {
    const lan1 = doiTrangThaiTrongTep(tepMau, 'sinh12-c1-b1', 'reviewed')!
    const lan2 = doiTrangThaiTrongTep(lan1, 'sinh12-c1-b1', 'reviewed')!
    expect(lan2).toBe(lan1)
  })

  it('trả null khi không có bài đó — gọi bên ngoài phải DỪNG, không ghi dở dang', () => {
    expect(doiTrangThaiTrongTep(tepMau, 'sinh12-c9-b9', 'reviewed')).toBeNull()
  })

  it('không đổi gì ngoài đúng một chuỗi reviewStatus', () => {
    const sau = doiTrangThaiTrongTep(tepMau, 'sinh12-c1-b1', 'reviewed')!
    expect(sau.length).toBe(tepMau.length + 'reviewed'.length - 'draft'.length)
  })
})

describe('doiSangBanGhi', () => {
  const dongNguoiDuyet = {
    lesson_id: 'sinh12-c1-b1',
    mon: 'biology',
    loai: 'nguoi-duyet',
    nguoi_duyet: 'Cô Lan',
    phien_ban_tieu_chi: PHIEN_BAN_TIEU_CHI,
    tieu_chi: tieuChiDat,
    bam_noi_dung: 'a'.repeat(64),
    ghi_chu: null,
    ngay: '2026-09-14',
  }

  it('đổi dòng người duyệt hợp lệ', () => {
    const r = doiSangBanGhi(dongNguoiDuyet)
    expect(r?.loai).toBe('nguoi-duyet')
  })

  it('TỪ CHỐI dòng người duyệt thiếu băm — dữ liệu DB hỏng không được lọt vào repo', () => {
    expect(doiSangBanGhi({ ...dongNguoiDuyet, bam_noi_dung: null })).toBeNull()
  })

  it('TỪ CHỐI dòng có ngày không có thật', () => {
    expect(doiSangBanGhi({ ...dongNguoiDuyet, ngay: '2026-02-30' })).toBeNull()
  })

  it('đọc soCoNghiNgo từ ghi chú của dòng AI sàng lọc', () => {
    const r = doiSangBanGhi({
      ...dongNguoiDuyet,
      loai: 'ai-sang-loc',
      nguoi_duyet: null,
      phien_ban_tieu_chi: null,
      tieu_chi: null,
      bam_noi_dung: null,
      ghi_chu: 'soCoNghiNgo=3',
    })
    expect(r).toMatchObject({ loai: 'ai-sang-loc', soCoNghiNgo: 3 })
  })
})

describe('sinhTepReviews', () => {
  const review: LessonReview = {
    loai: 'nguoi-duyet',
    nguoiDuyet: 'Cô Lan',
    ngay: '2026-09-14',
    phienBanTieuChi: PHIEN_BAN_TIEU_CHI,
    tieuChi: tieuChiDat as never,
    bamNoiDung: 'a'.repeat(64),
  }

  it('sắp bài theo id để diff không nhiễu giữa hai lần chạy', () => {
    const noiDung = sinhTepReviews(
      new Map([
        ['sinh12-c1-b2', review],
        ['sinh12-c1-b1', review],
      ]),
    )
    expect(noiDung.indexOf('sinh12-c1-b1')).toBeLessThan(noiDung.indexOf('sinh12-c1-b2'))
  })

  it('LŨY ĐẲNG: cùng dữ liệu cho cùng nội dung tệp', () => {
    const m = new Map([['sinh12-c1-b1', review]])
    expect(sinhTepReviews(m)).toBe(sinhTepReviews(new Map(m)))
  })

  it('có cảnh báo ĐỪNG SỬA TAY ở đầu tệp sinh ra', () => {
    expect(sinhTepReviews(new Map([['sinh12-c1-b1', review]]))).toContain('ĐỪNG SỬA TAY')
  })
})
