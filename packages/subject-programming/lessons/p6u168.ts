// P6-U168 — ai-s2: feature contribution va group error bounded.
import type { ProgrammingLesson } from '../lessonTypes.js'

const lesson = (
  id: string,
  title: string,
  prompt: string,
  solution: string,
  tests: { stdinLines: string[]; expected: string; hidden: boolean; label: string }[],
): ProgrammingLesson => ({
  id,
  unitId: 'p6-u168',
  language: 'python',
  title,
  hook: 'Một con số giải thích chỉ hữu ích khi phạm vi và giới hạn của nó được nói rõ.',
  theory:
    'MÔ PHỎNG này chỉ xử lý dữ liệu nhỏ, deterministic. Feature contribution không phải causal claim; group error không phải fairness proof, đặc biệt khi group rỗng hoặc sample size quá nhỏ.',
  workedExample: {
    code: '# Contribution trong cong thuc tuyen tinh.\nvalue, weight = 3, 2\nprint(value * weight)',
    stdinLines: [],
  },
  predict: {
    code: 'pairs = [("a", -6), ("b", 4)]\nprint(max(pairs, key=lambda x: abs(x[1]))[0])',
    question: 'Feature nào có độ lớn contribution lớn nhất?',
    choices: ['a', 'b', 'c', 'undefined'],
    answerIndex: 0,
    explain: 'Giá trị tuyệt đối của -6 lớn hơn 4.',
  },
  parsons: {
    prompt: 'Xếp kiểm tra bounded trước khi báo kết quả.',
    lines: ['if invalid:', '    print("tu-choi")', 'else:', '    print("result=" + result)'],
  },
  make: {
    prompt,
    starterCode: '# MÔ PHỎNG bounded, khong goi data/model ben ngoai.\n',
    testCases: tests.map((t) => ({ ...t, match: 'contains' as const })),
    hints: [
      'Xác thực toàn bộ input trước khi tính.',
      'Không gán số 0 cho đại lượng không có mẫu số.',
      'Giữ rule tie-break deterministic.',
    ],
    sampleSolution: solution,
  },
  homework:
    'Viết model card ngắn nêu phạm vi dữ liệu, điều không thể kết luận và điểm cần human review trước khi đưa chỉ số vào quyết định.',
  srsCards: [
    {
      hoi: `Contribution tuyến tính trong ${id} có chứng minh feature gây ra kết quả không?`,
      dap: 'Không; nó chỉ mô tả phần cộng trong công thức và dữ liệu đang xét, không chứng minh quan hệ nhân quả hay tính công bằng.',
    },
    {
      hoi: `Vì sao group rỗng trong ${id} phải báo undefined?`,
      dap: 'Không có quan sát làm mẫu số nên không thể ước lượng error rate; gán số 0 sẽ tạo kết luận sai về chất lượng hoặc fairness.',
    },
  ],
})

export const P6U168_LESSONS: ProgrammingLesson[] = [
  lesson(
    'p6-u168-l1',
    'Feature contribution chỉ là MÔ PHỎNG',
    'Đọc 1..4 cặp `name:value:weight` cách nhau dấu phẩy. name chỉ chữ thường và không được là `gender`, `race`, `religion`; value/weight nguyên -20..20. In `top=<name>` và `contribution=<số>` của |value*weight| lớn nhất; hoà giữ input đầu. Sai input/feature nhạy cảm in `tu-choi`. Không kết luận causal hoặc fairness.',
    `try:\n items=input().strip().split(","); best=None\n if not 1<=len(items)<=4: raise ValueError\n for item in items:\n  n,v,w=item.split(":"); v,w=int(v),int(w)\n  if not n.isalpha() or not n.islower() or n in {"gender","race","religion"} or not -20<=v<=20 or not -20<=w<=20: raise ValueError\n  c=v*w\n  if best is None or abs(c)>abs(best[1]): best=(n,c)\nexcept ValueError:\n print("tu-choi"); raise SystemExit\nprint("top="+best[0]); print("contribution="+str(best[1]))`,
    [
      {
        stdinLines: ['income:3:2,tenure:4:1'],
        expected: 'top=income\ncontribution=6',
        hidden: false,
        label: 'xếp contribution',
      },
      { stdinLines: ['gender:2:3'], expected: 'tu-choi', hidden: true, label: 'feature nhạy cảm' },
      { stdinLines: ['a:1:2,b:-1:-2'], expected: 'top=a', hidden: true, label: 'tie giữ thứ tự' },
    ],
  ),
  lesson(
    'p6-u168-l2',
    'Group error không suy rộng từ nhóm rỗng',
    'Đọc groups `a`/`b`, labels 0/1 và predictions 0/1; ba dòng cùng độ dài 1..16. In `a-error=<3 số|undefined>`, `b-error=<3 số|undefined>`, rồi `compare=insufficient` nếu một group rỗng, ngược lại chênh lệch tuyệt đối. Sai input in `tu-choi`. Không tuyên bố fairness proof.',
    `try:\n g=input().split(","); y=[int(x) for x in input().split(",")]; p=[int(x) for x in input().split(",")]\n if not g or len(g)>16 or len(g)!=len(y) or len(y)!=len(p) or any(x not in {"a","b"} for x in g) or any(x not in (0,1) for x in y+p): raise ValueError\nexcept ValueError:\n print("tu-choi"); raise SystemExit\nt={"a":0,"b":0}; e={"a":0,"b":0}\nfor group,a,b in zip(g,y,p): t[group]+=1; e[group]+=a!=b\ndef rate(k): return None if t[k]==0 else e[k]/t[k]\na,b=rate("a"),rate("b")\nprint("a-error=undefined" if a is None else f"a-error={a:.3f}"); print("b-error=undefined" if b is None else f"b-error={b:.3f}")\nprint("compare=insufficient" if a is None or b is None else f"compare={abs(a-b):.3f}")`,
    [
      {
        stdinLines: ['a,a,b,b', '1,0,1,0', '1,1,0,0'],
        expected: 'a-error=0.500\nb-error=0.500\ncompare=0.000',
        hidden: false,
        label: 'hai group có mẫu',
      },
      {
        stdinLines: ['a,a', '1,0', '1,0'],
        expected: 'b-error=undefined\ncompare=insufficient',
        hidden: true,
        label: 'group rỗng',
      },
      { stdinLines: ['c', '1', '1'], expected: 'tu-choi', hidden: true, label: 'group ngoài miền' },
    ],
  ),
]
