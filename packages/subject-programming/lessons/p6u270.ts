import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U270_LESSONS = [
  embeddedSimulation({
    id: 'p6-u270-l1',
    unitId: 'p6-u270',
    title: 'nạp firmware và hiệu chuẩn tại xưởng',
    hook: 'Nguyên mẫu chạy được là một chuyện; nạp đúng cho một nghìn máy, mỗi máy một bộ số hiệu chuẩn riêng, là chuyện hoàn toàn khác.',
    theory:
      'Trạm nạp tại xưởng phải kiểm phiên bản phần cứng của bo mạch khớp với firmware trước khi ghi — firmware của đời bo khác sẽ chạy sai chân, sai ngoại vi. Số hiệu chuẩn (calibration) là dữ liệu riêng của từng máy, đo một lần và không tái tạo được, nên ghi đè lên ô nhớ đã có số hợp lệ phải hỏi xác nhận thay vì làm lặng lẽ.',
    workedCode:
      '# MÔ PHỎNG kiểm phiên bản phần cứng\nfw_hw, board_hw = "rev2", "rev3"\nprint("deny: version mismatch" if fw_hw != board_hw else "allow: flash and calibrate")',
    predictCode:
      'cell, confirm = "valid", "no"\nprint("reject: calibration would overwrite" if cell == "valid" and confirm == "no" else "allow: flash and calibrate")',
    predictChoices: [
      'reject: calibration would overwrite',
      'allow: flash and calibrate',
      'deny: version mismatch',
    ],
    predictAnswer: 0,
    predictExplain:
      'Ô nhớ đã có số hiệu chuẩn hợp lệ và chưa ai xác nhận ghi đè; số đó đo một lần, mất là mất hẳn.',
    makePrompt:
      'Đọc `fw_hw:<mã>,board_hw:<mã>,cell:<empty|valid>,confirm:<yes|no>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; fw_hw khác board_hw → `deny: version mismatch`; cell valid và confirm no → `reject: calibration would overwrite`; còn lại → `allow: flash and calibrate`. MÔ PHỎNG, không nạp máy thật.',
    testCases: [
      {
        stdinLines: ['fw_hw:rev3,board_hw:rev3,cell:empty,confirm:no'],
        expected: 'allow: flash and calibrate',
        hidden: false,
        label: 'đúng đời bo và ô hiệu chuẩn còn trống',
      },
      {
        stdinLines: ['fw_hw:rev2,board_hw:rev3,cell:empty,confirm:no'],
        expected: 'deny: version mismatch',
        hidden: true,
        label: 'firmware sai đời phần cứng',
      },
      {
        stdinLines: ['fw_hw:rev3,board_hw:rev3,cell:valid,confirm:no'],
        expected: 'reject: calibration would overwrite',
        hidden: true,
        label: 'ghi đè số hiệu chuẩn chưa xác nhận',
      },
      {
        stdinLines: ['fw_hw:rev3,board_hw:rev3,cell:unknown,confirm:no'],
        expected: 'invalid: cell',
        hidden: true,
        label: 'ca âm — trạng thái ô nhớ mơ hồ fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"fw_hw", "board_hw", "cell", "confirm"}: print("invalid: field")\n    elif not m["fw_hw"].isalnum(): print("invalid: fw_hw")\n    elif not m["board_hw"].isalnum(): print("invalid: board_hw")\n    elif m["cell"] not in {"empty", "valid"}: print("invalid: cell")\n    elif m["confirm"] not in {"yes", "no"}: print("invalid: confirm")\n    elif m["fw_hw"] != m["board_hw"]: print("deny: version mismatch")\n    elif m["cell"] == "valid" and m["confirm"] == "no": print("reject: calibration would overwrite")\n    else: print("allow: flash and calibrate")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Viết quy trình trạm nạp cho dự án thật NGOÀI sandbox: đọc mã đời bo thế nào, lưu số hiệu chuẩn ở đâu, sao lưu số đó ra ngoài máy ra sao để mất bo vẫn khôi phục được.',
    cards: [
      {
        hoi: 'Vì sao số hiệu chuẩn phải sao lưu ra ngoài thiết bị?',
        dap: 'Vì nó đo một lần bằng thiết bị chuẩn tại xưởng; mất mà không có bản sao thì phải mang máy về hiệu chuẩn lại.',
      },
      {
        hoi: 'Mã đời phần cứng nên đọc từ đâu?',
        dap: 'Từ chính bo mạch — điện trở mã hoá chân hoặc ô nhớ một lần ghi — chứ không từ người thao tác chọn tay.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u270-l2',
    unitId: 'p6-u270',
    title: 'ngân sách thời gian một trạm xưởng',
    hook: 'Thêm 20 giây kiểm mỗi máy nghe như không đáng kể, cho tới khi nhân với mười nghìn máy.',
    theory:
      'Mỗi trạm trong dây chuyền có ngân sách thời gian cho một máy; tổng thời gian nạp cộng kiểm vượt ngân sách thì trạm đó thành nút thắt và cả dây chuyền chạy theo nhịp của nó. Từ chối tường minh ở khâu thiết kế quy trình rẻ hơn nhiều so với phát hiện lúc đã chạy sản lượng.',
    workedCode:
      '# MÔ PHỎNG ngân sách trạm\nflash_s, test_s, budget_s = 40, 25, 60\nprint("refuse: exceeds station budget" if flash_s + test_s > budget_s else "allow: station ok")',
    predictCode:
      'flash_s, test_s, budget_s = 20, 25, 60\nprint("refuse: exceeds station budget" if flash_s + test_s > budget_s else "allow: station ok")',
    predictChoices: ['allow: station ok', 'refuse: exceeds station budget', 'invalid: budget_s'],
    predictAnswer: 0,
    predictExplain: 'Tổng 45 giây vẫn dưới ngân sách 60 giây nên trạm không thành nút thắt.',
    makePrompt:
      'Đọc `flash_s:<số>,test_s:<số>,budget_s:<số>`. Sai kiểu, thiếu trường hoặc budget_s bằng 0 → `invalid: <trường>`; flash_s + test_s > budget_s → `refuse: exceeds station budget`; còn lại → `allow: station ok`. MÔ PHỎNG, không đo dây chuyền thật.',
    testCases: [
      {
        stdinLines: ['flash_s:20,test_s:25,budget_s:60'],
        expected: 'allow: station ok',
        hidden: false,
        label: 'tổng thời gian còn trong ngân sách trạm',
      },
      {
        stdinLines: ['flash_s:40,test_s:25,budget_s:60'],
        expected: 'refuse: exceeds station budget',
        hidden: true,
        label: 'trạm thành nút thắt của dây chuyền',
      },
      {
        stdinLines: ['flash_s:35,test_s:25,budget_s:60'],
        expected: 'allow: station ok',
        hidden: true,
        label: 'vừa đúng ngân sách vẫn chạy được',
      },
      {
        stdinLines: ['flash_s:20,test_s:25,budget_s:0'],
        expected: 'invalid: budget_s',
        hidden: true,
        label: 'ca âm — ngân sách bằng 0 là cấu hình vô nghĩa',
      },
    ],
    sampleSolution:
      'KEYS = ("flash_s", "test_s", "budget_s")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(KEYS): print("invalid: field")\n    elif not all(m[k].isdigit() for k in KEYS):\n        print("invalid: " + next(k for k in KEYS if not m[k].isdigit()))\n    elif int(m["budget_s"]) == 0: print("invalid: budget_s")\n    elif int(m["flash_s"]) + int(m["test_s"]) > int(m["budget_s"]): print("refuse: exceeds station budget")\n    else: print("allow: station ok")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Bấm giờ từng bước nạp và kiểm trên một máy thật NGOÀI sandbox, lập bảng bước × giây, rồi chỉ ra bước nào cắt được mà không giảm độ phủ kiểm.',
    cards: [
      {
        hoi: 'Nút thắt của dây chuyền là gì?',
        dap: 'Trạm chậm nhất — nhịp ra sản phẩm của cả dây chuyền bằng đúng nhịp của nó, mọi trạm nhanh hơn đều phải chờ.',
      },
      {
        hoi: 'Cắt thời gian kiểm tại xưởng có rủi ro gì?',
        dap: 'Mỗi bước kiểm bỏ đi là một loại lỗi được thả ra hiện trường, nơi chi phí sửa cao gấp nhiều lần.',
      },
    ],
  }),
]
