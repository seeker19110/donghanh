// Cổng cho <Modal>: hai dáng (center · sheet) và việc render qua PORTAL ra <body>.
//
// Vì sao cần test này (S07-2): panel "Mục lục" trên mobile mở TỪ BÊN TRONG cột phụ của
// `TwoPane` — một vùng có `overflow-y: auto`. Nếu hộp thoại render tại chỗ thì nó bị cắt theo
// vùng đó và người dùng chỉ thấy một mẩu. Portal là điều kiện để rail desktop và panel mobile
// dùng chung MỘT cây mục lục, nên nó phải có test canh chứ không phải một chi tiết ngẫu nhiên.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import Modal from './Modal'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Modal', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function hien(variant?: 'center' | 'sheet', onClose: () => void = () => {}) {
    act(() => {
      root.render(
        <Modal title="Mục lục môn học" onClose={onClose} {...(variant ? { variant } : {})}>
          <p>Nội dung hộp thoại</p>
        </Modal>,
      )
    })
  }

  /** Khung hộp thoại — tra bằng VAI TRÒ, không bằng vị trí trong DOM (portal đổi vị trí đó). */
  const hopThoai = () => document.body.querySelector('[role="dialog"]')

  it('render ra <body> qua portal, KHÔNG nằm trong thẻ bọc của component cha', () => {
    hien()
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(hopThoai()).not.toBeNull()
  })

  it('giữ nguyên hợp đồng a11y: role=dialog, aria-modal, tên lấy từ tiêu đề', () => {
    hien()
    const d = hopThoai()!
    expect(d.getAttribute('aria-modal')).toBe('true')
    const titleId = d.getAttribute('aria-labelledby')
    expect(document.getElementById(titleId!)?.textContent).toBe('Mục lục môn học')
  })

  it('mặc định là dáng center — không đổi gì so với 20 nơi đang dùng', () => {
    hien()
    const lop = hopThoai()!.className
    expect(lop).toContain('rounded-2xl')
    expect(lop).toContain('max-h-[90dvh]')
    expect(lop).not.toContain('rounded-t-2xl')
  })

  it('dáng sheet neo ĐÁY màn hình, cao tối đa 85dvh và chừa lề an toàn máy có thanh gạt', () => {
    hien('sheet')
    const lop = hopThoai()!.className
    expect(lop).toContain('rounded-t-2xl')
    expect(lop).toContain('max-h-[85dvh]')
    expect(lop).toContain('env(safe-area-inset-bottom)')
    // Lớp nền đẩy tấm xuống đáy thay vì căn giữa.
    expect(hopThoai()!.parentElement?.className).toContain('items-end')
  })

  it('nút đóng gọi onClose (và có vùng chạm ≥ 44px)', () => {
    let dong = 0
    hien('sheet', () => (dong += 1))
    const nut = [...document.body.querySelectorAll('button')].find(
      (b) => b.getAttribute('aria-label') === 'Đóng',
    )!
    expect(nut.className).toContain('tap-44')
    act(() => nut.click())
    expect(dong).toBe(1)
  })

  it('đóng thì gỡ sạch khỏi <body> — không để lại lớp phủ chặn thao tác', () => {
    hien('sheet')
    act(() => root.render(null))
    expect(hopThoai()).toBeNull()
  })
})
