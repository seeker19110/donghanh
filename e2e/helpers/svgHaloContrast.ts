import type { Page } from '@playwright/test'

export type SvgHaloContrast =
  | { status: 'unresolved'; reason: string }
  | {
      status: 'measured'
      method: 'svg-opaque-halo'
      foreground: string
      background: string
      ratio: number
      strokeWidth: number
    }

/** Đo chữ SVG có halo đục thực sự; không suy nền từ ảnh/gradient bên dưới. */
export async function measureSvgHalo(
  page: Page,
  target: readonly unknown[],
): Promise<SvgHaloContrast> {
  return page.evaluate(
    (target): SvgHaloContrast => {
      const unresolved = (reason: string): SvgHaloContrast => ({ status: 'unresolved', reason })
      if (target.length !== 1 || typeof target[0] !== 'string')
        return unresolved('unsupported target')
      let nodes: NodeListOf<Element>
      try {
        nodes = document.querySelectorAll(target[0])
      } catch {
        return unresolved('invalid selector')
      }
      if (nodes.length !== 1) return unresolved('missing or nonunique target')
      const el = nodes[0]
      if (!(el instanceof SVGTextElement)) return unresolved('not SVG text')
      if (el.children.length) return unresolved('SVG text has unmeasured child paint')
      const svg = el.ownerSVGElement
      if (!svg) return unresolved('missing SVG root')
      const style = getComputedStyle(el)
      const strokeWidth = Number.parseFloat(style.strokeWidth)
      if (style.paintOrder !== 'stroke fill' && style.paintOrder !== 'stroke')
        return unresolved('paint order does not put halo behind fill')
      if (
        style.vectorEffect !== 'non-scaling-stroke' ||
        !Number.isFinite(strokeWidth) ||
        strokeWidth < 3
      )
        return unresolved('halo thinner than 1.5 CSS px')
      if (
        style.strokeDasharray !== 'none' ||
        style.fillOpacity !== '1' ||
        style.strokeOpacity !== '1'
      )
        return unresolved('non-solid halo or fill')
      for (let ancestor: Element | null = el; ancestor; ancestor = ancestor.parentElement) {
        const css = getComputedStyle(ancestor)
        if (Number.parseFloat(css.zIndex) < 0)
          return unresolved('negative descendant stacking order')
        if (
          ['::before', '::after'].some((pseudo) => {
            const paint = getComputedStyle(ancestor, pseudo)
            if (paint.content === 'none' || paint.content === 'normal' || paint.display === 'none')
              return false
            // Lớp định vị có z-index âm nằm sau chuỗi phần tử con không có z-index âm.
            return paint.position === 'static' || !(Number.parseFloat(paint.zIndex) < 0)
          })
        )
          return unresolved('ancestor pseudo paint may obscure halo')
        if (
          css.opacity !== '1' ||
          css.filter !== 'none' ||
          css.backdropFilter !== 'none' ||
          css.mixBlendMode !== 'normal' ||
          (css.transform !== 'none' && !new DOMMatrixReadOnly(css.transform).isIdentity) ||
          css.clipPath !== 'none' ||
          css.clip !== 'auto' ||
          css.maskImage !== 'none' ||
          css.visibility !== 'visible' ||
          css.display === 'none'
        ) {
          return unresolved('unsupported opacity, transform, filter, clip, mask or visibility')
        }
      }
      const parse = (value: string): [number, number, number] | null => {
        const match = /^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/.exec(value)
        if (!match) return null
        const values = [Number(match[1]), Number(match[2]), Number(match[3])] as const
        return values.every((v) => Number.isFinite(v) && v >= 0 && v <= 255) ? [...values] : null
      }
      const foreground = parse(style.fill)
      const background = parse(style.stroke)
      if (!foreground || !background) return unresolved('fill or halo is not opaque sRGB')
      const glyphRect = el.getBoundingClientRect()
      const halo = strokeWidth / 2
      const rect = new DOMRect(
        glyphRect.x - halo,
        glyphRect.y - halo,
        glyphRect.width + 2 * halo,
        glyphRect.height + 2 * halo,
      )
      const svgRect = svg.getBoundingClientRect()
      if (
        rect.width <= 0 ||
        rect.height <= 0 ||
        rect.left < svgRect.left ||
        rect.right > svgRect.right ||
        rect.top < svgRect.top ||
        rect.bottom > svgRect.bottom
      )
        return unresolved('text clipped by SVG viewport')
      for (let ancestor = svg.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const css = getComputedStyle(ancestor)
        const box = ancestor.getBoundingClientRect()
        if (
          (['hidden', 'clip', 'auto', 'scroll'].includes(css.overflowX) &&
            (rect.left < box.left || rect.right > box.right)) ||
          (['hidden', 'clip', 'auto', 'scroll'].includes(css.overflowY) &&
            (rect.top < box.top || rect.bottom > box.bottom))
        )
          return unresolved('halo clipped by ancestor scrollport')
      }
      const intersects = (other: DOMRect) =>
        other.width > 0 &&
        other.height > 0 &&
        Math.min(rect.right, other.right) > Math.max(rect.left, other.left) &&
        Math.min(rect.bottom, other.bottom) > Math.max(rect.top, other.top)
      // Một nhãn/shape vẽ sau có thể che halo; không suy đạt chỉ từ hai màu.
      for (const other of svg.querySelectorAll(
        'text,path,rect,circle,ellipse,line,polyline,polygon,image,foreignObject,use',
      )) {
        if (
          other === el ||
          other.closest('defs') ||
          !(el.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING)
        )
          continue
        const css = getComputedStyle(other)
        if (css.display === 'none' || css.visibility === 'hidden') continue
        if (intersects(other.getBoundingClientRect()))
          return unresolved('later SVG paint overlaps text')
      }
      for (const other of document.querySelectorAll('svg')) {
        if (other === svg || other.contains(svg) || svg.contains(other)) continue
        if (intersects(other.getBoundingClientRect()))
          return unresolved('another SVG may obscure halo')
      }
      // Không kết luận khi lớp HTML giao vùng nhãn, kể cả lớp nhỏ hoặc pointer-events:none
      // mà lấy mẫu hit-test có thể bỏ sót. Nền của phần tử tổ tiên nằm phía sau SVG.
      for (const other of document.querySelectorAll('*')) {
        if (!(other instanceof HTMLElement) || other.contains(svg) || svg.contains(other)) continue
        if (!intersects(other.getBoundingClientRect())) continue
        const css = getComputedStyle(other)
        if (css.display === 'none' || css.visibility !== 'visible' || css.opacity === '0') continue
        const transparent = (color: string) =>
          color === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(color)
        const paints =
          !transparent(css.backgroundColor) ||
          css.backgroundImage !== 'none' ||
          css.boxShadow !== 'none' ||
          css.borderImageSource !== 'none' ||
          ['Top', 'Right', 'Bottom', 'Left'].some(
            (side) =>
              Number.parseFloat(css.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0 &&
              !transparent(css.getPropertyValue(`border-${side.toLowerCase()}-color`)),
          ) ||
          [...other.childNodes].some(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
          ) ||
          ['IMG', 'CANVAS', 'VIDEO', 'IFRAME'].includes(other.tagName) ||
          ['::before', '::after'].some((pseudo) => {
            const content = getComputedStyle(other, pseudo).content
            return content !== 'none' && content !== 'normal'
          })
        if (paints) return unresolved('intersecting HTML paint may obscure halo')
      }
      const points = [
        [rect.left + 1, rect.top + 1],
        [rect.right - 1, rect.top + 1],
        [rect.left + 1, rect.bottom - 1],
        [rect.right - 1, rect.bottom - 1],
        [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2],
      ].filter(
        ([x, y]) =>
          x !== undefined &&
          y !== undefined &&
          x >= 0 &&
          y >= 0 &&
          x < innerWidth &&
          y < innerHeight,
      )
      if (!points.length) return unresolved('text outside viewport; scroll and remeasure')
      for (const [x, y] of points) {
        if (x === undefined || y === undefined) return unresolved('missing sample point')
        for (const top of document.elementsFromPoint(x, y)) {
          if (top === el || top === svg || top.contains(svg)) break
          if (!svg.contains(top)) return unresolved('HTML overlay obscures text')
        }
      }
      const luminance = (rgb: [number, number, number]) => {
        const linear = rgb.map((value) => {
          const channel = value / 255
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!
      }
      const a = luminance(foreground)
      const b = luminance(background)
      return {
        status: 'measured',
        method: 'svg-opaque-halo',
        foreground: style.fill,
        background: style.stroke,
        ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        strokeWidth,
      }
    },
    [...target],
  )
}
