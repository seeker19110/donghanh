// P6-U160 — mathforcode-s4-m1,m2: finite difference, descent và regression hữu hạn.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U160_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u160-l1',
    unitId: 'p6-u160',
    language: 'python',
    title: 'MÔ PHỎNG finite difference và gradient descent',
    hook: 'Một bước theo gradient chỉ hữu ích khi hướng, epsilon và learning rate đều có hợp đồng rõ ràng.',
    theory:
      'Bài dùng quadratic hữu hạn f(x)=(x-target)^2, không phải training thật. Finite difference trung tâm là (f(x+epsilon)-f(x-epsilon))/(2*epsilon). Epsilon và learning rate phải dương; bước làm loss tăng phải báo diverged, không được gọi là hội tụ.',
    workedExample: {
      code: `# MO PHONG finite difference, khong train model that.
x, target, epsilon, lr = 8.0, 3.0, 0.01, 0.2
f = lambda value: (value - target) ** 2
gradient = (f(x + epsilon) - f(x - epsilon)) / (2 * epsilon)
print(round(x - lr * gradient, 2))`,
      stdinLines: [],
    },
    predict: {
      code: `x, target, lr = 5.0, 2.0, 0.25
gradient = 2 * (x - target)
print(x - lr * gradient)`,
      question: 'Một bước descent từ x=5 về target=2 in gì?',
      choices: ['3.5', '6.5', '2.0', '-1.0'],
      answerIndex: 0,
      explain: 'Gradient là 6; cập nhật 5 - 0.25*6 = 3.5, tức là đi ngược chiều tăng loss.',
    },
    parsons: {
      prompt: 'Xếp một bước finite-difference descent có guard loss.',
      lines: [
        'gradient = (f(x + epsilon) - f(x - epsilon)) / (2 * epsilon)',
        'candidate = x - lr * gradient',
        'if f(candidate) > f(x):',
        '    print("diverged")',
        'else:',
        '    print("ok=" + str(round(candidate, 3)))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một bước finite-difference descent cho f(x)=(x-target)^2. Đọc `x target epsilon lr` là bốn số hữu hạn. epsilon/lr không dương in `tu-choi`. Tính gradient trung tâm và candidate. Nếu loss candidate lớn hơn loss cũ (cộng 1e-9) in `diverged`; còn lại in `ok=<candidate làm tròn 3 chữ số>`. Input sai in `tu-choi`.',
      starterCode: `# MO PHONG, khong dung autograd hay thu vien ML.
`,
      testCases: [
        {
          stdinLines: ['8 3 0.01 0.2'],
          expected: 'ok=6.0',
          match: 'exact',
          hidden: false,
          label: 'bước đi về phía cực tiểu',
        },
        {
          stdinLines: ['8 3 0 0.2'],
          expected: 'tu-choi',
          match: 'exact',
          hidden: true,
          label: 'epsilon bằng 0 bị từ chối',
        },
        {
          stdinLines: ['8 3 0.01 -0.2'],
          expected: 'tu-choi',
          match: 'exact',
          hidden: true,
          label: 'learning rate âm bị từ chối',
        },
        {
          stdinLines: ['8 3 0.01 2'],
          expected: 'diverged',
          match: 'exact',
          hidden: true,
          label: 'bước quá lớn làm loss tăng',
        },
      ],
      hints: [
        'Dùng `math.isfinite` để chặn NaN và infinity.',
        'Đặt f là hàm nhỏ để dùng lại.',
        'Chỉ in candidate sau guard loss.',
      ],
      sampleSolution: `import math
try:
    x, target, epsilon, lr = map(float, input().split())
    if not all(map(math.isfinite, [x, target, epsilon, lr])) or epsilon <= 0 or lr <= 0: raise ValueError
    f = lambda value: (value - target) ** 2
    gradient = (f(x + epsilon) - f(x - epsilon)) / (2 * epsilon)
    candidate = x - lr * gradient
    print("diverged" if f(candidate) > f(x) + 1e-9 else "ok=" + str(round(candidate, 3)))
except ValueError:
    print("tu-choi")`,
    },
    homework:
      'Vẽ loss quadratic và so sánh gradient analytic với finite difference ở ba epsilon. Artifact NumPy/biểu đồ thật phải nộp riêng; simulator không chứng minh convergence tổng quát.',
    srsCards: [
      {
        hoi: 'Finite difference trung tâm xấp xỉ gradient thế nào?',
        dap: 'Lấy f(x+epsilon)-f(x-epsilon), rồi chia cho 2*epsilon.',
      },
      {
        hoi: 'Khi nào mô hình báo diverged?',
        dap: 'Khi candidate làm loss tăng sau khi input đã hợp lệ.',
      },
    ],
  },
  {
    id: 'p6-u160-l2',
    unitId: 'p6-u160',
    language: 'python',
    title: 'MÔ PHỎNG MSE, MAE và hồi quy tuyến tính',
    hook: 'Cùng một sai số lớn có thể bị MSE phạt mạnh hơn MAE; chọn loss là chọn hành vi muốn tối ưu.',
    theory:
      'Với prediction và target ghép cặp, MAE là trung bình trị tuyệt đối residual, còn MSE là trung bình bình phương residual. Bài chỉ đánh giá đường y=w*x+b trên dữ liệu hữu hạn, không training hay kết luận accuracy. Shape rỗng, sai hay NaN/inf phải bị từ chối.',
    workedExample: {
      code: `# MO PHONG hai loss tren residual huu han.
errors = [1, -1, 4]
mae = sum(abs(e) for e in errors) / len(errors)
mse = sum(e * e for e in errors) / len(errors)
print(round(mae, 2), round(mse, 2))`,
      stdinLines: [],
    },
    predict: {
      code: `errors = [0, 0, 6]
mae = sum(abs(e) for e in errors) / 3
mse = sum(e * e for e in errors) / 3
print(mae < mse)`,
      question: 'Với outlier 6, biểu thức cuối in gì?',
      choices: ['True', 'False', '6', 'Lỗi chia 0'],
      answerIndex: 0,
      explain: 'Bình phương outlier làm MSE lớn hơn MAE: 12 so với 2.',
    },
    parsons: {
      prompt: 'Xếp phần tính hai loss cho các cặp prediction/target.',
      lines: [
        'errors = [pred - target for pred, target in zip(predictions, targets)]',
        'mae = sum(abs(error) for error in errors) / len(errors)',
        'mse = sum(error * error for error in errors) / len(errors)',
        'print("mae=" + str(round(mae, 3)))',
        'print("mse=" + str(round(mse, 3)))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG đánh giá hồi quy y=w*x+b. Dòng 1 là `w b`; dòng 2 là các cặp `x:y` cách nhau bởi dấu phẩy. Cần ít nhất một cặp và tất cả hữu hạn. In `mae=<3 chữ số>` rồi `mse=<3 chữ số>`. Input sai, rỗng hoặc NaN/inf in `tu-choi`. Không train, không dùng thư viện ML.',
      starterCode: `# Doc w, b va cac cap x:y; regression MO PHONG.
`,
      testCases: [
        {
          stdinLines: ['2 1', '0:1,1:3,2:5'],
          expected: 'mae=0.0\nmse=0.0',
          match: 'exact',
          hidden: false,
          label: 'đường dự đoán khớp hoàn toàn',
        },
        {
          stdinLines: ['1 0', '0:0,1:3'],
          expected: 'mae=1.0\nmse=2.0',
          match: 'exact',
          hidden: true,
          label: 'MSE phạt residual lớn hơn',
        },
        {
          stdinLines: ['1 0', ''],
          expected: 'tu-choi',
          match: 'exact',
          hidden: true,
          label: 'không chia loss cho tập rỗng',
        },
      ],
      hints: [
        'Tách mỗi token đúng một lần bằng `split(":")`.',
        'Kiểm tra `math.isfinite` cho mọi số.',
        'Làm tròn bằng `round(value, 3)`.',
      ],
      sampleSolution: `import math
try:
    w, b = map(float, input().split())
    pairs = input().split(",")
    if not pairs or any(not pair for pair in pairs): raise ValueError
    errors = []
    for pair in pairs:
        x, y = map(float, pair.split(":"))
        if not all(map(math.isfinite, [w, b, x, y])): raise ValueError
        errors.append(w * x + b - y)
    mae = sum(abs(error) for error in errors) / len(errors)
    mse = sum(error * error for error in errors) / len(errors)
    print("mae=" + str(round(mae, 3)))
    print("mse=" + str(round(mse, 3)))
except (ValueError, EOFError):
    print("tu-choi")`,
    },
    homework:
      'Lập bảng residual có outlier và giải thích trade-off MAE/MSE. Nếu vẽ loss thật, nộp code, dữ liệu và biểu đồ như artifact ngoài sandbox.',
    srsCards: [
      {
        hoi: 'MSE khác MAE ở đâu?',
        dap: 'MSE bình phương residual nên phạt outlier mạnh hơn; MAE dùng trị tuyệt đối.',
      },
      {
        hoi: 'Vì sao phải từ chối tập rỗng?',
        dap: 'Loss trung bình không xác định khi không có mẫu và không là bằng chứng chất lượng model.',
      },
    ],
  },
]
