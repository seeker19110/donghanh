import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U269_LESSONS = [
  embeddedSimulation({
    id: 'p6-u269-l1',
    unitId: 'p6-u269',
    title: 'hợp đồng an toàn bộ nhớ: truy cập chia sẻ và vùng nhớ đã giải phóng',
    hook: 'Hai lỗi đắt nhất của C trong nhúng — đọc biến chia sẻ không đồng bộ và dùng vùng nhớ đã giải phóng — đều là lỗi kiểu, không phải lỗi logic.',
    theory:
      'Mô hình ở đây kiểm TĨNH hai hợp đồng mà hệ kiểu của Rust bắt được lúc biên dịch: biến chia sẻ giữa ISR và vòng lặp chính chỉ được chạm qua một cơ chế khoá bắt buộc, và vùng nhớ đã giải phóng thì không còn tham chiếu nào được dùng. Đây là mô phỏng hợp đồng bằng Python thuần — KHÔNG có trình biên dịch Rust nào chạy, chỉ có luật quyết định.',
    workedCode:
      '# MÔ PHỎNG kiểm truy cập chia sẻ\naccess = "unlocked"\nprint("deny: unsynchronized access" if access == "unlocked" else "allow: access checked")',
    predictCode:
      'access, freed = "locked", "yes"\nprint("reject: use after free" if freed == "yes" else "allow: access checked")',
    predictChoices: [
      'reject: use after free',
      'allow: access checked',
      'deny: unsynchronized access',
    ],
    predictAnswer: 0,
    predictExplain:
      'Mô hình đã đánh dấu vùng nhớ là đã giải phóng, nên mọi tham chiếu còn lại đều trỏ vào chỗ không còn thuộc về ai.',
    makePrompt:
      'Đọc `access:<locked|unlocked>,freed:<yes|no>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; access unlocked → `deny: unsynchronized access`; freed yes → `reject: use after free`; còn lại → `allow: access checked`. MÔ PHỎNG hợp đồng, không chạy trình biên dịch Rust thật.',
    testCases: [
      {
        stdinLines: ['access:locked,freed:no'],
        expected: 'allow: access checked',
        hidden: false,
        label: 'truy cập qua khoá và vùng nhớ còn sống',
      },
      {
        stdinLines: ['access:unlocked,freed:no'],
        expected: 'deny: unsynchronized access',
        hidden: true,
        label: 'chạm biến chia sẻ không qua khoá bắt buộc',
      },
      {
        stdinLines: ['access:locked,freed:yes'],
        expected: 'reject: use after free',
        hidden: true,
        label: 'dùng vùng nhớ đã đánh dấu giải phóng',
      },
      {
        stdinLines: ['access:atomic,freed:no'],
        expected: 'invalid: access',
        hidden: true,
        label: 'ca âm — cơ chế truy cập ngoài mô hình fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"access", "freed"}: print("invalid: field")\n    elif m["access"] not in {"locked", "unlocked"}: print("invalid: access")\n    elif m["freed"] not in {"yes", "no"}: print("invalid: freed")\n    elif m["access"] == "unlocked": print("deny: unsynchronized access")\n    elif m["freed"] == "yes": print("reject: use after free")\n    else: print("allow: access checked")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Tìm trong một dự án C nhúng thật NGOÀI sandbox một biến chia sẻ giữa ngắt và vòng lặp chính, kiểm xem nó có được bảo vệ không, rồi viết ra cách Rust sẽ bắt lỗi đó lúc biên dịch.',
    cards: [
      {
        hoi: 'Vì sao lỗi an toàn bộ nhớ trong nhúng khó tìm hơn nơi khác?',
        dap: 'Không có đơn vị quản lý bộ nhớ báo lỗi, nên chương trình cứ chạy tiếp với dữ liệu sai cho tới khi biểu hiện ở chỗ khác hẳn.',
      },
      {
        hoi: 'Bảo vệ biến chia sẻ ISR và vòng lặp chính bằng gì?',
        dap: 'Bằng một cơ chế bắt buộc của ngôn ngữ hoặc nền tảng — kiểu nguyên tử hoặc vùng cấm ngắt — chứ không bằng thoả thuận giữa người viết.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u269-l2',
    unitId: 'p6-u269',
    title: 'chế độ no_std và ràng buộc không dùng vùng nhớ động',
    hook: 'Chọn chế độ không thư viện chuẩn rồi lại gọi một API cần vùng nhớ động là mâu thuẫn mà trình biên dịch phát hiện, còn con người thì thường không.',
    theory:
      'Chế độ `no_std` nghĩa là firmware không có thư viện chuẩn và không có bộ cấp phát vùng nhớ động; mọi cấu trúc dữ liệu phải có kích thước biết trước. Gọi một API cần vùng nhớ động trong chế độ đó là mâu thuẫn phải chặn ngay, chứ không phải thêm bộ cấp phát để cho qua — thêm bộ cấp phát là đánh đổi lớn về tính tất định, phải quyết định có chủ ý.',
    workedCode:
      '# MÔ PHỎNG ràng buộc no_std\nprofile, api = "no_std", "heap"\nprint("deny: heap not allowed" if profile == "no_std" and api == "heap" else "allow: profile ok")',
    predictCode:
      'profile, api = "std", "heap"\nprint("deny: heap not allowed" if profile == "no_std" and api == "heap" else "allow: profile ok")',
    predictChoices: ['allow: profile ok', 'deny: heap not allowed', 'invalid: profile'],
    predictAnswer: 0,
    predictExplain:
      'Chế độ có thư viện chuẩn thì bộ cấp phát tồn tại, nên API cần vùng nhớ động không mâu thuẫn với hồ sơ đã chọn.',
    makePrompt:
      'Đọc `profile:<no_std|std>,api:<heap|static>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; profile no_std và api heap → `deny: heap not allowed`; còn lại → `allow: profile ok`. MÔ PHỎNG hợp đồng, không biên dịch firmware thật.',
    testCases: [
      {
        stdinLines: ['profile:no_std,api:static'],
        expected: 'allow: profile ok',
        hidden: false,
        label: 'no_std với cấu trúc kích thước biết trước',
      },
      {
        stdinLines: ['profile:no_std,api:heap'],
        expected: 'deny: heap not allowed',
        hidden: true,
        label: 'no_std không có bộ cấp phát vùng nhớ động',
      },
      {
        stdinLines: ['profile:std,api:heap'],
        expected: 'allow: profile ok',
        hidden: true,
        label: 'có thư viện chuẩn thì vùng nhớ động hợp lệ',
      },
      {
        stdinLines: ['profile:bare,api:static'],
        expected: 'invalid: profile',
        hidden: true,
        label: 'ca âm — hồ sơ biên dịch không khai báo fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"profile", "api"}: print("invalid: field")\n    elif m["profile"] not in {"no_std", "std"}: print("invalid: profile")\n    elif m["api"] not in {"heap", "static"}: print("invalid: api")\n    elif m["profile"] == "no_std" and m["api"] == "heap": print("deny: heap not allowed")\n    else: print("allow: profile ok")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Liệt kê trong firmware thật của bạn NGOÀI sandbox mọi cấu trúc dữ liệu có kích thước thay đổi lúc chạy, rồi viết ra kích thước tối đa của từng cái và cách đổi nó thành vùng nhớ tĩnh.',
    cards: [
      {
        hoi: 'no_std lấy đi những gì?',
        dap: 'Thư viện chuẩn và bộ cấp phát vùng nhớ động, nên không còn kiểu dữ liệu tăng giảm kích thước tự do lúc chạy.',
      },
      {
        hoi: 'Vì sao vùng nhớ tĩnh lại đáng giá trong nhúng?',
        dap: 'Vì dung lượng cần được biết ngay lúc biên dịch, nên thiết bị không thể hết bộ nhớ bất ngờ sau nhiều ngày chạy.',
      },
    ],
  }),
]
