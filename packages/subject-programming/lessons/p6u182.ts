// P6-U182 — security-s1: threat model and least-privilege policy, all bounded simulations.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U182_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u182-l1',
    unitId: 'p6-u182',
    language: 'python',
    title: 'MÔ PHỎNG trust boundary — thiếu bằng chứng là unknown-risk',
    hook: 'Một sơ đồ dữ liệu đẹp vẫn nguy hiểm nếu không ai chịu trách nhiệm cho asset hoặc ranh giới tin cậy.',
    theory:
      'Threat model bắt đầu bằng asset, data flow, owner và trust boundary. Trong mô phỏng này một record chỉ được xem là đã review khi cả owner lẫn boundary nằm trong allow-list. Field thiếu, lạ hoặc malformed phải thành `unknown-risk`, không được suy diễn là safe. Đây chỉ là classification fixture hữu hạn, không phải đánh giá an ninh của hệ thống thật.',
    workedExample: {
      code: `# Fixture chỉ chứa nhãn đã redacted, không có dữ liệu hay secret thật.\ndef danh_gia(owner, boundary):\n    if owner not in {"app", "security"} or boundary not in {"internal", "partner"}:\n        return "unknown-risk"\n    return "reviewed"\n\nprint(danh_gia("app", "internal"))`,
      stdinLines: [],
    },
    predict: {
      code: `def gate(owner, boundary):\n    if not owner or not boundary:\n        return "unknown-risk"\n    return "reviewed"\n\nprint(gate("", "internal"))`,
      question: 'Fixture thiếu owner sẽ in classification nào?',
      choices: ['safe', 'reviewed', 'unknown-risk', 'retry'],
      answerIndex: 2,
      explain:
        'Không có owner nghĩa là không xác định được ai chịu trách nhiệm; fail closed thành unknown-risk.',
    },
    parsons: {
      prompt: 'Xếp gate để thiếu owner hoặc trust boundary luôn fail closed.',
      lines: [
        'def danh_gia(owner, boundary):',
        '    if not owner or not boundary:',
        '        return "unknown-risk"',
        '    return "reviewed"',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng fixture `asset|owner|boundary`, với asset là `profile`, `invoice` hoặc `audit`; owner là `app` hoặc `security`; boundary là `internal` hoặc `partner`. Không có đúng ba phần, field rỗng hoặc giá trị ngoài allow-list in `unknown-risk`. Fixture hợp lệ in `reviewed=<asset>:<owner>:<boundary>`. Đây là MÔ PHỎNG bounded, không đọc file, mạng hay secret.',
      starterCode: `raw = input().strip()\n# Parse fixture hữu hạn; không suy đoán khi thiếu owner hoặc boundary.`,
      testCases: [
        {
          stdinLines: ['profile|app|internal'],
          expected: 'reviewed=profile:app:internal',
          match: 'contains',
          hidden: false,
          label: 'asset có owner và boundary hợp lệ',
        },
        {
          stdinLines: ['invoice||partner'],
          expected: 'unknown-risk',
          match: 'contains',
          hidden: true,
          label: 'thiếu owner',
        },
        {
          stdinLines: ['audit|security|external'],
          expected: 'unknown-risk',
          match: 'contains',
          hidden: true,
          label: 'boundary lạ không thành safe',
        },
        {
          stdinLines: ['profile|app'],
          expected: 'unknown-risk',
          match: 'contains',
          hidden: true,
          label: 'fixture malformed',
        },
      ],
      hints: [
        'Dùng `split("|")` và kiểm tra đúng ba phần trước khi unpack.',
        'Tạo set allow-list cho asset, owner và boundary.',
        'Bất kỳ điều kiện sai nào cũng chỉ in unknown-risk rồi kết thúc.',
      ],
      sampleSolution: `raw = input().strip()\nparts = raw.split("|")\nassets = {"profile", "invoice", "audit"}\nowners = {"app", "security"}\nboundaries = {"internal", "partner"}\nif len(parts) != 3:\n    print("unknown-risk")\nelse:\n    asset, owner, boundary = (part.strip() for part in parts)\n    if asset not in assets or owner not in owners or boundary not in boundaries:\n        print("unknown-risk")\n    else:\n        print(f"reviewed={asset}:{owner}:{boundary}")`,
    },
    homework:
      'Vẽ một data-flow nhỏ cho chức năng đổi địa chỉ: ghi asset, owner, trust boundary và câu hỏi còn chưa biết. Không kết luận safe khi chưa có bằng chứng.',
    srsCards: [
      {
        hoi: 'Vì sao fixture thiếu owner hoặc trust boundary phải là unknown-risk?',
        dap: 'Thiếu owner hoặc boundary làm mất bằng chứng về trách nhiệm và nơi kiểm soát dữ liệu, nên policy phải fail closed thay vì coi đó là an toàn.',
      },
      {
        hoi: 'Threat model tối thiểu cần mô tả những gì?',
        dap: 'Nó cần nêu asset, luồng dữ liệu, chủ sở hữu, trust boundary và các giả định còn chưa được xác minh để nhóm review đúng phạm vi.',
      },
    ],
  },
  {
    id: 'p6-u182-l2',
    unitId: 'p6-u182',
    language: 'python',
    title: 'MÔ PHỎNG least privilege — actor, resource, action ngoài policy thì deny',
    hook: 'Authentication trả lời bạn là ai; authorization còn phải trả lời bạn được làm gì trên tài nguyên nào.',
    theory:
      'Least privilege cấp đúng action tối thiểu cho actor trên resource xác định. Mô phỏng dùng bảng policy cố định và chỉ chấp nhận request ba phần đã biết. Actor, resource, action lạ hoặc một tổ hợp không nằm trong bảng đều trả `deny`; không có wildcard, fallback hay suy đoán quyền. Điều này dạy contract authorization, không thay thế IAM production.',
    workedExample: {
      code: `# Key là actor-resource-action đã được cấp tối thiểu.\nallowed = {("analyst", "report", "read")}\ndef auth(actor, resource, action):\n    return "allow" if (actor, resource, action) in allowed else "deny"\n\nprint(auth("analyst", "report", "read"))`,
      stdinLines: [],
    },
    predict: {
      code: `allowed = {("analyst", "report", "read")}\nprint("allow" if ("analyst", "report", "write") in allowed else "deny")`,
      question: 'Action write không được cấp sẽ in gì?',
      choices: ['allow', 'deny', 'unknown-risk', 'write'],
      answerIndex: 1,
      explain: 'Policy chỉ cấp read; action khác phải bị deny dù actor đã xác thực.',
    },
    parsons: {
      prompt: 'Xếp authorization gate không có default allow.',
      lines: [
        'def authorize(request, allowed):',
        '    if request in allowed:',
        '        return "allow"',
        '    return "deny"',
      ],
    },
    make: {
      prompt:
        'Đọc `actor|resource|action`. Policy cố định gồm `analyst|report|read`, `editor|draft|write`, `service|audit|append`. Nếu đúng một policy in `allow`; mọi input malformed, unknown hoặc ngoài policy in `deny`. Không in dữ liệu tài nguyên và không dùng I/O ngoài input/output.',
      starterCode: `raw = input().strip()\n# Đặt policy bằng tuple; default phải là deny.`,
      testCases: [
        {
          stdinLines: ['analyst|report|read'],
          expected: 'allow',
          match: 'contains',
          hidden: false,
          label: 'quyền đọc được cấp',
        },
        {
          stdinLines: ['analyst|report|write'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'actor không được nâng quyền',
        },
        {
          stdinLines: ['guest|report|read'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'actor lạ',
        },
        {
          stdinLines: ['service|audit'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'request thiếu action',
        },
      ],
      hints: [
        'Chỉ unpack sau khi kiểm tra đủ ba phần.',
        'Lưu allowed là set các tuple ba phần.',
        'Dùng nhánh else deny cho cả tổ hợp lạ và malformed.',
      ],
      sampleSolution: `raw = input().strip()\nallowed = {\n    ("analyst", "report", "read"),\n    ("editor", "draft", "write"),\n    ("service", "audit", "append"),\n}\nparts = [part.strip() for part in raw.split("|")]\nif len(parts) == 3 and tuple(parts) in allowed:\n    print("allow")\nelse:\n    print("deny")`,
    },
    homework:
      'Lập bảng actor-resource-action cho một tính năng xuất báo cáo. Chỉ ghi quyền cần thiết và nêu một ca đã đăng nhập nhưng vẫn phải deny.',
    srsCards: [
      {
        hoi: 'Least privilege yêu cầu điều gì khi kiểm tra authorization?',
        dap: 'Chỉ cho phép tổ hợp actor, resource và action được cấp rõ ràng; mọi tổ hợp ngoài policy, kể cả actor đã đăng nhập, đều phải bị deny.',
      },
      {
        hoi: 'Vì sao authentication không đủ để cho phép một request?',
        dap: 'Authentication chỉ xác minh danh tính, còn authorization phải kiểm policy với tài nguyên và hành động cụ thể để ngăn quyền bị dùng vượt phạm vi.',
      },
    ],
  },
]
