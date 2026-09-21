// lessons/p6u256.ts — P6-U256: HƯỚNG GAME, chặng S4 — module `game-s4-m3` (thiết kế trò chơi có
// số liệu: đường cong khó, tỉ lệ bỏ cuộc theo màn, cân bằng kinh tế, kiếm tiền có đạo đức).
//
// Bài 1 lo ĐỌC SỐ CHO ĐÚNG: tỉ lệ bỏ cuộc theo màn, và ngưỡng mẫu tối thiểu — dưới ngưỡng thì
// `unknown`, CẤM quy về 0%. Bài 2 lo GIỚI HẠN ĐẠO ĐỨC: cơ chế kiếm tiền khớp tiêu chí gây áp lực
// tâm lý thì `refuse`, và kinh tế mô phỏng vượt trần lạm phát thì `deny`.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md` (mục ⑧.4 — danh sách tiêu chí bóc
// lột đã được chủ dự án xác nhận trước khi viết cứng vào ca kiểm).
// MÔ PHỎNG Python tất định trên mẫu tổng hợp: không dữ liệu người chơi thật, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U256_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u256-l1',
    unitId: 'p6-u256',
    language: 'python',
    title: 'MÔ PHỎNG tỉ lệ bỏ cuộc theo màn: dưới ngưỡng mẫu thì trả unknown, không quy về 0%',
    hook: 'Màn 12 có tỉ lệ bỏ cuộc 0% nghe như tin vui — cho tới khi bạn biết chỉ có ba người từng tới màn đó.',
    theory:
      'Tỉ lệ bỏ cuộc theo màn là số liệu thiết kế hữu ích nhất của một trò chơi: nó chỉ đúng chỗ đường cong khó gãy, thứ mà không buổi chơi thử nào trong phòng phát hiện được. Nhưng nó cũng là số liệu dễ đọc sai nhất, vì mẫu co lại rất nhanh theo màn — tới màn cuối có khi chỉ còn vài chục người. Luật bắt buộc: dưới ngưỡng mẫu tối thiểu khai báo trước thì trả `unknown`, TUYỆT ĐỐI không quy về 0% hay "ổn". Quy về 0 biến một chỗ không biết thành một tín hiệu xanh, và đội sẽ đi tối ưu những màn có nhiều dữ liệu trong khi màn thật sự gãy thì im lặng. Số liệu ở đây là mẫu TỔNG HỢP khai báo trước, không phải dữ liệu người chơi thật. Đây là MÔ PHỎNG Python hữu hạn, không CSDL, không I/O ngoài.',
    workedExample: {
      code: `# MO PHONG ti le bo cuoc; mau la so TONG HOP, khong phai du lieu nguoi choi that.\nvao, bo, nguong = 500, 120, 100\nif vao < nguong:\n    print("unknown: mau duoi nguong toi thieu")\nelse:\n    print("allow: ti le bo cuoc " + str(bo * 100 // vao) + " phan tram")`,
      stdinLines: [],
    },
    predict: {
      code: `vao, bo, nguong = 3, 0, 100\nif vao < nguong:\n    print("unknown: mau duoi nguong toi thieu")\nelse:\n    print("allow: ti le bo cuoc " + str(bo * 100 // vao) + " phan tram")`,
      question: 'Chỉ 3 người từng vào màn này và không ai bỏ cuộc. MÔ PHỎNG in gì?',
      choices: [
        'unknown: mau duoi nguong toi thieu',
        'allow: ti le bo cuoc 0 phan tram',
        'deny: vuot tran lam phat',
        'refuse: co che boc lot',
      ],
      answerIndex: 0,
      explain:
        'Ba người không nói được gì về hàng nghìn người sẽ chơi. Nếu in "0 phần trăm", đội sẽ coi màn này là ổn và đi sửa chỗ khác — trong khi thứ ta thật sự biết là: chưa đủ dữ liệu để kết luận.',
    },
    parsons: {
      prompt: 'Xếp cổng đọc số: chặn mẫu quá nhỏ TRƯỚC khi tính bất kỳ tỉ lệ nào.',
      lines: [
        'if nguong <= 0:',
        '    print("invalid: nguong mau")',
        'elif bo > vao:',
        '    print("invalid: so bo cuoc lon hon so vao man")',
        'elif vao < nguong:',
        '    print("unknown: mau duoi nguong toi thieu")',
        'else:',
        '    print("allow: ti le bo cuoc " + str(bo * 100 // vao) + " phan tram")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng tính tỉ lệ bỏ cuộc theo màn. Đọc `vao:<int>,bo:<int>,nguong:<int>,bao_dong:<int>` (bao_dong là ngưỡng phần trăm báo động). Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên không âm → `invalid: so`; nguong ≤ 0 → `invalid: nguong mau`; bo > vao → `invalid: so bo cuoc lon hon so vao man`; vao < nguong → `unknown: mau duoi nguong toi thieu`; tỉ lệ (bo × 100 // vao) ≥ bao_dong → `deny: ti le bo cuoc vuot nguong bao dong`; còn lại → `allow: ti le bo cuoc <tỉ lệ> phan tram`. Mẫu là số tổng hợp, không phải dữ liệu người chơi thật.',
      starterCode:
        '# MÔ PHỎNG đọc số liệu thiết kế; mẫu tổng hợp, không chạm dữ liệu người chơi thật.\n',
      testCases: [
        {
          stdinLines: ['vao:500,bo:120,nguong:100,bao_dong:40'],
          expected: 'allow: ti le bo cuoc 24 phan tram',
          match: 'contains',
          hidden: false,
          label: 'mẫu đủ lớn, tỉ lệ dưới ngưỡng báo động',
        },
        {
          stdinLines: ['vao:3,bo:0,nguong:100,bao_dong:40'],
          expected: 'unknown: mau duoi nguong toi thieu',
          match: 'contains',
          hidden: true,
          label: 'mẫu quá nhỏ thì trả unknown, CẤM quy về 0 phần trăm',
        },
        {
          stdinLines: ['vao:500,bo:300,nguong:100,bao_dong:40'],
          expected: 'deny: ti le bo cuoc vuot nguong bao dong',
          match: 'contains',
          hidden: true,
          label: '60% bỏ cuộc là chỗ đường cong khó gãy',
        },
        {
          stdinLines: ['vao:100,bo:120,nguong:100,bao_dong:40'],
          expected: 'invalid: so bo cuoc lon hon so vao man',
          match: 'contains',
          hidden: true,
          label: 'số bỏ nhiều hơn số vào là dữ liệu hỏng, không phải 120%',
        },
        {
          stdinLines: ['vao:500,bo:120,nguong:0,bao_dong:40'],
          expected: 'invalid: nguong mau',
          match: 'contains',
          hidden: true,
          label: 'ca âm — ngưỡng mẫu không dương làm vô hiệu cả cổng, fail closed',
        },
      ],
      hints: [
        'Kiểm dữ liệu vô lý (bỏ > vào) TRƯỚC khi so với ngưỡng mẫu.',
        'Mẫu dưới ngưỡng KHÔNG được rơi vào nhánh tính tỉ lệ — đó là toàn bộ bài học ở đây.',
        'Không dùng file, socket, subprocess, CSDL hay thời gian thực.',
      ],
      sampleSolution: `KHOA = ("vao", "bo", "nguong", "bao_dong")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(KHOA):
        print("invalid: field")
    elif any(so(m[k]) is None for k in KHOA):
        print("invalid: so")
    else:
        v = {k: so(m[k]) for k in KHOA}
        if v["nguong"] <= 0:
            print("invalid: nguong mau")
        elif v["bo"] > v["vao"]:
            print("invalid: so bo cuoc lon hon so vao man")
        elif v["vao"] < v["nguong"]:
            print("unknown: mau duoi nguong toi thieu")
        else:
            ti_le = v["bo"] * 100 // v["vao"]
            if ti_le >= v["bao_dong"]:
                print("deny: ti le bo cuoc vuot nguong bao dong")
            else:
                print("allow: ti le bo cuoc " + str(ti_le) + " phan tram")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, thêm vào trò chơi của bạn một sự kiện ghi lại "đã vào màn N" và "đã bỏ ở màn N" (ghi ẩn danh, không kèm thông tin cá nhân nào), rồi mời ít nhất hai mươi người chơi thử. Vẽ tỉ lệ bỏ cuộc theo màn, đánh dấu mọi màn có mẫu dưới ngưỡng bạn tự đặt, và viết một câu cho từng màn bạn CHƯA kết luận được.',
    srsCards: [
      {
        hoi: 'Vì sao mẫu dưới ngưỡng phải trả `unknown` thay vì tỉ lệ tính được?',
        dap: 'Vì tỉ lệ từ mẫu quá nhỏ dao động mạnh và không đại diện cho người chơi thật; in ra một con số biến chỗ "chưa biết" thành tín hiệu để hành động, và đội sẽ tin vào thứ không có cơ sở.',
      },
      {
        hoi: 'Vì sao tỉ lệ bỏ cuộc theo màn hữu ích hơn buổi chơi thử trong phòng?',
        dap: 'Người chơi thử trong phòng cố gắng vì có bạn ngồi cạnh và họ không bỏ giữa chừng; người chơi thật thì bỏ, và chỗ họ bỏ chính là chỗ đường cong khó gãy — thứ chỉ số liệu mới thấy được.',
      },
    ],
  },
  {
    id: 'p6-u256-l2',
    unitId: 'p6-u256',
    language: 'python',
    title: 'MÔ PHỎNG rà cơ chế kiếm tiền và trần lạm phát của kinh tế trong game',
    hook: 'Đồng hồ đếm ngược "chỉ còn 2 phút để mua" không làm sản phẩm tốt hơn — nó chỉ làm người ta hết thời gian để suy nghĩ.',
    theory:
      'Kiếm tiền có đạo đức không phải là không kiếm tiền; nó là kiếm tiền mà không dùng cơ chế gây áp lực tâm lý. Hai tiêu chí được chốt trong đặc tả của bài này: đếm ngược ép mua (dựng cảm giác khẩn cấp giả để người chơi không kịp cân nhắc) và ẩn giá thật bằng nhiều lớp tiền ảo (đổi tiền thật ra đá quý, đá quý ra vé, vé ra lượt — sau ba lớp thì không ai còn biết món đồ giá bao nhiêu). Cơ chế khớp từ một tiêu chí trở lên thì `refuse`. Phần thứ hai là cân bằng kinh tế: khi nguồn tiền sinh ra mỗi bước nhiều hơn nguồn tiêu đi, tổng tiền trong game phình dần — lạm phát — và mọi giá trị thiết kế trước đó mất nghĩa; vượt trần khai báo sau N bước thì `deny`. Mô phỏng kinh tế ở đây là các bước rời rạc trên số nguyên. Đây là MÔ PHỎNG hữu hạn, không dữ liệu người chơi thật.',
    workedExample: {
      code: `# MO PHONG ra co che kiem tien; tieu chi khai bao truoc, khong doan.\nTIEU_CHI = {"dem_nguoc_ep_mua", "an_gia_that_nhieu_lop"}\nco_che = {"dem_nguoc_ep_mua"}\nprint("refuse: khop tieu chi gay ap luc" if co_che & TIEU_CHI else "allow: co che chap nhan duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `tien, sinh, tieu, tran, buoc = 100, 30, 10, 300, 5\nfor _ in range(buoc):\n    tien = tien + sinh - tieu\nprint("deny: vuot tran lam phat" if tien > tran else "allow: kinh te on dinh")`,
      question:
        'Mỗi bước sinh 30 và tiêu 10, bắt đầu từ 100, chạy 5 bước, trần lạm phát là 300. MÔ PHỎNG in gì?',
      choices: [
        'allow: kinh te on dinh',
        'deny: vuot tran lam phat',
        'refuse: khop tieu chi gay ap luc',
        'unknown: chua du buoc',
      ],
      answerIndex: 0,
      explain:
        'Mỗi bước tăng ròng 20, sau 5 bước tổng là 100 + 100 = 200, vẫn dưới trần 300. Nhưng để ý: nó đang TĂNG đều — chạy thêm 5 bước nữa là vượt, và đó chính là lý do phải mô phỏng nhiều bước chứ không chỉ nhìn một bước.',
    },
    parsons: {
      prompt: 'Xếp cổng rà cơ chế: tiêu chí đạo đức chặn trước, kinh tế tính sau.',
      lines: [
        'if co_che & TIEU_CHI:',
        '    print("refuse: khop tieu chi gay ap luc")',
        'elif tran <= 0 or buoc <= 0:',
        '    print("invalid: cau hinh mo phong")',
        'else:',
        '    tien = tien + (sinh - tieu) * buoc',
        '    print("deny: vuot tran lam phat" if tien > tran else "allow: kinh te on dinh")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng rà cơ chế kiếm tiền và kinh tế. Tiêu chí gây áp lực đã chốt: `dem_nguoc_ep_mua`, `an_gia_that_nhieu_lop`. Đọc `co_che:<danh sách nhãn ngăn bằng |, có thể rỗng>,tien:<int>,sinh:<int>,tieu:<int>,tran:<int>,buoc:<int>`. Thiếu/thừa trường → `invalid: field`; năm số không phải số nguyên không âm → `invalid: so`; tran ≤ 0 hoặc buoc ≤ 0 → `invalid: cau hinh mo phong`; co_che chứa ≥ 1 tiêu chí gây áp lực → `refuse: khop tieu chi gay ap luc`; sau `buoc` bước với mỗi bước cộng (sinh − tieu), tổng tiền > tran → `deny: vuot tran lam phat`; còn lại → `allow: kinh te on dinh`. Không dữ liệu người chơi thật, không I/O ngoài.',
      starterCode:
        '# MÔ PHỎNG kinh tế trong game và rà cơ chế kiếm tiền; bước rời rạc, số nguyên.\n',
      testCases: [
        {
          stdinLines: ['co_che:,tien:100,sinh:30,tieu:10,tran:300,buoc:5'],
          expected: 'allow: kinh te on dinh',
          match: 'contains',
          hidden: false,
          label: 'không cơ chế nào gây áp lực, tổng tiền vẫn dưới trần',
        },
        {
          stdinLines: ['co_che:dem_nguoc_ep_mua,tien:100,sinh:10,tieu:10,tran:300,buoc:5'],
          expected: 'refuse: khop tieu chi gay ap luc',
          match: 'contains',
          hidden: true,
          label: 'kinh tế cân bằng không cứu được một cơ chế bóc lột',
        },
        {
          stdinLines: ['co_che:,tien:100,sinh:60,tieu:10,tran:300,buoc:5'],
          expected: 'deny: vuot tran lam phat',
          match: 'contains',
          hidden: true,
          label: 'sinh nhiều hơn tiêu kéo dài thì tổng tiền phình qua trần',
        },
        {
          stdinLines: ['co_che:mua_truoc_giam_gia,tien:100,sinh:10,tieu:10,tran:300,buoc:5'],
          expected: 'allow: kinh te on dinh',
          match: 'contains',
          hidden: true,
          label: 'cơ chế không nằm trong danh sách tiêu chí thì không bị từ chối oan',
        },
        {
          stdinLines: ['co_che:,tien:100,sinh:30,tieu:10,tran:0,buoc:5'],
          expected: 'invalid: cau hinh mo phong',
          match: 'contains',
          hidden: true,
          label: 'ca âm — trần không dương làm vô hiệu cổng, fail closed',
        },
      ],
      hints: [
        'Tiêu chí đạo đức kiểm TRƯỚC: một cơ chế bóc lột không được "bù" bằng kinh tế đẹp.',
        'Danh sách tiêu chí là dữ liệu khai báo — không tự đoán thêm tiêu chí ngoài danh sách.',
        'Không dùng file, socket, subprocess, CSDL hay thời gian thực.',
      ],
      sampleSolution: `TIEU_CHI = {"dem_nguoc_ep_mua", "an_gia_that_nhieu_lop"}
SO = ("tien", "sinh", "tieu", "tran", "buoc")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"co_che", *SO}:
        print("invalid: field")
    elif any(so(m[k]) is None for k in SO):
        print("invalid: so")
    else:
        v = {k: so(m[k]) for k in SO}
        co_che = {p for p in m["co_che"].split("|") if p != ""}
        if co_che & TIEU_CHI:
            print("refuse: khop tieu chi gay ap luc")
        elif v["tran"] <= 0 or v["buoc"] <= 0:
            print("invalid: cau hinh mo phong")
        else:
            tien = v["tien"]
            for _ in range(v["buoc"]):
                tien = tien + v["sinh"] - v["tieu"]
            if tien > v["tran"]:
                print("deny: vuot tran lam phat")
            else:
                print("allow: kinh te on dinh")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy ba trò chơi bạn đang chơi và viết ra đúng đường đi của tiền thật trong mỗi trò: tiền thật đổi ra gì, gì đổi ra gì, và cuối cùng một món đồ cụ thể giá bao nhiêu tiền thật. Đếm số lớp trung gian của từng trò. Sau đó nhìn lại trò chơi của chính bạn và viết một câu cam kết về số lớp bạn cho phép mình dùng.',
    srsCards: [
      {
        hoi: 'Vì sao nhiều lớp tiền ảo trung gian là một cơ chế gây áp lực chứ không chỉ là tiện lợi?',
        dap: 'Mỗi lớp làm phép quy đổi ra tiền thật khó hơn, tới mức người chơi không còn ước lượng được mình đang tiêu bao nhiêu; quyết định chi tiêu khi không biết giá không còn là một quyết định có thông tin.',
      },
      {
        hoi: 'Vì sao phải mô phỏng kinh tế qua NHIỀU bước thay vì kiểm cân bằng của một bước?',
        dap: 'Một chênh lệch nhỏ giữa lượng sinh và lượng tiêu ở một bước trông vô hại, nhưng nó cộng dồn tuyến tính; lạm phát chỉ lộ ra khi chạy đủ số bước tương đương vài chục giờ chơi thật.',
      },
    ],
  },
]
