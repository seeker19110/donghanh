// lessons/p6u243.ts — P6-U243: HƯỚNG GAME, chặng S1 — module `game-s1-m2` (toán cho game:
// vector chuẩn hoá, va chạm AABB và hình tròn, camera nội suy).
//
// Bài 1 lo HƯỚNG ĐI (chuẩn hoá vector trước khi nhân tốc độ — nếu không, đi chéo nhanh hơn đi
// thẳng và cả trò chơi mất cân bằng); bài 2 lo CHẠM NHAU và CAMERA (AABB, hình tròn, hệ số nội
// suy phải nằm trong [0,1]).
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định, số nguyên: không engine, không GPU, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U243_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u243-l1',
    unitId: 'p6-u243',
    language: 'python',
    title: 'MÔ PHỎNG chuẩn hoá vector: vì sao đi chéo không được nhanh hơn đi thẳng',
    hook: 'Bấm hai phím cùng lúc mà nhân vật chạy nhanh hơn 41% là lỗi kinh điển nhất của game 2D — và nó nằm ở đúng một phép chia bị quên.',
    theory:
      'Khi người chơi bấm phải và lên cùng lúc, véc-tơ hướng là (1, 1) — độ dài của nó không phải 1 mà là căn bậc hai của 2, tức khoảng 1,41. Nhân thẳng véc-tơ đó với tốc độ thì nhân vật đi chéo nhanh hơn đi thẳng 41%, và mọi thiết kế màn chơi dựa trên tốc độ đều sai theo. Cách sửa là CHUẨN HOÁ: chia véc-tơ cho độ dài của nó để được một véc-tơ dài đúng 1 rồi mới nhân tốc độ. Một véc-tơ độ dài 0 (không bấm phím nào) không chuẩn hoá được vì phải chia cho 0 — phải trả về `invalid` thay vì để chương trình vỡ. Để so sánh không cần số thực, ta so BÌNH PHƯƠNG độ dài với bình phương tốc độ: hai số nguyên, tất định, không sai số làm tròn. Đây là MÔ PHỎNG hữu hạn trên số nguyên, không engine, không đồ hoạ.',
    workedExample: {
      code: `# MO PHONG kiem chuan hoa bang BINH PHUONG do dai; tat ca la so nguyen.\ndx, dy, speed = 3, 4, 5\nlen2 = dx * dx + dy * dy  # 9 + 16 = 25\nprint("allow: toc do dong deu" if len2 == speed * speed else "deny: toc do lech")`,
      stdinLines: [],
    },
    predict: {
      code: `dx, dy, speed = 5, 5, 5\nlen2 = dx * dx + dy * dy\nprint("deny: di cheo nhanh hon di thang" if len2 > speed * speed else "allow: toc do dong deu")`,
      question:
        'Người chơi bấm hai hướng cùng lúc và mã cộng thẳng 5 vào cả hai trục. MÔ PHỎNG in gì?',
      choices: [
        'deny: di cheo nhanh hon di thang',
        'allow: toc do dong deu',
        'invalid: vector do dai 0',
        'clamp: ve toc do toi da',
      ],
      answerIndex: 0,
      explain:
        'Bình phương độ dài là 25 + 25 = 50, lớn hơn bình phương tốc độ là 25 — nghĩa là bước đi chéo dài hơn bước đi thẳng. Đây chính là lỗi 41% nhìn bằng số nguyên, không cần căn bậc hai.',
    },
    parsons: {
      prompt: 'Xếp cổng kiểm véc-tơ di chuyển: chặn chia cho 0 trước, rồi mới so độ dài.',
      lines: [
        'len2 = dx * dx + dy * dy',
        'if len2 == 0:',
        '    print("invalid: vector do dai 0")',
        'elif len2 > speed * speed:',
        '    print("deny: di cheo nhanh hon di thang")',
        'elif len2 < speed * speed:',
        '    print("deny: di cham hon toc do khai bao")',
        'else:',
        '    print("allow: toc do dong deu")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng kiểm véc-tơ di chuyển. Đọc `dx:<int>,dy:<int>,speed:<int>`. Thiếu/thừa trường → `invalid: field`; dx, dy, speed không phải số nguyên (cho phép âm cho dx/dy) → `invalid: dx` / `invalid: dy` / `invalid: speed`; speed ≤ 0 → `invalid: speed`; dx và dy đều bằng 0 → `invalid: vector do dai 0`. Sau đó so len2 = dx*dx + dy*dy với speed*speed: lớn hơn → `deny: di cheo nhanh hon di thang`; nhỏ hơn → `deny: di cham hon toc do khai bao`; bằng → `allow: toc do dong deu`. Không dùng căn bậc hai, không engine, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG toán véc-tơ; so bình phương độ dài, không cần số thực.\n',
      testCases: [
        {
          stdinLines: ['dx:3,dy:4,speed:5'],
          expected: 'allow: toc do dong deu',
          match: 'contains',
          hidden: false,
          label: 'véc-tơ (3,4) dài đúng 5 — đã chuẩn hoá rồi nhân tốc độ',
        },
        {
          stdinLines: ['dx:5,dy:5,speed:5'],
          expected: 'deny: di cheo nhanh hon di thang',
          match: 'contains',
          hidden: true,
          label: 'lỗi 41%: cộng thẳng cả hai trục mà quên chuẩn hoá',
        },
        {
          stdinLines: ['dx:-5,dy:0,speed:5'],
          expected: 'allow: toc do dong deu',
          match: 'contains',
          hidden: true,
          label: 'đi ngược trục vẫn đúng tốc độ — dấu không đổi độ dài',
        },
        {
          stdinLines: ['dx:0,dy:0,speed:5'],
          expected: 'invalid: vector do dai 0',
          match: 'contains',
          hidden: true,
          label: 'không bấm hướng nào thì không chuẩn hoá được, không được chia cho 0',
        },
        {
          stdinLines: ['dx:3,dy:4,speed:0'],
          expected: 'invalid: speed',
          match: 'contains',
          hidden: true,
          label: 'ca âm — tốc độ không dương fail closed',
        },
      ],
      hints: [
        'Không cần `math.sqrt`: so `dx*dx + dy*dy` với `speed*speed` là đủ và không có sai số.',
        'Kiểm kiểu của cả ba số trước, rồi mới kiểm véc-tơ rỗng, rồi mới so sánh.',
        'Không dùng file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    lo = x[1:] if x.startswith("-") else x
    return int(x) if lo.isdigit() and lo != "" else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"dx", "dy", "speed"}:
        print("invalid: field")
    elif so(m["dx"]) is None:
        print("invalid: dx")
    elif so(m["dy"]) is None:
        print("invalid: dy")
    elif so(m["speed"]) is None or so(m["speed"]) <= 0:
        print("invalid: speed")
    else:
        dx, dy, speed = so(m["dx"]), so(m["dy"]), so(m["speed"])
        len2 = dx * dx + dy * dy
        if len2 == 0:
            print("invalid: vector do dai 0")
        elif len2 > speed * speed:
            print("deny: di cheo nhanh hon di thang")
        elif len2 < speed * speed:
            print("deny: di cham hon toc do khai bao")
        else:
            print("allow: toc do dong deu")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity làm một nhân vật di chuyển tám hướng và đo thật: đặt hai điểm mốc cách nhau đúng 10 mét, chạy thẳng rồi chạy chéo giữa hai mốc và bấm giờ. Nếu thời gian chéo ngắn hơn, tìm đúng dòng thiếu `normalized` và ghi lại hai con số trước–sau khi sửa.',
    srsCards: [
      {
        hoi: 'Vì sao bấm hai hướng cùng lúc lại khiến nhân vật nhanh hơn 41% nếu quên chuẩn hoá?',
        dap: 'Véc-tơ (1,1) có độ dài căn 2 ≈ 1,41 chứ không phải 1; nhân thẳng nó với tốc độ nghĩa là nhân tốc độ với 1,41. Chuẩn hoá chia véc-tơ cho độ dài của chính nó nên hướng nào cũng có độ dài 1 trước khi nhân.',
      },
      {
        hoi: 'Vì sao nên so sánh bình phương độ dài thay vì tính căn bậc hai?',
        dap: 'Căn bậc hai đắt và sinh sai số làm tròn, trong khi so sánh thứ tự không đổi khi bình phương cả hai vế — nên với mọi phép so "xa hơn / gần hơn / đủ nhanh chưa", bình phương vừa nhanh vừa tất định.',
      },
    ],
  },
  {
    id: 'p6-u243-l2',
    unitId: 'p6-u243',
    language: 'python',
    title: 'MÔ PHỎNG va chạm AABB, va chạm hình tròn và hệ số nội suy camera',
    hook: 'Hai hộp chạm nhau khi chúng chồng lấn trên MỌI trục — chỉ cần một trục tách rời là chắc chắn không chạm, và đó là cách kiểm nhanh nhất trong game.',
    theory:
      'AABB (axis-aligned bounding box — hộp bao thẳng trục) là hình học va chạm rẻ nhất: hai hộp chạm nhau khi và chỉ khi chúng chồng lấn trên cả trục ngang lẫn trục dọc. Nếu tìm được một trục mà chúng tách rời thì kết luận `miss` ngay, không cần xét trục còn lại — đó là trục tách. Va chạm hình tròn còn rẻ hơn: hai đường tròn chạm nhau khi bình phương khoảng cách tâm nhỏ hơn hoặc bằng bình phương tổng hai bán kính, lại chỉ toàn số nguyên. Camera thì không dùng va chạm mà dùng nội suy: vị trí mới = vị trí cũ + (mục tiêu − vị trí cũ) × t, với t là hệ số bám trong đoạn [0,1]; t ngoài đoạn đó nghĩa là camera vọt qua mục tiêu hoặc chạy ngược, nên cổng phải `clamp` về biên gần nhất và nói rõ đã cắt. Đây là MÔ PHỎNG hữu hạn trên số nguyên: không engine, không cửa sổ đồ hoạ.',
    workedExample: {
      code: `# MO PHONG AABB: chong lan tren CA HAI truc thi moi cham nhau.\nax, aw, bx, bw = 0, 10, 8, 10\nchong_ngang = ax < bx + bw and bx < ax + aw\nprint("hit: chong lan tren truc ngang" if chong_ngang else "miss: truc ngang tach roi")`,
      stdinLines: [],
    },
    predict: {
      code: `r1, r2, dx, dy = 3, 4, 10, 0\nprint("hit: hai duong tron cham nhau" if dx * dx + dy * dy <= (r1 + r2) ** 2 else "miss: cach nhau qua xa")`,
      question:
        'Hai đường tròn bán kính 3 và 4, tâm cách nhau 10 đơn vị trên trục ngang. MÔ PHỎNG in gì?',
      choices: [
        'miss: cach nhau qua xa',
        'hit: hai duong tron cham nhau',
        'clamp: he so ngoai doan',
        'invalid: ban kinh',
      ],
      answerIndex: 0,
      explain:
        'Bình phương khoảng cách là 100, còn bình phương tổng bán kính là (3+4)² = 49; 100 lớn hơn 49 nên hai đường tròn chưa chạm. Chú ý cả hai vế đều là số nguyên — không cần căn bậc hai nào.',
    },
    parsons: {
      prompt:
        'Xếp kiểm AABB: tìm trục tách trước, chỉ khi không có trục nào tách mới kết luận hit.',
      lines: [
        'if ax + aw <= bx or bx + bw <= ax:',
        '    print("miss: truc ngang tach roi")',
        'elif ay + ah <= by or by + bh <= ay:',
        '    print("miss: truc doc tach roi")',
        'else:',
        '    print("hit: chong lan tren moi truc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng hình học của game. Đọc `loai:<aabb|tron|camera>,a:<int>,b:<int>,c:<int>,d:<int>`. Thiếu/thừa trường → `invalid: field`; loai lạ → `invalid: loai`; a, b, c, d không phải số nguyên (cho phép âm) → `invalid: so`. Với `aabb`: a,b là vị trí trái của hai hộp, c,d là bề rộng (c hoặc d ≤ 0 → `invalid: kich thuoc`); tách rời trên trục ngang → `miss: truc ngang tach roi`, còn lại → `hit: chong lan tren truc ngang`. Với `tron`: a,b là hai bán kính (≤ 0 → `invalid: ban kinh`), c,d là chênh lệch tâm theo hai trục; c*c + d*d ≤ (a+b)² → `hit: hai duong tron cham nhau`, còn lại → `miss: cach nhau qua xa`. Với `camera`: a là hệ số nội suy nhân 100 (tức t = a/100), b,c,d bỏ qua; a < 0 → `clamp: he so ve 0`; a > 100 → `clamp: he so ve 1`; còn lại → `allow: he so bam hop le`. Không engine, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG hình học va chạm và camera; chỉ số nguyên, không căn bậc hai.\n',
      testCases: [
        {
          stdinLines: ['loai:aabb,a:0,b:8,c:10,d:10'],
          expected: 'hit: chong lan tren truc ngang',
          match: 'contains',
          hidden: false,
          label: 'hai hộp chồng lấn hai đơn vị trên trục ngang',
        },
        {
          stdinLines: ['loai:aabb,a:0,b:20,c:10,d:10'],
          expected: 'miss: truc ngang tach roi',
          match: 'contains',
          hidden: true,
          label: 'một trục tách rời là đủ để kết luận không chạm',
        },
        {
          stdinLines: ['loai:tron,a:3,b:4,c:10,d:0'],
          expected: 'miss: cach nhau qua xa',
          match: 'contains',
          hidden: true,
          label: 'khoảng cách tâm lớn hơn tổng bán kính',
        },
        {
          stdinLines: ['loai:camera,a:140,b:0,c:0,d:0'],
          expected: 'clamp: he so ve 1',
          match: 'contains',
          hidden: true,
          label: 'hệ số nội suy vượt 1 bị cắt về biên, camera không vọt qua mục tiêu',
        },
        {
          stdinLines: ['loai:tron,a:0,b:4,c:1,d:1'],
          expected: 'invalid: ban kinh',
          match: 'contains',
          hidden: true,
          label: 'ca âm — bán kính không dương fail closed',
        },
      ],
      hints: [
        'Kiểm kiểu của cả bốn số một lần, trước khi rẽ nhánh theo loai.',
        'AABB: hai hộp TÁCH RỜI khi hộp này kết thúc trước khi hộp kia bắt đầu — viết đúng dấu `<=`.',
        'Camera: cắt về biên rồi nói rõ đã cắt, đừng im lặng sửa số của người gọi.',
      ],
      sampleSolution: `def so(x):
    lo = x[1:] if x.startswith("-") else x
    return int(x) if lo.isdigit() and lo != "" else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"loai", "a", "b", "c", "d"}:
        print("invalid: field")
    elif m["loai"] not in {"aabb", "tron", "camera"}:
        print("invalid: loai")
    elif any(so(m[k]) is None for k in ("a", "b", "c", "d")):
        print("invalid: so")
    else:
        a, b, c, d = so(m["a"]), so(m["b"]), so(m["c"]), so(m["d"])
        if m["loai"] == "aabb":
            if c <= 0 or d <= 0:
                print("invalid: kich thuoc")
            elif a + c <= b or b + d <= a:
                print("miss: truc ngang tach roi")
            else:
                print("hit: chong lan tren truc ngang")
        elif m["loai"] == "tron":
            if a <= 0 or b <= 0:
                print("invalid: ban kinh")
            elif c * c + d * d <= (a + b) * (a + b):
                print("hit: hai duong tron cham nhau")
            else:
                print("miss: cach nhau qua xa")
        elif a < 0:
            print("clamp: he so ve 0")
        elif a > 100:
            print("clamp: he so ve 1")
        else:
            print("allow: he so bam hop le")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity bật hiển thị hình dạng va chạm (collision shapes) rồi quay một đoạn nhân vật đi sát mép nền. Ghi lại một trường hợp hộp bao lệch khỏi hình vẽ khiến người chơi "chạm vào không khí", và một cảnh camera bám bằng hệ số nội suy: thử ba giá trị hệ số và mô tả cảm giác từng giá trị bằng chữ của bạn.',
    srsCards: [
      {
        hoi: 'Vì sao chỉ cần tìm được MỘT trục tách rời là kết luận được hai hộp AABB không chạm nhau?',
        dap: 'Hộp là giao của các khoảng trên từng trục; nếu trên một trục hai khoảng đã rời nhau thì không có điểm nào thuộc cả hai hộp, bất kể trục kia thế nào — nên tìm thấy trục tách là dừng được ngay.',
      },
      {
        hoi: 'Hệ số nội suy của camera ngoài đoạn [0,1] gây ra chuyện gì, và cổng nên xử lý thế nào?',
        dap: 'Lớn hơn 1 thì camera vọt qua mục tiêu rồi giật ngược, nhỏ hơn 0 thì camera chạy ra xa mục tiêu; cổng phải cắt về biên gần nhất và nói rõ đã cắt, để người gọi biết tham số của mình sai chứ không tưởng là camera hỏng.',
      },
    ],
  },
]
