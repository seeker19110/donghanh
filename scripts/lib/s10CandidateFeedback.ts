// s10CandidateFeedback — dựng lại NGUYÊN VĂN phản hồi app đang hiện cho từng ca của bộ 40 mẫu
// S10 (`docs/ux-upgrade/s09-s12/rubric-40.json`), để chuyên gia có "phản hồi ứng viên" mà chấm.
//
// Đặc tả: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §3.1 (S10b).
//
// Nguyên tắc:
//  - Chữ phản hồi đọc từ `apps/dhcb/src/lib/feedbackCopy.ts` (cùng nguồn với component) và nội
//    dung bài đọc từ package bài học thật — KHÔNG chép chuỗi vào đây.
//  - Ca nào app KHÔNG có đường phản hồi thì ghi `pathKind` + lý do, `feedbackText: null`.
//    Không bịa chữ để lấp ô trống.
//  - KHÔNG chấm. Không đụng `status/scores/reviewer` của rubric.
import { gradeAnswer } from '../../packages/core-grading/index.js'
import type { StemCheckQuestion } from '../../packages/core-contracts/stemLesson.js'
import { TOAN10_C1_LESSONS } from '../../packages/subject-math/lessons/toan10c1.js'
import { LY10_C1_LESSONS } from '../../packages/subject-physics/lessons/ly10c1.js'
import { HOA10_C1_LESSONS } from '../../packages/subject-chemistry/lessons/hoa10c1.js'
import { SINH10_C1_LESSONS } from '../../packages/subject-biology/lessons/sinh10c1.js'
import { P1U1_LESSONS } from '../../packages/subject-programming/lessons/p1u1.js'
import {
  PARSONS_COPY,
  PREDICT_COPY,
  STEM_CHECK_COPY,
  cauTongKetKetQua,
  type TongKetInput,
} from '../../apps/dhcb/src/lib/feedbackCopy.js'

export interface RubricCase {
  id: string
  group: 'english' | 'stem' | 'programming' | 'system'
  source: string
  question: string
  input: string
  expectedReason: string
  feedbackLanguage: string
  level: string
  mode: string
  reviewer: string | null
  reviewedAt: string | null
  status: string
  scores: unknown
  negativeControl: unknown
}

export interface Rubric {
  version: number
  baseSha: string
  notice: string
  cases: RubricCase[]
}

/**
 * - `APP_FEEDBACK`        — app hiện đúng chữ trong `feedbackText` cho input này.
 * - `BLOCKED_UNANSWERED`  — input rỗng: app không chấm, chỉ hiện dòng chặn nộp (`feedbackText`).
 * - `NEEDS_PROVIDER_RUN`  — phản hồi do AI sinh lúc chạy; cần chạy provider (trả phí) mới có.
 * - `NO_APP_GRADER`       — app không có bước nào chấm loại input này.
 * - `SYNTHETIC`           — ca biên tổng hợp, không có màn hình tương ứng trong app.
 */
export type PathKind =
  'APP_FEEDBACK' | 'BLOCKED_UNANSWERED' | 'NEEDS_PROVIDER_RUN' | 'NO_APP_GRADER' | 'SYNTHETIC'

export interface CandidateFeedback {
  caseId: string
  group: RubricCase['group']
  pathKind: PathKind
  /** Nguyên văn chữ người học đọc (các đoạn nối bằng xuống dòng); `null` khi không có. */
  feedbackText: string | null
  /** Nơi lấy chữ/nội dung — để chuyên gia đối chiếu. */
  sourceRefs: string[]
  /** Ghi chú trung lập cho người review (không phải điểm). */
  note: string | null
}

const COPY_REF = 'apps/dhcb/src/lib/feedbackCopy.ts'

/** Bài STEM theo file nguồn trong rubric → mảng bài của chương đó. */
const STEM_FILES: Record<
  string,
  ReadonlyArray<{ id: string; checkQuestions: StemCheckQuestion[] }>
> = {
  'packages/subject-math/lessons/toan10c1.ts': TOAN10_C1_LESSONS,
  'packages/subject-physics/lessons/ly10c1.ts': LY10_C1_LESSONS,
  'packages/subject-chemistry/lessons/hoa10c1.ts': HOA10_C1_LESSONS,
  'packages/subject-biology/lessons/sinh10c1.ts': SINH10_C1_LESSONS,
}

/**
 * Ca lập trình/hệ thống: CÁCH dựng phản hồi phải chọn theo nghĩa của ca (rubric ghi bằng lời),
 * nên khai tường minh — mỗi dòng nói ca đó đi qua màn nào của app.
 */
type Binding =
  | { kind: 'predict' }
  | { kind: 'parsons'; order: 'correct' | 'wrong' }
  | { kind: 'no-grader'; reason: string }
  | { kind: 'result'; input: TongKetInput }
  | { kind: 'synthetic'; reason: string }

