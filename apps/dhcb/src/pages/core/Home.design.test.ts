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
    // [P1-8] Phần MÔN đã tách sang SubjectSpaceList.tsx (dùng SUBJECT_ENTRIES ở đó) — Home.tsx
    // chỉ còn gọi component đó và khai tay thẻ Sự nghiệp/Khởi nghiệp & Đời sống (không phải môn).
    expect(src).toContain('<SubjectSpaceList')
    const subjectSpaceListSrc = readFileSync(
      join(__dirname, '../../components/Home/SubjectSpaceList.tsx'),
      'utf8',
    )
    expect(subjectSpaceListSrc).toContain("from '@dhcb/core-learner/subjectEntry'")
    expect(subjectSpaceListSrc).toContain('orderSubjects(SUBJECT_ENTRIES')
    // Thẻ Sự nghiệp/Khởi nghiệp & Đời sống KHÔNG phải môn học — vẫn khai tay, giữ nguyên.
    expect(src).toContain("id: 'career-life'")
  })
})
