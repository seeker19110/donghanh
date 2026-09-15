import { describe, it, expect, beforeEach } from 'vitest'
import { getUiLang, setUiLang } from './uiLang'

// [Slice 04] Ngôn ngữ giao diện tách khỏi chiều học Tiếng Anh, nhưng KHÔNG đổi trải nghiệm
// người đang học chiều B (spec 03-04 §④ AC-4.3).
describe('getUiLang — đồng bộ một lần từ chiều học', () => {
  beforeEach(() => localStorage.clear())

  it('chưa đặt ui_lang, chiều A (hoặc chưa có) → vi', () => {
    expect(getUiLang()).toBe('vi')
    localStorage.clear()
    localStorage.setItem('et_direction', 'A')
    expect(getUiLang()).toBe('vi')
  })

  it('chưa đặt ui_lang, chiều B → en và GHI xuống để ổn định', () => {
    localStorage.setItem('et_direction', 'B')
    expect(getUiLang()).toBe('en')
    expect(localStorage.getItem('ui_lang')).toBe('en')
    // Sau đó đổi chiều học không còn ảnh hưởng giao diện.
    localStorage.setItem('et_direction', 'A')
    expect(getUiLang()).toBe('en')
  })

  it('đã đặt vi dù chiều B → tôn trọng vi', () => {
    localStorage.setItem('et_direction', 'B')
    setUiLang('vi')
    expect(getUiLang()).toBe('vi')
  })

  it('đã đặt en dù chiều A → tôn trọng en; giá trị rác → coi như chưa đặt', () => {
    setUiLang('en')
    expect(getUiLang()).toBe('en')
    localStorage.setItem('ui_lang', 'xx')
    expect(getUiLang()).toBe('vi')
  })
})