/** Điểm minh hoạ cho câu tổng kết ca hệ thống — chỉ để có câu đầy đủ, không phải điểm thật. */
const DIEM_MINH_HOA = { correct: 2, total: 3 } as const

const NO_GRADER_WORKED =
  'Ví dụ mẫu (workedExample) chỉ để đọc/chạy thử; app không có bước chấm câu trả lời tự gõ loại này.'

export const BINDINGS: Readonly<Record<string, Binding>> = {
  R29: { kind: 'no-grader', reason: NO_GRADER_WORKED },
  R30: { kind: 'no-grader', reason: NO_GRADER_WORKED },
  R31: { kind: 'predict' },
  R32: { kind: 'predict' },
  // Đề Parsons p1-u1-l1: "in tên lớp, rồi in lời chào, rồi in môn học" = thứ tự `lines`.
  R33: { kind: 'parsons', order: 'correct' },
  R34: { kind: 'parsons', order: 'wrong' },
  R35: { kind: 'no-grader', reason: NO_GRADER_WORKED },
  R36: { kind: 'no-grader', reason: NO_GRADER_WORKED },
  R37: { kind: 'result', input: { status: 'pending', pendingReason: 'offline', ...DIEM_MINH_HOA } },
  R38: { kind: 'result', input: { status: 'pending', pendingReason: 'auth', ...DIEM_MINH_HOA } },
  R39: { kind: 'result', input: { status: 'error', ...DIEM_MINH_HOA } },
  R40: {
    kind: 'synthetic',
    reason:
      'Ca biên tổng hợp "chưa có phản hồi" — ActivityResult không có trạng thái thứ sáu; app không có màn hình tương ứng.',
  },
}

function lamRoi(msg: string): never {
  throw new Error(`[s10CandidateFeedback] ${msg}`)
}

function tachNguon(source: string): { file: string; frag: string } {
  const [file, frag = ''] = source.split('#')
  return { file: file!, frag }
}

function phanHoiStem(c: RubricCase): CandidateFeedback {
  const { file, frag } = tachNguon(c.source)
  const bai = STEM_FILES[file] ?? lamRoi(`${c.id}: không biết file STEM ${file}`)
  const m = /^checkQuestions\[(\d+)\]$/.exec(frag) ?? lamRoi(`${c.id}: nguồn lạ "${frag}"`)
  const qIndex = Number(m[1])
  // Bài ĐẦU TIÊN của chương có câu tự kiểm — ghi rõ mã bài vào sourceRefs để chuyên gia kiểm.
  const lesson =
    bai.find((l) => l.checkQuestions.length > qIndex) ?? lamRoi(`${c.id}: không có câu`)
  const cau = lesson.checkQuestions[qIndex]!
  const refs = [`${file}#${lesson.id}/checkQuestions[${qIndex}]`, COPY_REF]
  const [lua, ...giaiThich] = c.input.split(';')
  const raw = (lua ?? '').trim()
  if (!raw) {
    return {
      caseId: c.id,
      group: c.group,
      pathKind: 'BLOCKED_UNANSWERED',
      feedbackText: STEM_CHECK_COPY.chuaTraLoiHet(lesson.checkQuestions.length),
      sourceRefs: refs,
      note: 'Chưa chọn thì câu không được chấm; dòng này hiện dưới nút nộp (nút bị khoá).',
    }
  }
  if (cau.choices && !cau.choices.some((ch) => ch.id === raw)) {
    lamRoi(`${c.id}: lựa chọn "${raw}" không có trong câu ${lesson.id}[${qIndex}]`)
  }
  const dung = gradeAnswer(raw, cau.answer).correct
  return {
    caseId: c.id,
    group: c.group,
    pathKind: 'APP_FEEDBACK',
    feedbackText: [dung ? STEM_CHECK_COPY.dung : STEM_CHECK_COPY.sai, cau.explain].join('\n'),
    sourceRefs: refs,
    note:
      giaiThich.length > 0
        ? 'Câu trắc nghiệm: app chỉ nhận lựa chọn, KHÔNG nhận phần giải thích tự do của người học — phản hồi giống hệt ca chỉ chọn cùng đáp án.'
        : null,
  }
}

