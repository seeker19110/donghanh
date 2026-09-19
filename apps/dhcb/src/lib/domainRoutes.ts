// domainRoutes — dựng URL của 4 trụ Career/Work/Startup/Life ở MỘT chỗ duy nhất.
//
// VÌ SAO: trước đợt "Gom URL trùng" (App.tsx, docs/research/nang-tam-du-an-2026-08-24.md §4)
// mỗi trụ có tới 4 URL cùng render một trang. Sau đợt đó chỉ còn hai trang hợp nhất
// (`/su-nghiep-khoi-nghiep`, `/cong-viec-cuoc-song`, tham số `?muc=` chọn tab) + các trang công
// cụ riêng (`/career/interview`…) — nhưng cả hai vẫn bị GHÉP CHUỖI TAY ở nhiều nơi
// (breadcrumb.ts, Home.tsx, About.tsx, 8 trang domain), khác với môn Lập trình đã có
// `programmingRoutes.ts` làm một nguồn duy nhất. File này đóng vai trò tương đương cho 4 trụ.
//
// Base path (`/su-nghiep-khoi-nghiep`, `/cong-viec-cuoc-song`) lấy từ `STUDIOS` — KHÔNG lặp lại
// chuỗi ở đây — để đổi URL gốc chỉ cần sửa một chỗ (`lib/studios.ts`).
import { STUDIOS } from './studios'

function studioPath(id: string): string {
  const st = STUDIOS.find((s) => s.id === id)
  if (!st) throw new Error(`Không tìm thấy studio "${id}" trong lib/studios.ts`)
  return st.to
}

/** Trang hợp nhất Sự Nghiệp & Khởi Nghiệp (tab chọn bằng `?muc=`). */
export const CAREER_STUDIO_PATH = studioPath('career')

/** Trang hợp nhất Công Việc & Đời Sống (tab chọn bằng `?muc=`). */
export const WORKLIFE_STUDIO_PATH = studioPath('worklife')

/** Tab "Sự nghiệp" trong studio Career. */
export function duongDanSuNghiep(): string {
  return `${CAREER_STUDIO_PATH}?muc=su-nghiep`
}

/** Tab "Khởi nghiệp" trong studio Career. */
export function duongDanKhoiNghiep(): string {
  return `${CAREER_STUDIO_PATH}?muc=khoi-nghiep`
}

/** Tab "Công việc" trong studio Work & Life. */
export function duongDanCongViec(): string {
  return `${WORKLIFE_STUDIO_PATH}?muc=cong-viec`
}

/** Tab "Đời sống" trong studio Work & Life. */
export function duongDanDoiSong(): string {
  return `${WORKLIFE_STUDIO_PATH}?muc=doi-song`
}

/** Phòng Luyện Phỏng Vấn AI (công cụ của tab Sự nghiệp). */
export function duongDanCareerInterview(): string {
  return '/career/interview'
}

/** Bảng Kanban việc cần làm (công cụ của tab Công việc). */
export function duongDanWorkKanban(): string {
  return '/work/kanban'
}

/** Lean Canvas khởi nghiệp (công cụ của tab Khởi nghiệp). */
export function duongDanStartupCanvas(): string {
  return '/startup/canvas'
}

/** Bánh xe cuộc sống (công cụ của tab Đời sống). */
export function duongDanLifeWheel(): string {
  return '/life/wheel'
}

/** Action Canvas của Companion (không thuộc riêng trụ nào). */
export function duongDanActionCanvas(): string {
  return '/action-canvas'
}
