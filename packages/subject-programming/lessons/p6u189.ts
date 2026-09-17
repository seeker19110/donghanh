// P6-U189 — security-s2-m4: responsible disclosure state, simulated and fail-closed.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U189_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u189-l1',
    unitId: 'p6-u189',
    language: 'python',
    title: 'MÔ PHỎNG kiểm tra report disclosure đủ điều kiện riêng tư',
    hook: 'Một báo cáo thiếu người sở hữu hoặc mốc thời gian không thể được chuyển đi an toàn, dù mức độ ảnh hưởng nghe có vẻ khẩn cấp.',
    theory:
      'Responsible disclosure bắt đầu bằng một report có trạng thái kiểm được: consent, severity, impact, repro-redacted, remediation, owner và timeline. Simulator chỉ xét fixture tổng hợp, không chứa dữ liệu nhạy cảm. Nếu thiếu bất kỳ trường bắt buộc nào thì trạng thái là incomplete; nếu có ý định public trước khi fixed thì phải block trước mọi hành động công bố.',
    workedExample: {
      code: `# Tao danh sach truong bat buoc cho report phong thu.\nrequired = ["consent", "severity", "impact", "repro-redacted", "remediation", "owner", "timeline"]\n# Fixture nay da redacted va khong tham chieu he thong that.\nreport = {"consent": "yes", "severity": "high", "impact": "limited", "repro-redacted": "yes", "remediation": "planned", "owner": "team-a", "timeline": "2026-10-01"}\n# Kiem tra tung truong co gia tri truoc khi chuyen report rieng tu.\ncomplete = all(report.get(field, "") for field in required)\nprint("ready-private" if complete else "incomplete")`,
      stdinLines: [],
    },
    predict: {
      code: `fixed = "no"\npublic = "yes"\nprint(public == "yes" and fixed != "yes")`,
      question: 'Khi public=yes nhưng fixed=no, điều kiện chặn công bố có cho kết quả gì?',
      choices: ['True', 'False', 'ready-private', 'incomplete'],
      answerIndex: 0,
      explain: 'Công bố chỉ được xét sau khi đã xác nhận fixed=yes; vì vậy điều kiện chặn là True.',
    },
    parsons: {
      prompt:
        'Xếp các dòng kiểm report theo thứ tự fail-closed: thiếu trạng thái thì incomplete trước khi xét chuyển riêng tư.',
      lines: [
        'missing = [key for key in required if fields.get(key, "") == ""]',
        'if missing:',
        '    print("status=incomplete")',
        'elif fields.get("public") == "yes" and fields.get("fixed") != "yes":',
        '    print("status=block-public-before-fix")',
        'else:',
        '    print("status=ready-private")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một report disclosure đã redacted. Đọc một dòng gồm các cặp `key=value` ngăn bằng `;`. Chỉ nhận các key: consent, severity, impact, repro-redacted, remediation, owner, timeline, embargo, public, fixed. Giá trị không rỗng chỉ gồm chữ/số/dấu gạch nối dài tối đa 30; mỗi key xuất hiện tối đa một lần. Giá trị rỗng là trạng thái thiếu, không phải lỗi cú pháp. Bắt buộc consent=yes, repro-redacted=yes, và có giá trị cho severity, impact, remediation, owner, timeline, embargo. Thiếu hoặc sai các điều kiện đó in `status=incomplete`. Nếu report đầy đủ nhưng public=yes và fixed khác yes, in `status=block-public-before-fix`. Còn lại in `status=ready-private` và `next=coordinate-owner-timeline`. Input sai in `input-khong-hop-le`. Đây chỉ là state machine MÔ PHỎNG, không gửi report hay thao tác dữ liệu ngoài sandbox.',
      starterCode: `raw = input().strip()\n\n# MÔ PHỎNG: kiem state report redacted theo quy tac fail-closed.`,
      testCases: [
        {
          stdinLines: [
            'consent=yes;severity=high;impact=limited;repro-redacted=yes;remediation=planned;owner=team-a;timeline=2026-10-01;embargo=active;public=no;fixed=no',
          ],
          expected: 'status=ready-private\nnext=coordinate-owner-timeline',
          match: 'contains',
          hidden: false,
          label: 'report đầy đủ được giữ trong luồng riêng tư',
        },
        {
          stdinLines: [
            'consent=yes;severity=high;impact=limited;repro-redacted=yes;remediation=planned;owner=team-a;timeline=2026-10-01;embargo=active;public=yes;fixed=no',
          ],
          expected: 'status=block-public-before-fix',
          match: 'contains',
          hidden: true,
          label: 'public trước khi xác nhận fixed phải bị chặn',
        },
        {
          stdinLines: [
            'consent=yes;severity=low;impact=limited;repro-redacted=yes;remediation=planned;owner=;timeline=2026-10-01;embargo=active',
          ],
          expected: 'status=incomplete',
          match: 'contains',
          hidden: true,
          label: 'thiếu owner làm report không hoàn chỉnh',
        },
        {
          stdinLines: [
            'consent=no;severity=low;impact=limited;repro-redacted=yes;remediation=planned;owner=team-a;timeline=2026-10-01;embargo=active',
          ],
          expected: 'status=incomplete',
          match: 'contains',
          hidden: true,
          label: 'không có consent thì fail closed',
        },
      ],
      hints: [
        'Tách từng token bằng dấu `;`, rồi dùng `split("=", 1)` để tách key và value.',
        'Dùng một set key hợp lệ và từ chối key lạ hoặc key trùng trước khi xét trạng thái.',
        'Đặt nhánh incomplete trước nhánh block để thông báo không bị suy đoán từ một report thiếu trường.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    allowed = {"consent", "severity", "impact", "repro-redacted", "remediation", "owner", "timeline", "embargo", "public", "fixed"}
    fields = {}
    if not raw:
        raise ValueError
    for token in raw.split(";"):
        if token.count("=") != 1:
            raise ValueError
        key, value = token.split("=", 1)
        if key not in allowed or key in fields or len(value) > 30:
            raise ValueError
        if not all(char.isalnum() or char == "-" for char in value):
            raise ValueError
        fields[key] = value

    required = ["severity", "impact", "remediation", "owner", "timeline", "embargo"]
    incomplete = (
        fields.get("consent") != "yes"
        or fields.get("repro-redacted") != "yes"
        or any(not fields.get(key, "") for key in required)
    )
    if incomplete:
        print("status=incomplete")
    elif fields.get("public") == "yes" and fields.get("fixed") != "yes":
        print("status=block-public-before-fix")
    else:
        print("status=ready-private")
        print("next=coordinate-owner-timeline")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Với một artifact được phép trong tổ chức của bạn, soạn checklist riêng tư gồm impact đã redacted, remediation, owner và timeline; nhờ người phụ trách xác nhận consent trước khi lưu hay chuyển tiếp.',
    srsCards: [
      {
        hoi: 'Những trường trạng thái nào làm report disclosure đủ để đi vào luồng riêng tư?',
        dap: 'Report cần consent, severity, impact, repro-redacted, remediation, owner, timeline và embargo có giá trị; thiếu một trường hoặc consent/redaction sai thì phải được xem là incomplete.',
      },
      {
        hoi: 'Vì sao public=yes khi fixed chưa là yes phải bị block?',
        dap: 'Việc chặn ngăn thông tin ảnh hưởng lan rộng trước khi remediation được xác nhận, đồng thời giữ trách nhiệm phối hợp với owner và timeline đã định.',
      },
    ],
  },
  {
    id: 'p6-u189-l2',
    unitId: 'p6-u189',
    language: 'python',
    title: 'MÔ PHỎNG quyết định embargo và thông báo remediation',
    hook: 'Một timeline tốt không biến report thành lời hứa mơ hồ: nó chỉ rõ owner, remediation và thời điểm rà soát trước khi thay đổi trạng thái.',
    theory:
      'Embargo là trạng thái phối hợp có hạn, không phải lời mời công bố tự động. Với report đã redacted và có consent, severity cùng impact giúp ưu tiên xử lý; remediation, owner và timeline tạo trách nhiệm theo dõi. Simulator chỉ trả quyết định trạng thái deterministic: incomplete khi thiếu bằng chứng, hold-embargo khi chưa fixed, và ready-review khi đã fixed nhưng vẫn giữ bước review trước public.',
    workedExample: {
      code: `# Cac truong can co de phoi hop remediation co trach nhiem.\nstate = {"consent": "yes", "severity": "medium", "impact": "limited", "repro-redacted": "yes", "remediation": "verified", "owner": "team-b", "timeline": "2026-10-02", "embargo": "active", "fixed": "yes"}\n# Embargo van can review ngay ca khi remediation da duoc xac nhan.\nif state["fixed"] == "yes":\n    print("ready-review")\nelse:\n    print("hold-embargo")`,
      stdinLines: [],
    },
    predict: {
      code: `embargo = "active"\nfixed = "no"\nprint("hold-embargo" if embargo == "active" and fixed != "yes" else "ready-review")`,
      question: 'Một report còn embargo=active và fixed=no nên có quyết định nào?',
      choices: ['hold-embargo', 'ready-review', 'public-now', 'incomplete'],
      answerIndex: 0,
      explain:
        'Khi remediation chưa được xác nhận, report phải giữ trong embargo thay vì chuyển sang review công bố.',
    },
    parsons: {
      prompt: 'Xếp state machine điều phối sau khi đã kiểm report đủ trường bắt buộc.',
      lines: [
        'if fields.get("public") == "yes" and fields.get("fixed") != "yes":',
        '    print("decision=block-public-before-fix")',
        'elif fields.get("fixed") == "yes":',
        '    print("decision=ready-review")',
        'else:',
        '    print("decision=hold-embargo")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG điều phối disclosure đã redacted. Đọc một dòng `key=value` phân cách `;` với đúng các key như bài trước: consent, severity, impact, repro-redacted, remediation, owner, timeline, embargo, public, fixed. Giá trị không rỗng chỉ gồm chữ/số/dấu gạch nối dài tối đa 30 và không trùng key; giá trị rỗng biểu thị thiếu trạng thái. Report bắt buộc consent=yes, repro-redacted=yes, severity/impact/remediation/owner/timeline/embargo có giá trị; nếu không in `decision=incomplete`. Nếu public=yes mà fixed khác yes, in `decision=block-public-before-fix`. Nếu fixed=yes, in `decision=ready-review` và `notify=owner-timeline`; nếu chưa fixed, in `decision=hold-embargo` và `notify=remediation-owner`. Input sai in `input-khong-hop-le`. Không liên lạc, không đưa thông tin nhận diện, và không tự thay đổi embargo trong mô phỏng.',
      starterCode: `raw = input().strip()\n\n# MÔ PHỎNG: chon trang thai disclosure theo report da redacted.`,
      testCases: [
        {
          stdinLines: [
            'consent=yes;severity=medium;impact=limited;repro-redacted=yes;remediation=verified;owner=team-b;timeline=2026-10-02;embargo=active;public=no;fixed=yes',
          ],
          expected: 'decision=ready-review\nnotify=owner-timeline',
          match: 'contains',
          hidden: false,
          label: 'đã fixed thì chuyển sang review với owner và timeline',
        },
        {
          stdinLines: [
            'consent=yes;severity=high;impact=broad;repro-redacted=yes;remediation=planned;owner=team-b;timeline=2026-10-02;embargo=active;public=no;fixed=no',
          ],
          expected: 'decision=hold-embargo\nnotify=remediation-owner',
          match: 'contains',
          hidden: true,
          label: 'chưa fixed thì tiếp tục phối hợp remediation',
        },
        {
          stdinLines: [
            'consent=yes;severity=high;impact=broad;repro-redacted=yes;remediation=verified;owner=team-b;timeline=2026-10-02;embargo=active;public=yes;fixed=no',
          ],
          expected: 'decision=block-public-before-fix',
          match: 'contains',
          hidden: true,
          label: 'ý định public không vượt qua xác nhận fixed',
        },
        {
          stdinLines: [
            'consent=yes;severity=high;impact=broad;repro-redacted=no;remediation=planned;owner=team-b;timeline=2026-10-02;embargo=active;public=no;fixed=no',
          ],
          expected: 'decision=incomplete',
          match: 'contains',
          hidden: true,
          label: 'repro không redacted không được điều phối tiếp',
        },
      ],
      hints: [
        'Tái dùng một hàm parse hoặc một vòng lặp để chỉ tạo dictionary khi mọi token hợp lệ.',
        'Danh sách `required` nên kiểm remediation, owner và timeline cùng với các trường ảnh hưởng.',
        'Kiểm nhánh public-before-fix trước nhánh fixed để state an toàn được ưu tiên rõ ràng.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    allowed = {"consent", "severity", "impact", "repro-redacted", "remediation", "owner", "timeline", "embargo", "public", "fixed"}
    fields = {}
    if not raw:
        raise ValueError
    for token in raw.split(";"):
        if token.count("=") != 1:
            raise ValueError
        key, value = token.split("=", 1)
        if key not in allowed or key in fields or len(value) > 30:
            raise ValueError
        if not all(char.isalnum() or char == "-" for char in value):
            raise ValueError
        fields[key] = value

    required = ["severity", "impact", "remediation", "owner", "timeline", "embargo"]
    incomplete = (
        fields.get("consent") != "yes"
        or fields.get("repro-redacted") != "yes"
        or any(not fields.get(key, "") for key in required)
    )
    if incomplete:
        print("decision=incomplete")
    elif fields.get("public") == "yes" and fields.get("fixed") != "yes":
        print("decision=block-public-before-fix")
    elif fields.get("fixed") == "yes":
        print("decision=ready-review")
        print("notify=owner-timeline")
    else:
        print("decision=hold-embargo")
        print("notify=remediation-owner")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Lập một timeline review cho một report synthetic: chỉ ghi vai trò owner, trạng thái remediation và ngày rà soát; bảo đảm artifact mô tả ảnh hưởng đã redacted và không được chuyển thành thông báo công khai tự động.',
    srsCards: [
      {
        hoi: 'Sau khi report đầy đủ nhưng fixed chưa là yes, state disclosure an toàn là gì?',
        dap: 'Giữ hold-embargo và thông báo remediation-owner, vì owner cùng remediation cần hoàn tất và xác nhận trước khi bước review hoặc công bố được xem xét.',
      },
      {
        hoi: 'Ready-review có nghĩa là có thể tự động public ngay không?',
        dap: 'Không. Ready-review chỉ cho phép owner và timeline rà soát sau khi fixed=yes; quyết định public vẫn cần quy trình được ủy quyền và kiểm tra trạng thái phù hợp.',
      },
    ],
  },
]
