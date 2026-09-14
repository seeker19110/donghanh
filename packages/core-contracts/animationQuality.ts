// animationQuality.ts — Bất biến CHẤT LƯỢNG của hoạt ảnh minh hoạ, viết MỘT lần cho 4 môn STEM.
//
// Vì sao tách khỏi `LessonAnimationSchema`: schema lo tính HỢP LỆ về kiểu (độ dài, vai trò màu,
// mốc keyframe) — sửa nó lan ra 124 file. Còn ở đây là các luật SƯ PHẠM, chỉ đọc dữ liệu và trả
// về danh sách lỗi, nên thêm luật mới không đụng gì tới hợp đồng kiểu.
//
// Ba luật, mỗi luật xuất phát từ một cách hỏng THẬT:
//   1. `description` quá ngắn → hoạt ảnh chỉ tới được người NHÌN thấy nó; người dùng trình đọc
//      màn hình và người bật `prefers-reduced-motion` mất trắng nội dung.
//   2. `description` chép lại `title` → có chữ cho đủ trường, không phải bản văn bản tương đương.
//   3. `loop: true` mà không lời dẫn và mô tả cũng ngắn → hình lặp vô hạn không ai biết phải
//      nhìn cái gì, thành nhiễu thị giác đúng nghĩa.
import type { LessonAnimation } from './lessonAnimation.js'

/** Ngưỡng tối thiểu của mô tả — trùng ngưỡng `min(20)` của schema, lặp lại ở đây để khi schema
 *  đổi thì test chất lượng vẫn nói rõ luật của nó. */
export const TOI_THIEU_KY_TU_MO_TA = 20

/** Hoạt ảnh lặp vô hạn mà KHÔNG có lời dẫn thì mô tả phải đủ dài để thay thế lời dẫn đó. */
export const TOI_THIEU_KY_TU_MO_TA_KHI_LAP = 80

export interface BaiCoHoatAnh {
  id: string
  animation?: LessonAnimation
}

export interface LoiHoatAnh {
  lessonId: string
  /** 'MO_TA_NGAN' · 'MO_TA_CHEP_TIEU_DE' · 'LAP_KHONG_LOI_DAN' */
  loai: 'MO_TA_NGAN' | 'MO_TA_CHEP_TIEU_DE' | 'LAP_KHONG_LOI_DAN'
  chiTiet: string
}

/** Soát một registry bài học, trả về MỌI lỗi chất lượng hoạt ảnh (không dừng ở lỗi đầu — người
 *  sửa cần thấy hết trong một lượt). Mảng rỗng = sạch. Bài không có hoạt ảnh thì bỏ qua: để
 *  trống là đáp án ĐÚNG cho bài ôn tập/danh pháp, không phải lỗi. */
export function timLoiHoatAnh(baiHoc: readonly BaiCoHoatAnh[]): LoiHoatAnh[] {
  const loi: LoiHoatAnh[] = []
  for (const bai of baiHoc) {
    const anim = bai.animation
    if (!anim) continue

    const moTa = anim.description.trim()
    const tieuDe = anim.title.trim()

    if (moTa.length < TOI_THIEU_KY_TU_MO_TA) {
      loi.push({
        lessonId: bai.id,
        loai: 'MO_TA_NGAN',
        chiTiet: `mô tả chỉ ${moTa.length} ký tự, cần ≥ ${TOI_THIEU_KY_TU_MO_TA}`,
      })
    }

    if (moTa.toLowerCase() === tieuDe.toLowerCase()) {
      loi.push({
        lessonId: bai.id,
        loai: 'MO_TA_CHEP_TIEU_DE',
        chiTiet: 'mô tả chép nguyên tiêu đề — phải là bản văn bản tương đương của hình động',
      })
    }

    const coLoiDan = (anim.captions ?? []).length > 0
    if (anim.loop && !coLoiDan && moTa.length < TOI_THIEU_KY_TU_MO_TA_KHI_LAP) {
      loi.push({
        lessonId: bai.id,
        loai: 'LAP_KHONG_LOI_DAN',
        chiTiet: `loop: true nhưng không có captions và mô tả chỉ ${moTa.length} ký tự (cần ≥ ${TOI_THIEU_KY_TU_MO_TA_KHI_LAP})`,
      })
    }
  }
  return loi
}

/** Gộp lỗi thành chuỗi đọc được để nhét vào thông báo `expect` — mỗi lỗi một dòng. */
export function moTaLoiHoatAnh(loi: readonly LoiHoatAnh[]): string {
  return loi.map((l) => `  · ${l.lessonId} [${l.loai}]: ${l.chiTiet}`).join('\n')
}

/** Đếm độ phủ hoạt ảnh trên đúng tập bài truyền vào (gọi bên ngoài đã lọc `track: 'core'`). */
export function demPhuHoatAnh(baiHoc: readonly BaiCoHoatAnh[]): {
  tong: number
  coHoatAnh: number
  tiLe: number
} {
  const tong = baiHoc.length
  const coHoatAnh = baiHoc.filter((b) => b.animation).length
  return { tong, coHoatAnh, tiLe: tong === 0 ? 0 : coHoatAnh / tong }
}
