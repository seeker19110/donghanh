// LevelMilestones.test.tsx — canh luật P2-1 (audit 2026-09-22): câu giải thích ổ khoá chỉ hiện
// đầy đủ ở bậc KẾ TIẾP của bậc đang học; bậc khoá xa hơn chỉ ghi ngắn "Mở sau P<n-1>".
// Dự án không dùng @testing-library — render bằng `renderToStaticMarkup` như các test khác.
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import LevelMilestones from './LevelMilestones'
import type { ProgrammingLevel } from '@dhcb/subject-programming/curriculum'
import type { LevelLockInfo } from '../../lib/programmingLevelLock'

const levels = ['p2', 'p3', 'p4'].map((id) => ({
  id,
  name: `Bậc ${id.toUpperCase()}`,
  canDo: 'Làm được việc gì đó.',
  languages: ['JavaScript'],
  duration: '4 tuần',
  units: [],
})) as unknown as ProgrammingLevel[]

const lockInfo: LevelLockInfo = {
  locked: true,
  requiredLevelId: 'p1',
  doneInRequired: 0,
  neededInRequired: 7,
  remaining: 7,
}

function renderHtml(nextLockedLevelId: string | undefined): string {
  return renderToStaticMarkup(
    <LevelMilestones
      levels={levels}
      progressOf={() => ({ done: 0, total: 5 })}
      onOpen={() => {}}
      lockOf={() => lockInfo}
      lockHint={(info) =>
        `Còn ${info.remaining} bài ở ${info.requiredLevelId?.toUpperCase()} nữa là mở.`
      }
      nextLockedLevelId={nextLockedLevelId}
    />,
  )
}

describe('LevelMilestones — câu giải thích ổ khoá không lặp', () => {
  it('chỉ bậc kế tiếp (p2) hiện câu đầy đủ, p3/p4 hiện ngắn "Mở sau"', () => {
    const html = renderHtml('p2')
    // Câu đầy đủ xuất hiện ở CẢ `aria-label` lẫn đoạn `<p>` hiển thị — mỗi bậc có câu là 2 lần.
    const soLanCauDayDu = html.split('nữa là mở.').length - 1
    expect(soLanCauDayDu).toBe(2)
    const soLanMoSau = html.split('Mở sau P1').length - 1
    expect(soLanMoSau).toBe(4) // p3 và p4, mỗi bậc 2 lần (aria-label + <p>)
  })

  it('không truyền nextLockedLevelId thì giữ hành vi cũ — mọi bậc khoá đều hiện đầy đủ', () => {
    const html = renderHtml(undefined)
    const soLanCauDayDu = html.split('nữa là mở.').length - 1
    expect(soLanCauDayDu).toBe(6) // 3 bậc × 2 (aria-label + <p>)
    expect(html).not.toContain('Mở sau')
  })
})
