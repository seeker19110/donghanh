// animationQuality.test.ts — Thử luật chất lượng hoạt ảnh bằng DỮ LIỆU GIẢ.
//
// Vì sao dữ liệu giả: chạy trên dữ liệu thật thì cổng đang xanh, mà xanh vì "chưa ai vi phạm"
// KHÔNG chứng minh được cổng có răng. Ca dưới đây dựng đúng từng cách hỏng rồi đòi nó đỏ.
import { describe, expect, it } from 'vitest'
import {
  demPhuHoatAnh,
  moTaLoiHoatAnh,
  timLoiHoatAnh,
  TOI_THIEU_KY_TU_MO_TA_KHI_LAP,
  type BaiCoHoatAnh,
} from './animationQuality.js'
import type { LessonAnimation } from './lessonAnimation.js'

const hinhToiThieu: LessonAnimation['shapes'] = [
  { kind: 'circle', id: 'v', cx: 10, cy: 10, r: 4, fill: 'primary' },
]

function hoatAnh(ghiDe: Partial<LessonAnimation>): LessonAnimation {
  return {
    title: 'Quỹ đạo ném xiên',
    description:
      'Quả bóng bay theo đường parabol: thành phần vận tốc ngang giữ nguyên, thành phần thẳng đứng giảm dần rồi đổi chiều, nên đỉnh quỹ đạo là lúc vận tốc thẳng đứng bằng không.',
    viewBoxWidth: 400,
    viewBoxHeight: 200,
    durationMs: 3000,
    loop: false,
    shapes: hinhToiThieu,
    ...ghiDe,
  }
}

describe('timLoiHoatAnh', () => {
  it('hoạt ảnh đạt chuẩn thì không có lỗi nào', () => {
    expect(timLoiHoatAnh([{ id: 'ok', animation: hoatAnh({}) }])).toEqual([])
  })

  it('bài KHÔNG có hoạt ảnh không bị coi là lỗi (để trống là đáp án đúng cho bài ôn tập)', () => {
    expect(timLoiHoatAnh([{ id: 'on-tap' }])).toEqual([])
  })

  it('bắt mô tả ngắn dưới 20 ký tự', () => {
    const loi = timLoiHoatAnh([{ id: 'x1', animation: hoatAnh({ description: 'Ném xiên.' }) }])
    expect(loi.map((l) => l.loai)).toContain('MO_TA_NGAN')
    expect(moTaLoiHoatAnh(loi)).toContain('x1')
  })

  it('bắt mô tả chép nguyên tiêu đề (không phân biệt hoa thường)', () => {
    const loi = timLoiHoatAnh([
      {
        id: 'x2',
        animation: hoatAnh({
          title: 'Sóng dừng trên dây hai đầu cố định',
          description: 'sóng dừng trên dây hai đầu cố định',
        }),
      },
    ])
    expect(loi.map((l) => l.loai)).toEqual(['MO_TA_CHEP_TIEU_DE'])
  })

  it('bắt hoạt ảnh lặp vô hạn mà không lời dẫn, mô tả lại ngắn', () => {
    const moTaNgan = 'Con lắc đu qua đu lại quanh vị trí cân bằng.'
    expect(moTaNgan.length).toBeLessThan(TOI_THIEU_KY_TU_MO_TA_KHI_LAP)
    const loi = timLoiHoatAnh([
      { id: 'x3', animation: hoatAnh({ loop: true, description: moTaNgan }) },
    ])
    expect(loi.map((l) => l.loai)).toEqual(['LAP_KHONG_LOI_DAN'])
  })

  it('lặp vô hạn nhưng CÓ lời dẫn thì hợp lệ', () => {
    const loi = timLoiHoatAnh([
      {
        id: 'x4',
        animation: hoatAnh({
          loop: true,
          description: 'Con lắc đu qua đu lại quanh vị trí cân bằng.',
          captions: [{ atMs: 0, text: 'Thế năng lớn nhất ở hai biên' }],
        }),
      },
    ])
    expect(loi).toEqual([])
  })

  it('gom hết lỗi trong một lượt, không dừng ở lỗi đầu', () => {
    const ds: BaiCoHoatAnh[] = [
      { id: 'a', animation: hoatAnh({ description: 'ngắn' }) },
      { id: 'b', animation: hoatAnh({ title: 'Trùng', description: 'Trùng', loop: true }) },
    ]
    const loi = timLoiHoatAnh(ds)
    expect(loi.map((l) => l.lessonId)).toEqual(['a', 'b', 'b', 'b'])
  })
})

describe('demPhuHoatAnh', () => {
  it('đếm đúng tổng, số bài có hoạt ảnh và tỉ lệ', () => {
    const ds: BaiCoHoatAnh[] = [{ id: 'a', animation: hoatAnh({}) }, { id: 'b' }, { id: 'c' }]
    expect(demPhuHoatAnh(ds)).toEqual({ tong: 3, coHoatAnh: 1, tiLe: 1 / 3 })
  })

  it('danh sách rỗng không chia cho 0', () => {
    expect(demPhuHoatAnh([])).toEqual({ tong: 0, coHoatAnh: 0, tiLe: 0 })
  })
})
