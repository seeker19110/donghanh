// P6-U175 — ai-s4-m2: drift, feedback delay va unknown quality.
import type { ProgrammingLesson } from '../lessonTypes.js'

const driftLesson = (
  id: string,
  title: string,
  prompt: string,
  solution: string,
  testCases: {
    stdinLines: string[]
    expected: string
    match: 'contains'
    hidden: boolean
    label: string
  }[],
): ProgrammingLesson => ({
  id,
  unitId: 'p6-u175',
  language: 'python',
  title,
  hook: 'Dashboard yên lặng không chứng minh model khỏe: nhãn phản hồi có thể chưa kịp về.',
  theory:
    'MÔ PHỎNG dùng số liệu bounded để phân loại alert. Khi quality chưa quan sát được vì feedback delay, trạng thái phải là unknown chứ không được gọi healthy.',
  workedExample: { code: 'drift = 12\nprint("alert" if drift >= 10 else "ok")', stdinLines: [] },
  predict: {
    code: 'labels_arrived = 0\nprint("unknown" if labels_arrived == 0 else "measured")',
    question: 'Không có label phản hồi thì quality là gì?',
    choices: ['healthy', 'unknown', 'perfect', 'release'],
    answerIndex: 1,
    explain: 'Không có quan sát chất lượng thì không thể khẳng định healthy.',
  },
  parsons: {
    prompt: 'Xếp nhánh alert theo drift và feedback.',
    lines: [
      'if feedback == 0:',
      '    status = "unknown"',
      'elif drift >= threshold:',
      '    status = "alert"',
      'else:',
      '    status = "healthy"',
    ],
  },
  make: {
    prompt,
    starterCode: 'raw = input().strip()\n# MÔ PHỎNG telemetry bounded, khong doc dashboard.',
    testCases,
    hints: [
      'Kiểm tra feedback trước khi gán healthy.',
      'Threshold phải được in ra hoặc cố định rõ ràng.',
      'Không suy luận causal drift từ một chỉ số simulator.',
    ],
    sampleSolution: solution,
  },
  homework:
    'Đề xuất SLO phản hồi nhãn, owner alert và hành động khi quality unknown kéo dài; nêu rõ dữ liệu nào còn thiếu.',
  srsCards: [
    {
      hoi: 'Vì sao quality unknown không được gắn nhãn healthy?',
      dap: 'Feedback delay có thể khiến không có label mới để đo chất lượng, nên healthy sẽ là một khẳng định không có bằng chứng và có thể che giấu suy giảm.',
    },
    {
      hoi: 'Drift alert cần được diễn giải thế nào?',
      dap: 'Drift là tín hiệu điều tra trên phân phối hoặc metric bounded; nó không tự chứng minh nguyên nhân, mức hại hay quyết định retrain cho production.',
    },
  ],
})

export const P6U175_LESSONS: ProgrammingLesson[] = [
  driftLesson(
    'p6-u175-l1',
    'MÔ PHỎNG drift và feedback delay',
    'MÔ PHỎNG. Đọc `baseline,current,feedback` là số nguyên 0..100. Tính `drift=abs(current-baseline)`. Ngưỡng alert là 15. Nếu feedback là 0 in `quality=unknown`; nếu không in `quality=measured`. In `status=alert` khi drift >=15, ngược lại `status=watch`; không bao giờ in healthy khi quality unknown. Input sai in `input-khong-hop-le`.',
    `try:
    baseline, current, feedback = (int(x) for x in input().strip().split(","))
    if any(not 0 <= x <= 100 for x in (baseline, current, feedback)): raise ValueError
    drift = abs(current - baseline)
    print(f"drift={drift}")
    print("quality=unknown" if feedback == 0 else "quality=measured")
    print("status=alert" if drift >= 15 else "status=watch")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['40,62,0'],
        expected: 'drift=22\nquality=unknown\nstatus=alert',
        match: 'contains',
        hidden: false,
        label: 'delay không được gọi healthy',
      },
      {
        stdinLines: ['40,48,7'],
        expected: 'drift=8\nquality=measured\nstatus=watch',
        match: 'contains',
        hidden: true,
        label: 'drift dưới ngưỡng',
      },
      {
        stdinLines: ['40,101,2'],
        expected: 'input-khong-hop-le',
        match: 'contains',
        hidden: true,
        label: 'count ngoài miền bounded',
      },
    ],
  ),
  driftLesson(
    'p6-u175-l2',
    'MÔ PHỎNG alert quality có feedback trễ',
    'MÔ PHỎNG. Đọc `expected,correct,delay` với expected 1..100, correct 0..expected, delay 0..30. Delay > 7 in `quality=unknown`; ngược lại in `quality=<percent>` và `status=alert` nếu quality <80, còn lại `status=watch`. Khi unknown, luôn in `status=investigate`. Input sai in `input-khong-hop-le`.',
    `try:
    expected, correct, delay = (int(x) for x in input().strip().split(","))
    if not 1 <= expected <= 100 or not 0 <= correct <= expected or not 0 <= delay <= 30: raise ValueError
    if delay > 7:
        print("quality=unknown")
        print("status=investigate")
    else:
        quality = correct * 100 // expected
        print(f"quality={quality}")
        print("status=alert" if quality < 80 else "status=watch")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['10,9,9'],
        expected: 'quality=unknown\nstatus=investigate',
        match: 'contains',
        hidden: false,
        label: 'feedback trễ che quality',
      },
      {
        stdinLines: ['10,7,2'],
        expected: 'quality=70\nstatus=alert',
        match: 'contains',
        hidden: true,
        label: 'quality thấp có alert',
      },
      {
        stdinLines: ['0,0,1'],
        expected: 'input-khong-hop-le',
        match: 'contains',
        hidden: true,
        label: 'denominator zero bị từ chối',
      },
    ],
  ),
]
