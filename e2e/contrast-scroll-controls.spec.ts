import { test, expect } from '@playwright/test'
import { remeasureContrast } from './helpers/remeasureContrast'

test('đích ngoài scrollport được đo lại với màu thật, không tự miễn trừ', async ({ page }) => {
  await page.setContent(
    '<div style="height:100px;overflow:auto"><div style="height:300px"></div><p id="target" style="color:#111;background:#fff">Nội dung đủ dài để đo tương phản.</p></div>',
  )
  const result = await remeasureContrast(page, ['#target'])
  expect(result.stable).toBe(true)
  expect(result.reason).toBeUndefined()
  expect(result.after!.y).toBeLessThan(result.before!.y)
  expect(
    result.results?.passes.find((rule) => rule.id === 'color-contrast-enhanced')?.nodes.length,
  ).toBeGreaterThan(0)
})

// axe enhanced chỉ báo khoảng 4.5–7; thấp hơn 4.5 thuộc rule AA (minThreshold).
for (const { color, rule } of [
  { color: '#666', rule: 'color-contrast-enhanced' },
  { color: '#aaa', rule: 'color-contrast' },
]) {
  test(`đích tương phản thấp vẫn trả violation ${rule} sau cuộn`, async ({ page }) => {
    await page.setContent(
      `<div style="height:100px;overflow:auto"><div style="height:300px"></div><p id="target" style="color:${color};background:#fff">Chữ nhạt này phải bị loại.</p></div>`,
    )
    const result = await remeasureContrast(page, ['#target'])
    expect(result.stable).toBe(true)
    expect(result.results?.violations.some((finding) => finding.id === rule)).toBe(true)
  })
}

test('chữ bị truncate vẫn báo, dù axe có đo được màu phần còn nhìn thấy', async ({ page }) => {
  await page.setContent(
    '<p id="target" style="width:60px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#111;background:#fff">Câu bị cắt ngắn không được tự coi là đã kiểm đủ.</p>',
  )
  const result = await remeasureContrast(page, ['#target'])
  expect(result.stable).toBe(true)
  expect(result.reason).toBe('text-clipped')
  expect(result.after?.clipped).toBe(true)
})

test('đích thiếu hoặc không duy nhất không được kết luận', async ({ page }) => {
  await page.setContent('<p class="same">Một</p><p class="same">Hai</p>')
  expect((await remeasureContrast(page, ['#missing'])).reason).toBe('missing-or-nonunique-target')
  expect((await remeasureContrast(page, ['.same'])).reason).toBe('missing-or-nonunique-target')
})

test('DOM thay đổi trong lúc cuộn không được kết luận ổn định', async ({ page }) => {
  await page.setContent(
    '<div id="port" style="height:100px;overflow:auto"><div style="height:300px"></div><p id="target" style="color:#111;background:#fff">Nội dung đang thay đổi.</p></div>',
  )
  await page.evaluate(() =>
    document.getElementById('port')?.addEventListener(
      'scroll',
      () => {
        document.getElementById('target')?.append(' mới')
      },
      { once: true },
    ),
  )
  const result = await remeasureContrast(page, ['#target'])
  expect(result.stable).toBe(false)
  expect(result.reason).toBe('dom-changed')
})

test('classification được chụp trong observer; thay đổi semantic trong callback không được pass', async ({
  page,
}) => {
  await page.setContent(
    '<button><p id="target" style="color:#666;background:white">Nội dung đọc</p></button>',
  )
  const stable = await remeasureContrast(page, ['#target'], async () => 'content')
  expect(stable.classification).toBe('content')
  expect(stable.stable).toBe(true)
  const changed = await remeasureContrast(page, ['#target'], async () => {
    await page.locator('#target').evaluate((el) => el.setAttribute('data-reading-content', ''))
    return 'chrome'
  })
  expect(changed.stable).toBe(false)
  expect(changed.reason).toBe('dom-changed')
})

test('lazy append ngoài đích cho phép snapshot mới, replacement cùng HTML vẫn không đạt', async ({
  page,
}) => {
  for (const replace of [false, true]) {
    await page.setContent(
      '<div id="scroller" style="height:100px;overflow:auto"><div style="height:300px"></div><p id="target" style="color:#111;background:white">Nội dung không đổi khi tải thêm</p></div>',
    )
    await page.evaluate((replace) => {
      document.querySelector('#scroller')!.addEventListener(
        'scroll',
        () => {
          const target = document.querySelector('#target')!
          if (replace) target.replaceWith(target.cloneNode(true))
          else document.body.append(document.createElement('aside'))
        },
        { once: true },
      )
    }, replace)
    const result = await remeasureContrast(page, ['#target'], async () => 'content')
    expect(result.scrollChanged).toBe(true)
    expect(result.stable).toBe(!replace)
  }
})

test('theme root đổi trong measurement không được kết luận', async ({ page }) => {
  await page.setContent('<p id="target" style="color:#111;background:white">Nội dung</p>')
  const result = await remeasureContrast(page, ['#target'], async () => {
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'changed'))
    return 'content'
  })
  expect(result.stable).toBe(false)
})

test('halo SVG được đo trong snapshot ổn định sau cuộn', async ({ page }) => {
  await page.setContent(
    '<div style="height:100px;overflow:auto"><div style="height:300px"></div><svg width="300" height="80"><text id="target" x="20" y="40" fill="#111" stroke="white" stroke-width="3" paint-order="stroke fill" vector-effect="non-scaling-stroke">Chữ có halo thật</text></svg></div>',
  )
  const result = await remeasureContrast(page, ['#target'], async () => 'content')
  expect(result.stable).toBe(true)
  expect(result.halo?.status).toBe('measured')
  if (result.halo?.status !== 'measured') throw new Error(JSON.stringify(result.halo))
  expect(result.halo.ratio).toBeGreaterThan(7)
})
