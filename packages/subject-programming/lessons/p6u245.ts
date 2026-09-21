// lessons/p6u245.ts — P6-U245: HƯỚNG GAME, chặng S1 — module `game-s1-m4` (tài nguyên và phát
// hành: đóng gói atlas, bản lưu có số phiên bản).
//
// Bài 1 lo NGÂN SÁCH TÀI NGUYÊN (tổng kích thước ảnh rời so với ngân sách atlas — vượt thì từ
// chối chứ không im lặng đóng gói ra bản build không tải nổi); bài 2 lo BẢN LƯU CÓ PHIÊN BẢN
// (bản cũ phải nâng cấp được theo bảng khai báo, phiên bản lạ thì fail closed).
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: không đọc file thật, không đóng gói thật, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U245_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u245-l1',
    unitId: 'p6-u245',
    language: 'python',
    title: 'MÔ PHỎNG đóng gói atlas: ngân sách tài nguyên là một con số, không phải hy vọng',
    hook: 'Bản build cuối cùng nặng gấp ba lần dự tính không phải vì một lỗi lớn, mà vì hai trăm tệp ảnh nhỏ không ai cộng lại bao giờ.',
    theory:
      'Atlas là một tấm ảnh lớn gom nhiều sprite rời, để trò chơi nạp một tệp thay vì hai trăm tệp và để phần vẽ gom được nhiều hình vào chung một lệnh. Nhưng atlas có giới hạn thật: bộ nhớ đồ hoạ của máy mục tiêu, kích thước ảnh tối đa mà phần cứng nhận, và ngân sách dung lượng bản phát hành. Vì thế đóng gói phải là một CỔNG có ngân sách khai báo trước: tổng kích thước ảnh rời vượt ngân sách thì `reject` và nói rõ vượt bao nhiêu, chứ không im lặng đóng gói ra một bản build mà người chơi mạng yếu không tải nổi. Ngân sách phải dương và số lượng ảnh phải không âm — hai điều đó kiểm trước khi cộng. Đây là MÔ PHỎNG Python hữu hạn trên các con số khai báo: không đọc tệp ảnh thật, không chạy công cụ đóng gói thật.',
    workedExample: {
      code: `# MO PHONG cong dong goi atlas; moi so la KILOBYTE khai bao truoc, khong doc file that.\ntong, ngan_sach = 3800, 4096\nprint("allow: dong goi duoc" if tong <= ngan_sach else "reject: vuot ngan sach atlas")`,
      stdinLines: [],
    },
    predict: {
      code: `tong, ngan_sach = 5000, 4096\nprint("reject: vuot ngan sach atlas " + str(tong - ngan_sach) + " KB" if tong > ngan_sach else "allow: dong goi duoc")`,
      question: 'Tổng ảnh rời là 5000 KB, ngân sách atlas là 4096 KB. MÔ PHỎNG in gì?',
      choices: [
        'reject: vuot ngan sach atlas 904 KB',
        'allow: dong goi duoc',
        'reject: vuot ngan sach atlas 5000 KB',
        'invalid: ngan sach',
      ],
      answerIndex: 0,
      explain:
        'Lời từ chối phải kèm phần vượt là 5000 − 4096 = 904 KB, vì người nhận cần biết phải cắt bao nhiêu; từ chối suông buộc họ đoán và thường là đoán thiếu, rồi chạy lại cả quy trình đóng gói.',
    },
    parsons: {
      prompt: 'Xếp cổng đóng gói: kiểm ngân sách hợp lệ trước, rồi mới cộng và so.',
      lines: [
        'if ngan_sach <= 0:',
        '    print("invalid: ngan sach")',
        'elif so_anh < 0:',
        '    print("invalid: so anh")',
        'elif tong > ngan_sach:',
        '    print("reject: vuot ngan sach atlas " + str(tong - ngan_sach) + " KB")',
        'else:',
        '    print("allow: dong goi duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng đóng gói atlas. Đọc `so_anh:<int>,kich_thuoc_moi_anh:<int>,ngan_sach:<int>` (đơn vị KB). Thiếu/thừa trường → `invalid: field`; trường nào không phải số nguyên (cho phép âm) → `invalid: so`; ngan_sach ≤ 0 → `invalid: ngan sach`; so_anh < 0 hoặc kich_thuoc_moi_anh < 0 → `invalid: so anh`; so_anh = 0 → `unknown: chua co anh nao de dong goi`; tổng = so_anh × kich_thuoc_moi_anh > ngan_sach → `reject: vuot ngan sach atlas <phần vượt> KB`; còn lại → `allow: dong goi duoc`. Không đọc tệp ảnh, không chạy công cụ đóng gói thật.',
      starterCode: '# MÔ PHỎNG đóng gói atlas; chỉ cộng số khai báo, không chạm tệp thật.\n',
      testCases: [
        {
          stdinLines: ['so_anh:100,kich_thuoc_moi_anh:38,ngan_sach:4096'],
          expected: 'allow: dong goi duoc',
          match: 'contains',
          hidden: false,
          label: '3800 KB nằm trong ngân sách 4096 KB',
        },
        {
          stdinLines: ['so_anh:100,kich_thuoc_moi_anh:50,ngan_sach:4096'],
          expected: 'reject: vuot ngan sach atlas 904 KB',
          match: 'contains',
          hidden: true,
          label: 'vượt ngân sách thì từ chối KÈM số phải cắt',
        },
        {
          stdinLines: ['so_anh:0,kich_thuoc_moi_anh:38,ngan_sach:4096'],
          expected: 'unknown: chua co anh nao de dong goi',
          match: 'contains',
          hidden: true,
          label: 'không có ảnh nào thì trả unknown, cấm coi như "đạt ngân sách"',
        },
        {
          stdinLines: ['so_anh:100,kich_thuoc_moi_anh:38,ngan_sach:0'],
          expected: 'invalid: ngan sach',
          match: 'contains',
          hidden: true,
          label: 'ngân sách không dương là lỗi cấu hình',
        },
        {
          stdinLines: ['so_anh:-5,kich_thuoc_moi_anh:38,ngan_sach:4096'],
          expected: 'invalid: so anh',
          match: 'contains',
          hidden: true,
          label: 'ca âm — số ảnh âm fail closed',
        },
      ],
      hints: [
        'Kiểu trước, miền giá trị sau: ba số phải qua được `so()` rồi mới xét dấu.',
        'Bộ ảnh rỗng KHÔNG phải là "trong ngân sách" — nó là chưa đủ dữ liệu để kết luận.',
        'Không dùng `open(`, file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `KHOA = ("so_anh", "kich_thuoc_moi_anh", "ngan_sach")


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
        n, kt, ns = so(m["so_anh"]), so(m["kich_thuoc_moi_anh"]), so(m["ngan_sach"])
        if ns <= 0:
            print("invalid: ngan sach")
        elif n < 0 or kt < 0:
            print("invalid: so anh")
        elif n == 0:
            print("unknown: chua co anh nao de dong goi")
        elif n * kt > ns:
            print("reject: vuot ngan sach atlas " + str(n * kt - ns) + " KB")
        else:
            print("allow: dong goi duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một dự án Godot hoặc Unity thật của bạn, xuất bản build cho web rồi đọc báo cáo kích thước của chính công cụ đó: ghi lại ba tệp tài nguyên nặng nhất và tổng dung lượng. Đặt một ngân sách bằng chữ cho lần phát hành sau (ví dụ "tối đa 30 MB tải lần đầu") rồi thử gom sprite vào atlas và đo lại — nộp hai con số trước và sau.',
    srsCards: [
      {
        hoi: 'Vì sao lời từ chối của cổng ngân sách phải kèm phần vượt thay vì chỉ nói "vượt ngân sách"?',
        dap: 'Người nhận cần một con số để quyết định cắt cái gì; từ chối suông buộc họ đoán, thường đoán thiếu, rồi phải chạy lại toàn bộ quy trình đóng gói thêm vài lượt.',
      },
      {
        hoi: 'Bộ tài nguyên rỗng nên trả `unknown` hay `allow`?',
        dap: '`unknown`: không có ảnh nào nghĩa là chưa có gì để kết luận, còn trả `allow` sẽ biến một lỗi quy trình (quên khai tài nguyên) thành một tín hiệu xanh giả.',
      },
    ],
  },
  {
    id: 'p6-u245-l2',
    unitId: 'p6-u245',
    language: 'python',
    title: 'MÔ PHỎNG bản lưu có số phiên bản: nâng cấp theo bảng, phiên bản lạ thì fail closed',
    hook: 'Bản cập nhật hay nhất của bạn sẽ bị đánh giá một sao nếu nó xoá mất một trăm giờ chơi của người ta.',
    theory:
      'Bản lưu là dữ liệu của NGƯỜI CHƠI, không phải của bạn — nên mỗi bản lưu phải mang số phiên bản và trò chơi phải có bảng nâng cấp khai báo: từ phiên bản 1 lên 2 làm gì, từ 2 lên 3 làm gì. Bản lưu cũ hơn phiên bản hiện tại thì `migrate` theo bảng đó. Bản lưu MỚI HƠN phiên bản trò chơi (người chơi vừa cài lại bản cũ) thì không thể đoán: cấu trúc tương lai chưa tồn tại lúc bạn viết mã, nên phải `deny` và giữ nguyên tệp, tuyệt đối không ghi đè. Một phiên bản không nằm trong bảng cũng `deny` — fail closed, vì đoán bừa một lần là hỏng vĩnh viễn dữ liệu không phục hồi được. Đây là MÔ PHỎNG hữu hạn trên số phiên bản: không đọc tệp lưu thật, không ghi đĩa.',
    workedExample: {
      code: `# MO PHONG cong doc ban luu; bang nang cap khai bao truoc.\nBANG = {1: 2, 2: 3}\nver_luu, ver_game = 1, 3\nprint("migrate: nang cap tu ban " + str(ver_luu) if ver_luu in BANG else "deny: phien ban la")`,
      stdinLines: [],
    },
    predict: {
      code: `ver_luu, ver_game = 5, 3\nprint("deny: ban luu moi hon tro choi" if ver_luu > ver_game else "migrate: nang cap tu ban " + str(ver_luu))`,
      question:
        'Người chơi cài lại bản cũ, bản lưu là phiên bản 5 còn trò chơi là phiên bản 3. MÔ PHỎNG in gì?',
      choices: [
        'deny: ban luu moi hon tro choi',
        'migrate: nang cap tu ban 5',
        'allow: doc truc tiep',
        'invalid: phien ban',
      ],
      answerIndex: 0,
      explain:
        'Mã của phiên bản 3 không thể biết phiên bản 5 chứa gì — nó được viết trước khi phiên bản 5 tồn tại. Từ chối và giữ nguyên tệp là cách duy nhất không làm mất dữ liệu; ghi đè ở đây là xoá tiến độ của người chơi.',
    },
    parsons: {
      prompt: 'Xếp cổng đọc bản lưu: từ chối tương lai trước, rồi mới tra bảng nâng cấp.',
      lines: [
        'if ver_luu > ver_game:',
        '    print("deny: ban luu moi hon tro choi")',
        'elif ver_luu == ver_game:',
        '    print("allow: doc truc tiep")',
        'elif ver_luu in BANG:',
        '    print("migrate: nang cap tu ban " + str(ver_luu))',
        'else:',
        '    print("deny: phien ban khong nhan dang duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng đọc bản lưu có phiên bản. Bảng nâng cấp khai báo: có đường nâng cấp từ phiên bản 1, 2 và 3. Đọc `ver_luu:<int>,ver_game:<int>`. Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên dương → `invalid: phien ban`; ver_luu > ver_game → `deny: ban luu moi hon tro choi`; ver_luu = ver_game → `allow: doc truc tiep`; ver_luu nằm trong bảng nâng cấp → `migrate: nang cap tu ban <ver_luu>`; còn lại → `deny: phien ban khong nhan dang duoc`. Không đọc tệp lưu thật, không ghi đĩa.',
      starterCode: '# MÔ PHỎNG bản lưu có phiên bản; không đọc và không ghi tệp thật.\n',
      testCases: [
        {
          stdinLines: ['ver_luu:4,ver_game:4'],
          expected: 'allow: doc truc tiep',
          match: 'contains',
          hidden: false,
          label: 'cùng phiên bản thì đọc thẳng, không cần nâng cấp',
        },
        {
          stdinLines: ['ver_luu:2,ver_game:4'],
          expected: 'migrate: nang cap tu ban 2',
          match: 'contains',
          hidden: true,
          label: 'bản cũ có đường nâng cấp khai báo thì được nâng',
        },
        {
          stdinLines: ['ver_luu:5,ver_game:4'],
          expected: 'deny: ban luu moi hon tro choi',
          match: 'contains',
          hidden: true,
          label: 'bản lưu từ tương lai bị từ chối, tệp giữ nguyên',
        },
        {
          stdinLines: ['ver_luu:9,ver_game:12'],
          expected: 'deny: phien ban khong nhan dang duoc',
          match: 'contains',
          hidden: true,
          label: 'phiên bản cũ ngoài bảng nâng cấp thì fail closed, không đoán',
        },
        {
          stdinLines: ['ver_luu:0,ver_game:4'],
          expected: 'invalid: phien ban',
          match: 'contains',
          hidden: true,
          label: 'ca âm — số phiên bản không dương fail closed',
        },
      ],
      hints: [
        'Kiểm "mới hơn trò chơi" TRƯỚC khi tra bảng — nhánh nguy hiểm nhất phải chặn sớm nhất.',
        'Bảng nâng cấp là dữ liệu: thêm một phiên bản chỉ nên là thêm một phần tử.',
        'Không dùng `open(`, file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `BANG_NANG_CAP = {1, 2, 3}


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"ver_luu", "ver_game"}:
        print("invalid: field")
    elif so(m["ver_luu"]) is None or so(m["ver_luu"]) <= 0:
        print("invalid: phien ban")
    elif so(m["ver_game"]) is None or so(m["ver_game"]) <= 0:
        print("invalid: phien ban")
    else:
        vl, vg = so(m["ver_luu"]), so(m["ver_game"])
        if vl > vg:
            print("deny: ban luu moi hon tro choi")
        elif vl == vg:
            print("allow: doc truc tiep")
        elif vl in BANG_NANG_CAP:
            print("migrate: nang cap tu ban " + str(vl))
        else:
            print("deny: phien ban khong nhan dang duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, thêm trường số phiên bản vào định dạng bản lưu của dự án Godot hoặc Unity của bạn, rồi làm thật hai việc: tạo một bản lưu bằng phiên bản cũ, nâng phiên bản trò chơi lên, và mở lại bản lưu đó. Ghi lại chuyện gì xảy ra trước khi bạn viết đường nâng cấp và sau khi viết — kèm ảnh chụp màn hình bản lưu vẫn còn nguyên tiến độ.',
    srsCards: [
      {
        hoi: 'Vì sao bản lưu MỚI HƠN phiên bản trò chơi phải bị từ chối chứ không cố đọc lấy phần hiểu được?',
        dap: 'Mã hiện tại được viết trước khi cấu trúc tương lai tồn tại nên không có cách nào biết phần chưa hiểu là gì; đọc một phần rồi ghi lại sẽ cắt mất dữ liệu người chơi vĩnh viễn, còn từ chối thì họ chỉ cần cập nhật lại trò chơi.',
      },
      {
        hoi: 'Vì sao đường nâng cấp bản lưu nên khai thành bảng dữ liệu thay vì viết rải trong mã đọc tệp?',
        dap: 'Bảng cho thấy ngay phiên bản nào còn đường nâng cấp và phiên bản nào đã rơi ngoài hỗ trợ, nên thêm phiên bản mới là thêm một dòng; viết rải thì mỗi lần cập nhật đều có nguy cơ sót một nhánh, mà nhánh sót ở đây làm mất dữ liệu thật.',
      },
    ],
  },
]
