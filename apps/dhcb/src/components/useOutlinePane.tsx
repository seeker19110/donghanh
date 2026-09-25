// useOutlinePane — TRẠNG THÁI của mục lục trong một trang học: panel mobile, nhớ chương nào
// đang mở, và đưa tiêu điểm về `<h1>` sau khi chọn bài.
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md, slice S07-2 (AC-10…AC-16).
//
// VÌ SAO LÀ HOOK TRẢ VỀ JSX chứ không phải một component bọc: ba mảnh (cột trái · nút mở ·
// panel) phải nằm ở BA CHỖ khác nhau trong cây JSX của trang — cột trái là prop `rail` của
// `TwoPane`, còn nút mở phải đứng ngay cạnh tiêu đề bài. Một component bọc không đặt được
// nút vào giữa nội dung của chính nó.
import { useCallback, useState, type ReactNode } from 'react'
import { ListTree } from 'lucide-react'
import type { Outline } from '@dhcb/core-contracts/outline'
import { ancestorChapterIds, ancestorChapterIdsOfNode } from '@dhcb/core-learner/outline/outlineNav'
import { MAIN_CONTENT_ID } from '@core/PageShell'
import Modal from './Modal'
import { OutlineTreeLinked } from './OutlinePane'

/** Tiền tố khoá lưu — `ui_` là nhóm "trạng thái giao diện", tự hết khi đóng tab. */
const STORAGE_PREFIX = 'ui_outline_open_'

/** Đọc danh sách chương đang mở của MỘT môn/khoá. Storage bị chặn → coi như chưa có gì. */
function docChuongMo(key: string): ReadonlySet<string> | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return undefined
    const arr = JSON.parse(raw) as unknown
    return Array.isArray(arr)
      ? new Set(arr.filter((x): x is string => typeof x === 'string'))
      : undefined
  } catch {
    return undefined
  }
}

function ghiChuongMo(key: string, ids: ReadonlySet<string>): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify([...ids]))
  } catch {
    // Chế độ riêng tư chặn storage — mục lục vẫn dùng được, chỉ không nhớ qua lần tải sau.
  }
}

/**
 * Chờ `<h1>` mới tối đa bao lâu. Tính bằng THỜI GIAN, không bằng số khung hình: trước đây là
 * 30 khung (~0,5 giây ở 60 fps), nhưng máy chậm vừa dựng khung hình thưa vừa nạp bài lâu hơn —
 * đo 2026-09-25 trên main có tải CPU, `e2e/outline-english.spec.ts` (mobile) đỏ 10/16: hết 30
 * khung mà bài mới chưa có, hàm focus `<h1>` CŨ, rồi `<h1>` cũ bị gỡ → tiêu điểm rơi về `<body>`.
 */
const THOI_GIAN_CHO_H1_MS = 3000
const NHAN_H1_CU_SAU_MS = 500

/**
 * Sau khi chọn một bài trong panel: đưa tiêu điểm về `<h1>` của BÀI MỚI.
 *
 * Vì sao không chỉ `requestAnimationFrame` hai nhịp rồi focus: trang bài STEM nạp nội dung
 * LƯỜI, nên ở khung hình kế tiếp `<h1>` của bài mới CHƯA tồn tại — focus lúc đó là focus vào
 * tiêu đề bài cũ, hoặc rơi về `<body>` (người dùng bàn phím mất chỗ đứng). Vì vậy: nhớ `<h1>`
 * đang có, rồi chờ cho tới khi xuất hiện MỘT `<h1>` khác. Hết hạn chờ thì focus `<h1>` nào
 * đang có — thà đúng vùng nội dung còn hơn rơi về đầu trang.
 */
