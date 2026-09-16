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

/** Bao nhiêu khung hình thì thôi chờ `<h1>` mới — ~0,5 giây ở 60 fps. */
const SO_KHUNG_CHO_H1 = 30

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
  let conLai = SO_KHUNG_CHO_H1
  const thu = () => {
    const moi = document.querySelector('h1')
    if (moi && moi !== cu) {
      moi.focus()
      return
    }
    conLai -= 1
    if (conLai > 0) requestAnimationFrame(thu)
    else moi?.focus()
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
