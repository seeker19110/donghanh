// Cổng ngữ nghĩa cho hướng GAME chặng S1 + S2 (đặc tả
// `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`). Bắt đúng thứ cổng chung không bắt được:
// simulator lén gọi hệ ngoài, mất nhãn MÔ PHỎNG, hoặc nội dung tự nhận là engine/profiler thật.
import { describe, expect, it } from 'vitest'
import { P6U242_LESSONS } from './lessons/p6u242.js'
import { P6U243_LESSONS } from './lessons/p6u243.js'
import { P6U244_LESSONS } from './lessons/p6u244.js'
import { P6U245_LESSONS } from './lessons/p6u245.js'
import { P6U246_LESSONS } from './lessons/p6u246.js'
import { P6U247_LESSONS } from './lessons/p6u247.js'
import { P6U248_LESSONS } from './lessons/p6u248.js'
import { P6U249_LESSONS } from './lessons/p6u249.js'

const lessons = [
  ...P6U242_LESSONS,
  ...P6U243_LESSONS,
  ...P6U244_LESSONS,
  ...P6U245_LESSONS,
  ...P6U246_LESSONS,
  ...P6U247_LESSONS,
  ...P6U248_LESSONS,
  ...P6U249_LESSONS,
]

const UNIT_IDS = [
  'p6-u242',
  'p6-u243',
  'p6-u244',
  'p6-u245',
  'p6-u246',
  'p6-u247',
  'p6-u248',
  'p6-u249',
]

// Phần "bằng chứng nội dung" — nơi marker của chặng phải xuất hiện.
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Mọi văn xuôi — dùng cho luật cấm tự nhận là engine/profiler thật.
const prose = lessons
  .map((lesson) => `${lesson.title}\n${lesson.hook}\n${lesson.theory}\n${lesson.homework}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Code CHẠY ĐƯỢC — nơi tuyệt đối không có I/O ngoài, mạng hay đồng hồ hệ thống.
const code = lessons
  .flatMap((lesson) => [
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.parsons.lines.join('\n'),
    lesson.make.starterCode,
    lesson.make.sampleSolution,
  ])
  .join('\n')

/** Từ vựng quyết định đã chốt ở ③ của đặc tả — output nào ngoài danh sách này là lệch hợp đồng. */
const QUYET_DINH = [
  'allow',
  'deny',
  'reject',
  'invalid',
  'unknown',
  'clamp',
  'migrate',
  'match',
  'mismatch',
  'hit',
  'miss',
  'unreachable',
]

describe('game-s1 + game-s2 — vòng lặp, toán, cảm giác chơi, ECS, vật lý, AI, công cụ', () => {
  it('có tám unit, mười sáu lesson Python cùng Make visible, hidden và ca âm', () => {
    expect(lessons).toHaveLength(16)
    for (const unitId of UNIT_IDS) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
      // Ca âm: ít nhất một ca rơi vào nhánh fail closed `invalid:`.
      expect(
        lesson.make.testCases.some((testCase) => testCase.expected.startsWith('invalid:')),
        `${lesson.id} thiếu ca âm invalid`,
      ).toBe(true)
    }
  })

  it('mọi output của Make dùng đúng từ vựng quyết định đã chốt', () => {
    for (const lesson of lessons) {
      for (const testCase of lesson.make.testCases) {
        const decision = testCase.expected.split(':', 1)[0]
        expect(QUYET_DINH, `${lesson.id}: quyết định lạ "${decision}"`).toContain(decision)
      }
    }
  })

  it('khoá marker của hai chặng: dt, coyote, AABB, fixed timestep, hash, tầm quan sát, A*, seed', () => {
    for (const marker of [
      'delta time',
      'dt',
      'coyote',
      'aabb',
      'fixed timestep',
      'hash',
      'tầm quan sát',
      'a*',
      'seed',
      'thành phần',
    ]) {
      expect(evidence, `thiếu marker: ${marker}`).toContain(marker)
    }
  })

  it('không mạng, file, subprocess, đồng hồ hệ thống hay engine thật trong code chạy được', () => {
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|datetime\.now|time\.time|import\s+(os|sys|time)\b|pygame|godot|unity|pyglet|OpenGL/i,
    )
  })

  it('ngẫu nhiên chỉ được đi qua bộ sinh cục bộ random.Random(seed)', () => {
    // Bộ sinh toàn cục làm nội dung thủ tục không tái lập được — cấm tuyệt đối.
    expect(code).not.toMatch(/random\.seed\(|random\.random\(|random\.randrange\(|random\.choice\(/)
    // Chỉ `p6-u249` được phép chạm tới module random, và phải qua random.Random(...).
    for (const lesson of lessons) {
      const lessonCode = [
        lesson.workedExample.code,
        lesson.predict.code,
        lesson.make.starterCode,
        lesson.make.sampleSolution,
      ].join('\n')
      if (/\brandom\b/.test(lessonCode)) {
        expect(lesson.unitId, `${lesson.id} dùng random ngoài unit được phép`).toBe('p6-u249')
        expect(lessonCode, `${lesson.id} phải dùng bộ sinh cục bộ`).toContain('random.Random(')
      }
    }
  })

  it('mọi lesson mang nhãn MÔ PHỎNG và không tự nhận là engine hay profiler thật', () => {
    for (const lesson of lessons) {
      expect(
        `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`,
        `${lesson.id} thiếu nhãn MÔ PHỎNG`,
      ).toContain('MÔ PHỎNG')
    }
    for (const cam of ['engine thật của bạn', 'profiler thật', 'đo fps thật trong sandbox']) {
      expect(prose, `cụm từ cấm: ${cam}`).not.toContain(cam)
    }
  })

  it('mỗi unit có bài tập về nhà trỏ ra artifact NGOÀI sandbox', () => {
    for (const lesson of lessons) {
      expect(lesson.homework, `${lesson.id} thiếu mốc ngoài sandbox`).toContain('Ngoài sandbox')
    }
    const homework = lessons.map((lesson) => lesson.homework).join('\n')
    expect(homework).toMatch(/Godot|Unity/)
  })

  it('game-s2-m3: AI không có nhánh nào đọc được dữ liệu ngoài tầm quan sát', () => {
    const baiTamQuanSat = lessons.find((lesson) => lesson.id === 'p6-u248-l1')
    expect(baiTamQuanSat, 'thiếu bài tầm quan sát').toBeDefined()
    const caDeny = (baiTamQuanSat?.make.testCases ?? []).filter((testCase) =>
      testCase.expected.startsWith('deny:'),
    )
    expect(caDeny.length, 'thiếu ca chặn AI đọc trộm').toBeGreaterThan(0)
    for (const testCase of caDeny) {
      expect(testCase.expected).toContain('ngoai tam quan sat')
    }
  })

  it('game-s2-m2: phát lại lệch hash là mismatch, không được coi là nhiễu bỏ qua', () => {
    const baiReplay = lessons.find((lesson) => lesson.id === 'p6-u247-l2')
    expect(baiReplay, 'thiếu bài phát lại').toBeDefined()
    const caReplay = baiReplay?.make.testCases ?? []
    expect(caReplay.some((testCase) => testCase.expected.startsWith('match:'))).toBe(true)
    expect(caReplay.some((testCase) => testCase.expected.startsWith('mismatch:'))).toBe(true)
  })

  it('không nhân bản hợp đồng của các hướng đã có bài (devops, data, security)', () => {
    expect(evidence).not.toMatch(/burn rate|sbom|golden path|k-anonymity|legal basis/)
  })
})
