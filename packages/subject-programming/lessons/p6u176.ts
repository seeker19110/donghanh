// P6-U176 — ai-s4-m3: agent tool loop bounded.
import type { ProgrammingLesson } from '../lessonTypes.js'

const toolLesson = (
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
  unitId: 'p6-u176',
  language: 'python',
  title,
  hook: 'Agent chỉ an toàn khi tool nào, bao nhiêu bước và bao nhiêu chi phí đều là hợp đồng có thể kiểm.',
  theory:
    'MÔ PHỎNG tool loop xử lý chuỗi lệnh bounded. Allow-list, schema đơn giản, idempotency key, budget và cancellation là các guardrail; simulator không gọi tool bên ngoài.',
  workedExample: {
    code: 'allowed = {"lookup"}\nprint("allow" if "lookup" in allowed else "deny")',
    stdinLines: [],
  },
  predict: {
    code: 'spent, budget = 3, 3\nprint(spent >= budget)',
    question: 'Khi spent bằng budget, có được chạy bước tốn phí tiếp không?',
    choices: ['True', 'False', 'only once', 'unknown'],
    answerIndex: 0,
    explain: 'Budget đã cạn nên gate phải dừng trước bước tốn thêm phí.',
  },
  parsons: {
    prompt: 'Xếp guardrail trước khi mô phỏng tool.',
    lines: [
      'if cancelled:',
      '    print("cancelled")',
      'elif tool not in allowed:',
      '    print("denied")',
      'elif spent >= budget:',
      '    print("budget-exhausted")',
    ],
  },
  make: {
    prompt,
    starterCode: 'raw = input().strip()\n# MÔ PHỎNG tool loop; khong goi tool ngoai.',
    testCases,
    hints: [
      'Kiểm allow-list trước khi tính chi phí.',
      'Một idempotency key lặp lại không được tiêu budget lần hai.',
      'Cancellation phải dừng toàn bộ loop ngay lập tức.',
    ],
    sampleSolution: solution,
  },
  homework:
    'Vẽ state machine cho một tool loop thật, gồm pending, approved, running, cancelled và compensation cho thao tác không idempotent.',
  srsCards: [
    {
      hoi: `Allow-list trong ${id} bảo vệ điều gì?`,
      dap: 'Allow-list giới hạn agent vào tập tool đã được xét duyệt và schema dự kiến, nhờ đó prompt hoặc output lạ không tự mở rộng quyền thực thi.',
    },
    {
      hoi: `Idempotency key trong ${id} có vai trò gì với cost budget?`,
      dap: 'Nó nhận diện yêu cầu lặp lại để simulator hay service không chạy lại thao tác và không tính chi phí lần hai khi client retry hoặc loop bị lặp.',
    },
  ],
})

export const P6U176_LESSONS: ProgrammingLesson[] = [
  toolLesson(
    'p6-u176-l1',
    'MÔ PHỎNG allow-list và step budget',
    'MÔ PHỎNG. Đọc `budget;tool,tool,...` với budget 0..5, tối đa 8 tool; allow-list là `lookup,calculate`. Mỗi tool hợp lệ tốn 1 step. In mỗi kết quả `run=<tool>`; tool lạ in `denied=<tool>` và dừng; hết budget in `budget-exhausted` và dừng. Input sai in `input-khong-hop-le`.',
    `try:
    raw_budget, raw_tools = input().strip().split(";", 1)
    budget = int(raw_budget); tools = raw_tools.split(",") if raw_tools else []
    if not 0 <= budget <= 5 or len(tools) > 8 or any(not x.isalpha() for x in tools): raise ValueError
    spent = 0
    for tool in tools:
        if tool not in {"lookup", "calculate"}: print(f"denied={tool}"); break
        if spent >= budget: print("budget-exhausted"); break
        spent += 1; print(f"run={tool}")
    print(f"spent={spent}")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['2;lookup,calculate,lookup'],
        expected: 'run=lookup\nrun=calculate\nbudget-exhausted\nspent=2',
        match: 'contains',
        hidden: false,
        label: 'step budget dừng loop',
      },
      {
        stdinLines: ['3;lookup,delete'],
        expected: 'run=lookup\ndenied=delete\nspent=1',
        match: 'contains',
        hidden: true,
        label: 'tool ngoài allow-list bị từ chối',
      },
      {
        stdinLines: ['6;lookup'],
        expected: 'input-khong-hop-le',
        match: 'contains',
        hidden: true,
        label: 'budget bounded',
      },
    ],
  ),
  toolLesson(
    'p6-u176-l2',
    'MÔ PHỎNG schema, idempotency và cancellation',
    'MÔ PHỎNG. Đọc các token `key:tool` phân cách dấu phẩy, tối đa 6; key gồm chữ/số dài 1..8, tool chỉ `lookup` hoặc `calculate`; token `cancel` dừng ngay. Budget cost là 3, một key mới tốn 1, key lặp in `duplicate=<key>` không tốn phí. In `cancelled`, `schema-invalid`, hoặc `budget-exhausted` rồi dừng phù hợp. Input sai in `input-khong-hop-le`.',
    `try:
    tokens = input().strip().split(",")
    if not 1 <= len(tokens) <= 6: raise ValueError
    seen, spent = set(), 0
    for token in tokens:
        if token == "cancel": print("cancelled"); break
        parts = token.split(":")
        if len(parts) != 2 or not parts[0].isalnum() or not 1 <= len(parts[0]) <= 8 or parts[1] not in {"lookup", "calculate"}: print("schema-invalid"); break
        key, tool = parts
        if key in seen: print(f"duplicate={key}"); continue
        if spent >= 3: print("budget-exhausted"); break
        seen.add(key); spent += 1; print(f"run={tool}:{key}")
    print(f"spent={spent}")
except (EOFError, ValueError): print("input-khong-hop-le")`,
    [
      {
        stdinLines: ['a1:lookup,a1:lookup,b2:calculate,c3:lookup,cancel'],
        expected:
          'run=lookup:a1\nduplicate=a1\nrun=calculate:b2\nrun=lookup:c3\ncancelled\nspent=3',
        match: 'contains',
        hidden: false,
        label: 'duplicate không tiêu budget và cancellation dừng',
      },
      {
        stdinLines: ['a1:delete'],
        expected: 'schema-invalid\nspent=0',
        match: 'contains',
        hidden: true,
        label: 'schema tool bị chặn',
      },
      {
        stdinLines: ['a:lookup,b:lookup,c:lookup,d:lookup'],
        expected: 'budget-exhausted\nspent=3',
        match: 'contains',
        hidden: true,
        label: 'cost budget hết',
      },
    ],
  ),
]
