// P6-U167 — ai-s2: confusion matrix, threshold va denominator an toan.
import type { ProgrammingLesson } from '../lessonTypes.js'

const makeLesson = (
  id: string,
  title: string,
  prompt: string,
  solution: string,
  tests: { stdinLines: string[]; expected: string; hidden: boolean; label: string }[],
): ProgrammingLesson => ({
  id,
  unitId: 'p6-u167',
  language: 'python',
  title,
  hook: 'Một chỉ số đẹp có thể che đi mẫu số bằng không hoặc lớp dương hiếm.',
  theory:
    'MÔ PHỎNG confusion matrix đếm TP, FP, TN, FN trên input bounded. Precision và recall phải báo undefined khi mẫu số bằng 0, thay vì chia bừa hay đưa ra kết luận production.',
  workedExample: {
    code: '# Dem TP trong mot tap nho.\ny, p = [1, 0], [1, 1]\nprint(sum(a == 1 and b == 1 for a, b in zip(y, p)))',
    stdinLines: [],
  },
  predict: {
    code: 'tp, fp = 0, 0\nprint("undefined" if tp + fp == 0 else tp / (tp + fp))',
    question: 'Precision được in là gì?',
    choices: ['0.0', '1.0', 'undefined', 'error'],
    answerIndex: 2,
    explain: 'Không có prediction dương nên TP + FP bằng 0 và precision không xác định.',
  },
  parsons: {
    prompt: 'Xếp xử lý mẫu số precision fail closed.',
    lines: [
      'den = tp + fp',
      'if den == 0:',
      '    print("precision=undefined")',
      'else:',
      '    print("precision=" + str(tp / den))',
    ],
  },
  make: {
    prompt,
    starterCode: '# MÔ PHỎNG metric bounded, khong goi model hay API.\n',
    testCases: tests.map((t) => ({ ...t, match: 'contains' as const })),
    hints: [
      'Xác thực độ dài và miền 0/1 trước khi zip.',
      'Đếm TP, FP, TN, FN bằng điều kiện tường minh.',
      'Báo undefined khi mẫu số metric bằng 0.',
    ],
    sampleSolution: solution,
  },
  homework:
    'Lập bảng TP, FP, TN, FN cho một tình huống thật và ghi chi phí của mỗi loại lỗi trước khi chọn metric.',
  srsCards: [
    {
      hoi: `Precision trong ${id} có mẫu số nào và khi nào undefined?`,
      dap: 'Precision bằng TP chia TP cộng FP; nó undefined khi không có dự đoán dương nên mẫu số TP cộng FP bằng không.',
    },
    {
      hoi: `Vì sao class imbalance trong ${id} phải được báo tường minh?`,
      dap: 'Khi dương hiếm, accuracy đơn lẻ có thể gây hiểu sai; số lượng dương thật và các lỗi FN, FP mới cho biết metric có ý nghĩa hay không.',
    },
  ],
})

export const P6U167_LESSONS: ProgrammingLesson[] = [
  makeLesson(
    'p6-u167-l1',
    'Confusion matrix không che mẫu số 0',
    'Đọc labels 0/1 và predictions 0/1, mỗi dòng 1..16 phần tử phân cách dấu phẩy. In `tp=`, `fp=`, `tn=`, `fn=`, `precision=` và `recall=` (ba chữ số hoặc `undefined` khi mẫu số 0). Sai input in `tu-choi`. MÔ PHỎNG, không tuyên bố quality production.',
    `try:\n y=[int(x) for x in input().split(",")]; p=[int(x) for x in input().split(",")]\n if not y or len(y)>16 or len(y)!=len(p) or any(x not in (0,1) for x in y+p): raise ValueError\nexcept ValueError:\n print("tu-choi"); raise SystemExit\ntp=sum(a==1 and b==1 for a,b in zip(y,p)); fp=sum(a==0 and b==1 for a,b in zip(y,p)); tn=sum(a==0 and b==0 for a,b in zip(y,p)); fn=sum(a==1 and b==0 for a,b in zip(y,p))\ndef rate(a,b): return "undefined" if b==0 else f"{a/b:.3f}"\nprint(f"tp={tp}\\nfp={fp}\\ntn={tn}\\nfn={fn}")\nprint("precision="+rate(tp,tp+fp)); print("recall="+rate(tp,tp+fn))`,
    [
      {
        stdinLines: ['1,1,0,0', '1,0,1,0'],
        expected: 'tp=1\nfp=1\ntn=1\nfn=1\nprecision=0.500\nrecall=0.500',
        hidden: false,
        label: 'đủ bốn ô confusion',
      },
      {
        stdinLines: ['0,0', '0,0'],
        expected: 'precision=undefined\nrecall=undefined',
        hidden: true,
        label: 'mẫu số 0',
      },
      { stdinLines: ['1,2', '1,0'], expected: 'tu-choi', hidden: true, label: 'nhãn ngoài miền' },
    ],
  ),
  makeLesson(
    'p6-u167-l2',
    'Threshold minh bạch dưới class imbalance',
    'Đọc labels 0/1, scores nguyên 0..100 và threshold 0..100. Tạo prediction khi score >= threshold. In `predicted-positive=n`, `actual-positive=n`, `tp=n`, `fp=n`, `fn=n`, `recall=<3 số|undefined>`. Độ dài 1..16 phải bằng nhau; sai input in `tu-choi`. MÔ PHỎNG threshold, không claim calibration.',
    `try:\n y=[int(x) for x in input().split(",")]; s=[int(x) for x in input().split(",")]; t=int(input())\n if not y or len(y)>16 or len(y)!=len(s) or not 0<=t<=100 or any(x not in (0,1) for x in y) or any(x<0 or x>100 for x in s): raise ValueError\nexcept ValueError:\n print("tu-choi"); raise SystemExit\np=[1 if x>=t else 0 for x in s]; tp=sum(a==1 and b==1 for a,b in zip(y,p)); fp=sum(a==0 and b==1 for a,b in zip(y,p)); fn=sum(a==1 and b==0 for a,b in zip(y,p)); actual=sum(y)\nprint(f"predicted-positive={sum(p)}\\nactual-positive={actual}\\ntp={tp}\\nfp={fp}\\nfn={fn}")\nprint("recall=undefined" if actual==0 else f"recall={tp/actual:.3f}")`,
    [
      {
        stdinLines: ['1,0,1,0', '80,70,60,20', '70'],
        expected: 'predicted-positive=2\nactual-positive=2\ntp=1\nfp=1\nfn=1\nrecall=0.500',
        hidden: false,
        label: 'threshold có FP và FN',
      },
      {
        stdinLines: ['0,0', '10,90', '50'],
        expected: 'recall=undefined',
        hidden: true,
        label: 'không có positive thật',
      },
      {
        stdinLines: ['1', '101', '50'],
        expected: 'tu-choi',
        hidden: true,
        label: 'score ngoài miền',
      },
    ],
  ),
]
