import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U258_LESSONS = [
  embeddedSimulation({
    id: 'p6-u258-l1',
    unitId: 'p6-u258',
    title: 'máy trạng thái GPIO: chế độ chân và điện trở kéo lên',
    hook: 'Đọc một chân input thả nổi luôn cho ra "một giá trị" — nhưng giá trị đó là nhiễu, không phải dữ liệu.',
    theory:
      'Chân input không khai báo điện trở kéo lên (pull-up) hay kéo xuống thì mức logic của nó do nhiễu môi trường quyết định, nên máy trạng thái phải trả unknown thay vì bịa ra 0 hoặc 1. Ghi vào chân đang cấu hình là input cũng bị từ chối vì thanh ghi output của chân đó không được nối ra ngoài. Thứ tự xét cố định: kiểu dữ liệu, rồi thao tác trái chế độ, rồi bằng chứng điện.',
    workedCode:
      '# MÔ PHỎNG chân GPIO thả nổi\nmode, pull, op = "input", "none", "read"\nprint("unknown: floating pin" if op == "read" and pull == "none" else "allow: gpio ok")',
    predictCode:
      'mode, op = "input", "write"\nprint("reject: write to input pin" if mode == "input" and op == "write" else "allow: gpio ok")',
    predictChoices: ['reject: write to input pin', 'allow: gpio ok', 'unknown: floating pin'],
    predictAnswer: 0,
    predictExplain:
      'Chân đang ở chế độ input thì tầng đệm output bị ngắt, nên lệnh ghi không có tác dụng vật lý và máy trạng thái phải từ chối thay vì im lặng.',
    makePrompt:
      'Đọc fixture `mode:<input|output>,pull:<up|down|none>,op:<read|write>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; mode input và op write → `reject: write to input pin`; mode input, op read, pull none → `unknown: floating pin`; còn lại → `allow: gpio ok`. MÔ PHỎNG, không chạm chân phần cứng thật.',
    testCases: [
      {
        stdinLines: ['mode:input,pull:up,op:read'],
        expected: 'allow: gpio ok',
        hidden: false,
        label: 'input có điện trở kéo lên thì đọc được',
      },
      {
        stdinLines: ['mode:input,pull:up,op:write'],
        expected: 'reject: write to input pin',
        hidden: true,
        label: 'ghi vào chân input bị từ chối',
      },
      {
        stdinLines: ['mode:input,pull:none,op:read'],
        expected: 'unknown: floating pin',
        hidden: true,
        label: 'chân thả nổi không cho kết luận mức logic',
      },
      {
        stdinLines: ['mode:analog,pull:up,op:read'],
        expected: 'invalid: mode',
        hidden: true,
        label: 'ca âm — chế độ lạ fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"mode", "pull", "op"}: print("invalid: field")\n    elif m["mode"] not in {"input", "output"}: print("invalid: mode")\n    elif m["pull"] not in {"up", "down", "none"}: print("invalid: pull")\n    elif m["op"] not in {"read", "write"}: print("invalid: op")\n    elif m["mode"] == "input" and m["op"] == "write": print("reject: write to input pin")\n    elif m["mode"] == "input" and m["pull"] == "none": print("unknown: floating pin")\n    else: print("allow: gpio ok")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên một bo mạch thật NGOÀI sandbox, nối một nút bấm không có điện trở kéo lên rồi đọc chân đó liên tục; ghi lại tỉ lệ mức đọc được đổi ngẫu nhiên, sau đó bật pull-up nội và đo lại.',
    cards: [
      {
        hoi: 'Vì sao chân input thả nổi không cho kết luận 0 hay 1?',
        dap: 'Không có điện trở kéo lên/xuống thì điện áp chân do nhiễu và điện dung ký sinh quyết định, giá trị đọc được không mang thông tin.',
      },
      {
        hoi: 'Ghi vào một chân đang cấu hình là input thì chuyện gì xảy ra?',
        dap: 'Giá trị vào thanh ghi output nhưng tầng đệm bị ngắt nên chân không đổi mức — lỗi im lặng, vì vậy phải từ chối tường minh.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u258-l2',
    unitId: 'p6-u258',
    title: 'ngân sách thời gian cho log gỡ lỗi qua UART',
    hook: 'Thêm một dòng log để tìm lỗi rồi chính dòng log đó làm vòng lặp trễ nhịp — bẫy kinh điển của nghề nhúng.',
    theory:
      'Mỗi dòng log gỡ lỗi qua UART tốn một số chu kỳ cố định, cộng dồn qua mỗi vòng lặp. Simulator tính tổng chi phí rồi so với ngân sách thời gian của vòng lặp; vượt là deny, vì chạy tiếp và hy vọng kịp chính là cách firmware trễ nhịp mà không ai biết. Không có UART thật ở đây, chỉ có phép cộng tất định.',
    workedCode:
      '# MÔ PHỎNG ngân sách log\nloops, cost, budget = 10, 30, 200\nprint("deny: log budget exceeded" if loops * cost > budget else "allow: within log budget")',
    predictCode:
      'loops, cost, budget = 4, 25, 200\nprint("deny: log budget exceeded" if loops * cost > budget else "allow: within log budget")',
    predictChoices: ['allow: within log budget', 'deny: log budget exceeded', 'unknown: no budget'],
    predictAnswer: 0,
    predictExplain: '4 × 25 = 100 chu kỳ, vẫn dưới ngân sách 200 nên vòng lặp còn kịp nhịp.',
    makePrompt:
      'Đọc `loops:<số>,cost:<số>,budget:<số>` (chu kỳ mô phỏng). Sai kiểu hoặc thiếu trường → `invalid: <trường>`; loops × cost > budget → `deny: log budget exceeded`; còn lại → `allow: within log budget`. MÔ PHỎNG, không gửi byte nào ra UART thật.',
    testCases: [
      {
        stdinLines: ['loops:4,cost:25,budget:200'],
        expected: 'allow: within log budget',
        hidden: false,
        label: 'chi phí log còn trong ngân sách',
      },
      {
        stdinLines: ['loops:10,cost:30,budget:200'],
        expected: 'deny: log budget exceeded',
        hidden: true,
        label: 'log cộng dồn làm vòng lặp trễ nhịp',
      },
      {
        stdinLines: ['loops:8,cost:25,budget:200'],
        expected: 'allow: within log budget',
        hidden: true,
        label: 'vừa đúng ngân sách vẫn được chạy',
      },
      {
        stdinLines: ['loops:-1,cost:25,budget:200'],
        expected: 'invalid: loops',
        hidden: true,
        label: 'ca âm — số vòng lặp âm fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"loops", "cost", "budget"}: print("invalid: field")\n    elif not m["loops"].isdigit(): print("invalid: loops")\n    elif not m["cost"].isdigit(): print("invalid: cost")\n    elif not m["budget"].isdigit(): print("invalid: budget")\n    elif int(m["loops"]) * int(m["cost"]) > int(m["budget"]): print("deny: log budget exceeded")\n    else: print("allow: within log budget")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên bo mạch thật NGOÀI sandbox, đo thời gian một vòng lặp khi bật và khi tắt log UART bằng cách bật/tắt một chân GPIO và quan sát trên máy phân tích logic; ghi lại chênh lệch.',
    cards: [
      {
        hoi: 'Vì sao log gỡ lỗi là một khoản trong ngân sách thời gian?',
        dap: 'UART truyền theo tốc độ baud cố định, mỗi byte tốn thời gian thật; log trong vòng nóng cộng dồn thành trễ nhịp có hệ thống.',
      },
      {
        hoi: 'Cách nào đo thời gian vòng lặp mà không tốn thêm thời gian đáng kể?',
        dap: 'Bật/tắt một chân GPIO ở đầu và cuối vòng rồi đo bằng máy phân tích logic — chi phí gần như bằng không so với truyền UART.',
      },
    ],
  }),
]
