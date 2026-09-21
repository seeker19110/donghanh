// P6-U279 — desktop-s2-m2 "Trải nghiệm chuyên nghiệp": hợp đồng hoàn tác/làm lại (bài 1) và
// sàn trợ năng cho thao tác hàng loạt (bài 2). Dân chuyên nghiệp mở app cả ngày: họ đánh giá
// app qua undo và bàn phím, không qua hoạt ảnh.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U279_LESSONS = [
  desktopSimulation({
    id: 'p6-u279-l1',
    unitId: 'p6-u279',
    title: 'hợp đồng undo và redo: nhánh lịch sử bị cắt',
    hook: 'Người dùng hoàn tác ba bước, gõ thêm một chữ, rồi bấm làm lại — nếu app "làm lại" được, nó vừa ghi đè lên chính thao tác họ vừa làm.',
    theory:
      'Hoàn tác là ngăn xếp có lịch sử: khi có thao tác mới xen vào sau một chuỗi undo, nhánh redo cũ bị cắt vĩnh viễn, nên cho phép redo lúc đó là sai hợp đồng và bị deny. Phím tắt tự chế lệch quy ước hệ bị reject vì cơ bắp tay người dùng đã thuộc quy ước sẵn. Gọi undo trên ngăn xếp rỗng trả unknown: không có gì để hoàn tác thì cũng không có kết quả nào để khẳng định.',
    workedCode:
      '# MÔ PHỎNG nhánh redo bị cắt\nredo_after_new_action_allowed = "yes"\nprint("deny: redo after new action" if redo_after_new_action_allowed == "yes" else "allow: undo")',
    predictCode:
      'undo_stack_depth, redo_allowed, shortcuts_ok = 0, "no", "yes"\nif redo_allowed == "yes":\n    print("deny: redo after new action")\nelif shortcuts_ok == "no":\n    print("reject: shortcut violates os convention")\nelif undo_stack_depth == 0:\n    print("unknown: empty undo stack")\nelse:\n    print("allow: undo")',
    predictChoices: [
      'allow: undo',
      'unknown: empty undo stack',
      'deny: redo after new action',
      'reject: shortcut violates os convention',
    ],
    predictAnswer: 1,
    predictExplain:
      'Hai luật trên đều không vi phạm, nhưng ngăn xếp hoàn tác rỗng thì không có thao tác nào để lùi lại nên không kết luận được.',
    makePrompt:
      'Đọc fixture `undoStackDepth:<số>,redoAfterNewActionAllowed:<yes|no>,shortcutsFollowOsConvention:<yes|no>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; redoAfterNewActionAllowed là yes → `deny: redo after new action`; shortcutsFollowOsConvention là no → `reject: shortcut violates os convention`; undoStackDepth bằng 0 → `unknown: empty undo stack`; còn lại → `allow: undo`. MÔ PHỎNG, không dựng giao diện thật.',
    testCases: [
      {
        stdinLines: [
          'undoStackDepth:20,redoAfterNewActionAllowed:no,shortcutsFollowOsConvention:yes',
        ],
        expected: 'allow: undo',
        hidden: false,
        label: 'ngăn xếp đủ sâu và hợp đồng đúng',
      },
      {
        stdinLines: [
          'undoStackDepth:20,redoAfterNewActionAllowed:yes,shortcutsFollowOsConvention:no',
        ],
        expected: 'deny: redo after new action',
        hidden: true,
        label: 'luật nhánh lịch sử thắng luật phím tắt',
      },
      {
        stdinLines: [
          'undoStackDepth:20,redoAfterNewActionAllowed:no,shortcutsFollowOsConvention:no',
        ],
        expected: 'reject: shortcut violates os convention',
        hidden: true,
        label: 'phím tắt tự chế lệch quy ước hệ',
      },
      {
        stdinLines: [
          'undoStackDepth:0,redoAfterNewActionAllowed:no,shortcutsFollowOsConvention:yes',
        ],
        expected: 'unknown: empty undo stack',
        hidden: true,
        label: 'undo trên ngăn xếp rỗng',
      },
      {
        stdinLines: [
          'undoStackDepth:-2,redoAfterNewActionAllowed:no,shortcutsFollowOsConvention:yes',
        ],
        expected: 'invalid: undoStackDepth',
        hidden: true,
        label: 'ca âm — độ sâu âm fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"undoStackDepth", "redoAfterNewActionAllowed", "shortcutsFollowOsConvention"}: print("invalid: field")\n    elif not m["undoStackDepth"].isdigit(): print("invalid: undoStackDepth")\n    elif m["redoAfterNewActionAllowed"] not in {"yes", "no"}: print("invalid: redoAfterNewActionAllowed")\n    elif m["shortcutsFollowOsConvention"] not in {"yes", "no"}: print("invalid: shortcutsFollowOsConvention")\n    elif m["redoAfterNewActionAllowed"] == "yes": print("deny: redo after new action")\n    elif m["shortcutsFollowOsConvention"] == "no": print("reject: shortcut violates os convention")\n    elif int(m["undoStackDepth"]) == 0: print("unknown: empty undo stack")\n    else: print("allow: undo")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, cài ngăn xếp hoàn tác 20 bước cho một app nhỏ. Kiểm bằng tay kịch bản: làm 5 thao tác, undo 3, làm thao tác mới, rồi thử redo — xác nhận nhánh redo đã bị cắt và app không cho làm lại.',
    cards: [
      {
        hoi: 'Vì sao thao tác mới lại cắt nhánh redo?',
        dap: 'Vì lịch sử rẽ nhánh: làm lại bước cũ sau khi đã đi hướng khác sẽ ghi đè lên thao tác mới, tạo ra trạng thái người dùng không hề yêu cầu.',
      },
      {
        hoi: 'Nên lưu gì trong mỗi mục của ngăn xếp hoàn tác?',
        dap: 'Lưu thao tác nghịch đảo hoặc phần dữ liệu thay đổi, không lưu ảnh chụp toàn tài liệu — nếu không, 20 bước sẽ ngốn RAM gấp 20 lần tài liệu.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u279-l2',
    unitId: 'p6-u279',
    title: 'sàn trợ năng và thao tác hàng loạt hoàn tác được',
    hook: 'Thao tác hàng loạt đổi tên 10.000 tệp chỉ dễ chịu khi có đúng một nút đưa tất cả trở lại như cũ.',
    theory:
      'Bài đo ba điều kiện của một giao diện chuyên nghiệp theo thứ tự tất định: mọi chức năng phải tới được bằng bàn phím (deny nếu không, vì có người chỉ dùng bàn phím), thao tác hàng loạt phải hoàn tác được (reject nếu không, vì sai một lần là mất rất nhiều), và tương phản chữ phải đạt sàn 4.5 (refuse nếu dưới). Fixture ghi tương phản theo phần mười để giữ số nguyên.',
    workedCode:
      '# MÔ PHỎNG sàn trợ năng\nkeyboard_reachable = "no"\nprint("deny: not keyboard reachable" if keyboard_reachable == "no" else "allow: ship ui")',
    predictCode:
      'keyboard_reachable, bulk_undoable, contrast_tenths = "yes", "yes", 31\nif keyboard_reachable == "no":\n    print("deny: not keyboard reachable")\nelif bulk_undoable == "no":\n    print("reject: bulk op not undoable")\nelif contrast_tenths < 45:\n    print("refuse: contrast below 4.5")\nelse:\n    print("allow: ship ui")',
    predictChoices: [
      'allow: ship ui',
      'refuse: contrast below 4.5',
      'reject: bulk op not undoable',
      'deny: not keyboard reachable',
    ],
    predictAnswer: 1,
    predictExplain:
      'Bàn phím và hoàn tác hàng loạt đều đạt, nhưng 3.1 dưới sàn 4.5 nên chữ chưa đủ tương phản để phát hành.',
    makePrompt:
      'Đọc fixture `keyboardReachable:<yes|no>,bulkOpUndoable:<yes|no>,contrastTenths:<số nguyên, 45 nghĩa là 4.5>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; keyboardReachable là no → `deny: not keyboard reachable`; bulkOpUndoable là no → `reject: bulk op not undoable`; contrastTenths nhỏ hơn 45 → `refuse: contrast below 4.5`; còn lại → `allow: ship ui`. MÔ PHỎNG, không dựng giao diện hay đo màu thật.',
    testCases: [
      {
        stdinLines: ['keyboardReachable:yes,bulkOpUndoable:yes,contrastTenths:72'],
        expected: 'allow: ship ui',
        hidden: false,
        label: 'đạt cả ba điều kiện',
      },
      {
        stdinLines: ['keyboardReachable:no,bulkOpUndoable:no,contrastTenths:20'],
        expected: 'deny: not keyboard reachable',
        hidden: true,
        label: 'bàn phím được xét trước mọi lỗi khác',
      },
      {
        stdinLines: ['keyboardReachable:yes,bulkOpUndoable:no,contrastTenths:72'],
        expected: 'reject: bulk op not undoable',
        hidden: true,
        label: 'thao tác hàng loạt không hoàn tác được',
      },
      {
        stdinLines: ['keyboardReachable:yes,bulkOpUndoable:yes,contrastTenths:31'],
        expected: 'refuse: contrast below 4.5',
        hidden: true,
        label: 'tương phản dưới sàn',
      },
      {
        stdinLines: ['keyboardReachable:yes,bulkOpUndoable:yes,contrastTenths:4.5'],
        expected: 'invalid: contrastTenths',
        hidden: true,
        label: 'ca âm — sai đơn vị fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"keyboardReachable", "bulkOpUndoable", "contrastTenths"}: print("invalid: field")\n    elif m["keyboardReachable"] not in {"yes", "no"}: print("invalid: keyboardReachable")\n    elif m["bulkOpUndoable"] not in {"yes", "no"}: print("invalid: bulkOpUndoable")\n    elif not m["contrastTenths"].isdigit(): print("invalid: contrastTenths")\n    elif m["keyboardReachable"] == "no": print("deny: not keyboard reachable")\n    elif m["bulkOpUndoable"] == "no": print("reject: bulk op not undoable")\n    elif int(m["contrastTenths"]) < 45: print("refuse: contrast below 4.5")\n    else: print("allow: ship ui")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, mở một app desktop bạn hay dùng và thử làm trọn một tác vụ CHỈ bằng bàn phím, không chạm chuột. Ghi lại từng chỗ bị kẹt, rồi kiểm tương phản chữ của app bằng công cụ đo màu.',
    cards: [
      {
        hoi: 'Vì sao "tới được bằng bàn phím" là sàn chứ không phải tính năng thêm?',
        dap: 'Vì có người dùng không dùng được chuột, và trình đọc màn hình đi theo đúng đường bàn phím; thiếu nó là app không dùng được với họ, không phải bất tiện.',
      },
      {
        hoi: 'Thao tác hàng loạt cần điều kiện gì trước khi cho chạy?',
        dap: 'Cần xem trước phạm vi ảnh hưởng và một đường hoàn tác duy nhất cho cả lô, vì người dùng không thể sửa tay hàng nghìn mục.',
      },
    ],
  }),
]
