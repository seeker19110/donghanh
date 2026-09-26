// Canh phép tính của nút "Xem lớn" (2026-09-25): khi nào nút hiện, khung xem lớn có xoay không.
// Số trong test lấy từ đo thật: SVG trong bài rộng 358px ở màn 390px; hộp thoại dựng đứng
// còn khoảng 390 × 780px sau thanh tiêu đề.
import { describe, expect, it } from 'vitest'
import type { LessonAnimation } from '@dhcb/core-contracts/lessonAnimation'
import { NGUONG_CHU_NHO_PX, boCucXemLon, chuQuaNho, coChuNhoNhat } from './lessonAnimationZoom.js'

function hoatAnh(vbw: number, vbh: number, coNhan: (number | undefined)[]): LessonAnimation {
  return {
    title: 'Thử',
    description: 'Mô tả đủ dài cho hoạt ảnh thử nghiệm dùng trong test.',
    viewBoxWidth: vbw,
    viewBoxHeight: vbh,
    durationMs: 1000,
    loop: false,
    shapes: [
      { kind: 'rect', id: 'nen', x: 0, y: 0, w: 10, h: 10 },
      ...coNhan.map((size, i) => ({
        kind: 'label' as const,
        id: `n${i}`,
        x: 0,
        y: 0,
        text: 'nhãn',
        ...(size === undefined ? {} : { size }),
      })),
    ],
  }
}

describe('coChuNhoNhat', () => {
  it('lấy cỡ nhỏ nhất; nhãn không khai size tính là 14', () => {
    expect(coChuNhoNhat(hoatAnh(400, 200, [12, undefined, 10]))).toBe(10)
    expect(coChuNhoNhat(hoatAnh(400, 200, [undefined]))).toBe(14)
  })
  it('hoạt ảnh không có nhãn → null (không có chữ thì không cần xem lớn)', () => {
    expect(coChuNhoNhat(hoatAnh(400, 200, []))).toBeNull()
  })
})

describe('chuQuaNho', () => {
  it('Sinh 716 đơn vị, chữ 12 trên SVG 358px → 6px: quá nhỏ', () => {
    expect(chuQuaNho(hoatAnh(716, 118, [12]), 358)).toBe(true)
  })
  it('cùng hoạt ảnh ở desktop (SVG ~700px) → 11,7px: không hiện nút', () => {
    expect(chuQuaNho(hoatAnh(716, 118, [12]), 700)).toBe(false)
  })
  it(`đúng ngưỡng ${NGUONG_CHU_NHO_PX}px thì KHÔNG coi là nhỏ (so sánh chặt)`, () => {
    expect(chuQuaNho(hoatAnh(400, 200, [10]), 400)).toBe(false)
  })
  it('chưa đo được bề rộng (0) hoặc không có nhãn → không hiện nút', () => {
    expect(chuQuaNho(hoatAnh(716, 118, [12]), 0)).toBe(false)
    expect(chuQuaNho(hoatAnh(716, 118, []), 358)).toBe(false)
  })
})

describe('boCucXemLon', () => {
  it('điện thoại dựng đứng + hình khổ ngang → xoay, chữ về lại ≥ ngưỡng', () => {
    const spec = hoatAnh(716, 118, [12])
    const b = boCucXemLon(spec, 390, 780)
    expect(b.xoay).toBe(true)
    expect(b.rongPx).toBe(780)
    expect((12 * b.rongPx) / spec.viewBoxWidth).toBeGreaterThanOrEqual(NGUONG_CHU_NHO_PX)
  })
  it('màn ngang → không xoay, hình lấp bề rộng', () => {
    expect(boCucXemLon(hoatAnh(716, 118, [12]), 844, 330)).toEqual({ rongPx: 844, xoay: false })
  })
  it('xoay chỉ được lợi dưới 15% → không xoay', () => {
    // Hình gần vuông: dựng đứng 390 × 430 → không xoay 390px, xoay 409,5px (+5%).
    expect(boCucXemLon(hoatAnh(420, 400, [10]), 390, 430).xoay).toBe(false)
  })
  it('không bao giờ tràn khung: rộng ≤ cạnh tương ứng của khung', () => {
    const spec = hoatAnh(470, 240, [9])
    const dung = boCucXemLon(spec, 390, 780)
    // Xoay: bề rộng hình nằm dọc theo chiều cao khung, bề cao hình nằm theo chiều rộng.
    expect(dung.rongPx).toBeLessThanOrEqual(780)
    expect((dung.rongPx * spec.viewBoxHeight) / spec.viewBoxWidth).toBeLessThanOrEqual(390)
  })
})
