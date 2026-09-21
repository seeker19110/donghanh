import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U264_LESSONS = [
  embeddedSimulation({
    id: 'p6-u264-l1',
    unitId: 'p6-u264',
    title: 'cập nhật từ xa: chữ ký gói và phân vùng A/B',
    hook: 'Ghi đè firmware đang chạy bằng một gói chưa kiểm chữ ký là cách biến cả lô thiết bị thành cục chặn giấy trong một đêm.',
    theory:
      'Thiết kế A/B giữ hai phân vùng firmware: bản đang chạy và bản dự phòng. Gói cập nhật phải khớp chữ ký (signature) kỳ vọng TRƯỚC khi ghi một byte nào, vì sau khi ghi thì không lùi được. Ghi vào chính phân vùng đang chạy bị deny, bởi mất điện giữa chừng sẽ không còn bản nào khởi động được. Chữ ký ở đây mô phỏng bằng một chuỗi băm đồ chơi.',
    workedCode:
      '# MÔ PHỎNG kiểm chữ ký gói\ngot, expected = "aa11", "bb22"\nprint("allow: write partition" if got == expected else "reject: bad signature")',
    predictCode:
      'target, active = "a", "a"\nprint("deny: active partition" if target == active else "allow: write partition")',
    predictChoices: ['deny: active partition', 'allow: write partition', 'reject: bad signature'],
    predictAnswer: 0,
    predictExplain:
      'Ghi đè phân vùng đang chạy phá luôn đường lui; A/B tồn tại chính là để luôn còn một bản khởi động được.',
    makePrompt:
      'Đọc `hash:<chuỗi>,expected:<chuỗi>,target:<a|b>,active:<a|b>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; hash khác expected → `reject: bad signature`; target trùng active → `deny: active partition`; còn lại → `allow: write partition`. MÔ PHỎNG, không ghi vào bộ nhớ flash thật.',
    testCases: [
      {
        stdinLines: ['hash:aa11,expected:aa11,target:b,active:a'],
        expected: 'allow: write partition',
        hidden: false,
        label: 'chữ ký khớp và ghi vào phân vùng dự phòng',
      },
      {
        stdinLines: ['hash:cc33,expected:aa11,target:b,active:a'],
        expected: 'reject: bad signature',
        hidden: true,
        label: 'chữ ký sai thì không ghi byte nào',
      },
      {
        stdinLines: ['hash:aa11,expected:aa11,target:a,active:a'],
        expected: 'deny: active partition',
        hidden: true,
        label: 'ghi đè phân vùng đang chạy bị chặn',
      },
      {
        stdinLines: ['hash:aa11,expected:aa11,target:c,active:a'],
        expected: 'invalid: target',
        hidden: true,
        label: 'ca âm — phân vùng không tồn tại fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"hash", "expected", "target", "active"}: print("invalid: field")\n    elif not m["hash"].isalnum(): print("invalid: hash")\n    elif not m["expected"].isalnum(): print("invalid: expected")\n    elif m["target"] not in {"a", "b"}: print("invalid: target")\n    elif m["active"] not in {"a", "b"}: print("invalid: active")\n    elif m["hash"] != m["expected"]: print("reject: bad signature")\n    elif m["target"] == m["active"]: print("deny: active partition")\n    else: print("allow: write partition")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Đọc tài liệu cơ chế cập nhật A/B của một nền tảng nhúng thật NGOÀI sandbox và ghi lại: chữ ký được kiểm ở đâu, ai giữ khoá công khai, và bộ nạp khởi động chọn phân vùng theo cờ nào.',
    cards: [
      {
        hoi: 'Vì sao kiểm chữ ký phải làm trước khi ghi?',
        dap: 'Sau khi đã ghi đè thì bản cũ không còn; kiểm sau là kiểm khi đã mất đường lui.',
      },
      {
        hoi: 'Lợi ích cốt lõi của bố trí A/B là gì?',
        dap: 'Luôn tồn tại một phân vùng nguyên vẹn khởi động được, kể cả khi mất điện giữa lúc đang ghi bản mới.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u264-l2',
    unitId: 'p6-u264',
    title: 'quay lui tự động sau nhiều lần khởi động thất bại',
    hook: 'Bản firmware mới khởi động không nổi mà không có cơ chế quay lui thì mỗi thiết bị hỏng là một chuyến xe ra hiện trường.',
    theory:
      'Bộ nạp khởi động đếm số lần thử chạy bản mới; bản mới chỉ được xác nhận khi firmware tự báo khoẻ mạnh. Chạm ngưỡng lần thử mà chưa có xác nhận thì tự quay lui (rollback) về phân vùng cũ — đó là điểm khác biệt giữa một đội thiết bị cứu được và một đội thiết bị phải thu hồi. Xác nhận khoẻ mạnh được xét trước bộ đếm, vì bản đã xác nhận thì không còn lý do quay lui.',
    workedCode:
      '# MÔ PHỎNG bộ đếm khởi động thất bại\nfails, limit, healthy = 3, 3, "no"\nprint("rollback: revert to previous slot" if healthy == "no" and fails >= limit else "allow: keep new slot")',
    predictCode:
      'fails, limit, healthy = 5, 3, "yes"\nprint("rollback: revert to previous slot" if healthy == "no" and fails >= limit else "allow: keep new slot")',
    predictChoices: ['allow: keep new slot', 'rollback: revert to previous slot', 'invalid: fails'],
    predictAnswer: 0,
    predictExplain:
      'Firmware đã tự báo khoẻ mạnh nên bản mới được xác nhận; bộ đếm thất bại cũ không còn ý nghĩa.',
    makePrompt:
      'Đọc `fails:<số>,limit:<số>,healthy:<yes|no>`. Sai kiểu, thiếu trường, giá trị lạ hoặc limit bằng 0 → `invalid: <trường>`; healthy yes → `allow: keep new slot`; fails >= limit → `rollback: revert to previous slot`; còn lại → `allow: keep new slot`. MÔ PHỎNG, không khởi động lại thiết bị thật.',
    testCases: [
      {
        stdinLines: ['fails:1,limit:3,healthy:no'],
        expected: 'allow: keep new slot',
        hidden: false,
        label: 'còn lượt thử thì chưa quay lui',
      },
      {
        stdinLines: ['fails:3,limit:3,healthy:no'],
        expected: 'rollback: revert to previous slot',
        hidden: true,
        label: 'chạm ngưỡng thất bại thì tự quay lui',
      },
      {
        stdinLines: ['fails:5,limit:3,healthy:yes'],
        expected: 'allow: keep new slot',
        hidden: true,
        label: 'đã xác nhận khoẻ mạnh thì giữ bản mới',
      },
      {
        stdinLines: ['fails:1,limit:0,healthy:no'],
        expected: 'invalid: limit',
        hidden: true,
        label: 'ca âm — ngưỡng bằng 0 là cấu hình vô nghĩa',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"fails", "limit", "healthy"}: print("invalid: field")\n    elif not m["fails"].isdigit(): print("invalid: fails")\n    elif not m["limit"].isdigit() or int(m["limit"]) == 0: print("invalid: limit")\n    elif m["healthy"] not in {"yes", "no"}: print("invalid: healthy")\n    elif m["healthy"] == "yes": print("allow: keep new slot")\n    elif int(m["fails"]) >= int(m["limit"]): print("rollback: revert to previous slot")\n    else: print("allow: keep new slot")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Thiết kế cho dự án thật NGOÀI sandbox một tiêu chí "khoẻ mạnh" cụ thể (kết nối được máy chủ, đọc được cảm biến, ghi được nhật ký) rồi viết ra ai gọi hàm xác nhận và sau bao lâu.',
    cards: [
      {
        hoi: 'Vì sao bản mới phải tự xác nhận khoẻ mạnh thay vì mặc định là tốt?',
        dap: 'Khởi động được chưa chắc là chạy đúng; tiêu chí khoẻ mạnh mới kiểm được các chức năng thiết bị thật sự cần.',
      },
      {
        hoi: 'Ai đếm số lần khởi động thất bại?',
        dap: 'Bộ nạp khởi động, vì nó là phần duy nhất chắc chắn chạy được kể cả khi bản firmware mới hỏng.',
      },
    ],
  }),
]
