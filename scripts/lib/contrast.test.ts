// Cổng CHẶN: bộ đọc màu của cổng tương phản phải hiểu ĐƯỢC bảng màu Tailwind đang cài.
//
// VÌ SAO CẦN (2026-09-22): `fixed-color-contrast-audit` đọc bảng màu thẳng từ gói đang cài
// (`import colors from 'tailwindcss/colors'`) rồi bỏ qua màu nào không đọc được. Tailwind 3 khai
// hex, Tailwind 4 khai `oklch(...)`. Nếu bộ đọc chỉ hiểu hex thì khi nâng Tailwind 4, MỌI màu
// trả `null`, audit bỏ qua im lặng ~4.141 chỗ và cổng vẫn xanh — "máy canh trống", đúng loại lỗi
// audit 2026-09-05 (F1) đã bắt được với jsx-a11y.
//
// Test này là thứ chặn điều đó: nó không đo tương phản, nó đo rằng CỔNG CÒN ĐỌC ĐƯỢC MÀU. Bảng
// màu đổi định dạng lần nữa (v5, hay `color(display-p3 …)`) thì test ĐỎ ngay, có tên nhãn cụ thể.
import { describe, expect, it } from 'vitest'
import colors from 'tailwindcss/colors'
import { contrastRatio, oklchToRgb, parseCssColor } from './contrast.js'
import { FIXED_FAMILIES, PALETTE_STEPS } from '../fixed-color-contrast-audit.js'

describe('parseCssColor', () => {
  it('đọc hex 6 ký tự', () => {
    expect(parseCssColor('#b45309')).toEqual([180, 83, 9])
    expect(parseCssColor('b45309')).toEqual([180, 83, 9])
  })

  it('đọc hex 3 ký tự', () => {
    expect(parseCssColor('#fff')).toEqual([255, 255, 255])
    expect(parseCssColor('#000')).toEqual([0, 0, 0])
  })

  it('đọc rgb()', () => {
    expect(parseCssColor('rgb(180 83 9)')).toEqual([180, 83, 9])
    expect(parseCssColor('rgba(180, 83, 9, 0.5)')).toEqual([180, 83, 9])
  })

  it('trả null khi KHÔNG đọc được — chỗ gọi phải coi là lỗi, không bỏ qua', () => {
    expect(parseCssColor('color(display-p3 1 0 0)')).toBeNull()
    expect(parseCssColor('var(--x)')).toBeNull()
    expect(parseCssColor('')).toBeNull()
  })
})

