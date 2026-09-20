// navPaths — bảng tiền tố đường dẫn của 5 tab điều hướng lõi, dùng CHUNG cho
// BottomNav (mobile, components/BottomNav.tsx) và DesktopSidebar (desktop,
// components/DesktopSidebar.tsx).
//
// Vì sao tách ra: trước đây bảng này nằm riêng trong BottomNav.tsx nên sidebar desktop
// chỉ so khớp được `/`, `/tien-do`, `/trang-ca-nhan` + STUDIOS — đứng ở /tro-truyen,
// /luyen-noi, /luyen-viet, /tu-dien, /bai-hoc… KHÔNG mục nào sáng, tức desktop mất định
// vị trong khi mobile vẫn có (audit 2026-08-31 mục A5). Một nguồn sự thật thì hai thanh
// điều hướng không bao giờ lệch nhau nữa.

export const LEARNING_PATHS = [
  '/goc-hoc-tap/programming',
  '/goc-hoc-tap/english',
  '/phong-hoc',
  '/goc-hoc-tap',
  '/hoc-mon-hoc',
  '/subjects',
  '/mon-hoc',
  '/hoc-tieng-anh',
  '/tieng-anh',
  '/english',
  '/lo-trinh-hoc',
  '/hoc-ung-dung',
  '/applied-knowledge',
  '/ung-dung-thuc-te',
  '/mo-phong',
  // [Slice 03] Công cụ Tiếng Anh thuộc Góc học tập (tab mobile "Góc học tập" sáng ở đó).
  '/bai-hoc',
  '/tro-truyen',
  '/luyen-noi',
  '/luyen-viet',
  '/luyen-nghe',
  '/tu-dien',
  '/tu-vung',
  '/cau-thong-dung',
  '/truyen-song-ngu',
  '/so-tay-loi-sai',
  '/on-thi',
  '/thu-thach',
  '/placement',
  '/cai-dat',
]

// [Slice 03] "Luyện tập" là hub ĐA MÔN: chỉ còn đường của chính nó. Các công cụ Tiếng Anh
// (/tro-truyen, /luyen-noi, /luyen-viet…) đã dời sang ENGLISH_PATHS — đứng ở đó phải sáng
// "Góc học tập › Tiếng Anh", không phải "Luyện tập".
export const PRACTICE_PATHS = ['/phong-luyen-tap', '/luyen-tap']

export const COMPANION_PATHS = [
  '/agent-ban-dong-hanh',
  '/ban-dong-hanh',
  '/dong-hanh',
  '/companion',
  '/workspace',
  '/action-canvas',
]

/** Trang bảng giá — tách riêng để sidebar có mục "Nâng cấp" không bị "Hồ sơ" nuốt mất. */
export const PRICING_PATHS = ['/nang-cap']

export const PROFILE_PATHS = [
  '/trang-ca-nhan',
  '/profile',
  '/cai-dat',
  '/tien-do',
  '/lich-su-hoc',
  '/ban-be',
  '/tin-nhan',
]

// ── Bảng riêng cho từng mục SIDEBAR desktop ─────────────────────────────────────
// Sidebar có nhiều mục hơn 5 tab mobile (mỗi studio một mục) nên cần tách nhỏ hơn:
// nếu để cả `LEARNING_PATHS` cho mục "Góc học tập" thì đứng ở `/hoc-tieng-anh` sẽ sáng
// nhầm mục đó thay vì "Học Tiếng Anh". Thứ tự ưu tiên do `resolveActiveNav` quyết định.

/**
 * Môn Tiếng Anh — tập CON của LEARNING_PATHS. [Slice 02] Không còn mục sidebar riêng cho Tiếng
 * Anh; bảng này làm sáng mục con "Tiếng Anh" trong nhóm Góc học tập (navTree.ts). [Slice 03]
 * Gồm đủ 14 route công cụ theo inventory — mọi công cụ Tiếng Anh thuộc môn, không thuộc "Luyện tập".
 */
export const ENGLISH_PATHS = [
  '/goc-hoc-tap/english',
  '/hoc-tieng-anh',
  '/tieng-anh',
  '/english',
  // 14 route công cụ của môn (spec 03 §2.1) — kể cả trang con/một lần không lên sidebar.
  '/lo-trinh-hoc',
  '/bai-hoc',
  '/tro-truyen',
  '/luyen-noi',
  '/luyen-viet',
  '/luyen-nghe',
  '/tu-dien',
  '/tu-vung',
  '/cau-thong-dung',
  '/truyen-song-ngu',
  '/so-tay-loi-sai',
  '/on-thi',
  '/thu-thach',
  '/placement',
  '/cai-dat',
]

/**
 * Mục sidebar "Ghi chú" (`/ghi-chu`).
 *
 * [2026-09-20] Thay cho `CAREER_PATHS` + `WORKLIFE_PATHS` + `CAREER_LIFE_PATHS` cũ: hai trụ
 * Sự nghiệp/Khởi nghiệp và nửa "Đời sống" đã bị gỡ hẳn khỏi giao diện, nên chỉ còn nửa "Công
 * việc" — nay mang tên "Ghi chú". Các đường CŨ (`/cong-viec`, `/work`, `/cong-viec-cuoc-song`…)
 * vẫn nằm đây vì App.tsx chuyển hướng chúng về `/ghi-chu`: trong một nhịp render trước khi
 * `<Navigate>` kịp chạy, sidebar vẫn phải sáng đúng mục thay vì nhấp nháy sang mục khác.
 */
