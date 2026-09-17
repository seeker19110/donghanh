// apps/dhcb/src/lib/session/sessionFact.ts — Hàm THUẦN dựng "một sự thật" của phiên học vừa
// xong, dùng cho `SessionDone` (P1-6, lệnh 8).
//
// Đặc tả: docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P1-6 ③.
//
// Luật SẢN PHẨM (bất biến, có test canh — xem `sessionFact.test.ts`):
//   - `lead` LUÔN chứa một số đếm việc đã làm THẬT (bước/câu/thẻ) — không suy diễn, không AI.
//   - `lead` KHÔNG được có "%", "band", "trình độ" — đây là trang mừng, không phải chẩn đoán.
//   - `lead` KHÔNG được kết thúc bằng câu cảm thán trống rỗng "Tuyệt vời!" (không kèm số liệu).
//   - `detail` chỉ xuất hiện khi có `newItems` (đã lọc, ≤ 3 phần tử ở nơi gọi).
export interface SessionOutcome {
  subjectId: string
  contentId: string
  kind: 'lesson' | 'quiz' | 'speaking' | 'writing' | 'review' | 'project-step'
  steps: number // số bước đã làm
  correct?: number // số câu đúng (quiz/review)
  total?: number
  newItems?: string[] // từ/khái niệm lần đầu đúng (≤ 3, đã lọc)
  durationSec: number
}

export interface SessionFact {
  lead: string // "Xong rồi! Bạn vừa nói được 5 câu."
  detail?: string // "'I'd love to' là lần đầu bạn dùng đúng."
}

// Đơn vị đếm theo `kind` — tự nhiên với người học, không dùng chung một chữ "bước" cho mọi loại.
function countUnit(kind: SessionOutcome['kind'], steps: number): string {
  const plural = steps === 1 ? '' : ''
  switch (kind) {
    case 'lesson':
      return `${steps} thẻ${plural}`
    case 'quiz':
      return `${steps} câu`
    case 'speaking':
      return `${steps} câu`
    case 'writing':
      return `${steps} đoạn`
    case 'review':
      return `${steps} thẻ`
    case 'project-step':
      return `${steps} bước`
  }
}

function buildLead(o: SessionOutcome): string {
  const unit = countUnit(o.kind, o.steps)
  if (
    (o.kind === 'quiz' || o.kind === 'review') &&
    typeof o.correct === 'number' &&
    typeof o.total === 'number' &&
    o.total > 0
  ) {
    return `Xong rồi! Bạn vừa làm đúng ${o.correct}/${o.total} câu.`
  }
  if (o.kind === 'speaking') return `Xong rồi! Bạn vừa nói được ${unit}.`
  if (o.kind === 'writing') return `Xong rồi! Bạn vừa viết được ${unit}.`
  if (o.kind === 'project-step') return `Xong rồi! Bạn vừa hoàn thành ${unit}.`
  return `Xong rồi! Bạn vừa học được ${unit}.`
}

function buildDetail(newItems: string[] | undefined): string | undefined {
  if (!newItems || newItems.length === 0) return undefined
  const first = newItems[0]
  if (newItems.length === 1) return `'${first}' là lần đầu bạn dùng đúng.`
  return `'${first}' và ${newItems.length - 1} mục khác là lần đầu bạn dùng đúng.`
}

export function buildSessionFact(o: SessionOutcome): SessionFact {
  return {
    lead: buildLead(o),
    detail: buildDetail(o.newItems),
  }
}
