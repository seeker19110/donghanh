// P6-U172 — ai-s3: label agreement và distribution shift bounded.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U172_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u172-l1',
    unitId: 'p6-u172',
    language: 'python',
    title: 'Label agreement — không che mẫu rỗng',
    hook: 'Hai người gán nhãn có thể cùng đúng nhiều lần nhưng việc bỏ mẫu thiếu nhãn sẽ làm tỷ lệ agreement đẹp giả tạo.',
    theory:
      'Agreement đơn giản là số vị trí hai nhãn giống nhau chia cho tổng vị trí hợp lệ. Simulator chỉ nhận nhãn 0 hoặc 1, hai list cùng length 1..12; list rỗng, nhãn sai và shape sai đều bị từ chối thay vì tự lấp dữ liệu.',
    workedExample: {
      code: `# Có hai vị trí trùng trong ba mẫu.\na = [1, 0, 1]\nb = [1, 1, 1]\nprint(sum(x == y for x, y in zip(a, b)) / len(a))`,
      stdinLines: [],
    },
    predict: {
      code: `a = [0, 1]\nb = [0, 0]\nprint(sum(x == y for x, y in zip(a, b)))`,
      question: 'Có bao nhiêu nhãn trùng?',
      choices: ['0', '1', '2', '3'],
      answerIndex: 1,
      explain: 'Chỉ vị trí đầu cùng là 0.',
    },
    parsons: {
      prompt: 'Xếp phép đếm agreement sau kiểm shape.',
      lines: [
        'same = sum(x == y for x, y in zip(a, b))',
        'total = len(a)',
        'rate = same / total',
        'print(f"agreement={rate:.3f}")',
      ],
    },
    make: {
      prompt:
        'Đọc hai dòng nhãn 0/1 cách nhau dấu phẩy, cùng length 1..12. In `same=n`, `total=n`, `agreement=<3 số>`. Nhãn khác 0/1, list rỗng hay shape khác in `input-khong-hop-le`. Đây là MÔ PHỎNG agreement nhỏ, không phải chứng nhận chất lượng nhãn.',
      starterCode: '# Xác thực hai list trước khi zip.\na = input().strip()\nb = input().strip()',
      testCases: [
        {
          stdinLines: ['1,0,1', '1,1,1'],
          expected: 'same=2\ntotal=3\nagreement=0.667',
          match: 'contains',
          hidden: false,
          label: 'hai trong ba trùng',
        },
        {
          stdinLines: ['0,1', '0,0'],
          expected: 'same=1\ntotal=2\nagreement=0.500',
          match: 'contains',
          hidden: true,
          label: 'một nửa trùng',
        },
        {
          stdinLines: ['', ''],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'nhóm rỗng bị từ chối',
        },
        {
          stdinLines: ['0,1', '0'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'shape phải bằng nhau',
        },
      ],
      hints: [
        'Từ chối dòng trống trước split.',
        'Kiểm list cùng length.',
        'Đếm bool True bằng sum.',
      ],
      sampleSolution: `def parse(line):\n    if not line:\n        return None\n    try:\n        xs = [int(x.strip()) for x in line.split(",")]\n    except ValueError:\n        return None\n    return xs if xs and all(x in (0, 1) for x in xs) else None\na = parse(input().strip()); b = parse(input().strip())\nif a is None or b is None or len(a) != len(b) or len(a) > 12:\n    print("input-khong-hop-le")\nelse:\n    same = sum(x == y for x, y in zip(a, b))\n    print(f"same={same}")\n    print(f"total={len(a)}")\n    print(f"agreement={same / len(a):.3f}")`,
    },
    homework:
      'Ghi hai nguyên nhân agreement đơn giản có thể cao nhưng dữ liệu vẫn không đủ để kết luận về chất lượng nhãn.',
    srsCards: [
      {
        hoi: 'Agreement đơn giản được tính thế nào?',
        dap: 'Đó là số vị trí hai nguồn nhãn trùng nhau chia cho tổng số vị trí đã xác thực, với mọi vị trí đều phải hiện diện ở cả hai list.',
      },
      {
        hoi: 'Vì sao nhóm nhãn rỗng phải bị từ chối?',
        dap: 'Không có mẫu nào để tạo mẫu số cho tỷ lệ, nên trả về một tỷ lệ mặc định sẽ che việc dữ liệu đầu vào bị thiếu.',
      },
    ],
  },
  {
    id: 'p6-u172-l2',
    unitId: 'p6-u172',
    language: 'python',
    title: 'Histogram shift — báo unknown khi baseline trống',
    hook: 'Không có baseline thì một dashboard vẫn có thể tô xanh, nhưng không có phân phối nào để so sánh.',
    theory:
      'Histogram bounded đếm các nhãn 0..2 trong baseline và current. Shift ở đây là tổng chênh lệch tỷ trọng theo ba bin chia hai; nó là signal mô phỏng, không phải bằng chứng drift hay nguyên nhân suy giảm model.',
    workedExample: {
      code: `# Hai histogram chỉ khác một mẫu trong ba.\nbase = [0, 1, 1]\ncur = [0, 1, 2]\nprint(base.count(1), cur.count(1))`,
      stdinLines: [],
    },
    predict: {
      code: `xs = [0, 2, 2]\nprint([xs.count(i) for i in range(3)])`,
      question: 'Histogram ba bin in ra gì?',
      choices: ['[1, 0, 2]', '[1, 1, 1]', '[0, 1, 2]', '[1, 2, 0]'],
      answerIndex: 0,
      explain: 'Có một số 0, không có số 1 và hai số 2.',
    },
    parsons: {
      prompt: 'Xếp phép tạo histogram cố định ba bin.',
      lines: ['counts = [0, 0, 0]', 'for x in xs:', '    counts[x] += 1', 'return counts'],
    },
    make: {
      prompt:
        'Đọc baseline và current gồm nhãn 0,1,2 cách nhau dấu phẩy; mỗi list 1..12. In `base=a,b,c`, `current=a,b,c`, `shift=<3 số>`, với shift bằng nửa tổng chênh lệch tỷ trọng tuyệt đối. Dòng rỗng, nhãn sai hoặc count sai in `input-khong-hop-le`; không gọi shift là healthy/unhealthy. Đây là MÔ PHỎNG histogram.',
      starterCode:
        '# Mỗi histogram phải có đúng ba bin.\nbase_line = input().strip()\ncurrent_line = input().strip()',
      testCases: [
        {
          stdinLines: ['0,1,1', '0,1,2'],
          expected: 'base=1,2,0\ncurrent=1,1,1\nshift=0.333',
          match: 'contains',
          hidden: false,
          label: 'phân phối thay đổi một mẫu',
        },
        {
          stdinLines: ['2,2', '2,2'],
          expected: 'shift=0.000',
          match: 'contains',
          hidden: true,
          label: 'không đổi phân phối',
        },
        {
          stdinLines: ['', '0'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'baseline rỗng là unknown',
        },
        {
          stdinLines: ['0,3', '0,1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'bin ngoài miền',
        },
      ],
      hints: [
        'Không dùng set vì cần đủ ba bin.',
        'Kiểm list rỗng trước tỷ trọng.',
        'Dùng float count/len cho mỗi bin.',
      ],
      sampleSolution: `def parse(line):\n    if not line:\n        return None\n    try:\n        xs = [int(x.strip()) for x in line.split(",")]\n    except ValueError:\n        return None\n    return xs if 1 <= len(xs) <= 12 and all(x in (0, 1, 2) for x in xs) else None\ndef hist(xs):\n    out = [0, 0, 0]\n    for x in xs:\n        out[x] += 1\n    return out\nbase = parse(input().strip()); current = parse(input().strip())\nif base is None or current is None:\n    print("input-khong-hop-le")\nelse:\n    hb, hc = hist(base), hist(current)\n    shift = sum(abs(x / len(base) - y / len(current)) for x, y in zip(hb, hc)) / 2\n    print("base=" + ",".join(map(str, hb)))\n    print("current=" + ",".join(map(str, hc)))\n    print(f"shift={shift:.3f}")`,
    },
    homework:
      'Chọn một threshold cảnh báo giả định ngoài sandbox và nêu vì sao nó cần dữ liệu lịch sử, không thể suy ra chỉ từ một histogram.',
    srsCards: [
      {
        hoi: 'Histogram shift mô phỏng này so sánh điều gì?',
        dap: 'Nó so tỷ trọng từng bin giữa baseline và current rồi cộng các chênh lệch tuyệt đối theo công thức đã nêu rõ.',
      },
      {
        hoi: 'Vì sao không được gọi shift nhỏ là healthy?',
        dap: 'Một signal phân phối không bao phủ chất lượng nhãn, latency hay harm; simulator chỉ báo chênh lệch dữ liệu chứ không kết luận sức khoẻ hệ thống.',
      },
    ],
  },
]