export const NOTES_PATHS = [
  '/ghi-chu',
  '/cong-viec-cuoc-song',
  '/cong-viec-cua-toi',
  '/hoc-cong-viec',
  '/cong-viec',
  '/work',
]

/**
 * URL CŨ của trụ "Công việc" → chuyển hướng về `/ghi-chu` (App.tsx). Giữ đủ bộ alias Việt–Anh
 * đã từng tồn tại để bookmark và link đã chia sẻ không thành 404.
 */
export const LEGACY_NOTES_PATHS = [
  '/cong-viec-cuoc-song',
  '/cong-viec',
  '/cong-viec-cua-toi',
  '/hoc-cong-viec',
  '/work',
  '/work/kanban',
] as const

/**
 * URL CŨ của các trụ ĐÃ GỠ HẲN 2026-09-20 (Sự nghiệp, Khởi nghiệp, Đời sống) → chuyển hướng về
 * Trang chủ.
 *
 * Vì sao KHÔNG đẩy sang `/ghi-chu`: nội dung của các trụ này không còn tồn tại ở đâu cả. Đưa
 * người dùng tới một trang nội dung KHÁC HẲN rồi im lặng là nói dối về nơi họ đang đứng — về
 * Trang chủ thì họ tự thấy ngay app có gì.
 */
export const REMOVED_DOMAIN_PATHS = [
  // Sự nghiệp
  '/su-nghiep-khoi-nghiep',
  '/su-nghiep',
  '/su-nghiep-cua-toi',
  '/hoc-su-nghiep',
  '/career',
  '/career/interview',
  // Khởi nghiệp
  '/khoi-nghiep',
  '/toi-khoi-nghiep',
  '/hoc-khoi-nghiep',
  '/startup',
  '/startup/canvas',
  // Đời sống
  '/cuoc-song',
  '/cuoc-song-cua-toi',
  '/hoc-cuoc-song',
  '/life',
  '/life/wheel',
  '/life/wheel-of-life',
  '/life-graph',
] as const

/** Trang tiến độ — tách khỏi PROFILE_PATHS để sidebar có mục "Tiến độ" riêng. */
export const PROGRESS_PATHS = ['/tien-do']

/**
 * Hub ôn tập xuyên môn (S12-1). Tách khỏi LEARNING_PATHS và xét TRƯỚC nhóm "Góc học tập" trong
 * `ACTIVE_ORDER`, nếu không đứng ở `/goc-hoc-tap/on-tap` sẽ sáng nhầm mục Góc học tập.
 */
export const REVIEW_PATHS = ['/goc-hoc-tap/on-tap']

/**
 * `pathname` có nằm trong nhánh `prefix` không — so theo BIÊN ĐOẠN, không phải chuỗi con:
 * `/goc-hoc-tap/english` khớp `/goc-hoc-tap/english/x` nhưng KHÔNG khớp `/goc-hoc-tap/english-abc`.
 * Dùng chung cho nav (BottomNav/DesktopSidebar), breadcrumb và dropdown Studio — một luật khớp.
 */
export function underPrefix(pathname: string, prefix: string): boolean {
  if (prefix === '') return false
  return pathname === prefix || pathname.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`)
}

/** Đường dẫn hiện tại có thuộc nhóm tab này không — trang con `/luyen-noi/xxx` vẫn sáng tab cha,
 *  nhưng `/luyen-noix` thì không (khớp theo BIÊN đoạn từ slice 02). */
export function matchesNav(pathname: string, paths: readonly string[]): boolean {
  return paths.some((p) => underPrefix(pathname, p))
}

/**
 * Chọn ĐÚNG MỘT mục điều hướng đang hoạt động.
 *
 * Vì sao cần hàm này thay vì để mỗi mục tự `matchesNav`: các bảng path chồng lấn nhau
 * (`ENGLISH_PATHS` ⊂ `LEARNING_PATHS`; `PROFILE_PATHS` chứa cả path sự nghiệp/đời sống).
 * Nếu mục nào cũng tự xét thì một trang có thể làm sáng 2-3 mục cùng lúc. Ở đây quy ước
 * "AI ĐỨNG TRƯỚC THẮNG" — người gọi xếp entries từ cụ thể nhất tới bao quát nhất.
 *
 * @returns `to` của mục thắng, hoặc `null` khi không mục nào khớp.
 */
export function resolveActiveNav(
  pathname: string,
  entries: readonly { to: string; paths?: readonly string[]; exact?: boolean }[],
): string | null {
  for (const e of entries) {
    if (e.exact) {
      if (pathname === e.to) return e.to
      continue
    }
    if (matchesNav(pathname, e.paths ?? [e.to])) return e.to
  }
  return null
}
