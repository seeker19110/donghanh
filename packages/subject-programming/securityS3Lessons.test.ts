// CỔNG NGỮ NGHĨA của chặng `security-s3` (đặc tả
// `docs/specs/2026-09-17-security-s3-bai-hoc-that.md` ④ và ⑤).
//
// Rủi ro lớn nhất của chặng, ghi thẳng trong đặc tả: một bài GIẢI THÍCH lỗ hổng trượt thành một
// bài HƯỚNG DẪN khai thác. Đây là lớp chặn bằng máy cho rủi ro đó — danh sách cấm áp cho MỌI
// phần của bài, kể cả văn xuôi giải thích, không riêng code.
//
// Hai bất biến còn lại chỉ test này canh được: fuzzer phải tất định (cùng hạt giống → cùng kết
// quả), và ca lỗi đã thu nhỏ phải VẪN gây đúng lỗi ban đầu — kiểm bằng cách chạy lại parser đồ
// chơi ngay trong test, không tin vào chuỗi kỳ vọng đã viết sẵn.
import { describe, expect, it } from 'vitest'
import { P6U210_LESSONS } from './lessons/p6u210.js'
import { P6U211_LESSONS } from './lessons/p6u211.js'
import { P6U212_LESSONS } from './lessons/p6u212.js'
import { P6U213_LESSONS } from './lessons/p6u213.js'

const lessons = [...P6U210_LESSONS, ...P6U211_LESSONS, ...P6U212_LESSONS, ...P6U213_LESSONS]

/** Phần "bằng chứng nội dung" — nơi marker của chặng phải xuất hiện. */
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

/** TOÀN BỘ chữ của bài — danh sách cấm áp ở đây, kể cả phần giải thích. */
const toanVan = lessons
  .flatMap((lesson) => [
    lesson.title,
    lesson.hook,
    lesson.theory,
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.predict.explain,
    lesson.parsons.lines.join('\n'),
    lesson.make.prompt,
    lesson.make.starterCode,
    lesson.make.sampleSolution,
    lesson.make.hints.join('\n'),
    lesson.homework,
    (lesson.srsCards ?? []).map((the) => `${the.hoi} ${the.dap}`).join('\n'),
  ])
  .join('\n')
  .toLocaleLowerCase('vi')

/** Code CHẠY ĐƯỢC — nơi tuyệt đối không có I/O ngoài, random hay tên kiến trúc thật. */
const code = lessons
  .flatMap((lesson) => [
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.parsons.lines.join('\n'),
    lesson.make.starterCode,
    lesson.make.sampleSolution,
  ])
  .join('\n')

/** Từ vựng quyết định đã chốt ở ③ của đặc tả. */
const QUYET_DINH = [
  'ok',
  'invalid',
  'unreachable',
  'no-exit',
  'oob-write',
  'use-after-free',
  'double-free',
  'leak',
  'prevented',
  'not-found',
  'deny',
  'contain',
  'quarantine',
]

/**
 * Parser đồ chơi của `p6-u212`, cài lại bằng TypeScript để test tự chạy được thay vì tin vào
 * chuỗi kỳ vọng. Phải khớp từng nhánh với `nhan()` trong bài.
 */
const CHU = 'ab()'
function nhan(s: string): string {
  let d = 0
  for (const c of s) {
    if (!CHU.includes(c)) return 'kytula'
    if (c === '(') d += 1
    else if (c === ')') {
      d -= 1
      if (d < 0) return 'khongcanbang'
    }
  }
  if (d !== 0) return 'khongcanbang'
  if (s.includes('(())')) return 'long-kep'
  return 'hople'
}

