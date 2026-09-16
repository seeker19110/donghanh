// P6-U193 — architecture-s4: executable ADR/spec handoff.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U193_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u193-l1',
    unitId: 'p6-u193',
    language: 'python',
    title: 'MÔ PHỎNG kiểm tra ADR đủ evidence để handoff',
    hook: 'Một ticket “dùng cache cho nhanh” không cho người nhận biết vì sao, ai chịu trách nhiệm, hay lúc nào cần xem lại.',
    theory:
      'ADR/spec có thể executable ở mức policy: context, decision, alternatives, owner, acceptance và revisit là contract tối thiểu. Mỗi trường được biểu diễn 0 hoặc 1 trong simulator. Bất kỳ trường thiếu nào cũng trả `handoff=blocked`; không được suy luận ngầm từ tiêu đề hay delegate một quyết định chưa có owner.',
    workedExample: {
      code: `# Danh sach field bat buoc cua handoff.\nrequired = ["context", "decision", "alternatives", "owner", "acceptance", "revisit"]\npresent = {"context", "decision", "alternatives", "owner", "acceptance"}\nprint("revisit" in present)`,
      stdinLines: [],
    },
    predict: {
      code: `missing = ["owner"]\nprint(len(missing) == 0)`,
      question: 'ADR thiếu owner có thể handoff không?',
      choices: ['True', 'False', 'owner', '0'],
      answerIndex: 1,
      explain:
        'Không; thiếu bất kỳ trường bắt buộc nào, đặc biệt owner, phải block handoff theo contract fail closed.',
    },
    parsons: {
      prompt: 'Xếp policy kiểm tra ADR trước khi delegate.',
      lines: [
        'required = ["context", "decision", "alternatives", "owner", "acceptance", "revisit"]',
        'missing = [field for field in required if flags[field] == 0]',
        'if missing:',
        '    print("handoff=blocked")',
        'else:',
        '    print("handoff=ready")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG ADR handoff. Đọc sáu cờ theo đúng thứ tự `context,decision,alternatives,owner,acceptance,revisit`, mỗi cờ là 0 hoặc 1. In `handoff=ready` chỉ khi đủ cả sáu. Nếu thiếu, in `handoff=blocked` và `reason=missing:<field>` với field đầu tiên theo thứ tự contract. Input sai in `input-khong-hop-le`. Đây là policy bounded; không ghi file, gửi ticket hay tự delegate.',
      starterCode: 'raw = input().strip()\n\n# MÔ PHỎNG: contract ADR phai du truoc handoff.',
      testCases: [
        {
          stdinLines: ['1,1,1,1,1,1'],
          expected: 'handoff=ready',
          match: 'contains',
          hidden: false,
          label: 'ADR đủ contract có thể handoff',
        },
        {
          stdinLines: ['1,1,1,0,1,1'],
          expected: 'handoff=blocked\nreason=missing:owner',
          match: 'contains',
          hidden: true,
          label: 'thiếu owner phải block',
        },
        {
          stdinLines: ['1,1,1,1,1,0'],
          expected: 'handoff=blocked\nreason=missing:revisit',
          match: 'contains',
          hidden: true,
          label: 'thiếu revisit không có điều kiện review',
        },
        {
          stdinLines: ['1,1,yes,1,1,1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'evidence không phải cờ nhị phân bị từ chối',
        },
      ],
      hints: [
        'Giữ thứ tự required cố định để reason tái lập.',
        'Chỉ parse đúng sáu token; thiếu hoặc thừa token là contract lỗi.',
        'Ready không có nghĩa deploy được: nó chỉ chứng minh brief có đủ evidence để giao việc.',
      ],
      sampleSolution: `try:
    fields = ["context", "decision", "alternatives", "owner", "acceptance", "revisit"]
    tokens = input().strip().split(",")
    if len(tokens) != len(fields) or any(token not in {"0", "1"} for token in tokens):
        raise ValueError
    missing = [field for field, token in zip(fields, tokens) if token == "0"]
    if missing:
        print("handoff=blocked")
        print("reason=missing:" + missing[0])
    else:
        print("handoff=ready")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Lấy một ADR cũ, đánh dấu sáu evidence bắt buộc và viết một revisit condition có metric/ngưỡng. Nếu còn thiếu field nào, ghi người owner phải bổ sung trước handoff.',
    srsCards: [
      {
        hoi: 'Sáu field tối thiểu của executable ADR/spec handoff là gì?',
        dap: 'Context, decision, alternatives, owner, acceptance và revisit; thiếu một field làm contract mơ hồ nên handoff phải blocked thay vì suy đoán ý định.',
      },
      {
        hoi: 'Vì sao acceptance và revisit đều cần có trong ADR handoff?',
        dap: 'Acceptance cho người nhận tiêu chí hoàn thành kiểm chứng được, còn revisit xác định evidence hoặc ngưỡng nào buộc quyết định được xem lại khi giả định thay đổi.',
      },
    ],
  },
  {
    id: 'p6-u193-l2',
    unitId: 'p6-u193',
    language: 'python',
    title: 'MÔ PHỎNG chặn boundary conflict trước khi delegate',
    hook: 'Hai đội cùng nghĩ mình sở hữu “đơn hàng” sẽ tạo ra một handoff nghe hợp lý nhưng không ai chịu trách nhiệm dữ liệu cuối cùng.',
    theory:
      'Bounded context phải có owner duy nhất cho từng capability. Simulator nhận capability và owner được đề xuất; nếu capability không nằm trong bounded spec hoặc owner khác owner đã ghi thì conflict. Conflict không được delegate: phải escalation về ADR/owner thay vì để executor tự chọn một trong hai ranh giới.',
    workedExample: {
      code: `# Spec da quy dinh billing so huu invoice.\nowners = {"invoice": "billing", "catalog": "catalog"}\ncapability, proposed = "invoice", "orders"\nprint(owners[capability] == proposed)`,
      stdinLines: [],
    },
    predict: {
      code: `recorded_owner = "billing"\nproposed_owner = "orders"\nprint(recorded_owner != proposed_owner)`,
      question: 'Owner đề xuất khác owner đã ghi cho capability có phải boundary conflict không?',
      choices: ['True', 'False', 'billing', 'orders'],
      answerIndex: 0,
      explain:
        'Có. Khác owner là evidence conflict; executor không có thẩm quyền tự chọn owner thay thế.',
    },
    parsons: {
      prompt: 'Xếp policy fail closed cho bounded-context handoff.',
      lines: [
        'recorded = owners.get(capability)',
        'if recorded is None:',
        '    print("handoff=blocked")',
        'elif recorded != proposed:',
        '    print("handoff=blocked")',
        'else:',
        '    print("handoff=ready")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG bounded handoff. Dòng 1 là spec cố định dạng `capability:owner;...` (1..6 cặp, tên chữ thường 1..12); dòng 2 là `capability:proposed-owner`. Nếu capability không có trong spec, in `handoff=blocked` rồi `reason=unknown-boundary`. Nếu owner đề xuất khác owner ghi, in `handoff=blocked` rồi `reason=boundary-conflict`; chỉ khi trùng mới in `handoff=ready`. Duplicate capability hoặc owner/capability lỗi in `input-khong-hop-le`. Không gọi hệ thống bên ngoài, không tạo delegation; conflict phải được ADR review giải quyết.',
      starterCode:
        'raw_spec = input().strip()\nraw_request = input().strip()\n\n# MÔ PHỎNG: ownership phai ro rang truoc delegate.',
      testCases: [
        {
          stdinLines: ['invoice:billing;catalog:catalog', 'invoice:orders'],
          expected: 'handoff=blocked\nreason=boundary-conflict',
          match: 'contains',
          hidden: false,
          label: 'owner xung đột không được delegate',
        },
        {
          stdinLines: ['invoice:billing;catalog:catalog', 'catalog:catalog'],
          expected: 'handoff=ready',
          match: 'contains',
          hidden: true,
          label: 'owner khớp bounded spec có thể handoff',
        },
        {
          stdinLines: ['invoice:billing', 'payment:billing'],
          expected: 'handoff=blocked\nreason=unknown-boundary',
          match: 'contains',
          hidden: true,
          label: 'capability ngoài spec bị chặn',
        },
        {
          stdinLines: ['invoice:billing;invoice:orders', 'invoice:billing'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'spec trùng capability là mơ hồ',
        },
      ],
      hints: [
        'Parse spec vào dict nhưng từ chối duplicate trước khi ghi đè.',
        'Kiểm name bằng `islower()` và giới hạn độ dài để fixture bounded.',
        '`unknown-boundary` khác `boundary-conflict`: cả hai block nhưng dẫn tới review khác nhau.',
      ],
      sampleSolution: `try:
    raw_spec = input().strip()
    raw_request = input().strip()
    owners = {}
    for token in raw_spec.split(";"):
        fields = token.split(":")
        if len(fields) != 2:
            raise ValueError
        capability, owner = fields
        if not capability.islower() or not owner.islower() or not 1 <= len(capability) <= 12 or not 1 <= len(owner) <= 12 or capability in owners:
            raise ValueError
        owners[capability] = owner
    request = raw_request.split(":")
    if not raw_spec or not 1 <= len(owners) <= 6 or len(request) != 2 or any(not value.islower() or not 1 <= len(value) <= 12 for value in request):
        raise ValueError
    capability, proposed = request
    if capability not in owners:
        print("handoff=blocked")
        print("reason=unknown-boundary")
    elif owners[capability] != proposed:
        print("handoff=blocked")
        print("reason=boundary-conflict")
    else:
        print("handoff=ready")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Chọn một capability giao giữa hai team, ghi owner hiện tại và một boundary conflict có thể xảy ra. Viết ADR question cần người có thẩm quyền trả lời trước khi giao executor làm việc.',
    srsCards: [
      {
        hoi: 'Khi proposed owner khác owner trong bounded spec, handoff cần làm gì?',
        dap: 'Nó phải blocked với reason boundary-conflict và được escalation để ADR hoặc owner có thẩm quyền quyết; executor không được tự chọn bên thắng để tiếp tục delegate.',
      },
      {
        hoi: 'Khác nhau giữa unknown-boundary và boundary-conflict là gì?',
        dap: 'Unknown-boundary nghĩa capability chưa được bounded spec mô tả; boundary-conflict nghĩa spec có capability nhưng request gán owner khác. Cả hai đều fail closed và cần review.',
      },
    ],
  },
]
