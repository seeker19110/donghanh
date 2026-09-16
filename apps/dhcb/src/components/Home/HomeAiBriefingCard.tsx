// apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx — Thẻ "Bạn Đồng Hành AI" mở đầu trang chủ:
// lời chào + bản tin ngắn (giọng Companion). Việc học ở TodayCard.
//
// [S06-2, 2026-09-16] Thẻ này KHÔNG còn quyết định việc học. Trước đây nó tự dựng "Kế hoạch hôm
// nay" từ tín hiệu môn Tiếng Anh, nên người chỉ học Lập trình vẫn bị mời vào `/lo-trinh-hoc` —
// đúng cái "mặc định tiếng Anh" mà nền tảng cấm. Việc học nay ở `TodayCard` (một CTA, nguồn bằng
// chứng rõ, mọi môn). Ở đây chỉ còn giọng Companion: lời chào + bản tin.
// Đặc tả: docs/specs/2026-09-15-learning-ux-s06-hom-nay-hoc-tiep.md §④ AC-14, §7 Q5.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, CheckCircle2, ChevronRight, Volume2 } from 'lucide-react'
import { fetchProactiveBriefing } from '../../lib/proactiveBriefingApi'
import { speak } from '../../lib/tts'
import type { ProactiveBriefing } from '@dhcb/core-contracts/proactiveBriefing'

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
}

const FALLBACK_SUMMARY =
  'Hôm nay hãy bắt đầu bằng việc quan trọng nhất trước, rồi giữ một bước nhỏ tiếp theo để duy trì nhịp học.'

function timeOfDayGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Chào buổi sáng'
  if (hour >= 12 && hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

export default function HomeAiBriefingCard({
  userName,
  dailyLearned = 0,
  dailyMax = 20,
  showDailyWords = false,
}: Props) {
  const nav = useNavigate()
  const [briefing, setBriefing] = useState<ProactiveBriefing | null>(null)
  const [loading, setLoading] = useState(true)

  const greeting = timeOfDayGreeting(new Date().getHours())

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

  return (
    <section
      aria-label="Bạn Đồng Hành AI chào và đề xuất"
      className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 animate-fade-up"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-accent-500/15 text-accent-400 flex items-center justify-center shrink-0">
          <Bot className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Bạn Đồng Hành AI
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            {userName ? `${greeting}, ${userName}!` : `${greeting}, bạn!`}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div aria-live="polite" className="space-y-2" aria-label="Đang tải bản tin">
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-11/12" />
            <div className="h-3.5 rounded bg-zinc-800 animate-pulse w-2/3" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-zinc-200 leading-relaxed read-measure">{summary}</p>
              <button
                onClick={() => void speak(summary, 'vi-VN')}
                aria-label="Nghe giọng đọc bản tin"
                title="Nghe giọng đọc AI"
                className="tap-44 p-1.5 rounded-lg text-zinc-400 hover:text-accent-300 hover:bg-zinc-800 transition active:scale-95 shrink-0"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {insight && (
              <p className="mt-2 flex items-center gap-2 text-sm text-emerald-400 theme-light:text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{insight}</span>
              </p>
            )}
          </>
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
