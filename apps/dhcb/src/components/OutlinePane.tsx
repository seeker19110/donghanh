// OutlinePane — hai mảnh GIAO DIỆN nối mục lục cây (`@core/OutlineTree`) với app.
//
// Đặc tả: docs/specs/2026-09-15-goc-hoc-tap-07-muc-luc-mon-khoa.md, slice S07-2.
//
// `OutlineTree` sống ở `packages/core-ui` và cố tình thuần trình bày (không router, không
// storage) để test được bằng dữ liệu giả. File này chỉ giữ phần "dính vào app" mang hình hài
// component; phần trạng thái (panel mobile, sessionStorage) ở `useOutlinePane.tsx`.
import { Link } from 'react-router-dom'
import { OutlineTree, type OutlineTreeProps } from '@core/OutlineTree'

/**
 * `OutlineTree` với liên kết THẬT của react-router.
 *
 * `OutlineTree` không được phụ thuộc react-router (luật của `packages/core-ui`) nên nó nhận
 * `renderLink` từ ngoài. Bọc một lần ở đây để mọi trang dùng cùng một cách dựng liên kết (kể
 * cả `aria-current="page"`), thay vì mỗi trang tự viết lại prop đó.
 */
export function OutlineTreeLinked(props: Omit<OutlineTreeProps, 'renderLink'>) {
  return (
    <OutlineTree
      {...props}
      renderLink={({ href, className, current, children, onSelect }) => (
        <Link
          to={href}
          className={className}
          aria-current={current ? 'page' : undefined}
          onClick={onSelect}
        >
          {children}
        </Link>
      )}
    />
  )
}

/**
 * Dòng phụ dưới cây khi lớp TIẾN ĐỘ (không phải cấu trúc cây) tải hỏng.
 *
 * Cấu trúc cây dựng đồng bộ từ chỉ mục nên không bao giờ "đang tải"; chỉ tiến độ mới đến từ
 * mạng. Tách bạch hai thứ đó là lý do cây vẫn bấm được khi mạng chập chờn (AC-16).
 */
export function LoiTienDo({ onRetry }: { onRetry: () => void }) {
  return (
    <p className="t-caption text-content-secondary" role="status">
      Chưa tải được tiến độ ·{' '}
      <button
        type="button"
        onClick={onRetry}
        className="tap-44 min-h-[44px] underline underline-offset-2"
      >
        Thử lại
      </button>
    </p>
  )
}
