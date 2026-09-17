// P6-U186 — security-s2-m1: authorized assessment scope, modeled safely.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U186_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u186-l1',
    unitId: 'p6-u186',
    language: 'python',
    title: 'MÔ PHỎNG cổng consent và phạm vi được ủy quyền',
    hook: 'Một yêu cầu có vẻ hợp lệ vẫn không được bắt đầu nếu thiếu sự đồng ý, sai đối tượng thử nghiệm hoặc cửa sổ thời gian đã hết.',
    theory:
      'Simulator này chỉ xét một ledger synthetic, không kết nối hay tác động lên bất kỳ hệ thống nào. Một yêu cầu chỉ được allow khi consent=yes, target nằm trong danh sách sandbox đã định, now không vượt expires, account bắt đầu bằng test-, mode là non-destructive và action là review hoặc inventory. Mọi trạng thái thiếu, hết hạn hoặc out-of-scope phải in refuse trước khi có bất kỳ dòng allow nào; fail closed là mặc định an toàn.',
    workedExample: {
      code: `# Ledger MÔ PHỎNG được tạo sẵn, không gọi hệ thống bên ngoài.\nconsent = "yes"\ntarget = "sandbox-api"\nnow, expires = 4, 9\naccount = "test-analyst"\nmode = "non-destructive"\nallowed = consent == "yes" and target == "sandbox-api"\nallowed = allowed and now <= expires and account.startswith("test-")\nallowed = allowed and mode == "non-destructive"\nprint("allow" if allowed else "refuse")`,
      stdinLines: [],
    },
    predict: {
      code: `consent = "yes"\nnow, expires = 12, 9\nprint("allow" if consent == "yes" and now <= expires else "refuse")`,
      question: 'Consent vẫn có nhưng cửa sổ thời gian đã hết. Cổng MÔ PHỎNG phải in gì?',
      choices: ['allow', 'refuse', 'expired-allow', 'retry'],
      answerIndex: 1,
      explain:
        'now lớn hơn expires nên quyền không còn hiệu lực. Cổng phải refuse trước khi làm bất cứ điều gì khác.',
    },
    parsons: {
      prompt: 'Xếp cổng fail-closed: kiểm authorization trước khi ghi kết quả allow.',
      lines: [
        'reason = ""',
        'if consent != "yes":',
        '    reason = "missing-consent"',
        'elif target not in allowed_targets:',
        '    reason = "out-of-scope"',
        'elif now > expires:',
        '    reason = "expired"',
        'print("refuse=" + reason if reason else "allow")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng assessment được ủy quyền, không thực hiện action ngoài sandbox. Đọc một dòng có bảy trường cách bởi `|`: `consent|target|now|expires|account|mode|action`. Target chỉ là `sandbox-api` hoặc `sandbox-web`; action chỉ là `review` hoặc `inventory`; account phải bắt đầu `test-`; mode phải đúng `non-destructive`; now/expires là số nguyên 0..999. Kiểm theo thứ tự: consent, target scope, time window, test account, mode, action. Lỗi định dạng in `refuse=invalid-ledger`. Thiếu consent in `refuse=missing-consent`; target/action ngoài scope in `refuse=out-of-scope`; now>expires in `refuse=expired`; account/mode không hợp lệ in `refuse=policy`. Chỉ khi mọi điều kiện đúng in `allow=<target>:<action>`. Refuse phải xuất hiện thay vì allow, tức không có action nào được mô phỏng sau khi bị từ chối.',
      starterCode: `raw = input().strip()\n\n# MÔ PHỎNG ledger authorization; chỉ phân loại, không có network, file hay subprocess.`,
      testCases: [
        {
          stdinLines: ['yes|sandbox-api|4|9|test-analyst|non-destructive|review'],
          expected: 'allow=sandbox-api:review',
          match: 'contains',
          hidden: false,
          label: 'ledger consent còn hạn trong sandbox được allow',
        },
        {
          stdinLines: ['no|sandbox-api|4|9|test-analyst|non-destructive|review'],
          expected: 'refuse=missing-consent',
          match: 'contains',
          hidden: true,
          label: 'không consent phải refuse trước action',
        },
        {
          stdinLines: ['yes|sandbox-web|10|9|test-analyst|non-destructive|inventory'],
          expected: 'refuse=expired',
          match: 'contains',
          hidden: true,
          label: 'ủy quyền hết hạn là fail closed',
        },
        {
          stdinLines: ['yes|other|4|9|test-analyst|non-destructive|review'],
          expected: 'refuse=out-of-scope',
          match: 'contains',
          hidden: true,
          label: 'target ngoài scope synthetic bị từ chối',
        },
        {
          stdinLines: ['yes|sandbox-api|4|9|staff|non-destructive|review'],
          expected: 'refuse=policy',
          match: 'contains',
          hidden: true,
          label: 'chỉ test account đã định mới hợp lệ',
        },
      ],
      hints: [
        'Tách đúng bảy trường trước khi ép now và expires thành số nguyên.',
        'Dùng chuỗi allowed_targets và allowed_actions cố định để scope không mở rộng theo input.',
        'Trả về ngay sau mỗi refuse để không thể in allow phía sau một trạng thái không hợp lệ.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    parts = raw.split("|")
    if len(parts) != 7:
        raise ValueError
    consent, target, raw_now, raw_expires, account, mode, action = parts
    now, expires = int(raw_now), int(raw_expires)
    if not 0 <= now <= 999 or not 0 <= expires <= 999:
        raise ValueError
    allowed_targets = {"sandbox-api", "sandbox-web"}
    allowed_actions = {"review", "inventory"}
    if consent != "yes":
        print("refuse=missing-consent")
    elif target not in allowed_targets or action not in allowed_actions:
        print("refuse=out-of-scope")
    elif now > expires:
        print("refuse=expired")
    elif not account.startswith("test-") or mode != "non-destructive":
        print("refuse=policy")
    else:
        print("allow=" + target + ":" + action)
except (EOFError, ValueError):
    print("refuse=invalid-ledger")`,
    },
    homework:
      'Soạn một artifact được phê duyệt cho môi trường của bạn: consent có người chịu trách nhiệm, danh sách test account, scope target đã che định danh, cửa sổ thời gian và mô tả non-destructive. Nhờ người có thẩm quyền duyệt; không dùng simulator này để đánh giá bất kỳ target thật nào.',
    srsCards: [
      {
        hoi: 'Các điều kiện tối thiểu nào phải qua trước khi assessment MÔ PHỎNG được allow?',
        dap: 'Cần consent rõ ràng, target và action trong scope, time window còn hiệu lực, test account đã định danh và chế độ non-destructive; thiếu một điều kiện thì fail closed.',
      },
      {
        hoi: 'Vì sao cổng authorization phải refuse trước action?',
        dap: 'Refuse trước action ngăn một input thiếu hoặc hết hạn chuyển thành thao tác bên ngoài phạm vi, đồng thời tạo kết quả kiểm toán xác định và an toàn.',
      },
    ],
  },
  {
    id: 'p6-u186-l2',
    unitId: 'p6-u186',
    language: 'python',
    title: 'MÔ PHỎNG ledger phạm vi có test account và time window',
    hook: 'Một lời đồng ý chung chung chưa đủ để kiểm toán: ledger cần ràng buộc chính xác target, tài khoản thử nghiệm, thời hạn và chế độ không phá huỷ.',
    theory:
      'Ledger nhỏ trong bài này ghép một ticket synthetic với policy cố định. Nó chỉ phát hành audit record khi consent=yes, ticket bắt đầu ADR-, target nằm trong scope, account đúng test-green hoặc test-blue, time window còn hiệu lực, mode non-destructive và action observe hoặc verify. Không có thao tác target thật: audit record chỉ là một chuỗi deterministic. Nếu thiếu một ràng buộc, simulator refuse và không in audit record.',
    workedExample: {
      code: `# MÔ PHỎNG record chỉ xuất hiện sau khi toàn bộ policy đúng.\nticket = "ADR-7"\ntarget = "sandbox-web"\naccount = "test-blue"\nnow, expires = 3, 3\nvalid = ticket.startswith("ADR-") and target == "sandbox-web"\nvalid = valid and account == "test-blue" and now <= expires\nprint("audit=" + ticket if valid else "refuse")`,
      stdinLines: [],
    },
    predict: {
      code: `account = "test-green"\nallowed = account in {"test-green", "test-blue"}\nprint("audit" if allowed else "refuse")`,
      question: 'Tài khoản `test-green` có trong ledger test account. Dòng mô phỏng in gì?',
      choices: ['audit', 'refuse', 'delete', 'unknown'],
      answerIndex: 0,
      explain:
        'Membership trong danh sách test account chỉ cho phép tạo audit record synthetic; nó không cấp quyền cho account khác.',
    },
    parsons: {
      prompt: 'Xếp các bước để ledger chỉ ghi audit record sau các kiểm tra scope.',
      lines: [
        'if consent != "yes":',
        '    print("refuse=missing-consent")',
        'elif now > expires or target not in targets:',
        '    print("refuse=scope-or-time")',
        'elif account not in test_accounts or mode != "non-destructive":',
        '    print("refuse=policy")',
        'else:',
        '    print("audit=" + ticket + ":" + target + ":" + action)',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG audit ledger, không gọi network/filesystem/subprocess và không làm thay đổi target. Đọc `consent|ticket|target|account|now|expires|mode|action`. Ticket phải bắt đầu `ADR-` và có 4..12 ký tự; target là `sandbox-api` hoặc `sandbox-web`; account là `test-green` hoặc `test-blue`; action là `observe` hoặc `verify`; now/expires là 0..999. Kiểm theo thứ tự consent, ticket/target/action scope, time window, test account/mode. Lỗi cú pháp in `refuse=invalid-ledger`; consent thiếu in `refuse=missing-consent`; ticket/target/action sai in `refuse=out-of-scope`; now>expires in `refuse=expired`; account hoặc mode sai in `refuse=policy`. Nếu hợp lệ, in đúng `audit=<ticket>:<target>:<account>:<action>:non-destructive`. Không in audit sau refuse.',
      starterCode: `raw = input().strip()\n\n# MÔ PHỎNG audit ledger bounded; output là record synthetic, không phải hành động trên target.`,
      testCases: [
        {
          stdinLines: ['yes|ADR-7|sandbox-web|test-blue|3|3|non-destructive|verify'],
          expected: 'audit=ADR-7:sandbox-web:test-blue:verify:non-destructive',
          match: 'contains',
          hidden: false,
          label: 'ledger đầy đủ tạo audit record synthetic',
        },
        {
          stdinLines: ['|ADR-7|sandbox-web|test-blue|3|3|non-destructive|verify'],
          expected: 'refuse=missing-consent',
          match: 'contains',
          hidden: true,
          label: 'consent trống không được tiếp tục',
        },
        {
          stdinLines: ['yes|ADR-7|sandbox-api|test-green|8|4|non-destructive|observe'],
          expected: 'refuse=expired',
          match: 'contains',
          hidden: true,
          label: 'time window hết hạn bị chặn',
        },
        {
          stdinLines: ['yes|ADR-7|sandbox-api|test-green|2|4|safe|observe'],
          expected: 'refuse=policy',
          match: 'contains',
          hidden: true,
          label: 'mode không đúng non-destructive bị từ chối',
        },
        {
          stdinLines: ['yes|ADR-7|sandbox-api|test-green|2|4|non-destructive|change'],
          expected: 'refuse=out-of-scope',
          match: 'contains',
          hidden: true,
          label: 'action ngoài ledger scope không được ghi audit',
        },
      ],
      hints: [
        'Kiểm tra số trường và khoảng số trước khi so sánh thời gian.',
        'Giữ sets scope/test accounts cố định trong code để mọi kết quả deterministic.',
        'Nhánh else duy nhất mới được dựng chuỗi audit; các nhánh refuse không nối thêm record.',
      ],
      sampleSolution: `try:
    parts = input().strip().split("|")
    if len(parts) != 8:
        raise ValueError
    consent, ticket, target, account, raw_now, raw_expires, mode, action = parts
    now, expires = int(raw_now), int(raw_expires)
    if not 0 <= now <= 999 or not 0 <= expires <= 999:
        raise ValueError
    targets = {"sandbox-api", "sandbox-web"}
    actions = {"observe", "verify"}
    test_accounts = {"test-green", "test-blue"}
    if consent != "yes":
        print("refuse=missing-consent")
    elif not (ticket.startswith("ADR-") and 4 <= len(ticket) <= 12) or target not in targets or action not in actions:
        print("refuse=out-of-scope")
    elif now > expires:
        print("refuse=expired")
    elif account not in test_accounts or mode != "non-destructive":
        print("refuse=policy")
    else:
        print("audit=" + ticket + ":" + target + ":" + account + ":" + action + ":non-destructive")
except (EOFError, ValueError):
    print("refuse=invalid-ledger")`,
    },
    homework:
      'Vẽ template ledger cho review nội bộ gồm owner của consent, target đã được pseudonymize, danh sách test account, thời hạn, mode và ticket ADR. Đánh dấu rõ điều kiện rollback và người dừng việc khi scope đổi; chỉ dùng template sau phê duyệt phù hợp.',
    srsCards: [
      {
        hoi: 'Audit record synthetic được phép tạo ở nhánh nào của ledger?',
        dap: 'Chỉ ở nhánh cuối khi consent, ticket và target/action scope, time window, test account cùng mode non-destructive đều hợp lệ; mọi nhánh còn lại phải refuse.',
      },
      {
        hoi: 'Vai trò của test account trong assessment scope là gì?',
        dap: 'Test account khoanh vùng định danh được phép dùng trong mô phỏng và làm ledger kiểm toán được; nó không phải quyền dùng một tài khoản production hay mở rộng scope.',
      },
    ],
  },
]
