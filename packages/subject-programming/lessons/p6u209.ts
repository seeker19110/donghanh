// lessons/p6u209.ts — P6-U209: HƯỚNG AN TOÀN, chặng S4 — module `security-s4-m4` (quản trị và
// tuân thủ: chấm rủi ro, rủi ro bên thứ ba, ánh xạ khái niệm sang khung tuân thủ, đào tạo nhận thức).
//
// Bài 1 hỏi "bản ghi rủi ro này có tư cách tồn tại không" (khả năng × tác động, và rủi ro
// "chấp nhận" phải có chủ sở hữu cùng ngày hết hiệu lực). Bài 2 hỏi "nhà cung cấp và kiểm soát
// tuân thủ có bằng chứng không".
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Nội dung pháp luật chỉ ở mức KHÁI NIỆM và không thay thế ý kiến pháp lý. Chặng PHÒNG THỦ;
// simulator Python tất định, hữu hạn, fail closed.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U209_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u209-l1',
    unitId: 'p6-u209',
    language: 'python',
    title: 'MÔ PHỎNG sổ rủi ro: khả năng × tác động, residual risk và rủi ro "chấp nhận" hợp lệ',
    hook: 'Rủi ro được "chấp nhận" mà không ai đứng tên và không có ngày hết hiệu lực chỉ là một cách viết đẹp của câu "chúng ta quyết định quên nó đi".',
    theory:
      'Chấm rủi ro là nhân khả năng với tác động để có một con số so sánh được, và phần còn lại sau khi đã áp kiểm soát gọi là rủi ro tồn dư (residual risk) — đó mới là con số tổ chức thật sự đang gánh. Khi đội chọn CHẤP NHẬN một rủi ro thay vì giảm thiểu, bản ghi phải có đủ hai thứ, nếu không thì `invalid`: một chủ sở hữu đích danh để có người trả lời khi rủi ro thành sự thật, và một ngày hết hiệu lực để quyết định được xem lại thay vì sống mãi. Đây là MÔ PHỎNG hữu hạn trên bản ghi tổng hợp: không sổ rủi ro thật, không đồng hồ hệ thống. Nội dung pháp luật ở bài này chỉ ở mức khái niệm và không thay thế ý kiến pháp lý.',
    workedExample: {
      code: `# MO PHONG cham rui ro; ban ghi tong hop, khong so rui ro that.\nkhanang, tacdong = 3, 4\nprint("allow: residual risk " + str(khanang * tacdong))`,
      stdinLines: [],
    },
    predict: {
      code: `xuly, chusohuu = "accept", "-"\nprint("invalid: rui ro chap nhan thieu chu so huu" if xuly == "accept" and chusohuu == "-" else "allow: ban ghi hop le")`,
      question: 'Rủi ro được đánh dấu "chấp nhận" nhưng ô chủ sở hữu bỏ trống. Cổng in gì?',
      choices: [
        'invalid: rui ro chap nhan thieu chu so huu',
        'allow: ban ghi hop le',
        'deny: rui ro qua cao',
        'not-reported: thieu bang chung',
      ],
      answerIndex: 0,
      explain:
        'Chấp nhận rủi ro là một quyết định có hậu quả, nên nó phải có người chịu trách nhiệm; bản ghi thiếu chủ sở hữu không phải rủi ro thấp mà là bản ghi không hợp lệ.',
    },
    parsons: {
      prompt: 'Xếp cổng sổ rủi ro: hai điều kiện của quyết định chấp nhận trước, rồi mới in điểm.',
      lines: [
        'if xuly == "accept" and chusohuu == "-":',
        '    print("invalid: rui ro chap nhan thieu chu so huu")',
        'elif xuly == "accept" and hethieuluc == "no":',
        '    print("invalid: rui ro chap nhan thieu ngay het hieu luc")',
        'elif xuly == "accept":',
        '    print("allow: chap nhan co nguoi chiu trach nhiem, residual risk " + str(diem))',
        'else:',
        '    print("allow: giam thieu, residual risk " + str(diem))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng sổ rủi ro (residual risk). Đọc `rui:<nhãn>,khanang:<1-5>,tacdong:<1-5>,xuly:<accept|mitigate>,chusohuu:<tên|->,hethieuluc:<yes|no>`. Thiếu/thừa trường → `invalid: field`; khanang hoặc tacdong không phải số nguyên trong 1..5 → `invalid: diem`; xuly lạ → `invalid: xuly`; hethieuluc lạ → `invalid: hethieuluc`. Thứ tự ưu tiên tất định: xuly là `accept` và chusohuu là `-` → `invalid: rui ro chap nhan thieu chu so huu`; xuly là `accept` và hethieuluc là `no` → `invalid: rui ro chap nhan thieu ngay het hieu luc`; xuly là `accept` → `allow: chap nhan co nguoi chiu trach nhiem, residual risk <khanang*tacdong>`; còn lại → `allow: giam thieu, residual risk <khanang*tacdong>`. Không sổ rủi ro thật, không mạng, không file.',
      starterCode: '# MÔ PHỎNG sổ rủi ro; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: [
            'rui:r-01,khanang:3,tacdong:4,xuly:mitigate,chusohuu:doi-ha-tang,hethieuluc:no',
          ],
          expected: 'allow: giam thieu, residual risk 12',
          match: 'contains',
          hidden: false,
          label: 'giảm thiểu thì chỉ cần điểm rủi ro tồn dư',
        },
        {
          stdinLines: [
            'rui:r-02,khanang:2,tacdong:2,xuly:accept,chusohuu:truong-bo-phan,hethieuluc:yes',
          ],
          expected: 'allow: chap nhan co nguoi chiu trach nhiem, residual risk 4',
          match: 'contains',
          hidden: true,
          label: 'chấp nhận hợp lệ khi đủ chủ sở hữu và ngày hết hiệu lực',
        },
        {
          stdinLines: ['rui:r-03,khanang:2,tacdong:2,xuly:accept,chusohuu:-,hethieuluc:yes'],
          expected: 'invalid: rui ro chap nhan thieu chu so huu',
          match: 'contains',
          hidden: true,
          label: 'chấp nhận mà không ai đứng tên là bản ghi không hợp lệ',
        },
        {
          stdinLines: [
            'rui:r-04,khanang:2,tacdong:2,xuly:accept,chusohuu:truong-bo-phan,hethieuluc:no',
          ],
          expected: 'invalid: rui ro chap nhan thieu ngay het hieu luc',
          match: 'contains',
          hidden: true,
          label: 'chấp nhận không có hạn xem lại thì sống mãi',
        },
        {
          stdinLines: [
            'rui:r-05,khanang:9,tacdong:2,xuly:mitigate,chusohuu:doi-ha-tang,hethieuluc:no',
          ],
          expected: 'invalid: diem',
          match: 'contains',
          hidden: true,
          label: 'ca âm — điểm ngoài thang 1..5 thì fail closed',
        },
      ],
      hints: [
        'Viết một hàm nhỏ trả về số nếu chuỗi là số nguyên trong 1..5, ngược lại trả về None.',
        'Tính điểm một lần rồi dùng lại ở cả hai nhánh allow.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `def diem_cua(x):
    return int(x) if x.isdigit() and 1 <= int(x) <= 5 else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"rui", "khanang", "tacdong", "xuly", "chusohuu", "hethieuluc"}:
        print("invalid: field")
    elif any(diem_cua(m[k]) is None for k in ("khanang", "tacdong")):
        print("invalid: diem")
    elif m["xuly"] not in {"accept", "mitigate"}:
        print("invalid: xuly")
    elif m["hethieuluc"] not in {"yes", "no"}:
        print("invalid: hethieuluc")
    elif m["xuly"] == "accept" and m["chusohuu"] == "-":
        print("invalid: rui ro chap nhan thieu chu so huu")
    elif m["xuly"] == "accept" and m["hethieuluc"] == "no":
        print("invalid: rui ro chap nhan thieu ngay het hieu luc")
    else:
        diem = diem_cua(m["khanang"]) * diem_cua(m["tacdong"])
        if m["xuly"] == "accept":
            print("allow: chap nhan co nguoi chiu trach nhiem, residual risk " + str(diem))
        else:
            print("allow: giam thieu, residual risk " + str(diem))
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, mở sổ rủi ro (hoặc danh sách việc treo) của đội bạn và tìm những mục đã được "chấp nhận". Với mỗi mục ghi hai ô: ai đứng tên, và ngày nào sẽ xem lại. Ô nào trống thì hoặc điền, hoặc chuyển mục đó sang nhóm phải giảm thiểu — không có lựa chọn thứ ba.',
    srsCards: [
      {
        hoi: 'Vì sao rủi ro tồn dư mới là con số đáng quản, chứ không phải điểm rủi ro ban đầu?',
        dap: 'Vì điểm ban đầu là rủi ro khi chưa làm gì, còn tồn dư là phần tổ chức thật sự đang gánh sau khi đã áp kiểm soát — quyết định phải dựa trên cái đang gánh.',
      },
      {
        hoi: 'Vì sao rủi ro "chấp nhận" bắt buộc có ngày hết hiệu lực?',
        dap: 'Vì bối cảnh đổi: quy mô, dữ liệu và luật đều thay đổi, nên một quyết định chấp nhận đúng hôm nay có thể sai sau nửa năm; ngày hết hiệu lực ép nó được xem lại.',
      },
    ],
  },
  {
    id: 'p6-u209-l2',
    unitId: 'p6-u209',
    language: 'python',
    title: 'MÔ PHỎNG rủi ro bên thứ ba (third-party) và kiểm soát tuân thủ phải có evidence',
    hook: 'Một ô tích "đạt" trong bảng tuân thủ mà không kèm bằng chứng nào thì đúng bằng một lời hứa.',
    theory:
      'Quản trị tuân thủ có hai chỗ hay vỡ. Chỗ thứ nhất là bên thứ ba (third-party): nhà cung cấp không có thoả thuận xử lý dữ liệu, hoặc không có kế hoạch rút lui khi hợp tác chấm dứt, là rủi ro cao — dữ liệu của bạn đang nằm ở nơi bạn không rút ra được. Chỗ thứ hai là cách ghi nhận kiểm soát: một kiểm soát khai là "đạt" mà không kèm bằng chứng (evidence) thì phải ghi là `not-reported`, TUYỆT ĐỐI không được quy thành đạt — vì khi cần đến nó, thứ duy nhất dùng được là bằng chứng chứ không phải ô tích. Ánh xạ sang các khung tuân thủ ở đây chỉ ở mức KHÁI NIỆM để đội kỹ thuật nói cùng ngôn ngữ với đội pháp chế, và không thay thế ý kiến pháp lý. Đây là MÔ PHỎNG hữu hạn trên bản ghi tổng hợp: không hồ sơ nhà cung cấp thật.',
    workedExample: {
      code: `# MO PHONG danh gia ben thu ba; ban ghi tong hop, khong ho so nha cung cap that.\nkiemsoat, bangchung = "dat", "no"\nprint("not-reported: kiem soat khai dat nhung khong co bang chung" if kiemsoat == "dat" and bangchung == "no" else "allow: ghi nhan duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `dpa = "no"\nprint("deny: nha cung cap thieu thoa thuan xu ly du lieu, rui ro cao" if dpa == "no" else "allow: ghi nhan duoc")`,
      question: 'Nhà cung cấp chưa ký thoả thuận xử lý dữ liệu. Cổng in gì?',
      choices: [
        'deny: nha cung cap thieu thoa thuan xu ly du lieu, rui ro cao',
        'allow: ghi nhan duoc',
        'not-reported: kiem soat khai dat nhung khong co bang chung',
        'invalid: dpa',
      ],
      answerIndex: 0,
      explain:
        'Không có thoả thuận xử lý dữ liệu thì không có ràng buộc nào về việc bên kia được làm gì với dữ liệu — đó là rủi ro cao, không phải thủ tục giấy tờ chậm.',
    },
    parsons: {
      prompt: 'Xếp cổng tuân thủ: luật bằng chứng trước, rồi tới hai luật về bên thứ ba.',
      lines: [
        'if kiemsoat == "dat" and bangchung == "no":',
        '    print("not-reported: kiem soat khai dat nhung khong co bang chung")',
        'elif dpa == "no":',
        '    print("deny: nha cung cap thieu thoa thuan xu ly du lieu, rui ro cao")',
        'elif rutlui == "no":',
        '    print("deny: nha cung cap thieu ke hoach rut lui, rui ro cao")',
        'else:',
        '    print("allow: ghi nhan duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng đánh giá bên thứ ba (third-party) và ghi nhận kiểm soát tuân thủ. Đọc `ncc:<nhãn>,dpa:<yes|no>,rutlui:<yes|no>,kiemsoat:<dat|chua>,bangchung:<yes|no>` — `dpa` là thoả thuận xử lý dữ liệu, `rutlui` là kế hoạch rút lui. Thiếu/thừa trường → `invalid: field`; bất kỳ cờ nào ngoài tập giá trị hợp lệ → `invalid: co`. Thứ tự ưu tiên tất định: kiemsoat là `dat` và bangchung là `no` → `not-reported: kiem soat khai dat nhung khong co bang chung`; dpa là `no` → `deny: nha cung cap thieu thoa thuan xu ly du lieu, rui ro cao`; rutlui là `no` → `deny: nha cung cap thieu ke hoach rut lui, rui ro cao`; kiemsoat là `chua` → `allow: ghi nhan la chua dat`; còn lại → `allow: ghi nhan duoc`. Tuyệt đối không quy một khai báo không có bằng chứng thành đạt. Không hồ sơ thật, không mạng, không file.',
      starterCode:
        '# MÔ PHỎNG đánh giá bên thứ ba; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['ncc:ncc-a,dpa:yes,rutlui:yes,kiemsoat:dat,bangchung:yes'],
          expected: 'allow: ghi nhan duoc',
          match: 'contains',
          hidden: false,
          label: 'đủ thoả thuận, đủ kế hoạch rút lui, kiểm soát có bằng chứng',
        },
        {
          stdinLines: ['ncc:ncc-a,dpa:yes,rutlui:yes,kiemsoat:dat,bangchung:no'],
          expected: 'not-reported: kiem soat khai dat nhung khong co bang chung',
          match: 'contains',
          hidden: true,
          label: 'khai đạt mà không có bằng chứng thì không được quy thành đạt',
        },
        {
          stdinLines: ['ncc:ncc-a,dpa:no,rutlui:yes,kiemsoat:chua,bangchung:no'],
          expected: 'deny: nha cung cap thieu thoa thuan xu ly du lieu, rui ro cao',
          match: 'contains',
          hidden: true,
          label: 'thiếu thoả thuận xử lý dữ liệu là rủi ro cao',
        },
        {
          stdinLines: ['ncc:ncc-a,dpa:yes,rutlui:no,kiemsoat:chua,bangchung:no'],
          expected: 'deny: nha cung cap thieu ke hoach rut lui, rui ro cao',
          match: 'contains',
          hidden: true,
          label: 'không rút ra được cũng là rủi ro cao',
        },
        {
          stdinLines: ['ncc:ncc-a,dpa:co,rutlui:yes,kiemsoat:dat,bangchung:yes'],
          expected: 'invalid: co',
          match: 'contains',
          hidden: true,
          label: 'ca âm — cờ ngoài tập giá trị hợp lệ thì fail closed',
        },
      ],
      hints: [
        'Gom việc kiểm bốn cờ vào một vòng lặp trên cặp (tên khoá, tập giá trị hợp lệ).',
        'Luật bằng chứng phải đứng TRƯỚC hai luật nhà cung cấp, để một bản ghi vừa thiếu bằng chứng vừa thiếu thoả thuận vẫn cho một kết quả tất định.',
        'Không dùng subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `HOP_LE = {
    "dpa": {"yes", "no"},
    "rutlui": {"yes", "no"},
    "kiemsoat": {"dat", "chua"},
    "bangchung": {"yes", "no"},
}

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"ncc", "dpa", "rutlui", "kiemsoat", "bangchung"}:
        print("invalid: field")
    elif any(m[k] not in v for k, v in HOP_LE.items()):
        print("invalid: co")
    elif m["kiemsoat"] == "dat" and m["bangchung"] == "no":
        print("not-reported: kiem soat khai dat nhung khong co bang chung")
    elif m["dpa"] == "no":
        print("deny: nha cung cap thieu thoa thuan xu ly du lieu, rui ro cao")
    elif m["rutlui"] == "no":
        print("deny: nha cung cap thieu ke hoach rut lui, rui ro cao")
    elif m["kiemsoat"] == "chua":
        print("allow: ghi nhan la chua dat")
    else:
        print("allow: ghi nhan duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, liệt kê ba nhà cung cấp đang giữ dữ liệu của sản phẩm bạn làm và với mỗi bên trả lời hai câu: có thoả thuận xử lý dữ liệu không, và nếu ngày mai ngừng hợp tác thì lấy dữ liệu ra bằng cách nào, trong bao lâu. Câu thứ hai không trả lời được nghĩa là bạn đang phụ thuộc chứ không phải đang thuê dịch vụ.',
    srsCards: [
      {
        hoi: 'Vì sao kiểm soát khai "đạt" mà không có bằng chứng phải ghi là `not-reported` thay vì `chưa đạt`?',
        dap: 'Vì hai trạng thái đó dẫn tới hai hành động khác nhau: chưa đạt thì đi làm kiểm soát, còn không có bằng chứng thì đi thu bằng chứng — gộp lại là làm sai việc.',
      },
      {
        hoi: 'Vì sao thiếu kế hoạch rút lui được xếp ngang hàng rủi ro cao với thiếu thoả thuận xử lý dữ liệu?',
        dap: 'Vì cả hai đều nói cùng một điều: bạn không kiểm soát được dữ liệu của mình ở bên kia — một bên là không có ràng buộc, bên kia là không có đường ra.',
      },
    ],
  },
]
