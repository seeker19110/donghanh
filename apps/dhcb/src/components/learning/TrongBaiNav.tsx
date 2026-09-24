// TrongBaiNav — mục "Trong bài" của một bài học: nhảy tới lý thuyết / ví dụ / tự kiểm / kết quả…
//
// Contract: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §2.3 (S09b).
//
// KHÁC "Mục lục môn học" (cây các BÀI, ở cột trái/tấm đáy): đây là các PHẦN của bài đang mở.
// Hai dáng theo bề rộng:
//  · desktop — danh sách hiện sẵn ở đầu nội dung: một lần bấm là tới.
//  · mobile  — nút gọn "Trong bài" mở danh sách ngay dưới nó (mẫu disclosure của WAI-ARIA APG,
//    như prototype S09). Chọn disclosure thay vì <Modal> dạng sheet vì: (1) mục lục MÔN đã dùng
//    tấm đáy, hai tấm đáy giống nhau dễ nhầm; (2) danh sách ≤7 mục không cần khoá cuộn/bẫy focus;
//    (3) Modal trả focus về nút mở khi đóng — đúng với Escape, nhưng SAI khi người học vừa chọn
//    đích (§2.3: chọn đích thì focus ĐÍCH). Disclosure để trang tự quyết focus sau khi chọn.
//
// Component chỉ TRÌNH BÀY + báo lựa chọn qua `onChon`; đổi URL/focus/cuộn là việc của trang.
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react'
import { ListOrdered } from 'lucide-react'
import type { MucTrongBai } from '../../lib/stemLessonAnchors'

/** Nhãn cố định của khối — phân biệt với "Mục lục môn học". */
export const NHAN_TRONG_BAI = 'Trong bài'

export interface TrongBaiNavProps {
  muc: readonly MucTrongBai[]
  /** Mobile: thu vào sau một nút. */
  thuGon: boolean
  /** Người học chọn một mục (id không kèm `#`). */
  onChon: (id: string) => void
}

/** Link thật (`href="#id"`) để giữ ngữ nghĩa, chép link/mở tab mới vẫn đúng; bấm thường thì trang tự lo. */
function DanhSach({
  muc,
  doc,
  onBam,
  onPhim,
  refDauTien,
}: {
  muc: readonly MucTrongBai[]
  doc: boolean
  onBam: (e: MouseEvent<HTMLAnchorElement>, id: string) => void
  onPhim?: (e: KeyboardEvent) => void
  refDauTien?: RefObject<HTMLAnchorElement | null>
}) {
  return (
    <ul className={doc ? 'mt-2 space-y-1' : 'mt-2 flex flex-wrap gap-2'}>
      {muc.map((m, i) => (
        <li key={m.id}>
          <a
            href={`#${m.id}`}
            ref={i === 0 ? refDauTien : undefined}
            onClick={(e) => onBam(e, m.id)}
            onKeyDown={onPhim}
            className={`tap-44 inline-flex items-center rounded-xl border border-line-strong bg-surface-card px-3 py-2 font-medium text-content underline-offset-4 hover:underline ${
              doc ? 'w-full' : ''
            }`}
          >
            {m.nhan}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function TrongBaiNav({ muc, thuGon, onChon }: TrongBaiNavProps) {
  const idDanhSach = `${useId()}-trong-bai`
  const [mo, setMo] = useState(false)
  const nutRef = useRef<HTMLButtonElement>(null)
  const dauTienRef = useRef<HTMLAnchorElement>(null)

  // Mở ra thì đưa focus vào mục đầu: Enter trên nút rồi Enter lần nữa là tới "Đầu bài",
  // Tab thêm để tới mục khác — không phải Tab qua cả trang.
  useEffect(() => {
    if (mo) dauTienRef.current?.focus()
  }, [mo])

  // Đóng mà KHÔNG chọn gì (Escape / nút Đóng) → trả focus về nút mở để không mất chỗ đứng.
  const dongVeNut = useCallback(() => {
    setMo(false)
    nutRef.current?.focus()
  }, [])

  // Escape ở BẤT KỲ phần tử nào của khối đang mở (nút mở, từng mục, nút Đóng) → đóng + về nút.
  // Gắn lên chính các phần tử tương tác chứ không lên <nav> (jsx-a11y: phần tử không tương tác
  // không nhận listener bàn phím).
  const phim = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !mo) return
      e.stopPropagation()
      dongVeNut()
    },
    [mo, dongVeNut],
  )

  const bam = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: string) => {
      // Giữ hành vi trình duyệt cho Ctrl/⌘/Shift/chuột giữa (mở tab mới, chép link…).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      e.preventDefault()
      // Đóng danh sách TRƯỚC, trang focus đích SAU (effect của trang chạy sau lượt render này) —
      // không có bước nào trả focus về nút mở chen vào giữa.
      setMo(false)
      onChon(id)
    },
    [onChon],
  )

  if (!thuGon) {
    return (
      <nav aria-label={NHAN_TRONG_BAI} className="mt-4">
        <p aria-hidden="true" className="text-sm font-semibold text-content-secondary">
          {NHAN_TRONG_BAI}
        </p>
        <DanhSach muc={muc} doc={false} onBam={bam} />
      </nav>
    )
  }

  return (
    <div className="mt-4">
      <button
        ref={nutRef}
        type="button"
        aria-expanded={mo}
        aria-controls={idDanhSach}
        onClick={() => setMo((v) => !v)}
        onKeyDown={phim}
        className="tap-44 inline-flex items-center gap-2 rounded-2xl border border-line-strong bg-surface-card px-4 py-2.5 font-semibold text-content"
      >
        <ListOrdered className="h-4 w-4 shrink-0" aria-hidden="true" />
        {NHAN_TRONG_BAI}
      </button>
      {/* Đóng = không render: nội dung ẩn không bao giờ nhận focus. `aria-controls` trỏ tới id
          chưa tồn tại lúc đóng là cách APG cho phép với disclosure. */}
      {mo && (
        <nav
          id={idDanhSach}
          aria-label={NHAN_TRONG_BAI}
          className="mt-2 rounded-2xl border border-line-subtle bg-surface-card p-3"
        >
          <DanhSach muc={muc} doc onBam={bam} onPhim={phim} refDauTien={dauTienRef} />
          <button
            type="button"
            onClick={dongVeNut}
            onKeyDown={phim}
            className="tap-44 mt-2 inline-flex items-center rounded-xl px-3 py-2 font-medium text-content-secondary underline underline-offset-4"
          >
            Đóng
          </button>
        </nav>
      )}
    </div>
  )
}
