import { describe, expect, it } from 'vitest'
import { P6U198_LESSONS } from './lessons/p6u198.js'
import { P6U199_LESSONS } from './lessons/p6u199.js'
import { P6U200_LESSONS } from './lessons/p6u200.js'
import { P6U201_LESSONS } from './lessons/p6u201.js'

const lessons = [...P6U198_LESSONS, ...P6U199_LESSONS, ...P6U200_LESSONS, ...P6U201_LESSONS]
const evidence = lessons
  .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Mọi phần văn xuôi — dùng để kiểm luật "nhắc tên công cụ thì phải kèm lối thoát".
const prose = lessons
  .map((lesson) => `${lesson.title}\n${lesson.hook}\n${lesson.theory}\n${lesson.homework}`)
  .join('\n')
  .toLocaleLowerCase('vi')

// Code CHẠY ĐƯỢC của bài học — nơi tuyệt đối không được có I/O ngoài hay tên vendor.
const code = lessons
  .flatMap((lesson) => [
    lesson.workedExample.code,
    lesson.predict.code,
    lesson.parsons.lines.join('\n'),
    lesson.make.starterCode,
    lesson.make.sampleSolution,
  ])
  .join('\n')

describe('devops-s4 — nền tảng nội bộ, chuỗi cung ứng, phục vụ mô hình và văn hoá vận hành', () => {
  it('có bốn unit, tám lesson Python cùng Make visible, hidden và ca âm', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u198', 'p6-u199', 'p6-u200', 'p6-u201']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
      // Ca âm/biên: ít nhất một ca kết thúc ở nhánh fail closed.
      expect(
        lesson.make.testCases.some((testCase) =>
          /^(invalid|deny|reject|unknown|incomplete|rotate)/.test(testCase.expected),
        ),
      ).toBe(true)
    }
  })

  it('khoá golden path, dora, sbom, signature, provenance, digest, rotate, kv cache, quantization, gpu, cascade, fallback, cost-per-success, ttft, span, postmortem và toil', () => {
    for (const marker of [
      'golden path',
      'dora',
      'sbom',
      'signature',
      'provenance',
      'digest',
      'rotate',
      'kv cache',
      'quantization',
      'gpu',
      'cascade',
      'fallback',
      'cost-per-success',
      'ttft',
      'span',
      'postmortem',
      'toil',
    ]) {
      expect(evidence, `thiếu marker: ${marker}`).toContain(marker)
    }
  })

  it('không gọi cluster, gpu, model server, shell hay external I/O', () => {
    expect(code).not.toMatch(
      /\bopen\(|\bsubprocess\b|\brequests\b|\bsocket\b|\brandom\b|datetime\.now|import\s+(os|sys)\b|kubectl|helm\s|prometheus/i,
    )
  })

  it('không khoá vendor: tên máy chủ mô hình không nằm trong code chạy được', () => {
    for (const vendor of ['vllm', 'tgi', 'triton', 'ollama']) {
      expect(code.toLocaleLowerCase('vi'), `vendor ${vendor} lọt vào code chạy được`).not.toContain(
        vendor,
      )
      // Nếu văn xuôi có nhắc tên công cụ thì phải kèm lối thoát "có thể thay bằng".
      if (prose.includes(vendor)) {
        expect(prose, `nhắc ${vendor} mà thiếu lối thoát`).toContain('có thể thay bằng')
      }
    }
  })

  it('không tuyên bố simulator là phép đo phần cứng, hoá đơn thật hay cam kết độ trễ', () => {
    for (const cam of ['benchmark', 'hoá đơn cloud', 'hóa đơn cloud', 'cam kết độ trễ']) {
      expect(prose, `cụm từ cấm: ${cam}`).not.toContain(cam)
    }
  })

  it('không nhân bản hợp đồng agent runtime / tool-loop của ai-s4', () => {
    expect(evidence).not.toMatch(/tool-loop|tool loop|agent runtime|ngân sách vòng lặp/)
  })
})
