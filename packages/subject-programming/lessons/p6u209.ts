// lessons/p6u209.ts — P6-U209: HƯỚNG BẢO MẬT, chặng S4 — module `security-s4-m4` (quản trị và
// tuân thủ: chấm rủi ro, rủi ro bên thứ ba, ánh xạ khung tuân thủ, bằng chứng kiểm soát).
//
// Bài 1 hỏi "bản ghi rủi ro này có tư cách tồn tại không" (chấp nhận rủi ro mà không có chủ sở
// hữu hoặc ngày hết hiệu lực là chấp nhận vĩnh viễn, không ai rà lại). Bài 2 hỏi "lời khai này
// có bằng chứng không" (nhà cung cấp thiếu thoả thuận xử lý dữ liệu; kiểm soát khai đạt mà không
// có bằng chứng thì là not-reported, TUYỆT ĐỐI không quy thành pass).
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Nội dung pháp luật ở đây chỉ ở mức KHÁI NIỆM và kèm câu miễn trừ bắt buộc.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U209_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u209-l1',
    unitId: 'p6-u209',
    language: 'python',
    title: 'MÔ PHỎNG chấm rủi ro tồn dư (residual risk) và điều kiện để "chấp nhận" là hợp lệ',
    hook: '"Rủi ro này chúng ta chấp nhận" — không tên người, không ngày hết hiệu lực — là câu biến một quyết định thành một sự im lặng vĩnh viễn.',
    theory:
      'Chấm rủi ro trong quản trị an toàn là phép nhân đơn giản: khả năng xảy ra × mức tác động, cho ra điểm rủi ro tồn dư (residual risk) SAU khi đã tính các kiểm soát đang có. Con số đó không phải để xếp hạng cho đẹp, nó để chọn xem tiêu nguồn lực vào đâu trước.\nPhần dễ hỏng nằm ở quyết định "chấp nhận": chấp nhận một rủi ro là hợp lệ và thường là đúng, NHƯNG chỉ khi có đủ hai thứ — một chủ sở hữu đích danh và một ngày hết hiệu lực để rà lại. Thiếu một trong hai thì đó không còn là quyết định, mà là cách đóng hồ sơ cho khuất mắt. Mục đích phòng thủ của bài: giữ cho danh mục rủi ro là thứ sống và được rà, thay vì một bảng tính không ai mở. Đây là MÔ PHỎNG trên bản ghi tổng hợp; nội dung liên quan pháp luật chỉ ở mức khái niệm và không thay thế ý kiến pháp lý.',
    workedExample: {
      code: `# MO PHONG cham rui ro ton du; ban ghi tong hop, khong phai danh muc that.\nkhanang, tacdong = 3, 4\nprint("allow: rui ro ton du " + str(khanang * tacdong))`,
      stdinLines: [],
    },
    predict: {
      code: `quyetdinh, chusohuu = "chap-nhan", "-"\nprint("invalid: chap nhan thieu chu so huu" if quyetdinh == "chap-nhan" and chusohuu == "-" else "allow: rui ro ton du 12")`,
      question: 'Một rủi ro được đánh dấu "chấp nhận" nhưng ô chủ sở hữu bỏ trống. In gì?',
      choices: [
        'invalid: chap nhan thieu chu so huu',
        'allow: rui ro ton du 12',
        'deny: rui ro ben thu ba o muc cao',
        'not-reported: khong co bang chung',
      ],
      answerIndex: 0,
      explain:
        'Bản ghi rủi ro không hợp lệ chứ không phải rủi ro bị bác: thiếu tên người thì không ai rà lại nó, nên hệ thống trả invalid để buộc điền vào chỗ trống trước khi quyết định có hiệu lực.',
    },
    parsons: {
      prompt:
        'Xếp cổng danh mục rủi ro: kiểm điều kiện của quyết định "chấp nhận" trước khi in điểm.',
      lines: [
        'if quyetdinh == "chap-nhan" and chusohuu == "-":',
        '    print("invalid: chap nhan thieu chu so huu")',
        'elif quyetdinh == "chap-nhan" and hethieuluc == "-":',
        '    print("invalid: chap nhan thieu ngay het hieu luc")',
        'else:',
        '    print("allow: rui ro ton du " + str(khanang * tacdong))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng danh mục rủi ro. Đọc `khanang:<1-5>,tacdong:<1-5>,quyetdinh:<chap-nhan|giam-thieu>,chusohuu:<tên|->,hethieuluc:<co|->`. Thiếu/thừa trường → `invalid: field`; `khanang`/`tacdong` sai kiểu hoặc ngoài 1–5 → `invalid: khanang` / `invalid: tacdong`; `quyetdinh` lạ → `invalid: quyetdinh`; `hethieuluc` lạ → `invalid: hethieuluc`. Sau đó, với `chap-nhan`: chủ sở hữu là `-` → `invalid: chap nhan thieu chu so huu`; hết hiệu lực là `-` → `invalid: chap nhan thieu ngay het hieu luc`. Còn lại in `allow: rui ro ton du <khanang*tacdong>`. Không dữ liệu thật, không đồng hồ hệ thống.',
      starterCode: '# MÔ PHỎNG danh mục rủi ro; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: [
            'khanang:3,tacdong:4,quyetdinh:giam-thieu,chusohuu:doi-ha-tang,hethieuluc:co',
          ],
          expected: 'allow: rui ro ton du 12',
          match: 'contains',
          hidden: false,
          label: 'giảm thiểu: điểm rủi ro tồn dư là 3 × 4',
        },
        {
          stdinLines: ['khanang:2,tacdong:5,quyetdinh:chap-nhan,chusohuu:-,hethieuluc:co'],
          expected: 'invalid: chap nhan thieu chu so huu',
          match: 'contains',
          hidden: true,
          label: 'chấp nhận mà không có ai đứng tên là không hợp lệ',
        },
        {
          stdinLines: [
            'khanang:2,tacdong:5,quyetdinh:chap-nhan,chusohuu:giam-doc-cntt,hethieuluc:-',
          ],
          expected: 'invalid: chap nhan thieu ngay het hieu luc',
          match: 'contains',
          hidden: true,
          label: 'chấp nhận không có ngày rà lại là chấp nhận vĩnh viễn',
        },
        {
          stdinLines: [
            'khanang:2,tacdong:5,quyetdinh:chap-nhan,chusohuu:giam-doc-cntt,hethieuluc:co',
          ],
          expected: 'allow: rui ro ton du 10',
          match: 'contains',
          hidden: true,
          label: 'chấp nhận đủ điều kiện thì ghi nhận kèm điểm tồn dư',
        },
        {
          stdinLines: [
            'khanang:9,tacdong:5,quyetdinh:giam-thieu,chusohuu:doi-ha-tang,hethieuluc:co',
          ],
          expected: 'invalid: khanang',
          match: 'contains',
          hidden: true,
          label: 'ca âm — điểm ngoài thang 1–5 fail closed',
        },
      ],
      hints: [
        'Kiểm đủ năm khoá, rồi kiểm miền giá trị của hai điểm số, rồi mới xét quyết định.',
        'Hai điều kiện của "chấp nhận" phải xét theo thứ tự cố định để kết quả tất định.',
        'Nhân hai số bằng phép nhân số nguyên rồi ép về chuỗi khi in, đừng nối chuỗi với số.',
      ],
      sampleSolution: `def diem(x):
    return int(x) if x.isdigit() and 1 <= int(x) <= 5 else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"khanang", "tacdong", "quyetdinh", "chusohuu", "hethieuluc"}:
        print("invalid: field")
    elif diem(m["khanang"]) is None:
        print("invalid: khanang")
    elif diem(m["tacdong"]) is None:
        print("invalid: tacdong")
    elif m["quyetdinh"] not in {"chap-nhan", "giam-thieu"}:
        print("invalid: quyetdinh")
    elif m["hethieuluc"] not in {"co", "-"}:
        print("invalid: hethieuluc")
    elif m["quyetdinh"] == "chap-nhan" and m["chusohuu"] == "-":
        print("invalid: chap nhan thieu chu so huu")
    elif m["quyetdinh"] == "chap-nhan" and m["hethieuluc"] == "-":
        print("invalid: chap nhan thieu ngay het hieu luc")
    else:
        print("allow: rui ro ton du " + str(diem(m["khanang"]) * diem(m["tacdong"])))
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, mở danh mục rủi ro của đội bạn (hoặc lập một danh mục năm dòng nếu chưa có) và với mỗi dòng đánh dấu "chấp nhận", tra xem có tên người và ngày rà lại không; dòng nào thiếu thì hỏi thẳng: ai sẽ là người trả lời nếu rủi ro đó thành sự cố. Nội dung pháp lý liên quan chỉ ở mức khái niệm và không thay thế ý kiến pháp lý của luật sư.',
    srsCards: [
      {
        hoi: 'Vì sao "chấp nhận rủi ro" thiếu ngày hết hiệu lực lại bị coi là bản ghi không hợp lệ?',
        dap: 'Vì bối cảnh đổi liên tục nhưng quyết định thì đứng yên; không có ngày rà lại thì nó thành chấp nhận vĩnh viễn, và không ai còn nhớ để hỏi lại khi rủi ro đã lớn lên.',
      },
      {
        hoi: 'Điểm rủi ro tồn dư dùng để làm gì, nếu nó không phải bảng xếp hạng?',
        dap: 'Để chọn thứ tự tiêu nguồn lực: nó nói rủi ro nào còn lại sau các kiểm soát đang có, nên việc đáng làm tiếp theo nằm ở dòng có điểm cao nhất.',
      },
    ],
  },
  {
    id: 'p6-u209-l2',
    unitId: 'p6-u209',
    language: 'python',
    title:
      'MÔ PHỎNG rủi ro bên thứ ba (third-party) và luật "khai đạt mà không có bằng chứng (evidence)"',
    hook: 'Một ô tích xanh trong bảng tuân thủ không phải là một biện pháp bảo vệ — nó chỉ là một câu người ta đã nói.',
    theory:
      'Quản trị và tuân thủ có hai chỗ hay bị làm cho có. Chỗ thứ nhất là rủi ro bên thứ ba (third-party): nhà cung cấp giữ dữ liệu của bạn mà không có thoả thuận xử lý dữ liệu, hoặc không có kế hoạch rút lui khi hợp tác chấm dứt, thì rủi ro đó là rủi ro của BẠN, không phải của họ.\nChỗ thứ hai là bằng chứng (evidence). Một kiểm soát khai là "đạt" nhưng không đính kèm bằng chứng nào thì trạng thái đúng của nó là `not-reported` — chưa báo cáo — chứ TUYỆT ĐỐI không phải `pass`. Quy nó thành đạt là tự tay dựng một bức tranh an toàn không có thật, và bức tranh đó sẽ được dùng để ra quyết định. Ánh xạ sang các khung tuân thủ (ví dụ ISO 27001, quy định bảo vệ dữ liệu cá nhân) ở bài này chỉ ở mức KHÁI NIỆM để bạn biết cấu trúc của chúng; nội dung pháp luật ở đây không thay thế ý kiến pháp lý của người có chuyên môn.',
    workedExample: {
      code: `# MO PHONG luat bang chung: khai dat ma khong co bang chung thi KHONG phai dat.\ntrangthai, bangchung = "dat", "khong"\nprint("not-reported: khai dat nhung khong co bang chung" if trangthai == "dat" and bangchung == "khong" else "allow: kiem soat dat co bang chung")`,
      stdinLines: [],
    },
    predict: {
      code: `dpa = "khong"\nprint("deny: rui ro ben thu ba o muc cao" if dpa == "khong" else "allow: nha cung cap dat nguong")`,
      question: 'Nhà cung cấp đang giữ dữ liệu nhưng không có thoả thuận xử lý dữ liệu. In gì?',
      choices: [
        'deny: rui ro ben thu ba o muc cao',
        'allow: nha cung cap dat nguong',
        'not-reported: khai dat nhung khong co bang chung',
        'violated: kiem soat khong dat',
      ],
      answerIndex: 0,
      explain:
        'Không có thoả thuận xử lý dữ liệu nghĩa là không có ràng buộc nào về việc họ được làm gì với dữ liệu của bạn — rủi ro nằm hết về phía bạn, nên cổng từ chối cho tới khi có thoả thuận.',
    },
    parsons: {
      prompt: 'Xếp cổng bằng chứng: phân biệt "không đạt" với "khai đạt mà chưa có bằng chứng".',
      lines: [
        'if trangthai == "khongdat":',
        '    print("violated: kiem soat khong dat")',
        'elif bangchung == "khong":',
        '    print("not-reported: khai dat nhung khong co bang chung")',
        'else:',
        '    print("allow: kiem soat dat co bang chung")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng rủi ro bên thứ ba (third-party) và cổng bằng chứng (evidence) của kiểm soát. Đọc `loai:<nhacungcap|kiemsoat>,dpa:<co|khong>,rutlui:<co|khong>,trangthai:<dat|khongdat>,bangchung:<co|khong>`. Thiếu/thừa trường → `invalid: field`; giá trị lạ ở trường nào → `invalid: <tên trường>`. Với `nhacungcap`: thiếu thoả thuận xử lý dữ liệu → `deny: rui ro ben thu ba o muc cao`; thiếu kế hoạch rút lui → `deny: khong co ke hoach rut lui`; còn lại → `allow: nha cung cap dat nguong`. Với `kiemsoat`: trạng thái `khongdat` → `violated: kiem soat khong dat`; khai `dat` mà không có bằng chứng → `not-reported: khai dat nhung khong co bang chung` (CẤM quy thành đạt); còn lại → `allow: kiem soat dat co bang chung`. Không dữ liệu thật, không chạm hệ ngoài.',
      starterCode: '# MÔ PHỎNG cổng tuân thủ; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['loai:nhacungcap,dpa:co,rutlui:co,trangthai:dat,bangchung:co'],
          expected: 'allow: nha cung cap dat nguong',
          match: 'contains',
          hidden: false,
          label: 'có thoả thuận xử lý dữ liệu và kế hoạch rút lui',
        },
        {
          stdinLines: ['loai:nhacungcap,dpa:khong,rutlui:co,trangthai:dat,bangchung:co'],
          expected: 'deny: rui ro ben thu ba o muc cao',
          match: 'contains',
          hidden: true,
          label: 'thiếu thoả thuận xử lý dữ liệu là rủi ro cao',
        },
        {
          stdinLines: ['loai:nhacungcap,dpa:co,rutlui:khong,trangthai:dat,bangchung:co'],
          expected: 'deny: khong co ke hoach rut lui',
          match: 'contains',
          hidden: true,
          label: 'không có đường rút lui là bị khoá vào nhà cung cấp',
        },
        {
          stdinLines: ['loai:kiemsoat,dpa:co,rutlui:co,trangthai:dat,bangchung:khong'],
          expected: 'not-reported: khai dat nhung khong co bang chung',
          match: 'contains',
          hidden: true,
          label: 'khai đạt mà không có bằng chứng thì KHÔNG phải đạt',
        },
        {
          stdinLines: ['loai:kiemsoat,dpa:co,rutlui:co,trangthai:khongdat,bangchung:co'],
          expected: 'violated: kiem soat khong dat',
          match: 'contains',
          hidden: true,
          label: 'không đạt là trạng thái khác hẳn với chưa báo cáo',
        },
        {
          stdinLines: ['loai:kiem-tra,dpa:co,rutlui:co,trangthai:dat,bangchung:co'],
          expected: 'invalid: loai',
          match: 'contains',
          hidden: true,
          label: 'ca âm — loại bản ghi lạ fail closed',
        },
      ],
      hints: [
        'Kiểm đủ năm khoá và tập giá trị cho phép trước khi rẽ nhánh theo loai.',
        'Nhánh kiểm soát có BA kết quả khác nhau — đừng gộp "không đạt" với "chưa có bằng chứng".',
        'Không dùng socket, subprocess, file hay thời gian thực.',
      ],
      sampleSolution: `MUC = {
    "loai": {"nhacungcap", "kiemsoat"},
    "dpa": {"co", "khong"},
    "rutlui": {"co", "khong"},
    "trangthai": {"dat", "khongdat"},
    "bangchung": {"co", "khong"},
}

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(MUC):
        print("invalid: field")
    else:
        xau = [k for k in ("loai", "dpa", "rutlui", "trangthai", "bangchung") if m[k] not in MUC[k]]
        if xau:
            print("invalid: " + xau[0])
        elif m["loai"] == "nhacungcap":
            if m["dpa"] == "khong":
                print("deny: rui ro ben thu ba o muc cao")
            elif m["rutlui"] == "khong":
                print("deny: khong co ke hoach rut lui")
            else:
                print("allow: nha cung cap dat nguong")
        elif m["trangthai"] == "khongdat":
            print("violated: kiem soat khong dat")
        elif m["bangchung"] == "khong":
            print("not-reported: khai dat nhung khong co bang chung")
        else:
            print("allow: kiem soat dat co bang chung")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, liệt kê ba nhà cung cấp đang giữ dữ liệu của sản phẩm bạn làm và tra xem mỗi bên có thoả thuận xử lý dữ liệu và kế hoạch rút lui không; sau đó chọn ba kiểm soát mà đội bạn tự khai là "đạt" và tìm bằng chứng cho từng cái — cái nào không tìm ra bằng chứng thì nó đang là not-reported. Đây là bài rèn tư duy quản trị, không thay thế ý kiến pháp lý.',
    srsCards: [
      {
        hoi: 'Kiểm soát khai "đạt" nhưng không có bằng chứng thì trạng thái đúng của nó là gì?',
        dap: 'Là not-reported — chưa báo cáo; quy nó thành đạt là dựng một bức tranh an toàn không có thật, rồi chính bức tranh đó được dùng để ra quyết định tiếp theo.',
      },
      {
        hoi: 'Vì sao thiếu kế hoạch rút lui khỏi một nhà cung cấp lại được tính là rủi ro?',
        dap: 'Vì khi hợp tác chấm dứt đột ngột — họ đóng cửa, đổi giá, hoặc vi phạm — bạn không có đường nào khác ngoài chịu trận, và dữ liệu của bạn vẫn đang nằm bên đó.',
      },
    ],
  },
]
