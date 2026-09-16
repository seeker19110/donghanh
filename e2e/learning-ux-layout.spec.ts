import { test, expect } from '@playwright/test'
import { LEARNING_UX_SCREENS, WIDTHS, HEIGHTS, moManHinh } from './helpers/learningUxScreens'

// ──────────────────────────────────────────────────────────────────────────────
// CỔNG BỐ CỤC 4 BỀ RỘNG (spec S13 AC-3) — cái CI hiện KHÔNG có ở 768/1440.
//
// `mobile-layout-guards.spec.ts` chỉ canh 390/320. Ba lỗi lặp nội dung của
// PR #861–#863 nằm ở 1440 và không cổng nào bắt được: chúng chỉ lộ khi NHÌN ảnh.
// Năm phép đo dưới đây là phần lộ được bằng SỐ của Tầng 8b — phần còn lại vẫn
// phải nhìn ảnh (script `shots:learning-ux`).
//
// Tất cả đo ở trạng thái `data`, theme mặc định. Mỗi `expect` có thông điệp nói
// rõ MÀN + BỀ RỘNG để log CI đọc được mà không cần mở trace.
// ──────────────────────────────────────────────────────────────────────────────

// Ngưỡng khởi điểm, cố ý nới (spec §8): phép đo ký tự/dòng là ƯỚC LƯỢNG
// (0,5em/ký tự), nên siết quá sớm sẽ tạo cổng đỏ giả. Số thật ghi vào changelog.
const NGUONG_KY_TU_MOI_DONG = 80
const TOI_DA_VI_PHAM_MOI_MAN = 3
const TI_LE_CHIEU_CAO_TOI_DA = 4

// ── BASELINE ĐO THẬT trên `main` 82ed2e88 (2026-09-16, S13-1) ────────────────
//
// Cổng này ĐỎ NGAY trên mã hiện tại — đó là bằng chứng nó đo được thật (khuôn
// PR #923), KHÔNG phải cớ để nới ngưỡng. Nhưng S13-1 là PR CÔNG CỤ: sửa giao
// diện là việc của S13-2 (spec §9 mục 2). Nên ở đây ghi lại ĐÚNG SỐ ĐÃ ĐO và
// cổng chạy theo kiểu BÁNH CÓC: không được tệ hơn số này, và hễ tốt hơn thì test
// BÁO ĐỎ để buộc hạ baseline (nếu không, bảng này mục ruỗng trong im lặng).
//
// Mỗi dòng dưới đây là MỘT mục việc của S13-2. Xoá dòng = đã sửa xong.
const BASELINE_KY_TU: Record<string, number> = {
  'today@768': 10,
  'today@1440': 8,
  'outline@768': 8,
  'outline@1440': 8,
  'lesson@768': 12,
  'lesson@1440': 12,
  'result@768': 27,
  'result@1440': 27,
  'progress@768': 8,
  'progress@1440': 6,
}

// Hiện KHÔNG màn nào lệch khỏi "đúng 1 `<h1>`" — bảng để rỗng chứ không xoá, vì
// nó là chỗ ghi nợ khi S13-2 gặp ca không sửa ngay được.
//
// Lượt đo đầu (2026-09-16) tưởng Trang chủ có 0 `<h1>` ở 320/390. Đó là ẢO GIÁC DO
// MOCK SAI ĐỊA CHỈ (`/api/learning/*` thay vì `/api/programming/progress`): trang
// rơi vào nhánh "Chưa tải được tiến độ" và không dựng tiêu đề. Sửa mock xong thì
// số về 1. Bài học: cổng đỏ vì mock sai cũng là cổng đỏ giả — phải truy tới gốc.
const BASELINE_H1: Record<string, number> = {}

