// P6-U145 — algo-s1-m4: oracle, ca biên và differential test tái hiện được.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U145_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u145-l1',
    unitId: 'p6-u145',
    language: 'python',
    title: 'Oracle trước tối ưu — ca mẫu không phải bằng chứng',
    hook: 'Một bản O(n) có thể qua ba ca mẫu nhưng sai khi target bằng hai lần một phần tử chỉ xuất hiện một lần. Bản vét cạn chậm mà rõ là chiếc gương tốt nhất trên đầu vào nhỏ.',
    theory:
      'Oracle ưu tiên dễ chứng minh đúng, ví dụ duyệt mọi cặp chỉ số i<j để kiểm tổng target trong O(n²). Bản tối ưu dùng set O(n), nhưng phải kiểm phần bù trước khi thêm phần tử hiện tại; thêm trước sẽ dùng cùng một phần tử hai lần. Hợp đồng ca biên phải ghi rõ: mảng rỗng, một phần tử, phần tử trùng, số âm và biên miền. Differential test so giá trị Boolean chuẩn hóa của hai hàm, không so text trang trí.',
    workedExample: {
      code: `def brute(a, target):
    return any(a[i] + a[j] == target for i in range(len(a)) for j in range(i + 1, len(a)))

def fast(a, target):
    seen = set()
    for x in a:
        if target - x in seen:
            return True
        seen.add(x)
    return False

for a, target in [([], 0), ([1], 2), ([1, 1], 2), ([-3, 5], 2)]:
    print(brute(a, target), fast(a, target))`,
      stdinLines: [],
    },
    predict: {
      code: `a = [4]
target = 8
seen = set()
found = False
for x in a:
    if target - x in seen:
        found = True
    seen.add(x)
print(found)`,
      question: 'Bản đúng in gì với một phần tử 4 và target 8?',
      choices: ['False', 'True', '8', '4'],
      answerIndex: 0,
      explain: 'Không có hai chỉ số khác nhau; set còn rỗng lúc kiểm phần bù.',
    },
    parsons: {
      prompt: 'Xếp bản two-sum O(n) không tái sử dụng cùng một phần tử.',
      lines: [
        'def fast(a, target):',
        '    seen = set()',
        '    for x in a:',
        '        if target - x in seen:',
        '            return True',
        '        seen.add(x)',
        '    return False',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng số nguyên (có thể rỗng) và target. In kết quả `brute fast` dưới dạng 0/1 cho câu hỏi có hai chỉ số khác nhau mang tổng target hay không.',
      starterCode: `line = input().strip()
a = list(map(int, line.split())) if line else []
target = int(input())

# Oracle i < j truoc, roi toi uu bang set.
`,
      testCases: [
        {
          stdinLines: ['2 7 11 15', '9'],
          expected: '1 1',
          match: 'contains',
          hidden: false,
          label: 'cặp ở đầu mảng',
        },
        {
          stdinLines: ['4', '8'],
          expected: '0 0',
          match: 'contains',
          hidden: true,
          label: 'không dùng một phần tử hai lần',
        },
        {
          stdinLines: ['4 4', '8'],
          expected: '1 1',
          match: 'contains',
          hidden: true,
          label: 'hai giá trị trùng ở hai chỉ số',
        },
        {
          stdinLines: ['', '0'],
          expected: '0 0',
          match: 'contains',
          hidden: true,
          label: 'mảng rỗng',
        },
      ],
      hints: [
        'Oracle chỉ duyệt j từ i+1.',
        'Bản nhanh kiểm `target-x` trước `seen.add(x)`.',
        'Đổi bool thành 0/1 bằng `int(...)`.',
      ],
      sampleSolution: `line = input().strip()
a = list(map(int, line.split())) if line else []
target = int(input())

brute = any(a[i] + a[j] == target for i in range(len(a)) for j in range(i + 1, len(a)))
seen = set()
fast = False
for x in a:
    if target - x in seen:
        fast = True
        break
    seen.add(x)
print(int(brute), int(fast))`,
    },
    homework:
      'Tạo bảng ca biên rỗng, một phần tử, hai phần tử trùng, số âm và giá trị lớn; trước mỗi ca hãy viết kết quả oracle mong đợi rồi mới chạy bản nhanh.',
    srsCards: [
      {
        hoi: 'Vì sao oracle vét cạn hữu ích dù chậm?',
        dap: 'Nó đơn giản, dễ chứng minh đúng và chạy đủ nhanh trên miền nhỏ để đối chiếu bản tối ưu phức tạp hơn.',
      },
      {
        hoi: 'Trong two-sum dùng set, vì sao phải kiểm trước khi thêm x?',
        dap: 'Nếu thêm trước, target=2x có thể dùng chính phần tử hiện tại hai lần dù mảng chỉ có một x.',
      },
    ],
  },
  {
    id: 'p6-u145-l2',
    unitId: 'p6-u145',
    language: 'python',
    title: 'Differential test có seed — lỗi ngẫu nhiên phải tái hiện được',
    hook: '“CI thỉnh thoảng đỏ” không phải báo lỗi có thể điều tra. Một differential test tốt dừng ở lệch đầu tiên và đưa đúng seed cùng input để chạy lại.',
    theory:
      'Tạo bộ sinh riêng bằng `rng = random.Random(seed)`, không gọi random toàn cục. Mỗi trial sinh ca nhỏ để oracle O(n²) vẫn nhanh, so với bản O(n), dừng ngay ở khác biệt đầu tiên và in seed, mảng, target. Nếu không lệch, vẫn in seed và số lượt đã kiểm. Chạy ít nhất 100 trial giúp mở rộng ca phủ nhưng không thay thế các ca biên viết tay. Negative control là một bản lỗi cố ý thêm x trước khi kiểm; ca `[1]`, target 2 phải làm harness đỏ, chứng minh bộ kiểm không “xanh rỗng”.',
    workedExample: {
      code: `import random

rng = random.Random(20260916)
for trial in range(3):
    n = rng.randint(0, 5)
    a = [rng.randint(-3, 3) for _ in range(n)]
    target = rng.randint(-6, 6)
    print(trial, a, target)`,
      stdinLines: [],
    },
    predict: {
      code: `def loi(a, target):
    seen = set()
    for x in a:
        seen.add(x)
        if target - x in seen:
            return True
    return False

print(loi([1], 2))`,
      question: 'Negative control cố ý sai in gì?',
      choices: ['True', 'False', 'None', '2'],
      answerIndex: 0,
      explain:
        'Nó thêm 1 trước, rồi thấy phần bù 1 trong set và dùng sai cùng một phần tử hai lần.',
    },
    parsons: {
      prompt: 'Xếp khung differential test tái hiện được và dừng ở lệch đầu tiên.',
      lines: [
        'rng = random.Random(seed)',
        'for trial in range(trials):',
        '    case = sinh_ca(rng)',
        '    expected = brute(case)',
        '    actual = fast(case)',
        '    if expected != actual:',
        '        return seed, trial, case',
        'return seed, trials, None',
      ],
    },
    make: {
      prompt:
        'Đọc seed, trials (1..1000) và mode `dung` hoặc `loi`. Differential-test two-sum trên mảng dài 0..8, giá trị -5..5, target -10..10 bằng `random.Random(seed)`. Mode `loi` phải chạy negative control `[1]`, target 2 trước. Khi lệch in `LECH seed array target`; nếu hết lượt in `OK seed trials`.',
      starterCode: `import random

seed = int(input())
trials = int(input())
mode = input().strip()

# Dung mot RNG cuc bo va bao ca phan vi du dau tien.
`,
      testCases: [
        {
          stdinLines: ['7', '100', 'dung'],
          expected: 'OK 7 100',
          match: 'contains',
          hidden: false,
          label: '100 ca tái hiện được không lệch',
        },
        {
          stdinLines: ['7', '100', 'loi'],
          expected: 'LECH 7 [1] 2',
          match: 'contains',
          hidden: true,
          label: 'negative control bị bắt ngay',
        },
        {
          stdinLines: ['20260916', '137', 'dung'],
          expected: 'OK 20260916 137',
          match: 'contains',
          hidden: true,
          label: 'seed và số lượt khác vẫn tất định',
        },
      ],
      hints: [
        'Viết brute với i<j và fast đúng kiểm trước khi add.',
        'Dùng duy nhất `rng = random.Random(seed)` rồi truyền rng cho mọi lần sinh.',
        'In và break ngay ở mismatch đầu tiên; mode lỗi có ca kiểm soát trước random.',
      ],
      sampleSolution: `import random

seed = int(input())
trials = int(input())
mode = input().strip()

def brute(a, target):
    return any(a[i] + a[j] == target for i in range(len(a)) for j in range(i + 1, len(a)))

def fast(a, target, broken=False):
    seen = set()
    for x in a:
        if broken:
            seen.add(x)
        if target - x in seen:
            return True
        if not broken:
            seen.add(x)
    return False

if trials < 1 or trials > 1000 or mode not in {"dung", "loi"}:
    print("dau-vao-khong-hop-le")
elif mode == "loi" and brute([1], 2) != fast([1], 2, True):
    print("LECH", seed, [1], 2)
else:
    rng = random.Random(seed)
    mismatch = None
    for _ in range(trials):
        n = rng.randint(0, 8)
        a = [rng.randint(-5, 5) for _ in range(n)]
        target = rng.randint(-10, 10)
        if brute(a, target) != fast(a, target):
            mismatch = (a, target)
            break
    if mismatch is None:
        print("OK", seed, trials)
    else:
        print("LECH", seed, mismatch[0], mismatch[1])`,
    },
    homework:
      'Chạy 5 seed, mỗi seed ít nhất 100 trial; lưu seed và phản ví dụ đầu tiên. Sau đó bật negative control và xác nhận cả 5 lượt đều bắt được `[1]`, target 2.',
    srsCards: [
      {
        hoi: 'Vì sao dùng random.Random(seed) thay vì random toàn cục?',
        dap: 'RNG cục bộ tạo đúng cùng chuỗi ca từ cùng seed và không bị code khác làm thay đổi trạng thái, nên lỗi tái hiện được.',
      },
      {
        hoi: 'Negative control chứng minh điều gì trong differential test?',
        dap: 'Một bản sai có chủ đích thật sự bị oracle bắt, nên harness không xanh vì thiếu ca, so nhầm hoặc không chạy phép so sánh.',
      },
    ],
  },
]
