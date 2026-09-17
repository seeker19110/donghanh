// P6-U170 — ai-s3: loss và gradient hữu hạn, fail closed.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U170_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u170-l1',
    unitId: 'p6-u170',
    language: 'python',
    title: 'Loss bình phương — finite difference có giới hạn',
    hook: 'Một gradient số học có thể trông hợp lý ngay cả khi epsilon khiến phép chia vô nghĩa.',
    theory:
      'Loss bình phương một biến là (w - target)^2. Finite difference ước lượng gradient bằng (loss(w+epsilon)-loss(w-epsilon))/(2*epsilon). Đây là MÔ PHỎNG bounded để học cách kiểm contract, không phải huấn luyện model hay benchmark optimizer.',
    workedExample: {
      code: `# Tính loss tại hai điểm đối xứng.\ndef loss(w, target):\n    return (w - target) ** 2\neps = 0.1\ngrad = (loss(2 + eps, 5) - loss(2 - eps, 5)) / (2 * eps)\nprint(f"grad={grad:.2f}")`,
      stdinLines: [],
    },
    predict: {
      code: `def loss(w):\n    return (w - 3) ** 2\nprint(loss(1))`,
      question: 'Đoạn code in ra gì?',
      choices: ['2', '4', '-4', '9'],
      answerIndex: 1,
      explain: 'Khoảng cách từ 1 tới 3 là -2 và bình phương là 4.',
    },
    parsons: {
      prompt: 'Xếp phép finite difference trung tâm.',
      lines: [
        'def grad(w, eps):',
        '    left = loss(w - eps)',
        '    right = loss(w + eps)',
        '    return (right - left) / (2 * eps)',
      ],
    },
    make: {
      prompt:
        'Đọc w,target,epsilon là ba số thực. Với |w|,|target| <= 100 và 0 < epsilon <= 1, in `loss=<3 số>` và `grad=<3 số>` theo finite difference của loss bình phương. NaN, inf, epsilon sai hoặc kết quả không hữu hạn in `input-khong-hop-le`. Đây là MÔ PHỎNG deterministic, không train model.',
      starterCode: 'import math\n\n# Kiểm input trước khi chia cho epsilon.',
      testCases: [
        {
          stdinLines: ['2', '5', '0.1'],
          expected: 'loss=9.000\ngrad=-6.000',
          match: 'contains',
          hidden: false,
          label: 'gradient âm hướng về target',
        },
        {
          stdinLines: ['5', '5', '0.01'],
          expected: 'loss=0.000\ngrad=0.000',
          match: 'contains',
          hidden: true,
          label: 'điểm tối ưu',
        },
        {
          stdinLines: ['1', '2', '0'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'không chia epsilon zero',
        },
        {
          stdinLines: ['nan', '2', '0.1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'NaN bị chặn',
        },
      ],
      hints: [
        'Dùng math.isfinite cho cả ba input.',
        'Tính loss trước và sau epsilon.',
        'Kiểm tra finite kết quả trước khi in.',
      ],
      sampleSolution: `import math\ntry:\n    w = float(input().strip())\n    target = float(input().strip())\n    eps = float(input().strip())\nexcept ValueError:\n    print("input-khong-hop-le")\n    raise SystemExit\nif not all(math.isfinite(x) for x in [w, target, eps]) or abs(w) > 100 or abs(target) > 100 or not 0 < eps <= 1:\n    print("input-khong-hop-le")\n    raise SystemExit\ndef loss(x):\n    return (x - target) ** 2\nvalue = loss(w)\ngrad = (loss(w + eps) - loss(w - eps)) / (2 * eps)\nif not all(math.isfinite(x) for x in [value, grad]):\n    print("input-khong-hop-le")\nelse:\n    print(f"loss={value:.3f}")\n    print(f"grad={grad:.3f}")`,
    },
    homework:
      'So sánh finite difference với công thức giải tích 2*(w-target) trên một bảng input nhỏ và ghi rõ sai số do epsilon.',
    srsCards: [
      {
        hoi: 'Finite difference trung tâm ước lượng gradient như thế nào?',
        dap: 'Nó lấy chênh lệch loss ở hai điểm đối xứng quanh w rồi chia cho hai lần epsilon để xấp xỉ độ dốc tại w.',
      },
      {
        hoi: 'Vì sao epsilon bằng 0 phải bị từ chối?',
        dap: 'Công thức chia cho hai lần epsilon nên epsilon bằng 0 làm phép chia không xác định và không được biến thành gradient giả.',
      },
    ],
  },
  {
    id: 'p6-u170-l2',
    unitId: 'p6-u170',
    language: 'python',
    title: 'Checkpoint loss — phát hiện diverged trước update',
    hook: 'Một vòng lặp update không có checkpoint có thể tiếp tục tiêu tốn tài nguyên sau khi loss đã vỡ.',
    theory:
      'Simulator này ghi loss sau từng update gradient của hàm bình phương. Nó chỉ nhận số bước hữu hạn và dừng fail closed khi loss không hữu hạn hoặc vượt ngưỡng diverged; đây không phải báo cáo hội tụ của model thật.',
    workedExample: {
      code: `# Learning rate nhỏ giảm loss trong bài toán lồi này.\nw = 0.0\nfor _ in range(2):\n    w = w - 0.1 * 2 * (w - 1)\nprint(f"w={w:.2f}")`,
      stdinLines: [],
    },
    predict: {
      code: `w = 0.0\nw = w - 0.5 * 2 * (w - 1)\nprint(w)`,
      question: 'Sau một update lr=0.5, w in ra gì?',
      choices: ['-1.0', '0.5', '1.0', '2.0'],
      answerIndex: 2,
      explain: 'Gradient tại 0 là -2 nên w mới là 0 - 0.5*(-2) = 1.',
    },
    parsons: {
      prompt: 'Xếp checkpoint trước khi chạy bước kế tiếp.',
      lines: [
        'loss = (w - target) ** 2',
        'if not math.isfinite(loss) or loss > limit:',
        '    print("diverged")',
        '    break',
      ],
    },
    make: {
      prompt:
        'Đọc w,target,lr,steps. Chỉ nhận |w|,|target|<=20, 0<lr<=3 và 1<=steps<=10. Mỗi bước dùng gradient 2*(w-target), checkpoint loss mới. In `step=i loss=<3 số>`; nếu loss > 10000 hoặc không finite, in thêm `diverged` rồi dừng. Nếu hết bước, in `stable`. MÔ PHỎNG này không tuyên bố chất lượng train.',
      starterCode: 'import math\n\n# Update xong phải checkpoint loss trước vòng sau.',
      testCases: [
        {
          stdinLines: ['0', '1', '0.5', '2'],
          expected: 'step=1 loss=0.000\nstep=2 loss=0.000\nstable',
          match: 'contains',
          hidden: false,
          label: 'hội tụ mô phỏng',
        },
        {
          stdinLines: ['0', '1', '3', '5'],
          expected: 'diverged',
          match: 'contains',
          hidden: true,
          label: 'lr lớn bị dừng',
        },
        {
          stdinLines: ['0', '1', '-0.1', '2'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'lr âm bị từ chối',
        },
      ],
      hints: [
        'Tính gradient từ w hiện tại.',
        'Cập nhật w rồi mới đo checkpoint loss.',
        'Dùng math.isfinite cho loss.',
      ],
      sampleSolution: `import math\ntry:\n    w = float(input().strip()); target = float(input().strip())\n    lr = float(input().strip()); steps = int(input().strip())\nexcept ValueError:\n    print("input-khong-hop-le"); raise SystemExit\nif not all(math.isfinite(x) for x in [w, target, lr]) or abs(w) > 20 or abs(target) > 20 or not 0 < lr <= 3 or not 1 <= steps <= 10:\n    print("input-khong-hop-le"); raise SystemExit\nfor i in range(1, steps + 1):\n    w -= lr * 2 * (w - target)\n    loss = (w - target) ** 2\n    if not math.isfinite(loss) or loss > 10000:\n        print("diverged"); break\n    print(f"step={i} loss={loss:.3f}")\nelse:\n    print("stable")`,
    },
    homework:
      'Vẽ bảng loss cho ba learning rate nhỏ ngoài sandbox và nêu rõ checkpoint nào khiến bạn dừng một cấu hình không an toàn.',
    srsCards: [
      {
        hoi: 'Checkpoint loss bảo vệ vòng update bằng cách nào?',
        dap: 'Nó kiểm tra một tín hiệu sau mỗi update để dừng sớm khi giá trị không hữu hạn hoặc vượt ngưỡng đã công bố.',
      },
      {
        hoi: 'Vì sao simulator không được gọi là bằng chứng model hội tụ?',
        dap: 'Nó chỉ minh hoạ một hàm loss nhỏ có contract hẹp, không chứa dữ liệu, kiến trúc hay điều kiện vận hành của model thật.',
      },
    ],
  },
]
