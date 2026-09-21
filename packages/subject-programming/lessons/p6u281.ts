// P6-U281 — desktop-s2-m4 "Chẩn đoán từ xa": sự đồng ý của người dùng và che PII trong nhật ký
// (bài 1), gói báo lỗi gửi đi chứa đúng thứ cần thiết (bài 2). Chẩn đoán từ xa là lần duy nhất
// dữ liệu trên máy người dùng đi về phía bạn — nên nó phải là đường hẹp nhất trong app.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U281_LESSONS = [
  desktopSimulation({
    id: 'p6-u281-l1',
    unitId: 'p6-u281',
    title: 'consent trước, pii che sau, và chế độ an toàn khi cấu hình hỏng',
    hook: 'Nhật ký giúp bạn sửa lỗi trong mười phút thay vì ba ngày — nhưng nó thường chứa cả đường dẫn có tên thật và email của người dùng.',
    theory:
      'Thứ tự xét là thứ tự đạo đức: chưa có sự đồng ý (consent) thì không gửi gì cả, deny ngay, kể cả nhật ký sạch. Có đồng ý rồi mới tới kiểm nội dung: thấy dấu hiệu dữ liệu cá nhân (pii) thì che trước khi gửi chứ không chặn hẳn, vì phần còn lại vẫn giúp sửa lỗi. Cấu hình hỏng không phải lý do chặn khởi động: app vào chế độ an toàn với cấu hình mặc định để người dùng còn cứu được dữ liệu.',
    workedCode:
      '# MÔ PHỎNG cổng đồng ý trước khi gửi nhật ký\nuser_consented = "no"\nprint("deny: no consent" if user_consented == "no" else "allow: send diagnostics")',
    predictCode:
      'user_consented, log_has_pii, config_corrupt = "yes", "no", "yes"\nif user_consented == "no":\n    print("deny: no consent")\nelif log_has_pii == "yes":\n    print("redact: pii found")\nelif config_corrupt == "yes":\n    print("allow: safe mode")\nelse:\n    print("allow: send diagnostics")',
    predictChoices: [
      'allow: send diagnostics',
      'deny: no consent',
      'redact: pii found',
      'allow: safe mode',
    ],
    predictAnswer: 3,
    predictExplain:
      'Có đồng ý và nhật ký sạch nên không deny cũng không che; cấu hình hỏng chỉ đẩy app vào chế độ an toàn, không chặn khởi động.',
    makePrompt:
      'Đọc fixture `userConsented:<yes|no>,logContainsPii:<yes|no>,configCorrupt:<yes|no>`. Thiếu trường hoặc sai miền → `invalid: <trường>`; userConsented là no → `deny: no consent`; logContainsPii là yes → `redact: pii found`; configCorrupt là yes → `allow: safe mode`; còn lại → `allow: send diagnostics`. MÔ PHỎNG, không đọc nhật ký thật và không gửi gì ra mạng.',
    testCases: [
      {
        stdinLines: ['userConsented:yes,logContainsPii:no,configCorrupt:no'],
        expected: 'allow: send diagnostics',
        hidden: false,
        label: 'đủ đồng ý và nhật ký sạch',
      },
      {
        stdinLines: ['userConsented:no,logContainsPii:yes,configCorrupt:yes'],
        expected: 'deny: no consent',
        hidden: true,
        label: 'chưa đồng ý thì không gửi gì cả',
      },
      {
        stdinLines: ['userConsented:yes,logContainsPii:yes,configCorrupt:no'],
        expected: 'redact: pii found',
        hidden: true,
        label: 'nhật ký có dữ liệu cá nhân phải che',
      },
      {
        stdinLines: ['userConsented:yes,logContainsPii:no,configCorrupt:yes'],
        expected: 'allow: safe mode',
        hidden: true,
        label: 'cấu hình hỏng vẫn khởi động được',
      },
      {
        stdinLines: ['userConsented:sure,logContainsPii:no,configCorrupt:no'],
        expected: 'invalid: userConsented',
        hidden: true,
        label: 'ca âm — đồng ý mập mờ fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"userConsented", "logContainsPii", "configCorrupt"}: print("invalid: field")\n    elif m["userConsented"] not in {"yes", "no"}: print("invalid: userConsented")\n    elif m["logContainsPii"] not in {"yes", "no"}: print("invalid: logContainsPii")\n    elif m["configCorrupt"] not in {"yes", "no"}: print("invalid: configCorrupt")\n    elif m["userConsented"] == "no": print("deny: no consent")\n    elif m["logContainsPii"] == "yes": print("redact: pii found")\n    elif m["configCorrupt"] == "yes": print("allow: safe mode")\n    else: print("allow: send diagnostics")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, mở tệp nhật ký của một app desktop bạn đang dùng và đếm xem có bao nhiêu dòng chứa tên người dùng, đường dẫn cá nhân hay email. Viết một hàm che các dạng đó rồi chạy thử trên chính tệp nhật ký ấy.',
    cards: [
      {
        hoi: 'Vì sao sự đồng ý được xét trước cả việc nhật ký có sạch hay không?',
        dap: 'Vì dữ liệu trên máy người dùng là của họ; sạch hay bẩn cũng không cho ta quyền gửi đi khi chưa được phép.',
      },
      {
        hoi: 'Chế độ an toàn dùng để làm gì?',
        dap: 'Để app vẫn mở được với cấu hình mặc định khi cấu hình người dùng hỏng, nhờ vậy họ còn cứu được dữ liệu thay vì bị khoá ngoài.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u281-l2',
    unitId: 'p6-u281',
    title: 'gói báo lỗi: đúng thứ cần, không kèm tài liệu người dùng',
    hook: 'Một gói báo lỗi "để cho chắc" kèm luôn tệp người dùng đang mở — và bạn vừa nhận về thứ mình không được phép giữ.',
    theory:
      'Gói chẩn đoán phải hẹp nhất có thể. Thứ tự xét: kèm nội dung tài liệu người dùng thì che trước đã, vì đó là vấn đề quyền riêng tư nặng hơn mọi vấn đề kỹ thuật; thiếu bảng ký hiệu thì vết gọi chỉ là dãy địa chỉ vô nghĩa nên từ chối tiếp nhận; gói vượt trần 50MB thì reject vì người dùng phải tải lên bằng đường truyền của họ. Ngưỡng 50MB là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG lọc nội dung người dùng khỏi gói báo lỗi\nincludes_user_file = "yes"\nprint("redact: user file in bundle" if includes_user_file == "yes" else "allow: send report")',
    predictCode:
      'includes_user_file, symbols_uploaded, bundle_size_mb = "no", "no", 120\nif includes_user_file == "yes":\n    print("redact: user file in bundle")\nelif symbols_uploaded == "no":\n    print("refuse: stack not symbolized")\nelif bundle_size_mb > 50:\n    print("reject: bundle too large")\nelse:\n    print("allow: send report")',
    predictChoices: [
      'reject: bundle too large',
      'refuse: stack not symbolized',
      'redact: user file in bundle',
      'allow: send report',
    ],
    predictAnswer: 1,
    predictExplain:
      'Không kèm tệp người dùng nên không che, nhưng chưa có bảng ký hiệu thì vết gọi không đọc được, và nhánh đó được xét trước kích thước gói.',
    makePrompt:
      'Đọc fixture `includesUserFile:<yes|no>,symbolsUploaded:<yes|no>,bundleSizeMb:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; includesUserFile là yes → `redact: user file in bundle`; symbolsUploaded là no → `refuse: stack not symbolized`; bundleSizeMb lớn hơn 50 → `reject: bundle too large`; còn lại → `allow: send report`. MÔ PHỎNG, không đóng gói hay tải lên gì thật.',
    testCases: [
      {
        stdinLines: ['includesUserFile:no,symbolsUploaded:yes,bundleSizeMb:8'],
        expected: 'allow: send report',
        hidden: false,
        label: 'gói hẹp, đọc được và đủ nhỏ',
      },
      {
        stdinLines: ['includesUserFile:yes,symbolsUploaded:no,bundleSizeMb:120'],
        expected: 'redact: user file in bundle',
        hidden: true,
        label: 'quyền riêng tư được xét trước mọi lỗi kỹ thuật',
      },
      {
        stdinLines: ['includesUserFile:no,symbolsUploaded:no,bundleSizeMb:8'],
        expected: 'refuse: stack not symbolized',
        hidden: true,
        label: 'thiếu bảng ký hiệu thì vết gọi vô dụng',
      },
      {
        stdinLines: ['includesUserFile:no,symbolsUploaded:yes,bundleSizeMb:120'],
        expected: 'reject: bundle too large',
        hidden: true,
        label: 'gói vượt trần 50MB',
      },
      {
        stdinLines: ['includesUserFile:no,symbolsUploaded:yes,bundleSizeMb:tam'],
        expected: 'invalid: bundleSizeMb',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"includesUserFile", "symbolsUploaded", "bundleSizeMb"}: print("invalid: field")\n    elif m["includesUserFile"] not in {"yes", "no"}: print("invalid: includesUserFile")\n    elif m["symbolsUploaded"] not in {"yes", "no"}: print("invalid: symbolsUploaded")\n    elif not m["bundleSizeMb"].isdigit(): print("invalid: bundleSizeMb")\n    elif m["includesUserFile"] == "yes": print("redact: user file in bundle")\n    elif m["symbolsUploaded"] == "no": print("refuse: stack not symbolized")\n    elif int(m["bundleSizeMb"]) > 50: print("reject: bundle too large")\n    else: print("allow: send report")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, liệt kê chính xác những tệp mà app của bạn sẽ đưa vào một gói báo lỗi, rồi viết màn hình xem trước cho người dùng thấy đúng danh sách đó trước khi họ bấm gửi.',
    cards: [
      {
        hoi: 'Vì sao phải cho người dùng xem trước gói báo lỗi?',
        dap: 'Vì đồng ý chỉ có nghĩa khi họ biết mình đang đồng ý gửi cái gì; một hộp thoại "gửi báo cáo?" không nói rõ nội dung thì không phải sự đồng ý thật.',
      },
      {
        hoi: 'Bảng ký hiệu phục vụ gì trong báo lỗi?',
        dap: 'Nó dịch địa chỉ trong vết gọi thành tên hàm và số dòng; thiếu nó thì báo lỗi chỉ là dãy số không truy ngược được về mã nguồn.',
      },
    ],
  }),
]