describe('oklch → sRGB', () => {
  // Ba mốc kiểm chứng được độc lập, không cần tin bảng tra nào: trục L với C=0 là thang xám.
  it('đen và trắng tuyệt đối', () => {
    expect(parseCssColor('oklch(0% 0 0)')).toEqual([0, 0, 0])
    expect(parseCssColor('oklch(100% 0 0)')).toEqual([255, 255, 255])
  })

  it('C=0 luôn cho xám trung tính (ba kênh bằng nhau)', () => {
    for (const l of [20, 40, 50, 60, 80]) {
      const [r, g, b] = parseCssColor(`oklch(${l}% 0 0)`) as [number, number, number]
      expect(Math.abs(r - g)).toBeLessThanOrEqual(1)
      expect(Math.abs(g - b)).toBeLessThanOrEqual(1)
    }
  })

  it('L tăng thì độ sáng tăng đơn điệu', () => {
    const lums = [10, 30, 50, 70, 90].map((l) => {
      const rgb = parseCssColor(`oklch(${l}% 0 0)`) as [number, number, number]
      return rgb[0]
    })
    for (let i = 1; i < lums.length; i++) {
      expect(lums[i] as number).toBeGreaterThan(lums[i - 1] as number)
    }
  })

  it('nhận L dạng số 0…1 lẫn dạng phần trăm', () => {
    expect(parseCssColor('oklch(0.5 0 0)')).toEqual(parseCssColor('oklch(50% 0 0)'))
  })

  it('nhận từ khoá `none` cho thành phần khuyết (Tailwind 4 dùng thật cho thang neutral)', () => {
    // `oklch(98.5% 0 none)` — hue là `none` vì chroma = 0 thì hue vô nghĩa. Đây là ca mà bản đầu
    // của parseCssColor BỎ SÓT, và test canh bên dưới đã bắt được lúc nâng Tailwind 4.
    expect(parseCssColor('oklch(98.5% 0 none)')).toEqual(parseCssColor('oklch(98.5% 0 0)'))
    expect(parseCssColor('oklch(14.5% 0 none)')).toEqual(parseCssColor('oklch(14.5% 0 0)'))
    expect(parseCssColor('oklch(50% none none)')).toEqual(parseCssColor('oklch(50% 0 0)'))
  })

  it('bỏ qua phần alpha', () => {
    expect(parseCssColor('oklch(55.5% 0.163 48.998 / 0.4)')).toEqual(
      parseCssColor('oklch(55.5% 0.163 48.998)'),
    )
  })

  it('oklch của Tailwind 4 ra màu gần hex cùng nhãn của Tailwind 3', () => {
    // Bảng màu v4 KHÔNG trùng v3 (v4 chọn trong gamut rộng hơn), nhưng cùng nhãn thì phải ra
    // màu nhận ra được là "cùng một màu". Dung sai rộng: đây là kiểm phép quy đổi không bị sai
    // công thức (đảo kênh, lệch gamma), không phải kiểm hai bảng màu trùng khớp.
    const cases: [string, string, string][] = [
      ['amber-700', 'oklch(55.5% 0.163 48.998)', '#b45309'],
      ['emerald-700', 'oklch(50.8% 0.118 165.612)', '#047857'],
    ]
    for (const [name, v4, v3] of cases) {
      const a = parseCssColor(v4) as [number, number, number]
      const b = parseCssColor(v3) as [number, number, number]
      // Tương phản giữa hai bản của cùng một nhãn phải rất thấp (tức hai màu rất gần nhau).
      expect(
        contrastRatio(a, b),
        `${name}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`,
      ).toBeLessThan(1.6)
    }
  })

  it('kẹp về biên sRGB thay vì trả số ngoài khoảng', () => {
    // Màu bão hoà mạnh ngoài gamut sRGB: mọi kênh vẫn phải nằm trong 0…255 và là số nguyên.
    const rgb = oklchToRgb(0.7, 0.4, 150)
    for (const ch of rgb) {
      expect(Number.isInteger(ch)).toBe(true)
      expect(ch).toBeGreaterThanOrEqual(0)
      expect(ch).toBeLessThanOrEqual(255)
    }
  })
})

describe('bảng màu Tailwind ĐANG CÀI đọc được hết', () => {
  // Đây là test quan trọng nhất file này: nó buộc cổng tương phản không bao giờ rơi vào trạng
  // thái "không đọc được màu nào nên không thấy vi phạm nào".
  it('mọi họ màu × mọi bậc mà audit dùng đều quy đổi ra RGB', () => {
    const palette = colors as unknown as Record<string, Record<string, string>>
    const unreadable: string[] = []
    let readable = 0

    for (const family of FIXED_FAMILIES) {
      const fam = palette[family]
      if (!fam) {
        unreadable.push(`${family}: KHÔNG CÓ trong bảng màu`)
        continue
      }
      for (const step of PALETTE_STEPS) {
        const raw = fam[step]
        if (typeof raw !== 'string') {
          unreadable.push(`${family}-${step}: không phải chuỗi (${typeof raw})`)
          continue
        }
        if (parseCssColor(raw) === null) {
          unreadable.push(`${family}-${step}: không đọc được "${raw}"`)
          continue
        }
        readable++
      }
    }

    expect(
      unreadable,
      `Cổng tương phản KHÔNG đọc được ${unreadable.length} màu của bảng màu Tailwind đang cài.\n` +
        `Nghĩa là audit sẽ BỎ QUA IM LẶNG những chỗ dùng chúng và báo xanh dù chưa kiểm gì.\n` +
        `Sửa parseCssColor() ở scripts/lib/contrast.ts để hiểu định dạng mới, ĐỪNG nới test này.\n` +
        `Vài ví dụ: ${unreadable.slice(0, 8).join(' · ')}`,
    ).toEqual([])

    // Chốt hạ: phải đọc được một lượng màu hợp lý, không phải 0 rồi "xanh vì rỗng".
    expect(readable).toBeGreaterThan(50)
  })
})
