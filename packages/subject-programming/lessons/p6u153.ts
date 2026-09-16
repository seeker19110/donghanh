// P6-U153 — systems-s2-m4: mô hình ownership và hợp đồng unsafe của Rust.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U153_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u153-l1',
    unitId: 'p6-u153',
    language: 'python',
    title: 'MÔ PHỎNG Rust — move, borrow và lifetime',
    hook: 'Hai biến cùng trỏ tới một vùng có thể rất tiện, cho đến khi một bên ghi hoặc vùng ấy đã hết vòng đời. Rust biến câu hỏi “ai được dùng dữ liệu lúc này?” thành luật phải chứng minh.',
    theory:
      'Đây là máy trạng thái MÔ PHỎNG luật ownership, không chạy compiler Rust thật. Mỗi tài nguyên có đúng một owner còn hiệu lực. `move a b` chuyển quyền sở hữu và làm `a` không dùng được. Có thể có nhiều shared borrow hoặc đúng một mutable borrow, nhưng hai loại không chồng nhau. Owner không được move/drop khi borrow còn sống. Lifetime của borrow không được vượt quá tài nguyên gốc. Mô hình cố ý nhỏ: nó giúp trace invariant, không thay thế borrow checker, non-lexical lifetime hay toàn bộ type system Rust.',
    workedExample: {
      code: `# MÔ PHỎNG, không biên dịch Rust thật.
state = {"owner": "a", "alive": True, "shared": {"r1"}, "mutable": None}
print("read-ok" if state["alive"] and "r1" in state["shared"] else "borrow-error")
state["shared"].remove("r1")
state["owner"] = "b"  # move a -> b sau khi borrow kết thúc
print("owner=" + state["owner"])
print("use-after-move" if state["owner"] != "a" else "use-ok")`,
      stdinLines: [],
    },
    predict: {
      code: `shared = {"r1"}
mutable = None
if shared or mutable is not None:
    print("borrow-conflict")
else:
    mutable = "m1"
    print("mutable-ok")`,
      question: 'Khi shared borrow r1 còn sống, yêu cầu mutable borrow in gì?',
      choices: ['borrow-conflict', 'mutable-ok', 'use-after-move', 'lifetime-escape'],
      answerIndex: 0,
      explain:
        'Mutable borrow cần quyền truy cập độc quyền; một shared borrow còn sống đã làm yêu cầu xung đột.',
    },
    parsons: {
      prompt: 'Xếp hàm MÔ PHỎNG kiểm tra có được tạo mutable borrow hay không.',
      lines: [
        'def muon_mut(state, ten):',
        '    if not state["alive"]:',
        '        return "resource-dead"',
        '    if state["shared"] or state["mutable"] is not None:',
        '        return "borrow-conflict"',
        '    state["mutable"] = ten',
        '    return "mutable-ok"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một tài nguyên ban đầu thuộc `a`. Đọc các lệnh đến EOF: `move <dich>`, `borrow shared <ten>`, `borrow mut <ten>`, `end <ten>`, `use <ten>` hoặc `drop`. In một kết quả cho mỗi lệnh. Khóa use-after-move, shared/mutable chồng nhau, move/drop khi còn borrow và borrow sau drop. Đây không phải compiler Rust thật.',
      starterCode: `commands = []
while True:
    try:
        line = input().strip()
    except EOFError:
        break
    if line:
        commands.append(line.split())
owner = "a"
alive = True
shared = set()
mutable = None

# May trang thai MO PHONG, khong chay Rust compiler that.
`,
      testCases: [
        {
          stdinLines: ['borrow shared r1', 'use r1', 'end r1', 'move b', 'use a', 'use b'],
          expected: 'shared-ok\nuse-ok\nend-ok\nmove-ok\nuse-after-move\nuse-ok',
          match: 'contains',
          hidden: false,
          label: 'shared borrow kết thúc trước move',
        },
        {
          stdinLines: ['borrow shared r1', 'borrow mut m1', 'move b', 'drop'],
          expected: 'shared-ok\nborrow-conflict\nborrow-active\nborrow-active',
          match: 'contains',
          hidden: true,
          label: 'khóa alias mutable và đổi owner khi borrow còn sống',
        },
        {
          stdinLines: ['borrow mut m1', 'borrow shared r1', 'end m1', 'drop', 'borrow shared r2'],
          expected: 'mutable-ok\nborrow-conflict\nend-ok\ndrop-ok\nresource-dead',
          match: 'contains',
          hidden: true,
          label: 'mutable độc quyền và lifetime không vượt tài nguyên',
        },
      ],
      hints: [
        'Owner, tập shared borrow, mutable borrow và cờ alive là bốn phần state độc lập.',
        'Chỉ move/drop khi cả tập shared rỗng và mutable là None.',
        '`use` hợp lệ với owner hiện tại hoặc một borrow đang sống.',
      ],
      sampleSolution: `commands = []
while True:
    try:
        line = input().strip()
    except EOFError:
        break
    if line:
        commands.append(line.split())
owner = "a"
alive = True
shared = set()
mutable = None

for parts in commands:
    command = parts[0]
    if command == "move" and len(parts) == 2:
        if not alive:
            print("resource-dead")
        elif shared or mutable is not None:
            print("borrow-active")
        else:
            owner = parts[1]
            print("move-ok")
    elif command == "borrow" and len(parts) == 3:
        kind, name = parts[1], parts[2]
        if not alive:
            print("resource-dead")
        elif kind == "shared" and mutable is None:
            shared.add(name)
            print("shared-ok")
        elif kind == "mut" and mutable is None and not shared:
            mutable = name
            print("mutable-ok")
        else:
            print("borrow-conflict")
    elif command == "end" and len(parts) == 2:
        name = parts[1]
        if name in shared:
            shared.remove(name)
            print("end-ok")
        elif name == mutable:
            mutable = None
            print("end-ok")
        else:
            print("borrow-unknown")
    elif command == "use" and len(parts) == 2:
        name = parts[1]
        if not alive:
            print("resource-dead")
        elif name == owner or name in shared or name == mutable:
            print("use-ok")
        else:
            print("use-after-move")
    elif command == "drop" and len(parts) == 1:
        if not alive:
            print("double-drop")
        elif shared or mutable is not None:
            print("borrow-active")
        else:
            alive = False
            print("drop-ok")
    else:
        print("invalid-command")`,
    },
    homework:
      'Lập trace cho một hàm MÔ PHỎNG định trả shared borrow tới biến local. Đánh dấu nơi lifetime escape bị từ chối, rồi sửa API để owner sống lâu hơn borrow. So sánh với thông báo của rustc trên máy có toolchain thật.',
    srsCards: [
      {
        hoi: 'Move làm gì với biến nguồn trong mô hình ownership?',
        dap: 'Nó chuyển quyền sở hữu sang biến đích và biến nguồn không còn được dùng như owner hợp lệ.',
      },
      {
        hoi: 'Luật alias cốt lõi của borrow là gì?',
        dap: 'Tại một thời điểm có nhiều shared borrow hoặc đúng một mutable borrow, không có cả hai.',
      },
      {
        hoi: 'Lifetime bảo vệ điều gì?',
        dap: 'Nó bảo đảm tham chiếu không sống lâu hơn dữ liệu mà tham chiếu trỏ tới.',
      },
    ],
  },
  {
    id: 'p6-u153-l2',
    unitId: 'p6-u153',
    language: 'python',
    title: 'MÔ PHỎNG Rust — Result và safety contract',
    hook: 'Một `unsafe` block chỉ dài ba dòng vẫn có thể chuyển gánh nặng đúng-sai cho cả chương trình. Từ khóa không xóa luật; nó yêu cầu người viết nêu và giữ một hợp đồng mạnh hơn.',
    theory:
      'Bài dùng Python để MÔ PHỎNG `Option`, `Result` và biên `unsafe`, không chạy Rust hay truy cập con trỏ thật. `Option` buộc biểu diễn có/không có giá trị; `Result` giữ nhánh thành công hoặc lỗi có ngữ cảnh. Toán tử `?` có thể hiểu là: gặp lỗi thì trả lỗi sớm, thành công thì lấy giá trị. Tại biên unsafe, caller phải thỏa precondition và implementation phải bảo đảm postcondition. Ví dụ lát mảng cần `0 <= start <= end <= len(data)`; nếu sai phải từ chối trước biên, không đoán kết quả undefined behavior.',
    workedExample: {
      code: `# MÔ PHỎNG Result và safety contract; không dereference pointer thật.
def checked_slice(data, start, end):
    if not (0 <= start <= end <= len(data)):
        return ("Err", "bounds")
    return ("Ok", data[start:end])

for start, end in [(1, 3), (3, 7)]:
    tag, value = checked_slice([10, 20, 30, 40], start, end)
    print(tag, value)`,
      stdinLines: [],
    },
    predict: {
      code: `def parse_positive(text):
    if not text.isdigit():
        return ("Err", "not-number")
    value = int(text)
    return ("Ok", value) if value > 0 else ("Err", "not-positive")

tag, value = parse_positive("0")
print(tag + ":" + str(value))`,
      question: 'Hàm trả nhánh nào cho chuỗi "0"?',
      choices: ['Err:not-positive', 'Ok:0', 'Err:not-number', 'None'],
      answerIndex: 0,
      explain:
        'Chuỗi là số hợp lệ nhưng không thỏa postcondition dương, nên lỗi có ngữ cảnh được giữ lại.',
    },
    parsons: {
      prompt: 'Xếp hàm lan truyền lỗi theo tinh thần toán tử `?` trong mô hình Result.',
      lines: [
        'def cong_hai(result_a, result_b):',
        '    if result_a[0] == "Err":',
        '        return result_a',
        '    if result_b[0] == "Err":',
        '        return result_b',
        '    return ("Ok", result_a[1] + result_b[1])',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG API `checked_slice`. Đọc một dòng số nguyên cách nhau bởi khoảng trắng, rồi `start end`. Nếu parse lỗi in `Err:parse`; nếu precondition `0 <= start <= end <= len(data)` sai in `Err:safety-contract`; nếu đúng in `Ok:` kèm lát cắt cách nhau bởi dấu phẩy (lát rỗng vẫn là `Ok:`). Không dùng hay giả kết quả undefined behavior và không chạy unsafe Rust thật.',
      starterCode: `data_text = input().strip()
range_text = input().strip()

# Kiem tra safety contract truoc bien unsafe MO PHONG.
`,
      testCases: [
        {
          stdinLines: ['10 20 30 40', '1 3'],
          expected: 'Ok:20,30',
          match: 'contains',
          hidden: false,
          label: 'precondition đúng và postcondition giữ nguyên lát cắt',
        },
        {
          stdinLines: ['10 20', '-1 2'],
          expected: 'Err:safety-contract',
          match: 'contains',
          hidden: true,
          label: 'từ chối chỉ số âm trước biên unsafe',
        },
        {
          stdinLines: ['10 x 30', '0 2'],
          expected: 'Err:parse',
          match: 'contains',
          hidden: true,
          label: 'giữ lỗi parse thay vì panic',
        },
        {
          stdinLines: ['10 20', '2 2'],
          expected: 'Ok:',
          match: 'contains',
          hidden: true,
          label: 'lát rỗng vẫn thỏa hợp đồng',
        },
      ],
      hints: [
        'Bọc cả hai phép parse trong try/except để giữ một đường lỗi duy nhất.',
        'Kiểm tra đồng thời `0 <= start <= end <= len(data)`.',
        'Nhánh Ok ghép `str(value)` bằng dấu phẩy; danh sách rỗng tạo chuỗi rỗng.',
      ],
      sampleSolution: `data_text = input().strip()
range_text = input().strip()

try:
    data = [int(x) for x in data_text.split()]
    parts = range_text.split()
    if len(parts) != 2:
        raise ValueError
    start, end = (int(x) for x in parts)
except ValueError:
    print("Err:parse")
else:
    if not (0 <= start <= end <= len(data)):
        print("Err:safety-contract")
    else:
        result = data[start:end]
        print("Ok:" + ",".join(str(x) for x in result))`,
    },
    homework:
      'Viết safety contract cho một hàm FFI nhận pointer và length: liệt kê precondition về null, alignment, vùng nhớ, lifetime và aliasing; liệt kê postcondition. Sau đó chỉ ra phần nào cần test động và phần nào cần review/toolchain Rust thật.',
    srsCards: [
      {
        hoi: '`Result` khác việc nuốt lỗi như thế nào?',
        dap: 'Result giữ lỗi như một nhánh dữ liệu tường minh để caller xử lý hoặc truyền tiếp cùng ngữ cảnh.',
      },
      {
        hoi: '`unsafe` trong Rust có nghĩa là bỏ mọi luật an toàn không?',
        dap: 'Không. Nó cho phép một số thao tác compiler không chứng minh được và chuyển trách nhiệm giữ safety contract sang lập trình viên.',
      },
      {
        hoi: 'Safety contract cần ghi hai phía nào?',
        dap: 'Precondition caller phải bảo đảm trước khi gọi và postcondition implementation cam kết nếu precondition đúng.',
      },
    ],
  },
]
