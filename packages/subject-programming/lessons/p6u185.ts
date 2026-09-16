// P6-U185 — security-s1-m4: identity/session lifecycle (defensive simulation only).
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U185_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u185-l1',
    unitId: 'p6-u185',
    language: 'python',
    title: 'MÔ PHỎNG vòng đời session: rotation, expiry và revoked',
    hook: 'Một phiên từng hợp lệ lúc đăng nhập không mặc nhiên còn hợp lệ sau khi đổi mật khẩu, đăng xuất, hay qua thời hạn đã định.',
    theory:
      'Đây là MÔ PHỎNG policy, không tạo token hay xác thực thật. Khi login thành công, server phải rotation: session-id cũ bị revoked và chỉ định danh fixture mới được dùng. Mỗi request phải kiểm theo thứ tự fail closed: fixture đủ trường, session đang active, chưa revoked, chưa expired, rồi mới xét authorization đối với resource. Authentication (authn: biết ai) không thay thế authorization (authz: người đó được làm gì); một identity hợp lệ vẫn bị deny khi không sở hữu resource. Không in hay truyền bất kỳ token, secret hoặc credential thật nào.',
    workedExample: {
      code: `# MO PHONG: session cu da revoked nen khong duoc chap nhan.\nstate = "revoked"\nnow, expires_at = 5, 9\nif state != "active":\n    print("deny:revoked")\nelif now >= expires_at:\n    print("deny:expired")\nelse:\n    print("allow")`,
      stdinLines: [],
    },
    predict: {
      code: `state = "active"\nnow, expires_at = 12, 12\nprint("deny:expired" if now >= expires_at else "allow")`,
      question: 'Với expires_at bằng đúng thời điểm hiện tại, policy fail closed sẽ in gì?',
      choices: ['allow', 'deny:expired', 'rotate', 'unknown-risk'],
      answerIndex: 1,
      explain:
        'Expiry là cận trên loại trừ: khi now >= expires_at, session đã hết hạn và phải bị deny.',
    },
    parsons: {
      prompt: 'Xếp các guard theo thứ tự fail closed trước khi xét quyền trên resource.',
      lines: [
        'if state == "revoked":',
        '    decision = "deny:revoked"',
        'elif state != "active":',
        '    decision = "deny:unknown-session"',
        'elif now >= expires_at:',
        '    decision = "deny:expired"',
        'elif actor != owner:',
        '    decision = "deny:authz"',
        'else:',
        '    decision = "allow"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG policy session, không phải login/token thật. Đọc một dòng `actor,state,issued,expires,now,owner` gồm actor/owner chữ thường 1..12 ký tự `[a-z]`; state là `active`, `revoked` hoặc `rotated`; issued/expires/now là số nguyên 0..999 và phải issued < expires. Chỉ `active` và now < expires mới qua authn. In đúng một classification: `deny:revoked` cho revoked/rotated (minh hoạ session cũ sau rotation và reuse/fixation bị từ chối), `deny:expired` khi hết hạn, `deny:authz` khi actor khác owner, `allow` khi mọi guard đạt. State lạ, cấu trúc sai hay số ngoài miền in `deny:unknown-session`. Không in input, token, secret hay chi tiết credential.',
      starterCode: `# MÔ PHỎNG defensive session policy; khong tao hoac in token that.\nraw = input().strip()`,
      testCases: [
        {
          stdinLines: ['lan,active,1,10,5,lan'],
          expected: 'allow',
          match: 'contains',
          hidden: false,
          label: 'session active và owner khớp được cho phép trong mô phỏng',
        },
        {
          stdinLines: ['lan,rotated,1,10,5,lan'],
          expected: 'deny:revoked',
          match: 'contains',
          hidden: true,
          label: 'reuse session cũ sau login rotation bị từ chối',
        },
        {
          stdinLines: ['lan,active,1,10,10,lan'],
          expected: 'deny:expired',
          match: 'contains',
          hidden: true,
          label: 'session hết hạn không được gia hạn ngầm',
        },
        {
          stdinLines: ['lan,active,1,10,5,minh'],
          expected: 'deny:authz',
          match: 'contains',
          hidden: true,
          label: 'authn thành công không thay thế authz owner check',
        },
        {
          stdinLines: ['lan,unknown,1,10,5,lan'],
          expected: 'deny:unknown-session',
          match: 'contains',
          hidden: true,
          label: 'state lạ fail closed thay vì suy đoán an toàn',
        },
      ],
      hints: [
        'Tách sáu trường và kiểm đúng miền dữ liệu trước khi ra quyết định.',
        'Kiểm revoked/rotated trước expiry để không tái dùng session cũ sau rotation.',
        'Chỉ so actor với owner sau khi authn active và chưa expired; đó là authz độc lập.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    parts = raw.split(",")
    if len(parts) != 6:
        raise ValueError
    actor, state, issued_raw, expires_raw, now_raw, owner = parts
    if (
        not actor.isalpha()
        or not owner.isalpha()
        or not actor.isascii()
        or not owner.isascii()
        or not actor.islower()
        or not owner.islower()
        or not 1 <= len(actor) <= 12
        or not 1 <= len(owner) <= 12
    ):
        raise ValueError
    issued, expires_at, now = map(int, (issued_raw, expires_raw, now_raw))
    if not 0 <= issued < expires_at <= 999 or not 0 <= now <= 999:
        raise ValueError
    if state in ("revoked", "rotated"):
        print("deny:revoked")
    elif state != "active":
        print("deny:unknown-session")
    elif now >= expires_at:
        print("deny:expired")
    elif actor != owner:
        print("deny:authz")
    else:
        print("allow")
except (EOFError, ValueError):
    print("deny:unknown-session")`,
    },
    homework:
      'Vẽ state machine cho login rotation, logout/revocation và expiry của một session giả lập. Ghi rõ server phải lưu audit event nào, thời hạn retention nào phù hợp policy, và vì sao artifact này không được chứa session-id hay dữ liệu người dùng thật.',
    srsCards: [
      {
        hoi: 'Vì sao session cũ phải bị deny ngay sau login rotation?',
        dap: 'Rotation vô hiệu session cũ để ngăn fixation hoặc reuse; request dùng định danh cũ phải bị phân loại revoked thay vì được chuyển sang session mới.',
      },
      {
        hoi: 'Tại sao authentication thành công vẫn chưa đủ để allow một request?',
        dap: 'Authentication chỉ xác định identity; authorization còn phải kiểm policy như ownership hay quyền trên resource, nên identity hợp lệ vẫn có thể bị deny authz.',
      },
    ],
  },
  {
    id: 'p6-u185-l2',
    unitId: 'p6-u185',
    language: 'python',
    title: 'MÔ PHỎNG recovery rate limit và deny theo policy',
    hook: 'Khôi phục tài khoản cần giúp người dùng thật, nhưng nếu cho thử không giới hạn thì chính luồng recovery trở thành điểm rủi ro.',
    theory:
      'Recovery an toàn cần giới hạn attempt trong cửa sổ thời gian và trả kết quả tối thiểu, không tiết lộ account có tồn tại hay không. MÔ PHỎNG này nhận fixture đã redacted, đếm số attempt đã ghi cho một principal giả định và fail closed khi thiếu dữ liệu, expired, revoked hoặc vượt rate limit. Nó không gửi email/SMS, không tạo link, không lưu secret và không thay thế hệ thống identity production. Sau authn/recovery, quyền trên resource vẫn phải qua authz riêng; recovery không là giấy phép truy cập mọi resource.',
    workedExample: {
      code: `# MO PHONG rate limit: dat nguong truoc khi cap recovery.\nattempts, limit = 3, 3\nif attempts >= limit:\n    print("deny:rate-limited")\nelse:\n    print("allow:recovery-review")`,
      stdinLines: [],
    },
    predict: {
      code: `attempts, limit = 2, 3\nprint("deny:rate-limited" if attempts >= limit else "allow:recovery-review")`,
      question:
        'Hai attempt đã ghi với limit ba sẽ được phân loại thế nào trước khi tạo bước recovery?',
      choices: ['deny:rate-limited', 'allow:recovery-review', 'allow:admin', 'rotate'],
      answerIndex: 1,
      explain:
        'Limit bị chặn tại attempts >= limit; 2 nhỏ hơn 3 nên fixture còn một lượt trong policy mô phỏng.',
    },
    parsons: {
      prompt: 'Xếp guard recovery để trạng thái không chắc chắn luôn bị deny trước rate limit.',
      lines: [
        'if state == "revoked":',
        '    decision = "deny:revoked"',
        'elif now >= expires_at:',
        '    decision = "deny:expired"',
        'elif attempts >= limit:',
        '    decision = "deny:rate-limited"',
        'elif actor != owner:',
        '    decision = "deny:authz"',
        'else:',
        '    decision = "allow:recovery-review"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG recovery policy trên fixture bounded, không gửi recovery link hay thao tác account thật. Đọc `actor,state,attempts,limit,now,expires,owner`: actor/owner `[a-z]` dài 1..12; state `active` hoặc `revoked`; attempts 0..9; limit 1..5; now/expires 0..999 và expires > 0. In duy nhất: `deny:revoked`, `deny:expired` khi now >= expires, `deny:rate-limited` khi attempts >= limit, `deny:authz` khi actor khác owner, hoặc `allow:recovery-review` khi qua guard. Input thiếu/state lạ/số sai in `deny:unknown-recovery`. Không phân biệt account có tồn tại, không in fixture, password, token hay secret.',
      starterCode: `# MÔ PHỎNG rate limit recovery; output chi la policy classification.\nraw = input().strip()`,
      testCases: [
        {
          stdinLines: ['lan,active,2,3,4,9,lan'],
          expected: 'allow:recovery-review',
          match: 'contains',
          hidden: false,
          label: 'attempt dưới limit được chuyển sang bước review an toàn',
        },
        {
          stdinLines: ['lan,active,3,3,4,9,lan'],
          expected: 'deny:rate-limited',
          match: 'contains',
          hidden: true,
          label: 'đạt ngưỡng recovery bị chặn xác định',
        },
        {
          stdinLines: ['lan,revoked,0,3,4,9,lan'],
          expected: 'deny:revoked',
          match: 'contains',
          hidden: true,
          label: 'identity revoked không thể dùng recovery fixture cũ',
        },
        {
          stdinLines: ['lan,active,0,3,9,9,lan'],
          expected: 'deny:expired',
          match: 'contains',
          hidden: true,
          label: 'recovery window hết hạn phải deny',
        },
        {
          stdinLines: ['lan,active,0,3,4,9,minh'],
          expected: 'deny:authz',
          match: 'contains',
          hidden: true,
          label: 'recovery authn không thay cho owner authorization',
        },
        {
          stdinLines: ['lan,active,0,0,4,9,lan'],
          expected: 'deny:unknown-recovery',
          match: 'contains',
          hidden: true,
          label: 'limit ngoài miền bị fail closed',
        },
      ],
      hints: [
        'Đừng dùng request thật: chỉ parse fixture và in một classification cố định.',
        'Kiểm revoked và expired trước rate limit để không xử lý trạng thái đã vô hiệu.',
        'So actor với owner là authz; không suy ra quyền chỉ từ việc actor có state active.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    parts = raw.split(",")
    if len(parts) != 7:
        raise ValueError
    actor, state, attempts_raw, limit_raw, now_raw, expires_raw, owner = parts
    if (
        not actor.isalpha()
        or not owner.isalpha()
        or not actor.isascii()
        or not owner.isascii()
        or not actor.islower()
        or not owner.islower()
        or not 1 <= len(actor) <= 12
        or not 1 <= len(owner) <= 12
        or state not in ("active", "revoked")
    ):
        raise ValueError
    attempts, limit, now, expires_at = map(int, (attempts_raw, limit_raw, now_raw, expires_raw))
    if not 0 <= attempts <= 9 or not 1 <= limit <= 5 or not 0 <= now <= 999 or not 0 < expires_at <= 999:
        raise ValueError
    if state == "revoked":
        print("deny:revoked")
    elif now >= expires_at:
        print("deny:expired")
    elif attempts >= limit:
        print("deny:rate-limited")
    elif actor != owner:
        print("deny:authz")
    else:
        print("allow:recovery-review")
except (EOFError, ValueError):
    print("deny:unknown-recovery")`,
    },
    homework:
      'Viết một ADR ngắn cho recovery flow: limit/window, thông báo trung tính chống account enumeration, owner authorization sau recovery và kênh escalation. Nêu metric aggregate nào có thể theo dõi mà không log token, password, email hay nội dung recovery.',
    srsCards: [
      {
        hoi: 'Vì sao recovery rate limit phải chặn khi attempts đạt ngưỡng thay vì sau ngưỡng?',
        dap: 'Điều kiện attempts >= limit làm ranh giới tất định và ngăn một lượt vượt ngưỡng; policy này giảm rủi ro abuse mà không tiết lộ dữ liệu account.',
      },
      {
        hoi: 'Sau khi recovery policy cho qua, kiểm soát nào vẫn phải thực hiện cho resource?',
        dap: 'Authorization độc lập như ownership hoặc quyền theo vai trò vẫn phải được kiểm, vì recovery/authentication không tự cấp quyền truy cập resource của người khác.',
      },
    ],
  },
]
