import { describe, expect, it } from 'vitest'
import { DOMAIN_OPTIONS, QUICK_PROMPTS } from './studioTypes'

// Ba trụ Sự nghiệp · Khởi nghiệp · Đời sống đã gỡ hẳn (migration 0085). Giao diện Companion
// không được mời chào lại chúng — audit UI/UX 2026-09-22, phát hiện P0-1.
const TRU_DA_GO = ['career', 'startup', 'life']
const NHAN_DA_GO = /sự nghiệp|khởi nghiệp|đời sống|kinh doanh/i

describe('studioTypes — không hồi sinh trụ đã gỡ', () => {
  it('DOMAIN_OPTIONS chỉ còn all · learning · work', () => {
    expect(DOMAIN_OPTIONS.map((d) => d.id)).toEqual(['all', 'learning', 'work'])
  })

  it('QUICK_PROMPTS không trỏ về trụ đã gỡ, cả id lẫn chữ', () => {
    for (const p of QUICK_PROMPTS) {
      expect(TRU_DA_GO).not.toContain(p.domain)
      expect(p.label).not.toMatch(NHAN_DA_GO)
      expect(p.text).not.toMatch(NHAN_DA_GO)
    }
  })
})
