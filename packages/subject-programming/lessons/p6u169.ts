// P6-U169 — ai-s2: selection theo quality, latency va cost.
import type { ProgrammingLesson } from '../lessonTypes.js'

const lesson = (
  id: string,
  title: string,
  prompt: string,
  solution: string,
  tests: { stdinLines: string[]; expected: string; hidden: boolean; label: string }[],
): ProgrammingLesson => ({
  id,
  unitId: 'p6-u169',
  language: 'python',
  title,
  hook: 'Chọn model cần cân bằng chất lượng, latency và chi phí thay vì nhìn một con số.',
  theory:
    'MÔ PHỎNG dùng bảng option bounded. Dominated nghĩa là có option khác không kém mọi chỉ số và tốt hơn ít nhất một; tie-break phải công bố để kết quả deterministic, không phải benchmark production.',
  workedExample: {
    code: '# Quality giam, latency tang la tie-break.\nitems = [("a", 80, 9), ("b", 80, 5)]\nprint(sorted(items, key=lambda x: (-x[1], x[2]))[0][0])',
    stdinLines: [],
  },
  predict: {
    code: 'a=(80,10,2); b=(80,10,2)\nprint("no" if a == b else "yes")',
    question: 'Hai option giống hệt nhau có dominated nghiêm ngặt không?',
    choices: ['yes', 'no', 'only-a', 'error'],
    answerIndex: 1,
    explain: 'Dominated đòi ít nhất một chỉ số tốt hơn nghiêm ngặt.',
  },
  parsons: {
    prompt: 'Xếp rule chọn deterministic.',
    lines: [
      'eligible.sort(key=lambda x: (-x[1], x[2], x[3], x[0]))',
      'winner = eligible[0]',
      'print("winner=" + winner[0])',
    ],
  },
  make: {
    prompt,
    starterCode: '# MÔ PHỎNG selection table bounded.\n',
    testCases: tests.map((t) => ({ ...t, match: 'contains' as const })),
    hints: [
      'Kiểm name và miền số trước khi so.',
      'Không để option tự dominated chính nó.',
      'Sort chỉ sau khi filter policy.',
    ],
    sampleSolution: solution,
  },
  homework:
    'Viết ADR gồm workload, metric, percentile latency, cost unit, policy constraint và rule rollback nếu benchmark mới xấu hơn.',
  srsCards: [
    {
      hoi: `Khi nào một option trong ${id} bị dominated?`,
      dap: 'Khi một option khác không kém quality, latency, cost và tốt hơn nghiêm ngặt ít nhất một chỉ số trong cùng bảng so sánh.',
    },
    {
      hoi: `Vì sao ${id} filter constraint trước khi chọn winner?`,
      dap: 'Option quality cao nhưng vượt latency hoặc cost policy không phải ứng viên hợp lệ nên không được thắng chỉ vì một metric đơn lẻ.',
    },
  ],
})

export const P6U169_LESSONS: ProgrammingLesson[] = [
  lesson(
    'p6-u169-l1',
    'Loại model dominated trước khi chọn',
    'Đọc 2..5 option `name:quality:latency:cost`. name chữ thường, quality 0..100, latency/cost 1..100, name duy nhất. In `kept=` các option không bị dominated theo thứ tự input. Sai input in `tu-choi`. MÔ PHỎNG, không benchmark model thật.',
    `try:\n raw=input().split(","); items=[]; names=set()\n if not 2<=len(raw)<=5: raise ValueError\n for x in raw:\n  n,q,l,c=x.split(":"); q,l,c=int(q),int(l),int(c)\n  if not n.isalpha() or not n.islower() or n in names or not 0<=q<=100 or not 0<l<=100 or not 0<c<=100: raise ValueError\n  names.add(n); items.append((n,q,l,c))\nexcept ValueError:\n print("tu-choi"); raise SystemExit\nkept=[]\nfor n,q,l,c in items:\n bad=any(oq>=q and ol<=l and oc<=c and (oq>q or ol<l or oc<c) for on,oq,ol,oc in items if on!=n)\n if not bad: kept.append(n)\nprint("kept="+",".join(kept))`,
    [
      {
        stdinLines: ['small:80:10:2,large:79:12:3,fast:78:5:2'],
        expected: 'kept=small,fast',
        hidden: false,
        label: 'loại dominated',
      },
      {
        stdinLines: ['a:80:10:2,b:80:10:2'],
        expected: 'kept=a,b',
        hidden: true,
        label: 'bản sao giữ lại',
      },
      {
        stdinLines: ['a:80:10:2,a:70:9:1'],
        expected: 'tu-choi',
        hidden: true,
        label: 'trùng name',
      },
    ],
  ),
  lesson(
    'p6-u169-l2',
    'Tie-break cost–quality có hợp đồng rõ',
    'Đọc options `name:quality:latency:cost`, rồi `min-quality,max-latency,max-cost`. Lọc option đạt policy. In `no-eligible` nếu rỗng; nếu có in `winner=<name>`. Tie-break: quality giảm, latency tăng, cost tăng, name alphabet. 2..5 option bounded; input sai/trùng name in `tu-choi`.',
    `try:\n raw=input().split(","); policy=[int(x) for x in input().split(",")]; names=set(); items=[]\n if not 2<=len(raw)<=5 or len(policy)!=3 or any(x<0 or x>100 for x in policy): raise ValueError\n for x in raw:\n  n,q,l,c=x.split(":"); q,l,c=int(q),int(l),int(c)\n  if not n.isalpha() or not n.islower() or n in names or not 0<=q<=100 or not 0<l<=100 or not 0<c<=100: raise ValueError\n  names.add(n); items.append((n,q,l,c))\nexcept ValueError:\n print("tu-choi"); raise SystemExit\nmq,ml,mc=policy; ok=[x for x in items if x[1]>=mq and x[2]<=ml and x[3]<=mc]\nif not ok: print("no-eligible")\nelse:\n ok.sort(key=lambda x:(-x[1],x[2],x[3],x[0])); print("winner="+ok[0][0])`,
    [
      {
        stdinLines: ['a:80:10:3,b:80:5:3,c:85:20:5', '75,15,4'],
        expected: 'winner=b',
        hidden: false,
        label: 'latency phá hoà',
      },
      {
        stdinLines: ['a:70:10:2,b:71:20:2', '80,15,3'],
        expected: 'no-eligible',
        hidden: true,
        label: 'không eligible',
      },
      {
        stdinLines: ['a:80:10:2,a:81:9:3', '70,20,5'],
        expected: 'tu-choi',
        hidden: true,
        label: 'trùng name',
      },
    ],
  ),
]
