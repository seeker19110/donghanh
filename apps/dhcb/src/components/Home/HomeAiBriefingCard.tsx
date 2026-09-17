// apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx — Thẻ "Bạn Đồng Hành AI" mở đầu trang chủ:
// lời chào + bản tin ngắn (giọng Companion). Việc học ở TodayCard.
//
// [S06-2, 2026-09-16] Thẻ này KHÔNG còn quyết định việc học. Trước đây nó tự dựng "Kế hoạch hôm
// nay" từ tín hiệu môn Tiếng Anh, nên người chỉ học Lập trình vẫn bị mời vào `/lo-trinh-hoc` —
// đúng cái "mặc định tiếng Anh" mà nền tảng cấm. Việc học nay ở `TodayCard` (một CTA, nguồn bằng
// chứng rõ, mọi môn). Ở đây chỉ còn giọng Companion: lời chào + bản tin.
// Đặc tả: docs/specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md §④ AC-14, §7 Q5.
//
// [P0-2, 2026-09-17] Thay icon `Bot` (lucide) + thẻ xám bằng `CompanionAvatar`/`CompanionBubble`
// (packages/core-ui) và gộp thẻ "quay lại sau bỏ bẵng" (`Home.tsx` cũ, một `.glass` card riêng)
// vào dòng thứ hai của bong bóng + 2 link chữ nhỏ dưới bong bóng. Đặc tả:
// docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P0-2.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { CompanionAvatar, type CompanionMood } from '@dhcb/core-ui/CompanionAvatar'
import { CompanionBubble } from '@dhcb/core-ui/CompanionBubble'
import { fetchProactiveBriefing } from '../../lib/proactiveBriefingApi'
import { speak } from '../../lib/tts'
import { loiChaoTheoGio, cauQuayLai } from '../../prompts/companionVoice'
import type { ProactiveBriefing } from '@dhcb/core-contracts/proactiveBriefing'

/** Nội dung luồng "quay lại sau khi bỏ bẵng" — gộp vào bong bóng Companion (P0-2), không còn
 *  là card riêng. `reviewLabel` là `null` khi không có thẻ SRS nào tới hạn (không hiện link đó). */
export interface HomeComeback {
  daysAway: number
  reviewLabel: string | null
  onReview: () => void
  learnLabel: string
  onLearnNew: () => void
  onDismiss: () => void
}

interface Props {
  userName?: string
  dailyLearned?: number
  dailyMax?: number
  /**
   * Dòng "Hôm nay đã học x/y từ" là kế toán của RIÊNG môn Tiếng Anh (`getDailyLearned`), nên chỉ
   * hiện khi người học thật sự đang học môn đó — hiện với người chỉ học Lập trình chính là mặc
   * định tiếng Anh trá hình (§7 Q5).
   */
  showDailyWords?: boolean
  /** Có mặt khi người dùng đã vắng ≥3 ngày (`shouldShowComeback`) — xem `lib/comeback.ts`. */
  comeback?: HomeComeback
}

const FALLBACK_SUMMARY =
  'Hôm nay hãy bắt đầu bằng việc quan trọng nhất trước, rồi giữ một bước nhỏ tiếp theo để duy trì nhịp học.'

export default function HomeAiBriefingCard({
  userName,
  dailyLearned = 0,
  dailyMax = 20,
  showDailyWords = false,
  comeback,
}: Props) {
  const nav = useNavigate()
  const [briefing, setBriefing] = useState<ProactiveBriefing | null>(null)
  const [loading, setLoading] = useState(true)

  const greeting = loiChaoTheoGio(new Date().getHours(), userName)

  useEffect(() => {
    let isMounted = true
    fetchProactiveBriefing()
      .then((data) => {
        if (isMounted) setBriefing(data)
      })
      .catch(() => {
        if (isMounted) setBriefing(null)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const summary = briefing?.summary ?? FALLBACK_SUMMARY
  const insight = briefing?.insights?.[0]
  const mood: CompanionMood = loading ? 'thinking' : comeback ? 'hasNote' : 'idle'

  return (
    <section
      aria-label="Bạn Đồng Hành AI chào và đề xuất"
      className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 animate-fade-up"
    >
      <div className="flex items-center gap-3">
        <CompanionAvatar mood={mood} size={48} />
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Bạn Đồng Hành AI
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">{greeting}</p>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div aria-live="polite" className="space-y-2" aria-label="Đang tải bản tin">
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-11/12" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-2/3" />
          </div>
        ) : (
          <CompanionBubble
            variant="home"
            lead={summary}
            detail={comeback ? cauQuayLai(comeback.daysAway) : undefined}
            onSpeak={() => void speak(summary, 'vi-VN')}
            onDismiss={comeback?.onDismiss}
          >
            {insight && <span className="text-sm text-content-secondary">{insight}</span>}
            {comeback && (
              <>
                {comeback.reviewLabel && (
                  <button
                    type="button"
                    onClick={comeback.onReview}
                    className="tap-44-y text-sm font-medium text-accent-500 hover:underline"
                  >
                    {comeback.reviewLabel}
                  </button>
                )}
                <button
                  type="button"
                  onClick={comeback.onLearnNew}
                  className="tap-44-y text-sm font-medium text-accent-500 hover:underline"
                >
                  {comeback.learnLabel}
                </button>
              </>
            )}
          </CompanionBubble>
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800 text-sm text-zinc-400">
        {showDailyWords ? (
          <span>
            Hôm nay đã học{' '}
            <strong className="text-zinc-200 font-semibold">
              {dailyLearned}/{dailyMax}
            </strong>{' '}
            từ
          </span>
        ) : (
          <span>Tiến độ của bạn được lưu theo từng môn</span>
        )}
        <button
          onClick={() => nav('/tien-do')}
          className="tap-44-y text-sm text-accent-400 theme-light:text-accent-800 hover:text-accent-300 font-medium flex items-center gap-1 transition"
        >
          <span>Xem tiến độ</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
