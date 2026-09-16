// P6-U177 — ai-s4-m4: harm, PII, license va human review.
import type { ProgrammingLesson } from '../lessonTypes.js'

const riskLesson = (
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
  unitId: 'p6-u177',
  language: 'python',
  title,
  hook: 'Tốc độ không phải lý do để bỏ qua dữ liệu nhạy cảm, quyền sử dụng hay tác hại có thể dự đoán.',
  theory:
    'MÔ PHỎNG này phân loại risk theo các cờ do người dùng nhập trong miền nhỏ. Nó hỗ trợ tạo audit trail, không phải tư vấn pháp lý hay quyết định compliance.',
  workedExample: { code: 'pii = True\nprint("human-review" if pii else "record")', stdinLines: [] },
  predict: {
    code: 'harm = "high"\nprint("no" if harm == "high" else "yes")',
    question: 'Risk harm high có thể tự động approve không?',
    choices: ['yes', 'no', 'only at night', 'unknown'],
    answerIndex: 1,
    explain: 'High risk phải chuyển human review và giữ audit trail.',
  },
  parsons: {
    prompt: 'Xếp quyết định high-risk fail-closed.',
    lines: [
      'if risk == "high":',
      '    print("decision=human-review")',
      '    print("audit=required")',
      'else:',
      '    print("decision=record")',
    ],
  },
  make: {
    prompt,
    starterCode: 'raw = input().strip()\n# MÔ PHỎNG risk triage, khong xu ly du lieu that.',
    testCases,
    hints: [
      'PII, license không rõ hoặc harm high đều là tín hiệu escalation.',
      'In audit trail cho mọi quyết định để truy vết.',
      'Không gọi kết quả là compliance approval.',
    ],
    sampleSolution: solution,
  },
  homework:
    'Soạn incident record có owner, thời điểm, dữ liệu liên quan, tác động, biện pháp containment và điều kiện đóng sự cố.',
  srsCards: [
    {
      hoi: `Khi nào high risk trong ${id} cần human review?`,
      dap: 'Khi harm được đánh dấu high, có PII chưa được xử lý hoặc license không rõ, quyết định phải chuyển người chịu trách nhiệm xem xét và lưu audit trail.',
    },
    {
      hoi: `Audit trail trong ${id} hữu ích gì cho incident?`,
      dap: 'Audit trail ghi input, policy version, người quyết định và hành động để có thể điều tra, chứng minh trách nhiệm và cải thiện guardrail mà không phỏng đoán lại sự kiện.',
    },
  ],
})

export const P6U177_LESSONS: ProgrammingLesson[] = [
  riskLesson(
    'p6-u177-l1',
    'MÔ PHỎNG harm, PII và license risk',
    'MÔ PHỎNG. Đọc `harm,pii,license` trong đó harm là low/medium/high, pii yes/no, license clear/unknown. In `risk=high` nếu harm high, pii yes hoặc license unknown; khi high in `decision=human-review`, ngược lại `decision=record`. Luôn in `audit=required`. Input sai in `input-khong-hop-le`.',
    `try:
    harm, pii, license = input().strip().split(",")
    if harm not in {"low", "medium", "high"} or pii not in {"yes", "no"} or license not in {"clear", "unknown"}: raise ValueError
    high = harm == "high" or pii == "yes" or license == "unknown"
    print("risk=high" if high else "risk=low")
    print("decision=human-review" if high else "decision=record")
    print("audit=required")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['low,yes,clear'],
        expected: 'risk=high\ndecision=human-review\naudit=required',
        match: 'contains',
        hidden: false,
        label: 'PII cần human review',
      },
      {
        stdinLines: ['high,no,clear'],
        expected: 'decision=human-review',
        match: 'contains',
        hidden: true,
        label: 'harm high không auto approve',
      },
      {
        stdinLines: ['low,no,unknown'],
        expected: 'risk=high\ndecision=human-review',
        match: 'contains',
        hidden: true,
        label: 'license không rõ escalation',
      },
    ],
  ),
  riskLesson(
    'p6-u177-l2',
    'MÔ PHỎNG incident decision record',
    'MÔ PHỎNG. Đọc `incident,pii,harm,reviewer` trong đó incident open/closed, pii yes/no, harm low/high, reviewer yes/no. In `audit=incident|...`. Nếu pii yes hoặc harm high, chỉ in `decision=contain-and-review` khi reviewer yes, còn lại `decision=await-human-review`; các ca còn lại in `decision=record`. Input sai in `input-khong-hop-le`.',
    `try:
    incident, pii, harm, reviewer = input().strip().split(",")
    if incident not in {"open", "closed"} or pii not in {"yes", "no"} or harm not in {"low", "high"} or reviewer not in {"yes", "no"}: raise ValueError
    print(f"audit=incident|{incident}")
    if pii == "yes" or harm == "high": print("decision=contain-and-review" if reviewer == "yes" else "decision=await-human-review")
    else: print("decision=record")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['open,yes,low,no'],
        expected: 'audit=incident|open\ndecision=await-human-review',
        match: 'contains',
        hidden: false,
        label: 'PII thiếu reviewer phải chờ người',
      },
      {
        stdinLines: ['open,no,high,yes'],
        expected: 'decision=contain-and-review',
        match: 'contains',
        hidden: true,
        label: 'high harm được containment có review',
      },
      {
        stdinLines: ['closed,no,low,no'],
        expected: 'decision=record',
        match: 'contains',
        hidden: true,
        label: 'low risk vẫn lưu record',
      },
    ],
  ),
]
