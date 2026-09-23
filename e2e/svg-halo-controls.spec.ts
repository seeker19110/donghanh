import { expect, test } from '@playwright/test'
import { measureSvgHalo } from './helpers/svgHaloContrast'

const markup = `<html lang="vi"><head><title>Halo control</title></head><body style="margin:0;background:white">
  <svg width="400" height="100" viewBox="0 0 400 100">
    <rect width="400" height="100" fill="#666" />
    <text id="label" x="20" y="50" font-size="20" fill="#111" stroke="white" stroke-width="3" paint-order="stroke fill" vector-effect="non-scaling-stroke">Chữ có nền viền</text>
  </svg></body></html>`

test('halo đục đo màu thật, không nhận nhầm 5:1 thành 7:1', async ({ page }) => {
  await page.setContent(markup)
  const pass = await measureSvgHalo(page, ['#label'])
  expect(pass.status).toBe('measured')
  if (pass.status !== 'measured') throw new Error(pass.reason)
  expect(pass.ratio).toBeGreaterThan(7)
  await page.locator('#label').evaluate((el) => el.setAttribute('fill', '#666'))
  const fail = await measureSvgHalo(page, ['#label'])
  expect(fail.status).toBe('measured')
  if (fail.status !== 'measured') throw new Error(fail.reason)
  expect(fail.ratio).toBeLessThan(7)
})

for (const [attribute, value] of [
  ['stroke', 'rgba(255,255,255,0.5)'],
  ['stroke', 'none'],
  ['stroke-width', '1'],
  ['paint-order', 'fill stroke'],
  ['opacity', '0.5'],
  ['transform', 'rotate(5)'],
] as const) {
  test(`halo không đủ bằng chứng: ${attribute}=${value}`, async ({ page }) => {
    await page.setContent(markup)
    await page
      .locator('#label')
      .evaluate((el, { name, value }) => el.setAttribute(name, value), { name: attribute, value })
    expect((await measureSvgHalo(page, ['#label'])).status).toBe('unresolved')
  })
}

test('không kết luận chữ bị SVG hoặc HTML vẽ đè', async ({ page }) => {
  await page.setContent(markup)
  await page.locator('svg').evaluate((svg) => {
    const cover = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    cover.setAttribute('width', '400')
    cover.setAttribute('height', '100')
    cover.setAttribute('fill', 'black')
    svg.append(cover)
  })
  expect((await measureSvgHalo(page, ['#label'])).status).toBe('unresolved')
  await page.setContent(markup + '<div style="position:fixed;inset:0;background:black"></div>')
  expect((await measureSvgHalo(page, ['#label'])).status).toBe('unresolved')
})

test('halo không chứng nhận tspan khác màu hoặc legacy clip', async ({ page }) => {
  await page.setContent(markup)
  await page.locator('#label').evaluate((el) => {
    el.innerHTML = '<tspan fill="#aaa">Chữ con</tspan>'
  })
  expect(await measureSvgHalo(page, ['#label'])).toMatchObject({
    status: 'unresolved',
    reason: 'SVG text has unmeasured child paint',
  })
  await page.setContent(markup)
  await page.locator('svg').evaluate((el) => {
    el.style.clip = 'rect(0px, 50px, 50px, 0px)'
  })
  expect((await measureSvgHalo(page, ['#label'])).status).toBe('unresolved')
})

test('halo kiểm tra lớp phủ nhỏ ngoài năm điểm và mép viền bị cắt', async ({ page }) => {
  await page.setContent(markup)
  await page.locator('#label').evaluate((el) => {
    const rect = el.getBoundingClientRect()
    const cover = document.createElement('div')
    cover.style.cssText = `position:fixed;left:${rect.left + 12}px;top:${rect.top + 5}px;width:3px;height:8px;background:black;pointer-events:none`
    document.body.append(cover)
  })
  expect(await measureSvgHalo(page, ['#label'])).toMatchObject({
    status: 'unresolved',
    reason: 'intersecting HTML paint may obscure halo',
  })
  await page.setContent(markup)
  await page.locator('#label').evaluate((el) => el.setAttribute('x', '0.5'))
  expect(await measureSvgHalo(page, ['#label'])).toMatchObject({
    status: 'unresolved',
    reason: 'text clipped by SVG viewport',
  })
})

test('halo không chứng nhận pseudo ancestor, SVG khác hoặc ancestor cắt viền', async ({ page }) => {
  await page.setContent(
    markup +
      '<style>body::after{content:"";position:fixed;left:20px;top:30px;width:20px;height:20px;background:black;pointer-events:none;z-index:99}</style>',
  )
  expect(await measureSvgHalo(page, ['#label'])).toMatchObject({
    status: 'unresolved',
    reason: 'ancestor pseudo paint may obscure halo',
  })
  await page.setContent(
    markup +
      '<svg style="position:fixed;left:20px;top:30px;pointer-events:none" width="20" height="20"><rect width="20" height="20" fill="black"/></svg>',
  )
  expect(await measureSvgHalo(page, ['#label'])).toMatchObject({
    status: 'unresolved',
    reason: 'another SVG may obscure halo',
  })
  await page.setContent(markup)
  await page.locator('svg').evaluate((svg) => {
    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'width:30px;height:100px;overflow:hidden'
    svg.replaceWith(wrapper)
    wrapper.append(svg)
  })
  expect(await measureSvgHalo(page, ['#label'])).toMatchObject({
    status: 'unresolved',
    reason: 'halo clipped by ancestor scrollport',
  })
})

test('halo cho phép nền pseudo âm phía sau và identity transform, vẫn chặn descendant âm', async ({
  page,
}) => {
  await page.setContent(
    markup +
      '<style>body::before{content:"";position:fixed;inset:0;z-index:-1;background:black;pointer-events:none}</style>',
  )
  await page.locator('#label').evaluate((el) => el.setAttribute('transform', 'translate(0,0)'))
  expect((await measureSvgHalo(page, ['#label'])).status).toBe('measured')
  await page.locator('svg').evaluate((el) => {
    el.style.position = 'relative'
    el.style.zIndex = '-2'
  })
  expect(await measureSvgHalo(page, ['#label'])).toMatchObject({
    status: 'unresolved',
    reason: 'negative descendant stacking order',
  })
})
