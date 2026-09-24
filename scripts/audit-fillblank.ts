// scripts/audit-fillblank.ts — S05: audit NGOẠI TUYẾN bộ tạo câu điền từ trên toàn từ điển public.
//
// Thiết kế: docs/specs/2026-09-23-s05-offline-audit-manifest.md (§2–§5).
// Dùng ĐÚNG builder runtime `apps/dhcb/src/pages/learning/practice/fillBlankQuestions.ts` — không
// viết luật match thứ hai. Không mạng, không provider, không dữ liệu người học.
//
//   npx tsx scripts/audit-fillblank.ts --direction both --samples 20 --seed s05-v1 --out <thư-mục-mới>
//   npx tsx scripts/audit-fillblank.ts ... --pool-fixture <file-public-đã-track.json>
//
// Mã thoát: 0 = audit kỹ thuật chạy hợp lệ (KHÔNG phải release pass — đọc trạng thái WAITING
// trong summary) · 1 = bất biến kỹ thuật sai · 2 = lỗi tham số/đầu vào/schema/IO.
// Output (không commit): summary.json, candidates.jsonl, review-manifest.json.

import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FILL_BLANK_REASONS,
  FILL_BLANK_RULE_VERSION,
  blankedSentence,
  buildFillBlankQuestions,
  checkQuestionInvariants,
  compareCodeUnit,
  rankKey,
  type FillBlankBuildResult,
  type FillBlankDirection,
  type FillBlankQuestion,
  type FillBlankReason,
} from '../apps/dhcb/src/pages/learning/practice/fillBlankQuestions.js'

export const SCHEMA_VERSION = 1
export const DICTIONARY_DIR = 'apps/dhcb/public/data/dictionary'
export const BUILDER_PATH = 'apps/dhcb/src/pages/learning/practice/fillBlankQuestions.ts'
export const SCRIPT_PATH = 'scripts/audit-fillblank.ts'
const STRATUM_QUOTA = 2
const REJECTED_PER_REASON = 2
const SESSION_SIZE = 8
const MIN_SESSION = 4
const WAITING = 'WAITING_EXPERT_REVIEW'

/** Lỗi đầu vào/tham số/IO → thoát mã 2. */
export class InputError extends Error {}

export interface AuditArgs {
  directions: FillBlankDirection[]
  samples: number
  seed: string
  out: string
  poolFixture?: string
}

export function parseArgs(argv: readonly string[]): AuditArgs {
  const map = new Map<string, string>()
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i]!
    const value = argv[i + 1]
    if (!key.startsWith('--') || value === undefined || value.startsWith('--')) {
      throw new InputError(`Tham số không hợp lệ gần "${key}"`)
    }
    if (map.has(key)) throw new InputError(`Tham số lặp: ${key}`)
    map.set(key, value)
    i++
  }
  const allowed = new Set(['--direction', '--samples', '--seed', '--out', '--pool-fixture'])
  for (const key of map.keys()) if (!allowed.has(key)) throw new InputError(`Tham số lạ: ${key}`)
  const direction = map.get('--direction') ?? 'both'
  if (!['A', 'B', 'both'].includes(direction)) throw new InputError('--direction phải là A|B|both')
  const samples = Number(map.get('--samples') ?? '20')
  if (!Number.isInteger(samples) || samples < 1 || samples > 1000) {
    throw new InputError('--samples phải là số nguyên 1..1000')
  }
  const seed = map.get('--seed')
  const out = map.get('--out')
  if (!seed) throw new InputError('Thiếu --seed')
  if (!out) throw new InputError('Thiếu --out')
  if (/^[a-z]+:\/\//i.test(out) || /^[a-z]+:\/\//i.test(map.get('--pool-fixture') ?? '')) {
    throw new InputError('Không nhận URL')
  }
  return {
    directions: direction === 'both' ? ['A', 'B'] : [direction as FillBlankDirection],
    samples,
    seed,
    out,
    poolFixture: map.get('--pool-fixture'),
  }
}

export const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex')
const shaRank = (key: string) => sha256(Buffer.from(key, 'utf8'))

export interface Dataset {
  files: { path: string; sha256: string }[]
  pool: unknown[]
  refs: string[]
  hashes: string[]
  datasetDigest: string
}

