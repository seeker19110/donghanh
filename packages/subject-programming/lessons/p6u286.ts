// P6-U286 — desktop-s4-m1 "Phân phối và cấp phép": kích hoạt giấy phép kể cả khi máy không mạng
// (bài 1), chính sách dùng thử và hoàn tiền (bài 2). Phần mềm có người trả tiền thì cấp phép trở
// thành một tầng riêng — hỏng nó không được phép làm hỏng dữ liệu người dùng.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U286_LESSONS = [
  desktopSimulation({
    id: 'p6-u286-l1',
    unitId: 'p6-u286',
    title: 'license, kích hoạt offline và phát hiện clock rollback',
    hook: 'Vặn đồng hồ máy lùi một năm là cách kéo dài bản dùng thử mà ai cũng biết — nếu bạn chỉ tin vào đồng hồ hệ.',
    theory:
      'Luật đầu tiên là chống gian lận rẻ tiền nhất: phát hiện lùi đồng hồ (clock rollback) bằng mốc thời gian đã ghi lần trước, thấy là deny ngay. Sau đó mới xét giấy phép có hợp lệ không, rồi tới trường hợp máy không mạng: nếu sản phẩm không hỗ trợ kích hoạt offline thì phải nói thẳng là từ chối, chứ không treo màn hình chờ mạng vô tận.',
    workedCode:
      '# MÔ PHỎNG phát hiện lùi đồng hồ\nclock_rollback_detected = "yes"\nprint("deny: clock rollback detected" if clock_rollback_detected == "yes" else "allow: activate")',
    predictCode:
      'rollback, license_valid, offline_ok = "no", "yes", "no"\nif rollback == "yes":\n    print("deny: clock rollback detected")\nelif license_valid == "no":\n    print("reject: invalid license")\nelif offline_ok == "no":\n    print("refuse: offline activation unsupported")\nelse:\n    print("allow: activate")',
    predictChoices: [
      'allow: activate',
      'deny: clock rollback detected',
      'reject: invalid license',
      'refuse: offline activation unsupported',
    ],
    predictAnswer: 3,
    predictExplain:
      'Không có dấu hiệu lùi đồng hồ và giấy phép hợp lệ, nhưng máy đang offline mà sản phẩm chưa hỗ trợ kích hoạt offline nên phải từ chối rõ ràng.',
    makePrompt:
      'Đọc fixture `clockRollbackDetected:<yes|no>,licenseValid:<yes|no>,offlineActivationOk:<yes|no>`. Thiếu trường hoặc sai miền → `invalid: <trường>`; clockRollbackDetected là yes → `deny: clock rollback detected`; licenseValid là no → `reject: invalid license`; offlineActivationOk là no → `refuse: offline activation unsupported`; còn lại → `allow: activate`. MÔ PHỎNG, không gọi máy chủ cấp phép và không đọc đồng hồ hệ thật.',
    testCases: [
      {
        stdinLines: ['clockRollbackDetected:no,licenseValid:yes,offlineActivationOk:yes'],
        expected: 'allow: activate',
        hidden: false,
        label: 'giấy phép hợp lệ và kích hoạt được',
      },
      {
        stdinLines: ['clockRollbackDetected:yes,licenseValid:no,offlineActivationOk:no'],
        expected: 'deny: clock rollback detected',
        hidden: true,
        label: 'lùi đồng hồ được xét trước mọi lỗi khác',
      },
      {
        stdinLines: ['clockRollbackDetected:no,licenseValid:no,offlineActivationOk:yes'],
        expected: 'reject: invalid license',
        hidden: true,
        label: 'giấy phép không hợp lệ',
      },
      {
        stdinLines: ['clockRollbackDetected:no,licenseValid:yes,offlineActivationOk:no'],
        expected: 'refuse: offline activation unsupported',
        hidden: true,
        label: 'máy không mạng mà chưa hỗ trợ kích hoạt offline',
      },
      {
        stdinLines: ['clockRollbackDetected:idk,licenseValid:yes,offlineActivationOk:yes'],
        expected: 'invalid: clockRollbackDetected',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"clockRollbackDetected", "licenseValid", "offlineActivationOk"}: print("invalid: field")\n    elif m["clockRollbackDetected"] not in {"yes", "no"}: print("invalid: clockRollbackDetected")\n    elif m["licenseValid"] not in {"yes", "no"}: print("invalid: licenseValid")\n    elif m["offlineActivationOk"] not in {"yes", "no"}: print("invalid: offlineActivationOk")\n    elif m["clockRollbackDetected"] == "yes": print("deny: clock rollback detected")\n    elif m["licenseValid"] == "no": print("reject: invalid license")\n    elif m["offlineActivationOk"] == "no": print("refuse: offline activation unsupported")\n    else: print("allow: activate")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, thiết kế cơ chế kích hoạt offline cho một sản phẩm giả định: người dùng dán mã máy, bạn cấp tệp giấy phép ký số, app xác minh mà không cần mạng. Viết ra đúng dữ liệu cần trong tệp đó.',
    cards: [
      {
        hoi: 'Vì sao không được chỉ dựa vào đồng hồ hệ để tính hạn dùng thử?',
        dap: 'Vì người dùng đổi đồng hồ được. Phải ghi mốc thời gian lần chạy trước và phát hiện khi đồng hồ lùi so với mốc đó.',
      },
      {
        hoi: 'Vì sao tầng cấp phép phải tách khỏi nghiệp vụ?',
        dap: 'Để hỏng cấp phép không làm hỏng dữ liệu: người dùng vẫn mở và xuất được tài liệu của họ, chỉ mất tính năng trả phí.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u286-l2',
    unitId: 'p6-u286',
    title: 'bản dùng thử và hoàn tiền: hết hạn không đồng nghĩa mất dữ liệu',
    hook: 'Bản dùng thử hết hạn rồi khoá luôn tệp người dùng đã làm là cách nhanh nhất biến một khách tiềm năng thành một bài đánh giá một sao.',
    theory:
      'Chính sách dùng thử phải giữ một bất biến tuyệt đối: dữ liệu người dùng tạo ra trong lúc dùng thử vẫn mở và xuất được sau khi hết hạn. Thứ tự xét: khoá dữ liệu sau khi hết hạn là deny; đòi hoàn tiền sau cửa sổ đã công bố (ngưỡng 14 ngày) là reject; còn trong hạn dùng thử thì allow tiếp tục dùng. Ngưỡng 14 ngày là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG bất biến dữ liệu sau khi hết hạn\nlocks_user_data = "yes"\nprint("deny: trial locks user data" if locks_user_data == "yes" else "allow: read-only mode")',
    predictCode:
      'locks_user_data, trial_days_left, refund_day = "no", 0, 30\nif locks_user_data == "yes":\n    print("deny: trial locks user data")\nelif refund_day > 14:\n    print("reject: refund window closed")\nelif trial_days_left == 0:\n    print("allow: read-only mode")\nelse:\n    print("allow: trial active")',
    predictChoices: [
      'allow: trial active',
      'deny: trial locks user data',
      'reject: refund window closed',
      'allow: read-only mode',
    ],
    predictAnswer: 2,
    predictExplain:
      'Dữ liệu không bị khoá nên không deny, nhưng ngày 30 đã quá cửa sổ hoàn tiền 14 ngày đã công bố.',
    makePrompt:
      'Đọc fixture `locksUserData:<yes|no>,trialDaysLeft:<số>,refundDay:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; locksUserData là yes → `deny: trial locks user data`; refundDay lớn hơn 14 → `reject: refund window closed`; trialDaysLeft bằng 0 → `allow: read-only mode`; còn lại → `allow: trial active`. MÔ PHỎNG, không xử lý thanh toán thật.',
    testCases: [
      {
        stdinLines: ['locksUserData:no,trialDaysLeft:7,refundDay:3'],
        expected: 'allow: trial active',
        hidden: false,
        label: 'còn hạn dùng thử và trong cửa sổ hoàn tiền',
      },
      {
        stdinLines: ['locksUserData:yes,trialDaysLeft:7,refundDay:3'],
        expected: 'deny: trial locks user data',
        hidden: true,
        label: 'khoá dữ liệu người dùng là vi phạm bất biến',
      },
      {
        stdinLines: ['locksUserData:no,trialDaysLeft:7,refundDay:30'],
        expected: 'reject: refund window closed',
        hidden: true,
        label: 'quá cửa sổ hoàn tiền đã công bố',
      },
      {
        stdinLines: ['locksUserData:no,trialDaysLeft:0,refundDay:3'],
        expected: 'allow: read-only mode',
        hidden: true,
        label: 'hết hạn dùng thử nhưng vẫn mở và xuất được dữ liệu',
      },
      {
        stdinLines: ['locksUserData:no,trialDaysLeft:bay,refundDay:3'],
        expected: 'invalid: trialDaysLeft',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"locksUserData", "trialDaysLeft", "refundDay"}: print("invalid: field")\n    elif m["locksUserData"] not in {"yes", "no"}: print("invalid: locksUserData")\n    elif not m["trialDaysLeft"].isdigit(): print("invalid: trialDaysLeft")\n    elif not m["refundDay"].isdigit(): print("invalid: refundDay")\n    elif m["locksUserData"] == "yes": print("deny: trial locks user data")\n    elif int(m["refundDay"]) > 14: print("reject: refund window closed")\n    elif int(m["trialDaysLeft"]) == 0: print("allow: read-only mode")\n    else: print("allow: trial active")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, viết trang chính sách dùng thử và hoàn tiền cho một sản phẩm giả định: nói rõ hết hạn thì mất gì, giữ gì, và xuất dữ liệu ra bằng cách nào. Đưa cho một người không kỹ thuật đọc và sửa chỗ họ hiểu sai.',
    cards: [
      {
        hoi: 'Sau khi bản dùng thử hết hạn, app nên giữ lại khả năng gì?',
        dap: 'Mở và xuất dữ liệu người dùng đã tạo. Khoá dữ liệu của họ để ép mua là cách làm mất niềm tin vĩnh viễn.',
      },
      {
        hoi: 'Vì sao cửa sổ hoàn tiền phải công bố bằng con số cụ thể?',
        dap: 'Vì nó là cam kết kiểm chứng được; nói mập mờ thì mỗi ca tranh cãi lại xử một kiểu và uy tín sản phẩm đi xuống.',
      },
    ],
  }),
]
