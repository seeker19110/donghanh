// Cổng CHẶN: không được thêm màu Tailwind CỐ ĐỊNH làm màu chữ mà rớt tương phản AA.
//
// Vì sao cần cổng này khi đã có `e2e/a11y.spec.ts`: bộ E2E quét 15 trang × 5 theme — rất
// nhiều component chỉ hiện trong luồng sâu (modal, tab, trạng thái lỗi) KHÔNG nằm trong 15
// trang đó, nên màu chữ hỏng ở ba theme nền sáng có thể sống rất lâu mà không cổng nào đỏ.
// Đợt 2026-09-03 đo được 720 chỗ như vậy. Cổng này đọc thẳng mã nguồn nên phủ hết mọi
// component, kể cả component chưa có test E2E nào chạm tới.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  ALLOWLIST,
  auditRepo,
  auditLine,
  auditWarmTokenPairs,
  walk,
} from './fixed-color-contrast-audit.js'
import { AA, AAA, parseThemeTokens } from './lib/contrast.js'

const ROOT = process.cwd()

describe('màu Tailwind cố định dùng làm màu chữ', () => {
  it('không chỗ nào rớt AA trên bất kỳ theme nào', () => {
    const findings = auditRepo(ROOT)
    const shown = findings
      .slice(0, 20)
      .map((f) => `${f.file}:${f.line} ${f.cls} [${f.theme}/${f.surface}] ${f.ratio.toFixed(2)}`)
    expect(
      findings.length,
      `Rớt tương phản AA. Cách vá của dự án: thêm biến thể \`theme-light:text-<họ màu>-800/900\`\n` +
        `cạnh class trần (xem ~720 tiền lệ đã vá 2026-09-03), hoặc đổi sang token ngữ nghĩa\n` +
        `(\`text-content-muted\`…). Chạy \`npx tsx scripts/fixed-color-contrast-audit.ts\` để xem\n` +
        `danh sách đầy đủ.\n${shown.join('\n')}`,
    ).toBe(0)
  })

  // Ngoại lệ chỉ được tồn tại khi nó CÒN che một phép đo sai thật. Mục chết phải bị xoá,
  // nếu không danh sách sẽ phình dần thành baseline trá hình — đúng thứ luật a11y cấm.
  it('mỗi mục trong ALLOWLIST vẫn còn khớp thật (không có mục chết)', () => {
    const themes = parseThemeTokens(
      readFileSync(`${ROOT}/packages/core-ui/theme.css`, 'utf-8'),
    ) as never
    for (const entry of ALLOWLIST) {
      const lines = readFileSync(`${ROOT}/${entry.file}`, 'utf-8').split('\n')
      const hits = lines.flatMap((text, i) => auditLine(entry.file, i + 1, text, themes))
      expect(
        hits.some((h) => h.cls === entry.cls),
        `ALLOWLIST có mục chết: ${entry.file} / ${entry.cls} không còn rớt ngưỡng nữa — xoá nó đi.`,
      ).toBe(true)
    }
  })

  it('phát hiện được một ca hỏng cố ý (script không im lặng cho qua)', () => {
    const themes = parseThemeTokens(
      readFileSync(`${ROOT}/packages/core-ui/theme.css`, 'utf-8'),
    ) as never
    const hits = auditLine('x.tsx', 1, '<p className="text-amber-300">chào</p>', themes)
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.every((h) => ['blue-sky', 'kid'].includes(h.theme))).toBe(true)
  })

  // Khuôn lỗi PR #981: `text-zinc-*` là token theo theme nên cổng cũ bỏ qua, nhưng ba bậc tối
  // nhất rớt AA ở CẢ 3 theme (hỏng ĐỀU — đúng dấu hiệu đã thấy trên `/so-tay-loi-sai`).
  it('bắt được thang zinc bậc tối (600/700/800) rớt AA ở mọi theme', () => {
    const themes = parseThemeTokens(
      readFileSync(`${ROOT}/packages/core-ui/theme.css`, 'utf-8'),
    ) as never
    for (const step of ['600', '700', '800']) {
      const hits = auditLine('x.tsx', 1, `<p className="text-zinc-${step}">chào</p>`, themes)
      expect(hits.length, `text-zinc-${step} phải bị bắt`).toBeGreaterThan(0)
      expect(new Set(hits.map((h) => h.theme)).size, 'phải hỏng ở đủ 3 theme').toBe(3)
    }
  })

  it('không báo nhầm thang zinc bậc sáng (≤ 500) — đã đo là đạt AA', () => {
    const themes = parseThemeTokens(
      readFileSync(`${ROOT}/packages/core-ui/theme.css`, 'utf-8'),
    ) as never
    for (const step of ['300', '400', '500']) {
      expect(auditLine('x.tsx', 1, `<p className="text-zinc-${step}">x</p>`, themes)).toEqual([])
    }
  })

  // Màu có độ mờ (`text-zinc-800/80`) không đo được bằng một cặp màu đặc — phải bỏ qua,
  // nếu không sẽ báo nhầm các nét vẽ SVG trang trí.
  it('bỏ qua class zinc có hậu tố độ mờ', () => {
    const themes = parseThemeTokens(
      readFileSync(`${ROOT}/packages/core-ui/theme.css`, 'utf-8'),
    ) as never
    expect(auditLine('x.tsx', 1, '<circle className="text-zinc-800/80" />', themes)).toEqual([])
  })

  // `bg-accent-500 text-zinc-950` là thành ngữ "chữ tối trên chip nhấn sáng" — nền thật là
  // chip đó, không phải nền trang.
  it('không báo nhầm khi chữ nằm trên nền nhấn hoặc dải màu', () => {
    const themes = parseThemeTokens(
      readFileSync(`${ROOT}/packages/core-ui/theme.css`, 'utf-8'),
    ) as never
    expect(
      auditLine('x.tsx', 1, '<b className="bg-accent-500 text-zinc-600">x</b>', themes),
    ).toEqual([])
    expect(
      auditLine('x.tsx', 1, '<b className="bg-gradient-to-tr text-zinc-700">x</b>', themes),
    ).toEqual([])
  })

  // P0-2 (2026-09-17): token ấm `--w-*` của Companion "Bạn Đồng Hành" — bong bóng dùng
  // `text-content` (AAA) trên `bg-warm-50`/`bg-warm-100`; đo thật trên cả 3 theme, không đoán.
  it('token ấm --w-*: text-content trên bg-warm-50/100 đạt AAA ở cả 3 theme', () => {
    const checks = auditWarmTokenPairs(ROOT).filter((c) => c.text === 'z-100')
    expect(checks.length).toBe(6) // 2 bề mặt (w-50, w-100) × 3 theme
    for (const c of checks) {
      expect(
        c.ratio,
        `${c.theme} text-content/bg-warm-${c.surface} = ${c.ratio}`,
      ).toBeGreaterThanOrEqual(AAA)
    }
  })

  it('token ấm --w-*: mắt/miệng avatar (warm-700) trên nền warm-50/100 đạt AA ở cả 3 theme', () => {
    const checks = auditWarmTokenPairs(ROOT).filter((c) => c.text === 'w-700')
    expect(checks.length).toBe(6)
    for (const c of checks) {
      expect(
        c.ratio,
        `${c.theme} warm-700/bg-warm-${c.surface} = ${c.ratio}`,
      ).toBeGreaterThanOrEqual(AA)
    }
  })

  // 2026-09-19: `apps/hub` (@dhcb/hub, landing) dùng CHUNG hệ token `--z-*`/`--a-*` với
  // `@dhcb/app` (có ThemeToggle, tailwind.config.js map zinc/accent sang cùng biến CSS) —
  // phải nằm trong phạm vi quét, không phải cổng riêng theo bảng màu khác.
  it('quét cả apps/hub/src, không chỉ apps/dhcb/src', () => {
    // Canh trực tiếp: nếu ai đó lỡ xoá dòng `walk(join(root, 'apps', 'hub', 'src'))` khỏi
    // `auditRepo`, danh sách file quét rỗng — test này đỏ ngay, không im lặng.
    const hubFiles = walk(`${ROOT}/apps/hub/src`)
    expect(hubFiles.length).toBeGreaterThan(0)
    expect(hubFiles.some((f) => f.endsWith('App.tsx'))).toBe(true)

    // Hub hiện đã sạch (đợt 2026-09-19 vá 4 chỗ amber/emerald/red rớt AA ở theme sáng).
    const findings = auditRepo(ROOT)
    expect(findings.every((f) => !f.file.startsWith('apps/hub/'))).toBe(true)
  })

  it('không báo nhầm khi chữ nằm trên nền màu ĐẶC', () => {
    const themes = parseThemeTokens(
      readFileSync(`${ROOT}/packages/core-ui/theme.css`, 'utf-8'),
    ) as never
    expect(
      auditLine('x.tsx', 1, '<span className="bg-amber-400 text-slate-950">x</span>', themes),
    ).toEqual([])
  })
})
