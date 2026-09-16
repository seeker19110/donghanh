// P6-U149 — systems-s1-m4: build/link và assembly đồ chơi.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U149_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u149-l1',
    unitId: 'p6-u149',
    language: 'python',
    title: 'MÔ PHỎNG build/link — từ source tới bảng symbol',
    hook: 'Mỗi file compile riêng đều “ổn”, nhưng bước link vẫn thất bại: `main` cần `sum` mà không object nào định nghĩa. Thành công cục bộ chưa tạo ra chương trình hoàn chỉnh.',
    theory:
      'Pipeline khái niệm gồm preprocess → compile → assemble → link. Bài dùng MÔ PHỎNG Python, không gọi compiler hay linker C thật. Linker đồ chơi nhận tập symbol `define` và `need`: need không có define là `missing`; một symbol được define ở nhiều object là `duplicate`. Build tăng dần dùng đồ thị phụ thuộc: file thay đổi buộc chính nó và mọi node phụ thuộc trực tiếp/gián tiếp được build lại. Static library được chọn/copy phần cần khi link theo manifest; dynamic library là phụ thuộc được nạp theo hợp đồng lúc chạy. Simulator chỉ so manifest, không tạo library thật.',
    workedExample: {
      code: `# Linker MÔ PHỎNG, không phải toolchain C thật.
objects = {
    "main.o": {"define": {"main"}, "need": {"sum"}},
    "math.o": {"define": {"sum"}, "need": set()},
}
defined = set().union(*(x["define"] for x in objects.values()))
needed = set().union(*(x["need"] for x in objects.values()))
print("ok" if not needed - defined else "missing", sorted(needed - defined))

# Đồ thị phụ thuộc: key phải build lại khi một dependency trong value đổi.
depends = {"core.o": set(), "ui.o": {"core.o"}, "app": {"ui.o"}}
dirty = {"core.o"}
while True:
    them = {node for node, deps in depends.items() if deps & dirty}
    if them <= dirty: break
    dirty.update(them)
print("rebuild", *sorted(dirty))`,
      stdinLines: [],
    },
    predict: {
      code: `defines = ["main,sum", "sum"]
dem = {}
for dong in defines:
    for ten in dong.split(","):
        dem[ten] = dem.get(ten, 0) + 1
print(sorted(k for k, v in dem.items() if v > 1))`,
      question: 'Bảng symbol mô phỏng phát hiện gì?',
      choices: ["['sum']", "['main']", '[]', "['main', 'sum']"],
      answerIndex: 0,
      explain:
        '`sum` được định nghĩa ở cả hai object nên là duplicate symbol; `main` chỉ có một định nghĩa.',
    },
    parsons: {
      prompt: 'Xếp kiểm tra missing symbol trong linker MÔ PHỎNG.',
      lines: [
        'defined = set()',
        'needed = set()',
        'for obj in objects:',
        '    defined.update(obj["define"])',
        '    needed.update(obj["need"])',
        'missing = sorted(needed - defined)',
        'return missing',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG link. Đọc các object cách nhau bởi `;`, mỗi object dạng `ten|define_csv|need_csv` (dùng `-` cho tập rỗng). Nếu có symbol định nghĩa nhiều lần, in `duplicate=<danh sách sắp xếp>`; nếu không mà thiếu symbol, in `missing=<danh sách>`; đủ thì in `link-ok`. Dữ liệu sai in `manifest-khong-hop-le`.',
      starterCode: `dong = input().strip()

# Bang symbol MÔ PHỎNG, khong goi compiler/linker C that.
`,
      testCases: [
        {
          stdinLines: ['main.o|main|sum;math.o|sum|-'],
          expected: 'link-ok',
          match: 'contains',
          hidden: false,
          label: 'mọi need có đúng một define',
        },
        {
          stdinLines: ['main.o|main|sum;other.o|helper|-'],
          expected: 'missing=sum',
          match: 'contains',
          hidden: true,
          label: 'bắt symbol không được định nghĩa',
        },
        {
          stdinLines: ['a.o|main,sum|-;b.o|sum|-'],
          expected: 'duplicate=sum',
          match: 'contains',
          hidden: true,
          label: 'duplicate ưu tiên hơn missing',
        },
      ],
      hints: [
        'Tách object bằng `;`, rồi yêu cầu đúng ba phần khi tách `|`.',
        'Đếm mỗi define bằng dict; count > 1 là duplicate.',
        'Missing là `needed - set(defined)`; luôn sort trước khi nối.',
      ],
      sampleSolution: `dong = input().strip()
dem = {}
needed = set()
hop_le = bool(dong)

for muc in dong.split(";") if dong else []:
    phan = muc.split("|")
    if len(phan) != 3 or not phan[0]:
        hop_le = False
        break
    defs = [] if phan[1] == "-" else [x for x in phan[1].split(",") if x]
    needs = [] if phan[2] == "-" else [x for x in phan[2].split(",") if x]
    for ten in defs:
        dem[ten] = dem.get(ten, 0) + 1
    needed.update(needs)

if not hop_le:
    print("manifest-khong-hop-le")
else:
    duplicate = sorted(k for k, v in dem.items() if v > 1)
    missing = sorted(needed - set(dem))
    if duplicate:
        print("duplicate=" + ",".join(duplicate))
    elif missing:
        print("missing=" + ",".join(missing))
    else:
        print("link-ok")`,
    },
    homework:
      'Vẽ đồ thị `app <- ui <- core` và `tests <- core`, rồi tính tập build lại khi core đổi và khi ui đổi. Sau đó tạo build một lệnh trên máy có toolchain C, lưu lệnh/output; thiếu toolchain ghi BLOCKED.',
    srsCards: [
      {
        hoi: 'Bốn pha khái niệm từ source tới executable là gì?',
        dap: 'Preprocess, compile, assemble rồi link; mỗi pha nhận artifact của pha trước và tạo đầu vào cho pha sau.',
      },
      {
        hoi: 'Missing symbol và duplicate symbol khác nhau thế nào?',
        dap: 'Missing là symbol được cần nhưng không object nào định nghĩa; duplicate là cùng symbol được nhiều object định nghĩa.',
      },
      {
        hoi: 'Khi một node thay đổi, đồ thị phụ thuộc quyết định build lại ra sao?',
        dap: 'Build lại node đó và mọi node phụ thuộc trực tiếp hoặc gián tiếp vào nó; node độc lập không cần build lại.',
      },
    ],
  },
  {
    id: 'p6-u149-l2',
    unitId: 'p6-u149',
    language: 'python',
    title: 'MÔ PHỎNG ISA đồ chơi — LOAD, ADD, MUL, RET',
    hook: 'Một biểu thức nguồn ngắn có thể thành nhiều lệnh. Theo dõi từng thay đổi của accumulator giúp nối ý nghĩa hàm nguồn với máy trạng thái ở mức thấp.',
    theory:
      'ISA ĐỒ CHƠI chỉ có accumulator `ACC`: `LOAD x` đặt ACC=x; `ADD x` cộng x; `MUL x` nhân x; `RET` trả ACC và phải là lệnh cuối. Mỗi bước tạo trace tất định. Ví dụ hàm nguồn `return (x + 2) * 3` ánh xạ thành `LOAD x; ADD 2; MUL 3; RET`. Đây là assembly MÔ PHỎNG, không phải mã máy hay C runtime thật. Manifest static/dynamic chỉ mô tả thời điểm giải quyết phụ thuộc; kết quả mô phỏng không chứng minh binary thật đã link hoặc nạp library.',
    workedExample: {
      code: `# Máy assembly MÔ PHỎNG với ISA ĐỒ CHƠI.
acc = 0
for op, value in [("LOAD", 4), ("ADD", 2), ("MUL", 3)]:
    if op == "LOAD": acc = value
    elif op == "ADD": acc += value
    else: acc *= value
    print(op, acc)
print("RET", acc)

# Manifest khái niệm; không tạo hoặc nạp library thật.
manifest = {"static": ["math"], "dynamic": ["display"]}
print("link-time", *manifest["static"])
print("run-time", *manifest["dynamic"])`,
      stdinLines: [],
    },
    predict: {
      code: `acc = 0
for op, value in [("LOAD", 5), ("MUL", 2), ("ADD", 1)]:
    if op == "LOAD": acc = value
    elif op == "ADD": acc += value
    elif op == "MUL": acc *= value
print(acc)`,
      question: 'Máy ISA đồ chơi trả giá trị nào trước RET?',
      choices: ['11', '15', '12', '7'],
      answerIndex: 0,
      explain: 'LOAD 5, MUL 2 tạo 10, rồi ADD 1 tạo 11. Thứ tự lệnh quyết định kết quả.',
    },
    parsons: {
      prompt: 'Xếp phần thực thi ADD và MUL của máy ISA đồ chơi.',
      lines: [
        'if op == "ADD":',
        '    acc += value',
        'elif op == "MUL":',
        '    acc *= value',
        'else:',
        '    return "lenh-khong-hop-le"',
      ],
    },
    make: {
      prompt:
        'Chạy máy assembly MÔ PHỎNG. Đọc các lệnh cách nhau bởi dấu phẩy: `LOAD n`, `ADD n`, `MUL n`, và `RET`. Chương trình phải có LOAD đầu tiên, đúng một RET cuối cùng. In `trace=<ACC sau mỗi lệnh số học, cách bởi dấu phẩy>` rồi `result=<ACC>`. Vi phạm in `chuong-trinh-khong-hop-le`.',
      starterCode: `lenh = [x.strip() for x in input().split(",")]

# ISA DO CHOI, khong phai assembly/may C that.
`,
      testCases: [
        {
          stdinLines: ['LOAD 4,ADD 2,MUL 3,RET'],
          expected: 'trace=4,6,18\nresult=18',
          match: 'contains',
          hidden: false,
          label: 'khớp biểu thức (4+2)*3',
        },
        {
          stdinLines: ['LOAD -2,MUL 4,ADD 3,RET'],
          expected: 'trace=-2,-8,-5\nresult=-5',
          match: 'contains',
          hidden: true,
          label: 'toán hạng âm vẫn tất định',
        },
        {
          stdinLines: ['ADD 2,RET'],
          expected: 'chuong-trinh-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'bắt chương trình thiếu LOAD đầu',
        },
      ],
      hints: [
        'Kiểm lệnh cuối đúng bằng RET và không có RET nào trước đó.',
        'Mỗi lệnh số học phải tách thành opcode và đúng một số nguyên.',
        'Chỉ cho ADD/MUL sau khi ACC đã được LOAD.',
      ],
      sampleSolution: `lenh = [x.strip() for x in input().split(",")]
hop_le = bool(lenh) and lenh[-1] == "RET" and "RET" not in lenh[:-1]
acc = None
trace = []

for vi_tri, dong in enumerate(lenh[:-1]):
    phan = dong.split()
    if len(phan) != 2 or phan[0] not in {"LOAD", "ADD", "MUL"}:
        hop_le = False
        break
    try:
        value = int(phan[1])
    except ValueError:
        hop_le = False
        break
    op = phan[0]
    if vi_tri == 0 and op != "LOAD":
        hop_le = False
        break
    if op == "LOAD":
        acc = value
    elif acc is None:
        hop_le = False
        break
    elif op == "ADD":
        acc += value
    else:
        acc *= value
    trace.append(acc)

if not hop_le or acc is None:
    print("chuong-trinh-khong-hop-le")
else:
    print("trace=" + ",".join(str(x) for x in trace))
    print("result=" + str(acc))`,
    },
    homework:
      'Viết manifest phân biệt một phụ thuộc static và một phụ thuộc dynamic, rồi giải thích artifact/thời điểm cần mỗi phụ thuộc. Nếu thử assembly hoặc linker thật, ghi kiến trúc, toolchain, lệnh và output; simulator không thay thế bằng chứng đó.',
    srsCards: [
      {
        hoi: 'Bốn lệnh của ISA đồ chơi thay đổi ACC thế nào?',
        dap: 'LOAD đặt ACC, ADD cộng vào ACC, MUL nhân ACC, RET trả ACC mà không đổi nó.',
      },
      {
        hoi: 'Vì sao thứ tự ADD và MUL không thể tùy ý đổi?',
        dap: 'Chúng cập nhật cùng accumulator và phép cộng/nhân theo chuỗi không giao hoán nói chung; đổi thứ tự đổi biểu thức và kết quả.',
      },
      {
        hoi: 'Static và dynamic library khác nhau ở mức khái niệm nào?',
        dap: 'Static giải quyết/chọn mã cần tại bước link artifact; dynamic giữ phụ thuộc để loader giải quyết theo hợp đồng lúc chạy.',
      },
    ],
  },
]
