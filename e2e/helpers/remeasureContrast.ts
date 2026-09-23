import type { Page, ElementHandle } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { AxeResults } from 'axe-core'
import { measureSvgHalo, type SvgHaloContrast } from './svgHaloContrast'
import { freezeAnimations, waitForStableDom } from './axe'

export interface ContrastGeometry {
  html: string
  text: string
  x: number
  y: number
  width: number
  height: number
  clipped: boolean
}

export interface ContrastRemeasurement {
  target: readonly unknown[]
  stable: boolean
  before?: ContrastGeometry
  after?: ContrastGeometry
  results?: AxeResults
  reason?: string
  classification?: string
  halo?: SvgHaloContrast
  scrollChanged?: boolean
}

/** Đo lại đích bị scrollport che; không cấp pass hoặc bỏ incomplete thay collector. */
export async function remeasureContrast(
  page: Page,
  target: readonly unknown[],
  classify?: () => Promise<string>,
): Promise<ContrastRemeasurement> {
  const report: ContrastRemeasurement = { target, stable: false }
  if (target.length !== 1 || typeof target[0] !== 'string') {
    return { ...report, reason: 'unsupported-target' }
  }
  let identity: ElementHandle<SVGElement | HTMLElement> | null = null
  const selector = target[0]
  const locator = page.locator(selector)
  const geometry = async (): Promise<ContrastGeometry> =>
    locator.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      const clipsX = ['hidden', 'clip'].includes(style.overflowX)
      const clipsY = ['hidden', 'clip'].includes(style.overflowY)
      return {
        html: element.outerHTML,
        text: element.textContent ?? '',
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        clipped:
          (clipsX && element.scrollWidth > element.clientWidth) ||
          (clipsY && element.scrollHeight > element.clientHeight),
      }
    })
  try {
    if ((await locator.count()) !== 1) return { ...report, reason: 'missing-or-nonunique-target' }
    identity = await locator.elementHandle()
    await freezeAnimations(page)
    report.before = await geometry()
    const observer = await page.evaluateHandle(() => {
      const state = { changed: false }
      const mutationObserver = new MutationObserver(() => {
        state.changed = true
      })
      mutationObserver.observe(document.documentElement, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      })
      return { state, mutationObserver }
    })
    try {
      await locator.scrollIntoViewIfNeeded({ timeout: 3000 })
      await waitForStableDom(page)
      if ((await locator.count()) !== 1) return { ...report, reason: 'missing-or-nonunique-target' }
      report.scrollChanged = await observer.evaluate(({ state, mutationObserver }) => {
        if (mutationObserver.takeRecords().length > 0) state.changed = true
        const changed = state.changed
        state.changed = false
        return changed
      })
      // Scroll/lazy loading hoàn tất trước snapshot đo; mọi mutation từ đây vẫn fail closed.
      report.classification = await classify?.()
      report.after = await geometry()
      report.results = await new AxeBuilder({ page })
        .include(selector)
        .withRules(['color-contrast', 'color-contrast-enhanced'])
        .analyze()
      if ((await locator.count()) !== 1) return { ...report, reason: 'missing-or-nonunique-target' }
      report.halo = await measureSvgHalo(page, target)
      const final = await geometry()
      const sameIdentity = await identity?.evaluate(
        (el, selector) => el.isConnected && document.querySelector(selector) === el,
        selector,
      )
      const changed = await observer.evaluate(({ state, mutationObserver }) => {
        if (mutationObserver.takeRecords().length > 0) state.changed = true
        return state.changed
      })
      report.stable =
        !!sameIdentity &&
        !changed &&
        report.before.html === final.html &&
        report.after.html === final.html
      if (!report.stable) report.reason = 'dom-changed'
      else if (final.clipped) report.reason = 'text-clipped'
      else if (final.width <= 0 || final.height <= 0) report.reason = 'empty-geometry'
      return report
    } finally {
      await observer.evaluate(({ mutationObserver }) => mutationObserver.disconnect())
      await observer.dispose()
    }
  } catch (error) {
    return {
      ...report,
      stable: false,
      reason: error instanceof Error ? error.message : 'remeasure-failed',
    }
  } finally {
    await identity?.dispose()
  }
}
