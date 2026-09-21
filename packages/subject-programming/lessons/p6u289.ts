// P6-U289 — desktop-s4-m4 "Hỗ trợ người dùng": phân loại báo lỗi từ mô tả của người không kỹ
// thuật (bài 1) và xếp ưu tiên lộ trình theo yêu cầu thật (bài 2). Đây là nơi sản phẩm gặp người
// dùng, và cũng là nơi dễ nhất để lỡ tay giữ dữ liệu không thuộc về mình.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U289_LESSONS = [
  desktopSimulation({
    id: 'p6-u289-l1',
    unitId: 'p6-u289',
    title: 'triage báo lỗi: che nội dung người dùng, đòi bundle, đếm affectedUserCount',
    hook: '"App không chạy được" kèm một ảnh chụp màn hình mờ là tất cả những gì bạn nhận được — việc của bạn là biến nó thành một ca tái hiện được.',
    theory:
      'Luật đầu là quyền riêng tư: báo cáo lẫn nội dung tài liệu của người dùng (không chỉ dữ liệu chẩn đoán) thì che trước đã, vì phần đó không thuộc về bạn dù họ tự gửi. Sau đó mới tới bằng chứng kỹ thuật: thiếu gói chẩn đoán thì từ chối xếp vào backlog và hỏi lại, vì không tái hiện được thì không sửa được. Đủ điều kiện thì phân loại kèm số người dùng bị ảnh hưởng (affectedUserCount) để xếp ưu tiên.',
    workedCode:
      '# MÔ PHỎNG lọc nội dung người dùng khỏi báo cáo\nreport_has_user_content = "yes"\nprint("redact: user content in report" if report_has_user_content == "yes" else "allow: triage")',
    predictCode:
      'has_bundle, has_user_content, affected = "no", "no", 12\nif has_user_content == "yes":\n    print("redact: user content in report")\nelif has_bundle == "no":\n    print("refuse: cannot reproduce")\nelse:\n    print("allow: triage, affectedUserCount=" + str(affected))',
    predictChoices: [
      'allow: triage, affectedUserCount=12',
      'redact: user content in report',
      'refuse: cannot reproduce',
      'invalid: affectedUserCount',
    ],
    predictAnswer: 2,
    predictExplain:
      'Báo cáo sạch nên không phải che, nhưng thiếu gói chẩn đoán thì không có gì để tái hiện — phải hỏi lại người dùng trước khi xếp vào backlog.',
    makePrompt:
      'Đọc fixture `hasDiagnosticBundle:<yes|no>,reportContainsUserContent:<yes|no>,affectedUserCount:<số>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; reportContainsUserContent là yes → `redact: user content in report`; hasDiagnosticBundle là no → `refuse: cannot reproduce`; còn lại → `allow: triage, affectedUserCount=<số>`. MÔ PHỎNG, không đọc báo cáo hay hệ quản lý việc thật.',
    testCases: [
      {
        stdinLines: ['hasDiagnosticBundle:yes,reportContainsUserContent:no,affectedUserCount:12'],
        expected: 'allow: triage, affectedUserCount=12',
        hidden: false,
        label: 'đủ bằng chứng và báo cáo sạch',
      },
      {
        stdinLines: ['hasDiagnosticBundle:no,reportContainsUserContent:yes,affectedUserCount:12'],
        expected: 'redact: user content in report',
        hidden: true,
        label: 'quyền riêng tư được xét trước bằng chứng kỹ thuật',
      },
      {
        stdinLines: ['hasDiagnosticBundle:no,reportContainsUserContent:no,affectedUserCount:12'],
        expected: 'refuse: cannot reproduce',
        hidden: true,
        label: 'thiếu gói chẩn đoán thì không tái hiện được',
      },
      {
        stdinLines: ['hasDiagnosticBundle:yes,reportContainsUserContent:no,affectedUserCount:0'],
        expected: 'allow: triage, affectedUserCount=0',
        hidden: true,
        label: 'không ai khác báo cùng lỗi vẫn là ca hợp lệ',
      },
      {
        stdinLines: ['hasDiagnosticBundle:yes,reportContainsUserContent:no,affectedUserCount:vai'],
        expected: 'invalid: affectedUserCount',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"hasDiagnosticBundle", "reportContainsUserContent", "affectedUserCount"}: print("invalid: field")\n    elif m["hasDiagnosticBundle"] not in {"yes", "no"}: print("invalid: hasDiagnosticBundle")\n    elif m["reportContainsUserContent"] not in {"yes", "no"}: print("invalid: reportContainsUserContent")\n    elif not m["affectedUserCount"].isdigit(): print("invalid: affectedUserCount")\n    elif m["reportContainsUserContent"] == "yes": print("redact: user content in report")\n    elif m["hasDiagnosticBundle"] == "no": print("refuse: cannot reproduce")\n    else: print("allow: triage, affectedUserCount=" + m["affectedUserCount"])\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, viết mẫu báo lỗi cho app của bạn dành cho người KHÔNG kỹ thuật: tối đa năm câu hỏi, có nút đính kèm gói chẩn đoán tự sinh. Nhờ một người ngoài ngành điền thử và sửa những câu họ không hiểu.',
    cards: [
      {
        hoi: 'Vì sao "không tái hiện được" nên trả về hỏi lại thay vì xếp vào backlog?',
        dap: 'Vì một mục backlog không tái hiện được sẽ nằm đó mãi, chiếm chỗ và tạo cảm giác đã ghi nhận trong khi thực ra chưa ai làm gì được.',
      },
      {
        hoi: 'Số người dùng bị ảnh hưởng dùng để làm gì trong triage?',
        dap: 'Để xếp ưu tiên giữa các lỗi cùng mức nghiêm trọng; nhưng một người mất dữ liệu vẫn nặng hơn nhiều người gặp phiền toái nhỏ.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u289-l2',
    unitId: 'p6-u289',
    title: 'lộ trình dựa trên yêu cầu thật, không dựa trên người nói to nhất',
    hook: 'Một khách hàng gửi mười email trong một tuần không có nghĩa tính năng họ xin là tính năng cần làm trước.',
    theory:
      'Xếp ưu tiên lộ trình theo bằng chứng, theo đúng thứ tự: yêu cầu chạm tới ca mất dữ liệu thì làm trước mọi thứ khác; yêu cầu vượt ra ngoài phạm vi sản phẩm đã công bố thì reject kèm lý do; yêu cầu còn quá ít người xin thì trả unknown (chưa đủ căn cứ, hỏi thêm) chứ không từ chối thẳng. Ngưỡng "nhiều người" của bài là từ 5 yêu cầu độc lập trở lên — hằng số dạy học.',
    workedCode:
      '# MÔ PHỎNG ưu tiên ca mất dữ liệu\ntouches_data_loss = "yes"\nprint("allow: prioritize data loss" if touches_data_loss == "yes" else "allow: schedule normally")',
    predictCode:
      'data_loss, requester_count, in_scope = "no", 2, "yes"\nif data_loss == "yes":\n    print("allow: prioritize data loss")\nelif in_scope == "no":\n    print("reject: out of product scope")\nelif requester_count < 5:\n    print("unknown: demand unproven")\nelse:\n    print("allow: schedule normally")',
    predictChoices: [
      'allow: schedule normally',
      'allow: prioritize data loss',
      'reject: out of product scope',
      'unknown: demand unproven',
    ],
    predictAnswer: 3,
    predictExplain:
      'Không chạm mất dữ liệu và vẫn trong phạm vi sản phẩm, nhưng mới hai người yêu cầu thì chưa đủ bằng chứng để đẩy lên lộ trình.',
    makePrompt:
      'Đọc fixture `touchesDataLoss:<yes|no>,requesterCount:<số>,inScope:<yes|no>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; touchesDataLoss là yes → `allow: prioritize data loss`; inScope là no → `reject: out of product scope`; requesterCount nhỏ hơn 5 → `unknown: demand unproven`; còn lại → `allow: schedule normally`. MÔ PHỎNG, không đọc hệ quản lý sản phẩm thật.',
    testCases: [
      {
        stdinLines: ['touchesDataLoss:no,requesterCount:12,inScope:yes'],
        expected: 'allow: schedule normally',
        hidden: false,
        label: 'đủ nhu cầu và đúng phạm vi',
      },
      {
        stdinLines: ['touchesDataLoss:yes,requesterCount:1,inScope:no'],
        expected: 'allow: prioritize data loss',
        hidden: true,
        label: 'ca mất dữ liệu thắng mọi luật khác',
      },
      {
        stdinLines: ['touchesDataLoss:no,requesterCount:12,inScope:no'],
        expected: 'reject: out of product scope',
        hidden: true,
        label: 'ngoài phạm vi sản phẩm đã công bố',
      },
      {
        stdinLines: ['touchesDataLoss:no,requesterCount:2,inScope:yes'],
        expected: 'unknown: demand unproven',
        hidden: true,
        label: 'mới vài người xin, chưa đủ bằng chứng',
      },
      {
        stdinLines: ['touchesDataLoss:no,requesterCount:nhieu,inScope:yes'],
        expected: 'invalid: requesterCount',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"touchesDataLoss", "requesterCount", "inScope"}: print("invalid: field")\n    elif m["touchesDataLoss"] not in {"yes", "no"}: print("invalid: touchesDataLoss")\n    elif not m["requesterCount"].isdigit(): print("invalid: requesterCount")\n    elif m["inScope"] not in {"yes", "no"}: print("invalid: inScope")\n    elif m["touchesDataLoss"] == "yes": print("allow: prioritize data loss")\n    elif m["inScope"] == "no": print("reject: out of product scope")\n    elif int(m["requesterCount"]) < 5: print("unknown: demand unproven")\n    else: print("allow: schedule normally")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, gom mọi yêu cầu tính năng bạn đã nhận cho một dự án, phân thành ba nhóm theo ba luật của bài, rồi viết một đoạn ngắn giải thích công khai vì sao nhóm bị từ chối lại nằm ngoài phạm vi.',
    cards: [
      {
        hoi: 'Vì sao ca mất dữ liệu luôn được ưu tiên tuyệt đối?',
        dap: 'Vì mọi tính năng khác đều xây trên giả định dữ liệu người dùng còn nguyên; mất niềm tin ở điểm này thì không tính năng nào cứu lại được.',
      },
      {
        hoi: 'Từ chối một yêu cầu thì nên làm gì kèm theo?',
        dap: 'Nói rõ lý do và phạm vi sản phẩm, công khai được càng tốt — người dùng chấp nhận lời từ chối có lý do hơn là im lặng.',
      },
    ],
  }),
]
