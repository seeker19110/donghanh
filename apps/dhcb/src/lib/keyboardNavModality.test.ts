import { describe, expect, it } from 'vitest'
import { initKeyboardNavModality } from './keyboardNavModality'

/** Môi trường node không có KeyboardEvent — Event thường mang thêm `key` là đủ. */
function key(value: string): Event {
  return Object.assign(new Event('keydown'), { key: value })
}

function setup() {
  const root = { dataset: {} as DOMStringMap }
  const target = new EventTarget()
  const dispose = initKeyboardNavModality(root, target)
  return { root, target, dispose }
}

describe('initKeyboardNavModality', () => {
  it('Tab bật cờ, chạm/bấm chuột tắt cờ', () => {
    const { root, target } = setup()
    expect(root.dataset.kbdNav).toBeUndefined()
    target.dispatchEvent(key('Tab'))
    expect(root.dataset.kbdNav).toBe('1')
    target.dispatchEvent(new Event('pointerdown'))
    expect(root.dataset.kbdNav).toBeUndefined()
  })

  it('phím khác Tab (gõ chữ, Enter, Space, mũi tên) không bật cờ', () => {
    const { root, target } = setup()
    for (const value of ['a', 'Enter', ' ', 'ArrowDown']) target.dispatchEvent(key(value))
    expect(root.dataset.kbdNav).toBeUndefined()
  })

  it('dọn dẹp: gỡ listener và xoá cờ', () => {
    const { root, target, dispose } = setup()
    target.dispatchEvent(key('Tab'))
    dispose()
    expect(root.dataset.kbdNav).toBeUndefined()
    target.dispatchEvent(key('Tab'))
    expect(root.dataset.kbdNav).toBeUndefined()
  })
})
