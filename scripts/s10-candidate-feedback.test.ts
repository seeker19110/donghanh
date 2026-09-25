// Cổng S10b — docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §3.1.
// (1) Bộ 40 mẫu toàn vẹn và KHÔNG mang điểm/người duyệt khi chưa có chuyên gia.
// (2) `candidate-feedback.json` đã commit khớp bản dựng lại từ mã nguồn hiện tại — đổi nội dung
//     bài hay chữ phản hồi mà không sinh lại là đỏ ("thay nội dung phải đo lại" của goal).
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildCandidateFeedback, kiemToanVen, type Rubric } from './lib/s10CandidateFeedback.js'
import { OUT_PATH, RUBRIC_PATH, type CandidateFile } from './s10-candidate-feedback.js'
import { PARSONS_COPY, STEM_CHECK_COPY } from '../apps/dhcb/src/lib/feedbackCopy.js'

const rubric = JSON.parse(readFileSync(RUBRIC_PATH, 'utf8')) as Rubric
const committed = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as CandidateFile
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T

describe('S10b — bộ 40 mẫu', () => {
  it('toàn vẹn: 12/16/8/4, id duy nhất, WAITING không mang điểm/người duyệt', () => {
    expect(kiemToanVen(rubric)).toEqual([])
  })

  it('negative control: gắn điểm vào ca WAITING / bớt một ca → báo lỗi', () => {
    const gia = clone(rubric)
    gia.cases[0]!.scores = { kienThuc: 2 }
    expect(kiemToanVen(gia).some((l) => l.includes('WAITING nhưng đã có scores'))).toBe(true)
    const thieu = clone(rubric)
    thieu.cases.pop()
    expect(kiemToanVen(thieu).length).toBeGreaterThan(0)
  })
})

describe('S10b — phản hồi ứng viên', () => {
  const moi = buildCandidateFeedback(rubric)

  it('bản đã commit khớp mã nguồn hiện tại (sinh lại: npx tsx scripts/s10-candidate-feedback.ts)', () => {
    expect(committed.cases).toEqual(moi)
  })

  it('negative control: sửa một feedbackText trong bản commit → không còn khớp', () => {
    const sua = clone(committed.cases)
    const ca = sua.find((c) => c.feedbackText !== null)!
    ca.feedbackText = `${ca.feedbackText} (sửa tay)`
    expect(sua).not.toEqual(moi)
  })

  it('mỗi ca có đúng một đường; chỉ APP_FEEDBACK/BLOCKED mới có chữ, còn lại có lý do', () => {
    expect(moi.map((c) => c.caseId)).toEqual(rubric.cases.map((c) => c.id))
    for (const c of moi) {
      if (c.pathKind === 'APP_FEEDBACK' || c.pathKind === 'BLOCKED_UNANSWERED') {
        expect(c.feedbackText, c.caseId).toBeTruthy()
      } else {
        expect(c.feedbackText, c.caseId).toBeNull()
        expect(c.note, c.caseId).toBeTruthy()
      }
    }
    // English phụ thuộc AI — không bao giờ tự bịa chữ ở đây.
    expect(
      moi.filter((c) => c.group === 'english').every((c) => c.pathKind === 'NEEDS_PROVIDER_RUN'),
    ).toBe(true)
  })

  it('chữ lấy từ nguồn chung với component, chấm theo đáp án thật của bài', () => {
    const r13 = moi.find((c) => c.caseId === 'R13')! // toán: chọn "a" = đúng
    const r14 = moi.find((c) => c.caseId === 'R14')! // toán: chọn "b" = sai
    expect(r13.feedbackText!.startsWith(STEM_CHECK_COPY.dung)).toBe(true)
    expect(r14.feedbackText!.startsWith(STEM_CHECK_COPY.sai)).toBe(true)
    expect(moi.find((c) => c.caseId === 'R34')!.feedbackText).toBe(PARSONS_COPY.sai)
  })

  it('nguồn lạ trong rubric → ném lỗi, không bỏ qua im lặng', () => {
    const gia = clone(rubric)
    gia.cases.find((c) => c.id === 'R14')!.input = 'khong-co-lua-chon-nay'
    expect(() => buildCandidateFeedback(gia)).toThrow(/không có trong câu/)
  })
})
