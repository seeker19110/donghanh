import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U266_LESSONS = [
  embeddedSimulation({
    id: 'p6-u266-l1',
    unitId: 'p6-u266',
    title: 'ghi bền qua mất điện: ghi mới rồi mới đổi con trỏ',
    hook: 'Mất điện đúng lúc đang ghi không phải ca hiếm — với thiết bị ngoài hiện trường, đó là chuyện của mọi ngày.',
    theory:
      'Chiến lược ghi bền: ghi trọn bản mới vào chỗ trống TRƯỚC, chỉ đổi con trỏ sang bản mới ở bước cuối cùng. Nhờ vậy mất điện ở bất kỳ bước nào cũng chỉ để lại một trong hai kết quả hợp lệ — bản cũ nguyên vẹn hoặc bản mới nguyên vẹn, không bao giờ có bản ghi dở dang (torn write). Simulator cắt điện ở mọi bước có thể và kiểm chính bất biến đó.',
    workedCode:
      '# MÔ PHỎNG cắt điện trước khi đổi con trỏ\ncut, commit_at = 2, 5\nprint("allow: last good record" if cut < commit_at else "allow: new record committed")',
    predictCode:
      'cut, commit_at = 5, 5\nprint("allow: last good record" if cut < commit_at else "allow: new record committed")',
    predictChoices: [
      'allow: new record committed',
      'allow: last good record',
      'reject: torn write',
    ],
    predictAnswer: 0,
    predictExplain:
      'Cắt điện tại hoặc sau bước đổi con trỏ thì con trỏ đã trỏ sang bản mới đã ghi trọn, nên bản mới là bản hợp lệ đọc ra được.',
    makePrompt:
      'Đọc `cut:<số>,total:<số>,commit_at:<số>` — cắt điện ở bước `cut`, chuỗi thao tác dài `total` bước, con trỏ đổi ở bước `commit_at`. Sai kiểu, thiếu trường, hoặc commit_at > total → `invalid: <trường>`; cut < commit_at → `allow: last good record`; còn lại → `allow: new record committed`. Không bao giờ được in bản dở dang. MÔ PHỎNG, không ghi flash thật.',
    testCases: [
      {
        stdinLines: ['cut:2,total:5,commit_at:5'],
        expected: 'allow: last good record',
        hidden: false,
        label: 'cắt điện giữa chừng vẫn đọc ra bản cũ nguyên vẹn',
      },
      {
        stdinLines: ['cut:5,total:5,commit_at:5'],
        expected: 'allow: new record committed',
        hidden: true,
        label: 'cắt điện ngay sau khi đổi con trỏ',
      },
      {
        stdinLines: ['cut:0,total:5,commit_at:5'],
        expected: 'allow: last good record',
        hidden: true,
        label: 'cắt điện trước khi ghi byte nào',
      },
      {
        stdinLines: ['cut:2,total:5,commit_at:9'],
        expected: 'invalid: commit_at',
        hidden: true,
        label: 'ca âm — con trỏ đổi ngoài chuỗi thao tác fail closed',
      },
    ],
    sampleSolution:
      'KEYS = ("cut", "total", "commit_at")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(KEYS): print("invalid: field")\n    elif not all(m[k].isdigit() for k in KEYS):\n        print("invalid: " + next(k for k in KEYS if not m[k].isdigit()))\n    elif int(m["commit_at"]) > int(m["total"]): print("invalid: commit_at")\n    elif int(m["cut"]) < int(m["commit_at"]): print("allow: last good record")\n    else: print("allow: new record committed")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên thiết bị thật NGOÀI sandbox, cắt nguồn đột ngột 30 lần trong lúc thiết bị đang ghi số đo, rồi kiểm mỗi lần khởi động lại có đọc ra bản ghi hợp lệ không; ghi lại số lần hỏng.',
    cards: [
      {
        hoi: 'Vì sao đổi con trỏ phải là bước cuối cùng?',
        dap: 'Vì đó là thao tác duy nhất quyết định bản nào được đọc; mọi bước trước nó chỉ chuẩn bị dữ liệu ở chỗ chưa ai dùng.',
      },
      {
        hoi: 'Bản ghi dở dang gây hại thế nào?',
        dap: 'Nó trông như dữ liệu thật nhưng nội dung nửa cũ nửa mới, nên lỗi lan vào mọi tính toán sau đó mà không có dấu hiệu.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u266-l2',
    unitId: 'p6-u266',
    title: 'watchdog và ngân sách bộ nhớ tĩnh',
    hook: 'Firmware treo không tự biết mình treo — phải có một bộ đếm bên ngoài đếm hộ.',
    theory:
      'Watchdog là bộ đếm ngược phần cứng: firmware phải "vuốt" nó đều đặn, quá hạn không vuốt thì nó reset thiết bị về bản bền cuối. Đó là lớp cứu sinh cuối cùng cho thiết bị không ai chạm tới được. Ngoài vòng khởi tạo, mọi vùng nhớ phải nằm trong ngân sách tĩnh đã dành trước — cấp phát trong đường nóng là cách hết bộ nhớ sau nhiều ngày chạy.',
    workedCode:
      '# MÔ PHỎNG watchdog quá hạn\nkick, limit = 12, 8\nprint("deny: watchdog timeout" if kick > limit else "allow: loop healthy")',
    predictCode:
      'alloc, budget = 900, 512\nprint("reject: static budget exceeded" if alloc > budget else "allow: loop healthy")',
    predictChoices: [
      'reject: static budget exceeded',
      'allow: loop healthy',
      'deny: watchdog timeout',
    ],
    predictAnswer: 0,
    predictExplain:
      'Vùng nhớ xin vượt phần đã dành sẵn lúc khởi tạo; chạy tiếp và hy vọng đủ chỗ là cách hỏng sau nhiều ngày.',
    makePrompt:
      'Đọc `kick:<số chu kỳ kể từ lần vuốt cuối>,limit:<số>,alloc:<số>,budget:<số>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; kick > limit → `deny: watchdog timeout`; alloc > budget → `reject: static budget exceeded`; còn lại → `allow: loop healthy`. MÔ PHỎNG, không có watchdog phần cứng thật.',
    testCases: [
      {
        stdinLines: ['kick:3,limit:8,alloc:200,budget:512'],
        expected: 'allow: loop healthy',
        hidden: false,
        label: 'vuốt watchdog đúng nhịp và trong ngân sách tĩnh',
      },
      {
        stdinLines: ['kick:12,limit:8,alloc:200,budget:512'],
        expected: 'deny: watchdog timeout',
        hidden: true,
        label: 'quá hạn không vuốt thì reset về bản bền cuối',
      },
      {
        stdinLines: ['kick:3,limit:8,alloc:900,budget:512'],
        expected: 'reject: static budget exceeded',
        hidden: true,
        label: 'cấp phát vượt buffer tĩnh đã dành sẵn',
      },
      {
        stdinLines: ['kick:3,limit:8,alloc:200,budget:muoi'],
        expected: 'invalid: budget',
        hidden: true,
        label: 'ca âm — ngân sách sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'KEYS = ("kick", "limit", "alloc", "budget")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(KEYS): print("invalid: field")\n    elif not all(m[k].isdigit() for k in KEYS):\n        print("invalid: " + next(k for k in KEYS if not m[k].isdigit()))\n    elif int(m["kick"]) > int(m["limit"]): print("deny: watchdog timeout")\n    elif int(m["alloc"]) > int(m["budget"]): print("reject: static budget exceeded")\n    else: print("allow: loop healthy")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Bật watchdog trên thiết bị thật NGOÀI sandbox rồi cố tình tạo một vòng lặp vô hạn trong firmware; đo thời gian từ lúc treo tới lúc thiết bị khởi động lại và ghi lại con số đó.',
    cards: [
      {
        hoi: 'Vuốt watchdog trong ngắt định thời có an toàn không?',
        dap: 'Không — ngắt định thời vẫn chạy khi vòng lặp chính đã treo, nên watchdog sẽ không bao giờ phát hiện ra treo.',
      },
      {
        hoi: 'Vì sao cấm cấp phát động trong vòng chạy?',
        dap: 'Bộ nhớ nhúng nhỏ và phân mảnh dần; cấp phát trong đường nóng làm thiết bị hỏng sau nhiều ngày, đúng lúc khó tái hiện nhất.',
      },
    ],
  }),
]
