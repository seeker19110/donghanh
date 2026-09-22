// P6-U140 — mathforcode-s2-m3: PRNG có seed và Fisher–Yates.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U140_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u140-l1',
    unitId: 'p6-u140',
    language: 'python',
    title: 'LCG — seed biến ngẫu nhiên thành thí nghiệm tái hiện được',
    hook: 'Một test chỉ đỏ đôi lúc gần như không thể điều tra nếu không biết dãy ngẫu nhiên đã dùng. Ghi seed và tham số biến lỗi “may rủi” thành một ca có thể chạy lại chính xác.',
    theory:
      'Bộ sinh đồng dư tuyến tính cập nhật trạng thái bằng `x_(n+1)=(a*x_n+c) mod m`. Cùng a, c, m và seed sẽ sinh cùng dãy; seed ngoài miền được chuẩn hóa bằng `seed % m`. Vì chỉ có m trạng thái, dãy cuối cùng phải lặp, nhưng tham số kém có thể cho chu kỳ rất ngắn. Phát hiện chu kỳ bằng bảng trạng thái → bước gặp đầu tiên. Luôn có giới hạn số bước để thuật toán kết thúc ngay cả khi chưa thấy lặp. m<=0 không hợp lệ. LCG hữu ích để học và tái hiện test, nhưng trạng thái dễ đoán nên không dùng cho khóa, token hay mật mã.',
    workedExample: {
      code: `def day_lcg(a, c, m, seed, so_luong):
    # Seed ngoai mien duoc dua ve 0..m-1.
    trang_thai = seed % m
    ket_qua = []
    for _ in range(so_luong):
        trang_thai = (a * trang_thai + c) % m
        ket_qua.append(trang_thai)
    return ket_qua

lan_mot = day_lcg(5, 1, 16, 3, 8)
lan_hai = day_lcg(5, 1, 16, 3, 8)
print(lan_mot)
print(lan_mot == lan_hai)`,
      stdinLines: [],
    },
    predict: {
      code: `x = 19 % 16
day = []
for _ in range(3):
    x = (5 * x + 1) % 16
    day.append(x)
print(day)`,
      question: 'Seed 19 được chuẩn hóa rồi sinh ba trạng thái nào?',
      choices: ['[0, 1, 6]', '[3, 0, 1]', '[19, 0, 1]', '[1, 6, 15]'],
      answerIndex: 0,
      explain: '19 % 16 = 3; ba lần cập nhật lần lượt cho 0, 1 và 6.',
    },
    parsons: {
      prompt: 'Xếp vòng dò chu kỳ có giới hạn và bảng bước đã gặp.',
      lines: [
        'da_gap = {trang_thai: 0}',
        'for buoc in range(1, gioi_han + 1):',
        '    trang_thai = (a * trang_thai + c) % m',
        '    if trang_thai in da_gap:',
        '        return buoc - da_gap[trang_thai]',
        '    da_gap[trang_thai] = buoc',
        'return None',
      ],
    },
    make: {
      prompt:
        'Đọc a, c, m, seed, số phần tử cần in và giới hạn dò chu kỳ. Nếu m<=0, số phần tử<0 hoặc giới hạn<0, in `khong-hop-le`. Ngược lại chuẩn hóa seed modulo m, in dãy trạng thái sau mỗi lần cập nhật dưới dạng số cách nhau bằng khoảng trắng, rồi in `chu-ky=<do dai>` nếu gặp lại trạng thái trong giới hạn hoặc `chua-gap-lai`. Dò chu kỳ phải bắt đầu lại từ seed đã chuẩn hóa.',
      starterCode: `a = int(input())
c = int(input())
m = int(input())
seed = int(input())
so_luong = int(input())
gioi_han = int(input())

# Sinh day va do chu ky bang hai lan chay doc lap.
`,
      testCases: [
        {
          stdinLines: ['5', '1', '16', '3', '5', '16'],
          expected: '0 1 6 15 12\nchu-ky=16',
          match: 'contains',
          hidden: false,
          label: 'LCG chu kỳ đủ 16 trạng thái',
        },
        {
          stdinLines: ['5', '1', '16', '19', '3', '16'],
          expected: '0 1 6\nchu-ky=16',
          match: 'contains',
          hidden: true,
          label: 'seed ngoài miền được chuẩn hóa',
        },
        {
          stdinLines: ['5', '1', '16', '3', '3', '5'],
          expected: '0 1 6\nchua-gap-lai',
          match: 'contains',
          hidden: true,
          label: 'giới hạn kết thúc trước khi lặp',
        },
        {
          stdinLines: ['2', '0', '8', '1', '4', '8'],
          expected: '2 4 0 0\nchu-ky=1',
          match: 'contains',
          hidden: true,
          label: 'tham số kém tạo chu kỳ ngắn',
        },
        {
          stdinLines: ['5', '1', '0', '3', '2', '5'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'modulo phải dương',
        },
      ],
      hints: [
        'Chỉ tính `seed % m` sau khi đã chắc m dương.',
        'Sinh dãy và dò chu kỳ nên dùng hai biến trạng thái độc lập cùng seed chuẩn hóa.',
        'Bảng ban đầu chứa seed ở bước 0; mỗi lần gặp lại, lấy bước hiện tại trừ bước cũ.',
      ],
      sampleSolution: `a = int(input())
c = int(input())
m = int(input())
seed = int(input())
so_luong = int(input())
gioi_han = int(input())

if m <= 0 or so_luong < 0 or gioi_han < 0:
    print("khong-hop-le")
else:
    seed = seed % m
    trang_thai = seed
    day = []
    for _ in range(so_luong):
        trang_thai = (a * trang_thai + c) % m
        day.append(trang_thai)
    print(" ".join(map(str, day)))

    trang_thai = seed
    da_gap = {trang_thai: 0}
    chu_ky = None
    for buoc in range(1, gioi_han + 1):
        trang_thai = (a * trang_thai + c) % m
        if trang_thai in da_gap:
            chu_ky = buoc - da_gap[trang_thai]
            break
        da_gap[trang_thai] = buoc
    print(f"chu-ky={chu_ky}" if chu_ky is not None else "chua-gap-lai")`,
    },
    homework:
      'So sánh chu kỳ của ba bộ tham số nhỏ `(5,1,16)`, `(2,0,8)`, `(4,1,9)` trên mọi seed; ghi bộ nào phủ nhiều trạng thái nhất và vì sao seed phải được lưu cùng lỗi test.',
    srsCards: [
      {
        hoi: 'Điều gì phải giống nhau để một dãy giả ngẫu nhiên được tái hiện?',
        dap: 'Thuật toán, toàn bộ tham số và seed ban đầu phải giống nhau; chỉ cùng seed nhưng khác thuật toán chưa đủ.',
      },
      {
        hoi: 'Vì sao LCG không phù hợp để sinh bí mật dùng trong mật mã?',
        dap: 'Trạng thái và quy luật tuyến tính có thể bị suy đoán từ đầu ra, nên tính tái hiện hữu ích cho test lại trở thành điểm yếu bảo mật.',
      },
    ],
  },
  {
    id: 'p6-u140-l2',
    unitId: 'p6-u140',
    language: 'python',
    title: 'Fisher–Yates — xáo đúng bằng miền chọn co dần',
    hook: 'Đổi mỗi phần tử với một vị trí bất kỳ trong cả mảng trông có vẻ ngẫu nhiên, nhưng các hoán vị không nhận xác suất bằng nhau. Shuffle thiên lệch có thể làm méo chia nhóm thử nghiệm hoặc thứ tự đề thi.',
    theory:
      'Fisher–Yates duyệt i từ cuối về 1, chọn đều j trong đoạn đóng [0,i], rồi đổi a[i] với a[j]. Ở mỗi bước, phần tử đặt vào vị trí i được chọn đều từ đúng i+1 phần tử chưa chốt; do đó mọi hoán vị có cùng xác suất. Hàm nên nhận nguồn số nguyên như một tham số để test có thể truyền PRNG đã seed hoặc nguồn giả định trước. Mảng rỗng và một phần tử không đổi; đổi chỗ bảo toàn multiset kể cả khi có phần tử trùng. `random.Random(seed)` giúp tái hiện, nhưng không phải bộ sinh dành cho mật mã.',
    workedExample: {
      code: `import random

def fisher_yates(ds, lay_so_nguyen):
    # Sao chep de khong sua danh sach dau vao.
    ket_qua = ds[:]
    for i in range(len(ket_qua) - 1, 0, -1):
        # Hop dong nguon: tra chi so trong doan dong 0..i.
        j = lay_so_nguyen(i + 1)
        ket_qua[i], ket_qua[j] = ket_qua[j], ket_qua[i]
    return ket_qua

rng = random.Random(2026)
print(fisher_yates(["A", "B", "C", "D", "E"], rng.randrange))`,
      stdinLines: [],
    },
    predict: {
      code: `ds = ["A", "B", "C"]
chi_so = [1, 0]
for buoc, i in enumerate(range(len(ds) - 1, 0, -1)):
    j = chi_so[buoc]
    ds[i], ds[j] = ds[j], ds[i]
print(ds)`,
      question: 'Nếu nguồn lần lượt trả j=1 rồi j=0, mảng cuối là gì?',
      choices: ["['C', 'A', 'B']", "['B', 'C', 'A']", "['A', 'C', 'B']", "['C', 'B', 'A']"],
      answerIndex: 0,
      explain: 'Đổi vị trí 2 với 1 cho [A,C,B], rồi đổi vị trí 1 với 0 cho [C,A,B].',
    },
    parsons: {
      prompt: 'Xếp hàm Fisher–Yates nhận nguồn chỉ số từ bên ngoài.',
      lines: [
        'def xao(ds, lay_so_nguyen):',
        '    ket_qua = ds[:]',
        '    for i in range(len(ket_qua) - 1, 0, -1):',
        '        j = lay_so_nguyen(i + 1)',
        '        ket_qua[i], ket_qua[j] = ket_qua[j], ket_qua[i]',
        '    return ket_qua',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng phần tử phân cách bằng dấu phẩy (dòng rỗng là mảng rỗng), rồi đọc seed. Viết Fisher–Yates trên một bản sao, dùng `rng = random.Random(seed)` và truyền `rng.randrange` vào hàm; mỗi bước phải chọn j trong [0,i]. In `ket-qua=` rồi các phần tử nối bằng dấu phẩy; mảng rỗng in `ket-qua=rong`. Không dùng `random.shuffle`.',
      starterCode: `import random

dong = input()
seed = int(input())

# Viet ham nhan nguon so nguyen, roi truyen rng.randrange vao.
`,
      testCases: [
        {
          stdinLines: ['A,B,C,D,E', '2026'],
          expected: 'ket-qua=B,E,D,C,A',
          match: 'contains',
          hidden: false,
          label: 'năm phần tử với seed cố định',
        },
        {
          stdinLines: ['', '7'],
          expected: 'ket-qua=rong',
          match: 'contains',
          hidden: true,
          label: 'mảng rỗng giữ nguyên',
        },
        {
          stdinLines: ['x', '7'],
          expected: 'ket-qua=x',
          match: 'contains',
          hidden: true,
          label: 'một phần tử giữ nguyên',
        },
        {
          stdinLines: ['a,a,b,c', '42'],
          expected: 'ket-qua=b,a,c,a',
          match: 'contains',
          hidden: true,
          label: 'phần tử trùng không mất hoặc nhân đôi',
        },
        {
          stdinLines: ['A,B,C,D,E', '2026'],
          expected: 'ket-qua=B,E,D,C,A',
          match: 'contains',
          hidden: true,
          label: 'cùng seed tái hiện đúng hoán vị',
        },
      ],
      hints: [
        'Dòng rỗng tạo `[]`; dòng khác dùng `split(",")`.',
        'Trong vòng i giảm dần, gọi nguồn bằng `lay_so_nguyen(i + 1)` để nhận 0..i.',
        'Đổi chỗ tại chỗ trên bản sao `ds[:]`, không xóa hay thêm phần tử.',
      ],
      sampleSolution: `import random

dong = input()
seed = int(input())
ds = [] if dong == "" else dong.split(",")

def fisher_yates(ds, lay_so_nguyen):
    ket_qua = ds[:]
    for i in range(len(ket_qua) - 1, 0, -1):
        j = lay_so_nguyen(i + 1)
        ket_qua[i], ket_qua[j] = ket_qua[j], ket_qua[i]
    return ket_qua

rng = random.Random(seed)
ket_qua = fisher_yates(ds, rng.randrange)
print("ket-qua=" + (",".join(ket_qua) if ket_qua else "rong"))`,
    },
    homework:
      'Với ba phần tử, chạy 6.000 seed liên tiếp cho Fisher–Yates và cho thuật toán sai “mỗi i đổi với vị trí bất kỳ trong cả mảng”; đếm sáu hoán vị và so độ lệch lớn nhất khỏi 1.000.',
    srsCards: [
      {
        hoi: 'Ở bước i của Fisher–Yates, chỉ số j phải nằm trong miền nào?',
        dap: 'j phải được chọn đều trong đoạn đóng từ 0 tới i, tức đúng các phần tử chưa được chốt vị trí.',
      },
      {
        hoi: 'Vì sao nên truyền nguồn số nguyên vào hàm shuffle?',
        dap: 'Hàm tách khỏi random toàn cục, nên test có thể truyền nguồn có seed hoặc nguồn giả để tái hiện và kiểm từng chỉ số.',
      },
    ],
  },
]
