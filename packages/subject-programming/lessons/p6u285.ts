// P6-U285 — desktop-s3-m4 "Kiểm thử ứng dụng desktop": ma trận nền tảng trong CI (bài 1) và
// test giao diện ổn định thay vì test hay đỏ vặt (bài 2). Ứng dụng desktop khác web ở chỗ bản
// cài chạy trên máy người khác — không sửa nóng được, nên cổng trước phát hành phải chặt.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U285_LESSONS = [
  desktopSimulation({
    id: 'p6-u285-l1',
    unitId: 'p6-u285',
    title: 'ma trận platform và hai luồng phải test: cài đặt, cập nhật',
    hook: 'Test xanh trên Linux của CI rồi bản cài Windows hỏng ngay bước đầu — vì chưa ai từng chạy nó trên Windows.',
    theory:
      'Ba nền mục tiêu đã khai là windows, macos, linux; thiếu bất kỳ nền nào thì bằng chứng chưa đủ để gọi là bản ứng cử phát hành nên deny. Có đủ ba nền rồi mới xét hai luồng riêng của desktop mà web không có: cài đặt và cập nhật. Thiếu test luồng cập nhật là reject, vì đó là đường mã mới tới máy người dùng đã có dữ liệu.',
    workedCode:
      '# MÔ PHỎNG độ phủ nền tảng\nMUC_TIEU = {"windows", "macos", "linux"}\nda_test = {"linux"}\nprint("deny: platform coverage incomplete" if not MUC_TIEU <= da_test else "allow: release candidate")',
    predictCode:
      'MUC_TIEU = {"windows", "macos", "linux"}\nda_test = {"windows", "macos", "linux"}\ninstall_tested, update_tested = "yes", "no"\nif not MUC_TIEU <= da_test:\n    print("deny: platform coverage incomplete")\nelif update_tested == "no":\n    print("reject: update flow untested")\nelif install_tested == "no":\n    print("refuse: install flow untested")\nelse:\n    print("allow: release candidate")',
    predictChoices: [
      'allow: release candidate',
      'deny: platform coverage incomplete',
      'reject: update flow untested',
      'refuse: install flow untested',
    ],
    predictAnswer: 2,
    predictExplain:
      'Đủ ba nền nên không deny, nhưng luồng cập nhật chưa được test — đó là đường mã mới tới máy người dùng đang có dữ liệu thật.',
    makePrompt:
      'Đọc fixture `platformsTested:<danh sách ngăn bằng dấu |, con của {windows,macos,linux}>,installFlowTested:<yes|no>,updateFlowTested:<yes|no>`. Thiếu trường, sai miền hoặc có nền ngoài ba nền mục tiêu → `invalid: <trường>`; thiếu bất kỳ nền nào trong ba nền → `deny: platform coverage incomplete`; updateFlowTested là no → `reject: update flow untested`; installFlowTested là no → `refuse: install flow untested`; còn lại → `allow: release candidate`. MÔ PHỎNG, không chạy CI hay trình cài đặt thật.',
    testCases: [
      {
        stdinLines: [
          'platformsTested:windows|macos|linux,installFlowTested:yes,updateFlowTested:yes',
        ],
        expected: 'allow: release candidate',
        hidden: false,
        label: 'đủ ba nền và cả hai luồng',
      },
      {
        stdinLines: ['platformsTested:linux,installFlowTested:yes,updateFlowTested:yes'],
        expected: 'deny: platform coverage incomplete',
        hidden: true,
        label: 'thiếu nền mục tiêu',
      },
      {
        stdinLines: [
          'platformsTested:windows|macos|linux,installFlowTested:yes,updateFlowTested:no',
        ],
        expected: 'reject: update flow untested',
        hidden: true,
        label: 'chưa test luồng cập nhật',
      },
      {
        stdinLines: [
          'platformsTested:windows|macos|linux,installFlowTested:no,updateFlowTested:yes',
        ],
        expected: 'refuse: install flow untested',
        hidden: true,
        label: 'chưa test luồng cài đặt',
      },
      {
        stdinLines: [
          'platformsTested:windows|macos|haiku,installFlowTested:yes,updateFlowTested:yes',
        ],
        expected: 'invalid: platformsTested',
        hidden: true,
        label: 'ca âm — nền ngoài danh sách mục tiêu fail closed',
      },
    ],
    sampleSolution:
      'MUC_TIEU = {"windows", "macos", "linux"}\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"platformsTested", "installFlowTested", "updateFlowTested"}: print("invalid: field")\n    elif m["installFlowTested"] not in {"yes", "no"}: print("invalid: installFlowTested")\n    elif m["updateFlowTested"] not in {"yes", "no"}: print("invalid: updateFlowTested")\n    else:\n        da = set(p for p in m["platformsTested"].split("|") if p)\n        if not da <= MUC_TIEU: print("invalid: platformsTested")\n        elif not MUC_TIEU <= da: print("deny: platform coverage incomplete")\n        elif m["updateFlowTested"] == "no": print("reject: update flow untested")\n        elif m["installFlowTested"] == "no": print("refuse: install flow untested")\n        else: print("allow: release candidate")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, dựng ma trận ba hệ điều hành trong CI cho một dự án nhỏ, cho nó đóng gói bản cài ở cả ba, rồi tải về và chạy thử ít nhất một bản trên máy thật.',
    cards: [
      {
        hoi: 'Vì sao luồng cập nhật đáng test hơn cả luồng cài mới?',
        dap: 'Vì lúc cập nhật, máy người dùng đã có dữ liệu thật; hỏng ở đó là mất dữ liệu, còn hỏng lúc cài mới thì họ chỉ chưa dùng được.',
      },
      {
        hoi: 'Ma trận nền tảng trong CI đắt hơn chạy một nền, đổi lại được gì?',
        dap: 'Bắt sớm những khác biệt không thể suy đoán: đường dẫn, quyền tệp, phông chữ, hành vi cửa sổ và ký mã của từng hệ.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u285-l2',
    unitId: 'p6-u285',
    title: 'test giao diện ổn định: chờ theo điều kiện, không chờ theo giây',
    hook: 'Một test đỏ ngẫu nhiên hai lần mỗi tuần sẽ bị cả đội học cách bấm "chạy lại" — và từ đó nó không còn bảo vệ ai nữa.',
    theory:
      'Test giao diện dễ nhiễu vì phụ thuộc thời gian và thứ tự. Ba luật của bài, xét theo thứ tự: chờ bằng độ trễ cứng (sleep) là deny vì nó vừa chậm vừa vẫn hỏng trên máy tải cao; tìm phần tử theo toạ độ pixel là reject vì đổi bố cục là gãy; test đỏ ngẫu nhiên vượt ngưỡng 5 phần trăm số lần chạy thì refuse tiếp nhận vào cổng phát hành cho tới khi sửa. Ngưỡng 5 là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG luật chờ trong test giao diện\nwait_strategy = "sleep"\nprint("deny: hard-coded sleep" if wait_strategy == "sleep" else "allow: stable test")',
    predictCode:
      'wait_strategy, selector, flaky_percent = "condition", "role", 12\nif wait_strategy == "sleep":\n    print("deny: hard-coded sleep")\nelif selector == "pixel":\n    print("reject: pixel selector")\nelif flaky_percent > 5:\n    print("refuse: flaky above threshold")\nelse:\n    print("allow: stable test")',
    predictChoices: [
      'allow: stable test',
      'deny: hard-coded sleep',
      'reject: pixel selector',
      'refuse: flaky above threshold',
    ],
    predictAnswer: 3,
    predictExplain:
      'Cách chờ và cách tìm phần tử đều đúng, nhưng 12 phần trăm lượt chạy đỏ ngẫu nhiên vượt ngưỡng 5 nên test chưa đáng tin để gác cổng.',
    makePrompt:
      'Đọc fixture `waitStrategy:<sleep|condition>,selector:<role|text|pixel>,flakyPercent:<0-100>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; waitStrategy là sleep → `deny: hard-coded sleep`; selector là pixel → `reject: pixel selector`; flakyPercent lớn hơn 5 → `refuse: flaky above threshold`; còn lại → `allow: stable test`. MÔ PHỎNG, không chạy trình điều khiển giao diện thật.',
    testCases: [
      {
        stdinLines: ['waitStrategy:condition,selector:role,flakyPercent:0'],
        expected: 'allow: stable test',
        hidden: false,
        label: 'chờ theo điều kiện, tìm theo vai trò, không nhiễu',
      },
      {
        stdinLines: ['waitStrategy:sleep,selector:pixel,flakyPercent:40'],
        expected: 'deny: hard-coded sleep',
        hidden: true,
        label: 'chờ cứng được xét trước mọi lỗi khác',
      },
      {
        stdinLines: ['waitStrategy:condition,selector:pixel,flakyPercent:0'],
        expected: 'reject: pixel selector',
        hidden: true,
        label: 'tìm phần tử theo toạ độ',
      },
      {
        stdinLines: ['waitStrategy:condition,selector:role,flakyPercent:12'],
        expected: 'refuse: flaky above threshold',
        hidden: true,
        label: 'test đỏ ngẫu nhiên quá ngưỡng',
      },
      {
        stdinLines: ['waitStrategy:condition,selector:role,flakyPercent:150'],
        expected: 'invalid: flakyPercent',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"waitStrategy", "selector", "flakyPercent"}: print("invalid: field")\n    elif m["waitStrategy"] not in {"sleep", "condition"}: print("invalid: waitStrategy")\n    elif m["selector"] not in {"role", "text", "pixel"}: print("invalid: selector")\n    elif not m["flakyPercent"].isdigit() or int(m["flakyPercent"]) > 100: print("invalid: flakyPercent")\n    elif m["waitStrategy"] == "sleep": print("deny: hard-coded sleep")\n    elif m["selector"] == "pixel": print("reject: pixel selector")\n    elif int(m["flakyPercent"]) > 5: print("refuse: flaky above threshold")\n    else: print("allow: stable test")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, viết một test giao diện tự động cho một luồng ngắn của app bạn, chạy nó 20 lần liên tiếp và đếm số lần đỏ. Nếu có lần đỏ, tìm ra chỗ chờ theo thời gian và đổi sang chờ theo điều kiện.',
    cards: [
      {
        hoi: 'Vì sao chờ theo điều kiện tốt hơn chờ theo số giây?',
        dap: 'Vì nó chờ đúng cái mình cần (phần tử xuất hiện, việc xong) nên vừa nhanh khi máy rảnh vừa không gãy khi máy tải cao.',
      },
      {
        hoi: 'Test hay đỏ ngẫu nhiên gây hại thế nào ngoài việc mất thời gian?',
        dap: 'Nó dạy cả đội bỏ qua màu đỏ, nên khi có lỗi thật thì không ai tin cổng nữa — cổng mất hẳn tác dụng.',
      },
    ],
  }),
]
