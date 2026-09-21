// lessons/p6u212.ts — P6-U212: HƯỚNG BẢO MẬT, chặng S3 — module `security-s3-m3` (tìm lỗi tự
// động: fuzzing theo độ phủ và thu nhỏ ca lỗi).
//
// Đây là phần có giá trị nghề nghiệp cao nhất và an toàn nhất của chặng: kỹ năng thu được dùng
// thẳng vào việc viết test hồi quy. Bộ phân tích trong bài là PARSER ĐỒ CHƠI tất định; fuzzer
// sinh input bằng phép đếm từ hạt giống truyền vào, KHÔNG dùng random toàn cục, nên cùng hạt
// giống luôn cho cùng kết quả.
//
// Đặc tả: `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U212_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u212-l1',
    unitId: 'p6-u212',
    language: 'python',
    title: 'MÔ PHỎNG fuzzer theo độ phủ (coverage) với hạt giống (seed) tất định (deterministic)',
    hook: 'Đọc lại code lần thứ ba không tìm ra lỗi mới; một cái máy thử mười nghìn đầu vào ngớ ngẩn thì có.',
    theory:
      'Fuzzing là sinh đầu vào hàng loạt rồi xem bộ phân tích cư xử thế nào. Hai chi tiết biến nó từ trò may rủi thành công cụ kỹ thuật. Thứ nhất là độ phủ (coverage): đo xem mỗi đầu vào chạm tới những nhánh nào, và giữ lại đầu vào nào chạm được nhánh mới — nhờ đó bộ sinh đi sâu dần thay vì quanh quẩn một chỗ. Thứ hai là tính tất định (deterministic): sinh input từ một hạt giống (seed) truyền vào, không lấy ngẫu nhiên từ hệ thống, nên một lần chạy tìm ra lỗi thì lần sau tái hiện được — thứ không tái hiện được thì không sửa được.\nLuật thứ ba, quan trọng nhất khi đọc kết quả: hết ngân sách mà chưa thấy gì thì phải báo `not-found`, TUYỆT ĐỐI không báo "không có lỗi". Mục đích phòng thủ: đưa việc tìm lỗi thành một quy trình chạy được trong CI, và không để một lượt chạy cạn ngân sách bị đọc nhầm thành lời bảo đảm. MÔ PHỎNG hữu hạn trên parser đồ chơi, không đụng phần mềm thật.',
    workedExample: {
      code: `# MO PHONG: sinh input bang phep dem tu hat giong, khong dung ngau nhien toan cuc.\nCHU = "ab()"\nk = 250\ns = ""\nfor _ in range(4):\n    s += CHU[k % 4]\n    k //= 4\nprint(s)`,
      stdinLines: [],
    },
    predict: {
      code: `phu = {"hople", "khongcanbang", "long-kep"}\ntim = ""\nprint("not-found: het ngan sach, coverage " + str(len(phu)) + " nhanh" if tim == "" else "ok: tim thay")`,
      question: 'Fuzzer phủ được 3 nhánh nhưng hết ngân sách mà chưa gặp ca lỗi nào. In gì?',
      choices: [
        'not-found: het ngan sach, coverage 3 nhanh',
        'ok: tim thay',
        'not-found: khong co loi',
        'not-found: het ngan sach, coverage 0 nhanh',
      ],
      answerIndex: 0,
      explain:
        'Câu trả lời phải nói rõ hai điều: đã hết ngân sách (chứ không phải đã chứng minh sạch) và đã phủ được bao nhiêu nhánh — con số đó cho người đọc biết lượt chạy này đáng tin tới đâu.',
    },
    parsons: {
      prompt: 'Xếp vòng fuzz: sinh input từ hạt giống, ghi nhận nhánh, giữ ca lỗi đầu tiên.',
      lines: [
        'for t in range(ngansach):',
        '    s = sinh((seed + t) % 256)',
        '    nh = nhan(s)',
        '    phu.add(nh)',
        '    if nh == "long-kep" and tim == "":',
        '        tim, luot = s, t + 1',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG fuzzer theo độ phủ (coverage) trên một parser đồ chơi. Parser `nhan(s)` trả về một trong bốn nhãn nhánh: ký tự ngoài bảng chữ `ab()` → `kytula`; dấu ngoặc không cân → `khongcanbang`; chứa `(())` → `long-kep` (đây là ca LỖI cần tìm); còn lại → `hople`. Bộ sinh tất định: với lượt thứ `t`, lấy `k = (seed + t) % 256` rồi dựng chuỗi 4 ký tự bằng cách lặp bốn lần `CHU[k % 4]` và `k //= 4`. Đọc `seed:<số nguyên không âm>,ngansach:<số nguyên không âm>`. Thiếu/thừa trường → `invalid: field`; sai kiểu → `invalid: seed` / `invalid: ngansach`. Chạy tối đa `min(ngansach, 256)` lượt, ghi nhãn vào tập độ phủ, nhớ ca lỗi ĐẦU TIÊN. Tìm được → `ok: coverage <số nhãn> nhanh, ca loi <chuỗi> sau <số lượt> luot`; hết ngân sách mà không thấy → `not-found: het ngan sach, coverage <số nhãn> nhanh`. CẤM dùng random toàn cục và cấm báo "không có lỗi".',
      starterCode:
        '# MÔ PHỎNG fuzzer tất định; sinh input bằng phép đếm từ hạt giống truyền vào.\n',
      testCases: [
        {
          stdinLines: ['seed:250,ngansach:8'],
          expected: 'ok: coverage 3 nhanh, ca loi (()) sau 1 luot',
          match: 'contains',
          hidden: false,
          label: 'hạt giống rơi thẳng vào ca lỗi ngay lượt đầu',
        },
        {
          stdinLines: ['seed:250,ngansach:8'],
          expected: 'ok: coverage 3 nhanh, ca loi (()) sau 1 luot',
          match: 'contains',
          hidden: true,
          label: 'chạy lại cùng hạt giống cho ra kết quả y hệt (tất định)',
        },
        {
          stdinLines: ['seed:0,ngansach:256'],
          expected: 'ok: coverage 3 nhanh, ca loi (()) sau 251 luot',
          match: 'contains',
          hidden: true,
          label: 'quét hết không gian 256 chuỗi thì gặp ca lỗi ở lượt 251',
        },
        {
          stdinLines: ['seed:7,ngansach:4'],
          expected: 'not-found: het ngan sach, coverage 1 nhanh',
          match: 'contains',
          hidden: true,
          label: 'ngân sách quá nhỏ: báo hết ngân sách, KHÔNG báo "không có lỗi"',
        },
        {
          stdinLines: ['seed:muoi,ngansach:16'],
          expected: 'invalid: seed',
          match: 'contains',
          hidden: true,
          label: 'ca âm — hạt giống sai kiểu fail closed',
        },
      ],
      hints: [
        'Viết hàm `nhan(s)` trước và kiểm thứ tự nhãn: ký tự lạ, rồi ngoặc không cân, rồi mới tới ca lỗi.',
        'Bộ sinh phải là phép đếm thuần từ seed — gọi random là phá luôn tính tất định của cả bài.',
        'Chỉ ghi nhớ ca lỗi ĐẦU TIÊN; ghi đè bằng ca sau làm kết quả phụ thuộc thứ tự duyệt.',
      ],
      sampleSolution: `CHU = "ab()"


def nhan(s):
    d = 0
    for c in s:
        if c not in CHU:
            return "kytula"
        if c == "(":
            d += 1
        elif c == ")":
            d -= 1
            if d < 0:
                return "khongcanbang"
    if d != 0:
        return "khongcanbang"
    if "(())" in s:
        return "long-kep"
    return "hople"


def sinh(k):
    s = ""
    for _ in range(4):
        s += CHU[k % 4]
        k //= 4
    return s


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"seed", "ngansach"}:
        print("invalid: field")
    elif not m["seed"].isdigit():
        print("invalid: seed")
    elif not m["ngansach"].isdigit():
        print("invalid: ngansach")
    else:
        seed, ngansach = int(m["seed"]), int(m["ngansach"])
        phu, tim, luot = set(), "", 0
        for t in range(min(ngansach, 256)):
            s = sinh((seed + t) % 256)
            nh = nhan(s)
            phu.add(nh)
            if nh == "long-kep" and tim == "":
                tim, luot = s, t + 1
        if tim:
            print("ok: coverage " + str(len(phu)) + " nhanh, ca loi " + tim
                  + " sau " + str(luot) + " luot")
        else:
            print("not-found: het ngan sach, coverage " + str(len(phu)) + " nhanh")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một hàm phân tích chuỗi trong dự án của bạn (đọc cấu hình, tách tham số, phân tích ngày tháng) rồi viết một vòng lặp sinh vài nghìn chuỗi méo mó từ một hạt giống cố định và chạy qua nó; mọi lần hàm ném lỗi không mong đợi, lưu chuỗi đó lại thành một ca test hồi quy.',
    srsCards: [
      {
        hoi: 'Vì sao fuzzer phải sinh input từ hạt giống truyền vào thay vì lấy ngẫu nhiên của hệ thống?',
        dap: 'Để lượt chạy tái hiện được: tìm ra lỗi mà không dựng lại được đúng đầu vào thì không ai sửa được, và cũng không viết nổi test hồi quy cho nó.',
      },
      {
        hoi: 'Hết ngân sách mà chưa thấy lỗi thì báo gì, và vì sao không được báo "không có lỗi"?',
        dap: 'Báo not-found kèm độ phủ đạt được; "không có lỗi" là một lời bảo đảm mà lượt chạy không hề chứng minh, và nó sẽ được người đọc dùng để ngừng tìm.',
      },
    ],
  },
  {
    id: 'p6-u212-l2',
    unitId: 'p6-u212',
    language: 'python',
    title: 'MÔ PHỎNG thu nhỏ ca lỗi (minimize) bằng delta-debugging mà vẫn giữ đúng lỗi',
    hook: 'Ca lỗi 4000 ký tự không ai đọc; ca lỗi 4 ký tự thì ai cũng thấy ngay nguyên nhân.',
    theory:
      'Fuzzer tìm ra một đầu vào gây lỗi, nhưng đầu vào đó thường đầy phần thừa. Thu nhỏ (minimize) theo lối delta-debugging là vòng lặp đơn giản: bỏ thử từng phần, chạy lại, giữ bản rút gọn nếu nó VẪN gây ĐÚNG lỗi cũ, lặp tới khi không bỏ được gì nữa.\nBất biến bắt buộc nằm ở chữ "đúng lỗi cũ": thu nhỏ quá tay thành một ca không còn lỗi, hoặc thành ca gây một lỗi KHÁC, là đã làm hỏng bằng chứng — người nhận báo cáo sẽ đi sửa nhầm chỗ. Vì thế mọi bộ thu nhỏ đều phải so nhãn lỗi chứ không chỉ so "có lỗi hay không", và kết quả phải được chạy lại một lần cuối để xác nhận.\nMục đích phòng thủ: ca lỗi đã thu nhỏ chính là test hồi quy — nó vào thẳng bộ test của dự án và canh cho lỗi không quay lại. MÔ PHỎNG hữu hạn trên parser đồ chơi của bài trước, không đụng phần mềm thật.',
    workedExample: {
      code: `# MO PHONG mot buoc delta-debugging: bo mot ky tu, giu neu VAN dung loi cu.\nhien, loi = "ab(())", "long-kep"\nung = hien[1:]\nprint(ung if "(())" in ung else hien)`,
      stdinLines: [],
    },
    predict: {
      code: `hien = "(())"\nung = hien[1:]\nprint("giu nguyen" if "(())" not in ung else "thu nho tiep")`,
      question: 'Bỏ thêm một ký tự khỏi `(())` thì chuỗi còn lại không còn gây lỗi cũ. In gì?',
      choices: [
        'giu nguyen',
        'thu nho tiep',
        'not-found: dau vao khong gay loi',
        'invalid: dau vao rong',
      ],
      answerIndex: 0,
      explain:
        'Đây chính là điều kiện dừng của delta-debugging: khi mọi phép bỏ thử đều làm mất lỗi cũ thì bản hiện tại đã là nhỏ nhất giữ được bằng chứng.',
    },
    parsons: {
      prompt: 'Xếp vòng thu nhỏ: thử bỏ từng ký tự, chỉ giữ bản vẫn gây ĐÚNG lỗi cũ.',
      lines: [
        'while doi:',
        '    doi = False',
        '    for i in range(len(hien)):',
        '        ung = hien[:i] + hien[i + 1:]',
        '        if ung != "" and nhan(ung) == loi:',
        '            hien, doi = ung, True',
        '            break',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG bộ thu nhỏ (minimize) ca lỗi bằng delta-debugging, dùng đúng parser đồ chơi của bài trước (`kytula` · `khongcanbang` · `long-kep` · `hople`). Đọc `dauvao:<chuỗi>`. Thiếu/thừa trường → `invalid: field`; chuỗi rỗng → `invalid: dau vao rong`. Chạy parser: nhãn là `hople` → `not-found: dau vao khong gay loi`. Ngược lại, lặp bỏ thử từng ký tự và chỉ giữ bản rút gọn khi nó cho ra ĐÚNG nhãn lỗi ban đầu (không phải một lỗi khác), dừng khi không bỏ được gì nữa; in `ok: minimize con <chuỗi đã thu nhỏ> van gay loi <nhãn>`. Bản thu nhỏ không được rỗng.',
      starterCode: '# MÔ PHỎNG delta-debugging; giữ nguyên nhãn lỗi ban đầu khi thu nhỏ.\n',
      testCases: [
        {
          stdinLines: ['dauvao:ab(())ba'],
          expected: 'ok: minimize con (()) van gay loi long-kep',
          match: 'contains',
          hidden: false,
          label: 'bỏ hết phần thừa, giữ đúng bốn ký tự gây lỗi',
        },
        {
          stdinLines: ['dauvao:abab'],
          expected: 'not-found: dau vao khong gay loi',
          match: 'contains',
          hidden: true,
          label: 'đầu vào hợp lệ thì không có gì để thu nhỏ',
        },
        {
          stdinLines: ['dauvao:aa((bb'],
          expected: 'ok: minimize con ( van gay loi khongcanbang',
          match: 'contains',
          hidden: true,
          label: 'lỗi ngoặc không cân thu về một ký tự',
        },
        {
          stdinLines: ['dauvao:ab#ba'],
          expected: 'ok: minimize con # van gay loi kytula',
          match: 'contains',
          hidden: true,
          label: 'nhãn lỗi phải được giữ nguyên, không đổi sang lỗi khác',
        },
        {
          stdinLines: ['dauvao:'],
          expected: 'invalid: dau vao rong',
          match: 'contains',
          hidden: true,
          label: 'ca âm — đầu vào rỗng fail closed',
        },
      ],
      hints: [
        'Ghi lại nhãn lỗi ban đầu TRƯỚC vòng lặp và so với nó ở mọi phép thử.',
        'Sau mỗi lần bỏ được một ký tự, bắt đầu lại từ đầu chuỗi — đó là cách vòng lặp hội tụ về bản nhỏ nhất.',
        'Chặn bản rút gọn rỗng: chuỗi rỗng không còn là bằng chứng của gì cả.',
      ],
      sampleSolution: `CHU = "ab()"


def nhan(s):
    d = 0
    for c in s:
        if c not in CHU:
            return "kytula"
        if c == "(":
            d += 1
        elif c == ")":
            d -= 1
            if d < 0:
                return "khongcanbang"
    if d != 0:
        return "khongcanbang"
    if "(())" in s:
        return "long-kep"
    return "hople"


def thu_nho(s, loi):
    hien, doi = s, True
    while doi:
        doi = False
        for i in range(len(hien)):
            ung = hien[:i] + hien[i + 1:]
            if ung != "" and nhan(ung) == loi:
                hien, doi = ung, True
                break
    return hien


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"dauvao"}:
        print("invalid: field")
    elif m["dauvao"] == "":
        print("invalid: dau vao rong")
    else:
        loi = nhan(m["dauvao"])
        if loi == "hople":
            print("not-found: dau vao khong gay loi")
        else:
            print("ok: minimize con " + thu_nho(m["dauvao"], loi) + " van gay loi " + loi)
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một ca lỗi thật mà đội bạn từng ghi lại (một bản ghi JSON dài, một tệp cấu hình hỏng) và thu nhỏ nó bằng tay theo đúng vòng trên: bỏ một phần, chạy lại, giữ nếu vẫn hỏng đúng kiểu cũ — rồi đưa bản nhỏ nhất vào bộ test hồi quy.',
    srsCards: [
      {
        hoi: 'Vì sao bộ thu nhỏ phải so NHÃN lỗi chứ không chỉ so "có lỗi hay không"?',
        dap: 'Vì một bản rút gọn có thể gây một lỗi khác hẳn; giữ nó lại là đưa cho người sửa một bằng chứng sai, và họ sẽ đi sửa đúng chỗ không liên quan.',
      },
      {
        hoi: 'Ca lỗi đã thu nhỏ có ích gì ngoài việc dễ đọc hơn?',
        dap: 'Nó vào thẳng bộ test hồi quy của dự án: một ca nhỏ, tất định, chạy nhanh, canh cho đúng lỗi đó không quay lại ở những lần sửa sau.',
      },
    ],
  },
]
