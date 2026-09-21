// P6-U283 — desktop-s3-m2 "Tối ưu khởi động và bộ nhớ": ngân sách thời gian mở app và RAM lúc
// nghỉ (bài 1), cách ĐO cho ra số đáng tin thay vì số đẹp (bài 2). Hai thứ người dùng cảm nhận
// mỗi ngày mà lập trình viên hiếm khi đo trên máy yếu.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U283_LESSONS = [
  desktopSimulation({
    id: 'p6-u283-l1',
    unitId: 'p6-u283',
    title: 'ngân sách startup và RAM lúc nghỉ',
    hook: 'App mở trong 6 giây trên máy văn phòng cũ là app bị người ta ghim vào thanh tác vụ rồi không bao giờ bấm nữa.',
    theory:
      'Hai ngân sách độc lập: thời gian mở app (startup) có trần 2000ms và RAM ở trạng thái nghỉ có trần 400MB. Vượt trần startup chỉ bị deny khi còn module tải lười được mà chưa tải lười — tức là còn cách sửa rõ ràng; vượt trần RAM nghỉ thì reject thẳng vì app không làm gì vẫn chiếm chỗ là lỗi giữ dữ liệu thừa. Ba con số 2000, 400 là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG ngân sách khởi động\nstartup_ms, deferred = 5200, "no"\nprint("deny: startup budget exceeded" if startup_ms > 2000 and deferred == "no" else "allow: within budget")',
    predictCode:
      'startup_ms, deferred, ram_idle_mb = 1400, "yes", 900\nif startup_ms > 2000 and deferred == "no":\n    print("deny: startup budget exceeded")\nelif ram_idle_mb > 400:\n    print("reject: idle ram exceeded")\nelse:\n    print("allow: within budget")',
    predictChoices: [
      'allow: within budget',
      'deny: startup budget exceeded',
      'reject: idle ram exceeded',
      'invalid: ramIdleMb',
    ],
    predictAnswer: 2,
    predictExplain:
      'Khởi động đạt ngân sách, nhưng 900MB lúc app không làm gì vượt xa trần 400MB nên vẫn chưa được phát hành.',
    makePrompt:
      'Đọc fixture `startupMs:<số>,laziestModulesDeferred:<yes|no>,ramIdleMb:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; startupMs lớn hơn 2000 mà laziestModulesDeferred là no → `deny: startup budget exceeded`; ramIdleMb lớn hơn 400 → `reject: idle ram exceeded`; còn lại → `allow: within budget`. MÔ PHỎNG, không khởi động app hay đo bộ nhớ thật.',
    testCases: [
      {
        stdinLines: ['startupMs:1400,laziestModulesDeferred:yes,ramIdleMb:220'],
        expected: 'allow: within budget',
        hidden: false,
        label: 'đạt cả hai ngân sách',
      },
      {
        stdinLines: ['startupMs:5200,laziestModulesDeferred:no,ramIdleMb:220'],
        expected: 'deny: startup budget exceeded',
        hidden: true,
        label: 'chậm mà chưa tải lười phần tải lười được',
      },
      {
        stdinLines: ['startupMs:5200,laziestModulesDeferred:yes,ramIdleMb:220'],
        expected: 'allow: within budget',
        hidden: true,
        label: 'đã tải lười hết thì vượt trần chưa bị deny',
      },
      {
        stdinLines: ['startupMs:1400,laziestModulesDeferred:yes,ramIdleMb:900'],
        expected: 'reject: idle ram exceeded',
        hidden: true,
        label: 'app nghỉ vẫn chiếm quá nhiều RAM',
      },
      {
        stdinLines: ['startupMs:1.4s,laziestModulesDeferred:yes,ramIdleMb:220'],
        expected: 'invalid: startupMs',
        hidden: true,
        label: 'ca âm — sai đơn vị fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"startupMs", "laziestModulesDeferred", "ramIdleMb"}: print("invalid: field")\n    elif not m["startupMs"].isdigit(): print("invalid: startupMs")\n    elif m["laziestModulesDeferred"] not in {"yes", "no"}: print("invalid: laziestModulesDeferred")\n    elif not m["ramIdleMb"].isdigit(): print("invalid: ramIdleMb")\n    elif int(m["startupMs"]) > 2000 and m["laziestModulesDeferred"] == "no": print("deny: startup budget exceeded")\n    elif int(m["ramIdleMb"]) > 400: print("reject: idle ram exceeded")\n    else: print("allow: within budget")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, đo thời gian mở một app desktop của bạn mười lần và mức RAM sau khi để yên 5 phút. Ghi cả hai số vào README của dự án như một ngân sách, rồi đo lại sau mỗi bản phát hành.',
    cards: [
      {
        hoi: 'Vì sao RAM lúc app nghỉ lại là chỉ số đáng theo dõi?',
        dap: 'Vì phần lớn thời gian app chỉ nằm đó; chiếm nhiều lúc nghỉ nghĩa là đang giữ dữ liệu không cần và làm máy người dùng chậm cho mọi thứ khác.',
      },
      {
        hoi: 'Tải lười có rủi ro gì?',
        dap: 'Nó chuyển độ trễ sang lần dùng đầu tiên, nên chỉ áp cho phần ít dùng và phải có trạng thái chờ rõ ràng.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u283-l2',
    unitId: 'p6-u283',
    title: 'đo cho ra số đáng tin: trung vị, đủ mẫu, máy cấu hình thấp',
    hook: 'Con số "mở trong 0.8 giây" đo trên máy bạn với cache nóng, chạy một lần, là con số dùng để tự lừa mình.',
    theory:
      'Một phép đo chỉ dùng được khi đủ ba điều: đủ số mẫu, lấy trung vị chứ không lấy lần nhanh nhất, và đo trên cấu hình thấp nhất mình tuyên bố hỗ trợ. Thứ tự xét: đo trên máy mạnh rồi suy ra cho máy yếu là deny; dưới 10 mẫu là refuse vì chưa đủ để nói gì; báo cáo lấy lần nhanh nhất là reject vì đó là trường hợp may mắn, không phải trải nghiệm.',
    workedCode:
      '# MÔ PHỎNG luật báo cáo số đo\nstatistic = "best"\nprint("reject: best-case not representative" if statistic == "best" else "allow: report median")',
    predictCode:
      'measured_on_low_end, sample_count, statistic = "yes", 4, "median"\nif measured_on_low_end == "no":\n    print("deny: not measured on low-end")\nelif sample_count < 10:\n    print("refuse: sample too small")\nelif statistic == "best":\n    print("reject: best-case not representative")\nelse:\n    print("allow: report median")',
    predictChoices: [
      'allow: report median',
      'deny: not measured on low-end',
      'refuse: sample too small',
      'reject: best-case not representative',
    ],
    predictAnswer: 2,
    predictExplain:
      'Đã đo trên máy yếu và dùng trung vị, nhưng bốn mẫu chưa đủ để trung vị có ý nghĩa.',
    makePrompt:
      'Đọc fixture `measuredOnLowEnd:<yes|no>,sampleCount:<số>,statistic:<median|best|mean>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; measuredOnLowEnd là no → `deny: not measured on low-end`; sampleCount nhỏ hơn 10 → `refuse: sample too small`; statistic là best → `reject: best-case not representative`; còn lại → `allow: report median`. MÔ PHỎNG, không đo hiệu năng thật.',
    testCases: [
      {
        stdinLines: ['measuredOnLowEnd:yes,sampleCount:20,statistic:median'],
        expected: 'allow: report median',
        hidden: false,
        label: 'đủ mẫu, đúng máy, đúng thống kê',
      },
      {
        stdinLines: ['measuredOnLowEnd:no,sampleCount:4,statistic:best'],
        expected: 'deny: not measured on low-end',
        hidden: true,
        label: 'đo trên máy mạnh rồi suy ra cho máy yếu',
      },
      {
        stdinLines: ['measuredOnLowEnd:yes,sampleCount:4,statistic:median'],
        expected: 'refuse: sample too small',
        hidden: true,
        label: 'chưa đủ mẫu để kết luận',
      },
      {
        stdinLines: ['measuredOnLowEnd:yes,sampleCount:20,statistic:best'],
        expected: 'reject: best-case not representative',
        hidden: true,
        label: 'báo cáo lần nhanh nhất',
      },
      {
        stdinLines: ['measuredOnLowEnd:yes,sampleCount:20,statistic:p42'],
        expected: 'invalid: statistic',
        hidden: true,
        label: 'ca âm — thống kê ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"measuredOnLowEnd", "sampleCount", "statistic"}: print("invalid: field")\n    elif m["measuredOnLowEnd"] not in {"yes", "no"}: print("invalid: measuredOnLowEnd")\n    elif not m["sampleCount"].isdigit(): print("invalid: sampleCount")\n    elif m["statistic"] not in {"median", "best", "mean"}: print("invalid: statistic")\n    elif m["measuredOnLowEnd"] == "no": print("deny: not measured on low-end")\n    elif int(m["sampleCount"]) < 10: print("refuse: sample too small")\n    elif m["statistic"] == "best": print("reject: best-case not representative")\n    else: print("allow: report median")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, đo thời gian mở một app 20 lần trên máy cấu hình thấp nhất bạn có, ghi lại cả trung vị lẫn lần nhanh nhất và lần chậm nhất, rồi so ba con số đó với nhau.',
    cards: [
      {
        hoi: 'Vì sao trung vị tốt hơn lần nhanh nhất khi báo cáo hiệu năng?',
        dap: 'Lần nhanh nhất thường rơi vào lúc cache nóng và máy rảnh, không phản ánh trải nghiệm thường ngày của người dùng.',
      },
      {
        hoi: 'Vì sao phải đo trên cấu hình thấp nhất mình hỗ trợ?',
        dap: 'Vì đó là nơi ngân sách thật sự bị chạm; máy của lập trình viên luôn mạnh hơn máy trung bình của người dùng.',
      },
    ],
  }),
]
