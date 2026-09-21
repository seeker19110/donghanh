// lessons/p6u242.ts — P6-U242: HƯỚNG GAME, chặng S1 "Trò chơi hoàn chỉnh đầu tiên" —
// module `game-s1-m1` (vòng lặp game: delta time, máy trạng thái nhân vật, nhập liệu trừu tượng).
//
// Hai bài chia theo hai nửa của cùng một vòng lặp: bài 1 hỏi "một bước thời gian làm thế giới
// đổi bao nhiêu" (delta time — thế giới không được phụ thuộc tốc độ máy), bài 2 hỏi "trạng thái
// nhân vật được phép đi đâu" (máy trạng thái + nhập liệu trừu tượng, không đọc mã phím thẳng).
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// Mọi simulator là MÔ PHỎNG Python tất định, hữu hạn: không engine thật, không GPU, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U242_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u242-l1',
    unitId: 'p6-u242',
    language: 'python',
    title: 'MÔ PHỎNG một bước vòng lặp game: delta time (dt) chứ không phải hằng số cộng thẳng',
    hook: 'Game cộng thẳng 5 đơn vị mỗi khung hình sẽ chạy nhanh gấp đôi trên máy 120Hz — và người chơi máy yếu chơi một trò chơi khác hẳn bạn.',
    theory:
      'Vòng lặp game làm ba việc lặp lại: đọc nhập liệu, cập nhật thế giới, vẽ. Việc cập nhật phải nhân vận tốc với delta time (dt — khoảng thời gian trôi qua từ khung hình trước), vì chỉ khi đó quãng đường đi được mới phụ thuộc THỜI GIAN chứ không phụ thuộc số khung hình máy kịp vẽ. Một dt bằng 0 hoặc âm là vô nghĩa (đồng hồ chạy lùi, chia cho 0 ở chỗ khác), còn một dt quá lớn là "bước thời gian chết": nhân vật nhảy xuyên qua tường vì trong một bước nó dịch xa hơn cả bề dày tường, nên vòng lặp thật phải chặn thay vì âm thầm cho qua. Đây là MÔ PHỎNG Python hữu hạn trên một dòng số: không engine, không cửa sổ đồ hoạ, không đồng hồ hệ thống — dt là tham số truyền vào.',
    workedExample: {
      code: `# MO PHONG mot buoc cap nhat; dt tinh bang mili-giay, v tinh bang don vi moi giay.\ndt, v, x = 16, 1000, 0\n# Nhan van toc voi dt: 16ms cua 1000 don vi/giay = 16 don vi.\nx_moi = x + v * dt // 1000\nprint("allow: x moi = " + str(x_moi))`,
      stdinLines: [],
    },
    predict: {
      code: `dt, v, x = 32, 1000, 0\nprint("allow: x moi = " + str(x + v * dt // 1000))`,
      question:
        'Máy chậm hơn nên một khung hình kéo dài 32ms thay vì 16ms. MÔ PHỎNG in ra vị trí mới nào?',
      choices: ['allow: x moi = 32', 'allow: x moi = 16', 'allow: x moi = 1000', 'invalid: dt'],
      answerIndex: 0,
      explain:
        'Khung hình dài gấp đôi thì thời gian trôi qua gấp đôi, nên quãng đường cũng gấp đôi — đó chính là điều delta time bảo đảm: máy nhanh vẽ nhiều khung hình ngắn, máy chậm vẽ ít khung hình dài, nhưng sau một giây cả hai đều đi được 1000 đơn vị.',
    },
    parsons: {
      prompt: 'Xếp một bước cập nhật có kiểm dt trước khi tính: dt hỏng thì không được đụng x.',
      lines: [
        'if dt <= 0:',
        '    print("invalid: dt")',
        'elif dt > 250:',
        '    print("deny: buoc thoi gian qua lon")',
        'else:',
        '    print("allow: x moi = " + str(x + v * dt // 1000))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một bước cập nhật của vòng lặp game. Đọc một dòng `dt:<mili-giây>,v:<đơn vị/giây>,x:<vị trí>`. Thiếu/thừa trường → `invalid: field`; dt không phải số nguyên → `invalid: dt`; v hoặc x không phải số nguyên (cho phép âm) → `invalid: v` / `invalid: x`; dt ≤ 0 → `invalid: dt`; dt > 250 → `deny: buoc thoi gian qua lon`; còn lại → `allow: x moi = <x + v*dt//1000>`. Không dùng đồng hồ hệ thống, không engine, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG vòng lặp game; chỉ tính trên dòng nhập, không đọc đồng hồ thật.\n',
      testCases: [
        {
          stdinLines: ['dt:16,v:1000,x:0'],
          expected: 'allow: x moi = 16',
          match: 'contains',
          hidden: false,
          label: 'khung hình 16ms của 1000 đơn vị/giây đi được 16 đơn vị',
        },
        {
          stdinLines: ['dt:32,v:1000,x:0'],
          expected: 'allow: x moi = 32',
          match: 'contains',
          hidden: true,
          label: 'khung hình dài gấp đôi thì đi được gấp đôi — không phụ thuộc tốc độ máy',
        },
        {
          stdinLines: ['dt:16,v:-500,x:100'],
          expected: 'allow: x moi = 92',
          match: 'contains',
          hidden: true,
          label: 'vận tốc âm là đi lùi, vẫn phải tính đúng',
        },
        {
          stdinLines: ['dt:500,v:1000,x:0'],
          expected: 'deny: buoc thoi gian qua lon',
          match: 'contains',
          hidden: true,
          label: 'bước thời gian chết bị chặn thay vì cho nhân vật xuyên tường',
        },
        {
          stdinLines: ['dt:0,v:1000,x:0'],
          expected: 'invalid: dt',
          match: 'contains',
          hidden: true,
          label: 'ca âm — dt bằng 0 fail closed, không rơi vào nhánh tính toán',
        },
      ],
      hints: [
        'Kiểm đủ ba khoá TRƯỚC khi đọc giá trị nào, để dòng hỏng luôn ra `invalid: field`.',
        'Số âm không qua được `isdigit()` — bỏ dấu trừ ở đầu rồi mới kiểm.',
        'Không dùng `time`, `datetime.now`, subprocess, socket hay file.',
      ],
      sampleSolution: `def so(x):
    lo = x[1:] if x.startswith("-") else x
    return int(x) if lo.isdigit() and lo != "" else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"dt", "v", "x"}:
        print("invalid: field")
    elif so(m["dt"]) is None or so(m["dt"]) <= 0:
        print("invalid: dt")
    elif so(m["v"]) is None:
        print("invalid: v")
    elif so(m["x"]) is None:
        print("invalid: x")
    elif so(m["dt"]) > 250:
        print("deny: buoc thoi gian qua lon")
    else:
        print("allow: x moi = " + str(so(m["x"]) + so(m["v"]) * so(m["dt"]) // 1000))
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, mở Godot hoặc Unity, làm một cảnh có một ô vuông chạy ngang màn hình: bản A cộng thẳng một hằng số mỗi khung hình, bản B nhân vận tốc với delta time. Khoá khung hình lần lượt ở 30 và 120 FPS, quay màn hình cả hai bản và ghi lại thời gian ô vuông đi hết màn hình — nộp bốn con số đó.',
    srsCards: [
      {
        hoi: 'Vì sao cập nhật phải nhân vận tốc với delta time thay vì cộng một hằng số mỗi khung hình?',
        dap: 'Cộng hằng số buộc tốc độ trong game vào số khung hình máy vẽ được, nên cùng một trò chơi chạy nhanh chậm khác nhau theo máy; nhân với delta time khiến quãng đường phụ thuộc thời gian thật, giống nhau trên mọi máy.',
      },
      {
        hoi: 'Vì sao một delta time quá lớn phải bị chặn chứ không cho tính bình thường?',
        dap: 'Trong một bước quá dài, nhân vật dịch xa hơn cả bề dày tường nên va chạm không kịp phát hiện và nó xuyên qua; chặn sớm buộc vòng lặp phải chia nhỏ bước thay vì sinh ra lỗi không tái hiện được.',
      },
    ],
  },
  {
    id: 'p6-u242-l2',
    unitId: 'p6-u242',
    language: 'python',
    title: 'MÔ PHỎNG máy trạng thái nhân vật và lớp nhập liệu trừu tượng',
    hook: 'Nếu mã của bạn hỏi "phím Space có được bấm không", thì thêm tay cầm là viết lại cả game; nếu nó hỏi "người chơi có muốn nhảy không", thì thêm tay cầm là thêm một dòng ánh xạ.',
    theory:
      'Nhân vật trong game là một máy trạng thái: idle, run, jump, duck — và không phải trạng thái nào cũng đi được tới trạng thái nào. Bảng chuyển tiếp viết tường minh giúp lỗi "đang lơ lửng vẫn nhảy tiếp được" bị chặn ngay ở cổng thay vì lộ ra sau hai mươi giờ chơi thử. Lớp nhập liệu đứng trước máy trạng thái: nó biến thao tác thiết bị (phím, nút tay cầm, chạm màn hình) thành Ý ĐỊNH trừu tượng như "nhay", "cui"; máy trạng thái chỉ nhìn thấy ý định. Ý định chưa khai báo thì trả về `unknown` — khác hẳn `deny`: `unknown` nghĩa là "tôi không biết nút này là gì", còn `deny` nghĩa là "tôi biết, nhưng lúc này không được". Đây là MÔ PHỎNG Python hữu hạn: không đọc thiết bị thật, không engine.',
    workedExample: {
      code: `# MO PHONG bang chuyen tiep; nut da la Y DINH truu tuong, khong phai ma phim.\nbang = {("idle", "nhay"): "jump", ("idle", "chay"): "run"}\ntrangthai, nut = "idle", "nhay"\nprint("allow: " + bang[(trangthai, nut)])`,
      stdinLines: [],
    },
    predict: {
      code: `bang = {("idle", "nhay"): "jump"}\ntrangthai, nut = "jump", "nhay"\nprint("allow: " + bang[(trangthai, nut)] if (trangthai, nut) in bang else "deny: chuyen tiep khong hop le")`,
      question: 'Nhân vật đang ở trạng thái jump và người chơi bấm nhảy tiếp. MÔ PHỎNG in gì?',
      choices: [
        'deny: chuyen tiep khong hop le',
        'allow: jump',
        'unknown: nut chua khai bao',
        'invalid: trangthai',
      ],
      answerIndex: 0,
      explain:
        'Cặp (jump, nhay) không nằm trong bảng chuyển tiếp nên cổng từ chối — đó chính là cách chặn lỗi nhảy hai lần vô hạn, và chặn bằng DỮ LIỆU (bảng) chứ không bằng một chuỗi if rải khắp mã.',
    },
    parsons: {
      prompt:
        'Xếp cổng nhập liệu: nút lạ là chuyện của lớp nhập liệu, chuyển tiếp sai là chuyện của máy trạng thái.',
      lines: [
        'if trangthai not in trang_thai_hop_le:',
        '    print("invalid: trangthai")',
        'elif nut not in y_dinh_hop_le:',
        '    print("unknown: nut chua khai bao")',
        'elif (trangthai, nut) not in bang:',
        '    print("deny: chuyen tiep khong hop le")',
        'else:',
        '    print("allow: " + bang[(trangthai, nut)])',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG máy trạng thái nhân vật sau lớp nhập liệu trừu tượng. Đọc `trangthai:<idle|run|jump|duck>,nut:<nhay|chay|cui|dung>`. Thiếu/thừa trường → `invalid: field`; trạng thái ngoài bốn giá trị → `invalid: trangthai`; nút ngoài bốn ý định → `unknown: nut chua khai bao`. Bảng chuyển tiếp hợp lệ: idle+nhay→jump, idle+chay→run, idle+cui→duck, idle+dung→idle, run+nhay→jump, run+chay→run, run+cui→duck, run+dung→idle, duck+chay→run, duck+cui→duck, duck+dung→idle. Mọi cặp còn lại (kể cả mọi nút khi đang jump) → `deny: chuyen tiep khong hop le`. Hợp lệ → `allow: <trạng thái mới>`. Không đọc mã phím thật, không engine.',
      starterCode: '# MÔ PHỎNG máy trạng thái nhân vật; nút vào đây đã là ý định trừu tượng.\n',
      testCases: [
        {
          stdinLines: ['trangthai:idle,nut:nhay'],
          expected: 'allow: jump',
          match: 'contains',
          hidden: false,
          label: 'đứng yên bấm nhảy thì nhảy được',
        },
        {
          stdinLines: ['trangthai:jump,nut:nhay'],
          expected: 'deny: chuyen tiep khong hop le',
          match: 'contains',
          hidden: true,
          label: 'đang lơ lửng không nhảy tiếp được — chặn lỗi nhảy vô hạn',
        },
        {
          stdinLines: ['trangthai:run,nut:cui'],
          expected: 'allow: duck',
          match: 'contains',
          hidden: true,
          label: 'đang chạy thì trượt xuống được',
        },
        {
          stdinLines: ['trangthai:idle,nut:ban'],
          expected: 'unknown: nut chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'ý định chưa khai báo là unknown, không phải deny',
        },
        {
          stdinLines: ['trangthai:bay,nut:nhay'],
          expected: 'invalid: trangthai',
          match: 'contains',
          hidden: true,
          label: 'ca âm — trạng thái không tồn tại fail closed',
        },
      ],
      hints: [
        'Viết bảng chuyển tiếp thành một dict khoá là cặp (trạng thái, nút) — thêm trạng thái mới chỉ là thêm dòng dữ liệu.',
        'Kiểm trạng thái trước, nút sau, rồi mới tra bảng: hai lỗi cùng lúc vẫn ra một kết quả tất định.',
        'Không đọc thiết bị, file, socket hay thời gian thực.',
      ],
      sampleSolution: `BANG = {
    ("idle", "nhay"): "jump",
    ("idle", "chay"): "run",
    ("idle", "cui"): "duck",
    ("idle", "dung"): "idle",
    ("run", "nhay"): "jump",
    ("run", "chay"): "run",
    ("run", "cui"): "duck",
    ("run", "dung"): "idle",
    ("duck", "chay"): "run",
    ("duck", "cui"): "duck",
    ("duck", "dung"): "idle",
}

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"trangthai", "nut"}:
        print("invalid: field")
    elif m["trangthai"] not in {"idle", "run", "jump", "duck"}:
        print("invalid: trangthai")
    elif m["nut"] not in {"nhay", "chay", "cui", "dung"}:
        print("unknown: nut chua khai bao")
    elif (m["trangthai"], m["nut"]) not in BANG:
        print("deny: chuyen tiep khong hop le")
    else:
        print("allow: " + BANG[(m["trangthai"], m["nut"])])
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity dựng một nhân vật có bốn trạng thái trên và một bản đồ nhập liệu (Input Map / Input Actions) đặt tên theo ý định chứ không theo phím. Cắm thêm một tay cầm rồi ghi lại chính xác bạn phải sửa bao nhiêu dòng mã gameplay để nó chơi được — nếu con số đó lớn hơn 0 thì lớp nhập liệu của bạn chưa thật sự trừu tượng.',
    srsCards: [
      {
        hoi: 'Khác nhau giữa `unknown` và `deny` khi xử lý nhập liệu trong game là gì?',
        dap: '`unknown` nghĩa là ý định chưa được khai báo ở lớp nhập liệu — lỗi cấu hình; `deny` nghĩa là ý định hợp lệ nhưng trạng thái hiện tại không cho phép — luật chơi. Gộp hai thứ lại thì lỗi thiếu ánh xạ phím sẽ bị hiểu nhầm thành thiết kế.',
      },
      {
        hoi: 'Vì sao bảng chuyển tiếp nên là dữ liệu thay vì một chuỗi lệnh if rải trong mã?',
        dap: 'Bảng dữ liệu đọc được hết trong một màn hình nên thiếu một chuyển tiếp là nhìn thấy ngay, và thêm trạng thái mới chỉ là thêm dòng; chuỗi if rải rác thì mỗi lần thêm trạng thái phải đi tìm đủ mọi chỗ, và luôn sót một chỗ.',
      },
    ],
  },
]
