// lessons/p6u254.ts — P6-U254: HƯỚNG GAME, chặng S4 "Chuyên gia — nhiều người chơi và quy mô
// phát hành" — module `game-s4-m1` (mạng: server có quyền quyết định, dự đoán phía client và hoà
// giải, chống gian lận).
//
// Bài 1 lo SỐ THỨ TỰ (sequence): client gửi Ý ĐỊNH kèm sequence, server từ chối gói lùi — chống
// phát lại. Bài 2 lo GIỚI HẠN VẬT LÝ: ý định dịch chuyển xa hơn mức có thể trong một bước bị
// server `deny` — chống gian lận. Trong cả hai bài, SERVER là bên quyết định duy nhất.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: KHÔNG socket, không mạng thật; độ trễ là tham số truyền vào.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U254_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u254-l1',
    unitId: 'p6-u254',
    language: 'python',
    title: 'MÔ PHỎNG server quyết định: số thứ tự (sequence) và chống phát lại gói tin',
    hook: 'Thiết kế mạng bắt đầu bằng một câu: client luôn nói dối. Mọi thứ còn lại chỉ là hệ quả.',
    theory:
      'Trong mô hình client-server có quyền quyết định ở server, client KHÔNG gửi trạng thái ("tôi đang ở đây") mà gửi Ý ĐỊNH ("tôi muốn đi sang phải"), kèm một số thứ tự (sequence) tăng dần. Server xác thực rồi mới áp dụng, và trạng thái nó tính ra là trạng thái thật duy nhất; client chỉ DỰ ĐOÁN trước cho mượt rồi hoà giải lại khi server trả lời. Số thứ tự giải quyết hai việc: biết gói nào đã xử lý để bỏ gói trùng, và chặn kẻ chép lại một gói cũ gửi đi gửi lại (tấn công phát lại). Vì vậy ý định có sequence nhỏ hơn hoặc bằng mức đã xử lý phải bị `reject` — không có nhánh nào "tin tạm rồi sửa sau", vì sửa sau nghĩa là trong vài khung hình kẻ gian đã bắn trúng người khác. Độ trễ ở đây là tham số truyền vào hàm thuần, không phải I/O mạng. Đây là MÔ PHỎNG hữu hạn: không socket, không mạng thật.',
    workedExample: {
      code: `# MO PHONG server xac thuc; khong ket noi mang, chi tinh tren so khai bao.\nseq_moi, seq_da_xu_ly = 42, 41\nprint("allow: server ap dung y dinh" if seq_moi > seq_da_xu_ly else "reject: sequence lui")`,
      stdinLines: [],
    },
    predict: {
      code: `seq_moi, seq_da_xu_ly = 41, 41\nprint("reject: sequence lui" if seq_moi <= seq_da_xu_ly else "allow: server ap dung y dinh")`,
      question:
        'Client gửi lại đúng gói đã xử lý (sequence 41 khi server đã ở 41). MÔ PHỎNG in gì?',
      choices: [
        'reject: sequence lui',
        'allow: server ap dung y dinh',
        'deny: vuot gioi han vat ly',
        'invalid: sequence',
      ],
      answerIndex: 0,
      explain:
        'Gói bằng đúng mức đã xử lý là gói trùng hoặc gói bị chép lại; áp dụng nó lần nữa nghĩa là một hành động được tính hai lần. Từ chối kèm biết mình đang ở sequence nào là cách chặn tấn công phát lại rẻ nhất.',
    },
    parsons: {
      prompt: 'Xếp cổng xác thực của server: mọi nhánh đều kết thúc ở quyết định của SERVER.',
      lines: [
        'if seq_moi <= seq_da_xu_ly:',
        '    print("reject: sequence lui")',
        'elif do_tre > do_tre_toi_da:',
        '    print("reject: goi qua han, bo qua")',
        'else:',
        '    print("allow: server ap dung y dinh")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG server xác thực ý định của client. Đọc `seq:<int>,seq_da_xu_ly:<int>,do_tre:<ms>,do_tre_toi_da:<ms>`. Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên không âm → `invalid: so`; do_tre_toi_da ≤ 0 → `invalid: do tre toi da`; seq ≤ seq_da_xu_ly → `reject: sequence lui`; do_tre > do_tre_toi_da → `reject: goi qua han, bo qua`; còn lại → `allow: server ap dung y dinh`. Server là bên quyết định duy nhất — KHÔNG có nhánh nào để client tự áp dụng trạng thái. Không socket, không mạng thật; độ trễ là tham số truyền vào.',
      starterCode:
        '# MÔ PHỎNG server có quyền quyết định; độ trễ là tham số, không phải I/O mạng thật.\n',
      testCases: [
        {
          stdinLines: ['seq:42,seq_da_xu_ly:41,do_tre:80,do_tre_toi_da:150'],
          expected: 'allow: server ap dung y dinh',
          match: 'contains',
          hidden: false,
          label: 'gói mới, trong hạn độ trễ — server áp dụng',
        },
        {
          stdinLines: ['seq:41,seq_da_xu_ly:41,do_tre:80,do_tre_toi_da:150'],
          expected: 'reject: sequence lui',
          match: 'contains',
          hidden: true,
          label: 'gói trùng hoặc bị chép lại — chặn tấn công phát lại',
        },
        {
          stdinLines: ['seq:10,seq_da_xu_ly:41,do_tre:80,do_tre_toi_da:150'],
          expected: 'reject: sequence lui',
          match: 'contains',
          hidden: true,
          label: 'gói cũ tới muộn không được áp dụng ngược thời gian',
        },
        {
          stdinLines: ['seq:42,seq_da_xu_ly:41,do_tre:400,do_tre_toi_da:150'],
          expected: 'reject: goi qua han, bo qua',
          match: 'contains',
          hidden: true,
          label: 'gói quá hạn thì bỏ, không kéo cả trận đấu chậm theo một người',
        },
        {
          stdinLines: ['seq:42,seq_da_xu_ly:41,do_tre:80,do_tre_toi_da:0'],
          expected: 'invalid: do tre toi da',
          match: 'contains',
          hidden: true,
          label: 'ca âm — hạn độ trễ không dương là lỗi cấu hình, fail closed',
        },
      ],
      hints: [
        'Số thứ tự phải TĂNG THẬT SỰ: dùng `<=` chứ không phải `<`, nếu không gói trùng lọt qua.',
        'Mọi nhánh in ra quyết định của server — đừng viết nhánh nào trả về "client tự xử lý".',
        'Không dùng socket, requests, file, subprocess hay thời gian thực.',
      ],
      sampleSolution: `KHOA = ("seq", "seq_da_xu_ly", "do_tre", "do_tre_toi_da")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(KHOA):
        print("invalid: field")
    elif any(so(m[k]) is None for k in KHOA):
        print("invalid: so")
    else:
        v = {k: so(m[k]) for k in KHOA}
        if v["do_tre_toi_da"] <= 0:
            print("invalid: do tre toi da")
        elif v["seq"] <= v["seq_da_xu_ly"]:
            print("reject: sequence lui")
        elif v["do_tre"] > v["do_tre_toi_da"]:
            print("reject: goi qua han, bo qua")
        else:
            print("allow: server ap dung y dinh")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, dựng một server thật nhỏ (Godot có sẵn hệ thống mạng đa người chơi, hoặc một tiến trình Node/Python riêng) và cho hai client gửi ý định kèm số thứ tự. Dùng công cụ giả lập độ trễ của hệ điều hành hoặc của engine để đẩy trễ lên 200ms, rồi ghi lại: server nhận bao nhiêu gói trùng, và chuyện gì xảy ra khi bạn TẮT phần kiểm số thứ tự.',
    srsCards: [
      {
        hoi: 'Vì sao client gửi Ý ĐỊNH chứ không gửi trạng thái của mình?',
        dap: 'Gửi trạng thái nghĩa là client tự quyết định mình ở đâu, và server chỉ còn biết tin — kẻ gian sửa một con số là dịch chuyển tức thời. Gửi ý định thì server tự tính trạng thái theo luật chơi và luôn giữ quyền quyết định.',
      },
      {
        hoi: 'Số thứ tự (sequence) chống được loại tấn công nào, và vì sao phải dùng `<=` khi so?',
        dap: 'Nó chống tấn công phát lại: chép một gói hợp lệ rồi gửi lại nhiều lần. Phải dùng `<=` vì gói BẰNG mức đã xử lý cũng là gói trùng; dùng `<` thì mỗi hành động có thể được tính hai lần.',
      },
    ],
  },
  {
    id: 'p6-u254-l2',
    unitId: 'p6-u254',
    language: 'python',
    title: 'MÔ PHỎNG chống gian lận: server chặn ý định vượt giới hạn vật lý khai báo',
    hook: 'Kẻ gian không hack server của bạn — họ chỉ gửi những ý định hoàn toàn hợp lệ về cú pháp, chỉ là nhanh hơn con người hai mươi lần.',
    theory:
      'Chống gian lận trong game mạng không phải là phát hiện phần mềm lạ trên máy người chơi; nó là việc server kiểm mọi ý định có thoả LUẬT CHƠI của chính nó không. Trong một bước, nhân vật chỉ dịch chuyển tối đa bằng tốc độ nhân với bước thời gian; ý định đòi dịch xa hơn giới hạn đó là bất khả thi dù gói tin trông hoàn toàn hợp lệ, nên server `deny` và giữ nguyên trạng thái cũ. Nguyên tắc sống còn: không có nhánh "tin tạm rồi sửa sau" — trong vài khung hình được tin tạm, kẻ gian đã bắn trúng người khác và thiệt hại đó không lấy lại được. Cũng vì thế server phải luôn trả một quyết định rõ ràng `allow` hoặc `deny`, không bao giờ để client tự áp dụng. Đây là MÔ PHỎNG hữu hạn trên số nguyên: không socket, không mạng thật.',
    workedExample: {
      code: `# MO PHONG kiem gioi han vat ly; khoang cach va toc do deu la so nguyen khai bao.\ndich_chuyen, toc_do, buoc = 8, 10, 1\nprint("allow: trong gioi han vat ly" if dich_chuyen <= toc_do * buoc else "deny: vuot gioi han vat ly")`,
      stdinLines: [],
    },
    predict: {
      code: `dich_chuyen, toc_do, buoc = 200, 10, 1\nprint("deny: vuot gioi han vat ly" if dich_chuyen > toc_do * buoc else "allow: trong gioi han vat ly")`,
      question:
        'Client gửi ý định dịch chuyển 200 đơn vị trong một bước, trong khi tốc độ tối đa là 10. MÔ PHỎNG in gì?',
      choices: [
        'deny: vuot gioi han vat ly',
        'allow: trong gioi han vat ly',
        'reject: sequence lui',
        'invalid: toc do',
      ],
      answerIndex: 0,
      explain:
        'Gói tin đúng khuôn, sequence đúng, nhưng nội dung bất khả thi theo luật chơi của chính server. Đây là dạng gian lận phổ biến nhất — và nó chỉ bị chặn nếu server kiểm luật, chứ không phần mềm chống gian lận nào trên máy người chơi bắt được.',
    },
    parsons: {
      prompt: 'Xếp cổng chống gian lận: không có nhánh nào để client tự áp dụng trạng thái.',
      lines: [
        'if toc_do <= 0 or buoc <= 0:',
        '    print("invalid: cau hinh chuyen dong")',
        'elif dich_chuyen < 0:',
        '    print("invalid: dich chuyen")',
        'elif dich_chuyen > toc_do * buoc:',
        '    print("deny: vuot gioi han vat ly")',
        'else:',
        '    print("allow: trong gioi han vat ly")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG server kiểm giới hạn vật lý trước khi áp dụng ý định. Đọc `dich_chuyen:<int>,toc_do:<int>,buoc:<int>,xuyen_tuong:<0|1>`. Thiếu/thừa trường → `invalid: field`; ba số không phải số nguyên không âm → `invalid: so`; toc_do ≤ 0 hoặc buoc ≤ 0 → `invalid: cau hinh chuyen dong`; xuyen_tuong ngoài {0,1} → `invalid: xuyen_tuong`; xuyen_tuong = 1 → `deny: duong di xuyen vat can`; dich_chuyen > toc_do × buoc → `deny: vuot gioi han vat ly`; còn lại → `allow: trong gioi han vat ly`. Server luôn trả `allow` hoặc `deny`; KHÔNG có nhánh nào để client tự áp dụng. Không socket, không mạng thật.',
      starterCode: '# MÔ PHỎNG chống gian lận phía server; giả định client luôn có thể nói dối.\n',
      testCases: [
        {
          stdinLines: ['dich_chuyen:8,toc_do:10,buoc:1,xuyen_tuong:0'],
          expected: 'allow: trong gioi han vat ly',
          match: 'contains',
          hidden: false,
          label: 'ý định nằm trong khả năng vật lý của nhân vật',
        },
        {
          stdinLines: ['dich_chuyen:200,toc_do:10,buoc:1,xuyen_tuong:0'],
          expected: 'deny: vuot gioi han vat ly',
          match: 'contains',
          hidden: true,
          label: 'dịch chuyển tức thời bị chặn dù gói tin đúng khuôn',
        },
        {
          stdinLines: ['dich_chuyen:8,toc_do:10,buoc:1,xuyen_tuong:1'],
          expected: 'deny: duong di xuyen vat can',
          match: 'contains',
          hidden: true,
          label: 'đủ chậm nhưng đi xuyên tường vẫn là gian lận',
        },
        {
          stdinLines: ['dich_chuyen:10,toc_do:10,buoc:1,xuyen_tuong:0'],
          expected: 'allow: trong gioi han vat ly',
          match: 'contains',
          hidden: true,
          label: 'đúng giới hạn vẫn hợp lệ — biên phải khai rõ, không phạt oan người chơi thật',
        },
        {
          stdinLines: ['dich_chuyen:8,toc_do:0,buoc:1,xuyen_tuong:0'],
          expected: 'invalid: cau hinh chuyen dong',
          match: 'contains',
          hidden: true,
          label: 'ca âm — tốc độ không dương là lỗi cấu hình, fail closed',
        },
      ],
      hints: [
        'Biên `dich_chuyen == toc_do * buoc` phải là `allow`: phạt oan người chơi thật còn tệ hơn.',
        'Hai dạng gian lận khác nhau cần hai lời từ chối khác nhau — dịch quá xa và đi xuyên vật cản.',
        'Không viết nhánh nào trả về "client tự áp dụng rồi server sửa sau".',
      ],
      sampleSolution: `SO = ("dich_chuyen", "toc_do", "buoc")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"xuyen_tuong", *SO}:
        print("invalid: field")
    elif any(so(m[k]) is None for k in SO):
        print("invalid: so")
    elif m["xuyen_tuong"] not in {"0", "1"}:
        print("invalid: xuyen_tuong")
    else:
        dc, td, b = so(m["dich_chuyen"]), so(m["toc_do"]), so(m["buoc"])
        if td <= 0 or b <= 0:
            print("invalid: cau hinh chuyen dong")
        elif m["xuyen_tuong"] == "1":
            print("deny: duong di xuyen vat can")
        elif dc > td * b:
            print("deny: vuot gioi han vat ly")
        else:
            print("allow: trong gioi han vat ly")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong một dự án mạng thật của bạn hãy viết một client "gian lận" của chính mình: sửa nó để gửi ý định dịch chuyển gấp mười lần tốc độ cho phép. Chạy thử khi server CHƯA kiểm giới hạn và sau khi đã kiểm, quay lại cả hai lần, rồi viết ba câu về vì sao "tin tạm rồi sửa sau" không phải một lựa chọn.',
    srsCards: [
      {
        hoi: 'Vì sao chống gian lận chủ yếu là việc của luật chơi trên server, không phải của phần mềm quét trên máy người chơi?',
        dap: 'Máy người chơi nằm trong tay họ nên mọi thứ chạy ở đó đều có thể bị sửa; còn server thì kiểm được mọi ý định có thoả luật chơi không — và ý định bất khả thi bị chặn bất kể client đã bị sửa thế nào.',
      },
      {
        hoi: 'Vì sao không được có nhánh "tin tạm rồi sửa sau" cho ý định vượt giới hạn?',
        dap: 'Vì trong vài khung hình được tin tạm, hành động đã có hậu quả với người chơi khác — đạn đã trúng, điểm đã tính — và hoàn tác những hậu quả đó với người thứ ba là chuyện không làm được.',
      },
    ],
  },
]
