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
  testCases: ProgrammingLesson['make']['testCases']
  sampleSolution: string
  homework: string
  cards: NonNullable<ProgrammingLesson['srsCards']>
}

/** Khuôn chung cho tám state machine DevOps S1. Tất cả chỉ là mô phỏng Python tất định. */
export function devopsSimulation(input: LessonInput): ProgrammingLesson {
  return {
    id: input.id,
    unitId: input.unitId,
    language: 'python',
    title: `MÔ PHỎNG ${input.title}`,
    hook: input.hook,
    theory: `${input.theory} Đây là MÔ PHỎNG Python hữu hạn: không gọi Linux, mạng, TLS, shell hay VPS thật.`,
    workedExample: { code: input.workedCode, stdinLines: [] },
    predict: {
      code: input.predictCode,
      question: 'Trace MÔ PHỎNG in gì?',
      choices: input.predictChoices,
      answerIndex: input.predictAnswer,
      explain: input.predictExplain,
    },
    parsons: {
      prompt: 'Xếp các bước state machine MÔ PHỎNG để từ chối trạng thái không đủ bằng chứng.',
      lines: [
        'def quyet_dinh(state):',
        '    if state == "invalid":',
        '        return "tu-choi"',
        '    return "chap-nhan"',
      ],
    },
    make: {
      prompt: input.makePrompt,
      starterCode:
        '# MÔ PHỎNG thuần Python; không gọi lệnh hay host thật.\nlenh = input().strip()\n',
      testCases: input.testCases,
      hints: [
        'Ghi state tối thiểu cần để quyết định, rồi xử lý từng lệnh.',
        'Ca thiếu bằng chứng hoặc trái policy phải fail closed.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: input.sampleSolution,
    },
    homework: input.homework,
    srsCards: input.cards,
  }
}