/** Đọc các chunk public, xếp tên file theo code-unit như loader; ref = `<đường dẫn>#<index0>`. */
export function loadDataset(repoRoot: string, dictRel = DICTIONARY_DIR): Dataset {
  const dir = join(repoRoot, dictRel)
  let names: string[]
  try {
    names = readdirSync(dir).filter((n) => /^chunk-.*\.json$/.test(n))
  } catch (err) {
    throw new InputError(`Không đọc được ${dictRel}: ${(err as Error).message}`)
  }
  names.sort(compareCodeUnit)
  if (names.length === 0) throw new InputError(`Không có chunk-*.json trong ${dictRel}`)
  const files: Dataset['files'] = []
  const pool: unknown[] = []
  const refs: string[] = []
  const hashes: string[] = []
  for (const name of names) {
    const path = `${dictRel}/${name}`
    const raw = readFileSync(join(dir, name))
    files.push({ path, sha256: sha256(raw) })
    let parsed: unknown
    try {
      parsed = JSON.parse(raw.toString('utf8'))
    } catch {
      throw new InputError(`${path}: JSON sai`)
    }
    if (!Array.isArray(parsed)) throw new InputError(`${path}: top-level phải là mảng`)
    parsed.forEach((entry, i) => {
      pool.push(entry)
      refs.push(`${path}#${i}`)
      hashes.push(sha256(JSON.stringify(entry) ?? 'undefined'))
    })
  }
  const datasetDigest = sha256(JSON.stringify(files.map((f) => [f.path, f.sha256])))
  return { files, pool, refs, hashes, datasetDigest }
}

/** Fixture pool học: chỉ `entryRefs` (+ `description`), không dữ liệu người học. */
export function loadPoolFixture(
  path: string,
  dataset: Dataset,
): { refs: string[]; sha256: string } {
  let raw: Buffer
  try {
    raw = readFileSync(path)
  } catch (err) {
    throw new InputError(`Không đọc được fixture: ${(err as Error).message}`)
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw.toString('utf8'))
  } catch {
    throw new InputError('Fixture: JSON sai')
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new InputError('Fixture phải là object { entryRefs: string[] }')
  }
  const obj = parsed as Record<string, unknown>
  const extra = Object.keys(obj).filter((k) => k !== 'entryRefs' && k !== 'description')
  if (extra.length > 0)
    throw new InputError(`Fixture có trường không cho phép: ${extra.join(', ')}`)
  const refs = obj.entryRefs
  if (!Array.isArray(refs) || refs.some((r) => typeof r !== 'string')) {
    throw new InputError('Fixture.entryRefs phải là mảng chuỗi')
  }
  const known = new Set(dataset.refs)
  const seen = new Set<string>()
  for (const ref of refs as string[]) {
    if (!known.has(ref)) throw new InputError(`Fixture ref không tồn tại: ${ref}`)
    if (seen.has(ref)) throw new InputError(`Fixture ref trùng: ${ref}`)
    seen.add(ref)
  }
  return { refs: refs as string[], sha256: sha256(raw) }
}

export type SampleTag = 'form_only' | 'multiword' | 'diacritics'

export function tagsOf(q: FillBlankQuestion): SampleTag[] {
  const tags: SampleTag[] = []
  if (q.formOnly) tags.push('form_only')
  if (/\s/u.test(q.answer)) tags.push('multiword')
  // Dấu tiếng Việt: NFD có dấu kết hợp, hoặc có chữ đ/Đ.
  if (q.direction === 'B' && /[̀-ͯđĐ]/u.test(q.answer.normalize('NFD'))) {
    tags.push('diacritics')
  }
  return tags
}

interface Ranked<T> {
  item: T
  ref: string
  rank: string
}

function byRank<T>(a: Ranked<T>, b: Ranked<T>) {
  return compareCodeUnit(a.rank, b.rank) || compareCodeUnit(a.ref, b.ref)
}

export function candidateRank(seed: string, direction: FillBlankDirection, ref: string): string {
  return shaRank(rankKey(seed, direction, ref))
}

/** §4: strata trước (A: form_only → multiword; B: diacritics → multiword), rồi điền theo rank. */
export function selectSamples(
  questions: readonly FillBlankQuestion[],
  direction: FillBlankDirection,
  seed: string,
  n: number,
): {
  picked: Ranked<FillBlankQuestion>[]
  stratumShortfall: Record<string, number>
  sampleShortfall: number
} {
  const ranked = questions
    .map((q) => ({ item: q, ref: q.ref, rank: candidateRank(seed, direction, q.ref) }))
    .sort(byRank)
  const strata: SampleTag[] =
    direction === 'A' ? ['form_only', 'multiword'] : ['diacritics', 'multiword']
  const chosen = new Set<string>()
  const picked: Ranked<FillBlankQuestion>[] = []
  const stratumShortfall: Record<string, number> = {}
  for (const tag of strata) {
    let got = 0
    for (const r of ranked) {
      if (got === STRATUM_QUOTA || picked.length === n) break
      if (chosen.has(r.ref) || !tagsOf(r.item).includes(tag)) continue
      chosen.add(r.ref)
      picked.push(r)
      got++
    }
    if (got < STRATUM_QUOTA) stratumShortfall[tag] = STRATUM_QUOTA - got
  }
  for (const r of ranked) {
    if (picked.length >= n) break
    if (chosen.has(r.ref)) continue
    chosen.add(r.ref)
    picked.push(r)
  }
  return { picked, stratumShortfall, sampleShortfall: Math.max(0, n - picked.length) }
}

