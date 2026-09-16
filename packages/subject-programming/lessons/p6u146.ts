// P6-U146 — systems-s1-m1: mô hình bộ nhớ và ABI đồ chơi.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U146_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u146-l1',
    unitId: 'p6-u146',
    language: 'python',
    title: 'MÔ PHỎNG bộ nhớ — vùng nào sống bao lâu?',
    hook: 'Một con trỏ vẫn giữ tên ô nhớ sau khi hàm đã trả về. Cái tên còn đó không có nghĩa đối tượng còn sống: vùng nhớ và vòng đời là hai câu hỏi khác nhau.',
    theory:
      'Bài này dùng bảng MÔ PHỎNG, không đọc bộ nhớ hay chạy C thật. `text` chứa mã và sống suốt chương trình; `data` chứa dữ liệu tĩnh/toàn cục; `stack` gắn với một frame lời gọi; `heap` sống từ lúc cấp phát đến lúc giải phóng. Mô hình không khẳng định địa chỉ hay hướng tăng của stack/heap. Con trỏ là một tham chiếu tới mã đối tượng. Khi frame kết thúc hoặc heap đã free, tham chiếu còn giữ mã nhưng trở thành dangling pointer; dereference phải bị từ chối thay vì gán một kết quả undefined cố định.',
    workedExample: {
      code: `# MÔ PHỎNG logic, không phải C runtime thật.
doi_tuong = {"H1": {"vung": "heap", "song": True, "gia_tri": 42}}
con_tro = "H1"
print(doi_tuong[con_tro]["vung"], doi_tuong[con_tro]["gia_tri"])
doi_tuong[con_tro]["song"] = False
print("dangling" if not doi_tuong[con_tro]["song"] else "hop-le")`,
      stdinLines: [],
    },
    predict: {
      code: `bang = {"S1": {"vung": "stack", "song": True}}
ptr = "S1"
bang["S1"]["song"] = False  # frame mô phỏng kết thúc
print("dangling" if not bang[ptr]["song"] else "doc-duoc")`,
      question: 'Trace mô phỏng in gì sau khi frame chứa S1 kết thúc?',
      choices: ['dangling', 'doc-duoc', 'stack', 'S1'],
      answerIndex: 0,
      explain:
        'Con trỏ còn giữ mã S1 nhưng vòng đời của đối tượng đã hết, nên nó là dangling pointer.',
    },
    parsons: {
      prompt: 'Xếp hàm đọc một đối tượng trong bảng MÔ PHỎNG và chặn con trỏ treo.',
      lines: [
        'def doc(bang, con_tro):',
        '    if con_tro not in bang:',
        '        return "khong-ton-tai"',
        '    if not bang[con_tro]["song"]:',
        '        return "dangling"',
        '    return str(bang[con_tro]["gia_tri"])',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một đối tượng: đọc `vung` (`text`/`data`/`stack`/`heap`), trạng thái `song` (0/1), rồi thao tác `doc` hoặc `ket-thuc`. Vùng lạ in `vung-khong-hop-le`. `ket-thuc` làm stack/heap hết vòng đời và in `da-ket-thuc`; text/data in `vong-doi-chuong-trinh`. `doc` khi đã chết in `dangling`, còn sống in `hop-le:<vung>`.',
      starterCode: `vung = input().strip()
song = input().strip() == "1"
thao_tac = input().strip()

# Bang MÔ PHỎNG, khong truy cap bo nho C that.
`,
      testCases: [
        {
          stdinLines: ['heap', '1', 'doc'],
          expected: 'hop-le:heap',
          match: 'contains',
          hidden: false,
          label: 'đọc vùng heap còn sống',
        },
        {
          stdinLines: ['stack', '0', 'doc'],
          expected: 'dangling',
          match: 'contains',
          hidden: true,
          label: 'frame đã kết thúc',
        },
        {
          stdinLines: ['ngoai', '1', 'doc'],
          expected: 'vung-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối vùng không thuộc mô hình',
        },
      ],
      hints: [
        'Tập vùng hợp lệ là text, data, stack và heap.',
        'Chỉ stack/heap có sự kiện kết thúc riêng trong bài này.',
        'Đừng đọc giá trị nếu cờ `song` là false.',
      ],
      sampleSolution: `vung = input().strip()
song = input().strip() == "1"
thao_tac = input().strip()

if vung not in {"text", "data", "stack", "heap"}:
    print("vung-khong-hop-le")
elif thao_tac == "ket-thuc":
    if vung in {"stack", "heap"}:
        print("da-ket-thuc")
    else:
        print("vong-doi-chuong-trinh")
elif thao_tac != "doc":
    print("thao-tac-khong-hop-le")
elif not song:
    print("dangling")
else:
    print("hop-le:" + vung)`,
    },
    homework:
      'Vẽ hai trace MÔ PHỎNG: trả về địa chỉ biến local và trả về vùng heap đã cấp phát. Đánh dấu chính xác sự kiện làm mỗi con trỏ hợp lệ hoặc treo; không chạy hay suy đoán undefined behavior của C.',
    srsCards: [
      {
        hoi: 'Vùng nhớ và vòng đời khác nhau thế nào?',
        dap: 'Vùng phân loại nơi đối tượng thuộc về; vòng đời cho biết khoảng thời gian đối tượng tồn tại và có thể được truy cập hợp lệ.',
      },
      {
        hoi: 'Dangling pointer là gì?',
        dap: 'Là tham chiếu còn giữ định danh hoặc địa chỉ của đối tượng nhưng vòng đời đối tượng đã kết thúc, nên không được dereference.',
      },
      {
        hoi: 'Mô hình vùng nhớ này không cam kết điều gì về máy thật?',
        dap: 'Nó không cam kết địa chỉ tuyệt đối, hướng tăng stack/heap hay kết quả của undefined behavior.',
      },
    ],
  },
  {
    id: 'p6-u146-l2',
    unitId: 'p6-u146',
    language: 'python',
    title: 'MÔ PHỎNG ABI đồ chơi — byte, endian và padding',
    hook: 'Ba trường `char, int32, char` chứa sáu byte dữ liệu, nhưng struct lại chiếm mười hai byte. Những byte “trống” là cái giá của căn chỉnh.',
    theory:
      'Ta chỉ dùng ABI ĐỒ CHƠI: `char` size/alignment 1, `int32` size/alignment 4, alignment struct tối đa 4. Mỗi trường bắt đầu ở offset nhỏ nhất chia hết cho alignment của nó; cuối struct được đệm tới bội của alignment lớn nhất. Với `char,int32,char`, offset là 0,4,8 và size là 12. Endianness chỉ nói thứ tự byte của một giá trị nhiều byte: int32 `0x12345678` thành `78 56 34 12` ở little-endian và `12 34 56 78` ở big-endian. Đây là MÔ PHỎNG, không phải ABI của mọi máy hoặc C runtime thật.',
    workedExample: {
      code: `# ABI ĐỒ CHƠI: char=1/align1, int32=4/align4, max-align=4.
gia_tri = 0x12345678
little = [(gia_tri >> (8 * i)) & 255 for i in range(4)]
big = list(reversed(little))
print("little", *little)
print("big", *big)`,
      stdinLines: [],
    },
    predict: {
      code: `offset = 0
for size, align in [(1, 1), (4, 4), (1, 1)]:
    offset = ((offset + align - 1) // align) * align
    print(offset)
    offset += size
offset = ((offset + 3) // 4) * 4
print("size", offset)`,
      question: 'ABI đồ chơi in các offset và kích thước nào?',
      choices: ['0\n4\n8\nsize 12', '0\n1\n5\nsize 6', '0\n4\n5\nsize 8', '1\n4\n9\nsize 12'],
      answerIndex: 0,
      explain:
        'int32 cần bắt đầu ở bội 4; trường char cuối ở offset 8 và toàn struct được đệm từ 9 lên 12.',
    },
    parsons: {
      prompt: 'Xếp phép căn một offset lên bội gần nhất của alignment trong ABI đồ chơi.',
      lines: [
        'def can_len(offset, alignment):',
        '    if alignment <= 0:',
        '        return None',
        '    phan_du = offset % alignment',
        '    if phan_du == 0:',
        '        return offset',
        '    return offset + alignment - phan_du',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG ABI đồ chơi. Đọc một dòng tên trường cách nhau bởi dấu phẩy (`char` hoặc `int32`). In các offset cách nhau bởi khoảng trắng, rồi `size=<n>`. Tên lạ hoặc danh sách rỗng in `kieu-khong-hop-le`. Quy ước duy nhất: char=1/align1, int32=4/align4, max-align=4.',
      starterCode: `ten_kieu = [x.strip() for x in input().split(",") if x.strip()]

# ABI DO CHOI, khong suy rong sang moi may.
`,
      testCases: [
        {
          stdinLines: ['char,int32,char'],
          expected: '0 4 8\nsize=12',
          match: 'contains',
          hidden: false,
          label: 'padding trước int32 và cuối struct',
        },
        {
          stdinLines: ['int32,char,char'],
          expected: '0 4 5\nsize=8',
          match: 'contains',
          hidden: true,
          label: 'đệm cuối tới bội bốn',
        },
        {
          stdinLines: ['char,int64'],
          expected: 'kieu-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'ABI không khai báo int64',
        },
      ],
      hints: [
        'Bảng `(size, align)` là char `(1,1)`, int32 `(4,4)`.',
        'Căn offset bằng `((offset + align - 1) // align) * align`.',
        'Sau trường cuối, căn tổng size theo alignment lớn nhất đã gặp.',
      ],
      sampleSolution: `ten_kieu = [x.strip() for x in input().split(",") if x.strip()]
bang = {"char": (1, 1), "int32": (4, 4)}

if not ten_kieu or any(x not in bang for x in ten_kieu):
    print("kieu-khong-hop-le")
else:
    offset = 0
    lon_nhat = 1
    ket_qua = []
    for ten in ten_kieu:
        size, align = bang[ten]
        offset = ((offset + align - 1) // align) * align
        ket_qua.append(offset)
        offset += size
        lon_nhat = max(lon_nhat, align)
    tong = ((offset + lon_nhat - 1) // lon_nhat) * lon_nhat
    print(*ket_qua)
    print("size=" + str(tong))`,
    },
    homework:
      'Mở rộng ABI đồ chơi bằng `int16=2/align2`, lập bảng offset cho ba thứ tự trường khác nhau và giải thích vì sao đổi thứ tự có thể đổi padding. Ghi rõ đây không phải phép đo ABI máy thật.',
    srsCards: [
      {
        hoi: 'Little-endian và big-endian khác nhau ở đâu?',
        dap: 'Chúng khác thứ tự lưu các byte của một giá trị nhiều byte; không đổi giá trị toán học của số.',
      },
      {
        hoi: 'Quy tắc đặt offset của một trường trong ABI đồ chơi là gì?',
        dap: 'Căn offset hiện tại lên bội nhỏ nhất của alignment trường, đặt trường tại đó rồi cộng size.',
      },
      {
        hoi: 'Vì sao phải ghi rõ giả định ABI?',
        dap: 'Kích thước kiểu và căn chỉnh phụ thuộc ABI; kết quả của ABI đồ chơi không được suy rộng thành bảo đảm cho mọi máy.',
      },
    ],
  },
]
