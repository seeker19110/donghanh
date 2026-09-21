import { embeddedSimulation } from './embeddedLessonFactory.js'

export const P6U261_LESSONS = [
  embeddedSimulation({
    id: 'p6-u261-l1',
    unitId: 'p6-u261',
    title: 'cô lập lỗi: phần cứng hay phần mềm',
    hook: 'Câu hỏi đắt nhất của nghề nhúng là "lỗi nằm ở dây hay ở code" — và chỉ số đo mới trả lời được.',
    theory:
      'Quy tắc cô lập dựa trên bằng chứng đo, không dựa trên cảm giác: bus có byte trả về nhưng giá trị sai thì đường truyền vật lý đang hoạt động, lỗi thuộc về phần mềm; bus im lặng hoàn toàn thì mắt xích vật lý đứt, lỗi thuộc phần cứng. Dòng tiêu thụ vượt định mức tài liệu được ưu tiên xét trước vì nó là rủi ro cháy hỏng. Thiếu cả hai phép đo thì kết luận duy nhất trung thực là unknown.',
    workedCode:
      '# MÔ PHỎNG cô lập lỗi từ bằng chứng đo\nbus, current, rated = "silent", 40, 100\nprint("deny: overcurrent" if current > rated else ("reject: hardware" if bus == "silent" else "allow: no fault"))',
    predictCode:
      'bus, current, rated = "wrong", 40, 100\nprint("deny: overcurrent" if current > rated else ("reject: software" if bus == "wrong" else "allow: no fault"))',
    predictChoices: ['reject: software', 'reject: hardware', 'deny: overcurrent'],
    predictAnswer: 0,
    predictExplain:
      'Có byte trả về nghĩa là dây, nguồn và địa chỉ đều đúng; chỉ còn nội dung sai, tức là lỗi ở chỗ diễn giải dữ liệu.',
    makePrompt:
      'Đọc `bus:<ok|wrong|silent|none>,current:<số|none>,rated:<số>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; current là số và > rated → `deny: overcurrent`; bus none và current none → `unknown: no measurement`; bus silent → `reject: hardware`; bus wrong → `reject: software`; còn lại → `allow: no fault`. MÔ PHỎNG, không đo trên thiết bị thật.',
    testCases: [
      {
        stdinLines: ['bus:ok,current:40,rated:100'],
        expected: 'allow: no fault',
        hidden: false,
        label: 'bus đúng và dòng trong định mức',
      },
      {
        stdinLines: ['bus:silent,current:40,rated:100'],
        expected: 'reject: hardware',
        hidden: true,
        label: 'bus im lặng là mắt xích vật lý đứt',
      },
      {
        stdinLines: ['bus:wrong,current:400,rated:100'],
        expected: 'deny: overcurrent',
        hidden: true,
        label: 'quá dòng được ưu tiên trước mọi kết luận khác',
      },
      {
        stdinLines: ['bus:none,current:none,rated:100'],
        expected: 'unknown: no measurement',
        hidden: true,
        label: 'ca âm — chưa đo gì thì cấm đoán',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"bus", "current", "rated"}: print("invalid: field")\n    elif m["bus"] not in {"ok", "wrong", "silent", "none"}: print("invalid: bus")\n    elif m["current"] != "none" and not m["current"].isdigit(): print("invalid: current")\n    elif not m["rated"].isdigit(): print("invalid: rated")\n    elif m["current"] != "none" and int(m["current"]) > int(m["rated"]): print("deny: overcurrent")\n    elif m["bus"] == "none" and m["current"] == "none": print("unknown: no measurement")\n    elif m["bus"] == "silent": print("reject: hardware")\n    elif m["bus"] == "wrong": print("reject: software")\n    else: print("allow: no fault")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Cố tình tháo một dây SDA trên mạch thật NGOÀI sandbox, chụp bus bằng máy phân tích logic, rồi nối lại và ghi sai một địa chỉ trong code; so sánh hai ảnh chụp để thấy khác biệt giữa lỗi phần cứng và lỗi phần mềm.',
    cards: [
      {
        hoi: 'Bus im lặng hoàn toàn gợi ý điều gì?',
        dap: 'Không thiết bị nào kéo được đường dữ liệu: mất nguồn, đứt dây, sai chân hoặc thiếu điện trở kéo lên — đều là mắt xích vật lý.',
      },
      {
        hoi: 'Vì sao quá dòng được xét trước mọi luật khác?',
        dap: 'Vì nó là rủi ro hỏng thiết bị đang diễn ra; kết luận phần mềm hay phần cứng có thể chờ, còn cắt nguồn thì không.',
      },
    ],
  }),
  embeddedSimulation({
    id: 'p6-u261-l2',
    unitId: 'p6-u261',
    title: 'sổ bằng chứng đo trước khi kết luận',
    hook: 'Kết luận không có số đo kèm theo chỉ là một dự đoán được phát biểu bằng giọng chắc chắn.',
    theory:
      'Trước khi tuyên bố nguyên nhân, sổ bằng chứng phải đủ hai chân: ảnh chụp bus từ máy phân tích logic (logic analyzer) và phép đo dòng tiêu thụ. Thiếu chân nào thì simulator nói rõ đang thiếu đúng chân đó, thay vì trả về một kết luận chung chung. Đây là bước rèn thói quen ghi chép, không phải bước chẩn đoán.',
    workedCode:
      '# MÔ PHỎNG sổ bằng chứng\ncapture, probe = "no", "yes"\nprint("unknown: missing logic analyzer capture" if capture == "no" else "allow: evidence complete")',
    predictCode:
      'capture, probe = "yes", "no"\nprint("unknown: missing current probe" if probe == "no" else "allow: evidence complete")',
    predictChoices: [
      'unknown: missing current probe',
      'allow: evidence complete',
      'unknown: missing logic analyzer capture',
    ],
    predictAnswer: 0,
    predictExplain:
      'Có ảnh chụp bus nhưng chưa đo dòng, nên sổ bằng chứng còn thiếu đúng một chân và phải nói rõ chân nào.',
    makePrompt:
      'Đọc `capture:<yes|no>,probe:<yes|no>` (ảnh chụp từ máy phân tích logic và phép đo dòng). Giá trị lạ hoặc thiếu trường → `invalid: <trường>`; cả hai no → `unknown: no evidence`; capture no → `unknown: missing logic analyzer capture`; probe no → `unknown: missing current probe`; còn lại → `allow: evidence complete`. MÔ PHỎNG, không đọc tệp ảnh chụp thật.',
    testCases: [
      {
        stdinLines: ['capture:yes,probe:yes'],
        expected: 'allow: evidence complete',
        hidden: false,
        label: 'đủ hai chân bằng chứng',
      },
      {
        stdinLines: ['capture:no,probe:yes'],
        expected: 'unknown: missing logic analyzer capture',
        hidden: true,
        label: 'thiếu ảnh chụp bus',
      },
      {
        stdinLines: ['capture:yes,probe:no'],
        expected: 'unknown: missing current probe',
        hidden: true,
        label: 'thiếu phép đo dòng',
      },
      {
        stdinLines: ['capture:maybe,probe:yes'],
        expected: 'invalid: capture',
        hidden: true,
        label: 'ca âm — giá trị mơ hồ fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"capture", "probe"}: print("invalid: field")\n    elif m["capture"] not in {"yes", "no"}: print("invalid: capture")\n    elif m["probe"] not in {"yes", "no"}: print("invalid: probe")\n    elif m["capture"] == "no" and m["probe"] == "no": print("unknown: no evidence")\n    elif m["capture"] == "no": print("unknown: missing logic analyzer capture")\n    elif m["probe"] == "no": print("unknown: missing current probe")\n    else: print("allow: evidence complete")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Lập một mẫu sổ bằng chứng cho dự án nhúng của bạn NGOÀI sandbox với đúng các ô: hiện tượng, ảnh chụp bus, số đo dòng, giả thuyết, phép thử bác bỏ giả thuyết, kết luận.',
    cards: [
      {
        hoi: 'Vì sao thiếu bằng chứng phải trả unknown thay vì kết luận tạm?',
        dap: 'Kết luận tạm được chép lại và lan đi như sự thật, còn unknown thì buộc người tiếp theo đi đo — đúng việc cần làm.',
      },
      {
        hoi: 'Hai chân bằng chứng tối thiểu cho lỗi bus là gì?',
        dap: 'Ảnh chụp tín hiệu bus và số đo dòng tiêu thụ; một cái nói dữ liệu có chạy không, một cái nói mạch có bất thường về điện không.',
      },
    ],
  }),
]
