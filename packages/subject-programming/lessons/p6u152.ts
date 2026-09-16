// P6-U152 — systems-s2-m3: TCP framing và event loop qua mô phỏng hữu hạn.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U152_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u152-l1',
    unitId: 'p6-u152',
    language: 'python',
    title: 'MÔ PHỎNG TCP framing — ghép byte, không đoán ranh giới gói',
    hook: 'Bên gửi gọi `send` hai lần không có nghĩa bên nhận sẽ `recv` đúng hai message. Một frame có thể bị chẻ qua nhiều lần đọc, hoặc nhiều frame cùng tới trong một lần đọc.',
    theory:
      'TCP cung cấp byte stream có thứ tự, không giữ ranh giới message của ứng dụng. Bài dùng framing dạng `NNpayload`: header hai chữ số thập phân cho biết số ký tự ASCII của payload. Parser phải giữ buffer qua các chunk, chỉ lấy frame khi đã có đủ 2 byte header và đủ payload; một chunk có thể hoàn tất nhiều frame. Nếu peer đóng khi buffer rỗng thì kết thúc sạch; nếu còn header hoặc payload dở thì báo `truncated-frame`. Header không phải hai chữ số là `invalid-header`. Đây là MÔ PHỎNG Python trên chuỗi hữu hạn, không mở socket, không thay thế thử nghiệm TCP thật.',
    workedExample: {
      code: `# TCP byte stream MÔ PHỎNG; mỗi phần tử chỉ là một lần recv giả lập.
chunks = ["05he", "llo03one03", "two"]
buffer = ""
frames = []
for chunk in chunks:
    buffer += chunk
    while len(buffer) >= 2 and buffer[:2].isdigit():
        size = int(buffer[:2])
        if len(buffer) < 2 + size:
            break
        frames.append(buffer[2:2 + size])
        buffer = buffer[2 + size:]
    print("recv", repr(chunk), "frames", list(frames), "pending", repr(buffer))
print("close", "clean" if not buffer else "truncated-frame")`,
      stdinLines: [],
    },
    predict: {
      code: `buffer = "04ab"
buffer += "cd02XY"
frames = []
while len(buffer) >= 2:
    size = int(buffer[:2])
    if len(buffer) < size + 2: break
    frames.append(buffer[2:size + 2])
    buffer = buffer[size + 2:]
print(frames, repr(buffer))`,
      question: 'Sau khi nhận chunk thứ hai, parser thấy những frame và phần dư nào?',
      choices: ["['abcd', 'XY'] ''", "['ab', 'cd'] '02XY'", "['abcd'] '02XY'", "['04abcd02XY'] ''"],
      answerIndex: 0,
      explain:
        '`04` yêu cầu đủ bốn ký tự `abcd`; phần liền sau lại chứa trọn frame `02XY`, nên một lượt có thể tách hai frame và buffer rỗng.',
    },
    parsons: {
      prompt: 'Xếp vòng tách mọi frame đã đủ khỏi buffer của TCP stream MÔ PHỎNG.',
      lines: [
        'while len(buffer) >= 2:',
        '    if not buffer[:2].isdigit():',
        '        return "invalid-header"',
        '    size = int(buffer[:2])',
        '    if len(buffer) < 2 + size:',
        '        break',
        '    frames.append(buffer[2:2 + size])',
        '    buffer = buffer[2 + size:]',
      ],
    },
    make: {
      prompt:
        'Phân tích TCP stream MÔ PHỎNG với frame `NNpayload`, trong đó NN là đúng hai chữ số và payload ASCII dài 0..99. Đọc một dòng gồm các chunk cách nhau bởi `|`; token cuối bắt buộc là `CLOSE` và không được xuất hiện sớm hơn. Chunk rỗng hợp lệ. Sau mỗi chunk, nối vào buffer rồi lấy hết frame đủ. Khi CLOSE: buffer rỗng in `frames=<payload cách nhau bởi dấu phẩy>` và `close=clean`; buffer còn dở in thêm `close=truncated-frame`. Header sai in `invalid-header`. Không có CLOSE hoặc dữ liệu sau CLOSE in `stream-khong-hop-le`.',
      starterCode: `tokens = input().split("|")

# TCP stream MO PHONG, khong mo socket mang that.
`,
      testCases: [
        {
          stdinLines: ['05he|llo03one03|two|CLOSE'],
          expected: 'frames=hello,one,two\nclose=clean',
          match: 'contains',
          hidden: false,
          label: 'một frame bị split và hai frame bị coalesced',
        },
        {
          stdinLines: ['04ab|CLOSE'],
          expected: 'frames=\nclose=truncated-frame',
          match: 'contains',
          hidden: true,
          label: 'peer đóng khi payload còn thiếu',
        },
        {
          stdinLines: ['00|02OK|CLOSE'],
          expected: 'frames=,OK\nclose=clean',
          match: 'contains',
          hidden: true,
          label: 'frame rỗng và nhiều frame vẫn được giữ đúng thứ tự',
        },
        {
          stdinLines: ['x2bad|CLOSE'],
          expected: 'invalid-header',
          match: 'contains',
          hidden: true,
          label: 'không diễn giải header hỏng thành độ dài',
        },
      ],
      hints: [
        'Xác nhận CLOSE là token cuối duy nhất trước khi parse các chunk.',
        'Chỉ đọc size khi buffer có ít nhất hai ký tự; nếu header hợp lệ nhưng payload thiếu thì giữ nguyên buffer.',
        'Dùng vòng while vì một chunk có thể chứa nhiều frame hoàn chỉnh.',
      ],
      sampleSolution: `tokens = input().split("|")

if not tokens or tokens[-1] != "CLOSE" or "CLOSE" in tokens[:-1]:
    print("stream-khong-hop-le")
else:
    buffer = ""
    frames = []
    error = False
    for chunk in tokens[:-1]:
        if not chunk.isascii():
            print("stream-khong-hop-le")
            error = True
            break
        buffer += chunk
        while len(buffer) >= 2:
            if not buffer[:2].isdigit() or not buffer[:2].isascii():
                print("invalid-header")
                error = True
                break
            size = int(buffer[:2])
            if len(buffer) < 2 + size:
                break
            frames.append(buffer[2:2 + size])
            buffer = buffer[2 + size:]
        if error:
            break
    if not error:
        print("frames=" + ",".join(frames))
        print("close=" + ("clean" if not buffer else "truncated-frame"))`,
    },
    homework:
      'Viết bảng trace cho cùng hai frame khi stream bị chia theo ba cách khác nhau và chứng minh danh sách payload cuối không đổi. Sau đó thử client/server TCP thật trên máy cá nhân, chủ động chia một frame qua nhiều `send`; nếu không có môi trường thì ghi BLOCKED, không lấy simulator làm bằng chứng socket thật.',
    srsCards: [
      {
        hoi: 'Vì sao một lần send không tương ứng một lần recv trong TCP?',
        dap: 'TCP là byte stream: hệ điều hành và mạng có thể chẻ hoặc gộp byte; tầng ứng dụng phải tự định nghĩa và parse framing.',
      },
      {
        hoi: 'Parser nên làm gì khi đã có header nhưng payload chưa đủ?',
        dap: 'Giữ nguyên phần dở trong buffer và chờ thêm byte, không phát frame sớm và không loại bỏ header.',
      },
      {
        hoi: 'Khi nào peer close trở thành truncated-frame?',
        dap: 'Khi stream kết thúc mà buffer vẫn còn header dở hoặc một frame chưa đủ payload; buffer rỗng mới là close sạch.',
      },
    ],
  },
  {
    id: 'p6-u152-l2',
    unitId: 'p6-u152',
    language: 'python',
    title: 'MÔ PHỎNG event loop — readiness, fairness và backpressure',
    hook: 'Socket “writable” không hứa ghi hết output, còn socket chưa sẵn sàng không phải lời mời gọi thử liên tục. Event loop tốt giữ phần dư và dành ngân sách công bằng cho lượt sau.',
    theory:
      'Readiness chỉ nói một thao tác non-blocking có khả năng tiến triển, không phải completion. Mỗi connection cần output buffer riêng và giữ write-interest khi còn byte. Trong MÔ PHỎNG này, mỗi tick có một arrival và capacity writable; loop chỉ gọi write khi capacity > 0 và buffer không rỗng, ghi tối đa `min(capacity, fairness_budget, len(buffer))`, rồi giữ phần dư. Khi buffer đã chạm high-water mark, arrival mới bị backpressure thay vì làm bộ nhớ tăng vô hạn. Tick không readiness tạo `idle`, không retry trong vòng kín nên không busy-spin. Đây là state machine Python hữu hạn, không phải `select`, `poll`, `epoll` hay socket thật.',
    workedExample: {
      code: `# Event loop MÔ PHỎNG; capacity=0 nghĩa là chưa writable.
budget, high_water = 3, 6
buffer = ""
for tick, (arrival, capacity) in enumerate([("abcd", 0), ("ef", 2), ("gh", 5)], 1):
    if arrival != "-":
        if len(buffer) >= high_water: print(tick, "backpressure", arrival)
        else: buffer += arrival
    written = min(len(buffer), capacity, budget) if capacity > 0 else 0
    sent, buffer = buffer[:written], buffer[written:]
    print(tick, "sent=" + (sent or "-"), "pending=" + (buffer or "-"))`,
      stdinLines: [],
    },
    predict: {
      code: `buffer = "abcdef"
budget = 2
for capacity in [0, 5, 1]:
    written = min(len(buffer), capacity, budget) if capacity > 0 else 0
    print(written, buffer[:written] or "idle")
    buffer = buffer[written:]`,
      question: 'Ba tick lần lượt ghi bao nhiêu byte và vì sao tick đầu không quay thử lại?',
      choices: [
        '0 idle\n2 ab\n1 c',
        '0 idle\n5 abcde\n1 f',
        '2 ab\n2 cd\n1 e',
        '0 idle\n2 ab\n2 cd',
      ],
      answerIndex: 0,
      explain:
        'Capacity 0 tạo idle; tick kế bị fairness budget giới hạn còn 2 byte dù capacity là 5; tick cuối capacity chỉ cho một byte.',
    },
    parsons: {
      prompt:
        'Xếp xử lý write-ready có partial write và giữ write-interest trong event loop MÔ PHỎNG.',
      lines: [
        'if writable and output_buffer:',
        '    count = min(capacity, budget, len(output_buffer))',
        '    sent = output_buffer[:count]',
        '    output_buffer = output_buffer[count:]',
        'write_interest = bool(output_buffer)',
        'return sent, output_buffer, write_interest',
      ],
    },
    make: {
      prompt:
        'Chạy event loop MÔ PHỎNG. Dòng 1 là `high_water budget` (hai số nguyên dương). Dòng 2 là các tick cách nhau bởi `;`, mỗi tick dạng `arrival/capacity`; arrival là chuỗi ASCII không rỗng hoặc `-`, capacity là số nguyên >= 0. Trước write, chỉ nhận arrival nếu độ dài buffer hiện tại < high_water, ngược lại ghi `backpressure:<arrival>` và không thêm. Nếu capacity=0 hoặc buffer rỗng, tick ghi `idle`; nếu sẵn sàng, gửi tối đa capacity, budget và số byte đang chờ. In mỗi tick `tN=<sent hoặc idle>[,backpressure:<arrival>],pending=<buffer hoặc ->`; cuối cùng in `write-interest=yes|no`. Dữ liệu sai in `event-khong-hop-le`.',
      starterCode: `high_water, budget = map(int, input().split())
ticks = input().split(";")

# Event loop MO PHONG, khong dung select/poll/epoll hay socket that.
`,
      testCases: [
        {
          stdinLines: ['6 3', 'abcd/0;ef/2;gh/5'],
          expected:
            't1=idle,pending=abcd\nt2=ab,pending=cdef\nt3=cde,pending=fgh\nwrite-interest=yes',
          match: 'contains',
          hidden: false,
          label: 'không busy-spin, giữ partial write và áp fairness budget',
        },
        {
          stdinLines: ['4 2', 'abcd/0;XY/0;-/4;-/4'],
          expected:
            't2=idle,backpressure:XY,pending=abcd\nt3=ab,pending=cd\nt4=cd,pending=-\nwrite-interest=no',
          match: 'contains',
          hidden: true,
          label: 'high-water tạo backpressure rồi buffer được drain',
        },
        {
          stdinLines: ['10 3', 'abcdef/1;-/9'],
          expected: 't1=a,pending=bcdef\nt2=bcd,pending=ef\nwrite-interest=yes',
          match: 'contains',
          hidden: true,
          label: 'capacity và fairness cùng giới hạn partial write',
        },
        {
          stdinLines: ['0 2', 'a/1'],
          expected: 'event-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối cấu hình không dương',
        },
      ],
      hints: [
        'Kiểm high_water và budget trước khi xử lý tick; mỗi tick phải có đúng một dấu `/`.',
        'Quyết định accept/backpressure dựa trên buffer đầu tick, rồi mới xử lý write readiness.',
        'Capacity 0 không gọi write; sau mọi tick, write-interest đúng khi và chỉ khi buffer còn byte.',
      ],
      sampleSolution: `try:
    high_water, budget = map(int, input().split())
    ticks = input().split(";")
except ValueError:
    high_water, budget, ticks = 0, 0, []

parsed = []
valid = high_water > 0 and budget > 0 and bool(ticks)
for tick in ticks if valid else []:
    parts = tick.split("/")
    if len(parts) != 2 or not parts[0] or not parts[0].isascii():
        valid = False
        break
    try:
        capacity = int(parts[1])
    except ValueError:
        valid = False
        break
    if capacity < 0:
        valid = False
        break
    parsed.append((parts[0], capacity))

if not valid:
    print("event-khong-hop-le")
else:
    buffer = ""
    for index, (arrival, capacity) in enumerate(parsed, 1):
        suffix = ""
        if arrival != "-":
            if len(buffer) >= high_water:
                suffix = ",backpressure:" + arrival
            else:
                buffer += arrival
        count = min(len(buffer), capacity, budget) if capacity > 0 else 0
        sent = buffer[:count]
        buffer = buffer[count:]
        action = sent if sent else "idle"
        print("t" + str(index) + "=" + action + suffix + ",pending=" + (buffer or "-"))
    print("write-interest=" + ("yes" if buffer else "no"))`,
    },
    homework:
      'Mở rộng trace cho hai connection A/B với round-robin budget bằng nhau, chỉ ra vì sao A không thể độc chiếm loop. Sau đó đo partial write/backpressure trên server non-blocking thật nếu có môi trường; nếu không thì ghi BLOCKED và giữ ranh giới MÔ PHỎNG.',
    srsCards: [
      {
        hoi: 'Readiness khác completion thế nào?',
        dap: 'Readiness chỉ báo thao tác có thể tiến triển; một write vẫn có thể chỉ nhận một phần dữ liệu, nên phần dư phải ở lại output buffer.',
      },
      {
        hoi: 'Fairness budget bảo vệ event loop ra sao?',
        dap: 'Nó giới hạn lượng việc một connection làm trong một lượt, để connection khác cũng có cơ hội được phục vụ.',
      },
      {
        hoi: 'High-water mark tạo backpressure để làm gì?',
        dap: 'Nó tạm ngừng nhận thêm công việc khi buffer đã lớn, giới hạn bộ nhớ và truyền áp lực ngược về producer.',
      },
      {
        hoi: 'Làm sao tránh busy-spin khi socket chưa ready?',
        dap: 'Không gọi lại thao tác trong vòng kín; trả quyền cho poller và chỉ thử ở tick readiness tiếp theo.',
      },
    ],
  },
]
