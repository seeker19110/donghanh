// subjectsRouting.ts — "Góc học tập" ở subdomain riêng: quyết định chuyển hướng cho từng request.
//
// Quyết định chủ dự án (2026-08-28, đổi tên + đổi hình dạng URL 2026-09-15 theo
// `docs/specs/2026-09-15-goc-hoc-tap-architecture.md`):
//
//   www…/goc-hoc-tap              → hoc-tap…/goc-hoc-tap              (danh mục môn)
//   www…/goc-hoc-tap/mathematics  → hoc-tap…/goc-hoc-tap/mathematics  (trang môn)
//   hoc-tap…/goc-hoc-tap/physics/bai-hoc → www…/goc-hoc-tap/physics/bai-hoc  (bài STEM)
//   hoc-tap…/tien-do              → www…/tien-do                      (mọi thứ ngoài Góc học tập)
//
// HAI ĐIỂM KHÁC BẢN CŨ, cả hai đều là sửa lỗi thật:
//
// 1. **Tiền tố giữ nguyên trên mọi host.** Trước đây host `hoc-tap.` BỎ tiền tố
//    (`hoc-tap…/mathematics`), nên cùng một nội dung có hai hình dạng URL. Nay chỉ HOST đổi.
//    URL cũ (không tiền tố, hoặc `/mon-hoc`, `/subjects`, `/phong-hoc`, `/hoc-mon-hoc`) vẫn
//    vào được — chúng được chuyển tiếp về dạng chuẩn.
// 2. **Chủ sở hữu tính theo ĐỘ SÂU.** Bài học STEM (`/goc-hoc-tap/:mon/bai-hoc/...`) thuộc app
//    host, KHÔNG thuộc host Góc học tập. Luật cũ chỉ nhìn "một đoạn hay nhiều đoạn" nên
//    `www…/mon-hoc/physics/bai-hoc` bị đẩy sang `hoc-tap…/physics/bai-hoc`, rồi host đó lại đá
//    ngược về `www…/physics/bai-hoc` — một đường dẫn không tồn tại. Nay bảng ownership quyết
//    định đích cuối ngay từ chặng đầu, không có chuỗi chuyển hướng lòng vòng.
//
// Tách thành hàm thuần vì đây là loại logic dễ sai âm thầm: một luật quá rộng sẽ chuyển hướng
// cả file tĩnh (trang trắng, không lỗi rõ ràng), một luật quá hẹp thì sinh nội dung trùng ở hai
// host. `server.ts` gọi `app.listen()` ngay lúc import nên không test được — bài học từ đợt
// `apps/hub` bị bỏ quên (changelog 0191).

/**
 * Host phục vụ Góc học tập.
 *
 * MẶC ĐỊNH TẮT (`subjectsHostname` không truyền ⇒ không chuyển hướng gì cả). Bật bằng biến môi
 * trường `SUBJECTS_HOSTNAME` trên VPS, SAU khi DNS + chứng chỉ của host mới đã sống. Lý do:
 * deploy code trước khi `hoc-tap.` phân giải được thì Góc học tập sẽ chuyển hướng tới một host
 * chết — người dùng mất hẳn đường vào. Tách "code đã lên" khỏi "tính năng đã bật" để thứ tự
 * triển khai không quyết định thành bại.
 */
export const DEFAULT_SUBJECTS_HOSTNAME = 'hoc-tap.donghanhcungban.org'

/** Host chuẩn của app nền tảng — nơi mọi đường dẫn ngoài danh mục Góc học tập thuộc về. */
export const DEFAULT_CANONICAL_HOSTNAME = 'www.donghanhcungban.org'

/** Tiền tố CHUẨN của Góc học tập. Khớp `SUBJECTS_PREFIX` phía client. */
export const SUBJECTS_PREFIX = '/goc-hoc-tap'

/** Tiền tố cũ (giữ để link đã chia sẻ không chết) — đều quy về `SUBJECTS_PREFIX`. */
export const LEGACY_SUBJECTS_PREFIX = '/mon-hoc'

