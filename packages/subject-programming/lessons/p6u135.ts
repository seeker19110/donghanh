// P6-U135 — mathforcode-s1-m2: logic Boolean và bit mask.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U135_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u135-l1',
    unitId: 'p6-u135',
    language: 'python',
    title: 'De Morgan — sửa điều kiện quyền mà không đổi nghĩa',
    hook: 'Một dấu `and` đổi nhầm thành `or` trong điều kiện phân quyền có thể mở dữ liệu cho sai người. “Trông có vẻ tương đương” chưa đủ; bảng chân trị mới là bằng chứng.',
    theory:
      'Hai luật De Morgan: `not (A and B)` tương đương `(not A) or (not B)`; `not (A or B)` tương đương `(not A) and (not B)`. Khi đẩy phủ định vào trong, phải đổi AND ↔ OR. Bảng chân trị duyệt mọi tổ hợp Boolean là một phép chứng minh hữu hạn và cũng là property test nhỏ. Python đánh giá ngắn mạch: với `A and B`, B không chạy khi A sai; với `A or B`, B không chạy khi A đúng. Đặt kiểm tra rẻ/an toàn trước thao tác đắt hoặc có side effect.',
    workedExample: {
      code: `for bi_khoa in [False, True]:
    for het_han in [False, True]:
        ban_goc = not (bi_khoa or het_han)
        rut_gon = (not bi_khoa) and (not het_han)
        print(bi_khoa, het_han, ban_goc == rut_gon)`,
      stdinLines: [],
    },
    predict: {
      code: `a = True
b = False
print(not (a and b))
print((not a) or (not b))`,
      question: 'Hai biểu thức tương đương in ra gì?',
      choices: ['True\nTrue', 'False\nFalse', 'True\nFalse', 'False\nTrue'],
      answerIndex: 0,
      explain:
        '`a and b` là False nên phủ định thành True; bản De Morgan cũng là False or True, tức True.',
    },
    parsons: {
      prompt: 'Xếp đoạn duyệt mọi tổ hợp để chứng minh hai biểu thức tương đương.',
      lines: [
        'for a in [False, True]:',
        '    for b in [False, True]:',
        '        trai = not (a or b)',
        '        phai = (not a) and (not b)',
        '        assert trai == phai',
        'print("tuong-duong")',
      ],
    },
    make: {
      prompt:
        'Đọc ba dòng 0/1: `dang_hoat_dong`, `bi_khoa`, `het_han`. Chỉ in `cho-phep` khi tài khoản đang hoạt động và không bị khóa và không hết hạn; các trường hợp khác in `tu-choi`.',
      starterCode: `dang_hoat_dong = input() == "1"
bi_khoa = input() == "1"
het_han = input() == "1"

# Viet dieu kien ro rang va dung De Morgan.
`,
      testCases: [
        {
          stdinLines: ['1', '0', '0'],
          expected: 'cho-phep',
          match: 'contains',
          hidden: false,
          label: 'tài khoản tốt được phép',
        },
        {
          stdinLines: ['1', '1', '0'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'bị khóa phải từ chối',
        },
        {
          stdinLines: ['0', '0', '0'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'không hoạt động phải từ chối',
        },
      ],
      hints: [
        'Nhóm hai lý do chặn thành `(bi_khoa or het_han)`.',
        'Phủ định cả nhóm bằng `not (...)`.',
        'Kết hợp với `dang_hoat_dong` bằng `and`.',
      ],
      sampleSolution: `dang_hoat_dong = input() == "1"
bi_khoa = input() == "1"
het_han = input() == "1"

duoc_phep = dang_hoat_dong and not (bi_khoa or het_han)
print("cho-phep" if duoc_phep else "tu-choi")`,
    },
    homework:
      'Viết bảng chân trị tám dòng cho điều kiện Make và thêm assert chứng minh nó tương đương `active and not locked and not expired`.',
    srsCards: [
      {
        hoi: 'Khi đẩy phủ định vào trong ngoặc theo De Morgan, toán tử thay đổi thế nào?',
        dap: 'AND đổi thành OR và OR đổi thành AND; đồng thời từng vế bên trong đều nhận phủ định.',
      },
      {
        hoi: 'Bảng chân trị giúp review điều kiện quyền như thế nào?',
        dap: 'Nó duyệt toàn bộ tổ hợp Boolean hữu hạn, chứng minh hai biểu thức cùng kết quả thay vì dựa vào cảm giác đọc code.',
      },
    ],
  },
  {
    id: 'p6-u135-l2',
    unitId: 'p6-u135',
    language: 'python',
    title: 'Bit mask — bật một quyền mà không làm mất các quyền còn lại',
    hook: 'Một hệ có 20 cờ Boolean lưu thành 20 cột vừa cồng kềnh vừa khó truyền qua mạng. Bit mask gom chúng vào một số nguyên, nhưng thao tác sai có thể xóa nhầm quyền khác.',
    theory:
      'Mỗi cờ chiếm một bit là lũy thừa của hai: DOC=1, GHI=2, QUAN_TRI=4. Bật cờ dùng OR: `flags | mask`. Tắt cờ dùng AND với phủ định: `flags & ~mask`. Kiểm cờ dùng `(flags & mask) != 0`. XOR chỉ phù hợp khi thật sự muốn đảo trạng thái; dùng XOR để “bật” sẽ vô tình tắt cờ đang bật. Các phép phải giữ nguyên mọi bit không thuộc mask.',
    workedExample: {
      code: `DOC, GHI, QUAN_TRI = 1, 2, 4
quyen = DOC | GHI
print(quyen)
quyen = quyen | QUAN_TRI
print(quyen)
quyen = quyen & ~GHI
print(quyen)`,
      stdinLines: [],
    },
    predict: {
      code: `DOC, GHI, QUAN_TRI = 1, 2, 4
quyen = DOC | QUAN_TRI
print(bool(quyen & GHI))
print(bool(quyen & QUAN_TRI))`,
      question: 'Hai lần kiểm cờ in ra gì?',
      choices: ['False\nTrue', 'True\nFalse', 'True\nTrue', 'False\nFalse'],
      answerIndex: 0,
      explain: 'Giá trị 5 có bit DOC và QUAN_TRI, nhưng bit GHI bằng 0.',
    },
    parsons: {
      prompt: 'Xếp hàm cập nhật cờ với ba thao tác bật, tắt và kiểm.',
      lines: [
        'def xu_ly(flags, lenh, mask):',
        '    if lenh == "bat":',
        '        return flags | mask',
        '    if lenh == "tat":',
        '        return flags & ~mask',
        '    return 1 if flags & mask else 0',
      ],
    },
    make: {
      prompt:
        'Đọc `flags`, lệnh `bat`/`tat`/`kiem`, rồi `mask`. Với bật/tắt, in flags mới; với kiểm, in 1 nếu cờ có mặt, ngược lại 0. Lệnh lạ in `lenh-khong-hop-le`.',
      starterCode: `flags = int(input())
lenh = input()
mask = int(input())

# Chi thay doi cac bit nam trong mask.
`,
      testCases: [
        {
          stdinLines: ['3', 'bat', '4'],
          expected: '7',
          match: 'contains',
          hidden: false,
          label: 'bật QUAN_TRI vẫn giữ DOC và GHI',
        },
        {
          stdinLines: ['7', 'tat', '2'],
          expected: '5',
          match: 'contains',
          hidden: true,
          label: 'tắt GHI không làm mất cờ khác',
        },
        {
          stdinLines: ['5', 'kiem', '2'],
          expected: '0',
          match: 'contains',
          hidden: true,
          label: 'kiểm cờ đang tắt',
        },
      ],
      hints: [
        'Bật: OR với mask.',
        'Tắt: AND với phần bù của mask.',
        'Kiểm: kết quả `flags & mask` khác 0 nghĩa là cờ có mặt.',
      ],
      sampleSolution: `flags = int(input())
lenh = input()
mask = int(input())

if lenh == "bat":
    print(flags | mask)
elif lenh == "tat":
    print(flags & ~mask)
elif lenh == "kiem":
    print(1 if flags & mask else 0)
else:
    print("lenh-khong-hop-le")`,
    },
    homework:
      'Thêm lệnh `dat` nhận một mask nhiều bit và chứng minh bằng test rằng các bit ngoài mask không đổi sau mọi thao tác.',
    srsCards: [
      {
        hoi: 'Ba phép bật, tắt và kiểm một cờ trong bit mask là gì?',
        dap: 'Bật dùng `flags | mask`; tắt dùng `flags & ~mask`; kiểm dùng `(flags & mask) != 0`.',
      },
      {
        hoi: 'Vì sao không dùng XOR khi mục tiêu là chắc chắn bật một cờ?',
        dap: 'XOR đảo trạng thái: bit đang tắt thành bật nhưng bit đã bật lại thành tắt, nên không bảo đảm trạng thái cuối là bật.',
      },
    ],
  },
]