function dieuTieuDiemVeTieuDe(): void {
  const cu = document.querySelector('h1')
  const hetHan = performance.now() + THOI_GIAN_CHO_H1_MS
  // Đo 2026-09-25 (CEFR mobile, chọn một hội thoại): `<h1>` xuất hiện, nhận focus, rồi bị GỠ khi
  // màn con dựng xong — màn hội thoại chỉ có `<h3>`, không có `<h1>` nào. Tiêu điểm rơi về
  // `<body>` mọi lần; test cũ xanh chỉ vì đọc tiêu điểm đúng khoảnh khắc `<h1>` cũ còn sống.
  // Vì vậy canh tới hết hạn: ưu tiên `<h1>` MỚI; tiêu điểm "mồ côi" (ở `<body>`) mà chưa có
  // `<h1>` thì về vùng nội dung chính (`#noi-dung-chinh`, `tabIndex=-1` — cũng là đích của liên
  // kết "Bỏ qua tới nội dung chính"). Người dùng đã tự đi chỗ khác thì thôi, không giành lại.
  // Sau mốc này mà chưa thấy `<h1>` KHÁC thì nhận `<h1>` đang có: trang bài lập trình dùng LẠI
  // đúng node `<h1>` khi đổi bài (React giữ phần tử, chỉ đổi chữ), nên "khác `<h1>` cũ" không bao
  // giờ đúng ở đó. Giữ đúng mốc ~0,5 giây của bản cũ.
  const mocNhanH1Cu = performance.now() + NHAN_H1_CU_SAU_MS
  let daFocus: HTMLElement | null = null
  const thu = () => {
    const active = document.activeElement
    const moCoi = !active || active === document.body
    // Trước lần focus đầu, tiêu điểm đang ở nút mở panel là do `Modal` trả về khi đóng — chưa
    // phải người dùng tự chọn, nên chưa dừng.
    if (daFocus && !moCoi && active !== daFocus) return
    const h1 = document.querySelector('h1')
    const moi = h1 && (h1 !== cu || performance.now() >= mocNhanH1Cu) ? h1 : null
    const dich = moi ?? (moCoi ? document.getElementById(MAIN_CONTENT_ID) : null)
    if (dich && dich !== daFocus && (moCoi || dich === moi)) {
      dich.focus({ preventScroll: dich !== moi })
      daFocus = dich
    }
    if (performance.now() < hetHan) requestAnimationFrame(thu)
  }
  requestAnimationFrame(thu)
}

/** Tập chương phải mở sẵn — ưu tiên `nodeId` (duy nhất) hơn mã nội dung. */
function chuongDangMo(
  outline: Outline,
  activeContentId: string | undefined,
  activeNodeId: string | undefined,
): ReadonlySet<string> {
  return activeNodeId === undefined
    ? ancestorChapterIds(outline, activeContentId)
    : ancestorChapterIdsOfNode(outline, activeNodeId)
}

export interface UseOutlinePaneOptions {
  /** Cây đã dựng sẵn; `undefined` (mã lạ, môn chưa có bài) → không vẽ mảnh nào. */
  outline: Outline | undefined
  /** Mã nội dung đang mở (lessonId). Trang danh sách/bậc/khoá thì bỏ trống. */
  activeContentId?: string
  /**
   * `nodeId` của lá đang mở — dùng thay `activeContentId` khi mã nội dung có thể trùng trong
   * cùng một cây (Tiếng Anh: một vòng từ vựng xuất hiện ở hai unit của cấp B2).
   */
  activeNodeId?: string
  /** Tiêu đề mục lục — cũng là nhãn nút mở trên mobile. */
  title: string
  /**
   * Khoá lưu trạng thái mở/thu, RIÊNG cho từng môn/khoá (`'p3'`, `'khoa:git'`,
   * `'physics:10'`). Dùng chung một khoá sẽ khiến mở chương ở khoá này lại ảnh hưởng khoá kia.
   */
  storageKey: string
  isDesktop: boolean
  /** Dòng phụ dưới cây (trạng thái tải tiến độ…). */
  footer?: ReactNode
}

