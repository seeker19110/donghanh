// scripts/lib/contrast.ts — Đo tương phản WCAG cho các token màu của 5 theme.
//
// VÌ SAO CẦN: luật a11y của dự án (CLAUDE.md mục 4.5) là sàn cứng — chữ nội dung/tiêu đề phải
// đạt AAA (≥ 7:1), mọi phần còn lại đạt AA (≥ 4.5:1), ở CẢ 5 theme. Cổng thật là hai bộ E2E
// (`e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts`) quét 15+ trang × 5 theme — chạy rất lâu.
//
// Module này cho phép trả lời câu hỏi "cặp màu này có đạt ngưỡng không" TRONG VÀI MILI GIÂY,
// ngay lúc đang thiết kế, thay vì phải chạy hết E2E rồi mới biết đã chọn sai màu. Nó KHÔNG
// thay thế cổng E2E (E2E đo màu đã render thật, gồm cả overlay/opacity) — nó chặn sớm loại lỗi
// tốn kém nhất: chọn một token làm màu chữ mà token đó không bao giờ đủ tương phản.
//
// Bẫy đã biết, được mã hoá ở đây: 3 theme nền sáng (blue-sky, pink, kid) ĐẢO thang zinc —
// `--z-50` là màu TỐI nhất chứ không phải sáng nhất. Vì vậy không được suy luận "z số nhỏ =
// màu sáng"; luôn phải đọc giá trị thật của từng theme.

/** Một màu ở dạng bộ ba RGB 0–255, đúng dạng biến CSS của dự án (`--z-500: 133 145 163`). */
export type Rgb = readonly [number, number, number]

/** Bảng biến màu của MỘT theme: tên biến (không có `--`) → giá trị RGB. */
export type ThemeTokens = Readonly<Record<string, Rgb>>

/** Toàn bộ theme đọc được từ `theme.css`: tên theme → bảng biến. */
export type ThemeTable = Readonly<Record<string, ThemeTokens>>

/**
 * Tách các khối `:root` / `[data-theme='...']` trong `theme.css` thành bảng biến từng theme.
 *
 * Cố ý dùng regex thay vì kéo thêm một trình phân tích CSS: file `theme.css` do dự án tự viết,
 * cấu trúc cố định (mỗi theme một khối phẳng, mỗi biến một dòng `--ten: r g b;`), và Prettier
 * giữ nguyên định dạng đó. Chỉ nhận biến có ĐÚNG dạng 3 số — các biến khác (`--glow-accent: 0.4`,
 * `--theme-color: #0f172a`) tự bị bỏ qua vì không khớp, đúng ý muốn.
 */
