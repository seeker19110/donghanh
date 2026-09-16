// P6-U147 — systems-s1-m2: ownership và chuỗi NUL qua mô phỏng Python.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U147_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u147-l1',
    unitId: 'p6-u147',
    language: 'python',
    title: 'MÔ PHỎNG allocator — ai sở hữu thì người đó giải phóng',
    hook: 'Một hàm cấp phát xong rồi quên ghi ai phải free. Chương trình vẫn chạy hôm nay, nhưng ledger cuối phiên còn một khối sống: đó là leak.',
    theory:
      'Ownership là hợp đồng về trách nhiệm giải phóng. Mỗi khối MÔ PHỎNG có id, kích thước, chủ sở hữu và trạng thái sống. `alloc` tạo đúng một khối còn sống; `free` hợp lệ đúng một lần, bởi chủ sở hữu; `NULL` biểu diễn không trỏ tới khối nào và không được đọc. Free lần hai là double-free; bỏ sót khối sống cuối phiên là leak. Simulator Python này chỉ kiểm bất biến ledger, không cấp phát bộ nhớ C và không tái tạo undefined behavior.',
    workedExample: {
      code: `# MÔ PHỎNG allocator, không phải C runtime thật.
ledger = {}
ledger["H1"] = {"size": 8, "owner": "main", "alive": True}
print("alloc", "H1", ledger["H1"]["owner"])
ledger["H1"]["alive"] = False
print("leaks", sum(1 for x in ledger.values() if x["alive"]))`,
      stdinLines: [],
    },
    predict: {
      code: `ledger = {"H1": {"owner": "main", "alive": True}}
ledger["H1"]["alive"] = False
if not ledger["H1"]["alive"]:
    print("double-free")
else:
    ledger["H1"]["alive"] = False`,
      question: 'Lần free thứ hai trong ledger mô phỏng được phân loại thế nào?',
      choices: ['double-free', 'leak', 'NULL', 'hop-le'],
      answerIndex: 0,
      explain: 'Khối H1 đã có `alive=False`; một yêu cầu free mới phải bị chặn là double-free.',
    },
    parsons: {
      prompt: 'Xếp hàm free trong ledger MÔ PHỎNG, gồm kiểm tra NULL, id và ownership.',
      lines: [
        'def giai_phong(ledger, ma, nguoi):',
        '    if ma == "NULL": return "null"',
        '    if ma not in ledger: return "khong-ton-tai"',
        '    if not ledger[ma]["alive"]: return "double-free"',
        '    if ledger[ma]["owner"] != nguoi: return "sai-owner"',
        '    ledger[ma]["alive"] = False',
        '    return "da-free"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một ledger. Đọc owner của khối H1, rồi ba thao tác cách nhau bởi dấu phẩy (`free:<owner>`, `check`, `null`). Khối bắt đầu còn sống. In kết quả mỗi thao tác: `da-free`, `double-free`, `sai-owner`, `leak=<0|1>` hoặc `NULL`. Thao tác lạ in `thao-tac-khong-hop-le`.',
      starterCode: `owner = input().strip()
thao_tac = [x.strip() for x in input().split(",")]
ledger = {"H1": {"owner": owner, "alive": True}}

# Ledger MÔ PHỎNG, khong cap phat bo nho C.
`,
      testCases: [
        {
          stdinLines: ['main', 'free:main,check,null'],
          expected: 'da-free\nleak=0\nNULL',
          match: 'contains',
          hidden: false,
          label: 'owner giải phóng đúng trách nhiệm',
        },
        {
          stdinLines: ['worker', 'free:worker,free:worker,check'],
          expected: 'da-free\ndouble-free\nleak=0',
          match: 'contains',
          hidden: true,
          label: 'bắt free lần hai',
        },
        {
          stdinLines: ['main', 'free:guest,check,null'],
          expected: 'sai-owner\nleak=1\nNULL',
          match: 'contains',
          hidden: true,
          label: 'sai owner để lại leak',
        },
      ],
      hints: [
        'Giữ một cờ `alive` duy nhất trong H1.',
        'Kiểm `alive` trước khi đổi nó thành false.',
        '`check` đếm các khối còn sống; `null` không đổi ledger.',
      ],
      sampleSolution: `owner = input().strip()
thao_tac = [x.strip() for x in input().split(",")]
ledger = {"H1": {"owner": owner, "alive": True}}

for lenh in thao_tac:
    if lenh == "check":
        print("leak=" + str(sum(1 for x in ledger.values() if x["alive"])))
    elif lenh == "null":
        print("NULL")
    elif lenh.startswith("free:"):
        nguoi = lenh.split(":", 1)[1]
        khoi = ledger["H1"]
        if not khoi["alive"]:
            print("double-free")
        elif khoi["owner"] != nguoi:
            print("sai-owner")
        else:
            khoi["alive"] = False
            print("da-free")
    else:
        print("thao-tac-khong-hop-le")`,
    },
    homework:
      'Trên máy có toolchain C, viết một chương trình nhỏ có hợp đồng owner rõ ràng, chạy công cụ kiểm tra bộ nhớ thật và lưu lệnh cùng output. Nếu chưa có toolchain, ghi BLOCKED; hoàn thành simulator không thay thế artifact C.',
    srsCards: [
      {
        hoi: 'Ownership trả lời câu hỏi nào?',
        dap: 'Nó xác định thành phần nào đang chịu trách nhiệm giữ và giải phóng một tài nguyên, cùng thời điểm chuyển trách nhiệm nếu có.',
      },
      {
        hoi: 'Double-free và leak khác nhau thế nào?',
        dap: 'Double-free là giải phóng một khối đã hết sống; leak là còn khối sống nhưng mất đường hoặc trách nhiệm giải phóng khi kết thúc.',
      },
      {
        hoi: 'Con trỏ NULL biểu diễn gì trong mô hình?',
        dap: 'Nó biểu diễn không tham chiếu khối nào; phải kiểm trước khi đọc, và không phải là một khối còn sống trong ledger.',
      },
    ],
  },
  {
    id: 'p6-u147-l2',
    unitId: 'p6-u147',
    language: 'python',
    title: 'MÔ PHỎNG chuỗi C — luôn dành một byte cho NUL',
    hook: 'Buffer có sức chứa 5 không chứa được năm ký tự rồi thêm terminator. Với chuỗi NUL, tải hữu ích tối đa chỉ là 4 byte.',
    theory:
      'Chuỗi kiểu C là dãy byte kết thúc bởi byte NUL `0`. Với capacity dương, phép copy an toàn chỉ chép tối đa `capacity-1` byte rồi ghi NUL. Không tìm thấy NUL trong capacity nghĩa là buffer chưa tạo thành chuỗi hợp lệ; không được đọc tiếp ngoài biên để “hy vọng” gặp terminator. `bytearray` ở đây là MÔ PHỎNG tất định, không chạy C thật. Header và đơn vị biên dịch chỉ là hợp đồng khai báo/chia sẻ giao diện; bài này không tuyên bố đã biên dịch chúng.',
    workedExample: {
      code: `def copy_nul(text, capacity):
    if capacity <= 0:
        return bytearray()
    du_lieu = text.encode("ascii")[: capacity - 1]
    return bytearray(du_lieu + b"\\0")

buf = copy_nul("HELLO", 5)
print(list(buf))
print(bytes(buf[:-1]).decode("ascii"))`,
      stdinLines: [],
    },
    predict: {
      code: `capacity = 4
buf = bytearray(b"ABCD")
print("co-nul" if 0 in buf[:capacity] else "thieu-nul")`,
      question: 'Bộ kiểm buffer hiện có in gì khi bốn byte trong capacity đều khác 0?',
      choices: ['thieu-nul', 'co-nul', 'ABCD', 'ngoai-bien'],
      answerIndex: 0,
      explain:
        'Không có byte 0 nào trong phạm vi capacity, nên buffer chưa phải chuỗi kết thúc NUL hợp lệ.',
    },
    parsons: {
      prompt: 'Xếp hàm copy chuỗi vào bytearray MÔ PHỎNG có chừa NUL.',
      lines: [
        'def copy_an_toan(nguon, capacity):',
        '    if capacity <= 0:',
        '        return bytearray()',
        '    payload = nguon.encode("ascii")[:capacity - 1]',
        '    dich = bytearray(capacity)',
        '    dich[:len(payload)] = payload',
        '    dich[len(payload)] = 0',
        '    return dich',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG copy chuỗi ASCII. Đọc `capacity` rồi chuỗi nguồn. Nếu capacity <= 0 in `capacity-khong-hop-le`; ký tự ngoài ASCII in `khong-phai-ascii`. Ngược lại copy tối đa capacity-1 byte vào bytearray đúng capacity, chèn NUL và in `text=<phần đã chép>` cùng `bytes=<danh sách byte>`.',
      starterCode: `capacity = int(input())
nguon = input()

# bytearray MÔ PHỎNG chuoi ket thuc NUL, khong chay C that.
`,
      testCases: [
        {
          stdinLines: ['5', 'HELLO'],
          expected: 'text=HELL\nbytes=[72, 69, 76, 76, 0]',
          match: 'contains',
          hidden: false,
          label: 'cắt nguồn và chừa một byte NUL',
        },
        {
          stdinLines: ['1', 'ABC'],
          expected: 'text=\nbytes=[0]',
          match: 'contains',
          hidden: true,
          label: 'capacity một chỉ chứa terminator',
        },
        {
          stdinLines: ['0', 'A'],
          expected: 'capacity-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'không thể ghi NUL vào capacity không dương',
        },
      ],
      hints: [
        'Bọc `nguon.encode("ascii")` trong try/except UnicodeEncodeError.',
        'Payload có độ dài tối đa `capacity - 1`.',
        'Tạo bytearray đúng capacity; các ô chưa ghi vốn là 0.',
      ],
      sampleSolution: `capacity = int(input())
nguon = input()

if capacity <= 0:
    print("capacity-khong-hop-le")
else:
    try:
        ma_hoa = nguon.encode("ascii")
    except UnicodeEncodeError:
        print("khong-phai-ascii")
    else:
        payload = ma_hoa[:capacity - 1]
        buf = bytearray(capacity)
        buf[:len(payload)] = payload
        buf[len(payload)] = 0
        print("text=" + bytes(payload).decode("ascii"))
        print("bytes=" + str(list(buf)))`,
    },
    homework:
      'Viết một header hợp đồng cho hàm copy có capacity và một file C gọi hàm trên máy riêng. Ghi toolchain, lệnh build và test capacity 0, 1, vừa đủ, bị cắt; nếu chưa chạy được thì ghi BLOCKED, không coi Python là bằng chứng build C.',
    srsCards: [
      {
        hoi: 'Buffer capacity n chứa tối đa bao nhiêu byte nội dung của chuỗi NUL?',
        dap: 'Tối đa n−1 byte khi n dương, vì phải dành một byte cho terminator NUL.',
      },
      {
        hoi: 'Không thấy NUL trong phạm vi capacity cho biết điều gì?',
        dap: 'Buffer chưa biểu diễn một chuỗi kết thúc NUL hợp lệ trong biên đã biết; không được tiếp tục đọc vượt biên.',
      },
      {
        hoi: 'Header đóng vai trò gì giữa các đơn vị biên dịch?',
        dap: 'Header công bố hợp đồng giao diện chung; nó không tự chứng minh phần cài đặt đã được biên dịch hay liên kết.',
      },
    ],
  },
]
