// P6-U191 — architecture-s4-m2: strangler migration an toàn, bounded và deterministic.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U191_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u191-l1',
    unitId: 'p6-u191',
    language: 'python',
    title: 'MÔ PHỎNG feature flag slice và shadow traffic',
    hook: 'Một đường mới chỉ nên nhận một lát lưu lượng nhỏ trước khi thay thế đường cũ; nếu bản sao shadow cho kết quả khác, tốc độ rollout không còn quan trọng bằng việc dừng an toàn.',
    theory:
      'Strangler migration thay dần một capability cũ bằng capability mới qua feature flag. Bài này chỉ mô phỏng policy trên fixture nhỏ: `slice` là phần trăm request được phép vào đường mới, còn shadow luôn so sánh kết quả nhưng không trả kết quả mới cho khách hàng. Policy fail closed: không có owner hoặc rollback trigger thì rollback; có shadow mismatch thì freeze, giữ đường cũ phục vụ và không tự promote. Đây không gọi gateway, không gửi traffic thật và không phải một lệnh deploy.',
    workedExample: {
      code: `# Dat lat rollout la 10 phan tram de gioi han blast radius.\nslice = 10\n# Shadow khac ket qua nen khong duoc promote.\nmismatch = True\n# Chon hanh dong an toan co dinh.\naction = "freeze" if mismatch else "continue"\n# In contract de on-call co the doc duoc.\nprint(f"slice={slice}%")\nprint(f"action={action}")`,
      stdinLines: [],
    },
    predict: {
      code: `mismatch = True\naction = "freeze" if mismatch else "continue"\nprint(action)`,
      question: 'Khi shadow comparison phát hiện kết quả khác nhau, policy này in ra gì?',
      choices: ['continue', 'freeze', 'promote', 'ignore'],
      answerIndex: 1,
      explain:
        'Mismatch là evidence chưa tương thích; policy dừng tăng rollout bằng `freeze`, không được tự promote hay bỏ qua.',
    },
    parsons: {
      prompt: 'Xếp policy fail-closed để kiểm owner/trigger trước, rồi mới xét mismatch shadow.',
      lines: [
        'if not owner or not trigger:',
        '    action = "rollback"',
        'elif mismatch:',
        '    action = "freeze"',
        'else:',
        '    action = "continue"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG policy feature flag và shadow. Đọc một dòng `slice|shadow|mismatch|owner|trigger`. `slice` là số nguyên 0..100; `shadow` là `on` hoặc `off`; `mismatch` là `yes` hoặc `no`; owner và trigger là chuỗi 1..30 ký tự gồm chữ, số hoặc `-`. Nếu input hợp lệ, in `slice=<n>%`, `shadow=<on/off>`, rồi action. Owner hoặc trigger thiếu/không hợp lệ: `action=rollback` và `reason=rollback-evidence-missing`. Nếu shadow `on` và mismatch `yes`: `action=freeze`, `reason=shadow-mismatch`. Nếu shadow `off` và mismatch `yes`: `action=freeze`, `reason=shadow-evidence-missing`. Các trường hợp còn lại: `action=continue`, `reason=bounded-slice`. Luôn in `owner=<owner>` và `trigger=<trigger>` khi có input hợp lệ. Input sai in `input-khong-hop-le`. Không gọi network, filesystem, thời gian, random hay deploy thật.',
      starterCode: `raw = input().strip()\n\n# MÔ PHỎNG: policy chỉ quyết định continue, freeze hoac rollback tren fixture nho.`,
      testCases: [
        {
          stdinLines: ['10|on|no|migration-oncall|shadow-mismatch'],
          expected:
            'slice=10%\nshadow=on\naction=continue\nreason=bounded-slice\nowner=migration-oncall\ntrigger=shadow-mismatch',
          match: 'contains',
          hidden: false,
          label: 'lát nhỏ có rollback evidence và shadow khớp được tiếp tục',
        },
        {
          stdinLines: ['25|on|yes|migration-oncall|shadow-mismatch'],
          expected: 'action=freeze\nreason=shadow-mismatch',
          match: 'contains',
          hidden: true,
          label: 'shadow mismatch phải freeze thay vì promote',
        },
        {
          stdinLines: ['0|off|yes|migration-oncall|shadow-mismatch'],
          expected: 'action=freeze\nreason=shadow-evidence-missing',
          match: 'contains',
          hidden: true,
          label: 'mismatch khi không shadow là evidence thiếu và phải freeze',
        },
        {
          stdinLines: ['50|on|no||shadow-mismatch'],
          expected: 'action=rollback\nreason=rollback-evidence-missing',
          match: 'contains',
          hidden: true,
          label: 'không có rollback owner phải rollback fail closed',
        },
        {
          stdinLines: ['101|on|no|migration-oncall|shadow-mismatch'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'slice vượt giới hạn không có policy xác định',
        },
      ],
      hints: [
        'Dùng `raw.split("|")` và yêu cầu đúng năm trường để tránh một contract mơ hồ.',
        'Kiểm owner/trigger trước mismatch để thiếu rollback evidence luôn fail closed.',
        'Shadow chỉ là quan sát; `continue` không có nghĩa deploy hoặc promote toàn bộ traffic.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    parts = raw.split("|")
    if len(parts) != 5:
        raise ValueError
    slice_text, shadow, mismatch, owner, trigger = parts
    slice_percent = int(slice_text)
    valid_text = lambda value: 1 <= len(value) <= 30 and all(
        char.isalnum() or char == "-" for char in value
    )
    if not 0 <= slice_percent <= 100 or shadow not in ("on", "off") or mismatch not in ("yes", "no"):
        raise ValueError
    print(f"slice={slice_percent}%")
    print(f"shadow={shadow}")
    if not valid_text(owner) or not valid_text(trigger):
        action, reason = "rollback", "rollback-evidence-missing"
    elif mismatch == "yes" and shadow == "on":
        action, reason = "freeze", "shadow-mismatch"
    elif mismatch == "yes":
        action, reason = "freeze", "shadow-evidence-missing"
    else:
        action, reason = "continue", "bounded-slice"
    print(f"action={action}")
    print(f"reason={reason}")
    print(f"owner={owner}")
    print(f"trigger={trigger}")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Viết một rollout plan cho một endpoint thay thế gồm slice ban đầu, metric shadow được so sánh, rollback owner, rollback trigger và bằng chứng cần review trước khi nâng slice. Nêu rõ ai có quyền freeze và ai duyệt promote.',
    srsCards: [
      {
        hoi: 'Vì sao shadow mismatch phải freeze thay vì tự tăng feature-flag slice?',
        dap: 'Vì kết quả khác nhau là bằng chứng đường mới chưa tương thích; freeze giữ blast radius bị chặn để owner điều tra trước khi có bất kỳ quyết định promote nào.',
      },
      {
        hoi: 'Rollback owner và trigger thiếu thì policy migration phải làm gì?',
        dap: 'Policy phải fail closed bằng rollback, vì không có người chịu trách nhiệm và điều kiện kích hoạt rõ ràng để kiểm soát hoặc khôi phục khi rollout có sự cố.',
      },
    ],
  },
  {
    id: 'p6-u191-l2',
    unitId: 'p6-u191',
    language: 'python',
    title: 'MÔ PHỎNG dual write và compatibility rollback',
    hook: 'Khi schema cũ và schema mới cùng sống, ghi được cả hai chưa đủ: dữ liệu phải tương thích để một rollback không biến bản ghi khách hàng thành một câu đố.',
    theory:
      'Dual write ghi cùng một canonical value vào legacy và modern representation trong một lát migration có kiểm soát. Simulator này không có database: nó kiểm bằng string fixture, compatibility evidence và ownership/trigger. Nếu evidence rollback thiếu thì rollback; nếu hai representation khác nhau thì freeze; nếu compatibility bị từ chối thì rollback. Không state nào được tự quyết định cutover hoặc xoá đường cũ, vì transition thật cần ADR, metric và review ngoài simulator.',
    workedExample: {
      code: `# Hai representation cua cung mot record phai bang nhau trong fixture.\nlegacy = "user-42:active"\nmodern = "user-42:active"\n# Compatibility da duoc review trong lat nay.\ncompatible = True\n# Chi khi ca hai bang chung dung moi tiep tuc dual write.\naction = "continue" if legacy == modern and compatible else "freeze"\n# In ket qua deterministic.\nprint(action)`,
      stdinLines: [],
    },
    predict: {
      code: `legacy = "active"\nmodern = "disabled"\nprint(legacy == modern)`,
      question: 'Nếu legacy và modern ghi hai giá trị khác nhau, biểu thức so sánh in ra gì?',
      choices: ['True', 'False', 'rollback', 'continue'],
      answerIndex: 1,
      explain:
        'Hai string khác nhau không tương thích trong fixture, nên comparison trả `False` và policy an toàn phải ngăn cutover.',
    },
    parsons: {
      prompt: 'Xếp các nhánh policy dual write theo thứ tự fail-closed.',
      lines: [
        'if not owner or not trigger:',
        '    action = "rollback"',
        'elif compatibility == "no":',
        '    action = "rollback"',
        'elif legacy != modern:',
        '    action = "freeze"',
        'else:',
        '    action = "continue"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG dual write compatibility. Đọc một dòng `legacy|modern|compatibility|owner|trigger`. legacy/modern dài 1..40 ký tự chỉ gồm chữ, số, `-`, `:`; compatibility là `yes` hoặc `no`; owner/trigger dài 1..30 ký tự gồm chữ, số, `-`. In `legacy=<...>` và `modern=<...>`. Owner/trigger thiếu: `action=rollback`, `reason=rollback-evidence-missing`. compatibility `no`: `action=rollback`, `reason=compatibility-rejected`. Nếu compatibility `yes` nhưng hai value khác nhau: `action=freeze`, `reason=dual-write-mismatch`. Chỉ khi compatibility `yes` và value bằng nhau in `action=continue`, `reason=compatible-dual-write`. Cuối cùng in `owner=<...>` và `trigger=<...>`. Input sai in `input-khong-hop-le`. Đây chỉ là MÔ PHỎNG fixture, không mở database, không ghi file và không tự cutover.',
      starterCode: `raw = input().strip()\n\n# MÔ PHỎNG: kiem compatibility evidence truoc khi cho phep dual write tiep tuc.`,
      testCases: [
        {
          stdinLines: ['user-42:active|user-42:active|yes|data-oncall|schema-mismatch'],
          expected:
            'legacy=user-42:active\nmodern=user-42:active\naction=continue\nreason=compatible-dual-write',
          match: 'contains',
          hidden: false,
          label: 'hai representation khớp và có evidence thì giữ dual write bounded',
        },
        {
          stdinLines: ['user-42:active|user-42:disabled|yes|data-oncall|schema-mismatch'],
          expected: 'action=freeze\nreason=dual-write-mismatch',
          match: 'contains',
          hidden: true,
          label: 'dual write khác dữ liệu phải freeze để điều tra',
        },
        {
          stdinLines: ['user-42:active|user-42:active|no|data-oncall|schema-mismatch'],
          expected: 'action=rollback\nreason=compatibility-rejected',
          match: 'contains',
          hidden: true,
          label: 'không có compatibility approval thì rollback',
        },
        {
          stdinLines: ['user-42:active|user-42:active|yes|data-oncall|'],
          expected: 'action=rollback\nreason=rollback-evidence-missing',
          match: 'contains',
          hidden: true,
          label: 'rollback trigger trống phải fail closed',
        },
        {
          stdinLines: ['bad value|user-42:active|yes|data-oncall|schema-mismatch'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'khoảng trắng làm canonical fixture không xác định',
        },
      ],
      hints: [
        'Tạo hàm kiểm text để reject khoảng trắng và ký tự không thuộc contract.',
        'Đừng dùng `legacy != modern` trước khi biết compatibility và rollback evidence hợp lệ.',
        'Kết quả `continue` chỉ giữ dual write trong lát mô phỏng; nó không phải tín hiệu xoá schema cũ.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    parts = raw.split("|")
    if len(parts) != 5:
        raise ValueError
    legacy, modern, compatibility, owner, trigger = parts
    valid_value = lambda value: 1 <= len(value) <= 40 and all(
        char.isalnum() or char in "-:" for char in value
    )
    valid_evidence = lambda value: 1 <= len(value) <= 30 and all(
        char.isalnum() or char == "-" for char in value
    )
    if not valid_value(legacy) or not valid_value(modern) or compatibility not in ("yes", "no"):
        raise ValueError
    print(f"legacy={legacy}")
    print(f"modern={modern}")
    if not valid_evidence(owner) or not valid_evidence(trigger):
        action, reason = "rollback", "rollback-evidence-missing"
    elif compatibility == "no":
        action, reason = "rollback", "compatibility-rejected"
    elif legacy != modern:
        action, reason = "freeze", "dual-write-mismatch"
    else:
        action, reason = "continue", "compatible-dual-write"
    print(f"action={action}")
    print(f"reason={reason}")
    print(f"owner={owner}")
    print(f"trigger={trigger}")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Thiết kế một compatibility matrix cho thay đổi schema của profile: cột legacy, modern, reader cũ, reader mới, rollback owner, trigger và evidence. Chỉ ra điều kiện nào buộc bạn freeze thay vì tiếp tục dual write.',
    srsCards: [
      {
        hoi: 'Dual write mismatch cho biết điều gì và policy phải phản ứng thế nào?',
        dap: 'Nó cho thấy hai representation của cùng fixture không còn nhất quán; policy phải freeze để điều tra, duy trì đường cũ và tuyệt đối không tự cutover sang schema mới.',
      },
      {
        hoi: 'Vì sao compatibility bị từ chối cần rollback dù legacy và modern có thể đang bằng nhau?',
        dap: 'Một mẫu bằng nhau không thay thế evidence về reader, writer và schema trong các điều kiện khác; thiếu approval tương thích khiến migration không có cơ sở an toàn để tiếp tục.',
      },
    ],
  },
]
