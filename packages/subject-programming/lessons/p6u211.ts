// lessons/p6u211.ts — P6-U211: HƯỚNG BẢO MẬT, chặng S3 — module `security-s3-m2` (vì sao an toàn
// bộ nhớ là biện pháp gốc rễ).
//
// Ranh giới cứng: bài là BỘ PHÁT HIỆN lỗi trên một mô hình ô nhớ TRỪU TƯỢNG có nhãn, không phải
// bài khai thác. Không địa chỉ, không con trỏ thô, không dựng dữ liệu tấn công — chỉ phân loại
// lỗi. Bài 2 chạy lại đúng chuỗi thao tác đó dưới ngữ nghĩa CÓ KIỂM BIÊN để thấy cả lớp lỗi này
// biến mất, tức là chứng minh bằng thực nghiệm vì sao ngôn ngữ an toàn bộ nhớ là biện pháp gốc rễ.
//
// Đặc tả: `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U211_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u211-l1',
    unitId: 'p6-u211',
    language: 'python',
    title: 'MÔ PHỎNG bộ phát hiện lỗi bộ nhớ: ghi ngoài biên, use-after-free, double-free, rò rỉ',
    hook: 'Ba phần tư lỗ hổng nghiêm trọng của phần mềm hệ thống trong nhiều năm đều rơi vào đúng bốn khuôn lỗi — và cả bốn đều phát hiện được bằng máy.',
    theory:
      'Mô hình trong bài là một bảng ô nhớ có nhãn: mỗi ô mang tên, độ dài, và cờ đã giải phóng hay chưa. Trên mô hình đó, bốn lớp lỗi kinh điển trở thành bốn câu hỏi máy trả lời được: ghi ra chỉ số nằm ngoài độ dài (kiểm biên — bounds checking — thất bại) là `oob-write`; đụng vào ô đã giải phóng là `use-after-free`; giải phóng lần thứ hai là `double-free`; kết thúc mà còn ô chưa giải phóng là `leak`.\nĐiều đáng nhớ không phải bốn cái tên, mà là: **cả bốn đều là hệ quả của việc ngôn ngữ giao cho lập trình viên tự nhớ hai thứ — biên và vòng đời** — rồi con người quên, như con người vẫn quên. "Viết cẩn thận hơn" không phải biện pháp, vì nó đặt cược vào chỗ đã thua sẵn.\nMục đích phòng thủ của bài: viết được bộ phát hiện, và từ đó thẩm định được một lựa chọn ngôn ngữ bằng hiểu biết chứ không bằng niềm tin. MÔ PHỎNG hữu hạn, không địa chỉ, không con trỏ thô, không chạm bộ nhớ thật.',
    workedExample: {
      code: `# MO PHONG o nho co nhan: ten -> [do dai, da giai phong chua].\no = {"a": [3, False]}\nchi_so = 5\nprint("oob-write: ghi ngoai bien" if chi_so >= o["a"][0] else "ok: chuoi thao tac an toan")`,
      stdinLines: [],
    },
    predict: {
      code: `o = {"a": [3, True]}\nprint("use-after-free: doc sau giai phong" if o["a"][1] else "ok: chuoi thao tac an toan")`,
      question: 'Ô `a` đã giải phóng rồi mới bị đọc, chỉ số vẫn trong biên. In gì?',
      choices: [
        'use-after-free: doc sau giai phong',
        'ok: chuoi thao tac an toan',
        'oob-write: ghi ngoai bien',
        'double-free: giai phong hai lan',
      ],
      answerIndex: 0,
      explain:
        'Chỉ số hợp lệ không cứu được gì khi ô đã hết vòng đời: cái ô đó có thể đã được cấp lại cho thứ khác, nên đọc nó là đọc dữ liệu của người lạ. Cờ vòng đời phải được xét TRƯỚC biên.',
    },
    parsons: {
      prompt: 'Xếp bộ phát hiện: xét vòng đời trước, rồi mới xét biên.',
      lines: [
        'if c[1]:',
        '    print("use-after-free: doc sau giai phong")',
        'elif i < 0 or i >= c[0]:',
        '    print("oob-write: ghi ngoai bien")',
        'else:',
        '    print("ok: chuoi thao tac an toan")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG bộ PHÁT HIỆN lỗi bộ nhớ trên mô hình ô nhớ có nhãn. Đọc `thaotac:<các thao tác cách nhau bằng dấu chấm phẩy>`, mỗi thao tác là `cap:<tên>:<độ dài>` · `ghi:<tên>:<chỉ số>` · `doc:<tên>:<chỉ số>` · `giai:<tên>`. Thiếu/thừa trường → `invalid: field`; thao tác lạ → `invalid: thao tac la`; độ dài không phải số nguyên dương → `invalid: kich thuoc khong hop le`; đụng ô chưa cấp phát → `invalid: o nho chua cap phat`; chỉ số sai kiểu → `invalid: chi so`; đọc ngoài biên → `invalid: chi so ngoai bien` (mô hình này chỉ kiểm biên cho thao tác GHI, vì đó là thao tác làm hỏng dữ liệu bên cạnh). Lỗi phát hiện được, xét theo thứ tự thao tác, dừng ở lỗi đầu tiên: đụng ô đã giải phóng → `use-after-free: doc sau giai phong` hoặc `use-after-free: ghi sau giai phong`; ghi ngoài biên → `oob-write: ghi ngoai bien`; giải phóng lần hai → `double-free: giai phong hai lan`. Hết chuỗi mà còn ô chưa giải phóng → `leak: con o nho chua giai phong`; còn lại → `ok: chuoi thao tac an toan`. KHÔNG in địa chỉ, không dựng dữ liệu tấn công — chỉ phân loại lỗi.',
      starterCode: '# MÔ PHỎNG bộ phát hiện lỗi bộ nhớ; chỉ phân loại, không in địa chỉ.\n',
      testCases: [
        {
          stdinLines: ['thaotac:cap:a:3;ghi:a:2;doc:a:0;giai:a'],
          expected: 'ok: chuoi thao tac an toan',
          match: 'contains',
          hidden: false,
          label: 'cấp, dùng trong biên, giải phóng đúng một lần',
        },
        {
          stdinLines: ['thaotac:cap:a:3;ghi:a:5;giai:a'],
          expected: 'oob-write: ghi ngoai bien',
          match: 'contains',
          hidden: true,
          label: 'ghi ra chỉ số 5 trên ô dài 3',
        },
        {
          stdinLines: ['thaotac:cap:a:3;giai:a;doc:a:0'],
          expected: 'use-after-free: doc sau giai phong',
          match: 'contains',
          hidden: true,
          label: 'chỉ số hợp lệ nhưng ô đã hết vòng đời',
        },
        {
          stdinLines: ['thaotac:cap:a:3;giai:a;giai:a'],
          expected: 'double-free: giai phong hai lan',
          match: 'contains',
          hidden: true,
          label: 'giải phóng lần thứ hai',
        },
        {
          stdinLines: ['thaotac:cap:a:3;ghi:a:0'],
          expected: 'leak: con o nho chua giai phong',
          match: 'contains',
          hidden: true,
          label: 'kết thúc mà chưa trả ô nào',
        },
        {
          stdinLines: ['thaotac:cap:a:0;ghi:a:0'],
          expected: 'invalid: kich thuoc khong hop le',
          match: 'contains',
          hidden: true,
          label: 'ca âm — độ dài 0 fail closed',
        },
      ],
      hints: [
        'Giữ mỗi ô là một danh sách hai phần tử [độ dài, đã giải phóng] để sửa được tại chỗ.',
        'Xét cờ đã giải phóng TRƯỚC khi xét biên; đảo thứ tự là đổi luôn tên lỗi báo ra.',
        'Kiểm rò rỉ CHỈ sau khi duyệt hết chuỗi, vì ô chưa giải phóng giữa chừng là bình thường.',
      ],
      sampleSolution: `def kiem(chuoi):
    o = {}
    for tt in chuoi.split(";"):
        p = tt.split(":")
        if p[0] == "cap":
            if len(p) != 3 or not p[2].isdigit() or int(p[2]) <= 0:
                return "invalid: kich thuoc khong hop le"
            o[p[1]] = [int(p[2]), False]
        elif p[0] in {"ghi", "doc"}:
            if len(p) != 3 or p[1] not in o:
                return "invalid: o nho chua cap phat"
            if not p[2].lstrip("-").isdigit():
                return "invalid: chi so"
            i, c = int(p[2]), o[p[1]]
            if c[1]:
                return ("use-after-free: doc sau giai phong" if p[0] == "doc"
                        else "use-after-free: ghi sau giai phong")
            if i < 0 or i >= c[0]:
                return ("oob-write: ghi ngoai bien" if p[0] == "ghi"
                        else "invalid: chi so ngoai bien")
        elif p[0] == "giai":
            if len(p) != 2 or p[1] not in o:
                return "invalid: o nho chua cap phat"
            if o[p[1]][1]:
                return "double-free: giai phong hai lan"
            o[p[1]][1] = True
        else:
            return "invalid: thao tac la"
    if any(not c[1] for c in o.values()):
        return "leak: con o nho chua giai phong"
    return "ok: chuoi thao tac an toan"


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    print(kiem(m["thaotac"]) if set(m) == {"thaotac"} else "invalid: field")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, tìm trong một dự án mã nguồn mở viết bằng ngôn ngữ quản lý bộ nhớ thủ công một hàm có cấp phát và giải phóng, rồi viết ra mọi đường thoát khỏi hàm đó (kể cả nhánh lỗi sớm) và đánh dấu đường nào quên trả bộ nhớ — đó chính là khuôn lỗi rò rỉ trong đời thật.',
    srsCards: [
      {
        hoi: 'Vì sao cờ "đã giải phóng" phải được xét trước điều kiện biên?',
        dap: 'Vì một chỉ số hợp lệ trên ô đã hết vòng đời vẫn là lỗi: ô đó có thể đã được cấp lại cho dữ liệu khác, nên xét biên trước sẽ báo nhầm là an toàn.',
      },
      {
        hoi: 'Vì sao "viết cẩn thận hơn" không được coi là biện pháp cho lớp lỗi bộ nhớ?',
        dap: 'Vì bốn lỗi này sinh ra từ việc ngôn ngữ bắt con người tự nhớ biên và vòng đời ở mọi dòng; biện pháp gốc rễ là bỏ yêu cầu đó đi, không phải đòi con người đừng quên.',
      },
    ],
  },
  {
    id: 'p6-u211-l2',
    unitId: 'p6-u211',
    language: 'python',
    title: 'MÔ PHỎNG cùng chuỗi thao tác dưới ngữ nghĩa có kiểm biên: lỗi thành prevented',
    hook: 'Cách chứng minh một biện pháp là gốc rễ: chạy lại đúng chuỗi thao tác đã gây lỗi, dưới một ngữ nghĩa khác, và xem lớp lỗi đó biến mất.',
    theory:
      'Bài này lấy lại đúng bộ phát hiện của bài trước rồi thêm một công tắc: chế độ `tho` giữ nguyên ngữ nghĩa thủ công, chế độ `kiembien` mô phỏng ngôn ngữ memory-safe — nơi kiểm biên và quản lý vòng đời được ngôn ngữ bảo đảm chứ không giao cho người viết. Cùng một chuỗi thao tác, chế độ `tho` cho ra bốn lớp lỗi; chế độ `kiembien` cho ra `prevented` ở cả bốn.\nĐây là toàn bộ lập luận "an toàn bộ nhớ là biện pháp gốc rễ", trình bày bằng thực nghiệm thay vì bằng khẩu hiệu: lỗi không được phát hiện sớm hơn hay sửa nhanh hơn — nó KHÔNG CÒN TỒN TẠI như một lớp. Đổi lại là chi phí kiểm lúc chạy và ràng buộc lúc biên dịch; đó là đánh đổi thật, và biết được hai vế mới gọi là thẩm định.\nMục đích phòng thủ: khi phải chọn ngôn ngữ cho một thành phần xử lý dữ liệu không tin cậy, bạn có một lập luận đo được để đưa ra, thay vì cảm tính. MÔ PHỎNG hữu hạn, không địa chỉ, không bộ nhớ thật.',
    workedExample: {
      code: `# MO PHONG hai ngu nghia tren CUNG mot chuoi thao tac.\nloi, chedo = "oob-write", "kiembien"\nprint("prevented: " + loi + " bi chan boi ngon ngu memory-safe" if chedo == "kiembien" else loi)`,
      stdinLines: [],
    },
    predict: {
      code: `loi, chedo = "double-free", "tho"\nprint("prevented: " + loi + " bi chan boi ngon ngu memory-safe" if chedo == "kiembien" else loi + ": giai phong hai lan")`,
      question: 'Cùng chuỗi giải phóng hai lần, nhưng chạy ở chế độ `tho`. In gì?',
      choices: [
        'double-free: giai phong hai lan',
        'prevented: double-free bi chan boi ngon ngu memory-safe',
        'ok: chuoi thao tac an toan',
        'leak: con o nho chua giai phong',
      ],
      answerIndex: 0,
      explain:
        'Chế độ thô giữ nguyên ngữ nghĩa thủ công nên lỗi vẫn xảy ra và chỉ được PHÁT HIỆN; chỉ chế độ có kiểm biên mới biến nó thành prevented — chặn trước khi thành lỗi.',
    },
    parsons: {
      prompt: 'Xếp phần chuyển kết quả: chạy bộ phát hiện trước, rồi mới áp ngữ nghĩa của chế độ.',
      lines: [
        'kq = kiem(chuoi)',
        'lop = kq.split(":")[0]',
        'if chedo == "kiembien" and lop in LOI:',
        '    print("prevented: " + lop + " bi chan boi ngon ngu memory-safe")',
        'else:',
        '    print(kq)',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG so sánh hai ngữ nghĩa trên cùng một chuỗi thao tác. Đọc `chedo:<tho|kiembien>,thaotac:<chuỗi thao tác như bài trước>`. Thiếu/thừa trường → `invalid: field`; chế độ lạ → `invalid: che do`. Chạy bộ phát hiện của bài trước để ra kết quả; nếu chế độ là `kiembien` và lớp lỗi thuộc `oob-write`, `use-after-free`, `double-free`, `leak` thì in `prevented: <lớp lỗi> bi chan boi ngon ngu memory-safe`; mọi trường hợp còn lại in nguyên kết quả của bộ phát hiện. Không in địa chỉ, không dựng dữ liệu tấn công.',
      starterCode: '# MÔ PHỎNG hai ngữ nghĩa bộ nhớ; chỉ phân loại, không in địa chỉ.\n',
      testCases: [
        {
          stdinLines: ['chedo:tho,thaotac:cap:a:3;ghi:a:5;giai:a'],
          expected: 'oob-write: ghi ngoai bien',
          match: 'contains',
          hidden: false,
          label: 'ngữ nghĩa thủ công: lỗi xảy ra và được phát hiện',
        },
        {
          stdinLines: ['chedo:kiembien,thaotac:cap:a:3;ghi:a:5;giai:a'],
          expected: 'prevented: oob-write bi chan boi ngon ngu memory-safe',
          match: 'contains',
          hidden: true,
          label: 'cùng chuỗi đó dưới ngữ nghĩa có kiểm biên',
        },
        {
          stdinLines: ['chedo:kiembien,thaotac:cap:a:3;giai:a;doc:a:0'],
          expected: 'prevented: use-after-free bi chan boi ngon ngu memory-safe',
          match: 'contains',
          hidden: true,
          label: 'vòng đời do ngôn ngữ bảo đảm thì dùng sau giải phóng bị chặn',
        },
        {
          stdinLines: ['chedo:kiembien,thaotac:cap:a:3;giai:a;giai:a'],
          expected: 'prevented: double-free bi chan boi ngon ngu memory-safe',
          match: 'contains',
          hidden: true,
          label: 'giải phóng hai lần cũng biến mất như một lớp lỗi',
        },
        {
          stdinLines: ['chedo:kiembien,thaotac:cap:a:3;ghi:a:2;doc:a:0;giai:a'],
          expected: 'ok: chuoi thao tac an toan',
          match: 'contains',
          hidden: true,
          label: 'chuỗi vốn an toàn thì không bị đổi kết quả',
        },
        {
          stdinLines: ['chedo:sieu-an-toan,thaotac:cap:a:3'],
          expected: 'invalid: che do',
          match: 'contains',
          hidden: true,
          label: 'ca âm — chế độ lạ fail closed',
        },
      ],
      hints: [
        'Dùng lại nguyên hàm phát hiện của bài trước; bài này chỉ thêm một lớp chuyển kết quả.',
        'Lấy lớp lỗi bằng cách cắt phần trước dấu hai chấm đầu tiên của kết quả.',
        'Chuỗi vốn hợp lệ phải giữ nguyên kết quả ở cả hai chế độ — kiểm biên không đổi hành vi của mã đúng.',
      ],
      sampleSolution: `LOI = {"oob-write", "use-after-free", "double-free", "leak"}


def kiem(chuoi):
    o = {}
    for tt in chuoi.split(";"):
        p = tt.split(":")
        if p[0] == "cap":
            if len(p) != 3 or not p[2].isdigit() or int(p[2]) <= 0:
                return "invalid: kich thuoc khong hop le"
            o[p[1]] = [int(p[2]), False]
        elif p[0] in {"ghi", "doc"}:
            if len(p) != 3 or p[1] not in o:
                return "invalid: o nho chua cap phat"
            if not p[2].lstrip("-").isdigit():
                return "invalid: chi so"
            i, c = int(p[2]), o[p[1]]
            if c[1]:
                return ("use-after-free: doc sau giai phong" if p[0] == "doc"
                        else "use-after-free: ghi sau giai phong")
            if i < 0 or i >= c[0]:
                return ("oob-write: ghi ngoai bien" if p[0] == "ghi"
                        else "invalid: chi so ngoai bien")
        elif p[0] == "giai":
            if len(p) != 2 or p[1] not in o:
                return "invalid: o nho chua cap phat"
            if o[p[1]][1]:
                return "double-free: giai phong hai lan"
            o[p[1]][1] = True
        else:
            return "invalid: thao tac la"
    if any(not c[1] for c in o.values()):
        return "leak: con o nho chua giai phong"
    return "ok: chuoi thao tac an toan"


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"chedo", "thaotac"}:
        print("invalid: field")
    elif m["chedo"] not in {"tho", "kiembien"}:
        print("invalid: che do")
    else:
        kq = kiem(m["thaotac"])
        lop = kq.split(":")[0]
        if m["chedo"] == "kiembien" and lop in LOI:
            print("prevented: " + lop + " bi chan boi ngon ngu memory-safe")
        else:
            print(kq)
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chọn một thành phần trong hệ của bạn có xử lý dữ liệu từ bên ngoài (phân tích tệp tải lên, đọc gói tin, giải nén) và viết ra hai cột: nó đang viết bằng ngôn ngữ nào, và nếu viết lại bằng ngôn ngữ an toàn bộ nhớ thì mất gì được gì — đó là bản nháp của một quyết định kiến trúc thật.',
    srsCards: [
      {
        hoi: 'Khác nhau giữa "phát hiện được lỗi bộ nhớ" và "lỗi bộ nhớ không còn tồn tại như một lớp" là gì?',
        dap: 'Phát hiện vẫn cần lỗi xảy ra rồi mới thấy và vẫn sót ca chưa chạy tới; ngôn ngữ an toàn bộ nhớ loại bỏ khả năng viết ra lỗi đó, nên không còn gì để sót.',
      },
      {
        hoi: 'Cái giá phải trả khi chọn ngôn ngữ an toàn bộ nhớ là gì?',
        dap: 'Chi phí kiểm lúc chạy và ràng buộc chặt hơn lúc biên dịch, đôi khi cả chi phí viết lại — biết cả hai vế mới gọi là thẩm định chứ không phải tin theo khẩu hiệu.',
      },
    ],
  },
]
