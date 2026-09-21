// Khuôn chung cho bài học hướng DESKTOP (desktop-s1..s4). Mọi bài là MÔ PHỎNG Python hữu hạn:
// không Electron/Tauri/Qt/WinUI, không trình cài đặt, không ký mã, không hệ điều hành thật —
// vì sandbox chỉ chứng minh được HỢP ĐỒNG QUYẾT ĐỊNH, còn hành vi hệ thật thuộc bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

type LessonInput = {
  id: string
  unitId: string
  title: string
  hook: string
  theory: string
  workedCode: string
  predictCode: string
  predictChoices: string[]
  predictAnswer: number
  predictExplain: string
  makePrompt: string
  /** Factory ép về `contains` để người soạn không lỡ dùng so khớp tuyệt đối (runner echo stdin). */
  testCases: Array<
    Omit<ProgrammingLesson['make']['testCases'][number], 'match'> & {
      match?: ProgrammingLesson['make']['testCases'][number]['match']
    }
  >
  sampleSolution: string
  homework: string
  cards: NonNullable<ProgrammingLesson['srsCards']>
}

export function desktopSimulation(input: LessonInput): ProgrammingLesson {
  return {
    id: input.id,
    unitId: input.unitId,
    language: 'python',
    title: `MÔ PHỎNG ${input.title}`,
    hook: input.hook,
    theory: `${input.theory} Đây là MÔ PHỎNG Python hữu hạn: không chạy Electron, Tauri, Qt, WinUI, trình cài đặt, ký mã hay hệ điều hành thật; mọi ngưỡng số là hằng số dạy học, không phải khuyến nghị vận hành sản xuất.`,
    workedExample: { code: input.workedCode, stdinLines: [] },
    predict: {
      code: input.predictCode,
      question: 'Trace MÔ PHỎNG in gì?',
      choices: input.predictChoices,
      answerIndex: input.predictAnswer,
      explain: input.predictExplain,
    },
    parsons: {
      prompt: 'Xếp các bước quyết định MÔ PHỎNG để trạng thái thiếu bằng chứng bị chặn trước.',
      lines: [
        'def quyet_dinh(state):',
        '    if state == "invalid":',
        '        return "tu-choi"',
        '    return "chap-nhan"',
      ],
    },
    make: {
      prompt: input.makePrompt,
      starterCode: '# MÔ PHỎNG thuần Python; không đụng tệp, tiến trình hay hệ điều hành thật.\n',
      // Runner Python in lại stdin nên chấm 'contains' mới đúng phần trace quyết định.
      testCases: input.testCases.map((testCase) => ({ ...testCase, match: 'contains' })),
      hints: [
        'Ghi đúng state tối thiểu cần để quyết định, rồi xét từng luật theo thứ tự đã khai.',
        'Ca thiếu bằng chứng hoặc trái hợp đồng phải fail closed, không quy về allow.',
        'Không dùng open, subprocess, socket, random hay thời gian thực.',
      ],
      sampleSolution: input.sampleSolution,
    },
    homework: input.homework,
    srsCards: input.cards,
  }
}
