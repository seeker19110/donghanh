// apps/dhcb/src/lib/session/sessionDoneUrl.ts — Đồng bộ query `?xong=1` với overlay
// `SessionDone` (P1-6, lệnh 8) qua `history.replaceState` (KHÔNG điều hướng, không thêm entry
// lịch sử) để F5/Back giữ overlay đang mở, đóng thì mất query.
const PARAM = 'xong'

function withParam(add: boolean): string {
  const url = new URL(window.location.href)
  if (add) url.searchParams.set(PARAM, '1')
  else url.searchParams.delete(PARAM)
  return `${url.pathname}${url.search}${url.hash}`
}

/** Gọi khi overlay MỞ — gắn `?xong=1` vào URL hiện tại mà không điều hướng. */
export function markSessionDoneOpenInUrl(): void {
  if (typeof window === 'undefined') return
  window.history.replaceState(window.history.state, '', withParam(true))
}

/** Gọi khi overlay ĐÓNG — xoá `?xong=1` khỏi URL hiện tại. */
export function clearSessionDoneOpenInUrl(): void {
  if (typeof window === 'undefined') return
  window.history.replaceState(window.history.state, '', withParam(false))
}

/** Đọc lúc mount — reload/back với `?xong=1` trong URL thì mở lại overlay. */
export function isSessionDoneOpenInUrl(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get(PARAM) === '1'
}
