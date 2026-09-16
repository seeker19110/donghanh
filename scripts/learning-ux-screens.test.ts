import { describe, it, expect } from 'vitest'
import {
  LEARNING_UX_SCREENS,
  STATE_IDS,
  WIDTHS,
  HEIGHTS,
  demOKhaDung,
  type ScreenId,
  type StateId,
} from '../e2e/helpers/learningUxScreens'

// Test canh cho "một nguồn sự thật sáu màn mẫu" (spec S13 AC-1).
//
// VÌ SAO ĐẶT Ở `scripts/` chứ không ở `e2e/`: `vitest.config.ts` chỉ include
// `apps/**`, `packages/**` và `scripts/**/*.test.ts` — KHÔNG có `e2e/**`. Một test
// đặt trong `e2e/` sẽ không bao giờ chạy trong CI (test mồ côi = cổng giả).

const THU_TU_MAN: readonly ScreenId[] = [
  'today',
  'outline',
  'lesson',
  'tutor',
  'result',
  'progress',
]

describe('LEARNING_UX_SCREENS', () => {
  it('đúng 6 màn, đúng thứ tự spec §③.1', () => {
    expect(LEARNING_UX_SCREENS.map((m) => m.id)).toEqual(THU_TU_MAN)
  })

  it('id không trùng nhau', () => {
    const ids = LEARNING_UX_SCREENS.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('mọi màn có đủ 5 khoá trạng thái — thiếu thì phải là `n/a` CÓ lý do, không được bỏ khoá', () => {
    for (const man of LEARNING_UX_SCREENS) {
      expect(Object.keys(man.states).sort(), `màn ${man.id}`).toEqual([...STATE_IDS].sort())
      for (const s of STATE_IDS) {
        const setup = man.states[s as StateId]
        expect(['route', 'action', 'n/a'], `màn ${man.id} / trạng thái ${s}`).toContain(setup.kind)
        if (setup.kind === 'n/a') {
          // Lý do phải là một câu thật, không phải "TODO" hay chuỗi rỗng.
          expect(setup.reason.length, `màn ${man.id} / ${s}: thiếu lý do n/a`).toBeGreaterThan(20)
        } else {
          expect(typeof setup.install, `màn ${man.id} / ${s}`).toBe('function')
        }
      }
    }
  })

  it('route nội bộ, bắt đầu bằng `/`, và có CTA chính để đo "trong màn hình đầu"', () => {
    for (const man of LEARNING_UX_SCREENS) {
      expect(man.route.startsWith('/'), `màn ${man.id}: route "${man.route}"`).toBe(true)
      expect(man.route.startsWith('//'), `màn ${man.id}: route ngoài`).toBe(false)
      expect(man.primaryCta.trim().length, `màn ${man.id}: thiếu primaryCta`).toBeGreaterThan(0)
      expect(man.label.trim().length, `màn ${man.id}: thiếu nhãn`).toBeGreaterThan(0)
    }
  })

  it('mỗi màn ghi rõ slice nào quyết route (để audit Tầng 6b tra ngược)', () => {
    for (const man of LEARNING_UX_SCREENS) {
      expect(['S06', 'S07', 'S08', 'S10', 'S11', 'S12'], `màn ${man.id}`).toContain(man.source)
    }
  })

  it('bốn bề rộng chuẩn 320/390/768/1440, mỗi bề rộng có chiều cao đi kèm', () => {
    expect(WIDTHS).toEqual([320, 390, 768, 1440])
    for (const w of WIDTHS) expect(HEIGHTS[w], `thiếu chiều cao cho ${w}`).toBeGreaterThan(0)
  })

  it('demOKhaDung() khớp số ô không phải n/a (script chụp in số này làm kỳ vọng)', () => {
    const dem = LEARNING_UX_SCREENS.flatMap((m) =>
      STATE_IDS.map((s) => m.states[s]).filter((x) => x.kind !== 'n/a'),
    ).length
    expect(demOKhaDung()).toBe(dem)
    // 30 ô lý thuyết trừ các ô n/a có lý do — số dương và không vượt 30.
    expect(demOKhaDung()).toBeGreaterThan(0)
    expect(demOKhaDung()).toBeLessThanOrEqual(30)
  })
})
