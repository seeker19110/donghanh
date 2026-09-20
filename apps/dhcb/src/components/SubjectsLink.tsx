// SubjectsLink.tsx — Liên kết tới Góc học tập (danh mục hoặc một môn).
//
// Trước 2026-09-20 component này phải tự chọn `<Link>` hay `<a>` vì Góc học tập từng nằm ở
// ORIGIN KHÁC (`hoc-tap.donghanhcungban.org`). Cơ chế đa host đã bị gỡ (xem lib/subjectsHost.ts):
// mọi môn ở cùng một host, nên đây luôn là điều hướng trong app. Giữ component để mọi nơi dựng
// link môn học đi qua ĐÚNG MỘT chỗ tính đường dẫn (CLAUDE.md §7).

import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { subjectsPath } from '../lib/subjectsHost'

export default function SubjectsLink({
  subjectId,
  children,
  className,
  ariaCurrent,
}: {
  subjectId?: string
  children: ReactNode
  className?: string
  ariaCurrent?: 'page' | undefined
}) {
  return (
    <Link to={subjectsPath(subjectId)} aria-current={ariaCurrent} className={className}>
      {children}
    </Link>
  )
}
