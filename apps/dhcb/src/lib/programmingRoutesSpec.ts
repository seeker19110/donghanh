// programmingRoutesSpec — dựng URL hướng chuyên sâu khi CHỈ BIẾT id chặng.
//
// Tách khỏi `programmingRoutes.ts` vì hai hàm này phải tra registry 14 hướng (dữ liệu ~48 kB
// gzip). Để chúng ở file dùng chung là mọi trang chỉ cần dựng một URL cũng tải cả registry.
// Chỉ trang lộ trình (đã dùng registry sẵn) mới import file này.
import { getSpecialization } from '@dhcb/subject-programming/specializations/registry'
import { getShortCourse } from '@dhcb/subject-programming/courses/registry'
import type { ShortCourseId } from '@dhcb/subject-programming/courses/types'
import { duongDanChangHuong, duongDanHuong } from './programmingRoutes'

/**
 * Đọc ngữ cảnh khoá ngắn từ query `?khoa=` của URL bài học (xem `duongDanBaiHoc`).
 * Mã lạ hoặc thiếu → `undefined`: nơi gọi bỏ query và dùng cây bậc, KHÔNG báo lỗi và không
 * chuyển hướng vòng (đặc tả S07 §③.4 ca lỗi).
 *
 * Ở đây (chứ không ở `programmingRoutes.ts`) vì phải tra registry khoá: file kia cố ý giữ
 * tính chất "không kéo registry nào" để 10 chunk dùng chung nó không nặng thêm.
 */
export function maKhoaTuQuery(search: URLSearchParams): ShortCourseId | undefined {
  const raw = search.get('khoa')
  return raw ? getShortCourse(raw)?.id : undefined
}

/**
 * URL của một chặng khi chỉ biết id chặng (ví dụ 'ai-s1' trong bảng lắp ghép của lộ trình).
 * Trả về undefined nếu id không thuộc hướng nào — nơi gọi tự quyết định đường thay thế.
 */
export function duongDanChangTheoId(stageId: string): string | undefined {
  const [specId] = stageId.split('-')
  const spec = getSpecialization(specId ?? '')
  const stage = spec?.stages.find((s) => s.id === stageId)
  return spec && stage ? duongDanChangHuong(spec, stage) : undefined
}

/** Trang hướng khi chỉ biết id chặng — dùng cho nút "xem bản đồ hướng". */
export function duongDanHuongTheoChangId(stageId: string): string | undefined {
  const [specId] = stageId.split('-')
  const spec = getSpecialization(specId ?? '')
  return spec ? duongDanHuong(spec) : undefined
}
