// lessons/p6u208.ts — P6-U208: HƯỚNG AN TOÀN, chặng S4 — module `security-s4-m3` (điều tra số:
// toàn vẹn chứng cứ, dòng thời gian từ nhiều nguồn nhật ký lệch đồng hồ, báo cáo cho lãnh đạo
// và cơ quan quản lý).
//
// Bài 1 hỏi "chứng cứ này còn dùng được không" (chuỗi băm và chuỗi lưu giữ). Bài 2 hỏi "dòng thời
// gian dựng từ nhiều nguồn có đáng tin không, và bản báo cáo đã sạch dữ liệu cá nhân chưa".
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Chặng PHÒNG THỦ. Mọi nhật ký là fixture tổng hợp đã che thông tin; simulator Python tất định,
// hữu hạn, fail closed, không đồng hồ hệ thống.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U208_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u208-l1',
    unitId: 'p6-u208',
    language: 'python',
    title:
      'MÔ PHỎNG cổng toàn vẹn chứng cứ (evidence integrity) và chuỗi lưu giữ (chain of custody)',
    hook: 'Bản sao nhật ký nằm trong thư mục Tải về của một ai đó không phải là chứng cứ — nó chỉ là một tập tin.',
    theory:
      'Chứng cứ số (evidence) chỉ dùng được khi chứng minh được hai điều. Một là tính toàn vẹn (integrity): giá trị băm lấy lúc thu thập phải khớp với giá trị băm lúc kiểm lại — lệch một bit nghĩa là bản đang cầm không còn là bản đã thu. Hai là chuỗi lưu giữ (chain of custody): từ lúc thu tới lúc trình bày, mỗi lần đổi tay đều có người ký nhận; đứt một mắt là không ai bảo đảm được khoảng trống đó. Thiếu một trong hai thì kết luận là `inadmissible` — không phải "vẫn dùng tạm", vì chứng cứ dùng tạm sẽ dẫn tới kết luận sai mà không ai biết. Đây là MÔ PHỎNG hữu hạn trên nhãn trạng thái tổng hợp: không tang vật thật, không nhật ký thật.',
    workedExample: {
      code: `# MO PHONG cong toan ven chung cu; nhan trang thai tong hop, khong tang vat that.\nbam, luugiu = "match", "unbroken"\nprint("allow: chung cu dung duoc" if bam == "match" and luugiu == "unbroken" else "inadmissible: chung cu khong dung duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `bam = "mismatch"\nprint("inadmissible: bam khong khop" if bam == "mismatch" else "allow: chung cu dung duoc")`,
      question: 'Băm lúc kiểm lại không khớp băm lúc thu thập. Cổng in gì?',
      choices: [
        'inadmissible: bam khong khop',
        'allow: chung cu dung duoc',
        'invalid: bam',
        'incomplete: thieu nguoi ky nhan',
      ],
      answerIndex: 0,
      explain:
        'Băm lệch nghĩa là nội dung đã đổi sau khi thu — không biết đổi ở đâu, đổi bao nhiêu, nên toàn bộ bản đó mất tư cách chứng cứ chứ không chỉ phần nghi ngờ.',
    },
    parsons: {
      prompt: 'Xếp cổng chứng cứ fail closed: hai điều kiện toàn vẹn trước, người ký nhận sau.',
      lines: [
        'if bam != "match":',
        '    print("inadmissible: bam khong khop")',
        'elif luugiu != "unbroken":',
        '    print("inadmissible: dut chuoi luu giu")',
        'elif nguoi == "-":',
        '    print("inadmissible: thieu nguoi ky nhan")',
        'else:',
        '    print("allow: chung cu dung duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng toàn vẹn chứng cứ (evidence integrity) và chuỗi lưu giữ (chain of custody). Đọc `vat:<nhãn>,bam:<match|mismatch>,luugiu:<unbroken|broken>,nguoi:<tên|->`. Thiếu/thừa trường → `invalid: field`; bam lạ → `invalid: bam`; luugiu lạ → `invalid: luugiu`. Thứ tự ưu tiên tất định: bam khác `match` → `inadmissible: bam khong khop`; luugiu khác `unbroken` → `inadmissible: dut chuoi luu giu`; nguoi là `-` → `inadmissible: thieu nguoi ky nhan`; còn lại → `allow: chung cu dung duoc`. Chỉ dùng NHÃN tổng hợp, không nội dung chứng cứ thật, không mạng, không file.',
      starterCode:
        '# MÔ PHỎNG cổng chứng cứ; chỉ tính trên nhãn trạng thái, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['vat:anh-dia-a,bam:match,luugiu:unbroken,nguoi:dieu-tra-vien-1'],
          expected: 'allow: chung cu dung duoc',
          match: 'contains',
          hidden: false,
          label: 'băm khớp, chuỗi lưu giữ liền mạch, có người ký nhận',
        },
        {
          stdinLines: ['vat:anh-dia-a,bam:mismatch,luugiu:unbroken,nguoi:dieu-tra-vien-1'],
          expected: 'inadmissible: bam khong khop',
          match: 'contains',
          hidden: true,
          label: 'băm lệch thì mất tư cách chứng cứ',
        },
        {
          stdinLines: ['vat:anh-dia-a,bam:match,luugiu:broken,nguoi:dieu-tra-vien-1'],
          expected: 'inadmissible: dut chuoi luu giu',
          match: 'contains',
          hidden: true,
          label: 'đứt chuỗi lưu giữ thì cũng mất tư cách chứng cứ',
        },
        {
          stdinLines: ['vat:anh-dia-a,bam:match,luugiu:unbroken,nguoi:-'],
          expected: 'inadmissible: thieu nguoi ky nhan',
          match: 'contains',
          hidden: true,
          label: 'không ai ký nhận thì không có ai bảo đảm khoảng trống',
        },
        {
          stdinLines: ['vat:anh-dia-a,bam:chua-kiem,luugiu:unbroken,nguoi:dieu-tra-vien-1'],
          expected: 'invalid: bam',
          match: 'contains',
          hidden: true,
          label: 'ca âm — trạng thái băm lạ thì fail closed',
        },
      ],
      hints: [
        'Kiểm đủ bốn khoá trước khi đọc giá trị, rồi kiểm tập giá trị hợp lệ của hai cờ.',
        'Thứ tự ba lý do `inadmissible` phải cố định để hai khiếm khuyết cùng lúc vẫn cho một kết quả.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"vat", "bam", "luugiu", "nguoi"}:
        print("invalid: field")
    elif m["bam"] not in {"match", "mismatch"}:
        print("invalid: bam")
    elif m["luugiu"] not in {"unbroken", "broken"}:
        print("invalid: luugiu")
    elif m["bam"] != "match":
        print("inadmissible: bam khong khop")
    elif m["luugiu"] != "unbroken":
        print("inadmissible: dut chuoi luu giu")
    elif m["nguoi"] == "-":
        print("inadmissible: thieu nguoi ky nhan")
    else:
        print("allow: chung cu dung duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chọn một lần bạn từng tải nhật ký về máy để điều tra một sự cố và viết lại: bản đó có băm lúc thu không, đã qua tay mấy người, và ai ký nhận ở từng lần. Viết ra một quy trình ba dòng để lần sau bản sao đó đủ tư cách chứng cứ ngay từ đầu.',
    srsCards: [
      {
        hoi: 'Vì sao băm lệch làm hỏng cả bản chứng cứ chứ không chỉ phần bị sửa?',
        dap: 'Vì băm chỉ nói "có khác" chứ không nói khác ở đâu; không xác định được phần nào còn nguyên thì không phần nào dựa vào được.',
      },
      {
        hoi: 'Chuỗi lưu giữ bảo vệ điều gì mà giá trị băm không bảo vệ được?',
        dap: 'Băm chứng minh nội dung không đổi, chuỗi lưu giữ chứng minh bản đó đến từ đâu và ai từng cầm — không có nó thì một bản khớp băm vẫn có thể là bản dựng từ nguồn khác.',
      },
    ],
  },
  {
    id: 'p6-u208-l2',
    unitId: 'p6-u208',
    language: 'python',
    title: 'MÔ PHỎNG dòng thời gian đa nguồn: chuẩn hoá UTC, gắn cờ bất định và redact báo cáo',
    hook: 'Hai máy chủ lệch đồng hồ ba phút là đủ để một dòng thời gian sự cố kể ngược thứ tự nguyên nhân và hậu quả.',
    theory:
      'Dựng dòng thời gian sự cố từ nhiều nguồn nhật ký có hai cái bẫy. Bẫy thứ nhất là múi giờ và lệch đồng hồ: mốc thời gian phải được chuẩn hoá về UTC và độ lệch còn lại phải được GẮN CỜ bất định — cấm im lặng sắp xếp, vì một bảng đã sắp xếp trông như sự thật trong khi thứ tự của nó có thể do sai số quyết định. Khi độ lệch vượt ngưỡng thì dòng thời gian là `incomplete`: chưa dùng để kết luận nhân quả được. Bẫy thứ hai nằm ở bản báo cáo gửi lãnh đạo và cơ quan quản lý: còn dữ liệu cá nhân thô thì phải `redact` trước khi gửi. Đây là MÔ PHỎNG hữu hạn trên độ lệch tính bằng phút, dùng nhãn tổng hợp: không nhật ký thật, không đồng hồ hệ thống, không dữ liệu cá nhân thật.',
    workedExample: {
      code: `# MO PHONG chuan hoa UTC va co bat dinh; do lech tinh bang phut, khong dong ho he thong.\nlech, nguong = 2, 5\nprint("allow: chuan hoa utc, gan co bat dinh " + str(lech) + " phut" if lech <= nguong else "incomplete: do bat dinh vuot nguong")`,
      stdinLines: [],
    },
    predict: {
      code: `canhan = "raw"\nprint("redact: bao cao con du lieu ca nhan tho" if canhan == "raw" else "allow: bao cao gui duoc")`,
      question: 'Bản báo cáo sự cố vẫn còn dữ liệu cá nhân ở dạng thô. Cổng in gì?',
      choices: [
        'redact: bao cao con du lieu ca nhan tho',
        'allow: bao cao gui duoc',
        'incomplete: do bat dinh vuot nguong',
        'invalid: canhan',
      ],
      answerIndex: 0,
      explain:
        'Báo cáo không bị cấm gửi, nó chỉ chưa ở dạng gửi được: che dữ liệu cá nhân xong là gửi — nên quyết định đúng là `redact` chứ không phải từ chối.',
    },
    parsons: {
      prompt:
        'Xếp cổng báo cáo sự cố: che dữ liệu cá nhân trước, rồi mới xét độ tin của dòng thời gian.',
      lines: [
        'if canhan == "raw":',
        '    print("redact: bao cao con du lieu ca nhan tho")',
        'elif lech > nguong:',
        '    print("incomplete: do bat dinh vuot nguong")',
        'elif lech > 0:',
        '    print("allow: chuan hoa utc, gan co bat dinh")',
        'else:',
        '    print("allow: dong thoi gian chac chan")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng dòng thời gian đa nguồn và báo cáo sự cố. Đọc `nguon:<số nguồn>,lech:<số phút>,nguong:<số phút>,canhan:<raw|masked>` — `lech` là độ lệch đồng hồ lớn nhất giữa các nguồn sau khi đã chuẩn hoá về UTC. Thiếu/thừa trường → `invalid: field`; ba con số không phải số nguyên không âm → `invalid: so`; canhan lạ → `invalid: canhan`; nguon nhỏ hơn 2 → `unknown: chua du nguon de dung dong thoi gian`. Thứ tự ưu tiên tất định: canhan là `raw` → `redact: bao cao con du lieu ca nhan tho`; lech lớn hơn nguong → `incomplete: do bat dinh vuot nguong, khong ket luan nhan qua`; lech lớn hơn 0 → `allow: chuan hoa utc, gan co bat dinh <lech> phut`; còn lại → `allow: dong thoi gian chac chan`. Không nhật ký thật, không đồng hồ hệ thống, không mạng, không file.',
      starterCode: '# MÔ PHỎNG dòng thời gian; mốc đã chuẩn hoá UTC, chỉ tính trên dòng nhập.\n',
      testCases: [
        {
          stdinLines: ['nguon:3,lech:2,nguong:5,canhan:masked'],
          expected: 'allow: chuan hoa utc, gan co bat dinh 2 phut',
          match: 'contains',
          hidden: false,
          label: 'lệch trong ngưỡng thì dùng được nhưng phải gắn cờ bất định',
        },
        {
          stdinLines: ['nguon:3,lech:0,nguong:5,canhan:masked'],
          expected: 'allow: dong thoi gian chac chan',
          match: 'contains',
          hidden: true,
          label: 'không lệch thì không cần cờ bất định',
        },
        {
          stdinLines: ['nguon:3,lech:9,nguong:5,canhan:masked'],
          expected: 'incomplete: do bat dinh vuot nguong, khong ket luan nhan qua',
          match: 'contains',
          hidden: true,
          label: 'lệch vượt ngưỡng thì cấm im lặng sắp xếp rồi kết luận',
        },
        {
          stdinLines: ['nguon:3,lech:2,nguong:5,canhan:raw'],
          expected: 'redact: bao cao con du lieu ca nhan tho',
          match: 'contains',
          hidden: true,
          label: 'báo cáo còn dữ liệu cá nhân thô thì phải che trước khi gửi',
        },
        {
          stdinLines: ['nguon:3,lech:hai,nguong:5,canhan:masked'],
          expected: 'invalid: so',
          match: 'contains',
          hidden: true,
          label: 'ca âm — độ lệch sai kiểu thì fail closed',
        },
      ],
      hints: [
        'Kiểm kiểu cả ba con số trong một biểu thức `any(...)` cho gọn và tất định.',
        'Nhánh in độ lệch phải đọc lại giá trị nhập, đừng ghi cứng con số.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"nguon", "lech", "nguong", "canhan"}:
        print("invalid: field")
    elif any(so(m[k]) is None for k in ("nguon", "lech", "nguong")):
        print("invalid: so")
    elif m["canhan"] not in {"raw", "masked"}:
        print("invalid: canhan")
    elif so(m["nguon"]) < 2:
        print("unknown: chua du nguon de dung dong thoi gian")
    elif m["canhan"] == "raw":
        print("redact: bao cao con du lieu ca nhan tho")
    elif so(m["lech"]) > so(m["nguong"]):
        print("incomplete: do bat dinh vuot nguong, khong ket luan nhan qua")
    elif so(m["lech"]) > 0:
        print("allow: chuan hoa utc, gan co bat dinh " + m["lech"] + " phut")
    else:
        print("allow: dong thoi gian chac chan")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy hai nguồn nhật ký khác nhau của cùng một hệ và kiểm xem chúng ghi thời gian theo múi giờ nào, lệch nhau bao nhiêu. Viết ra một câu quy ước cho đội: mọi nhật ký ghi theo UTC, và mọi dòng thời gian sự cố phải nói rõ độ bất định còn lại là bao nhiêu.',
    srsCards: [
      {
        hoi: 'Vì sao im lặng sắp xếp dòng thời gian lại nguy hiểm hơn là nói "không biết thứ tự"?',
        dap: 'Vì bảng đã sắp xếp trông như sự thật và người đọc sẽ rút nhân quả từ nó; nói rõ độ bất định giữ cho kết luận dừng đúng chỗ dữ liệu dừng.',
      },
      {
        hoi: 'Vì sao báo cáo còn dữ liệu cá nhân thô ra `redact` chứ không ra `deny`?',
        dap: 'Vì bản thân việc báo cáo là bắt buộc và đúng; chỉ có dạng trình bày là chưa đạt, che xong là gửi được ngay.',
      },
    ],
  },
]
