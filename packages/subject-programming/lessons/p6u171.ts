// P6-U171 — ai-s3: attention bounded, mask và shape fail closed.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U171_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u171-l1',
    unitId: 'p6-u171',
    language: 'python',
    title: 'Softmax attention — mẫu số phải dương',
    hook: 'Một score bị mask sai có thể làm token không hợp lệ vẫn nhận trọng số.',
    theory:
      'Attention simulator chuẩn hoá các score còn hiệu lực bằng softmax. Với sequence tối đa bốn phần tử, mask 1 nghĩa là giữ và 0 nghĩa là bỏ; mọi phần tử bị mask hoặc mẫu số không hữu hạn đều fail closed. Nó không phải Transformer serving.',
    workedExample: {
      code: `# Chỉ hai score được giữ trong softmax.\nimport math\nscores = [0.0, 1.0]\nden = sum(math.exp(x) for x in scores)\nprint(f"w1={math.exp(1.0) / den:.3f}")`,
      stdinLines: [],
    },
    predict: {
      code: `import math\nden = math.exp(0) + math.exp(0)\nprint(math.exp(0) / den)`,
      question: 'Hai score bằng nhau cho trọng số đầu tiên nào?',
      choices: ['0.0', '0.25', '0.5', '1.0'],
      answerIndex: 2,
      explain: 'Hai số mũ bằng nhau nên mỗi phần tử nhận một nửa mẫu số.',
    },
    parsons: {
      prompt: 'Xếp bước softmax chỉ trên score hợp lệ.',
      lines: [
        'kept = [x for x, m in zip(scores, mask) if m == 1]',
        'den = sum(math.exp(x) for x in kept)',
        'if den <= 0:',
        '    return None',
      ],
    },
    make: {
      prompt:
        'Đọc scores số thực cách nhau dấu phẩy và mask 0/1 cùng length, dài 1..4. In `weights=` với ba chữ số, vị trí mask 0 in 0.000. Nếu shape khác, mask sai, NaN/inf, mọi phần tử bị mask hoặc denominator không finite thì in `input-khong-hop-le`. MÔ PHỎNG attention ngắn, không gọi model.',
      starterCode: 'import math\n\n# Xác thực shape và mask trước softmax.',
      testCases: [
        {
          stdinLines: ['0,1', '1,1'],
          expected: 'weights=0.269,0.731',
          match: 'contains',
          hidden: false,
          label: 'softmax hai score',
        },
        {
          stdinLines: ['2,9', '1,0'],
          expected: 'weights=1.000,0.000',
          match: 'contains',
          hidden: true,
          label: 'mask loại score lớn',
        },
        {
          stdinLines: ['1,2', '1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'shape khác nhau',
        },
        {
          stdinLines: ['1,2', '0,0'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'mẫu số rỗng',
        },
      ],
      hints: [
        'Parse score và mask riêng.',
        'Không exp score bị mask.',
        'Điền 0 cho vị trí không giữ.',
      ],
      sampleSolution: `import math\ntry:\n    scores = [float(x.strip()) for x in input().strip().split(",")]\n    mask = [int(x.strip()) for x in input().strip().split(",")]\nexcept ValueError:\n    print("input-khong-hop-le"); raise SystemExit\nif not 1 <= len(scores) <= 4 or len(scores) != len(mask) or any(m not in (0, 1) for m in mask) or not all(math.isfinite(x) for x in scores) or not any(mask):\n    print("input-khong-hop-le"); raise SystemExit\nkept = [math.exp(x) for x, m in zip(scores, mask) if m]\nden = sum(kept)\nif not math.isfinite(den) or den <= 0:\n    print("input-khong-hop-le")\nelse:\n    out = []\n    for x, m in zip(scores, mask):\n        out.append(math.exp(x) / den if m else 0.0)\n    print("weights=" + ",".join(f"{x:.3f}" for x in out))`,
    },
    homework:
      'Tạo một bảng score/mask nhỏ và kiểm tra tổng trọng số của vị trí được giữ bằng một ở sai số làm tròn.',
    srsCards: [
      {
        hoi: 'Mask 0 có ý nghĩa gì trong simulator attention này?',
        dap: 'Mask 0 loại vị trí đó khỏi tử và mẫu số softmax, đồng thời output tại vị trí ấy phải là 0 thay vì một trọng số suy đoán.',
      },
      {
        hoi: 'Khi nào softmax phải fail closed?',
        dap: 'Nó phải từ chối shape sai, score không hữu hạn, mask không hợp lệ, không còn phần tử giữ hoặc mẫu số không dương hữu hạn.',
      },
    ],
  },
  {
    id: 'p6-u171-l2',
    unitId: 'p6-u171',
    language: 'python',
    title: 'Attention shape — tổng có mask là invariant',
    hook: 'Một phép zip im lặng khi lệch shape có thể cắt mất token mà không báo lỗi.',
    theory:
      'Trước khi tính weighted sum, query weights và values phải cùng shape bounded. Sau softmax, tổng weight trên mask giữ phải xấp xỉ một; simulator kiểm invariant này thay vì che lỗi bằng zip ngắn.',
    workedExample: {
      code: `# Weighted sum của hai value bằng nhau.\nweights = [0.5, 0.5]\nvalues = [2.0, 4.0]\nprint(sum(w * v for w, v in zip(weights, values)))`,
      stdinLines: [],
    },
    predict: {
      code: `print(0.25 * 4 + 0.75 * 0)`,
      question: 'Weighted sum in ra gì?',
      choices: ['0.0', '1.0', '3.0', '4.0'],
      answerIndex: 1,
      explain: 'Chỉ phần tử đầu đóng góp 0.25 nhân 4.',
    },
    parsons: {
      prompt: 'Xếp kiểm shape trước weighted sum.',
      lines: [
        'if len(weights) != len(values):',
        '    print("input-khong-hop-le")',
        'else:',
        '    total = sum(w * v for w, v in zip(weights, values))',
      ],
    },
    make: {
      prompt:
        'Đọc weights và values số thực cách nhau dấu phẩy. Mỗi list dài 1..4, weights không âm và tổng phải nằm trong [0.999,1.001]. In `context=<3 số>`. Shape khác, NaN/inf hoặc tổng weight sai in `input-khong-hop-le`. Đây là MÔ PHỎNG kiểm invariant sau attention, không suy luận model.',
      starterCode: 'import math\n\n# Không dùng zip trước khi xác nhận length.',
      testCases: [
        {
          stdinLines: ['0.25,0.75', '4,0'],
          expected: 'context=1.000',
          match: 'contains',
          hidden: false,
          label: 'weighted context',
        },
        {
          stdinLines: ['0.5,0.5', '2,4'],
          expected: 'context=3.000',
          match: 'contains',
          hidden: true,
          label: 'trung bình có trọng số',
        },
        {
          stdinLines: ['1', '1,2'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'shape mismatch',
        },
        {
          stdinLines: ['0.4,0.4', '1,2'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'softmax sum sai',
        },
      ],
      hints: [
        'Từ chối list rỗng.',
        'Dùng math.isfinite cho hai list.',
        'So tổng với tolerance công bố.',
      ],
      sampleSolution: `import math\ndef parse(line):\n    try:\n        return [float(x.strip()) for x in line.split(",")]\n    except ValueError:\n        return None\nweights = parse(input().strip()); values = parse(input().strip())\nif weights is None or values is None or not 1 <= len(weights) <= 4 or len(weights) != len(values) or not all(math.isfinite(x) for x in weights + values) or any(x < 0 for x in weights) or not 0.999 <= sum(weights) <= 1.001:\n    print("input-khong-hop-le")\nelse:\n    print(f"context={sum(w * v for w, v in zip(weights, values)):.3f}")`,
    },
    homework:
      'Nêu một ví dụ ngoài sandbox mà shape check cần gắn tên dimension thay vì chỉ so độ dài, và giải thích lỗi có thể bị che bởi zip.',
    srsCards: [
      {
        hoi: 'Vì sao không được zip trước shape check?',
        dap: 'Zip Python dừng ở list ngắn hơn nên có thể bỏ token im lặng; kiểm shape trước biến lỗi dữ liệu thành một trạng thái từ chối rõ ràng.',
      },
      {
        hoi: 'Invariant nào được kiểm sau softmax?',
        dap: 'Tổng trọng số hợp lệ phải xấp xỉ một theo tolerance đã công bố, đồng thời mỗi trọng số phải hữu hạn và không âm.',
      },
    ],
  },
]
