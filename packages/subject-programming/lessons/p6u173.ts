// P6-U173 — ai-s3: decision matrix cho prompt, fine-tune, quantization.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U173_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u173-l1',
    unitId: 'p6-u173',
    language: 'python',
    title: 'Decision matrix — quality, latency và cost',
    hook: 'Một lựa chọn có quality cao nhất vẫn có thể không phù hợp nếu vượt ngân sách latency hoặc cost đã công bố.',
    theory:
      'Simulator so ba phương án prompt, fine-tune, quantization trên các số liệu do người dùng nhập. Nó lọc theo ngưỡng quality tối thiểu, latency tối đa và cost tối đa, sau đó ưu tiên quality cao hơn, latency thấp hơn, cost thấp hơn và tên ổn định. Các số không phải benchmark model thật.',
    workedExample: {
      code: `# Lọc phương án trước khi so quality.\nitems = [("prompt", 0.8, 100, 2), ("tune", 0.9, 300, 8)]\nprint([name for name, q, lat, cost in items if lat <= 200])`,
      stdinLines: [],
    },
    predict: {
      code: `items = [("a", 0.8), ("b", 0.9)]\nprint(max(items, key=lambda x: x[1])[0])`,
      question: 'Tên nào được chọn?',
      choices: ['a', 'b', '0.8', '0.9'],
      answerIndex: 1,
      explain: 'Hàm key so thành phần quality thứ hai và b lớn hơn.',
    },
    parsons: {
      prompt: 'Xếp khoá sort ưu tiên quality rồi latency rồi cost.',
      lines: [
        'def key(item):',
        '    name, quality, latency, cost = item',
        '    return (-quality, latency, cost, name)',
        'best = sorted(candidates, key=key)[0]',
      ],
    },
    make: {
      prompt:
        'Đọc ba dòng `quality,latency,cost` cho prompt, fine-tune, quantize và dòng `min_quality,max_latency,max_cost`. Quality 0..1, latency/cost không âm, mọi số finite. Lọc các option đạt cả ba ngưỡng; in `selected=<name>` và `reason=quality-latency-cost`, hoặc `no-feasible-option`. Input sai in `input-khong-hop-le`. Đây là bảng quyết định MÔ PHỎNG, không tuyên bố latency model thật.',
      starterCode: 'import math\n\n# Parse ba option theo thứ tự cố định.',
      testCases: [
        {
          stdinLines: ['0.80,100,2', '0.90,300,8', '0.85,80,3', '0.8,200,5'],
          expected: 'selected=quantize\nreason=quality-latency-cost',
          match: 'contains',
          hidden: false,
          label: 'lọc tune vượt latency và cost',
        },
        {
          stdinLines: ['0.8,100,2', '0.8,90,4', '0.8,90,3', '0.8,200,5'],
          expected: 'selected=quantize',
          match: 'contains',
          hidden: true,
          label: 'tie chọn cost thấp hơn',
        },
        {
          stdinLines: ['0.5,100,2', '0.6,100,2', '0.7,100,2', '0.9,200,5'],
          expected: 'no-feasible-option',
          match: 'contains',
          hidden: true,
          label: 'không option đạt quality',
        },
        {
          stdinLines: ['nan,1,1', '0.8,1,1', '0.8,1,1', '0.8,2,2'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'NaN bị từ chối',
        },
      ],
      hints: [
        'Đặt tên option cố định trong tuple.',
        'Kiểm math.isfinite trước filter.',
        'Sort với quality âm để quality lớn đứng trước.',
      ],
      sampleSolution: `import math\ndef row(line):\n    try:\n        xs = [float(x.strip()) for x in line.split(",")]\n    except ValueError:\n        return None\n    return xs if len(xs) == 3 and all(math.isfinite(x) for x in xs) else None\nrows = [row(input().strip()) for _ in range(3)]\nlimits = row(input().strip())\nif any(x is None for x in rows) or limits is None:\n    print("input-khong-hop-le"); raise SystemExit\nfor quality, latency, cost in rows + [limits]:\n    if not 0 <= quality <= 1 or latency < 0 or cost < 0:\n        print("input-khong-hop-le"); raise SystemExit\nnames = ["prompt", "fine-tune", "quantize"]\nmin_q, max_lat, max_cost = limits\ncandidates = [(name, *values) for name, values in zip(names, rows) if values[0] >= min_q and values[1] <= max_lat and values[2] <= max_cost]\nif not candidates:\n    print("no-feasible-option")\nelse:\n    name, _, _, _ = sorted(candidates, key=lambda x: (-x[1], x[2], x[3], x[0]))[0]\n    print(f"selected={name}")\n    print("reason=quality-latency-cost")`,
    },
    homework:
      'Viết ADR ngắn về một cột còn thiếu trong bảng, ví dụ risk hay maintenance, và mô tả dữ liệu nào cần thu thập trước quyết định thật.',
    srsCards: [
      {
        hoi: 'Vì sao cần lọc theo constraint trước khi xếp hạng option?',
        dap: 'Một option vượt latency hoặc cost limit không còn feasible, nên quality cao của nó không được phép lấn át một ràng buộc đã cam kết.',
      },
      {
        hoi: 'Tie-break của bảng quyết định cần được công bố vì sao?',
        dap: 'Quy tắc ổn định giúp cùng input luôn cho cùng kết quả, khiến người đọc kiểm chứng được quyết định thay vì đoán thứ tự ngầm.',
      },
    ],
  },
  {
    id: 'p6-u173-l2',
    unitId: 'p6-u173',
    language: 'python',
    title: 'Quantization trade-off — không gọi số mô phỏng là benchmark',
    hook: 'Giảm bit có thể giảm memory ước tính, nhưng không cho phép suy ra latency hay chất lượng của bất kỳ model cụ thể nào.',
    theory:
      'Simulator tính memory ước lượng từ parameter count và bits mỗi parameter, rồi chỉ so các phương án theo budget memory và quality proxy do người dùng cung cấp. Kết quả có nhãn MÔ PHỎNG và không phải benchmark GPU, serving, quantizer hay model thật.',
    workedExample: {
      code: `# 8 parameter ở 8 bit dùng 8 byte trong công thức đơn giản.\nparams = 8\nbits = 8\nprint(params * bits / 8)`,
      stdinLines: [],
    },
    predict: {
      code: `print(16 * 4 / 8)`,
      question: 'Memory ước lượng theo byte là bao nhiêu?',
      choices: ['2', '4', '8', '16'],
      answerIndex: 2,
      explain: 'Mười sáu parameter nhân bốn bit rồi chia tám bit mỗi byte bằng tám byte.',
    },
    parsons: {
      prompt: 'Xếp công thức memory estimate có đơn vị.',
      lines: [
        'def memory_bytes(params, bits):',
        '    return params * bits / 8',
        'estimate = memory_bytes(params, bits)',
        'print(f"memory={estimate:.1f}")',
      ],
    },
    make: {
      prompt:
        'Đọc params nguyên 1..1_000_000, rồi hai dòng `bits,quality` cho option A/B và budget_bytes nguyên dương. Bits chỉ 4,8,16; quality 0..1. In `memory-a=<1 số>`, `memory-b=<1 số>`, chọn option quality cao nhất trong budget; hoà chọn memory thấp hơn rồi A. In `no-feasible-option` nếu cả hai vượt budget. Input sai in `input-khong-hop-le`. Nhãn này là MÔ PHỎNG memory, không phải latency benchmark.',
      starterCode:
        '# Không suy luận latency từ bits trong simulator này.\nparams = input().strip()',
      testCases: [
        {
          stdinLines: ['100', '8,0.90', '4,0.85', '100'],
          expected: 'memory-a=100.0\nmemory-b=50.0\nselected=a',
          match: 'contains',
          hidden: false,
          label: 'quality cao hơn vẫn trong budget',
        },
        {
          stdinLines: ['100', '16,0.9', '8,0.9', '100'],
          expected: 'selected=b',
          match: 'contains',
          hidden: true,
          label: 'tie quality chọn memory thấp',
        },
        {
          stdinLines: ['100', '16,0.9', '8,0.8', '20'],
          expected: 'no-feasible-option',
          match: 'contains',
          hidden: true,
          label: 'vượt memory budget',
        },
        {
          stdinLines: ['0', '8,0.9', '4,0.8', '100'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'params phải dương',
        },
      ],
      hints: [
        'Parse bits thành int và quality thành float.',
        'Memory bytes là params*bits/8.',
        'Chỉ sort các option không vượt budget.',
      ],
      sampleSolution: `import math\ntry:\n    params = int(input().strip())\n    def parse():\n        bits_s, quality_s = input().strip().split(",")\n        return int(bits_s.strip()), float(quality_s.strip())\n    a = parse(); b = parse(); budget = int(input().strip())\nexcept ValueError:\n    print("input-khong-hop-le"); raise SystemExit\nif not 1 <= params <= 1_000_000 or budget <= 0 or any(bits not in (4, 8, 16) or not math.isfinite(q) or not 0 <= q <= 1 for bits, q in [a, b]):\n    print("input-khong-hop-le"); raise SystemExit\nma = params * a[0] / 8; mb = params * b[0] / 8\nprint(f"memory-a={ma:.1f}"); print(f"memory-b={mb:.1f}")\nchoices = [("a", a[1], ma), ("b", b[1], mb)]\nchoices = [x for x in choices if x[2] <= budget]\nif not choices:\n    print("no-feasible-option")\nelse:\n    print("selected=" + sorted(choices, key=lambda x: (-x[1], x[2], x[0]))[0][0])`,
    },
    homework:
      'Liệt kê ba yếu tố ngoài bits khiến latency production khác nhau, rồi nêu benchmark có kiểm soát cần đo chúng ra sao.',
    srsCards: [
      {
        hoi: 'Công thức memory simulator tính gì?',
        dap: 'Nó ước lượng byte bằng số parameter nhân bits mỗi parameter rồi chia tám; công thức chỉ là proxy được giới hạn rõ ràng.',
      },
      {
        hoi: 'Vì sao bits thấp không đủ để kết luận latency tốt hơn?',
        dap: 'Latency thực còn phụ thuộc phần cứng, kernel, batch, memory bandwidth và runtime, những thứ simulator không đo hoặc mô hình hoá.',
      },
    ],
  },
]
