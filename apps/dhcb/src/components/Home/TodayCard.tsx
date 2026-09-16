// TodayCard — thẻ "Hôm nay" của Trang chủ: ĐÚNG MỘT việc chính + tối đa hai việc phụ.
//
// Đặc tả: docs/specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md §④ S06-2.
//
// BA LUẬT của thẻ này:
//  1. MỘT CTA chính. Bấm một lần là tới màn học — không có màn trung gian, không có hai nút
//     ngang hàng để người học phải chọn. Việc phụ là chữ nhỏ bên dưới, tối đa hai.
//  2. KHÔNG QUYẾT ĐỊNH GÌ. Mọi luật "học gì trước" nằm ở `buildTodayPlan` (thuần, test bảng);
//     thẻ chỉ vẽ `TodayPlan` và điều hướng bằng đúng `item.href` — không tự ghép URL, không có
//     nhánh `if (subjectId === 'english')` nào. Đó là cách "không mặc định tiếng Anh" được giữ.
//  3. NÓI THẬT VỀ NGUỒN. Mỗi mục có một dòng phụ nói bằng CHỮ vì sao nó ở đây ("Phiên đang dở ·
//     5 phút trước", "Bài kế tiếp trong mục lục"). Tuyệt đối không con số chẩn đoán (band, CEFR,
//     phần trăm thành thạo) — "Hôm nay" là công cụ chọn việc, không phải bảng điểm.
import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, Brain, Compass, Play, RotateCcw } from 'lucide-react'
import type { TodayItem, TodayPlan } from '@dhcb/core-contracts/todayPlan'
import { track } from '../../lib/analytics'
import { dongNguon, nhanChinh } from './todayCardText'

/** Giữ TÊN event cũ để bảng số liệu so sánh được trước/sau; `utmSource` tách theo slice. */
const TODAY_VERSION = 's06'

export interface TodayCardProps {
  plan: TodayPlan | null
  state: 'loading' | 'ready' | 'error'
  /** Tải lại tiến độ sau lỗi mạng. */
  onRetry?: () => void
}

function bieuTuong(item: TodayItem) {
  if (item.kind === 'pick') return <Compass className="w-5 h-5" aria-hidden="true" />
  if (item.kind === 'review') return <Brain className="w-5 h-5" aria-hidden="true" />
  return <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
}

function maMuc(item: TodayItem): string {
  return `${item.kind}:${item.subjectId ?? '-'}`
}

/** Khung ngoài dùng chung cho cả 4 trạng thái — cùng một khối để thẻ không nhảy layout. */
function Khung({ children }: { children: ReactNode }) {
  return (
    <section
      aria-labelledby="today-card-heading"
      className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 animate-fade-up"
    >
      <h2 id="today-card-heading" className="text-base sm:text-lg font-bold text-white mb-3">
        Hôm nay
      </h2>
      {children}
    </section>
  )
}

export default function TodayCard({ plan, state, onRetry }: TodayCardProps) {
  const primary = plan?.primary ?? null
  // Một impression cho mỗi mục thực sự được vẽ. Khoá phụ thuộc là tập mã mục, nên các lần vẽ
  // lại vì lý do khác (đổi bề rộng, thẻ khác tải xong) không bắn số liệu trùng.
  const impressionKey = plan?.primary ? [plan.primary, ...plan.secondary].map(maMuc).join(',') : ''

  useEffect(() => {
    if (!impressionKey) return
    for (const code of impressionKey.split(',')) {
      track('daily_plan_impression', { refCode: code, utmSource: TODAY_VERSION })
    }
  }, [impressionKey])

  if (state === 'loading' || !plan || !primary) {
    // Skeleton CÙNG CHIỀU CAO với thẻ thật (nút 68px + một dòng phụ) để không đẩy nội dung
    // bên dưới khi dữ liệu về. Đây là chỗ DUY NHẤT của thẻ được phép nhấp nháy (luật đợt D3).
    return (
      <Khung>
        <div aria-busy="true" aria-live="polite" aria-label="Đang tìm việc học hôm nay">
          <div className="h-[68px] rounded-2xl bg-zinc-800 animate-pulse" />
          <div className="h-4 w-2/5 mt-3 rounded bg-zinc-800 animate-pulse" />
        </div>
      </Khung>
    )
  }

  // `builtAt` là mốc thời gian resolver đã chốt — thẻ KHÔNG tự gọi `Date.now()` khi vẽ.
  const bayGio = plan.builtAt
  const secondary = plan.secondary
  const nguonChinh = dongNguon(primary, bayGio)

  return (
    <Khung>
      {/* Việc chính: MỘT liên kết, cả khối bấm được, cao hơn 44px ở mọi bề rộng. */}
      <Link
        to={primary.href}
        onClick={() =>
          track('daily_plan_click', { refCode: maMuc(primary), utmSource: TODAY_VERSION })
        }
        className="tap-44 flex items-center gap-3.5 p-3.5 rounded-2xl bg-accent-500/15 hover:bg-accent-500/25 transition-colors duration-200 active:scale-[0.98] group"
      >
        <span className="w-11 h-11 rounded-2xl bg-accent-500/20 text-accent-300 theme-light:text-accent-900 flex items-center justify-center shrink-0">
          {bieuTuong(primary)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm sm:text-base font-semibold text-white line-clamp-2 break-words">
            {nhanChinh(primary)}
          </span>
          {nguonChinh && (
            <span className="block text-xs text-zinc-400 mt-0.5 line-clamp-1">{nguonChinh}</span>
          )}
        </span>
        <ArrowRight
          className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-transform shrink-0"
          aria-hidden="true"
        />
      </Link>

      {secondary.length > 0 && (
        <ul className="mt-2.5 space-y-1.5">
          {secondary.map((item) => {
            const nguon = dongNguon(item, bayGio)
            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  onClick={() =>
                    track('daily_plan_click', { refCode: maMuc(item), utmSource: TODAY_VERSION })
                  }
                  className="tap-44 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-zinc-800/60 hover:bg-zinc-800 transition-colors duration-200"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-zinc-200 line-clamp-2 break-words">
                      {item.title}
                    </span>
                    {nguon && (
                      <span className="block text-xs text-zinc-400 line-clamp-1">{nguon}</span>
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {/* Lỗi mạng KHÔNG che việc học: CTA ở trên vẫn dựng từ dữ liệu cục bộ/cache. */}
      {state === 'error' && (
        <p
          role="status"
          className="mt-3 flex items-center gap-2 text-xs text-amber-300 theme-light:text-amber-900"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Chưa tải được tiến độ</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="tap-44-y font-semibold underline underline-offset-4 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              Thử lại
            </button>
          )}
        </p>
      )}
    </Khung>
  )
}
