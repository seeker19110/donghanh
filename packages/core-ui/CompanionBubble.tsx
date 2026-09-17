// packages/core-ui/CompanionBubble.tsx — Bong bóng lời thoại của Companion "Bạn Đồng Hành"
// (P0-2, 2026-09-17). Nền ấm (`bg-warm-50`/`border-warm-100`), CHỮ LUÔN `text-content` (không
// `text-warm-*`) để giữ AAA — xem docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P0-2 ③.
//
// KHÔNG cắt chuỗi trong JS: `lead`/`detail` luôn nằm nguyên trong DOM, chỉ ẩn phần thừa bằng
// CSS `line-clamp` — cắt bằng JS (slice + "...") sẽ làm mất chữ với người dùng trình đọc màn
// hình bật "hiện toàn bộ văn bản" hoặc copy nội dung.
import type { ReactNode } from 'react'
import { Volume2, X } from 'lucide-react'

export interface CompanionBubbleProps {
  variant: 'home' | 'inline' | 'done'
  /** Dòng 1, bắt buộc, ≤ 90 ký tự (cắt bằng CSS line-clamp, KHÔNG cắt chuỗi). */
  lead: string
  /** Dòng 2, ≤ 120 ký tự. */
  detail?: string
  /** Hiện nút 🔊 khi có. */
  onSpeak?: () => void
  /** Hiện nút ✕ khi có (chỉ 'inline' và comeback). */
  onDismiss?: () => void
  /** Link chữ nhỏ dưới bong bóng (vd: "Ôn 5 thẻ" · "Học 3 từ mới"). */
  children?: ReactNode
}

const VARIANT_LABEL: Record<CompanionBubbleProps['variant'], string> = {
  home: 'Lời chào của Bạn Đồng Hành',
  inline: 'Ghi chú của Bạn Đồng Hành',
  done: 'Lời chúc mừng của Bạn Đồng Hành',
}

export function CompanionBubble({
  variant,
  lead,
  detail,
  onSpeak,
  onDismiss,
  children,
}: CompanionBubbleProps) {
  return (
    <div
      role="group"
      aria-label={VARIANT_LABEL[variant]}
      className="relative rounded-2xl border border-warm-100 bg-warm-50 px-4 py-3"
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-content line-clamp-2 leading-relaxed read-measure">
            {lead}
          </p>
          {detail && (
            <p className="mt-1 text-sm text-content line-clamp-2 leading-relaxed read-measure">
              {detail}
            </p>
          )}
        </div>
        {onSpeak && (
          <button
            type="button"
            onClick={onSpeak}
            aria-label="Nghe giọng đọc"
            title="Nghe giọng đọc"
            className="tap-44 shrink-0 rounded-lg p-1.5 text-content-secondary transition hover:bg-warm-100 hover:text-content"
          >
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Đóng"
            title="Đóng"
            className="tap-44 shrink-0 rounded-lg p-1.5 text-content-secondary transition hover:bg-warm-100 hover:text-content"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {children && <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{children}</div>}
    </div>
  )
}

export default CompanionBubble
