// lessons/p6u249.ts — P6-U249: HƯỚNG GAME, chặng S2 — module `game-s2-m4` (nội dung và công
// cụ: trình soạn màn chơi, định dạng có phiên bản, sinh nội dung theo thủ tục có hạt giống).
//
// Bài 1 dạy VALIDATOR CỦA CÔNG CỤ: màn chơi thiếu lối đi bị chặn NGAY LÚC LƯU, và tệp phiên bản
// lạ thì fail closed. Bài 2 dạy SINH NỘI DUNG THEO THỦ TỤC dùng `random.Random(seed)` cục bộ —
// cùng hạt giống phải ra cùng kết quả, nếu không thì không ai báo lỗi được một màn chơi.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: không đọc tệp màn chơi thật, không đồng hồ hệ thống, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U249_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u249-l1',
    unitId: 'p6-u249',
    language: 'python',
    title: 'MÔ PHỎNG validator của trình soạn màn chơi: chặn màn không có lối đi ngay lúc lưu',
    hook: 'Một màn chơi không có đường từ điểm vào tới điểm ra chỉ tốn ba giây để phát hiện lúc lưu — hoặc ba tuần nếu để người chơi phát hiện hộ.',
    theory:
      'Công cụ soạn nội dung của chính bạn đáng giá hơn bất kỳ tính năng gameplay nào, vì nó quyết định bạn làm được bao nhiêu màn mỗi tuần. Nhưng công cụ chỉ đáng tin khi nó biết TỪ CHỐI: validator chạy ngay lúc lưu, và màn chơi không có đường từ điểm vào tới điểm ra bị `reject` tại chỗ kèm lý do — chi phí sửa lúc đó gần bằng 0, còn để lọt vào bản build thì người chơi kẹt cứng và bạn mất một bản vá. Định dạng tệp màn chơi cũng phải mang số phiên bản, và tệp có phiên bản không nhận dạng được phải `deny` chứ không đoán: đoán sai cấu trúc là hỏng công sức thiết kế của cả đội. Đây là MÔ PHỎNG hữu hạn trên một mô tả màn chơi tổng hợp: không đọc tệp thật, không mở trình soạn thật.',
    workedExample: {
      code: `# MO PHONG validator; mo ta man choi da duoc tom tat thanh vai co.\nco_loi_di, co_diem_vao, co_diem_ra = 1, 1, 1\nhop_le = co_loi_di == 1 and co_diem_vao == 1 and co_diem_ra == 1\nprint("allow: luu man choi" if hop_le else "reject: man choi khong hop le")`,
      stdinLines: [],
    },
    predict: {
      code: `co_loi_di = 0\nprint("reject: khong co duong tu diem vao toi diem ra" if co_loi_di == 0 else "allow: luu man choi")`,
      question: 'Người thiết kế bấm lưu một màn mà mọi lối đi đều bị tường chặn. MÔ PHỎNG in gì?',
      choices: [
        'reject: khong co duong tu diem vao toi diem ra',
        'allow: luu man choi',
        'deny: phien ban khong nhan dang duoc',
        'unknown: chua du du lieu',
      ],
      answerIndex: 0,
      explain:
        'Validator chặn ngay lúc lưu nên người thiết kế sửa trong vài giây, khi họ còn nhớ mình vừa đặt gì ở đâu; để lọt thì lỗi này chỉ lộ ra ở bản build, lúc chi phí sửa đắt gấp hàng chục lần.',
    },
    parsons: {
      prompt: 'Xếp validator lúc lưu: kiểm phiên bản tệp trước, rồi mới kiểm nội dung màn chơi.',
      lines: [
        'if ver not in PHIEN_BAN_HO_TRO:',
        '    print("deny: phien ban khong nhan dang duoc")',
        'elif co_diem_vao == 0 or co_diem_ra == 0:',
        '    print("reject: thieu diem vao hoac diem ra")',
        'elif co_loi_di == 0:',
        '    print("reject: khong co duong tu diem vao toi diem ra")',
        'else:',
        '    print("allow: luu man choi")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG validator của trình soạn màn chơi. Phiên bản định dạng được hỗ trợ: 1, 2, 3. Đọc `ver:<int>,diem_vao:<0|1>,diem_ra:<0|1>,loi_di:<0|1>`. Thiếu/thừa trường → `invalid: field`; ver không phải số nguyên dương → `invalid: ver`; ba trường cờ ngoài {0,1} → `invalid: co`; ver ngoài tập hỗ trợ → `deny: phien ban khong nhan dang duoc`; thiếu điểm vào hoặc điểm ra → `reject: thieu diem vao hoac diem ra`; không có lối đi → `reject: khong co duong tu diem vao toi diem ra`; còn lại → `allow: luu man choi`. Không đọc tệp thật, không mở trình soạn thật.',
      starterCode: '# MÔ PHỎNG validator lúc lưu; chỉ tính trên mô tả tóm tắt, không chạm tệp.\n',
      testCases: [
        {
          stdinLines: ['ver:2,diem_vao:1,diem_ra:1,loi_di:1'],
          expected: 'allow: luu man choi',
          match: 'contains',
          hidden: false,
          label: 'màn đủ điểm vào, điểm ra và có lối đi thì lưu được',
        },
        {
          stdinLines: ['ver:2,diem_vao:1,diem_ra:1,loi_di:0'],
          expected: 'reject: khong co duong tu diem vao toi diem ra',
          match: 'contains',
          hidden: true,
          label: 'màn kẹt cứng bị chặn ngay lúc lưu',
        },
        {
          stdinLines: ['ver:2,diem_vao:1,diem_ra:0,loi_di:1'],
          expected: 'reject: thieu diem vao hoac diem ra',
          match: 'contains',
          hidden: true,
          label: 'thiếu điểm ra thì không có gì để kiểm lối đi',
        },
        {
          stdinLines: ['ver:9,diem_vao:1,diem_ra:1,loi_di:1'],
          expected: 'deny: phien ban khong nhan dang duoc',
          match: 'contains',
          hidden: true,
          label: 'phiên bản định dạng lạ thì fail closed, không đoán cấu trúc',
        },
        {
          stdinLines: ['ver:2,diem_vao:2,diem_ra:1,loi_di:1'],
          expected: 'invalid: co',
          match: 'contains',
          hidden: true,
          label: 'ca âm — cờ ngoài {0,1} fail closed',
        },
      ],
      hints: [
        'Kiểm phiên bản định dạng trước nội dung: đọc sai cấu trúc thì mọi kết luận sau đều vô nghĩa.',
        'Tập phiên bản hỗ trợ viết thành dữ liệu để thêm phiên bản chỉ là thêm một phần tử.',
        'Không dùng `open(`, file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `HO_TRO = {1, 2, 3}
CO = ("diem_vao", "diem_ra", "loi_di")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"ver", *CO}:
        print("invalid: field")
    elif so(m["ver"]) is None or so(m["ver"]) <= 0:
        print("invalid: ver")
    elif any(m[k] not in {"0", "1"} for k in CO):
        print("invalid: co")
    elif so(m["ver"]) not in HO_TRO:
        print("deny: phien ban khong nhan dang duoc")
    elif m["diem_vao"] == "0" or m["diem_ra"] == "0":
        print("reject: thieu diem vao hoac diem ra")
    elif m["loi_di"] == "0":
        print("reject: khong co duong tu diem vao toi diem ra")
    else:
        print("allow: luu man choi")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, thêm vào trình soạn màn chơi của bạn trong Godot hoặc Unity một bước kiểm lúc lưu: tìm đường từ điểm vào tới điểm ra, không có thì hiện cảnh báo và không cho lưu. Thử cố tình tạo ba màn hỏng khác nhau, chụp màn hình cảnh báo từng màn, rồi đo xem bạn mất bao lâu để sửa mỗi màn — so với lần gần nhất bạn phát hiện lỗi màn chơi sau khi đã đóng gói.',
    srsCards: [
      {
        hoi: 'Vì sao validator màn chơi phải chạy lúc LƯU chứ không phải lúc tải màn vào trò chơi?',
        dap: 'Lúc lưu, người thiết kế còn đang ở trong ngữ cảnh và sửa mất vài giây; lúc tải thì lỗi đã đi theo tệp vào bản build, người phát hiện thường là người chơi, và chi phí là một bản vá.',
      },
      {
        hoi: 'Vì sao tệp màn chơi có phiên bản lạ phải `deny` thay vì cố đọc phần hiểu được?',
        dap: 'Cấu trúc chưa biết thì mọi cách hiểu đều là đoán; đoán sai rồi lưu đè sẽ phá công sức thiết kế của cả đội, còn từ chối chỉ khiến người dùng phải cập nhật công cụ.',
      },
    ],
  },
  {
    id: 'p6-u249-l2',
    unitId: 'p6-u249',
    language: 'python',
    title: 'MÔ PHỎNG sinh nội dung theo thủ tục: cùng hạt giống thì phải ra cùng một màn chơi',
    hook: 'Người chơi báo "màn 47 bị kẹt" — nếu hạt giống không tái lập được, câu báo lỗi đó hoàn toàn vô dụng.',
    theory:
      'Sinh nội dung theo thủ tục chỉ dùng được khi nó TÁI LẬP ĐƯỢC: cùng một hạt giống (seed) phải cho cùng một màn chơi, trên mọi máy và mọi lần chạy. Muốn vậy, mọi phép ngẫu nhiên phải đi qua một bộ sinh CỤC BỘ tạo từ hạt giống — trong Python là `random.Random(seed)` — chứ không được dùng bộ sinh toàn cục dùng chung, vì bất kỳ đoạn mã nào khác rút số từ bộ sinh ấy cũng làm lệch toàn bộ chuỗi sau đó. Có tái lập, người chơi gửi bạn một hạt giống là bạn dựng lại đúng màn chơi họ gặp; không có tái lập, bạn chỉ còn lời kể. Cổng ở bài này so hai lượt sinh cùng hạt giống: giống nhau là `match`, khác nhau là `mismatch` và phải coi là lỗi. Đây là MÔ PHỎNG hữu hạn: không đọc tệp, không mạng, không đồng hồ hệ thống.',
    workedExample: {
      code: `import random\n\n# MO PHONG sinh noi dung; bo sinh CUC BO tu hat giong, khong dung bo sinh toan cuc.\nbo_sinh = random.Random(42)\nman = [bo_sinh.randrange(9) for _ in range(4)]\nprint("allow: man sinh tu hat giong 42 = " + str(man))`,
      stdinLines: [],
    },
    predict: {
      code: `import random\n\na = [random.Random(7).randrange(9) for _ in range(3)]\nb = [random.Random(7).randrange(9) for _ in range(3)]\nprint("match: hai luot giong het nhau" if a == b else "mismatch: sinh noi dung khong tai lap duoc")`,
      question: 'Hai lượt sinh đều tạo bộ sinh cục bộ từ cùng hạt giống 7. MÔ PHỎNG in gì?',
      choices: [
        'match: hai luot giong het nhau',
        'mismatch: sinh noi dung khong tai lap duoc',
        'invalid: seed',
        'unknown: chua du du lieu',
      ],
      answerIndex: 0,
      explain:
        'Bộ sinh cục bộ khởi tạo lại từ cùng hạt giống thì cho đúng cùng chuỗi số — đó là điều khiến một hạt giống trở thành cách gọi tên một màn chơi cụ thể, chia sẻ được giữa người chơi và người làm game.',
    },
    parsons: {
      prompt: 'Xếp cổng tái lập: hạt giống hỏng thì chưa sinh gì cả, đừng sinh rồi mới kiểm.',
      lines: [
        'if seed is None:',
        '    print("invalid: seed")',
        'elif so_o <= 0:',
        '    print("invalid: so o")',
        'elif sinh(seed, so_o) == sinh(seed, so_o):',
        '    print("match: cung hat giong cho cung man choi")',
        'else:',
        '    print("mismatch: sinh noi dung khong tai lap duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng tái lập của bộ sinh nội dung. Sinh một màn bằng `random.Random(seed)` rồi lấy `so_o` số trong khoảng 0–8 bằng `randrange(9)`. Đọc `seed_a:<int>,seed_b:<int>,so_o:<int>`. Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên không âm → `invalid: seed`; so_o ≤ 0 hoặc > 20 → `invalid: so o`; hai lượt sinh cho cùng dãy → `match: cung hat giong cho cung man choi`; khác dãy → `mismatch: hat giong khac cho man khac`. Chỉ dùng bộ sinh CỤC BỘ `random.Random(seed)`; cấm `random.seed()` và `random.random()` toàn cục, cấm file, mạng và đồng hồ hệ thống.',
      starterCode:
        '# MÔ PHỎNG sinh nội dung theo thủ tục; bộ sinh cục bộ truyền tường minh, không dùng toàn cục.\nimport random\n',
      testCases: [
        {
          stdinLines: ['seed_a:7,seed_b:7,so_o:5'],
          expected: 'match: cung hat giong cho cung man choi',
          match: 'contains',
          hidden: false,
          label: 'cùng hạt giống thì tái lập đúng màn chơi',
        },
        {
          stdinLines: ['seed_a:7,seed_b:8,so_o:5'],
          expected: 'mismatch: hat giong khac cho man khac',
          match: 'contains',
          hidden: true,
          label: 'hạt giống khác thì màn khác — đó là mục đích của hạt giống',
        },
        {
          stdinLines: ['seed_a:0,seed_b:0,so_o:1'],
          expected: 'match: cung hat giong cho cung man choi',
          match: 'contains',
          hidden: true,
          label: 'hạt giống 0 là hạt giống hợp lệ, không phải "chưa đặt"',
        },
        {
          stdinLines: ['seed_a:7,seed_b:7,so_o:25'],
          expected: 'invalid: so o',
          match: 'contains',
          hidden: true,
          label: 'kích thước màn vượt trần khai báo thì chặn trước khi sinh',
        },
        {
          stdinLines: ['seed_a:7,seed_b:bay,so_o:5'],
          expected: 'invalid: seed',
          match: 'contains',
          hidden: true,
          label: 'ca âm — hạt giống sai kiểu fail closed',
        },
      ],
      hints: [
        'Tạo `random.Random(seed)` MỚI cho mỗi lượt sinh — dùng lại một bộ sinh đã rút số sẽ cho chuỗi khác.',
        'Kiểm cả hai hạt giống và kích thước trước khi sinh bất cứ thứ gì.',
        'Tuyệt đối không dùng `random.seed(...)` hay `random.random()` toàn cục.',
      ],
      sampleSolution: `import random


def sinh(seed, so_o):
    bo_sinh = random.Random(seed)
    return [bo_sinh.randrange(9) for _ in range(so_o)]


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"seed_a", "seed_b", "so_o"}:
        print("invalid: field")
    elif so(m["seed_a"]) is None or so(m["seed_b"]) is None:
        print("invalid: seed")
    elif so(m["so_o"]) is None or so(m["so_o"]) <= 0 or so(m["so_o"]) > 20:
        print("invalid: so o")
    elif sinh(so(m["seed_a"]), so(m["so_o"])) == sinh(so(m["seed_b"]), so(m["so_o"])):
        print("match: cung hat giong cho cung man choi")
    else:
        print("mismatch: hat giong khac cho man khac")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong dự án Godot hoặc Unity của bạn đưa hạt giống của bộ sinh màn chơi lên màn hình tạm dừng và cho phép nhập lại một hạt giống. Nhờ một người chơi thử ghi lại hạt giống của màn họ thấy khó nhất, rồi dựng lại đúng màn đó trên máy bạn — nộp ảnh chụp hai màn hình giống nhau ở hai máy khác nhau.',
    srsCards: [
      {
        hoi: 'Vì sao sinh nội dung theo thủ tục phải dùng bộ sinh cục bộ thay vì bộ sinh ngẫu nhiên toàn cục?',
        dap: 'Bộ sinh toàn cục dùng chung với mọi đoạn mã khác, nên chỉ cần một chỗ khác rút thêm một số là cả chuỗi sau đó lệch và màn chơi không dựng lại được; bộ sinh cục bộ tạo từ hạt giống chỉ phục vụ đúng việc sinh màn đó.',
      },
      {
        hoi: 'Tái lập được từ hạt giống đem lại lợi ích gì khi xử lý báo lỗi của người chơi?',
        dap: 'Người chơi chỉ cần gửi hạt giống là bạn dựng lại đúng màn họ gặp và nhìn thấy tận mắt vấn đề; không tái lập được thì bạn chỉ có lời kể, và hầu hết lỗi loại này không bao giờ sửa được.',
      },
    ],
  },
]
