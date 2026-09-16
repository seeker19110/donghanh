// ActivityResult — MÀN KẾT QUẢ dùng chung sau khi nộp một hoạt động học.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s11-completion-evidence.md AC-14 (slice S11-3).
//
// BA QUYẾT ĐỊNH ĐÁNG NHỚ:
//
//  1. NĂM TRẠNG THÁI, TRẠNG THÁI NÀO CŨNG CÓ CHỮ. `passed`/`failed` là lời của SERVER;
//     `local` là kết quả chấm trên chính máy này (khách); `pending` là "chưa gửi được, đang
//     giữ lại"; `error` là "gửi lên và bị từ chối". Người học phải phân biệt được bốn tình
//     huống rất khác nhau đó mà không cần nhìn màu — nên khác biệt nằm ở CÂU CHỮ, màu chỉ đi
//     kèm.
//
//  2. CHỮ "HOÀN THÀNH" CHỈ THUỘC VỀ `passed`. Bản chấm cục bộ nói rõ nó mới nằm trên máy này;
//     bản đang chờ gửi nói rõ nó chưa tới máy chủ. Đây là hình chiếu lên giao diện của bất
//     biến lớn nhất slice S11: client không tự phong hoàn thành cho mình.
//
//  3. LÝ DO SAI NÓI BẰNG TIẾNG VIỆT, KHÔNG GỌI AI. `reason` của `GradeResult` (engine chấm
//     thuần, tất định) đã đủ để nói "Thiếu đơn vị" hay "Chưa tối giản" — đúng tinh thần
//     `packages/core-grading`: AI chỉ để GIẢI THÍCH thêm, không bao giờ để PHÁN đúng/sai.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { nhanLyDo } from '../../lib/gradeReasonLabel'
import { buttonClass } from '@core/buttonStyles'

/** Năm trạng thái của một lượt nộp — xem ghi chú 1 ở đầu file. */
export type ActivityResultStatus = 'passed' | 'failed' | 'pending' | 'local' | 'error'

/** Vì sao lượt nộp còn nằm trên máy (khớp `PendingReason` của `lib/stemEvidence.ts`). */
export type ActivityResultPendingReason = 'offline' | 'server' | 'auth'

export interface ActivityResultItem {
  prompt: string
  /** Chữ người học đã trả lời (trắc nghiệm: nhãn lựa chọn, không phải id). */
  yourAnswer: string
  correct: boolean
  /** Lời giảng của bài — hiện khi câu này sai. */
  explain?: string
  /**
   * Mã lý do của engine chấm (`ReasonCode`), đổi sang chữ tiếng Việt ở `nhanLyDo`.
   *
   * Kiểu là `string` chứ không phải `ReasonCode` vì mã này đi qua MẠNG: hợp đồng
   * `EvidenceItem` khai `reason: z.string()`, nên một server mới hơn hoàn toàn có thể trả về
   * mã mà bản web đang chạy chưa biết. Ép kiểu hẹp ở đây chỉ để type-checker yên tâm rồi vỡ
   * lúc chạy — thà nhận mọi chuỗi và bỏ qua mã lạ.
   */
  reason?: string
}

export interface ActivityResultProps {
  status: ActivityResultStatus
  correct: number
  total: number
  /**
   * Kết quả chấm TẠI CHỖ (khách / bản đang chờ gửi). Không dùng cho `passed`/`failed` — hai
   * trạng thái đó đã tự nói lên phán quyết của server.
   */
  passed?: boolean
  pendingReason?: ActivityResultPendingReason
  /** Lời từ chối của server, hiện nguyên văn khi `status === 'error'`. */
  errorMessage?: string
  items: readonly ActivityResultItem[]
  /** Tỉ lệ đúng tối thiểu để đạt; có thì hiện thêm một dòng ngưỡng khi chưa đạt. */
  passRatio?: number
  /** Route bài tiếp theo, lấy từ `prevNext` của cây mục lục (S07). */
  nextHref?: string
  /** Làm lại: nơi gọi dọn kết quả cũ, lượt nộp sau sinh `attemptId` MỚI. */
  onRetry?: () => void
  /** Chỗ cắm "Hẹn ôn" cho slice S12. S11 KHÔNG ghi thẻ ôn nào. */
  reviewSlot?: ReactNode
}

