import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U271_LESSONS = [
  embeddedSimulation({
    id: 'p6-u271-l1',
    unitId: 'p6-u271',
    title: 'định danh từng thiết bị và khởi động an toàn',
    hook: 'Một khoá dùng chung cho cả lô nghĩa là lộ một máy là lộ cả lô — và bạn không thể thu hồi riêng máy nào.',
    theory:
      'Mỗi thiết bị phải có khoá định danh RIÊNG, nạp tại xưởng. Khoá chung cả lô tiện lúc sản xuất nhưng phá luôn khả năng thu hồi từng máy, nên bị chặn ở khâu duyệt. Khởi động an toàn kiểm chữ ký firmware trước khi trao quyền điều khiển. Hai thiết bị cùng khai một khoá định danh là dấu hiệu nhân bản, phải deny vì không còn phân biệt được máy thật với máy chép.',
    workedCode:
      '# MÔ PHỎNG kiểm chữ ký khởi động\nsig = "bad"\nprint("reject: bad signature" if sig == "bad" else "allow: boot trusted")',
    predictCode:
      'dup = "yes"\nprint("deny: duplicate identity" if dup == "yes" else "allow: boot trusted")',
    predictChoices: ['deny: duplicate identity', 'allow: boot trusted', 'reject: bad signature'],
    predictAnswer: 0,
    predictExplain:
      'Hai thiết bị cùng một khoá định danh nghĩa là có nhân bản; hệ thống không còn biết máy nào là máy thật.',
    makePrompt:
      'Đọc `sig:<ok|bad>,key:<per-device|batch>,dup:<yes|no>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; sig bad → `reject: bad signature`; key batch → `deny: shared batch key`; dup yes → `deny: duplicate identity`; còn lại → `allow: boot trusted`. MÔ PHỎNG, không có khoá hay thiết bị thật.',
    testCases: [
      {
        stdinLines: ['sig:ok,key:per-device,dup:no'],
        expected: 'allow: boot trusted',
        hidden: false,
        label: 'chữ ký đúng và khoá riêng từng máy',
      },
      {
        stdinLines: ['sig:bad,key:per-device,dup:no'],
        expected: 'reject: bad signature',
        hidden: true,
        label: 'firmware không đúng chữ ký thì không được trao quyền',
      },
      {
        stdinLines: ['sig:ok,key:batch,dup:no'],
        expected: 'deny: shared batch key',
        hidden: true,
        label: 'khoá dùng chung cả lô phá khả năng thu hồi riêng',
      },
      {
        stdinLines: ['sig:ok,key:per-device,dup:maybe'],
        expected: 'invalid: dup',
        hidden: true,
        label: 'ca âm — trạng thái nhân bản mơ hồ fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"sig", "key", "dup"}: print("invalid: field")\n    elif m["sig"] not in {"ok", "bad"}: print("invalid: sig")\n    elif m["key"] not in {"per-device", "batch"}: print("invalid: key")\n    elif m["dup"] not in {"yes", "no"}: print("invalid: dup")\n    elif m["sig"] == "bad": print("reject: bad signature")\n    elif m["key"] == "batch": print("deny: shared batch key")\n    elif m["dup"] == "yes": print("deny: duplicate identity")\n    else: print("allow: boot trusted")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Viết cho dự án thật NGOÀI sandbox quy trình sinh và nạp khoá riêng từng thiết bị: sinh ở đâu, khoá riêng có bao giờ rời khỏi con chip không, và ai giữ danh sách khoá công khai.',
    cards: [
      {
        hoi: 'Vì sao khoá riêng nên sinh ngay trong con chip?',
        dap: 'Để khoá riêng không bao giờ tồn tại ở nơi khác, nên không có bản sao nào để rò rỉ từ máy tính của xưởng.',
      },
      {
        hoi: 'Khởi động an toàn bảo vệ điều gì?',
        dap: 'Nó bảo đảm chỉ firmware do bạn ký mới được chạy, nên kẻ thay được bộ nhớ flash vẫn không chiếm được thiết bị.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u271-l2',
    unitId: 'p6-u271',
    title: 'thu hồi khoá đúng một thiết bị',
    hook: 'Thu hồi mà làm chết cả đội thiết bị thì đó không phải thu hồi, đó là sự cố.',
    theory:
      'Khoá riêng từng thiết bị tồn tại chính là để thu hồi có phạm vi hẹp: vô hiệu đúng máy bị lộ, mọi máy khác không đổi trạng thái. Simulator kiểm đúng bất biến phạm vi đó — với một lệnh thu hồi nhắm vào một mã, chỉ máy trùng mã mới chuyển sang bị vô hiệu. Đây là lý do thực dụng nhất để không dùng khoá chung cả lô.',
    workedCode:
      '# MÔ PHỎNG phạm vi thu hồi\ntarget, device = "dev7", "dev7"\nprint("allow: identity revoked" if target == device else "allow: unchanged")',
    predictCode:
      'target, device = "dev7", "dev9"\nprint("allow: identity revoked" if target == device else "allow: unchanged")',
    predictChoices: ['allow: unchanged', 'allow: identity revoked', 'deny: duplicate identity'],
    predictAnswer: 0,
    predictExplain:
      'Lệnh thu hồi nhắm vào dev7, còn dev9 là máy khác nên trạng thái của nó không được phép đổi.',
    makePrompt:
      'Đọc `target:<mã>,device:<mã>` — lệnh thu hồi nhắm vào `target`, đang xét máy `device`. Thiếu trường hoặc mã rỗng / không phải chữ và số → `invalid: <trường>`; target trùng device → `allow: identity revoked`; còn lại → `allow: unchanged`. MÔ PHỎNG, không gọi máy chủ khoá thật.',
    testCases: [
      {
        stdinLines: ['target:dev7,device:dev7'],
        expected: 'allow: identity revoked',
        hidden: false,
        label: 'đúng máy bị nhắm thì bị vô hiệu',
      },
      {
        stdinLines: ['target:dev7,device:dev9'],
        expected: 'allow: unchanged',
        hidden: true,
        label: 'máy khác trong đội không đổi trạng thái',
      },
      {
        stdinLines: ['target:dev70,device:dev7'],
        expected: 'allow: unchanged',
        hidden: true,
        label: 'so khớp mã phải là trùng khớp trọn vẹn, không phải tiền tố',
      },
      {
        stdinLines: ['target:,device:dev7'],
        expected: 'invalid: target',
        hidden: true,
        label: 'ca âm — lệnh thu hồi không có mã đích fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"target", "device"}: print("invalid: field")\n    elif not m["target"].isalnum(): print("invalid: target")\n    elif not m["device"].isalnum(): print("invalid: device")\n    elif m["target"] == m["device"]: print("allow: identity revoked")\n    else: print("allow: unchanged")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Diễn tập thu hồi trên hệ thống thật NGOÀI sandbox với một thiết bị thử: ghi lại bao lâu thì máy đó mất quyền, và kiểm chứng các máy còn lại vẫn hoạt động bình thường.',
    cards: [
      {
        hoi: 'Vì sao so khớp mã thiết bị phải là trùng khớp trọn vẹn?',
        dap: 'So khớp tiền tố sẽ kéo theo những mã chỉ tình cờ bắt đầu giống nhau, biến một lệnh thu hồi hẹp thành sự cố diện rộng.',
      },
      {
        hoi: 'Nên diễn tập thu hồi trước hay chờ lúc có sự cố?',
        dap: 'Diễn tập trước — lúc có sự cố thật là lúc tệ nhất để phát hiện quy trình thu hồi chưa từng chạy được.',
      },
    ],
  }),
]
