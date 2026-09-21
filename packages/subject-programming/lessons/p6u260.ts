import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U260_LESSONS = [
  embeddedSimulation({
    id: 'p6-u260-l1',
    unitId: 'p6-u260',
    title: 'ISR ngắn và hàng đợi có trần',
    hook: 'Thường trình phục vụ ngắt làm "chỉ thêm một phép tính nhỏ" là cách nhanh nhất để mất sự kiện kế tiếp.',
    theory:
      'Một ISR chỉ nên đặt cờ hoặc đẩy đúng một phần tử vào hàng đợi có trần, rồi trả quyền cho vòng lặp chính. Simulator đếm số bước trong ISR: vượt ngưỡng là deny vì ngắt kế tiếp sẽ bị che. Hàng đợi đầy phải reject tường minh, không rớt ngầm — rớt ngầm biến mất dữ liệu thành một bí ẩn không lần ra được.',
    workedCode:
      '# MÔ PHỎNG độ dài ISR\nsteps, limit = 120, 40\nprint("deny: isr too long" if steps > limit else "allow: isr enqueued")',
    predictCode:
      'queue, cap = 8, 8\nprint("reject: queue full" if queue >= cap else "allow: isr enqueued")',
    predictChoices: ['reject: queue full', 'allow: isr enqueued', 'deny: isr too long'],
    predictAnswer: 0,
    predictExplain:
      'Hàng đợi đã chạm trần nên phần tử mới không có chỗ; từ chối tường minh để chỗ gọi biết đã mất sự kiện.',
    makePrompt:
      'Đọc `steps:<số>,limit:<số>,queue:<số>,cap:<số>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; steps > limit → `deny: isr too long`; queue >= cap → `reject: queue full`; còn lại → `allow: isr enqueued`. MÔ PHỎNG, không có vector ngắt thật.',
    testCases: [
      {
        stdinLines: ['steps:10,limit:40,queue:3,cap:8'],
        expected: 'allow: isr enqueued',
        hidden: false,
        label: 'ISR ngắn và hàng đợi còn chỗ',
      },
      {
        stdinLines: ['steps:120,limit:40,queue:3,cap:8'],
        expected: 'deny: isr too long',
        hidden: true,
        label: 'ISR quá dài che mất ngắt kế tiếp',
      },
      {
        stdinLines: ['steps:10,limit:40,queue:8,cap:8'],
        expected: 'reject: queue full',
        hidden: true,
        label: 'hàng đợi chạm trần phải từ chối tường minh',
      },
      {
        stdinLines: ['steps:10,limit:40,queue:3'],
        expected: 'invalid: field',
        hidden: true,
        label: 'ca âm — thiếu trường cap fail closed',
      },
    ],
    sampleSolution:
      'KEYS = ("steps", "limit", "queue", "cap")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(KEYS): print("invalid: field")\n    elif not all(m[k].isdigit() for k in KEYS):\n        print("invalid: " + next(k for k in KEYS if not m[k].isdigit()))\n    elif int(m["steps"]) > int(m["limit"]): print("deny: isr too long")\n    elif int(m["queue"]) >= int(m["cap"]): print("reject: queue full")\n    else: print("allow: isr enqueued")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên bo mạch thật NGOÀI sandbox, bật một chân GPIO ngay khi vào ISR và tắt khi ra, đo độ rộng xung bằng máy phân tích logic, rồi thử chuyển phần tính toán ra vòng lặp chính và đo lại.',
    cards: [
      {
        hoi: 'Vì sao ISR phải ngắn?',
        dap: 'Trong lúc ISR chạy, các ngắt cùng mức hoặc thấp hơn bị chặn; ISR dài làm sự kiện kế tiếp đến trước khi ISR trước kết thúc và bị mất.',
      },
      {
        hoi: 'Hàng đợi đầy thì nên rớt ngầm hay báo lỗi?',
        dap: 'Báo lỗi tường minh, vì chỉ chỗ gọi mới biết mất sự kiện này có chấp nhận được hay không.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u260-l2',
    unitId: 'p6-u260',
    title: 'chống dội phím: gộp chuỗi cạnh trong cửa sổ debounce',
    hook: 'Một lần bấm nút cơ khí sinh ra hàng chục cạnh trong vài mili giây — đếm thô sẽ ra hàng chục lần bấm.',
    theory:
      'Chống dội phím (debounce) gộp mọi cạnh rơi trong cửa sổ thời gian sau một cạnh đã tính thành cùng một sự kiện. Simulator duyệt danh sách mốc thời gian theo thứ tự tăng dần: cạnh đầu luôn tính, cạnh sau chỉ tính khi cách mốc đã tính hơn một cửa sổ. Danh sách không tăng dần là dữ liệu đo sai, phải invalid chứ không tự sắp lại.',
    workedCode:
      '# MÔ PHỎNG gộp cạnh trong cửa sổ debounce\nwindow, edges = 5, [0, 2, 3, 20]\nlast, n = None, 0\nfor t in edges:\n    if last is None or t - last > window:\n        n += 1\n        last = t\nprint("allow: " + str(n) + " events")',
    predictCode:
      'window, edges = 5, [0, 1, 2]\nlast, n = None, 0\nfor t in edges:\n    if last is None or t - last > window:\n        n += 1\n        last = t\nprint("allow: " + str(n) + " events")',
    predictChoices: ['allow: 1 events', 'allow: 3 events', 'allow: 2 events'],
    predictAnswer: 0,
    predictExplain:
      'Cả ba cạnh nằm trong cùng một cửa sổ 5 đơn vị kể từ cạnh đầu, nên chúng là một lần bấm duy nhất.',
    makePrompt:
      'Đọc `window:<số>,edges:<t1;t2;...>` (mốc thời gian mô phỏng). Thiếu trường, mốc sai kiểu, hoặc danh sách không tăng dần nghiêm ngặt → `invalid: <trường>`; còn lại gộp cạnh theo cửa sổ và in `allow: <n> events`. MÔ PHỎNG, không có nút bấm thật.',
    testCases: [
      {
        stdinLines: ['window:5,edges:0;2;3;20'],
        expected: 'allow: 2 events',
        hidden: false,
        label: 'hai lần bấm cách nhau xa hơn cửa sổ',
      },
      {
        stdinLines: ['window:5,edges:0;1;2'],
        expected: 'allow: 1 events',
        hidden: true,
        label: 'một lần bấm bị dội thành ba cạnh',
      },
      {
        stdinLines: ['window:0,edges:0;1;2'],
        expected: 'allow: 3 events',
        hidden: true,
        label: 'cửa sổ bằng 0 thì không gộp gì cả',
      },
      {
        stdinLines: ['window:5,edges:5;1'],
        expected: 'invalid: edges',
        hidden: true,
        label: 'ca âm — mốc thời gian lùi lại fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"window", "edges"}: print("invalid: field")\n    elif not m["window"].isdigit(): print("invalid: window")\n    else:\n        parts = m["edges"].split(";")\n        if not all(p.isdigit() for p in parts) or not parts: print("invalid: edges")\n        else:\n            ts = [int(p) for p in parts]\n            if any(ts[i] >= ts[i + 1] for i in range(len(ts) - 1)): print("invalid: edges")\n            else:\n                w, last, n = int(m["window"]), None, 0\n                for t in ts:\n                    if last is None or t - last > w:\n                        n += 1\n                        last = t\n                print("allow: " + str(n) + " events")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Nối một nút bấm cơ khí thật NGOÀI sandbox vào máy phân tích logic, chụp lại chuỗi cạnh của một lần bấm, đo độ dài đoạn dội rồi chọn cửa sổ debounce từ số đo đó thay vì đoán.',
    cards: [
      {
        hoi: 'Chọn cửa sổ debounce dựa vào đâu?',
        dap: 'Dựa vào độ dài đoạn dội đo được thật của chính loại nút đó, đủ dài để gộp hết dội nhưng ngắn hơn khoảng cách hai lần bấm nhanh nhất của người dùng.',
      },
      {
        hoi: 'Vì sao không tự sắp lại danh sách mốc thời gian?',
        dap: 'Mốc lùi lại nghĩa là phép đo hoặc bộ đếm thời gian có vấn đề; sắp lại sẽ giấu mất lỗi gốc đó.',
      },
    ],
  }),
]
