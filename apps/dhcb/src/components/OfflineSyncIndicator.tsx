// apps/dhcb/src/components/OfflineSyncIndicator.tsx — Dải báo trạng thái ngoại tuyến & đồng bộ.
//
// S09-2: dải này TỪNG nói dối. Nó đọc `offlineStore.ts` — một hàng đợi "giả" không có ai xếp
// hàng vào (0 caller), và "đồng bộ" bằng `flushOfflineQueue(async () => true)`, tức là XOÁ mục
// mà không gửi gì lên server. Giờ nó đọc hàng đợi THẬT (`syncOutbox`, theo chủ sở hữu) nên số
// "N mục chờ đồng bộ" là số thật, và có thêm trạng thái "hết phiên đăng nhập" — trước đây người
// dùng không bao giờ biết vì sao dữ liệu không lên được server.
import { useState, useEffect } from 'react'
import { WifiOff, RefreshCw, CheckCircle2, LogIn } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { isBlockedByAuth, pending, subscribe } from '../lib/syncOutbox'

export default function OfflineSyncIndicator() {
  const { user } = useAuth()
  const uid = user?.id ?? ''
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [pendingCount, setPendingCount] = useState(0)
  const [needsLogin, setNeedsLogin] = useState(false)
  const [justSynced, setJustSynced] = useState(false)

  useEffect(() => {
    let alive = true
    // Số mục chờ trước đó — chỉ khi nó TỪ > 0 về 0 mới được khoe "đã đồng bộ xong".
    let previous = uid ? pending(uid) : 0

    const refresh = (changedUid?: string) => {
      if (!alive || !uid) return
      if (changedUid !== undefined && changedUid !== uid) return // hàng đợi của chủ khác
      const count = pending(uid)
      setPendingCount(count)
      setNeedsLogin(isBlockedByAuth(uid))
      if (previous > 0 && count === 0) {
        setJustSynced(true)
        window.setTimeout(() => {
          if (alive) setJustSynced(false)
        }, 4000)
      }
      previous = count
    }

    const onNetwork = () => {
      if (!alive) return
      setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)
      refresh()
    }

    const unsubscribe = subscribe(refresh)
    window.addEventListener('online', onNetwork)
    window.addEventListener('offline', onNetwork)
    onNetwork()

    return () => {
      alive = false
      unsubscribe()
      window.removeEventListener('online', onNetwork)
      window.removeEventListener('offline', onNetwork)
    }
  }, [uid])

  if (isOnline && pendingCount === 0 && !justSynced) return null

  const tone = !isOnline
    ? 'bg-amber-950/90 border-amber-600/50 text-amber-200 theme-light:text-amber-900'
    : needsLogin
      ? 'bg-amber-950/90 border-amber-600/50 text-amber-200 theme-light:text-amber-900'
      : justSynced
        ? 'bg-emerald-950/90 border-emerald-600/50 text-emerald-200 theme-light:text-emerald-900'
        : 'bg-[var(--a-surface)] border-[var(--a-border)] text-[var(--a-text)]'

  return (
    // `bottom-20` (80px) THẤP HƠN BottomNav thật (5.25rem + safe-area ≈ 84px trở lên) nên
    // dải thông báo đè lên thanh điều hướng. Dùng biến `--bnav-h` (index.css) — biến này
    // tự về 0px từ 1024px trở lên, nên desktop chỉ còn 1rem cách mép dưới.
    <div
      // KHÔNG dùng `left-1/2 -translate-x-1/2`: `animate-fade-in` cũng đặt `transform`, và khai
      // báo trong @keyframes THẮNG utility class → dải bị đẩy lệch hẳn sang phải (đo 2026-09-16 ở
      // 390px: x = 195px trong khi đúng phải là 16px, tràn khỏi mép phải màn hình). Canh giữa
      // bằng `inset-x-0 mx-auto` thì không cần `transform` nên animation không phá được.
      className="fixed bottom-[calc(1rem+var(--bnav-h))] inset-x-0 mx-auto z-50 w-11/12 max-w-md animate-fade-in pointer-events-auto"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl shadow-lg border text-sm font-medium transition-all ${tone}`}
      >
        <div className="flex items-center gap-2.5">
          {!isOnline ? (
            <WifiOff className="w-4 h-4 text-amber-400 theme-light:text-amber-900 shrink-0" />
          ) : needsLogin ? (
            <LogIn className="w-4 h-4 text-amber-400 theme-light:text-amber-900 shrink-0" />
          ) : justSynced ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 theme-light:text-emerald-900 shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 text-[var(--a-accent)] shrink-0 animate-spin" />
          )}

          <div>
            {!isOnline ? (
              <span>
                Đang học offline
                {pendingCount > 0 && ` (${pendingCount} mục chờ đồng bộ)`}
              </span>
            ) : needsLogin ? (
              <span>{pendingCount} mục chờ đồng bộ — đăng nhập lại để gửi lên</span>
            ) : justSynced ? (
              <span>Đã đồng bộ dữ liệu học tập thành công!</span>
            ) : (
              <span>Đang đồng bộ dữ liệu ({pendingCount} mục)...</span>
            )}
          </div>
        </div>

        {!isOnline && (
          <span className="text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 theme-light:text-amber-900 border border-amber-700/50 shrink-0">
            Tự lưu cục bộ
          </span>
        )}
      </div>
    </div>
  )
}
