// P6-U137 — mathforcode-s1-m4: đếm phép tính và kiểm chứng Big-O.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U137_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u137-l1',
    unitId: 'p6-u137',
    language: 'python',
    title: '1 + 2 + … + n — biến vòng lặp thành công thức kiểm được',
    hook: 'Hai vòng lặp lồng nhau không tự động có n² bước. Nếu vòng trong chạy 1, rồi 2, rồi 3 lần, tổng thật là một tam giác: n(n+1)/2.',
    theory:
      'Đếm phép tính bắt đầu từ việc chọn một thao tác cơ sở rồi đếm số lần nó chạy. Vòng `for i in range(1,n+1)` chứa vòng `range(i)` chạy tổng 1+2+…+n = n(n+1)/2 bước. Có thể chứng minh bằng ghép cặp hoặc quy nạp: công thức đúng ở n=1; giả sử đúng ở n, cộng thêm n+1 sẽ thành (n+1)(n+2)/2. Bộ đếm trong code là thực nghiệm; công thức là mô hình. Khi hai bên khớp ở nhiều n và chứng minh đúng, ta mới có bằng chứng mạnh.',
    workedExample: {
      code: `def dem_that(n):
    dem = 0
    for i in range(1, n + 1):
        for _ in range(i):
            dem += 1
    return dem

for n in [1, 2, 5, 10]:
    cong_thuc = n * (n + 1) // 2
    print(n, dem_that(n), cong_thuc)`,
      stdinLines: [],
    },
    predict: {
      code: `dem = 0
for i in range(1, 5):
    for _ in range(i):
        dem += 1
print(dem)`,
      question: 'Bộ đếm in ra bao nhiêu?',
      choices: ['10', '16', '8', '4'],
      answerIndex: 0,
      explain: 'Vòng trong chạy 1 + 2 + 3 + 4 = 10 lần.',
    },
    parsons: {
      prompt: 'Xếp hàm đối chiếu số đếm thật với công thức tổng tam giác.',
      lines: [
        'def doi_chieu(n):',
        '    dem = 0',
        '    for i in range(1, n + 1):',
        '        for _ in range(i):',
        '            dem += 1',
        '    cong_thuc = n * (n + 1) // 2',
        '    return dem, cong_thuc',
      ],
    },
    make: {
      prompt:
        'Đọc n không âm. Tính số bước thật bằng hai vòng lặp tam giác và giá trị công thức `n(n+1)/2`, rồi in trên một dòng cách nhau một khoảng trắng. n âm in `n-khong-hop-le`.',
      starterCode: `n = int(input())

# Dem bang vong lap va tinh lai bang cong thuc.
`,
      testCases: [
        {
          stdinLines: ['5'],
          expected: '15 15',
          match: 'contains',
          hidden: false,
          label: 'n=5 khớp 15 bước',
        },
        {
          stdinLines: ['0'],
          expected: '0 0',
          match: 'contains',
          hidden: true,
          label: 'ca biên n=0',
        },
        {
          stdinLines: ['-1'],
          expected: 'n-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối n âm',
        },
      ],
      hints: [
        'Vòng ngoài chạy i từ 1 tới n.',
        'Vòng trong chạy đúng i lần và tăng bộ đếm.',
        'Công thức nguyên là `n * (n + 1) // 2`.',
      ],
      sampleSolution: `n = int(input())

if n < 0:
    print("n-khong-hop-le")
else:
    dem = 0
    for i in range(1, n + 1):
        for _ in range(i):
            dem += 1
    cong_thuc = n * (n + 1) // 2
    print(dem, cong_thuc)`,
    },
    homework:
      'Chạy đối chiếu ở n = 1, 2, 5, 10, 100; lưu bảng n, số đếm thật, công thức và sai lệch. Sai lệch phải bằng 0 ở cả năm dòng.',
    srsCards: [
      {
        hoi: 'Vòng lặp tam giác chạy 1 + 2 + … + n bước có công thức nào?',
        dap: 'Tổng bằng n(n+1)/2; hệ số một nửa không đổi bậc tăng trưởng nên độ phức tạp vẫn là O(n²).',
      },
      {
        hoi: 'Bộ đếm thực nghiệm và công thức lý thuyết đóng vai trò khác nhau thế nào?',
        dap: 'Bộ đếm kiểm hành vi của code ở các mẫu cụ thể; công thức cùng chứng minh giải thích và tổng quát hóa cho mọi kích thước đầu vào.',
      },
    ],
  },
  {
    id: 'p6-u137-l2',
    unitId: 'p6-u137',
    language: 'python',
    title: 'Big-O — nhìn tốc độ tăng, không nhìn một lần chạy',
    hook: 'Một hàm O(n²) vẫn có thể nhanh ở 10 phần tử và sập ở một triệu phần tử. Big-O không đo đồng hồ của một máy; nó mô tả chi phí tăng ra sao khi đầu vào lớn lên.',
    theory:
      'O(1) không đổi theo n. O(log n) thường xuất hiện khi mỗi bước chia đôi không gian. O(n) tăng tỷ lệ với n. O(n²) thường xuất hiện khi xét mọi cặp. Big-O bỏ hằng số và hạng thấp hơn để tập trung vào xu hướng dài hạn, nhưng benchmark vẫn cần để biết hằng số, I/O và cache thật. Cách tự kiểm: tăng n gấp đôi; chi phí O(n) xấp xỉ gấp 2, O(n²) xấp xỉ gấp 4, còn O(log n) chỉ tăng khoảng một bước.',
    workedExample: {
      code: `def so_buoc_chia_doi(n):
    buoc = 0
    while n > 1:
        n //= 2
        buoc += 1
    return buoc

for n in [1, 2, 4, 8, 16]:
    print(n, so_buoc_chia_doi(n))`,
      stdinLines: [],
    },
    predict: {
      code: `n = 32
buoc = 0
while n > 1:
    n //= 2
    buoc += 1
print(buoc)`,
      question: 'Chia đôi 32 tới khi còn 1 cần bao nhiêu bước?',
      choices: ['5', '32', '16', '4'],
      answerIndex: 0,
      explain: '32 → 16 → 8 → 4 → 2 → 1: năm lần chia, đúng log₂32 = 5.',
    },
    parsons: {
      prompt: 'Xếp hàm đếm số bước của thuật toán chia đôi.',
      lines: [
        'def dem_log(n):',
        '    buoc = 0',
        '    while n > 1:',
        '        n //= 2',
        '        buoc += 1',
        '    return buoc',
      ],
    },
    make: {
      prompt:
        'Đọc loại `hang-so`, `log`, `tuyen-tinh` hoặc `binh-phuong`, rồi n không âm. In số thao tác theo mô hình: 1; số lần chia n cho 2 tới <=1; n; hoặc n². Loại lạ/n âm in `dau-vao-khong-hop-le`.',
      starterCode: `loai = input().strip()
n = int(input())

# Mo phong so thao tac, khong dung log tu thu vien.
`,
      testCases: [
        {
          stdinLines: ['log', '16'],
          expected: '4',
          match: 'contains',
          hidden: false,
          label: 'log₂16 có bốn bước chia',
        },
        {
          stdinLines: ['binh-phuong', '12'],
          expected: '144',
          match: 'contains',
          hidden: true,
          label: 'mô hình bậc hai',
        },
        {
          stdinLines: ['tuyen-tinh', '0'],
          expected: '0',
          match: 'contains',
          hidden: true,
          label: 'ca biên n=0',
        },
      ],
      hints: [
        'Kiểm n âm và tên loại trước.',
        'Với log, dùng vòng while n > 1 và `n //= 2`.',
        'Bậc hai là `n * n`; tuyến tính là n; hằng số là 1.',
      ],
      sampleSolution: `loai = input().strip()
n = int(input())

hop_le = {"hang-so", "log", "tuyen-tinh", "binh-phuong"}
if n < 0 or loai not in hop_le:
    print("dau-vao-khong-hop-le")
elif loai == "hang-so":
    print(1)
elif loai == "tuyen-tinh":
    print(n)
elif loai == "binh-phuong":
    print(n * n)
else:
    buoc = 0
    while n > 1:
        n //= 2
        buoc += 1
    print(buoc)`,
    },
    homework:
      'Lập bảng chi phí ở n và 2n cho bốn loại; tính tỷ lệ hàng sau/hàng trước và giải thích vì sao tỷ lệ nhận diện được bậc tăng trưởng.',
    srsCards: [
      {
        hoi: 'Khi tăng n gấp đôi, chi phí O(n) và O(n²) thay đổi xấp xỉ thế nào?',
        dap: 'O(n) tăng khoảng hai lần; O(n²) tăng khoảng bốn lần, vì (2n)² = 4n².',
      },
      {
        hoi: 'Vì sao Big-O không thay thế benchmark?',
        dap: 'Big-O mô tả xu hướng theo n và bỏ hằng số; benchmark đo hằng số, I/O, cache và môi trường thật mà ký hiệu tăng trưởng không thể hiện.',
      },
    ],
  },
]
