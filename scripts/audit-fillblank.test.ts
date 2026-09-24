// S05 — test script audit ngoại tuyến (thiết kế manifest §7). Không mạng, không provider.
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { FillBlankQuestion } from '../apps/dhcb/src/pages/learning/practice/fillBlankQuestions'
import {
  InputError,
  loadDataset,
  parseArgs,
  runAudit,
  selectSamples,
  type GitInfo,
  type RunOptions,
} from './audit-fillblank'

const repoRoot = resolve(__dirname, '..')
const cleanGit: GitInfo = {
  sourceCommit: 'abc',
  builderCommit: 'def',
  dirtyPaths: [],
  isTracked: () => true,
}
const dirs: string[] = []
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true })
})

const entry = (word: string, vi: string, ex_en: string, ex_vi: string, extra: object = {}) => ({
  word,
  vi,
  pos: 'n',
  ex_en,
  ex_vi,
  ...extra,
})

function makeDict(chunks: Record<string, unknown>) {
  const root = mkdtempSync(join(tmpdir(), 's05-audit-'))
  dirs.push(root)
  const dict = join(root, 'dict')
  mkdirSync(dict)
  for (const [name, content] of Object.entries(chunks)) {
    writeFileSync(join(dict, name), typeof content === 'string' ? content : JSON.stringify(content))
  }
  return { root, dictRel: relative(repoRoot, dict) }
}

const words = ['apple', 'river', 'window', 'garden', 'pencil', 'mountain', 'teacher', 'orange']
const vis = [
  'quả táo',
  'dòng sông',
  'cửa sổ',
  'khu vườn',
  'bút chì',
  'ngọn núi',
  'giáo viên',
  'quả cam',
]
const good = words.map((w, i) =>
  entry(w, vis[i]!, `I see the ${w} today.`, `Tôi thấy ${vis[i]} hôm nay.`),
)

function run(chunks: Record<string, unknown>, extra: Partial<RunOptions> = {}) {
  const { root, dictRel } = makeDict(chunks)
  const out = join(root, 'out')
  const result = runAudit({
    directions: ['A', 'B'],
    samples: 3,
    seed: 't',
    out,
    repoRoot,
    command: 'test',
    git: cleanGit,
    dictRel,
    now: () => 'T',
    ...extra,
  })
  return { ...result, out, root, dictRel }
}

describe('parseArgs', () => {
  it('mặc định both/20, bắt buộc seed và out', () => {
    expect(parseArgs(['--seed', 's', '--out', 'o'])).toMatchObject({
      directions: ['A', 'B'],
      samples: 20,
    })
    expect(() => parseArgs(['--out', 'o'])).toThrow(InputError)
    expect(() => parseArgs(['--seed', 's', '--out', 'o', '--x', '1'])).toThrow(InputError)
    expect(() => parseArgs(['--seed', 's', '--out', 'o', '--samples', '0'])).toThrow(InputError)
    expect(() => parseArgs(['--seed', 's', '--out', 'https://x'])).toThrow(InputError)
  })
})

describe('loadDataset', () => {
  it('thứ tự file theo code-unit, ref chunk#index, digest đổi khi input đổi', () => {
    const a = makeDict({ 'chunk-010.json': [good[0]], 'chunk-002.json': [good[1], good[2]] })
    const d = loadDataset(repoRoot, a.dictRel)
    expect(d.refs).toEqual([
      `${a.dictRel}/chunk-002.json#0`,
      `${a.dictRel}/chunk-002.json#1`,
      `${a.dictRel}/chunk-010.json#0`,
    ])
    const b = makeDict({ 'chunk-010.json': [good[0]], 'chunk-002.json': [good[1], good[3]] })
    expect(loadDataset(repoRoot, b.dictRel).datasetDigest).not.toBe(d.datasetDigest)
  })
  it('JSON sai / top-level không phải mảng → InputError (exit 2)', () => {
    expect(() => loadDataset(repoRoot, makeDict({ 'chunk-000.json': '{bad' }).dictRel)).toThrow(
      InputError,
    )
    expect(() => loadDataset(repoRoot, makeDict({ 'chunk-000.json': { a: 1 } }).dictRel)).toThrow(
      InputError,
    )
  })
})

