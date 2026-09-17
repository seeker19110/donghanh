// P6-U174 — ai-s4-m1: version tuple va release gate bounded.
import type { ProgrammingLesson } from '../lessonTypes.js'

const releaseLesson = (
  id: string,
  title: string,
  prompt: string,
  starterCode: string,
  sampleSolution: string,
  testCases: {
    stdinLines: string[]
    expected: string
    match: 'contains'
    hidden: boolean
    label: string
  }[],
): ProgrammingLesson => ({
  id,
  unitId: 'p6-u174',
  language: 'python',
  title,
  hook: 'Một model tốt trong notebook vẫn không được phép phát hành nếu thiếu bằng chứng và đường quay lui.',
  theory:
    'MÔ PHỎNG release gate kiểm các dữ kiện hữu hạn của một lần phát hành. Nó không deploy model, không thay thế phê duyệt vận hành hay đánh giá production.',
  workedExample: {
    code: 'approval = "yes"\nprint("release" if approval == "yes" else "hold")',
    stdinLines: [],
  },
  predict: {
    code: 'has_rollback = False\nprint("release" if has_rollback else "hold")',
    question: 'Không có rollback plan thì gate trả gì?',
    choices: ['release', 'hold', 'rollback', 'unknown'],
    answerIndex: 1,
    explain: 'Gate fail closed: thiếu rollback thì phải hold.',
  },
  parsons: {
    prompt: 'Xếp các điều kiện fail-closed của release gate.',
    lines: [
      'required = [approval, evaluation, rollback]',
      'if all(required):',
      '    print("release")',
      'else:',
      '    print("hold")',
    ],
  },
  make: {
    prompt,
    starterCode,
    testCases,
    hints: [
      'Tách version code/data/model để audit được artifact nào đã đổi.',
      'Dùng điều kiện fail-closed: một evidence thiếu là hold.',
      'Đây chỉ là simulator bounded, không gọi deployment hay API.',
    ],
    sampleSolution,
  },
  homework:
    'Viết một ADR ngắn nêu owner phê duyệt, metric eval, rollback trigger và artifact cần lưu cho một release thực tế.',
  srsCards: [
    {
      hoi: `Release gate ${id} fail closed nghĩa là gì?`,
      dap: 'Nếu bất kỳ bằng chứng bắt buộc như approval, evaluation hoặc rollback bị thiếu, gate phải giữ release thay vì suy đoán rằng thiếu dữ liệu là an toàn.',
    },
    {
      hoi: `Vì sao ${id} tách version code, data và model?`,
      dap: 'Một tuple version tách riêng cho phép audit chính xác thay đổi nào tạo ra kết quả, hỗ trợ tái lập và chọn đúng artifact cần rollback khi có sự cố.',
    },
  ],
})

export const P6U174_LESSONS: ProgrammingLesson[] = [
  releaseLesson(
    'p6-u174-l1',
    'MÔ PHỎNG release gate với version tuple',
    'MÔ PHỎNG. Đọc `code,data,model,approval,eval,rollback` (sáu token phân cách dấu phẩy). Ba version chỉ gồm chữ/số/`.`/`-`, dài 1..20; ba cờ là yes/no. In `version=code@...|data@...|model@...` rồi `decision=release` chỉ khi cả approval, eval và rollback là yes; ngược lại `decision=hold`. Input sai in `input-khong-hop-le`.',
    '# MÔ PHỎNG release gate, khong deploy.',
    `try:
    p = input().strip().split(",")
    if len(p) != 6 or any(not x for x in p): raise ValueError
    code, data, model, approval, evaluation, rollback = p
    if any(not all(c.isalnum() or c in ".-" for c in x) or len(x) > 20 for x in (code, data, model)) or any(x not in ("yes", "no") for x in (approval, evaluation, rollback)): raise ValueError
    print(f"version=code@{code}|data@{data}|model@{model}")
    print("decision=release" if approval == evaluation == rollback == "yes" else "decision=hold")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['api-2,data.7,model-3,yes,yes,yes'],
        expected: 'version=code@api-2|data@data.7|model@model-3\ndecision=release',
        match: 'contains',
        hidden: false,
        label: 'đủ evidence mới release',
      },
      {
        stdinLines: ['api-2,data.7,model-3,yes,yes,no'],
        expected: 'decision=hold',
        match: 'contains',
        hidden: true,
        label: 'thiếu rollback phải hold',
      },
      {
        stdinLines: ['a,b,c,yes,maybe,yes'],
        expected: 'input-khong-hop-le',
        match: 'contains',
        hidden: true,
        label: 'cờ ngoài hợp đồng bị từ chối',
      },
    ],
  ),
  releaseLesson(
    'p6-u174-l2',
    'MÔ PHỎNG approval và rollback evidence',
    'MÔ PHỎNG. Đọc `approval_id,eval_score,rollback_id` với score nguyên 0..100; `-` nghĩa là thiếu. In `approval=present|missing`, `evaluation=pass|fail` (pass từ 80), `rollback=present|missing`, và `decision=release` chỉ khi approval/rollback present và evaluation pass. Input sai in `input-khong-hop-le`.',
    '# MÔ PHỎNG evidence release.',
    `try:
    approval, raw_score, rollback = input().strip().split(",")
    score = int(raw_score)
    if not 0 <= score <= 100 or any(len(x) > 24 for x in (approval, rollback)): raise ValueError
    ap, rb = approval != "-", rollback != "-"
    ev = score >= 80
    print("approval=present" if ap else "approval=missing")
    print("evaluation=pass" if ev else "evaluation=fail")
    print("rollback=present" if rb else "rollback=missing")
    print("decision=release" if ap and rb and ev else "decision=hold")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['CAB-9,86,RB-3'],
        expected: 'approval=present\nevaluation=pass\nrollback=present\ndecision=release',
        match: 'contains',
        hidden: false,
        label: 'evidence hoàn chỉnh',
      },
      {
        stdinLines: ['-,95,RB-3'],
        expected: 'approval=missing\nevaluation=pass\nrollback=present\ndecision=hold',
        match: 'contains',
        hidden: true,
        label: 'thiếu approval không release',
      },
      {
        stdinLines: ['CAB-9,79,RB-3'],
        expected: 'approval=present\nevaluation=fail\nrollback=present\ndecision=hold',
        match: 'contains',
        hidden: true,
        label: 'eval dưới ngưỡng',
      },
    ],
  ),
]