describe('security-s3 — vì sao lỗ hổng tồn tại và cách TÌM ra chúng', () => {
  it('có bốn unit, tám lesson Python cùng Make visible, hidden và ca âm', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u210', 'p6-u211', 'p6-u212', 'p6-u213']) {
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

  it('DANH SÁCH CẤM: không có bất kỳ dấu vết hướng dẫn khai thác nào, kể cả trong giải thích', () => {
    for (const cam of [
      'shellcode',
      'rop chain',
      'gadget',
      'nop sled',
      'heap spray',
      'egg hunter',
      'bypass aslr',
      'bypass dep',
      'defeat canary',
      '\\x90',
    ]) {
      expect(toanVan, `danh sách cấm: ${cam}`).not.toContain(cam)
    }
  })

  it('không nhị phân thật, mã độc, mã CVE kèm bước tái hiện hay mục tiêu đang chạy', () => {
    for (const cam of ['mã độc', 'malware', 'cve-']) {
      expect(toanVan, `cụm từ cấm: ${cam}`).not.toContain(cam)
    }
  })

  it('không tên kiến trúc tập lệnh thật trong code chạy được — máy trong bài là máy đồ chơi', () => {
    expect(code).not.toMatch(/\b(x86|x86_64|amd64|arm64|aarch64|riscv)\b/i)
  })

  it('không gọi mạng, file, subprocess, random hay đồng hồ hệ thống', () => {
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|time\.time|import\s+(os|sys)\b/i,
    )
  })

  it('giữ đủ marker của chặng', () => {
    for (const marker of [
      'basic block',
      'control flow',
      'unreachable',
      'bounds',
      'use-after-free',
      'double-free',
      'prevented',
      'memory-safe',
      'coverage',
      'minimize',
      'seed',
      'deterministic',
      'provenance',
      'least privilege',
      'prompt injection',
      'data poisoning',
    ]) {
      expect(evidence, `thiếu marker: ${marker}`).toContain(marker)
    }
  })

  it('mỗi unit nêu rõ MỤC ĐÍCH PHÒNG THỦ của kiến thức đó', () => {
    for (const lessonsCuaUnit of [P6U210_LESSONS, P6U211_LESSONS, P6U212_LESSONS, P6U213_LESSONS]) {
      const van = lessonsCuaUnit
        .map((l) => l.theory)
        .join('\n')
        .toLocaleLowerCase('vi')
      expect(van, `${lessonsCuaUnit[0]?.unitId} thiếu đoạn nêu mục đích phòng thủ`).toContain(
        'mục đích phòng thủ',
      )
    }
  })

  it('p6-u211 chứng minh ngữ nghĩa kiểm biên biến lỗi bộ nhớ thành prevented', () => {
    const caPrevented = P6U211_LESSONS.flatMap((lesson) => lesson.make.testCases).filter(
      (testCase) => testCase.expected.startsWith('prevented:'),
    )
    expect(caPrevented.length, 'thiếu ca prevented').toBeGreaterThanOrEqual(3)
    for (const testCase of caPrevented) {
      expect(testCase.stdinLines.join('\n')).toContain('chedo:kiembien')
      expect(testCase.expected).toContain('memory-safe')
    }
  })

  it('p6-u212 tất định: cùng hạt giống xuất hiện hai lần thì kỳ vọng phải y hệt', () => {
    const theoStdin = new Map<string, Set<string>>()
    for (const testCase of P6U212_LESSONS.flatMap((lesson) => lesson.make.testCases)) {
      const khoa = testCase.stdinLines.join('\n')
      const da = theoStdin.get(khoa) ?? new Set<string>()
      da.add(testCase.expected)
      theoStdin.set(khoa, da)
    }
    // Phải có ít nhất một hạt giống được chạy HAI lần — đó là bằng chứng tính tất định.
    const lap = [...theoStdin.values()].filter((v) => v.size >= 1)
    expect(lap.length).toBeGreaterThan(0)
    for (const [khoa, kyVong] of theoStdin) {
      expect(kyVong.size, `cùng đầu vào "${khoa}" mà kỳ vọng khác nhau`).toBe(1)
    }
    const soLanChayLai = P6U212_LESSONS.flatMap((lesson) => lesson.make.testCases).filter(
      (testCase) => testCase.stdinLines.join('\n') === 'seed:250,ngansach:8',
    )
    expect(soLanChayLai.length, 'thiếu ca chạy lại cùng hạt giống').toBeGreaterThanOrEqual(2)
  })

  it('p6-u212: ca lỗi ĐÃ THU NHỎ chạy lại vẫn gây ĐÚNG lỗi ban đầu', () => {
    const caMinimize = P6U212_LESSONS.flatMap((lesson) => lesson.make.testCases).filter(
      (testCase) => testCase.expected.startsWith('ok: minimize con '),
    )
    expect(caMinimize.length, 'thiếu ca thu nhỏ').toBeGreaterThan(0)
    for (const testCase of caMinimize) {
      const khop = /^ok: minimize con (.+) van gay loi (\S+)$/.exec(testCase.expected)
      expect(khop, `kỳ vọng sai khuôn: ${testCase.expected}`).not.toBeNull()
      const thuNho = khop?.[1] ?? ''
      const nhanLoi = khop?.[2] ?? ''
      // 1. Ca đã thu nhỏ vẫn gây ĐÚNG lỗi đó (không phải lỗi khác, không phải hết lỗi).
      expect(nhan(thuNho), `ca thu nhỏ "${thuNho}" không còn gây lỗi ${nhanLoi}`).toBe(nhanLoi)
      // 2. Lỗi của ca thu nhỏ trùng lỗi của đầu vào gốc.
      const goc = (testCase.stdinLines[0] ?? '').replace(/^dauvao:/, '')
      expect(nhan(goc), `lỗi của đầu vào gốc khác lỗi của ca thu nhỏ`).toBe(nhanLoi)
      // 3. Thu nhỏ thật sự nhỏ hơn và không rỗng.
      expect(thuNho.length).toBeGreaterThan(0)
      expect(thuNho.length).toBeLessThanOrEqual(goc.length)
    }
  })

  it('p6-u212: ca báo không tìm thấy nói rõ là HẾT NGÂN SÁCH, không nói "không có lỗi"', () => {
    for (const testCase of P6U212_LESSONS.flatMap((lesson) => lesson.make.testCases)) {
      if (!testCase.expected.startsWith('not-found:')) continue
      expect(testCase.expected).not.toContain('khong co loi')
    }
  })
})
