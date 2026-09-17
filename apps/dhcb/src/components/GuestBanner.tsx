// components/GuestBanner.tsx — Dải nhắc nhẹ cho KHÁCH VÃNG LAI (chưa đăng nhập).
//
// Đặc tả: docs/specs/2026-09-15-mo-xem-web-khong-can-dang-nhap.md
//
// Nói ĐÚNG hai điều khách cần biết, không hơn: (1) tiến độ đang lưu trên máy này thôi,
// (2) đăng ký thì giữ được và có nhiều lượt AI hơn. Cố tình KHÔNG chặn đường, không modal —
// khách đang xem nội dung là chuyện tốt, việc của banner chỉ là cho họ biết đường tiếp theo.
//
// Đóng được, và nhớ đã đóng trong phiên (sessionStorage): nhắc lại mỗi lần chuyển trang thì
// thành phiền. Sang phiên mới lại hiện một lần.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, UserPlus } from 'lucide-react'
import { useLang } from '../context/useLang'
import { hasAnyGuestSession } from '../lib/guestActivity'

// TÊN KHOÁ sessionStorage, không phải bí mật — xem chú thích đầy đủ ở packages/core-ui/guestId.ts.
const DISMISS_KEY = 'dhcb_guest_banner_dismissed_v1' // gitleaks:allow

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false // sessionStorage bị chặn — coi như chưa đóng, banner vẫn dùng được
  }
}

export default function GuestBanner() {
  const { lang } = useLang()
  const isVi = lang === 'vi'
  const [dismissed, setDismissed] = useState(readDismissed)

  // [P0-3] Khách VỪA MỞ trang, CHƯA làm gì thì banner chỉ gây phiền — chỉ hiện SAU KHI đã có ít
  // nhất một dấu vết học thật trên máy này (xem lib/guestActivity.ts).
  if (dismissed || !hasAnyGuestSession()) return null

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* không lưu được thì banner hiện lại lần sau — không phải lỗi nghiêm trọng */
    }
    setDismissed(true)
  }

  return (
    <div role="status" className="bg-accent-500/10 border-b border-accent-500/25 text-sm">
      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <UserPlus
          className="w-4 h-4 text-accent-400 theme-light:text-accent-900 shrink-0"
          aria-hidden="true"
        />
        <p className="flex-1 min-w-0 text-zinc-200 theme-light:text-zinc-800">
          {isVi ? (
            <>
              Bạn đang xem ở chế độ khách — tiến độ chỉ lưu trên máy này.{' '}
              <Link
                to="/login"
                className="font-semibold underline underline-offset-2 hover:text-white theme-light:hover:text-zinc-950 transition"
              >
                Đăng ký miễn phí
              </Link>{' '}
              để giữ tiến độ và có 30 lượt AI mỗi ngày.
            </>
          ) : (
            <>
              You are browsing as a guest — progress is saved on this device only.{' '}
              <Link
                to="/login"
                className="font-semibold underline underline-offset-2 hover:text-white theme-light:hover:text-zinc-950 transition"
              >
                Sign up free
              </Link>{' '}
              to keep it and get 30 AI turns a day.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={isVi ? 'Đóng thông báo' : 'Dismiss'}
          className="tap-44 shrink-0 flex items-center justify-center text-zinc-400 hover:text-white theme-light:text-zinc-500 theme-light:hover:text-zinc-900 transition rounded-lg"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
