// P6-U278 — desktop-s2-m1 "Đa luồng trong ứng dụng có giao diện": luật tuyệt đối "việc nặng
// không chạy trên luồng giao diện" cùng hợp đồng huỷ (bài 1), và hợp đồng báo tiến độ / ước
// lượng thời gian còn lại (bài 2). Giao diện đứng là lỗi người dùng thấy đầu tiên.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U278_LESSONS = [
  desktopSimulation({
    id: 'p6-u278-l1',
    unitId: 'p6-u278',
    title: 'không chặn ui thread, và huỷ phải được tôn trọng trong ngưỡng',
    hook: 'Người dùng bấm "Huỷ" rồi nhìn con trỏ xoay thêm mười giây — với họ, app đã treo, bất kể việc nền cuối cùng có dừng hay không.',
    theory:
      'Luật đầu tiên là tuyệt đối: việc nặng chạy trên luồng giao diện (ui thread) thì deny bất kể mọi trường khác, vì giao diện đứng là hỏng hợp đồng cơ bản nhất của app desktop. Luật thứ hai xét hợp đồng huỷ: đã yêu cầu cancel mà việc nền không dừng trong 200ms thì nút huỷ chỉ là trang trí. Ngưỡng 200ms là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG luật ui thread\nruns_on_ui_thread = "yes"\nprint("deny: blocks ui thread" if runs_on_ui_thread == "yes" else "allow: run background")',
    predictCode:
      'runs_on_ui_thread, cancel_requested, cancel_ms = "no", "yes", 900\nif runs_on_ui_thread == "yes":\n    print("deny: blocks ui thread")\nelif cancel_requested == "yes" and cancel_ms > 200:\n    print("reject: cancel not honored")\nelse:\n    print("allow: run background")',
    predictChoices: [
      'allow: run background',
      'deny: blocks ui thread',
      'reject: cancel not honored',
      'invalid: cancelHonoredWithinMs',
    ],
    predictAnswer: 2,
    predictExplain:
      'Việc đã ở luồng nền nên không deny, nhưng 900ms vượt ngưỡng 200ms nên yêu cầu huỷ không được tôn trọng.',
    makePrompt:
      'Đọc fixture `runsOnUiThread:<yes|no>,cancelRequested:<yes|no>,cancelHonoredWithinMs:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; runsOnUiThread là yes → `deny: blocks ui thread` (ưu tiên tuyệt đối); cancelRequested là yes và cancelHonoredWithinMs lớn hơn 200 → `reject: cancel not honored`; còn lại → `allow: run background`. MÔ PHỎNG, không tạo luồng, tiến trình con hay giao diện thật.',
    testCases: [
      {
        stdinLines: ['runsOnUiThread:no,cancelRequested:yes,cancelHonoredWithinMs:120'],
        expected: 'allow: run background',
        hidden: false,
        label: 'chạy nền và huỷ kịp trong ngưỡng',
      },
      {
        stdinLines: ['runsOnUiThread:yes,cancelRequested:yes,cancelHonoredWithinMs:900'],
        expected: 'deny: blocks ui thread',
        hidden: true,
        label: 'luật ui thread thắng mọi luật khác',
      },
      {
        stdinLines: ['runsOnUiThread:no,cancelRequested:yes,cancelHonoredWithinMs:900'],
        expected: 'reject: cancel not honored',
        hidden: true,
        label: 'nút huỷ không thật sự dừng việc',
      },
      {
        stdinLines: ['runsOnUiThread:no,cancelRequested:no,cancelHonoredWithinMs:900'],
        expected: 'allow: run background',
        hidden: true,
        label: 'chưa ai yêu cầu huỷ thì ngưỡng không áp dụng',
      },
      {
        stdinLines: ['runsOnUiThread:no,cancelRequested:yes,cancelHonoredWithinMs:som'],
        expected: 'invalid: cancelHonoredWithinMs',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"runsOnUiThread", "cancelRequested", "cancelHonoredWithinMs"}: print("invalid: field")\n    elif m["runsOnUiThread"] not in {"yes", "no"}: print("invalid: runsOnUiThread")\n    elif m["cancelRequested"] not in {"yes", "no"}: print("invalid: cancelRequested")\n    elif not m["cancelHonoredWithinMs"].isdigit(): print("invalid: cancelHonoredWithinMs")\n    elif m["runsOnUiThread"] == "yes": print("deny: blocks ui thread")\n    elif m["cancelRequested"] == "yes" and int(m["cancelHonoredWithinMs"]) > 200: print("reject: cancel not honored")\n    else: print("allow: run background")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, viết một app nhỏ có nút chạy một việc nặng 10 giây. Chạy nó hai lần: một lần trên luồng giao diện, một lần trên luồng nền có cờ huỷ. Đo bằng đồng hồ bấm giờ xem giao diện đứng bao lâu ở mỗi cách và bấm huỷ sau bao lâu thì việc thật sự dừng.',
    cards: [
      {
        hoi: 'Vì sao luật ui thread lại được xét trước mọi luật khác?',
        dap: 'Vì giao diện đứng là hỏng thứ người dùng tiếp xúc trực tiếp; mọi tối ưu khác đều vô nghĩa nếu cửa sổ không vẽ lại được.',
      },
      {
        hoi: 'Huỷ "hợp tác" nghĩa là gì?',
        dap: 'Việc nền tự kiểm cờ huỷ ở những điểm an toàn rồi dừng gọn, thay vì bị giết cưỡng bức — nhờ vậy dữ liệu đang ghi dở không bị bỏ lại nửa chừng.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u278-l2',
    unitId: 'p6-u278',
    title: 'hàng đợi việc, báo tiến độ và ước lượng đo được',
    hook: 'Thanh tiến độ chạy tới 99% rồi đứng yên năm phút là lời nói dối có thiện ý — và nó phá niềm tin nhanh hơn cả việc không có thanh tiến độ.',
    theory:
      'Hợp đồng tiến độ xét theo thứ tự: có việc trong hàng đợi mà không báo gì thì deny (người dùng không phân biệt được "đang chạy" với "treo"); ước lượng dựa trên phỏng đoán thì reject vì nó sai có hệ thống; không có nguồn ước lượng nào thì trả unknown và giao diện phải nói thẳng là chưa biết, thay vì bịa một con số.',
    workedCode:
      '# MÔ PHỎNG cổng phản hồi tiến độ\nqueue_depth, progress_reported = 12, "no"\nprint("deny: no progress feedback" if queue_depth > 0 and progress_reported == "no" else "allow: report progress")',
    predictCode:
      'queue_depth, progress_reported, eta_source = 12, "yes", "none"\nif queue_depth > 0 and progress_reported == "no":\n    print("deny: no progress feedback")\nelif eta_source == "guess":\n    print("reject: eta not measured")\nelif eta_source == "none":\n    print("unknown: eta unavailable")\nelse:\n    print("allow: report progress")',
    predictChoices: [
      'allow: report progress',
      'reject: eta not measured',
      'unknown: eta unavailable',
      'deny: no progress feedback',
    ],
    predictAnswer: 2,
    predictExplain:
      'Có báo tiến độ nên không deny, nhưng không có nguồn ước lượng nào thì phần thời gian còn lại là chưa biết, không được bịa.',
    makePrompt:
      'Đọc fixture `queueDepth:<số>,progressReported:<yes|no>,etaSource:<measured|guess|none>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; queueDepth lớn hơn 0 và progressReported là no → `deny: no progress feedback`; etaSource là guess → `reject: eta not measured`; etaSource là none → `unknown: eta unavailable`; còn lại → `allow: report progress`. MÔ PHỎNG, không chạy hàng đợi việc thật.',
    testCases: [
      {
        stdinLines: ['queueDepth:12,progressReported:yes,etaSource:measured'],
        expected: 'allow: report progress',
        hidden: false,
        label: 'báo tiến độ kèm ước lượng đo được',
      },
      {
        stdinLines: ['queueDepth:12,progressReported:no,etaSource:measured'],
        expected: 'deny: no progress feedback',
        hidden: true,
        label: 'có việc chạy mà không báo gì',
      },
      {
        stdinLines: ['queueDepth:12,progressReported:yes,etaSource:guess'],
        expected: 'reject: eta not measured',
        hidden: true,
        label: 'ước lượng bịa bị từ chối',
      },
      {
        stdinLines: ['queueDepth:0,progressReported:no,etaSource:measured'],
        expected: 'allow: report progress',
        hidden: true,
        label: 'hàng đợi rỗng thì không cần báo gì',
      },
      {
        stdinLines: ['queueDepth:12,progressReported:yes,etaSource:oracle'],
        expected: 'invalid: etaSource',
        hidden: true,
        label: 'ca âm — nguồn ước lượng ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"queueDepth", "progressReported", "etaSource"}: print("invalid: field")\n    elif not m["queueDepth"].isdigit(): print("invalid: queueDepth")\n    elif m["progressReported"] not in {"yes", "no"}: print("invalid: progressReported")\n    elif m["etaSource"] not in {"measured", "guess", "none"}: print("invalid: etaSource")\n    elif int(m["queueDepth"]) > 0 and m["progressReported"] == "no": print("deny: no progress feedback")\n    elif m["etaSource"] == "guess": print("reject: eta not measured")\n    elif m["etaSource"] == "none": print("unknown: eta unavailable")\n    else: print("allow: report progress")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, thêm thanh tiến độ cho một việc nặng thật trong app của bạn, tính thời gian còn lại từ tốc độ ĐO ĐƯỢC của các mục đã xong, và hiển thị "đang tính..." thay vì một con số khi chưa đủ mẫu.',
    cards: [
      {
        hoi: 'Khi chưa đủ dữ liệu để ước lượng thời gian còn lại thì nên hiển thị gì?',
        dap: 'Nói rõ là chưa biết và vẫn cho thấy dấu hiệu việc đang chạy; một con số bịa sẽ bị người dùng nhớ và quy là app nói dối.',
      },
      {
        hoi: 'Vì sao hàng đợi việc tốt hơn chạy mọi thứ song song?',
        dap: 'Hàng đợi giới hạn số việc chạy cùng lúc nên máy yếu không bị quá tải, và cho phép huỷ, sắp thứ tự, báo tiến độ tổng thể.',
      },
    ],
  }),
]
