// P6-U142 — algo-s1-m1: độ phức tạp và chi phí khấu hao.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U142_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u142-l1',
    unitId: 'p6-u142',
    language: 'python',
    title: 'Đọc ràng buộc — ngân sách phép tính chọn thuật toán',
    hook: 'Một lời giải chạy đẹp với 100 phần tử có thể không bao giờ xong với 100 000 phần tử. Trước khi code, hãy đổi Big-O thành số phép tính dự kiến.',
    theory:
      'Gọi n là số phần tử và B là ngân sách phép tính. Mô hình thô cho O(1), O(log n), O(n), O(n log n), O(n²) lần lượt là 1, số lần chia đôi, n, n nhân số lần chia đôi và n². Đây là cận tăng trưởng chứ không phải đồng hồ: hằng số, I/O và bộ nhớ vẫn quan trọng. Ta dùng bộ đếm tất định để loại phương án chắc chắn vượt B; không lấy một lần chạy nhanh làm bằng chứng. Một vòng lặp lồng nhau cũng chưa đủ kết luận O(n²): phải đếm miền mà nó thật sự duyệt.',
    workedExample: {
      code: `def buoc_log(n):
    buoc = 0
    while n > 1:
        n = (n + 1) // 2
        buoc += 1
    return buoc

for n in [10, 1000, 100000]:
    log_n = buoc_log(n)
    print(n, n, n * log_n, n * n)`,
      stdinLines: [],
    },
    predict: {
      code: `n = 10000
ngan_sach = 1000000
print(n * n <= ngan_sach)
print(n * 14 <= ngan_sach)`,
      question: 'Theo hai mô hình n² và n log₂n xấp xỉ 14n, chương trình in gì?',
      choices: ['False\nTrue', 'True\nFalse', 'True\nTrue', 'False\nFalse'],
      answerIndex: 0,
      explain: 'n² là 100 triệu, vượt ngân sách; 14n là 140 nghìn, còn trong ngân sách.',
    },
    parsons: {
      prompt: 'Xếp hàm đếm số lần chia đôi để mô hình hóa log₂n mà không dùng đồng hồ.',
      lines: [
        'def dem_chia_doi(n):',
        '    dem = 0',
        '    while n > 1:',
        '        n = (n + 1) // 2',
        '        dem += 1',
        '    return dem',
      ],
    },
    make: {
      prompt:
        'Đọc tên lớp `O1`, `Ologn`, `On`, `Onlogn` hoặc `On2`, rồi n và ngân sách B không âm. Tính số phép tính theo mô hình trong bài (log là số lần chia đôi làm tròn lên). In số phép tính và `kha-thi` nếu không vượt B, ngược lại `qua-tai`. Đầu vào lạ in `dau-vao-khong-hop-le`.',
      starterCode: `loai = input().strip()
n = int(input())
ngan_sach = int(input())

# Tinh chi phi tat dinh, khong do thoi gian may.
`,
      testCases: [
        {
          stdinLines: ['Onlogn', '1000', '10000'],
          expected: '10000 kha-thi',
          match: 'contains',
          hidden: false,
          label: 'n log n vừa ngân sách',
        },
        {
          stdinLines: ['On2', '10000', '1000000'],
          expected: '100000000 qua-tai',
          match: 'contains',
          hidden: true,
          label: 'bậc hai bị loại ở n lớn',
        },
        {
          stdinLines: ['Ologn', '0', '0'],
          expected: '0 kha-thi',
          match: 'contains',
          hidden: true,
          label: 'đầu vào rỗng không có bước chia',
        },
      ],
      hints: [
        'Đếm log bằng cách lặp khi n > 1.',
        'Với chia đôi làm tròn lên, dùng `(x + 1) // 2`.',
        'So chi phí với ngân sách sau khi xác nhận loại và số không âm.',
      ],
      sampleSolution: `loai = input().strip()
n = int(input())
ngan_sach = int(input())

if loai not in {"O1", "Ologn", "On", "Onlogn", "On2"} or n < 0 or ngan_sach < 0:
    print("dau-vao-khong-hop-le")
else:
    x = n
    log_n = 0
    while x > 1:
        x = (x + 1) // 2
        log_n += 1
    chi_phi = {"O1": 1, "Ologn": log_n, "On": n, "Onlogn": n * log_n, "On2": n * n}[loai]
    print(chi_phi, "kha-thi" if chi_phi <= ngan_sach else "qua-tai")`,
    },
    homework:
      'Lập bảng cho n = 10², 10³, 10⁴, 10⁵ với ngân sách 10⁷; ghi lớp nào bị loại và thêm một cột bộ nhớ để tránh chọn lời giải nhanh nhưng không chứa nổi dữ liệu.',
    srsCards: [
      {
        hoi: 'Vì sao không dùng thời gian của một lần chạy để kết luận Big-O?',
        dap: 'Thời gian còn phụ thuộc máy, tải, cache và hằng số; Big-O cần mô hình số thao tác theo kích thước n.',
      },
      {
        hoi: 'Khi n tăng gấp đôi, mô hình O(n log n) tăng ra sao?',
        dap: 'Chi phí từ n log n thành 2n(log n + 1), hơi lớn hơn hai lần nhưng nhỏ xa bốn lần của n².',
      },
    ],
  },
  {
    id: 'p6-u142-l2',
    unitId: 'p6-u142',
    language: 'python',
    title: 'Mảng động — một lần đắt, cả chuỗi vẫn rẻ',
    hook: 'Append thường O(1), nhưng có lần phải chép cả mảng. “Thường” có đáng tin không? Hãy cộng toàn bộ số lần sao chép thay vì nhìn lần tệ nhất.',
    theory:
      'Mảng động giữ capacity. Khi đầy, nó cấp vùng gấp đôi rồi chép `size` phần tử cũ. Với n lần append từ capacity 1, số lần chép là 1 + 2 + 4 + … và luôn nhỏ hơn 2n. Vì tổng chi phí n lần ghi mới cộng số chép là O(n), chi phí khấu hao mỗi append là O(1), dù một append riêng lẻ có thể O(n). Nếu chỉ tăng capacity thêm 1, tổng chép thành 0+1+…+(n−1)=O(n²): đây là negative control cho chính sách tăng gấp đôi.',
    workedExample: {
      code: `def dem_sao_chep(n):
    size, capacity, copies = 0, 1, 0
    for _ in range(n):
        if size == capacity:
            copies += size
            capacity *= 2
        size += 1
    return copies

for n in [1, 2, 4, 8, 16]:
    print(n, dem_sao_chep(n))`,
      stdinLines: [],
    },
    predict: {
      code: `size, capacity, copies = 0, 1, 0
for _ in range(5):
    if size == capacity:
        copies += size
        capacity *= 2
    size += 1
print(copies, capacity)`,
      question: 'Sau 5 lần append, tổng số phần tử đã chép và capacity là bao nhiêu?',
      choices: ['7 8', '5 5', '8 8', '10 5'],
      answerIndex: 0,
      explain: 'Các lần nở chép 1, 2 và 4 phần tử: tổng 7; capacity cuối là 8.',
    },
    parsons: {
      prompt: 'Xếp mô phỏng append với capacity tăng gấp đôi.',
      lines: [
        'for _ in range(n):',
        '    if size == capacity:',
        '        copies += size',
        '        capacity *= 2',
        '    size += 1',
        'return copies, capacity',
      ],
    },
    make: {
      prompt:
        'Đọc n không âm. Mô phỏng n lần append vào mảng capacity ban đầu 1, tăng gấp đôi khi đầy. In `copies capacity`, chỉ dùng bộ đếm, không đo thời gian. n âm in `n-khong-hop-le`.',
      starterCode: `n = int(input())

# Dem tong so phan tu bi sao chep khi mang no.
`,
      testCases: [
        {
          stdinLines: ['5'],
          expected: '7 8',
          match: 'contains',
          hidden: false,
          label: 'ba lần nở tới capacity 8',
        },
        {
          stdinLines: ['0'],
          expected: '0 1',
          match: 'contains',
          hidden: true,
          label: 'không append thì không sao chép',
        },
        {
          stdinLines: ['17'],
          expected: '31 32',
          match: 'contains',
          hidden: true,
          label: 'nở qua năm kích thước',
        },
      ],
      hints: [
        'Khởi tạo size=0, capacity=1, copies=0.',
        'Chỉ nở khi `size == capacity`, trước khi tăng size.',
        'Mỗi lần nở cộng size hiện tại vào copies.',
      ],
      sampleSolution: `n = int(input())

if n < 0:
    print("n-khong-hop-le")
else:
    size, capacity, copies = 0, 1, 0
    for _ in range(n):
        if size == capacity:
            copies += size
            capacity *= 2
        size += 1
    print(copies, capacity)`,
    },
    homework:
      'Đối chiếu n = 1, 2, 4, 8, 16, 32 cho hai chính sách tăng gấp đôi và tăng thêm 1; chứng minh bằng số đếm rằng negative control tăng thêm 1 tiến về bậc hai.',
    srsCards: [
      {
        hoi: 'Vì sao append vào mảng động có chi phí khấu hao O(1)?',
        dap: 'Các lần nở chép 1+2+4+… phần tử, tổng nhỏ hơn 2n qua n append, nên tổng O(n) và trung bình khấu hao O(1).',
      },
      {
        hoi: 'Điều gì sai nếu capacity chỉ tăng thêm một ô mỗi lần đầy?',
        dap: 'Mỗi append sau đó phải chép gần toàn bộ mảng; tổng 0+1+…+(n−1) là O(n²).',
      },
    ],
  },
]
