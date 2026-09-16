// P6-U161 — mathforcode-s4-m3,m4: chain rule và tối ưu ràng buộc trên miền hữu hạn.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U161_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u161-l1',
    unitId: 'p6-u161',
    language: 'python',
    title: 'MÔ PHỎNG chain rule và gradient check',
    hook: 'Backprop không phải phép màu: nó là chain rule áp dụng có hệ thống, và numerical gradient là một phép kiểm độc lập trên miền nhỏ.',
    theory:
      'Mô hình một neuron ẩn tuyến tính: h=w*x+b, loss=(h-target)^2. Chain rule cho dL/dw = 2*(h-target)*x. Finite difference kiểm dL/dw bằng (L(w+epsilon)-L(w-epsilon))/(2*epsilon); ta báo relative error hữu hạn thay vì tuyên bố mọi mạng đều đúng. Epsilon/tolerance phải dương và số không hữu hạn bị từ chối.',
    workedExample: {
      code: `# MO PHONG chain rule cho mot neuron, khong dung autograd.
x, w, b, target = 2.0, 3.0, 1.0, 5.0
h = w * x + b
analytic = 2 * (h - target) * x
print("dL/dw=" + str(analytic))`,
      stdinLines: [],
    },
    predict: {
      code: `x, w, b, target = 2.0, 3.0, 1.0, 5.0
h = w * x + b
print(2 * (h - target) * x)`,
      question: 'Gradient analytic dL/dw của loss (w*x+b-target)^2 in gì?',
      choices: ['8.0', '4.0', '16.0', '-8.0'],
      answerIndex: 0,
      explain: 'h=7, residual=2; đạo hàm loss theo h là 4 và dh/dw=x=2, nên gradient là 8.',
    },
    parsons: {
      prompt: 'Xếp gradient check MÔ PHỎNG để so analytic với numerical.',
      lines: [
        'loss = lambda weight: (weight * x + b - target) ** 2',
        'numeric = (loss(w + epsilon) - loss(w - epsilon)) / (2 * epsilon)',
        'analytic = 2 * (w * x + b - target) * x',
        'relative = abs(analytic - numeric) / max(1.0, abs(analytic), abs(numeric))',
        'print("pass" if relative <= tolerance else "mismatch")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG gradient check cho L=(w*x+b-target)^2. Đọc `x w b target epsilon tolerance`. Tất cả phải hữu hạn; epsilon và tolerance phải dương, nếu không in `tu-choi`. Tính analytic dL/dw, numerical central difference, relative error = |a-n|/max(1,|a|,|n|). In `pass` nếu relative <= tolerance, ngược lại `mismatch`; dòng sau luôn là `relative=<6 chữ số>`. Không autograd hay training thật.',
      starterCode: `# Gradient check MO PHONG cho mot neuron tuyen tinh.
`,
      testCases: [
        {
          stdinLines: ['2 3 1 5 0.001 0.0001'],
          expected: 'pass\nrelative=0.0',
          match: 'contains',
          hidden: false,
          label: 'chain rule khớp finite difference',
        },
        {
          stdinLines: ['2 3 1 5 0 0.1'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'epsilon bằng 0 bị từ chối',
        },
        {
          stdinLines: ['nan 3 1 5 0.01 0.1'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'NaN không được lan vào gradient',
        },
      ],
      hints: [
        'Viết `loss(weight)` để numerical chỉ thay w.',
        'Công thức analytic gồm residual và x.',
        'Dùng `max(1.0, ...)` để relative error ổn định gần gradient 0.',
      ],
      sampleSolution: `import math
try:
    x, w, b, target, epsilon, tolerance = map(float, input().split())
    values = [x, w, b, target, epsilon, tolerance]
    if not all(map(math.isfinite, values)) or epsilon <= 0 or tolerance <= 0: raise ValueError
    loss = lambda weight: (weight * x + b - target) ** 2
    analytic = 2 * (w * x + b - target) * x
    numeric = (loss(w + epsilon) - loss(w - epsilon)) / (2 * epsilon)
    relative = abs(analytic - numeric) / max(1.0, abs(analytic), abs(numeric))
    print("pass" if relative <= tolerance else "mismatch")
    print("relative=" + str(round(relative, 6)))
except ValueError:
    print("tu-choi")`,
    },
    homework:
      'Thay neuron tuyến tính bằng activation differentiable trên giấy, tự suy ra chain rule, rồi so sánh gradient analytic/numerical bằng code thật và lưu threshold, seed/dữ liệu như artifact. Simulator không chứng minh toàn bộ backprop framework.',
    srsCards: [
      {
        hoi: 'Gradient dL/dw của (w*x+b-target)^2 là gì?',
        dap: '2*(w*x+b-target)*x, do chain rule qua h=w*x+b.',
      },
      {
        hoi: 'Vì sao relative error chia cho max(1, |a|, |n|)?',
        dap: 'Để so sánh ổn định khi hai gradient gần 0, tránh chia cho số rất nhỏ.',
      },
    ],
  },
  {
    id: 'p6-u161-l2',
    unitId: 'p6-u161',
    language: 'python',
    title: 'MÔ PHỎNG tối ưu giá có budget và ràng buộc',
    hook: 'Một giá cho doanh thu cao nhưng vượt budget hay ngoài policy không phải phương án khả thi.',
    theory:
      'Bài duyệt một miền giá nguyên hữu hạn từ low đến high với step dương. Demand MÔ PHỎNG là max(0, base-demand*(1-slope*price)); revenue=price*demand và cost=unit-cost*demand. Chỉ ứng viên cost <= budget mới khả thi. Nếu không có ứng viên in infeasible; kết quả chỉ tối ưu trong miền hữu hạn đã nêu, không suy rộng thành price engine production.',
    workedExample: {
      code: `# MO PHONG finite search; moi gia phai qua budget.
best = None
for price in range(1, 6):
    demand = max(0, 10 - price)
    cost = 2 * demand
    if cost <= 14:
        candidate = (price * demand, price)
        best = max(best, candidate) if best else candidate
print(best)`,
      stdinLines: [],
    },
    predict: {
      code: `budget, unit_cost, demand = 10, 3, 4
print("feasible" if unit_cost * demand <= budget else "infeasible")`,
      question: 'Một ứng viên cost 12 với budget 10 được phân loại thế nào?',
      choices: ['infeasible', 'feasible', 'optimal', 'diverged'],
      answerIndex: 0,
      explain: 'Do 3*4 lớn hơn budget 10, ứng viên bị loại trước khi so doanh thu.',
    },
    parsons: {
      prompt: 'Xếp vòng duyệt finite search chỉ nhận ứng viên khả thi.',
      lines: [
        'for price in range(low, high + 1, step):',
        '    demand = max(0, base_demand - slope * price)',
        '    cost = unit_cost * demand',
        '    if cost <= budget:',
        '        candidate = (price * demand, -price)',
        '        best = max(best, candidate) if best else candidate',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG finite price search. Đọc `low high step base_demand slope unit_cost budget` là số nguyên; low<=high, step>0, base_demand/slope/unit_cost/budget không âm. Duyệt các price từ low đến high inclusive theo step; demand=max(0,base_demand-slope*price), cost=unit_cost*demand. Chỉ cost<=budget là feasible. Chọn revenue=price*demand lớn nhất; hòa thì chọn price nhỏ hơn. In `price=<p>,revenue=<r>` hoặc `infeasible`. Input sai in `tu-choi`.',
      starterCode: `# Finite search MO PHONG, khong phai price engine production.
`,
      testCases: [
        {
          stdinLines: ['1 5 1 10 1 2 14'],
          expected: 'price=5,revenue=25',
          match: 'contains',
          hidden: false,
          label: 'chỉ giá đạt budget được xét',
        },
        {
          stdinLines: ['1 3 1 10 0 2 1'],
          expected: 'infeasible',
          match: 'contains',
          hidden: true,
          label: 'miền không có phương án khả thi',
        },
        {
          stdinLines: ['1 5 0 10 1 2 14'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'step 0 không được lặp vô hạn',
        },
        {
          stdinLines: ['1 4 1 4 1 0 99'],
          expected: 'price=2,revenue=4',
          match: 'contains',
          hidden: true,
          label: 'hòa doanh thu chọn giá nhỏ hơn',
        },
      ],
      hints: [
        'Kiểm tra contract trước `range`.',
        'Lưu best là `(revenue, -price)` để `max` tự xử lý tie-break.',
        'Khởi tạo best là `None` để phân biệt không có candidate khả thi.',
      ],
      sampleSolution: `try:
    low, high, step, base_demand, slope, unit_cost, budget = map(int, input().split())
    if low > high or step <= 0 or min(base_demand, slope, unit_cost, budget) < 0: raise ValueError
    best = None
    for price in range(low, high + 1, step):
        demand = max(0, base_demand - slope * price)
        cost = unit_cost * demand
        if cost <= budget:
            candidate = (price * demand, -price)
            best = max(best, candidate) if best else candidate
    if best is None:
        print("infeasible")
    else:
        print("price=" + str(-best[1]) + ",revenue=" + str(best[0]))
except ValueError:
    print("tu-choi")`,
    },
    homework:
      'Nêu rõ price domain, demand assumptions, budget và tie-break trong một ADR nhỏ. Với dữ liệu thật, kiểm tra fairness, seasonal variance và approval policy; không dùng kết quả simulator để tự động đổi giá.',
    srsCards: [
      {
        hoi: 'Khi nào finite price search in infeasible?',
        dap: 'Khi không giá nào trong miền hữu hạn thỏa mọi ràng buộc, đặc biệt cost <= budget.',
      },
      {
        hoi: 'Kết quả finite search được phép kết luận đến đâu?',
        dap: 'Chỉ là tốt nhất trong miền và mô hình demand đã nêu, không phải optimum hay price engine tổng quát.',
      },
    ],
  },
]
