import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { checkSpecFile, checkPlanFileLocks, SPEC_DIR } from './protocol-check'

// Việc hiện tại (0384+) chưa có spec THẬT nào tự khai `Trạng thái: **XXX**` — protocol còn mới
// (2026-09-19). Test này canh script không bị vỡ khi ai đó bắt đầu dùng, và canh 124 spec cũ
// (không có dòng đó) luôn được coi là hợp lệ — không bị cổng CI mới này chặn oan.

const SPEC_READY_MINIMAL = `
> Trạng thái: **SPEC_READY**

\`\`\`yaml
feature:
  id: TEST_001
  name: Test feature
  pillar: learning
goal:
  user: student
  objective: test_objective
scope:
  include: [a]
  exclude: [b]
user_flow: [start, end]
states: [loading, success]
ai_calls:
  needed: false
  cached: false
  daily_limit_counted: false
acceptance_criteria:
  - id: AC01
    text: something
    proof: npm test -- x
risk: normal
design_spec: n/a
\`\`\`
`

describe('protocol-check — spec cũ (chưa tham gia protocol)', () => {
  it('không có dòng "Trạng thái:" → luôn hợp lệ, không báo vi phạm', () => {
    const legacy = '# Đặc tả cũ\n\nKhông có header trạng thái nào ở đây.'
    expect(checkSpecFile('legacy.md', legacy)).toEqual([])
  })

  it('124 spec thật hiện có trong docs/specs/ đều đạt (không có Trạng thái: vô nghĩa)', () => {
    const files = readdirSync(SPEC_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
    expect(files.length).toBeGreaterThan(50)
    const violations = files.flatMap((f) =>
      checkSpecFile(`docs/specs/${f}`, readFileSync(join(SPEC_DIR, f), 'utf8')),
    )
    expect(violations).toEqual([])
  })
})

describe('protocol-check — spec MỚI tự khai trạng thái', () => {
  it('trạng thái không nằm trong §2 → vi phạm', () => {
    const v = checkSpecFile('x.md', '> Trạng thái: **BOGUS**\n')
    expect(v).toHaveLength(1)
    expect(v[0]!.message).toMatch(/không hợp lệ/)
  })

  it('SPEC_READY đủ khối feature: hợp lệ → 0 vi phạm', () => {
    expect(checkSpecFile('x.md', SPEC_READY_MINIMAL)).toEqual([])
  })

  it('SPEC_READY nhưng thiếu khối feature: → vi phạm', () => {
    const v = checkSpecFile('x.md', '> Trạng thái: **SPEC_READY**\n')
    expect(v).toHaveLength(1)
    expect(v[0]!.message).toMatch(/thiếu khối `feature:`/)
  })

  it('khối feature: thiếu trường bắt buộc (acceptance_criteria rỗng) → invalid', () => {
    const broken = SPEC_READY_MINIMAL.replace(
      'acceptance_criteria:\n  - id: AC01\n    text: something\n    proof: npm test -- x\n',
      'acceptance_criteria: []\n',
    )
    const v = checkSpecFile('x.md', broken)
    expect(v.some((x) => x.message.includes('sai schema §3.1'))).toBe(true)
  })

  it('design_spec: required + DESIGN_READY nhưng thiếu mục ⑦ → vi phạm', () => {
    const withDesignRequired = SPEC_READY_MINIMAL.replace(
      'design_spec: n/a',
      'design_spec: required',
    ).replace('**SPEC_READY**', '**DESIGN_READY**')
    const v = checkSpecFile('x.md', withDesignRequired)
    expect(v.some((x) => x.message.includes('DESIGN_SPEC'))).toBe(true)
  })

  it('DONE nhưng thiếu khối doc_delta: → vi phạm', () => {
    const done = SPEC_READY_MINIMAL.replace('**SPEC_READY**', '**DONE**')
    const v = checkSpecFile('x.md', done)
    expect(v.some((x) => x.message.includes('doc_delta'))).toBe(true)
  })

  it('DONE với doc_delta.changelog trỏ file không tồn tại → vi phạm', () => {
    const done =
      SPEC_READY_MINIMAL.replace('**SPEC_READY**', '**DONE**') +
      '\n```yaml\ndoc_delta:\n  feature: TEST_001\n  pr: 1\n  changelog: docs/changelog/9999-khong-ton-tai.md\n  progress_md: "✗"\n  claude_md: "✗"\n  project_md: "✗"\n  adr: "✗"\n  specs: "✓"\n  ops_docs: "✗"\n  traps_md: "✗"\n```\n'
    const v = checkSpecFile('x.md', done)
    expect(v.some((x) => x.message.includes('không tồn tại'))).toBe(true)
  })

  it('PASS trở đi bắt buộc có khối qa: QA_REPORT', () => {
    const pass = SPEC_READY_MINIMAL.replace('**SPEC_READY**', '**PASS**')
    const v = checkSpecFile('x.md', pass)
    expect(v.some((x) => x.message.includes('QA_REPORT'))).toBe(true)
  })

  it('khối reject: thiếu owner → vi phạm ngay cả khi spec ở trạng thái NEW', () => {
    const content =
      '> Trạng thái: **NEW**\n\n```yaml\nreject:\n  from: qa\n  type: acceptance_criteria\n  ref: AC01\n  expected: a\n  actual: b\n  evidence: c\n```\n'
    const v = checkSpecFile('x.md', content)
    expect(v.some((x) => x.message.includes('reject'))).toBe(true)
  })
})

describe('protocol-check — PLAN.md khoá file & song song (§5.2)', () => {
  const plan = (tasksYaml: string) => `
\`\`\`yaml
plan:
  feature: TEST_001
  spec: docs/specs/2026-09-20-test.md
  branch: claude/test
tasks:
${tasksYaml}
\`\`\`
`
  const task = (id: string, files: string[], depends: string[] = []) => `
  - id: ${id}
    title: task ${id}
    route: standard
    owner_role: backend
    files:
      modify: [${files.join(', ')}]
      create: []
      forbidden: []
    depends_on: [${depends.join(', ')}]
    ac_refs: [AC01]
    status: pending`

  it('hai task đụng cùng file, không depends_on nhau → vi phạm', () => {
    const content = plan(task('T1', ['a.ts']) + task('T2', ['a.ts']))
    const v = checkPlanFileLocks(content)
    expect(v).toHaveLength(1)
    expect(v[0]!.message).toMatch(/T1.*T2|T2.*T1/)
  })

  it('hai task đụng cùng file NHƯNG có depends_on → hợp lệ (chạy tuần tự, không phải song song)', () => {
    const content = plan(task('T1', ['a.ts']) + task('T2', ['a.ts'], ['T1']))
    expect(checkPlanFileLocks(content)).toEqual([])
  })

  it('hai task file rời nhau → hợp lệ', () => {
    const content = plan(task('T1', ['a.ts']) + task('T2', ['b.ts']))
    expect(checkPlanFileLocks(content)).toEqual([])
  })
})
