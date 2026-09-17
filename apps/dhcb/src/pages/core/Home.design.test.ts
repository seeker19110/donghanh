// apps/dhcb/src/pages/core/Home.design.test.ts — Cổng canh trang chủ không quay lại kiểu landing page.
//
// Home.tsx kéo theo auth + cloud sync + loader dữ liệu CEFR nên render thật rất nặng; thứ cần canh
// ở đây lại thuần là LỚP TRÌNH BÀY, nên đọc thẳng mã nguồn là đủ và rẻ. Đợt C (2026-09-03) đã
// gỡ: icon gradient + bóng màu, huy hiệu quảng cáo ("Vision OCR", "Life OS"), nhãn HOA nhỏ giãn
// chữ, và banner thứ ba dẫn tới /ban-dong-hanh. Danh sách dưới là những mẫu KHÔNG được sinh lại.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const src = readFileSync(join(__dirname, 'Home.tsx'), 'utf8')

describe('Home.tsx — trình bày tập trung (đợt C)', () => {
  it.each([
    ['bg-gradient-', 'icon/nền gradient'],
    ['shadow-emerald-', 'bóng màu'],
    ['shadow-blue-', 'bóng màu'],
    ['shadow-purple-', 'bóng màu'],
    ['shadow-accent-', 'bóng màu'],
    ['uppercase tracking-wider', 'nhãn HOA nhỏ giãn chữ (kicker)'],
    ['animate-ping', 'chấm nhấp nháy vĩnh viễn'],
    ['text-[11px]', 'chữ sát sàn 11px cho nhãn có chức năng'],
    ['Vision OCR', 'huy hiệu quảng cáo'],
    ['Life OS', 'huy hiệu quảng cáo'],
  ])('không chứa "%s" (%s)', (pattern) => {
    expect(src).not.toContain(pattern)
  })

  it('chỉ còn MỘT lối vào /ban-dong-hanh từ thân trang (banner riêng đã gỡ; header đã có nút)', () => {
    expect(src.match(/\/ban-dong-hanh/g) ?? []).toHaveLength(0)
  })

  it('không gian bộ môn dựng từ SUBJECT_ENTRIES (một nguồn với hub, S05-2), không viết tay từng thẻ môn', () => {
    expect(src).toContain('spaces.map(')
    expect(src).toContain("from '@dhcb/core-learner/subjectEntry'")
    expect(src).toContain('SUBJECT_ENTRIES.map(')
    // Thẻ Sự nghiệp/Khởi nghiệp & Đời sống KHÔNG phải môn học — vẫn khai tay, giữ nguyên.
    expect(src).toContain("id: 'career-life'")
  })
})

// [P0-1] Canh thứ tự khối: `pickHomeBanner` chọn ĐÚNG MỘT banner phụ, và mọi banner phụ đứng
// SAU khối "Bộ môn & không gian" trong mã nguồn nhánh mobile (nhánh render 1 cột — bố cục thấy
// trên di động, nơi thứ tự khối thật sự ảnh hưởng tới trải nghiệm cuộn).
describe('Home.tsx — P0-1: đúng MỘT banner phụ, đứng dưới phần môn', () => {
  it('gọi pickHomeBanner đúng một lần để chọn banner, không tự hiện nhiều banner cùng lúc', () => {
    expect(src).toContain('pickHomeBanner(')
    expect(src.match(/pickHomeBanner\(/g) ?? []).toHaveLength(1)
  })

  it('nhánh mobile: {spacesSection} đứng TRƯỚC {!isDesktop && homeBannerNode} trong mã nguồn', () => {
    const idxSpaces = src.indexOf('{spacesSection}')
    const idxBanner = src.indexOf('{!isDesktop && homeBannerNode}')
    expect(idxSpaces).toBeGreaterThan(-1)
    expect(idxBanner).toBeGreaterThan(-1)
    expect(idxSpaces).toBeLessThan(idxBanner)
  })

  it('không còn hiện RewardTipBanner/PricePromoBanner độc lập ngoài homeBannerNode (tránh 2 banner cùng lúc)', () => {
    // Trước P0-1: `{!isDesktop && rewardTip}` đứng ngay dưới `{topBlocks}`, TRƯỚC {spacesSection}.
    expect(src).not.toContain('{!isDesktop && rewardTip}')
    expect(src).not.toContain('{rewardTip}')
  })
})
