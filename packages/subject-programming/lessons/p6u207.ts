// lessons/p6u207.ts — P6-U207: HƯỚNG AN TOÀN, chặng S4 — module `security-s4-m2`
// (phát hiện và ứng cứu: luật phát hiện trên nhật ký fixture, ánh xạ ATT&CK, trình tự
// ngăn chặn → diệt trừ → phục hồi).
//
// Bài 1 hỏi "luật phát hiện này có đáng bật không" (bắt được gì, nhiễu bao nhiêu, ánh xạ kỹ thuật
// nào). Bài 2 hỏi "đang ở bước nào của quy trình ứng cứu, và bước đó có được phép chạy chưa".
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Chặng PHÒNG THỦ: chỉ phân loại, quyết định, quy trình. Nhật ký là fixture tổng hợp đã che
// thông tin; simulator Python tất định, hữu hạn, fail closed.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U207_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u207-l1',
    unitId: 'p6-u207',
    language: 'python',
    title: 'MÔ PHỎNG cổng duyệt luật phát hiện (detection rule): ánh xạ ATT&CK và ngưỡng nhiễu',
    hook: 'Một luật báo động suốt ngày nhưng chưa bao giờ đúng sẽ dạy cả đội một thói quen chết người: tắt thông báo.',
    theory:
      'Luật phát hiện (detection rule) chỉ đáng bật khi trả lời được ba câu. Một: nó bắt được gì — chạy trên nhật ký fixture mà không trúng ca dương tính nào thì luật ấy là `noisy`, không được bật, vì nó chỉ sinh việc chứ không sinh tín hiệu. Hai: nó tương ứng kỹ thuật nào trong ATT&CK — luật không ánh xạ được vào một kỹ thuật cụ thể là luật không ai biết nó bảo vệ điều gì. Ba: nhiễu tới mức nào — tỉ lệ dương tính giả vượt ngưỡng đã thoả thuận thì phải chỉnh luật trước khi bật. Đây là MÔ PHỎNG hữu hạn trên số đếm tổng hợp: không SIEM thật, không nhật ký thật, và không có bất kỳ thao tác tấn công nào — chỉ chấm chất lượng luật phòng thủ.',
    workedExample: {
      code: `# MO PHONG cham chat luong luat phat hien; so dem tong hop, khong SIEM that.\ndung, gia, tong, nguong = 0, 4, 40, 10\nprint("noisy: luat khong bat duoc ca duong tinh nao" if dung == 0 else "allow: bat duoc luat")`,
      stdinLines: [],
    },
    predict: {
      code: `gia, tong, nguong = 9, 40, 10\nty = gia * 100 // tong\nprint("noisy: ti le duong tinh gia vuot nguong" if ty > nguong else "allow: bat duoc luat")`,
      question: '9 báo động sai trên 40 sự kiện, ngưỡng nhiễu là 10 phần trăm. Cổng in gì?',
      choices: [
        'noisy: ti le duong tinh gia vuot nguong',
        'allow: bat duoc luat',
        'deny: thieu anh xa ky thuat att&ck',
        'invalid: input',
      ],
      answerIndex: 0,
      explain:
        '9 trên 40 là 22 phần trăm, vượt ngưỡng 10 — luật phải được chỉnh lại trước khi bật, nếu không mỗi ca trực sẽ tốn thời gian cho báo động sai nhiều hơn cho sự cố thật.',
    },
    parsons: {
      prompt: 'Xếp cổng duyệt luật: thiếu ánh xạ loại trước, rồi tới hai luật về chất lượng.',
      lines: [
        'if attack == "none":',
        '    print("deny: thieu anh xa ky thuat att&ck")',
        'elif dung == 0:',
        '    print("noisy: luat khong bat duoc ca duong tinh nao")',
        'elif gia * 100 > nguong * tong:',
        '    print("noisy: ti le duong tinh gia vuot nguong, phai chinh luat")',
        'else:',
        '    print("allow: bat duoc luat")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng duyệt luật phát hiện (detection rule) trên nhật ký fixture tổng hợp. Đọc `luat:<nhãn>,attack:<mã kỹ thuật|none>,dung:<số>,gia:<số>,tong:<số>,nguong:<số phần trăm>` — `dung` là số ca dương tính đúng, `gia` là số dương tính giả, `tong` là số sự kiện trong fixture. Thiếu/thừa trường → `invalid: field`; bốn con số không phải số nguyên không âm → `invalid: so`; tong bằng 0 → `invalid: tong`. Thứ tự ưu tiên tất định: attack là `none` → `deny: thieu anh xa ky thuat att&ck`; dung bằng 0 → `noisy: luat khong bat duoc ca duong tinh nao`; `gia * 100 > nguong * tong` → `noisy: ti le duong tinh gia vuot nguong, phai chinh luat`; còn lại → `allow: bat duoc luat`. Không SIEM thật, không mạng, không file.',
      starterCode:
        '# MÔ PHỎNG chấm chất lượng luật phát hiện; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['luat:dang-nhap-la,attack:T1078,dung:5,gia:2,tong:40,nguong:10'],
          expected: 'allow: bat duoc luat',
          match: 'contains',
          hidden: false,
          label: 'luật có ánh xạ, bắt được ca đúng, nhiễu dưới ngưỡng',
        },
        {
          stdinLines: ['luat:dang-nhap-la,attack:T1078,dung:0,gia:2,tong:40,nguong:10'],
          expected: 'noisy: luat khong bat duoc ca duong tinh nao',
          match: 'contains',
          hidden: true,
          label: 'không bắt được ca dương tính nào thì không được bật',
        },
        {
          stdinLines: ['luat:dang-nhap-la,attack:T1078,dung:5,gia:9,tong:40,nguong:10'],
          expected: 'noisy: ti le duong tinh gia vuot nguong, phai chinh luat',
          match: 'contains',
          hidden: true,
          label: 'nhiễu vượt ngưỡng thì phải chỉnh luật trước',
        },
        {
          stdinLines: ['luat:dang-nhap-la,attack:none,dung:5,gia:2,tong:40,nguong:10'],
          expected: 'deny: thieu anh xa ky thuat att&ck',
          match: 'contains',
          hidden: true,
          label: 'luật không ánh xạ được vào kỹ thuật nào thì không ai biết nó bảo vệ gì',
        },
        {
          stdinLines: ['luat:dang-nhap-la,attack:T1078,dung:5,gia:2,tong:0,nguong:10'],
          expected: 'invalid: tong',
          match: 'contains',
          hidden: true,
          label: 'ca âm — fixture rỗng thì không chấm được, fail closed',
        },
      ],
      hints: [
        'So tỉ lệ bằng phép nhân (`gia * 100 > nguong * tong`) thay vì chia, để không dính sai số và không phải lo chia cho 0.',
        'Kiểm đủ trường và kiểu của cả bốn con số trước khi rẽ nhánh.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"luat", "attack", "dung", "gia", "tong", "nguong"}:
        print("invalid: field")
    elif any(so(m[k]) is None for k in ("dung", "gia", "tong", "nguong")):
        print("invalid: so")
    elif so(m["tong"]) == 0:
        print("invalid: tong")
    elif m["attack"] == "none":
        print("deny: thieu anh xa ky thuat att&ck")
    elif so(m["dung"]) == 0:
        print("noisy: luat khong bat duoc ca duong tinh nao")
    elif so(m["gia"]) * 100 > so(m["nguong"]) * so(m["tong"]):
        print("noisy: ti le duong tinh gia vuot nguong, phai chinh luat")
    else:
        print("allow: bat duoc luat")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy ba luật cảnh báo đang bật ở nơi bạn làm và với mỗi luật ghi ba con số của tháng qua: bao nhiêu lần nó kêu, bao nhiêu lần đúng, và nó tương ứng kỹ thuật nào trong ATT&CK. Luật nào không điền nổi cột thứ ba thì viết một câu giải thích nó đang bảo vệ điều gì — không viết nổi thì đó là luật cần bỏ hoặc viết lại.',
    srsCards: [
      {
        hoi: 'Vì sao luật không bắt được ca dương tính nào lại bị xếp là `noisy` chứ không phải "an toàn"?',
        dap: 'Vì nó vẫn sinh báo động trên fixture mà không trúng ca thật nào; nó chỉ tiêu tốn sự chú ý của người trực và dần dạy họ bỏ qua thông báo — tác hại chứ không phải trung tính.',
      },
      {
        hoi: 'Ánh xạ vào ATT&CK giúp gì ngoài việc cho luật một cái tên đẹp?',
        dap: 'Nó biến tập luật thành một bản đồ độ phủ: nhìn vào là biết kỹ thuật nào đã có người canh và kỹ thuật nào đang trống, thay vì chỉ có một đống luật rời rạc không so được với nhau.',
      },
    ],
  },
  {
    id: 'p6-u207-l2',
    unitId: 'p6-u207',
    language: 'python',
    title:
      'MÔ PHỎNG trình tự ứng cứu sự cố: ngăn chặn (containment) → diệt trừ (eradication) → phục hồi',
    hook: 'Xoá sạch máy bị chiếm trước khi sao lưu chứng cứ là cách nhanh nhất để không bao giờ biết chuyện gì đã xảy ra.',
    theory:
      'Quy trình ứng cứu có thứ tự cứng: ngăn chặn (containment) để sự cố ngừng lan, rồi diệt trừ (eradication) để loại nguyên nhân, rồi mới phục hồi. Hai luật chặn nằm giữa ba bước đó. Một: diệt trừ khi chưa thu thập chứng cứ (evidence) thì phải `block` — chứng cứ bị xoá cùng lúc với nguyên nhân, và cuộc điều tra sau đó không còn gì để dựa vào. Hai: phục hồi khi chưa xác định nguyên nhân gốc là `incomplete` — bật lại dịch vụ trên một hệ còn nguyên lỗ hổng chỉ dời sự cố sang tuần sau. Đây là MÔ PHỎNG hữu hạn trên bản ghi trạng thái tổng hợp; chặng này PHÒNG THỦ, không có thao tác tấn công nào.',
    workedExample: {
      code: `# MO PHONG trinh tu ung cuu; ban ghi trang thai tong hop.\nbuoc, chungcu = "eradication", "none"\nprint("block: dietru truoc khi thu thap chung cu" if buoc == "eradication" and chungcu == "none" else "allow: chay buoc nay duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `buoc, nguyennhan = "recovery", "unknown"\nprint("incomplete: phuc hoi khi chua co nguyen nhan goc" if buoc == "recovery" and nguyennhan == "unknown" else "allow: chay buoc nay duoc")`,
      question: 'Đội muốn phục hồi dịch vụ khi nguyên nhân gốc vẫn chưa rõ. Cổng in gì?',
      choices: [
        'incomplete: phuc hoi khi chua co nguyen nhan goc',
        'allow: chay buoc nay duoc',
        'block: dietru truoc khi thu thap chung cu',
        'invalid: buoc',
      ],
      answerIndex: 0,
      explain:
        'Phục hồi không bị cấm về nguyên tắc, nó chỉ chưa đủ điều kiện — nên kết quả là `incomplete`: còn thiếu nguyên nhân gốc, bổ sung xong thì chạy tiếp.',
    },
    parsons: {
      prompt: 'Xếp cổng trình tự ứng cứu: ngăn chặn luôn được phép, hai bước sau có điều kiện.',
      lines: [
        'if buoc == "containment":',
        '    print("allow: ngan chan truoc de su co ngung lan")',
        'elif buoc == "eradication" and chungcu == "none":',
        '    print("block: dietru truoc khi thu thap chung cu")',
        'elif buoc == "recovery" and nguyennhan == "unknown":',
        '    print("incomplete: phuc hoi khi chua co nguyen nhan goc")',
        'else:',
        '    print("allow: chay buoc nay duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng trình tự ứng cứu sự cố. Đọc `buoc:<containment|eradication|recovery>,chungcu:<collected|none>,nguyennhan:<found|unknown>,ngangchan:<done|no>`. Thiếu/thừa trường → `invalid: field`; buoc lạ → `invalid: buoc`; chungcu lạ → `invalid: chungcu`; nguyennhan lạ → `invalid: nguyennhan`; ngangchan lạ → `invalid: ngangchan`. Thứ tự ưu tiên tất định: buoc là `containment` → `allow: ngan chan truoc de su co ngung lan`; buoc là `eradication` và chungcu là `none` → `block: dietru truoc khi thu thap chung cu`; buoc là `eradication` và ngangchan là `no` → `block: chua ngan chan xong`; buoc là `recovery` và nguyennhan là `unknown` → `incomplete: phuc hoi khi chua co nguyen nhan goc`; còn lại → `allow: chay buoc nay duoc`. Không hệ thật, không mạng, không file.',
      starterCode: '# MÔ PHỎNG trình tự ứng cứu; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['buoc:containment,chungcu:none,nguyennhan:unknown,ngangchan:no'],
          expected: 'allow: ngan chan truoc de su co ngung lan',
          match: 'contains',
          hidden: false,
          label: 'ngăn chặn luôn là bước được phép chạy đầu tiên',
        },
        {
          stdinLines: ['buoc:eradication,chungcu:none,nguyennhan:found,ngangchan:done'],
          expected: 'block: dietru truoc khi thu thap chung cu',
          match: 'contains',
          hidden: true,
          label: 'diệt trừ trước khi thu thập chứng cứ bị chặn',
        },
        {
          stdinLines: ['buoc:eradication,chungcu:collected,nguyennhan:found,ngangchan:no'],
          expected: 'block: chua ngan chan xong',
          match: 'contains',
          hidden: true,
          label: 'diệt trừ khi sự cố còn đang lan thì chặn',
        },
        {
          stdinLines: ['buoc:recovery,chungcu:collected,nguyennhan:unknown,ngangchan:done'],
          expected: 'incomplete: phuc hoi khi chua co nguyen nhan goc',
          match: 'contains',
          hidden: true,
          label: 'phục hồi thiếu nguyên nhân gốc là chưa đủ điều kiện',
        },
        {
          stdinLines: ['buoc:dongbang,chungcu:collected,nguyennhan:found,ngangchan:done'],
          expected: 'invalid: buoc',
          match: 'contains',
          hidden: true,
          label: 'ca âm — bước lạ ngoài ba bước chuẩn thì fail closed',
        },
      ],
      hints: [
        'Kiểm đủ bốn khoá và bốn tập giá trị hợp lệ trước, rồi mới xét luật nghiệp vụ.',
        'Hai luật chặn của bước diệt trừ phải có thứ tự cố định: chứng cứ trước, ngăn chặn sau — trùng điều kiện thì kết quả vẫn tất định.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"buoc", "chungcu", "nguyennhan", "ngangchan"}:
        print("invalid: field")
    elif m["buoc"] not in {"containment", "eradication", "recovery"}:
        print("invalid: buoc")
    elif m["chungcu"] not in {"collected", "none"}:
        print("invalid: chungcu")
    elif m["nguyennhan"] not in {"found", "unknown"}:
        print("invalid: nguyennhan")
    elif m["ngangchan"] not in {"done", "no"}:
        print("invalid: ngangchan")
    elif m["buoc"] == "containment":
        print("allow: ngan chan truoc de su co ngung lan")
    elif m["buoc"] == "eradication" and m["chungcu"] == "none":
        print("block: dietru truoc khi thu thap chung cu")
    elif m["buoc"] == "eradication" and m["ngangchan"] == "no":
        print("block: chua ngan chan xong")
    elif m["buoc"] == "recovery" and m["nguyennhan"] == "unknown":
        print("incomplete: phuc hoi khi chua co nguyen nhan goc")
    else:
        print("allow: chay buoc nay duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một sự cố đã xử lý ở nơi bạn làm (kỹ thuật hay không đều được) và xếp lại các hành động đã làm vào ba nhóm ngăn chặn — diệt trừ — phục hồi theo đúng thứ tự thời gian thật. Chỗ nào thứ tự thật khác thứ tự chuẩn thì ghi lại đã mất thông tin gì vì chuyện đó.',
    srsCards: [
      {
        hoi: 'Vì sao ngăn chặn phải đi trước diệt trừ?',
        dap: 'Vì diệt trừ mất thời gian, và trong khoảng thời gian đó sự cố còn đang lan; ngăn chặn giữ phạm vi thiệt hại đứng yên để phần việc sau làm trên một mục tiêu không đổi.',
      },
      {
        hoi: 'Khác nhau giữa `block` và `incomplete` trong cổng ứng cứu là gì?',
        dap: '`block` là hành động sẽ phá hỏng thứ không lấy lại được (chứng cứ) nên cấm chạy bây giờ; `incomplete` là hành động hợp lệ nhưng đầu vào còn thiếu, bổ sung xong là chạy được.',
      },
    ],
  },
]
