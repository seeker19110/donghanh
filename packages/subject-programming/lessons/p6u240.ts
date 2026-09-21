// P6-U240 — systems-s4-m3: hệ điều hành từ số 0.
// Bài 1 là bảng trang (cách ly), bài 2 là lập lịch và chuyển ngữ cảnh (chia sẻ CPU). Đây đúng
// hai thứ tối thiểu phải có để gọi một đống mã là "nhân", nên chúng được tách làm hai bài.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U240_LESSONS = [
  systemsSimulation({
    id: 'p6-u240-l1',
    unitId: 'p6-u240',
    title: 'bảng trang — hai tiến trình, hai không gian địa chỉ',
    hook: 'Tiến trình A và tiến trình B cùng thấy địa chỉ 0x1000, và đó là hai ô nhớ vật lý khác nhau. Cái làm được điều đó chỉ là một bảng tra cứu.',
    theory:
      'Mỗi tiến trình có bảng trang riêng ánh xạ trang ảo sang khung vật lý; nhân đổi con trỏ bảng trang mỗi lần chuyển tiến trình. Trang không có trong bảng của tiến trình đang chạy thì phần cứng sinh lỗi và nhân từ chối. Trace MÔ PHỎNG cố định bảng trang: tiến trình A giữ trang 0–3, tiến trình B giữ trang 4–7. Không cấu hình MMU hay bảng trang thật.',
    workedCode:
      '# MO PHONG bang trang co dinh\nbang = {"A": range(0, 4), "B": range(4, 8)}\npid, vpage = "A", 6\nprint("deny: page table khong co anh xa" if vpage not in bang[pid] else "allow: page table anh xa vpage %d" % vpage)',
    predictCode:
      'bang = {"A": range(0, 4), "B": range(4, 8)}\npid, vpage = "B", 5\nprint("allow: page table anh xa vpage %d" % vpage if vpage in bang[pid] else "deny: page table khong co anh xa")',
    predictChoices: [
      'allow: page table anh xa vpage 5',
      'deny: page table khong co anh xa',
      'invalid: pid',
    ],
    predictAnswer: 0,
    predictExplain:
      'Trang 5 nằm trong dải 4–7 mà bảng trang mô phỏng cấp cho tiến trình B nên truy cập hợp lệ.',
    makePrompt:
      'Đọc `pid:<A|B>,vpage:<số>`. Thiếu trường hoặc pid lạ → `invalid: pid`; vpage sai kiểu → `invalid: vpage`; trang không thuộc bảng trang của tiến trình đó (A giữ 0–3, B giữ 4–7) → `deny: page table khong co anh xa`; còn lại → `allow: page table anh xa vpage <n>`. MÔ PHỎNG, không chạm MMU thật.',
    testCases: [
      {
        stdinLines: ['pid:A,vpage:2'],
        expected: 'allow: page table anh xa vpage 2',
        hidden: false,
        label: 'trang thuộc về tiến trình A',
      },
      {
        stdinLines: ['pid:A,vpage:6'],
        expected: 'deny: page table khong co anh xa',
        hidden: true,
        label: 'ca âm — A chạm trang của B thì fail closed',
      },
      {
        stdinLines: ['pid:B,vpage:5'],
        expected: 'allow: page table anh xa vpage 5',
        hidden: true,
        label: 'cùng số trang, khác tiến trình, khác kết quả',
      },
      {
        stdinLines: ['pid:C,vpage:1'],
        expected: 'invalid: pid',
        hidden: true,
        label: 'ca âm — tiến trình không tồn tại fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    bang = {"A": range(0, 4), "B": range(4, 8)}\n    if set(m) != {"pid", "vpage"} or m.get("pid") not in bang: print("invalid: pid")\n    elif not m["vpage"].isdigit(): print("invalid: vpage")\n    elif int(m["vpage"]) not in bang[m["pid"]]: print("deny: page table khong co anh xa")\n    else: print("allow: page table anh xa vpage %d" % int(m["vpage"]))\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, đọc phần thiết lập bảng trang của một nhân tối giản chạy trên QEMU và chỉ ra chính xác dòng nào cấm tiến trình người dùng chạm vùng của nhân.',
    cards: [
      {
        hoi: 'Vì sao hai tiến trình dùng cùng một địa chỉ ảo mà không đụng nhau?',
        dap: 'Vì mỗi tiến trình có bảng trang riêng; cùng một trang ảo được ánh xạ sang hai khung vật lý khác nhau.',
      },
      {
        hoi: 'Điều gì xảy ra khi truy cập một trang không có trong bảng?',
        dap: 'Phần cứng sinh page fault, nhân quyết định nạp trang, mở rộng vùng, hay kết thúc tiến trình vi phạm.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u240-l2',
    unitId: 'p6-u240',
    title: 'lập lịch vòng tròn và chuyển ngữ cảnh đủ trường',
    hook: 'Chuyển ngữ cảnh quên lưu một thanh ghi thì tiến trình vẫn chạy tiếp — sai vài phép tính, vài giờ sau mới lộ, và không ai nghĩ tới bộ lập lịch.',
    theory:
      'Bộ lập lịch vòng tròn cho mỗi tiến trình một lượng tử thời gian rồi chuyển sang tiến trình kế, còn context switch phải lưu và khôi phục ĐỦ trạng thái nhìn thấy được: tập thanh ghi, con trỏ ngăn xếp và bộ đếm chương trình. Trace MÔ PHỎNG xét theo thứ tự tất định: đủ trường đã lưu, lượng tử hợp lệ, hàng đợi rỗng, rồi mới xếp lịch. Không chạy bộ lập lịch thật.',
    workedCode:
      '# MO PHONG kiem du truong context switch\nsaved = {"registers", "sp"}\nprint("invalid: context switch thieu truong" if saved != {"registers", "sp", "pc"} else "scheduled")',
    predictCode:
      'queue = []\nsaved = {"registers", "sp", "pc"}\nprint("idle: khong co tien trinh runnable" if not queue else "scheduled: %s" % ">".join(queue))',
    predictChoices: [
      'idle: khong co tien trinh runnable',
      'scheduled: P1>P2',
      'invalid: context switch thieu truong',
    ],
    predictAnswer: 0,
    predictExplain:
      'Không tiến trình nào ở trạng thái chạy được, nên CPU vào vòng nghỉ thay vì chọn bừa một tiến trình đang chờ.',
    makePrompt:
      'Đọc `queue:<P1;P2, `-` nếu rỗng>,quantum:<số>,saved:<registers;sp;pc>`. Thiếu trường → `invalid: field`; saved thiếu một trong ba → `invalid: context switch thieu truong`; quantum không phải số dương → `invalid: quantum`; hàng đợi rỗng → `idle: khong co tien trinh runnable`; còn lại in `scheduled: <thứ tự hai vòng ngăn bằng dấu lớn hơn>`. MÔ PHỎNG, không chạy nhân thật.',
    testCases: [
      {
        stdinLines: ['queue:P1;P2,quantum:2,saved:registers;sp;pc'],
        expected: 'scheduled: P1>P2>P1>P2',
        hidden: false,
        label: 'vòng tròn hai tiến trình, hai vòng',
      },
      {
        stdinLines: ['queue:-,quantum:2,saved:registers;sp;pc'],
        expected: 'idle: khong co tien trinh runnable',
        hidden: true,
        label: 'hàng đợi rỗng thì CPU nghỉ',
      },
      {
        stdinLines: ['queue:P1;P2,quantum:2,saved:registers;sp'],
        expected: 'invalid: context switch thieu truong',
        hidden: true,
        label: 'ca âm — thiếu pc là mất chỗ quay lại',
      },
      {
        stdinLines: ['queue:P1,quantum:0,saved:registers;sp;pc'],
        expected: 'invalid: quantum',
        hidden: true,
        label: 'ca âm — lượng tử 0 làm tiến trình không bao giờ chạy',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"queue", "quantum", "saved"}:\n        print("invalid: field")\n    elif set(m["saved"].split(";")) != {"registers", "sp", "pc"}:\n        print("invalid: context switch thieu truong")\n    elif not m["quantum"].isdigit() or int(m["quantum"]) <= 0:\n        print("invalid: quantum")\n    elif m["queue"] == "-" or not m["queue"].strip():\n        print("idle: khong co tien trinh runnable")\n    else:\n        q = [p for p in m["queue"].split(";") if p]\n        print("scheduled: " + ">".join(q + q))\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, đọc mã chuyển ngữ cảnh của một nhân tối giản, liệt kê mọi thanh ghi nó lưu, rồi thử bỏ một thanh ghi để xem triệu chứng xuất hiện ở đâu.',
    cards: [
      {
        hoi: 'Lập lịch vòng tròn giải quyết vấn đề gì?',
        dap: 'Nó chia CPU công bằng theo lượng tử thời gian nên một tiến trình tính toán dài không làm đói các tiến trình khác.',
      },
      {
        hoi: 'Context switch phải lưu tối thiểu những gì?',
        dap: 'Tập thanh ghi, con trỏ ngăn xếp và bộ đếm chương trình — thiếu bất kỳ cái nào thì tiến trình không quay lại đúng trạng thái cũ.',
      },
    ],
  }),
]
