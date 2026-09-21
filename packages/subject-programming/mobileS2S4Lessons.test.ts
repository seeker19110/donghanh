// CỔNG NGỮ NGHĨA cho lát cắt `mobile-s2`/`mobile-s3`/`mobile-s4` (đặc tả
// `docs/specs/2026-09-21-mobile-s2-s4-bai-hoc-that.md`), theo tiền lệ `devopsS3Lessons.test.ts`.
//
// Vì sao cần cổng riêng: các cổng chung (`lessonsTs.test.ts`, `lessons.test.ts`) chỉ chứng minh
// bài CHẠY ĐƯỢC và chấm đúng. Chúng không bắt được hai thứ mà lát cắt này phải giữ: (1) simulator
// lén I/O ngoài hoặc dùng đồng hồ/random nên hết tất định, (2) mất ca âm — bài chỉ còn ca thuận
// thì học viên viết một hàm luôn trả về "allow" cũng qua.
import { describe, expect, it } from 'vitest'
import { P6U214_LESSONS } from './lessons/p6u214.js'
import { P6U215_LESSONS } from './lessons/p6u215.js'
import { P6U216_LESSONS } from './lessons/p6u216.js'
import { P6U217_LESSONS } from './lessons/p6u217.js'
import { P6U218_LESSONS } from './lessons/p6u218.js'
import { P6U219_LESSONS } from './lessons/p6u219.js'
import { P6U220_LESSONS } from './lessons/p6u220.js'
import { P6U221_LESSONS } from './lessons/p6u221.js'
import { P6U222_LESSONS } from './lessons/p6u222.js'
import { P6U223_LESSONS } from './lessons/p6u223.js'
import { P6U224_LESSONS } from './lessons/p6u224.js'
import { P6U225_LESSONS } from './lessons/p6u225.js'

const UNIT_IDS = [
  'p6-u214',
  'p6-u215',
  'p6-u216',
  'p6-u217',
  'p6-u218',
  'p6-u219',
  'p6-u220',
  'p6-u221',
  'p6-u222',
  'p6-u223',
  'p6-u224',
  'p6-u225',
]

const lessons = [
  ...P6U214_LESSONS,
  ...P6U215_LESSONS,
  ...P6U216_LESSONS,
  ...P6U217_LESSONS,
  ...P6U218_LESSONS,
  ...P6U219_LESSONS,
  ...P6U220_LESSONS,
  ...P6U221_LESSONS,
  ...P6U222_LESSONS,
  ...P6U223_LESSONS,
  ...P6U224_LESSONS,
  ...P6U225_LESSONS,
]

const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

/** Mọi đoạn code CHẠY ĐƯỢC của lát cắt — nơi duy nhất I/O ngoài có thể lọt vào. */
const code = lessons
  .flatMap((lesson) => [
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.parsons.lines.join('\n'),
    lesson.make.starterCode,
    lesson.make.sampleSolution,
  ])
  .join('\n')

describe('mobile-s2..s4 — simulator mạng xấu, quyền, hiệu năng, phát hành và bảo mật di động', () => {
  it('có mười hai unit, hai mươi bốn lesson TypeScript, mỗi Make có ca hiện và ca ẩn', () => {
    expect(lessons).toHaveLength(24)
    for (const unitId of UNIT_IDS) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('typescript')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      // Runner echo stdin nên khớp tuyệt đối sẽ đỏ giả — cả lát cắt dùng 'contains'.
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi Make có ít nhất một CA ÂM (nhánh từ chối hoặc chưa đủ dữ liệu)', () => {
    // Không có ca âm thì một hàm luôn trả về "allow" cũng qua bài — đúng thứ lát cắt này dạy ngược.
    const NHANH_AM =
      /invalid|deny|reject|unknown|halt|leak|oversize|logout|blocked|unresolved|drop-frame|fail|dedup|noop|offline|warn/
    for (const lesson of lessons) {
      const coCaAm = lesson.make.testCases.some((testCase) => NHANH_AM.test(testCase.expected))
      expect(coCaAm, `Bài ${lesson.id}: thiếu ca âm trong test-case`).toBe(true)
    }
  })

  it('khoá các khái niệm cốt lõi của mười hai module', () => {
    for (const marker of [
      'idempotent',
      'backoff',
      'refresh',
      'fail closed',
      'fallback',
      'versioncode',
      '16ms',
      'ảo hoá',
      'workmanager',
      'kho dữ liệu',
      'trợ năng',
      'rollout',
      'force-update',
      'cờ tính năng',
      'semantic versioning',
      'chống chụp màn',
    ]) {
      expect(evidence, `thiếu khái niệm "${marker}"`).toContain(marker)
    }
  })

  it('simulator không có I/O ngoài, không đồng hồ hệ thống, không random', () => {
    expect(code).not.toMatch(
      /\bfetch\(|\bXMLHttpRequest\b|require\(|\bprocess\.env\b|\bimport\s|localStorage|Date\.now|new Date\(|Math\.random|\bfs\b|child_process/,
    )
  })

  it('không in giá trị bí mật ra output (bài bảo mật chỉ được nêu TÊN mục)', () => {
    for (const lesson of P6U225_LESSONS) {
      expect(lesson.make.sampleSolution).not.toContain('viPham.push(m.giaTriTrongGoi)')
      expect(lesson.make.sampleSolution).not.toContain('+ m.giaTriTrongGoi')
    }
  })
})
