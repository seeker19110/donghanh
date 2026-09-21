// lessons/p6u210.ts — P6-U210: HƯỚNG BẢO MẬT, chặng S3 — module `security-s3-m1` (đọc luồng
// điều khiển từ mã mức thấp).
//
// Ranh giới cứng của cả chặng (đặc tả `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`):
// dạy VÌ SAO lỗ hổng tồn tại và CÁCH PHÁT HIỆN, tuyệt đối không cung cấp công cụ khai thác.
// Vì thế máy ảo ở đây là MÁY ĐỒ CHƠI do chính đặc tả định nghĩa (12 lệnh, không con trỏ thô,
// không địa chỉ tuyệt đối), KHÔNG phải một tập lệnh có thật — người học luyện đúng kỹ năng cần
// có (đọc luồng điều khiển từ mã mức thấp) mà bài không trở thành bảng tra lệnh của máy thật.
//
// Bài 1: dựng đồ thị luồng điều khiển và tìm khối không bao giờ tới được.
// Bài 2: chạy máy đồ chơi có trần bước để phát hiện vòng lặp không có lối thoát.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U210_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u210-l1',
    unitId: 'p6-u210',
    language: 'python',
    title: 'MÔ PHỎNG dựng đồ thị luồng điều khiển (control flow) và tìm khối không tới được',
    hook: 'Mã mức thấp không có vòng lặp và câu điều kiện — chỉ có những cú nhảy; công việc của người đọc là dựng lại cấu trúc đã bị xoá.',
    theory:
      'Khối cơ bản (basic block) là một dãy lệnh chạy thẳng từ đầu tới cuối, không có lối vào giữa chừng và không có lối ra trước khi hết. Nối các khối bằng những cú nhảy thì được đồ thị luồng điều khiển (control flow graph) — thứ cho phép nhận ra "đây là một câu điều kiện", "đây là một vòng lặp", dù trong mã chỉ toàn lệnh nhảy theo chỉ số.\nKhối không bao giờ tới được (unreachable) là tín hiệu đáng ngờ theo cả hai hướng: hoặc lập trình viên tưởng nhánh đó đang chạy mà thực ra không, hoặc có mã nằm đó mà không ai định chạy. Cả hai đều là thứ cần phát hiện. Mục đích phòng thủ của bài: đọc được luồng điều khiển thì mới thẩm định được một quyết định kiến trúc về ngôn ngữ và trình biên dịch, thay vì tin theo lời người khác.\nMáy trong bài là MÁY ĐỒ CHƠI 13 lệnh do đặc tả bài định nghĩa (`PUSH n` · `POP` · `ADD` · `SUB` · `LOAD s` · `STORE s` · `CMP` · `JMP i` · `JZ i` · `JNZ i` · `CALL i` · `RET` · `HALT`), không có con trỏ thô và không có địa chỉ tuyệt đối — cố ý như vậy. Ngoài đời có những công cụ cùng loại làm việc này trên phần mềm thật; bài này không hướng dẫn thao tác với chúng và không đụng tới bất kỳ chương trình nào đang chạy.',
    workedExample: {
      code: `# MO PHONG: JMP 2 nhay qua lenh so 1, nen khoi bat dau tai 1 khong bao gio toi duoc.\nma = ["JMP 2", "PUSH 5", "HALT"]\ntoi = {0, 2}\nprint("unreachable: khoi bat dau tai 1" if 1 not in toi else "ok: moi basic block deu toi duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `ma = ["PUSH 1", "JZ 3", "PUSH 2", "HALT"]\ntoi = {0, 1, 2, 3}\nngoai = [i for i in range(len(ma)) if i not in toi]\nprint("ok: moi basic block deu toi duoc" if not ngoai else "unreachable: khoi bat dau tai " + str(ngoai[0]))`,
      question:
        '`JZ 3` nhảy có điều kiện, nên cả nhánh rơi xuống lẫn nhánh nhảy đều tới được. In gì?',
      choices: [
        'ok: moi basic block deu toi duoc',
        'unreachable: khoi bat dau tai 2',
        'unreachable: khoi bat dau tai 3',
        'no-exit: vong lap khong co loi thoat',
      ],
      answerIndex: 0,
      explain:
        'Nhảy CÓ ĐIỀU KIỆN sinh hai cạnh: một tới đích, một tới lệnh kế tiếp — khác hẳn `JMP` vốn chỉ sinh một cạnh và vì thế mới làm lệnh kế tiếp thành khối chết.',
    },
    parsons: {
      prompt: 'Xếp phần duyệt đồ thị: đánh dấu đã tới, rồi thêm cạnh theo đúng loại lệnh.',
      lines: [
        'while hang:',
        '    i = hang.pop()',
        '    if i in toi or i >= len(ma):',
        '        continue',
        '    toi.add(i)',
        '    if ma[i][0] == "JMP":',
        '        hang.append(int(ma[i][1]))',
        '    else:',
        '        hang.append(i + 1)',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG bộ dựng đồ thị luồng điều khiển (control flow) cho MÁY ĐỒ CHƠI 13 lệnh. Đọc một dòng `prog:<các lệnh cách nhau bằng dấu chấm phẩy>`, mỗi lệnh dạng `OP` hoặc `OP arg`. Thiếu/thừa trường → `invalid: field`; lệnh ngoài tập `PUSH POP ADD SUB LOAD STORE CMP JMP JZ JNZ CALL RET HALT` → `invalid: lenh la`; lệnh nhảy (`JMP`/`JZ`/`JNZ`/`CALL`) thiếu đối số, đối số không phải số hoặc trỏ ra ngoài chương trình → `invalid: dich nhay ngoai pham vi`. Sau đó duyệt từ lệnh 0: `JMP` chỉ đi tới đích; `JZ`/`JNZ`/`CALL` đi tới cả đích lẫn lệnh kế tiếp; `HALT`/`RET` dừng nhánh; lệnh khác đi tới lệnh kế tiếp. Có chỉ số nào không tới được → `unreachable: khoi bat dau tai <chỉ số nhỏ nhất>`; còn lại → `ok: moi basic block deu toi duoc`. Không đọc file, không chạy chương trình thật.',
      starterCode: '# MÔ PHỎNG đồ thị luồng điều khiển của máy đồ chơi; chỉ tính trên dòng nhập.\n',
      testCases: [
        {
          stdinLines: ['prog:PUSH 1;JZ 3;PUSH 2;HALT'],
          expected: 'ok: moi basic block deu toi duoc',
          match: 'contains',
          hidden: false,
          label: 'nhảy có điều kiện giữ cả hai nhánh sống',
        },
        {
          stdinLines: ['prog:JMP 2;PUSH 5;HALT'],
          expected: 'unreachable: khoi bat dau tai 1',
          match: 'contains',
          hidden: true,
          label: 'nhảy không điều kiện làm lệnh kế tiếp thành khối chết',
        },
        {
          stdinLines: ['prog:PUSH 1;HALT'],
          expected: 'ok: moi basic block deu toi duoc',
          match: 'contains',
          hidden: true,
          label: 'chương trình thẳng không có khối chết',
        },
        {
          stdinLines: ['prog:JMP 7;HALT'],
          expected: 'invalid: dich nhay ngoai pham vi',
          match: 'contains',
          hidden: true,
          label: 'đích nhảy ra ngoài chương trình bị chặn',
        },
        {
          stdinLines: ['prog:FLY 1;HALT'],
          expected: 'invalid: lenh la',
          match: 'contains',
          hidden: true,
          label: 'ca âm — lệnh ngoài tập lệnh đồ chơi fail closed',
        },
      ],
      hints: [
        'Đọc và kiểm TOÀN BỘ chương trình trước khi duyệt: lệnh lạ và đích nhảy hỏng phải ra invalid, không phải unreachable.',
        'Dùng một tập "đã tới" và một hàng đợi chỉ số; bỏ qua chỉ số đã tới để vòng lặp luôn dừng.',
        'Chỉ số bằng đúng độ dài chương trình là "rơi ra khỏi cuối" — bỏ qua nó thay vì báo lỗi.',
      ],
      sampleSolution: `OPS = {"PUSH", "POP", "ADD", "SUB", "LOAD", "STORE", "CMP",
       "JMP", "JZ", "JNZ", "CALL", "RET", "HALT"}
NHAY = {"JMP", "JZ", "JNZ", "CALL"}


def phan_tich(prog):
    ma = []
    for x in prog.split(";"):
        p = x.split()
        if not p or p[0] not in OPS:
            return "invalid: lenh la"
        ma.append(p)
    for p in ma:
        if p[0] in NHAY and (len(p) != 2 or not p[1].isdigit() or int(p[1]) >= len(ma)):
            return "invalid: dich nhay ngoai pham vi"
    toi, hang = set(), [0]
    while hang:
        i = hang.pop()
        if i in toi or i >= len(ma):
            continue
        toi.add(i)
        op = ma[i][0]
        if op in {"HALT", "RET"}:
            continue
        if op == "JMP":
            hang.append(int(ma[i][1]))
            continue
        if op in {"JZ", "JNZ", "CALL"}:
            hang.append(int(ma[i][1]))
        hang.append(i + 1)
    ngoai = [i for i in range(len(ma)) if i not in toi]
    if ngoai:
        return "unreachable: khoi bat dau tai " + str(ngoai[0])
    return "ok: moi basic block deu toi duoc"


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    print(phan_tich(m["prog"]) if set(m) == {"prog"} else "invalid: field")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một hàm khoảng 30 dòng trong mã bạn đang làm và vẽ tay đồ thị luồng điều khiển của nó: mỗi khối một ô, mỗi rẽ nhánh một mũi tên; rồi tìm xem có ô nào không có mũi tên nào trỏ tới — đó là nhánh bạn tưởng đang chạy mà thật ra không.',
    srsCards: [
      {
        hoi: 'Khối cơ bản (basic block) được định nghĩa bằng hai điều kiện nào?',
        dap: 'Không có lối vào ở giữa chừng và không có lối ra trước khi hết: đã bước vào lệnh đầu thì chắc chắn chạy hết dãy, nên cả khối coi như một nút của đồ thị.',
      },
      {
        hoi: 'Vì sao nhảy có điều kiện sinh hai cạnh còn nhảy không điều kiện chỉ sinh một?',
        dap: 'Vì nhảy có điều kiện có thể không nhảy và rơi xuống lệnh kế tiếp, nên cả hai đường đều tới được; nhảy không điều kiện thì luôn đi, khiến lệnh kế tiếp mất mọi lối vào.',
      },
    ],
  },
  {
    id: 'p6-u210-l2',
    unitId: 'p6-u210',
    language: 'python',
    title: 'MÔ PHỎNG chạy máy đồ chơi có trần bước: phát hiện vòng lặp không có lối thoát',
    hook: 'Một chương trình không dừng và một chương trình chạy rất lâu nhìn giống hệt nhau — trừ khi bạn đặt sẵn một trần và gọi tên trạng thái đó.',
    theory:
      'Đọc tĩnh đồ thị luồng điều khiển cho biết cấu trúc, nhưng có câu hỏi chỉ chạy mới trả lời được: chương trình này có dừng không. Mọi bộ phân tích thực dụng đều giải quyết bằng cùng một cách — đặt TRẦN số bước, chạy tới trần thì dừng có kiểm soát và báo rõ `no-exit`, chứ không treo và cũng không nói dối rằng "không có vấn đề".\nĐó là luật thiết kế quan trọng hơn cả bài tập này: một công cụ phân tích hết ngân sách phải nói "tôi chưa kết luận được", không được im lặng trả về kết quả sạch. Mục đích phòng thủ: người đọc báo cáo phải phân biệt được "đã kiểm và không thấy gì" với "chưa kiểm xong". MÔ PHỎNG chạy trên máy đồ chơi 13 lệnh đã định nghĩa ở bài trước, không có con trỏ thô, không đụng chương trình thật, không I/O ngoài.',
    workedExample: {
      code: `# MO PHONG tran buoc: chay toi tran thi dung co kiem soat, khong treo.\nbuoc, tran = 200, 200\nprint("no-exit: vuot tran buoc thuc thi" if buoc >= tran else "ok: dung tai halt sau " + str(buoc) + " buoc")`,
      stdinLines: [],
    },
    predict: {
      code: `ngan = []\nprint("invalid: ngan xep rong" if not ngan else "ok: dung tai halt sau 1 buoc")`,
      question: 'Lệnh `POP` gặp ngăn xếp rỗng. Máy MÔ PHỎNG in gì?',
      choices: [
        'invalid: ngan xep rong',
        'ok: dung tai halt sau 1 buoc',
        'no-exit: vuot tran buoc thuc thi',
        'unreachable: khoi bat dau tai 0',
      ],
      answerIndex: 0,
      explain:
        'Máy fail closed: trạng thái không hợp lệ được gọi tên ngay thay vì bỏ qua — bỏ qua là cách một bộ mô phỏng tự sinh ra kết quả không có thật cho phần còn lại của chương trình.',
    },
    parsons: {
      prompt: 'Xếp vòng chạy: kiểm trần TRƯỚC khi thực hiện lệnh, rồi mới tăng bước.',
      lines: [
        'while True:',
        '    if ip >= len(ma):',
        '        return "invalid: chay qua cuoi chuong trinh"',
        '    if buoc >= TRAN:',
        '        return "no-exit: vuot tran buoc thuc thi"',
        '    buoc += 1',
        '    if ma[ip][0] == "HALT":',
        '        return "ok: dung tai halt sau " + str(buoc) + " buoc"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG máy đồ chơi 13 lệnh có TRẦN 200 bước. Đọc `prog:<các lệnh cách nhau bằng dấu chấm phẩy>`. Kiểm như bài trước: lệnh lạ → `invalid: lenh la`; đích nhảy hỏng → `invalid: dich nhay ngoai pham vi`. Rồi chạy từ lệnh 0 với ngăn xếp giá trị và bảng biến theo tên: `PUSH n` đẩy số; `POP` bỏ đỉnh; `ADD`/`SUB`/`CMP` lấy hai giá trị rồi đẩy `a+b` (ADD) hoặc `a-b` (SUB và CMP); `LOAD s` đẩy giá trị biến (mặc định 0); `STORE s` lấy đỉnh gán vào biến; `JMP i` nhảy; `JZ i`/`JNZ i` lấy đỉnh rồi nhảy khi bằng 0 / khác 0; `CALL i` nhớ chỗ quay về rồi nhảy; `RET` quay về; `HALT` dừng. Ngăn xếp thiếu giá trị → `invalid: ngan xep rong`; `RET` không có chỗ quay về → `invalid: ret khong co khung goi`; chạy quá cuối chương trình → `invalid: chay qua cuoi chuong trinh`; đủ 200 bước mà chưa dừng → `no-exit: vuot tran buoc thuc thi`; gặp HALT → `ok: dung tai halt sau <số bước> buoc`. Không treo, không ném lỗi ra ngoài.',
      starterCode: '# MÔ PHỎNG máy đồ chơi có trần bước; không chạm chương trình thật.\n',
      testCases: [
        {
          stdinLines: ['prog:PUSH 0;JZ 3;PUSH 9;HALT'],
          expected: 'ok: dung tai halt sau 3 buoc',
          match: 'contains',
          hidden: false,
          label: 'nhảy khi đỉnh bằng 0, dừng sau 3 bước',
        },
        {
          stdinLines: ['prog:PUSH 4;PUSH 4;CMP;JZ 5;PUSH 1;HALT'],
          expected: 'ok: dung tai halt sau 5 buoc',
          match: 'contains',
          hidden: true,
          label: 'CMP hai giá trị bằng nhau cho 0 nên JZ nhảy tới HALT',
        },
        {
          stdinLines: ['prog:PUSH 1;JMP 0'],
          expected: 'no-exit: vuot tran buoc thuc thi',
          match: 'contains',
          hidden: true,
          label: 'vòng lặp không có lối thoát bị dừng có kiểm soát',
        },
        {
          stdinLines: ['prog:POP;HALT'],
          expected: 'invalid: ngan xep rong',
          match: 'contains',
          hidden: true,
          label: 'lấy từ ngăn xếp rỗng là trạng thái không hợp lệ',
        },
        {
          stdinLines: ['prog:JMP 9;HALT'],
          expected: 'invalid: dich nhay ngoai pham vi',
          match: 'contains',
          hidden: true,
          label: 'ca âm — đích nhảy hỏng fail closed trước khi chạy',
        },
      ],
      hints: [
        'Kiểm trần bước ở ĐẦU mỗi vòng, trước khi đọc lệnh — nếu không, một chương trình đúng 200 bước cũng bị báo nhầm.',
        'Mỗi nhánh lệnh phải tự quyết định con trỏ lệnh đi đâu; quên tăng con trỏ ở một nhánh là tự tạo vòng lặp vô hạn.',
        'Trả về chuỗi ở mọi nhánh lỗi thay vì ném exception — bài yêu cầu không ném lỗi ra ngoài.',
      ],
      sampleSolution: `OPS = {"PUSH", "POP", "ADD", "SUB", "LOAD", "STORE", "CMP",
       "JMP", "JZ", "JNZ", "CALL", "RET", "HALT"}
NHAY = {"JMP", "JZ", "JNZ", "CALL"}
TRAN = 200


def chay(prog):
    ma = []
    for x in prog.split(";"):
        p = x.split()
        if not p or p[0] not in OPS:
            return "invalid: lenh la"
        ma.append(p)
    for p in ma:
        if p[0] in NHAY and (len(p) != 2 or not p[1].isdigit() or int(p[1]) >= len(ma)):
            return "invalid: dich nhay ngoai pham vi"
    ngan, bien, goi, ip, buoc = [], {}, [], 0, 0
    while True:
        if ip >= len(ma):
            return "invalid: chay qua cuoi chuong trinh"
        if buoc >= TRAN:
            return "no-exit: vuot tran buoc thuc thi"
        p = ma[ip]
        op = p[0]
        buoc += 1
        if op == "HALT":
            return "ok: dung tai halt sau " + str(buoc) + " buoc"
        if op == "PUSH":
            if len(p) != 2 or not p[1].lstrip("-").isdigit():
                return "invalid: doi so push"
            ngan.append(int(p[1]))
            ip += 1
        elif op == "POP":
            if not ngan:
                return "invalid: ngan xep rong"
            ngan.pop()
            ip += 1
        elif op in {"ADD", "SUB", "CMP"}:
            if len(ngan) < 2:
                return "invalid: ngan xep rong"
            b, a = ngan.pop(), ngan.pop()
            ngan.append(a + b if op == "ADD" else a - b)
            ip += 1
        elif op == "LOAD":
            if len(p) != 2:
                return "invalid: doi so load"
            ngan.append(bien.get(p[1], 0))
            ip += 1
        elif op == "STORE":
            if len(p) != 2 or not ngan:
                return "invalid: ngan xep rong"
            bien[p[1]] = ngan.pop()
            ip += 1
        elif op == "JMP":
            ip = int(p[1])
        elif op in {"JZ", "JNZ"}:
            if not ngan:
                return "invalid: ngan xep rong"
            x = ngan.pop()
            ip = int(p[1]) if (x == 0 if op == "JZ" else x != 0) else ip + 1
        elif op == "CALL":
            goi.append(ip + 1)
            ip = int(p[1])
        else:
            if not goi:
                return "invalid: ret khong co khung goi"
            ip = goi.pop()


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    print(chay(m["prog"]) if set(m) == {"prog"} else "invalid: field")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, tìm trong mã của bạn một vòng lặp mà điều kiện thoát phụ thuộc dữ liệu bên ngoài (phản hồi mạng, số dòng đọc được) và viết ra: nếu dữ liệu đó không bao giờ tới giá trị mong đợi thì vòng lặp dừng bằng gì — không có câu trả lời nghĩa là bạn vừa tìm ra một chỗ cần thêm trần.',
    srsCards: [
      {
        hoi: 'Vì sao bộ phân tích hết ngân sách phải báo rõ thay vì trả kết quả "không thấy vấn đề"?',
        dap: 'Vì hai câu đó dẫn tới hai hành động khác nhau: "đã kiểm xong và sạch" thì đi tiếp, còn "chưa kiểm xong" thì phải kiểm thêm — gộp lại là biến việc chưa làm thành sự bảo đảm.',
      },
      {
        hoi: 'Đặt trần số bước giải quyết được vấn đề gì mà đọc tĩnh không giải quyết được?',
        dap: 'Câu hỏi chương trình có dừng hay không: đọc tĩnh thấy cấu trúc vòng lặp nhưng không biết nó thoát khi nào, còn chạy có trần thì biến trạng thái treo thành một kết luận gọi tên được.',
      },
    ],
  },
]
