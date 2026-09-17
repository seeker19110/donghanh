import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U196_LESSONS = [
  devopsSimulation({
    id: 'p6-u196-l1',
    unitId: 'p6-u196',
    title: 'metric RED/USE, cardinality và log chứa PII',
    hook: 'Một nhãn metric mang user id có thể nhân số chuỗi thời gian lên hàng triệu và giết hệ giám sát trước khi nó kịp cứu bạn.',
    theory:
      'Cổng thu nhận xét theo thứ tự tất định: dữ liệu sai kiểu trước, rồi PII, rồi cardinality. Log chứa PII bị redact trước khi lưu vì dữ liệu cá nhân rò ra là hỏng không sửa được; nổ số chiều nhãn vượt ngưỡng thì deny để hệ metric còn sống. Không có Prometheus hay Grafana thật ở đây.',
    workedCode:
      '# MÔ PHỎNG cong thu nhan\nlabels = 500\nprint("deny: cardinality explosion" if labels > 50 else "allow: ingest")',
    predictCode: 'pii = "yes"\nprint("redact: log chua pii" if pii == "yes" else "allow: ingest")',
    predictChoices: ['redact: log chua pii', 'allow: ingest', 'metric: scraped'],
    predictAnswer: 0,
    predictExplain:
      'Log mang dữ liệu cá nhân phải được che trước khi lưu, vì một khi đã lưu thì không thu hồi được.',
    makePrompt:
      'Đọc `labels:<số>,pii:<yes|no>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; pii yes → `redact: log chua pii`; labels > 50 → `deny: cardinality explosion`; còn lại → `allow: ingest`. MÔ PHỎNG, không scrape Prometheus, ghi log tập trung hay gọi backend thật.',
    testCases: [
      {
        stdinLines: ['labels:10,pii:no'],
        expected: 'allow: ingest',
        hidden: false,
        label: 'số chiều nhãn trong ngưỡng',
      },
      {
        stdinLines: ['labels:500,pii:no'],
        expected: 'deny: cardinality explosion',
        hidden: true,
        label: 'nổ số chiều nhãn bị chặn',
      },
      {
        stdinLines: ['labels:10,pii:yes'],
        expected: 'redact: log chua pii',
        hidden: true,
        label: 'ca âm — PII phải che trước khi lưu',
      },
      {
        stdinLines: ['labels:muoi,pii:no'],
        expected: 'invalid: labels',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"labels", "pii"}: print("invalid: field")\n    elif not m["labels"].isdigit(): print("invalid: labels")\n    elif m["pii"] not in {"yes", "no"}: print("invalid: pii")\n    elif m["pii"] == "yes": print("redact: log chua pii")\n    elif int(m["labels"]) > 50: print("deny: cardinality explosion")\n    else: print("allow: ingest")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên một hệ giám sát thật, đếm số chuỗi thời gian của một metric trước và sau khi thêm một nhãn có nhiều giá trị, rồi viết lại quy tắc nhãn cho đội mình.',
    cards: [
      {
        hoi: 'Cardinality của metric là gì và vì sao phải chặn?',
        dap: 'Là số chuỗi thời gian sinh ra từ tổ hợp nhãn; nó nhân lên theo cấp số nhân và có thể làm cạn bộ nhớ, lưu trữ của hệ giám sát.',
      },
      {
        hoi: 'RED và USE đo những gì?',
        dap: 'RED đo dịch vụ theo tốc độ yêu cầu, lỗi và độ trễ; USE đo tài nguyên theo mức sử dụng, mức bão hoà và lỗi.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u196-l2',
    unitId: 'p6-u196',
    title: 'cảnh báo theo triệu chứng và trace span cha–con',
    hook: 'Cảnh báo "CPU cao" đánh thức người trực lúc 3 giờ sáng cho một hệ thống người dùng vẫn dùng bình thường — đó là cảnh báo nhiễu.',
    theory:
      'Cảnh báo phải bám triệu chứng người dùng (symptom) như lỗi và độ trễ; cảnh báo theo nguyên nhân bên trong bị hạ ưu tiên kèm lý do chứ không xoá, vì nó vẫn hữu ích khi chẩn đoán. Trace có span mồ côi thiếu cha thì fail closed, vì một cây trace khuyết không kết luận được gì. Không có OpenTelemetry collector thật ở đây.',
    workedCode:
      '# MÔ PHỎNG luat canh bao\nalert = "cause"\nprint("allow: ha uu tien, canh bao theo nguyen nhan" if alert == "cause" else "allow: page on-call")',
    predictCode:
      'span = "orphan"\nprint("deny: span mo coi thieu cha" if span == "orphan" else "allow: page on-call")',
    predictChoices: ['deny: span mo coi thieu cha', 'allow: page on-call', 'trace: complete'],
    predictAnswer: 0,
    predictExplain:
      'Span không có cha thì cây trace khuyết, không đủ bằng chứng để kết luận nên hệ thống fail closed.',
    makePrompt:
      'Đọc `alert:<symptom|cause>,span:<root|child|orphan>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; span orphan → `deny: span mo coi thieu cha`; alert cause → `allow: ha uu tien, canh bao theo nguyen nhan`; còn lại → `allow: page on-call theo trieu chung`. MÔ PHỎNG, không gọi Alertmanager, collector hay hệ trực thật.',
    testCases: [
      {
        stdinLines: ['alert:symptom,span:root'],
        expected: 'allow: page on-call theo trieu chung',
        hidden: false,
        label: 'cảnh báo theo triệu chứng người dùng thì gọi người trực',
      },
      {
        stdinLines: ['alert:cause,span:child'],
        expected: 'allow: ha uu tien, canh bao theo nguyen nhan',
        hidden: true,
        label: 'cảnh báo theo nguyên nhân bị hạ ưu tiên kèm lý do',
      },
      {
        stdinLines: ['alert:symptom,span:orphan'],
        expected: 'deny: span mo coi thieu cha',
        hidden: true,
        label: 'ca âm — trace khuyết cha fail closed',
      },
      {
        stdinLines: ['alert:noisy,span:root'],
        expected: 'invalid: alert',
        hidden: true,
        label: 'ca âm — loại cảnh báo không nhận dạng được',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"alert", "span"}: print("invalid: field")\n    elif m["alert"] not in {"symptom", "cause"}: print("invalid: alert")\n    elif m["span"] not in {"root", "child", "orphan"}: print("invalid: span")\n    elif m["span"] == "orphan": print("deny: span mo coi thieu cha")\n    elif m["alert"] == "cause": print("allow: ha uu tien, canh bao theo nguyen nhan")\n    else: print("allow: page on-call theo trieu chung")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Rà lại bộ cảnh báo thật của một hệ bạn vận hành, phân loại từng cảnh báo theo triệu chứng hay nguyên nhân, và viết sổ tay xử lý cho những cảnh báo còn giữ quyền gọi người trực.',
    cards: [
      {
        hoi: 'Vì sao nên cảnh báo theo triệu chứng người dùng?',
        dap: 'Triệu chứng nói đúng điều người dùng đang chịu; nguyên nhân bên trong thường dao động mà không ảnh hưởng ai, nên dễ sinh cảnh báo nhiễu.',
      },
      {
        hoi: 'Span cha–con trong trace phân tán dùng để làm gì?',
        dap: 'Quan hệ cha–con dựng lại đường đi của một yêu cầu qua nhiều dịch vụ, cho biết chặng nào tốn thời gian hoặc hỏng.',
      },
    ],
  }),
]
