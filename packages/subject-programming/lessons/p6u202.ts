// lessons/p6u202.ts — P6-U202: HƯỚNG DỮ LIỆU, chặng S4 "Nền tảng dữ liệu cấp tổ chức" —
// module `data-s4-m1` (kiến trúc nền tảng: danh mục, ảnh chụp/du hành thời gian, tiến hoá schema).
//
// Hai bài chia theo hai câu hỏi khác nhau của cùng một nền tảng: bài 1 hỏi "bảng này có ĐỦ TƯ CÁCH
// để công bố chưa" (danh mục — chủ sở hữu và phân loại), bài 2 hỏi "quá khứ và tương lai của bảng
// có an toàn không" (khôi phục trong thời hạn lưu giữ, và tiến hoá schema không phá người dùng cũ).
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Mọi simulator là Python tất định, hữu hạn: không kho dữ liệu thật, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U202_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u202-l1',
    unitId: 'p6-u202',
    language: 'python',
    title:
      'MÔ PHỎNG cổng công bố của danh mục dữ liệu: chủ sở hữu (owner) và phân loại (classification)',
    hook: 'Một bảng không có người chịu trách nhiệm là một bảng không ai sửa khi nó sai — và không ai biết ai được phép đọc nó.',
    theory:
      'Danh mục dữ liệu (data catalog) là sổ đăng ký của nền tảng: mỗi bảng phải khai chủ sở hữu (owner) — một người hoặc một đội có tên thật — và mức phân loại (classification) quyết định ai được đọc. Cổng công bố phải TỪ CHỐI bảng thiếu một trong hai, vì công bố trước rồi bổ sung sau nghĩa là đã có người đọc dữ liệu mà chưa ai quyết định họ có quyền hay không. Đây là MÔ PHỎNG Python hữu hạn trên một bản ghi danh mục tổng hợp: không kết nối kho dữ liệu, không đọc metadata thật.',
    workedExample: {
      code: `# MÔ PHỎNG cong cong bo cua danh muc; ban ghi tong hop, khong goi kho du lieu that.\nowner = "doi-du-lieu"\nclassification = "internal"\nhop_le = owner != "-" and classification in {"public", "internal", "restricted"}\nprint("allow: publish duoc" if hop_le else "deny: thieu metadata bat buoc")`,
      stdinLines: [],
    },
    predict: {
      code: `owner = "-"\nclassification = "internal"\nprint("deny: thieu chu so huu" if owner == "-" else "allow: publish duoc")`,
      question: 'Bảng đã có phân loại nhưng bỏ trống chủ sở hữu. Cổng MÔ PHỎNG in gì?',
      choices: [
        'deny: thieu chu so huu',
        'allow: publish duoc',
        'deny: thieu phan loai',
        'unknown: chua du thong tin',
      ],
      answerIndex: 0,
      explain:
        'Phân loại nói ai được đọc, chủ sở hữu nói ai chịu trách nhiệm khi dữ liệu sai — thiếu vế nào cũng không công bố được, và ở đây vế thiếu là chủ sở hữu nên lời từ chối phải gọi đúng tên nó.',
    },
    parsons: {
      prompt: 'Xếp cổng công bố fail closed: kiểm đủ metadata trước khi cho phép publish.',
      lines: [
        'if owner == "-":',
        '    print("deny: thieu chu so huu")',
        'elif classification not in muc_hop_le:',
        '    print("deny: thieu phan loai")',
        'else:',
        '    print("allow: publish duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng công bố của danh mục dữ liệu. Đọc một dòng `owner:<tên|->,classification:<public|internal|restricted|->,action:<publish|draft>`. Thiếu/thừa trường → `invalid: field`; action lạ → `invalid: action`; owner là `-` → `deny: thieu chu so huu`; classification ngoài ba mức → `deny: thieu phan loai`; action là `draft` → `allow: giu ban nhap`; còn lại → `allow: publish duoc`. Không gọi kho dữ liệu, không đọc metadata thật.',
      starterCode: '# MÔ PHỎNG danh mục dữ liệu; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['owner:doi-du-lieu,classification:internal,action:publish'],
          expected: 'allow: publish duoc',
          match: 'contains',
          hidden: false,
          label: 'đủ chủ sở hữu và phân loại thì công bố được',
        },
        {
          stdinLines: ['owner:-,classification:internal,action:publish'],
          expected: 'deny: thieu chu so huu',
          match: 'contains',
          hidden: true,
          label: 'thiếu chủ sở hữu bị từ chối, nêu đúng vế thiếu',
        },
        {
          stdinLines: ['owner:doi-du-lieu,classification:-,action:publish'],
          expected: 'deny: thieu phan loai',
          match: 'contains',
          hidden: true,
          label: 'thiếu phân loại bị từ chối',
        },
        {
          stdinLines: ['owner:doi-du-lieu,classification:internal,action:draft'],
          expected: 'allow: giu ban nhap',
          match: 'contains',
          hidden: true,
          label: 'bản nháp không đi qua cổng công bố',
        },
        {
          stdinLines: ['owner:doi-du-lieu,classification:internal,action:xoa'],
          expected: 'invalid: action',
          match: 'contains',
          hidden: true,
          label: 'ca âm — action lạ fail closed',
        },
      ],
      hints: [
        'Tách dòng thành cặp khoá:giá trị rồi kiểm ĐỦ BA khoá trước khi đọc giá trị nào.',
        'Kiểm theo thứ tự cố định để hai input hỏng cùng lúc vẫn cho một kết quả tất định.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"owner", "classification", "action"}:
        print("invalid: field")
    elif m["action"] not in {"publish", "draft"}:
        print("invalid: action")
    elif m["owner"] == "-":
        print("deny: thieu chu so huu")
    elif m["classification"] not in {"public", "internal", "restricted"}:
        print("deny: thieu phan loai")
    elif m["action"] == "draft":
        print("allow: giu ban nhap")
    else:
        print("allow: publish duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy năm bảng đang được dùng nhiều nhất trong tổ chức bạn và tra xem mỗi bảng có chủ sở hữu đích danh và mức phân loại không; ghi lại bảng nào thiếu, và ai sẽ là người trả lời nếu số liệu của bảng đó sai vào sáng mai.',
    srsCards: [
      {
        hoi: 'Vì sao bảng thiếu chủ sở hữu không được công bố, dù dữ liệu trong bảng đúng?',
        dap: 'Dữ liệu đúng hôm nay vẫn sẽ sai một ngày nào đó; không có chủ sở hữu thì không có ai chịu trách nhiệm sửa, và bảng thành nợ vĩnh viễn của cả nền tảng.',
      },
      {
        hoi: 'Lời từ chối nên nêu đúng vế nào đang thiếu, hay chỉ cần nói "thiếu metadata"?',
        dap: 'Phải nêu đúng vế thiếu: từ chối chung chung buộc người khai phải đoán, còn từ chối chỉ đích danh biến cổng thành hướng dẫn sửa.',
      },
    ],
  },
  {
    id: 'p6-u202-l2',
    unitId: 'p6-u202',
    language: 'python',
    title:
      'MÔ PHỎNG du hành thời gian trong thời hạn lưu giữ (retention) và tiến hoá schema không phá',
    hook: 'Hai câu hỏi làm sập nền tảng dữ liệu nhanh nhất: "khôi phục về hôm kia được không?" và "xoá cột này có ai chết không?".',
    theory:
      'Ảnh chụp bảng (snapshot) cho phép du hành thời gian, nhưng chỉ trong thời hạn lưu giữ (retention) đã cam kết — yêu cầu khôi phục về mốc cũ hơn phải bị từ chối KÈM mốc gần nhất còn được, vì trả lời "không" suông khiến người hỏi đi tìm bản sao lậu. Tiến hoá schema thì ngược lại: thêm cột là an toàn, còn xoá cột hay đổi kiểu cột đang có người dùng là thay đổi phá vỡ — nền tảng phải chặn, buộc đi đường thêm cột mới rồi chuyển dần. Đây là MÔ PHỎNG hữu hạn: không snapshot thật, không kho dữ liệu thật, không đồng hồ hệ thống.',
    workedExample: {
      code: `# MO PHONG du hanh thoi gian trong thoi han luu giu.\ntuoi_moc, retention = 5, 30\nprint("allow: khoi phuc duoc" if tuoi_moc <= retention else "deny: ngoai thoi han luu giu")`,
      stdinLines: [],
    },
    predict: {
      code: `thaydoi = "xoacot"\nprint("deny: tien hoa pha vo" if thaydoi in {"xoacot", "doikieu"} else "allow: them cot an toan")`,
      question: 'Đề xuất xoá một cột đang có người dùng. Cổng MÔ PHỎNG in gì?',
      choices: [
        'deny: tien hoa pha vo',
        'allow: them cot an toan',
        'allow: khoi phuc duoc',
        'unknown: chua du thong tin',
      ],
      answerIndex: 0,
      explain:
        'Xoá cột và đổi kiểu cột đều làm gãy truy vấn đang chạy của người khác; cổng chặn chúng và chỉ để ngỏ đường thêm cột, nhờ đó người dùng cũ có thời gian chuyển sang cột mới.',
    },
    parsons: {
      prompt: 'Xếp cổng tiến hoá schema: chỉ cho thay đổi cộng thêm, chặn thay đổi phá vỡ.',
      lines: [
        'if thaydoi in {"xoacot", "doikieu"}:',
        '    print("deny: tien hoa pha vo")',
        'elif thaydoi == "themcot":',
        '    print("allow: them cot an toan")',
        'else:',
        '    print("allow: khong doi schema")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng khôi phục và tiến hoá schema. Đọc `loai:<restore|schema>,tuoi:<số ngày>,retention:<số ngày>,thaydoi:<themcot|xoacot|doikieu|none>`. Thiếu/thừa trường → `invalid: field`; loai lạ → `invalid: loai`; tuoi hoặc retention không phải số nguyên không âm → `invalid: tuoi` / `invalid: retention`; thaydoi lạ → `invalid: thaydoi`. Với `restore`: tuoi > retention → `deny: ngoai thoi han luu giu, moc gan nhat la <retention> ngay`, còn lại → `allow: khoi phuc duoc`. Với `schema`: thaydoi là `xoacot` hoặc `doikieu` → `deny: tien hoa pha vo`; `themcot` → `allow: them cot an toan`; `none` → `allow: khong doi schema`. Không gọi snapshot hay kho dữ liệu thật.',
      starterCode: '# MÔ PHỎNG snapshot và schema; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['loai:restore,tuoi:5,retention:30,thaydoi:none'],
          expected: 'allow: khoi phuc duoc',
          match: 'contains',
          hidden: false,
          label: 'khôi phục trong thời hạn lưu giữ',
        },
        {
          stdinLines: ['loai:restore,tuoi:90,retention:30,thaydoi:none'],
          expected: 'deny: ngoai thoi han luu giu, moc gan nhat la 30 ngay',
          match: 'contains',
          hidden: true,
          label: 'ngoài thời hạn thì từ chối KÈM mốc gần nhất còn được',
        },
        {
          stdinLines: ['loai:schema,tuoi:0,retention:30,thaydoi:xoacot'],
          expected: 'deny: tien hoa pha vo',
          match: 'contains',
          hidden: true,
          label: 'xoá cột đang có người dùng bị chặn',
        },
        {
          stdinLines: ['loai:schema,tuoi:0,retention:30,thaydoi:themcot'],
          expected: 'allow: them cot an toan',
          match: 'contains',
          hidden: true,
          label: 'thêm cột là đường tiến hoá được phép',
        },
        {
          stdinLines: ['loai:schema,tuoi:0,retention:ba muoi,thaydoi:themcot'],
          expected: 'invalid: retention',
          match: 'contains',
          hidden: true,
          label: 'ca âm — thời hạn lưu giữ sai kiểu fail closed',
        },
      ],
      hints: [
        'Kiểm kiểu dữ liệu của cả hai số TRƯỚC khi rẽ nhánh theo loai, để ca âm luôn ra invalid.',
        'Lời từ chối của restore phải kèm con số mốc gần nhất — đọc lại retention thay vì ghi cứng.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"loai", "tuoi", "retention", "thaydoi"}:
        print("invalid: field")
    elif m["loai"] not in {"restore", "schema"}:
        print("invalid: loai")
    elif so(m["tuoi"]) is None:
        print("invalid: tuoi")
    elif so(m["retention"]) is None:
        print("invalid: retention")
    elif m["thaydoi"] not in {"themcot", "xoacot", "doikieu", "none"}:
        print("invalid: thaydoi")
    elif m["loai"] == "restore":
        if so(m["tuoi"]) > so(m["retention"]):
            print("deny: ngoai thoi han luu giu, moc gan nhat la " + m["retention"] + " ngay")
        else:
            print("allow: khoi phuc duoc")
    elif m["thaydoi"] in {"xoacot", "doikieu"}:
        print("deny: tien hoa pha vo")
    elif m["thaydoi"] == "themcot":
        print("allow: them cot an toan")
    else:
        print("allow: khong doi schema")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chọn một bảng quan trọng và viết ra thời hạn lưu giữ thật của nó cùng mốc cũ nhất bạn khôi phục được; sau đó liệt kê ba thay đổi schema từng làm trong sáu tháng qua và đánh dấu thay đổi nào là cộng thêm, thay đổi nào là phá vỡ.',
    srsCards: [
      {
        hoi: 'Vì sao từ chối khôi phục phải kèm mốc gần nhất còn được?',
        dap: 'Người hỏi đang cần một con số để lập kế hoạch; từ chối suông đẩy họ đi tìm bản sao ngoài luồng, còn từ chối kèm mốc biến giới hạn thành thông tin dùng được.',
      },
      {
        hoi: 'Vì sao thêm cột được phép còn đổi kiểu cột thì không?',
        dap: 'Thêm cột không làm gãy truy vấn cũ vì không ai đang đọc cột chưa tồn tại; đổi kiểu thì mọi truy vấn đang chạy đều có thể vỡ ngay lúc đổi, không có cửa sổ chuyển dần.',
      },
    ],
  },
]
