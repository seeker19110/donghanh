// P6-U138 — mathforcode-s2-m1: phép đếm, hoán vị và tổ hợp.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U138_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u138-l1',
    unitId: 'p6-u138',
    language: 'python',
    title: 'Đếm trước khi vét cạn — biết quy mô trước khi chạy',
    hook: 'Một bộ cấu hình có bốn công tắc nhị phân chỉ tạo 16 ca, nhưng 30 công tắc đã vượt một tỉ ca. Phép đếm cho ta thấy vụ nổ quy mô trước khi vòng lặp chiếm hết thời gian.',
    theory:
      'Quy tắc cộng dùng khi chọn đúng một phương án từ các nhóm loại trừ nhau: tổng số cách là tổng kích thước các nhóm. Quy tắc nhân dùng khi một cấu hình phải chọn một phần tử từ mỗi nhóm độc lập: số cấu hình là tích các kích thước. Tích Descartes của không nhóm chứa đúng một bộ rỗng, vì đó là phần tử trung hòa để tiếp tục nhân; chỉ một nhóm rỗng cũng làm toàn bộ tích bằng 0. Phải từ chối kích thước âm. Với vét cạn, luôn tính quy mô trước rồi mới quyết định có sinh toàn bộ hay đổi thuật toán.',
    workedExample: {
      code: `def sinh_nhi_phan(so_bit):
    # Bat dau tu mot cau hinh rong.
    cau_hinh = [[]]
    # Moi bit nhan doi so cau hinh hien co.
    for _ in range(so_bit):
        cau_hinh = [cu + [bit] for cu in cau_hinh for bit in [0, 1]]
    return cau_hinh

ket_qua = sinh_nhi_phan(4)
print(2 ** 4, len(ket_qua))
print(ket_qua[0], ket_qua[-1])`,
      stdinLines: [],
    },
    predict: {
      code: `nhom = [2, 3, 4]
so_cau_hinh = 1
for kich_thuoc in nhom:
    so_cau_hinh *= kich_thuoc
print(so_cau_hinh)`,
      question: 'Ba nhóm có 2, 3 và 4 lựa chọn tạo bao nhiêu cấu hình?',
      choices: ['24', '9', '12', '0'],
      answerIndex: 0,
      explain:
        'Một cấu hình chọn một phần tử từ từng nhóm nên áp dụng quy tắc nhân: 2 × 3 × 4 = 24.',
    },
    parsons: {
      prompt: 'Xếp hàm tính kích thước tích Descartes, có từ chối kích thước âm.',
      lines: [
        'def kich_thuoc_tich(cac_nhom):',
        '    ket_qua = 1',
        '    for kich_thuoc in cac_nhom:',
        '        if kich_thuoc < 0:',
        '            raise ValueError("kich thuoc am")',
        '        ket_qua *= kich_thuoc',
        '    return ket_qua',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng các kích thước nhóm, cách nhau bằng khoảng trắng; dòng rỗng nghĩa là không có nhóm. Nếu có số âm, in `kich-thuoc-am`. Ngược lại in `ly-thuyet=<tich>`. Nếu có đúng bốn nhóm và mọi kích thước đều là 2, hãy tự sinh mọi bộ nhị phân rồi in thêm `sinh-ra=<so bo>`; các trường hợp khác in `sinh-ra=<tich>`. Tích của không nhóm là 1.',
      starterCode: `dong = input().strip()

# Tinh truoc quy mo; chu y dong rong va nhom co 0 lua chon.
`,
      testCases: [
        {
          stdinLines: ['2 2 2 2'],
          expected: 'ly-thuyet=16\nsinh-ra=16',
          match: 'contains',
          hidden: false,
          label: 'bốn tham số nhị phân',
        },
        {
          stdinLines: [''],
          expected: 'ly-thuyet=1\nsinh-ra=1',
          match: 'contains',
          hidden: true,
          label: 'tích của không nhóm có một bộ rỗng',
        },
        {
          stdinLines: ['3 0 5'],
          expected: 'ly-thuyet=0\nsinh-ra=0',
          match: 'contains',
          hidden: true,
          label: 'một nhóm rỗng làm tích bằng 0',
        },
        {
          stdinLines: ['2 -1 4'],
          expected: 'kich-thuoc-am',
          match: 'contains',
          hidden: true,
          label: 'từ chối số lựa chọn âm',
        },
      ],
      hints: [
        'Dòng rỗng tạo danh sách `[]`; biến tích phải bắt đầu từ 1.',
        'Kiểm mọi kích thước không âm trước khi nhân.',
        'Với bốn nhóm nhị phân, bắt đầu từ `[[]]` rồi nối lần lượt 0 và 1.',
      ],
      sampleSolution: `dong = input().strip()
kich_thuoc = [] if dong == "" else [int(x) for x in dong.split()]

if any(x < 0 for x in kich_thuoc):
    print("kich-thuoc-am")
else:
    ly_thuyet = 1
    for x in kich_thuoc:
        ly_thuyet *= x

    if kich_thuoc == [2, 2, 2, 2]:
        cau_hinh = [[]]
        for _ in range(4):
            cau_hinh = [cu + [bit] for cu in cau_hinh for bit in [0, 1]]
        sinh_ra = len(cau_hinh)
    else:
        sinh_ra = ly_thuyet

    print(f"ly-thuyet={ly_thuyet}")
    print(f"sinh-ra={sinh_ra}")`,
    },
    homework:
      'Tính trước số cấu hình cho 10, 20 và 30 công tắc nhị phân; sau đó chỉ sinh toàn bộ ở hai cỡ đầu và giải thích vì sao nên chặn cỡ cuối trong production.',
    srsCards: [
      {
        hoi: 'Khi nào dùng quy tắc cộng và khi nào dùng quy tắc nhân?',
        dap: 'Dùng cộng khi chọn một trong các nhóm loại trừ nhau; dùng nhân khi một kết quả phải chọn một phần tử từ từng nhóm.',
      },
      {
        hoi: 'Vì sao tích Descartes của không nhóm có một cấu hình rỗng?',
        dap: 'Bộ rỗng là cách duy nhất chưa chọn gì và là phần tử trung hòa, để thêm nhóm đầu tiên cho đúng số phần tử của nhóm đó.',
      },
    ],
  },
  {
    id: 'p6-u138-l2',
    unitId: 'p6-u138',
    language: 'python',
    title: 'Thứ tự có quan trọng không? Từ hoán vị tới hàng Pascal',
    hook: 'Chọn ba người vào một nhóm khác với trao ba vai trò trưởng nhóm, kiểm thử và triển khai. Cùng lấy ba từ n người, nhưng việc có phân biệt thứ tự làm số kết quả thay đổi hoàn toàn.',
    theory:
      'Hoán vị sắp toàn bộ n phần tử và có n! cách. Chỉnh hợp lấy k phần tử có thứ tự: P(n,k)=n(n−1)…(n−k+1). Tổ hợp lấy k phần tử không xét thứ tự: C(n,k). Hàng Pascal cho công thức nguyên `C(n,k)=C(n−1,k−1)+C(n−1,k)`, với hai biên `C(n,0)=C(n,n)=1`. Ta có thể cập nhật một hàng từ phải sang trái để dùng O(k) bộ nhớ, không cần tính giai thừa khổng lồ hay đổi sang float. Đầu vào n<0, k<0 hoặc k>n phải bị từ chối rõ ràng.',
    workedExample: {
      code: `def to_hop(n, k):
    # Dung tinh doi xung de hang ngan hon.
    k = min(k, n - k)
    hang = [1] + [0] * k
    # Cap nhat tu phai sang trai de khong ghi de gia tri cu.
    for i in range(1, n + 1):
        for j in range(min(i, k), 0, -1):
            hang[j] += hang[j - 1]
    return hang[k]

for n, k in [(5, 0), (5, 2), (5, 5), (30, 15)]:
    print(n, k, to_hop(n, k))`,
      stdinLines: [],
    },
    predict: {
      code: `hang = [1, 0, 0]
for i in range(1, 5):
    for j in range(min(i, 2), 0, -1):
        hang[j] += hang[j - 1]
print(hang[2])`,
      question: 'Sau khi dựng hàng n=4, giá trị C(4,2) được in ra là gì?',
      choices: ['6', '4', '8', '2'],
      answerIndex: 0,
      explain: 'Hàng Pascal thứ 4 là 1, 4, 6, 4, 1 nên C(4,2)=6.',
    },
    parsons: {
      prompt: 'Xếp phần lõi tính C(n,k) bằng một hàng Pascal cập nhật từ phải sang trái.',
      lines: [
        'k = min(k, n - k)',
        'hang = [1] + [0] * k',
        'for i in range(1, n + 1):',
        '    for j in range(min(i, k), 0, -1):',
        '        hang[j] += hang[j - 1]',
        'return hang[k]',
      ],
    },
    make: {
      prompt:
        'Đọc n và k. Nếu n<0, k<0 hoặc k>n, in `khong-hop-le`. Ngược lại tự tính C(n,k) bằng hàng Pascal một chiều với số nguyên và in `to-hop=<ket qua>`; không dùng `math.comb`, giai thừa hay float.',
      starterCode: `n = int(input())
k = int(input())

# Dung hang Pascal mot chieu, cap nhat tu phai sang trai.
`,
      testCases: [
        {
          stdinLines: ['5', '2'],
          expected: 'to-hop=10',
          match: 'contains',
          hidden: false,
          label: 'C(5,2)',
        },
        {
          stdinLines: ['0', '0'],
          expected: 'to-hop=1',
          match: 'contains',
          hidden: true,
          label: 'C(0,0)',
        },
        {
          stdinLines: ['12', '0'],
          expected: 'to-hop=1',
          match: 'contains',
          hidden: true,
          label: 'C(n,0)',
        },
        {
          stdinLines: ['12', '12'],
          expected: 'to-hop=1',
          match: 'contains',
          hidden: true,
          label: 'C(n,n)',
        },
        {
          stdinLines: ['6', '3'],
          expected: 'to-hop=20',
          match: 'contains',
          hidden: true,
          label: 'C(6,3)',
        },
        {
          stdinLines: ['30', '15'],
          expected: 'to-hop=155117520',
          match: 'contains',
          hidden: true,
          label: 'số nguyên lớn vẫn chính xác',
        },
        {
          stdinLines: ['4', '5'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'k lớn hơn n',
        },
        {
          stdinLines: ['-1', '0'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối n âm',
        },
      ],
      hints: [
        'Kiểm miền đầu vào trước khi tạo hàng.',
        'Dùng đối xứng `k = min(k, n-k)` để giảm bộ nhớ.',
        'Cập nhật chỉ số j từ phải sang trái; đi xuôi sẽ dùng nhầm giá trị vừa ghi.',
      ],
      sampleSolution: `n = int(input())
k = int(input())

if n < 0 or k < 0 or k > n:
    print("khong-hop-le")
else:
    k = min(k, n - k)
    hang = [1] + [0] * k
    for i in range(1, n + 1):
        for j in range(min(i, k), 0, -1):
            hang[j] += hang[j - 1]
    print(f"to-hop={hang[k]}")`,
    },
    homework:
      'Lập bảng cho n=6 với mọi k từ 0 tới 6, kiểm tính đối xứng C(n,k)=C(n,n−k), rồi so số nhóm ba người với số cách gán ba vai trò có thứ tự.',
    srsCards: [
      {
        hoi: 'Khác biệt quyết định giữa chỉnh hợp và tổ hợp là gì?',
        dap: 'Chỉnh hợp phân biệt thứ tự của k phần tử được chọn; tổ hợp chỉ quan tâm tập phần tử, không quan tâm thứ tự.',
      },
      {
        hoi: 'Vì sao cập nhật hàng Pascal một chiều phải đi từ phải sang trái?',
        dap: 'Đi ngược giữ nguyên các giá trị của hàng trước cho tới khi dùng; đi xuôi sẽ đọc lại giá trị vừa cập nhật và đếm sai.',
      },
    ],
  },
]
