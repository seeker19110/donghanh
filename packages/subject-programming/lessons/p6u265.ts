import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U265_LESSONS = [
  embeddedSimulation({
    id: 'p6-u265-l1',
    unitId: 'p6-u265',
    title: 'ngân sách pin: từ dòng tiêu thụ ra số ngày sống',
    hook: '"Chạy được khoảng một năm" không phải một yêu cầu kỹ thuật — số ngày tính ra từ dòng tiêu thụ mới là.',
    theory:
      'Ngân sách pin (battery budget) là một phép nhân cộng thẳng thắn: mỗi chế độ có dòng tiêu thụ và số giờ trong một ngày, cộng lại ra lượng điện tiêu mỗi ngày, lấy dung lượng pin chia cho nó ra số ngày sống. Không đạt mục tiêu thì phải deny KÈM số ngày dự kiến, vì con số đó mới chỉ ra nên cắt chế độ nào. Tổng số giờ của các chế độ luôn bằng 24, lệch là dữ liệu sai chứ không phải thiết kế lạ.',
    workedCode:
      '# MÔ PHỎNG ngân sách pin\ncap, active_ma, active_h, sleep_ma = 2000, 100, 1, 1\nperday = active_ma * active_h + sleep_ma * (24 - active_h)\nprint("allow: " + str(cap // perday) + " ngay")',
    predictCode:
      'cap, active_ma, active_h, sleep_ma = 2000, 100, 2, 1\nperday = active_ma * active_h + sleep_ma * (24 - active_h)\nprint("du kien " + str(cap // perday) + " ngay")',
    predictChoices: ['du kien 9 ngay', 'du kien 16 ngay', 'du kien 20 ngay'],
    predictAnswer: 0,
    predictExplain:
      'Mỗi ngày tiêu 100×2 + 1×22 = 222 mAh, chia 2000 mAh được 9 ngày trọn — thêm một giờ thức làm tuổi thọ rơi gần một nửa.',
    makePrompt:
      'Đọc `cap:<mAh>,active_ma:<số>,active_h:<0-24>,sleep_ma:<số>,target:<số ngày>`. Sai kiểu, thiếu trường, active_h > 24 hoặc lượng tiêu mỗi ngày bằng 0 → `invalid: <trường>`. Tính lượng tiêu mỗi ngày = active_ma × active_h + sleep_ma × (24 − active_h), số ngày = cap chia lấy nguyên cho lượng đó. Số ngày < target → `deny: battery budget exceeded, du kien <n> ngay`; còn lại → `allow: <n> ngay`. MÔ PHỎNG, không đo pin thật.',
    testCases: [
      {
        stdinLines: ['cap:2000,active_ma:100,active_h:1,sleep_ma:1,target:10'],
        expected: 'allow: 16 ngay',
        hidden: false,
        label: 'đạt mục tiêu tuổi thọ pin',
      },
      {
        stdinLines: ['cap:2000,active_ma:100,active_h:2,sleep_ma:1,target:30'],
        expected: 'deny: battery budget exceeded, du kien 9 ngay',
        hidden: true,
        label: 'không đạt thì báo kèm số ngày dự kiến',
      },
      {
        stdinLines: ['cap:2460,active_ma:100,active_h:1,sleep_ma:1,target:20'],
        expected: 'allow: 20 ngay',
        hidden: true,
        label: 'vừa đúng mục tiêu vẫn được chấp nhận',
      },
      {
        stdinLines: ['cap:2000,active_ma:100,active_h:25,sleep_ma:1,target:10'],
        expected: 'invalid: active_h',
        hidden: true,
        label: 'ca âm — quá 24 giờ mỗi ngày fail closed',
      },
    ],
    sampleSolution:
      'KEYS = ("cap", "active_ma", "active_h", "sleep_ma", "target")\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != set(KEYS): print("invalid: field")\n    elif not all(m[k].isdigit() for k in KEYS):\n        print("invalid: " + next(k for k in KEYS if not m[k].isdigit()))\n    elif int(m["active_h"]) > 24: print("invalid: active_h")\n    else:\n        h = int(m["active_h"])\n        perday = int(m["active_ma"]) * h + int(m["sleep_ma"]) * (24 - h)\n        if perday == 0: print("invalid: active_ma")\n        else:\n            days = int(m["cap"]) // perday\n            if days < int(m["target"]): print("deny: battery budget exceeded, du kien " + str(days) + " ngay")\n            else: print("allow: " + str(days) + " ngay")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Đo dòng tiêu thụ thật của thiết bị bạn NGOÀI sandbox ở từng chế độ bằng đồng hồ đo dòng, lập bảng chế độ × giờ × dòng, rồi so số ngày tính ra với tuổi thọ pin quan sát được.',
    cards: [
      {
        hoi: 'Vì sao dòng ở chế độ ngủ quan trọng hơn vẻ ngoài của nó?',
        dap: 'Vì thiết bị ngủ gần như cả ngày, nên vài chục micro-ampe rò rỉ nhân với 23 giờ có thể lớn hơn cả phần thức.',
      },
      {
        hoi: 'Vì sao báo lỗi ngân sách pin phải kèm số ngày dự kiến?',
        dap: 'Con số cho biết còn thiếu bao nhiêu và nên cắt chế độ nào; một chữ "vượt" thì không chỉ ra được gì.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u265-l2',
    unitId: 'p6-u265',
    title: 'ngủ sâu chỉ thật khi mọi ngoại vi đã tắt',
    hook: 'Vi điều khiển ngủ sâu mà mô-đun sóng vẫn bật thì pin vẫn cạn đúng như lúc chưa tối ưu gì.',
    theory:
      'Lệnh vào chế độ ngủ sâu chỉ hạ dòng của lõi xử lý; ngoại vi nào chưa tắt vẫn tiếp tục kéo dòng. Simulator duyệt danh sách ngoại vi đã khai báo và refuse nếu còn cái nào bật khi vào ngủ sâu, vì đó là nguyên nhân số một khiến tuổi thọ pin đo được khác xa tính toán. Ở chế độ hoạt động thì ngoại vi bật là bình thường.',
    workedCode:
      '# MÔ PHỎNG kiểm ngoại vi trước khi ngủ sâu\nmode, radio, sensor = "sleep", "on", "off"\nprint("refuse: peripheral not disabled" if mode == "sleep" and "on" in (radio, sensor) else "allow: deep sleep")',
    predictCode:
      'mode, radio, sensor = "active", "on", "on"\nprint("refuse: peripheral not disabled" if mode == "sleep" and "on" in (radio, sensor) else "allow: active mode")',
    predictChoices: ['allow: active mode', 'refuse: peripheral not disabled', 'invalid: mode'],
    predictAnswer: 0,
    predictExplain:
      'Đang ở chế độ hoạt động thì ngoại vi bật là đúng thiết kế; luật tắt ngoại vi chỉ áp cho lúc vào ngủ sâu.',
    makePrompt:
      'Đọc `mode:<sleep|active>,radio:<on|off>,sensor:<on|off>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; mode sleep mà còn ngoại vi on → `refuse: peripheral not disabled`; mode sleep và tất cả off → `allow: deep sleep`; mode active → `allow: active mode`. MÔ PHỎNG, không cắt nguồn ngoại vi thật.',
    testCases: [
      {
        stdinLines: ['mode:sleep,radio:off,sensor:off'],
        expected: 'allow: deep sleep',
        hidden: false,
        label: 'mọi ngoại vi đã tắt thì ngủ sâu là thật',
      },
      {
        stdinLines: ['mode:sleep,radio:on,sensor:off'],
        expected: 'refuse: peripheral not disabled',
        hidden: true,
        label: 'mô-đun sóng còn bật làm rò dòng',
      },
      {
        stdinLines: ['mode:active,radio:on,sensor:on'],
        expected: 'allow: active mode',
        hidden: true,
        label: 'chế độ hoạt động không áp luật tắt ngoại vi',
      },
      {
        stdinLines: ['mode:idle,radio:off,sensor:off'],
        expected: 'invalid: mode',
        hidden: true,
        label: 'ca âm — chế độ chưa khai báo fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"mode", "radio", "sensor"}: print("invalid: field")\n    elif m["mode"] not in {"sleep", "active"}: print("invalid: mode")\n    elif m["radio"] not in {"on", "off"}: print("invalid: radio")\n    elif m["sensor"] not in {"on", "off"}: print("invalid: sensor")\n    elif m["mode"] == "active": print("allow: active mode")\n    elif "on" in (m["radio"], m["sensor"]): print("refuse: peripheral not disabled")\n    else: print("allow: deep sleep")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Đo dòng tiêu thụ thật NGOÀI sandbox ngay trước và ngay sau lệnh vào ngủ sâu; nếu chênh lệch nhỏ hơn kỳ vọng, đi tìm ngoại vi nào chưa tắt và ghi lại thủ phạm.',
    cards: [
      {
        hoi: 'Vì sao ngủ sâu không tự tắt ngoại vi?',
        dap: 'Nhiều ngoại vi cần tiếp tục chạy để đánh thức lõi xử lý, nên chip để việc tắt cho người viết firmware quyết định.',
      },
      {
        hoi: 'Cách kiểm nhanh xem thiết bị có ngủ thật không?',
        dap: 'Đo dòng tiêu thụ ở chế độ ngủ và so với con số ghi trong datasheet; lệch nhiều là còn thứ gì đó đang bật.',
      },
    ],
  }),
]
