import { Component, Suspense, lazy } from 'react'
import { showSalesHunterEntry } from '../lib/salesHunter'

const SalesHunterEntry = lazy(() => import('./SalesHunterEntry'))

/** A failed optional Sales chunk must never unmount the Learning/Companion application. */
export default class SalesHunterSlot extends Component<Record<string, never>, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed || !showSalesHunterEntry(window.location.hostname)) return null
    return (
      <Suspense fallback={null}>
        <SalesHunterEntry />
      </Suspense>
    )
  }
}
