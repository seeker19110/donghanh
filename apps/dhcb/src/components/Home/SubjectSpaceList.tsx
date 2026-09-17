// SubjectSpaceList.tsx — khối "Bộ môn" của trang chủ (P1-8).
//
// Đặc tả: docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P1-8.
//
// Tách khỏi Home.tsx (từng khai `SUBJECT_ICON`…`subjectSpaces` tại chỗ) để:
//  1. Sắp môn ĐANG HỌC (`plan.subjectsSeen`) lên đầu qua `orderSubjects` (thuần, test riêng) —
//     KHÔNG mặc định tiếng Anh khi chưa có bằng chứng nào (`seen` rỗng).
//  2. Thêm dòng trạng thái bằng CHỮ ("đang học · <tên chặng>" / "chưa bắt đầu") — không thanh %,
//     không số, đúng luật "Hôm nay là công cụ chọn việc, không phải bảng điểm".
//  3. Mobile chỉ hiện 3 thẻ đầu (đỡ dài trang) + nút "Xem tất cả" mở nốt phần còn lại tại chỗ;
//     desktop đủ chỗ nên hiện lưới 2 cột luôn.
//  4. Empty state (`primary.kind==='pick'` — người mới/chưa chọn việc gì) đổi CTA phụ mỗi thẻ
//     thành "Thử 5 phút" để mời hành động nhẹ, thay vì im lặng.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Calculator,
  GraduationCap,
  Atom,
  FlaskConical,
  Dna,
  Code2,
} from 'lucide-react'
import { SUBJECT_ENTRIES, type SubjectEntry } from '@dhcb/core-learner/subjectEntry'
import type { TodayPlan } from '@dhcb/core-contracts/todayPlan'
import { orderSubjects } from '../../lib/home/orderSubjects'

export interface SubjectSpaceListProps {
  plan: TodayPlan | null
  isDesktop: boolean
  /** Số thẻ hiện sẵn ở mobile trước khi bấm "Xem tất cả". Mặc định 3. */
  initialVisible?: number
}

const SUBJECT_ICON: Record<string, typeof GraduationCap> = {
  english: GraduationCap,
  programming: Code2,
  mathematics: Calculator,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
}
const SUBJECT_TONE: Record<string, string> = {
  english: 'bg-emerald-500/15 text-emerald-400 theme-light:text-emerald-900',
  programming: 'bg-cyan-500/15 text-cyan-400 theme-light:text-cyan-900',
  mathematics: 'bg-blue-500/15 text-blue-400 theme-light:text-blue-800',
  physics: 'bg-blue-500/15 text-blue-400 theme-light:text-blue-800',
  chemistry: 'bg-blue-500/15 text-blue-400 theme-light:text-blue-800',
  biology: 'bg-blue-500/15 text-blue-400 theme-light:text-blue-800',
}
const SUBJECT_DESC: Record<string, string> = {
  english: 'Gia sư song ngữ Việt ⇄ Anh: lộ trình CEFR A1–C2, luyện nói, chấm bài viết, từ điển.',
  programming: 'Từ số 0 tới sản phẩm chạy thật: Python, JavaScript/TypeScript, SQL — bậc P1–P6.',
  mathematics: 'Đại số, hình học, giải tích, xác suất — giải từng bước cùng AI.',
  physics: 'Cơ, nhiệt, điện từ, quang — mô phỏng thí nghiệm trực quan.',
  chemistry: 'Vô cơ, hữu cơ, phản ứng oxi hóa khử — công thức LaTeX rõ ràng.',
  biology: 'Di truyền, tế bào, tiến hóa, sinh thái — bài tập có hướng dẫn lập luận.',
}
const SUBJECT_SHORTCUTS: Record<string, Array<{ label: string; path: string }>> = {
  english: [
    { label: 'Lộ trình CEFR', path: '/lo-trinh-hoc' },
    { label: 'Luyện nói', path: '/luyen-noi' },
    { label: 'Từ điển', path: '/tu-dien' },
  ],
}

const DEFAULT_INITIAL_VISIBLE = 3

/** Dòng trạng thái bằng chữ — KHÔNG thanh %, không số (luật "chọn việc, không chấm điểm"). */
function trangThaiCuaMon(entry: SubjectEntry, plan: TodayPlan | null): string {
  const items = plan ? [plan.primary, ...plan.secondary] : []
  const item = items.find((it) => it && it.subjectId === entry.id)
  return item ? `đang học · ${item.title}` : 'chưa bắt đầu'
}

export default function SubjectSpaceList({
  plan,
  isDesktop,
  initialVisible = DEFAULT_INITIAL_VISIBLE,
}: SubjectSpaceListProps) {
  const nav = useNavigate()
  // Mở/đóng "Xem tất cả" là state cục bộ — không lưu storage (⑥ quy ước riêng P1-8).
  const [expanded, setExpanded] = useState(false)

  const isEmptyState = plan?.primary?.kind === 'pick'
  const ordered = orderSubjects(SUBJECT_ENTRIES, plan?.subjectsSeen ?? [])
  const visibleCount =
    isDesktop || expanded ? ordered.length : Math.min(initialVisible, ordered.length)
  const visible = ordered.slice(0, visibleCount)
  const hiddenCount = ordered.length - visible.length

  return (
    <div>
      <ul
        className={
          isDesktop
            ? 'grid grid-cols-2 gap-3'
            : 'divide-y divide-zinc-800 rounded-3xl border border-zinc-800 bg-zinc-900/90'
        }
      >
        {visible.map((entry) => {
          const Icon = SUBJECT_ICON[entry.id] ?? GraduationCap
          const tone = SUBJECT_TONE[entry.id] ?? 'bg-zinc-500/15 text-zinc-300'
          const shortcuts = SUBJECT_SHORTCUTS[entry.id] ?? []
          const status = trangThaiCuaMon(entry, plan)
          return (
            <li
              key={entry.id}
              className={
                isDesktop ? 'p-4 rounded-3xl border border-zinc-800 bg-zinc-900/90' : 'p-4'
              }
            >
              <button
                onClick={() => nav(entry.ctaPath)}
                className="w-full flex items-start gap-3.5 text-left group"
                aria-label={`Vào không gian ${entry.label}`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-base flex items-center gap-1.5">
                    <span>{entry.label}</span>
                    <ChevronRight
                      className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mt-0.5 read-measure">
                    {SUBJECT_DESC[entry.id] ?? ''}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{status}</p>
                </div>
              </button>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 pl-[3.625rem]">
                {shortcuts.map((sc) => (
                  <button
                    key={sc.label}
                    onClick={() => nav(sc.path)}
                    className="tap-44-y text-sm font-medium text-zinc-400 hover:text-white underline-offset-4 hover:underline transition"
                  >
                    {sc.label}
                  </button>
                ))}
                {isEmptyState && (
                  <button
                    onClick={() => nav(entry.ctaPath)}
                    className="tap-44-y text-sm font-semibold text-accent-400 theme-light:text-accent-800 hover:text-accent-300 theme-light:hover:text-accent-900 underline-offset-4 hover:underline transition"
                  >
                    Thử 5 phút
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {!isDesktop && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="tap-44 w-full mt-2 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition"
        >
          {`Xem tất cả (${ordered.length} môn)`}
        </button>
      )}
    </div>
  )
}
