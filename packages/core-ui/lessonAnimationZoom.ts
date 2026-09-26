// packages/core-ui/lessonAnimationZoom.ts — Phép tính cho nút "Xem lớn" của `LessonAnimation`.
//
// Tách khỏi file component (luật react-refresh: file component chỉ export component) và để test
// thẳng bằng số, không cần dựng DOM. Nền: 2026-09-25 đo được 1.000/1.861 nhãn hoạt ảnh hiện dưới
// 10px ở màn điện thoại, tệ nhất 6px (khung 716 đơn vị trên SVG rộng ~358px).
import type { LessonAnimation as LessonAnimationSpec } from '@dhcb/core-contracts/lessonAnimation'

/** Nhãn hiển thị nhỏ hơn ngưỡng này (px THẬT trên màn hình) thì hiện nút "Xem lớn". */
export const NGUONG_CHU_NHO_PX = 10

/** Cỡ chữ của nhãn NHỎ NHẤT, theo đơn vị viewBox. Hoạt ảnh không có nhãn → null. */
export function coChuNhoNhat(spec: LessonAnimationSpec): number | null {
  const coChu = spec.shapes.flatMap((s) => (s.kind === 'label' ? [s.size ?? 14] : []))
  return coChu.length > 0 ? Math.min(...coChu) : null
}

/** Chữ nhỏ nhất có hiện dưới ngưỡng không, khi thẻ svg rộng `rongPx` px trên màn hình. */
export function chuQuaNho(spec: LessonAnimationSpec, rongPx: number): boolean {
  const nhoNhat = coChuNhoNhat(spec)
  if (nhoNhat === null || rongPx <= 0) return false
  return (nhoNhat * rongPx) / spec.viewBoxWidth < NGUONG_CHU_NHO_PX
}

/**
 * Bố cục của khung "Xem lớn": hình rộng bao nhiêu px và có xoay 90° không. Chỉ xoay khi hình
 * được to hơn RÕ RỆT (≥ 15%). Xoay bắt người học đổi hướng cầm máy nên phải đáng công, và màn
 * ngang hay desktop thì gần như không bao giờ được lợi.
 */
export function boCucXemLon(
  spec: LessonAnimationSpec,
  khungRong: number,
  khungCao: number,
): { rongPx: number; xoay: boolean } {
  const tiLe = spec.viewBoxWidth / spec.viewBoxHeight
  const khongXoay = Math.min(khungRong, khungCao * tiLe)
  const coXoay = Math.min(khungCao, khungRong * tiLe)
  return coXoay > khongXoay * 1.15
    ? { rongPx: coXoay, xoay: true }
    : { rongPx: khongXoay, xoay: false }
}
