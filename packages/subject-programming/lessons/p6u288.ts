// P6-U288 — desktop-s4-m3 "Bảo mật máy khách": xác minh bản cập nhật và quyền chạy (bài 1),
// quyền riêng tư dữ liệu ở lại trên máy người dùng (bài 2). App desktop chạy trên máy người khác
// với quyền của chính họ — mọi lỏng lẻo ở đây là lỏng lẻo trên hàng nghìn máy.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U288_LESSONS = [
  desktopSimulation({
    id: 'p6-u288-l1',
    unitId: 'p6-u288',
    title: 'signature, admin rights và phụ thuộc có lỗ hổng',
    hook: 'Một app xin quyền quản trị cho thao tác thường ngày là một app đang mời mọi lỗi của nó trở thành lỗi của cả máy.',
    theory:
      'Chữ ký là luật ưu tiên tuyệt đối: sai hoặc thiếu thì deny, vì không xác minh được nguồn gốc thì mọi kiểm tra sau đó đều vô nghĩa. Kế đến là nguyên tắc quyền tối thiểu: đòi quyền quản trị cho việc thường ngày là reject. Cuối cùng là chuỗi cung ứng: phụ thuộc có lỗ hổng đã biết thì refuse cho tới khi nâng cấp, vì lỗ hổng đó chạy trên máy người dùng chứ không phải máy chủ của bạn.',
    workedCode:
      '# MÔ PHỎNG cổng chữ ký bản cập nhật\nsignature_valid = "no"\nprint("deny: invalid signature" if signature_valid == "no" else "allow: install update")',
    predictCode:
      'signature_valid, requests_admin, dep_vuln = "yes", "no", "yes"\nif signature_valid == "no":\n    print("deny: invalid signature")\nelif requests_admin == "yes":\n    print("reject: unnecessary admin rights")\nelif dep_vuln == "yes":\n    print("refuse: dependency vulnerable")\nelse:\n    print("allow: install update")',
    predictChoices: [
      'allow: install update',
      'deny: invalid signature',
      'reject: unnecessary admin rights',
      'refuse: dependency vulnerable',
    ],
    predictAnswer: 3,
    predictExplain:
      'Chữ ký đúng và không đòi quyền quản trị, nhưng còn phụ thuộc mang lỗ hổng đã biết thì bản cập nhật này vẫn không nên tới máy người dùng.',
    makePrompt:
      'Đọc fixture `signatureValid:<yes|no>,requestsAdminRights:<yes|no>,dependencyHasKnownVuln:<yes|no>`. Thiếu trường hoặc sai miền → `invalid: <trường>`; signatureValid là no → `deny: invalid signature` (ưu tiên tuyệt đối); requestsAdminRights là yes → `reject: unnecessary admin rights`; dependencyHasKnownVuln là yes → `refuse: dependency vulnerable`; còn lại → `allow: install update`. MÔ PHỎNG, không xác minh chữ ký, không quét phụ thuộc và không xin quyền thật.',
    testCases: [
      {
        stdinLines: ['signatureValid:yes,requestsAdminRights:no,dependencyHasKnownVuln:no'],
        expected: 'allow: install update',
        hidden: false,
        label: 'đủ ba điều kiện an toàn',
      },
      {
        stdinLines: ['signatureValid:no,requestsAdminRights:yes,dependencyHasKnownVuln:yes'],
        expected: 'deny: invalid signature',
        hidden: true,
        label: 'chữ ký sai được xét trước mọi lỗi khác',
      },
      {
        stdinLines: ['signatureValid:yes,requestsAdminRights:yes,dependencyHasKnownVuln:no'],
        expected: 'reject: unnecessary admin rights',
        hidden: true,
        label: 'đòi quyền quản trị cho việc thường ngày',
      },
      {
        stdinLines: ['signatureValid:yes,requestsAdminRights:no,dependencyHasKnownVuln:yes'],
        expected: 'refuse: dependency vulnerable',
        hidden: true,
        label: 'phụ thuộc có lỗ hổng đã biết',
      },
      {
        stdinLines: ['signatureValid:partial,requestsAdminRights:no,dependencyHasKnownVuln:no'],
        expected: 'invalid: signatureValid',
        hidden: true,
        label: 'ca âm — chữ ký "một phần" không tồn tại, fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"signatureValid", "requestsAdminRights", "dependencyHasKnownVuln"}: print("invalid: field")\n    elif m["signatureValid"] not in {"yes", "no"}: print("invalid: signatureValid")\n    elif m["requestsAdminRights"] not in {"yes", "no"}: print("invalid: requestsAdminRights")\n    elif m["dependencyHasKnownVuln"] not in {"yes", "no"}: print("invalid: dependencyHasKnownVuln")\n    elif m["signatureValid"] == "no": print("deny: invalid signature")\n    elif m["requestsAdminRights"] == "yes": print("reject: unnecessary admin rights")\n    elif m["dependencyHasKnownVuln"] == "yes": print("refuse: dependency vulnerable")\n    else: print("allow: install update")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, chạy trình kiểm lỗ hổng phụ thuộc cho một dự án của bạn, liệt kê các cảnh báo mức cao, và ghi rõ từng cái ảnh hưởng gì tới người dùng cuối nếu app đã cài trên máy họ.',
    cards: [
      {
        hoi: 'Vì sao "chữ ký sai" lại được xét trước "phụ thuộc có lỗ hổng"?',
        dap: 'Vì chữ ký sai nghĩa là không biết gói này của ai; danh sách phụ thuộc trong một gói không đáng tin cũng không đáng tin luôn.',
      },
      {
        hoi: 'Quyền quản trị nên dùng vào lúc nào?',
        dap: 'Chỉ cho thao tác thật sự cần (ví dụ cài dịch vụ hệ), tách riêng và xin đúng lúc đó, không chạy cả app với quyền quản trị.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u288-l2',
    unitId: 'p6-u288',
    title: 'dữ liệu ở lại trên máy: gửi ra ngoài phải có lý do và sự cho phép',
    hook: 'Lợi thế lớn nhất của app desktop là "dữ liệu của bạn không rời khỏi máy bạn" — và cũng là thứ dễ đánh mất nhất bằng một tính năng tiện lợi.',
    theory:
      'Mọi dữ liệu rời khỏi máy phải qua ba cổng theo thứ tự: có sự cho phép rõ ràng của người dùng, được mã hoá trên đường truyền, và chỉ gửi đúng phần cần cho mục đích đã nêu. Thiếu cho phép là deny; gửi không mã hoá là reject; gửi rộng hơn mục đích thì che bớt trước khi gửi (redact) chứ không chặn hẳn, để tính năng vẫn dùng được với phần dữ liệu tối thiểu.',
    workedCode:
      '# MÔ PHỎNG cổng dữ liệu rời máy\nuser_allowed = "no"\nprint("deny: no user permission" if user_allowed == "no" else "allow: send minimal")',
    predictCode:
      'user_allowed, encrypted_in_transit, scope = "yes", "yes", "all"\nif user_allowed == "no":\n    print("deny: no user permission")\nelif encrypted_in_transit == "no":\n    print("reject: plaintext transfer")\nelif scope == "all":\n    print("redact: broader than purpose")\nelse:\n    print("allow: send minimal")',
    predictChoices: [
      'allow: send minimal',
      'deny: no user permission',
      'reject: plaintext transfer',
      'redact: broader than purpose',
    ],
    predictAnswer: 3,
    predictExplain:
      'Có cho phép và có mã hoá, nhưng gửi toàn bộ dữ liệu cho một mục đích hẹp là rộng quá mức, nên phải cắt bớt trước khi gửi.',
    makePrompt:
      'Đọc fixture `userAllowed:<yes|no>,encryptedInTransit:<yes|no>,scope:<minimal|all>`. Thiếu trường hoặc sai miền → `invalid: <trường>`; userAllowed là no → `deny: no user permission`; encryptedInTransit là no → `reject: plaintext transfer`; scope là all → `redact: broader than purpose`; còn lại → `allow: send minimal`. MÔ PHỎNG, không gửi gì ra mạng và không mã hoá thật.',
    testCases: [
      {
        stdinLines: ['userAllowed:yes,encryptedInTransit:yes,scope:minimal'],
        expected: 'allow: send minimal',
        hidden: false,
        label: 'đủ cho phép, mã hoá và phạm vi tối thiểu',
      },
      {
        stdinLines: ['userAllowed:no,encryptedInTransit:no,scope:all'],
        expected: 'deny: no user permission',
        hidden: true,
        label: 'không có cho phép thì không gửi gì cả',
      },
      {
        stdinLines: ['userAllowed:yes,encryptedInTransit:no,scope:minimal'],
        expected: 'reject: plaintext transfer',
        hidden: true,
        label: 'gửi không mã hoá',
      },
      {
        stdinLines: ['userAllowed:yes,encryptedInTransit:yes,scope:all'],
        expected: 'redact: broader than purpose',
        hidden: true,
        label: 'gửi rộng hơn mục đích đã nêu',
      },
      {
        stdinLines: ['userAllowed:yes,encryptedInTransit:yes,scope:everything'],
        expected: 'invalid: scope',
        hidden: true,
        label: 'ca âm — phạm vi ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"userAllowed", "encryptedInTransit", "scope"}: print("invalid: field")\n    elif m["userAllowed"] not in {"yes", "no"}: print("invalid: userAllowed")\n    elif m["encryptedInTransit"] not in {"yes", "no"}: print("invalid: encryptedInTransit")\n    elif m["scope"] not in {"minimal", "all"}: print("invalid: scope")\n    elif m["userAllowed"] == "no": print("deny: no user permission")\n    elif m["encryptedInTransit"] == "no": print("reject: plaintext transfer")\n    elif m["scope"] == "all": print("redact: broader than purpose")\n    else: print("allow: send minimal")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, liệt kê mọi luồng dữ liệu rời khỏi máy trong app của bạn (kể cả kiểm tra cập nhật và thống kê ẩn danh), ghi rõ từng luồng gửi gì, vì sao, và người dùng tắt được ở đâu.',
    cards: [
      {
        hoi: 'Vì sao "gửi rộng hơn mục đích" lại là redact chứ không phải deny?',
        dap: 'Vì mục đích là chính đáng và người dùng đã cho phép; cắt bớt phần thừa giữ được tính năng mà vẫn không lấy dữ liệu không cần.',
      },
      {
        hoi: 'Kiểm tra cập nhật có phải là luồng dữ liệu rời máy không?',
        dap: 'Có — nó để lộ địa chỉ IP, phiên bản và thời điểm dùng app, nên cũng phải nằm trong danh sách công bố và có đường tắt đi.',
      },
    ],
  }),
]
