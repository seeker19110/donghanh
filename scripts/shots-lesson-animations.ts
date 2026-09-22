/**
 * Chụp MỌI hoạt ảnh bài học của một môn ở nhiều mốc thời gian, để rà bằng mắt (Tầng 8b cho hoạt
 * ảnh — luật ⑥ của `docs/specs/2026-09-21-hoat-anh-mo-phong-bai-hoc.md`: ảnh cảnh đầu KHÔNG đủ,
 * phải soi ≥ 3 mốc và so ảnh khác nhau thật).
 *
 *   npm run shots:lesson-anim -- [--subject math] [--out DIR] [--only toan11-c1-b1,...]
 *
 * Cách làm (không cần DB/đăng nhập): render `LessonAnimation` ra HTML tĩnh kèm token theme,
 * mở bằng Chromium, đặt `currentTime` của mọi animation về 5 mốc 2/25/50/75/98% `durationMs`
 * (kỹ thuật đáng tin — đổi `animation-delay` âm trên animation đã paused cho ảnh sai giả ở mốc
 * gần cuối, xem `TRAPS.md` mục 10), rồi ghép 5 khung thành một dải `montage/<id>.png` để đọc.
 * Ảnh ghi RA NGOÀI REPO (mặc định `/tmp/shots/lesson-animations/<môn>/`) — repo giữ 0 file PNG.
 *
 * Mốc renderToStaticMarkup: React escape dấu nháy trong <style> (`&#x27;`) — client thật không
 * bị vì set qua textContent — nên phải giải escape khối <style> trước khi ghi file.
 */
import { chromium } from '@playwright/test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { LessonAnimation as LessonAnimationSpec } from '@dhcb/core-contracts/lessonAnimation'

// `scripts/` được typecheck bởi tsconfig.api.json (không bật --jsx, loại trừ core-ui) nên không
// import tĩnh file .tsx được; nạp động qua chuỗi để tsx phân giải lúc chạy, khai kiểu tay.
type LessonAnimationComponent = (props: { spec: LessonAnimationSpec }) => React.ReactElement | null
const RENDERER_MODULE = '@dhcb/core-ui/LessonAnimation'

const MOC_PHAN_TRAM = [2, 25, 50, 75, 98] as const

function doiSo(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`)
  const value = i >= 0 ? process.argv[i + 1] : undefined
  return value ?? fallback
}

async function napHoatAnh(subject: string): Promise<{ id: string; spec: LessonAnimationSpec }[]> {
  if (subject !== 'math')
    throw new Error(`Chưa hỗ trợ môn "${subject}" — hiện chỉ có math nối apps/.`)
  const { MATH_LESSONS } = await import('@dhcb/subject-math/lessons')
  return MATH_LESSONS.flatMap((bai) => (bai.animation ? [{ id: bai.id, spec: bai.animation }] : []))
}

function trangHtml(
  LessonAnimation: LessonAnimationComponent,
  spec: LessonAnimationSpec,
  themeCss: string,
): string {
  const body = renderToStaticMarkup(React.createElement(LessonAnimation, { spec })).replace(
    /<style>[\s\S]*?<\/style>/,
    (m) =>
      m
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>'),
  )
  return `<!doctype html><html data-theme="blue-sky"><head><meta charset="utf-8"><style>${themeCss}
body{margin:0;padding:16px;background:rgb(var(--surface-card));color:rgb(var(--text-primary));font-family:sans-serif}
figure{margin:0;width:720px}</style></head><body>${body}</body></html>`
}

async function main() {
  const subject = doiSo('subject', 'math')
  const out = doiSo('out', `/tmp/shots/lesson-animations/${subject}`)
  const only = doiSo('only', '').split(',').filter(Boolean)
  const themeCss = readFileSync('packages/core-ui/theme.css', 'utf8')
  const { LessonAnimation } = (await import(RENDERER_MODULE)) as {
    LessonAnimation: LessonAnimationComponent
  }
  const danhSach = (await napHoatAnh(subject)).filter(
    (a) => only.length === 0 || only.includes(a.id),
  )
  mkdirSync(join(out, 'shots'), { recursive: true })
  mkdirSync(join(out, 'montage'), { recursive: true })

  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  )
  const page = await browser.newPage({ viewport: { width: 760, height: 900 } })
  let dungYen = 0
  for (const { id, spec } of danhSach) {
    const htmlPath = join(out, `${id}.html`)
    writeFileSync(htmlPath, trangHtml(LessonAnimation, spec, themeCss))
    await page.goto(`file://${htmlPath}`)
    const soAnim = await page.evaluate(() =>
      [...document.querySelectorAll("[data-animated='true']")].reduce(
        (n, g) => n + g.getAnimations().length,
        0,
      ),
    )
    for (const pct of MOC_PHAN_TRAM) {
      const t = Math.round((spec.durationMs * pct) / 100)
      await page.evaluate((ms) => {
        document.querySelectorAll("[data-animated='true']").forEach((g) =>
          g.getAnimations().forEach((a) => {
            a.pause()
            a.currentTime = ms
          }),
        )
      }, t)
      await page
        .locator('svg')
        .screenshot({ path: join(out, 'shots', `${id}--${String(pct).padStart(2, '0')}.png`) })
    }
    // Dải ghép 5 khung để đọc một lượt.
    const khung = MOC_PHAN_TRAM.map(
      (pct) =>
        `<figure style="margin:0;text-align:center"><img src="shots/${id}--${String(pct).padStart(2, '0')}.png" style="width:370px;border:1px solid #999"><figcaption style="font:13px sans-serif">${pct}% · ${Math.round((spec.durationMs * pct) / 100)}ms</figcaption></figure>`,
    ).join('')
    const montagePath = join(out, `m-${id}.html`)
    writeFileSync(
      montagePath,
      `<html><body style="margin:0;padding:6px;background:#fff"><div style="font:bold 15px sans-serif;margin-bottom:4px">${id} — ${spec.title}</div><div style="display:flex;gap:4px">${khung}</div></body></html>`,
    )
    await page.setViewportSize({ width: 1900, height: 600 })
    await page.goto(`file://${montagePath}`)
    await page.locator('body').screenshot({ path: join(out, 'montage', `${id}.png`) })
    await page.setViewportSize({ width: 760, height: 900 })
    if (soAnim === 0) dungYen += 1
    console.log(`${id}: ${soAnim} animation đang chạy · ${spec.durationMs}ms`)
  }
  await browser.close()
  console.log(`\n${danhSach.length} hoạt ảnh → ${out}/montage/*.png`)
  if (dungYen > 0) {
    console.error(`✖ ${dungYen} hoạt ảnh KHÔNG có animation nào chạy (xem TRAPS.md mục 10).`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