export function parseThemeTokens(css: string): ThemeTable {
  const table: Record<string, Record<string, Rgb>> = {}
  // `:root` (theme mặc định dark-blue) hoặc `[data-theme='x']`, có thể đứng chung một khối.
  const blockRe = /(?:\[data-theme='([a-z-]+)'\]|:root)[^{]*\{([^}]*)\}/g
  let block: RegExpExecArray | null
  while ((block = blockRe.exec(css)) !== null) {
    const name = block[1] ?? 'dark-blue'
    const body = block[2] ?? ''
    const bucket = (table[name] ??= {})
    // Nhận cả `R G B` trần (token --z-*/--a-*) lẫn `rgb(R G B)` (ghi đè biến bảng màu
    // Tailwind `--color-<họ>-<bậc>` theo theme — thêm 2026-09-22, changelog 0418).
    const varRe = /--([a-z0-9-]+):\s*(?:rgb\()?(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\)?\s*;/g
    let v: RegExpExecArray | null
    while ((v = varRe.exec(body)) !== null) {
      bucket[v[1] as string] = [Number(v[2]), Number(v[3]), Number(v[4])]
    }
  }
  return table
}

/** Độ chói tương đối theo công thức WCAG 2.x. */
export function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (raw: number): number => {
    const c = raw / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Tỉ số tương phản WCAG giữa hai màu đặc (1.0 … 21.0). Thứ tự hai tham số không quan trọng. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Ngưỡng WCAG dùng trong dự án. */
export const AA = 4.5
export const AAA = 7

/** Kết quả đo một cặp (màu chữ × nền) trong một theme. */
export interface ContrastCheck {
  theme: string
  text: string
  surface: string
  ratio: number
}

/**
 * Đo một danh sách cặp (chữ, nền) trên MỌI theme trong bảng.
 * Cặp nào có token không tồn tại trong theme đó thì bỏ qua (không coi là lỗi) — cho phép
 * thêm token dần cho từng theme mà không làm gãy công cụ.
 */
export function checkPairs(
  themes: ThemeTable,
  pairs: ReadonlyArray<{ text: string; surface: string }>,
): ContrastCheck[] {
  const out: ContrastCheck[] = []
  for (const [theme, tokens] of Object.entries(themes)) {
    for (const { text, surface } of pairs) {
      const fg = tokens[text]
      const bg = tokens[surface]
      if (!fg || !bg) continue
      out.push({ theme, text, surface, ratio: contrastRatio(fg, bg) })
    }
  }
  return out
}

// ── Đọc màu từ bảng màu của Tailwind ────────────────────────────────────────────────────────
//
// VÌ SAO CÓ PHẦN NÀY (2026-09-22): Tailwind 3 khai màu bằng hex (`#b45309`), Tailwind 4 khai
// bằng `oklch(55.5% 0.163 48.998)`. Cổng `fixed-color-contrast-audit` đọc bảng màu THẲNG từ gói
// đang cài (`import colors from 'tailwindcss/colors'`), nên khi nâng Tailwind 4 mà bộ đọc chỉ
// hiểu hex thì mọi màu trả `null` và audit BỎ QUA IM LẶNG cả ~4.141 chỗ — cổng xanh trong khi
// không kiểm gì. Đó là đúng loại "máy canh trống" mà audit 2026-09-05 (F1) đã bắt được một lần
// với jsx-a11y. Vì vậy: hiểu CẢ HAI định dạng, và có test canh bắt buộc mọi màu phải đọc được
// (`contrast.test.ts` — bảng màu đổi định dạng lần nữa thì test ĐỎ, không im lặng).

/** Giải mã gamma sRGB: kênh tuyến tính (0…1) → giá trị 0–255. */
function encodeSrgbChannel(linear: number): number {
  const c = linear <= 0.0031308 ? linear * 12.92 : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055
  return Math.max(0, Math.min(255, Math.round(c * 255)))
}

/**
 * `oklch(L% C H)` → RGB sRGB 0–255, theo công thức OKLab của Björn Ottosson.
 *
 * Lưu ý về GAMUT: Tailwind 4 chọn màu trong không gian rộng hơn sRGB, nên một số màu quy đổi
 * ra ngoài sRGB. Ở đây kẹp về biên sRGB — đúng với thứ trình duyệt thật hiển thị trên màn hình
 * sRGB, tức đúng với thứ WCAG đo.
 */
export function oklchToRgb(l: number, c: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)

  // OKLab → LMS (khối lập phương)
  const lCube = l + 0.3963377774 * a + 0.2158037573 * b
  const mCube = l - 0.1055613458 * a - 0.0638541728 * b
  const sCube = l - 0.0894841775 * a - 1.291485548 * b
  const lms: [number, number, number] = [lCube ** 3, mCube ** 3, sCube ** 3]

  // LMS → sRGB tuyến tính
  const [L, M, S] = lms
  const rLin = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S
  const gLin = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S
  const bLin = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S

  return [encodeSrgbChannel(rLin), encodeSrgbChannel(gLin), encodeSrgbChannel(bLin)]
}

/**
 * Đọc MỘT giá trị màu CSS của bảng màu Tailwind thành RGB.
 *
 * Hỗ trợ: `#rrggbb` / `#rgb` (Tailwind 3), `oklch(L% C H)` (Tailwind 4), `rgb(r g b)`.
 * Trả `null` khi KHÔNG đọc được — và chỗ gọi phải coi `null` là LỖI CẦN BÁO, không được lặng lẽ
 * bỏ qua (xem ghi chú đầu mục này).
 */
export function parseCssColor(raw: string): Rgb | null {
  const s = raw.trim().toLowerCase()

  const hex6 = /^#?([0-9a-f]{6})$/.exec(s)
  if (hex6) {
    const n = parseInt(hex6[1] as string, 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }

  const hex3 = /^#([0-9a-f]{3})$/.exec(s)
  if (hex3) {
    const d = hex3[1] as string
    const dup = (ch: string): number => parseInt(ch + ch, 16)
    return [dup(d[0] as string), dup(d[1] as string), dup(d[2] as string)]
  }

  // oklch(55.5% 0.163 48.998) — L có thể là % hoặc số 0…1; bỏ qua phần alpha `/ .5` nếu có.
  //
  // `none` là từ khoá HỢP LỆ của CSS Color 4 cho một thành phần bị khuyết, và Tailwind 4 dùng nó
  // thật cho các màu VÔ SẮC: `oklch(98.5% 0 none)` (thang neutral) — hue không có ý nghĩa khi
  // chroma = 0. Quy về 0 là đúng. Bỏ sót ca này thì 11 bậc `neutral-*` không đọc được; test canh
  // `contrast.test.ts` đã bắt đúng nó lúc nâng Tailwind 4, trước khi nó kịp gây hại.
  const num = String.raw`(?:[\d.]+|none)`
  const okl = new RegExp(
    String.raw`^oklch\(\s*(${num})(%?)\s+(${num})\s+(${num})(?:deg)?\s*(?:\/.*)?\)$`,
  ).exec(s)
  if (okl) {
    const part = (v: string | undefined): number =>
      v === 'none' || v === undefined ? 0 : Number(v)
    const lRaw = part(okl[1])
    const l = okl[2] === '%' ? lRaw / 100 : lRaw
    return oklchToRgb(l, part(okl[3]), part(okl[4]))
  }

  const rgbFn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/].*)?\)$/.exec(s)
  if (rgbFn) {
    return [
      Math.round(Number(rgbFn[1])),
      Math.round(Number(rgbFn[2])),
      Math.round(Number(rgbFn[3])),
    ]
  }

  return null
}
