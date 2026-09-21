// Cổng ngữ nghĩa cho hướng GAME chặng S3 + S4 (đặc tả
// `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`). Hai bất biến nặng nhất của lát cắt này:
// `game-s4-m1` server luôn là bên quyết định (không nhánh nào để client tự áp dụng), và không
// bài nào tự nhận mình đang chạy engine / GPU / profiler thật.
import { describe, expect, it } from 'vitest'
import { P6U250_LESSONS } from './lessons/p6u250.js'
import { P6U251_LESSONS } from './lessons/p6u251.js'
import { P6U252_LESSONS } from './lessons/p6u252.js'
import { P6U253_LESSONS } from './lessons/p6u253.js'
import { P6U254_LESSONS } from './lessons/p6u254.js'
import { P6U255_LESSONS } from './lessons/p6u255.js'
import { P6U256_LESSONS } from './lessons/p6u256.js'
import { P6U257_LESSONS } from './lessons/p6u257.js'

const lessons = [
  ...P6U250_LESSONS,
  ...P6U251_LESSONS,
  ...P6U252_LESSONS,
  ...P6U253_LESSONS,
  ...P6U254_LESSONS,
  ...P6U255_LESSONS,
  ...P6U256_LESSONS,
  ...P6U257_LESSONS,
]

const UNIT_IDS = [
  'p6-u250',
  'p6-u251',
  'p6-u252',
  'p6-u253',
  'p6-u254',
  'p6-u255',
  'p6-u256',
  'p6-u257',
]

// Phần "bằng chứng nội dung" — nơi marker của hai chặng phải xuất hiện.
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Mọi văn xuôi — dùng cho luật cấm tự nhận là engine/GPU/profiler thật.
const prose = lessons
  .map((lesson) => `${lesson.title}\n${lesson.hook}\n${lesson.theory}\n${lesson.homework}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Code CHẠY ĐƯỢC — nơi tuyệt đối không có I/O ngoài, mạng thật hay đồng hồ hệ thống.
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
  'refuse',
  'invalid',
  'unknown',
  'clamp',
  'cull',
  'render',
  'exceed',
  'blocked',
  'pass',
  'overflow',
]

describe('game-s3 + game-s4 — dựng hình, shader, hiệu năng, 3D, mạng, công cụ, số liệu, phát hành', () => {
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

  it('khoá marker: draw call, ngân sách, LOD, quaternion, sequence, server, chống gian lận, bỏ cuộc, bản địa hoá', () => {
    for (const marker of [
      'draw call',
      'ngân sách',
      'lod',
      'quaternion',
      'sequence',
      'server',
      'chống gian lận',
      'bỏ cuộc',
      'bản địa hoá',
    ]) {
      expect(evidence, `thiếu marker: ${marker}`).toContain(marker)
    }
  })

  it('không mạng thật, file, subprocess, đồng hồ hệ thống hay thư viện engine trong code chạy được', () => {
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|time\.time|import\s+(os|sys|time)\b|pygame|pyglet|OpenGL|moderngl/i,
    )
  })

  it('mọi lesson mang nhãn MÔ PHỎNG và không tự nhận là engine, GPU hay profiler thật', () => {
    for (const lesson of lessons) {
      expect(
        `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`,
        `${lesson.id} thiếu nhãn MÔ PHỎNG`,
      ).toContain('MÔ PHỎNG')
    }
    for (const cam of [
      'profiler thật của bài',
      'chạy trên gpu thật',
      'engine thật trong sandbox',
      'mạng thật trong sandbox',
    ]) {
      expect(prose, `cụm từ cấm: ${cam}`).not.toContain(cam)
    }
  })

  it('mỗi lesson có bài tập về nhà trỏ ra artifact NGOÀI sandbox', () => {
    for (const lesson of lessons) {
      expect(lesson.homework, `${lesson.id} thiếu mốc ngoài sandbox`).toContain('Ngoài sandbox')
    }
    const homework = lessons.map((lesson) => lesson.homework).join('\n')
    expect(homework).toMatch(/Godot|Unity|server/)
  })

  it('game-s4-m1: server luôn quyết, không nhánh nào để client tự áp dụng trạng thái', () => {
    const mang = lessons.filter((lesson) => lesson.unitId === 'p6-u254')
    expect(mang).toHaveLength(2)
    for (const lesson of mang) {
      for (const testCase of lesson.make.testCases) {
        const decision = testCase.expected.split(':', 1)[0]
        expect(
          ['allow', 'deny', 'reject', 'invalid'],
          `${lesson.id}: quyết định mạng phải do server đưa ra`,
        ).toContain(decision)
      }
      // Không được có nhánh nào hứa client tự áp dụng rồi sửa sau.
      expect(lesson.make.sampleSolution).not.toMatch(/client.*(tu ap dung|tin tam)/i)
    }
    const chongGianLan = mang[1]?.make.testCases ?? []
    expect(
      chongGianLan.some((testCase) => testCase.expected.startsWith('deny:')),
      'thiếu ca chặn ý định vượt giới hạn vật lý',
    ).toBe(true)
  })

  it('game-s4-m3: mẫu dưới ngưỡng trả unknown và không kèm con số tỉ lệ nào', () => {
    const caUnknown = P6U256_LESSONS.flatMap((lesson) => lesson.make.testCases).filter((testCase) =>
      testCase.expected.startsWith('unknown:'),
    )
    expect(caUnknown.length, 'thiếu ca mẫu dưới ngưỡng tối thiểu').toBeGreaterThan(0)
    for (const testCase of caUnknown) {
      // Nêu một con số ở đây là đã kết luận thứ vừa nói là chưa kết luận được.
      expect(testCase.expected, 'ca unknown vẫn để lọt con số').not.toMatch(/\d/)
    }
  })

  it('game-s4-m3: có ca từ chối cơ chế kiếm tiền khớp tiêu chí gây áp lực', () => {
    const caRefuse = P6U256_LESSONS.flatMap((lesson) => lesson.make.testCases).filter((testCase) =>
      testCase.expected.startsWith('refuse:'),
    )
    expect(caRefuse.length, 'thiếu ca từ chối cơ chế bóc lột').toBeGreaterThan(0)
  })

  it('không nhân bản hợp đồng của các hướng đã có bài (devops, data, security)', () => {
    expect(evidence).not.toMatch(/burn rate|sbom|golden path|k-anonymity|legal basis/)
  })
})
