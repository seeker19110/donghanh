import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U267_LESSONS = [
  embeddedSimulation({
    id: 'p6-u267-l1',
    unitId: 'p6-u267',
    title: 'lớp trừu tượng phần cứng và test không xác định',
    hook: 'Test chạm thẳng thanh ghi thì chỉ chạy được khi có bo mạch cắm vào máy — tức là không chạy trong CI bao giờ.',
    theory:
      'Lớp trừu tượng phần cứng (HAL) là ranh giới duy nhất giữa logic và thanh ghi; test gọi qua HAL thì thay được bằng bản giả lập ghi log mọi lệnh gọi, nên chạy được trên máy CI không có phần cứng. Test bỏ qua HAL phải bị chặn ngay ở khâu duyệt. Test cần lặp nhiều lần mới ổn định là test không xác định — nó không chứng minh gì, phải tách ra cô lập thay vì lặp cho tới khi xanh.',
    workedCode:
      '# MÔ PHỎNG chặn test bỏ qua HAL\nvia = "register"\nprint("deny: bypasses HAL" if via == "register" else "allow: test accepted")',
    predictCode:
      'retries, k = 7, 3\nprint("refuse: flaky, needs isolation" if retries > k else "allow: test accepted")',
    predictChoices: [
      'refuse: flaky, needs isolation',
      'allow: test accepted',
      'deny: bypasses HAL',
    ],
    predictAnswer: 0,
    predictExplain:
      'Cần 7 lần lặp mới ổn định trong khi ngưỡng là 3, nên kết quả xanh của nó không phải bằng chứng về phần mềm.',
    makePrompt:
      'Đọc `via:<hal|register>,retries:<số>,k:<số>`. Sai kiểu, thiếu trường hoặc giá trị lạ → `invalid: <trường>`; via register → `deny: bypasses HAL`; retries > k → `refuse: flaky, needs isolation`; còn lại → `allow: test accepted`. MÔ PHỎNG, không chạy test trên bo mạch thật.',
    testCases: [
      {
        stdinLines: ['via:hal,retries:1,k:3'],
        expected: 'allow: test accepted',
        hidden: false,
        label: 'gọi qua HAL và ổn định ngay lần đầu',
      },
      {
        stdinLines: ['via:register,retries:1,k:3'],
        expected: 'deny: bypasses HAL',
        hidden: true,
        label: 'test chạm thẳng thanh ghi bị chặn',
      },
      {
        stdinLines: ['via:hal,retries:7,k:3'],
        expected: 'refuse: flaky, needs isolation',
        hidden: true,
        label: 'test không xác định phải tách ra cô lập',
      },
      {
        stdinLines: ['via:driver,retries:1,k:3'],
        expected: 'invalid: via',
        hidden: true,
        label: 'ca âm — đường gọi không khai báo fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"via", "retries", "k"}: print("invalid: field")\n    elif m["via"] not in {"hal", "register"}: print("invalid: via")\n    elif not m["retries"].isdigit(): print("invalid: retries")\n    elif not m["k"].isdigit(): print("invalid: k")\n    elif m["via"] == "register": print("deny: bypasses HAL")\n    elif int(m["retries"]) > int(m["k"]): print("refuse: flaky, needs isolation")\n    else: print("allow: test accepted")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trong dự án nhúng thật NGOÀI sandbox, tách một driver ra sau một giao diện HAL rồi viết bản giả lập ghi log lệnh gọi; chạy bộ test trên máy không cắm phần cứng và ghi lại số test chạy được.',
    cards: [
      {
        hoi: 'Bản giả lập HAL cần ghi log làm gì?',
        dap: 'Để test khẳng định được ĐÚNG chuỗi lệnh đã gửi xuống phần cứng, chứ không chỉ khẳng định hàm chạy xong không lỗi.',
      },
      {
        hoi: 'Vì sao lặp test cho tới khi xanh là sai?',
        dap: 'Nó biến một dấu hiệu lỗi thật thành tiếng ồn bị bỏ qua, và che mất đúng loại lỗi khó nhất: lỗi phụ thuộc thời điểm.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u267-l2',
    unitId: 'p6-u267',
    title: 'dải môi trường thử nghiệm và giới hạn của kết luận',
    hook: 'Thiết bị chạy tốt ở 25 độ trong phòng không nói gì về việc nó chạy ra sao ở 60 độ trong tủ điện.',
    theory:
      'Mỗi phần cứng có dải nhiệt độ hoạt động ghi trong tài liệu. Kết quả thử ngoài dải đó không chứng minh được thiết bị tốt hay xấu — nó chỉ nằm ngoài phạm vi nhà sản xuất cam kết, nên kết luận trung thực là unknown. Nói "đã thử, không sao" cho một điều kiện ngoài dải là tuyên bố vượt quá bằng chứng.',
    workedCode:
      '# MÔ PHỎNG dải nhiệt độ hoạt động\ntemp, tmin, tmax = 70, -10, 60\nprint("unknown: outside rated envelope" if temp < tmin or temp > tmax else "allow: within envelope")',
    predictCode:
      'temp, tmin, tmax = 25, -10, 60\nprint("unknown: outside rated envelope" if temp < tmin or temp > tmax else "allow: within envelope")',
    predictChoices: ['allow: within envelope', 'unknown: outside rated envelope', 'invalid: temp'],
    predictAnswer: 0,
    predictExplain: '25 độ nằm trong dải từ -10 tới 60 nên kết quả thử có giá trị kết luận.',
    makePrompt:
      'Đọc `temp:<số nguyên, có thể âm>,tmin:<số nguyên>,tmax:<số nguyên>`. Sai kiểu, thiếu trường hoặc tmin > tmax → `invalid: <trường>`; temp ngoài [tmin, tmax] → `unknown: outside rated envelope`; còn lại → `allow: within envelope`. MÔ PHỎNG, không có buồng thử nhiệt thật.',
    testCases: [
      {
        stdinLines: ['temp:25,tmin:-10,tmax:60'],
        expected: 'allow: within envelope',
        hidden: false,
        label: 'trong dải khai báo thì kết luận có giá trị',
      },
      {
        stdinLines: ['temp:70,tmin:-10,tmax:60'],
        expected: 'unknown: outside rated envelope',
        hidden: true,
        label: 'vượt trần nhiệt độ thì cấm kết luận',
      },
      {
        stdinLines: ['temp:-20,tmin:-10,tmax:60'],
        expected: 'unknown: outside rated envelope',
        hidden: true,
        label: 'dưới sàn nhiệt độ cũng ngoài phạm vi cam kết',
      },
      {
        stdinLines: ['temp:25,tmin:60,tmax:-10'],
        expected: 'invalid: tmin',
        hidden: true,
        label: 'ca âm — dải đảo ngược fail closed',
      },
    ],
    sampleSolution:
      'KEYS = ("temp", "tmin", "tmax")\n\n\ndef so_nguyen(s):\n    return s.lstrip("-").isdigit() and s not in {"", "-"}\n\n\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(KEYS): print("invalid: field")\n    elif not all(so_nguyen(m[k]) for k in KEYS):\n        print("invalid: " + next(k for k in KEYS if not so_nguyen(m[k])))\n    elif int(m["tmin"]) > int(m["tmax"]): print("invalid: tmin")\n    elif not (int(m["tmin"]) <= int(m["temp"]) <= int(m["tmax"])): print("unknown: outside rated envelope")\n    else: print("allow: within envelope")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Tra dải nhiệt độ hoạt động của từng linh kiện trên mạch thật của bạn NGOÀI sandbox, tìm linh kiện có dải hẹp nhất, và ghi lại dải đó thành dải cam kết của cả thiết bị.',
    cards: [
      {
        hoi: 'Dải hoạt động của thiết bị được quyết định bởi gì?',
        dap: 'Bởi linh kiện có dải hẹp nhất trên mạch — cả thiết bị không thể cam kết rộng hơn mắt xích yếu nhất.',
      },
      {
        hoi: 'Vì sao kết quả thử ngoài dải là unknown chứ không phải đạt?',
        dap: 'Vì ngoài dải thì nhà sản xuất không cam kết gì; một lần chạy tốt có thể chỉ là may mắn của riêng mẫu đó.',
      },
    ],
  }),
]
