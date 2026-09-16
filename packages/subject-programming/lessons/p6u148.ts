// P6-U148 — systems-s1-m3: debugger và sanitizer qua trace mô phỏng.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U148_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u148-l1',
    unitId: 'p6-u148',
    language: 'python',
    title: 'MÔ PHỎNG debugger — lần ngược frame tới thao tác gốc',
    hook: 'Lỗi xuất hiện trong `render`, nhưng biến sai đã được tạo ở `parse`. Backtrace hữu ích vì nó nối nơi biểu hiện với chuỗi lời gọi đã đưa dữ liệu tới đó.',
    theory:
      'Debugger simulator Python này không phải debugger C thật. Một breakpoint MÔ PHỎNG dừng tại event đã chọn để xem frame, tham số và biến cục bộ. Backtrace liệt kê stack frame từ nơi đang dừng ngược về caller. Cách điều tra: xác định invariant bị phá, tìm frame đầu tiên quan sát giá trị sai, rồi lần ngược sự kiện ghi gần nhất tạo ra giá trị đó. Nơi crash là symptom site; thao tác ghi sai trước đó mới có thể là root cause.',
    workedExample: {
      code: `# Trace MÔ PHỎNG, không phải phiên debugger thật.
trace = [
    {"frame": "main", "event": "call", "value": 3},
    {"frame": "parse", "event": "write", "value": -1},
    {"frame": "render", "event": "check", "value": -1},
]
for event in reversed(trace):
    if event["event"] == "write" and event["value"] < 0:
        print("root-cause", event["frame"])
        break`,
      stdinLines: [],
    },
    predict: {
      code: `frames = ["main", "load", "decode"]
print(" <- ".join(reversed(frames)))
print("breakpoint", frames[-1])`,
      question: 'Backtrace mô phỏng và frame breakpoint được in thế nào?',
      choices: [
        'decode <- load <- main\nbreakpoint decode',
        'main <- load <- decode\nbreakpoint main',
        'decode <- main\nbreakpoint load',
        'load <- decode <- main\nbreakpoint decode',
      ],
      answerIndex: 0,
      explain:
        'Frame hiện tại là decode; backtrace đi từ frame hiện tại về các caller load và main.',
    },
    parsons: {
      prompt:
        'Xếp hàm tìm event write đầu tiên đã tạo giá trị âm trước symptom trong trace MÔ PHỎNG.',
      lines: [
        'def tim_goc(trace):',
        '    for event in reversed(trace):',
        '        if event["kind"] == "write" and event["value"] < 0:',
        '            return event["frame"]',
        '    return "khong-tim-thay"',
      ],
    },
    make: {
      prompt:
        'Đọc các event MÔ PHỎNG cách nhau bởi dấu phẩy, dạng `frame:kind:value`, với kind là `call`, `write`, `check`. Dòng cuối phải là check. In `backtrace=<các frame duy nhất từ cuối về đầu>` và frame của lần `write` gần nhất trước check có cùng value bằng `root=<frame>`. Dữ liệu sai in `trace-khong-hop-le`; không có write khớp in `root=khong-tim-thay`.',
      starterCode: `dong = input().strip()

# Trace debugger MÔ PHỎNG, khong phai debugger C that.
`,
      testCases: [
        {
          stdinLines: ['main:call:3,parse:write:-1,render:check:-1'],
          expected: 'backtrace=render <- parse <- main\nroot=parse',
          match: 'contains',
          hidden: false,
          label: 'phân biệt symptom render và root parse',
        },
        {
          stdinLines: ['main:call:2,load:write:2,use:check:2'],
          expected: 'root=load',
          match: 'contains',
          hidden: true,
          label: 'lần ngược write khớp gần nhất',
        },
        {
          stdinLines: ['main:call:1,use:write:1'],
          expected: 'trace-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'trace không kết thúc bằng check',
        },
      ],
      hints: [
        'Tách từng event bằng dấu phẩy, rồi tách ba trường bằng dấu hai chấm.',
        'Backtrace lấy tên frame duy nhất khi duyệt ngược.',
        'Giá trị symptom là value của event check cuối; tìm write khớp khi duyệt ngược phần trước.',
      ],
      sampleSolution: `dong = input().strip()
events = []
hop_le = True

for muc in dong.split(",") if dong else []:
    phan = muc.split(":")
    if len(phan) != 3 or phan[1] not in {"call", "write", "check"}:
        hop_le = False
        break
    try:
        value = int(phan[2])
    except ValueError:
        hop_le = False
        break
    events.append({"frame": phan[0], "kind": phan[1], "value": value})

if not hop_le or not events or events[-1]["kind"] != "check":
    print("trace-khong-hop-le")
else:
    frames = []
    for event in reversed(events):
        if event["frame"] not in frames:
            frames.append(event["frame"])
    print("backtrace=" + " <- ".join(frames))
    can_tim = events[-1]["value"]
    root = "khong-tim-thay"
    for event in reversed(events[:-1]):
        if event["kind"] == "write" and event["value"] == can_tim:
            root = event["frame"]
            break
    print("root=" + root)`,
    },
    homework:
      'Trên máy có debugger và binary C thật, đặt breakpoint, lưu lệnh backtrace/inspect biến và chỉ ra root cause khác symptom site. Nếu thiếu môi trường thì ghi BLOCKED; trace Python không được trình bày như phiên debugger thật.',
    srsCards: [
      {
        hoi: 'Backtrace cho biết gì?',
        dap: 'Nó cho biết chuỗi stack frame từ điểm đang dừng ngược qua các caller, giúp lần theo đường thực thi tới symptom.',
      },
      {
        hoi: 'Breakpoint và root cause có phải luôn cùng một vị trí không?',
        dap: 'Không. Breakpoint là điểm chủ động dừng quan sát; root cause có thể là thao tác ghi sai xảy ra ở frame trước đó.',
      },
      {
        hoi: 'Vì sao cần xem invariant thay vì chỉ dòng crash?',
        dap: 'Dòng crash thường chỉ biểu hiện dữ liệu đã sai; invariant giúp tìm thời điểm đầu tiên trạng thái chuyển từ hợp lệ sang sai.',
      },
    ],
  },
  {
    id: 'p6-u148-l2',
    unitId: 'p6-u148',
    language: 'python',
    title: 'MÔ PHỎNG sanitizer report — phân loại bốn lỗi bộ nhớ',
    hook: 'Báo cáo nói lỗi ở lần đọc thứ mười, nhưng nguyên nhân là lần free thứ bảy. Một báo cáo tốt phải chỉ cả thao tác gây lỗi lẫn lịch sử làm nó trở thành lỗi.',
    theory:
      'Reporter MÔ PHỎNG này phân loại bốn lỗi: `out-of-bounds` khi chỉ số ngoài 0..size−1; `use-after-free` khi read/write khối đã free; `double-free` khi free lại; `leak` khi kết thúc còn khối sống. Mỗi report ghi số bước và block. Root cause là thao tác phá invariant; symptom là thao tác quan sát hậu quả, nên với use-after-free cần nhắc cả bước free và bước access. Đây không phải sanitizer hay báo cáo bộ nhớ C thật.',
    workedExample: {
      code: `# Báo cáo MÔ PHỎNG, không phải sanitizer thật.
trace = [(1, "alloc", "H1"), (2, "free", "H1"), (3, "read", "H1")]
free_step = {}
for step, op, block in trace:
    if op == "free":
        free_step[block] = step
    elif op == "read" and block in free_step:
        print("use-after-free", "access=" + str(step), "freed=" + str(free_step[block]))`,
      stdinLines: [],
    },
    predict: {
      code: `alive = {"H1": True}
alive["H1"] = False
op = "free"
if op == "free" and not alive["H1"]:
    print("double-free@3")`,
      question: 'Report mô phỏng phân loại lần free thứ hai là gì?',
      choices: ['double-free@3', 'leak@3', 'use-after-free@3', 'out-of-bounds@3'],
      answerIndex: 0,
      explain: 'Khối đã hết sống trước thao tác free hiện tại, nên đây là double-free tại bước 3.',
    },
    parsons: {
      prompt: 'Xếp nhánh phân loại access trong reporter MÔ PHỎNG.',
      lines: [
        'if op in {"read", "write"}:',
        '    if block not in ledger or not ledger[block]["alive"]:',
        '        return "use-after-free"',
        '    if index < 0 or index >= ledger[block]["size"]:',
        '        return "out-of-bounds"',
        '    return "ok"',
      ],
    },
    make: {
      prompt:
        'Đọc size dương của H1 và chuỗi thao tác MÔ PHỎNG cách nhau bởi dấu phẩy: `read:<i>`, `write:<i>`, `free`, `end`. H1 ban đầu còn sống. In report đầu tiên trong `out-of-bounds@<bước>`, `use-after-free@<bước>`, `double-free@<bước>`, `leak@<bước>`; nếu end sau free in `ok`. Size/thao tác sai in `trace-khong-hop-le`.',
      starterCode: `size = int(input())
ops = [x.strip() for x in input().split(",")]

# Reporter MÔ PHỎNG, khong phai sanitizer C that.
`,
      testCases: [
        {
          stdinLines: ['3', 'read:0,write:3,end'],
          expected: 'out-of-bounds@2',
          match: 'contains',
          hidden: false,
          label: 'ghi đúng sát ngoài biên',
        },
        {
          stdinLines: ['2', 'free,read:0,end'],
          expected: 'use-after-free@2',
          match: 'contains',
          hidden: true,
          label: 'access sau free',
        },
        {
          stdinLines: ['4', 'read:3,end'],
          expected: 'leak@2',
          match: 'contains',
          hidden: true,
          label: 'khối còn sống lúc kết thúc',
        },
      ],
      hints: [
        'Duyệt với bước bắt đầu từ 1 và dừng ở report đầu tiên.',
        'Với read/write, kiểm alive trước rồi mới kiểm index.',
        '`end` báo leak nếu alive, ngược lại ok.',
      ],
      sampleSolution: `size = int(input())
ops = [x.strip() for x in input().split(",")]
alive = True
report = None

if size <= 0 or not ops:
    report = "trace-khong-hop-le"
else:
    for step, op in enumerate(ops, 1):
        if op == "free":
            if not alive:
                report = "double-free@" + str(step)
            else:
                alive = False
        elif op == "end":
            report = ("leak@" + str(step)) if alive else "ok"
        elif op.startswith("read:") or op.startswith("write:"):
            try:
                index = int(op.split(":", 1)[1])
            except ValueError:
                report = "trace-khong-hop-le"
            else:
                if not alive:
                    report = "use-after-free@" + str(step)
                elif index < 0 or index >= size:
                    report = "out-of-bounds@" + str(step)
        else:
            report = "trace-khong-hop-le"
        if report is not None:
            break

print(report if report is not None else "trace-khong-hop-le")`,
    },
    homework:
      'Tạo bốn chương trình C tối thiểu cho bốn nhóm lỗi, chạy công cụ chẩn đoán thật trên máy có toolchain và lưu nguyên lệnh/report. Ghi rõ thao tác gốc và symptom; nếu chưa chạy thì đánh dấu BLOCKED, không dùng report mô phỏng làm bằng chứng.',
    srsCards: [
      {
        hoi: 'Out-of-bounds được xác định bằng invariant nào?',
        dap: 'Với block size n còn sống, mọi chỉ số truy cập phải thỏa 0 ≤ index < n.',
      },
      {
        hoi: 'Use-after-free report cần nối hai sự kiện nào?',
        dap: 'Nó cần nối thao tác access gây symptom với thao tác free trước đó đã kết thúc vòng đời block.',
      },
      {
        hoi: 'Leak được kiểm vào lúc nào trong trace mô phỏng?',
        dap: 'Tại sự kiện kết thúc, khi ledger vẫn còn ít nhất một block ở trạng thái sống.',
      },
    ],
  },
]
