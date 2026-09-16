// apps/dhcb/src/components/Modal.tsx — hộp thoại dùng chung, đạt chuẩn a11y.
//
// Vì sao có file này: 4 trang trụ cột (Career/Work/Startup/Life) từng tự viết 15 hộp
// thoại bằng <div className="fixed inset-0">, không cái nào có role="dialog",
// aria-modal, phím Escape hay bẫy tiêu điểm (focus trap). Cổng a11y của CI không bắt
// được vì nó chỉ quét trang ở trạng thái hộp thoại ĐANG ĐÓNG.
//
// Sáu hành vi bắt buộc theo WAI-ARIA APG nằm ở hook dùng chung `useDialogBehavior`
// (tách ra 2026-08-31 để các hộp thoại có bố cục đặc thù dùng lại được):
//   1. role="dialog" + aria-modal="true" + aria-labelledby trỏ tới tiêu đề
//   2. Escape để đóng
//   3. Bẫy tiêu điểm: Tab/Shift+Tab chạy vòng trong hộp thoại, không lọt ra nền
//   4. Tự đưa tiêu điểm vào hộp thoại khi mở, và TRẢ tiêu điểm về nút đã mở nó khi đóng
//   5. Bấm ra nền (backdrop) để đóng
//   6. Khoá cuộn trang nền khi hộp thoại đang mở
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDialogBehavior } from './useDialogBehavior'

/**
 * Hai dáng hộp thoại:
 * · `center` — khung giữa màn hình (mặc định, y hệt mọi hộp thoại đang có, KHÔNG đổi CSS).
 * · `sheet`  — tấm trượt từ ĐÁY, dành cho panel chọn trên mobile (mục lục môn/khoá): ngón
 *   cái với tới mép dưới dễ hơn giữa màn hình, và tấm cao 85dvh chứa được danh sách dài.
 */
export type ModalVariant = 'center' | 'sheet'

export type ModalProps = {
  /** Tiêu đề hộp thoại — cũng là tên có thể truy cập (accessible name). */
  title: string
  /** Gọi khi người dùng muốn đóng: nút X, phím Escape, hoặc bấm ra nền. */
  onClose: () => void
  children: ReactNode
  /** Chiều rộng tối đa (lớp Tailwind). Mặc định `max-w-lg` như các hộp thoại cũ. */
  maxWidth?: string
  /** Nhãn cho nút đóng — đổi khi cần bản tiếng Anh (chiều B). */
  closeLabel?: string
  /** Dáng hộp thoại. Mặc định `center` — giữ nguyên mọi nơi đang dùng. */
  variant?: ModalVariant
}

export default function Modal({
  title,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  closeLabel = 'Đóng',
  variant = 'center',
}: ModalProps) {
  const { dialogProps, titleId, backdropProps } = useDialogBehavior(onClose)
  const laSheet = variant === 'sheet'

  const noiDung = (
    // Lớp nền: bấm vào ĐÚNG lớp này (không phải phần tử con) thì đóng.
    <div
      className={`fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm ${
        laSheet ? 'items-end justify-center p-0' : 'items-center justify-center p-4'
      }`}
      {...backdropProps}
    >
      <div
        {...dialogProps}
        className={
          laSheet
            ? // Tấm đáy: bo góc trên, cao tối đa 85dvh, chừa lề an toàn của máy có thanh gạt.
              'bg-zinc-900 border-t border-zinc-800 rounded-t-2xl w-full px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl max-h-[85dvh] overflow-y-auto focus:outline-none'
            : `bg-zinc-900 border border-zinc-800 rounded-2xl w-full ${maxWidth} px-6 pb-6 shadow-2xl max-h-[90dvh] overflow-y-auto focus:outline-none`
        }
      >
        {/*
          Header dính (sticky) ở mép trên vùng cuộn: nội dung dài cuộn xuống thì tiêu đề
          và nút đóng vẫn còn trên màn hình. `-mx-6 px-6` kéo dải NỀN ra sát hai mép khung
          để chữ cuộn qua không lộ ra sau lưng header.

          KHÔNG dùng `-mt-6` để kéo nền lên mép trên (cách cũ, đã gỡ 2026-09-16): margin âm
          làm header chiếm trong LUỒNG ít hơn chiều cao thật đúng 24px, nên phần tử ngay sau
          nó bị header che mất 24px — dòng đầu của nội dung biến mất. Không cổng nào bắt được
          (DOM đủ chữ, `getBoundingClientRect` trả chiều cao đúng, không cuộn), và đã phải vá
          cục bộ bằng `pt-6` hai lần (S07-2 #944, S08-2 #961) trước khi sửa tận gốc.

          Cách làm đúng: khung BỎ padding trên (`px-6 pb-6` thay cho `p-6`), header tự mang
          khoảng trên của mình bằng `pt-6`. Nhìn y hệt cũ, mà không có margin âm nào.
          Test canh: `e2e/modal-sticky-header.spec.ts`.
        */}
        <div className="sticky top-0 z-10 -mx-6 px-6 pt-6 pb-4 bg-zinc-900 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-bold text-zinc-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="tap-44 shrink-0 -mr-2 w-11 h-11 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )

  // PORTAL ra thẳng <body> cho CẢ HAI dáng: hộp thoại mở từ bên trong một vùng có `overflow`
  // (cột phụ của `TwoPane` cuộn riêng, thẻ `rounded-2xl overflow-hidden`…) sẽ bị CẮT nếu render
  // tại chỗ — `position: fixed` không cứu được khi tổ tiên tạo containing block mới
  // (`transform`, `filter`, `contain`). Đổi vị trí DOM không đổi hành vi a11y: `role="dialog"`
  // + `aria-modal` vẫn thế, và test nên tìm bằng vai trò (`getByRole`) chứ không bằng
  // `container.querySelector` — xem `Modal.test.tsx`.
  // `document.body` chắc chắn có ở mọi nơi component này chạy (trình duyệt + jsdom).
  return createPortal(noiDung, document.body)
}
