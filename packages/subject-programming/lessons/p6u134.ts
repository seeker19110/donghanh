// P6-U134 — mathforcode-s1-m1: máy biểu diễn số thế nào và sai ở đâu.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U134_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u134-l1',
    unitId: 'p6-u134',
    language: 'python',
    title: 'Bù 2 — cùng tám bit, máy đọc ra số âm như thế nào?',
    hook: 'Một byte `11111011` là 251 hay -5? Cả hai đều đúng: dãy bit không tự mang ý nghĩa, chính hợp đồng “không dấu” hay “bù 2 có dấu” quyết định cách đọc.',
    theory:
      'Số nguyên không dấu n bit có miền 0..2ⁿ−1. Với bù 2 có dấu, miền là −2ⁿ⁻¹..2ⁿ⁻¹−1. Để mã hóa một số âm x trong n bit, lấy x modulo 2ⁿ; trong code có thể dùng `x & ((1 << n) - 1)`. Bit cao nhất là bit dấu nhưng không được chỉ “gắn bit 1”: giá trị phải được biến đổi theo bù 2. Luôn truyền rõ số bit, vì -5 ở 8 bit và 16 bit có chuỗi khác nhau. Trước khi mã hóa phải kiểm miền; cắt bit một giá trị ngoài miền tạo overflow im lặng.',
    workedExample: {
      code: `def bu_hai(gia_tri, so_bit):
    # Mat na chi giu dung so bit da cong bo.
    mat_na = (1 << so_bit) - 1
    return format(gia_tri & mat_na, f"0{so_bit}b")

print(bu_hai(-5, 8))
print(bu_hai(5, 8))`,
      stdinLines: [],
    },
    predict: {
      code: `def doc_so_co_dau(bits):
    n = len(bits)
    gia_tri = int(bits, 2)
    if bits[0] == "1":
        gia_tri -= 1 << n
    return gia_tri

print(doc_so_co_dau("11111011"))`,
      question: 'Chương trình in ra gì khi đọc `11111011` theo bù 2 tám bit?',
      choices: ['-5', '251', '-251', '6'],
      answerIndex: 0,
      explain: 'Chuỗi có bit đầu là 1 nên lấy giá trị không dấu 251 trừ 2⁸ = 256; kết quả là -5.',
    },
    parsons: {
      prompt: 'Xếp hàm mã hóa bù 2 có kiểm tra miền trước khi cắt bit.',
      lines: [
        'def ma_hoa(gia_tri, so_bit):',
        '    nho_nhat = -(1 << (so_bit - 1))',
        '    lon_nhat = (1 << (so_bit - 1)) - 1',
        '    if not nho_nhat <= gia_tri <= lon_nhat:',
        '        return "ngoai-pham-vi"',
        '    mat_na = (1 << so_bit) - 1',
        '    return format(gia_tri & mat_na, f"0{so_bit}b")',
      ],
    },
    make: {
      prompt:
        'Đọc `gia_tri` và `so_bit`. Nếu số bit nhỏ hơn 2 hoặc giá trị nằm ngoài miền bù 2 có dấu, in `ngoai-pham-vi`; ngược lại in chuỗi nhị phân đủ đúng số bit.',
      starterCode: `gia_tri = int(input())
so_bit = int(input())

# Kiem tra mien roi ma hoa bu 2.
`,
      testCases: [
        {
          stdinLines: ['-5', '8'],
          expected: '11111011',
          match: 'contains',
          hidden: false,
          label: '-5 ở 8 bit',
        },
        {
          stdinLines: ['5', '4'],
          expected: '0101',
          match: 'contains',
          hidden: true,
          label: 'số dương vẫn phải đủ bit',
        },
        {
          stdinLines: ['8', '4'],
          expected: 'ngoai-pham-vi',
          match: 'contains',
          hidden: true,
          label: '8 vượt miền có dấu 4 bit',
        },
      ],
      hints: [
        'Miền n bit có dấu: từ `-(1 << (n - 1))` tới `(1 << (n - 1)) - 1`.',
        'Mặt nạ n bit là `(1 << n) - 1`.',
        'Định dạng đủ độ rộng: `format(value, f"0{so_bit}b")`.',
      ],
      sampleSolution: `gia_tri = int(input())
so_bit = int(input())

if so_bit < 2:
    print("ngoai-pham-vi")
else:
    nho_nhat = -(1 << (so_bit - 1))
    lon_nhat = (1 << (so_bit - 1)) - 1
    if not nho_nhat <= gia_tri <= lon_nhat:
        print("ngoai-pham-vi")
    else:
        mat_na = (1 << so_bit) - 1
        print(format(gia_tri & mat_na, f"0{so_bit}b"))`,
    },
    homework:
      'Viết hàm giải mã chuỗi bù 2 về số có dấu, rồi đối chiếu đủ 256 mẫu 8 bit: mã hóa sau giải mã phải trả lại đúng giá trị ban đầu.',
    srsCards: [
      {
        hoi: 'Miền giá trị của số nguyên có dấu n bit theo bù 2 là gì?',
        dap: 'Từ −2ⁿ⁻¹ đến 2ⁿ⁻¹−1; miền lệch một đơn vị vì số 0 thuộc nửa không âm.',
      },
      {
        hoi: 'Vì sao hàm bù 2 phải nhận số bit tường minh?',
        dap: 'Số bit quyết định miền hợp lệ, mặt nạ và độ dài chuỗi; cùng −5 có biểu diễn khác nhau ở 8 bit và 16 bit.',
      },
    ],
  },
  {
    id: 'p6-u134-l2',
    unitId: 'p6-u134',
    language: 'python',
    title: '0.1 + 0.2 — đo sai số trước khi nó chạm vào tiền',
    hook: 'Cộng 0,1 đồng một triệu lần không nhất thiết bằng phép nhân 0,1 × 1.000.000 ở từng bit. Sai số rất nhỏ, nhưng dùng `==` để chốt giao dịch có thể biến nó thành lỗi nghiệp vụ lớn.',
    theory:
      'Nhiều phân số thập phân như 0.1 không có biểu diễn nhị phân hữu hạn, nên `float` lưu số gần nhất. Sai số có thể tích lũy qua phép tính. Không so float bằng `==`; dùng `math.isclose` hoặc kiểm `abs(a-b) <= nguong`. Ngưỡng phải đến từ đơn vị nghiệp vụ: tọa độ, cảm biến và tiền có dung sai khác nhau. Với tiền, cách tốt hơn thường là lưu số nguyên đơn vị nhỏ nhất (đồng, xu) hoặc Decimal, thay vì chữa float ở cuối.',
    workedExample: {
      code: `import math

tong = sum([0.1] * 10)
print(f"{tong:.17f}")
print(math.isclose(tong, 1.0, rel_tol=0.0, abs_tol=1e-12))`,
      stdinLines: [],
    },
    predict: {
      code: `import math
a = 0.1 + 0.2
print(a == 0.3)
print(math.isclose(a, 0.3, rel_tol=0.0, abs_tol=1e-12))`,
      question: 'Hai dòng Boolean được in theo thứ tự nào?',
      choices: ['False\nTrue', 'True\nFalse', 'True\nTrue', 'False\nFalse'],
      answerIndex: 0,
      explain:
        '`==` so đúng từng bit nên thất bại; `isclose` chấp nhận độ lệch nhỏ hơn ngưỡng đã công bố.',
    },
    parsons: {
      prompt: 'Xếp hàm so sánh số thực bằng cả ngưỡng tuyệt đối và tương đối.',
      lines: [
        'def gan_bang(a, b, tuyet_doi, tuong_doi):',
        '    do_lech = abs(a - b)',
        '    ty_le = tuong_doi * max(abs(a), abs(b))',
        '    nguong = max(tuyet_doi, ty_le)',
        '    return do_lech <= nguong',
      ],
    },
    make: {
      prompt:
        'Đọc a, b và ngưỡng tuyệt đối. In `gan-bang` nếu `abs(a-b) <= nguong`, ngược lại in `khac`. Ngưỡng âm là đầu vào không hợp lệ và phải in `nguong-khong-hop-le`.',
      starterCode: `a = float(input())
b = float(input())
nguong = float(input())

# So sanh bang do lech, khong dung a == b.
`,
      testCases: [
        {
          stdinLines: ['0.30000000000000004', '0.3', '0.000000000001'],
          expected: 'gan-bang',
          match: 'contains',
          hidden: false,
          label: '0.1 + 0.2 gần 0.3',
        },
        {
          stdinLines: ['10.0', '10.2', '0.1'],
          expected: 'khac',
          match: 'contains',
          hidden: true,
          label: 'độ lệch vượt ngưỡng',
        },
        {
          stdinLines: ['1', '1', '-0.1'],
          expected: 'nguong-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'không nhận ngưỡng âm',
        },
      ],
      hints: [
        'Kiểm ngưỡng âm trước khi so sánh.',
        'Khoảng cách giữa hai số là `abs(a - b)`.',
        'Điều kiện đúng là khoảng cách nhỏ hơn hoặc bằng ngưỡng.',
      ],
      sampleSolution: `a = float(input())
b = float(input())
nguong = float(input())

if nguong < 0:
    print("nguong-khong-hop-le")
elif abs(a - b) <= nguong:
    print("gan-bang")
else:
    print("khac")`,
    },
    homework:
      'So sánh tổng 0.1 lặp một triệu lần với 0.1 × 1.000.000; ghi sai số tuyệt đối, rồi làm lại bằng số nguyên xu và giải thích vì sao hết sai số.',
    srsCards: [
      {
        hoi: 'Vì sao không nên dùng dấu bằng trực tiếp để so hai số thực?',
        dap: 'Nhiều số thập phân chỉ được lưu gần đúng trong nhị phân; hai phép tính tương đương về toán có thể lệch vài bit.',
      },
      {
        hoi: 'Ngưỡng so sánh số thực nên được chọn từ đâu?',
        dap: 'Từ sai số đo và đơn vị nghiệp vụ chấp nhận được, không chọn tùy ý chỉ để test chuyển xanh.',
      },
    ],
  },
]
