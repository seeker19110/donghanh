// P6-U187 — security-s2-m2: defensive finding triage from redacted fixtures.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U187_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u187-l1',
    unitId: 'p6-u187',
    language: 'python',
    title: 'MÔ PHỎNG triage evidence authorization đã redacted',
    hook: 'Một dòng log lẻ không phải là kết luận: triage tốt cần tách bằng chứng authorization khỏi phỏng đoán.',
    theory:
      'Fixture chỉ là dữ liệu synthetic đã redacted, không phải target thật. Một finding authorization tối thiểu cần identity khác owner, action protected và decision allow; thiếu một mảnh evidence thì kết quả là insufficient. Bộ phân loại fail closed này không quét, không tạo payload và không suy diễn impact ngoài fixture bounded.',
    workedExample: {
      code: '# Fixture redacted: chi doc chuoi co dinh.\nevidence = "different-user|protected-read|allow"\nparts = evidence.split("|")\nprint("finding" if parts == ["different-user", "protected-read", "allow"] else "insufficient")',
      stdinLines: [],
    },
    predict: {
      code: 'parts = "different-user|protected-read|deny".split("|")\nprint("finding" if parts[2] == "allow" else "insufficient")',
      question: 'Khi policy decision là deny, simulator phân loại evidence thế nào?',
      choices: ['finding', 'insufficient', 'scan', 'exploit'],
      answerIndex: 1,
      explain:
        'Deny không chứng minh authorization bypass; thiếu allow nên phải giữ trạng thái insufficient.',
    },
    parsons: {
      prompt: 'Xếp các bước phân loại evidence theo nguyên tắc fail closed.',
      lines: [
        'parts = raw.split("|")',
        'required = ["different-user", "protected-read", "allow"]',
        'if parts == required:',
        '    print("finding=authz-evidence")',
        'else:',
        '    print("finding=insufficient")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG triage authorization từ đúng một fixture redacted: `identity|action|decision`. Identity chỉ `same-user` hoặc `different-user`; action chỉ `protected-read` hoặc `protected-write`; decision chỉ `allow` hoặc `deny`. Nếu ba field hợp lệ và là `different-user` + protected action + `allow`, in `classification=finding`, `category=authz-evidence`, `next=manual-review-redacted`. Mọi fixture khác hợp lệ in `classification=insufficient`, `next=collect-redacted-evidence`; input sai in `input-khong-hop-le`. Không network, I/O ngoài input/output, payload, scan hay exploit.',
      starterCode: 'raw = input().strip()\n\n# MÔ PHỎNG: evidence redacted, fail closed.',
      testCases: [
        {
          stdinLines: ['different-user|protected-read|allow'],
          expected: 'classification=finding\ncategory=authz-evidence\nnext=manual-review-redacted',
          match: 'contains',
          hidden: false,
          label: 'evidence authorization tối thiểu đầy đủ',
        },
        {
          stdinLines: ['different-user|protected-write|deny'],
          expected: 'classification=insufficient\nnext=collect-redacted-evidence',
          match: 'contains',
          hidden: true,
          label: 'deny không là bypass',
        },
        {
          stdinLines: ['same-user|protected-read|allow'],
          expected: 'classification=insufficient',
          match: 'contains',
          hidden: true,
          label: 'owner không chứng minh cross-user',
        },
        {
          stdinLines: ['different-user|public-read|allow'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'action ngoài fixture bị từ chối',
        },
      ],
      hints: [
        'Dùng split("|") và yêu cầu đúng ba field.',
        'Xác thực tập giá trị trước khi phân loại.',
        'Chỉ finding khi khác user, protected action và allow cùng có mặt.',
      ],
      sampleSolution: `try:
    parts = input().strip().split("|")
    identities = {"same-user", "different-user"}
    actions = {"protected-read", "protected-write"}
    decisions = {"allow", "deny"}
    if len(parts) != 3 or parts[0] not in identities or parts[1] not in actions or parts[2] not in decisions:
        raise ValueError
    if parts[0] == "different-user" and parts[2] == "allow":
        print("classification=finding")
        print("category=authz-evidence")
        print("next=manual-review-redacted")
    else:
        print("classification=insufficient")
        print("next=collect-redacted-evidence")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Trên artifact được ủy quyền, viết checklist evidence redacted gồm consent, scope, identity giả lập, expected policy và reviewer. Không đính kèm endpoint, tài khoản, request hay dữ liệu thật.',
    srsCards: [
      {
        hoi: 'Evidence tối thiểu để simulator gắn finding authorization là gì?',
        dap: 'Identity khác owner, một protected action và decision allow phải đồng thời có trong fixture redacted; bất kỳ thành phần nào thiếu đều là insufficient.',
      },
      {
        hoi: 'Vì sao triage authorization phải fail closed?',
        dap: 'Một log hoặc kết quả allow đơn lẻ có thể hợp lệ trong scope của owner; chỉ evidence có cấu trúc mới tránh biến nghi ngờ thành kết luận sai.',
      },
    ],
  },
  {
    id: 'p6-u187-l2',
    unitId: 'p6-u187',
    language: 'python',
    title: 'MÔ PHỎNG triage input-validation bằng evidence tối thiểu',
    hook: 'Input bị từ chối là tín hiệu kiểm soát đang hoạt động; nó không phải lý do để thử biến thể khác.',
    theory:
      'Bài này phân loại một record synthetic/redacted về validation, không sinh request hoặc payload. Finding chỉ xuất hiện khi fixture nêu explicit policy missing, untrusted input accepted và protected sink; một expected rejection hoặc evidence thiếu là insufficient. Đây là quy tắc review nhỏ, không phải đánh giá bảo mật của ứng dụng thật.',
    workedExample: {
      code: '# Chi phan loai fixture da redacted.\nrecord = "missing-policy|accepted|protected-sink"\nprint("finding" if record.split("|") == ["missing-policy", "accepted", "protected-sink"] else "insufficient")',
      stdinLines: [],
    },
    predict: {
      code: 'status = "rejected"\nprint("finding" if status == "accepted" else "insufficient")',
      question: 'Record nói input đã bị rejected sẽ in phân loại nào?',
      choices: ['finding', 'insufficient', 'payload', 'scan'],
      answerIndex: 1,
      explain: 'Rejected không chứng minh input validation thất bại nên không đạt ngưỡng finding.',
    },
    parsons: {
      prompt: 'Xếp rule kiểm ba bằng chứng redacted cho validation.',
      lines: [
        'required = ["missing-policy", "accepted", "protected-sink"]',
        'if parts == required:',
        '    print("classification=finding")',
        'else:',
        '    print("classification=insufficient")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG input-validation triage. Đọc `policy|result|context`, với policy là `present-policy`/`missing-policy`, result là `accepted`/`rejected`, context là `protected-sink`/`unprotected-sink`. Record đúng `missing-policy|accepted|protected-sink` in `classification=finding`, `category=input-validation-evidence`, `next=manual-review-redacted`; các record hợp lệ khác in `classification=insufficient`, `next=collect-redacted-evidence`; input sai in `input-khong-hop-le`. Chỉ xử lý chuỗi fixture, không scan, payload hay exploit.',
      starterCode:
        'raw = input().strip()\n\n# Fixture MÔ PHỎNG đã redacted; không tạo input tấn công.',
      testCases: [
        {
          stdinLines: ['missing-policy|accepted|protected-sink'],
          expected:
            'classification=finding\ncategory=input-validation-evidence\nnext=manual-review-redacted',
          match: 'contains',
          hidden: false,
          label: 'ba bằng chứng validation đầy đủ',
        },
        {
          stdinLines: ['present-policy|accepted|protected-sink'],
          expected: 'classification=insufficient',
          match: 'contains',
          hidden: true,
          label: 'policy hiện diện cần review khác',
        },
        {
          stdinLines: ['missing-policy|rejected|protected-sink'],
          expected: 'classification=insufficient',
          match: 'contains',
          hidden: true,
          label: 'rejection không là finding',
        },
        {
          stdinLines: ['missing-policy|accepted|raw-sink'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'context lạ bị từ chối',
        },
      ],
      hints: [
        'Kiểm tra đúng ba token trước.',
        'Dùng các set nhỏ cho giá trị hợp lệ.',
        'Chỉ một tổ hợp chính xác được nâng thành finding.',
      ],
      sampleSolution: `try:
    parts = input().strip().split("|")
    valid = [{"present-policy", "missing-policy"}, {"accepted", "rejected"}, {"protected-sink", "unprotected-sink"}]
    if len(parts) != 3 or any(part not in allowed for part, allowed in zip(parts, valid)):
        raise ValueError
    if parts == ["missing-policy", "accepted", "protected-sink"]:
        print("classification=finding")
        print("category=input-validation-evidence")
        print("next=manual-review-redacted")
    else:
        print("classification=insufficient")
        print("next=collect-redacted-evidence")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Soạn một mẫu triage chỉ chứa category, evidence redacted, consent/scope và review owner. Nêu rõ tại sao mẫu không được chứa payload, URL, token hoặc hướng dẫn tái tạo trên hệ thống không được ủy quyền.',
    srsCards: [
      {
        hoi: 'Khi nào fixture validation được phân loại finding?',
        dap: 'Chỉ khi policy missing, input được accepted và context là protected sink; rule yêu cầu đủ ba bằng chứng để tránh kết luận vượt dữ liệu.',
      },
      {
        hoi: 'Tại sao fixture redacted không nên chứa payload hay endpoint?',
        dap: 'Mục tiêu là dạy cách đánh giá evidence phòng thủ; giữ fixture synthetic và redacted ngăn bài học trở thành hướng dẫn thao tác trên hệ thống thật.',
      },
    ],
  },
]
