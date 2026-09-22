// scripts/shots-freeze-animations.test.ts — Chốt chặn: `moManHinh` phải đóng băng animation
// TRƯỚC KHI trả về, đúng thứ tự `scan()` ở `e2e/a11y.spec.ts` dùng.
//
// VÌ SAO CẦN (2026-09-22, đợt 0416): `moManHinh` (dùng chung bởi cổng bố cục VÀ script chụp ảnh
// `scripts/shots-learning-ux.ts`) từng thiếu bước `freezeAnimations()` mà `e2e/a11y.spec.ts`
// đã có sẵn từ trước — comment ngay tại chỗ định nghĩa hàm đó ghi rõ lý do: "không bắt nhằm
// khung giữa của `animate-fade-in` (opacity 0→1)". Thiếu bước này, `waitForStableDom` (chỉ đếm
// SỐ PHẦN TỬ) coi trang là "xong" ngay khi DOM ngừng thêm/bớt node — nhưng animation CSS không
// đổi số node, nên ảnh có thể chụp đúng lúc `animate-fade-in`/`fade-up` còn ở giữa quãng.
//
// Hậu quả đo được thật: đối chiếu Tầng 8b của đợt 0416 (React 19 + Tailwind 4 + Vite 8 so với
// `main`) báo LỆCH chiều cao trang 16-24px và độ mờ khác nhau — CHỈ ở ba màn có phần tử
// `animate-*` (`today`, `outline`, `tutor`), 0 lệch ở ba màn còn lại. Không phải hồi quy bố cục
// của bản nâng cấp: đó là chính công cụ đo bắt được thời điểm khác nhau của một animation chưa
// đóng băng. `e2e/a11y.spec.ts` không dính bẫy này đúng vì nó gọi `freezeAnimations` — script
// chụp ảnh không gọi nên dính. Test này canh cho hai nơi ĐỒNG NHẤT cách chờ.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function read(relPath: string): string {
  return readFileSync(join(process.cwd(), relPath), 'utf-8')
}

describe('moManHinh (dùng chung bởi cổng bố cục + shots-learning-ux) đóng băng animation', () => {
  const src = read('e2e/helpers/learningUxScreens.ts')

  it('gọi freezeAnimations trước khi trả về', () => {
    expect(src).toContain('freezeAnimations(page)')
  })

  it('freezeAnimations chạy SAU waitForStableDom, không phải trước', () => {
    // Thứ tự đúng: chờ DOM có đủ node trước, rồi mới đóng băng animation của những node đó.
    // Đảo ngược thứ tự vẫn "gọi được hàm" nên chỉ kiểm nội dung là chưa đủ — phải kiểm vị trí.
    const iStable = src.lastIndexOf('waitForStableDom(page)')
    const iFreeze = src.indexOf('freezeAnimations(page)')
    expect(iStable).toBeGreaterThan(-1)
    expect(iFreeze).toBeGreaterThan(iStable)
  })

  it('nhập freezeAnimations từ cùng module với waitForStableDom (./axe)', () => {
    expect(src).toMatch(
      /import\s*\{\s*freezeAnimations,\s*waitForStableDom\s*\}\s*from\s*'\.\/axe'/,
    )
  })
})
