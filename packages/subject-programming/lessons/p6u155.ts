import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U155_LESSONS = [
  devopsSimulation({
    id: 'p6-u155-l1',
    unitId: 'p6-u155',
    title: 'ladder DNS, TCP, TLS và HTTP',
    hook: 'Một URL không mở được không đồng nghĩa ứng dụng hỏng: tên miền, port, TLS và HTTP là các tầng kiểm tra khác nhau.',
    theory:
      'Chẩn đoán đi từ DNS sang TCP, TLS rồi HTTP; failure ở tầng trước làm kết quả tầng sau chưa biết. Đây không phải dig, curl hay handshake TLS thật.',
    workedCode: '# MÔ PHỎNG ladder\nsteps = ["dns:ok", "tcp:ok", "tls:expired"]\nprint(steps[-1])',
    predictCode: 'dns = False\nprint("dns:fail" if not dns else "tcp:kiem")',
    predictChoices: ['dns:fail', 'tcp:kiem', 'http:500'],
    predictAnswer: 0,
    predictExplain: 'DNS fail dừng ladder; không được kết luận về TCP hay HTTP.',
    makePrompt:
      'Đọc `dns`, `tcp`, `tls` hoặc `http` để chỉ ra tầng fail đầu tiên của trace giả định: `dns` → `dns:fail`; `tcp` → `dns:ok\\ntcp:fail`; `tls` → `dns:ok\\ntcp:ok\\ntls:fail`; `http` → `dns:ok\\ntcp:ok\\ntls:ok\\nhttp:fail`. Lệnh khác `tu-choi`. MÔ PHỎNG, không truy vấn mạng.',
    testCases: [
      {
        stdinLines: ['tls'],
        expected: 'dns:ok\ntcp:ok\ntls:fail',
        match: 'exact',
        hidden: false,
        label: 'TLS chỉ kiểm sau DNS và TCP',
      },
      {
        stdinLines: ['dns'],
        expected: 'dns:fail',
        match: 'exact',
        hidden: true,
        label: 'dừng tại DNS',
      },
    ],
    sampleSolution:
      'x = input().strip()\ntrace = {"dns": "dns:fail", "tcp": "dns:ok\\ntcp:fail", "tls": "dns:ok\\ntcp:ok\\ntls:fail", "http": "dns:ok\\ntcp:ok\\ntls:ok\\nhttp:fail"}\nprint(trace.get(x, "tu-choi"))',
    homework:
      'Trên domain thử nghiệm, chạy lần lượt công cụ DNS, TCP, TLS và HTTP; lưu output đã che hostname/IP nhạy cảm nếu có.',
    cards: [
      {
        hoi: 'Khi DNS fail, có thể kết luận TLS fail không?',
        dap: 'Không. TLS chưa được kiểm vì ladder dừng ở DNS.',
      },
      {
        hoi: 'Ladder chẩn đoán có ích gì?',
        dap: 'Ngăn đoán mò và ghi đúng evidence theo từng tầng.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u155-l2',
    unitId: 'p6-u155',
    title: 'proxy, allow-list port và hạn TLS',
    hook: 'Mở port ứng dụng ra Internet để “cho chạy được” tạo một bề mặt tấn công không có lý do ghi lại.',
    theory:
      'Firewall allow-list kiểm trước proxy; proxy chỉ route request sau cổng được phép. TLS expired phải fail closed, không được đổi thành HTTP thành công trong mô hình.',
    workedCode:
      '# MÔ PHỎNG policy\nallowed = {443}\nport = 8080\nprint("blocked" if port not in allowed else "proxy")',
    predictCode: 'tls_days = 0\nprint("tls:expired" if tls_days <= 0 else "http:ok")',
    predictChoices: ['tls:expired', 'http:ok', 'proxy:open-all'],
    predictAnswer: 0,
    predictExplain: 'Chứng chỉ hết hạn là failure TLS; mô hình không bypass để gọi HTTP.',
    makePrompt:
      'Đọc `port:<n>:<reason>:<days>`. Chỉ port 443 với reason không rỗng mới tới TLS; port khác in `blocked:port`. Với 443, days <= 0 in `tls:expired`, còn lại `proxy:http-ok`. Input sai in `tu-choi`. MÔ PHỎNG, không cấu hình firewall/Nginx/TLS.',
    testCases: [
      {
        stdinLines: ['port:443:https:30'],
        expected: 'proxy:http-ok',
        match: 'exact',
        hidden: false,
        label: 'HTTPS được allow có hạn hợp lệ',
      },
      {
        stdinLines: ['port:8080:app:30'],
        expected: 'blocked:port',
        match: 'exact',
        hidden: true,
        label: 'app port không được public',
      },
    ],
    sampleSolution:
      'try:\n    _, port, reason, days = input().strip().split(":")\n    if int(port) != 443 or not reason: print("blocked:port")\n    elif int(days) <= 0: print("tls:expired")\n    else: print("proxy:http-ok")\nexcept ValueError: print("tu-choi")',
    homework:
      'Trên host thử, tài liệu hóa mỗi port public và lý do; kiểm TLS expiry và diễn tập renewal không làm gián đoạn.',
    cards: [
      {
        hoi: 'Vì sao app port không nên public mặc định?',
        dap: 'Proxy/firewall cần một allow-list rõ để giảm bề mặt tấn công.',
      },
      {
        hoi: 'TLS hết hạn cho biết gì?',
        dap: 'Kết nối bảo mật không còn hợp lệ; không được suy ra HTTP phía sau healthy.',
      },
    ],
  }),
]
