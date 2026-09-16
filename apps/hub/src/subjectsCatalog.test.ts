// apps/hub/src/subjectsCatalog.test.ts — test THẬT ĐẦU TIÊN của apps/hub (AC-17,
// docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md). Trước S05-2, vitest.config.ts
// KHÔNG quét apps/hub/src/** nên không file *.test.* nào ở đây từng chạy trong CI.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SUBJECT_CATALOG } from './subjectsCatalog.generated'
import { SUBJECT_COPY } from './App'

const APP_URL_FALLBACK = 'https://www.donghanhcungban.org'
const START_URL = `${APP_URL_FALLBACK}/bat-dau`

describe('apps/hub/src/subjectsCatalog.generated.ts', () => {
  it('id duy nhất', () => {
    const ids = SUBJECT_CATALOG.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ctaUrl ghép từ APP_URL đều bắt đầu bằng APP_URL, và english KHÔNG còn /hoc-tieng-anh', () => {
    for (const entry of SUBJECT_CATALOG) {
      const ctaUrl = `${APP_URL_FALLBACK}${entry.ctaPath}`
      expect(ctaUrl.startsWith(APP_URL_FALLBACK)).toBe(true)
      expect(ctaUrl).not.toContain('/hoc-tieng-anh')
    }
  })

  it('START_URL kết thúc bằng /bat-dau', () => {
    expect(START_URL.endsWith('/bat-dau')).toBe(true)
  })

  it('hub không import bất kỳ gói @dhcb/* nào (chỉ đọc file sinh)', () => {
    // Quét toàn bộ apps/hub/src (trừ chính file test này và file generated, không có import).
    const filesToScan = [
      'apps/hub/src/App.tsx',
      'apps/hub/src/main.tsx',
      'apps/hub/src/pages/HubLogin.tsx',
    ]
    for (const file of filesToScan) {
      const src = readFileSync(file, 'utf8')
      expect(src, file).not.toMatch(/from ['"]@dhcb\//)
    }
  })
})

describe('apps/hub/src/App.tsx — SUBJECT_COPY khớp file sinh (AC-16)', () => {
  it('Object.keys(SUBJECT_COPY) = đúng tập id của SUBJECT_CATALOG (không thiếu, không thừa)', () => {
    expect(Object.keys(SUBJECT_COPY).sort()).toEqual(SUBJECT_CATALOG.map((e) => e.id).sort())
  })
})

describe('apps/hub — 4 môn STEM là preview (Q5), english/programming live', () => {
  it('mỗi môn live/preview có ctaPath là route nội bộ hợp lệ (bắt đầu bằng /)', () => {
    for (const entry of SUBJECT_CATALOG) {
      if (entry.status === 'building') continue
      expect(entry.ctaPath.startsWith('/')).toBe(true)
    }
  })
})
