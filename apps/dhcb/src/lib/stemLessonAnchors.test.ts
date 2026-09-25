// [S09b] Bộ giải neo "Trong bài" của trang bài STEM — contract §2.3 của
// docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md.
import { describe, expect, it } from 'vitest'
import { giaiNeoTrongBai, mucTrongBai, NEO_TRONG_BAI, type CauTrucBai } from './stemLessonAnchors'

const DAY_DU: CauTrucBai = { soCau: 2, coHoatAnh: true, coTheOn: true }
const TOI_GIAN: CauTrucBai = { soCau: 2, coHoatAnh: false, coTheOn: false }

describe('mucTrongBai', () => {
  it('đi đúng thứ tự sư phạm, id cố định, nhãn trùng tiêu đề đang có', () => {
    expect(mucTrongBai(DAY_DU)).toEqual([
      { id: 'dau-bai', nhan: 'Đầu bài' },
      { id: 'ly-thuyet', nhan: 'Lý thuyết' },
      { id: 'hoat-anh', nhan: 'Hoạt ảnh minh hoạ' },
      { id: 'vi-du', nhan: 'Ví dụ mẫu' },
      { id: 'tu-kiem', nhan: 'Tự kiểm tra' },
      { id: 'ket-qua', nhan: 'Kết quả' },
      { id: 'the-on', nhan: 'Thẻ ôn tập' },
    ])
  })

  it('phần tùy chọn vắng mặt thì không có trong danh sách; Kết quả thì luôn có', () => {
    const ids = mucTrongBai({ soCau: 0, coHoatAnh: false, coTheOn: false }).map((m) => m.id)
    expect(ids).toEqual(['dau-bai', 'ly-thuyet', 'vi-du', 'tu-kiem', 'ket-qua'])
  })

  it('không mục nào trùng dạng neo câu hỏi', () => {
    for (const id of Object.values(NEO_TRONG_BAI)) expect(id).not.toMatch(/^cau-/)
  })
})

describe('giaiNeoTrongBai', () => {
  it.each(['', '#'])('hash rỗng (%j) không đòi focus — giữ cách mở bài hiện có', (hash) => {
    expect(giaiNeoTrongBai(hash, DAY_DU)).toEqual({ loai: 'khong' })
  })

  it.each(['#dau-bai', '#ly-thuyet', '#hoat-anh', '#vi-du', '#tu-kiem', '#ket-qua', '#the-on'])(
    'section hợp lệ %s về đúng id',
    (hash) => {
      expect(giaiNeoTrongBai(hash, DAY_DU)).toEqual({ loai: 'dich', id: hash.slice(1) })
    },
  )

  it.each([
    ['#cau-1', 'cau-1'],
    ['#cau-2', 'cau-2'],
  ])('câu trong phạm vi %s', (hash, id) => {
    expect(giaiNeoTrongBai(hash, DAY_DU)).toEqual({ loai: 'dich', id })
  })

  it.each([
    '#cau-3', // vượt số câu
    '#cau-0', // N bắt đầu từ 1
    '#cau-01', // số có số 0 đầu không phải dạng neoCauHoi sinh ra
    '#cau-99999999999999999999', // số khổng lồ
    '#cau-',
    '#khac',
    '#tra-loi-1', // id có thật trong DOM nhưng không thuộc danh sách trắng
    '#Ly-Thuyet', // phân biệt hoa thường
    '#ly-thuyet ', // khoảng trắng thừa
    '#ly-thuyet#vi-du',
    '#%E0%A4%A', // percent-encoding hỏng
    '#a"]),body,[x="', // chuỗi cố tình phá CSS selector
    'ly-thuyet', // thiếu dấu #
  ])('hash không hợp lệ %j về tiêu đề bài', (hash) => {
    expect(giaiNeoTrongBai(hash, DAY_DU)).toEqual({ loai: 'tieu-de' })
  })

  it.each(['#hoat-anh', '#the-on'])('section tùy chọn %s vắng mặt về tiêu đề bài', (hash) => {
    expect(giaiNeoTrongBai(hash, TOI_GIAN)).toEqual({ loai: 'tieu-de' })
  })

  it('bài không có câu hỏi: mọi #cau-N về tiêu đề, #ket-qua vẫn hợp lệ', () => {
    const khongCau: CauTrucBai = { soCau: 0, coHoatAnh: false, coTheOn: true }
    expect(giaiNeoTrongBai('#cau-1', khongCau)).toEqual({ loai: 'tieu-de' })
    expect(giaiNeoTrongBai('#ket-qua', khongCau)).toEqual({ loai: 'dich', id: 'ket-qua' })
  })
})
