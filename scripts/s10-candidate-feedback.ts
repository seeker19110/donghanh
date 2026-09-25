// S10b — sinh "phản hồi ứng viên" nguyên văn cho bộ 40 mẫu, để chuyên gia chấm theo rubric S10.
//
//   npx tsx scripts/s10-candidate-feedback.ts          # ghi lại candidate-feedback.json
//   npx tsx scripts/s10-candidate-feedback.ts --check  # chỉ so, thoát 1 nếu bản đã commit lỗi thời
//
// Đặc tả: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §3.1. KHÔNG chấm.
// Mã thoát: 0 = khớp/đã ghi · 1 = bản đã commit lỗi thời hoặc bộ mẫu sai toàn vẹn.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  buildCandidateFeedback,
  kiemToanVen,
  type CandidateFeedback,
  type Rubric,
} from './lib/s10CandidateFeedback.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
export const RUBRIC_PATH = join(ROOT, 'docs/ux-upgrade/s09-s12/rubric-40.json')
export const OUT_PATH = join(ROOT, 'docs/ux-upgrade/s09-s12/candidate-feedback.json')

export interface CandidateFile {
  version: 1
  rubricVersion: number
  notice: string
  generator: string
  generatedFromSha: string
  cases: CandidateFeedback[]
}

function shaHienTai(): string {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT }).toString().trim()
  } catch {
    return 'unknown'
  }
}

export function taoFile(rubric: Rubric, sha: string): CandidateFile {
  return {
    version: 1,
    rubricVersion: rubric.version,
    notice:
      'Phản hồi ứng viên dựng lại NGUYÊN VĂN từ mã nguồn app — nguyên liệu cho chuyên gia chấm. KHÔNG phải kết quả chấm; không ca nào đạt/không đạt ở đây.',
    generator: 'scripts/s10-candidate-feedback.ts',
    generatedFromSha: sha,
    cases: buildCandidateFeedback(rubric),
  }
}

function main(): number {
  const rubric = JSON.parse(readFileSync(RUBRIC_PATH, 'utf8')) as Rubric
  const loi = kiemToanVen(rubric)
  if (loi.length > 0) {
    console.error(`Bộ mẫu sai toàn vẹn:\n- ${loi.join('\n- ')}`)
    return 1
  }
  const moi = taoFile(rubric, shaHienTai())
  if (process.argv.includes('--check')) {
    const cu = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as CandidateFile
    if (JSON.stringify(cu.cases) !== JSON.stringify(moi.cases)) {
      console.error(
        'candidate-feedback.json lỗi thời — chạy: npx tsx scripts/s10-candidate-feedback.ts',
      )
      return 1
    }
    console.log(`OK — ${moi.cases.length} ca khớp mã nguồn hiện tại.`)
    return 0
  }
  writeFileSync(OUT_PATH, `${JSON.stringify(moi, null, 2)}\n`)
  const dem = moi.cases.reduce<Record<string, number>>((m, c) => {
    m[c.pathKind] = (m[c.pathKind] ?? 0) + 1
    return m
  }, {})
  console.log(`Đã ghi ${OUT_PATH}: ${JSON.stringify(dem)}`)
  return 0
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main())
