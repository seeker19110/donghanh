// subjectsHost.ts — đường dẫn "Góc học tập": MỘT host, MỘT tiền tố `/goc-hoc-tap`.
//
// LỊCH SỬ (đọc để không dựng lại cơ chế đã gỡ): từ 2026-08-28 tới 2026-09-20, Góc học tập từng
// sống ở subdomain riêng `hoc-tap.donghanhcungban.org`, bật/tắt bằng `VITE_SUBJECTS_HOSTNAME`
// (client) / `SUBJECTS_HOSTNAME` (server). Cơ chế đó đã bị XOÁ HẲN theo quyết định chủ dự án
// (2026-09-20): mọi môn — english, programming, mathematics, physics, chemistry, biology — và
// danh mục gốc đều dùng path thống nhất `/goc-hoc-tap/<mã môn>` trên MỘT host duy nhất
// (`www.donghanhcungban.org`). Lý do: tách origin làm dữ liệu học (token, từ vựng, SRS…) trong
// localStorage bị chia đôi — người đăng nhập ở `www.` mở `hoc-tap.` thành khách với tiến độ 0.
//
// Vì vậy ở đây KHÔNG còn khái niệm "đổi origin": mọi điều hướng đều là điều hướng trong app
// (React Router). File vẫn tồn tại vì nó là MỘT chỗ duy nhất dựng đường dẫn Góc học tập
// (CLAUDE.md §7 — không ghép chuỗi URL rải rác) và quy đổi các tiền tố cũ.

import { subjectHomePath } from '@dhcb/core-learner/subjectHome'

/** Tiền tố đường dẫn CHUẨN của Góc học tập. */
export const SUBJECTS_PREFIX = '/goc-hoc-tap'

/** Tiền tố cũ, giữ để link đã chia sẻ/bookmark không chết. Xem bảng alias trong App.tsx. */
export const LEGACY_SUBJECTS_PREFIX = '/mon-hoc'

/** Mọi tiền tố cũ được chấp nhận và chuyển về `SUBJECTS_PREFIX`. */
export const LEGACY_SUBJECTS_PREFIXES = [
  LEGACY_SUBJECTS_PREFIX,
  '/subjects',
  '/phong-hoc',
  '/hoc-mon-hoc',
] as const

/**
 * Đường dẫn CŨ của trang tổng quan môn Tiếng Anh (thời còn là "không gian" riêng). Slice 02
 * (`docs/specs/2026-09-15-goc-hoc-tap-02-tieng-anh-la-mot-mon.md`): Tiếng Anh là một môn, trang
 * tổng quan ở `subjectHomePath('english')` — ba đường này thành alias.
 */
export const LEGACY_ENGLISH_PREFIXES = ['/hoc-tieng-anh', '/tieng-anh', '/english'] as const

/** Trang tổng quan môn Tiếng Anh — MỘT hàm cho mọi nơi dựng link (CLAUDE.md §7, không ghép chuỗi). */
export function duongDanMonTiengAnh(): string {
  return subjectHomePath('english')
}

/** Đường dẫn trong app tới Góc học tập (danh mục, hoặc trang chủ một môn). */
export function subjectsPath(subjectId?: string): string {
  return subjectId ? subjectHomePath(subjectId) : SUBJECTS_PREFIX
}

/**
 * Đổi một đường dẫn mang tiền tố CŨ thành đường dẫn chuẩn; `null` nếu không phải tiền tố cũ.
 *
 * So khớp theo BIÊN ĐOẠN: `/mon-hoc-abc` KHÔNG phải `/mon-hoc` (dùng `startsWith` trần là
 * đúng loại lỗi nuốt nhầm route mà bảng alias sinh ra để tránh).
 */
export function normalizeLegacySubjectsPath(pathname: string): string | null {
  for (const prefix of LEGACY_SUBJECTS_PREFIXES) {
    if (pathname === prefix) return SUBJECTS_PREFIX
    if (pathname.startsWith(`${prefix}/`)) {
      return `${SUBJECTS_PREFIX}${pathname.slice(prefix.length)}`
    }
  }
  const englishHome = duongDanMonTiengAnh()
  for (const prefix of LEGACY_ENGLISH_PREFIXES) {
    if (pathname === prefix) return englishHome
    if (pathname.startsWith(`${prefix}/`)) return `${englishHome}${pathname.slice(prefix.length)}`
  }
  return null
}

/**
 * Đi tới Góc học tập (danh mục hoặc một môn) từ bất kỳ đâu trong app.
 *
 * Giữ hàm này thay vì gọi thẳng `navigate('/goc-hoc-tap/...')` ở ~20 chỗ: đường dẫn trang chủ
 * của một môn do `subjectHomePath` quyết, không phải chuỗi ghép tay.
 */
export function goToSubjects(navigate: (path: string) => void, subjectId?: string): void {
  navigate(subjectsPath(subjectId))
}

/**
 * Đi tới TRANG CHỦ của một môn — cùng cơ chế `goToSubjects` nhưng tên nói rõ ý định. Đây là lối
 * duy nhất cho nút "Vào môn …" ở danh mục.
 */
export function goToSubjectHome(navigate: (path: string) => void, subjectId: string): void {
  goToSubjects(navigate, subjectId)
}

/**
 * `navigate()` cho các bảng cấu hình (Layout, Profile, About) — nhận cả đường dẫn CŨ.
 *
 * Bảng cấu hình được đọc ở cấp module, trước khi biết chắc đang chạy ở đâu, nên chúng vẫn ghi
 * một chuỗi tĩnh. Việc quy đổi (kể cả tiền tố cũ `/mon-hoc`…) để đúng một chỗ này lo.
 */
export function navigateTo(navigate: (path: string) => void, path: string): void {
  const normalized = normalizeLegacySubjectsPath(path) ?? path
  navigate(normalized)
}
