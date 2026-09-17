/**
 * Chụp ma trận ảnh sáu màn mẫu của goal learning-ux (spec S13 AC-2).
 *
 *   npm run shots:learning-ux -- [--phase before|after] [--screens a,b] [--states x,y]
 *                                [--themes t1,t2] [--widths 390,1440] [--out DIR]
 *   npm run shots:learning-ux -- --diff before after
 *
 * Ảnh ghi RA NGOÀI REPO (`SHOT_OUT`, mặc định `/tmp/shots/learning-ux/<phase>/`) —
 * repo giữ kỷ luật 0 file PNG (spec S13 §① "KHÔNG LÀM", §7 Q1). Bằng chứng dán vào
 * PR là `manifest.json`: md5 + chiều cao trang, tức SỐ ĐO, không phải "trông đẹp hơn".
 *
 * Chiều cao đọc thẳng từ HEADER PNG (IHDR, 4 byte tại offset 20) — không ước lượng.
 */
import { chromium, type Browser, type Page } from '@playwright/test'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import {
  LEARNING_UX_SCREENS,
  STATE_IDS,
  WIDTHS,
  HEIGHTS,
  moManHinh,
  demOKhaDung,
  type ScreenId,
  type StateId,
  type Width,
} from '../e2e/helpers/learningUxScreens.js'
import type { ThemeName } from '../e2e/helpers/auth.js'

const MOI_THEME: readonly ThemeName[] = ['dark-blue', 'blue-sky', 'kid']

type ShotManifest = {
  phase: string
  commit: string
  generatedAt: string
  shots: Array<{
    file: string
    screen: ScreenId
    state: StateId
    theme: ThemeName
    width: Width
    pageHeightPx: number
    md5: string
  }>
  skipped: Array<{ screen: ScreenId; state: StateId; reason: string }>
}

// ── Đọc cờ CLI ───────────────────────────────────────────────────────────────