/** Mọi tiền tố cũ được chấp nhận. */
export const LEGACY_SUBJECTS_PREFIXES = [
  LEGACY_SUBJECTS_PREFIX,
  '/subjects',
  '/phong-hoc',
  '/hoc-mon-hoc',
] as const

/**
 * Đường dẫn thuộc về hạ tầng/tài nguyên, KHÔNG bao giờ được chuyển hướng.
 *
 * Thiếu danh sách này thì trên `hoc-tap.` chính bundle JS/CSS của SPA cũng bị chuyển sang `www`,
 * và trang trắng — kiểu lỗi không có thông báo nào để lần ra.
 */
const ASSET_PREFIXES = [
  '/assets/',
  '/data/',
  '/downloads/',
  '/pyodide/',
  '/sqljs/',
  '/uploads/',
  '/api/',
]

/**
 * Môi trường này có dùng subdomain riêng cho Góc học tập không.
 *
 * `false` ở localhost/IP/domain xem thử — nơi MỘT host phục vụ tất cả. Ở đó mọi đường dẫn phải
 * chạy nguyên như cũ, nếu không `npm run dev` và Playwright sẽ bị đẩy sang một domain production
 * không tồn tại trong môi trường test. (Test canh gác bắt được đúng lỗi này lúc viết.)
 */
export function usesSubjectsSubdomain(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return h.endsWith('.donghanhcungban.org') || h.endsWith('.donghanhcungban.com')
}

/** Có phải yêu cầu file tĩnh không (đuôi mở rộng ở đoạn cuối, hoặc nằm trong thư mục tài nguyên). */
export function isAssetPath(pathname: string): boolean {
  if (ASSET_PREFIXES.some((p) => pathname.startsWith(p))) return true
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1)
  // Mã môn học không chứa dấu chấm, nên "có dấu chấm" là dấu hiệu đủ tin cậy của tên file
  // (index-a1b2c3.js, favicon.svg, manifest.webmanifest, robots.txt, sw.js…).
  return lastSegment.includes('.')
}

/**
 * Đổi đường dẫn mang tiền tố CŨ thành dạng chuẩn; `null` nếu không phải tiền tố cũ.
 * So khớp theo BIÊN ĐOẠN — `/mon-hoc-abc` không phải `/mon-hoc`.
 */
export function normalizeLegacySubjectsPath(pathname: string): string | null {
  for (const prefix of LEGACY_SUBJECTS_PREFIXES) {
    if (pathname === prefix) return SUBJECTS_PREFIX
    if (pathname.startsWith(`${prefix}/`)) {
      return `${SUBJECTS_PREFIX}${pathname.slice(prefix.length)}`
    }
  }
  return null
}

/**
 * Môn đã có không gian riêng trên app nền tảng — mở thẳng chỗ đó thay vì trang chi tiết môn.
 * Giữ khớp với các route tương ứng trong `apps/dhcb/src/App.tsx`.
 */
const SUBJECTS_WITH_OWN_SPACE: Record<string, string> = {
  programming: '/lap-trinh',
}

export interface RedirectDecision {
  /** URL tuyệt đối để chuyển hướng tới. */
  location: string
  /**
   * 301 cho luật đã nghiệm thu (tách host, 2026-08-28); 302 cho phần MỚI của đợt đổi tên
   * (2026-09-15) — 301 bị trình duyệt nhớ vĩnh viễn nên rollback sẽ không gỡ được.
   */
  status: 301 | 302
}

/** Phân loại một đường dẫn ĐÃ chuẩn hoá theo bảng ownership của đặc tả. */
type Ownership =
  | { kind: 'catalog' } // danh mục + trang môn → host Góc học tập
  | { kind: 'ownSpace'; path: string } // môn có không gian riêng → app host
  | { kind: 'app' } // bài học STEM + mọi thứ còn lại → app host

