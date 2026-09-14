// animationQuality.ts — Bất biến CHẤT LƯỢNG của hoạt ảnh minh hoạ, viết MỘT lần cho 4 môn STEM.
//
// Vì sao tách khỏi `lessonAnimation.ts` (schema Zod): schema canh HÌNH DẠNG (kiểu, khoảng giá
// trị, id không trùng) — thứ máy tự suy ra được. File này canh CHẤT LƯỢNG SƯ PHẠM — thứ schema
// không biết: mô tả có thật sự thay được hình động khi người học dùng trình đọc màn hình không,
// hoạt ảnh lặp vô hạn có lời dẫn không, độ phủ hoạt ảnh của môn có tụt không.
//
// Vì sao là hàm dùng chung chứ không viết thẳng vào `lessons.test.ts` của từng môn: bốn bản chép
// tay sẽ trôi khỏi nhau đúng như bốn bản cổng tự chấm đã trôi (TRAPS.md mục 4).
import type { LessonAnimation } from './lessonAnimation.js'

export interface BaiCoHoatAnh {
  id: string
  title: string
  track: 'core' | 'advanced'
  animation?: LessonAnimation
}

export interface LoiHoatAnh {
  lessonId: string
  /** 'MO_TA_CUT' = mô tả quá ngắn để thay được hình · 'MO_TA_CHEP_TIEU_DE' = mô tả chỉ chép lại
   *  title · 'LAP_KHONG_LOI_DAN' = loop vô hạn mà không có lời dẫn lẫn mô tả đủ dài ·
   *  'THIEU_CHUYEN_DONG' = hoạt ảnh không có keyframe nào (hình tĩnh đội lốt hoạt ảnh). */
  loai: 'MO_TA_CUT' | 'MO_TA_CHEP_TIEU_DE' | 'LAP_KHONG_LOI_DAN' | 'THIEU_CHUYEN_DONG'
  chiTiet: string
}

/** Sàn cứng cho mô tả văn bản tương đương. Schema đã ép ≥ 20 ký tự; 20 ký tự chỉ đủ chép lại
 *  tiêu đề, không đủ kể lại hình động cho người không xem được nó. */
export const TOI_THIEU_MO_TA = 80

/** Hoạt ảnh `loop: true` chạy lại vô hạn trên màn hình người học. Không có lời dẫn theo mốc thời
 *  gian thì nó là nhiễu thị giác; ngưỡng mô tả cho trường hợp này cao hơn hẳn. */
export const TOI_THIEU_MO_TA_KHI_LAP = 160

/** Chuẩn hoá để so mô tả với tiêu đề: bỏ dấu câu, gộp khoảng trắng, không phân biệt hoa thường. */
function chuanHoa(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,;:!?—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Soát MỌI hoạt ảnh trong một registry, trả về hết lỗi tìm được (không dừng ở lỗi đầu — người
 *  sửa cần thấy toàn bộ trong một lượt). Mảng rỗng = sạch. */
export function timLoiHoatAnh(baiHoc: readonly BaiCoHoatAnh[]): LoiHoatAnh[] {
  const loi: LoiHoatAnh[] = []
  for (const bai of baiHoc) {
    const anim = bai.animation
    if (!anim) continue
    const moTa = anim.description.trim()

    if (moTa.length < TOI_THIEU_MO_TA) {
      loi.push({
        lessonId: bai.id,
        loai: 'MO_TA_CUT',
        chiTiet: `mô tả dài ${moTa.length} ký tự, cần ≥ ${TOI_THIEU_MO_TA} — nó là bản văn bản THAY THẾ hình động, không phải chú thích`,
      })
    }

    if (chuanHoa(moTa) === chuanHoa(anim.title)) {
      loi.push({
        lessonId: bai.id,
        loai: 'MO_TA_CHEP_TIEU_DE',
        chiTiet: `mô tả chép nguyên tiêu đề hoạt ảnh ("${anim.title}") — người tắt hoạt ảnh không nhận được thông tin nào`,
      })
    }

    const coLoiDan = (anim.captions ?? []).length > 0
    if (anim.loop && !coLoiDan && moTa.length < TOI_THIEU_MO_TA_KHI_LAP) {
      loi.push({
        lessonId: bai.id,
        loai: 'LAP_KHONG_LOI_DAN',
        chiTiet: `loop: true mà không có captions và mô tả chỉ ${moTa.length} ký tự (cần ≥ ${TOI_THIEU_MO_TA_KHI_LAP}) — hình lặp vô hạn không lời dẫn là nhiễu`,
      })
    }

    const coChuyenDong = anim.shapes.some((s) => (s.keyframes ?? []).length > 0)
    if (!coChuyenDong) {
      loi.push({
        lessonId: bai.id,
        loai: 'THIEU_CHUYEN_DONG',
        chiTiet:
          'không hình nào có keyframe — đây là hình TĨNH đội lốt hoạt ảnh; hoặc thêm chuyển động, hoặc bỏ hẳn trường animation',
      })
    }
  }
  return loi
}

/** Thông báo lỗi gọn cho `expect(...)` — mỗi lỗi một dòng, đọc được thẳng trong log CI. */
export function moTaLoiHoatAnh(loi: readonly LoiHoatAnh[]): string {
  return loi.map((l) => `  · ${l.lessonId} [${l.loai}]: ${l.chiTiet}`).join('\n')
}

/** Độ phủ hoạt ảnh tính trên nhánh CHUẨN (`core`). Nhánh HSG (`advanced`) cố ý không vào mẫu số:
 *  chuyên đề bồi dưỡng là bài giải chi tiết, không phải chỗ hình động ăn tiền. */
export function doPhuHoatAnhCore(baiHoc: readonly BaiCoHoatAnh[]): {
  tong: number
  co: number
  tiLe: number
} {
  const core = baiHoc.filter((b) => b.track === 'core')
  const co = core.filter((b) => b.animation).length
  return { tong: core.length, co, tiLe: core.length === 0 ? 0 : co / core.length }
}
