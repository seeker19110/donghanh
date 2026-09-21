// lessons/p6u204.ts — P6-U204: HƯỚNG DỮ LIỆU, chặng S4 — module `data-s4-m3` (định nghĩa chỉ số).
//
// Bài 1: một TÊN chỉ số chỉ được có ĐÚNG MỘT định nghĩa; hai định nghĩa cùng tên là `conflict`
// phải nêu rõ khác nhau ở đâu, và simulator TUYỆT ĐỐI không tự chọn giúp một bên. Bài 2: hai con
// số khác hạt (grain) hoặc khác múi giờ thì không so được, dù cùng tên và cùng nhìn "hợp lý".
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U204_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u204-l1',
    unitId: 'p6-u204',
    language: 'python',
    title: 'MÔ PHỎNG tầng chỉ số: một tên một định nghĩa, và phiên bản (version) bắt buộc khi đổi',
    hook: 'Hai phòng ban cùng nói "doanh thu tháng này", ra hai con số, và cả hai đều đúng theo định nghĩa của mình. Đó không phải lỗi số liệu, đó là lỗi quản trị tên.',
    theory:
      'Tầng chỉ số (metric layer) cam kết một điều duy nhất: mỗi TÊN chỉ số có đúng MỘT định nghĩa, gồm bộ lọc, hạt (grain), mẫu số và múi giờ, kèm số phiên bản (version). Khi ai đó đăng ký một định nghĩa thứ hai dưới cùng tên, tầng chỉ số phải trả `conflict` và nêu rõ khác nhau ở phần nào — nó KHÔNG được tự chọn một bên, vì chọn giúp nghĩa là im lặng đổi ý nghĩa con số của người khác. Khi đổi định nghĩa mà không tăng phiên bản thì mọi báo cáo cũ bỗng nói một chuyện khác dưới cùng nhãn: phải `deny`. MÔ PHỎNG hữu hạn trên sổ đăng ký tổng hợp, không kết nối tầng chỉ số thật.',
    workedExample: {
      code: `# MO PHONG so dang ky chi so; du lieu tong hop.\ncu = "donedeal/ngay/tatca/utc"\nmoi = "donedeal/thang/tatca/utc"\nkhac = [t for t, (a, b) in zip(["loc", "grain", "mausu", "muigio"], zip(cu.split("/"), moi.split("/"))) if a != b]\nprint("conflict: khac o " + ";".join(khac) if khac else "allow: dinh nghia khong doi")`,
      stdinLines: [],
    },
    predict: {
      code: `hanhdong, khac, pb, pb_cu = "capnhat", True, 2, 2\nprint("deny: doi dinh nghia ma khong tang version" if khac and pb == pb_cu else "allow: cap nhat version 3")`,
      question: 'Đội chủ quản sửa bộ lọc của chỉ số nhưng giữ nguyên số phiên bản. Cổng in gì?',
      choices: [
        'deny: doi dinh nghia ma khong tang version',
        'allow: cap nhat version 3',
        'conflict: khac o loc',
        'incomparable: khac grain',
      ],
      answerIndex: 0,
      explain:
        'Số phiên bản là thứ duy nhất cho báo cáo cũ biết nó đang nói về định nghĩa nào; đổi nội dung mà giữ nguyên phiên bản khiến mọi con số đã in ra trước đó lặng lẽ sai nghĩa.',
    },
    parsons: {
      prompt:
        'Xếp cổng đăng ký chỉ số: phát hiện khác biệt trước, rồi mới xét hành động và phiên bản.',
      lines: [
        'if not khac:',
        '    print("allow: dinh nghia khong doi")',
        'elif hanhdong == "dangky":',
        '    print("conflict: khac o " + ";".join(khac))',
        'elif pb <= pb_cu:',
        '    print("deny: doi dinh nghia ma khong tang version")',
        'else:',
        '    print("allow: cap nhat version " + str(pb))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG sổ đăng ký tầng chỉ số. Đọc `hanhdong:<dangky|capnhat>,cu:<loc/grain/mausu/muigio>,moi:<loc/grain/mausu/muigio>,pbcu:<số>,pb:<số>`. Thiếu/thừa trường → `invalid: field`; hanhdong lạ → `invalid: hanhdong`; `cu` hoặc `moi` không đủ bốn phần → `invalid: cu` / `invalid: moi`; pb hoặc pbcu không phải số nguyên không âm → `invalid: pb` / `invalid: pbcu`. Sau đó: hai định nghĩa giống hệt → `allow: dinh nghia khong doi`; khác nhau và hanhdong là `dangky` → `conflict: khac o <tên các phần khác nhau, nối bằng ;, theo thứ tự loc;grain;mausu;muigio>` và KHÔNG được tự chọn bên nào; khác nhau, hanhdong là `capnhat` và pb <= pbcu → `deny: doi dinh nghia ma khong tang version`; còn lại → `allow: cap nhat version <pb>`. Không kết nối tầng chỉ số thật.',
      starterCode: '# MÔ PHỎNG tầng chỉ số; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: [
            'hanhdong:capnhat,cu:donedeal/ngay/tatca/utc,moi:donedeal/ngay/tatca/utc,pbcu:2,pb:2',
          ],
          expected: 'allow: dinh nghia khong doi',
          match: 'contains',
          hidden: false,
          label: 'không đổi gì thì không cần phiên bản mới',
        },
        {
          stdinLines: [
            'hanhdong:dangky,cu:donedeal/ngay/tatca/utc,moi:donedeal/thang/tatca/ict,pbcu:2,pb:2',
          ],
          expected: 'conflict: khac o grain;muigio',
          match: 'contains',
          hidden: true,
          label: 'hai định nghĩa cùng tên — nêu đúng chỗ khác, không tự chọn',
        },
        {
          stdinLines: [
            'hanhdong:capnhat,cu:donedeal/ngay/tatca/utc,moi:thangcong/ngay/tatca/utc,pbcu:2,pb:2',
          ],
          expected: 'deny: doi dinh nghia ma khong tang version',
          match: 'contains',
          hidden: true,
          label: 'đổi nội dung mà giữ nguyên phiên bản bị chặn',
        },
        {
          stdinLines: [
            'hanhdong:capnhat,cu:donedeal/ngay/tatca/utc,moi:thangcong/ngay/tatca/utc,pbcu:2,pb:3',
          ],
          expected: 'allow: cap nhat version 3',
          match: 'contains',
          hidden: true,
          label: 'đổi kèm tăng phiên bản là đường hợp lệ',
        },
        {
          stdinLines: [
            'hanhdong:capnhat,cu:donedeal/ngay/tatca,moi:donedeal/ngay/tatca/utc,pbcu:2,pb:3',
          ],
          expected: 'invalid: cu',
          match: 'contains',
          hidden: true,
          label: 'ca âm — định nghĩa thiếu phần fail closed',
        },
      ],
      hints: [
        'Tách hai định nghĩa thành bốn phần rồi so từng cặp, giữ nguyên thứ tự loc;grain;mausu;muigio.',
        'Nhánh `conflict` chỉ được BÁO CÁO khác biệt — không có nhánh nào chọn giúp một bên.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `TEN_PHAN = ["loc", "grain", "mausu", "muigio"]


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"hanhdong", "cu", "moi", "pbcu", "pb"}:
        print("invalid: field")
    elif m["hanhdong"] not in {"dangky", "capnhat"}:
        print("invalid: hanhdong")
    elif len(m["cu"].split("/")) != 4:
        print("invalid: cu")
    elif len(m["moi"].split("/")) != 4:
        print("invalid: moi")
    elif so(m["pbcu"]) is None:
        print("invalid: pbcu")
    elif so(m["pb"]) is None:
        print("invalid: pb")
    else:
        khac = [
            ten
            for ten, a, b in zip(TEN_PHAN, m["cu"].split("/"), m["moi"].split("/"))
            if a != b
        ]
        if not khac:
            print("allow: dinh nghia khong doi")
        elif m["hanhdong"] == "dangky":
            print("conflict: khac o " + ";".join(khac))
        elif so(m["pb"]) <= so(m["pbcu"]):
            print("deny: doi dinh nghia ma khong tang version")
        else:
            print("allow: cap nhat version " + m["pb"])
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chọn một chỉ số mà hai đội trong tổ chức bạn hay báo lệch nhau; viết ra định nghĩa của từng đội theo đúng bốn phần (bộ lọc, hạt, mẫu số, múi giờ) và khoanh phần nào thật sự khác — thường chỉ là một.',
    srsCards: [
      {
        hoi: 'Vì sao tầng chỉ số không được tự chọn một trong hai định nghĩa trùng tên?',
        dap: 'Chọn giúp là âm thầm đổi ý nghĩa con số của bên còn lại; việc của hệ thống là phơi bày mâu thuẫn để con người quyết, không phải che nó đi.',
      },
      {
        hoi: 'Số phiên bản của một định nghĩa chỉ số dùng để làm gì?',
        dap: 'Để báo cáo cũ còn tra ngược được nó đang nói theo định nghĩa nào; không có phiên bản thì mọi con số đã in ra mất khả năng tự giải thích.',
      },
    ],
  },
  {
    id: 'p6-u204-l2',
    unitId: 'p6-u204',
    language: 'python',
    title: 'MÔ PHỎNG hai con số không so được: khác hạt (grain) hoặc khác múi giờ',
    hook: 'Đặt hai con số cạnh nhau trên một slide là đã ngầm tuyên bố chúng so được với nhau — nhiều khi tuyên bố đó sai.',
    theory:
      'Hạt (grain) là đơn vị nhỏ nhất mà một con số đếm: theo ngày hay theo tháng, theo người dùng hay theo phiên. Múi giờ quyết định biên của một "ngày". Hai con số khác hạt hoặc khác múi giờ thì phép trừ giữa chúng không có ý nghĩa, dù đơn vị đo giống nhau và kết quả vẫn ra một số đẹp. Cách an toàn là để hệ thống trả `incomparable` kèm lý do, thay vì trả chênh lệch — một con số sai luôn thuyết phục hơn một lời từ chối. MÔ PHỎNG hữu hạn, tất định, không đọc kho dữ liệu thật và không tự quy đổi múi giờ giúp.',
    workedExample: {
      code: `# MO PHONG so sanh hai con so; du lieu tong hop.\nhat_a, hat_b = "ngay", "thang"\nmui_a, mui_b = "utc", "utc"\nif hat_a != hat_b:\n    print("incomparable: khac grain")\nelif mui_a != mui_b:\n    print("incomparable: khac mui gio")\nelse:\n    print("allow: so sanh duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `hat_a, hat_b = "ngay", "ngay"\nmui_a, mui_b = "utc", "ict"\nprint("incomparable: khac mui gio" if mui_a != mui_b else "allow: so sanh duoc")`,
      question: 'Hai con số cùng hạt "ngày" nhưng một tính theo UTC, một theo ICT. In gì?',
      choices: [
        'incomparable: khac mui gio',
        'allow: so sanh duoc',
        'incomparable: khac grain',
        'conflict: khac o muigio',
      ],
      answerIndex: 0,
      explain:
        'Cùng gọi là "ngày" nhưng hai múi giờ cắt ngày ở hai thời điểm khác nhau, nên hai con số đang đếm hai tập bản ghi lệch nhau vài tiếng — trừ nhau ra số vô nghĩa.',
    },
    parsons: {
      prompt: 'Xếp cổng so sánh: chặn khác hạt và khác múi giờ trước khi tính chênh lệch.',
      lines: [
        'if hat_a != hat_b:',
        '    print("incomparable: khac grain")',
        'elif mui_a != mui_b:',
        '    print("incomparable: khac mui gio")',
        'else:',
        '    print("allow: so sanh duoc, chenh lech " + str(gt_a - gt_b))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng so sánh hai con số. Đọc `hata:<ngay|thang>,hatb:<ngay|thang>,muia:<utc|ict>,muib:<utc|ict>,gta:<số>,gtb:<số>`. Thiếu/thừa trường → `invalid: field`; hạt hoặc múi giờ ngoài miền → `invalid: <tên trường>`; gta hoặc gtb không phải số nguyên không âm → `invalid: gta` / `invalid: gtb`. Sau đó: hata khác hatb → `incomparable: khac grain`; muia khác muib → `incomparable: khac mui gio`; còn lại → `allow: so sanh duoc, chenh lech <gta - gtb>`. Không tự quy đổi múi giờ giúp người dùng.',
      starterCode: '# MÔ PHỎNG so sánh chỉ số; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['hata:ngay,hatb:ngay,muia:utc,muib:utc,gta:120,gtb:100'],
          expected: 'allow: so sanh duoc, chenh lech 20',
          match: 'contains',
          hidden: false,
          label: 'cùng hạt cùng múi giờ thì so được',
        },
        {
          stdinLines: ['hata:ngay,hatb:thang,muia:utc,muib:utc,gta:120,gtb:100'],
          expected: 'incomparable: khac grain',
          match: 'contains',
          hidden: true,
          label: 'khác hạt thì phép trừ vô nghĩa',
        },
        {
          stdinLines: ['hata:ngay,hatb:ngay,muia:utc,muib:ict,gta:120,gtb:100'],
          expected: 'incomparable: khac mui gio',
          match: 'contains',
          hidden: true,
          label: 'cùng tên "ngày" nhưng hai biên ngày khác nhau',
        },
        {
          stdinLines: ['hata:ngay,hatb:ngay,muia:utc,muib:utc,gta:120,gtb:mot tram'],
          expected: 'invalid: gtb',
          match: 'contains',
          hidden: true,
          label: 'ca âm — giá trị sai kiểu fail closed',
        },
      ],
      hints: [
        'Chỉ tính chênh lệch ở nhánh cuối cùng; đặt phép trừ sớm hơn là đã ngầm coi hai số so được.',
        'Không viết nhánh nào quy đổi múi giờ — cổng này báo cáo, không sửa dữ liệu hộ.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"hata", "hatb", "muia", "muib", "gta", "gtb"}:
        print("invalid: field")
    elif m["hata"] not in {"ngay", "thang"}:
        print("invalid: hata")
    elif m["hatb"] not in {"ngay", "thang"}:
        print("invalid: hatb")
    elif m["muia"] not in {"utc", "ict"}:
        print("invalid: muia")
    elif m["muib"] not in {"utc", "ict"}:
        print("invalid: muib")
    elif so(m["gta"]) is None:
        print("invalid: gta")
    elif so(m["gtb"]) is None:
        print("invalid: gtb")
    elif m["hata"] != m["hatb"]:
        print("incomparable: khac grain")
    elif m["muia"] != m["muib"]:
        print("incomparable: khac mui gio")
    else:
        print("allow: so sanh duoc, chenh lech " + str(so(m["gta"]) - so(m["gtb"])))
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, tìm trong một báo cáo thật hai con số được đặt cạnh nhau và tra xem chúng có cùng hạt và cùng múi giờ không; nếu không, viết lại chú thích của báo cáo đó sao cho người đọc biết hai số không so trực tiếp được.',
    srsCards: [
      {
        hoi: 'Vì sao hai con số cùng đơn vị vẫn có thể không so được?',
        dap: 'Vì chúng có thể đếm trên hai hạt khác nhau hoặc cắt ngày theo hai múi giờ khác nhau — cùng đơn vị không có nghĩa là cùng tập bản ghi.',
      },
      {
        hoi: 'Vì sao trả `incomparable` an toàn hơn trả chênh lệch kèm cảnh báo?',
        dap: 'Con số luôn được nhớ lâu hơn cảnh báo đi kèm nó; không đưa ra con số là cách duy nhất chắc chắn nó không bị trích dẫn rời khỏi ngữ cảnh.',
      },
    ],
  },
]
