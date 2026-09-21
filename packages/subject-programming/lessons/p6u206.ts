// lessons/p6u206.ts — P6-U206: HƯỚNG BẢO MẬT, chặng S4 "Chuyên gia — phòng thủ và kiến trúc
// an toàn" — module `security-s4-m1` (kiến trúc an toàn: ranh giới tin cậy, phân đoạn, vòng đời
// khoá, cổng an toàn trong vòng phát triển).
//
// Hai bài chia theo hai câu hỏi khác nhau: bài 1 hỏi "yêu cầu này có được qua ranh giới tin cậy
// không" (zero trust — vị trí mạng KHÔNG phải bằng chứng), bài 2 hỏi "khoá và bản phát hành này
// có còn đủ tư cách không" (vòng đời khoá + mô hình đe doạ trước khi phát hành).
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Chặng S4 là chặng PHÒNG THỦ: mọi bài chỉ phân loại và quyết định, không có bước nào hướng vào
// một hệ thống đang chạy. Simulator Python tất định, hữu hạn, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U206_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u206-l1',
    unitId: 'p6-u206',
    language: 'python',
    title: 'MÔ PHỎNG cổng ranh giới tin cậy (trust boundary) theo nguyên lý zero trust',
    hook: 'Câu "yêu cầu này đến từ mạng nội bộ nên tin được" là câu đã làm sập nhiều tổ chức hơn bất kỳ lỗ hổng nào.',
    theory:
      'Ranh giới tin cậy (trust boundary) là chỗ dữ liệu đi từ vùng ít tin sang vùng nhiều tin — và mỗi lần đi qua phải trả lời lại từ đầu câu hỏi "anh là ai, máy anh có đạt chuẩn không". Nguyên lý zero trust nói đúng một điều: VỊ TRÍ MẠNG không phải bằng chứng danh tính. Phân đoạn (segmentation) vẫn có ích — nó thu hẹp thiệt hại khi một vùng bị chiếm — nhưng nó là biện pháp GIỚI HẠN, không phải biện pháp XÁC THỰC; lấy nó làm lý lẽ tin cậy là đổi vai của nó.\nMục đích phòng thủ của bài: biết từ chối đúng chỗ, để một máy bị chiếm trong mạng nội bộ không tự động trở thành chìa khoá của mọi dịch vụ còn lại. Đây là MÔ PHỎNG Python hữu hạn trên một bản ghi yêu cầu tổng hợp: không hệ thống thật, không mạng, không danh tính thật.',
    workedExample: {
      code: `# MO PHONG cong ranh gioi tin cay; ban ghi tong hop, khong cham he that.\nlyle = "vitri"  # can cu ma ben goi dua ra de xin tin cay\nprint("deny: tin cay theo vi tri mang" if lyle == "vitri" else "allow: qua ranh gioi tin cay")`,
      stdinLines: [],
    },
    predict: {
      code: `danhtinh = "khuyetdanh"\nthietbi = "tuanthu"\nprint("deny: chua xac thuc danh tinh" if danhtinh != "xacthuc" else "allow: qua ranh gioi tin cay")`,
      question:
        'Máy đạt chuẩn nhưng yêu cầu không mang danh tính đã xác thực. Cổng MÔ PHỎNG in gì?',
      choices: [
        'deny: chua xac thuc danh tinh',
        'allow: qua ranh gioi tin cay',
        'deny: thiet bi khong tuan thu',
        'unknown: chua du thong tin',
      ],
      answerIndex: 0,
      explain:
        'Thiết bị đạt chuẩn mới trả lời được nửa câu hỏi "máy này có sạch không"; nửa còn lại — "ai đang ngồi sau máy đó" — vẫn trống, nên cổng phải từ chối và gọi đúng tên vế đang thiếu.',
    },
    parsons: {
      prompt:
        'Xếp cổng zero trust fail closed: bác lý lẽ vị trí mạng trước, rồi mới xét danh tính và thiết bị.',
      lines: [
        'if lyle == "vitri":',
        '    print("deny: tin cay theo vi tri mang")',
        'elif danhtinh != "xacthuc":',
        '    print("deny: chua xac thuc danh tinh")',
        'elif thietbi != "tuanthu":',
        '    print("deny: thiet bi khong tuan thu")',
        'else:',
        '    print("allow: qua ranh gioi tin cay")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng ranh giới tin cậy (trust boundary) theo zero trust, có xét phân đoạn (segmentation). Đọc một dòng `lyle:<vitri|danhtinh>,danhtinh:<xacthuc|khuyetdanh>,thietbi:<tuanthu|khongtuanthu>,phandoan:<giu|xuyenqua>`. Thiếu/thừa trường → `invalid: field`; giá trị lạ ở trường nào → `invalid: <tên trường>`. Thứ tự quyết định: `lyle` là `vitri` → `deny: tin cay theo vi tri mang`; danh tính chưa xác thực → `deny: chua xac thuc danh tinh`; thiết bị không tuân thủ → `deny: thiet bi khong tuan thu`; phân đoạn bị xuyên qua → `deny: xuyen qua phan doan`; còn lại → `allow: qua ranh gioi tin cay`. Không gọi mạng, không chạm hệ thống thật.',
      starterCode: '# MÔ PHỎNG ranh giới tin cậy; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['lyle:danhtinh,danhtinh:xacthuc,thietbi:tuanthu,phandoan:giu'],
          expected: 'allow: qua ranh gioi tin cay',
          match: 'contains',
          hidden: false,
          label: 'đủ danh tính, thiết bị đạt chuẩn, phân đoạn còn nguyên',
        },
        {
          stdinLines: ['lyle:vitri,danhtinh:xacthuc,thietbi:tuanthu,phandoan:giu'],
          expected: 'deny: tin cay theo vi tri mang',
          match: 'contains',
          hidden: true,
          label: 'lấy vị trí mạng làm lý lẽ tin cậy thì bị bác trước tiên',
        },
        {
          stdinLines: ['lyle:danhtinh,danhtinh:khuyetdanh,thietbi:tuanthu,phandoan:giu'],
          expected: 'deny: chua xac thuc danh tinh',
          match: 'contains',
          hidden: true,
          label: 'khuyết danh không qua được ranh giới',
        },
        {
          stdinLines: ['lyle:danhtinh,danhtinh:xacthuc,thietbi:khongtuanthu,phandoan:giu'],
          expected: 'deny: thiet bi khong tuan thu',
          match: 'contains',
          hidden: true,
          label: 'thiết bị không đạt chuẩn bị chặn dù danh tính đúng',
        },
        {
          stdinLines: ['lyle:danhtinh,danhtinh:xacthuc,thietbi:tuanthu,phandoan:xuyenqua'],
          expected: 'deny: xuyen qua phan doan',
          match: 'contains',
          hidden: true,
          label: 'đi tắt qua phân đoạn bị chặn',
        },
        {
          stdinLines: ['lyle:cam-tinh,danhtinh:xacthuc,thietbi:tuanthu,phandoan:giu'],
          expected: 'invalid: lyle',
          match: 'contains',
          hidden: true,
          label: 'ca âm — lý lẽ lạ fail closed',
        },
      ],
      hints: [
        'Kiểm đủ bốn khoá trước, rồi kiểm từng giá trị có nằm trong tập cho phép không.',
        'Thứ tự rẽ nhánh phải cố định để hai vế hỏng cùng lúc vẫn cho một kết quả tất định.',
        'Không dùng socket, subprocess, file hay thời gian thực.',
      ],
      sampleSolution: `MUC = {
    "lyle": {"vitri", "danhtinh"},
    "danhtinh": {"xacthuc", "khuyetdanh"},
    "thietbi": {"tuanthu", "khongtuanthu"},
    "phandoan": {"giu", "xuyenqua"},
}

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(MUC):
        print("invalid: field")
    else:
        xau = [k for k in ("lyle", "danhtinh", "thietbi", "phandoan") if m[k] not in MUC[k]]
        if xau:
            print("invalid: " + xau[0])
        elif m["lyle"] == "vitri":
            print("deny: tin cay theo vi tri mang")
        elif m["danhtinh"] != "xacthuc":
            print("deny: chua xac thuc danh tinh")
        elif m["thietbi"] != "tuanthu":
            print("deny: thiet bi khong tuan thu")
        elif m["phandoan"] == "xuyenqua":
            print("deny: xuyen qua phan doan")
        else:
            print("allow: qua ranh gioi tin cay")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, vẽ một hình chữ nhật cho mỗi vùng tin cậy trong hệ bạn đang làm, rồi đánh dấu mọi mũi tên đi từ vùng ngoài vào vùng trong; với mỗi mũi tên, viết ra bằng chứng danh tính mà nó thật sự kiểm — nếu câu trả lời là "nó ở trong mạng nội bộ" thì bạn vừa tìm ra việc cần sửa đầu tiên.',
    srsCards: [
      {
        hoi: 'Vì sao zero trust bác bỏ lý lẽ "yêu cầu đến từ mạng nội bộ nên tin được"?',
        dap: 'Vì vị trí mạng chỉ nói yêu cầu đi từ đâu, không nói ai gửi; một máy nội bộ bị chiếm sẽ mang đúng vị trí đó và thừa hưởng toàn bộ lòng tin đặt nhầm chỗ.',
      },
      {
        hoi: 'Phân đoạn mạng đóng vai trò gì nếu nó không phải cơ chế xác thực?',
        dap: 'Nó giới hạn thiệt hại: khi một vùng bị chiếm, kẻ chiếm chỉ với được tới những gì trong vùng đó, nên phân đoạn mua thời gian chứ không chứng minh danh tính.',
      },
    ],
  },
  {
    id: 'p6-u206-l2',
    unitId: 'p6-u206',
    language: 'python',
    title: 'MÔ PHỎNG vòng đời khoá (key lifecycle), hạn xoay vòng (rotate) và cổng mô hình đe doạ',
    hook: 'Một khoá dùng chung cho cả môi trường thử và môi trường thật nghĩa là mọi sự cố ở nơi ít quan trọng nhất đều thành sự cố ở nơi quan trọng nhất.',
    theory:
      'Vòng đời khoá (key lifecycle) gồm bốn mốc: sinh ra, dùng, xoay vòng (rotate) theo chu kỳ, và huỷ. Bỏ mốc xoay vòng nghĩa là mỗi khoá tự biến thành một bí mật vĩnh viễn — lộ một lần là lộ mãi mãi. Khoá dùng chung giữa các môi trường thì tệ hơn nữa, vì nó nối thẳng vùng ít được bảo vệ vào vùng được bảo vệ nhất.\nVế thứ hai là cổng an toàn trong vòng phát triển: thay đổi nào chạm ranh giới tin cậy thì phải có mô hình đe doạ viết thành văn bản TRƯỚC khi phát hành — không phải để làm thủ tục, mà vì đó là lần duy nhất cả đội buộc phải nói ra "ai có thể tấn công chỗ này và bằng cách nào". Mục đích phòng thủ: biến câu hỏi đó thành một bước bắt buộc chứ không phải một việc tuỳ hứng. MÔ PHỎNG chỉ tham chiếu khoá bằng TÊN, tuyệt đối không in giá trị khoá.',
    workedExample: {
      code: `# MO PHONG vong doi khoa: chi tham chieu TEN khoa, khong bao gio in gia tri.\ntuoi, chuky = 120, 90\nprint("deny: khoa qua han xoay vong" if tuoi > chuky else "allow: khoa con han")`,
      stdinLines: [],
    },
    predict: {
      code: `mohinh = "khong"\nprint("block: chua co mo hinh de doa" if mohinh == "khong" else "allow: phat hanh duoc")`,
      question:
        'Một thay đổi chạm ranh giới tin cậy nhưng chưa có mô hình đe doạ. Cổng MÔ PHỎNG in gì?',
      choices: [
        'block: chua co mo hinh de doa',
        'allow: phat hanh duoc',
        'deny: khoa qua han xoay vong',
        'unknown: chua du thong tin',
      ],
      answerIndex: 0,
      explain:
        'Cổng chặn ở bước phát hành chứ không từ chối vĩnh viễn: thiếu mô hình đe doạ là thiếu một việc làm được ngay, nên quyết định đúng là dừng lại chờ, không phải bác bỏ thay đổi.',
    },
    parsons: {
      prompt: 'Xếp cổng vòng đời khoá: chặn khoá dùng chung trước, rồi mới xét hạn xoay vòng.',
      lines: [
        'if dungchung == "co":',
        '    print("deny: khoa dung chung giua moi truong")',
        'elif tuoi > chuky:',
        '    print("deny: khoa qua han xoay vong")',
        'else:',
        '    print("allow: khoa con han")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng vòng đời khoá (key lifecycle) và cổng phát hành. Đọc `loai:<khoa|phathanh>,tuoi:<số ngày>,chuky:<số ngày>,dungchung:<co|khong>,mohinh:<co|khong>`. Thiếu/thừa trường → `invalid: field`; `loai` lạ → `invalid: loai`; `tuoi` hoặc `chuky` không phải số nguyên không âm → `invalid: tuoi` / `invalid: chuky`; `dungchung`/`mohinh` lạ → `invalid: dungchung` / `invalid: mohinh`. Với `khoa`: dùng chung → `deny: khoa dung chung giua moi truong`; tuổi > chu kỳ → `deny: khoa qua han xoay vong`; còn lại → `allow: khoa con han`. Với `phathanh`: chưa có mô hình đe doạ → `block: chua co mo hinh de doa`; có → `allow: phat hanh duoc`. Chỉ tham chiếu khoá bằng tên, KHÔNG in giá trị khoá.',
      starterCode: '# MÔ PHỎNG vòng đời khoá; chỉ tính trên dòng nhập, không in giá trị bí mật.\n',
      testCases: [
        {
          stdinLines: ['loai:khoa,tuoi:30,chuky:90,dungchung:khong,mohinh:co'],
          expected: 'allow: khoa con han',
          match: 'contains',
          hidden: false,
          label: 'khoá riêng, chưa tới hạn xoay vòng',
        },
        {
          stdinLines: ['loai:khoa,tuoi:120,chuky:90,dungchung:khong,mohinh:co'],
          expected: 'deny: khoa qua han xoay vong',
          match: 'contains',
          hidden: true,
          label: 'quá hạn xoay vòng thì không dùng tiếp',
        },
        {
          stdinLines: ['loai:khoa,tuoi:10,chuky:90,dungchung:co,mohinh:co'],
          expected: 'deny: khoa dung chung giua moi truong',
          match: 'contains',
          hidden: true,
          label: 'khoá dùng chung bị chặn dù còn hạn',
        },
        {
          stdinLines: ['loai:phathanh,tuoi:0,chuky:90,dungchung:khong,mohinh:khong'],
          expected: 'block: chua co mo hinh de doa',
          match: 'contains',
          hidden: true,
          label: 'thay đổi chạm ranh giới tin cậy phải có mô hình đe doạ trước',
        },
        {
          stdinLines: ['loai:phathanh,tuoi:0,chuky:90,dungchung:khong,mohinh:co'],
          expected: 'allow: phat hanh duoc',
          match: 'contains',
          hidden: true,
          label: 'có mô hình đe doạ thì qua cổng phát hành',
        },
        {
          stdinLines: ['loai:khoa,tuoi:ba muoi,chuky:90,dungchung:khong,mohinh:co'],
          expected: 'invalid: tuoi',
          match: 'contains',
          hidden: true,
          label: 'ca âm — tuổi khoá sai kiểu fail closed',
        },
      ],
      hints: [
        'Kiểm kiểu của cả hai số TRƯỚC khi rẽ theo loai, để ca âm luôn ra invalid.',
        'So sánh tuổi với chu kỳ bằng số, không so chuỗi — "120" < "90" theo chuỗi là đúng và cũng là sai.',
        'Không in giá trị khoá ở bất kỳ nhánh nào; tên khoá là đủ để người đọc hành động.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"loai", "tuoi", "chuky", "dungchung", "mohinh"}:
        print("invalid: field")
    elif m["loai"] not in {"khoa", "phathanh"}:
        print("invalid: loai")
    elif so(m["tuoi"]) is None:
        print("invalid: tuoi")
    elif so(m["chuky"]) is None:
        print("invalid: chuky")
    elif m["dungchung"] not in {"co", "khong"}:
        print("invalid: dungchung")
    elif m["mohinh"] not in {"co", "khong"}:
        print("invalid: mohinh")
    elif m["loai"] == "khoa":
        if m["dungchung"] == "co":
            print("deny: khoa dung chung giua moi truong")
        elif so(m["tuoi"]) > so(m["chuky"]):
            print("deny: khoa qua han xoay vong")
        else:
            print("allow: khoa con han")
    elif m["mohinh"] == "khong":
        print("block: chua co mo hinh de doa")
    else:
        print("allow: phat hanh duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, liệt kê mọi bí mật mà dịch vụ bạn đang làm cần để chạy, rồi ghi cạnh mỗi cái: lần xoay vòng gần nhất là khi nào, và môi trường thử có đang dùng chung bí mật đó không; cái nào không trả lời được ngày xoay vòng thì coi như chưa bao giờ xoay.',
    srsCards: [
      {
        hoi: 'Vì sao khoá không có chu kỳ xoay vòng là một rủi ro, kể cả khi chưa lộ lần nào?',
        dap: 'Vì lộ khoá là việc âm thầm và có thể đã xảy ra rồi; không xoay vòng thì cửa sổ thiệt hại kéo dài vô hạn, còn xoay vòng đều biến mọi lần lộ thành một sự cố có ngày hết hạn.',
      },
      {
        hoi: 'Thiếu mô hình đe doạ thì quyết định đúng là block hay deny? Vì sao?',
        dap: 'Block — đây là việc còn thiếu chứ không phải thay đổi sai; chặn phát hành để đội bổ sung mô hình rồi đi tiếp, trong khi deny hàm ý bác bỏ hẳn và đẩy người ta đi đường vòng.',
      },
    ],
  },
]
