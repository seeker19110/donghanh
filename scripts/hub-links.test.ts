import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { subjectHomePath } from '@dhcb/core-learner/subjectHome'
import { SUBJECT_CATALOG } from '../apps/hub/src/subjectsCatalog.generated.js'

// apps/hub là app RIÊNG, cố ý không import gói `@dhcb/*` (apps/hub/tsconfig.json). Từ S05-2,
// hub không còn ghép chuỗi CTA tay — nó đọc `ctaPath` từ file sinh `subjectsCatalog.generated.ts`
// (nguồn: packages/core-learner/subjectEntry.ts, dùng `subjectHomePath`) và tự ghép
// `${APP_URL}${entry.ctaPath}` (xem App.tsx). Test này canh cho FILE SINH không lệch
// `subjectHomePath` — lệch thì đỏ ở `gen-subject-catalog.test.ts`, còn ở đây canh cho hub
// không còn đường dẫn cũ đã bỏ.
const HUB = readFileSync('apps/hub/src/App.tsx', 'utf8')

describe('apps/hub — liên kết sang app nền tảng khớp nguồn sự thật', () => {
  it('ctaPath môn Tiếng Anh trong file sinh trỏ trang tổng quan môn trong Góc học tập', () => {
    const english = SUBJECT_CATALOG.find((e) => e.id === 'english')
    expect(english?.ctaPath).toBe(subjectHomePath('english'))
    expect(HUB).not.toContain('/hoc-tieng-anh')
  })

  it('ctaPath môn Lập trình và đường dẫn Góc học tập giữ đúng chuẩn', () => {
    const programming = SUBJECT_CATALOG.find((e) => e.id === 'programming')
    expect(programming?.ctaPath).toBe(subjectHomePath('programming'))
    expect(HUB).toContain('`${APP_URL}/goc-hoc-tap`')
    expect(HUB).not.toContain('`${APP_URL}/mon-hoc')
  })

  it('App.tsx ghép ctaUrl từ ctaPath của file sinh, không ghép chuỗi CTA rải rác', () => {
    expect(HUB).toContain('`${APP_URL}${entry.ctaPath}`')
  })
})