function technicalOf(q: FillBlankQuestion) {
  const c = checkQuestionInvariants(q)
  const pass =
    c.spanBoundary &&
    c.roundTrip &&
    c.uniqueLabels &&
    c.uniqueIds &&
    c.correctIdCount === 1 &&
    c.correctLabel
  return {
    status: pass ? 'PASS' : 'FAIL',
    spanBoundary: c.spanBoundary,
    roundTrip: c.roundTrip,
    uniqueLabels: c.uniqueLabels,
    uniqueIds: c.uniqueIds,
    correctIdCount: c.correctIdCount,
    resultEvidence: 'audit-fillblank',
    checker: SCRIPT_PATH,
    checkedAt: null,
  }
}

const expertWaiting = () => ({
  status: WAITING,
  reviewerName: null,
  qualificationOrRole: null,
  reviewedAt: null,
  targetMeaning: WAITING,
  grammarNaturalness: WAITING,
  ageSuitability: WAITING,
  ambiguityNotes: null,
  restorationTaskSuitability: WAITING,
  rationale: null,
})

export interface GitInfo {
  sourceCommit: string | null
  builderCommit: string | null
  dirtyPaths: string[]
  isTracked: (path: string) => boolean
}

export function readGitInfo(repoRoot: string): GitInfo {
  const git = (...args: string[]) =>
    execFileSync('git', args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  const safe = (fn: () => string) => {
    try {
      return fn() || null
    } catch {
      return null
    }
  }
  const status =
    safe(() => git('status', '--porcelain', '--', DICTIONARY_DIR, BUILDER_PATH, SCRIPT_PATH)) ?? ''
  return {
    sourceCommit: safe(() => git('rev-parse', 'HEAD')),
    builderCommit: safe(() => git('log', '-1', '--format=%H', '--', BUILDER_PATH)),
    dirtyPaths: status
      .split('\n')
      .map((l) => l.slice(3).trim())
      .filter(Boolean),
    isTracked: (path) => safe(() => git('ls-files', '--error-unmatch', '--', path)) !== null,
  }
}

export interface RunOptions extends AuditArgs {
  repoRoot: string
  command: string
  git: GitInfo
  dictRel?: string
  now?: () => string
}

function directionSummary(
  dataset: Dataset,
  direction: FillBlankDirection,
  result: FillBlankBuildResult,
) {
  const legacyKey = direction === 'A' ? 'ex_en' : 'ex_vi'
  let legacyExample = 0
  let nonEmptySentence = 0
  for (const entry of dataset.pool) {
    const value =
      typeof entry === 'object' && entry !== null
        ? (entry as Record<string, unknown>)[legacyKey]
        : undefined
    if (value) legacyExample++
    if (typeof value === 'string' && value.normalize('NFC').trim() !== '') nonEmptySentence++
  }
  const tagCounts: Record<SampleTag, number> = { form_only: 0, multiword: 0, diacritics: 0 }
  for (const q of result.questions) for (const t of tagsOf(q)) tagCounts[t]++
  const rejectedTotal = FILL_BLANK_REASONS.reduce((n, k) => n + result.counts[k], 0)
  return {
    totalEntries: result.total,
    legacyExample,
    nonEmptySentence,
    counts: result.counts,
    acceptedBeforeCap: result.counts.accepted,
    reconciled: result.total === result.counts.accepted + rejectedTotal,
    tags: tagCounts,
    acceptedRateOfEntries: result.total === 0 ? null : result.counts.accepted / result.total,
    acceptedRateOfSentences:
      nonEmptySentence === 0 ? null : result.counts.accepted / nonEmptySentence,
  }
}

/** Chạy audit, ghi output, trả mã thoát (0/1). Lỗi đầu vào ném InputError (→ 2). */
export function runAudit(opts: RunOptions): { exitCode: 0 | 1; summary: Record<string, unknown> } {
  const outDir = resolve(opts.repoRoot, opts.out)
  if (existsSync(outDir) && readdirSync(outDir).length > 0) {
    throw new InputError(`Thư mục output đã có dữ liệu, không ghi đè: ${opts.out}`)
  }
  const dataset = loadDataset(opts.repoRoot, opts.dictRel)
  const hashIndex = new Map(dataset.refs.map((r, i) => [r, dataset.hashes[i]!]))
  const entryByRef = new Map(dataset.refs.map((r, i) => [r, dataset.pool[i]]))
  let fixture: { path: string; refs: string[]; sha256: string } | undefined
  if (opts.poolFixture) {
    const abs = resolve(opts.repoRoot, opts.poolFixture)
    const rel = relative(opts.repoRoot, abs)
    if (rel.startsWith('..')) throw new InputError('Fixture phải nằm trong repo')
    if (!opts.git.isTracked(rel)) throw new InputError(`Fixture chưa được git track: ${rel}`)
    fixture = { path: rel, ...loadPoolFixture(abs, dataset) }
  }

  const failures: string[] = []
  const candidateLines: string[] = []
  const directions: Record<string, unknown> = {}
  const manifestDirections: Record<string, unknown> = {}
  const fixtureReport: Record<string, unknown> = {}
  const status: Record<string, string> = {}

  for (const direction of opts.directions) {
    const result = buildFillBlankQuestions(dataset.pool, direction, {
      refs: dataset.refs,
      seed: opts.seed,
      rank: shaRank,
    })
    const summary = directionSummary(dataset, direction, result)
    if (!summary.reconciled) failures.push(`${direction}: tổng không đối soát`)
    const byRef = new Map(result.questions.map((q) => [q.ref, q]))
    const reasonByRef = new Map(result.rejections.map((r) => [r.ref, r.reason]))
    for (const ref of dataset.refs) {
      const q = byRef.get(ref)
      const reason: FillBlankReason | 'accepted' = q ? 'accepted' : reasonByRef.get(ref)!
      if (q && technicalOf(q).status !== 'PASS') failures.push(`${direction} ${ref}: bất biến sai`)
      candidateLines.push(
        JSON.stringify({
          direction,
          entryRef: ref,
          contentSha256: hashIndex.get(ref),
          primaryReason: reason,
          answer: q?.answer ?? null,
          span: q?.span ?? null,
        }),
      )
    }

    const sel = selectSamples(result.questions, direction, opts.seed, opts.samples)
    const toRow = (r: Ranked<FillBlankQuestion>) => {
      const q = r.item
      const entry = entryByRef.get(q.ref) as Record<string, unknown>
      return {
        entryRef: q.ref,
        direction,
        source: 'dictionary',
        contentSha256: hashIndex.get(q.ref),
        sourceWord: q.sourceWord,
        pos: typeof entry.pos === 'string' ? entry.pos : null,
        rank: r.rank,
        tags: tagsOf(q),
        sentenceNfc: q.sentence,
        span: q.span,
        answer: q.answer,
        blanked: blankedSentence(q),
        options: q.options,
        correctOptionId: q.correctOptionId,
        primaryReason: 'accepted',
        technical: technicalOf(q),
        expert: expertWaiting(),
      }
    }
    // Mẫu bị loại để kiểm loại bỏ — tách khỏi mẫu chính, không tăng mẫu số review.
    const rejectedSamples = FILL_BLANK_REASONS.flatMap((reason) =>
      result.rejections
        .filter((x) => x.reason === reason)
        .map((x) => ({ ref: x.ref, rank: candidateRank(opts.seed, direction, x.ref) }))
        .sort((a, b) => compareCodeUnit(a.rank, b.rank) || compareCodeUnit(a.ref, b.ref))
        .slice(0, REJECTED_PER_REASON)
        .map((x) => {
          const entry = entryByRef.get(x.ref)
          const rec =
            typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}
          const sentence = rec[direction === 'A' ? 'ex_en' : 'ex_vi']
          return {
            entryRef: x.ref,
            direction,
            source: 'dictionary',
            contentSha256: hashIndex.get(x.ref),
            sourceWord: typeof rec.word === 'string' ? rec.word : null,
            rank: x.rank,
            sentenceNfc: typeof sentence === 'string' ? sentence.normalize('NFC') : null,
            span: null,
            answer: null,
            blanked: null,
            options: [],
            correctOptionId: null,
            primaryReason: reason,
          }
        }),
    )
    const coverage =
      sel.picked.length < opts.samples && direction === 'B' ? 'WAITING_B_COVERAGE' : WAITING
    status[direction] = coverage
    directions[direction] = {
      ...summary,
      sampleShortfall: sel.sampleShortfall,
      stratumShortfall: sel.stratumShortfall,
      expertStatus: coverage,
    }
    manifestDirections[direction] = {
      accepted: sel.picked.map(toRow),
      rejected: rejectedSamples,
      sampleShortfall: sel.sampleShortfall,
      stratumShortfall: sel.stratumShortfall,
    }

    if (fixture) {
      const idx = new Set(fixture.refs)
      const pool = dataset.pool.filter((_, i) => idx.has(dataset.refs[i]!))
      const refs = dataset.refs.filter((r) => idx.has(r))
      const fx = buildFillBlankQuestions(pool, direction, { refs, seed: opts.seed, rank: shaRank })
      const accepted = fx.counts.accepted
      fixtureReport[direction] = {
        entries: fx.total,
        counts: fx.counts,
        accepted,
        session: accepted < MIN_SESSION ? 'empty' : accepted < SESSION_SIZE ? 'short' : 'full',
        sessionLength: accepted < MIN_SESSION ? 0 : Math.min(accepted, SESSION_SIZE),
      }
    }
  }

  if (opts.git.dirtyPaths.length > 0)
    failures.push(`Input chưa commit: ${opts.git.dirtyPaths.join(', ')}`)
  const technicalStatus = failures.length === 0 ? 'PASS' : 'FAIL'

  const inputs = {
    builder: sha256(readFileSync(join(opts.repoRoot, BUILDER_PATH))),
    script: sha256(readFileSync(join(opts.repoRoot, SCRIPT_PATH))),
    files: dataset.files,
  }
  const metadata = {
    schemaVersion: SCHEMA_VERSION,
    ruleVersion: FILL_BLANK_RULE_VERSION,
    seed: opts.seed,
    nodeVersion: process.version,
    sourceCommit: opts.git.sourceCommit,
    builderCommit: opts.git.builderCommit,
    dirtyPaths: opts.git.dirtyPaths,
    inputSha256: inputs,
    datasetDigest: dataset.datasetDigest,
    scope: {
      directions: opts.directions,
      samples: opts.samples,
      poolFixture: fixture?.path ?? null,
    },
    command: opts.command,
  }
  const candidatesText = candidateLines.join('\n') + '\n'
  const manifest = {
    metadata,
    purpose: 'S05 expert/Product review; accepted real-data samples only',
    caveat: 'Technical PASS is structural only; it is not semantic or release acceptance.',
    expertStatus: status,
    productAcceptance: {
      status: WAITING,
      sourceHead: opts.git.sourceCommit,
      manifestDigest: null,
      productReviewer: null,
      signedAt: null,
      unresolved: ['expert review', 'Product acceptance'],
    },
    directions: manifestDirections,
  }
  const manifestText = JSON.stringify(manifest, null, 2) + '\n'
  const canonical = {
    metadata,
    technical: { status: technicalStatus, failures },
    directions,
    poolFixture: fixture
      ? { path: fixture.path, sha256: fixture.sha256, directions: fixtureReport }
      : null,
    expertStatus: status,
    releaseStatus: 'WAITING',
    outputs: {
      'candidates.jsonl': sha256(candidatesText),
      'review-manifest.json': sha256(manifestText),
    },
  }
  // Timestamp và đường dẫn output nằm NGOÀI payload canonical (dùng để kiểm tính xác định).
  const summary = { generatedAt: (opts.now ?? (() => new Date().toISOString()))(), canonical }

  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'candidates.jsonl'), candidatesText)
  writeFileSync(join(outDir, 'review-manifest.json'), manifestText)
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n')
  return { exitCode: technicalStatus === 'PASS' ? 0 : 1, summary }
}

function main(): number {
  const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
  try {
    const args = parseArgs(process.argv.slice(2))
    const { exitCode, summary } = runAudit({
      ...args,
      repoRoot,
      command: ['npx tsx', SCRIPT_PATH, ...process.argv.slice(2)].join(' '),
      git: readGitInfo(repoRoot),
    })
    const canonical = summary.canonical as {
      technical: unknown
      directions: Record<string, { counts: unknown }>
    }
    console.log(
      JSON.stringify({ technical: canonical.technical, directions: canonical.directions }, null, 2),
    )
    console.log(
      `Output: ${args.out} — trạng thái chuyên môn/release vẫn WAITING, đọc summary.json.`,
    )
    return exitCode
  } catch (err) {
    console.error(`audit-fillblank: ${(err as Error).message}`)
    return 2
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main()
}
