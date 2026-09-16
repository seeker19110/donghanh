// gen-subject-catalog — sinh `apps/hub/src/subjectsCatalog.generated.ts` từ
// `packages/core-learner/subjectEntry.ts` (`SUBJECT_ENTRIES`).
//
// VÌ SAO CẦN (S05-2, docs/specs/2026-09-15-learning-ux-s05-bat-dau-theo-y-dinh.md §③.6, Q6):
// `apps/hub` là Vite app RIÊNG, cố ý KHÔNG import gói `@dhcb/*` (xem `apps/hub/vite.config.ts` —
// chỉ có alias `@core` cho `packages/core-ui`) để tránh kéo cấu hình build của app tiếng Anh vào
// trang giới thiệu. Sinh một file dữ liệu THUẦN (không React, không icon — những thứ đó vẫn ở hub
// dưới dạng `Record<id, Copy>`) là cách duy nhất giữ MỘT nguồn mà không thêm alias build mới.
//
// Nguồn sự thật vẫn là `packages/core-learner/subjectEntry.ts`. File sinh ra KHÔNG được sửa tay;
// `scripts/gen-subject-catalog.test.ts` canh cho nó không lệch nguồn — lệch thì chạy lại:
//   npm run gen:subject-catalog
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prettier from 'prettier'
import { SUBJECT_ENTRIES, type SubjectEntry } from '@dhcb/core-learner/subjectEntry'

const here = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.resolve(here, '../apps/hub/src/subjectsCatalog.generated.ts')

/** Sinh nội dung file — tách hàm thuần để test không phải ghi đĩa. */
export function renderCatalogSource(entries: readonly SubjectEntry[]): string {
  return `// subjectsCatalog.generated.ts — SINH TỰ ĐỘNG bởi scripts/gen-subject-catalog.ts — KHÔNG sửa tay.
// Chạy lại khi đổi packages/core-learner/subjectEntry.ts:  npm run gen:subject-catalog
// (scripts/gen-subject-catalog.test.ts canh cho file này không lệch nguồn.)
//
// Dữ liệu THUẦN — id/nhãn/thứ tự/đường dẫn/trạng thái. Hub KHÔNG import gói \`@dhcb/*\`
// (apps/hub/vite.config.ts) nên kiểu được khai lại tại chỗ thay vì import từ gói.
export type SubjectEntryStatus = 'live' | 'preview' | 'building'

export interface SubjectCatalogEntry {
  id: string
  label: string
  order: number
  ctaPath: string
  status: SubjectEntryStatus
}

/** Nguồn: packages/core-learner/subjectEntry.ts (SUBJECT_ENTRIES). */
export const SUBJECT_CATALOG: readonly SubjectCatalogEntry[] = ${JSON.stringify(entries, null, 2)}
`
}

async function main(): Promise<void> {
  const source = renderCatalogSource(SUBJECT_ENTRIES)
  const prettierConfig = (await prettier.resolveConfig(outPath)) ?? {}
  writeFileSync(outPath, await prettier.format(source, { ...prettierConfig, filepath: outPath }))
  console.log(`Đã sinh ${path.relative(process.cwd(), outPath)}: ${SUBJECT_ENTRIES.length} môn`)
}

// Đọc file hiện có để test đối chiếu mà không phải import lại prettier bất đồng bộ ở đó.
export function readGeneratedFile(): string {
  return readFileSync(outPath, 'utf8')
}

// Chỉ chạy khi gọi trực tiếp (test import renderCatalogSource mà không sinh file).
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
