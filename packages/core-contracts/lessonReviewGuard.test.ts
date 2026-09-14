// Ca thử cho cổng ăn khớp trạng thái duyệt — chạy trên DỮ LIỆU GIẢ, cố ý làm sai từng kiểu một.
//
// Đây là chỗ chứng minh cổng CÓ RĂNG. Cổng chạy trên dữ liệu thật của 4 môn hiện xanh vì chưa
// bài nào được duyệt; nếu chỉ có ca đó thì ta không biết nó bắt được gì — đúng cái bẫy
// TRAPS.md mục 4 mà chính quy trình này sinh ra để chặn.
import { describe, it, expect } from 'vitest'
import { timLoiDuyet, type BaiCoTrangThaiDuyet } from './lessonReviewGuard.js'
import { bamNoiDungBaiHoc } from './lessonReviewHash.js'
import { TIEU_CHI_DUYET, PHIEN_BAN_TIEU_CHI, type KetQuaTieuChi } from './lessonReview.js'

const tieuChiDat = Object.fromEntries(TIEU_CHI_DUYET.map((k) => [k, true])) as KetQuaTieuChi

const noiDung = {
  theory: 'Quần thể cân bằng di truyền khi tần số alen không đổi qua các thế hệ.',
  workedExample: { problem: 'Tính tần số alen', steps: ['bước 1'], answer: '0,6' },
  checkQuestions: [
    {
      prompt: 'Định luật Hardy-Weinberg áp dụng cho quần thể nào?',
      choices: [
        { id: 'a', label: 'Quần thể giao phối ngẫu nhiên' },
        { id: 'b', label: 'Quần thể tự thụ phấn' },
      ],
      answer: { kind: 'choice', correctIds: ['a'] },
      explain: 'Định luật giả định giao phối ngẫu nhiên, không chọn lọc, không đột biến.',
    },
  ],
}

function bai(p: Partial<BaiCoTrangThaiDuyet> = {}): BaiCoTrangThaiDuyet {
  return { id: 'sinh12-c3-b1', reviewStatus: 'draft', ...noiDung, ...p }
}

const duyetDayDu = {
  loai: 'nguoi-duyet',
  nguoiDuyet: 'Cô Lan',
  ngay: '2026-09-14',
  phienBanTieuChi: PHIEN_BAN_TIEU_CHI,
  tieuChi: tieuChiDat,
  bamNoiDung: bamNoiDungBaiHoc(noiDung),
} as const

describe('timLoiDuyet — ca SẠCH', () => {
  it('bài chưa ai đọc: draft, không có bản ghi → sạch', () => {
    expect(timLoiDuyet([bai()])).toEqual([])
  })

  it('bài người duyệt đầy đủ + reviewed + băm khớp → sạch', () => {
    expect(timLoiDuyet([bai({ reviewStatus: 'reviewed', review: duyetDayDu })])).toEqual([])
  })

  it('bài AI sàng lọc mà vẫn draft → sạch (đúng như phải thế)', () => {
    expect(
      timLoiDuyet([bai({ review: { loai: 'ai-sang-loc', ngay: '2026-09-14', soCoNghiNgo: 2 } })]),
    ).toEqual([])
  })
})

describe('timLoiDuyet — CỔNG PHẢI BẮT ĐƯỢC', () => {
  it('lật reviewed mà KHÔNG có bản ghi duyệt', () => {
    const loi = timLoiDuyet([bai({ reviewStatus: 'reviewed' })])
    expect(loi).toHaveLength(1)
    expect(loi[0]!.loai).toBe('LECH_TRANG_THAI')
  })

  it('có bản ghi duyệt đạt nhưng quên lật reviewStatus', () => {
    const loi = timLoiDuyet([bai({ review: duyetDayDu })])
    expect(loi.map((l) => l.loai)).toEqual(['LECH_TRANG_THAI'])
  })

  it('người duyệt nhưng còn tiêu chí TRƯỢT mà vẫn ghi reviewed', () => {
    const loi = timLoiDuyet([
      bai({
        reviewStatus: 'reviewed',
        review: { ...duyetDayDu, tieuChi: { ...tieuChiDat, dapAnDung: false } },
      }),
    ])
    expect(loi.map((l) => l.loai)).toEqual(['LECH_TRANG_THAI'])
  })

  it('AI sàng lọc mà bị lật thành reviewed — máy tự phong', () => {
    const loi = timLoiDuyet([
      bai({
        reviewStatus: 'reviewed',
        review: { loai: 'ai-sang-loc', ngay: '2026-09-14', soCoNghiNgo: 0 },
      }),
    ])
    expect(loi.map((l) => l.loai).sort()).toEqual(['LECH_TRANG_THAI', 'MAY_TU_PHONG'])
  })

  it('SỬA NỘI DUNG sau khi duyệt → băm lệch, đòi duyệt lại', () => {
    const loi = timLoiDuyet([
      bai({
        reviewStatus: 'reviewed',
        review: duyetDayDu,
        theory: noiDung.theory + ' Một câu sửa thêm về sau.',
      }),
    ])
    expect(loi.map((l) => l.loai)).toEqual(['BAM_LECH'])
    expect(loi[0]!.chiTiet).toContain('duyệt lại hoặc hạ về draft')
  })

  it('SỬA ĐÁP ÁN sau khi duyệt → băm lệch (ca nguy hiểm nhất)', () => {
    const loi = timLoiDuyet([
      bai({
        reviewStatus: 'reviewed',
        review: duyetDayDu,
        checkQuestions: [
          { ...noiDung.checkQuestions[0]!, answer: { kind: 'choice', correctIds: ['b'] } },
        ],
      }),
    ])
    expect(loi.map((l) => l.loai)).toEqual(['BAM_LECH'])
  })

  it('báo HẾT lỗi trong một lượt, không dừng ở bài đầu', () => {
    const loi = timLoiDuyet([
      bai({ id: 'sinh12-c3-b1', reviewStatus: 'reviewed' }),
      bai({ id: 'sinh12-c3-b2', reviewStatus: 'reviewed' }),
      bai({ id: 'sinh12-c3-b3' }),
    ])
    expect(loi.map((l) => l.lessonId)).toEqual(['sinh12-c3-b1', 'sinh12-c3-b2'])
  })
})
