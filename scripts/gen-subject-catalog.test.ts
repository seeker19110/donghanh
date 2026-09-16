// gen-subject-catalog — canh file SINH TỰ ĐỘNG apps/hub/src/subjectsCatalog.generated.ts
// không lệch nguồn packages/core-learner/subjectEntry.ts (khuôn lessonsLazy.test.ts).
import { describe, expect, it } from 'vitest'
import { SUBJECT_ENTRIES } from '@dhcb/core-learner/subjectEntry'
import { renderCatalogSource, readGeneratedFile } from './gen-subject-catalog.js'
import { SUBJECT_CATALOG } from '../apps/hub/src/subjectsCatalog.generated.js'

const GOI_Y = 'Danh mục môn của hub lệch nguồn — chạy: npm run gen:subject-catalog'

describe('gen-subject-catalog (file sinh tự động)', () => {
  it('SUBJECT_CATALOG khớp CHÍNH XÁC SUBJECT_ENTRIES (id, nhãn, thứ tự, ctaPath, trạng thái)', () => {
    expect(SUBJECT_CATALOG, GOI_Y).toEqual(SUBJECT_ENTRIES)
  })

  it('file trên đĩa khớp đúng nội dung sẽ được sinh lại (không ai sửa tay)', async () => {
    const rendered = renderCatalogSource(SUBJECT_ENTRIES)
    const prettier = await import('prettier')
    const prettierConfig =
      (await prettier.resolveConfig('apps/hub/src/subjectsCatalog.generated.ts')) ?? {}
    const formatted = await prettier.format(rendered, {
      ...prettierConfig,
      filepath: 'apps/hub/src/subjectsCatalog.generated.ts',
    })
    expect(readGeneratedFile(), GOI_Y).toBe(formatted)
  })
})
