// lessons/p6u255.ts — P6-U255: HƯỚNG GAME, chặng S4 — module `game-s4-m2` (công cụ và quy trình
// đội: engine/tooling nội bộ, quy trình tài nguyên với người làm mỹ thuật, build tự động).
//
// Bài 1 lo ĐƯỜNG ỐNG BUILD: một bước lỗi thì các bước sau KHÔNG chạy, và báo cáo phải gọi tên
// đúng bước gãy. Bài 2 lo QUY TRÌNH TÀI NGUYÊN: tệp lớn phải đi qua kho tệp lớn, không được đẩy
// thẳng vào kho mã — sai một lần là kho phình vĩnh viễn với cả đội.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: không chạy build thật, không subprocess, không chạm hệ tệp.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U255_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u255-l1',
    unitId: 'p6-u255',
    language: 'python',
    title: 'MÔ PHỎNG đường ống build: bước gãy thì chặn các bước sau và gọi đúng tên nó',
    hook: 'Đường ống chạy tiếp sau khi biên dịch hỏng chỉ đem lại một thứ: một bản đóng gói từ mã cũ mà ai cũng tưởng là mã mới.',
    theory:
      'Build tự động của một đội làm game đi qua các bước có thứ tự: biên dịch mã, xử lý tài nguyên, đóng gói, kiểm tra. Luật quan trọng nhất không phải là chạy nhanh mà là DỪNG ĐÚNG CHỖ: một bước lỗi thì mọi bước sau không được chạy, vì chúng sẽ làm việc trên dữ liệu cũ và cho ra một bản build trông như thành công. Báo cáo phải gọi tên bước gãy đầu tiên — người sửa cần biết bắt đầu từ đâu, và "build hỏng" thì không ai bắt đầu được. Chỉ khi toàn bộ bước đi qua mới trả `pass`. Đây là MÔ PHỎNG Python hữu hạn trên danh sách trạng thái bước khai báo trước: không chạy build thật, không subprocess, không chạm hệ tệp.',
    workedExample: {
      code: `# MO PHONG duong ong build; moi buoc chi la mot NHAN trang thai khai bao.\nbuoc = [("bien_dich", "ok"), ("dong_goi", "ok")]\nhong = [t for t, s in buoc if s != "ok"]\nprint("pass: toan bo buoc qua" if not hong else "blocked: " + hong[0])`,
      stdinLines: [],
    },
    predict: {
      code: `buoc = [("bien_dich", "loi"), ("dong_goi", "ok")]\nhong = [t for t, s in buoc if s != "ok"]\nprint("blocked: " + hong[0] if hong else "pass: toan bo buoc qua")`,
      question: 'Bước biên dịch lỗi nhưng bước đóng gói vẫn được khai là "ok". MÔ PHỎNG in gì?',
      choices: [
        'blocked: bien_dich',
        'pass: toan bo buoc qua',
        'blocked: dong_goi',
        'deny: asset chua qua kho tep lon',
      ],
      answerIndex: 0,
      explain:
        'Báo cáo gọi tên bước GÃY ĐẦU TIÊN. Việc bước sau được khai "ok" chính là dấu hiệu đường ống đang chạy tiếp sau lỗi — nó đã đóng gói từ kết quả biên dịch cũ, và bản build đó là một cái bẫy.',
    },
    parsons: {
      prompt: 'Xếp báo cáo đường ống: dừng ở bước gãy ĐẦU TIÊN, không gộp mọi lỗi lại.',
      lines: [
        'if not buoc:',
        '    print("unknown: duong ong chua khai buoc nao")',
        'else:',
        '    hong = [t for t, s in buoc if s != "ok"]',
        '    if hong:',
        '        print("blocked: " + hong[0])',
        '    else:',
        '        print("pass: toan bo buoc qua")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG báo cáo đường ống build. Thứ tự bước bắt buộc: `bien_dich`, `xu_ly_asset`, `dong_goi`, `kiem_tra`. Đọc một dòng gồm các bước ngăn bằng `|`, mỗi bước dạng `<tên>@<ok|loi>`, ví dụ `bien_dich@ok|dong_goi@loi`. Dòng rỗng → `unknown: duong ong chua khai buoc nao`; bước sai khuôn, tên lạ hoặc trạng thái lạ → `invalid: buoc`; các bước không theo đúng thứ tự khai báo → `invalid: thu tu buoc`; có bước lỗi → `blocked: <tên bước gãy đầu tiên>`; toàn bộ ok → `pass: toan bo buoc qua`. Không chạy build thật, không subprocess.',
      starterCode: '# MÔ PHỎNG đường ống build; chỉ đọc nhãn trạng thái, không chạy lệnh nào.\n',
      testCases: [
        {
          stdinLines: ['bien_dich@ok|xu_ly_asset@ok|dong_goi@ok|kiem_tra@ok'],
          expected: 'pass: toan bo buoc qua',
          match: 'contains',
          hidden: false,
          label: 'đủ bốn bước và đều qua',
        },
        {
          stdinLines: ['bien_dich@loi|xu_ly_asset@ok|dong_goi@ok'],
          expected: 'blocked: bien_dich',
          match: 'contains',
          hidden: true,
          label: 'gọi tên bước gãy đầu tiên, không phải "build hỏng"',
        },
        {
          stdinLines: ['bien_dich@ok|dong_goi@loi'],
          expected: 'blocked: dong_goi',
          match: 'contains',
          hidden: true,
          label: 'đường ống rút gọn vẫn phải theo đúng thứ tự tương đối',
        },
        {
          stdinLines: ['dong_goi@ok|bien_dich@ok'],
          expected: 'invalid: thu tu buoc',
          match: 'contains',
          hidden: true,
          label: 'đóng gói trước khi biên dịch là đường ống sai từ thiết kế',
        },
        {
          stdinLines: ['bien_dich@xong|dong_goi@ok'],
          expected: 'invalid: buoc',
          match: 'contains',
          hidden: true,
          label: 'ca âm — trạng thái lạ fail closed, không đoán là ok',
        },
      ],
      hints: [
        'Giữ thứ tự chuẩn trong một tuple rồi so chỉ số: dãy chỉ số phải tăng thật sự.',
        'Dừng ở bước gãy ĐẦU TIÊN — gộp mọi lỗi lại làm người sửa không biết bắt đầu từ đâu.',
        'Không dùng subprocess, `open(`, socket hay thời gian thực.',
      ],
      sampleSolution: `THU_TU = ("bien_dich", "xu_ly_asset", "dong_goi", "kiem_tra")

try:
    dong = input().strip()
    phan = [p for p in dong.split("|") if p != ""]
    if not phan:
        print("unknown: duong ong chua khai buoc nao")
    else:
        buoc = []
        loi = None
        for p in phan:
            if p.count("@") != 1:
                loi = "invalid: buoc"
                break
            ten, tt = p.split("@")
            if ten not in THU_TU or tt not in {"ok", "loi"}:
                loi = "invalid: buoc"
                break
            buoc.append((ten, tt))
        if loi is not None:
            print(loi)
        else:
            chi_so = [THU_TU.index(t) for t, _ in buoc]
            if chi_so != sorted(chi_so) or len(set(chi_so)) != len(chi_so):
                print("invalid: thu tu buoc")
            else:
                hong = [t for t, s in buoc if s != "ok"]
                if hong:
                    print("blocked: " + hong[0])
                else:
                    print("pass: toan bo buoc qua")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, dựng một build tự động thật cho dự án Godot hoặc Unity của bạn (GitHub Actions hoặc một script chạy tay cũng được) với đủ bốn bước trên. Cố tình làm hỏng bước biên dịch rồi chạy lại: chụp màn hình báo cáo và kiểm xem đường ống có dừng đúng chỗ hay vẫn đóng gói tiếp — nộp cả log.',
    srsCards: [
      {
        hoi: 'Vì sao một bước lỗi phải chặn mọi bước sau trong đường ống build?',
        dap: 'Các bước sau sẽ làm việc trên kết quả cũ và cho ra một bản build trông như thành công; bản build sai đó nguy hiểm hơn hẳn một build đỏ, vì nó được đem đi thử và đem đi phát hành.',
      },
      {
        hoi: 'Vì sao báo cáo phải gọi tên bước gãy đầu tiên thay vì báo "build hỏng"?',
        dap: 'Người sửa cần điểm bắt đầu; thêm nữa các lỗi sau thường chỉ là hệ quả của lỗi đầu, nên liệt kê hết sẽ làm nhiễu và dẫn người ta đi sửa triệu chứng.',
      },
    ],
  },
  {
    id: 'p6-u255-l2',
    unitId: 'p6-u255',
    language: 'python',
    title: 'MÔ PHỎNG quy trình tài nguyên: tệp lớn phải đi qua kho tệp lớn',
    hook: 'Một tệp kết cấu 400 MB đẩy nhầm vào kho mã sẽ nằm trong lịch sử mãi mãi — và cả đội tải nó về, mỗi lần một người nhân bản kho.',
    theory:
      'Kho mã được thiết kế cho tệp văn bản nhỏ, đổi thường xuyên, lưu theo từng dòng khác biệt. Tệp nhị phân lớn — kết cấu, mô hình, âm thanh — không lưu theo dòng được, nên mỗi phiên bản là một bản sao đầy đủ nằm trong lịch sử VĨNH VIỄN: xoá tệp ở bản mới không làm kho nhỏ lại. Vì thế các đội làm game dùng kho tệp lớn (Git LFS) cho phần nhị phân, và quy trình phải chặn tại cổng: tệp vượt ngưỡng kích thước mà không gắn cờ kho tệp lớn thì `deny`, vì chi phí sửa sau khi đã đẩy lên là viết lại toàn bộ lịch sử và bắt cả đội nhân bản lại. Tệp nhỏ thì không cần — ép mọi thứ qua kho tệp lớn làm quy trình nặng nề vô ích. Đây là MÔ PHỎNG hữu hạn trên mô tả tệp: không chạm hệ tệp, không gọi git thật.',
    workedExample: {
      code: `# MO PHONG cong tai nguyen; kich thuoc la so MB KHAI BAO, khong doc file that.\nkich_thuoc, nguong, co_kho_lon = 400, 100, 1\nprint("pass: asset qua cong" if kich_thuoc <= nguong or co_kho_lon == 1 else "deny: asset chua qua kho tep lon")`,
      stdinLines: [],
    },
    predict: {
      code: `kich_thuoc, nguong, co_kho_lon = 400, 100, 0\nprint("deny: asset chua qua kho tep lon" if kich_thuoc > nguong and co_kho_lon == 0 else "pass: asset qua cong")`,
      question: 'Tệp 400 MB, ngưỡng 100 MB, không gắn cờ kho tệp lớn. MÔ PHỎNG in gì?',
      choices: [
        'deny: asset chua qua kho tep lon',
        'pass: asset qua cong',
        'blocked: xu_ly_asset',
        'unknown: chua co asset nao',
      ],
      answerIndex: 0,
      explain:
        'Chặn ở cổng vì sau khi tệp đã vào lịch sử kho thì sửa nghĩa là viết lại lịch sử và bắt mọi người nhân bản lại. Đây là loại lỗi mà chi phí sửa lớn gấp trăm lần chi phí chặn.',
    },
    parsons: {
      prompt: 'Xếp cổng tài nguyên: ngưỡng phải hợp lệ trước, rồi mới xét cờ kho tệp lớn.',
      lines: [
        'if nguong <= 0:',
        '    print("invalid: nguong")',
        'elif kich_thuoc <= nguong:',
        '    print("pass: asset nho, khong can kho tep lon")',
        'elif co_kho_lon == 1:',
        '    print("pass: asset lon da qua kho tep lon")',
        'else:',
        '    print("deny: asset chua qua kho tep lon")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng quy trình tài nguyên. Đọc `kich_thuoc:<MB>,nguong:<MB>,kho_lon:<0|1>,loai:<anh|mo_hinh|am_thanh|ma_nguon>`. Thiếu/thừa trường → `invalid: field`; kich_thuoc hoặc nguong không phải số nguyên không âm → `invalid: so`; nguong ≤ 0 → `invalid: nguong`; kho_lon ngoài {0,1} → `invalid: kho_lon`; loai lạ → `unknown: loai asset chua khai bao`; loai là `ma_nguon` và kho_lon = 1 → `deny: ma nguon khong duoc day vao kho tep lon`; kich_thuoc ≤ nguong → `pass: asset nho, khong can kho tep lon`; kho_lon = 1 → `pass: asset lon da qua kho tep lon`; còn lại → `deny: asset chua qua kho tep lon`. Không chạm hệ tệp, không gọi git thật.',
      starterCode:
        '# MÔ PHỎNG quy trình tài nguyên; kích thước là số khai báo, không đọc tệp thật.\n',
      testCases: [
        {
          stdinLines: ['kich_thuoc:400,nguong:100,kho_lon:0,loai:anh'],
          expected: 'deny: asset chua qua kho tep lon',
          match: 'contains',
          hidden: false,
          label: 'tệp lớn không gắn cờ kho tệp lớn bị chặn tại cổng',
        },
        {
          stdinLines: ['kich_thuoc:400,nguong:100,kho_lon:1,loai:mo_hinh'],
          expected: 'pass: asset lon da qua kho tep lon',
          match: 'contains',
          hidden: true,
          label: 'tệp lớn đi đúng đường thì qua',
        },
        {
          stdinLines: ['kich_thuoc:2,nguong:100,kho_lon:0,loai:anh'],
          expected: 'pass: asset nho, khong can kho tep lon',
          match: 'contains',
          hidden: true,
          label: 'tệp nhỏ không phải ép qua kho tệp lớn',
        },
        {
          stdinLines: ['kich_thuoc:2,nguong:100,kho_lon:1,loai:ma_nguon'],
          expected: 'deny: ma nguon khong duoc day vao kho tep lon',
          match: 'contains',
          hidden: true,
          label: 'mã nguồn vào kho tệp lớn là mất hết lợi ích so dòng khác biệt',
        },
        {
          stdinLines: ['kich_thuoc:400,nguong:0,kho_lon:0,loai:anh'],
          expected: 'invalid: nguong',
          match: 'contains',
          hidden: true,
          label: 'ca âm — ngưỡng không dương fail closed',
        },
      ],
      hints: [
        'Kiểm loại asset trước khi xét kích thước: mã nguồn có luật riêng, không phụ thuộc kích thước.',
        'Tệp nhỏ KHÔNG cần kho tệp lớn — đừng viết luật ép mọi thứ qua đó.',
        'Không dùng `open(`, subprocess, socket hay thời gian thực.',
      ],
      sampleSolution: `LOAI = {"anh", "mo_hinh", "am_thanh", "ma_nguon"}


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"kich_thuoc", "nguong", "kho_lon", "loai"}:
        print("invalid: field")
    elif so(m["kich_thuoc"]) is None or so(m["nguong"]) is None:
        print("invalid: so")
    elif so(m["nguong"]) <= 0:
        print("invalid: nguong")
    elif m["kho_lon"] not in {"0", "1"}:
        print("invalid: kho_lon")
    elif m["loai"] not in LOAI:
        print("unknown: loai asset chua khai bao")
    elif m["loai"] == "ma_nguon" and m["kho_lon"] == "1":
        print("deny: ma nguon khong duoc day vao kho tep lon")
    elif so(m["kich_thuoc"]) <= so(m["nguong"]):
        print("pass: asset nho, khong can kho tep lon")
    elif m["kho_lon"] == "1":
        print("pass: asset lon da qua kho tep lon")
    else:
        print("deny: asset chua qua kho tep lon")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, bật Git LFS cho kho dự án game của bạn và khai đúng những đuôi tệp nhị phân của nó. Đo hai con số thật: kích thước bản nhân bản kho TRƯỚC và SAU khi chuyển tài nguyên sang kho tệp lớn, rồi viết một quy ước ngắn cho đội — tệp nào đi đường nào, ngưỡng bao nhiêu.',
    srsCards: [
      {
        hoi: 'Vì sao xoá một tệp nhị phân lớn ở bản mới KHÔNG làm kho nhỏ lại?',
        dap: 'Kho giữ toàn bộ lịch sử, nên mọi phiên bản của tệp vẫn nằm trong đó và vẫn được tải về khi nhân bản; muốn thật sự loại bỏ thì phải viết lại lịch sử và bắt cả đội nhân bản lại.',
      },
      {
        hoi: 'Vì sao không nên ép mọi tệp qua kho tệp lớn cho "chắc"?',
        dap: 'Kho tệp lớn thêm một lớp phụ thuộc và một bước tải riêng; với tệp văn bản nhỏ nó còn làm mất lợi ích lưu theo dòng khác biệt, khiến so sánh và gộp nhánh trở nên khó hơn.',
      },
    ],
  },
]