function phanHoiLapTrinh(c: RubricCase): CandidateFeedback {
  const bai = P1U1_LESSONS[0] ?? lamRoi('p1u1 rỗng')
  const b = BINDINGS[c.id] ?? lamRoi(`${c.id}: thiếu binding lập trình`)
  const file = tachNguon(c.source).file
  switch (b.kind) {
    case 'predict': {
      const idx = bai.predict.choices.indexOf(c.input)
      if (idx < 0) lamRoi(`${c.id}: "${c.input}" không khớp lựa chọn predict nào`)
      const dung = idx === bai.predict.answerIndex
      return {
        caseId: c.id,
        group: c.group,
        pathKind: 'APP_FEEDBACK',
        feedbackText: [dung ? PREDICT_COPY.dung : PREDICT_COPY.sai, bai.predict.explain].join('\n'),
        sourceRefs: [`${file}#${bai.id}/predict`, COPY_REF],
        note: null,
      }
    }
    case 'parsons':
      return {
        caseId: c.id,
        group: c.group,
        pathKind: 'APP_FEEDBACK',
        feedbackText: b.order === 'correct' ? PARSONS_COPY.dung : PARSONS_COPY.sai,
        sourceRefs: [`${file}#${bai.id}/parsons`, COPY_REF],
        note: 'Chữ phản hồi Xếp code là CỐ ĐỊNH cho mọi bài, không theo nội dung bài.',
      }
    case 'no-grader':
      return {
        caseId: c.id,
        group: c.group,
        pathKind: 'NO_APP_GRADER',
        feedbackText: null,
        sourceRefs: [`${file}#${bai.id}/workedExample`],
        note: b.reason,
      }
    default:
      return lamRoi(`${c.id}: binding ${b.kind} không dùng cho lập trình`)
  }
}

function phanHoiHeThong(c: RubricCase): CandidateFeedback {
  const b = BINDINGS[c.id] ?? lamRoi(`${c.id}: thiếu binding hệ thống`)
  if (b.kind === 'result') {
    return {
      caseId: c.id,
      group: c.group,
      pathKind: 'APP_FEEDBACK',
      feedbackText: cauTongKetKetQua(b.input),
      sourceRefs: [
        'apps/dhcb/src/components/learning/ActivityResult.tsx',
        `${COPY_REF}#cauTongKetKetQua`,
      ],
      note: `Trạng thái ${b.input.status}${b.input.pendingReason ? `/${b.input.pendingReason}` : ''}; điểm ${DIEM_MINH_HOA.correct}/${DIEM_MINH_HOA.total} chỉ để minh hoạ câu đầy đủ.`,
    }
  }
  if (b.kind === 'synthetic') {
    return {
      caseId: c.id,
      group: c.group,
      pathKind: 'SYNTHETIC',
      feedbackText: null,
      sourceRefs: [c.source],
      note: b.reason,
    }
  }
  return lamRoi(`${c.id}: binding ${b.kind} không dùng cho hệ thống`)
}

/** Dựng phản hồi ứng viên cho MỌI ca, đúng thứ tự rubric. Ném lỗi khi nguồn không khớp. */
export function buildCandidateFeedback(rubric: Rubric): CandidateFeedback[] {
  return rubric.cases.map((c) => {
    switch (c.group) {
      case 'english':
        return {
          caseId: c.id,
          group: c.group,
          pathKind: 'NEEDS_PROVIDER_RUN',
          feedbackText: null,
          sourceRefs: ['apps/dhcb/src/prompts/', 'apps/server/src/api (/api/agent)'],
          note: 'Phản hồi môn Anh do AI sinh lúc chạy; cần chạy provider (trả phí) theo prompt hiện hành mới có bản để chấm.',
        }
      case 'stem':
        return phanHoiStem(c)
      case 'programming':
        return phanHoiLapTrinh(c)
      case 'system':
        return phanHoiHeThong(c)
    }
  })
}

/** Số ca bắt buộc theo goal: 12 English · 16 STEM · 8 lập trình · 4 hệ thống. */
export const PHAN_BO_BAT_BUOC = { english: 12, stem: 16, programming: 8, system: 4 } as const

/** Lỗi toàn vẹn của bộ mẫu — rỗng nghĩa là hợp lệ. */
export function kiemToanVen(rubric: Rubric): string[] {
  const loi: string[] = []
  if (rubric.cases.length !== 40) loi.push(`cần 40 ca, có ${rubric.cases.length}`)
  const ids = new Set<string>()
  for (const c of rubric.cases) {
    if (ids.has(c.id)) loi.push(`trùng id ${c.id}`)
    ids.add(c.id)
    // Chưa có chuyên gia → không ca nào được mang điểm/người duyệt (chống "đạt" giả).
    if (c.status === 'WAITING_EXPERT_REVIEW' && (c.scores !== null || c.reviewer !== null)) {
      loi.push(`${c.id}: WAITING nhưng đã có scores/reviewer`)
    }
    if (c.status !== 'WAITING_EXPERT_REVIEW' && (!c.reviewer || !c.reviewedAt || !c.scores)) {
      loi.push(`${c.id}: trạng thái ${c.status} thiếu reviewer/ngày/điểm`)
    }
  }
  for (const [g, n] of Object.entries(PHAN_BO_BAT_BUOC)) {
    const co = rubric.cases.filter((c) => c.group === g).length
    if (co !== n) loi.push(`nhóm ${g}: cần ${n}, có ${co}`)
  }
  return loi
}
