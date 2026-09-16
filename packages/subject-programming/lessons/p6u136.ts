// P6-U136 — mathforcode-s1-m3: modulo, chỉ số vòng và chữ số kiểm tra.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U136_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u136-l1',
    unitId: 'p6-u136',
    language: 'python',
    title: 'Modulo — đi lùi qua đầu mảng mà không rơi khỏi biên',
    hook: 'Playlist đang ở bài đầu, người dùng bấm “bài trước”. Chỉ số -1 là lỗi hay là bài cuối? Modulo biến đường thẳng thành vòng tròn, nhưng mỗi ngôn ngữ xử lý số âm có thể khác nhau.',
    theory:
      'Với kích thước n dương, chỉ số vòng chuẩn hóa là `index % n` trong Python, luôn nằm trong 0..n−1. Trong ngôn ngữ có phép dư giữ dấu số bị chia, công thức an toàn là `((x % n) + n) % n`. Modulo dùng cho playlist, lịch xoay ca và ring buffer. Phải chặn n <= 0 trước khi chia. Ring buffer giữ bộ nhớ cố định: vị trí ghi tiếp theo là `(vi_tri + 1) % suc_chua`; khi đầy, dữ liệu mới ghi đè dữ liệu cũ theo chính sách đã công bố.',
    workedExample: {
      code: `def chi_so_vong(hien_tai, buoc, kich_thuoc):
    return (hien_tai + buoc) % kich_thuoc

print(chi_so_vong(0, -1, 5))
print(chi_so_vong(4, 2, 5))`,
      stdinLines: [],
    },
    predict: {
      code: `vi_tri = 1
for buoc in [-3, 7]:
    vi_tri = (vi_tri + buoc) % 5
print(vi_tri)`,
      question: 'Sau hai bước dịch vòng, vị trí cuối là bao nhiêu?',
      choices: ['0', '5', '-5', '1'],
      answerIndex: 0,
      explain: '(1−3) % 5 = 3, rồi (3+7) % 5 = 0.',
    },
    parsons: {
      prompt: 'Xếp hàm dịch chỉ số vòng có kiểm tra kích thước.',
      lines: [
        'def dich_vong(hien_tai, buoc, kich_thuoc):',
        '    if kich_thuoc <= 0:',
        '        return None',
        '    vi_tri = hien_tai + buoc',
        '    return vi_tri % kich_thuoc',
      ],
    },
    make: {
      prompt:
        'Đọc chỉ số hiện tại, bước dịch và kích thước. Kích thước <= 0 thì in `kich-thuoc-khong-hop-le`; ngược lại in chỉ số vòng chuẩn hóa trong 0..n−1.',
      starterCode: `hien_tai = int(input())
buoc = int(input())
kich_thuoc = int(input())

# Chuan hoa ca buoc am va buoc lon hon mot vong.
`,
      testCases: [
        {
          stdinLines: ['0', '-1', '5'],
          expected: '4',
          match: 'contains',
          hidden: false,
          label: 'đi lùi từ đầu về cuối',
        },
        {
          stdinLines: ['3', '12', '5'],
          expected: '0',
          match: 'contains',
          hidden: true,
          label: 'bước lớn hơn hai vòng',
        },
        {
          stdinLines: ['2', '1', '0'],
          expected: 'kich-thuoc-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'không chia modulo cho 0',
        },
      ],
      hints: [
        'Chặn kích thước không dương trước phép `%`.',
        'Cộng vị trí và bước trước khi lấy modulo.',
        'Trong Python, `% kich_thuoc` với kích thước dương đã cho kết quả không âm.',
      ],
      sampleSolution: `hien_tai = int(input())
buoc = int(input())
kich_thuoc = int(input())

if kich_thuoc <= 0:
    print("kich-thuoc-khong-hop-le")
else:
    print((hien_tai + buoc) % kich_thuoc)`,
    },
    homework:
      'Cài ring buffer sức chứa 3, đẩy lần lượt A, B, C, D, E và in trạng thái sau mỗi lần; ghi rõ chính sách khi đầy.',
    srsCards: [
      {
        hoi: 'Công thức chuẩn hóa chỉ số vòng trong miền 0 đến n−1 là gì?',
        dap: 'Trong Python dùng `x % n` với n dương; công thức độc lập hành vi số âm giữa ngôn ngữ là `((x % n) + n) % n`.',
      },
      {
        hoi: 'Ring buffer dùng modulo để đạt lợi ích gì?',
        dap: 'Con trỏ tự quay về đầu sau ô cuối, nên tái sử dụng một vùng nhớ cố định mà không cấp phát tăng dần.',
      },
    ],
  },
  {
    id: 'p6-u136-l2',
    unitId: 'p6-u136',
    language: 'python',
    title: 'Luhn — phát hiện lỗi gõ trước khi gửi dữ liệu đi xa',
    hook: 'Một mã thẻ bị gõ sai một chữ số không nên đi tới hệ thanh toán rồi mới thất bại. Chữ số kiểm tra dùng modulo để bắt lỗi nhập phổ biến ngay tại biên.',
    theory:
      'Luhn không mã hóa và không chứng minh mã tồn tại; nó chỉ kiểm tra cấu trúc. Đi từ phải sang trái, giữ nguyên chữ số kiểm tra ở vị trí đầu tiên; nhân đôi mỗi chữ số thứ hai. Nếu kết quả nhân đôi > 9 thì trừ 9. Tổng hợp lệ khi chia hết cho 10. Thuật toán bắt mọi lỗi đổi một chữ số và phần lớn lỗi đảo hai chữ số liền nhau, nhưng không thay thế xác thực server. Tách hàm kiểm tra khỏi I/O để test được nhiều mã.',
    workedExample: {
      code: `def hop_le_luhn(ma):
    tong = 0
    for vi_tri, ky_tu in enumerate(reversed(ma)):
        chu_so = int(ky_tu)
        if vi_tri % 2 == 1:
            chu_so *= 2
            if chu_so > 9:
                chu_so -= 9
        tong += chu_so
    return tong % 10 == 0

print(hop_le_luhn("79927398713"))
print(hop_le_luhn("79927398714"))`,
      stdinLines: [],
    },
    predict: {
      code: `ma = "18"
tong = 0
for vi_tri, ky_tu in enumerate(reversed(ma)):
    so = int(ky_tu)
    if vi_tri % 2 == 1:
        so = so * 2
        if so > 9:
            so -= 9
    tong += so
print(tong, tong % 10 == 0)`,
      question: 'Mã `18` cho tổng và kết quả kiểm tra nào?',
      choices: ['10 True', '10 False', '9 True', '18 False'],
      answerIndex: 0,
      explain: 'Từ phải: 8 giữ nguyên, 1 nhân đôi thành 2; tổng 10 chia hết cho 10.',
    },
    parsons: {
      prompt: 'Xếp phần lõi của bộ kiểm Luhn từ phải sang trái.',
      lines: [
        'for vi_tri, ky_tu in enumerate(reversed(ma)):',
        '    chu_so = int(ky_tu)',
        '    if vi_tri % 2 == 1:',
        '        chu_so *= 2',
        '        if chu_so > 9: chu_so -= 9',
        '    tong += chu_so',
        'return tong % 10 == 0',
      ],
    },
    make: {
      prompt:
        'Đọc một chuỗi mã. Nếu có ký tự không phải chữ số hoặc dài dưới 2, in `khong-hop-le`; nếu đúng cấu trúc Luhn in `hop-le`, ngược lại in `sai-checksum`.',
      starterCode: `ma = input().strip()

# Kiem tra hinh dang truoc, sau do tinh Luhn tu phai sang trai.
`,
      testCases: [
        {
          stdinLines: ['79927398713'],
          expected: 'hop-le',
          match: 'contains',
          hidden: false,
          label: 'mã Luhn chuẩn',
        },
        {
          stdinLines: ['79927398714'],
          expected: 'sai-checksum',
          match: 'contains',
          hidden: true,
          label: 'đổi một chữ số cuối',
        },
        {
          stdinLines: ['79A27'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối ký tự không phải số',
        },
      ],
      hints: [
        'Dùng `ma.isdigit()` và độ dài để chặn hình dạng.',
        'Duyệt `enumerate(reversed(ma))`; vị trí lẻ là chữ số cần nhân đôi.',
        'Kết quả hợp lệ khi `tong % 10 == 0`.',
      ],
      sampleSolution: `ma = input().strip()

if len(ma) < 2 or not ma.isdigit():
    print("khong-hop-le")
else:
    tong = 0
    for vi_tri, ky_tu in enumerate(reversed(ma)):
        chu_so = int(ky_tu)
        if vi_tri % 2 == 1:
            chu_so *= 2
            if chu_so > 9:
                chu_so -= 9
        tong += chu_so
    print("hop-le" if tong % 10 == 0 else "sai-checksum")`,
    },
    homework:
      'Cài thêm ISBN-10 và tạo tự động mười mã sai bằng cách đổi một chữ số; bộ kiểm phải từ chối toàn bộ.',
    srsCards: [
      {
        hoi: 'Luhn biến đổi các chữ số từ phải sang trái như thế nào?',
        dap: 'Giữ chữ số kiểm tra, nhân đôi mỗi chữ số thứ hai; kết quả trên 9 thì trừ 9, rồi cộng tất cả và lấy modulo 10.',
      },
      {
        hoi: 'Một mã qua Luhn có chứng minh giao dịch hoặc tài khoản tồn tại không?',
        dap: 'Không. Luhn chỉ phát hiện lỗi nhập phổ biến và kiểm cấu trúc; xác thực quyền và sự tồn tại vẫn phải làm ở hệ thống có thẩm quyền.',
      },
    ],
  },
]
