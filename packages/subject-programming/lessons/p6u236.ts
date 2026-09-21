// P6-U236 — systems-s3-m3: bên trong nhân (bộ nhớ ảo, cách ly, chi phí syscall).
// Ranh giới quan trọng nhất của bài này: vi phạm CÁCH LY luôn được xét TRƯỚC chi phí, vì một
// truy cập ra ngoài không gian địa chỉ là lỗi đúng-sai, còn syscall nhiều chỉ là lỗi nhanh-chậm.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U236_LESSONS = [
  systemsSimulation({
    id: 'p6-u236-l1',
    unitId: 'p6-u236',
    title: 'bộ nhớ ảo — khi tập làm việc không vừa bộ nhớ vật lý',
    hook: 'Thêm 10% dữ liệu, chương trình chậm đi năm mươi lần. Không có dòng code nào đổi: tập làm việc vừa vượt qua bộ nhớ vật lý và hệ thống bắt đầu tráo trang liên tục.',
    theory:
      'Nhân ánh xạ bộ nhớ ảo sang bộ nhớ vật lý theo từng trang. Chừng nào tập làm việc còn vừa bộ nhớ vật lý thì page fault chỉ xảy ra lúc khởi động; vượt qua ngưỡng đó, mỗi trang nạp vào lại đẩy một trang đang cần ra, gây thrash. Trace MÔ PHỎNG chỉ so hai con số tập làm việc và bộ nhớ khả dụng, không đọc /proc hay bảng trang thật.',
    workedCode:
      '# MO PHONG nguong thrash\nworking, physical = 9000, 8000\nprint("thrash: page fault rate cao" if working > physical else "ok: working set vua bo nho vat ly")',
    predictCode:
      'working, physical = 7800, 8000\nprint("warn: gan nguong page fault" if working > physical * 0.9 else "ok: working set vua bo nho vat ly")',
    predictChoices: [
      'warn: gan nguong page fault',
      'ok: working set vua bo nho vat ly',
      'thrash: page fault rate cao',
    ],
    predictAnswer: 0,
    predictExplain:
      '7800 chưa vượt 8000 nhưng đã qua mốc 90%, nên mô phỏng cảnh báo trước khi hệ thống rơi vào thrash.',
    makePrompt:
      'Đọc `working:<số MB>,physical:<số MB>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; physical = 0 → `invalid: physical`; working > physical → `thrash: page fault rate cao`; working > 90% physical → `warn: gan nguong page fault`; còn lại → `ok: working set vua bo nho vat ly`. MÔ PHỎNG, không đọc bảng trang thật.',
    testCases: [
      {
        stdinLines: ['working:4000,physical:8000'],
        expected: 'ok: working set vua bo nho vat ly',
        hidden: false,
        label: 'tập làm việc vừa bộ nhớ thì không tráo trang',
      },
      {
        stdinLines: ['working:9000,physical:8000'],
        expected: 'thrash: page fault rate cao',
        hidden: true,
        label: 'vượt bộ nhớ vật lý thì tráo trang liên tục',
      },
      {
        stdinLines: ['working:7800,physical:8000'],
        expected: 'warn: gan nguong page fault',
        hidden: true,
        label: 'sát ngưỡng phải cảnh báo trước',
      },
      {
        stdinLines: ['working:4000,physical:0'],
        expected: 'invalid: physical',
        hidden: true,
        label: 'ca âm — bộ nhớ khả dụng bằng 0 fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"working", "physical"}: print("invalid: field")\n    elif not m["working"].isdigit(): print("invalid: working")\n    elif not m["physical"].isdigit(): print("invalid: physical")\n    elif int(m["physical"]) == 0: print("invalid: physical")\n    elif int(m["working"]) > int(m["physical"]): print("thrash: page fault rate cao")\n    elif int(m["working"]) > int(m["physical"]) * 0.9: print("warn: gan nguong page fault")\n    else: print("ok: working set vua bo nho vat ly")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, chạy một chương trình cấp phát tăng dần trên máy ảo có ít RAM, theo dõi số page fault lớn bằng công cụ thật và ghi lại mốc mà thời gian chạy bật lên đột ngột.',
    cards: [
      {
        hoi: 'Thrash là gì?',
        dap: 'Trạng thái hệ thống dành phần lớn thời gian tráo trang vào/ra thay vì chạy tiến trình, xảy ra khi tổng tập làm việc vượt bộ nhớ vật lý.',
      },
      {
        hoi: 'Page fault lớn khác page fault nhỏ thế nào?',
        dap: 'Page fault nhỏ chỉ cần nhân sửa ánh xạ; page fault lớn phải đọc dữ liệu từ thiết bị lưu trữ nên chậm hơn hàng nghìn lần.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u236-l2',
    unitId: 'p6-u236',
    title: 'cách ly tiến trình và chi phí syscall',
    hook: 'Một tiến trình đọc trúng vùng nhớ của tiến trình khác là sự cố bảo mật; một tiến trình gọi syscall một triệu lần mỗi giây chỉ là chậm. Hai thứ không được xét cùng mức ưu tiên.',
    theory:
      'Nhân bảo đảm mỗi tiến trình chỉ chạm được vùng đã cấp cho chính nó, và mỗi lần vượt ranh giới người dùng/nhân đều tốn chi phí chuyển chế độ. Trace MÔ PHỎNG cố định bảng tiến trình gồm pid 1 và 2, xét theo thứ tự tất định: trường sai kiểu, pid lạ, vi phạm cách ly, rồi mới tới mật độ syscall. Không gọi syscall hay gắn eBPF thật.',
    workedCode:
      '# MO PHONG kiem tra cach ly\naddr, base, size = 5000, 1000, 2000\nprint("deny: vi pham cach ly bo nho" if not (base <= addr < base + size) else "allow: truy cap hop le")',
    predictCode:
      'addr, base, size, syscalls = 1500, 1000, 2000, 5000\nif not (base <= addr < base + size):\n    print("deny: vi pham cach ly bo nho")\nelif syscalls > 1000:\n    print("syscall-heavy: nen gom batch")\nelse:\n    print("allow: truy cap hop le")',
    predictChoices: [
      'syscall-heavy: nen gom batch',
      'deny: vi pham cach ly bo nho',
      'allow: truy cap hop le',
    ],
    predictAnswer: 0,
    predictExplain:
      'Địa chỉ nằm trong vùng đã cấp nên không vi phạm cách ly, nhưng mật độ syscall vượt ngưỡng nên mô phỏng gợi ý gom lệnh.',
    makePrompt:
      'Đọc `pid:<số>,addr:<số>,base:<số>,size:<số>,syscalls:<số>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; pid không thuộc bảng tiến trình mô phỏng (1 hoặc 2) → `invalid: pid`; addr ngoài [base, base+size) → `deny: vi pham cach ly bo nho`; syscalls > 1000 → `syscall-heavy: nen gom batch`; còn lại → `allow: truy cap hop le`. MÔ PHỎNG, không gọi syscall thật.',
    testCases: [
      {
        stdinLines: ['pid:1,addr:1500,base:1000,size:2000,syscalls:100'],
        expected: 'allow: truy cap hop le',
        hidden: false,
        label: 'truy cập trong vùng đã cấp, syscall thưa',
      },
      {
        stdinLines: ['pid:1,addr:5000,base:1000,size:2000,syscalls:100'],
        expected: 'deny: vi pham cach ly bo nho',
        hidden: true,
        label: 'ca âm — ra ngoài không gian địa chỉ thì fail closed',
      },
      {
        stdinLines: ['pid:2,addr:1500,base:1000,size:2000,syscalls:5000'],
        expected: 'syscall-heavy: nen gom batch',
        hidden: true,
        label: 'hợp lệ nhưng mật độ syscall quá dày',
      },
      {
        stdinLines: ['pid:9,addr:1500,base:1000,size:2000,syscalls:100'],
        expected: 'invalid: pid',
        hidden: true,
        label: 'ca âm — pid ngoài bảng tiến trình fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    can = {"pid", "addr", "base", "size", "syscalls"}\n    thieu = [k for k in can if k not in m or not m[k].isdigit()]\n    if set(m) != can or thieu: print("invalid: " + (sorted(thieu)[0] if thieu else "field"))\n    elif int(m["pid"]) not in (1, 2): print("invalid: pid")\n    elif not (int(m["base"]) <= int(m["addr"]) < int(m["base"]) + int(m["size"])): print("deny: vi pham cach ly bo nho")\n    elif int(m["syscalls"]) > 1000: print("syscall-heavy: nen gom batch")\n    else: print("allow: truy cap hop le")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, so thời gian đọc một tệp lớn theo từng 1 byte và theo từng 64 KB, dùng công cụ đếm syscall thật để thấy chi phí chuyển chế độ chiếm bao nhiêu phần thời gian.',
    cards: [
      {
        hoi: 'Vì sao vi phạm cách ly phải được xét trước vấn đề hiệu năng?',
        dap: 'Vi phạm cách ly là lỗi đúng-sai và là rủi ro bảo mật; hiệu năng chỉ là lỗi nhanh-chậm, sửa sau vẫn được.',
      },
      {
        hoi: 'Vì sao gom nhiều thao tác vào một syscall lại nhanh hơn?',
        dap: 'Mỗi syscall phải chuyển từ chế độ người dùng sang chế độ nhân và ngược lại; gom lại thì trả chi phí chuyển chế độ một lần thay vì nhiều lần.',
      },
    ],
  }),
]
