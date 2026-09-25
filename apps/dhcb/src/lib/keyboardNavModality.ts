// [S07d, 2026-09-25] Đánh dấu "người dùng đang điều hướng bằng bàn phím" lên <html>.
//
// Vì sao cần: Chromium chỉ tôn trọng `scroll-padding` của <html> (KHÔNG tôn trọng
// `scroll-margin` của phần tử) khi cuộn phần tử vừa nhận focus bằng Tab vào tầm nhìn — đo
// thật 25/09, xem docs/research/2026-09-25-s07d-ma-tran-tu-dong.md. Nhưng bật `scroll-padding`
// thường trực sẽ cộng dồn với `scroll-mt-*` đang có của các điểm neo (#cau-N, #luot-M…) và
// làm lệch mọi cú nhảy neo bằng chuột. Nên chỉ bật khi đang dùng bàn phím (index.css,
// `html[data-kbd-nav]`), tắt ngay khi người dùng chạm/bấm chuột trở lại.

export const KBD_NAV_ATTR = 'kbdNav'

/** Phím điều hướng focus — chỉ phím này mới coi là "đang dùng bàn phím". */
function isFocusNavigationKey(event: Event): boolean {
  return (event as KeyboardEvent).key === 'Tab'
}

/**
 * Gắn listener; trả hàm dọn dẹp. `root`/`target` nhận tham số để test chạy được trong môi
 * trường node của Vitest (không có DOM) — app gọi không tham số.
 */
export function initKeyboardNavModality(
  root: Pick<HTMLElement, 'dataset'> = document.documentElement,
  target: EventTarget = window,
): () => void {
  const onKeyDown = (event: Event) => {
    if (isFocusNavigationKey(event)) root.dataset[KBD_NAV_ATTR] = '1'
  }
  const onPointerDown = () => {
    delete root.dataset[KBD_NAV_ATTR]
  }
  // `capture: true`: đánh dấu TRƯỚC khi trình duyệt chuyển focus và cuộn theo phím Tab.
  target.addEventListener('keydown', onKeyDown, true)
  target.addEventListener('pointerdown', onPointerDown, true)
  return () => {
    target.removeEventListener('keydown', onKeyDown, true)
    target.removeEventListener('pointerdown', onPointerDown, true)
    delete root.dataset[KBD_NAV_ATTR]
  }
}
