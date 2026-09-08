// apps/dhcb/src/components/Home/HomeAiBriefingCard.tsx — Thẻ "Bạn Đồng Hành AI" mở đầu trang chủ:
// lời chào + bản tin ngắn + ĐÚNG HAI việc nên làm tiếp.
//
// P1.1 (2026-09-08): hai việc không còn hard-code thứ tự trong JSX. Planner thuần ở
// dailyLearningPlan.ts xếp hạng deterministic từ tín hiệu đã có; UI chỉ render kế hoạch.
// P1.2: đo impression/click theo action kind để biết planner có tạo hành vi thật hay không.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Brain,
  Play,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Volume2,
  Clock3,
} from 'lucide-react'
import { fetchProactiveBriefing } from '../../lib/proactiveBriefingApi'
import { speak } from '../../lib/tts'
import { track } from '../../lib/analytics'
import type { ProactiveBriefing } from '@dhcb/core-contracts/proactiveBriefing'
import { buildDailyLearningPlan, type DailyPlanAction } from '../../lib/dailyLearningPlan'

interface Props {
  userName?: string
  srsDueCount?: number
  dailyLearned?: number
  dailyMax?: number
  continueLessonLabel?: string
  continueLevelId?: string
  onContinueClick?: () => void
}

const FALLBACK_SUMMARY =
  'Hôm nay hãy bắt đầu bằng việc quan trọng nhất trước, rồi giữ một bước nhỏ tiếp theo để duy trì nhịp học.'
const DAILY_PLAN_VERSION = 'p1.1'

const ACTION_BUTTON =
  'tap-44 flex items-start justify-between gap-2 p-3 rounded-2xl bg-zinc-800/60 hover:bg-zinc-800 text-left transition-colors duration-200 active:scale-[0.98] group'

function timeOfDayGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Chào buổi sáng'
  if (hour >= 12 && hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function actionIcon(action: DailyPlanAction) {
  if (action.kind === 'srs_review') return <Brain className="w-4 h-4" aria-hidden="true" />
  if (action.kind === 'continue_learning')
    return <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
  return <Sparkles className="w-4 h-4" aria-hidden="true" />
}

function actionTone(action: DailyPlanAction): string {
  if (action.kind === 'srs_review') return 'bg-sky-500/15 text-sky-400 theme-light:text-sky-900'
  if (action.kind === 'continue_learning') return 'bg-accent-500/15 text-accent-400'
  return 'bg-lime-500/15 text-lime-400 theme-light:text-lime-900'
}

export default function HomeAiBriefingCard({
  userName,
  srsDueCount = 0,
  dailyLearned = 0,
  dailyMax = 20,
  continueLessonLabel,
  continueLevelId,
  onContinueClick,
}: Props) {
  const nav = useNavigate()
  const [briefing, setBriefing] = useState<ProactiveBriefing | null>(null)
  const [loading, setLoading] = useState(true)

  const greeting = timeOfDayGreeting(new Date().getHours())
  const plan = buildDailyLearningPlan({
    srsDueCount,
    dailyLearned,
    dailyMax,
    continueLessonLabel,
  })
  const planKey = plan.map((action) => action.kind).join(',')

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

  useEffect(() => {
    // Một impression cho mỗi action thực sự được render. `planKey` chỉ đổi khi tập action đổi,
    // nên các re-render do briefing/loading không bắn lặp dữ liệu.
    for (const action of plan) {
      track('daily_plan_impression', { refCode: action.kind, utmSource: DAILY_PLAN_VERSION })
    }
    // `plan` được dựng lại mỗi render; dependency dùng key ổn định để tránh impression trùng.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planKey])

  const summary = briefing?.summary ?? FALLBACK_SUMMARY
  const insight = briefing?.insights?.[0]

  function runAction(action: DailyPlanAction) {
    track('daily_plan_click', { refCode: action.kind, utmSource: DAILY_PLAN_VERSION })
    if (action.kind === 'srs_review') {
      nav(
        continueLevelId
          ? `/lo-trinh-hoc/${continueLevelId.toLowerCase()}?tab=srs`
          : '/lo-trinh-hoc?tab=srs',
      )
      return
    }
    if (action.kind === 'continue_learning' && onContinueClick) {
      onContinueClick()
      return
    }
    nav('/lo-trinh-hoc')
  }

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

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <h3 className="text-sm font-semibold text-white">Kế hoạch hôm nay</h3>
          <span className="text-xs text-zinc-400">ưu tiên tự động · không dùng AI</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {plan.map((action, index) => (
            <button key={action.kind} onClick={() => runAction(action)} className={ACTION_BUTTON}>
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${actionTone(action)}`}
                >
                  {actionIcon(action)}
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-zinc-400 font-medium">
                    {index === 0 ? 'Ưu tiên 1' : 'Tiếp theo'}
                  </span>
                  <p className="text-sm font-semibold text-white truncate mt-0.5">{action.title}</p>
                  <p className="text-xs text-zinc-400 leading-snug mt-1 line-clamp-2">
                    {action.reason}
                  </p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-zinc-500">
                    <Clock3 className="w-3 h-3" aria-hidden="true" />
                    khoảng {action.estimatedMinutes} phút
                  </span>
                </div>
              </div>
              <ArrowRight
                className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-transform shrink-0 mt-3"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-800 text-sm text-zinc-400">
        <span>
          Hôm nay đã học{' '}
          <strong className="text-zinc-200 font-semibold">
            {dailyLearned}/{dailyMax}
          </strong>{' '}
          từ
        </span>
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
