// lessons/p6u257.ts — P6-U257: HƯỚNG GAME, chặng S4 — module `game-s4-m4` (phát hành thương mại:
// yêu cầu kỹ thuật từng nền tảng, bản địa hoá, trợ năng, vá lỗi sau phát hành).
//
// Bài 1 lo CHECKLIST NỀN TẢNG: thiếu một mục bắt buộc là `reject`, đủ hết mới `pass` — cổng phát
// hành của nền tảng không thương lượng. Bài 2 lo BẢN ĐỊA HOÁ: chuỗi đã dịch dài hơn khung UI khai
// báo thì `overflow`, vì tiếng Đức và tiếng Việt dài hơn tiếng Anh ở gần như mọi nút bấm.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: không gọi cổng phát hành thật, không dựng UI thật, không I/O ngoài.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U257_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u257-l1',
    unitId: 'p6-u257',
    language: 'python',
    title: 'MÔ PHỎNG checklist phát hành: thiếu một mục bắt buộc là trượt cả đợt nộp',
    hook: 'Bị nền tảng trả bài không tốn tiền, nó tốn HAI TUẦN — và hai tuần đó thường rơi đúng vào lịch ra mắt bạn đã hứa.',
    theory:
      'Mỗi cổng phát hành có một danh sách yêu cầu kỹ thuật bắt buộc, và phần lớn chúng không liên quan tới việc trò chơi có hay hay không: kích thước bản build trong hạn, giữ được tỉ lệ khung hình tối thiểu trên máy cấu hình chuẩn, có tuỳ chọn trợ năng, có màn hình pháp lý, có cách thoát rõ ràng. Cổng này không thương lượng — thiếu một mục là cả đợt nộp bị trả lại, và vòng nộp lại thường mất nhiều ngày. Vì vậy checklist phải được chạy như một cổng TRONG đường ống build, sớm và thường xuyên, chứ không phải một tờ giấy đọc vào đêm trước hạn nộp. Trợ năng không phải mục "làm nếu còn thời gian": nó là điều kiện để một phần người chơi chơi được trò chơi của bạn, và nhiều nền tảng đã đưa nó vào danh sách bắt buộc. Đây là MÔ PHỎNG Python hữu hạn trên danh sách nhãn: không gọi cổng phát hành thật.',
    workedExample: {
      code: `# MO PHONG checklist phat hanh; muc bat buoc khai bao truoc.\nBAT_BUOC = {"kich_thuoc_build", "fps_toi_thieu", "tro_nang", "man_hinh_phap_ly"}\nda_co = {"kich_thuoc_build", "fps_toi_thieu", "tro_nang", "man_hinh_phap_ly"}\nthieu = sorted(BAT_BUOC - da_co)\nprint("pass: du checklist" if not thieu else "reject: thieu " + thieu[0])`,
      stdinLines: [],
    },
    predict: {
      code: `BAT_BUOC = {"kich_thuoc_build", "fps_toi_thieu", "tro_nang"}\nda_co = {"kich_thuoc_build", "fps_toi_thieu"}\nthieu = sorted(BAT_BUOC - da_co)\nprint("reject: thieu " + thieu[0] if thieu else "pass: du checklist")`,
      question: 'Bản nộp có đủ mọi mục trừ tuỳ chọn trợ năng. MÔ PHỎNG in gì?',
      choices: [
        'reject: thieu tro_nang',
        'pass: du checklist',
        'overflow: chuoi dai hon khung UI',
        'unknown: chua khai muc nao',
      ],
      answerIndex: 0,
      explain:
        'Trợ năng nằm trong danh sách BẮT BUỘC nên thiếu nó là trượt, đúng như thiếu bất kỳ mục kỹ thuật nào khác. Chú ý `sorted` ở đây để lời từ chối luôn giống nhau giữa các lần chạy, không phụ thuộc thứ tự duyệt tập hợp.',
    },
    parsons: {
      prompt: 'Xếp cổng checklist: gọi tên mục thiếu một cách tất định, không nói "chưa đủ".',
      lines: [
        'if not da_co:',
        '    print("unknown: chua khai muc nao")',
        'elif not da_co <= BAT_BUOC | TUY_CHON:',
        '    print("invalid: muc checklist la")',
        'else:',
        '    thieu = sorted(BAT_BUOC - da_co)',
        '    print("reject: thieu " + thieu[0] if thieu else "pass: du checklist")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng checklist phát hành. Mục BẮT BUỘC: `kich_thuoc_build`, `fps_toi_thieu`, `tro_nang`, `man_hinh_phap_ly`. Mục tuỳ chọn hợp lệ: `thanh_tuu`, `dam_may_luu`. Đọc `da_co:<danh sách nhãn ngăn bằng |>`. Thiếu/thừa trường → `invalid: field`; danh sách rỗng → `unknown: chua khai muc nao`; có nhãn ngoài hai bộ trên → `invalid: muc checklist la`; thiếu ≥ 1 mục bắt buộc → `reject: thieu <mục thiếu nhỏ nhất theo thứ tự chữ cái>`; đủ hết → `pass: du checklist`. Không gọi cổng phát hành thật, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG checklist phát hành; chỉ so danh sách nhãn, không nộp gì cả.\n',
      testCases: [
        {
          stdinLines: ['da_co:kich_thuoc_build|fps_toi_thieu|tro_nang|man_hinh_phap_ly'],
          expected: 'pass: du checklist',
          match: 'contains',
          hidden: false,
          label: 'đủ bốn mục bắt buộc thì qua cổng',
        },
        {
          stdinLines: ['da_co:kich_thuoc_build|fps_toi_thieu|man_hinh_phap_ly'],
          expected: 'reject: thieu tro_nang',
          match: 'contains',
          hidden: true,
          label: 'trợ năng là mục bắt buộc, không phải "làm nếu còn thời gian"',
        },
        {
          stdinLines: ['da_co:kich_thuoc_build|tro_nang|man_hinh_phap_ly|thanh_tuu'],
          expected: 'reject: thieu fps_toi_thieu',
          match: 'contains',
          hidden: true,
          label: 'mục tuỳ chọn không bù được cho mục bắt buộc còn thiếu',
        },
        {
          stdinLines: ['da_co:'],
          expected: 'unknown: chua khai muc nao',
          match: 'contains',
          hidden: true,
          label: 'chưa khai gì thì chưa kết luận được, không phải "thiếu hết"',
        },
        {
          stdinLines: ['da_co:kich_thuoc_build|che_do_bi_mat'],
          expected: 'invalid: muc checklist la',
          match: 'contains',
          hidden: true,
          label: 'ca âm — nhãn ngoài bộ khai báo fail closed',
        },
      ],
      hints: [
        'Dùng `sorted(...)` trên phần thiếu để lời từ chối tất định giữa các lần chạy.',
        'Mục tuỳ chọn hợp lệ nhưng KHÔNG tính vào phần bắt buộc — đừng gộp hai bộ khi kiểm thiếu.',
        'Không dùng file, socket, subprocess, requests hay thời gian thực.',
      ],
      sampleSolution: `BAT_BUOC = {"kich_thuoc_build", "fps_toi_thieu", "tro_nang", "man_hinh_phap_ly"}
TUY_CHON = {"thanh_tuu", "dam_may_luu"}

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"da_co"}:
        print("invalid: field")
    else:
        da_co = {p for p in m["da_co"].split("|") if p != ""}
        if not da_co:
            print("unknown: chua khai muc nao")
        elif not da_co <= BAT_BUOC | TUY_CHON:
            print("invalid: muc checklist la")
        else:
            thieu = sorted(BAT_BUOC - da_co)
            if thieu:
                print("reject: thieu " + thieu[0])
            else:
                print("pass: du checklist")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, mở tài liệu yêu cầu kỹ thuật thật của MỘT cổng phát hành bạn định nộp (itch.io, Steam, hoặc cửa hàng di động) và chép ra danh sách mục bắt buộc của chính họ. Đối chiếu với dự án Godot hoặc Unity của bạn, đánh dấu từng mục đạt hay chưa, và ghi lại mục nào bạn không ngờ tới.',
    srsCards: [
      {
        hoi: 'Vì sao checklist phát hành nên chạy như một cổng trong đường ống build?',
        dap: 'Vì chi phí của một mục thiếu không phải là thời gian sửa nó mà là một vòng nộp lại kéo dài nhiều ngày; chạy sớm và thường xuyên thì mục thiếu lộ ra khi còn rẻ, thay vì vào đêm trước hạn nộp.',
      },
      {
        hoi: 'Vì sao trợ năng không phải mục "làm nếu còn thời gian"?',
        dap: 'Nó quyết định một phần người chơi có chơi được trò chơi của bạn hay không, và nhiều nền tảng đã đưa nó vào danh sách bắt buộc — nên bỏ qua nó vừa loại bớt người chơi vừa làm trượt cả đợt nộp.',
      },
    ],
  },
  {
    id: 'p6-u257-l2',
    unitId: 'p6-u257',
    language: 'python',
    title:
      'MÔ PHỎNG bản địa hoá: chuỗi đã dịch dài hơn khung UI là lỗi giao diện, không phải lỗi dịch',
    hook: 'Nút "Play" rộng 60 điểm ảnh sẽ vỡ ngay khi bản tiếng Việt ghi "Bắt đầu chơi" — và bạn chỉ biết sau khi người chơi gửi ảnh chụp.',
    theory:
      'Bản địa hoá không phải chỉ là dịch chuỗi: độ dài chuỗi đổi theo ngôn ngữ, và đổi rất nhiều. Tiếng Đức, tiếng Nga, tiếng Việt thường dài hơn tiếng Anh đáng kể ở đúng chỗ chật nhất là nút bấm và nhãn trong khung hẹp. Vì thế mỗi khung UI phải khai một độ dài tối đa, và cổng bản địa hoá so độ dài chuỗi đã dịch với con số đó: vượt là `overflow` — một lỗi GIAO DIỆN chứ không phải lỗi bản dịch, và cách sửa đúng thường là nới khung hoặc chọn cách diễn đạt ngắn hơn, không phải cắt cụt chuỗi. Chuỗi rỗng là `invalid`: khoá chưa được dịch mà lọt vào bản phát hành sẽ hiện ra dưới dạng một ô trống hoặc chính tên khoá. Đây là MÔ PHỎNG Python hữu hạn đếm ký tự: không dựng UI thật, không đo pixel thật.',
    workedExample: {
      code: `# MO PHONG kiem ban dia hoa; do dai tinh bang KY TU, khung UI khai bao truoc.\nchuoi, khung = "Bat dau", 12\nprint("pass: chuoi vua khung UI" if len(chuoi) <= khung else "overflow: chuoi dai hon khung UI")`,
      stdinLines: [],
    },
    predict: {
      code: `chuoi, khung = "Bat dau choi ngay", 12\nprint("overflow: chuoi dai hon khung UI" if len(chuoi) > khung else "pass: chuoi vua khung UI")`,
      question: 'Chuỗi đã dịch dài 17 ký tự trong một khung UI khai báo 12 ký tự. MÔ PHỎNG in gì?',
      choices: [
        'overflow: chuoi dai hon khung UI',
        'pass: chuoi vua khung UI',
        'reject: thieu tro_nang',
        'invalid: chuoi rong',
      ],
      answerIndex: 0,
      explain:
        'Đây là lỗi giao diện, không phải lỗi bản dịch: bản dịch có thể hoàn toàn đúng nghĩa. Cách sửa là nới khung hoặc chọn cách diễn đạt ngắn hơn — cắt cụt chuỗi chỉ làm người chơi đọc được một nửa câu.',
    },
    parsons: {
      prompt: 'Xếp cổng bản địa hoá: chuỗi rỗng là lỗi dịch, chuỗi dài là lỗi giao diện.',
      lines: [
        'if khung <= 0:',
        '    print("invalid: khung UI")',
        'elif chuoi == "":',
        '    print("invalid: chuoi rong")',
        'elif len(chuoi) > khung:',
        '    print("overflow: chuoi dai hon khung UI")',
        'else:',
        '    print("pass: chuoi vua khung UI")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng bản địa hoá. Đọc `chuoi:<chuỗi, có thể rỗng>,khung:<int>,ngon_ngu:<vi|en|de>`. Thiếu/thừa trường → `invalid: field`; khung không phải số nguyên → `invalid: khung UI`; khung ≤ 0 → `invalid: khung UI`; ngon_ngu lạ → `unknown: ngon ngu chua khai bao`; chuoi rỗng → `invalid: chuoi rong`; độ dài chuoi > khung → `overflow: chuoi dai hon khung UI <số ký tự vượt>`; còn lại → `pass: chuoi vua khung UI`. Lưu ý: chuỗi không chứa dấu phẩy hay dấu hai chấm. Không dựng UI thật, không đo pixel thật.',
      starterCode: '# MÔ PHỎNG bản địa hoá; đếm ký tự, không dựng giao diện thật.\n',
      testCases: [
        {
          stdinLines: ['chuoi:Bat dau,khung:12,ngon_ngu:vi'],
          expected: 'pass: chuoi vua khung UI',
          match: 'contains',
          hidden: false,
          label: 'chuỗi 8 ký tự vừa khung 12',
        },
        {
          stdinLines: ['chuoi:Bat dau choi ngay,khung:12,ngon_ngu:vi'],
          expected: 'overflow: chuoi dai hon khung UI 5',
          match: 'contains',
          hidden: true,
          label: 'vượt khung thì nói rõ vượt bao nhiêu ký tự',
        },
        {
          stdinLines: ['chuoi:Play,khung:12,ngon_ngu:en'],
          expected: 'pass: chuoi vua khung UI',
          match: 'contains',
          hidden: true,
          label: 'bản gốc tiếng Anh ngắn — chính vì thế khung hay bị đặt quá hẹp',
        },
        {
          stdinLines: ['chuoi:,khung:12,ngon_ngu:vi'],
          expected: 'invalid: chuoi rong',
          match: 'contains',
          hidden: true,
          label: 'khoá chưa dịch không được lọt vào bản phát hành',
        },
        {
          stdinLines: ['chuoi:Bat dau,khung:0,ngon_ngu:vi'],
          expected: 'invalid: khung UI',
          match: 'contains',
          hidden: true,
          label: 'ca âm — khung UI không dương fail closed',
        },
      ],
      hints: [
        'Tách dòng theo dấu phẩy và lấy đúng ba trường; đề bài đã bảo đảm chuỗi không chứa dấu phẩy.',
        'Lời báo overflow phải kèm số ký tự vượt — người sửa cần biết cần ngắn đi bao nhiêu.',
        'Không dùng file, socket, subprocess hay thư viện giao diện.',
      ],
      sampleSolution: `NGON_NGU = {"vi", "en", "de"}


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"chuoi", "khung", "ngon_ngu"}:
        print("invalid: field")
    elif so(m["khung"]) is None or so(m["khung"]) <= 0:
        print("invalid: khung UI")
    elif m["ngon_ngu"] not in NGON_NGU:
        print("unknown: ngon ngu chua khai bao")
    elif m["chuoi"] == "":
        print("invalid: chuoi rong")
    elif len(m["chuoi"]) > so(m["khung"]):
        print("overflow: chuoi dai hon khung UI " + str(len(m["chuoi"]) - so(m["khung"])))
    else:
        print("pass: chuoi vua khung UI")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy mười chuỗi giao diện trong dự án Godot hoặc Unity của bạn, dịch sang một ngôn ngữ dài hơn (tiếng Đức là bài kiểm khắc nghiệt nhất) rồi chạy trò chơi ở ngôn ngữ đó. Chụp màn hình mọi chỗ chữ bị tràn hoặc cắt cụt, và ghi lại bạn đã nới khung hay đổi cách diễn đạt cho từng chỗ.',
    srsCards: [
      {
        hoi: 'Vì sao chuỗi dịch tràn khung là lỗi giao diện chứ không phải lỗi bản dịch?',
        dap: 'Bản dịch có thể hoàn toàn đúng nghĩa; thứ sai là giả định ngầm rằng mọi ngôn ngữ dài bằng tiếng Anh. Cách sửa đúng là nới khung hoặc chọn diễn đạt ngắn hơn, không phải cắt cụt câu của người dịch.',
      },
      {
        hoi: 'Vì sao chuỗi rỗng phải là `invalid` chứ không phải "chưa dịch, hiển thị tạm"?',
        dap: 'Vì trong bản phát hành nó hiện ra thành ô trống hoặc chính tên khoá kỹ thuật, và người chơi không biết nút đó làm gì; chặn ở cổng buộc khoá thiếu bản dịch phải được xử lý trước khi nộp.',
      },
    ],
  },
]
