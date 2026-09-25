// TwoPane — liên kết "bỏ qua cột trái" (2026-09-25). Cột mục lục trái đứng trước nội dung
// trong DOM và nằm trong <main>, nên liên kết "Bỏ qua tới nội dung chính" không vượt qua nó.
import { describe, it, expect, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { TwoPane } from './TwoPane'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let root: Root | null = null
let host: HTMLDivElement | null = null

function hien(ui: React.ReactNode) {
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => root!.render(ui))
  return host
}

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  root = null
  host = null
  window.history.replaceState(null, '', '/')
})

describe('TwoPane — bỏ qua cột trái', () => {
  it('cột trái: liên kết bỏ qua là điểm dừng đầu tiên, đứng trước mục lục', () => {
    const el = hien(
      <TwoPane isDesktop railSide="left" rail={<a href="/muc-1">Mục 1</a>}>
        <h1>Bài</h1>
      </TwoPane>,
    )
    const links = Array.from(el.querySelectorAll('a'))
    expect(links[0]?.textContent).toBe('Bỏ qua mục lục, tới nội dung')
    expect(links[1]?.textContent).toBe('Mục 1')
  })

  it('bấm: tiêu điểm vào cột nội dung, KHÔNG đổi hash của trang', () => {
    window.history.replaceState(null, '', '/bai#ly-thuyet')
    const el = hien(
      <TwoPane isDesktop railSide="left" rail={<a href="/muc-1">Mục 1</a>} skipRailLabel="Bỏ qua">
        <h1>Bài</h1>
      </TwoPane>,
    )
    const skip = el.querySelector('a')!
    act(() => skip.click())
    const dich = document.activeElement as HTMLElement
    expect(dich.querySelector('h1')?.textContent).toBe('Bài')
    expect(skip.getAttribute('href')).toBe(`#${dich.id}`)
    expect(window.location.hash).toBe('#ly-thuyet')
  })

  it('cột phải hoặc mobile: không có liên kết bỏ qua', () => {
    const phai = hien(
      <TwoPane isDesktop rail={<a href="/x">X</a>}>
        <p>Nội dung</p>
      </TwoPane>,
    )
    expect(phai.querySelectorAll('a')).toHaveLength(1)
    act(() => root?.unmount())
    phai.remove()
    const mobile = hien(
      <TwoPane isDesktop={false} railSide="left" rail={<a href="/x">X</a>}>
        <p>Nội dung</p>
      </TwoPane>,
    )
    expect(mobile.querySelectorAll('a')).toHaveLength(0)
  })
})
