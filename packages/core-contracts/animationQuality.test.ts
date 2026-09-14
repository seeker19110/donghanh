// animationQuality.test.ts — Thử luật bằng dữ liệu GIẢ.
//
// Vì sao phải có ca giả: dữ liệu THẬT của 4 môn hiện đang sạch, nên cổng chạy trên dữ liệu thật
// luôn xanh và không chứng minh được nó có răng. Đây đúng là cái bẫy đã ghi ở TRAPS.md mục 4
// ("test tự kiểm bằng chính dữ liệu của mình"): mỗi luật dưới đây có một ca CỐ TÌNH SAI.
import { describe, expect, it } from 'vitest'
import {
  TOI_THIEU_MO_TA,
  TOI_THIEU_MO_TA_KHI_LAP,
  doPhuHoatAnhCore,
  timLoiHoatAnh,
  moTaLoiHoatAnh,
  type BaiCoHoatAnh,
} from './animationQuality.js'
import type { LessonAnimation } from './lessonAnimation.js'

/** Hoạt ảnh hợp lệ tối thiểu — mỗi ca test bên dưới chỉ đổi ĐÚNG một chỗ để cô lập luật. */
function hoatAnhTot(ghiDe: Partial<LessonAnimation> = {}): LessonAnimation {
  return {
    title: 'Quả bóng rơi tự do',
    description:
      'Quả bóng bắt đầu đứng yên ở độ cao 5 mét rồi buông tay. Khoảng cách giữa hai vị trí liên tiếp mỗi giây một lớn hơn, cho thấy vận tốc tăng đều chứ không phải rơi với tốc độ cố định. Mũi tên trọng lực giữ nguyên độ dài suốt quá trình, vì lực hút của Trái Đất không đổi trong khoảng cách nhỏ này.',
    viewBoxWidth: 200,
    viewBoxHeight: 300,
    durationMs: 3000,
    loop: false,
    shapes: [
      {
        kind: 'circle',
        id: 'bong',
        cx: 100,
        cy: 20,
        r: 10,
        fill: 'primary',
        keyframes: [
          { atMs: 0, dy: 0 },
          { atMs: 3000, dy: 250 },
        ],
      },
    ],
    ...ghiDe,
  }
}

function bai(animation: LessonAnimation | undefined, id = 'test-b1'): BaiCoHoatAnh {
  return { id, title: 'Bài thử', track: 'core', animation }
}

describe('timLoiHoatAnh', () => {
  it('hoạt ảnh viết đúng thì KHÔNG báo lỗi nào', () => {
    expect(timLoiHoatAnh([bai(hoatAnhTot())])).toEqual([])
  })

  it('bài không có hoạt ảnh thì bỏ qua — để trống là đáp án đúng cho bài ôn tập/danh pháp', () => {
    expect(timLoiHoatAnh([bai(undefined)])).toEqual([])
  })

  it('MO_TA_CUT: mô tả qua được Zod (≥ 20) nhưng chưa thay được hình động', () => {
    const moTaNgan = 'Bóng rơi xuống đất nhanh dần.'
    expect(moTaNgan.length).toBeGreaterThanOrEqual(20) // Zod cho qua…
    expect(moTaNgan.length).toBeLessThan(TOI_THIEU_MO_TA) // …luật này thì không
    const loi = timLoiHoatAnh([bai(hoatAnhTot({ description: moTaNgan }))])
    expect(loi.map((l) => l.loai)).toEqual(['MO_TA_CUT'])
  })

  it('MO_TA_CHEP_TIEU_DE: mô tả chỉ chép lại tiêu đề (dù đủ dài) là vô giá trị', () => {
    const tieuDe =
      'Quá trình nhân đôi ADN theo nguyên tắc bổ sung ở pha S của kì trung gian của tế bào'
    expect(tieuDe.length).toBeGreaterThanOrEqual(TOI_THIEU_MO_TA)
    const loi = timLoiHoatAnh([
      bai(hoatAnhTot({ title: tieuDe, description: `${tieuDe}.` })), // khác mỗi dấu chấm
    ])
    expect(loi.map((l) => l.loai)).toEqual(['MO_TA_CHEP_TIEU_DE'])
  })

  it('LAP_KHONG_LOI_DAN: loop vô hạn, không captions, mô tả chưa đủ dài', () => {
    const moTa = 'Quả bóng rơi xuống, khoảng cách giữa các vị trí mỗi lúc một xa hơn trước.'.padEnd(
      TOI_THIEU_MO_TA + 5,
      ' x',
    )
    expect(moTa.trim().length).toBeGreaterThanOrEqual(TOI_THIEU_MO_TA)
    expect(moTa.trim().length).toBeLessThan(TOI_THIEU_MO_TA_KHI_LAP)
    const loi = timLoiHoatAnh([bai(hoatAnhTot({ loop: true, description: moTa }))])
    expect(loi.map((l) => l.loai)).toEqual(['LAP_KHONG_LOI_DAN'])
  })

  it('loop: true có captions thì hợp lệ — lời dẫn thay được mô tả dài', () => {
    const moTa = 'Quả bóng rơi xuống, khoảng cách giữa các vị trí mỗi lúc một xa hơn trước.'.padEnd(
      TOI_THIEU_MO_TA + 5,
      ' x',
    )
    const loi = timLoiHoatAnh([
      bai(
        hoatAnhTot({
          loop: true,
          description: moTa,
          captions: [{ atMs: 0, text: 'Buông tay, bóng bắt đầu rơi' }],
        }),
      ),
    ])
    expect(loi).toEqual([])
  })

  it('THIEU_CHUYEN_DONG: hình tĩnh đội lốt hoạt ảnh', () => {
    const loi = timLoiHoatAnh([
      bai(hoatAnhTot({ shapes: [{ kind: 'circle', id: 'bong', cx: 100, cy: 20, r: 10 }] })),
    ])
    expect(loi.map((l) => l.loai)).toEqual(['THIEU_CHUYEN_DONG'])
  })

  it('gom HẾT lỗi của HẾT các bài trong một lượt, không dừng ở lỗi đầu', () => {
    const loi = timLoiHoatAnh([
      bai(hoatAnhTot({ description: 'Ngắn quá, không đủ.' }), 'bai-1'),
      bai(hoatAnhTot({ shapes: [{ kind: 'rect', id: 'hop', x: 0, y: 0, w: 10, h: 10 }] }), 'bai-2'),
    ])
    expect(loi.map((l) => l.lessonId)).toEqual(['bai-1', 'bai-2'])
    expect(moTaLoiHoatAnh(loi)).toContain('bai-2')
  })
})

describe('doPhuHoatAnhCore', () => {
  it('chỉ tính nhánh core — bài HSG không vào mẫu số lẫn tử số', () => {
    const ds: BaiCoHoatAnh[] = [
      { id: 'c1', title: 'core có', track: 'core', animation: hoatAnhTot() },
      { id: 'c2', title: 'core không', track: 'core' },
      { id: 'a1', title: 'hsg có', track: 'advanced', animation: hoatAnhTot() },
      { id: 'a2', title: 'hsg không', track: 'advanced' },
    ]
    expect(doPhuHoatAnhCore(ds)).toEqual({ tong: 2, co: 1, tiLe: 0.5 })
  })

  it('registry rỗng không chia cho 0', () => {
    expect(doPhuHoatAnhCore([])).toEqual({ tong: 0, co: 0, tiLe: 0 })
  })
})
