// packages/core-ui/CompanionAvatar.tsx — Mặt Companion "Bạn Đồng Hành" (P0-2, 2026-09-17).
//
// SVG inline viết tay (không import file .svg — tránh thêm chunk, xem quy ước ⑥ của lát).
// KHÁC `AvatarSpeaking.tsx` (viseme LED của trang Bạn Đồng Hành, dùng khi nói chuyện thời gian
// thực) — hai avatar phục vụ hai mục đích khác nhau, hợp nhất là nợ ghi ở P2-11.
//
// Animation qua class Tailwind (`companion-blink`/`companion-dot`/`companion-cheer`, khai ở
// `apps/dhcb/tailwind.config.js`) — reduced-motion đã có luật CHẶN TOÀN CỤC ở
// `apps/dhcb/src/index.css` (`@media (prefers-reduced-motion: reduce)` khoá animation-duration
// về 0s cho MỌI phần tử), nên không cần bọc riêng ở đây.
import { useEffect, useState } from 'react'

export type CompanionMood = 'idle' | 'thinking' | 'cheer' | 'hasNote'

export interface CompanionAvatarProps {
  /** Trạng thái biểu cảm hiện tại. Mặc định 'idle'. */
  mood?: CompanionMood
  /** Cỡ khung avatar tính bằng px. Mặc định 48. */
  size?: 32 | 48 | 64
  /** Có nhãn cho trình đọc màn hình không; mặc định true = aria-hidden (trang trí). */
  decorative?: boolean
  className?: string
}

const SIZE_PX: Record<32 | 48 | 64, number> = { 32: 32, 48: 48, 64: 64 }

export function CompanionAvatar({
  mood = 'idle',
  size = 48,
  decorative = true,
  className = '',
}: CompanionAvatarProps) {
  // `cheer` tự về `idle` sau 600ms — component tự quản, dọn khi unmount.
  //
  // Đồng bộ `displayMood` theo prop `mood` NGAY TRONG LÚC RENDER (mẫu React chính thức "Điều
  // chỉnh state khi prop đổi": https://react.dev/learn/you-might-not-need-an-effect), không
  // gọi setState trong thân effect — `react-hooks/set-state-in-effect` cấm việc đó vì gây
  // render lồng nhau. Effect bên dưới CHỈ hẹn giờ trả về `idle`, gọi setState trong CALLBACK
  // của setTimeout (một hệ thống ngoài React) nên không bị cấm.
  const [prevMood, setPrevMood] = useState(mood)
  const [displayMood, setDisplayMood] = useState<CompanionMood>(mood)
  if (mood !== prevMood) {
    setPrevMood(mood)
    setDisplayMood(mood)
  }

  useEffect(() => {
    if (displayMood !== 'cheer') return
    const timer = setTimeout(() => setDisplayMood('idle'), 600)
    return () => clearTimeout(timer)
  }, [displayMood])

  const px = SIZE_PX[size]
  const a11yProps = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img' as const, 'aria-label': 'Bạn Đồng Hành' }

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      className={`shrink-0 ${displayMood === 'cheer' ? 'animate-companion-cheer' : ''} ${className}`}
      {...a11yProps}
    >
      {/* Nền tròn ấm — bg-warm-100, viền warm-500 */}
      <circle cx="32" cy="32" r="30" className="fill-warm-100 stroke-warm-500" strokeWidth="2" />
      {/* Mắt: chớp khi idle, ba chấm khi thinking, hai vòng cung vui khi cheer */}
      {displayMood === 'thinking' ? (
        <g className="fill-warm-700">
          <circle cx="22" cy="30" r="3" className="animate-companion-dot" />
          <circle
            cx="32"
            cy="30"
            r="3"
            className="animate-companion-dot"
            style={{ animationDelay: '0.15s' }}
          />
          <circle
            cx="42"
            cy="30"
            r="3"
            className="animate-companion-dot"
            style={{ animationDelay: '0.3s' }}
          />
        </g>
      ) : (
        <g className="fill-warm-700 origin-center animate-companion-blink">
          <circle cx="23" cy="28" r="3.5" />
          <circle cx="41" cy="28" r="3.5" />
        </g>
      )}
      {/* Miệng: cười hơn khi cheer, mỉm nhẹ khi idle/hasNote */}
      <path
        d={displayMood === 'cheer' ? 'M20 38 Q32 50 44 38' : 'M22 38 Q32 44 42 38'}
        className="stroke-warm-700"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Chấm thông báo góc phải trên khi có ghi chú mới */}
      {displayMood === 'hasNote' && <circle cx="50" cy="16" r="6" className="fill-warm-500" />}
    </svg>
  )
}

export default CompanionAvatar
