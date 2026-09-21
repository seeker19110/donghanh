// Khuôn chung cho 16 bài MÔ PHỎNG của `systems-s3` và `systems-s4`.
//
// Vì sao có file này: mười sáu bài dùng CÙNG một hình dạng (đọc một dòng fixture → in đúng
// một dòng quyết định `<decision>: <reason>`), nên phần vỏ 8 bước được viết MỘT lần thay vì
// chép mười sáu lần — đúng luật DRY ở CLAUDE.md mục 4.4, theo đúng tiền lệ
// `devopsS1LessonFactory.ts`. Mọi nội dung riêng của từng cơ chế vẫn nằm ở file unit.
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
  /** Khuôn tự ép `match: 'contains'` — runner Python echo lại stdin nên so khớp tuyệt đối sẽ đỏ giả. */
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
 * Dựng một bài MÔ PHỎNG hệ thống mức chuyên sâu.
 *
 * Ranh giới cố định (giống `systems-s1`/`systems-s2`): không biên dịch C/Rust/Assembly, không
 * chạy perf/eBPF/QEMU/fuzzer thật, không tiến trình hay luồng thật. Câu khẳng định đó được
 * NHÚNG VÀO theory ở đây để semantic gate không phụ thuộc vào việc người soạn nhớ gõ lại.
 */
export function systemsSimulation(input: LessonInput): ProgrammingLesson {
  return {
    id: input.id,
    unitId: input.unitId,
    language: 'python',
    title: `MÔ PHỎNG ${input.title}`,
    hook: input.hook,
    theory: `${input.theory} Đây là MÔ PHỎNG Python hữu hạn và tất định: không biên dịch C/Rust, không chạy perf, eBPF, QEMU, fuzzer hay nhân hệ điều hành thật.`,
    workedExample: { code: input.workedCode, stdinLines: [] },
    predict: {
      code: input.predictCode,
      question: 'Trace MÔ PHỎNG in gì?',
      choices: input.predictChoices,
      answerIndex: input.predictAnswer,
      explain: input.predictExplain,
    },
    parsons: {
      prompt: 'Xếp các bước để trạng thái không đủ bằng chứng bị từ chối thay vì đoán bừa.',
      lines: [
        'def quyet_dinh(state):',
        '    if state == "invalid":',
        '        return "tu-choi"',
        '    return "chap-nhan"',
      ],
    },
    make: {
      prompt: input.makePrompt,
      starterCode: '# MÔ PHỎNG thuần Python; khong goi toolchain hay nhan that.\n',
      testCases: input.testCases.map((testCase) => ({ ...testCase, match: 'contains' })),
      hints: [
        'Kiểm trường thiếu/sai kiểu TRƯỚC, rồi mới tới luật nghiệp vụ.',
        'Thứ tự các luật phải tường minh và tất định, không phụ thuộc thứ tự dict.',
        'Ca thiếu bằng chứng phải fail closed, không được quy về "an toàn".',
      ],
      sampleSolution: input.sampleSolution,
    },
    homework: input.homework,
    srsCards: input.cards,
  }
}
