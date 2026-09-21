// P6-U274 — desktop-s1-m1 "Chọn nền tảng": hai quyết định khoá sớm của một app desktop —
// ngân sách gói cài/RAM (bài 1) và phím tắt toàn cục có đụng phím hệ điều hành không (bài 2).
// Chọn nền tảng không phải chuyện gu: nó khoá luôn hai con số mà người dùng cảm nhận được.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U274_LESSONS = [
  desktopSimulation({
    id: 'p6-u274-l1',
    unitId: 'p6-u274',
    title: 'đo ngân sách gói cài và RAM trước khi chọn nền tảng',
    hook: 'Đóng gói web app thành desktop rồi mới đo thì đã muộn: 300MB bản cài và 800MB RAM là thứ người dùng gỡ ngay, không ai báo lỗi cho bạn biết.',
    theory:
      'Hợp đồng ngân sách xét theo thứ tự tất định: trường sai kiểu trước, rồi trần packageSizeMb 300 và trần ramMb 500, cuối cùng mới tới tích hợp hệ (khay hệ thống). Vượt trần là deny vì đó là ràng buộc cứng của nền tảng đã chọn; thiếu khay hệ thống chỉ là cảnh báo vì app vẫn dùng được. Hai con số 300 và 500 là hằng số DẠY HỌC để bài có ngưỡng rõ ràng, không phải khuyến nghị cho sản phẩm thật.',
    workedCode:
      '# MÔ PHỎNG trần ngân sách nền tảng\npackage_size_mb, ram_mb = 420, 300\nprint("deny: budget exceeded" if package_size_mb > 300 or ram_mb > 500 else "allow: ship")',
    predictCode:
      'package_size_mb, ram_mb, has_tray = 120, 300, "no"\nif package_size_mb > 300 or ram_mb > 500:\n    print("deny: budget exceeded")\nelif has_tray == "no":\n    print("allow: ship, canh bao thieu tray")\nelse:\n    print("allow: ship")',
    predictChoices: [
      'allow: ship, canh bao thieu tray',
      'deny: budget exceeded',
      'allow: ship khong kem canh bao',
      'invalid: hasTray',
    ],
    predictAnswer: 0,
    predictExplain:
      'Cả hai con số đều dưới trần nên không deny; thiếu khay hệ thống không chặn phát hành mà chỉ kèm cảnh báo trong cùng một dòng quyết định.',
    makePrompt:
      'Đọc fixture `packageSizeMb:<số>,ramMb:<số>,hasTray:<yes|no>`. Thiếu trường, sai kiểu hoặc sai miền → `invalid: <trường>`; packageSizeMb > 300 hoặc ramMb > 500 → `deny: budget exceeded`; hasTray là no → `allow: ship, canh bao thieu tray`; còn lại → `allow: ship`. MÔ PHỎNG, không gọi Electron, Tauri hay hệ điều hành thật.',
    testCases: [
      {
        stdinLines: ['packageSizeMb:120,ramMb:300,hasTray:yes'],
        expected: 'allow: ship',
        hidden: false,
        label: 'trong cả hai trần và có khay hệ thống',
      },
      {
        stdinLines: ['packageSizeMb:420,ramMb:300,hasTray:yes'],
        expected: 'deny: budget exceeded',
        hidden: true,
        label: 'gói cài vượt trần 300MB',
      },
      {
        stdinLines: ['packageSizeMb:120,ramMb:800,hasTray:yes'],
        expected: 'deny: budget exceeded',
        hidden: true,
        label: 'RAM vượt trần 500MB',
      },
      {
        stdinLines: ['packageSizeMb:120,ramMb:300,hasTray:no'],
        expected: 'allow: ship, canh bao thieu tray',
        hidden: true,
        label: 'thiếu khay hệ thống chỉ là cảnh báo',
      },
      {
        stdinLines: ['packageSizeMb:abc,ramMb:300,hasTray:yes'],
        expected: 'invalid: packageSizeMb',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"packageSizeMb", "ramMb", "hasTray"}: print("invalid: field")\n    elif not m["packageSizeMb"].isdigit(): print("invalid: packageSizeMb")\n    elif not m["ramMb"].isdigit(): print("invalid: ramMb")\n    elif m["hasTray"] not in {"yes", "no"}: print("invalid: hasTray")\n    elif int(m["packageSizeMb"]) > 300 or int(m["ramMb"]) > 500: print("deny: budget exceeded")\n    elif m["hasTray"] == "no": print("allow: ship, canh bao thieu tray")\n    else: print("allow: ship")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, dựng một app rỗng bằng Tauri và một app rỗng bằng Electron trên máy thật, rồi đo bản cài (MB) cùng mức RAM lúc nghỉ bằng trình quản lý tác vụ. Ghi hai cặp số đó vào một bảng so sánh và nêu nền tảng bạn chọn kèm lý do.',
    cards: [
      {
        hoi: 'Vì sao kích thước gói cài và mức RAM phải khoá ngay lúc chọn nền tảng?',
        dap: 'Vì cả hai do runtime của nền tảng quyết định phần lớn; chọn xong rồi thì tối ưu code cũng không kéo chúng xuống được đáng kể.',
      },
      {
        hoi: 'Thiếu khay hệ thống có phải lý do chặn phát hành không?',
        dap: 'Không. Đó là tích hợp hệ làm trải nghiệm tốt hơn; app vẫn chạy đủ chức năng nên chỉ ghi cảnh báo, không deny.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u274-l2',
    unitId: 'p6-u274',
    title: 'phím tắt toàn cục đụng phím hệ điều hành',
    hook: 'Đăng ký một phím tắt toàn cục trùng phím hệ thì hoặc app không nhận được gì, hoặc bạn cướp phím của hệ điều hành — cả hai đều là lỗi phía bạn.',
    theory:
      'Danh sách phím dành riêng của hệ là tập cố định khai tường minh trong bài, xét sau bước kiểm trường và trước mọi thứ khác. Không đăng ký phím tắt nào thì app vẫn chạy nên chỉ cảnh báo; trùng phím hệ thì reject, vì đăng ký được hay không là chuyện của hệ điều hành chứ không phải của app.',
    workedCode:
      '# MÔ PHỎNG phím dành riêng của hệ\nPHIM_HE = {"ctrl+alt+del", "cmd+space", "ctrl+esc"}\nprint("reject: shortcut conflict" if "cmd+space" in PHIM_HE else "allow: register shortcut")',
    predictCode:
      'PHIM_HE = {"ctrl+alt+del", "cmd+space", "ctrl+esc"}\nshortcut, has_shortcut = "ctrl+alt+p", "no"\nif has_shortcut == "no":\n    print("allow: ship, canh bao thieu shortcut")\nelif shortcut in PHIM_HE:\n    print("reject: shortcut conflict")\nelse:\n    print("allow: register shortcut")',
    predictChoices: [
      'reject: shortcut conflict',
      'allow: ship, canh bao thieu shortcut',
      'allow: register shortcut',
      'invalid: shortcut',
    ],
    predictAnswer: 1,
    predictExplain:
      'Nhánh hasShortcut được xét trước: chưa đăng ký phím nào thì chưa thể đụng phím hệ, nên chỉ cảnh báo.',
    makePrompt:
      'Đọc fixture `shortcut:<chuỗi>,hasShortcut:<yes|no>` với tập phím dành riêng của hệ là {ctrl+alt+del, cmd+space, ctrl+esc}. Thiếu trường, chuỗi rỗng hoặc sai miền → `invalid: <trường>`; hasShortcut là no → `allow: ship, canh bao thieu shortcut`; shortcut nằm trong tập phím hệ → `reject: shortcut conflict`; còn lại → `allow: register shortcut`. MÔ PHỎNG, không đăng ký phím tắt thật.',
    testCases: [
      {
        stdinLines: ['shortcut:ctrl+alt+p,hasShortcut:yes'],
        expected: 'allow: register shortcut',
        hidden: false,
        label: 'phím tự do đăng ký được',
      },
      {
        stdinLines: ['shortcut:ctrl+alt+del,hasShortcut:yes'],
        expected: 'reject: shortcut conflict',
        hidden: true,
        label: 'trùng phím dành riêng của hệ',
      },
      {
        stdinLines: ['shortcut:ctrl+alt+p,hasShortcut:no'],
        expected: 'allow: ship, canh bao thieu shortcut',
        hidden: true,
        label: 'không đăng ký phím nào thì chỉ cảnh báo',
      },
      {
        stdinLines: ['shortcut:,hasShortcut:yes'],
        expected: 'invalid: shortcut',
        hidden: true,
        label: 'ca âm — khai đăng ký nhưng phím rỗng',
      },
    ],
    sampleSolution:
      'PHIM_HE = {"ctrl+alt+del", "cmd+space", "ctrl+esc"}\ntry:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"shortcut", "hasShortcut"}: print("invalid: field")\n    elif m["hasShortcut"] not in {"yes", "no"}: print("invalid: hasShortcut")\n    elif m["hasShortcut"] == "yes" and not m["shortcut"]: print("invalid: shortcut")\n    elif m["hasShortcut"] == "no": print("allow: ship, canh bao thieu shortcut")\n    elif m["shortcut"] in PHIM_HE: print("reject: shortcut conflict")\n    else: print("allow: register shortcut")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên máy thật NGOÀI sandbox, tra tài liệu phím tắt dành riêng của Windows và macOS, liệt kê 10 tổ hợp không được phép chiếm, rồi kiểm tra bảng phím tắt của một app desktop bạn đang dùng xem có tổ hợp nào lấn không.',
    cards: [
      {
        hoi: 'Vì sao trùng phím hệ lại là reject chứ không phải cảnh báo?',
        dap: 'Vì hệ điều hành giữ quyền ưu tiên: app hoặc không nhận được sự kiện, hoặc chiếm mất chức năng hệ — cả hai đều là hành vi sai, không sửa được từ phía app.',
      },
      {
        hoi: 'Phím tắt toàn cục khác phím tắt trong cửa sổ ở chỗ nào?',
        dap: 'Phím toàn cục hoạt động cả khi app không được focus nên phải đăng ký với hệ; phím trong cửa sổ chỉ do app tự xử lý khi đang được focus.',
      },
    ],
  }),
]