function classify(pathname: string, subjectIds: readonly string[]): Ownership {
  if (pathname === SUBJECTS_PREFIX) return { kind: 'catalog' }
  if (!pathname.startsWith(`${SUBJECTS_PREFIX}/`)) return { kind: 'app' }
  const segments = pathname
    .slice(SUBJECTS_PREFIX.length + 1)
    .split('/')
    .filter(Boolean)
  const subjectId = segments[0]
  // Mã môn lạ: giữ ở app host để trang "không tìm thấy" hiện ra, đừng đẩy rác sang host kia.
  if (!subjectId || !subjectIds.includes(subjectId)) return { kind: 'app' }
  const ownSpace = SUBJECTS_WITH_OWN_SPACE[subjectId]
  if (ownSpace) return { kind: 'ownSpace', path: ownSpace }
  // `/goc-hoc-tap/:mon` là trang môn (danh mục); sâu hơn (`/bai-hoc/...`) là nội dung bài học.
  return segments.length === 1 ? { kind: 'catalog' } : { kind: 'app' }
}

/**
 * Quyết định chuyển hướng cho một request, hoặc `null` nếu cứ phục vụ bình thường.
 *
 * @param subjectIds Mã các môn hợp lệ. Trên host Góc học tập chỉ danh mục và trang môn được ở
 *   lại; đường dẫn khác đi về `www` thay vì trả SPA — nếu không, mọi route của app sẽ tồn tại ở
 *   CẢ HAI host (trùng lặp nội dung, đúng thứ phương án này sinh ra để tránh).
 */
export function decideRedirect(opts: {
  hostname: string | undefined
  pathname: string
  search?: string
  subjectIds: readonly string[]
  subjectsHostname?: string
  canonicalHostname?: string
}): RedirectDecision | null {
  // Không khai báo host Góc học tập = tính năng chưa bật ⇒ mọi thứ y như trước.
  if (!opts.subjectsHostname) return null
  const subjectsHost = opts.subjectsHostname.toLowerCase()
  const canonicalHost = opts.canonicalHostname ?? DEFAULT_CANONICAL_HOSTNAME
  const host = opts.hostname?.toLowerCase()
  const search = opts.search ?? ''

  if (!host) return null
  if (isAssetPath(opts.pathname)) return null

  const onSubjectsHost = host === subjectsHost
  if (!onSubjectsHost && !usesSubjectsSubdomain(host)) return null

  // Bước 1 — đưa mọi hình dạng URL cũ về dạng chuẩn `/goc-hoc-tap/...`.
  const legacyPrefixed = normalizeLegacySubjectsPath(opts.pathname)
  let pathname = legacyPrefixed ?? opts.pathname
  let rewritten = legacyPrefixed !== null
  if (onSubjectsHost && !pathname.startsWith(SUBJECTS_PREFIX)) {
    // URL cũ của chính host này: `/` và `/<mã môn>` khi tiền tố còn bị bỏ đi.
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) {
      pathname = SUBJECTS_PREFIX
      rewritten = true
    } else if (opts.subjectIds.includes(segments[0]!)) {
      pathname = `${SUBJECTS_PREFIX}${pathname}`
      rewritten = true
    }
  }

  // Ngoài host Góc học tập, chỉ đụng tới đường dẫn của Góc học tập. Các host khác
  // (`en-vi.`, apex…) có luật riêng ở nginx — đừng kéo chúng về `www` ở đây.
  if (!onSubjectsHost && !pathname.startsWith(SUBJECTS_PREFIX)) return null

  // Bước 2 — bảng ownership quyết định host đích, không phụ thuộc host đang đứng.
  const owner = classify(pathname, opts.subjectIds)
  const targetHost = owner.kind === 'catalog' ? subjectsHost : canonicalHost
  const targetPath = owner.kind === 'ownSpace' ? owner.path : pathname

  // Bước 3 — chỉ chuyển hướng khi thật sự đổi host hoặc đổi đường dẫn.
  if (host === targetHost && targetPath === opts.pathname) return null
  return {
    location: `https://${targetHost}${targetPath}${search}`,
    // 301 chỉ dành cho luật đã nghiệm thu từ 2026-08-28: đẩy đường dẫn NGOÀI Góc học tập ra
    // khỏi host Góc học tập. Mọi thứ thuộc đợt đổi tên 2026-09-15 dùng 302 để rollback được —
    // 301 bị trình duyệt nhớ vĩnh viễn, gỡ ra không kịp.
    status: onSubjectsHost && !rewritten && !pathname.startsWith(SUBJECTS_PREFIX) ? 301 : 302,
  }
}
