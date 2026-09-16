// P6-U184 — security-s1: chính sách API phòng thủ, chỉ dùng fixture MÔ PHỎNG đã redacted.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U184_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u184-l1',
    unitId: 'p6-u184',
    language: 'python',
    title: 'Kiểm query và encode theo allowlist',
    hook: 'Một API không nên tin rằng tham số nhìn có vẻ hợp lệ ở trình duyệt thì cũng an toàn ở máy chủ.',
    theory:
      'Đây là MÔ PHỎNG policy, không phải bộ lọc bảo mật hoàn chỉnh. Máy chủ đọc fixture query đã redacted, chỉ nhận một tập field và sort direction đã định nghĩa, rồi encode lại giá trị bằng hàm chuẩn. Bất kỳ khóa lạ, ký tự không thuộc contract, dữ liệu quá dài hoặc trạng thái không hiểu đều fail closed thành `deny`; không phản chiếu dữ liệu nhập lại cho người gọi.',
    workedExample: {
      code: `# Fixture query đã redacted, không có request thật.\nquery = {"page": "2", "sort": "name", "direction": "asc"}\n# Allowlist là hợp đồng phía server.\nallowed = {"page", "sort", "direction"}\n# Từ chối nếu có key ngoài hợp đồng.\nif set(query) - allowed:\n    print("deny")\n# Chỉ encode một URL nội bộ sau khi kiểm policy.\nelif query["sort"] in {"name", "created"} and query["direction"] in {"asc", "desc"}:\n    print("allow:page=" + query["page"] + "&sort=" + query["sort"])\nelse:\n    print("deny")`,
      stdinLines: [],
    },
    predict: {
      code: `# Key lạ không thuộc allowlist.\nquery = {"page": "1", "unknown": "redacted"}\nallowed = {"page", "sort", "direction"}\nprint("deny" if set(query) - allowed else "allow")`,
      question: 'Policy MÔ PHỎNG này in gì khi fixture có khóa lạ?',
      choices: ['allow', 'deny', 'unknown-risk', 'Nó bỏ qua key lạ và in page'],
      answerIndex: 1,
      explain:
        'Fail closed: server-side policy không chấp nhận khóa không có trong hợp đồng, kể cả khi giá trị đã được redacted.',
    },
    parsons: {
      prompt: 'Xếp policy để kiểm allowlist trước khi tạo query nội bộ.',
      lines: [
        'allowed = {"page", "sort", "direction"}',
        'if set(query) - allowed:',
        '    print("deny")',
        'elif query["sort"] in {"name", "created"}:',
        '    print("allow")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một API đọc đúng một dòng fixture `page|sort|direction`. `page` là số 1..50; `sort` chỉ `name` hoặc `created`; `direction` chỉ `asc` hoặc `desc`. Chỉ khi cả ba phần đều hợp lệ, in `allow:page=<n>&sort=<sort>&direction=<direction>` (đây là biểu diễn đã encode theo contract, không dùng input ngoài policy). Mọi dòng thiếu/thừa phần, chứa khoảng trắng, dài quá 40 ký tự, hoặc state không biết phải in đúng `deny`. Không gọi network, file hay subprocess; không in lại raw input.',
      starterCode: `line = input()\n\n# MÔ PHỎNG: validate allowlist và policy phía server trước khi tạo output.`,
      testCases: [
        {
          stdinLines: ['2|name|asc'],
          expected: 'allow:page=2&sort=name&direction=asc',
          match: 'contains',
          hidden: false,
          label: 'fixture hợp đồng hợp lệ',
        },
        {
          stdinLines: ['50|created|desc'],
          expected: 'allow:page=50&sort=created&direction=desc',
          match: 'contains',
          hidden: true,
          label: 'giá trị biên hợp lệ',
        },
        {
          stdinLines: ['1|name|sideways'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'direction lạ fail closed',
        },
        {
          stdinLines: ['1|unknown|asc'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'field policy không cho phép',
        },
        {
          stdinLines: ['1|name|asc|extra'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'tham số thừa bị từ chối',
        },
        {
          stdinLines: [' 2|name|asc'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'khoảng trắng đầu dòng không được âm thầm bỏ qua',
        },
      ],
      hints: [
        'Tách đúng ba phần bằng `split("|")`; nếu số phần khác ba thì deny.',
        'Dùng allowlist dạng set cho `sort` và `direction`, không cố sửa hay đoán giá trị lạ.',
        'Chỉ format output sau khi mọi kiểm tra server-side đã qua.',
      ],
      sampleSolution: `line = input()\n\nif not line or len(line) > 40 or any(char.isspace() for char in line):\n    print("deny")\n    raise SystemExit\n\nparts = line.split("|")\nif len(parts) != 3:\n    print("deny")\n    raise SystemExit\n\npage_text, sort, direction = parts\ntry:\n    page = int(page_text)\nexcept ValueError:\n    print("deny")\n    raise SystemExit\n\nif not 1 <= page <= 50:\n    print("deny")\nelif sort not in {"name", "created"}:\n    print("deny")\nelif direction not in {"asc", "desc"}:\n    print("deny")\nelse:\n    print(f"allow:page={page}&sort={sort}&direction={direction}")`,
    },
    homework:
      'Lập bảng review cho một endpoint giả lập: từng parameter, kiểu, miền cho phép, giới hạn độ dài và quyết định deny. Ghi rõ việc encoding thuộc adapter phía server, không tin dữ liệu phía client.',
    srsCards: [
      {
        hoi: 'Vì sao allowlist parameter an toàn hơn cố gắng vá từng giá trị xấu?',
        dap: 'Allowlist mô tả chính xác input mà endpoint hỗ trợ; mọi key hoặc giá trị ngoài hợp đồng bị deny nên trạng thái mới không vô tình được chấp nhận.',
      },
      {
        hoi: 'Khi nào server được tạo output query hoặc URL nội bộ?',
        dap: 'Chỉ sau khi toàn bộ cấu trúc, kiểu, giới hạn và tập giá trị của fixture đã được kiểm tra phía server; raw input không được phản chiếu.',
      },
    ],
  },
  {
    id: 'p6-u184-l2',
    unitId: 'p6-u184',
    language: 'python',
    title: 'Ủy quyền object phía server — foreign ID phải deny',
    hook: 'Biết một object ID không tạo ra quyền sử dụng object đó; quyền phải được kiểm ở máy chủ cho từng hành động.',
    theory:
      'MÔ PHỎNG này dùng fixture owner map đã redacted. Server-side authorization so actor với owner của object, action với policy, và deny khi object không tồn tại, owner không khớp, action lạ hay fixture malformed. Client chỉ gửi gợi ý ID; client-side UI, authentication hay ID tuần tự không phải bằng chứng authorization. Output chỉ là classification, không trả metadata object hoặc lý do quá chi tiết.',
    workedExample: {
      code: `# Owner map MÔ PHỎNG, không có dữ liệu người dùng thật.\nowners = {"doc-a": "team-a", "doc-b": "team-b"}\n# Actor team-a xin xem object thuộc team-b.\nactor, object_id, action = "team-a", "doc-b", "read"\n# Máy chủ kiểm object, action và owner cùng lúc.\nif action != "read" or object_id not in owners or owners[object_id] != actor:\n    print("deny")\nelse:\n    print("allow")`,
      stdinLines: [],
    },
    predict: {
      code: `# Foreign object ID trong fixture đã redacted.\nowners = {"report-a": "org-a", "report-b": "org-b"}\nactor = "org-a"\nobject_id = "report-b"\nprint("allow" if owners.get(object_id) == actor else "deny")`,
      question: 'Server-side authorization in gì cho foreign object ID?',
      choices: ['allow', 'deny', 'unknown-risk', 'report-b'],
      answerIndex: 1,
      explain:
        'Object thuộc owner khác phải bị deny; policy cũng không phản hồi identifier hay metadata object cho bên không được ủy quyền.',
    },
    parsons: {
      prompt: 'Xếp điều kiện fail-closed cho một request đọc object.',
      lines: [
        'if action != "read":',
        '    print("deny")',
        'elif object_id not in owners:',
        '    print("deny")',
        'elif owners[object_id] != actor:',
        '    print("deny")',
        'else:',
        '    print("allow")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG server-side object authorization. Đọc một dòng `actor|object_id|action`; actor chỉ `team-a` hoặc `team-b`, action chỉ `read`. Owner fixture cố định: `case-a` thuộc `team-a`, `case-b` thuộc `team-b`. In `allow` chỉ khi actor là owner của object và action là `read`; foreign ID, object lạ, actor/action lạ, cấu trúc malformed hoặc quá 60 ký tự đều in `deny`. Không tiết lộ owner, object metadata, raw input hay lý do phân biệt; không có network/filesystem/subprocess.',
      starterCode: `line = input().strip()\n\n# MÔ PHỎNG: authorization bắt buộc kiểm server-side cho từng object và action.`,
      testCases: [
        {
          stdinLines: ['team-a|case-a|read'],
          expected: 'allow',
          match: 'contains',
          hidden: false,
          label: 'owner được đọc object của mình',
        },
        {
          stdinLines: ['team-b|case-b|read'],
          expected: 'allow',
          match: 'contains',
          hidden: true,
          label: 'owner thứ hai được đọc',
        },
        {
          stdinLines: ['team-a|case-b|read'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'foreign object ID bị từ chối',
        },
        {
          stdinLines: ['team-a|case-z|read'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'object không tồn tại fail closed',
        },
        {
          stdinLines: ['team-a|case-a|write'],
          expected: 'deny',
          match: 'contains',
          hidden: true,
          label: 'action ngoài policy bị từ chối',
        },
      ],
      hints: [
        'Dùng map `owners` cố định trên server MÔ PHỎNG; không lấy owner từ input.',
        'Kiểm tra đủ ba phần trước khi tra map để malformed state không crash.',
        'Ghép điều kiện deny trước; chỉ có một nhánh cuối in `allow`.',
      ],
      sampleSolution: `line = input().strip()\nowners = {"case-a": "team-a", "case-b": "team-b"}\n\nif not line or len(line) > 60:\n    print("deny")\n    raise SystemExit\n\nparts = line.split("|")\nif len(parts) != 3:\n    print("deny")\n    raise SystemExit\n\nactor, object_id, action = parts\nif actor not in {"team-a", "team-b"}:\n    print("deny")\nelif action != "read":\n    print("deny")\nelif object_id not in owners:\n    print("deny")\nelif owners[object_id] != actor:\n    print("deny")\nelse:\n    print("allow")`,
    },
    homework:
      'Vẽ data flow cho endpoint đọc hồ sơ giả lập: subject, object, action, policy decision và nơi policy được thực thi. Nêu một cách kiểm thử foreign ID ở môi trường được phép mà không ghi dữ liệu nhạy cảm.',
    srsCards: [
      {
        hoi: 'Vì sao authentication thành công vẫn chưa đủ để cho phép đọc object?',
        dap: 'Authentication chỉ cho biết chủ thể là ai; authorization còn phải kiểm chủ thể đó có quyền thực hiện đúng action trên đúng object theo policy server-side hay không.',
      },
      {
        hoi: 'Server nên phản hồi gì khi foreign ID hoặc object lạ xuất hiện?',
        dap: 'Nên fail closed bằng deny nhất quán và không tiết lộ metadata, owner hoặc lý do chi tiết; điều này tránh biến phản hồi thành nguồn dò tìm object.',
      },
    ],
  },
]
