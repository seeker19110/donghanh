// apps/dhcb/src/lib/programmingLessonSteps.ts — bản đồ URL ↔ bước của bài Lập trình (S09d).
//
// Đặc tả: docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md §2.8 (B3).
// Hàm THUẦN: không đọc DOM, không đọc storage — trang (`ProgrammingLessonPage`) đưa vào hash,
// kiểu điều hướng, bước resume và metadata của history entry, nhận lại bước + đích focus.
//
// Bảng đã chốt (không sinh id từ tiêu đề, không dùng hash tuỳ ý làm selector CSS):
//   concept 0 · example 1 · predict 2 · parsons 3 · make 4 · done 5
//   #dau-bai → bước 0 (tên bài) · #ket-qua → bước 4 (đích CON của Make, không phải bước 7)

/** Sáu bước, đúng thứ tự stepIndex 0–5. Khoá cũng là id DOM + hash của heading bước. */
export const LESSON_STEP_KEYS = [
  'concept',
  'example',
  'predict',
  'parsons',
  'make',
  'done',
] as const
export type LessonStepKey = (typeof LESSON_STEP_KEYS)[number]

/** Đích "đầu bài" — heading tên bài. */
export const LESSON_HEAD_ANCHOR = 'dau-bai'
/** Đích "Kết quả chấm" — heading con trong bước Tự viết. */
export const LESSON_RESULT_ANCHOR = 'ket-qua'

export type LessonAnchor = LessonStepKey | typeof LESSON_HEAD_ANCHOR | typeof LESSON_RESULT_ANCHOR

// Bảng tra đích → bước. Dùng Map (không dùng object thường) để hash kiểu `#__proto__` hay
// `#toString` không vô tình trúng thuộc tính kế thừa của Object.prototype.
const ANCHOR_STEP = new Map<string, number>([
  ...LESSON_STEP_KEYS.map((k, i) => [k, i] as [string, number]),
  [LESSON_HEAD_ANCHOR, 0],
  [LESSON_RESULT_ANCHOR, LESSON_STEP_KEYS.indexOf('make')],
])

function isLessonAnchor(value: string): value is LessonAnchor {
  return ANCHOR_STEP.has(value)
}

/** Bước (0-based) của một đích. */
export function stepIndexOfAnchor(anchor: LessonAnchor): number {
  return ANCHOR_STEP.get(anchor) ?? 0
}

/**
 * Chuẩn hoá bước lưu ở nơi khác (storage, history state): chỉ nhận số nguyên trong [0,5],
 * còn lại về 0 — trang không bao giờ được đọc `STEPS[i]` ngoài phạm vi.
 */
export function clampStepIndex(value: unknown): number {
  return typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < LESSON_STEP_KEYS.length
    ? value
    : 0
}

/** Đích (hash) của một bước; bước ngoài phạm vi về `concept`. */
export function anchorOfStep(stepIndex: number): LessonStepKey {
  return LESSON_STEP_KEYS[clampStepIndex(stepIndex)]!
}

export type ParsedLessonHash =
  { kind: 'none' } | { kind: 'valid'; anchor: LessonAnchor } | { kind: 'invalid' }

/**
 * Đọc `location.hash`. So khớp NGUYÊN VĂN với tám đích đã chốt — không decode, không cắt
 * khoảng trắng, không phân biệt hoa/thường lỏng: `#Make`, `#make?x`, `#cau-1` đều là "lạ".
 */
export function parseLessonHash(hash: string): ParsedLessonHash {
  if (hash === '' || hash === '#') return { kind: 'none' }
  if (!hash.startsWith('#')) return { kind: 'invalid' }
  const id = hash.slice(1)
  return isLessonAnchor(id) ? { kind: 'valid', anchor: id } : { kind: 'invalid' }
}

export interface ResolveLessonTargetInput {
  /** `location.hash` hiện tại. */
  hash: string
  /**
   * `open`: lần mở bài (mount/reload) hoặc điều hướng mới tới entry KHÔNG hash.
   * `history`: Back/Forward (POP) tới một entry trong lúc trang đang mở.
   */
  navigation: 'open' | 'history'
  /** Bước trong phiên học đã khôi phục (resume). */
  resumeStep: number
  /** Bước ghi trong history state của entry (nếu có). */
  entryStep?: number | undefined
}

export interface LessonTarget {
  stepIndex: number
  /** Đích cần focus sau khi bước đã render; `null` = giữ hành vi mở bài bình thường. */
  focus: LessonAnchor | null
}

/**
 * Precedence (§2.8 mục 1–3):
 *  1. Hash hợp lệ thắng bước resume (nháp vẫn giữ — hàm này không đụng nháp).
 *  2. Hash lạ/sai cú pháp → Khái niệm + focus đầu bài.
 *  3. Không hash, mở bình thường → bước resume hợp lệ, không có thì 0; không tự focus.
 *  4. Không hash, Back/Forward → bước GHI trong entry; thiếu metadata → đầu bài. KHÔNG lấy
 *     resume, vì resume vừa bị chính các lần nhảy bước sau entry đó thay đổi.
 */
export function resolveLessonTarget(input: ResolveLessonTargetInput): LessonTarget {
  const parsed = parseLessonHash(input.hash)
  if (parsed.kind === 'valid') {
    return { stepIndex: stepIndexOfAnchor(parsed.anchor), focus: parsed.anchor }
  }
  if (parsed.kind === 'invalid') return { stepIndex: 0, focus: LESSON_HEAD_ANCHOR }
  if (input.navigation === 'open')
    return { stepIndex: clampStepIndex(input.resumeStep), focus: null }
  return { stepIndex: clampStepIndex(input.entryStep), focus: LESSON_HEAD_ANCHOR }
}

// --- Metadata bước trong history state ----------------------------------------------------
// Entry KHÔNG hash (entry lúc mở bài) được ghi kèm bước đang hiện trước khi push entry mới,
// để Back về đó trả đúng bước đó thay vì bước resume đã bị đổi.
const ENTRY_STEP_KEY = 'lessonStep'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Đọc bước ghi trong `location.state` — state là dữ liệu ngoài, không tin kiểu. */
export function readEntryStep(state: unknown): number | undefined {
  if (!isPlainObject(state)) return undefined
  const v = state[ENTRY_STEP_KEY]
  return typeof v === 'number' ? v : undefined
}

/** State mới = state cũ (giữ khoá của trang khác) + bước của entry. */
export function withEntryStep(state: unknown, stepIndex: number): Record<string, unknown> {
  return { ...(isPlainObject(state) ? state : {}), [ENTRY_STEP_KEY]: stepIndex }
}