describe('runAudit', () => {
  it('đối soát mỗi lý do, entry lỗi thành invalid_entry, WAITING chuyên môn', () => {
    const { exitCode, summary, out } = run({
      'chunk-000.json': [null, entry('cat', 'mèo', 'A cat and a cat.', 'Mèo.'), ...good],
    })
    expect(exitCode).toBe(0)
    const c = summary.canonical as {
      technical: { status: string }
      directions: Record<
        string,
        { counts: Record<string, number>; reconciled: boolean; totalEntries: number }
      >
      releaseStatus: string
    }
    expect(c.technical.status).toBe('PASS')
    expect(c.releaseStatus).toBe('WAITING')
    expect(c.directions.A!.counts.invalid_entry).toBe(1)
    expect(c.directions.A!.counts.multiple_spans).toBe(1)
    expect(c.directions.A!.counts.accepted).toBe(8)
    expect(c.directions.A!.reconciled).toBe(true)
    const manifest = JSON.parse(readFileSync(join(out, 'review-manifest.json'), 'utf8'))
    expect(manifest.directions.A.accepted).toHaveLength(3)
    expect(manifest.directions.A.accepted[0].expert.status).toBe('WAITING_EXPERT_REVIEW')
    expect(
      manifest.directions.A.rejected.map((r: { primaryReason: string }) => r.primaryReason).sort(),
    ).toEqual(['invalid_entry', 'multiple_spans'])
    const lines = readFileSync(join(out, 'candidates.jsonl'), 'utf8').trim().split('\n')
    expect(lines).toHaveLength(2 * 10)
  })
  it('không ghi đè output đã có', () => {
    const { root, dictRel } = makeDict({ 'chunk-000.json': good })
    const out = join(root, 'out')
    mkdirSync(out)
    writeFileSync(join(out, 'old.txt'), 'x')
    expect(() =>
      runAudit({
        directions: ['A'],
        samples: 3,
        seed: 't',
        out,
        repoRoot,
        command: 't',
        git: cleanGit,
        dictRel,
      }),
    ).toThrow(InputError)
  })
  it('xác định: hai lần chạy cùng input cho payload canonical giống hệt (bỏ timestamp)', () => {
    const { root, dictRel } = makeDict({
      'chunk-001.json': good.slice(4),
      'chunk-000.json': good.slice(0, 4),
    })
    const once = (out: string, now: string) =>
      runAudit({
        directions: ['A', 'B'],
        samples: 3,
        seed: 't',
        out: join(root, out),
        repoRoot,
        command: 'test',
        git: cleanGit,
        dictRel,
        now: () => now,
      }).summary
    const a = once('o1', 'T1')
    const b = once('o2', 'T2')
    expect(a.generatedAt).not.toBe(b.generatedAt)
    expect(JSON.stringify(a.canonical)).toBe(JSON.stringify(b.canonical))
    expect(readFileSync(join(root, 'o1', 'review-manifest.json'), 'utf8')).toBe(
      readFileSync(join(root, 'o2', 'review-manifest.json'), 'utf8'),
    )
    // Lần chạy thứ ba vẫn cho đúng payload đó.
    expect(JSON.stringify(once('o3', 'T3').canonical)).toBe(JSON.stringify(a.canonical))
  })
  it('B dưới số mẫu yêu cầu → WAITING_B_COVERAGE, không bù bằng mẫu giả', () => {
    const { summary } = run({ 'chunk-000.json': good }, { samples: 20 })
    const c = summary.canonical as {
      directions: Record<string, { sampleShortfall: number; expertStatus: string }>
    }
    expect(c.directions.B!.sampleShortfall).toBe(12)
    expect(c.directions.B!.expertStatus).toBe('WAITING_B_COVERAGE')
  })
  it('input chưa commit → technical FAIL (exit 1)', () => {
    const r = run({ 'chunk-000.json': good }, { git: { ...cleanGit, dirtyPaths: ['x'] } })
    expect(r.exitCode).toBe(1)
  })
  it('fixture: ref không tồn tại/trùng/chưa track bị từ chối; hợp lệ thì báo phiên', () => {
    const { root, dictRel } = makeDict({ 'chunk-000.json': good })
    const refs = good.map((_, i) => `${dictRel}/chunk-000.json#${i}`)
    const write = (name: string, body: unknown) => {
      const p = join(root, name)
      writeFileSync(p, JSON.stringify(body))
      return p
    }
    const base = { samples: 3, seed: 't', repoRoot, command: 't', dictRel }
    const opt = (fx: string, out: string, git = cleanGit) => ({
      ...base,
      directions: ['A', 'B'] as ('A' | 'B')[],
      out: join(root, out),
      poolFixture: fx,
      git,
    })
    // Fixture ngoài repo (tmp) → bị từ chối vì phải nằm trong repo.
    expect(() => runAudit(opt(write('f.json', { entryRefs: refs }), 'o1'))).toThrow(/trong repo/)
    // Fixture trong repo (thư mục tạm bị git bỏ qua trong node_modules).
    const inRepo = mkdtempSync(join(repoRoot, 'node_modules', '.s05-fixture-'))
    dirs.push(inRepo)
    const fx = (name: string, body: unknown) => {
      const p = join(inRepo, name)
      writeFileSync(p, JSON.stringify(body))
      return p
    }
    expect(() => runAudit(opt(fx('a.json', { entryRefs: ['nope#0'] }), 'o2'))).toThrow(
      /không tồn tại/,
    )
    expect(() => runAudit(opt(fx('b.json', { entryRefs: [refs[0], refs[0]] }), 'o3'))).toThrow(
      /trùng/,
    )
    expect(() => runAudit(opt(fx('c.json', { entryRefs: refs, uid: 'x' }), 'o4'))).toThrow(
      /không cho phép/,
    )
    const untracked = { ...cleanGit, isTracked: () => false }
    expect(() => runAudit(opt(fx('d.json', { entryRefs: refs }), 'o5', untracked))).toThrow(/track/)
    const ok = runAudit(opt(fx('e.json', { entryRefs: refs.slice(0, 5) }), 'o6'))
    const c = ok.summary.canonical as {
      poolFixture: {
        directions: Record<string, { accepted: number; session: string; sessionLength: number }>
      }
    }
    expect(c.poolFixture.directions.A).toMatchObject({
      accepted: 5,
      session: 'short',
      sessionLength: 5,
    })
    const small = runAudit(opt(fx('g.json', { entryRefs: refs.slice(0, 3) }), 'o7'))
    const cs = small.summary.canonical as typeof c
    // 3 entry: mỗi câu chỉ có 2 distractor → không câu nào hợp lệ → phiên rỗng, không chấm 0.
    expect(cs.poolFixture.directions.B).toMatchObject({
      accepted: 0,
      session: 'empty',
      sessionLength: 0,
    })
  })
})

