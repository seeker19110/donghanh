// lessons/p6u247.ts — P6-U247: HƯỚNG GAME, chặng S2 — module `game-s2-m2` (vật lý: bước cố
// định tách khỏi bước vẽ, mô phỏng tất định tái lập được).
//
// Bài 1 dạy BỘ TÍCH LUỸ (accumulator): máy nhanh hay chậm đều chạy đúng số bước vật lý như
// nhau. Bài 2 dạy PHÁT LẠI (replay): cùng hạt giống và cùng chuỗi input phải ra cùng hash
// trạng thái cuối — đây là điều kiện để test vật lý và để chơi mạng.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: không engine vật lý thật, không đồng hồ hệ thống, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U247_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u247-l1',
    unitId: 'p6-u247',
    language: 'python',
    title: 'MÔ PHỎNG fixed timestep: số bước vật lý không được phụ thuộc tốc độ máy',
    hook: 'Cú nhảy cao hơn trên máy mạnh là dấu hiệu vật lý đang bị buộc vào tốc độ vẽ — và không có cách sửa nào ngoài tách hai thứ đó ra.',
    theory:
      'Fixed timestep (bước cố định) là luật: mô phỏng vật lý luôn tiến từng bước bằng nhau, ví dụ 20 mili-giây một bước, bất kể máy vẽ được bao nhiêu khung hình. Vòng lặp giữ một bộ tích luỹ (accumulator): mỗi khung hình cộng dt thật vào bộ tích luỹ, rồi chạy bước vật lý liên tục chừng nào bộ tích luỹ còn đủ một bước, phần dư để lại cho khung hình sau. Nhờ đó máy 30 khung hình một giây và máy 120 khung hình một giây chạy đúng bằng số bước vật lý trong cùng một khoảng thời gian, chỉ khác số lần vẽ. Nếu đem dt thật vào thẳng phép tính vật lý thì lực, va chạm và cả thứ tự sự kiện đều lệch theo máy — và không gì tái lập được nữa. Bước cố định phải dương; bước bằng 0 thì vòng lặp chạy vô hạn, nên cổng chặn trước. Đây là MÔ PHỎNG hữu hạn: không engine, không đồng hồ thật, mọi thời gian là mili-giây truyền vào.',
    workedExample: {
      code: `# MO PHONG bo tich luy; buoc co dinh 20ms, khung hinh that keo dai 50ms.\ntich_luy, buoc = 50, 20\nso_buoc = tich_luy // buoc  # 2 buoc, con du 10ms cho khung sau\nprint("allow: chay " + str(so_buoc) + " buoc vat ly, du " + str(tich_luy % buoc) + " ms")`,
      stdinLines: [],
    },
    predict: {
      code: `tich_luy, buoc = 8, 20\nso_buoc = tich_luy // buoc\nprint("allow: chay " + str(so_buoc) + " buoc vat ly, du " + str(tich_luy % buoc) + " ms")`,
      question:
        'Máy rất nhanh nên khung hình chỉ kéo dài 8ms, trong khi bước vật lý là 20ms. MÔ PHỎNG in gì?',
      choices: [
        'allow: chay 0 buoc vat ly, du 8 ms',
        'allow: chay 1 buoc vat ly, du 0 ms',
        'allow: chay 8 buoc vat ly, du 0 ms',
        'invalid: buoc',
      ],
      answerIndex: 0,
      explain:
        'Chưa đủ một bước thì không chạy bước nào — 8ms được giữ lại trong bộ tích luỹ cho khung hình sau. Đây chính là cách máy nhanh vẽ nhiều khung hình hơn mà vật lý vẫn tiến đúng nhịp của nó.',
    },
    parsons: {
      prompt: 'Xếp bước tích luỹ: chặn bước cố định không dương trước, rồi mới chia.',
      lines: [
        'if buoc <= 0:',
        '    print("invalid: buoc co dinh")',
        'elif tich_luy < 0:',
        '    print("invalid: tich luy")',
        'else:',
        '    so_buoc = tich_luy // buoc',
        '    print("allow: chay " + str(so_buoc) + " buoc vat ly, du " + str(tich_luy % buoc) + " ms")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG bộ tích luỹ của vòng lặp fixed timestep. Đọc `tich_luy:<mili-giây>,buoc:<mili-giây>,tran:<int>`. Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên (cho phép âm) → `invalid: so`; buoc ≤ 0 → `invalid: buoc co dinh`; tich_luy < 0 → `invalid: tich luy`; tran ≤ 0 → `invalid: tran`; số bước tính được (tich_luy // buoc) vượt tran → `deny: vong xoay tu than, vuot tran so buoc`; còn lại → `allow: chay <n> buoc vat ly, du <r> ms`. Không đồng hồ thật, không engine, không I/O ngoài.',
      starterCode:
        '# MÔ PHỎNG fixed timestep; mọi thời gian là mili-giây truyền vào, không đọc đồng hồ.\n',
      testCases: [
        {
          stdinLines: ['tich_luy:50,buoc:20,tran:5'],
          expected: 'allow: chay 2 buoc vat ly, du 10 ms',
          match: 'contains',
          hidden: false,
          label: 'khung hình 50ms chạy 2 bước 20ms, giữ lại 10ms cho khung sau',
        },
        {
          stdinLines: ['tich_luy:8,buoc:20,tran:5'],
          expected: 'allow: chay 0 buoc vat ly, du 8 ms',
          match: 'contains',
          hidden: true,
          label: 'máy nhanh: chưa đủ một bước thì không chạy bước nào',
        },
        {
          stdinLines: ['tich_luy:40,buoc:20,tran:5'],
          expected: 'allow: chay 2 buoc vat ly, du 0 ms',
          match: 'contains',
          hidden: true,
          label: 'chia hết thì không còn phần dư',
        },
        {
          stdinLines: ['tich_luy:2000,buoc:20,tran:5'],
          expected: 'deny: vong xoay tu than, vuot tran so buoc',
          match: 'contains',
          hidden: true,
          label: 'máy khựng lâu: chạy bù vô hạn sẽ khựng tiếp, phải có trần',
        },
        {
          stdinLines: ['tich_luy:50,buoc:0,tran:5'],
          expected: 'invalid: buoc co dinh',
          match: 'contains',
          hidden: true,
          label: 'ca âm — bước bằng 0 làm vòng lặp chạy vô hạn, fail closed',
        },
      ],
      hints: [
        'Chia nguyên `//` cho số bước, chia dư `%` cho phần giữ lại — kiểm `buoc > 0` trước cả hai.',
        'Trần số bước không phải trang trí: không có nó thì một lần máy khựng sẽ kéo theo một lần khựng dài hơn.',
        'Không dùng `time`, `datetime.now`, file, socket hay subprocess.',
      ],
      sampleSolution: `KHOA = ("tich_luy", "buoc", "tran")


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
        tl, b, tran = so(m["tich_luy"]), so(m["buoc"]), so(m["tran"])
        if b <= 0:
            print("invalid: buoc co dinh")
        elif tl < 0:
            print("invalid: tich luy")
        elif tran <= 0:
            print("invalid: tran")
        elif tl // b > tran:
            print("deny: vong xoay tu than, vuot tran so buoc")
        else:
            print("allow: chay " + str(tl // b) + " buoc vat ly, du " + str(tl % b) + " ms")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity đặt hai nhân vật giống hệt nhau: một cập nhật vật lý trong hàm vẽ mỗi khung hình, một cập nhật trong hàm bước cố định. Khoá khung hình ở 30 rồi 144 FPS, cho cả hai nhảy từ cùng một điểm và đo độ cao đạt được — nộp bốn con số cùng ảnh chụp màn hình.',
    srsCards: [
      {
        hoi: 'Bộ tích luỹ giải quyết chuyện gì trong vòng lặp fixed timestep?',
        dap: 'Nó gom thời gian thật của các khung hình lại rồi chỉ chạy bước vật lý khi đủ một bước trọn vẹn, phần dư giữ cho khung sau — nhờ vậy máy nhanh hay chậm đều chạy cùng số bước vật lý trong cùng một khoảng thời gian.',
      },
      {
        hoi: 'Vì sao số bước chạy bù trong một khung hình phải có trần?',
        dap: 'Vì sau một lần máy khựng lâu, bộ tích luỹ dồn rất nhiều bước; chạy hết trong một khung hình khiến khung đó còn dài hơn nữa, lại dồn tiếp — vòng xoáy tử thần. Có trần thì trò chơi chậm lại trong chốc lát rồi hồi phục.',
      },
    ],
  },
  {
    id: 'p6-u247-l2',
    unitId: 'p6-u247',
    language: 'python',
    title: 'MÔ PHỎNG phát lại (replay): cùng hạt giống và cùng chuỗi input phải ra cùng hash',
    hook: 'Một trò chơi tái lập được thì mọi lỗi vật lý đều gửi kèm được một tệp replay — còn không thì bạn debug bằng lời kể của người chơi.',
    theory:
      'Mô phỏng tất định nghĩa là: cùng trạng thái đầu (do hạt giống quyết định) cộng cùng chuỗi input thì luôn ra cùng trạng thái cuối, trên mọi máy và mọi lần chạy. Cách kiểm rẻ nhất là băm (hash) trạng thái cuối thành một con số rồi so với con số đã ghi trong tệp replay: khớp là `match`, lệch là `mismatch` — và `mismatch` phải bị coi là lỗi nghiêm trọng chứ không phải nhiễu, vì nó nghĩa là có một nguồn ngẫu nhiên chưa được kiểm soát (thời gian thật, thứ tự duyệt tập hợp, số thực khác nhau giữa máy). Tính tất định là điều kiện tiên quyết của chơi mạng và của test vật lý tự động. Lưu ý kỹ thuật: hàm `hash()` sẵn có của Python trên chuỗi thay đổi giữa các lần chạy, nên bài này tự cuộn một hàm băm số học tất định. Đây là MÔ PHỎNG hữu hạn: không engine, không mạng, không đồng hồ thật.',
    workedExample: {
      code: `# MO PHONG ham bam tat dinh; KHONG dung hash() san co vi no doi giua cac lan chay.\ndef bam(seed, chuoi):\n    h = seed % 9973\n    for c in chuoi:\n        h = (h * 31 + ord(c)) % 9973\n    return h\n\n\nprint("match: hash = " + str(bam(7, "LRLJ")))`,
      stdinLines: [],
    },
    predict: {
      code: `def bam(seed, chuoi):\n    h = seed % 9973\n    for c in chuoi:\n        h = (h * 31 + ord(c)) % 9973\n    return h\n\n\nprint("match: hai luot khop nhau" if bam(7, "LR") == bam(7, "RL") else "mismatch: chuoi input khac nhau")`,
      question: 'Cùng hạt giống 7 nhưng một lượt bấm "LR", lượt kia bấm "RL". MÔ PHỎNG in gì?',
      choices: [
        'mismatch: chuoi input khac nhau',
        'match: hai luot khop nhau',
        'invalid: seed',
        'unknown: chua du du lieu',
      ],
      answerIndex: 0,
      explain:
        'Thứ tự input là một phần của trạng thái: rẽ trái rồi rẽ phải không đưa nhân vật tới cùng chỗ với rẽ phải rồi rẽ trái. Một hàm băm tốt phải phản ánh thứ tự, nếu không nó sẽ báo "khớp" cho hai lượt chơi khác hẳn nhau.',
    },
    parsons: {
      prompt: 'Xếp cổng phát lại: thiếu hạt giống hay chuỗi rỗng thì không kết luận được gì.',
      lines: [
        'if seed is None:',
        '    print("invalid: seed")',
        'elif chuoi == "":',
        '    print("invalid: chuoi input rong")',
        'elif bam(seed, chuoi) == hash_ghi:',
        '    print("match: phat lai khop trang thai cuoi")',
        'else:',
        '    print("mismatch: mo phong khong tat dinh")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng kiểm phát lại. Hàm băm tất định: h = seed % 9973, rồi với từng ký tự c của chuỗi input h = (h * 31 + ord(c)) % 9973. Đọc `seed:<int>,input:<chuỗi chữ cái in hoa>,hash_ghi:<int>`. Thiếu/thừa trường → `invalid: field`; seed không phải số nguyên không âm → `invalid: seed`; hash_ghi không phải số nguyên không âm → `invalid: hash_ghi`; input rỗng → `invalid: chuoi input rong`; input có ký tự ngoài A-Z → `invalid: input`; hash tính được bằng hash_ghi → `match: phat lai khop trang thai cuoi`; còn lại → `mismatch: mo phong khong tat dinh`. Không dùng `hash()` sẵn có, không engine, không mạng.',
      starterCode:
        '# MÔ PHỎNG phát lại; tự cuộn hàm băm vì hash() sẵn có không tất định giữa các lần chạy.\n',
      testCases: [
        {
          stdinLines: ['seed:7,input:LRLJ,hash_ghi:3836'],
          expected: 'match: phat lai khop trang thai cuoi',
          match: 'contains',
          hidden: false,
          label: 'cùng hạt giống và cùng chuỗi input ra đúng hash đã ghi',
        },
        {
          stdinLines: ['seed:7,input:LRLL,hash_ghi:3836'],
          expected: 'mismatch: mo phong khong tat dinh',
          match: 'contains',
          hidden: true,
          label: 'đổi một nút bấm là trạng thái cuối khác, hash phải lệch',
        },
        {
          stdinLines: ['seed:8,input:LRLJ,hash_ghi:3836'],
          expected: 'mismatch: mo phong khong tat dinh',
          match: 'contains',
          hidden: true,
          label: 'đổi hạt giống là đổi trạng thái đầu',
        },
        {
          stdinLines: ['seed:7,input:,hash_ghi:3836'],
          expected: 'invalid: chuoi input rong',
          match: 'contains',
          hidden: true,
          label: 'không có input thì không có gì để phát lại',
        },
        {
          stdinLines: ['seed:bay,input:LRLJ,hash_ghi:3836'],
          expected: 'invalid: seed',
          match: 'contains',
          hidden: true,
          label: 'ca âm — thiếu hạt giống hợp lệ thì fail closed',
        },
      ],
      hints: [
        'Viết hàm băm đúng từng bước đề bài nêu: sai một hằng số là mọi ca đều lệch.',
        'Kiểm kiểu seed và hash_ghi trước khi băm, rồi mới kiểm chuỗi input.',
        'Không dùng `hash()`, `random`, file, socket hay thời gian thực.',
      ],
      sampleSolution: `def bam(seed, chuoi):
    h = seed % 9973
    for c in chuoi:
        h = (h * 31 + ord(c)) % 9973
    return h


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"seed", "input", "hash_ghi"}:
        print("invalid: field")
    elif so(m["seed"]) is None:
        print("invalid: seed")
    elif so(m["hash_ghi"]) is None:
        print("invalid: hash_ghi")
    elif m["input"] == "":
        print("invalid: chuoi input rong")
    elif not m["input"].isupper() or not m["input"].isalpha():
        print("invalid: input")
    elif bam(so(m["seed"]), m["input"]) == so(m["hash_ghi"]):
        print("match: phat lai khop trang thai cuoi")
    else:
        print("mismatch: mo phong khong tat dinh")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong dự án Godot hoặc Unity của bạn ghi lại chuỗi input của một lượt chơi ba mươi giây kèm hạt giống, rồi phát lại nó hai lần và so một con số tóm tắt trạng thái cuối (ví dụ tổng vị trí các thực thể). Nếu hai lần không khớp, đi tìm nguồn ngẫu nhiên chưa kiểm soát — thời gian thật, thứ tự duyệt tập hợp, số thực — và ghi lại thủ phạm bạn tìm ra.',
    srsCards: [
      {
        hoi: 'Vì sao mô phỏng tất định là điều kiện tiên quyết của chơi mạng?',
        dap: 'Nếu mỗi máy chạy cùng input mà ra trạng thái khác nhau thì các máy phải liên tục truyền toàn bộ trạng thái cho nhau; tất định cho phép chỉ truyền input và để mỗi máy tự tính ra cùng một thế giới.',
      },
      {
        hoi: 'Ba nguồn hay phá tính tất định của mô phỏng game là gì?',
        dap: 'Đọc thời gian thật trong mã mô phỏng; duyệt theo thứ tự không xác định của tập hợp hoặc từ điển; và số thực tính khác nhau giữa các máy hay trình biên dịch.',
      },
    ],
  },
]
