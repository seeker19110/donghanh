import { Navigate, useLocation } from 'react-router-dom'
import { legacyProgrammingPath } from '../lib/legacyProgrammingPath'

/** Redirect duy nhất cho toàn bộ URL `/lap-trinh/*` đã phát hành. */
export default function LegacyProgrammingRedirect() {
  const location = useLocation()
  const destination = legacyProgrammingPath(location.pathname, location.search)
  if (!destination) return null
  // Giữ cả hash (S09d, đặc tả S09 §2.8): link cũ `/lap-trinh/bai-hoc/p1-u1-l1#make` phải mở
  // đúng bước Tự viết sau khi chuyển sang URL mới. `replace` nên không để lại entry thừa.
  return <Navigate to={`${destination}${location.hash}`} replace />
}