for (const man of LEARNING_UX_SCREENS) {
  for (const w of WIDTHS) {
    test(`bố cục ${man.id} @ ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: HEIGHTS[w] })
      const mo = await moManHinh(page, man, 'data')
      expect(mo, `màn ${man.id} không có trạng thái "data" — không thể đo bố cục`).toBe(true)

      // 1. Không cuộn ngang. Cộng 1px dung sai cho làm tròn subpixel của Chromium.
      const doRong = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        inner: window.innerWidth,
      }))
      expect(
        doRong.scroll,
        `[${man.id} @ ${w}px] cuộn ngang: scrollWidth ${doRong.scroll} > innerWidth ${doRong.inner}`,
      ).toBeLessThanOrEqual(doRong.inner + 1)

      // 2. ĐÚNG MỘT `<h1>` hiển thị (lỗi lặp tiêu đề của PR #861–#863).
      const soH1 = await page.evaluate(
        () =>
          [...document.querySelectorAll('h1')].filter((el) => {
            const r = el.getBoundingClientRect()
            return r.width > 0 && r.height > 0
          }).length,
      )
      const key = `${man.id}@${w}`
      if (key in BASELINE_H1) {
        expect(
          soH1,
          `[${key}] baseline S13-1 ghi ${BASELINE_H1[key]} <h1>; nay đo ${soH1}. Nếu ĐÃ SỬA (=1) thì xoá dòng "${key}" khỏi BASELINE_H1.`,
        ).toBe(BASELINE_H1[key])
      } else {
        expect(soH1, `[${key}] số <h1> hiển thị = ${soH1}, phải đúng 1`).toBe(1)
      }

      // 3. CTA chính nằm trong màn hình đầu ở 1440 (Tầng 8b câu 3).
      if (w === 1440) {
        const cta = page.locator(man.primaryCta).first()
        if (await cta.count()) {
          const hop = await cta.boundingBox()
          expect(hop, `[${man.id} @ 1440] không đo được CTA "${man.primaryCta}"`).not.toBeNull()
          const day = (hop?.y ?? 0) + (hop?.height ?? 0)
          expect(
            day,
            `[${man.id} @ 1440] CTA chính chạm đáy ở ${Math.round(day)}px, ngoài màn hình đầu (900px)`,
          ).toBeLessThanOrEqual(HEIGHTS[1440])
        }
      }

      // 4. Đoạn văn không quá ~80 ký tự/dòng ở ≥ 768 (spec nền: 60–75).
      if (w >= 768) {
        const viPham = await page.evaluate(() => {
          const ra: number[] = []
          for (const p of document.querySelectorAll('main p')) {
            const r = p.getBoundingClientRect()
            if (r.width < 40 || !p.textContent?.trim()) continue
            const fs = parseFloat(getComputedStyle(p).fontSize) || 16
            ra.push(Math.round(r.width / (fs * 0.5)))
          }
          return ra
        })
        const qua = viPham.filter((n) => n > NGUONG_KY_TU_MOI_DONG)
        const nen = BASELINE_KY_TU[key]
        if (nen === undefined) {
          expect(
            qua.length,
            `[${key}] ${qua.length} đoạn > ${NGUONG_KY_TU_MOI_DONG} ký tự/dòng (đo: ${qua.join(', ')})`,
          ).toBeLessThanOrEqual(TOI_DA_VI_PHAM_MOI_MAN)
        } else {
          // Bánh cóc: không tệ hơn baseline, và tốt hơn thì phải hạ baseline xuống.
          expect(
            qua.length,
            `[${key}] baseline S13-1 = ${nen} đoạn quá dài; nay đo ${qua.length} (${qua.join(', ')}). Tệ hơn → hồi quy; tốt hơn → sửa số trong BASELINE_KY_TU (còn ≤ ${TOI_DA_VI_PHAM_MOI_MAN} thì xoá hẳn dòng "${key}").`,
          ).toBe(nen)
        }
      }

      // 5. Trang không dài vô tận, HOẶC có mục lục/đường tắt để nhảy (Tầng 8b câu 2).
      const cao = await page.evaluate(() => ({
        trang: document.documentElement.scrollHeight,
        khung: window.innerHeight,
      }))
      const tiLe = cao.trang / cao.khung
      if (tiLe > TI_LE_CHIEU_CAO_TOI_DA) {
        const coMucLuc = await page.locator('nav[aria-label]').count()
        expect(
          coMucLuc,
          `[${man.id} @ ${w}px] trang cao gấp ${tiLe.toFixed(1)} lần khung nhìn mà không có nav[aria-label] để nhảy`,
        ).toBeGreaterThan(0)
      }
    })
  }
}
