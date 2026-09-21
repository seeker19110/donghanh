// P6-U276 — desktop-s1-m3 "Lưu trữ cục bộ": phiên bản định dạng dữ liệu và đường nâng cấp
// (bài 1), sao lưu/xuất dữ liệu người dùng trước khi động vào (bài 2). Dữ liệu người dùng là
// thứ duy nhất trong app desktop không thể tải lại từ máy chủ nếu hỏng.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U276_LESSONS = [
  desktopSimulation({
    id: 'p6-u276-l1',
    unitId: 'p6-u276',
    title: 'schemaVersion, dataVersion và bước migration còn thiếu',
    hook: 'Người dùng cài bản mới ở máy công ty, mở tệp đó ở máy nhà đang chạy bản cũ — app bản cũ phải từ chối, chứ đọc bừa là hỏng dữ liệu.',
    theory:
      'Tệp và CSDL cục bộ phải có schemaVersion ghi ngay trong dữ liệu, còn app biết phiên bản nó hỗ trợ. Hợp đồng xét ba nhánh theo thứ tự tất định: dataVersion lớn hơn schemaVersion là dữ liệu tới từ tương lai nên deny (app không thể đoán trường mới nghĩa là gì); dataVersion nhỏ hơn mà không có bước chuyển thì refuse; có đủ bước chuyển thì allow migrate. Hai phiên bản bằng nhau thì mở thẳng.',
    workedCode:
      '# MÔ PHỎNG cổng phiên bản dữ liệu\nschema_version, data_version = 3, 5\nprint("deny: data newer than app" if data_version > schema_version else "allow: open as is")',
    predictCode:
      'schema_version, data_version, has_migration = 5, 3, "no"\nif data_version > schema_version:\n    print("deny: data newer than app")\nelif data_version < schema_version and has_migration == "no":\n    print("refuse: missing migration step")\nelif data_version < schema_version:\n    print("allow: migrate")\nelse:\n    print("allow: open as is")',
    predictChoices: [
      'allow: migrate',
      'refuse: missing migration step',
      'deny: data newer than app',
      'allow: open as is',
    ],
    predictAnswer: 1,
    predictExplain:
      'Dữ liệu cũ hơn app là ca nâng cấp được, nhưng không khai bước chuyển nào thì app không có đường đưa dữ liệu lên phiên bản mới, nên từ chối thay vì đọc bừa.',
    makePrompt:
      'Đọc fixture `schemaVersion:<số>,dataVersion:<số>,hasMigration:<yes|no>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; dataVersion > schemaVersion → `deny: data newer than app`; dataVersion < schemaVersion mà hasMigration là no → `refuse: missing migration step`; dataVersion < schemaVersion và có bước chuyển → `allow: migrate`; bằng nhau → `allow: open as is`. MÔ PHỎNG, không mở SQLite hay tệp thật.',
    testCases: [
      {
        stdinLines: ['schemaVersion:5,dataVersion:5,hasMigration:no'],
        expected: 'allow: open as is',
        hidden: false,
        label: 'cùng phiên bản thì mở thẳng',
      },
      {
        stdinLines: ['schemaVersion:3,dataVersion:5,hasMigration:yes'],
        expected: 'deny: data newer than app',
        hidden: true,
        label: 'dữ liệu mới hơn app biết',
      },
      {
        stdinLines: ['schemaVersion:5,dataVersion:3,hasMigration:no'],
        expected: 'refuse: missing migration step',
        hidden: true,
        label: 'thiếu bước chuyển thì không nâng cấp',
      },
      {
        stdinLines: ['schemaVersion:5,dataVersion:3,hasMigration:yes'],
        expected: 'allow: migrate',
        hidden: true,
        label: 'đủ bước chuyển thì nâng cấp',
      },
      {
        stdinLines: ['schemaVersion:5,dataVersion:x,hasMigration:yes'],
        expected: 'invalid: dataVersion',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"schemaVersion", "dataVersion", "hasMigration"}: print("invalid: field")\n    elif not m["schemaVersion"].isdigit(): print("invalid: schemaVersion")\n    elif not m["dataVersion"].isdigit(): print("invalid: dataVersion")\n    elif m["hasMigration"] not in {"yes", "no"}: print("invalid: hasMigration")\n    else:\n        sv, dv = int(m["schemaVersion"]), int(m["dataVersion"])\n        if dv > sv: print("deny: data newer than app")\n        elif dv < sv and m["hasMigration"] == "no": print("refuse: missing migration step")\n        elif dv < sv: print("allow: migrate")\n        else: print("allow: open as is")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, tạo một CSDL SQLite có bảng `meta(schema_version)`, viết hai bước migration và chạy thử mở tệp của phiên bản cũ bằng app đã nâng cấp. Ghi lại app xử lý thế nào khi bạn sửa tay schema_version thành số lớn hơn app hỗ trợ.',
    cards: [
      {
        hoi: 'Vì sao dữ liệu mới hơn app lại nguy hiểm hơn dữ liệu cũ hơn app?',
        dap: 'Dữ liệu cũ có đường nâng cấp tiến lên, còn dữ liệu mới chứa trường app không hiểu; đọc rồi ghi lại sẽ làm mất chính những trường đó.',
      },
      {
        hoi: 'Phiên bản schema nên lưu ở đâu?',
        dap: 'Ngay trong chính tệp hoặc CSDL dữ liệu, không lưu ở cấu hình riêng — vì tệp có thể được chép sang máy khác mà không kèm cấu hình.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u276-l2',
    unitId: 'p6-u276',
    title: 'sao lưu và xuất dữ liệu trước khi migrate',
    hook: 'Migration nào cũng có lần đầu chạy trên máy người dùng thật, và lần đó không có nút hoàn tác nếu bạn chưa sao lưu.',
    theory:
      'Trước khi migrate, hợp đồng đòi ba bằng chứng theo thứ tự: đã sao lưu bản trước, có định dạng xuất dữ liệu để người dùng mang đi nơi khác, và kho dữ liệu không rỗng. Kho rỗng trả unknown chứ không allow, vì rỗng có thể là chưa dùng bao giờ cũng có thể là đã mất dữ liệu — hai chuyện khác hẳn nhau và simulator không có cách phân biệt.',
    workedCode:
      '# MÔ PHỎNG cổng sao lưu trước migrate\nbackup_before = "no"\nprint("deny: no backup before migrate" if backup_before == "no" else "allow: export")',
    predictCode:
      'backup_before, export_format, row_count = "yes", "json", 0\nif backup_before == "no":\n    print("deny: no backup before migrate")\nelif export_format == "none":\n    print("refuse: export format missing")\nelif row_count == 0:\n    print("unknown: empty store")\nelse:\n    print("allow: export")',
    predictChoices: [
      'allow: export',
      'unknown: empty store',
      'refuse: export format missing',
      'deny: no backup before migrate',
    ],
    predictAnswer: 1,
    predictExplain:
      'Đã sao lưu và có định dạng xuất, nhưng kho không có dòng nào thì không phân biệt được "chưa dùng" với "đã mất dữ liệu", nên trả unknown.',
    makePrompt:
      'Đọc fixture `backupBefore:<yes|no>,exportFormat:<json|csv|none>,rowCount:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; backupBefore là no → `deny: no backup before migrate`; exportFormat là none → `refuse: export format missing`; rowCount bằng 0 → `unknown: empty store`; còn lại → `allow: export`. MÔ PHỎNG, không ghi tệp sao lưu thật.',
    testCases: [
      {
        stdinLines: ['backupBefore:yes,exportFormat:json,rowCount:120'],
        expected: 'allow: export',
        hidden: false,
        label: 'đủ sao lưu, định dạng xuất và dữ liệu',
      },
      {
        stdinLines: ['backupBefore:no,exportFormat:json,rowCount:120'],
        expected: 'deny: no backup before migrate',
        hidden: true,
        label: 'chưa sao lưu thì không được migrate',
      },
      {
        stdinLines: ['backupBefore:yes,exportFormat:none,rowCount:120'],
        expected: 'refuse: export format missing',
        hidden: true,
        label: 'không có đường mang dữ liệu đi',
      },
      {
        stdinLines: ['backupBefore:yes,exportFormat:csv,rowCount:0'],
        expected: 'unknown: empty store',
        hidden: true,
        label: 'kho rỗng thì không kết luận',
      },
      {
        stdinLines: ['backupBefore:yes,exportFormat:xml,rowCount:10'],
        expected: 'invalid: exportFormat',
        hidden: true,
        label: 'ca âm — định dạng ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"backupBefore", "exportFormat", "rowCount"}: print("invalid: field")\n    elif m["backupBefore"] not in {"yes", "no"}: print("invalid: backupBefore")\n    elif m["exportFormat"] not in {"json", "csv", "none"}: print("invalid: exportFormat")\n    elif not m["rowCount"].isdigit(): print("invalid: rowCount")\n    elif m["backupBefore"] == "no": print("deny: no backup before migrate")\n    elif m["exportFormat"] == "none": print("refuse: export format missing")\n    elif int(m["rowCount"]) == 0: print("unknown: empty store")\n    else: print("allow: export")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, thêm chức năng "Xuất dữ liệu" vào một app nhỏ của bạn: xuất toàn bộ dữ liệu người dùng ra JSON, rồi nhập lại vào một bản cài sạch và đối chiếu số bản ghi trước/sau.',
    cards: [
      {
        hoi: 'Vì sao app desktop bắt buộc có chức năng xuất dữ liệu?',
        dap: 'Vì dữ liệu nằm trên máy người dùng: không xuất được thì họ bị khoá vào app của bạn và mất trắng nếu app ngừng phát triển.',
      },
      {
        hoi: 'Kho dữ liệu rỗng nên kết luận thế nào?',
        dap: 'Trả unknown và hỏi lại, vì rỗng do chưa dùng khác hẳn rỗng do mất dữ liệu, mà hậu quả của việc đoán sai là ghi đè lên bản sao lưu cuối cùng.',
      },
    ],
  }),
]
