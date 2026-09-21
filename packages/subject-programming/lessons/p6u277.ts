// P6-U277 — desktop-s1-m4 "Đóng gói và cài đặt": cổng phát hành một bản cài (bài 1) và cổng
// nhận một bản cập nhật tự động (bài 2). Cả hai cùng trả lời một câu: gói nhị phân này có đủ
// bằng chứng để được chạy trên máy người lạ chưa.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U277_LESSONS = [
  desktopSimulation({
    id: 'p6-u277-l1',
    unitId: 'p6-u277',
    title: 'cổng cài đặt: signed, checksum và hệ điều hành đích',
    hook: 'Bản cài chưa ký làm Windows hiện cảnh báo "phần mềm lạ" — phần lớn người dùng dừng ngay ở màn hình đó và bạn mất họ vĩnh viễn.',
    theory:
      'Cổng cài đặt xét ba bằng chứng độc lập theo thứ tự tất định: chữ ký trước (không ký thì không có gì bảo đảm gói này của bạn), rồi checksum (ký đúng nhưng tải hỏng vẫn không chạy được), rồi hệ điều hành đích có nằm trong danh sách hỗ trợ đã khai không. Thứ tự này cố định để hai fixture cùng sai nhiều chỗ vẫn cho đúng một kết luận.',
    workedCode:
      '# MÔ PHỎNG cổng cài đặt\nsigned, checksum_ok = "yes", "no"\nprint("deny: unsigned package" if signed == "no" else ("reject: checksum mismatch" if checksum_ok == "no" else "allow: install"))',
    predictCode:
      'HO_TRO = {"windows", "macos", "linux"}\nsigned, checksum_ok, target_os = "yes", "yes", "freebsd"\nif signed == "no":\n    print("deny: unsigned package")\nelif checksum_ok == "no":\n    print("reject: checksum mismatch")\nelif target_os not in HO_TRO:\n    print("refuse: unsupported os")\nelse:\n    print("allow: install")',
    predictChoices: [
      'allow: install',
      'refuse: unsupported os',
      'reject: checksum mismatch',
      'deny: unsigned package',
    ],
    predictAnswer: 1,
    predictExplain:
      'Gói đã ký và checksum đúng, nhưng hệ đích không nằm trong ba hệ đã khai hỗ trợ nên không có bản cài nào để chạy.',
    makePrompt:
      'Đọc fixture `signed:<yes|no>,checksumOk:<yes|no>,targetOs:<chuỗi>` với danh sách hỗ trợ {windows, macos, linux}. Thiếu trường hoặc sai miền yes/no → `invalid: <trường>`; signed là no → `deny: unsigned package`; checksumOk là no → `reject: checksum mismatch`; targetOs ngoài danh sách hỗ trợ → `refuse: unsupported os`; còn lại → `allow: install`. MÔ PHỎNG, không chạy trình cài đặt và không ký mã thật.',
    testCases: [
      {
        stdinLines: ['signed:yes,checksumOk:yes,targetOs:macos'],
        expected: 'allow: install',
        hidden: false,
        label: 'đủ ba bằng chứng',
      },
      {
        stdinLines: ['signed:no,checksumOk:no,targetOs:freebsd'],
        expected: 'deny: unsigned package',
        hidden: true,
        label: 'chưa ký được xét trước mọi lỗi khác',
      },
      {
        stdinLines: ['signed:yes,checksumOk:no,targetOs:windows'],
        expected: 'reject: checksum mismatch',
        hidden: true,
        label: 'gói tải hỏng',
      },
      {
        stdinLines: ['signed:yes,checksumOk:yes,targetOs:freebsd'],
        expected: 'refuse: unsupported os',
        hidden: true,
        label: 'hệ đích ngoài danh sách hỗ trợ',
      },
      {
        stdinLines: ['signed:maybe,checksumOk:yes,targetOs:linux'],
        expected: 'invalid: signed',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'HO_TRO = {"windows", "macos", "linux"}\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"signed", "checksumOk", "targetOs"}: print("invalid: field")\n    elif m["signed"] not in {"yes", "no"}: print("invalid: signed")\n    elif m["checksumOk"] not in {"yes", "no"}: print("invalid: checksumOk")\n    elif not m["targetOs"]: print("invalid: targetOs")\n    elif m["signed"] == "no": print("deny: unsigned package")\n    elif m["checksumOk"] == "no": print("reject: checksum mismatch")\n    elif m["targetOs"] not in HO_TRO: print("refuse: unsupported os")\n    else: print("allow: install")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, đóng gói một app nhỏ cho một hệ điều hành, tính checksum SHA-256 của bản cài và công bố kèm bản tải. Tự tải về ở máy khác, đối chiếu checksum, rồi ghi lại cảnh báo hệ hiện ra khi gói chưa được ký.',
    cards: [
      {
        hoi: 'Chữ ký và checksum khác nhau ở chỗ nào?',
        dap: 'Checksum chỉ chứng minh tệp không hỏng khi tải; chữ ký chứng minh tệp đúng là của bạn phát hành và chưa bị ai sửa.',
      },
      {
        hoi: 'Vì sao phải khai danh sách hệ điều hành hỗ trợ?',
        dap: 'Để từ chối sớm và nói rõ lý do, thay vì để người dùng cài một gói không chạy được rồi tưởng app của bạn hỏng.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u277-l2',
    unitId: 'p6-u277',
    title: 'cập nhật tự động: khoảng cách phiên bản và gói đã ký',
    hook: 'Người dùng mở lại app sau hai năm và bản cập nhật tự động nhảy thẳng từ v2 lên v12 — mọi bước chuyển dữ liệu ở giữa bị bỏ qua.',
    theory:
      'Cập nhật tự động là đường để mã lạ chạy trên máy người dùng nên vẫn phải qua cổng chữ ký. Sau đó hợp đồng xét hướng phiên bản (bản mới phải lớn hơn bản đang chạy) rồi tới khoảng cách: nhảy quá 5 phiên bản thì từ chối, vì chuỗi migration dữ liệu chưa được kiểm trên quãng dài đó. Ngưỡng 5 là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG hướng phiên bản cập nhật\ncurrent_version, new_version = 7, 7\nprint("reject: not an upgrade" if new_version <= current_version else "allow: auto update")',
    predictCode:
      'signed_update, current_version, new_version = "yes", 2, 12\nif signed_update == "no":\n    print("deny: unsigned package")\nelif new_version <= current_version:\n    print("reject: not an upgrade")\nelif new_version - current_version > 5:\n    print("refuse: version gap too large")\nelse:\n    print("allow: auto update")',
    predictChoices: [
      'allow: auto update',
      'reject: not an upgrade',
      'refuse: version gap too large',
      'deny: unsigned package',
    ],
    predictAnswer: 2,
    predictExplain:
      'Gói đã ký và đúng là bản mới hơn, nhưng nhảy mười phiên bản vượt ngưỡng 5 nên chuỗi chuyển dữ liệu chưa có bằng chứng chạy đúng.',
    makePrompt:
      'Đọc fixture `signedUpdate:<yes|no>,currentVersion:<số>,newVersion:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; signedUpdate là no → `deny: unsigned package`; newVersion không lớn hơn currentVersion → `reject: not an upgrade`; hiệu hai phiên bản lớn hơn 5 → `refuse: version gap too large`; còn lại → `allow: auto update`. MÔ PHỎNG, không tải hay cài bản cập nhật thật.',
    testCases: [
      {
        stdinLines: ['signedUpdate:yes,currentVersion:7,newVersion:9'],
        expected: 'allow: auto update',
        hidden: false,
        label: 'bước nhảy ngắn và gói đã ký',
      },
      {
        stdinLines: ['signedUpdate:no,currentVersion:7,newVersion:9'],
        expected: 'deny: unsigned package',
        hidden: true,
        label: 'bản cập nhật chưa ký',
      },
      {
        stdinLines: ['signedUpdate:yes,currentVersion:7,newVersion:7'],
        expected: 'reject: not an upgrade',
        hidden: true,
        label: 'không phải bản mới hơn',
      },
      {
        stdinLines: ['signedUpdate:yes,currentVersion:2,newVersion:12'],
        expected: 'refuse: version gap too large',
        hidden: true,
        label: 'nhảy quá xa, chuỗi migration chưa kiểm',
      },
      {
        stdinLines: ['signedUpdate:yes,currentVersion:x,newVersion:12'],
        expected: 'invalid: currentVersion',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"signedUpdate", "currentVersion", "newVersion"}: print("invalid: field")\n    elif m["signedUpdate"] not in {"yes", "no"}: print("invalid: signedUpdate")\n    elif not m["currentVersion"].isdigit(): print("invalid: currentVersion")\n    elif not m["newVersion"].isdigit(): print("invalid: newVersion")\n    else:\n        cur, new = int(m["currentVersion"]), int(m["newVersion"])\n        if m["signedUpdate"] == "no": print("deny: unsigned package")\n        elif new <= cur: print("reject: not an upgrade")\n        elif new - cur > 5: print("refuse: version gap too large")\n        else: print("allow: auto update")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, dựng một luồng cập nhật tự động thật cho app nhỏ của bạn (ví dụ bằng cơ chế updater của Tauri hoặc Electron), phát hành ba phiên bản liên tiếp và ghi lại app xử lý ra sao khi bạn cố tình bỏ qua một phiên bản ở giữa.',
    cards: [
      {
        hoi: 'Vì sao cập nhật tự động vẫn phải kiểm chữ ký dù tải từ máy chủ của mình?',
        dap: 'Vì đường truyền và máy chủ đều có thể bị chiếm; chữ ký là thứ duy nhất xác minh được ở phía máy người dùng, nơi mã sắp chạy.',
      },
      {
        hoi: 'Vì sao khoảng cách phiên bản quá xa lại đáng từ chối?',
        dap: 'Vì chuỗi chuyển dữ liệu qua nhiều phiên bản hiếm khi được kiểm đủ; cập nhật theo bậc thang an toàn hơn nhảy một phát.',
      },
    ],
  }),
]
