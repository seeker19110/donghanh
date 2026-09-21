// P6-U166 — ai-s2: time split, holdout va chan leakage.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U166_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u166-l1',
    unitId: 'p6-u166',
    language: 'python',
    title: 'Time split chỉ nhìn về quá khứ',
    hook: 'Một mô hình dự báo có điểm đẹp bất thường khi vô tình được xem dữ liệu của ngày mai.',
    theory:
      'MÔ PHỎNG này tách quan sát theo thời điểm cut: train chỉ chứa thời điểm nhỏ hơn cut, holdout chỉ chứa thời điểm lớn hơn hoặc bằng cut. Một timestamp tương lai trong train là leakage và phải bị từ chối, không được sửa im lặng.',
    workedExample: {
      code: '# Các mốc trước cut dùng để học.\nrows = [1, 2, 5]\ncut = 4\nprint("train=" + str([t for t in rows if t < cut]))',
      stdinLines: [],
    },
    predict: {
      code: 'rows = [1, 4, 5]\nprint([t for t in rows if t < 4])',
      question: 'Dòng này in ra gì?',
      choices: ['[1]', '[1, 4]', '[4, 5]', '[]'],
      answerIndex: 0,
      explain: 'Cut 4 thuộc holdout; chỉ timestamp nhỏ hơn 4 được vào train.',
    },
    parsons: {
      prompt: 'Xếp các dòng để kiểm leakage trước khi in split.',
      lines: [
        'if any(t >= cut for t in train):',
        '    print("leakage-tu-choi")',
        'else:',
        '    print("split-hop-le")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG time split. Đọc dòng timestamp nguyên không âm cách nhau bởi dấu phẩy và cut nguyên dương. Dòng timestamp phải tăng nghiêm ngặt, tối đa 12 mốc. In `train=n` và `holdout=m`; nếu holdout rỗng in `holdout-rong`. Nếu input sai hoặc mốc không tăng thì in `leakage-tu-choi`. Không đọc file, không train model.',
      starterCode: '# Chi tach timestamp bounded, khong dung dataset ben ngoai.\n',
      testCases: [
        {
          stdinLines: ['1,2,4,6', '4'],
          expected: 'train=2\nholdout=2',
          match: 'contains',
          hidden: false,
          label: 'tách quá khứ và holdout',
        },
        {
          stdinLines: ['1,2,3', '4'],
          expected: 'holdout-rong',
          match: 'contains',
          hidden: true,
          label: 'holdout phải tường minh',
        },
        {
          stdinLines: ['1,4,3', '4'],
          expected: 'leakage-tu-choi',
          match: 'contains',
          hidden: true,
          label: 'thời gian đảo thứ tự bị từ chối',
        },
      ],
      hints: [
        'Tách từng chuỗi bằng dấu phẩy rồi đổi sang int.',
        'Kiểm `rows[i] < rows[i + 1]` cho mọi cặp kề nhau.',
        'Train là các mốc `< cut`, còn lại là holdout.',
      ],
      sampleSolution: `try:\n    rows = [int(x) for x in input().strip().split(",")]\n    cut = int(input().strip())\n    if not rows or len(rows) > 12 or cut <= 0 or any(t < 0 for t in rows): raise ValueError\n    if any(rows[i] >= rows[i + 1] for i in range(len(rows) - 1)): raise ValueError\nexcept ValueError:\n    print("leakage-tu-choi")\n    raise SystemExit\ntrain = [t for t in rows if t < cut]\nholdout = [t for t in rows if t >= cut]\nprint(f"train={len(train)}")\nprint(f"holdout={len(holdout)}")\nif not holdout: print("holdout-rong")`,
    },
    homework:
      'Tạo một bảng lịch sử nhỏ và ghi rõ cut time, cột nào chỉ có sau sự kiện, cùng lý do không được đưa cột đó vào feature.',
    srsCards: [
      {
        hoi: 'Vì sao time split không được trộn dữ liệu tương lai vào train?',
        dap: 'Vì thông tin tương lai làm điểm đánh giá lạc quan giả tạo và không tồn tại ở thời điểm hệ thống thực sự phải dự báo.',
      },
      {
        hoi: 'Holdout rỗng nói lên điều gì?',
        dap: 'Không còn dữ liệu tương lai để đánh giá; kết quả train không đủ bằng chứng để so sánh hay quyết định phát hành mô hình.',
      },
    ],
  },
  {
    id: 'p6-u166-l2',
    unitId: 'p6-u166',
    language: 'python',
    title: 'So baseline trên cùng holdout',
    hook: 'Một model mới chỉ có ý nghĩa nếu hơn baseline trên đúng dữ liệu chưa từng thấy.',
    theory:
      'Baseline MÔ PHỎNG luôn đoán 0; candidate nhận các dự đoán nhị phân. Chỉ so accuracy trên holdout bounded và từ chối độ dài lệch nhau. Đây là phép so sánh nhỏ, không phải bằng chứng model production.',
    workedExample: {
      code: '# Cùng một holdout cho hai cách đoán.\ny = [1, 0]\np = [1, 0]\nprint(sum(a == b for a, b in zip(y, p)) / len(y))',
      stdinLines: [],
    },
    predict: {
      code: 'y = [1, 0, 1]\nbaseline = [0, 0, 0]\nprint(sum(a == b for a, b in zip(y, baseline)))',
      question: 'Baseline đúng bao nhiêu mẫu?',
      choices: ['0', '1', '2', '3'],
      answerIndex: 1,
      explain: 'Chỉ nhãn 0 ở vị trí giữa khớp dự đoán 0.',
    },
    parsons: {
      prompt: 'Xếp phép đo accuracy có kiểm holdout.',
      lines: [
        'if len(y) != len(pred) or not y:',
        '    print("tu-choi")',
        'else:',
        '    print("accuracy=" + str(sum(a == b for a, b in zip(y, pred)) / len(y)))',
      ],
    },
    make: {
      prompt:
        'Đọc nhãn holdout 0/1 và candidate prediction 0/1, mỗi dòng phân cách bằng dấu phẩy, 1..12 phần tử. Baseline luôn là 0. In `baseline=<3 số>` và `candidate=<3 số>`, rồi `accept` chỉ khi candidate lớn hơn baseline; ngược lại `keep-baseline`. Sai độ dài, nhãn khác 0/1 hoặc rỗng in `tu-choi`. MÔ PHỎNG deterministic, không huấn luyện.',
      starterCode: '# So sanh candidate va baseline tren cung holdout.\n',
      testCases: [
        {
          stdinLines: ['1,0,1,0', '1,0,1,1'],
          expected: 'baseline=0.500\ncandidate=0.750\naccept',
          match: 'contains',
          hidden: false,
          label: 'candidate tốt hơn baseline',
        },
        {
          stdinLines: ['1,1', '0,0'],
          expected: 'keep-baseline',
          match: 'contains',
          hidden: true,
          label: 'không vượt baseline',
        },
        {
          stdinLines: ['1,0', '1'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'holdout lệch độ dài',
        },
      ],
      hints: [
        'Dùng zip chỉ sau khi kiểm độ dài.',
        'Đếm `a == b`, rồi chia cho len(y).',
        'Không accept nếu bằng baseline.',
      ],
      sampleSolution: `try:\n    y = [int(x) for x in input().strip().split(",")]\n    pred = [int(x) for x in input().strip().split(",")]\n    if not y or len(y) > 12 or len(y) != len(pred) or any(x not in (0, 1) for x in y + pred): raise ValueError\nexcept ValueError:\n    print("tu-choi")\n    raise SystemExit\nscore = lambda p: sum(a == b for a, b in zip(y, p)) / len(y)\nbase, candidate = score([0] * len(y)), score(pred)\nprint(f"baseline={base:.3f}")\nprint(f"candidate={candidate:.3f}")\nprint("accept" if candidate > base else "keep-baseline")`,
    },
    homework:
      'Viết ADR ngắn nêu baseline, tập holdout, metric và ngưỡng tối thiểu trước khi đổi model trong một tính năng có rủi ro.',
    srsCards: [
      {
        hoi: 'Vì sao baseline và candidate phải dùng cùng holdout?',
        dap: 'Cùng tập chưa thấy giữ điều kiện đo giống nhau, nhờ đó chênh lệch metric mới có thể được diễn giải như so sánh công bằng.',
      },
      {
        hoi: 'Khi candidate bằng baseline thì nên làm gì?',
        dap: 'Giữ baseline hoặc thu thêm bằng chứng, vì metric bằng nhau chưa biện minh chi phí, rủi ro hay độ phức tạp của model mới.',
      },
    ],
  },
]
