import { AlertTriangle, Inbox, Loader2, RotateCcw } from 'lucide-react'
import type { ListLoadState } from './useCompanionList'

interface Props {
  state: ListLoadState
  /** Tên thứ đang nạp, viết thường, vd "bài mẫu", "kịch bản". */
  noun: string
  onRetry: () => void
}

// Khối trạng thái dùng chung cho thẻ Bạn Đồng Hành: đang tải / rỗng / lỗi.
// Trạng thái `ready` không render gì — thẻ tự vẽ nội dung của nó.
export default function CardLoadStatus({ state, noun, onRetry }: Props) {
  if (state === 'ready') return null

  if (state === 'loading') {
    return (
      <div
        role="status"
        className="mt-4 flex items-center gap-2 rounded-xl border border-line-subtle bg-surface-raised p-4"
      >
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-content-secondary" aria-hidden />
        <p className="text-sm text-content-secondary">Đang tải {noun}…</p>
      </div>
    )
  }

  const isError = state === 'error'
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className="mt-4 flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-start gap-2">
        {isError ? (
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-red-400 theme-light:text-red-900"
            aria-hidden
          />
        ) : (
          <Inbox className="mt-0.5 h-4 w-4 shrink-0 text-content-secondary" aria-hidden />
        )}
        <p className="text-sm text-content">
          {isError
            ? `Chưa tải được ${noun}. Kiểm tra kết nối mạng rồi thử lại.`
            : `Hiện chưa có ${noun} nào. Bạn quay lại sau nhé.`}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="tap-44-y inline-flex shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-content hover:bg-surface-card sm:self-auto"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden />
        Thử lại
      </button>
    </div>
  )
}