export interface OutlinePaneParts {
  /** Cột trái desktop — truyền vào `rail` của `TwoPane`. `null` ở mobile. */
  rail: ReactNode
  /** Nút "Mục lục …" cho mobile — đặt cạnh tiêu đề bài. `null` ở desktop. */
  trigger: ReactNode
  /** Panel mobile. Đặt ở bất kỳ đâu trong trang (nó tự portal ra `<body>`). */
  sheet: ReactNode
}

export function useOutlinePane({
  outline,
  activeContentId,
  activeNodeId,
  title,
  storageKey,
  isDesktop,
  footer,
}: UseOutlinePaneOptions): OutlinePaneParts {
  const [moPanel, setMoPanel] = useState(false)
  // Trạng thái mở/thu ĐI KÈM khoá của nó. Gộp chung một state thay vì đồng bộ bằng `useEffect`:
  // khi trang chuyển sang môn/khoá khác, so khoá ngay trong lúc render là biết tập cũ đã hết
  // hiệu lực — không phải render một lượt bằng dữ liệu sai rồi mới sửa (React gọi đây là
  // "điều chỉnh state khi props đổi", và nó tránh được một lượt render thừa).
  // `ids === undefined` = người dùng chưa bấm gì → để `OutlineTree` tự mở chương của bài đang xem.
  const [luu, setLuu] = useState<{ key: string; ids: ReadonlySet<string> | undefined }>(() => ({
    key: storageKey,
    ids: docChuongMo(storageKey),
  }))
  const chuongMo = luu.key === storageKey ? luu.ids : docChuongMo(storageKey)
  if (luu.key !== storageKey) setLuu({ key: storageKey, ids: chuongMo })

  const toggleChuong = useCallback(
    (nodeId: string) => {
      setLuu((truoc) => {
        // Lần bấm đầu tiên: lấy đúng những gì đang hiện trên màn hình làm điểm xuất phát,
        // nếu không thì chương của bài đang mở sẽ đột ngột đóng lại khi bấm chương khác.
        const goc =
          (truoc.key === storageKey ? truoc.ids : undefined) ??
          (outline ? chuongDangMo(outline, activeContentId, activeNodeId) : new Set<string>())
        const sau = new Set(goc)
        if (sau.has(nodeId)) sau.delete(nodeId)
        else sau.add(nodeId)
        ghiChuongMo(storageKey, sau)
        return { key: storageKey, ids: sau }
      })
    },
    [outline, activeContentId, activeNodeId, storageKey],
  )

  if (!outline) return { rail: null, trigger: null, sheet: null }

  // `trongPanel`: panel đã có tiêu đề dính của chính nó, nên cây không vẽ tiêu đề lần hai.
  const tree = (onSelectLeaf?: () => void, trongPanel = false) => (
    <OutlineTreeLinked
      headingHidden={trongPanel}
      outline={outline}
      {...(activeContentId ? { activeContentId } : {})}
      {...(activeNodeId ? { activeNodeId } : {})}
      title={title}
      {...(chuongMo ? { openIds: chuongMo } : {})}
      onToggleOpen={toggleChuong}
      {...(onSelectLeaf ? { onSelectLeaf } : {})}
      {...(footer ? { footer } : {})}
    />
  )

  return {
    rail: isDesktop ? tree() : null,
    trigger: isDesktop ? null : (
      <button
        type="button"
        onClick={() => setMoPanel(true)}
        className="tap-44 inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-line-strong bg-surface-card px-4 py-2.5 font-semibold text-content transition"
      >
        <ListTree className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{title}</span>
      </button>
    ),
    sheet:
      moPanel && !isDesktop ? (
        <Modal title={title} variant="sheet" onClose={() => setMoPanel(false)}>
          {tree(() => {
            setMoPanel(false)
            dieuTieuDiemVeTieuDe()
          }, true)}
        </Modal>
      ) : null,
  }
}
