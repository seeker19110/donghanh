// lessons/p6u250.ts — P6-U250: HƯỚNG GAME, chặng S3 "Đồ hoạ và hiệu năng" —
// module `game-s3-m1` (đường ống dựng hình: đỉnh → điểm ảnh, bộ đệm chiều sâu, lệnh vẽ và gộp lô).
//
// Bài 1 lo GỘP LÔ: gộp nhiều vật thể chung vật liệu vào một lệnh vẽ (draw call) để giảm số lần
// nói chuyện với phần cứng — nhưng gộp mà đổi tập vật liệu hiển thị là gộp sai. Bài 2 lo THỨ TỰ
// VẼ: vật đục trước, vật trong suốt sau và xếp từ xa tới gần, nếu không thì hình bị mất.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: không GPU, không API đồ hoạ, không render pixel thật.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U250_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u250-l1',
    unitId: 'p6-u250',
    language: 'python',
    title: 'MÔ PHỎNG gộp lô lệnh vẽ (draw call): gộp phải giữ nguyên hình ảnh',
    hook: 'Hai nghìn lệnh vẽ mỗi khung hình không giết máy vì nó vẽ nhiều, mà vì mỗi lệnh là một lần CPU phải đánh thức GPU.',
    theory:
      'Một lệnh vẽ (draw call) là một lần CPU bảo GPU "vẽ nhóm hình này bằng vật liệu này". Chi phí lớn nằm ở bản thân lần bảo đó — đổi vật liệu, nạp lại trạng thái — chứ không ở số tam giác, nên giảm số lệnh vẽ thường có tác dụng hơn giảm chi tiết mô hình. Gộp lô (batching) là gom những vật thể DÙNG CHUNG vật liệu vào một lệnh. Luật bất di bất dịch: gộp là tối ưu, không phải thay đổi nội dung — nếu sau khi gộp, tập vật liệu hiển thị khác trước, thì hình ảnh đã đổi và đó là `invalid`, dù số lệnh vẽ có đẹp tới đâu. Đây là MÔ PHỎNG Python hữu hạn đếm trên danh sách nhãn vật liệu: không GPU, không API đồ hoạ, không render pixel thật.',
    workedExample: {
      code: `# MO PHONG gop lo; moi vat the chi mang NHAN vat lieu, khong co pixel that.\nvat_the = ["go", "go", "kim_loai"]\nso_lenh_ve = len(set(vat_the))  # gop theo vat lieu: 2 lenh thay vi 3\nprint("allow: gop con " + str(so_lenh_ve) + " draw call")`,
      stdinLines: [],
    },
    predict: {
      code: `truoc = {"go", "kim_loai", "kinh"}\nsau = {"go", "kim_loai"}\nprint("invalid: gop lam doi tap vat lieu" if truoc != sau else "allow: gop giu nguyen hinh anh")`,
      question: 'Sau khi gộp lô, vật liệu "kinh" biến mất khỏi tập hiển thị. MÔ PHỎNG in gì?',
      choices: [
        'invalid: gop lam doi tap vat lieu',
        'allow: gop giu nguyen hinh anh',
        'reject: sai thu tu ve',
        'unknown: chua du du lieu',
      ],
      answerIndex: 0,
      explain:
        'Gộp lô là phép tối ưu, nghĩa là nó phải cho ra ĐÚNG hình ảnh cũ với ít lệnh hơn. Mất một vật liệu nghĩa là mất hình — số lệnh vẽ giảm thật, nhưng thứ ta đo được cải thiện lại không còn là thứ ta muốn vẽ.',
    },
    parsons: {
      prompt: 'Xếp cổng gộp lô: kiểm bảo toàn hình ảnh TRƯỚC khi khoe con số lệnh vẽ.',
      lines: [
        'if not vat_the:',
        '    print("unknown: khong co vat the nao de gop")',
        'elif tap_truoc != tap_sau:',
        '    print("invalid: gop lam doi tap vat lieu")',
        'else:',
        '    print("allow: gop con " + str(len(tap_sau)) + " draw call")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng gộp lô lệnh vẽ. Đọc `truoc:<nhãn vật liệu ngăn bằng |>,sau:<nhãn vật liệu ngăn bằng |>`. Thiếu/thừa trường → `invalid: field`; danh sách `truoc` rỗng → `unknown: khong co vat the nao de gop`; nhãn vật liệu ngoài bộ khai báo {go, kim_loai, kinh, vai, da} → `unknown: vat lieu chua khai bao`; tập vật liệu (không tính số lần lặp) của `sau` khác của `truoc` → `invalid: gop lam doi tap vat lieu`; số lệnh vẽ sau khi gộp không nhỏ hơn số vật thể ban đầu → `reject: gop khong giam duoc draw call`; còn lại → `allow: gop con <số vật liệu khác nhau> draw call`. Không GPU, không API đồ hoạ, không render thật.',
      starterCode: '# MÔ PHỎNG gộp lô; chỉ đếm nhãn vật liệu, không vẽ pixel nào.\n',
      testCases: [
        {
          stdinLines: ['truoc:go|go|kim_loai,sau:go|kim_loai'],
          expected: 'allow: gop con 2 draw call',
          match: 'contains',
          hidden: false,
          label: 'ba vật thể hai vật liệu gộp còn hai lệnh vẽ, hình không đổi',
        },
        {
          stdinLines: ['truoc:go|kim_loai|kinh,sau:go|kim_loai'],
          expected: 'invalid: gop lam doi tap vat lieu',
          match: 'contains',
          hidden: true,
          label: 'gộp làm mất một vật liệu — tối ưu đã đổi hình ảnh',
        },
        {
          stdinLines: ['truoc:go|kim_loai,sau:go|kim_loai'],
          expected: 'reject: gop khong giam duoc draw call',
          match: 'contains',
          hidden: true,
          label: 'mỗi vật thể một vật liệu thì gộp không đem lại gì',
        },
        {
          stdinLines: ['truoc:go|bang_tuyet,sau:go'],
          expected: 'unknown: vat lieu chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'nhãn vật liệu lạ là lỗi khai báo, không kết luận số lệnh vẽ',
        },
        {
          stdinLines: ['truoc:go|go,sau:go,thua:1'],
          expected: 'invalid: field',
          match: 'contains',
          hidden: true,
          label: 'ca âm — dòng thừa trường fail closed',
        },
      ],
      hints: [
        'Danh sách giữ SỐ LẦN LẶP (đếm vật thể), còn tập hợp giữ vật liệu KHÁC NHAU (đếm lệnh vẽ).',
        'So tập vật liệu trước/sau để biết hình ảnh có đổi không — đó là điều kiện tiên quyết.',
        'Không dùng file, socket, subprocess, thư viện đồ hoạ hay thời gian thực.',
      ],
      sampleSolution: `KHAI_BAO = {"go", "kim_loai", "kinh", "vai", "da"}


def ds(x):
    return [p for p in x.split("|") if p != ""]


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"truoc", "sau"}:
        print("invalid: field")
    else:
        truoc, sau = ds(m["truoc"]), ds(m["sau"])
        if not truoc:
            print("unknown: khong co vat the nao de gop")
        elif not set(truoc) | set(sau) <= KHAI_BAO:
            print("unknown: vat lieu chua khai bao")
        elif set(truoc) != set(sau):
            print("invalid: gop lam doi tap vat lieu")
        elif len(set(sau)) >= len(truoc):
            print("reject: gop khong giam duoc draw call")
        else:
            print("allow: gop con " + str(len(set(sau))) + " draw call")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, mở một cảnh thật trong Godot hoặc Unity và đọc số lệnh vẽ của chính công cụ đó (thống kê dựng hình trong trình chỉnh sửa, hoặc RenderDoc nếu bạn muốn nhìn sâu hơn). Gộp vật liệu cho một nhóm vật thể rồi đọc lại con số, đồng thời chụp màn hình trước–sau để chứng minh hình ảnh KHÔNG đổi — nộp cả hai ảnh và hai con số.',
    srsCards: [
      {
        hoi: 'Vì sao giảm số lệnh vẽ thường hiệu quả hơn giảm số tam giác?',
        dap: 'Chi phí một lệnh vẽ nằm ở việc CPU chuẩn bị và đổi trạng thái cho GPU, gần như không phụ thuộc số tam giác trong lệnh đó; nên gom nhiều vật thể vào một lệnh cắt đúng phần chi phí đang chiếm nhiều nhất.',
      },
      {
        hoi: 'Luật bất biến của mọi phép gộp lô là gì?',
        dap: 'Hình ảnh sau khi gộp phải giống hệt trước khi gộp; con số lệnh vẽ đẹp hơn mà tập vật liệu hiển thị đổi thì đó không phải tối ưu, đó là lỗi hiển thị chưa bị phát hiện.',
      },
    ],
  },
  {
    id: 'p6-u250-l2',
    unitId: 'p6-u250',
    language: 'python',
    title: 'MÔ PHỎNG thứ tự vẽ: đục trước, trong suốt sau và xếp từ xa tới gần',
    hook: 'Mặt nước vẽ trước con cá thì con cá biến mất — không phải nó bị che, mà vì bộ đệm chiều sâu đã ghi rằng chỗ đó "đã xong".',
    theory:
      'Bộ đệm chiều sâu ghi lại khoảng cách của điểm ảnh gần nhất đã vẽ, nhờ đó vật ở sau tự động bị loại mà không cần sắp xếp gì. Nhưng nó chỉ hoạt động cho vật ĐỤC. Vật trong suốt phải TRỘN màu với thứ nằm sau nó, nên nó cần thứ đã nằm sau nó được vẽ xong trước; và giữa các vật trong suốt với nhau, phép trộn không có tính hoán vị nên phải vẽ theo thứ tự từ XA tới GẦN. Vì vậy đường ống dựng hình có luật cứng: vẽ hết vật đục trước, rồi vẽ vật trong suốt theo khoảng cách giảm dần. Vẽ trong suốt trước đục, hoặc vẽ gần trước xa, đều là `reject` — hình sẽ sai theo cách rất khó lần ra vì nó phụ thuộc góc nhìn. Đây là MÔ PHỎNG hữu hạn trên danh sách mô tả vật thể: không GPU, không bộ đệm chiều sâu thật.',
    workedExample: {
      code: `# MO PHONG kiem thu tu ve; moi vat the la cap (loai, khoang cach).\nds = [("duc", 5), ("trong_suot", 9), ("trong_suot", 3)]\nduc_truoc = all(l == "duc" for l, _ in ds[:1])\nprint("allow: thu tu hop le" if duc_truoc else "reject: ve trong suot truoc duc")`,
      stdinLines: [],
    },
    predict: {
      code: `trong_suot = [3, 9]\nprint("reject: trong suot phai ve tu xa toi gan" if trong_suot != sorted(trong_suot, reverse=True) else "allow: thu tu hop le")`,
      question:
        'Hai vật trong suốt được vẽ theo thứ tự khoảng cách 3 rồi 9 (gần trước, xa sau). MÔ PHỎNG in gì?',
      choices: [
        'reject: trong suot phai ve tu xa toi gan',
        'allow: thu tu hop le',
        'invalid: khoang cach',
        'unknown: chua du du lieu',
      ],
      answerIndex: 0,
      explain:
        'Phép trộn màu không hoán vị: trộn A lên B khác trộn B lên A. Vẽ vật gần trước thì vật xa hơn sẽ trộn ĐÈ lên nó, cho ra màu sai — và sai theo góc nhìn nên rất khó lần.',
    },
    parsons: {
      prompt: 'Xếp cổng thứ tự vẽ: luật đục-trước kiểm trước, luật xa-tới-gần kiểm sau.',
      lines: [
        'if not ds:',
        '    print("unknown: khong co vat the nao de ve")',
        'elif co_duc_sau_trong_suot(ds):',
        '    print("reject: ve trong suot truoc duc")',
        'elif kc_trong_suot != sorted(kc_trong_suot, reverse=True):',
        '    print("reject: trong suot phai ve tu xa toi gan")',
        'else:',
        '    print("allow: thu tu ve hop le")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng thứ tự vẽ. Đọc một dòng gồm các vật thể ngăn bằng dấu `|`, mỗi vật thể dạng `<duc|trong_suot>@<khoảng cách nguyên không âm>`, ví dụ `duc@5|trong_suot@9|trong_suot@3`. Dòng rỗng → `unknown: khong co vat the nao de ve`; vật thể sai khuôn hoặc loại lạ → `invalid: vat the`; khoảng cách không phải số nguyên không âm → `invalid: khoang cach`; có vật đục đứng SAU một vật trong suốt → `reject: ve trong suot truoc duc`; dãy khoảng cách của các vật trong suốt không giảm dần → `reject: trong suot phai ve tu xa toi gan`; còn lại → `allow: thu tu ve hop le`. Không GPU, không API đồ hoạ.',
      starterCode: '# MÔ PHỎNG thứ tự vẽ; chỉ kiểm dãy mô tả, không có bộ đệm chiều sâu thật.\n',
      testCases: [
        {
          stdinLines: ['duc@5|trong_suot@9|trong_suot@3'],
          expected: 'allow: thu tu ve hop le',
          match: 'contains',
          hidden: false,
          label: 'đục trước, rồi trong suốt xếp từ xa tới gần',
        },
        {
          stdinLines: ['trong_suot@9|duc@5'],
          expected: 'reject: ve trong suot truoc duc',
          match: 'contains',
          hidden: true,
          label: 'vật đục đứng sau vật trong suốt làm hỏng phép trộn',
        },
        {
          stdinLines: ['duc@5|trong_suot@3|trong_suot@9'],
          expected: 'reject: trong suot phai ve tu xa toi gan',
          match: 'contains',
          hidden: true,
          label: 'trong suốt vẽ gần trước xa cho ra màu sai',
        },
        {
          stdinLines: ['duc@5|duc@1|duc@9'],
          expected: 'allow: thu tu ve hop le',
          match: 'contains',
          hidden: true,
          label: 'vật đục không cần sắp xếp — bộ đệm chiều sâu lo phần đó',
        },
        {
          stdinLines: ['duc@nam|trong_suot@3'],
          expected: 'invalid: khoang cach',
          match: 'contains',
          hidden: true,
          label: 'ca âm — khoảng cách sai kiểu fail closed',
        },
      ],
      hints: [
        'Tách từng vật thể bằng `split("|")` rồi `split("@")`, kiểm khuôn trước khi đọc số.',
        'Luật đục-trước: tìm vật trong suốt đầu tiên, sau nó không được còn vật đục nào.',
        'Vật đục KHÔNG cần sắp xếp — đừng thêm luật mà đường ống thật không có.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    dong = input().strip()
    phan = [p for p in dong.split("|") if p != ""]
    if not phan:
        print("unknown: khong co vat the nao de ve")
    else:
        ds = []
        loi = None
        for p in phan:
            if p.count("@") != 1:
                loi = "invalid: vat the"
                break
            loai, kc = p.split("@")
            if loai not in {"duc", "trong_suot"}:
                loi = "invalid: vat the"
                break
            if so(kc) is None:
                loi = "invalid: khoang cach"
                break
            ds.append((loai, so(kc)))
        if loi is not None:
            print(loi)
        else:
            thay_trong_suot = False
            sai_thu_tu = False
            for loai, _ in ds:
                if loai == "trong_suot":
                    thay_trong_suot = True
                elif thay_trong_suot:
                    sai_thu_tu = True
            kc_ts = [k for loai, k in ds if loai == "trong_suot"]
            if sai_thu_tu:
                print("reject: ve trong suot truoc duc")
            elif kc_ts != sorted(kc_ts, reverse=True):
                print("reject: trong suot phai ve tu xa toi gan")
            else:
                print("allow: thu tu ve hop le")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity dựng một cảnh có mặt kính, khói và một vật đục đứng sau cả hai. Cố tình đặt sai thứ tự vẽ (đổi hàng đợi dựng hình của vật liệu) rồi xoay camera quanh cảnh: quay lại đoạn cho thấy hình sai đổi theo góc nhìn, sau đó sửa về đúng thứ tự và quay lại lần nữa.',
    srsCards: [
      {
        hoi: 'Vì sao vật đục không cần sắp xếp còn vật trong suốt thì bắt buộc?',
        dap: 'Vật đục dựa vào bộ đệm chiều sâu để tự loại phần bị che, thứ tự nào cũng ra cùng kết quả; vật trong suốt phải TRỘN với nền sau nó, mà phép trộn không hoán vị nên đổi thứ tự là đổi màu.',
      },
      {
        hoi: 'Vì sao lỗi thứ tự vẽ đặc biệt khó lần ra?',
        dap: 'Vì nó phụ thuộc góc nhìn: ở một số góc thứ tự tình cờ đúng nên hình trông bình thường, chỉ sai ở góc khác — nên nó hay bị báo cáo là "thỉnh thoảng hình lạ" thay vì một lỗi tái hiện được.',
      },
    ],
  },
]
