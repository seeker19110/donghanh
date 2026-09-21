// lessons/p6u246.ts — P6-U246: HƯỚNG GAME, chặng S2 "Hệ thống game và kiến trúc" —
// module `game-s2-m1` (kiến trúc: thành phần thay cho kế thừa, ECS mức dùng được, data-driven).
//
// Bài 1 dạy luật LỌC: hệ thống chỉ chạy trên entity có đủ thành phần nó cần, thiếu thì BỎ QUA
// chứ không lỗi — nhờ đó thêm loại entity mới chỉ là thêm dữ liệu. Bài 2 dạy luật GHI: mỗi hệ
// thống chỉ được ghi những thành phần nó đã khai, hai hệ thống cùng ghi một thành phần trong
// một bước là xung đột phải chặn.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: không engine, không ECS thư viện thật, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U246_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u246-l1',
    unitId: 'p6-u246',
    language: 'python',
    title: 'MÔ PHỎNG lọc entity theo thành phần: thêm loại quái mới mà không sửa một dòng mã nào',
    hook: 'Cây kế thừa "Quái bay biết bơi" là nơi mọi dự án game chết — vì con quái tiếp theo luôn thuộc về hai nhánh cùng lúc.',
    theory:
      'Kiến trúc thành phần (component) thay câu hỏi "đối tượng này LÀ gì" bằng câu hỏi "đối tượng này CÓ gì". Một entity chỉ là một mã số kèm tập thành phần: có `vitri`, có `vantoc`, có `mau`. Mỗi hệ thống khai trước tập thành phần nó CẦN và chạy trên đúng những entity có đủ tập đó; entity thiếu một thành phần thì hệ thống BỎ QUA, không lỗi và không cần biết entity ấy là quái, là đạn hay là hiệu ứng trang trí. Nhờ luật lọc đó, thêm một loại quái mới là thêm DỮ LIỆU (một tập thành phần mới), không phải thêm một lớp con và sửa hàng loạt câu lệnh phân loại. Đây là MÔ PHỎNG Python hữu hạn trên tập chuỗi: không engine, không thư viện ECS thật.',
    workedExample: {
      code: `# MO PHONG loc entity; he thong di chuyen CAN vitri va vantoc.\ncan = {"vitri", "vantoc"}\nco = {"vitri", "vantoc", "mau"}\nprint("allow: he thong chay tren entity" if can <= co else "allow: bo qua entity thieu thanh phan")`,
      stdinLines: [],
    },
    predict: {
      code: `can = {"vitri", "vantoc"}\nco = {"vitri", "mau"}\nprint("allow: he thong chay tren entity" if can <= co else "allow: bo qua entity thieu thanh phan")`,
      question:
        'Entity chỉ có `vitri` và `mau`, còn hệ thống di chuyển cần `vitri` và `vantoc`. MÔ PHỎNG in gì?',
      choices: [
        'allow: bo qua entity thieu thanh phan',
        'allow: he thong chay tren entity',
        'deny: thieu thanh phan',
        'invalid: thanh phan',
      ],
      answerIndex: 0,
      explain:
        'Thiếu thành phần KHÔNG phải lỗi: một bức tường không có vận tốc là chuyện bình thường, hệ thống di chuyển chỉ việc bỏ qua nó. Nếu chỗ này báo lỗi thì mỗi lần thêm loại entity mới bạn lại phải đi vá từng hệ thống.',
    },
    parsons: {
      prompt: 'Xếp luật lọc của một hệ thống: tập CẦN phải là tập con của tập CÓ.',
      lines: [
        'if not can:',
        '    print("invalid: he thong khong khai thanh phan can")',
        'elif can <= co:',
        '    print("allow: he thong chay tren entity")',
        'else:',
        '    print("allow: bo qua entity thieu thanh phan")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG luật lọc entity của một hệ thống. Đọc `can:<danh sách ngăn bằng dấu |>,co:<danh sách ngăn bằng dấu |>`. Thiếu/thừa trường → `invalid: field`; danh sách `can` rỗng → `invalid: he thong khong khai thanh phan can`; thành phần nào không nằm trong bộ khai báo {vitri, vantoc, mau, vecham, hinhve} → `unknown: thanh phan chua khai bao`; `can` là tập con của `co` → `allow: he thong chay tren entity`; còn lại → `allow: bo qua entity thieu thanh phan`. Không engine, không thư viện ECS thật, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG ECS mức dùng được; entity chỉ là một tập thành phần.\n',
      testCases: [
        {
          stdinLines: ['can:vitri|vantoc,co:vitri|vantoc|mau'],
          expected: 'allow: he thong chay tren entity',
          match: 'contains',
          hidden: false,
          label: 'entity có đủ thành phần hệ thống cần',
        },
        {
          stdinLines: ['can:vitri|vantoc,co:vitri|mau'],
          expected: 'allow: bo qua entity thieu thanh phan',
          match: 'contains',
          hidden: true,
          label: 'thiếu thành phần là bỏ qua, KHÔNG phải lỗi',
        },
        {
          stdinLines: ['can:vitri,co:vitri'],
          expected: 'allow: he thong chay tren entity',
          match: 'contains',
          hidden: true,
          label: 'tập bằng nhau vẫn là tập con — biên phải đúng',
        },
        {
          stdinLines: ['can:vitri|bayduoc,co:vitri|vantoc'],
          expected: 'unknown: thanh phan chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'thành phần lạ là lỗi khai báo, không phải thiếu dữ liệu',
        },
        {
          stdinLines: ['can:,co:vitri|vantoc'],
          expected: 'invalid: he thong khong khai thanh phan can',
          match: 'contains',
          hidden: true,
          label: 'ca âm — hệ thống không khai tập cần sẽ chạy trên mọi entity, fail closed',
        },
      ],
      hints: [
        'Tách danh sách bằng `split("|")` rồi bỏ phần tử rỗng trước khi so sánh.',
        'Python có sẵn phép so tập con: `tap_can <= tap_co`.',
        'Không dùng file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `KHAI_BAO = {"vitri", "vantoc", "mau", "vecham", "hinhve"}


def tap(x):
    return {p for p in x.split("|") if p != ""}


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"can", "co"}:
        print("invalid: field")
    else:
        can, co = tap(m["can"]), tap(m["co"])
        if not can:
            print("invalid: he thong khong khai thanh phan can")
        elif not (can | co) <= KHAI_BAO:
            print("unknown: thanh phan chua khai bao")
        elif can <= co:
            print("allow: he thong chay tren entity")
        else:
            print("allow: bo qua entity thieu thanh phan")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một dự án Godot hoặc Unity của bạn đang dùng kế thừa cho kẻ địch và vẽ lại ba loại kẻ địch thành TẬP THÀNH PHẦN thay vì cây lớp. Sau đó nghĩ ra một loại kẻ địch thứ tư lai giữa hai loại cũ, rồi ghi lại: với cây kế thừa bạn phải sửa bao nhiêu tệp, với tập thành phần bạn phải sửa bao nhiêu.',
    srsCards: [
      {
        hoi: 'Vì sao entity thiếu thành phần phải được BỎ QUA chứ không báo lỗi?',
        dap: 'Vì thiếu là trạng thái bình thường: tường không có vận tốc, hiệu ứng không có máu. Báo lỗi ở đây biến mỗi lần thêm loại entity mới thành một đợt vá mọi hệ thống, đúng thứ mà kiến trúc thành phần sinh ra để tránh.',
      },
      {
        hoi: 'Khác nhau giữa "thiếu thành phần" và "thành phần chưa khai báo" là gì?',
        dap: 'Thiếu thành phần là dữ liệu hợp lệ của một entity khác loại — bỏ qua; thành phần chưa khai báo là lỗi gõ sai hoặc quên đăng ký trong mã — phải kêu lên, vì im lặng bỏ qua nó sẽ khiến một hệ thống không bao giờ chạy mà không ai biết.',
      },
    ],
  },
  {
    id: 'p6-u246-l2',
    unitId: 'p6-u246',
    language: 'python',
    title: 'MÔ PHỎNG luật ghi của hệ thống: hai hệ thống cùng ghi một thành phần là xung đột',
    hook: 'Nhân vật giật lùi một cách ngẫu nhiên, và nguyên nhân là hai hệ thống cùng ghi vị trí trong một bước — cái nào chạy sau thì thắng.',
    theory:
      'Trong kiến trúc ECS, các hệ thống chạy theo một THỨ TỰ CỐ ĐỊNH đã khai báo, không theo thứ tự ngẫu nhiên của một tập hợp hay một từ điển — vì thứ tự đổi thì kết quả đổi, và một trò chơi mà kết quả đổi theo thứ tự duyệt thì không tái lập được, không test được, không chơi mạng được. Luật thứ hai đi kèm: mỗi hệ thống khai trước những thành phần nó được GHI, và hai hệ thống không được cùng ghi một thành phần trong cùng một bước. Nếu cho phép, kết quả phụ thuộc cái nào chạy sau — một lỗi lúc có lúc không, khó tái hiện nhất trong nghề. Cổng phải `deny` và gọi đúng tên thành phần bị tranh chấp. Đọc chung một thành phần thì hoàn toàn được: chỉ GHI mới sinh xung đột. Đây là MÔ PHỎNG hữu hạn, tất định, không engine.',
    workedExample: {
      code: `# MO PHONG luat ghi; hai he thong khai truoc thanh phan minh duoc ghi.\nghi_a, ghi_b = {"vitri"}, {"mau"}\nchung = ghi_a & ghi_b\nprint("deny: tranh chap thanh phan" if chung else "allow: hai he thong doc lap")`,
      stdinLines: [],
    },
    predict: {
      code: `ghi_a, ghi_b = {"vitri", "vantoc"}, {"vitri"}\nchung = sorted(ghi_a & ghi_b)\nprint("deny: tranh chap thanh phan " + chung[0] if chung else "allow: hai he thong doc lap")`,
      question:
        'Hệ thống di chuyển ghi `vitri` và `vantoc`, hệ thống đẩy lùi cũng ghi `vitri`. MÔ PHỎNG in gì?',
      choices: [
        'deny: tranh chap thanh phan vitri',
        'allow: hai he thong doc lap',
        'deny: tranh chap thanh phan vantoc',
        'unknown: thu tu chua khai bao',
      ],
      answerIndex: 0,
      explain:
        'Cả hai cùng ghi `vitri` trong một bước nên kết quả phụ thuộc hệ thống nào chạy sau — đúng khuôn lỗi "giật lùi ngẫu nhiên". Chú ý `sorted` ở đây không phải để đẹp mắt mà để lời báo lỗi luôn giống nhau, không phụ thuộc thứ tự duyệt của tập hợp.',
    },
    parsons: {
      prompt:
        'Xếp cổng xung đột ghi: tên thành phần tranh chấp phải tất định, không theo thứ tự tập hợp.',
      lines: [
        'chung = sorted(ghi_a & ghi_b)',
        'if not ghi_a or not ghi_b:',
        '    print("invalid: he thong khong khai thanh phan ghi")',
        'elif chung:',
        '    print("deny: tranh chap thanh phan " + chung[0])',
        'else:',
        '    print("allow: hai he thong doc lap")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng luật ghi giữa hai hệ thống trong một bước. Đọc `ghi_a:<danh sách ngăn bằng |>,ghi_b:<danh sách ngăn bằng |>,doc_chung:<0|1>`. Thiếu/thừa trường → `invalid: field`; doc_chung ngoài {0,1} → `invalid: doc_chung`; một trong hai danh sách ghi rỗng → `invalid: he thong khong khai thanh phan ghi`; thành phần ngoài bộ khai báo {vitri, vantoc, mau, vecham, hinhve} → `unknown: thanh phan chua khai bao`; hai tập ghi có phần chung → `deny: tranh chap thanh phan <tên nhỏ nhất theo thứ tự chữ cái>`; còn lại → `allow: hai he thong doc lap`. Không engine, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG luật ghi của ECS; thứ tự hệ thống cố định, kết quả phải tất định.\n',
      testCases: [
        {
          stdinLines: ['ghi_a:vitri|vantoc,ghi_b:mau,doc_chung:1'],
          expected: 'allow: hai he thong doc lap',
          match: 'contains',
          hidden: false,
          label: 'cùng ĐỌC một thành phần thì không sao — chỉ ghi mới xung đột',
        },
        {
          stdinLines: ['ghi_a:vitri|vantoc,ghi_b:vitri,doc_chung:0'],
          expected: 'deny: tranh chap thanh phan vitri',
          match: 'contains',
          hidden: true,
          label: 'hai hệ thống cùng ghi vị trí trong một bước bị chặn',
        },
        {
          stdinLines: ['ghi_a:mau|vitri,ghi_b:vitri|mau,doc_chung:0'],
          expected: 'deny: tranh chap thanh phan mau',
          match: 'contains',
          hidden: true,
          label: 'nhiều thành phần tranh chấp thì tên báo ra phải tất định theo thứ tự chữ cái',
        },
        {
          stdinLines: ['ghi_a:vitri,ghi_b:baynhanh,doc_chung:0'],
          expected: 'unknown: thanh phan chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'thành phần lạ là lỗi khai báo',
        },
        {
          stdinLines: ['ghi_a:,ghi_b:mau,doc_chung:0'],
          expected: 'invalid: he thong khong khai thanh phan ghi',
          match: 'contains',
          hidden: true,
          label: 'ca âm — hệ thống không khai tập ghi thì không kiểm được xung đột, fail closed',
        },
      ],
      hints: [
        'Dùng `sorted(...)` trên phần giao để tên báo ra không phụ thuộc thứ tự duyệt của tập hợp.',
        'Đọc chung không sinh xung đột — trường `doc_chung` chỉ để nhắc bạn điều đó.',
        'Không dùng file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `KHAI_BAO = {"vitri", "vantoc", "mau", "vecham", "hinhve"}


def tap(x):
    return {p for p in x.split("|") if p != ""}


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"ghi_a", "ghi_b", "doc_chung"}:
        print("invalid: field")
    elif m["doc_chung"] not in {"0", "1"}:
        print("invalid: doc_chung")
    else:
        a, b = tap(m["ghi_a"]), tap(m["ghi_b"])
        chung = sorted(a & b)
        if not a or not b:
            print("invalid: he thong khong khai thanh phan ghi")
        elif not (a | b) <= KHAI_BAO:
            print("unknown: thanh phan chua khai bao")
        elif chung:
            print("deny: tranh chap thanh phan " + chung[0])
        else:
            print("allow: hai he thong doc lap")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, liệt kê mọi hệ thống trong một dự án Godot hoặc Unity của bạn thành bảng ba cột: tên hệ thống — thành phần nó ĐỌC — thành phần nó GHI. Khoanh mọi ô xuất hiện ở cột GHI của từ hai hệ thống trở lên; với mỗi ô như vậy hãy quyết định hệ thống nào được giữ quyền ghi, và viết một câu giải thích vì sao.',
    srsCards: [
      {
        hoi: 'Vì sao hai hệ thống cùng GHI một thành phần trong cùng một bước là lỗi, còn cùng ĐỌC thì không?',
        dap: 'Đọc không làm đổi dữ liệu nên bao nhiêu hệ thống cùng đọc cũng ra một kết quả; ghi thì cái chạy sau đè lên cái chạy trước, nên kết quả phụ thuộc thứ tự — sinh ra lỗi lúc có lúc không, không tái hiện được.',
      },
      {
        hoi: 'Vì sao thứ tự chạy của các hệ thống phải cố định và khai tường minh?',
        dap: 'Vì kết quả một bước phụ thuộc thứ tự; thứ tự cố định là điều kiện để trò chơi tái lập được từ cùng một hạt giống, và tái lập được là điều kiện để test tự động và để chơi mạng.',
      },
    ],
  },
]
