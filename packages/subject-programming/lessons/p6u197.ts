import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U197_LESSONS = [
  devopsSimulation({
    id: 'p6-u197-l1',
    unitId: 'p6-u197',
    title: 'SLI/SLO, error budget và quyết định đóng băng phát hành',
    hook: 'Error budget biến câu hỏi cảm tính "có nên deploy nữa không" thành một con số cả đội đồng ý trước.',
    theory:
      'Simulator tính tỉ lệ hỏng trên cửa sổ đo rồi so với error budget suy ra từ SLO. Cửa sổ ít mẫu hơn ngưỡng tối thiểu trả unknown — CẤM quy về 0 rồi gọi là khoẻ mạnh. SLO 100% là mục tiêu không đạt được nên bị coi là invalid. Budget cạn thì freeze phát hành cho tới khi hồi lại. Đây không phải hệ SLO production.',
    workedCode:
      '# MÔ PHỎNG error budget\nslo, samples, bad = 99, 1000, 200\nprint("freeze: error budget can, burn rate vuot nguong" if bad / samples > (100 - slo) / 100 else "allow: phat hanh")',
    predictCode:
      'samples = 10\nprint("unknown: khong du mau" if samples < 100 else "allow: phat hanh")',
    predictChoices: ['unknown: khong du mau', 'allow: phat hanh', 'slo: healthy'],
    predictAnswer: 0,
    predictExplain:
      'Ít mẫu hơn ngưỡng tối thiểu thì chưa kết luận được gì; trả unknown thay vì tự nhận là khoẻ mạnh.',
    makePrompt:
      'Đọc `slo:<1-100>,samples:<số>,bad:<số>`. Thiếu trường, sai kiểu hoặc bad > samples → `invalid: <trường>`; slo = 100 → `invalid: slo`; samples < 100 → `unknown: khong du mau`; tỉ lệ hỏng vượt error budget → `freeze: error budget can, burn rate vuot nguong`; còn lại → `allow: phat hanh`. MÔ PHỎNG, không đọc hệ SLO hay dữ liệu production thật.',
    testCases: [
      {
        stdinLines: ['slo:99,samples:1000,bad:1'],
        expected: 'allow: phat hanh',
        hidden: false,
        label: 'còn budget thì phát hành bình thường',
      },
      {
        stdinLines: ['slo:99,samples:1000,bad:200'],
        expected: 'freeze: error budget can',
        hidden: true,
        label: 'burn rate vượt ngưỡng thì đóng băng phát hành',
      },
      {
        stdinLines: ['slo:99,samples:10,bad:0'],
        expected: 'unknown: khong du mau',
        hidden: true,
        label: 'ca âm — cửa sổ ít mẫu không được gọi là khoẻ mạnh',
      },
      {
        stdinLines: ['slo:100,samples:1000,bad:0'],
        expected: 'invalid: slo',
        hidden: true,
        label: 'ca âm — SLO 100% là mục tiêu không đạt được',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"slo", "samples", "bad"}: print("invalid: field")\n    elif not m["slo"].isdigit() or not 1 <= int(m["slo"]) <= 100: print("invalid: slo")\n    elif not m["samples"].isdigit(): print("invalid: samples")\n    elif not m["bad"].isdigit() or int(m["bad"]) > int(m["samples"]): print("invalid: bad")\n    elif int(m["slo"]) == 100: print("invalid: slo")\n    elif int(m["samples"]) < 100: print("unknown: khong du mau")\n    elif int(m["bad"]) / int(m["samples"]) > (100 - int(m["slo"])) / 100: print("freeze: error budget can, burn rate vuot nguong")\n    else: print("allow: phat hanh")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Chọn một dịch vụ thật bạn vận hành, định nghĩa một SLI đo được, đặt SLO dưới 100% và tính error budget còn lại trong 30 ngày qua từ dữ liệu thật.',
    cards: [
      {
        hoi: 'Vì sao SLO không bao giờ nên đặt là 100%?',
        dap: 'Không hệ thống nào đạt 100%; đặt như vậy khiến error budget bằng 0, mọi thay đổi đều vi phạm và chỉ số mất tác dụng ra quyết định.',
      },
      {
        hoi: 'Tốc độ đốt error budget dùng để làm gì?',
        dap: 'Nó cho biết budget sẽ cạn trong bao lâu nếu tình trạng hiện tại tiếp diễn, để chọn giữa cảnh báo, giảm tốc phát hành hay đóng băng.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u197-l2',
    unitId: 'p6-u197',
    title: 'thí nghiệm chaos có kiểm soát',
    hook: 'Giết một node để "thử xem sao" không phải chaos engineering — đó chỉ là một sự cố do bạn tự gây ra.',
    theory:
      'Một thí nghiệm chaos chỉ được duyệt khi có đủ ba thứ: giả thuyết về trạng thái ổn định, bán kính ảnh hưởng (blast radius) đủ hẹp và điều kiện dừng (abort) rõ ràng. Thiếu bất cứ thứ nào thì refuse. Đây là bảng quyết định MÔ PHỎNG, không hề tiêm lỗi vào bất kỳ hệ thống nào.',
    workedCode:
      '# MÔ PHỎNG cong duyet chaos\nhypothesis = "no"\nprint("refuse: thieu gia thuyet trang thai on dinh" if hypothesis == "no" else "allow: chay thi nghiem chaos")',
    predictCode:
      'abort = "no"\nprint("refuse: thieu dieu kien dung abort" if abort == "no" else "allow: chay thi nghiem chaos")',
    predictChoices: [
      'refuse: thieu dieu kien dung abort',
      'allow: chay thi nghiem chaos',
      'chaos: injected',
    ],
    predictAnswer: 0,
    predictExplain:
      'Không có điều kiện dừng thì thí nghiệm không dừng được khi hỏng, nên cổng duyệt từ chối.',
    makePrompt:
      'Đọc `hypothesis:<yes|no>,blast:<số>,abort:<yes|no>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; hypothesis no → `refuse: thieu gia thuyet trang thai on dinh`; abort no → `refuse: thieu dieu kien dung abort`; blast > 10 → `refuse: blast radius qua rong`; còn lại → `allow: chay thi nghiem chaos`. MÔ PHỎNG, KHÔNG tiêm lỗi vào hệ thống nào.',
    testCases: [
      {
        stdinLines: ['hypothesis:yes,blast:5,abort:yes'],
        expected: 'allow: chay thi nghiem chaos',
        hidden: false,
        label: 'đủ giả thuyết, bán kính hẹp và điều kiện dừng',
      },
      {
        stdinLines: ['hypothesis:no,blast:5,abort:yes'],
        expected: 'refuse: thieu gia thuyet trang thai on dinh',
        hidden: true,
        label: 'thiếu giả thuyết thì không phải thí nghiệm',
      },
      {
        stdinLines: ['hypothesis:yes,blast:50,abort:yes'],
        expected: 'refuse: blast radius qua rong',
        hidden: true,
        label: 'ca âm — bán kính ảnh hưởng quá rộng',
      },
      {
        stdinLines: ['hypothesis:yes,blast:5,abort:no'],
        expected: 'refuse: thieu dieu kien dung abort',
        hidden: true,
        label: 'ca âm — không có điều kiện dừng',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"hypothesis", "blast", "abort"}: print("invalid: field")\n    elif m["hypothesis"] not in {"yes", "no"}: print("invalid: hypothesis")\n    elif not m["blast"].isdigit(): print("invalid: blast")\n    elif m["abort"] not in {"yes", "no"}: print("invalid: abort")\n    elif m["hypothesis"] == "no": print("refuse: thieu gia thuyet trang thai on dinh")\n    elif m["abort"] == "no": print("refuse: thieu dieu kien dung abort")\n    elif int(m["blast"]) > 10: print("refuse: blast radius qua rong")\n    else: print("allow: chay thi nghiem chaos")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Viết đề cương cho một thí nghiệm chaos thật trên môi trường staging: giả thuyết trạng thái ổn định, bán kính ảnh hưởng, điều kiện dừng và người có quyền dừng thí nghiệm.',
    cards: [
      {
        hoi: 'Vì sao thí nghiệm chaos cần giả thuyết trạng thái ổn định?',
        dap: 'Không có giả thuyết thì không có tiêu chí để nói thí nghiệm thành công hay hệ thống đã hỏng, và việc gây lỗi không mang lại kết luận nào.',
      },
      {
        hoi: 'Bán kính ảnh hưởng hẹp giúp gì?',
        dap: 'Nó giới hạn số người dùng chịu rủi ro nếu giả thuyết sai, để bài học thu được không phải trả bằng một sự cố diện rộng.',
      },
    ],
  }),
]
