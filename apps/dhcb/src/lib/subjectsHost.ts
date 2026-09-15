// subjectsHost.ts — "Góc học tập" sống ở subdomain riêng `hoc-tap.donghanhcungban.org`.
//
// BỐI CẢNH (quyết định chủ dự án 2026-08-28, đổi tên 2026-09-15 theo
// `docs/specs/2026-09-15-goc-hoc-tap-architecture.md`): không gian học tập nay tên là
// **Góc học tập** và có ĐÚNG MỘT đường dẫn chuẩn trên MỌI host: `/goc-hoc-tap`.
//
//   www.donghanhcungban.org/goc-hoc-tap              →  hoc-tap.donghanhcungban.org/goc-hoc-tap
//   www.donghanhcungban.org/goc-hoc-tap/mathematics  →  hoc-tap.donghanhcungban.org/goc-hoc-tap/mathematics
//
// KHÁC BẢN CŨ: trước đây host `hoc-tap.` BỎ tiền tố (`hoc-tap…/mathematics`). Nay tiền tố giữ
// nguyên ở cả hai host — chỉ HOST đổi, đường dẫn thì không. Lý do: một đường dẫn duy nhất thì
// mọi nơi dựng link, breadcrumb, test đều nói cùng một thứ; các URL cũ (không tiền tố, hoặc
// `/mon-hoc`, `/subjects`, `/phong-hoc`, `/hoc-mon-hoc`) vẫn vào được nhờ alias bên dưới.
//
// TẠI SAO CÓ FILE NÀY THAY VÌ VIẾT THẲNG URL Ở ~20 CHỖ: điều hướng sang Góc học tập có thể là
// CHUYỂN ORIGIN (một lượt tải trang thật) hoặc điều hướng trong app, tuỳ đang đứng ở host nào —
// và ở localhost/dev thì KHÔNG có subdomain nào cả. Gom một chỗ để không nơi nào đoán sai.

import { isAppHostSubject, subjectHomePath } from '@dhcb/core-learner/subjectHome'

/**
 * Host phục vụ Góc học tập. Khớp `SUBJECTS_HOSTNAME` phía server.
 *
 * MẶC ĐỊNH TẮT (rỗng) — bật bằng `VITE_SUBJECTS_HOSTNAME` lúc build, SAU khi DNS + chứng chỉ
 * của host mới đã sống. Nếu bật phía client mà host chưa phân giải, mọi liên kết "Góc học tập"
 * dẫn tới trang chết; nếu bật phía server mà không bật client thì chỉ mất thêm một chặng
 * chuyển hướng (vô hại). Vì vậy hai bên tách riêng, và cả hai đều mặc định TẮT.
 */
export function subjectsHostname(): string {
  return ((import.meta.env.VITE_SUBJECTS_HOSTNAME as string | undefined) ?? '').toLowerCase()
}

/** Tiền tố đường dẫn CHUẨN của Góc học tập — giống nhau ở mọi host. */
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
 * tổng quan ở `subjectHomePath('english')` — ba đường này thành alias. Khớp bảng cùng tên ở server.
 */
export const LEGACY_ENGLISH_PREFIXES = ['/hoc-tieng-anh', '/tieng-anh', '/english'] as const

/** Trang tổng quan môn Tiếng Anh — MỘT hàm cho mọi nơi dựng link (CLAUDE.md §7, không ghép chuỗi). */
export function duongDanMonTiengAnh(): string {
  return subjectHomePath('english')
}

/** Đang đứng trên chính host của Góc học tập? Luôn `false` khi tính năng chưa bật. */
export function isSubjectsHost(hostname: string): boolean {
  const configured = subjectsHostname()
  if (!configured) return false
  return hostname.toLowerCase() === configured
}

/**
 * Môi trường này có dùng subdomain riêng cho Góc học tập không.
 *
 * `false` ở localhost / IP / domain xem thử — nơi chỉ có MỘT host phục vụ tất cả. Khi đó mọi
 * thứ giữ nguyên đường dẫn `/goc-hoc-tap` trên chính origin hiện tại, để `npm run dev` và
 * Playwright chạy được mà không cần dựng DNS.
 */
export function usesSubjectsSubdomain(hostname: string): boolean {
  if (!subjectsHostname()) return false
  const h = hostname.toLowerCase()
  return h.endsWith('.donghanhcungban.org') || h.endsWith('.donghanhcungban.com')
}

