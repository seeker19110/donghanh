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
  /** Factory tự chuẩn hoá về `contains`, để không ai lỡ tay dùng so khớp tuyệt đối (runner echo stdin). */
  testCases: Array<
    Omit<ProgrammingLesson['make']['testCases'][number], 'match'> & {
      match?: ProgrammingLesson['make']['testCases'][number]['match']
    }
  >
  sampleSolution: string
  homework: string
  cards: NonNullable<ProgrammingLesson['srsCards']>
}

/**
 * Khuôn chung cho 32 lesson của hướng Nhúng (embedded S1–S4).
 *
 * Vì sao phải có khuôn riêng thay vì dùng lại `devopsSimulation`: câu nhãn MÔ PHỎNG của hướng
 * này phải nói rõ "không chạm bo mạch/vi điều khiển thật" — đó chính là hiểu nhầm nguy hiểm
 * nhất của người học nhúng, và là một lớp chặn được đặc tả yêu cầu (mục ⑦).
 */
export function embeddedSimulation(input: LessonInput): ProgrammingLesson {
  return {
    id: input.id,
    unitId: input.unitId,
    language: 'python',
    title: `MÔ PHỎNG ${input.title}`,
    hook: input.hook,
    theory: `${input.theory} Đây là MÔ PHỎNG Python hữu hạn và tất định: không có bo mạch, vi điều khiển, bus I2C/SPI/UART, máy hiện sóng hay nguồn điện thật nào được chạm tới.`,
    workedExample: { code: input.workedCode, stdinLines: [] },
    predict: {
      code: input.predictCode,
      question: 'Trace MÔ PHỎNG in gì?',
      choices: input.predictChoices,
      answerIndex: input.predictAnswer,
      explain: input.predictExplain,
    },
    parsons: {
      prompt: 'Xếp các bước MÔ PHỎNG để từ chối trạng thái không đủ bằng chứng đo.',
      lines: [
        'def quyet_dinh(state):',
        '    if state == "invalid":',
        '        return "tu-choi"',
        '    return "chap-nhan"',
      ],
    },
    make: {
      prompt: input.makePrompt,
      starterCode: '# MÔ PHỎNG thuần Python; không nạp firmware, không chạm chân phần cứng.\n',
      // Runner Python hiển thị lại stdin, nên chấm theo `contains` chứ không so khớp tuyệt đối.
      testCases: input.testCases.map((testCase) => ({ ...testCase, match: 'contains' })),
      hints: [
        'Ghi đúng state tối thiểu cần để quyết định, rồi xét từng luật theo thứ tự cố định.',
        'Thiếu bằng chứng đo thì trả unknown; trái ràng buộc thì fail closed.',
        'Không dùng thư viện ngoài, không đọc tệp, không lấy giờ hệ thống.',
      ],
      sampleSolution: input.sampleSolution,
    },
    homework: input.homework,
    srsCards: input.cards,
  }
}
