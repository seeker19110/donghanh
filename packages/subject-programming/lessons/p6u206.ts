// lessons/p6u206.ts — P6-U206: HƯỚNG AN TOÀN, chặng S4 "Phòng thủ và kiến trúc an toàn" —
// module `security-s4-m1` (kiến trúc an toàn: ranh giới tin cậy, phân đoạn, vòng đời khoá, cổng
// an toàn trong vòng phát triển).
//
// Hai bài chia theo hai câu hỏi khác nhau: bài 1 hỏi "yêu cầu truy cập này được tin vì LÝ DO gì"
// (zero trust — vị trí mạng không phải là danh tính), bài 2 hỏi "bí mật và thay đổi của hệ có đi
// qua cổng an toàn chưa" (vòng đời khoá, mô hình đe doạ trước khi phát hành).
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Đây là chặng PHÒNG THỦ: chỉ phân loại, quyết định và quy trình. Mọi simulator là Python tất
// định, hữu hạn, fail closed — không hệ thật, không I/O ngoài, không đồng hồ hệ thống.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U206_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u206-l1',
    unitId: 'p6-u206',
    language: 'python',
    title:
      'MÔ PHỎNG cổng ranh giới tin cậy (trust boundary): zero trust và phân đoạn (segmentation)',
    hook: 'Câu "nó nằm trong mạng nội bộ nên tin được" là câu đã làm sập nhiều tổ chức hơn bất kỳ lỗi kỹ thuật nào.',
    theory:
      'Ranh giới tin cậy (trust boundary) là chỗ dữ liệu đi từ vùng này sang vùng khác và mức tin cậy phải được XÁC LẬP LẠI. Nguyên lý zero trust nói rằng vị trí mạng KHÔNG phải bằng chứng tin cậy: một yêu cầu chỉ được cho qua khi có danh tính đã xác thực và thiết bị đạt chuẩn, bất kể nó xuất phát từ đâu. Phân đoạn (segmentation) là lớp thứ hai: vượt từ vùng này sang vùng khác phải có quyết định riêng, không được mặc định cho qua. Đây là MÔ PHỎNG Python hữu hạn trên một bản ghi yêu cầu tổng hợp: không hệ thống thật, không hạ tầng thật, và bài này chỉ dạy PHÒNG THỦ — phân loại và quyết định, không có bất kỳ thao tác tấn công nào.',
    workedExample: {
      code: `# MO PHONG cong ranh gioi tin cay; ban ghi tong hop, khong cham he that.\nco_che = "vi-tri-mang"\nprint("deny: tin cay theo vi tri mang khong dat zero trust" if co_che == "vi-tri-mang" else "allow: qua cong")`,
      stdinLines: [],
    },
    predict: {
      code: `danhtinh = "verified"\nthietbi = "unknown"\nprint("deny: thiet bi chua dat chuan" if thietbi != "compliant" else "allow: qua cong")`,
      question: 'Người dùng đã xác thực danh tính nhưng thiết bị chưa đạt chuẩn. Cổng in gì?',
      choices: [
        'deny: thiet bi chua dat chuan',
        'allow: qua cong',
        'deny: danh tinh chua xac thuc',
        'unknown: chua du thong tin',
      ],
      answerIndex: 0,
      explain:
        'Zero trust đòi HAI vế cùng lúc: ai đang hỏi, và họ hỏi từ thiết bị nào. Danh tính đúng trên một máy chưa đạt chuẩn vẫn là một đường vào chưa kiểm soát được, nên cổng phải từ chối và gọi đúng tên vế thiếu.',
    },
    parsons: {
      prompt: 'Xếp cổng zero trust fail closed: loại lý do tin cậy sai trước, rồi mới xét hai vế.',
      lines: [
        'if co_che == "vi-tri-mang":',
        '    print("deny: tin cay theo vi tri mang khong dat zero trust")',
        'elif danhtinh != "verified":',
        '    print("deny: danh tinh chua xac thuc")',
        'elif thietbi != "compliant":',
        '    print("deny: thiet bi chua dat chuan")',
        'else:',
        '    print("allow: qua cong")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng ranh giới tin cậy (trust boundary) theo zero trust và phân đoạn (segmentation). Đọc một dòng `coche:<vi-tri-mang|danh-tinh>,danhtinh:<verified|none>,thietbi:<compliant|unknown>,phandoan:<same|cross>`. Thiếu/thừa trường → `invalid: field`; coche lạ → `invalid: coche`; danhtinh lạ → `invalid: danhtinh`; thietbi lạ → `invalid: thietbi`; phandoan lạ → `invalid: phandoan`. Rồi theo thứ tự ưu tiên tất định: coche là `vi-tri-mang` → `deny: tin cay theo vi tri mang khong dat zero trust`; danhtinh khác `verified` → `deny: danh tinh chua xac thuc`; thietbi khác `compliant` → `deny: thiet bi chua dat chuan`; phandoan là `cross` → `deny: vuot phan doan chua co quyet dinh rieng`; còn lại → `allow: qua cong`. Chỉ tính trên dòng nhập: không mạng, không file, không tiến trình con.',
      starterCode:
        '# MÔ PHỎNG cổng tin cậy; chỉ phòng thủ — phân loại và quyết định, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['coche:danh-tinh,danhtinh:verified,thietbi:compliant,phandoan:same'],
          expected: 'allow: qua cong',
          match: 'contains',
          hidden: false,
          label: 'danh tính đã xác thực + thiết bị đạt chuẩn + không vượt phân đoạn',
        },
        {
          stdinLines: ['coche:vi-tri-mang,danhtinh:verified,thietbi:compliant,phandoan:same'],
          expected: 'deny: tin cay theo vi tri mang khong dat zero trust',
          match: 'contains',
          hidden: true,
          label: 'tin cậy dựa trên vị trí mạng bị từ chối dù mọi vế khác đều đẹp',
        },
        {
          stdinLines: ['coche:danh-tinh,danhtinh:none,thietbi:compliant,phandoan:same'],
          expected: 'deny: danh tinh chua xac thuc',
          match: 'contains',
          hidden: true,
          label: 'thiếu danh tính đã xác thực',
        },
        {
          stdinLines: ['coche:danh-tinh,danhtinh:verified,thietbi:compliant,phandoan:cross'],
          expected: 'deny: vuot phan doan chua co quyet dinh rieng',
          match: 'contains',
          hidden: true,
          label: 'vượt phân đoạn phải có quyết định riêng, không mặc định cho qua',
        },
        {
          stdinLines: ['coche:tin-tuong,danhtinh:verified,thietbi:compliant,phandoan:same'],
          expected: 'invalid: coche',
          match: 'contains',
          hidden: true,
          label: 'ca âm — cơ chế tin cậy lạ thì fail closed',
        },
      ],
      hints: [
        'Kiểm ĐỦ bốn khoá trước khi đọc giá trị nào, rồi kiểm từng giá trị theo thứ tự cố định.',
        'Lý do tin cậy sai phải bị loại TRƯỚC hai vế danh tính/thiết bị — nếu không, một yêu cầu tin theo vị trí mạng vẫn có thể lọt qua khi hai vế kia tình cờ hợp lệ.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"coche", "danhtinh", "thietbi", "phandoan"}:
        print("invalid: field")
    elif m["coche"] not in {"vi-tri-mang", "danh-tinh"}:
        print("invalid: coche")
    elif m["danhtinh"] not in {"verified", "none"}:
        print("invalid: danhtinh")
    elif m["thietbi"] not in {"compliant", "unknown"}:
        print("invalid: thietbi")
    elif m["phandoan"] not in {"same", "cross"}:
        print("invalid: phandoan")
    elif m["coche"] == "vi-tri-mang":
        print("deny: tin cay theo vi tri mang khong dat zero trust")
    elif m["danhtinh"] != "verified":
        print("deny: danh tinh chua xac thuc")
    elif m["thietbi"] != "compliant":
        print("deny: thiet bi chua dat chuan")
    elif m["phandoan"] == "cross":
        print("deny: vuot phan doan chua co quyet dinh rieng")
    else:
        print("allow: qua cong")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, vẽ ra ba ranh giới tin cậy trong hệ bạn đang làm và với mỗi ranh giới viết một câu: "bên kia được tin vì …". Câu nào trả lời là "vì nó nằm trong mạng nội bộ" thì đánh dấu đỏ — đó là chỗ cần thay bằng danh tính và trạng thái thiết bị.',
    srsCards: [
      {
        hoi: 'Vì sao vị trí mạng không được coi là bằng chứng tin cậy?',
        dap: 'Vì nó chỉ nói yêu cầu đi từ đâu chứ không nói ai đang hỏi; một máy trong mạng nội bộ bị chiếm là đủ để biến "mạng nội bộ" thành đường vào miễn kiểm tra cho toàn hệ.',
      },
      {
        hoi: 'Phân đoạn thêm được gì khi đã có xác thực danh tính?',
        dap: 'Nó giới hạn thiệt hại: có danh tính đúng ở một vùng không tự động cho quyền sang vùng khác, nên một tài khoản bị chiếm chỉ chạm tới một phần hệ thay vì toàn bộ.',
      },
    ],
  },
  {
    id: 'p6-u206-l2',
    unitId: 'p6-u206',
    language: 'python',
    title:
      'MÔ PHỎNG vòng đời khoá (key lifecycle, rotate) và cổng mô hình đe doạ trước khi phát hành',
    hook: 'Một khoá không bao giờ được xoay vòng là một khoá bạn không biết đã có bao nhiêu người từng cầm.',
    theory:
      'Vòng đời khoá (key lifecycle) gồm tạo — dùng — xoay vòng (rotate) — thu hồi, và hai luật cứng: khoá quá hạn xoay vòng phải bị từ chối, khoá dùng chung giữa các môi trường cũng vậy vì một lần lộ ở môi trường thử nghiệm là lộ luôn ở môi trường thật. Lớp thứ hai là cổng an toàn trong vòng phát triển: thay đổi nào chạm ranh giới tin cậy (trust boundary) mà chưa có mô hình đe doạ thì phải CHẶN PHÁT HÀNH, vì sau khi phát hành thì việc nghĩ ra rủi ro không còn kịp. Chương trình chỉ THAM CHIẾU khoá bằng nhãn, tuyệt đối không in giá trị khoá. Đây là MÔ PHỎNG hữu hạn, phòng thủ: không kho bí mật thật, không hệ thật.',
    workedExample: {
      code: `# MO PHONG vong doi khoa; chi tham chieu nhan khoa, khong bao gio in gia tri.\nnhan, tuoi, max_tuoi = "khoa-dich-vu-a", 120, 90\nprint("deny: khoa qua han xoay vong: " + nhan if tuoi > max_tuoi else "allow: khoa con han: " + nhan)`,
      stdinLines: [],
    },
    predict: {
      code: `chamranh = "yes"\nmohinh = "no"\nprint("block: chua co mo hinh de doa" if chamranh == "yes" and mohinh == "no" else "allow: phat hanh duoc")`,
      question: 'Thay đổi chạm ranh giới tin cậy nhưng chưa có mô hình đe doạ. Cổng in gì?',
      choices: [
        'block: chua co mo hinh de doa',
        'allow: phat hanh duoc',
        'deny: khoa qua han xoay vong',
        'invalid: input',
      ],
      answerIndex: 0,
      explain:
        'Cổng chặn phát hành chứ không từ chối vĩnh viễn: thiếu mô hình đe doạ là thiếu một bước làm được ngay, nên kết quả đúng là chặn lại chờ bổ sung.',
    },
    parsons: {
      prompt: 'Xếp cổng bí mật và phát hành: luật khoá trước, rồi tới cổng mô hình đe doạ.',
      lines: [
        'if dungchung == "yes":',
        '    print("deny: khoa dung chung giua moi truong")',
        'elif tuoi > max_tuoi:',
        '    print("deny: khoa qua han xoay vong")',
        'elif chamranh == "yes" and mohinh == "no":',
        '    print("block: chua co mo hinh de doa")',
        'else:',
        '    print("allow: phat hanh duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng vòng đời khoá (key lifecycle) và cổng phát hành. Đọc `khoa:<nhãn>,tuoi:<số ngày>,max:<số ngày>,dungchung:<yes|no>,chamranh:<yes|no>,mohinh:<yes|no>` — `khoa` chỉ là NHÃN tham chiếu, không bao giờ in giá trị khoá. Thiếu/thừa trường → `invalid: field`; tuoi hoặc max không phải số nguyên không âm → `invalid: tuoi` / `invalid: max`; ba cờ yes/no sai giá trị → `invalid: co`. Thứ tự ưu tiên tất định: dungchung là `yes` → `deny: khoa dung chung giua moi truong`; tuoi lớn hơn max → `deny: khoa qua han xoay vong, phai rotate`; chamranh là `yes` và mohinh là `no` → `block: thay doi cham trust boundary chua co mo hinh de doa`; còn lại → `allow: phat hanh duoc`. Không kho bí mật thật, không mạng, không file.',
      starterCode:
        '# MÔ PHỎNG vòng đời khoá; chỉ tham chiếu nhãn khoá, không in giá trị, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['khoa:khoa-dich-vu-a,tuoi:10,max:90,dungchung:no,chamranh:no,mohinh:no'],
          expected: 'allow: phat hanh duoc',
          match: 'contains',
          hidden: false,
          label: 'khoá còn hạn, không dùng chung, thay đổi không chạm ranh giới tin cậy',
        },
        {
          stdinLines: ['khoa:khoa-dich-vu-a,tuoi:10,max:90,dungchung:yes,chamranh:no,mohinh:yes'],
          expected: 'deny: khoa dung chung giua moi truong',
          match: 'contains',
          hidden: true,
          label: 'khoá dùng chung giữa các môi trường bị từ chối trước mọi luật khác',
        },
        {
          stdinLines: ['khoa:khoa-dich-vu-a,tuoi:120,max:90,dungchung:no,chamranh:no,mohinh:yes'],
          expected: 'deny: khoa qua han xoay vong, phai rotate',
          match: 'contains',
          hidden: true,
          label: 'khoá quá hạn xoay vòng',
        },
        {
          stdinLines: ['khoa:khoa-dich-vu-a,tuoi:10,max:90,dungchung:no,chamranh:yes,mohinh:no'],
          expected: 'block: thay doi cham trust boundary chua co mo hinh de doa',
          match: 'contains',
          hidden: true,
          label: 'chạm ranh giới tin cậy mà chưa có mô hình đe doạ thì chặn phát hành',
        },
        {
          stdinLines: ['khoa:khoa-dich-vu-a,tuoi:muoi,max:90,dungchung:no,chamranh:no,mohinh:yes'],
          expected: 'invalid: tuoi',
          match: 'contains',
          hidden: true,
          label: 'ca âm — tuổi khoá sai kiểu thì fail closed',
        },
      ],
      hints: [
        'Kiểm kiểu hai con số TRƯỚC khi so sánh, để ca âm luôn ra invalid thay vì vỡ.',
        'Ba cờ yes/no nên kiểm chung một vòng lặp — ít lặp code mà vẫn tất định.',
        'Nhãn khoá chỉ để in kèm lý do nếu muốn; không bao giờ in nội dung khoá, và không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    co = [m.get(k) for k in ("dungchung", "chamranh", "mohinh")]
    if set(m) != {"khoa", "tuoi", "max", "dungchung", "chamranh", "mohinh"}:
        print("invalid: field")
    elif so(m["tuoi"]) is None:
        print("invalid: tuoi")
    elif so(m["max"]) is None:
        print("invalid: max")
    elif any(c not in {"yes", "no"} for c in co):
        print("invalid: co")
    elif m["dungchung"] == "yes":
        print("deny: khoa dung chung giua moi truong")
    elif so(m["tuoi"]) > so(m["max"]):
        print("deny: khoa qua han xoay vong, phai rotate")
    elif m["chamranh"] == "yes" and m["mohinh"] == "no":
        print("block: thay doi cham trust boundary chua co mo hinh de doa")
    else:
        print("allow: phat hanh duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, liệt kê mọi bí mật mà dịch vụ bạn đang làm cần để chạy, rồi với mỗi cái ghi hai con số: lần xoay vòng gần nhất cách đây bao lâu, và hạn xoay vòng đã cam kết là bao lâu. Bí mật nào dùng chung giữa môi trường thử nghiệm và môi trường thật thì ghi riêng ra một danh sách — đó là việc phải sửa trước.',
    srsCards: [
      {
        hoi: 'Vì sao khoá dùng chung giữa môi trường thử nghiệm và môi trường thật lại nguy hiểm hơn khoá quá hạn?',
        dap: 'Vì môi trường thử nghiệm luôn được bảo vệ lỏng hơn; dùng chung khoá nghĩa là mức bảo vệ của cả hệ tụt xuống bằng mức của môi trường yếu nhất, bất kể khoá còn mới đến đâu.',
      },
      {
        hoi: 'Vì sao thiếu mô hình đe doạ ra `block` chứ không ra `deny`?',
        dap: 'Vì đây không phải vi phạm chính sách mà là một bước quy trình còn thiếu: chặn lại để bổ sung rồi phát hành tiếp là đúng, từ chối hẳn là sai mức.',
      },
    ],
  },
]
