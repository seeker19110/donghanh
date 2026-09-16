// Cổng cho PHIÊN HỌC của trang bài Lập trình (slice S08-2).
// Đặc tả: docs/specs/2026-09-15-learning-ux-s08-khung-phien-resume.md (AC-11…AC-14).
//
// Bốn bất biến canh ở đây — mỗi cái đã từng là một cách hỏng thật:
//   1. Reload giữa chừng: về ĐÚNG bước + ĐÚNG code đã gõ (AC-11), nhưng KẾT QUẢ CHẤM thì
//      không khôi phục — kết quả phải chấm lại bằng máy chấm thật, không tin số trên máy.
//   2. Đổi bài không dính nháp bài cũ; quay lại bài cũ thì nháp còn (AC-12).
//   3. Bài đổi nội dung → HỎI trước khi đổ nháp cũ, không tự prefill (AC-13).
//   4. Nháp KHÔNG tạo completion: mở lại bài dở không hề gọi `saveLessonProgress('completed')`;
//      ngược lại đạt hết test thì nháp bị XOÁ (AC-14).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import type { ProgrammingLesson } from '@dhcb/subject-programming/lessonTypes'
import { buildSlugSegment } from '@core/slug'
import { LEARNING_SESSION_PREFIX, __resetSessionMemory } from '../../../lib/learningSession'
import ProgrammingLessonPage from './ProgrammingLessonPage'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// --- Bài học giả: đủ hình dạng thật, đủ nhỏ để test chạy trong mili-giây -------------------
function taoBai(patch: Partial<ProgrammingLesson['make']> = {}): ProgrammingLesson {
  return {
    id: 'p1-u4-l1',
    unitId: 'p1-u4',
    language: 'python',
    title: 'Bài thử',
    hook: 'Móc thực tế',
    theory: 'Lý thuyết',
    workedExample: { code: 'print(1)', stdinLines: [] },
    predict: {
      code: 'print(1)',
      question: 'In ra gì?',
      choices: ['1', '2'],
      answerIndex: 0,
      explain: 'Vì thế',
    },
    parsons: { prompt: 'Xếp đi', lines: ['a = 1', 'b = 2', 'print(a + b)'] },
    make: {
      prompt: 'Tự viết đi',
      starterCode: '# viết ở đây',
      testCases: [
        { stdinLines: [], expected: 'xong', match: 'contains', hidden: false, label: 'ca 1' },
      ],
      hints: ['gợi ý 1'],
      sampleSolution: 'print("xong")',
      ...patch,
    },
    homework: 'Về nhà làm',
  }
}

const baiHienTai: { lesson: ProgrammingLesson } = { lesson: taoBai() }

vi.mock('../../../components/Layout', () => ({ default: () => null }))
vi.mock('../../../components/programming/LivePreview', () => ({ default: () => null }))
vi.mock('../../../components/programming/AiHelpPanel', () => ({ default: () => null }))
// CodeEditor thật là CodeMirror (không chạy được trong jsdom) → thay bằng textarea cùng hợp đồng.
vi.mock('../../../components/CodeEditor', () => ({
  default: ({
    value,
    onChange,
    ariaLabel,
  }: {
    value: string
    onChange: (v: string) => void
    ariaLabel: string
  }) => (
    <textarea
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  ),
}))
vi.mock('../../../lib/useProgrammingLesson', () => ({
  useProgrammingLesson: () => ({ status: 'ready', lesson: baiHienTai.lesson }),
}))
vi.mock('../../../lib/codeRunner', () => ({
  // Code của học viên có chữ "xong" thì coi như in ra "xong" (đủ để đạt test-case duy nhất).
  runLessonCode: (_lang: string, code: string) =>
    Promise.resolve({ output: code.includes('xong') ? 'xong' : 'chưa', error: undefined }),
  resetLessonRunners: () => {},
  laBaiDongLenh: () => false,
}))
const luuTienDo = vi.fn()
vi.mock('../../../lib/programmingProgress', async () => {
  const thuc = await vi.importActual<typeof import('../../../lib/programmingProgress')>(
    '../../../lib/programmingProgress',
  )
  return {
    ...thuc,
    saveLessonProgress: (...args: unknown[]) => {
      luuTienDo(...args)
      return Promise.resolve()
    },
    fetchProgress: () => Promise.resolve([]),
    fetchProgressWithState: () => Promise.resolve({ lessons: [], state: 'ready' as const }),
  }
})
vi.mock('../../../lib/programmingSrs', () => ({ addLessonCardsToSrs: () => {} }))
// PHẢI trả về CÙNG MỘT object mỗi lần gọi: `useProgrammingOutlineCtx` có effect phụ thuộc
// `[user]`, mock trả object mới mỗi lượt render là vòng lặp render vô tận (đã dính thật).
vi.mock('../../../context/useAuth', () => {
  const ctx = {
    user: { id: 'u1', plan: 'free', isGuest: false, email: '', name: 'U', onboarded: true },
    loading: false,
  }
  return { useAuth: () => ctx }
})

let container: HTMLDivElement
let root: Root

/** Mở trang (như một lần TẢI TRANG mới: unmount rồi mount lại = reload). */
function mo(lesson: ProgrammingLesson = baiHienTai.lesson) {
  baiHienTai.lesson = lesson
  const doan = buildSlugSegment(lesson.id, lesson.title)
  act(() =>
    root.render(
      <MemoryRouter initialEntries={[`/lap-trinh/bai-hoc/${doan}`]}>
        <Routes>
          <Route path="/lap-trinh/bai-hoc/:lessonId" element={<ProgrammingLessonPage />} />
        </Routes>
      </MemoryRouter>,
    ),
  )
}

