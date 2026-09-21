// P6-U280 — desktop-s2-m3 "Đồng bộ tuỳ chọn": phát hiện xung đột khi hai máy cùng sửa (bài 1)
// và giữ nguyên tắc "offline là mặc định, đám mây là tuỳ chọn" (bài 2). Đồng bộ là thứ dễ làm
// mất dữ liệu nhất trong app desktop, vì nó ghi đè âm thầm.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U280_LESSONS = [
  desktopSimulation({
    id: 'p6-u280-l1',
    unitId: 'p6-u280',
    title: 'xung đột đồng bộ: drift khi hai bên sửa cùng một trường',
    hook: 'Máy ở nhà đổi phím tắt, máy ở công ty đổi đúng phím đó — bên nào đồng bộ sau cũng sẽ xoá công của bên kia, nếu app tự quyết thay người dùng.',
    theory:
      'Luật đầu là bảo mật: dữ liệu tuỳ chọn của người dùng phải được mã hoá (encrypted) trước khi rời máy, chưa mã hoá thì deny. Sau đó mới tới hoà giải: giao của hai tập trường đã đổi khác rỗng nghĩa là hai bên đụng nhau thật sự nên trả drift và để người dùng chọn, tuyệt đối không tự ghi đè. Một bên không đổi gì thì fast-forward an toàn. Hai bên cùng số phiên bản mà nội dung khác nhau là dấu hiệu lịch sử đã lệch, trả unknown chứ không đoán bên nào đúng.',
    workedCode:
      '# MÔ PHỎNG giao của hai tập trường đã đổi\ntruong_local, truong_remote = {"theme", "font"}, {"font"}\nprint("drift: manual merge required" if truong_local & truong_remote else "allow: fast-forward")',
    predictCode:
      'local_version, remote_version = 3, 3\ntruong_local, truong_remote = {"theme"}, {"font"}\nif truong_local & truong_remote:\n    print("drift: manual merge required")\nelif not truong_local or not truong_remote:\n    print("allow: fast-forward")\nelif local_version == remote_version:\n    print("unknown: same version different content")\nelse:\n    print("allow: fast-forward")',
    predictChoices: [
      'drift: manual merge required',
      'allow: fast-forward',
      'unknown: same version different content',
      'deny: not encrypted',
    ],
    predictAnswer: 2,
    predictExplain:
      'Hai tập trường rời nhau nên chưa phải xung đột trực tiếp, nhưng cùng số phiên bản mà nội dung khác nhau nghĩa là số phiên bản đã mất ý nghĩa — không đủ căn cứ để hoà giải.',
    makePrompt:
      'Đọc fixture `localVersion:<số>,remoteVersion:<số>,fieldsLocal:<danh sách ngăn bằng dấu |, có thể rỗng>,fieldsRemote:<tương tự>,encrypted:<yes|no>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; encrypted là no → `deny: not encrypted`; giao hai tập trường khác rỗng → `drift: manual merge required`; một trong hai tập rỗng → `allow: fast-forward`; localVersion bằng remoteVersion → `unknown: same version different content`; còn lại → `allow: fast-forward`. MÔ PHỎNG, không gọi mạng và không mã hoá thật.',
    testCases: [
      {
        stdinLines: [
          'localVersion:4,remoteVersion:3,fieldsLocal:theme,fieldsRemote:,encrypted:yes',
        ],
        expected: 'allow: fast-forward',
        hidden: false,
        label: 'một bên không đổi gì',
      },
      {
        stdinLines: [
          'localVersion:4,remoteVersion:3,fieldsLocal:theme|font,fieldsRemote:font,encrypted:yes',
        ],
        expected: 'drift: manual merge required',
        hidden: true,
        label: 'hai bên sửa cùng một trường',
      },
      {
        stdinLines: [
          'localVersion:3,remoteVersion:3,fieldsLocal:theme,fieldsRemote:font,encrypted:yes',
        ],
        expected: 'unknown: same version different content',
        hidden: true,
        label: 'cùng phiên bản nhưng nội dung khác',
      },
      {
        stdinLines: [
          'localVersion:4,remoteVersion:3,fieldsLocal:theme,fieldsRemote:font,encrypted:no',
        ],
        expected: 'deny: not encrypted',
        hidden: true,
        label: 'chưa mã hoá thì không được gửi đi',
      },
      {
        stdinLines: [
          'localVersion:x,remoteVersion:3,fieldsLocal:theme,fieldsRemote:font,encrypted:yes',
        ],
        expected: 'invalid: localVersion',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"localVersion", "remoteVersion", "fieldsLocal", "fieldsRemote", "encrypted"}: print("invalid: field")\n    elif not m["localVersion"].isdigit(): print("invalid: localVersion")\n    elif not m["remoteVersion"].isdigit(): print("invalid: remoteVersion")\n    elif m["encrypted"] not in {"yes", "no"}: print("invalid: encrypted")\n    else:\n        tl = set(p for p in m["fieldsLocal"].split("|") if p)\n        tr = set(p for p in m["fieldsRemote"].split("|") if p)\n        if m["encrypted"] == "no": print("deny: not encrypted")\n        elif tl & tr: print("drift: manual merge required")\n        elif not tl or not tr: print("allow: fast-forward")\n        elif int(m["localVersion"]) == int(m["remoteVersion"]): print("unknown: same version different content")\n        else: print("allow: fast-forward")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, mở cùng một ghi chú trên hai thiết bị của một app đồng bộ bạn đang dùng, sửa cùng một dòng ở cả hai khi đang offline, rồi cho cả hai lên mạng. Ghi lại app xử lý xung đột thế nào: hỏi bạn, tạo bản sao, hay im lặng ghi đè.',
    cards: [
      {
        hoi: 'Vì sao "bản ghi sau thắng" là chiến lược hoà giải tệ?',
        dap: 'Vì nó im lặng xoá công của bên kia và người dùng chỉ phát hiện rất lâu sau đó, khi đã không còn bản sao nào để khôi phục.',
      },
      {
        hoi: 'Vì sao phải mã hoá tuỳ chọn người dùng trước khi đồng bộ?',
        dap: 'Vì dữ liệu rời khỏi máy là ra khỏi tầm kiểm soát của người dùng; mã hoá đầu cuối giữ cho máy chủ đồng bộ không đọc được nội dung của họ.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u280-l2',
    unitId: 'p6-u280',
    title: 'offline là mặc định, đám mây chỉ là tuỳ chọn cắm thêm',
    hook: 'App desktop bắt đăng nhập mới mở được tệp nằm sẵn trên ổ cứng là app đã đánh mất lý do tồn tại của mình.',
    theory:
      'Hợp đồng offline-first xét ba điều theo thứ tự: app phải chạy đủ chức năng khi không mạng (deny nếu không), đồng bộ phải gỡ ra được mà app vẫn dùng bình thường (reject nếu bắt buộc), và hàng đợi thao tác chờ đồng bộ không được phình quá ngưỡng 100 (refuse nếu vượt, vì hàng đợi quá dài thì khả năng xung đột lúc nối mạng lại tăng vọt). Ngưỡng 100 là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG luật offline-first\nworks_offline = "no"\nprint("deny: offline not default" if works_offline == "no" else "allow: sync later")',
    predictCode:
      'works_offline, sync_optional, queued_ops = "yes", "yes", 240\nif works_offline == "no":\n    print("deny: offline not default")\nelif sync_optional == "no":\n    print("reject: sync mandatory")\nelif queued_ops > 100:\n    print("refuse: queue backlog too large")\nelse:\n    print("allow: sync later")',
    predictChoices: [
      'allow: sync later',
      'refuse: queue backlog too large',
      'reject: sync mandatory',
      'deny: offline not default',
    ],
    predictAnswer: 1,
    predictExplain:
      'Hai luật đầu đều đạt, nhưng 240 thao tác chờ vượt ngưỡng 100 nên phải xử lý hàng đợi trước khi nhận thêm việc đồng bộ.',
    makePrompt:
      'Đọc fixture `worksOffline:<yes|no>,syncOptional:<yes|no>,queuedOps:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; worksOffline là no → `deny: offline not default`; syncOptional là no → `reject: sync mandatory`; queuedOps lớn hơn 100 → `refuse: queue backlog too large`; còn lại → `allow: sync later`. MÔ PHỎNG, không gọi dịch vụ đám mây thật.',
    testCases: [
      {
        stdinLines: ['worksOffline:yes,syncOptional:yes,queuedOps:12'],
        expected: 'allow: sync later',
        hidden: false,
        label: 'offline-first và hàng đợi ngắn',
      },
      {
        stdinLines: ['worksOffline:no,syncOptional:no,queuedOps:240'],
        expected: 'deny: offline not default',
        hidden: true,
        label: 'luật offline được xét trước',
      },
      {
        stdinLines: ['worksOffline:yes,syncOptional:no,queuedOps:12'],
        expected: 'reject: sync mandatory',
        hidden: true,
        label: 'đồng bộ bị ép thành bắt buộc',
      },
      {
        stdinLines: ['worksOffline:yes,syncOptional:yes,queuedOps:240'],
        expected: 'refuse: queue backlog too large',
        hidden: true,
        label: 'hàng đợi chờ đồng bộ phình quá ngưỡng',
      },
      {
        stdinLines: ['worksOffline:yes,syncOptional:yes,queuedOps:'],
        expected: 'invalid: queuedOps',
        hidden: true,
        label: 'ca âm — thiếu giá trị fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"worksOffline", "syncOptional", "queuedOps"}: print("invalid: field")\n    elif m["worksOffline"] not in {"yes", "no"}: print("invalid: worksOffline")\n    elif m["syncOptional"] not in {"yes", "no"}: print("invalid: syncOptional")\n    elif not m["queuedOps"].isdigit(): print("invalid: queuedOps")\n    elif m["worksOffline"] == "no": print("deny: offline not default")\n    elif m["syncOptional"] == "no": print("reject: sync mandatory")\n    elif int(m["queuedOps"]) > 100: print("refuse: queue backlog too large")\n    else: print("allow: sync later")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, tắt mạng máy bạn rồi dùng thử một app desktop quen thuộc trong 15 phút. Ghi lại chức năng nào vẫn chạy, chức năng nào chết, và app báo cho bạn biết điều đó rõ ràng tới đâu.',
    cards: [
      {
        hoi: '"Đồng bộ là tuỳ chọn cắm thêm" nghĩa là gì về mặt kiến trúc?',
        dap: 'Nghĩa là tầng đồng bộ chỉ đọc/ghi qua lõi dữ liệu cục bộ; gỡ nó đi thì lõi vẫn chạy đủ, nên không có chức năng nghiệp vụ nào phụ thuộc mạng.',
      },
      {
        hoi: 'Vì sao hàng đợi thao tác chờ đồng bộ nên có trần?',
        dap: 'Vì hàng đợi càng dài thì lần nối mạng lại càng nhiều xung đột phải hoà giải cùng lúc, và người dùng không còn nhớ mình đã làm gì để chọn đúng.',
      },
    ],
  }),
]
