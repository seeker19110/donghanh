// P6-U241 — systems-s4-m4: an toàn ở tầng thấp.
// Bài 1 là phòng thủ (canary/ASLR), bài 2 là tấn công có phương pháp (fuzzing theo độ phủ).
// Ca nguy hiểm nhất của cả unit là tràn bộ đệm KHÔNG bị phát hiện — nó phải fail closed.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U241_LESSONS = [
  systemsSimulation({
    id: 'p6-u241-l1',
    unitId: 'p6-u241',
    title: 'tràn bộ đệm và các lớp phòng thủ',
    hook: 'Lỗi tràn bộ đệm đáng sợ không phải vì nó làm chương trình chết, mà vì nó KHÔNG làm chương trình chết: dữ liệu bị ghi đè, chương trình chạy tiếp, và kẻ tấn công đã ở bên trong.',
    theory:
      'Stack canary đặt một giá trị mốc ngay trước địa chỉ trả về; hàm trả về mà mốc bị đổi nghĩa là đã có ghi tràn, nên chương trình abort. ASLR làm địa chỉ khó đoán và W^X cấm thực thi vùng ghi được — cả ba là lớp giảm thiểu, không phải cách sửa lỗi. Trace MÔ PHỎNG chỉ so bốn trường; tràn mà không lớp nào phát hiện là ca xấu nhất nên phải trả nhãn tường minh để lớp gọi từ chối. Không chạy mã khai thác hay tắt bảo vệ của máy thật.',
    workedCode:
      '# MO PHONG canary bat duoc ghi tran\nbuf, write, canary = 64, 100, "on"\nprint("overflow-detected: abort" if write > buf and canary == "on" else "ok: ghi trong pham vi buffer")',
    predictCode:
      'buf, write, canary = 64, 100, "off"\nif write > buf and canary == "off":\n    print("overflow-undetected: deny, khong co stack canary")\nelif write > buf:\n    print("overflow-detected: abort")\nelse:\n    print("ok: ghi trong pham vi buffer")',
    predictChoices: [
      'overflow-undetected: deny, khong co stack canary',
      'overflow-detected: abort',
      'ok: ghi trong pham vi buffer',
    ],
    predictAnswer: 0,
    predictExplain:
      'Ghi 100 byte vào bộ đệm 64 byte là tràn, và không có canary nào để phát hiện nên chương trình chạy tiếp với ngăn xếp đã hỏng.',
    makePrompt:
      'Đọc `buf:<số>,write:<số>,canary:<on|off>,aslr:<on|off>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; write > buf và canary off → `overflow-undetected: deny, khong co stack canary`; write > buf và canary on → `overflow-detected: abort`; còn lại → `ok: ghi trong pham vi buffer`. MÔ PHỎNG, không chạy mã khai thác thật.',
    testCases: [
      {
        stdinLines: ['buf:64,write:32,canary:on,aslr:on'],
        expected: 'ok: ghi trong pham vi buffer',
        hidden: false,
        label: 'ghi trong phạm vi thì không có gì xảy ra',
      },
      {
        stdinLines: ['buf:64,write:100,canary:on,aslr:on'],
        expected: 'overflow-detected: abort',
        hidden: true,
        label: 'canary bắt được ghi tràn và dừng chương trình',
      },
      {
        stdinLines: ['buf:64,write:100,canary:off,aslr:on'],
        expected: 'overflow-undetected: deny, khong co stack canary',
        hidden: true,
        label: 'ca âm — tràn không ai phát hiện, phải fail closed',
      },
      {
        stdinLines: ['buf:64,write:100,canary:maybe,aslr:on'],
        expected: 'invalid: canary',
        hidden: true,
        label: 'ca âm — trạng thái phòng thủ không rõ thì từ chối',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"buf", "write", "canary", "aslr"}: print("invalid: field")\n    elif not m["buf"].isdigit(): print("invalid: buf")\n    elif not m["write"].isdigit(): print("invalid: write")\n    elif m["canary"] not in {"on", "off"}: print("invalid: canary")\n    elif m["aslr"] not in {"on", "off"}: print("invalid: aslr")\n    elif int(m["write"]) > int(m["buf"]) and m["canary"] == "off": print("overflow-undetected: deny, khong co stack canary")\n    elif int(m["write"]) > int(m["buf"]): print("overflow-detected: abort")\n    else: print("ok: ghi trong pham vi buffer")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, biên dịch một chương trình nhỏ có lỗi tràn hai lần — một lần bật stack protector, một lần tắt — rồi ghi lại triệu chứng khác nhau của hai bản.',
    cards: [
      {
        hoi: 'Stack canary phát hiện được gì và không phát hiện được gì?',
        dap: 'Nó bắt được ghi tràn tuần tự đè qua mốc trước địa chỉ trả về; nó không bắt được ghi tuỳ ý vào một địa chỉ cụ thể bỏ qua mốc đó.',
      },
      {
        hoi: 'Vì sao ASLR và W^X chỉ là giảm thiểu, không phải sửa lỗi?',
        dap: 'Chúng làm việc khai thác khó hơn chứ không loại bỏ lỗi ghi ngoài vùng; lỗi vẫn còn đó và vẫn có thể bị khai thác bằng cách khác.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u241-l2',
    unitId: 'p6-u241',
    title: 'fuzzing theo độ phủ — khi nào nên đổi chiến lược',
    hook: 'Chạy fuzzer thêm một triệu ca nữa không tìm thêm lỗi nào, vì nó đang gõ mãi vào cùng một cánh cửa. Con số nói điều đó là độ phủ, không phải số ca đã chạy.',
    theory:
      'Fuzzing có dẫn hướng theo độ phủ giữ lại những đầu vào mở ra nhánh code mới. Khi độ phủ đứng yên nhiều vòng liên tiếp thì thêm ca chỉ tốn máy: đó là lúc đổi hạt giống, đổi bộ biến đổi, hoặc gỡ rào chắn kiểm tổng. Trace MÔ PHỎNG đọc dãy độ phủ đã ghi sẵn; độ phủ giảm là dữ liệu sai chứ không phải tín hiệu, nên bị từ chối. Không chạy fuzzer thật.',
    workedCode:
      '# MO PHONG phat hien plateau\ncov = [10, 20, 25, 25, 25]\nprint("plateau: coverage khong tang, doi chien luoc" if cov[-1] == cov[-2] == cov[-3] else "progress: coverage van tang")',
    predictCode:
      'cov = [10, 20, 25, 30, 36]\nprint("plateau: coverage khong tang, doi chien luoc" if cov[-1] == cov[-2] == cov[-3] else "progress: coverage van tang")',
    predictChoices: [
      'progress: coverage van tang',
      'plateau: coverage khong tang, doi chien luoc',
      'invalid: insufficient-samples',
    ],
    predictAnswer: 0,
    predictExplain: 'Ba vòng cuối vẫn tăng đều nên chiến lược hiện tại còn mở thêm được nhánh mới.',
    makePrompt:
      'Đọc `cov:<các số độ phủ ngăn bằng dấu chấm phẩy>`. Dưới 5 vòng → `invalid: insufficient-samples`; có giá trị không phải số → `invalid: cov`; độ phủ giảm ở bất kỳ vòng nào → `invalid: coverage giam`; ba vòng cuối bằng nhau → `plateau: coverage khong tang, doi chien luoc`; còn lại → `progress: coverage van tang`. MÔ PHỎNG, không chạy fuzzer thật.',
    testCases: [
      {
        stdinLines: ['cov:10;20;25;30;36'],
        expected: 'progress: coverage van tang',
        hidden: false,
        label: 'độ phủ còn tăng thì cứ chạy tiếp',
      },
      {
        stdinLines: ['cov:10;20;25;25;25'],
        expected: 'plateau: coverage khong tang, doi chien luoc',
        hidden: true,
        label: 'ba vòng đứng yên là lúc đổi chiến lược',
      },
      {
        stdinLines: ['cov:10;20;25'],
        expected: 'invalid: insufficient-samples',
        hidden: true,
        label: 'ca âm — quá ít vòng thì không kết luận',
      },
      {
        stdinLines: ['cov:10;20;15;30;36'],
        expected: 'invalid: coverage giam',
        hidden: true,
        label: 'ca âm — độ phủ tích luỹ không thể giảm, dữ liệu sai',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    raw = [c for c in m.get("cov", "").split(";") if c]\n    if set(m) != {"cov"} or any(not c.isdigit() for c in raw):\n        print("invalid: cov")\n    elif len(raw) < 5:\n        print("invalid: insufficient-samples")\n    else:\n        cov = [int(c) for c in raw]\n        if any(cov[i] < cov[i - 1] for i in range(1, len(cov))):\n            print("invalid: coverage giam")\n        elif cov[-1] == cov[-2] == cov[-3]:\n            print("plateau: coverage khong tang, doi chien luoc")\n        else:\n            print("progress: coverage van tang")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, chạy một fuzzer thật trên một thư viện phân tích cú pháp nhỏ trong 30 phút, vẽ đường độ phủ theo thời gian và chỉ ra mốc nó bắt đầu đi ngang.',
    cards: [
      {
        hoi: 'Vì sao dùng độ phủ để dẫn hướng fuzzing?',
        dap: 'Vì đầu vào mở ra nhánh code mới là đầu vào đáng giữ lại và biến đổi tiếp; số ca đã chạy không nói gì về việc đã thăm dò được bao nhiêu chương trình.',
      },
      {
        hoi: 'Độ phủ đi ngang nghĩa là đã an toàn chưa?',
        dap: 'Chưa. Nó chỉ nghĩa là chiến lược hiện tại đã cạn; phần chưa chạm tới vẫn chưa được kiểm chứng gì cả.',
      },
    ],
  }),
]
