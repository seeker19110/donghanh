import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U268_LESSONS = [
  embeddedSimulation({
    id: 'p6-u268-l1',
    unitId: 'p6-u268',
    title: 'hệ tệp chỉ-đọc và cây thiết bị',
    hook: 'Thiết bị hiện trường mất điện hàng trăm lần một năm — hệ tệp ghi được ở mọi chỗ là hệ tệp sẽ hỏng.',
    theory:
      'Linux nhúng thường gắn phân vùng gốc ở chế độ chỉ-đọc (read-only) và chỉ dành một vùng nhỏ cho dữ liệu thay đổi được. Ghi ngoài vùng đó phải bị chặn, vì mất điện lúc ghi vào phân vùng gốc làm thiết bị không khởi động được nữa. Cây thiết bị là bản khai báo phần cứng cho nhân; thiếu khai báo thì driver không có nút thiết bị để mở, và đó là lỗi cấu hình chứ không phải lỗi phần cứng.',
    workedCode:
      '# MÔ PHỎNG hệ tệp chỉ-đọc\nop, zone = "write", "ro"\nprint("deny: read-only fs" if op == "write" and zone == "ro" else "allow: io ok")',
    predictCode:
      'node = "missing"\nprint("reject: missing device node" if node == "missing" else "allow: io ok")',
    predictChoices: ['reject: missing device node', 'allow: io ok', 'deny: read-only fs'],
    predictAnswer: 0,
    predictExplain:
      'Cây thiết bị chưa khai báo ngoại vi nên nhân không tạo nút thiết bị, driver không có gì để mở.',
    makePrompt:
      'Đọc `op:<read|write>,zone:<ro|rw>,node:<present|missing>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; node missing → `reject: missing device node`; op write và zone ro → `deny: read-only fs`; còn lại → `allow: io ok`. MÔ PHỎNG, không gắn phân vùng hay mở tệp thật.',
    testCases: [
      {
        stdinLines: ['op:read,zone:ro,node:present'],
        expected: 'allow: io ok',
        hidden: false,
        label: 'đọc từ phân vùng chỉ-đọc là hợp lệ',
      },
      {
        stdinLines: ['op:write,zone:ro,node:present'],
        expected: 'deny: read-only fs',
        hidden: true,
        label: 'ghi ngoài vùng ghi riêng bị chặn',
      },
      {
        stdinLines: ['op:write,zone:rw,node:missing'],
        expected: 'reject: missing device node',
        hidden: true,
        label: 'cây thiết bị thiếu khai báo ngoại vi',
      },
      {
        stdinLines: ['op:append,zone:rw,node:present'],
        expected: 'invalid: op',
        hidden: true,
        label: 'ca âm — thao tác không khai báo fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"op", "zone", "node"}: print("invalid: field")\n    elif m["op"] not in {"read", "write"}: print("invalid: op")\n    elif m["zone"] not in {"ro", "rw"}: print("invalid: zone")\n    elif m["node"] not in {"present", "missing"}: print("invalid: node")\n    elif m["node"] == "missing": print("reject: missing device node")\n    elif m["op"] == "write" and m["zone"] == "ro": print("deny: read-only fs")\n    else: print("allow: io ok")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên một thiết bị Linux nhúng thật NGOÀI sandbox, gắn phân vùng gốc ở chế độ chỉ-đọc, liệt kê mọi đường dẫn mà phần mềm của bạn còn ghi vào, rồi dời chúng sang đúng một vùng ghi riêng.',
    cards: [
      {
        hoi: 'Vì sao phân vùng gốc nên ở chế độ chỉ-đọc?',
        dap: 'Vì mất điện khi đang ghi có thể hỏng cấu trúc hệ tệp và làm thiết bị không khởi động lại được, mất luôn đường sửa từ xa.',
      },
      {
        hoi: 'Cây thiết bị làm gì?',
        dap: 'Nó khai báo cho nhân biết trên bo mạch này có những ngoại vi nào, ở địa chỉ nào, dùng ngắt nào — nhân không tự dò ra được.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u268-l2',
    unitId: 'p6-u268',
    title: 'ngân sách thời gian khởi động',
    hook: 'Thiết bị mất 40 giây để khởi động sau mỗi lần mất điện nghĩa là mỗi lần mất điện chớp nhoáng là 40 giây mù.',
    theory:
      'Thời gian khởi động là một cam kết đo được, không phải hệ quả tình cờ của việc chọn hệ điều hành. Đặt ngân sách trước rồi đo lại sau mỗi thay đổi; vượt ngân sách là một lỗi phải xử lý, y như test đỏ. Simulator chỉ làm đúng phép so sánh đó để rèn thói quen coi thời gian khởi động là con số có chủ.',
    workedCode:
      '# MÔ PHỎNG ngân sách khởi động\nboot_ms, budget_ms = 4200, 3000\nprint("deny: boot budget exceeded" if boot_ms > budget_ms else "allow: boot within budget")',
    predictCode:
      'boot_ms, budget_ms = 3000, 3000\nprint("deny: boot budget exceeded" if boot_ms > budget_ms else "allow: boot within budget")',
    predictChoices: ['allow: boot within budget', 'deny: boot budget exceeded', 'invalid: boot_ms'],
    predictAnswer: 0,
    predictExplain: 'Vừa đúng ngân sách vẫn là đạt; chỉ vượt hơn ngân sách mới là lỗi.',
    makePrompt:
      'Đọc `boot_ms:<số>,budget_ms:<số>`. Sai kiểu, thiếu trường hoặc budget_ms bằng 0 → `invalid: <trường>`; boot_ms > budget_ms → `deny: boot budget exceeded`; còn lại → `allow: boot within budget`. MÔ PHỎNG, không khởi động hệ điều hành thật.',
    testCases: [
      {
        stdinLines: ['boot_ms:2500,budget_ms:3000'],
        expected: 'allow: boot within budget',
        hidden: false,
        label: 'khởi động trong ngân sách cam kết',
      },
      {
        stdinLines: ['boot_ms:4200,budget_ms:3000'],
        expected: 'deny: boot budget exceeded',
        hidden: true,
        label: 'vượt ngân sách là lỗi phải xử lý',
      },
      {
        stdinLines: ['boot_ms:3000,budget_ms:3000'],
        expected: 'allow: boot within budget',
        hidden: true,
        label: 'vừa đúng ngân sách vẫn đạt',
      },
      {
        stdinLines: ['boot_ms:2500,budget_ms:0'],
        expected: 'invalid: budget_ms',
        hidden: true,
        label: 'ca âm — ngân sách bằng 0 là cấu hình vô nghĩa',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"boot_ms", "budget_ms"}: print("invalid: field")\n    elif not m["boot_ms"].isdigit(): print("invalid: boot_ms")\n    elif not m["budget_ms"].isdigit() or int(m["budget_ms"]) == 0: print("invalid: budget_ms")\n    elif int(m["boot_ms"]) > int(m["budget_ms"]): print("deny: boot budget exceeded")\n    else: print("allow: boot within budget")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Đo thời gian khởi động thật của thiết bị bạn NGOÀI sandbox từ lúc cấp nguồn tới lúc chức năng chính sẵn sàng, tách ra thành các chặng, rồi chọn chặng dài nhất để cắt trước.',
    cards: [
      {
        hoi: 'Đo thời gian khởi động nên tính từ mốc nào tới mốc nào?',
        dap: 'Từ lúc cấp nguồn tới lúc chức năng chính thật sự phục vụ được, không phải tới lúc hiện dấu nhắc đăng nhập.',
      },
      {
        hoi: 'Vì sao ngân sách khởi động phải đặt trước?',
        dap: 'Đặt sau thì con số đo được luôn trở thành con số chấp nhận được, và cam kết mất hết ý nghĩa.',
      },
    ],
  }),
]
