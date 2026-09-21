// P6-U282 — desktop-s3-m1 "Dữ liệu lớn trên máy đơn": ngân sách bộ nhớ khi mở tệp lớn và ảo hoá
// danh sách (bài 1), chỉ mục cho tìm kiếm toàn văn (bài 2). Máy người dùng không có cụm máy chủ
// để dựa vào, nên mọi giới hạn đều là giới hạn cứng.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U282_LESSONS = [
  desktopSimulation({
    id: 'p6-u282-l1',
    unitId: 'p6-u282',
    title: 'đọc theo luồng (stream) và ảo hoá danh sách triệu dòng',
    hook: 'Nạp trọn tệp 1GB vào RAM chạy ngon trên máy 32GB của bạn và giết app trên máy 8GB của khách.',
    theory:
      'Hai kỹ thuật giải hai vấn đề khác nhau: đọc theo luồng (stream) giữ bộ nhớ phẳng khi tệp lớn, còn ảo hoá danh sách giữ số thành phần giao diện phẳng khi số dòng lớn. Simulator xét ngân sách tệp trước (vượt trần 500MB mà không stream thì deny), rồi tới ngân sách giao diện (vượt trần 10000 dòng mà không ảo hoá thì reject). Hai con số 500 và 10000 là hằng số dạy học của bài.',
    workedCode:
      '# MÔ PHỎNG ngân sách nạp tệp\nfile_size_mb, reads_streamed = 900, "no"\nprint("deny: full load exceeds budget" if file_size_mb > 500 and reads_streamed == "no" else "allow: stream")',
    predictCode:
      'file_size_mb, reads_streamed, rows, virtualized = 120, "yes", 900000, "no"\nif file_size_mb > 500 and reads_streamed == "no":\n    print("deny: full load exceeds budget")\nelif rows > 10000 and virtualized == "no":\n    print("reject: unvirtualized list")\nelse:\n    print("allow: stream")',
    predictChoices: [
      'allow: stream',
      'deny: full load exceeds budget',
      'reject: unvirtualized list',
      'invalid: rowCount',
    ],
    predictAnswer: 2,
    predictExplain:
      'Tệp nhỏ và đã đọc theo luồng nên không deny, nhưng 900.000 dòng dựng hết thành phần giao diện là chỗ hết bộ nhớ tiếp theo.',
    makePrompt:
      'Đọc fixture `fileSizeMb:<số>,readsStreamed:<yes|no>,rowCount:<số>,rowsVirtualized:<yes|no>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; fileSizeMb lớn hơn 500 mà readsStreamed là no → `deny: full load exceeds budget`; rowCount lớn hơn 10000 mà rowsVirtualized là no → `reject: unvirtualized list`; còn lại → `allow: stream`. MÔ PHỎNG, không mở tệp thật và không dựng giao diện thật.',
    testCases: [
      {
        stdinLines: ['fileSizeMb:900,readsStreamed:yes,rowCount:900000,rowsVirtualized:yes'],
        expected: 'allow: stream',
        hidden: false,
        label: 'tệp lớn nhưng đọc theo luồng và danh sách đã ảo hoá',
      },
      {
        stdinLines: ['fileSizeMb:900,readsStreamed:no,rowCount:100,rowsVirtualized:yes'],
        expected: 'deny: full load exceeds budget',
        hidden: true,
        label: 'nạp trọn tệp vượt ngân sách bộ nhớ',
      },
      {
        stdinLines: ['fileSizeMb:120,readsStreamed:yes,rowCount:900000,rowsVirtualized:no'],
        expected: 'reject: unvirtualized list',
        hidden: true,
        label: 'danh sách chưa ảo hoá',
      },
      {
        stdinLines: ['fileSizeMb:120,readsStreamed:yes,rowCount:nhieu,rowsVirtualized:yes'],
        expected: 'invalid: rowCount',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"fileSizeMb", "readsStreamed", "rowCount", "rowsVirtualized"}: print("invalid: field")\n    elif not m["fileSizeMb"].isdigit(): print("invalid: fileSizeMb")\n    elif m["readsStreamed"] not in {"yes", "no"}: print("invalid: readsStreamed")\n    elif not m["rowCount"].isdigit(): print("invalid: rowCount")\n    elif m["rowsVirtualized"] not in {"yes", "no"}: print("invalid: rowsVirtualized")\n    elif int(m["fileSizeMb"]) > 500 and m["readsStreamed"] == "no": print("deny: full load exceeds budget")\n    elif int(m["rowCount"]) > 10000 and m["rowsVirtualized"] == "no": print("reject: unvirtualized list")\n    else: print("allow: stream")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, tạo một tệp CSV khoảng 1GB rồi mở bằng hai cách: đọc hết vào bộ nhớ và đọc theo luồng. Đo mức RAM đỉnh của từng cách bằng trình quản lý tác vụ và ghi lại con số.',
    cards: [
      {
        hoi: 'Ảo hoá danh sách tiết kiệm ở chỗ nào?',
        dap: 'Chỉ dựng thành phần cho phần đang nhìn thấy, nên số phần tử trong bộ nhớ không tăng theo số dòng dữ liệu.',
      },
      {
        hoi: 'Đọc theo luồng và ảo hoá danh sách giải hai vấn đề khác nhau thế nào?',
        dap: 'Đọc theo luồng giữ bộ nhớ DỮ LIỆU phẳng; ảo hoá giữ bộ nhớ GIAO DIỆN phẳng. Thiếu một trong hai vẫn hết RAM.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u282-l2',
    unitId: 'p6-u282',
    title: 'tìm kiếm toàn văn: có chỉ mục trước, quét toàn bộ sau',
    hook: 'Ô tìm kiếm quét tuần tự trên một triệu dòng nghĩa là mỗi ký tự người dùng gõ đều làm app đứng một nhịp.',
    theory:
      'Tìm kiếm toàn văn chỉ khả thi khi đã có chỉ mục; gọi tìm khi chưa dựng chỉ mục thì từ chối và nói rõ lý do thay vì âm thầm quét tuần tự. Chỉ mục cũ hơn dữ liệu trả unknown, vì kết quả trả về có thể thiếu bản ghi mới mà người dùng không hề biết. Thứ tự xét: có chỉ mục chưa, rồi chỉ mục có tươi không, rồi mới tới kích thước truy vấn.',
    workedCode:
      '# MÔ PHỎNG cổng chỉ mục tìm kiếm\nindex_built = "no"\nprint("refuse: index missing" if index_built == "no" else "allow: search")',
    predictCode:
      'index_built, index_version, data_version = "yes", 4, 9\nif index_built == "no":\n    print("refuse: index missing")\nelif index_version < data_version:\n    print("unknown: index stale")\nelse:\n    print("allow: search")',
    predictChoices: [
      'allow: search',
      'refuse: index missing',
      'unknown: index stale',
      'invalid: indexVersion',
    ],
    predictAnswer: 2,
    predictExplain:
      'Chỉ mục có tồn tại nên không từ chối, nhưng nó cũ hơn dữ liệu nên kết quả tìm được có thể thiếu bản ghi mới — không kết luận được.',
    makePrompt:
      'Đọc fixture `indexBuilt:<yes|no>,indexVersion:<số>,dataVersion:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; indexBuilt là no → `refuse: index missing`; indexVersion nhỏ hơn dataVersion → `unknown: index stale`; còn lại → `allow: search`. MÔ PHỎNG, không dựng chỉ mục hay đọc CSDL thật.',
    testCases: [
      {
        stdinLines: ['indexBuilt:yes,indexVersion:9,dataVersion:9'],
        expected: 'allow: search',
        hidden: false,
        label: 'chỉ mục đủ và tươi',
      },
      {
        stdinLines: ['indexBuilt:no,indexVersion:9,dataVersion:9'],
        expected: 'refuse: index missing',
        hidden: true,
        label: 'tìm toàn văn khi chưa có chỉ mục',
      },
      {
        stdinLines: ['indexBuilt:yes,indexVersion:4,dataVersion:9'],
        expected: 'unknown: index stale',
        hidden: true,
        label: 'chỉ mục cũ hơn dữ liệu',
      },
      {
        stdinLines: ['indexBuilt:maybe,indexVersion:9,dataVersion:9'],
        expected: 'invalid: indexBuilt',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"indexBuilt", "indexVersion", "dataVersion"}: print("invalid: field")\n    elif m["indexBuilt"] not in {"yes", "no"}: print("invalid: indexBuilt")\n    elif not m["indexVersion"].isdigit(): print("invalid: indexVersion")\n    elif not m["dataVersion"].isdigit(): print("invalid: dataVersion")\n    elif m["indexBuilt"] == "no": print("refuse: index missing")\n    elif int(m["indexVersion"]) < int(m["dataVersion"]): print("unknown: index stale")\n    else: print("allow: search")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, bật tiện ích tìm kiếm toàn văn của SQLite cho một tập dữ liệu vài trăm nghìn dòng, đo thời gian tìm có chỉ mục và không chỉ mục, rồi ghi lại chi phí dựng chỉ mục ban đầu.',
    cards: [
      {
        hoi: 'Vì sao chỉ mục cũ lại nguy hiểm hơn không có chỉ mục?',
        dap: 'Không có chỉ mục thì app báo được là chưa tìm được; chỉ mục cũ trả kết quả trông như đầy đủ nhưng thiếu bản ghi mới, và người dùng tin vào đó.',
      },
      {
        hoi: 'Chi phí của chỉ mục nằm ở đâu?',
        dap: 'Ở dung lượng đĩa thêm và ở thời gian cập nhật mỗi lần ghi — nên chỉ đánh chỉ mục cho trường thật sự được tìm.',
      },
    ],
  }),
]