describe('selectSamples — strata', () => {
  const q = (ref: string, answer: string, formOnly = false): FillBlankQuestion => ({
    ref,
    direction: 'A',
    targetLang: 'en',
    sourceWord: answer,
    sentence: answer,
    span: { start: 0, end: answer.length },
    answer,
    prefix: '',
    suffix: '',
    options: [],
    correctOptionId: '',
    formOnly,
  })
  it('ưu tiên form_only rồi multiword; thiếu strata ghi shortfall; 19/20/21', () => {
    const pool = Array.from({ length: 21 }, (_, i) =>
      q(`r${i}`, i === 5 ? 'ice cream' : `w${i}`, i === 7),
    )
    const s = selectSamples(pool, 'A', 'x', 20)
    expect(s.picked).toHaveLength(20)
    expect(s.picked[0]!.ref).toBe('r7')
    expect(s.picked[1]!.ref).toBe('r5')
    expect(s.stratumShortfall).toEqual({ form_only: 1, multiword: 1 })
    expect(selectSamples(pool.slice(0, 19), 'A', 'x', 20).sampleShortfall).toBe(1)
    expect(selectSamples(pool.slice(0, 20), 'A', 'x', 20).sampleShortfall).toBe(0)
    expect(new Set(s.picked.map((p) => p.ref)).size).toBe(20)
  })
})
