import { describe, it, expect, beforeEach } from 'vitest'
import {
  markSessionDoneOpenInUrl,
  clearSessionDoneOpenInUrl,
  isSessionDoneOpenInUrl,
} from './sessionDoneUrl'

describe('sessionDoneUrl', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/goc-hoc-tap/a1')
  })

  it('markSessionDoneOpenInUrl gắn ?xong=1 mà không thêm entry lịch sử mới', () => {
    markSessionDoneOpenInUrl()
    expect(window.location.search).toBe('?xong=1')
    expect(isSessionDoneOpenInUrl()).toBe(true)
  })

  it('clearSessionDoneOpenInUrl xoá query', () => {
    markSessionDoneOpenInUrl()
    clearSessionDoneOpenInUrl()
    expect(window.location.search).toBe('')
    expect(isSessionDoneOpenInUrl()).toBe(false)
  })

  it('giữ nguyên các query khác đã có', () => {
    window.history.replaceState(null, '', '/goc-hoc-tap/a1?tab=review')
    markSessionDoneOpenInUrl()
    expect(window.location.search).toContain('tab=review')
    expect(window.location.search).toContain('xong=1')
  })
})
