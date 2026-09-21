import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U263_LESSONS = [
  embeddedSimulation({
    id: 'p6-u263-l1',
    unitId: 'p6-u263',
    title: 'khung dữ liệu có checksum trên kênh có thể lỗi',
    hook: 'Một bit lật trên đường truyền biến số đo 25 độ thành 89 độ — và không có gì trong dữ liệu tự nói rằng nó đã sai.',
    theory:
      'Khung dữ liệu mang theo một checksum tính từ chính payload; bên nhận tính lại và so. Lệch là bằng chứng khung đã hỏng, nên phải reject và KHÔNG xử lý payload — xử lý một nửa dữ liệu hỏng còn tệ hơn mất trọn khung. Checksum ở đây là tổng byte lấy dư 256, đủ để dạy cơ chế; giao thức thật dùng CRC mạnh hơn.',
    workedCode:
      '# MÔ PHỎNG kiểm checksum\npayload, got = "AB", 131\ntinh = sum(payload.encode()) % 256\nprint("allow: frame accepted" if tinh == got else "reject: bad checksum")',
    predictCode:
      'payload, got = "AB", 7\ntinh = sum(payload.encode()) % 256\nprint("allow: frame accepted" if tinh == got else "reject: bad checksum")',
    predictChoices: ['reject: bad checksum', 'allow: frame accepted', 'unknown: no checksum'],
    predictAnswer: 0,
    predictExplain:
      'Tổng mã byte của "AB" là 65 + 66 = 131, không khớp 7, nên khung bị coi là hỏng và payload không được dùng.',
    makePrompt:
      'Đọc `payload:<chữ và số>,checksum:<số>`. Thiếu trường, payload rỗng hoặc checksum sai kiểu / ngoài 0–255 → `invalid: <trường>`; tổng mã byte của payload lấy dư 256 khác checksum → `reject: bad checksum`; khớp → `allow: frame accepted`. MÔ PHỎNG, không mở socket hay cổng nối tiếp thật.',
    testCases: [
      {
        stdinLines: ['payload:AB,checksum:131'],
        expected: 'allow: frame accepted',
        hidden: false,
        label: 'checksum khớp thì khung được nhận',
      },
      {
        stdinLines: ['payload:AB,checksum:7'],
        expected: 'reject: bad checksum',
        hidden: true,
        label: 'checksum lệch thì bỏ nguyên khung',
      },
      {
        stdinLines: ['payload:A,checksum:65'],
        expected: 'allow: frame accepted',
        hidden: true,
        label: 'khung một byte vẫn theo đúng công thức',
      },
      {
        stdinLines: ['payload:AB,checksum:999'],
        expected: 'invalid: checksum',
        hidden: true,
        label: 'ca âm — checksum ngoài một byte fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"payload", "checksum"}: print("invalid: field")\n    elif not m["payload"].isalnum(): print("invalid: payload")\n    elif not m["checksum"].isdigit() or int(m["checksum"]) > 255: print("invalid: checksum")\n    elif sum(m["payload"].encode()) % 256 != int(m["checksum"]): print("reject: bad checksum")\n    else: print("allow: frame accepted")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Chọn một giao thức nhúng thật NGOÀI sandbox (Modbus RTU chẳng hạn), đọc phần mô tả trường kiểm lỗi của nó và ghi lại nó bắt được loại lỗi nào, bỏ sót loại nào.',
    cards: [
      {
        hoi: 'Vì sao checksum lệch thì bỏ nguyên khung chứ không sửa?',
        dap: 'Checksum chỉ phát hiện lỗi, không đủ thông tin để chỉ ra bit nào sai; đoán để sửa sẽ tạo ra dữ liệu trông đúng nhưng sai.',
      },
      {
        hoi: 'Tổng byte yếu hơn CRC ở điểm nào?',
        dap: 'Tổng byte không phát hiện được việc đổi chỗ hai byte và nhiều mẫu lỗi nhiều bit, còn CRC thì có.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u263-l2',
    unitId: 'p6-u263',
    title: 'đệm cục bộ khi mất kết nối và gửi bù khi nối lại',
    hook: 'Thiết bị ngoài hiện trường mất sóng ba ngày — dữ liệu ba ngày đó nằm ở đâu là quyết định thiết kế, không phải may rủi.',
    theory:
      'Khi mất kết nối, số đo vào hàng đợi cục bộ có trần cố định. Hàng đợi đầy thì phải có chính sách rơi rụng tường minh: giữ bản ghi mới nhất, bỏ bản cũ nhất, vì dữ liệu mới thường giá trị hơn cho việc điều khiển. Khi nối lại, gửi theo đúng thứ tự và chỉ xoá khỏi hàng đợi sau khi phía nhận xác nhận — xoá trước khi có xác nhận là mất dữ liệu ngay lần rớt gói kế tiếp.',
    workedCode:
      '# MÔ PHỎNG chính sách rơi rụng khi hàng đợi đầy\nlink, queue, cap = "down", 20, 20\nprint("allow: drop oldest keep newest" if link == "down" and queue >= cap else "allow: buffered")',
    predictCode:
      'link, ack = "up", "no"\nprint("refuse: awaiting ack" if link == "up" and ack == "no" else "allow: flushed in order")',
    predictChoices: ['refuse: awaiting ack', 'allow: flushed in order', 'allow: buffered'],
    predictAnswer: 0,
    predictExplain:
      'Chưa có xác nhận từ phía nhận thì bản ghi vẫn phải nằm trong hàng đợi; xoá sớm là mất dữ liệu không phục hồi được.',
    makePrompt:
      'Đọc `link:<up|down>,queue:<số>,cap:<số>,ack:<yes|no>`. Sai kiểu, thiếu trường hoặc giá trị lạ → `invalid: <trường>`; link down và queue >= cap → `allow: drop oldest keep newest`; link down → `allow: buffered`; link up và ack no → `refuse: awaiting ack`; còn lại → `allow: flushed in order`. MÔ PHỎNG, không có mạng thật.',
    testCases: [
      {
        stdinLines: ['link:up,queue:3,cap:20,ack:yes'],
        expected: 'allow: flushed in order',
        hidden: false,
        label: 'nối lại và đã có xác nhận thì xoá khỏi hàng đợi',
      },
      {
        stdinLines: ['link:down,queue:3,cap:20,ack:no'],
        expected: 'allow: buffered',
        hidden: true,
        label: 'mất kết nối thì đệm cục bộ',
      },
      {
        stdinLines: ['link:down,queue:20,cap:20,ack:no'],
        expected: 'allow: drop oldest keep newest',
        hidden: true,
        label: 'hàng đợi đầy thì rơi rụng theo chính sách tường minh',
      },
      {
        stdinLines: ['link:flaky,queue:3,cap:20,ack:yes'],
        expected: 'invalid: link',
        hidden: true,
        label: 'ca âm — trạng thái kết nối không nhận dạng được fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"link", "queue", "cap", "ack"}: print("invalid: field")\n    elif m["link"] not in {"up", "down"}: print("invalid: link")\n    elif not m["queue"].isdigit(): print("invalid: queue")\n    elif not m["cap"].isdigit(): print("invalid: cap")\n    elif m["ack"] not in {"yes", "no"}: print("invalid: ack")\n    elif m["link"] == "down" and int(m["queue"]) >= int(m["cap"]): print("allow: drop oldest keep newest")\n    elif m["link"] == "down": print("allow: buffered")\n    elif m["ack"] == "no": print("refuse: awaiting ack")\n    else: print("allow: flushed in order")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Với thiết bị thật NGOÀI sandbox, tính xem bộ nhớ flash còn trống chứa được bao nhiêu bản ghi ở tần suất đo hiện tại, quy ra số ngày mất sóng chịu được, rồi ghi con số đó vào tài liệu thiết kế.',
    cards: [
      {
        hoi: 'Vì sao hàng đợi cục bộ phải có trần?',
        dap: 'Bộ nhớ thiết bị hữu hạn; hàng đợi không trần sẽ hết bộ nhớ và làm sập firmware thay vì mất vài bản ghi cũ.',
      },
      {
        hoi: 'Khi nào được xoá bản ghi khỏi hàng đợi gửi bù?',
        dap: 'Chỉ sau khi phía nhận xác nhận đã lưu; trước đó bản ghi vẫn có thể phải gửi lại.',
      },
    ],
  }),
]
