import type { Page } from '@playwright/test'
import type { AxeResults } from 'axe-core'

/** Giữ đường dẫn axe nguyên vẹn; target chưa resolve không được biến thành pass. */
export async function collectAaaFindings(
  page: Page,
  results: Pick<AxeResults, 'violations' | 'incomplete'>,
): Promise<string[]> {
  const findings: string[] = []
  for (const [kind, rules] of [
    ['violation', results.violations],
    ['incomplete', results.incomplete],
  ] as const) {
    for (const rule of rules) {
      for (const node of rule.nodes) {
        const target = node.target
        const classification = await page.evaluate((target) => {
          if (target.length !== 1 || typeof target[0] !== 'string') return 'unsupported target'
          let el: Element | null
          try {
            el = document.querySelector(target[0])
          } catch {
            return 'invalid selector'
          }
          if (!el) return 'missing target'
          // Điều khiển vẫn thuộc AA kể cả khi nằm trong article/li.
          if (
            el.closest(
              'button,[role="button"],[role="tab"],label,input,select,textarea,nav,[role="navigation"]',
            )
          ) {
            return 'chrome'
          }
          // Chữ đọc thắng container header/footer và link inline trong văn xuôi.
          if (el.closest('h1,h2,h3,h4,h5,h6,p,dt,dd,blockquote,figcaption,td,th')) {
            return 'content'
          }
          if (el.closest('nav,[role="navigation"],a')) return 'chrome'
          if (el.closest('li,article,main > div')) return 'content'
          return 'unclassified target'
        }, target)
        // Incomplete không phải bằng chứng đạt, kể cả khi axe chỉ thấy chrome.
        if (kind === 'violation' && classification === 'chrome') continue
        findings.push(
          `${kind}: ${rule.id} target=${JSON.stringify(target)} (${classification})` +
            (node.failureSummary ? ` — ${node.failureSummary}` : ''),
        )
      }
      if (rule.nodes.length === 0) {
        findings.push(`${kind}: ${rule.id} (no target evidence)`)
      }
    }
  }
  return findings
}
