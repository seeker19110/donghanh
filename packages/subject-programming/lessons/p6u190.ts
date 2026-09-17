// P6-U190 — architecture-s4-m1: NFR quality gate co the do luong.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U190_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u190-l1',
    unitId: 'p6-u190',
    language: 'python',
    title: 'MÔ PHỎNG quality gate cho bốn NFR',
    hook: 'Một bản phát hành “có vẻ nhanh” vẫn không an toàn nếu không ai nói rõ nhanh là bao nhiêu, đo ở đâu và khi nào phải dừng.',
    theory:
      'NFR chỉ kiểm chứng được khi mỗi metric có số đo hiện tại và một threshold có chiều so sánh rõ ràng. Simulator này dùng bốn metric bắt buộc: latency và cost không được vượt trần; availability không được thấp hơn sàn; error không được vượt trần. Nó fail closed: thiếu metric, thiếu threshold, giá trị ngoài miền hoặc vi phạm một ngưỡng đều là fail, không phải là “tạm cho qua”. Đây là gate trên fixture nhỏ, không tự deploy hay thay thế SLO production.',
    workedExample: {
      code: `# Luu metric cua ban phat hanh dang duoc danh gia.\nmetrics = {"latency": 120, "availability": 99.95, "error": 0.04, "cost": 0.18}\n# Dat nguong co huong so sanh ro rang cho tung metric.\nlimits = {"latency": 150, "availability": 99.9, "error": 0.10, "cost": 0.25}\n# Kiem tra latency khong duoc vuot qua tran da cam ket.\nprint(metrics["latency"] <= limits["latency"])`,
      stdinLines: [],
    },
    predict: {
      code: `# So sanh latency thuc te voi latency budget.\nlatency_ms = 180\nlatency_budget_ms = 150\n# In ket qua cua quality gate cho metric nay.\nprint(latency_ms <= latency_budget_ms)`,
      question:
        'Nếu latency là 180 ms còn budget là 150 ms, quality gate của metric latency in ra gì?',
      choices: ['True', 'False', 'pass', '180'],
      answerIndex: 1,
      explain:
        '180 lớn hơn trần 150 nên điều kiện latency <= budget là False; một metric fail đủ để release không qua gate.',
    },
    parsons: {
      prompt: 'Xếp các bước để kiểm một metric có ngưỡng trần.',
      lines: [
        'actual = metrics["latency"]',
        'limit = limits["latency"]',
        'if actual > limit:',
        '    failures.append("latency-threshold")',
        'else:',
        '    passed.append("latency")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG NFR quality gate, không gọi service hay deploy. Đọc dòng 1 `latency,availability,error,cost` và dòng 2 `latency,availability,error,cost` là các số thực theo đúng thứ tự: dòng 1 là actual, dòng 2 là threshold. Ràng buộc: latency/error/cost phải >= 0, availability trong 0..100; threshold latency/error/cost là trần, availability là sàn. In `gate=pass` nếu đủ cả bốn metric và mọi ngưỡng đạt. Nếu thiếu đúng bốn số, không parse được, hoặc ngoài miền in `gate=fail` rồi `reason=metric-hoac-threshold-thieu`. Nếu có vi phạm, in `gate=fail` rồi mỗi reason theo thứ tự `latency-threshold`, `availability-threshold`, `error-threshold`, `cost-threshold`. Không tự sửa số đo hay quyết định deploy.',
      starterCode: `actual_line = input().strip()\nthreshold_line = input().strip()\n\n# MÔ PHỎNG: quality gate fail closed cho bốn NFR bắt buộc.`,
      testCases: [
        {
          stdinLines: ['120,99.95,0.04,0.18', '150,99.9,0.10,0.25'],
          expected: 'gate=pass',
          match: 'contains',
          hidden: false,
          label: 'bốn metric đều đạt threshold',
        },
        {
          stdinLines: ['180,99.80,0.14,0.30', '150,99.9,0.10,0.25'],
          expected:
            'gate=fail\nreason=latency-threshold\nreason=availability-threshold\nreason=error-threshold\nreason=cost-threshold',
          match: 'contains',
          hidden: true,
          label: 'nhiều NFR vi phạm phải fail có lý do',
        },
        {
          stdinLines: ['120,99.95,0.04', '150,99.9,0.10,0.25'],
          expected: 'gate=fail\nreason=metric-hoac-threshold-thieu',
          match: 'contains',
          hidden: true,
          label: 'thiếu metric không được giả định đạt',
        },
        {
          stdinLines: ['120,101,0.04,0.18', '150,99.9,0.10,0.25'],
          expected: 'gate=fail\nreason=metric-hoac-threshold-thieu',
          match: 'contains',
          hidden: true,
          label: 'availability ngoài miền là input không đáng tin',
        },
      ],
      hints: [
        'Tách bằng dấu phẩy và chỉ nhận đúng bốn token cho mỗi dòng.',
        'Dùng một danh sách reason theo thứ tự cố định để output tái lập.',
        'Đừng dùng giá trị mặc định khi thiếu metric hoặc threshold: gate phải fail closed.',
      ],
      sampleSolution: `try:
    actual = [float(part.strip()) for part in input().strip().split(",")]
    limits = [float(part.strip()) for part in input().strip().split(",")]
    if len(actual) != 4 or len(limits) != 4:
        raise ValueError
    latency, availability, error, cost = actual
    max_latency, min_availability, max_error, max_cost = limits
    if (
        latency < 0 or error < 0 or cost < 0 or not 0 <= availability <= 100
        or max_latency < 0 or max_error < 0 or max_cost < 0
        or not 0 <= min_availability <= 100
    ):
        raise ValueError
    reasons = []
    if latency > max_latency:
        reasons.append("latency-threshold")
    if availability < min_availability:
        reasons.append("availability-threshold")
    if error > max_error:
        reasons.append("error-threshold")
    if cost > max_cost:
        reasons.append("cost-threshold")
    if reasons:
        print("gate=fail")
        for reason in reasons:
            print("reason=" + reason)
    else:
        print("gate=pass")
except (EOFError, ValueError):
    print("gate=fail")
    print("reason=metric-hoac-threshold-thieu")`,
    },
    homework:
      'Chọn một API bạn quen thuộc, viết bốn NFR có đơn vị, threshold, cửa sổ đo và owner. Nêu một trường hợp metric tốt nhưng vẫn phải dừng phát hành vì evidence đo không đại diện cho tải thật.',
    srsCards: [
      {
        hoi: 'Vì sao NFR phải có metric, đơn vị và threshold có chiều so sánh rõ ràng?',
        dap: 'Chỉ khi có số đo, đơn vị và điều kiện như latency không vượt trần hoặc availability không dưới sàn thì một gate mới có thể cho kết quả tái lập và audit được.',
      },
      {
        hoi: 'Khi thiếu một metric hoặc threshold trong release gate, policy an toàn là gì?',
        dap: 'Fail closed: trả fail với lý do evidence thiếu thay vì tự điền giá trị mặc định, vì thiếu dữ liệu không chứng minh release đang đáp ứng NFR.',
      },
    ],
  },
  {
    id: 'p6-u190-l2',
    unitId: 'p6-u190',
    language: 'python',
    title: 'MÔ PHỎNG regression gate và ngân sách thay đổi',
    hook: 'Một release có thể còn dưới threshold tuyệt đối nhưng vẫn làm latency, lỗi hoặc chi phí xấu đi quá nhanh so với baseline đã được duyệt.',
    theory:
      'Regression gate so actual với baseline để giới hạn mức xấu đi được chấp nhận. Với latency, error và cost, delta dương là xấu; với availability, delta âm là xấu. Mỗi metric cần một regression budget riêng, và simulator trả fail nếu baseline hoặc budget thiếu. Threshold tuyệt đối bảo vệ mức dịch vụ tối thiểu; regression budget bảo vệ tốc độ suy giảm giữa hai release. Cả hai cần được ghi rõ trong ADR/SLO thay vì chỉ kết luận cảm tính rằng kết quả “gần như ổn”.',
    workedExample: {
      code: `# Tinh muc xau di cua latency so voi baseline.\nbaseline_ms = 100\nactual_ms = 112\n# Gan gia tri duong khi release cham hon baseline.\nregression_ms = actual_ms - baseline_ms\n# Kiem tra release co nam trong budget 10 ms hay khong.\nprint(regression_ms <= 10)`,
      stdinLines: [],
    },
    predict: {
      code: `# Availability giam thi muc xau di la baseline tru actual.\nbaseline = 99.95\nactual = 99.90\n# Tinh so diem phan tram availability da mat.\nloss = baseline - actual\n# In muc xau di, lam tron 2 chu so de tranh sai so dau phay dong.\nprint(round(loss, 2))`,
      question: 'Baseline availability 99.95 còn actual 99.90. Mức regression in ra là bao nhiêu?',
      choices: ['0.05', '-0.05', '99.90', '199.85'],
      answerIndex: 0,
      explain:
        'Với availability, actual thấp hơn là xấu nên lấy baseline - actual = 0.05 điểm phần trăm.',
    },
    parsons: {
      prompt: 'Xếp bước để fail release khi latency regress vượt budget.',
      lines: [
        'regression = actual_latency - baseline_latency',
        'if regression > latency_budget:',
        '    status = "fail"',
        '    reason = "latency-regression"',
        'else:',
        '    status = "pass"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG regression gate, chỉ xử lý fixture nhỏ. Đọc dòng 1 baseline `latency,availability,error,cost`, dòng 2 actual cùng thứ tự, dòng 3 budgets `latency,availability,error,cost`. Mỗi số phải parse được; latency/error/cost >= 0 và availability trong 0..100; mọi budget >= 0. Xấu đi nghĩa là actual-baseline cho latency/error/cost và baseline-actual cho availability. In `regression=pass` nếu cả bốn mức xấu đi không vượt budget. Nếu dữ liệu thiếu/sai, in `regression=fail` và `reason=baseline-hoac-budget-thieu`. Nếu vượt budget, in `regression=fail` rồi reason theo thứ tự `latency-regression`, `availability-regression`, `error-regression`, `cost-regression`. Không được promote, rollback hay ghi trạng thái bên ngoài; chỉ trả policy decision an toàn.',
      starterCode: `baseline_line = input().strip()\nactual_line = input().strip()\nbudget_line = input().strip()\n\n# MÔ PHỎNG: regression gate co baseline va budget ro rang.`,
      testCases: [
        {
          stdinLines: ['100,99.95,0.02,0.15', '108,99.93,0.03,0.17', '10,0.03,0.02,0.03'],
          expected: 'regression=pass',
          match: 'contains',
          hidden: false,
          label: 'mọi mức xấu đi còn trong budget',
        },
        {
          stdinLines: ['100,99.95,0.02,0.15', '115,99.90,0.06,0.20', '10,0.03,0.02,0.03'],
          expected:
            'regression=fail\nreason=latency-regression\nreason=availability-regression\nreason=error-regression\nreason=cost-regression',
          match: 'contains',
          hidden: true,
          label: 'regression nhiều metric phải bị chặn',
        },
        {
          stdinLines: ['100,99.95,0.02', '108,99.93,0.03,0.17', '10,0.03,0.02,0.03'],
          expected: 'regression=fail\nreason=baseline-hoac-budget-thieu',
          match: 'contains',
          hidden: true,
          label: 'thiếu baseline không suy đoán được regression',
        },
        {
          stdinLines: ['100,99.95,0.02,0.15', '95,99.97,0.01,0.10', '-1,0.03,0.02,0.03'],
          expected: 'regression=fail\nreason=baseline-hoac-budget-thieu',
          match: 'contains',
          hidden: true,
          label: 'budget âm không là hợp đồng hợp lệ',
        },
      ],
      hints: [
        'Viết hàm parse nhận đúng bốn số cho mỗi dòng trước khi tính delta.',
        'Availability có hướng ngược: giảm từ baseline mới là regression.',
        'Nếu metric cải thiện, delta âm không phải lý do fail; chỉ delta lớn hơn budget mới fail.',
      ],
      sampleSolution: `try:
    def parse(line):
        values = [float(part.strip()) for part in line.strip().split(",")]
        if len(values) != 4:
            raise ValueError
        return values

    baseline = parse(input())
    actual = parse(input())
    budget = parse(input())
    for values in (baseline, actual):
        latency, availability, error, cost = values
        if latency < 0 or error < 0 or cost < 0 or not 0 <= availability <= 100:
            raise ValueError
    if any(value < 0 for value in budget):
        raise ValueError
    deltas = [
        actual[0] - baseline[0],
        baseline[1] - actual[1],
        actual[2] - baseline[2],
        actual[3] - baseline[3],
    ]
    names = ["latency", "availability", "error", "cost"]
    reasons = [name + "-regression" for name, delta, limit in zip(names, deltas, budget) if delta > limit]
    if reasons:
        print("regression=fail")
        for reason in reasons:
            print("reason=" + reason)
    else:
        print("regression=pass")
except (EOFError, ValueError):
    print("regression=fail")
    print("reason=baseline-hoac-budget-thieu")`,
    },
    homework:
      'Soạn một release note có baseline, actual, regression budget, owner và hành động khi fail cho một endpoint. Giải thích vì sao một threshold tuyệt đối đạt vẫn có thể không đủ để approve thay đổi.',
    srsCards: [
      {
        hoi: 'Khác biệt giữa threshold tuyệt đối và regression budget trong quality gate là gì?',
        dap: 'Threshold tuyệt đối bảo vệ mức dịch vụ tối thiểu hoặc tối đa, còn regression budget giới hạn mức xấu đi so với baseline của release đã được duyệt.',
      },
      {
        hoi: 'Vì sao availability regression được tính baseline trừ actual?',
        dap: 'Availability thấp hơn baseline mới là xấu; lấy baseline trừ actual cho delta dương khi dịch vụ mất availability, nên có thể so sánh nhất quán với budget dương.',
      },
    ],
  },
]
