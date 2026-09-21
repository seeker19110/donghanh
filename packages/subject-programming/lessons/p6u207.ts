// lessons/p6u207.ts — P6-U207: HƯỚNG BẢO MẬT, chặng S4 — module `security-s4-m2` (phát hiện và
// ứng cứu: chất lượng luật phát hiện, ánh xạ ATT&CK, trình tự ngăn chặn → diệt trừ → phục hồi).
//
// Bài 1 hỏi "luật phát hiện này có đáng bật không" (bắt được ca dương tính thật nào chưa, tỉ lệ
// dương tính giả có vượt ngưỡng không). Bài 2 hỏi "bước ứng cứu này có được làm lúc này không"
// (diệt trừ trước khi thu chứng cứ là phá hiện trường; phục hồi khi chưa rõ nguyên nhân gốc là
// mời sự cố quay lại).
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
// Nhật ký dùng trong bài là fixture TỔNG HỢP: không log thật, không hệ thống đang chạy.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U207_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u207-l1',
    unitId: 'p6-u207',
    language: 'python',
    title: 'MÔ PHỎNG cổng chất lượng luật phát hiện (detection rule) và ánh xạ ATT&CK',
    hook: 'Một luật phát hiện kêu suốt ngày mà chưa bắt đúng lần nào thì nó không bảo vệ ai — nó chỉ dạy cả đội thói quen tắt chuông.',
    theory:
      'Luật phát hiện (detection rule) chỉ có giá trị khi đo được trên nhật ký fixture: nó bắt được bao nhiêu ca dương tính thật, và kêu nhầm bao nhiêu lần. Luật không bắt được ca dương tính nào là luật chưa chứng minh được gì — bật nó lên chỉ thêm tiếng ồn. Luật có tỉ lệ dương tính giả vượt ngưỡng cũng vậy, vì con người có ngân sách chú ý hữu hạn và sẽ tiêu nó hết vào các báo động nhầm.\nÁnh xạ sang ATT&CK — bảng phân loại kỹ thuật tấn công của MITRE — là cách trả lời câu hỏi "chúng ta đang nhìn thấy những kỹ thuật nào và mù ở đâu": mỗi luật gắn một mã kỹ thuật, rồi nhìn bảng xem ô nào còn trống. Mục đích phòng thủ của bài: chọn được luật nào đáng bật, thay vì bật tất cả rồi tắt chuông. MÔ PHỎNG chạy trên số đếm tổng hợp, không đọc nhật ký thật.',
    workedExample: {
      code: `# MO PHONG cong chat luong luat phat hien tren fixture tong hop.\ntp = 0  # so ca duong tinh THAT ma luat bat duoc trong fixture\nprint("noisy: luat khong bat duoc ca duong tinh nao" if tp == 0 else "allow: bat duoc luat phat hien")`,
      stdinLines: [],
    },
    predict: {
      code: `tp, fp, nguong = 2, 8, 50\nti_le = fp * 100 // (tp + fp)\nprint("noisy: ti le duong tinh gia vuot nguong" if ti_le > nguong else "allow: bat duoc luat phat hien")`,
      question: 'Luật bắt đúng 2 ca và kêu nhầm 8 lần, ngưỡng dương tính giả là 50%. In gì?',
      choices: [
        'noisy: ti le duong tinh gia vuot nguong',
        'allow: bat duoc luat phat hien',
        'noisy: luat khong bat duoc ca duong tinh nao',
        'unknown: chua du mau',
      ],
      answerIndex: 0,
      explain:
        'Tỉ lệ dương tính giả là 8/10 = 80%, vượt ngưỡng 50%; luật có bắt đúng vài ca nhưng cái giá là tám lần làm phiền, nên nó phải được chỉnh lại trước khi bật.',
    },
    parsons: {
      prompt:
        'Xếp cổng chất lượng luật: xét "chưa bắt được gì" trước, rồi mới tới tỉ lệ dương tính giả.',
      lines: [
        'if tp == 0:',
        '    print("noisy: luat khong bat duoc ca duong tinh nao")',
        'elif fp * 100 // (tp + fp) > nguong:',
        '    print("noisy: ti le duong tinh gia vuot nguong")',
        'else:',
        '    print("allow: bat duoc luat phat hien")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng chất lượng luật phát hiện (detection rule) đo trên fixture tổng hợp, có gắn mã kỹ thuật ATT&CK. Đọc `tp:<số>,fp:<số>,nguong:<số phần trăm>,attack:<mã|->`. Thiếu/thừa trường → `invalid: field`; `tp`/`fp`/`nguong` không phải số nguyên không âm → `invalid: tp` / `invalid: fp` / `invalid: nguong`; `attack` là `-` → `invalid: attack` (luật không ánh xạ được kỹ thuật nào thì không kiểm chứng được nó nhìn cái gì). Sau đó: `tp` bằng 0 → `noisy: luat khong bat duoc ca duong tinh nao`; tỉ lệ dương tính giả `fp*100//(tp+fp)` vượt `nguong` → `noisy: ti le duong tinh gia vuot nguong`; còn lại → `allow: bat duoc luat phat hien`. Không đọc nhật ký thật, không chạm hệ đang chạy.',
      starterCode: '# MÔ PHỎNG cổng luật phát hiện; chỉ tính trên số đếm của dòng nhập.\n',
      testCases: [
        {
          stdinLines: ['tp:9,fp:1,nguong:50,attack:T1078'],
          expected: 'allow: bat duoc luat phat hien',
          match: 'contains',
          hidden: false,
          label: 'bắt đúng nhiều, kêu nhầm ít thì được bật',
        },
        {
          stdinLines: ['tp:0,fp:40,nguong:50,attack:T1078'],
          expected: 'noisy: luat khong bat duoc ca duong tinh nao',
          match: 'contains',
          hidden: true,
          label: 'chưa bắt đúng lần nào thì không bật',
        },
        {
          stdinLines: ['tp:2,fp:8,nguong:50,attack:T1078'],
          expected: 'noisy: ti le duong tinh gia vuot nguong',
          match: 'contains',
          hidden: true,
          label: 'tỉ lệ dương tính giả 80% vượt ngưỡng 50%',
        },
        {
          stdinLines: ['tp:9,fp:1,nguong:50,attack:-'],
          expected: 'invalid: attack',
          match: 'contains',
          hidden: true,
          label: 'luật không ánh xạ được kỹ thuật nào thì không kiểm chứng được',
        },
        {
          stdinLines: ['tp:chin,fp:1,nguong:50,attack:T1078'],
          expected: 'invalid: tp',
          match: 'contains',
          hidden: true,
          label: 'ca âm — số đếm sai kiểu fail closed',
        },
      ],
      hints: [
        'Kiểm đủ bốn khoá và kiểu của ba số trước khi tính bất cứ tỉ lệ nào.',
        'Dùng chia lấy phần nguyên để tỉ lệ là số nguyên, cho kết quả tất định giữa các lần chạy.',
        'tp bằng 0 phải được xét TRƯỚC, nếu không mẫu số vẫn hợp lệ và luật rỗng lọt qua.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"tp", "fp", "nguong", "attack"}:
        print("invalid: field")
    elif so(m["tp"]) is None:
        print("invalid: tp")
    elif so(m["fp"]) is None:
        print("invalid: fp")
    elif so(m["nguong"]) is None:
        print("invalid: nguong")
    elif m["attack"] == "-":
        print("invalid: attack")
    elif so(m["tp"]) == 0:
        print("noisy: luat khong bat duoc ca duong tinh nao")
    elif so(m["fp"]) * 100 // (so(m["tp"]) + so(m["fp"])) > so(m["nguong"]):
        print("noisy: ti le duong tinh gia vuot nguong")
    else:
        print("allow: bat duoc luat phat hien")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy ba cảnh báo gần nhất mà đội bạn nhận được và tra xem mỗi cái đến từ luật nào, luật đó đã bắt đúng bao nhiêu lần trong ba tháng qua; luật nào chưa đúng lần nào thì viết ra: nên chỉnh, nên tắt, hay nên đổi nguồn nhật ký.',
    srsCards: [
      {
        hoi: 'Vì sao luật chưa bắt đúng ca nào lại bị xếp là noisy chứ không phải "chưa có dữ liệu"?',
        dap: 'Vì nó đã chạy trên fixture có ca dương tính thật mà vẫn không thấy gì, nên cái nó tạo ra chỉ còn là báo động nhầm — bật lên là tiêu ngân sách chú ý của đội mà không đổi lại được gì.',
      },
      {
        hoi: 'Ánh xạ luật phát hiện sang ATT&CK giúp trả lời câu hỏi nào mà số đếm không trả lời được?',
        dap: 'Câu "chúng ta đang mù ở đâu": số đếm chỉ nói luật hiện có chạy tốt tới đâu, còn bảng kỹ thuật cho thấy những ô chưa có luật nào nhìn tới.',
      },
    ],
  },
  {
    id: 'p6-u207-l2',
    unitId: 'p6-u207',
    language: 'python',
    title: 'MÔ PHỎNG trình tự ứng cứu: ngăn chặn (containment) → diệt trừ (eradication) → phục hồi',
    hook: 'Xoá sạch máy bị nhiễm lúc 2 giờ sáng cho nhanh nghĩa là sáng hôm sau không ai còn trả lời được câu "nó vào bằng đường nào".',
    theory:
      'Ứng cứu sự cố có trình tự, và trình tự đó không phải nghi thức: ngăn chặn (containment) trước để sự cố ngừng lan; thu thập chứng cứ TRƯỚC khi diệt trừ (eradication), vì diệt trừ là hành động xoá dấu vết; và chỉ phục hồi khi đã biết nguyên nhân gốc, nếu không thì hệ vừa phục hồi sẽ bị chiếm lại bằng đúng con đường cũ.\nMục đích phòng thủ của bài: biến ba câu hỏi "đã ngăn chưa · đã thu chứng cứ chưa · đã rõ nguyên nhân chưa" thành một cổng máy chạy được, để lúc 2 giờ sáng người trực không phải tự nhớ. Đây là MÔ PHỎNG hữu hạn trên trạng thái sự cố tổng hợp: không hệ thống thật, không nhật ký thật.',
    workedExample: {
      code: `# MO PHONG trinh tu ung cuu tren trang thai su co tong hop.\nbuoc, chungcu = "diet-tru", "chua"\nprint("block: diet tru truoc khi thu thap chung cu" if buoc == "diet-tru" and chungcu == "chua" else "allow: buoc dung trinh tu")`,
      stdinLines: [],
    },
    predict: {
      code: `buoc, nguyennhan = "phuc-hoi", "chua"\nprint("incomplete: phuc hoi khi chua ro nguyen nhan goc" if buoc == "phuc-hoi" and nguyennhan == "chua" else "allow: buoc dung trinh tu")`,
      question: 'Đội muốn phục hồi dịch vụ trong khi chưa tìm ra nguyên nhân gốc. In gì?',
      choices: [
        'incomplete: phuc hoi khi chua ro nguyen nhan goc',
        'allow: buoc dung trinh tu',
        'block: diet tru truoc khi thu thap chung cu',
        'unknown: chua du thong tin',
      ],
      answerIndex: 0,
      explain:
        'Phục hồi lúc này không sai về đạo đức như phá hiện trường, nhưng nó là việc làm dở: hệ quay lại đúng trạng thái đã bị chiếm, nên quyết định đúng là incomplete — còn thiếu một bước.',
    },
    parsons: {
      prompt: 'Xếp cổng trình tự ứng cứu: chặn diệt trừ sớm trước, rồi mới xét phục hồi sớm.',
      lines: [
        'if buoc == "diet-tru" and chungcu == "chua":',
        '    print("block: diet tru truoc khi thu thap chung cu")',
        'elif buoc == "phuc-hoi" and ngan == "chua":',
        '    print("block: phuc hoi khi su co con dang lan")',
        'elif buoc == "phuc-hoi" and nguyennhan == "chua":',
        '    print("incomplete: phuc hoi khi chua ro nguyen nhan goc")',
        'else:',
        '    print("allow: buoc dung trinh tu")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng trình tự ứng cứu sự cố. Đọc `buoc:<ngan-chan|diet-tru|phuc-hoi>,ngan:<xong|chua>,chungcu:<da-thu|chua>,nguyennhan:<da-ro|chua>`. Thiếu/thừa trường → `invalid: field`; giá trị lạ ở trường nào → `invalid: <tên trường>`. Thứ tự quyết định: bước `diet-tru` mà chứng cứ `chua` → `block: diet tru truoc khi thu thap chung cu`; bước `phuc-hoi` mà ngăn chặn `chua` → `block: phuc hoi khi su co con dang lan`; bước `phuc-hoi` mà nguyên nhân `chua` → `incomplete: phuc hoi khi chua ro nguyen nhan goc`; còn lại → `allow: buoc dung trinh tu`. Không chạm hệ thống thật, không đọc nhật ký thật.',
      starterCode: '# MÔ PHỎNG trình tự ứng cứu; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['buoc:ngan-chan,ngan:chua,chungcu:chua,nguyennhan:chua'],
          expected: 'allow: buoc dung trinh tu',
          match: 'contains',
          hidden: false,
          label: 'ngăn chặn luôn là bước được làm đầu tiên',
        },
        {
          stdinLines: ['buoc:diet-tru,ngan:xong,chungcu:chua,nguyennhan:chua'],
          expected: 'block: diet tru truoc khi thu thap chung cu',
          match: 'contains',
          hidden: true,
          label: 'diệt trừ sớm là phá hiện trường',
        },
        {
          stdinLines: ['buoc:phuc-hoi,ngan:chua,chungcu:da-thu,nguyennhan:da-ro'],
          expected: 'block: phuc hoi khi su co con dang lan',
          match: 'contains',
          hidden: true,
          label: 'chưa ngăn chặn xong thì chưa phục hồi',
        },
        {
          stdinLines: ['buoc:phuc-hoi,ngan:xong,chungcu:da-thu,nguyennhan:chua'],
          expected: 'incomplete: phuc hoi khi chua ro nguyen nhan goc',
          match: 'contains',
          hidden: true,
          label: 'phục hồi khi chưa rõ nguyên nhân là mời sự cố quay lại',
        },
        {
          stdinLines: ['buoc:phuc-hoi,ngan:xong,chungcu:da-thu,nguyennhan:da-ro'],
          expected: 'allow: buoc dung trinh tu',
          match: 'contains',
          hidden: true,
          label: 'đủ ba điều kiện thì phục hồi được',
        },
        {
          stdinLines: ['buoc:xoa-sach,ngan:xong,chungcu:da-thu,nguyennhan:da-ro'],
          expected: 'invalid: buoc',
          match: 'contains',
          hidden: true,
          label: 'ca âm — bước lạ fail closed',
        },
      ],
      hints: [
        'Kiểm đủ bốn khoá và tập giá trị cho phép trước khi xét trình tự.',
        'Hai điều kiện chặn của bước phục hồi phải xét theo thứ tự cố định, nếu không cùng một sự cố cho hai câu trả lời khác nhau.',
        'Không dùng socket, subprocess, file hay thời gian thực.',
      ],
      sampleSolution: `MUC = {
    "buoc": {"ngan-chan", "diet-tru", "phuc-hoi"},
    "ngan": {"xong", "chua"},
    "chungcu": {"da-thu", "chua"},
    "nguyennhan": {"da-ro", "chua"},
}

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(MUC):
        print("invalid: field")
    else:
        xau = [k for k in ("buoc", "ngan", "chungcu", "nguyennhan") if m[k] not in MUC[k]]
        if xau:
            print("invalid: " + xau[0])
        elif m["buoc"] == "diet-tru" and m["chungcu"] == "chua":
            print("block: diet tru truoc khi thu thap chung cu")
        elif m["buoc"] == "phuc-hoi" and m["ngan"] == "chua":
            print("block: phuc hoi khi su co con dang lan")
        elif m["buoc"] == "phuc-hoi" and m["nguyennhan"] == "chua":
            print("incomplete: phuc hoi khi chua ro nguyen nhan goc")
        else:
            print("allow: buoc dung trinh tu")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy sự cố gần nhất của đội bạn (kể cả sự cố vận hành, không nhất thiết là an ninh) và dựng lại dòng thời gian ba bước: ngăn chặn lúc nào, chứng cứ thu lúc nào, phục hồi lúc nào — rồi đánh dấu chỗ trình tự bị đảo và hậu quả của nó.',
    srsCards: [
      {
        hoi: 'Vì sao thu thập chứng cứ phải xảy ra trước bước diệt trừ?',
        dap: 'Vì diệt trừ chính là hành động xoá dấu vết của kẻ tấn công; làm trước thì mất luôn cơ sở để trả lời họ vào bằng đường nào và còn chỗ nào khác đang bị chiếm.',
      },
      {
        hoi: 'Phục hồi khi chưa rõ nguyên nhân gốc dẫn tới hậu quả gì?',
        dap: 'Hệ quay về đúng trạng thái đã bị chiếm với đúng lỗ hổng cũ, nên sự cố lặp lại — lần này kèm niềm tin sai rằng mọi thứ đã được xử lý xong.',
      },
    ],
  },
]
