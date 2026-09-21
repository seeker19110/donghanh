// P6-U275 — desktop-s1-m2 "Làm việc với tệp": ghi an toàn qua tệp tạm rồi đổi tên (bài 1) và
// ký tự đường dẫn hợp lệ khác nhau giữa Windows và POSIX (bài 2). Đây là hai chỗ làm mất dữ
// liệu người dùng nhiều nhất ở app desktop, và cả hai đều quyết định được trước khi ghi.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U275_LESSONS = [
  desktopSimulation({
    id: 'p6-u275-l1',
    unitId: 'p6-u275',
    title: 'ghi an toàn: temp file rồi rename, và ca không kết luận được',
    hook: 'Ghi đè thẳng tệp gốc chỉ sai khi mất điện đúng lúc — nhưng lúc đó người dùng mất cả tệp, còn bạn không có gì để khôi phục.',
    theory:
      'Ghi an toàn là ghi vào tệp tạm (temp file) rồi đổi tên đè lên tệp gốc, vì đổi tên trong cùng phân vùng là thao tác gần như nguyên tử. Hợp đồng xét theo thứ tự: trường sai trước, rồi hasTempFile, rồi kết quả đổi tên. Khi renamedOk là unknown thì simulator trả unknown chứ KHÔNG quy về allow: không có bằng chứng thì không được đoán rằng tệp gốc còn nguyên.',
    workedCode:
      '# MÔ PHỎNG ghi an toàn qua temp file\nhas_temp_file = "no"\nprint("deny: unsafe write" if has_temp_file == "no" else "allow: atomic write")',
    predictCode:
      'has_temp_file, renamed_ok = "yes", "unknown"\nif has_temp_file == "no":\n    print("deny: unsafe write")\nelif renamed_ok == "unknown":\n    print("unknown: rename outcome unproven")\nelse:\n    print("allow: atomic write")',
    predictChoices: [
      'allow: atomic write',
      'deny: unsafe write',
      'unknown: rename outcome unproven',
      'invalid: renamedOk',
    ],
    predictAnswer: 2,
    predictExplain:
      'Có tệp tạm nên không deny, nhưng kết quả đổi tên không xác định thì không đủ bằng chứng kết luận tệp gốc còn nguyên hay đã hỏng.',
    makePrompt:
      'Đọc fixture `hasTempFile:<yes|no>,renamedOk:<yes|no|unknown>`. Thiếu trường hoặc sai miền → `invalid: <trường>`; hasTempFile là no → `deny: unsafe write`; renamedOk khác yes → `unknown: rename outcome unproven`; còn lại → `allow: atomic write`. MÔ PHỎNG, không mở tệp thật và không gọi os.rename.',
    testCases: [
      {
        stdinLines: ['hasTempFile:yes,renamedOk:yes'],
        expected: 'allow: atomic write',
        hidden: false,
        label: 'có tệp tạm và đổi tên xong',
      },
      {
        stdinLines: ['hasTempFile:no,renamedOk:yes'],
        expected: 'deny: unsafe write',
        hidden: true,
        label: 'ghi thẳng tệp gốc bị chặn',
      },
      {
        stdinLines: ['hasTempFile:yes,renamedOk:unknown'],
        expected: 'unknown: rename outcome unproven',
        hidden: true,
        label: 'đổi tên đứt giữa chừng thì không kết luận',
      },
      {
        stdinLines: ['hasTempFile:yes,renamedOk:maybe'],
        expected: 'invalid: renamedOk',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"hasTempFile", "renamedOk"}: print("invalid: field")\n    elif m["hasTempFile"] not in {"yes", "no"}: print("invalid: hasTempFile")\n    elif m["renamedOk"] not in {"yes", "no", "unknown"}: print("invalid: renamedOk")\n    elif m["hasTempFile"] == "no": print("deny: unsafe write")\n    elif m["renamedOk"] != "yes": print("unknown: rename outcome unproven")\n    else: print("allow: atomic write")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, viết một script nhỏ ghi tệp theo hai cách: ghi đè trực tiếp và ghi tệp tạm rồi đổi tên. Cắt tiến trình giữa chừng ở cả hai cách (kill process) rồi kiểm tra tệp gốc còn đọc được không, ghi lại kết quả.',
    cards: [
      {
        hoi: 'Vì sao đổi tên lại an toàn hơn ghi đè?',
        dap: 'Vì đổi tên trong cùng phân vùng là thao tác một bước ở tầng hệ tệp: hoặc tệp cũ còn nguyên, hoặc tệp mới đã đầy đủ, không có trạng thái nửa vời.',
      },
      {
        hoi: 'Khi không biết đổi tên có thành công hay không thì trả gì?',
        dap: 'Trả unknown và yêu cầu kiểm tra lại, tuyệt đối không quy về allow — coi như ổn là cách mất dữ liệu mà không ai hay.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u275-l2',
    unitId: 'p6-u275',
    title: 'ký tự tên tệp hợp lệ khác nhau giữa Windows và POSIX',
    hook: 'Tên tệp "bao-cao 2026?.txt" chạy ngon trên máy Linux của bạn và làm hỏng luôn chức năng lưu trên máy Windows của khách.',
    theory:
      'Mỗi hệ điều hành có tập ký tự cấm riêng trong tên tệp; bài khai tường minh Windows cấm các ký tự < > | ? * / còn POSIX chỉ cấm dấu gạch chéo. Hợp đồng xét hệ trước rồi mới xét tên, vì không biết hệ thì không có tập ký tự nào để so. Ghi cứng đường dẫn theo một hệ là lỗi kinh điển của app desktop đa nền.',
    workedCode:
      '# MÔ PHỎNG tập ký tự cấm theo hệ\nCAM = {"windows": "<>|?*/", "posix": "/"}\nten = "bao-cao?.txt"\nprint("reject: invalid path char" if any(c in CAM["windows"] for c in ten) else "allow: safe path")',
    predictCode:
      'CAM = {"windows": "<>|?*/", "posix": "/"}\nhe, ten = "posix", "bao-cao?.txt"\nif any(c in CAM[he] for c in ten):\n    print("reject: invalid path char")\nelse:\n    print("allow: safe path")',
    predictChoices: [
      'reject: invalid path char',
      'allow: safe path',
      'invalid: os',
      'unknown: path',
    ],
    predictAnswer: 1,
    predictExplain:
      'Dấu hỏi không nằm trong tập cấm của POSIX, nên đúng tên đó lại hợp lệ ở đây dù bị chặn trên Windows.',
    makePrompt:
      'Đọc fixture `os:<windows|posix>,name:<chuỗi>` với tập ký tự cấm: windows = < > | ? * / và posix = /. Thiếu trường, os ngoài miền hoặc name rỗng → `invalid: <trường>`; name chứa ký tự cấm của hệ đó → `reject: invalid path char`; còn lại → `allow: safe path`. MÔ PHỎNG, không tạo tệp thật.',
    testCases: [
      {
        stdinLines: ['os:posix,name:bao-cao.txt'],
        expected: 'allow: safe path',
        hidden: false,
        label: 'tên sạch trên POSIX',
      },
      {
        stdinLines: ['os:windows,name:bao?cao.txt'],
        expected: 'reject: invalid path char',
        hidden: true,
        label: 'dấu hỏi bị cấm trên Windows',
      },
      {
        stdinLines: ['os:posix,name:thu/muc.txt'],
        expected: 'reject: invalid path char',
        hidden: true,
        label: 'gạch chéo bị cấm trong tên tệp POSIX',
      },
      {
        stdinLines: ['os:plan9,name:a.txt'],
        expected: 'invalid: os',
        hidden: true,
        label: 'ca âm — hệ không nhận dạng được fail closed',
      },
    ],
    sampleSolution:
      'CAM = {"windows": "<>|?*/", "posix": "/"}\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"os", "name"}: print("invalid: field")\n    elif m["os"] not in CAM: print("invalid: os")\n    elif not m["name"]: print("invalid: name")\n    elif any(c in CAM[m["os"]] for c in m["name"]): print("reject: invalid path char")\n    else: print("allow: safe path")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, thử tạo tệp tên `bao cao: 2026?.txt` trên Windows và trên Linux/macOS. Ghi lại thông báo lỗi của từng hệ, rồi viết hàm làm sạch tên tệp dùng chung cho cả ba hệ.',
    cards: [
      {
        hoi: 'Vì sao không nên ghi cứng đường dẫn thư mục dữ liệu?',
        dap: 'Vì mỗi hệ có chuẩn thư mục cấu hình, đệm và dữ liệu riêng; ghi cứng thì app ghi sai chỗ, bị chặn quyền hoặc bị hệ dọn mất dữ liệu.',
      },
      {
        hoi: 'Làm sạch tên tệp nên theo tập cấm của hệ nào?',
        dap: 'Theo tập nghiêm ngặt nhất trong các hệ mục tiêu, để một tên đã sạch thì dùng được ở mọi máy và tệp đồng bộ qua lại không gãy.',
      },
    ],
  }),
]
