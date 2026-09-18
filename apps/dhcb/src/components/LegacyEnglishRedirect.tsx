import { Navigate, useLocation } from 'react-router-dom'
import { legacyEnglishPath } from '../lib/legacyEnglishPath'

/** Redirect duy nhất cho các URL công cụ Tiếng Anh cũ. */
export default function LegacyEnglishRedirect() {
  const location = useLocation()
  const destination = legacyEnglishPath(location.pathname, location.search)
  return destination ? <Navigate to={`${destination}${location.hash}`} replace /> : null
}