function co(ten: string): string | undefined {
  const i = process.argv.indexOf(`--${ten}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

function danhSach<T extends string>(ten: string, macDinh: readonly T[]): T[] {
  const v = co(ten)
  if (!v) return [...macDinh]
  const chon = v.split(',').map((s) => s.trim())
  const la = chon.filter((s): s is T => (macDinh as readonly string[]).includes(s))
  const sai = chon.filter((s) => !la.includes(s as T))
  if (sai.length) {
    console.error(`Giá trị --${ten} không hợp lệ: ${sai.join(', ')}`)
    console.error(`Chọn trong: ${macDinh.join(', ')}`)
    process.exit(1)
  }
  return la
}

/** Chiều cao ảnh PNG, đọc từ IHDR (byte 20–24, big-endian). KHÔNG ước lượng. */
function chieuCaoPng(buf: Buffer): number {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return 0
  return buf.readUInt32BE(20)
}

// ── Chế độ --diff: so hai phase đã chụp ──────────────────────────────────────

function soSanh(goc: string, a: string, b: string): void {
  const doc = (p: string): ShotManifest => {
    const f = join(goc, p, 'manifest.json')
    if (!existsSync(f)) {
      console.error(`Không có ${f} — chạy "--phase ${p}" trước.`)
      process.exit(1)
    }
    return JSON.parse(readFileSync(f, 'utf8')) as ShotManifest
  }
  const ma = doc(a)
  const mb = doc(b)
  const mapB = new Map(mb.shots.map((s) => [s.file, s]))
  let khac = 0
  console.log(`| ảnh | md5 ${a} | md5 ${b} | cao ${a} | cao ${b} |`)
  console.log('| --- | --- | --- | --- | --- |')
  for (const s of ma.shots) {
    const t = mapB.get(s.file)
    if (!t) {
      console.log(`| ${s.file} | ${s.md5.slice(0, 8)} | (thiếu) | ${s.pageHeightPx} | — |`)
      khac += 1
      continue
    }
    if (t.md5 === s.md5) continue
    khac += 1
    console.log(
      `| ${s.file} | ${s.md5.slice(0, 8)} | ${t.md5.slice(0, 8)} | ${s.pageHeightPx} | ${t.pageHeightPx} |`,
    )
  }
  console.log(`\n${khac} ảnh khác nhau trên tổng ${ma.shots.length}.`)
}

// ── Chụp ─────────────────────────────────────────────────────────────────────

async function chup(
  browser: Browser,
  thuMuc: string,
  screens: ScreenId[],
  states: StateId[],
  themes: ThemeName[],
  widths: Width[],
  phase: string,
  base: string,
): Promise<ShotManifest> {
  const manifest: ShotManifest = {
    phase,
    commit: execSync('git rev-parse HEAD').toString().trim(),
    generatedAt: new Date().toISOString(),
    shots: [],
    skipped: [],
  }
  const loi: string[] = []

  console.log('| màn | trạng thái | theme | rộng | cao | md5 |')
  console.log('| --- | --- | --- | --- | --- | --- |')

  for (const man of LEARNING_UX_SCREENS) {
    if (!screens.includes(man.id)) continue
    for (const state of states) {
      const setup = man.states[state]
      if (setup.kind === 'n/a') {
        manifest.skipped.push({ screen: man.id, state, reason: setup.reason })
        continue
      }
      for (const theme of themes) {
        for (const w of widths) {
          const ten = `${man.id}--${state}--${theme}--${w}.png`
          // `baseURL` là BẮT BUỘC: `moManHinh` gọi `page.goto('/...')` bằng đường
          // dẫn tương đối (dùng chung với Playwright test, nơi baseURL nằm ở
          // playwright.config.ts). Thiếu nó thì Chromium báo "invalid URL".
          const ctx = await browser.newContext({
            baseURL: base,
            viewport: { width: w, height: HEIGHTS[w] },
            deviceScaleFactor: 1,
          })
          const page: Page = await ctx.newPage()
          try {
            await moManHinh(page, man, state, theme)
            const buf = await page.screenshot({ fullPage: true })
            const cao = chieuCaoPng(buf)
            // Bẫy Tầng 8b đã dính thật: ảnh trắng / màn đăng nhập trông "có chụp"
            // nhưng là màn khác. Chặn ngay tại đây, đừng để lọt vào báo cáo.
            const laManDangNhap = await page.locator('form[action*="login"]').count()
            if (cao < 400 || laManDangNhap > 0) {
              loi.push(
                `${ten}: cao ${cao}px, form đăng nhập ${laManDangNhap} — ảnh không dùng được`,
              )
            }
            writeFileSync(join(thuMuc, ten), buf)
            const md5 = createHash('md5').update(buf).digest('hex')
            manifest.shots.push({
              file: ten,
              screen: man.id,
              state,
              theme,
              width: w,
              pageHeightPx: cao,
              md5,
            })
            console.log(`| ${man.id} | ${state} | ${theme} | ${w} | ${cao} | ${md5.slice(0, 8)} |`)
          } catch (e) {
            loi.push(`${ten}: ${(e as Error).message.split('\n')[0]}`)
          } finally {
            await ctx.close()
          }
        }
      }
    }
  }

  if (loi.length) {
    console.error(`\n${loi.length} ô KHÔNG chụp được:`)
    for (const l of loi) console.error(`  - ${l}`)
  }
  return manifest
}

async function main(): Promise<void> {
  const goc = co('out') ?? process.env.SHOT_OUT ?? '/tmp/shots/learning-ux'

  const diffIdx = process.argv.indexOf('--diff')
  if (diffIdx >= 0) {
    soSanh(goc, process.argv[diffIdx + 1] ?? 'before', process.argv[diffIdx + 2] ?? 'after')
    return
  }

  const phase = co('phase') ?? 'before'
  if (phase !== 'before' && phase !== 'after') {
    console.error('--phase chỉ nhận "before" hoặc "after".')
    process.exit(1)
  }
  const screens = danhSach<ScreenId>(
    'screens',
    LEARNING_UX_SCREENS.map((m) => m.id),
  )
  const states = danhSach<StateId>('states', STATE_IDS)
  const themes = danhSach<ThemeName>('themes', MOI_THEME)
  const widths = danhSach<string>('widths', WIDTHS.map(String)).map(Number) as Width[]

  const thuMuc = join(goc, phase)
  mkdirSync(thuMuc, { recursive: true })

  const base = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 5179}`
  const kyVong =
    screens.length === LEARNING_UX_SCREENS.length && states.length === STATE_IDS.length
      ? demOKhaDung() * themes.length * widths.length
      : null
  console.log(`Chụp vào ${thuMuc} (base ${base})`)
  if (kyVong !== null) console.log(`Kỳ vọng ${kyVong} ảnh (đã trừ các ô n/a).`)

  const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH || '/opt/pw-browsers/chromium'
  const browser = await chromium.launch(
    existsSync(chromiumPath) ? { executablePath: chromiumPath } : {},
  )
  let manifest: ShotManifest
  try {
    manifest = await chup(browser, thuMuc, screens, states, themes, widths, phase, base)
  } finally {
    await browser.close()
  }

  writeFileSync(join(thuMuc, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`\n${manifest.shots.length} ảnh, ${manifest.skipped.length} ô bỏ qua (n/a).`)
  for (const s of manifest.skipped) console.log(`  bỏ qua ${s.screen}/${s.state}: ${s.reason}`)
  if (kyVong !== null && manifest.shots.length !== kyVong) {
    console.error(`THIẾU ẢNH: chụp được ${manifest.shots.length}/${kyVong}.`)
    process.exit(1)
  }
}

void main()
