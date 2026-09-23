import type { Page } from '@playwright/test'
import axe, { type AxeResults, type NodeResult } from 'axe-core'
import { measureSvgHalo, type SvgHaloContrast } from './svgHaloContrast'

export const AAA_TAGS = ['wcag2aaa', 'wcag21aaa', 'wcag22aaa']
export const AAA_RULE_IDS = [
  ...new Set([...axe.getRules(AAA_TAGS).map((rule) => rule.ruleId), 'color-contrast']),
]

export interface AaaResolution {
  target: NodeResult['target']
  incompleteRule: string
  resolvedBy: 'color-contrast' | 'svg-opaque-halo' | 'scroll-exact-contrast'
  strokeWidth?: number
  foreground: string
  background: string
  ratio: number
}

export function measuredAa(node: NodeResult) {
  for (const check of node.any) {
    const data: unknown = check.data
    if (check.id !== 'color-contrast' || !data || typeof data !== 'object') continue
    if (!('fgColor' in data) || !('bgColor' in data) || !('contrastRatio' in data)) continue
    if (
      typeof data.fgColor !== 'string' ||
      typeof data.bgColor !== 'string' ||
      typeof data.contrastRatio !== 'number' ||
      !Number.isFinite(data.contrastRatio) ||
      data.contrastRatio < 4.5
    )
      continue
    return { foreground: data.fgColor, background: data.bgColor, ratio: data.contrastRatio }
  }
  return null
}

function isShortText(node: NodeResult) {
  return node.any.some((check) => {
    const data: unknown = check.data
    return (
      check.id === 'color-contrast-enhanced' &&
      !!data &&
      typeof data === 'object' &&
      'messageKey' in data &&
      data.messageKey === 'shortTextContent'
    )
  })
}

export async function classifyAaaTarget(page: Page, target: NodeResult['target']) {
  return page.evaluate((target) => {
    if (target.length !== 1 || typeof target[0] !== 'string') return 'unsupported target'
    let el: Element | null
    try {
      const matches = document.querySelectorAll(target[0])
      if (matches.length > 1) return 'nonunique target'
      el = matches[0] ?? null
    } catch {
      return 'invalid selector'
    }
    if (!el) return 'missing target'
    if (el.closest('[data-reading-content]')) return 'content'
    // Điều khiển vẫn thuộc AA kể cả khi nằm trong article/li.
    if (
      el.closest(
        'button,[role="button"],[role="tab"],summary,label,input,select,textarea,nav,[role="navigation"]',
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
}

/** Giữ đường dẫn axe nguyên vẹn; target chưa resolve không được biến thành pass. */
export async function collectAaaFindings(
  page: Page,
  results: Pick<AxeResults, 'violations' | 'incomplete'> & Partial<Pick<AxeResults, 'passes'>>,
  evidence?: {
    passes: AxeResults['passes']
    snapshotStable: boolean
    resolutions: AaaResolution[]
    unresolvedMeasurements?: { target: NodeResult['target']; reason: string }[]
  },
): Promise<string[]> {
  const findings: string[] = []
  const halos = new Map<string, SvgHaloContrast>()
  for (const [kind, rules] of [
    ['violation', results.violations],
    ['incomplete', results.incomplete],
  ] as const) {
    for (const rule of rules) {
      for (const node of rule.nodes) {
        const target = node.target
        const classification = await classifyAaaTarget(page, target)
        if (
          kind === 'incomplete' &&
          ['color-contrast', 'color-contrast-enhanced'].includes(rule.id) &&
          evidence?.snapshotStable &&
          (classification === 'content' || classification === 'chrome')
        ) {
          const key = JSON.stringify(target)
          let halo = halos.get(key)
          if (!halo) {
            halo = await measureSvgHalo(page, target)
            halos.set(key, halo)
          }
          if (halo.status === 'unresolved' && halo.reason !== 'not SVG text') {
            evidence.unresolvedMeasurements?.push({ target, reason: halo.reason })
          }
          if (halo.status === 'measured') {
            if (halo.ratio >= 7) {
              evidence.resolutions.push({
                target,
                incompleteRule: rule.id,
                resolvedBy: halo.method,
                foreground: halo.foreground,
                background: halo.background,
                ratio: halo.ratio,
                strokeWidth: halo.strokeWidth,
              })
              continue
            }
            findings.push(
              `violation: svg-halo-7 target=${key} ratio=${halo.ratio} foreground=${halo.foreground} halo=${halo.background}`,
            )
          }
        }
        // Chỉ kết luận chrome short-text khi rule AA đo được cùng target trong snapshot ổn định.
        if (
          kind === 'incomplete' &&
          rule.id === 'color-contrast-enhanced' &&
          classification === 'chrome' &&
          evidence?.snapshotStable &&
          isShortText(node)
        ) {
          const passed = evidence.passes
            .find((pass) => pass.id === 'color-contrast')
            ?.nodes.find((pass) => JSON.stringify(pass.target) === JSON.stringify(target))
          const measurement = passed ? measuredAa(passed) : null
          if (measurement) {
            evidence.resolutions.push({
              target,
              incompleteRule: rule.id,
              resolvedBy: 'color-contrast',
              ...measurement,
            })
            continue
          }
        }
        // Vi phạm AA vẫn chặn chrome; AAA áp dụng cho chữ đọc.
        if (kind === 'violation' && classification === 'chrome' && rule.id !== 'color-contrast')
          continue
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
  // Axe cho chữ lớn 4.5:1 ở AAA; dự án yêu cầu mọi chữ đọc ≥7:1.
  const checked = new Set<string>()
  for (const rule of results.passes ?? []) {
    if (!['color-contrast', 'color-contrast-enhanced'].includes(rule.id)) continue
    for (const node of rule.nodes) {
      const key = JSON.stringify(node.target)
      if (checked.has(key) || (await classifyAaaTarget(page, node.target)) !== 'content') continue
      for (const check of node.any) {
        const data: unknown = check.data
        if (!data || typeof data !== 'object' || !('contrastRatio' in data)) continue
        const ratio = data.contrastRatio
        if (typeof ratio !== 'number' || !Number.isFinite(ratio)) continue
        checked.add(key)
        if (ratio < 7) findings.push(`violation: project-reading-7 target=${key} ratio=${ratio}`)
      }
    }
  }
  return findings
}
