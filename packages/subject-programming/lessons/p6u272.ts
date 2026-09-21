import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U272_LESSONS = [
  embeddedSimulation({
    id: 'p6-u272-l1',
    unitId: 'p6-u272',
    title: 'cập nhật theo đợt nhỏ và ngưỡng dừng',
    hook: 'Đẩy bản mới cho cả mười nghìn máy cùng lúc là đặt cược cả đội thiết bị vào một lần thử.',
    theory:
      'Cập nhật đội thiết bị đi theo đợt nhỏ (canary): đẩy cho một nhóm nhỏ trước, đo tỉ lệ báo lỗi, rồi mới quyết định đợt kế. Vượt ngưỡng dừng đã khai báo thì đóng băng đợt rollout, KHÔNG tự đẩy tiếp — tự đẩy tiếp là cách biến một lỗi nhỏ thành sự cố toàn đội. So sánh dùng phép nhân chéo thay vì chia, để kết quả không phụ thuộc làm tròn.',
    workedCode:
      '# MÔ PHỎNG ngưỡng dừng theo đợt nhỏ\nfailed, batch, threshold = 6, 50, 5\nprint("freeze: rollout paused" if failed * 100 > threshold * batch else "allow: next batch")',
    predictCode:
      'failed, batch, threshold = 1, 50, 5\nprint("freeze: rollout paused" if failed * 100 > threshold * batch else "allow: next batch")',
    predictChoices: ['allow: next batch', 'freeze: rollout paused', 'invalid: batch'],
    predictAnswer: 0,
    predictExplain:
      '1 trên 50 là 2 phần trăm, dưới ngưỡng dừng 5 phần trăm, nên đợt kế tiếp được phép chạy.',
    makePrompt:
      'Đọc `failed:<số>,batch:<số>,threshold:<0-100>`. Sai kiểu, thiếu trường, batch bằng 0 hoặc failed > batch → `invalid: <trường>`; tỉ lệ lỗi vượt ngưỡng → `freeze: rollout paused`; còn lại → `allow: next batch`. Dùng phép nhân chéo, không chia. MÔ PHỎNG, không đẩy bản cập nhật thật.',
    testCases: [
      {
        stdinLines: ['failed:1,batch:50,threshold:5'],
        expected: 'allow: next batch',
        hidden: false,
        label: 'tỉ lệ lỗi dưới ngưỡng thì tiếp đợt kế',
      },
      {
        stdinLines: ['failed:6,batch:50,threshold:5'],
        expected: 'freeze: rollout paused',
        hidden: true,
        label: 'vượt ngưỡng dừng thì đóng băng rollout',
      },
      {
        stdinLines: ['failed:0,batch:50,threshold:0'],
        expected: 'allow: next batch',
        hidden: true,
        label: 'ngưỡng 0 và không máy nào lỗi vẫn được đi tiếp',
      },
      {
        stdinLines: ['failed:60,batch:50,threshold:5'],
        expected: 'invalid: failed',
        hidden: true,
        label: 'ca âm — số máy lỗi nhiều hơn cỡ đợt là dữ liệu sai',
      },
    ],
    sampleSolution:
      'KEYS = ("failed", "batch", "threshold")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(KEYS): print("invalid: field")\n    elif not all(m[k].isdigit() for k in KEYS):\n        print("invalid: " + next(k for k in KEYS if not m[k].isdigit()))\n    elif int(m["batch"]) == 0: print("invalid: batch")\n    elif int(m["threshold"]) > 100: print("invalid: threshold")\n    elif int(m["failed"]) > int(m["batch"]): print("invalid: failed")\n    elif int(m["failed"]) * 100 > int(m["threshold"]) * int(m["batch"]): print("freeze: rollout paused")\n    else: print("allow: next batch")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Đặt cho đội thiết bị thật của bạn NGOÀI sandbox một kế hoạch rollout theo đợt: cỡ đợt đầu, ngưỡng dừng, ai được bấm tiếp, và đợi bao lâu giữa hai đợt.',
    cards: [
      {
        hoi: 'Vì sao ngưỡng dừng phải khai báo TRƯỚC khi đẩy?',
        dap: 'Đặt sau thì con số quan sát được luôn được biện hộ là chấp nhận được, và ngưỡng mất hết tác dụng chặn.',
      },
      {
        hoi: 'Vì sao so sánh tỉ lệ bằng phép nhân chéo?',
        dap: 'Phép chia số nguyên hoặc số thực đưa làm tròn vào quyết định, làm kết quả ở sát ngưỡng khó đoán và khó test.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u272-l2',
    unitId: 'p6-u272',
    title: 'chỉ số sức khoẻ thiết bị và quay lui từng máy',
    hook: 'Một thiết bị "vẫn online" chưa chắc là khoẻ — và bạn chỉ biết điều đó nếu đã định nghĩa khoẻ là gì.',
    theory:
      'Bản tin sức khoẻ phải có đủ bốn trường bắt buộc: phiên bản, mức pin, số lần khởi động lại và lần liên lạc gần nhất. Thiếu trường nào thì bản tin không dùng được để ra quyết định, phải trả invalid thay vì suy đoán. Máy thử khởi động bản mới quá số lần cho phép mà chưa báo khoẻ thì tự quay lui riêng máy đó, không kéo theo cả đội.',
    workedCode:
      '# MÔ PHỎNG quay lui từng máy\ntries, limit = 3, 3\nprint("rollback: revert device" if tries >= limit else "allow: keep version")',
    predictCode:
      'tries, limit = 1, 3\nprint("rollback: revert device" if tries >= limit else "allow: keep version")',
    predictChoices: ['allow: keep version', 'rollback: revert device', 'invalid: field'],
    predictAnswer: 0,
    predictExplain: 'Mới thử một lần trên ba lần cho phép, máy vẫn còn cơ hội báo khoẻ.',
    makePrompt:
      'Đọc bản tin sức khoẻ `version:<mã>,battery:<0-100>,reboots:<số>,last_seen:<số>,tries:<số>,limit:<số>`. Thiếu bất kỳ trường nào hoặc sai kiểu → `invalid: <trường>`; tries >= limit → `rollback: revert device`; còn lại → `allow: keep version`. MÔ PHỎNG, không đọc telemetry thật.',
    testCases: [
      {
        stdinLines: ['version:v3,battery:80,reboots:2,last_seen:30,tries:1,limit:3'],
        expected: 'allow: keep version',
        hidden: false,
        label: 'bản tin đủ trường và máy còn lượt thử',
      },
      {
        stdinLines: ['version:v3,battery:80,reboots:9,last_seen:30,tries:3,limit:3'],
        expected: 'rollback: revert device',
        hidden: true,
        label: 'hết lượt thử mà chưa báo khoẻ thì quay lui riêng máy đó',
      },
      {
        stdinLines: ['version:v3,battery:80,reboots:2,tries:1,limit:3'],
        expected: 'invalid: field',
        hidden: true,
        label: 'thiếu lần liên lạc gần nhất thì bản tin không dùng được',
      },
      {
        stdinLines: ['version:v3,battery:150,reboots:2,last_seen:30,tries:1,limit:3'],
        expected: 'invalid: battery',
        hidden: true,
        label: 'ca âm — mức pin ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'NUM = ("battery", "reboots", "last_seen", "tries", "limit")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(NUM) | {"version"}: print("invalid: field")\n    elif not m["version"].isalnum(): print("invalid: version")\n    elif not all(m[k].isdigit() for k in NUM):\n        print("invalid: " + next(k for k in NUM if not m[k].isdigit()))\n    elif int(m["battery"]) > 100: print("invalid: battery")\n    elif int(m["tries"]) >= int(m["limit"]): print("rollback: revert device")\n    else: print("allow: keep version")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Định nghĩa cho đội thiết bị thật NGOÀI sandbox bản tin sức khoẻ tối thiểu, rồi dựng một bảng đếm xem bao nhiêu máy đã im lặng quá lâu — đó thường là nhóm hỏng mà không ai báo.',
    cards: [
      {
        hoi: 'Vì sao "vẫn online" không đủ làm chỉ số sức khoẻ?',
        dap: 'Thiết bị có thể kết nối được nhưng cảm biến hỏng, pin sắp cạn hoặc khởi động lại liên tục — online không nói gì về chức năng.',
      },
      {
        hoi: 'Số lần khởi động lại nói lên điều gì?',
        dap: 'Tăng đột ngột thường là dấu hiệu watchdog đang reset liên tục vì firmware treo, một lỗi mà thiết bị không tự báo được.',
      },
    ],
  }),
]
