// P6-U284 — desktop-s3-m3 "Hệ thống mở rộng (plugin)": hộp cát và phiên bản API (bài 1), giới
// hạn quyền của plugin (bài 2). Mở cửa cho người khác viết plugin nghĩa là mã của người lạ chạy
// trong tiến trình của bạn, trên máy của người dùng bạn.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U284_LESSONS = [
  desktopSimulation({
    id: 'p6-u284-l1',
    unitId: 'p6-u284',
    title: 'sandbox trước, api version sau, plugin crash không giết host',
    hook: 'Một plugin của người lạ ném lỗi và app của bạn tắt ngúm — người dùng sẽ nhớ tên app của bạn, không nhớ tên plugin.',
    theory:
      'Luật hộp cát (sandbox) là tuyệt đối: plugin chạy ngoài hộp cát thì deny bất kể phiên bản API có khớp hay không, vì lúc đó không còn ranh giới nào để nói chuyện tiếp. Sau đó mới xét tương thích: khác số major là hợp đồng đã đổi nên reject. Plugin crash TRONG hộp cát lại là kết quả ĐÚNG của thiết kế: host sống, plugin bị cô lập, nên trả allow kèm lý do rõ ràng.',
    workedCode:
      '# MÔ PHỎNG luật hộp cát\nsandboxed = "no"\nprint("deny: plugin not sandboxed" if sandboxed == "no" else "allow: load plugin")',
    predictCode:
      'sandboxed, api_major, plugin_major, crashed = "yes", 3, 3, "yes"\nif sandboxed == "no":\n    print("deny: plugin not sandboxed")\nelif api_major != plugin_major:\n    print("reject: incompatible api version")\nelif crashed == "yes":\n    print("allow: host survives")\nelse:\n    print("allow: load plugin")',
    predictChoices: [
      'allow: load plugin',
      'deny: plugin not sandboxed',
      'reject: incompatible api version',
      'allow: host survives',
    ],
    predictAnswer: 3,
    predictExplain:
      'Plugin chạy trong hộp cát và đúng phiên bản; nó crash nhưng lỗi bị chặn ở ranh giới hộp cát nên ứng dụng chính vẫn sống — đúng như thiết kế.',
    makePrompt:
      'Đọc fixture `sandboxed:<yes|no>,apiMajor:<số>,pluginMajor:<số>,pluginCrashed:<yes|no>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; sandboxed là no → `deny: plugin not sandboxed` (ưu tiên tuyệt đối); apiMajor khác pluginMajor → `reject: incompatible api version`; pluginCrashed là yes → `allow: host survives`; còn lại → `allow: load plugin`. MÔ PHỎNG, không nạp plugin hay tạo tiến trình thật.',
    testCases: [
      {
        stdinLines: ['sandboxed:yes,apiMajor:3,pluginMajor:3,pluginCrashed:no'],
        expected: 'allow: load plugin',
        hidden: false,
        label: 'plugin hợp lệ chạy trong hộp cát',
      },
      {
        stdinLines: ['sandboxed:no,apiMajor:3,pluginMajor:3,pluginCrashed:no'],
        expected: 'deny: plugin not sandboxed',
        hidden: true,
        label: 'luật hộp cát thắng cả khi phiên bản khớp',
      },
      {
        stdinLines: ['sandboxed:yes,apiMajor:3,pluginMajor:2,pluginCrashed:no'],
        expected: 'reject: incompatible api version',
        hidden: true,
        label: 'khác số major là hợp đồng đã đổi',
      },
      {
        stdinLines: ['sandboxed:yes,apiMajor:3,pluginMajor:3,pluginCrashed:yes'],
        expected: 'allow: host survives',
        hidden: true,
        label: 'plugin crash trong hộp cát, host vẫn sống',
      },
      {
        stdinLines: ['sandboxed:yes,apiMajor:v3,pluginMajor:3,pluginCrashed:no'],
        expected: 'invalid: apiMajor',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"sandboxed", "apiMajor", "pluginMajor", "pluginCrashed"}: print("invalid: field")\n    elif m["sandboxed"] not in {"yes", "no"}: print("invalid: sandboxed")\n    elif not m["apiMajor"].isdigit(): print("invalid: apiMajor")\n    elif not m["pluginMajor"].isdigit(): print("invalid: pluginMajor")\n    elif m["pluginCrashed"] not in {"yes", "no"}: print("invalid: pluginCrashed")\n    elif m["sandboxed"] == "no": print("deny: plugin not sandboxed")\n    elif int(m["apiMajor"]) != int(m["pluginMajor"]): print("reject: incompatible api version")\n    elif m["pluginCrashed"] == "yes": print("allow: host survives")\n    else: print("allow: load plugin")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, tách một chức năng của app bạn ra thành tiến trình con riêng, cố tình cho nó crash, rồi xác nhận ứng dụng chính vẫn chạy và báo lỗi tử tế cho người dùng.',
    cards: [
      {
        hoi: 'Vì sao hộp cát là điều kiện tiên quyết của hệ plugin?',
        dap: 'Vì không có ranh giới thì lỗi, rò bộ nhớ hay hành vi xấu của mã người lạ đều thành lỗi của app bạn, và bạn không sửa được.',
      },
      {
        hoi: 'Đổi số major của API plugin nghĩa là gì với người viết plugin?',
        dap: 'Nghĩa là hợp đồng cũ không còn được bảo đảm; plugin phải sửa và phát hành lại, nên major chỉ nên đổi khi thật sự cần.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u284-l2',
    unitId: 'p6-u284',
    title: 'quyền của plugin: xin gì được nấy, không hơn',
    hook: 'Plugin đổi màu giao diện mà xin quyền đọc toàn bộ thư mục tài liệu — hoặc nó viết ẩu, hoặc nó có ý đồ khác.',
    theory:
      'Plugin phải khai trước tập quyền nó cần và host chỉ cấp đúng tập đó. Thứ tự xét: xin quyền không nằm trong danh sách host cho phép là deny; xin quyền rộng hơn mức việc nó làm cần là reject; chưa khai gì mà đòi chạy là refuse, vì không khai thì không kiểm được. Tập quyền hợp lệ của bài khai tường minh: đọc thư mục làm việc, ghi thư mục làm việc, và hiển thị giao diện.',
    workedCode:
      '# MÔ PHỎNG danh sách quyền host cho phép\nCHO_PHEP = {"read-workdir", "write-workdir", "ui"}\nprint("deny: permission not allowed" if "network" not in CHO_PHEP else "allow: grant")',
    predictCode:
      'CHO_PHEP = {"read-workdir", "write-workdir", "ui"}\nxin = {"ui", "write-workdir"}\ncan = {"ui"}\nif not xin <= CHO_PHEP:\n    print("deny: permission not allowed")\nelif not xin <= can:\n    print("reject: permission broader than needed")\nelse:\n    print("allow: grant")',
    predictChoices: [
      'allow: grant',
      'deny: permission not allowed',
      'reject: permission broader than needed',
      'refuse: no permission declared',
    ],
    predictAnswer: 2,
    predictExplain:
      'Cả hai quyền xin đều nằm trong danh sách host cho phép, nhưng việc nó làm chỉ cần quyền giao diện, nên xin thêm quyền ghi là rộng quá mức.',
    makePrompt:
      'Đọc fixture `requested:<danh sách ngăn bằng dấu |, có thể rỗng>,needed:<tương tự>` với danh sách host cho phép là {read-workdir, write-workdir, ui}. Thiếu trường → `invalid: field`; requested rỗng → `refuse: no permission declared`; requested có mục ngoài danh sách cho phép → `deny: permission not allowed`; requested không phải tập con của needed → `reject: permission broader than needed`; còn lại → `allow: grant`. MÔ PHỎNG, không cấp quyền hệ thật.',
    testCases: [
      {
        stdinLines: ['requested:ui,needed:ui|read-workdir'],
        expected: 'allow: grant',
        hidden: false,
        label: 'xin đúng phần mình cần',
      },
      {
        stdinLines: ['requested:,needed:ui'],
        expected: 'refuse: no permission declared',
        hidden: true,
        label: 'không khai quyền thì không kiểm được',
      },
      {
        stdinLines: ['requested:ui|network,needed:ui|network'],
        expected: 'deny: permission not allowed',
        hidden: true,
        label: 'quyền ngoài danh sách host cho phép',
      },
      {
        stdinLines: ['requested:ui|write-workdir,needed:ui'],
        expected: 'reject: permission broader than needed',
        hidden: true,
        label: 'xin rộng hơn mức cần',
      },
      {
        stdinLines: ['requested:ui'],
        expected: 'invalid: field',
        hidden: true,
        label: 'ca âm — thiếu trường fail closed',
      },
    ],
    sampleSolution:
      'CHO_PHEP = {"read-workdir", "write-workdir", "ui"}\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"requested", "needed"}: print("invalid: field")\n    else:\n        xin = set(p for p in m["requested"].split("|") if p)\n        can = set(p for p in m["needed"].split("|") if p)\n        if not xin: print("refuse: no permission declared")\n        elif not xin <= CHO_PHEP: print("deny: permission not allowed")\n        elif not xin <= can: print("reject: permission broader than needed")\n        else: print("allow: grant")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, đọc tài liệu khai báo quyền của một hệ plugin thật (VS Code hoặc Obsidian), liệt kê các quyền có thể xin, rồi viết bản khai quyền tối thiểu cho một plugin giả định mà bạn tự nghĩ ra.',
    cards: [
      {
        hoi: 'Vì sao plugin phải khai quyền TRƯỚC khi chạy?',
        dap: 'Vì khai trước thì host và người dùng kiểm được ngay lúc cài; xin lúc chạy thì người dùng đang giữa việc và sẽ bấm đồng ý cho xong.',
      },
      {
        hoi: 'Quyền "rộng hơn mức cần" gây hại thế nào nếu plugin không có ý xấu?',
        dap: 'Nó mở rộng thiệt hại khi plugin bị chiếm hoặc có lỗi — tài khoản bị lợi dụng thì kẻ tấn công dùng đúng tập quyền plugin đang có.',
      },
    ],
  }),
]