/** Câu tổng kết của từng trạng thái. Đây là nơi DUY NHẤT quyết định người học đọc được gì. */
function cauTongKet(p: ActivityResultProps): string {
  const diem = `Đúng ${p.correct}/${p.total} câu.`
  switch (p.status) {
    case 'passed':
      return `${diem} Đã hoàn thành bài này.`
    case 'failed':
      return `${diem} Chưa đạt.`
    case 'local':
      return p.passed
        ? `${diem} Đạt — kết quả ghi trên máy này, đăng nhập để lưu vào tài khoản.`
        : `${diem} Chưa đạt — kết quả ghi trên máy này.`
    case 'pending':
      return p.pendingReason === 'auth'
        ? `${diem} Đăng nhập lại để lưu kết quả — bài làm đang giữ trên máy này.`
        : `${diem} Đã lưu trên máy này, sẽ gửi lại.`
    case 'error':
      return `Không gửi được kết quả: ${p.errorMessage ?? 'máy chủ từ chối lượt nộp này'}. Phần đúng/sai từng câu ở trên vẫn xem được.`
  }
}

export default function ActivityResult(props: ActivityResultProps) {
  const { status, items, passRatio, nextHref, onRetry, reviewSlot } = props
  // Chưa đạt = mọi trạng thái KHÔNG phải `passed` mà vẫn có phán quyết đạt/không đạt.
  const chuaDat =
    status === 'failed' || ((status === 'local' || status === 'pending') && !props.passed)

  return (
    <section
      aria-label="Kết quả lượt nộp"
      className="mt-4 rounded-2xl border border-line-subtle bg-surface-card p-4"
    >
      {/* Vùng SỐNG chỉ bọc câu tổng kết: trình đọc màn hình đọc ngay phán quyết, còn danh sách
          từng câu bên dưới để người học tự đọc khi cần — đọc to cả bảng là làm phiền. */}
      <div role="status">
        <p className="font-medium text-content">{cauTongKet(props)}</p>
        {chuaDat && passRatio !== undefined && (
          <p className="mt-1 text-content-secondary">
            Cần đúng từ {Math.round(passRatio * 100)}% số câu trở lên.
          </p>
        )}
      </div>

      {items.length > 0 && (
        <ol className="mt-3 space-y-3">
          {items.map((item, i) => {
            const lyDo = item.correct ? undefined : nhanLyDo(item.reason)
            return (
              <li key={i} className="rounded-xl border border-line-subtle p-3">
                <p className="font-medium text-content">
                  <span
                    className={
                      item.correct
                        ? 'text-emerald-400 theme-light:text-emerald-800'
                        : 'text-content-muted'
                    }
                  >
                    {item.correct ? (
                      <Check className="inline h-4 w-4 mr-1" aria-hidden="true" />
                    ) : (
                      <X className="inline h-4 w-4 mr-1" aria-hidden="true" />
                    )}
                  </span>
                  Câu {i + 1}. {item.prompt}
                </p>
                <p className="mt-1 text-content-secondary">
                  Bạn trả lời: {item.yourAnswer.trim() === '' ? '(bỏ trống)' : item.yourAnswer} ·{' '}
                  {item.correct ? 'Đúng' : (lyDo ?? 'Chưa đúng')}
                </p>
                {!item.correct && item.explain && (
                  <p className="mt-1 text-content-secondary">{item.explain}</p>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {reviewSlot}

      {(onRetry || nextHref) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`${buttonClass({ variant: 'secondary' })} min-h-[44px]`}
            >
              Làm lại
            </button>
          )}
          {nextHref && (
            <Link to={nextHref} className={`${buttonClass({ variant: 'ghost' })} min-h-[44px]`}>
              Bài tiếp theo
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
