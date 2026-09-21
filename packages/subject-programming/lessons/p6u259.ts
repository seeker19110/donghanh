import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U259_LESSONS = [
  embeddedSimulation({
    id: 'p6-u259-l1',
    unitId: 'p6-u259',
    title: 'đọc thanh ghi ngoại vi theo bảng datasheet',
    hook: 'Thiết bị không trả lời mà chương trình vẫn in ra một con số — đó là lúc bạn đang đo niềm tin chứ không đo cảm biến.',
    theory:
      'Bảng địa chỉ trong datasheet là danh sách đóng: địa chỉ không nằm trong bảng thì không có gì để đọc, nên reject. Khi thiết bị không xác nhận (NACK), bus trả về mức nghỉ chứ không phải dữ liệu, nên kết quả duy nhất trung thực là unknown. Bảng địa chỉ ở đây là bảng đồ chơi cố định trong mã, không phải chip thật.',
    workedCode:
      '# MÔ PHỎNG bảng datasheet đồ chơi\nbang = {72: "temp", 118: "humid"}\naddr = 90\nprint("reject: unknown address" if addr not in bang else "allow: register read")',
    predictCode: 'ack = "no"\nprint("unknown: nack" if ack == "no" else "allow: register read")',
    predictChoices: ['unknown: nack', 'allow: register read', 'reject: unknown address'],
    predictAnswer: 0,
    predictExplain:
      'Không có xác nhận từ thiết bị nghĩa là không có dữ liệu; in ra một giá trị lúc này là bịa.',
    makePrompt:
      'Bảng datasheet đồ chơi có hai địa chỉ hợp lệ: 72 và 118. Đọc `addr:<số>,ack:<yes|no>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; addr ngoài bảng → `reject: unknown address`; ack no → `unknown: nack`; còn lại → `allow: register read`. MÔ PHỎNG, không có bus I2C thật.',
    testCases: [
      {
        stdinLines: ['addr:72,ack:yes'],
        expected: 'allow: register read',
        hidden: false,
        label: 'địa chỉ trong bảng và thiết bị có xác nhận',
      },
      {
        stdinLines: ['addr:90,ack:yes'],
        expected: 'reject: unknown address',
        hidden: true,
        label: 'địa chỉ không có trong datasheet',
      },
      {
        stdinLines: ['addr:118,ack:no'],
        expected: 'unknown: nack',
        hidden: true,
        label: 'thiết bị im lặng thì không có giá trị nào để in',
      },
      {
        stdinLines: ['addr:bay-hai,ack:yes'],
        expected: 'invalid: addr',
        hidden: true,
        label: 'ca âm — địa chỉ sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'BANG = {72, 118}\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"addr", "ack"}: print("invalid: field")\n    elif not m["addr"].isdigit(): print("invalid: addr")\n    elif m["ack"] not in {"yes", "no"}: print("invalid: ack")\n    elif int(m["addr"]) not in BANG: print("reject: unknown address")\n    elif m["ack"] == "no": print("unknown: nack")\n    else: print("allow: register read")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Lấy datasheet của một cảm biến I2C thật NGOÀI sandbox, chép lại bảng địa chỉ và bảng thanh ghi vào tài liệu của bạn, rồi đánh dấu thanh ghi nào chỉ-đọc và thanh ghi nào đổi cấu hình.',
    cards: [
      {
        hoi: 'NACK trên bus I2C nghĩa là gì?',
        dap: 'Không thiết bị nào kéo đường dữ liệu xuống để xác nhận, tức là địa chỉ đó không có ai trả lời — không phải dữ liệu bằng 0.',
      },
      {
        hoi: 'Vì sao bảng địa chỉ phải là danh sách đóng?',
        dap: 'Cho phép địa chỉ lạ đi qua sẽ biến lỗi nối dây thành một giá trị trông như hợp lệ, rất khó lần ra sau này.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u259-l2',
    unitId: 'p6-u259',
    title: 'chu kỳ PWM và dải khai báo trong datasheet',
    hook: 'Một phần trăm chu kỳ vượt dải cho phép không làm thiết bị "cố hơn" — nó làm thiết bị hỏng.',
    theory:
      'Mỗi cơ cấu chấp hành có dải chu kỳ làm việc ghi trong datasheet; đặt ngoài dải là lệnh không thể thực hiện an toàn nên phải deny trước khi ghi thanh ghi. Simulator xét kiểu dữ liệu trước, rồi mới xét dải, để lỗi cấu hình không bị nhầm thành lỗi phần cứng.',
    workedCode:
      '# MÔ PHỎNG dải chu kỳ PWM\nduty, lo, hi = 95, 10, 90\nprint("deny: duty out of range" if duty < lo or duty > hi else "allow: pwm set")',
    predictCode:
      'duty, lo, hi = 50, 10, 90\nprint("deny: duty out of range" if duty < lo or duty > hi else "allow: pwm set")',
    predictChoices: ['allow: pwm set', 'deny: duty out of range', 'unknown: nack'],
    predictAnswer: 0,
    predictExplain: '50 nằm giữa 10 và 90 nên nằm trong dải khai báo, lệnh được chấp nhận.',
    makePrompt:
      'Đọc `duty:<0-100>,lo:<0-100>,hi:<0-100>`. Sai kiểu, ngoài 0–100, hoặc lo > hi → `invalid: <trường>`; duty ngoài [lo, hi] → `deny: duty out of range`; còn lại → `allow: pwm set`. MÔ PHỎNG, không có bộ định thời phần cứng thật.',
    testCases: [
      {
        stdinLines: ['duty:50,lo:10,hi:90'],
        expected: 'allow: pwm set',
        hidden: false,
        label: 'chu kỳ trong dải khai báo',
      },
      {
        stdinLines: ['duty:95,lo:10,hi:90'],
        expected: 'deny: duty out of range',
        hidden: true,
        label: 'vượt trần dải cho phép',
      },
      {
        stdinLines: ['duty:5,lo:10,hi:90'],
        expected: 'deny: duty out of range',
        hidden: true,
        label: 'dưới sàn dải cho phép',
      },
      {
        stdinLines: ['duty:50,lo:90,hi:10'],
        expected: 'invalid: lo',
        hidden: true,
        label: 'ca âm — dải đảo ngược fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"duty", "lo", "hi"}: print("invalid: field")\n    elif not all(m[k].isdigit() and int(m[k]) <= 100 for k in ("duty", "lo", "hi")):\n        bad = next(k for k in ("duty", "lo", "hi") if not (m[k].isdigit() and int(m[k]) <= 100))\n        print("invalid: " + bad)\n    elif int(m["lo"]) > int(m["hi"]): print("invalid: lo")\n    elif not (int(m["lo"]) <= int(m["duty"]) <= int(m["hi"])): print("deny: duty out of range")\n    else: print("allow: pwm set")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Chọn một động cơ servo thật NGOÀI sandbox, tra dải độ rộng xung trong datasheet, rồi ghi lại điều gì xảy ra ở hai đầu dải và vì sao nhà sản xuất đặt giới hạn đó.',
    cards: [
      {
        hoi: 'Vì sao phải chặn chu kỳ PWM ngoài dải ở tầng phần mềm?',
        dap: 'Phần cứng không tự biết dải an toàn của cơ cấu chấp hành gắn vào; dải đó chỉ tồn tại trong datasheet, nên phần mềm là chỗ duy nhất kiểm được.',
      },
      {
        hoi: 'Vì sao xét kiểu dữ liệu trước rồi mới xét dải?',
        dap: 'Để thông báo lỗi chỉ đúng nguyên nhân thật; một chuỗi không phải số là lỗi cấu hình, không phải lỗi vượt dải.',
      },
    ],
  }),
]