/**
 * Đường dẫn TRONG app tới Góc học tập. Không phụ thuộc host — chỉ HOST mới đổi (xem
 * `subjectsTarget`), còn đường dẫn thì như nhau ở mọi nơi.
 */
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
 * Nơi cần tới khi người dùng bấm "Góc học tập" hoặc một môn.
 *
 * - `kind: 'path'` → điều hướng trong app (React Router), không tải lại trang.
 * - `kind: 'url'`  → ĐỔI ORIGIN, phải `window.location.assign` chứ Router không đi được.
 *
 * Trả về kiểu phân biệt thay vì một chuỗi, để nơi gọi KHÔNG THỂ quên mất khác biệt đó — đưa
 * một URL tuyệt đối cho `navigate()` của React Router sẽ hỏng âm thầm (nó coi đó là đường dẫn
 * tương đối và ghép vào sau origin hiện tại).
 *
 * Bảng ownership (slice 02, khớp `apps/server/src/subjectsRouting.ts`):
 *   · danh mục + môn STEM → host Góc học tập;
 *   · môn có không gian hoạt động riêng (`isAppHostSubject`: Tiếng Anh, Lập trình) → APP host —
 *     dữ liệu học (token, từ vựng, SRS…) sống ở localStorage của origin app. Trước slice 02
 *     chiều này KHÔNG tồn tại: đứng ở host Góc học tập bấm "Tiếng Anh" là `navigate()` tại chỗ,
 *     người đã đăng nhập thành khách với tiến độ 0 (spec 02 §2.3).
 */
export function subjectsTarget(
  hostname: string,
  subjectId?: string,
): { kind: 'path'; value: string } | { kind: 'url'; value: string } {
  const path = subjectsPath(subjectId)
  if (!usesSubjectsSubdomain(hostname)) return { kind: 'path', value: path }
  const toAppHost = subjectId !== undefined && isAppHostSubject(subjectId)
  if (isSubjectsHost(hostname)) {
    // Đang ở host Góc học tập: môn thuộc app host phải ĐỔI ORIGIN về host chuẩn.
    return toAppHost
      ? { kind: 'url', value: `https://${canonicalHostname()}${path}` }
      : { kind: 'path', value: path }
  }
  // Đang ở một app host (www, en-vi…): môn thuộc app host ở lại; danh mục/môn STEM sang host kia.
  return toAppHost
    ? { kind: 'path', value: path }
    : { kind: 'url', value: `https://${subjectsHostname()}${path}` }
}

/**
 * Host chuẩn của app nền tảng — nơi môn thuộc app host quay về khi đang đứng ở host Góc học tập.
 * Khớp `DEFAULT_CANONICAL_HOSTNAME` phía server; ghi đè bằng `VITE_CANONICAL_HOSTNAME` khi cần.
 */
export function canonicalHostname(): string {
  const configured = (import.meta.env.VITE_CANONICAL_HOSTNAME as string | undefined) ?? ''
  return (configured || 'www.donghanhcungban.org').toLowerCase()
}

/**
 * Đi tới Góc học tập từ bất kỳ đâu trong app.
 *
 * Gói trọn khác biệt "cùng origin hay khác origin": `navigate()` của React Router KHÔNG đi được
 * sang origin khác (nó ghép URL tuyệt đối vào sau origin hiện tại và hỏng âm thầm), nên phải
 * dùng `window.location.assign`. Nơi gọi chỉ cần biết "tôi muốn tới Góc học tập".
 */
export function goToSubjects(navigate: (path: string) => void, subjectId?: string): void {
  const target = subjectsTarget(window.location.hostname, subjectId)
  if (target.kind === 'url') window.location.assign(target.value)
  else navigate(target.value)
}

/**
 * Đi tới TRANG CHỦ của một môn — cùng cơ chế `goToSubjects` nhưng tên nói rõ ý định. Đây là lối
 * duy nhất cho nút "Vào môn …" ở danh mục: một chỗ quyết định assign/navigate theo ownership.
 */
export function goToSubjectHome(navigate: (path: string) => void, subjectId: string): void {
  goToSubjects(navigate, subjectId)
}

/** Địa chỉ dùng cho thẻ liên kết. Xem `subjectsTarget` để biết khi nào là URL tuyệt đối. */
export function subjectsLinkTarget(subjectId?: string): ReturnType<typeof subjectsTarget> {
  return subjectsTarget(window.location.hostname, subjectId)
}

/**
 * `navigate()` cho các bảng cấu hình (Layout, Profile, About) — nhận cả đường dẫn CŨ.
 *
 * Bảng cấu hình được đọc ở cấp module, trước khi biết chắc đang chạy ở đâu, nên chúng vẫn ghi
 * một chuỗi tĩnh. Việc quy đổi (kể cả tiền tố cũ `/mon-hoc`…) để đúng một chỗ này lo.
 */
export function navigateTo(navigate: (path: string) => void, path: string): void {
  const normalized = normalizeLegacySubjectsPath(path) ?? path
  if (normalized === SUBJECTS_PREFIX) {
    goToSubjects(navigate)
    return
  }
  if (normalized.startsWith(`${SUBJECTS_PREFIX}/`)) {
    goToSubjects(navigate, normalized.slice(SUBJECTS_PREFIX.length + 1))
    return
  }
  navigate(path)
}
