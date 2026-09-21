// lessons/p6u253.ts — P6-U253: HƯỚNG GAME, chặng S3 — module `game-s3-m4` (3D nền tảng: ma trận
// biến đổi, quaternion, hoạt ảnh xương và hoà trộn hoạt ảnh).
//
// Bài 1 lo QUATERNION: phép quay dùng quaternion (không dùng góc Euler, tránh khoá trục gimbal),
// và quaternion phải có chuẩn bằng 1 trước khi dùng. Bài 2 lo HOÀ TRỘN HOẠT ẢNH: chỉ trộn được
// hai clip cùng hệ xương, hệ số trộn nằm trong [0,1].
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định trên số nguyên nhân tỉ lệ: không engine, không hoạt ảnh thật.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U253_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u253-l1',
    unitId: 'p6-u253',
    language: 'python',
    title: 'MÔ PHỎNG kiểm quaternion: chuẩn phải bằng 1 trước khi đem đi quay',
    hook: 'Máy bay của bạn ngóc lên 90 độ và đột nhiên mất một trục xoay — đó là khoá trục, và nó là lý do quaternion tồn tại.',
    theory:
      'Góc Euler mô tả phép quay bằng ba góc quanh ba trục, và khi một trục bị quay trùng lên trục khác thì bạn mất một bậc tự do — hiện tượng khoá trục (gimbal lock). Quaternion mô tả phép quay bằng bốn số (w, x, y, z) và không gặp vấn đề đó; đổi lại nó có một điều kiện bắt buộc: chuẩn của nó — tức w² + x² + y² + z² — phải bằng 1. Quaternion lệch chuẩn đem đi quay sẽ vừa quay vừa co giãn vật thể, và sai số này tích luỹ dần qua từng khung hình cho tới lúc mô hình méo hẳn. Vì vậy mọi quaternion phải được chuẩn hoá trước khi dùng, và cổng phải trả `invalid` khi chuẩn lệch quá sai số cho phép. Ở đây các thành phần được nhân tỉ lệ 1000 để giữ số nguyên: chuẩn đúng nghĩa là tổng bình phương bằng 1000000. Đây là MÔ PHỎNG hữu hạn, không engine, không toán số thực.',
    workedExample: {
      code: `# MO PHONG kiem chuan quaternion; moi thanh phan da nhan ti le 1000.\nw, x, y, z = 1000, 0, 0, 0\nchuan2 = w * w + x * x + y * y + z * z\nprint("allow: quaternion da chuan hoa" if chuan2 == 1000000 else "invalid: chuan quaternion lech")`,
      stdinLines: [],
    },
    predict: {
      code: `w, x, y, z = 1000, 1000, 0, 0\nchuan2 = w * w + x * x + y * y + z * z\nprint("invalid: chuan quaternion lech" if abs(chuan2 - 1000000) > 2000 else "allow: quaternion da chuan hoa")`,
      question:
        'Quaternion (1000, 1000, 0, 0) — tức chưa chuẩn hoá — được đem đi quay. MÔ PHỎNG in gì?',
      choices: [
        'invalid: chuan quaternion lech',
        'allow: quaternion da chuan hoa',
        'reject: khac he xuong',
        'clamp: he so ve 1',
      ],
      answerIndex: 0,
      explain:
        'Tổng bình phương là 2000000, gấp đôi giá trị chuẩn 1000000 — quaternion này dài gấp căn 2 lần. Đem nó đi quay thì vật thể vừa xoay vừa phình, và mỗi khung hình lại phình thêm một chút.',
    },
    parsons: {
      prompt: 'Xếp cổng quaternion: so chuẩn với sai số cho phép, không so bằng tuyệt đối.',
      lines: [
        'chuan2 = w * w + x * x + y * y + z * z',
        'if chuan2 == 0:',
        '    print("invalid: quaternion rong")',
        'elif abs(chuan2 - 1000000) > sai_so:',
        '    print("invalid: chuan quaternion lech")',
        'else:',
        '    print("allow: quaternion da chuan hoa")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng kiểm quaternion. Các thành phần đã nhân tỉ lệ 1000, nên chuẩn đúng là tổng bình phương bằng 1000000, sai số cho phép là 2000. Đọc `w:<int>,x:<int>,y:<int>,z:<int>`. Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên (cho phép âm) → `invalid: so`; cả bốn thành phần bằng 0 → `invalid: quaternion rong`; |tổng bình phương − 1000000| > 2000 → `invalid: chuan quaternion lech`; còn lại → `allow: quaternion da chuan hoa`. Không engine, không thư viện toán ngoài.',
      starterCode: '# MÔ PHỎNG kiểm quaternion; thành phần nhân tỉ lệ 1000 để giữ số nguyên.\n',
      testCases: [
        {
          stdinLines: ['w:1000,x:0,y:0,z:0'],
          expected: 'allow: quaternion da chuan hoa',
          match: 'contains',
          hidden: false,
          label: 'quaternion đơn vị — phép quay rỗng, chuẩn đúng bằng 1',
        },
        {
          stdinLines: ['w:1000,x:1000,y:0,z:0'],
          expected: 'invalid: chuan quaternion lech',
          match: 'contains',
          hidden: true,
          label: 'chưa chuẩn hoá thì quay kèm co giãn, sai số tích luỹ từng khung',
        },
        {
          stdinLines: ['w:707,x:707,y:0,z:0'],
          expected: 'allow: quaternion da chuan hoa',
          match: 'contains',
          hidden: true,
          label: 'quay 90 độ quanh một trục — nằm trong sai số cho phép',
        },
        {
          stdinLines: ['w:0,x:0,y:0,z:0'],
          expected: 'invalid: quaternion rong',
          match: 'contains',
          hidden: true,
          label: 'quaternion toàn 0 không chuẩn hoá được, không phải "không quay"',
        },
        {
          stdinLines: ['w:mot,x:0,y:0,z:0'],
          expected: 'invalid: so',
          match: 'contains',
          hidden: true,
          label: 'ca âm — thành phần sai kiểu fail closed',
        },
      ],
      hints: [
        'So chuẩn bằng SAI SỐ cho phép, không so bằng tuyệt đối: 707² × 2 = 999698, lệch 302 nên vẫn đạt.',
        'Quaternion toàn 0 phải có lời báo riêng — nó không phải "phép quay rỗng", phép quay rỗng là (1,0,0,0).',
        'Không dùng file, socket, subprocess hay thư viện toán ngoài.',
      ],
      sampleSolution: `KHOA = ("w", "x", "y", "z")
CHUAN = 1000000
SAI_SO = 2000


def so(x):
    lo = x[1:] if x.startswith("-") else x
    return int(x) if lo.isdigit() and lo != "" else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(KHOA):
        print("invalid: field")
    elif any(so(m[k]) is None for k in KHOA):
        print("invalid: so")
    else:
        v = [so(m[k]) for k in KHOA]
        chuan2 = sum(t * t for t in v)
        if chuan2 == 0:
            print("invalid: quaternion rong")
        elif abs(chuan2 - CHUAN) > SAI_SO:
            print("invalid: chuan quaternion lech")
        else:
            print("allow: quaternion da chuan hoa")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity dựng một vật thể xoay tự do bằng góc Euler rồi ngóc nó lên đúng 90 độ và thử xoay tiếp quanh hai trục còn lại — quay màn hình lúc bạn mất một bậc tự do. Làm lại cùng cảnh bằng quaternion và quay lại lần nữa; viết ba câu mô tả khác biệt bạn thấy.',
    srsCards: [
      {
        hoi: 'Khoá trục (gimbal lock) là gì và vì sao quaternion không gặp nó?',
        dap: 'Với góc Euler, khi một trục quay trùng lên trục khác thì hai góc điều khiển cùng một chuyển động và bạn mất một bậc tự do; quaternion mô tả phép quay như một điểm trên mặt cầu bốn chiều, không phân rã thành ba trục nên không có tình trạng trùng trục.',
      },
      {
        hoi: 'Chuyện gì xảy ra nếu dùng quaternion chưa chuẩn hoá?',
        dap: 'Phép quay kèm theo co giãn: vật thể vừa xoay vừa phình hoặc teo, và vì mỗi khung hình lại nhân thêm một lần nên sai số tích luỹ cho tới lúc mô hình méo hẳn.',
      },
    ],
  },
  {
    id: 'p6-u253-l2',
    unitId: 'p6-u253',
    language: 'python',
    title: 'MÔ PHỎNG hoà trộn hoạt ảnh: cùng hệ xương mới trộn được, hệ số phải trong [0,1]',
    hook: 'Trộn hoạt ảnh của người với hoạt ảnh của con nhện không cho ra thứ gì thú vị — nó cho ra một đống xương ở sai chỗ.',
    theory:
      'Hoà trộn hoạt ảnh là phép lấy trung bình có trọng số giữa hai tư thế của cùng một bộ xương: hệ số 0 là hoàn toàn clip A, hệ số 1 là hoàn toàn clip B, ở giữa là pha trộn — nhờ đó nhân vật chuyển từ đi sang chạy mượt thay vì nhảy phắt. Hai điều kiện bắt buộc. Thứ nhất, hai clip phải cùng HỆ XƯƠNG khai báo: trộn hai bộ xương khác nhau là lấy trung bình giữa những khớp không tương ứng, kết quả không sai kiểu dữ liệu nhưng sai hoàn toàn về hình. Thứ hai, hệ số phải nằm trong đoạn [0,1]; ra ngoài đoạn đó là ngoại suy — tư thế bị đẩy quá cả hai clip, khớp bẻ ngược — nên cổng `clamp` về biên gần nhất và nói rõ đã cắt. Hệ số ở đây tính theo phần trăm để giữ số nguyên. Đây là MÔ PHỎNG hữu hạn, không engine, không hoạt ảnh thật.',
    workedExample: {
      code: `# MO PHONG hoa tron; he so tinh theo phan tram de giu so nguyen.\nxuong_a, xuong_b, he_so = "nguoi", "nguoi", 40\nprint("allow: tron " + str(he_so) + " phan tram clip B" if xuong_a == xuong_b else "reject: khac he xuong")`,
      stdinLines: [],
    },
    predict: {
      code: `xuong_a, xuong_b = "nguoi", "nhen"\nprint("reject: khac he xuong" if xuong_a != xuong_b else "allow: tron duoc")`,
      question: 'Trộn một clip của bộ xương người với một clip của bộ xương nhện. MÔ PHỎNG in gì?',
      choices: ['reject: khac he xuong', 'allow: tron duoc', 'clamp: he so ve 1', 'invalid: he so'],
      answerIndex: 0,
      explain:
        'Phép trộn lấy trung bình từng khớp theo cặp, nên nó chỉ có nghĩa khi hai bộ xương có cùng danh sách khớp. Khác hệ xương thì phép tính vẫn chạy được nhưng kết quả là các khớp bị ghép nhầm — lỗi không lộ ra ở kiểu dữ liệu, chỉ lộ ra ở hình.',
    },
    parsons: {
      prompt: 'Xếp cổng hoà trộn: kiểm hệ xương trước, cắt hệ số sau.',
      lines: [
        'if xuong_a != xuong_b:',
        '    print("reject: khac he xuong")',
        'elif he_so < 0:',
        '    print("clamp: he so ve 0")',
        'elif he_so > 100:',
        '    print("clamp: he so ve 1")',
        'else:',
        '    print("allow: tron " + str(he_so) + " phan tram clip B")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng hoà trộn hoạt ảnh. Hệ xương khai báo: {nguoi, nhen, chim}. Đọc `xuong_a:<tên>,xuong_b:<tên>,he_so:<phần trăm nguyên, cho phép âm>`. Thiếu/thừa trường → `invalid: field`; he_so không phải số nguyên → `invalid: he so`; hệ xương ngoài bộ khai báo → `unknown: he xuong chua khai bao`; hai hệ xương khác nhau → `reject: khac he xuong`; he_so < 0 → `clamp: he so ve 0`; he_so > 100 → `clamp: he so ve 1`; còn lại → `allow: tron <he_so> phan tram clip B`. Không engine, không hoạt ảnh thật.',
      starterCode: '# MÔ PHỎNG hoà trộn hoạt ảnh; hệ số theo phần trăm, không có xương thật.\n',
      testCases: [
        {
          stdinLines: ['xuong_a:nguoi,xuong_b:nguoi,he_so:40'],
          expected: 'allow: tron 40 phan tram clip B',
          match: 'contains',
          hidden: false,
          label: 'cùng hệ xương và hệ số trong đoạn thì trộn được',
        },
        {
          stdinLines: ['xuong_a:nguoi,xuong_b:nhen,he_so:40'],
          expected: 'reject: khac he xuong',
          match: 'contains',
          hidden: true,
          label: 'khác hệ xương thì trộn ra khớp ghép nhầm',
        },
        {
          stdinLines: ['xuong_a:chim,xuong_b:chim,he_so:140'],
          expected: 'clamp: he so ve 1',
          match: 'contains',
          hidden: true,
          label: 'hệ số vượt 1 là ngoại suy, bẻ ngược khớp — phải cắt về biên',
        },
        {
          stdinLines: ['xuong_a:rong,xuong_b:rong,he_so:40'],
          expected: 'unknown: he xuong chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'hệ xương lạ là lỗi khai báo, không phải lỗi trộn',
        },
        {
          stdinLines: ['xuong_a:nguoi,xuong_b:nguoi,he_so:bonmuoi'],
          expected: 'invalid: he so',
          match: 'contains',
          hidden: true,
          label: 'ca âm — hệ số sai kiểu fail closed',
        },
      ],
      hints: [
        'Kiểm hệ xương chưa khai báo TRƯỚC khi so hai hệ xương với nhau.',
        'Cắt hệ số rồi nói rõ đã cắt — im lặng sửa số của người gọi là giấu lỗi cấu hình.',
        'Không dùng file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `KHAI_BAO = {"nguoi", "nhen", "chim"}


def so(x):
    lo = x[1:] if x.startswith("-") else x
    return int(x) if lo.isdigit() and lo != "" else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"xuong_a", "xuong_b", "he_so"}:
        print("invalid: field")
    elif so(m["he_so"]) is None:
        print("invalid: he so")
    elif m["xuong_a"] not in KHAI_BAO or m["xuong_b"] not in KHAI_BAO:
        print("unknown: he xuong chua khai bao")
    elif m["xuong_a"] != m["xuong_b"]:
        print("reject: khac he xuong")
    elif so(m["he_so"]) < 0:
        print("clamp: he so ve 0")
    elif so(m["he_so"]) > 100:
        print("clamp: he so ve 1")
    else:
        print("allow: tron " + m["he_so"] + " phan tram clip B")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity dựng cây hoà trộn giữa hoạt ảnh đi và chạy của cùng một nhân vật, điều khiển hệ số bằng tốc độ di chuyển. Quay ba đoạn: hệ số nhảy phắt 0 sang 1, hệ số chuyển mượt, và một lần bạn cố tình đẩy hệ số ra ngoài đoạn [0,1] — mô tả tư thế nhân vật ở lần thứ ba.',
    srsCards: [
      {
        hoi: 'Vì sao chỉ trộn được hoạt ảnh của hai clip cùng hệ xương?',
        dap: 'Phép trộn lấy trung bình theo TỪNG khớp tương ứng; khác hệ xương thì các khớp không tương ứng với nhau, phép tính vẫn chạy nhưng kết quả là các bộ phận bị ghép nhầm chỗ.',
      },
      {
        hoi: 'Hệ số hoà trộn ngoài đoạn [0,1] gây ra chuyện gì?',
        dap: 'Nó biến phép nội suy thành ngoại suy: tư thế bị đẩy vượt quá cả hai clip gốc, khớp bẻ ngược so với giới hạn cơ thể. Cổng phải cắt về biên và nói rõ đã cắt.',
      },
    ],
  },
]
