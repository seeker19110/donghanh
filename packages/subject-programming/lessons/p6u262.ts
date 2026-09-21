import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U262_LESSONS = [
  embeddedSimulation({
    id: 'p6-u262-l1',
    unitId: 'p6-u262',
    title: 'ngân sách ngăn xếp và cách chia sẻ dữ liệu giữa ISR và tác vụ',
    hook: 'Tràn ngăn xếp trong RTOS không báo lỗi — nó lặng lẽ ghi đè lên biến của tác vụ bên cạnh.',
    theory:
      'Mỗi tác vụ RTOS được cấp một ngân sách ngăn xếp (stack budget) cố định lúc khởi tạo; vượt ngân sách là ghi đè vùng nhớ của hàng xóm nên phải deny trước khi tạo tác vụ. Truyền dữ liệu giữa ISR và tác vụ bằng biến toàn cục không có cơ chế đồng bộ là chia sẻ không an toàn, vì ngắt có thể xen vào giữa một phép ghi nhiều byte. Thứ tự xét cố định: ngăn xếp trước, cách chia sẻ sau.',
    workedCode:
      '# MÔ PHỎNG ngân sách ngăn xếp\nstack, budget = 900, 512\nprint("deny: stack overflow" if stack > budget else "allow: task created")',
    predictCode:
      'share = "global"\nprint("deny: unsafe share" if share == "global" else "allow: task created")',
    predictChoices: ['deny: unsafe share', 'allow: task created', 'deny: stack overflow'],
    predictAnswer: 0,
    predictExplain:
      'Biến toàn cục không có hàng đợi hay khoá bảo vệ, nên ngắt xen vào giữa phép ghi sẽ để lại giá trị nửa vời.',
    makePrompt:
      'Đọc `stack:<số>,budget:<số>,share:<queue|global>`. Sai kiểu, thiếu trường hoặc giá trị lạ → `invalid: <trường>`; stack > budget → `deny: stack overflow`; share global → `deny: unsafe share`; còn lại → `allow: task created`. MÔ PHỎNG, không có nhân RTOS thật.',
    testCases: [
      {
        stdinLines: ['stack:200,budget:512,share:queue'],
        expected: 'allow: task created',
        hidden: false,
        label: 'ngăn xếp đủ và truyền dữ liệu qua hàng đợi',
      },
      {
        stdinLines: ['stack:900,budget:512,share:queue'],
        expected: 'deny: stack overflow',
        hidden: true,
        label: 'vượt ngân sách ngăn xếp khai báo',
      },
      {
        stdinLines: ['stack:200,budget:512,share:global'],
        expected: 'deny: unsafe share',
        hidden: true,
        label: 'chia sẻ qua biến toàn cục bị chặn',
      },
      {
        stdinLines: ['stack:200,budget:512,share:mailbox'],
        expected: 'invalid: share',
        hidden: true,
        label: 'ca âm — cơ chế chia sẻ không khai báo fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"stack", "budget", "share"}: print("invalid: field")\n    elif not m["stack"].isdigit(): print("invalid: stack")\n    elif not m["budget"].isdigit(): print("invalid: budget")\n    elif m["share"] not in {"queue", "global"}: print("invalid: share")\n    elif int(m["stack"]) > int(m["budget"]): print("deny: stack overflow")\n    elif m["share"] == "global": print("deny: unsafe share")\n    else: print("allow: task created")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên một dự án RTOS thật NGOÀI sandbox, bật tính năng đo mức ngăn xếp cao nhất của từng tác vụ, chạy 72 giờ rồi ghi lại khoảng dự phòng còn lại của mỗi tác vụ.',
    cards: [
      {
        hoi: 'Vì sao tràn ngăn xếp trong hệ nhúng khó phát hiện?',
        dap: 'Không có đơn vị quản lý bộ nhớ chặn lại, nên nó chỉ ghi đè vùng nhớ kế bên và biểu hiện thành lỗi ở một chỗ hoàn toàn khác.',
      },
      {
        hoi: 'Truyền dữ liệu từ ISR sang tác vụ nên dùng gì?',
        dap: 'Hàng đợi có trần do nhân RTOS cung cấp với phiên bản an toàn cho ngắt, để phép chuyển giao là nguyên tử.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u262-l2',
    unitId: 'p6-u262',
    title: 'đảo ưu tiên và hàng đợi liên tác vụ',
    hook: 'Tác vụ ưu tiên cao chờ một khoá không có thời hạn là cách hệ thống thời gian thực đứng im mà vẫn "đang chạy".',
    theory:
      'Hai tác vụ cùng mức ưu tiên tranh một khoá không đặt thời hạn chờ thì không có cơ chế nào phá thế bế tắc, nên simulator refuse ngay ở bước duyệt thiết kế. Hàng đợi liên tác vụ chạm trần phải reject tường minh. Rủi ro đảo ưu tiên được xét trước vì nó làm cả hệ thống treo, nặng hơn việc mất một thông điệp.',
    workedCode:
      '# MÔ PHỎNG rủi ro đảo ưu tiên\nprio_a, prio_b, timeout = 3, 3, "no"\nprint("refuse: priority inversion risk" if prio_a == prio_b and timeout == "no" else "allow: message sent")',
    predictCode:
      'queue, cap = 5, 5\nprint("reject: queue full" if queue >= cap else "allow: message sent")',
    predictChoices: [
      'reject: queue full',
      'allow: message sent',
      'refuse: priority inversion risk',
    ],
    predictAnswer: 0,
    predictExplain:
      'Hàng đợi liên tác vụ có trần cố định; chạm trần thì thông điệp mới không có chỗ và phải báo lỗi cho người gửi.',
    makePrompt:
      'Đọc `prio_a:<số>,prio_b:<số>,timeout:<yes|no>,queue:<số>,cap:<số>`. Sai kiểu, thiếu trường hoặc giá trị lạ → `invalid: <trường>`; prio_a bằng prio_b và timeout no → `refuse: priority inversion risk`; queue >= cap → `reject: queue full`; còn lại → `allow: message sent`. MÔ PHỎNG, không có bộ lập lịch thật.',
    testCases: [
      {
        stdinLines: ['prio_a:2,prio_b:3,timeout:no,queue:1,cap:5'],
        expected: 'allow: message sent',
        hidden: false,
        label: 'ưu tiên khác nhau và hàng đợi còn chỗ',
      },
      {
        stdinLines: ['prio_a:3,prio_b:3,timeout:no,queue:1,cap:5'],
        expected: 'refuse: priority inversion risk',
        hidden: true,
        label: 'tranh khoá không thời hạn giữa hai tác vụ cùng ưu tiên',
      },
      {
        stdinLines: ['prio_a:2,prio_b:3,timeout:yes,queue:5,cap:5'],
        expected: 'reject: queue full',
        hidden: true,
        label: 'hàng đợi liên tác vụ chạm trần',
      },
      {
        stdinLines: ['prio_a:2,prio_b:3,timeout:soon,queue:1,cap:5'],
        expected: 'invalid: timeout',
        hidden: true,
        label: 'ca âm — thời hạn chờ mơ hồ fail closed',
      },
    ],
    sampleSolution:
      'NUM = ("prio_a", "prio_b", "queue", "cap")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(NUM) | {"timeout"}: print("invalid: field")\n    elif not all(m[k].isdigit() for k in NUM):\n        print("invalid: " + next(k for k in NUM if not m[k].isdigit()))\n    elif m["timeout"] not in {"yes", "no"}: print("invalid: timeout")\n    elif m["prio_a"] == m["prio_b"] and m["timeout"] == "no": print("refuse: priority inversion risk")\n    elif int(m["queue"]) >= int(m["cap"]): print("reject: queue full")\n    else: print("allow: message sent")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Dựng một ví dụ đảo ưu tiên thật NGOÀI sandbox trên RTOS bạn dùng, đo thời gian tác vụ ưu tiên cao bị chặn, rồi bật cơ chế kế thừa ưu tiên của mutex và đo lại.',
    cards: [
      {
        hoi: 'Đảo ưu tiên là gì?',
        dap: 'Tác vụ ưu tiên cao phải chờ một khoá đang do tác vụ ưu tiên thấp giữ, trong khi tác vụ ưu tiên trung bình lại chiếm CPU của tác vụ thấp đó.',
      },
      {
        hoi: 'Vì sao mọi lần chờ khoá nên có thời hạn?',
        dap: 'Thời hạn biến một thế bế tắc vĩnh viễn thành một lỗi quan sát được và xử lý được, thay vì hệ thống đứng im không dấu vết.',
      },
    ],
  }),
]