function nut(ten: string): HTMLButtonElement {
  const found = [...document.body.querySelectorAll('button')].find(
    (b) => (b.textContent ?? '').trim() === ten,
  )
  if (!found) throw new Error(`Không thấy nút "${ten}"`)
  return found as HTMLButtonElement
}

function bam(ten: string) {
  act(() => nut(ten).click())
}

function oCode(): HTMLTextAreaElement {
  const el = document.body.querySelector('textarea')
  if (!el) throw new Error('Không thấy ô soạn code')
  return el
}

/** Gõ vào ô code như người thật (đi qua đúng onChange của React). */
function goCode(text: string) {
  const el = oCode()
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
  act(() => {
    setter?.call(el, text)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

function chu(): string {
  return document.body.textContent ?? ''
}

beforeEach(() => {
  localStorage.clear()
  __resetSessionMemory()
  luuTienDo.mockClear()
  baiHienTai.lesson = taoBai()
  vi.useFakeTimers()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

describe('ProgrammingLessonPage — phiên học (S08-2)', () => {
  it('AC-11: reload giữa chừng về đúng bước "Tự viết" + đúng code đã gõ, kết quả chấm không khôi phục', () => {
    mo()
    bam('Tự viết')
    goCode('print("dang lam do")')
    act(() => vi.advanceTimersByTime(600))
    expect(chu()).toContain('Tự viết đi')

    // Tải lại trang
    act(() => root.unmount())
    root = createRoot(container)
    mo()

    expect(chu()).toContain('Tự viết đi') // vẫn ở bước Tự viết
    expect(oCode().value).toBe('print("dang lam do")')
    expect(chu()).not.toContain('Đạt toàn bộ test!')
    expect(chu()).toContain('Đã khôi phục code bạn gõ')
  })

  it('AC-12: đổi bài dùng starterCode của bài mới; quay lại bài cũ thì nháp còn', () => {
    mo()
    bam('Tự viết')
    goCode('code cua bai 1')
    act(() => vi.advanceTimersByTime(600))

    // Sang bài khác (trang dựng lại vì `key={lesson.id}`)
    const baiKhac: ProgrammingLesson = { ...taoBai(), id: 'p1-u4-l2' }
    act(() => root.unmount())
    root = createRoot(container)
    mo(baiKhac)
    bam('Tự viết')
    expect(oCode().value).toBe('# viết ở đây')

    // Quay lại bài cũ
    act(() => root.unmount())
    root = createRoot(container)
    mo(taoBai())
    expect(oCode().value).toBe('code cua bai 1')
  })

  it('AC-13: bài đổi nội dung → hộp hỏi, chưa bấm thì dùng starterCode mới; bấm "Dùng lại" mới đổ nháp', () => {
    mo()
    bam('Tự viết')
    goCode('code cu cua toi')
    act(() => vi.advanceTimersByTime(600))

    act(() => root.unmount())
    root = createRoot(container)
    mo(taoBai({ starterCode: '# đề bài đã đổi' }))

    expect(chu()).toContain('Bài này đã được cập nhật')
    bam('Tự viết')
    expect(oCode().value).toBe('# đề bài đã đổi') // KHÔNG tự prefill nháp cũ

    bam('Dùng lại code đã gõ')
    expect(oCode().value).toBe('code cu cua toi')
    expect(chu()).not.toContain('Bài này đã được cập nhật')
  })

  it('AC-13b: "Bắt đầu mới" xoá nháp cũ — lần tải sau không hỏi lại nữa', () => {
    mo()
    bam('Tự viết')
    goCode('code cu cua toi')
    act(() => vi.advanceTimersByTime(600))

    act(() => root.unmount())
    root = createRoot(container)
    mo(taoBai({ starterCode: '# đề bài đã đổi' }))
    bam('Bắt đầu mới')
    expect(chu()).not.toContain('Bài này đã được cập nhật')

    act(() => root.unmount())
    root = createRoot(container)
    mo(taoBai({ starterCode: '# đề bài đã đổi' }))
    expect(chu()).not.toContain('Bài này đã được cập nhật')
  })

  it('AC-14: chỉ reload thì KHÔNG hề ghi completed; đạt hết test mới ghi và nháp bị xoá', async () => {
    mo()
    bam('Tự viết')
    goCode('print("chua xong")')
    act(() => vi.advanceTimersByTime(600))
    act(() => root.unmount())
    root = createRoot(container)
    mo()

    expect(luuTienDo.mock.calls.some((c) => c[2] === 'completed')).toBe(false)

    // Bấm "Chấm bài" với code đạt → completed + nháp bị xoá.
    // Máy chấm là promise thật (không phải timer) nên phần này chạy với đồng hồ THẬT.
    goCode('print("xong")')
    vi.useRealTimers()
    act(() => {
      nut('Chấm bài').click()
    })
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100))
    })
    expect(luuTienDo.mock.calls.some((c) => c[2] === 'completed')).toBe(true)
    const conKhoa = Object.keys(localStorage).filter((k) => k.startsWith(LEARNING_SESSION_PREFIX))
    expect(conKhoa).toEqual([])
  })
})
