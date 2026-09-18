import { Navigate, useLocation } from 'react-router-dom'
import { legacyProgrammingPath } from '../lib/legacyProgrammingPath'

/** Redirect duy nhất cho toàn bộ URL `/lap-trinh/*` đã phát hành. */
export default function LegacyProgrammingRedirect() {
  const location = useLocation()
  const destination = legacyProgrammingPath(location.pathname, location.search)
  if (!destination) return null
  return <Navigate to={destination} replace />
}
