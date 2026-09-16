// reviewRoutes — ĐƯỜNG DẪN và THAM SỐ URL của luồng ôn tập, ở MỘT chỗ duy nhất (S12-1).
//
// VÌ SAO TÁCH KHỎI `reviewQueue.ts`: những nơi chỉ cần dựng một URL (Trang chủ, trang cấp CEFR,
// sidebar) không được kéo theo cả bộ dựng hàng đợi — nó import bảng bốn môn STEM và sổ lỗi, tức
// là kéo một nhánh module nặng vào những trang chẳng liên quan. Đo thật lúc để chung: Trang chủ
// nhập `reviewQueue` xong thì banner "quay lại sau khi bỏ bẵng" không kịp hiện (E2E
// `comeback.spec.ts` đỏ). File này chỉ phụ thuộc `srs.ts` để lấy trần phiên.
import { SRS_SESSION_CAP } from './srs'

/** Hub ôn tập xuyên môn. `cap` có thì gắn `?cap=` để phiên đầu nhẹ hơn (luồng comeback). */
export function duongDanHubOnTap(cap?: number): string {
  return cap == null ? '/goc-hoc-tap/on-tap' : `/goc-hoc-tap/on-tap?cap=${cap}`
}

/** Màn ôn thẻ của một môn STEM. */
export function duongDanOnTapStem(subjectId: string, cap?: number): string {
  const goc = `/goc-hoc-tap/${subjectId}/on-tap`
  return cap == null ? goc : `${goc}?cap=${cap}`
}

/**
 * Đọc `?cap=` của URL: số nguyên trong khoảng 1..`SRS_SESSION_CAP`, sai hoặc thiếu thì dùng
 * `fallback`. Dùng cho hub ôn tập và màn ôn thẻ STEM.
 */
export function docCapTuQuery(search: URLSearchParams, fallback: number = SRS_SESSION_CAP): number {
  const n = docCapTuQueryTuyChon(search)
  if (n == null || !Number.isInteger(n)) return fallback
  return Math.min(n, SRS_SESSION_CAP)
}

/**
 * Bản trả `undefined` khi không có `?cap=` hợp lệ — GIỮ NGUYÊN hành vi sẵn có của trang cấp
 * CEFR (`?cap=` vắng nghĩa là "theo tốc độ đã lưu", không phải cap mặc định).
 */
export function docCapTuQueryTuyChon(search: URLSearchParams): number | undefined {
  const n = Number(search.get('cap'))
  return Number.isFinite(n) && n > 0 ? n : undefined
}
