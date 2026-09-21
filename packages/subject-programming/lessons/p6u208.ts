// lessons/p6u208.ts — P6-U208: HƯỚNG BẢO MẬT, chặng S4 — module `security-s4-m3` (điều tra số:
// toàn vẹn chứng cứ, chuỗi lưu giữ, dòng thời gian từ nhiều nguồn lệch đồng hồ, báo cáo).
//
// Bài 1 hỏi "mẩu chứng cứ này còn dùng được không" (băm khớp không, chuỗi lưu giữ có đứt không).
// Bài 2 hỏi "mốc thời gian này đặt được vào dòng thời gian chưa, và báo cáo này phát hành được
// chưa" (chuẩn hoá về UTC kèm cờ bất định; báo cáo còn dữ liệu cá nhân thô thì phải che).
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Mọi mã băm và mốc thời gian trong bài là fixture TỔNG HỢP; không vụ việc thật, không dữ liệu
// cá nhân thật, không đồng hồ hệ thống.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U208_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u208-l1',
    unitId: 'p6-u208',
    language: 'python',
    title: 'MÔ PHỎNG cổng toàn vẹn chứng cứ (integrity) và chuỗi lưu giữ (chain of custody)',
    hook: 'Chứng cứ không mất giá trị vì nội dung sai — nó mất giá trị vì không còn ai chứng minh được nó chưa bị đụng vào.',
    theory:
      'Điều tra số đứng trên hai cột. Cột thứ nhất là tính toàn vẹn (integrity): lấy mã băm của mẩu chứng cứ ngay lúc thu, rồi so lại ở mọi lần dùng — lệch một ký tự nghĩa là nó đã thay đổi, và không ai nói được thay đổi ở chỗ nào. Cột thứ hai là chuỗi lưu giữ (chain of custody): sổ ghi ai giữ, từ lúc nào tới lúc nào, bàn giao cho ai; đứt một mắt là có một quãng thời gian không ai chịu trách nhiệm, và cả mẩu chứng cứ mất tư cách.\nMục đích phòng thủ của bài: kết luận của một cuộc điều tra chỉ vững bằng mắt xích yếu nhất trong hai cột đó, nên phải biết nói "inadmissible" sớm thay vì xây lập luận trên nền cát. Đây là MÔ PHỎNG trên bản ghi tổng hợp, không vụ việc thật.',
    workedExample: {
      code: `# MO PHONG cong toan ven chung cu; ma bam la fixture tong hop, khong phai vu viec that.\nbam_goc, bam_nay = "a1b2c3", "a1b2c9"\nprint("inadmissible: bam khong khop" if bam_goc != bam_nay else "allow: chung cu dung duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `chuoi = "dut"\nprint("inadmissible: dut chuoi luu giu" if chuoi == "dut" else "allow: chung cu dung duoc")`,
      question: 'Mã băm khớp nhưng sổ bàn giao thiếu mất một chặng. Cổng MÔ PHỎNG in gì?',
      choices: [
        'inadmissible: dut chuoi luu giu',
        'allow: chung cu dung duoc',
        'inadmissible: bam khong khop',
        'redact: con du lieu ca nhan tho',
      ],
      answerIndex: 0,
      explain:
        'Băm khớp chỉ chứng minh nội dung không đổi, không chứng minh ai giữ nó trong quãng trống đó; thiếu mắt xích trong sổ bàn giao là thiếu người chịu trách nhiệm, nên mẩu chứng cứ không dùng được.',
    },
    parsons: {
      prompt: 'Xếp cổng chứng cứ: so băm trước, rồi mới xét chuỗi lưu giữ.',
      lines: [
        'if bam_goc != bam_nay:',
        '    print("inadmissible: bam khong khop")',
        'elif chuoi == "dut":',
        '    print("inadmissible: dut chuoi luu giu")',
        'else:',
        '    print("allow: chung cu dung duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng toàn vẹn chứng cứ và chuỗi lưu giữ. Đọc `bamgoc:<chuỗi hex>,bamnay:<chuỗi hex>,chuoi:<lientuc|dut>,nguoigiu:<tên|->`. Thiếu/thừa trường → `invalid: field`; `chuoi` lạ → `invalid: chuoi`; `bamgoc` hoặc `bamnay` rỗng → `invalid: bam`; `nguoigiu` là `-` → `invalid: nguoi giu` (không ghi ai giữ thì sổ bàn giao vô nghĩa). Sau đó: hai mã băm khác nhau → `inadmissible: bam khong khop`; chuỗi `dut` → `inadmissible: dut chuoi luu giu`; còn lại → `allow: chung cu dung duoc`. Mã băm trong bài là fixture tổng hợp; không tính băm thật, không đọc file.',
      starterCode: '# MÔ PHỎNG cổng chứng cứ; chỉ so chuỗi của dòng nhập, không đọc file.\n',
      testCases: [
        {
          stdinLines: ['bamgoc:a1b2c3,bamnay:a1b2c3,chuoi:lientuc,nguoigiu:doi-ung-cuu'],
          expected: 'allow: chung cu dung duoc',
          match: 'contains',
          hidden: false,
          label: 'băm khớp và sổ bàn giao liền mạch',
        },
        {
          stdinLines: ['bamgoc:a1b2c3,bamnay:a1b2c9,chuoi:lientuc,nguoigiu:doi-ung-cuu'],
          expected: 'inadmissible: bam khong khop',
          match: 'contains',
          hidden: true,
          label: 'lệch một ký tự băm là mất toàn vẹn',
        },
        {
          stdinLines: ['bamgoc:a1b2c3,bamnay:a1b2c3,chuoi:dut,nguoigiu:doi-ung-cuu'],
          expected: 'inadmissible: dut chuoi luu giu',
          match: 'contains',
          hidden: true,
          label: 'đứt chuỗi lưu giữ thì băm khớp cũng không cứu được',
        },
        {
          stdinLines: ['bamgoc:a1b2c3,bamnay:a1b2c3,chuoi:lientuc,nguoigiu:-'],
          expected: 'invalid: nguoi giu',
          match: 'contains',
          hidden: true,
          label: 'không ghi người giữ thì sổ bàn giao vô nghĩa',
        },
        {
          stdinLines: ['bamgoc:a1b2c3,bamnay:a1b2c3,chuoi:co-le,nguoigiu:doi-ung-cuu'],
          expected: 'invalid: chuoi',
          match: 'contains',
          hidden: true,
          label: 'ca âm — trạng thái chuỗi lạ fail closed',
        },
      ],
      hints: [
        'Kiểm đủ bốn khoá trước, rồi kiểm từng giá trị có hợp lệ không, cuối cùng mới so băm.',
        'So băm bằng phép so chuỗi thường là đủ cho MÔ PHỎNG — bài này dạy trình tự quyết định, không dạy mật mã.',
        'Không đọc file, không tính băm thật, không dùng thời gian thực.',
      ],
      sampleSolution: `try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"bamgoc", "bamnay", "chuoi", "nguoigiu"}:
        print("invalid: field")
    elif m["chuoi"] not in {"lientuc", "dut"}:
        print("invalid: chuoi")
    elif m["bamgoc"] == "" or m["bamnay"] == "":
        print("invalid: bam")
    elif m["nguoigiu"] == "-":
        print("invalid: nguoi giu")
    elif m["bamgoc"] != m["bamnay"]:
        print("inadmissible: bam khong khop")
    elif m["chuoi"] == "dut":
        print("inadmissible: dut chuoi luu giu")
    else:
        print("allow: chung cu dung duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chọn một tệp nhật ký mà đội bạn sẽ cần tới nếu có sự cố, rồi viết ra: ai đang giữ bản gốc, bản sao nằm ở đâu, và bạn chứng minh bằng cách nào rằng bản sao đó chưa bị sửa — chỗ nào không trả lời được là chỗ chuỗi lưu giữ đang đứt.',
    srsCards: [
      {
        hoi: 'Mã băm khớp chứng minh được điều gì, và KHÔNG chứng minh được điều gì?',
        dap: 'Nó chứng minh nội dung không đổi kể từ lúc lấy băm, nhưng không nói ai đã giữ mẩu chứng cứ trong quãng đó — phần đó chỉ sổ chuỗi lưu giữ mới trả lời được.',
      },
      {
        hoi: 'Vì sao đứt một mắt trong sổ bàn giao lại loại bỏ cả mẩu chứng cứ?',
        dap: 'Vì trong quãng trống đó không ai chịu trách nhiệm, nên không thể bác được giả thuyết rằng nó đã bị đụng vào; lập luận dựng trên nó sẽ đổ ngay khi bị hỏi.',
      },
    ],
  },
  {
    id: 'p6-u208-l2',
    unitId: 'p6-u208',
    language: 'python',
    title: 'MÔ PHỎNG chuẩn hoá mốc thời gian về UTC kèm cờ bất định, và che (redact) báo cáo',
    hook: 'Hai máy lệch nhau bốn giây đủ để dòng thời gian kể ngược câu chuyện: hậu quả xảy ra trước nguyên nhân.',
    theory:
      'Dựng dòng thời gian sự cố từ nhiều nguồn nhật ký là việc gộp các mốc ghi ở nhiều múi giờ và nhiều đồng hồ lệch nhau. Luật bắt buộc có hai vế: (1) quy mọi mốc về UTC để so được với nhau; (2) khi độ lệch đồng hồ của nguồn vượt ngưỡng, phải GẮN CỜ bất định thay vì âm thầm sắp xếp — vì thứ tự do máy xếp ra lúc đó là phỏng đoán, mà người đọc lại tưởng là sự kiện.\nVế thứ hai của bài là báo cáo: bản gửi lãnh đạo hay cơ quan quản lý chỉ cần kết luận và bằng chứng, không cần dữ liệu cá nhân thô — còn dữ liệu thô thì phải che (redact) trước khi phát hành. Mục đích phòng thủ: một cuộc điều tra xử lý sự cố rò dữ liệu không được tự mình làm rò thêm lần nữa. MÔ PHỎNG hữu hạn: không đồng hồ hệ thống, không nhật ký thật, không dữ liệu cá nhân thật.',
    workedExample: {
      code: `# MO PHONG chuan hoa moc thoi gian ve UTC kem co bat dinh; so lieu tong hop.\nlech, nguong = 9, 3  # do lech dong ho cua nguon, tinh bang giay\nprint("unknown: moc bat dinh vuot nguong" if lech > nguong else "allow: moc chuan hoa ve utc")`,
      stdinLines: [],
    },
    predict: {
      code: `noidung = "tho"\nprint("redact: bao cao con du lieu ca nhan tho" if noidung == "tho" else "allow: bao cao phat hanh duoc")`,
      question: 'Bản báo cáo gửi lãnh đạo vẫn còn dữ liệu cá nhân chưa che. In gì?',
      choices: [
        'redact: bao cao con du lieu ca nhan tho',
        'allow: bao cao phat hanh duoc',
        'unknown: moc bat dinh vuot nguong',
        'inadmissible: dut chuoi luu giu',
      ],
      answerIndex: 0,
      explain:
        'Quyết định không phải là chặn báo cáo mà là chỉ ra việc phải làm trước khi phát hành: che phần dữ liệu thô đi, vì kết luận và bằng chứng vẫn đứng vững khi không có nó.',
    },
    parsons: {
      prompt: 'Xếp cổng dòng thời gian: quy về UTC trước, rồi mới quyết định gắn cờ bất định.',
      lines: [
        'utc = gio - offset',
        'if lech > nguong:',
        '    print("unknown: moc bat dinh vuot nguong")',
        'else:',
        '    print("allow: moc chuan hoa ve utc " + str(utc))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng dòng thời gian và cổng phát hành báo cáo. Đọc `loai:<moc|baocao>,gio:<0-23>,offset:<-12..14>,lech:<số giây>,nguong:<số giây>,noidung:<tho|da-che>`. Thiếu/thừa trường → `invalid: field`; `loai` hoặc `noidung` lạ → `invalid: loai` / `invalid: noidung`; `gio` ngoài 0–23 hoặc sai kiểu → `invalid: gio`; `offset` sai kiểu hoặc ngoài -12..14 → `invalid: offset`; `lech`/`nguong` không phải số nguyên không âm → `invalid: lech` / `invalid: nguong`. Với `moc`: độ lệch vượt ngưỡng → `unknown: moc bat dinh vuot nguong`; còn lại → `allow: moc chuan hoa ve utc <giờ UTC>` với giờ UTC = `(gio - offset) % 24`. Với `baocao`: nội dung `tho` → `redact: bao cao con du lieu ca nhan tho`; `da-che` → `allow: bao cao phat hanh duoc`. Không dùng đồng hồ hệ thống, không in dữ liệu cá nhân.',
      starterCode: '# MÔ PHỎNG dòng thời gian và báo cáo; không dùng đồng hồ hệ thống.\n',
      testCases: [
        {
          stdinLines: ['loai:moc,gio:9,offset:7,lech:1,nguong:3,noidung:da-che'],
          expected: 'allow: moc chuan hoa ve utc 2',
          match: 'contains',
          hidden: false,
          label: '9 giờ ở múi +7 quy về 2 giờ UTC',
        },
        {
          stdinLines: ['loai:moc,gio:3,offset:7,lech:1,nguong:3,noidung:da-che'],
          expected: 'allow: moc chuan hoa ve utc 20',
          match: 'contains',
          hidden: true,
          label: 'quy đổi lùi qua nửa đêm phải vòng về 20 giờ hôm trước',
        },
        {
          stdinLines: ['loai:moc,gio:9,offset:7,lech:9,nguong:3,noidung:da-che'],
          expected: 'unknown: moc bat dinh vuot nguong',
          match: 'contains',
          hidden: true,
          label: 'lệch đồng hồ vượt ngưỡng thì gắn cờ, không âm thầm sắp xếp',
        },
        {
          stdinLines: ['loai:baocao,gio:9,offset:7,lech:1,nguong:3,noidung:tho'],
          expected: 'redact: bao cao con du lieu ca nhan tho',
          match: 'contains',
          hidden: true,
          label: 'báo cáo còn dữ liệu thô phải che trước khi phát hành',
        },
        {
          stdinLines: ['loai:baocao,gio:9,offset:7,lech:1,nguong:3,noidung:da-che'],
          expected: 'allow: bao cao phat hanh duoc',
          match: 'contains',
          hidden: true,
          label: 'đã che thì phát hành được',
        },
        {
          stdinLines: ['loai:moc,gio:25,offset:7,lech:1,nguong:3,noidung:da-che'],
          expected: 'invalid: gio',
          match: 'contains',
          hidden: true,
          label: 'ca âm — giờ ngoài 0–23 fail closed',
        },
      ],
      hints: [
        'Kiểm kiểu và miền giá trị của cả bốn số TRƯỚC khi rẽ theo loai.',
        'offset có thể âm nên đừng dùng isdigit() trực tiếp — cắt dấu trừ ra rồi mới kiểm.',
        'Phép `% 24` của Python luôn cho kết quả không âm, nên quy đổi lùi qua nửa đêm tự vòng đúng.',
      ],
      sampleSolution: `def nguyen(x):
    return int(x) if x.lstrip("-").isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"loai", "gio", "offset", "lech", "nguong", "noidung"}:
        print("invalid: field")
    elif m["loai"] not in {"moc", "baocao"}:
        print("invalid: loai")
    elif m["noidung"] not in {"tho", "da-che"}:
        print("invalid: noidung")
    elif nguyen(m["gio"]) is None or not 0 <= nguyen(m["gio"]) <= 23:
        print("invalid: gio")
    elif nguyen(m["offset"]) is None or not -12 <= nguyen(m["offset"]) <= 14:
        print("invalid: offset")
    elif not m["lech"].isdigit():
        print("invalid: lech")
    elif not m["nguong"].isdigit():
        print("invalid: nguong")
    elif m["loai"] == "moc":
        if int(m["lech"]) > int(m["nguong"]):
            print("unknown: moc bat dinh vuot nguong")
        else:
            print("allow: moc chuan hoa ve utc " + str((nguyen(m["gio"]) - nguyen(m["offset"])) % 24))
    elif m["noidung"] == "tho":
        print("redact: bao cao con du lieu ca nhan tho")
    else:
        print("allow: bao cao phat hanh duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy ba nguồn nhật ký khác nhau của hệ bạn và ghi lại: mỗi nguồn ghi thời gian theo múi nào, đồng hồ của nó được đồng bộ bằng gì, và lệch bao nhiêu là bình thường — con số đó chính là ngưỡng bất định bạn phải gắn cờ khi dựng dòng thời gian.',
    srsCards: [
      {
        hoi: 'Khi độ lệch đồng hồ của một nguồn vượt ngưỡng, vì sao không được cứ sắp xếp theo mốc đã có?',
        dap: 'Vì thứ tự xếp ra lúc đó là phỏng đoán nhưng lại được đọc như sự kiện; gắn cờ bất định giữ nguyên thông tin mà không biến phỏng đoán thành kết luận.',
      },
      {
        hoi: 'Vì sao báo cáo sự cố nên che dữ liệu cá nhân thô thay vì gửi kèm cho đầy đủ?',
        dap: 'Vì kết luận và bằng chứng vẫn đứng vững khi không có nó, còn bản báo cáo thì đi qua nhiều tay — gửi kèm là tự mở thêm một lần rò dữ liệu nữa.',
      },
    ],
  },
]
