import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { subjectHomePath } from '@dhcb/core-learner/subjectHome'

// apps/hub là app RIÊNG, cố ý không import gói `@dhcb/*` (apps/hub/tsconfig.json), nên link
// sang app nền tảng là chuỗi ghi tay. Test này giữ chúng khớp với nguồn sự thật
// `packages/core-learner/subjectHome.ts` — đổi đường dẫn môn mà quên hub thì đỏ ở đây.
const HUB = readFileSync('apps/hub/src/App.tsx', 'utf8')

describe('apps/hub — liên kết sang app nền tảng khớp nguồn sự thật', () => {
  it('CTA môn Tiếng Anh trỏ trang tổng quan môn trong Góc học tập', () => {
    expect(HUB).toContain('`${APP_URL}' + subjectHomePath('english') + '`')
    expect(HUB).not.toContain('/hoc-tieng-anh')
  })

  it('CTA môn Lập trình và Góc học tập giữ đúng đường dẫn chuẩn', () => {
    expect(HUB).toContain('`${APP_URL}' + subjectHomePath('programming') + '`')
    expect(HUB).toContain('`${APP_URL}/goc-hoc-tap`')
    expect(HUB).not.toContain('`${APP_URL}/mon-hoc')
  })
})
