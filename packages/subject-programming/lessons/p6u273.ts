import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U273_LESSONS = [
  embeddedSimulation({
    id: 'p6-u273-l1',
    unitId: 'p6-u273',
    title: 'trạng thái an toàn khi hỏng',
    hook: 'Câu hỏi không phải "thiết bị có hỏng không" mà "khi hỏng thì nó dừng ở đâu".',
    theory:
      'Với thiết bị điều khiển vật thật, mỗi chế độ lỗi phải có một trạng thái an toàn (safe state) được KHAI BÁO trước: mất nguồn thì ngắt tải, mất kết nối thì về mức an toàn đã định. Chế độ lỗi chưa khai báo trạng thái an toàn là lỗ hổng thiết kế, phải deny chứ không mặc định "giữ nguyên như đang chạy" — giữ nguyên chính là hành vi nguy hiểm nhất. Đây là MÔ PHỎNG mức khái niệm, KHÔNG phải chứng nhận an toàn chức năng.',
    workedCode:
      '# MÔ PHỎNG trạng thái an toàn khi hỏng\nfault, safe_state = "power", "missing"\nprint("deny: no safe state defined" if fault != "none" and safe_state == "missing" else "allow: enter safe state")',
    predictCode:
      'fault, safe_state = "link", "declared"\nprint("deny: no safe state defined" if fault != "none" and safe_state == "missing" else "allow: enter safe state")',
    predictChoices: [
      'allow: enter safe state',
      'deny: no safe state defined',
      'allow: normal operation',
    ],
    predictAnswer: 0,
    predictExplain:
      'Chế độ lỗi mất kết nối đã có trạng thái an toàn khai báo sẵn, nên thiết bị biết phải về đâu.',
    makePrompt:
      'Đọc `fault:<power|link|none>,safe_state:<declared|missing>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; fault khác none và safe_state missing → `deny: no safe state defined`; fault khác none → `allow: enter safe state`; còn lại → `allow: normal operation`. MÔ PHỎNG khái niệm, KHÔNG phải chứng nhận an toàn chức năng.',
    testCases: [
      {
        stdinLines: ['fault:none,safe_state:declared'],
        expected: 'allow: normal operation',
        hidden: false,
        label: 'không có lỗi thì chạy bình thường',
      },
      {
        stdinLines: ['fault:link,safe_state:declared'],
        expected: 'allow: enter safe state',
        hidden: true,
        label: 'mất kết nối thì về trạng thái an toàn đã định',
      },
      {
        stdinLines: ['fault:power,safe_state:missing'],
        expected: 'deny: no safe state defined',
        hidden: true,
        label: 'chế độ lỗi chưa khai báo trạng thái an toàn',
      },
      {
        stdinLines: ['fault:overheat,safe_state:declared'],
        expected: 'invalid: fault',
        hidden: true,
        label: 'ca âm — chế độ lỗi ngoài bảng khai báo fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"fault", "safe_state"}: print("invalid: field")\n    elif m["fault"] not in {"power", "link", "none"}: print("invalid: fault")\n    elif m["safe_state"] not in {"declared", "missing"}: print("invalid: safe_state")\n    elif m["fault"] == "none": print("allow: normal operation")\n    elif m["safe_state"] == "missing": print("deny: no safe state defined")\n    else: print("allow: enter safe state")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Lập bảng chế độ lỗi cho thiết bị thật của bạn NGOÀI sandbox: mỗi hàng là một cách hỏng, kèm trạng thái an toàn tương ứng và cách kiểm chứng nó thật sự xảy ra khi gây lỗi.',
    cards: [
      {
        hoi: 'Vì sao "giữ nguyên trạng thái đang chạy" là lựa chọn nguy hiểm khi hỏng?',
        dap: 'Vì thiết bị mất khả năng quan sát và điều khiển nhưng tải vẫn hoạt động — nó chạy mù, không ai dừng được.',
      },
      {
        hoi: 'Trạng thái an toàn nên chọn theo nguyên tắc nào?',
        dap: 'Theo hậu quả xấu nhất: chọn trạng thái mà nếu thiết bị kẹt ở đó vô thời hạn thì vẫn không gây hại.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u273-l2',
    unitId: 'p6-u273',
    title: 'checklist chuẩn và tính đầy đủ của quy trình',
    hook: 'Quy trình thiếu một bước vẫn chạy trơn tru — đúng cho tới lần đầu tiên bước đó là bước quan trọng.',
    theory:
      'Quy trình xưởng viết theo một chuẩn kỹ thuật thực chất là một danh sách bước bắt buộc; thiếu bước là quy trình chưa đầy đủ, không phải quy trình gọn nhẹ. Simulator chỉ so số bước đã có với số bước bắt buộc để rèn thói quen coi tính đầy đủ là thứ kiểm được bằng máy. Con số bắt buộc lấy từ chuẩn áp dụng, MÔ PHỎNG này không thay cho việc đọc chuẩn thật.',
    workedCode:
      '# MÔ PHỎNG tính đầy đủ của checklist\nsteps, required = 9, 12\nprint("reject: incomplete procedure" if steps < required else "allow: procedure complete")',
    predictCode:
      'steps, required = 12, 12\nprint("reject: incomplete procedure" if steps < required else "allow: procedure complete")',
    predictChoices: [
      'allow: procedure complete',
      'reject: incomplete procedure',
      'invalid: required',
    ],
    predictAnswer: 0,
    predictExplain: 'Đủ đúng số bước bắt buộc là đạt; chỉ thiếu bước mới là quy trình chưa đầy đủ.',
    makePrompt:
      'Đọc `steps:<số>,required:<số>`. Sai kiểu, thiếu trường hoặc required bằng 0 → `invalid: <trường>`; steps < required → `reject: incomplete procedure`; còn lại → `allow: procedure complete`. MÔ PHỎNG, không thay cho việc đọc chuẩn thật.',
    testCases: [
      {
        stdinLines: ['steps:12,required:12'],
        expected: 'allow: procedure complete',
        hidden: false,
        label: 'đủ số bước bắt buộc của chuẩn',
      },
      {
        stdinLines: ['steps:9,required:12'],
        expected: 'reject: incomplete procedure',
        hidden: true,
        label: 'thiếu bước là quy trình chưa đầy đủ',
      },
      {
        stdinLines: ['steps:15,required:12'],
        expected: 'allow: procedure complete',
        hidden: true,
        label: 'nhiều hơn mức bắt buộc vẫn đạt',
      },
      {
        stdinLines: ['steps:12,required:0'],
        expected: 'invalid: required',
        hidden: true,
        label: 'ca âm — chuẩn không có bước bắt buộc nào là dữ liệu sai',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"steps", "required"}: print("invalid: field")\n    elif not m["steps"].isdigit(): print("invalid: steps")\n    elif not m["required"].isdigit() or int(m["required"]) == 0: print("invalid: required")\n    elif int(m["steps"]) < int(m["required"]): print("reject: incomplete procedure")\n    else: print("allow: procedure complete")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Tìm chuẩn áp dụng cho loại thiết bị của bạn NGOÀI sandbox, chép danh sách bước bắt buộc ra thành checklist thật, rồi đánh dấu bước nào dự án đang thiếu.',
    cards: [
      {
        hoi: 'Vì sao tính đầy đủ của quy trình nên kiểm bằng máy?',
        dap: 'Vì người rà bằng mắt bỏ sót đúng những bước ít khi dùng tới — mà đó thường là các bước an toàn.',
      },
      {
        hoi: 'MÔ PHỎNG đếm bước có thay được việc đọc chuẩn không?',
        dap: 'Không — nó chỉ kiểm được số lượng; nội dung từng bước có đúng chuẩn hay không vẫn phải đọc chuẩn thật.',
      },
    ],
  }),
]
