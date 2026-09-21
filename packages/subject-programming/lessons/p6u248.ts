// lessons/p6u248.ts — P6-U248: HƯỚNG GAME, chặng S2 — module `game-s2-m3` (AI trong game:
// máy trạng thái và cây hành vi, tìm đường A*, "AI phải vui chứ không cần giỏi").
//
// Bài 1 dạy TẦM QUAN SÁT: kẻ địch chỉ được đọc dữ liệu nó nhìn thấy; đọc vị trí người chơi khi
// bị tường chắn là gian lận, phải chặn. Bài 2 dạy TÌM ĐƯỜNG A* trên lưới, và ca không có đường
// đi phải trả `unreachable` chứ không được để AI đứng rung hay làm sập trò chơi.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định trên lưới nhỏ: không engine, không navmesh thật, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U248_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u248-l1',
    unitId: 'p6-u248',
    language: 'python',
    title: 'MÔ PHỎNG tầm quan sát của kẻ địch: AI đọc dữ liệu nó không nhìn thấy là gian lận',
    hook: 'Người chơi nấp sau tường, và con quái vẫn đi thẳng tới chỗ nấp — không phải vì nó thông minh, mà vì nó đọc trộm biến vị trí.',
    theory:
      'AI trong game phải VUI chứ không cần giỏi, và thứ phá cảm giác vui nhanh nhất là kẻ địch biết những điều nó không thể biết. Vì vậy mã AI không được đọc thẳng trạng thái thế giới; nó chỉ được đọc một bản ghi "tầm quan sát" đã lọc: những gì nằm trong tầm nhìn khai báo và không bị tường chắn. Khi người chơi khuất sau tường, trường vị trí trong bản ghi đó phải trống, và AI phải xoay sang hành vi khác — đi tuần, tới chỗ trông thấy lần cuối — chứ không phải truy đuổi chính xác. Mọi lần AI đòi đọc một trường ngoài tầm quan sát, cổng trả `deny`: fail closed, vì để lọt một lần là người chơi mất lòng tin vào toàn bộ trò chơi. Khoảng cách ở đây so bằng bình phương, số nguyên, tất định. Đây là MÔ PHỎNG hữu hạn: không engine, không hệ thống tầm nhìn thật.',
    workedExample: {
      code: `# MO PHONG tam quan sat; d2 la BINH PHUONG khoang cach, tam2 la binh phuong tam nhin.\nd2, tam2, bi_tuong_chan = 25, 100, 0\nthay = d2 <= tam2 and bi_tuong_chan == 0\nprint("allow: ai doc duoc vi tri" if thay else "deny: doc du lieu ngoai tam quan sat")`,
      stdinLines: [],
    },
    predict: {
      code: `d2, tam2, bi_tuong_chan = 25, 100, 1\nthay = d2 <= tam2 and bi_tuong_chan == 0\nprint("allow: ai doc duoc vi tri" if thay else "deny: doc du lieu ngoai tam quan sat")`,
      question:
        'Người chơi ở rất gần nhưng đang nấp sau tường. Kẻ địch đòi đọc vị trí. MÔ PHỎNG in gì?',
      choices: [
        'deny: doc du lieu ngoai tam quan sat',
        'allow: ai doc duoc vi tri',
        'unreachable: khong co duong di',
        'unknown: chua du du lieu',
      ],
      answerIndex: 0,
      explain:
        'Gần không có nghĩa là thấy: tường chắn tầm nhìn nên bản ghi quan sát không chứa vị trí người chơi. Cho phép đọc ở đây chính là con quái "biết trước" mà người chơi nào cũng nhận ra ngay.',
    },
    parsons: {
      prompt: 'Xếp cổng tầm quan sát: tường chắn thì không cần xét khoảng cách nữa.',
      lines: [
        'if tam2 <= 0:',
        '    print("invalid: tam nhin")',
        'elif bi_tuong_chan == 1:',
        '    print("deny: doc du lieu ngoai tam quan sat")',
        'elif d2 > tam2:',
        '    print("deny: doc du lieu ngoai tam quan sat")',
        'else:',
        '    print("allow: ai doc duoc vi tri")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng tầm quan sát của AI. Đọc `truong:<vitri|mau|noi_thay_lan_cuoi>,d2:<int>,tam2:<int>,tuong:<0|1>`. Thiếu/thừa trường → `invalid: field`; truong lạ → `invalid: truong`; d2 hoặc tam2 không phải số nguyên không âm → `invalid: so`; tam2 ≤ 0 → `invalid: tam nhin`; tuong ngoài {0,1} → `invalid: tuong`. Trường `noi_thay_lan_cuoi` là ký ức riêng của AI nên luôn → `allow: ai doc ky uc cua chinh no`. Với `vitri` và `mau`: tuong = 1 hoặc d2 > tam2 → `deny: doc du lieu ngoai tam quan sat`; còn lại → `allow: ai doc duoc vi tri`. Không engine, không I/O ngoài.',
      starterCode:
        '# MÔ PHỎNG tầm quan sát; AI chỉ đọc bản ghi đã lọc, không đọc thẳng trạng thái thế giới.\n',
      testCases: [
        {
          stdinLines: ['truong:vitri,d2:25,tam2:100,tuong:0'],
          expected: 'allow: ai doc duoc vi tri',
          match: 'contains',
          hidden: false,
          label: 'trong tầm nhìn và không bị chắn thì đọc được',
        },
        {
          stdinLines: ['truong:vitri,d2:25,tam2:100,tuong:1'],
          expected: 'deny: doc du lieu ngoai tam quan sat',
          match: 'contains',
          hidden: true,
          label: 'gần nhưng bị tường chắn — chặn gian lận',
        },
        {
          stdinLines: ['truong:mau,d2:400,tam2:100,tuong:0'],
          expected: 'deny: doc du lieu ngoai tam quan sat',
          match: 'contains',
          hidden: true,
          label: 'ngoài tầm nhìn thì không đọc được cả máu lẫn vị trí',
        },
        {
          stdinLines: ['truong:noi_thay_lan_cuoi,d2:400,tam2:100,tuong:1'],
          expected: 'allow: ai doc ky uc cua chinh no',
          match: 'contains',
          hidden: true,
          label: 'ký ức của chính AI luôn đọc được — đó là cơ sở của hành vi truy tìm',
        },
        {
          stdinLines: ['truong:vitri,d2:25,tam2:0,tuong:0'],
          expected: 'invalid: tam nhin',
          match: 'contains',
          hidden: true,
          label: 'ca âm — tầm nhìn không dương là lỗi cấu hình, fail closed',
        },
      ],
      hints: [
        'So bình phương khoảng cách với bình phương tầm nhìn — không cần căn bậc hai.',
        'Ký ức của AI khác dữ liệu thế giới: một cái nó tự ghi, một cái nó phải nhìn thấy mới được đọc.',
        'Không dùng file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"truong", "d2", "tam2", "tuong"}:
        print("invalid: field")
    elif m["truong"] not in {"vitri", "mau", "noi_thay_lan_cuoi"}:
        print("invalid: truong")
    elif so(m["d2"]) is None or so(m["tam2"]) is None:
        print("invalid: so")
    elif so(m["tam2"]) <= 0:
        print("invalid: tam nhin")
    elif m["tuong"] not in {"0", "1"}:
        print("invalid: tuong")
    elif m["truong"] == "noi_thay_lan_cuoi":
        print("allow: ai doc ky uc cua chinh no")
    elif m["tuong"] == "1" or so(m["d2"]) > so(m["tam2"]):
        print("deny: doc du lieu ngoai tam quan sat")
    else:
        print("allow: ai doc duoc vi tri")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity cho kẻ địch của bạn một vùng phát hiện thật (raycast hoặc vùng nhìn hình quạt) và bắt mọi hành vi đọc vị trí người chơi đi qua vùng đó. Quay lại hai đoạn: trước khi sửa, kẻ địch đuổi qua tường; sau khi sửa, nó đi tới chỗ trông thấy lần cuối rồi mất dấu. Viết ba câu về cảm giác chơi khác nhau thế nào.',
    srsCards: [
      {
        hoi: 'Vì sao AI trong game không nên đọc thẳng trạng thái thế giới mà phải qua bản ghi tầm quan sát?',
        dap: 'Đọc thẳng thì AI biết cả những gì nó không thể thấy, và người chơi nhận ra ngay là mình bị "biết trước"; bản ghi đã lọc buộc AI ứng xử theo đúng thông tin nó có, nhờ đó hành vi mất dấu và truy tìm mới có ý nghĩa.',
      },
      {
        hoi: '"AI phải vui chứ không cần giỏi" nghĩa là gì trong thiết kế kẻ địch?',
        dap: 'Mục tiêu là tạo tình huống thú vị cho người chơi, không phải thắng người chơi: một kẻ địch bắn trăm phát trúng trăm là hoàn hảo về kỹ thuật nhưng khiến trò chơi không chơi được.',
      },
    ],
  },
  {
    id: 'p6-u248-l2',
    unitId: 'p6-u248',
    language: 'python',
    title: 'MÔ PHỎNG tìm đường A* trên lưới: không có đường thì trả unreachable, không được treo',
    hook: 'Tìm đường hỏng ít khi làm game sập — nó làm con quái đứng rung tại chỗ, và người chơi gọi đó là "game lỗi".',
    theory:
      'A* tìm đường ngắn nhất trên lưới bằng cách luôn mở rộng ô có ước lượng tổng chi phí nhỏ nhất: chi phí đã đi cộng chi phí ước lượng còn lại (heuristic). Trên lưới đi bốn hướng, heuristic đúng đắn là khoảng cách Manhattan — tổng chênh lệch hàng và cột — vì nó không bao giờ ước lượng QUÁ chi phí thật, điều kiện để A* vẫn tìm ra đường ngắn nhất. Phần quan trọng nhất của một cài đặt dùng được không phải là tốc độ mà là NHÁNH KHÔNG CÓ ĐƯỜNG: khi đích bị tường bao kín, hàng đợi cạn và hàm phải trả `unreachable` rõ ràng để AI chuyển sang hành vi khác; trả về đường rỗng và để kẻ địch đi theo nó chính là con quái đứng rung tại chỗ. Đích trùng điểm xuất phát là độ dài 0, không phải lỗi. Đây là MÔ PHỎNG hữu hạn trên lưới nhỏ khai báo sẵn: không engine, không navmesh thật.',
    workedExample: {
      code: `# MO PHONG heuristic Manhattan cho luoi di bon huong; khong bao gio uoc luong qua.\nr1, c1, r2, c2 = 0, 0, 2, 3\nprint("allow: uoc luong " + str(abs(r1 - r2) + abs(c1 - c2)) + " buoc")`,
      stdinLines: [],
    },
    predict: {
      code: `luoi = ["..#", "..#", "###"]\ndich_la_tuong = luoi[2][2] == "#"\nprint("unreachable: dich nam tren o tuong" if dich_la_tuong else "allow: co the tim duong")`,
      question: 'Ô đích nằm đúng vào một ô tường trong lưới. MÔ PHỎNG in gì?',
      choices: [
        'unreachable: dich nam tren o tuong',
        'allow: co the tim duong',
        'invalid: toa do',
        'deny: ngoai tam quan sat',
      ],
      answerIndex: 0,
      explain:
        'Đích nằm trên tường thì không có đường nào tới được, và biết điều đó TRƯỚC khi chạy A* tiết kiệm cả một lượt duyệt; quan trọng hơn, nó cho AI một câu trả lời rõ ràng để chuyển sang hành vi khác thay vì đứng yên.',
    },
    parsons: {
      prompt: 'Xếp phần đầu của A*: loại các ca không cần tìm đường trước khi mở hàng đợi.',
      lines: [
        'if not trong_luoi(r1, c1) or not trong_luoi(r2, c2):',
        '    print("invalid: toa do")',
        'elif luoi[r1][c1] == "#" or luoi[r2][c2] == "#":',
        '    print("unreachable: o xuat phat hoac o dich la tuong")',
        'elif (r1, c1) == (r2, c2):',
        '    print("allow: duong dai 0 buoc")',
        'else:',
        '    print(tim_duong(r1, c1, r2, c2))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG A* trên lưới 3×3 khai báo sẵn `["...", ".#.", "..."]` (dấu `#` là tường, đi bốn hướng, mỗi bước chi phí 1). Đọc `r1:<int>,c1:<int>,r2:<int>,c2:<int>`. Thiếu/thừa trường → `invalid: field`; toạ độ không phải số nguyên không âm hoặc nằm ngoài lưới → `invalid: toa do`; ô xuất phát hoặc ô đích là tường → `unreachable: o xuat phat hoac o dich la tuong`; xuất phát trùng đích → `allow: duong dai 0 buoc`; tìm được đường → `allow: duong dai <n> buoc`; không có đường → `unreachable: khong co duong di`. Không engine, không navmesh thật, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG A* trên lưới nhỏ; duyệt theo thứ tự cố định để kết quả tất định.\n',
      testCases: [
        {
          stdinLines: ['r1:0,c1:0,r2:2,c2:2'],
          expected: 'allow: duong dai 4 buoc',
          match: 'contains',
          hidden: false,
          label: 'đi vòng qua tường giữa lưới mất đúng 4 bước',
        },
        {
          stdinLines: ['r1:0,c1:0,r2:0,c2:0'],
          expected: 'allow: duong dai 0 buoc',
          match: 'contains',
          hidden: true,
          label: 'đích trùng xuất phát là 0 bước, không phải lỗi',
        },
        {
          stdinLines: ['r1:0,c1:0,r2:1,c2:1'],
          expected: 'unreachable: o xuat phat hoac o dich la tuong',
          match: 'contains',
          hidden: true,
          label: 'đích nằm trên ô tường thì không có đường',
        },
        {
          stdinLines: ['r1:0,c1:0,r2:0,c2:2'],
          expected: 'allow: duong dai 2 buoc',
          match: 'contains',
          hidden: true,
          label: 'đi thẳng theo hàng trên không bị tường cản',
        },
        {
          stdinLines: ['r1:0,c1:0,r2:3,c2:0'],
          expected: 'invalid: toa do',
          match: 'contains',
          hidden: true,
          label: 'ca âm — toạ độ ngoài lưới fail closed',
        },
      ],
      hints: [
        'Với lưới nhỏ và chi phí mỗi bước bằng nhau, duyệt theo lớp (BFS) cho đúng đường ngắn nhất như A* với heuristic Manhattan.',
        'Duyệt bốn hướng theo một thứ tự CỐ ĐỊNH — thứ tự ngẫu nhiên thì kết quả không tái lập được.',
        'Nhánh không có đường phải in `unreachable`, tuyệt đối không trả đường rỗng.',
      ],
      sampleSolution: `LUOI = ["...", ".#.", "..."]
N = 3


def trong_luoi(r, c):
    return 0 <= r < N and 0 <= c < N


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"r1", "c1", "r2", "c2"}:
        print("invalid: field")
    elif any(so(m[k]) is None for k in ("r1", "c1", "r2", "c2")):
        print("invalid: toa do")
    else:
        r1, c1, r2, c2 = so(m["r1"]), so(m["c1"]), so(m["r2"]), so(m["c2"])
        if not trong_luoi(r1, c1) or not trong_luoi(r2, c2):
            print("invalid: toa do")
        elif LUOI[r1][c1] == "#" or LUOI[r2][c2] == "#":
            print("unreachable: o xuat phat hoac o dich la tuong")
        elif (r1, c1) == (r2, c2):
            print("allow: duong dai 0 buoc")
        else:
            hang_doi = [(r1, c1, 0)]
            da_tham = {(r1, c1)}
            ket_qua = None
            while hang_doi and ket_qua is None:
                r, c, d = hang_doi.pop(0)
                for dr, dc in ((-1, 0), (0, -1), (0, 1), (1, 0)):
                    nr, nc = r + dr, c + dc
                    if not trong_luoi(nr, nc) or LUOI[nr][nc] == "#":
                        continue
                    if (nr, nc) in da_tham:
                        continue
                    if (nr, nc) == (r2, c2):
                        ket_qua = d + 1
                        break
                    da_tham.add((nr, nc))
                    hang_doi.append((nr, nc, d + 1))
            if ket_qua is None:
                print("unreachable: khong co duong di")
            else:
                print("allow: duong dai " + str(ket_qua) + " buoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity dựng một màn có một phòng đóng kín không lối vào, rồi cho kẻ địch nhận lệnh đi tới một điểm bên trong phòng đó. Ghi lại chính xác trò chơi làm gì: nó đứng rung, nó lao vào tường, hay nó báo không tới được rồi đổi hành vi. Sau đó sửa cho nhánh không tìm được đường có hành vi dự phòng rõ ràng và quay lại đoạn sau khi sửa.',
    srsCards: [
      {
        hoi: 'Vì sao heuristic của A* không được ước lượng QUÁ chi phí thật?',
        dap: 'Vì khi ước lượng quá, A* có thể bỏ qua một đường thật sự ngắn hơn do tưởng nó đắt, và kết quả không còn là đường ngắn nhất; khoảng cách Manhattan trên lưới bốn hướng luôn nhỏ hơn hoặc bằng chi phí thật nên an toàn.',
      },
      {
        hoi: 'Nhánh "không tìm được đường" nên trả gì, và vì sao nó quan trọng hơn tốc độ?',
        dap: 'Phải trả một kết quả rõ ràng như `unreachable` để AI chuyển sang hành vi dự phòng; trả đường rỗng thì kẻ địch đứng rung tại chỗ — lỗi mà người chơi thấy ngay, trong khi chậm vài mili-giây thì không ai nhận ra.',
      },
    ],
  },
]
