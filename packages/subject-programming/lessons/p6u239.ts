// P6-U239 — systems-s4-m2: runtime và bộ thu gom rác.
// Bài 1 là GC mark-sweep (an toàn bộ nhớ), bài 2 là máy ảo ngăn xếp (an toàn thực thi). Cả hai
// đều phải chịu được đồ thị có chu trình và chuỗi lệnh thiếu, vì đó là hai chỗ runtime thật hay vỡ.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U239_LESSONS = [
  systemsSimulation({
    id: 'p6-u239-l1',
    unitId: 'p6-u239',
    title: 'mark-sweep — đến được từ gốc thì không được thu gom',
    hook: 'Bộ thu gom rác không biết đối tượng nào "còn cần". Nó chỉ biết đối tượng nào còn ĐẾN ĐƯỢC từ gốc — và đó là toàn bộ định nghĩa về sống chết trong một runtime có GC.',
    theory:
      'Mark-sweep chạy hai pha: đánh dấu mọi đối tượng reachable từ tập gốc, rồi quét thu gom phần còn lại. Đồ thị heap có chu trình vẫn dừng được nếu pha đánh dấu ghi nhớ nút đã thăm — đây chính là chỗ đếm tham chiếu thua mark-sweep. Thu gom nhầm một đối tượng còn reachable là lỗi an toàn bộ nhớ nên mô phỏng từ chối thẳng. Không cấp phát hay giải phóng bộ nhớ thật.',
    workedCode:
      '# MO PHONG pha danh dau\nedges = {"A": ["B"]}\nreachable, hang_doi = set(), ["A"]\nwhile hang_doi:\n    n = hang_doi.pop()\n    if n in reachable:\n        continue\n    reachable.add(n)\n    hang_doi += edges.get(n, [])\nprint("deny: object van reachable" if "B" in reachable else "collected: mark-sweep")',
    predictCode:
      'reachable = {"A", "B"}\ntarget = "D"\nprint("collected: mark-sweep thu gom %s" % target if target not in reachable else "deny: object van reachable")',
    predictChoices: [
      'collected: mark-sweep thu gom D',
      'deny: object van reachable',
      'invalid: target',
    ],
    predictAnswer: 0,
    predictExplain: 'D không nằm trong tập đánh dấu được từ gốc, nên pha quét thu gom nó.',
    makePrompt:
      'Đọc một dòng dạng `roots:...,edges:...,target:...`, trong đó roots là các tên gốc ngăn bằng dấu chấm phẩy, edges là các cạnh dạng A>B cũng ngăn bằng dấu chấm phẩy, và dấu gạch ngang thay cho danh sách rỗng — ví dụ `roots:A,edges:A>B;B>C,target:C`. Thiếu trường → `invalid: field`; target không có trong đồ thị → `invalid: target`; target còn reachable từ gốc → `deny: object van reachable, mark-sweep khong thu gom`; còn lại → `collected: mark-sweep thu gom <target>`. Đồ thị có chu trình vẫn phải dừng. MÔ PHỎNG, không giải phóng bộ nhớ thật.',
    testCases: [
      {
        stdinLines: ['roots:A,edges:A>B,target:B'],
        expected: 'deny: object van reachable',
        hidden: false,
        label: 'còn đến được từ gốc thì cấm thu gom',
      },
      {
        stdinLines: ['roots:A,edges:A>B;C>D,target:D'],
        expected: 'collected: mark-sweep thu gom D',
        hidden: true,
        label: 'nhánh tách rời gốc là rác',
      },
      {
        stdinLines: ['roots:-,edges:A>B;B>A,target:A'],
        expected: 'collected: mark-sweep thu gom A',
        hidden: true,
        label: 'chu trình không có gốc vẫn thu gom được và không lặp vô hạn',
      },
      {
        stdinLines: ['roots:A,edges:A>B,target:Z'],
        expected: 'invalid: target',
        hidden: true,
        label: 'ca âm — thu gom một tên không tồn tại fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"roots", "edges", "target"} or not m["target"].strip():\n        print("invalid: field" if set(m) != {"roots", "edges", "target"} else "invalid: target")\n    else:\n        roots = [] if m["roots"] == "-" else [r for r in m["roots"].split(";") if r]\n        edges = {}\n        nodes = set(roots)\n        if m["edges"] != "-":\n            for e in m["edges"].split(";"):\n                a, b = e.split(">")\n                edges.setdefault(a, []).append(b)\n                nodes.add(a)\n                nodes.add(b)\n        if m["target"] not in nodes:\n            print("invalid: target")\n        else:\n            reachable = set()\n            hang_doi = list(roots)\n            while hang_doi:\n                n = hang_doi.pop()\n                if n in reachable:\n                    continue\n                reachable.add(n)\n                hang_doi += edges.get(n, [])\n            if m["target"] in reachable:\n                print("deny: object van reachable, mark-sweep khong thu gom")\n            else:\n                print("collected: mark-sweep thu gom %s" % m["target"])\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, dựng một chu trình tham chiếu trong một ngôn ngữ đếm tham chiếu và trong một ngôn ngữ mark-sweep, đo bộ nhớ thật của cả hai để thấy ngôn ngữ nào rò rỉ.',
    cards: [
      {
        hoi: 'Vì sao mark-sweep xử lý được chu trình còn đếm tham chiếu thì không?',
        dap: 'Mark-sweep hỏi "còn đến được từ gốc không"; hai đối tượng trỏ vòng vào nhau vẫn có bộ đếm khác 0 nhưng không ai từ gốc tới được chúng.',
      },
      {
        hoi: 'Thu gom nhầm một đối tượng còn sống dẫn tới gì?',
        dap: 'Use-after-free: chương trình tiếp tục dùng vùng nhớ đã bị tái sử dụng, sinh lỗi ngẫu nhiên và lỗ hổng bảo mật.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u239-l2',
    unitId: 'p6-u239',
    title: 'máy ảo ngăn xếp — thiếu toán hạng và thiếu khung',
    hook: 'Bytecode sai không nổ ở chỗ sai. Nó nổ vài lệnh sau, khi ngăn xếp đã lệch và giá trị đang nằm nhầm chỗ.',
    theory:
      'Máy ảo dựa ngăn xếp thực thi từng lệnh một: PUSH đẩy giá trị, ADD lấy hai giá trị trên đỉnh, CALL mở một khung, RET đóng khung hiện tại. Mọi lệnh đều có điều kiện tiên quyết về số phần tử trên ngăn xếp và số khung đang mở; vi phạm điều kiện đó phải dừng ngay bằng stack-error thay vì đọc vùng không xác định. Không chạy máy ảo hay JIT thật.',
    workedCode:
      '# MO PHONG may ao ngan xep\nstack = []\nfor op in ["PUSH 1", "PUSH 2", "ADD"]:\n    if op.startswith("PUSH"):\n        stack.append(int(op.split()[1]))\n    elif len(stack) < 2:\n        print("stack-error: thieu toan hang")\n        break\n    else:\n        stack.append(stack.pop() + stack.pop())\nelse:\n    print("ok: dinh ngan xep %d" % stack[-1])',
    predictCode:
      'frames = 0\nprint("stack-error: stack underflow" if frames == 0 else "ok: ngan xep rong")',
    predictChoices: ['stack-error: stack underflow', 'ok: ngan xep rong', 'invalid: op'],
    predictAnswer: 0,
    predictExplain:
      'RET khi chưa có khung nào đang mở là lệnh quay về từ hư không, nên máy ảo phải dừng thay vì đoán địa chỉ trả về.',
    makePrompt:
      'Đọc `ops:<các lệnh ngăn bằng dấu chấm phẩy>` với lệnh thuộc PUSH <số>, ADD, CALL, RET. Rỗng hoặc lệnh lạ → `invalid: ops`; ADD khi ngăn xếp dưới hai phần tử → `stack-error: thieu toan hang`; RET khi không còn khung → `stack-error: stack underflow`; chạy hết → `ok: dinh ngan xep <giá trị>` (ngăn xếp rỗng thì `ok: ngan xep rong`). MÔ PHỎNG, không chạy máy ảo thật.',
    testCases: [
      {
        stdinLines: ['ops:PUSH 1;PUSH 2;ADD'],
        expected: 'ok: dinh ngan xep 3',
        hidden: false,
        label: 'chuỗi bytecode hợp lệ',
      },
      {
        stdinLines: ['ops:PUSH 1;ADD'],
        expected: 'stack-error: thieu toan hang',
        hidden: true,
        label: 'ca âm — ADD thiếu toán hạng',
      },
      {
        stdinLines: ['ops:RET'],
        expected: 'stack-error: stack underflow',
        hidden: true,
        label: 'ca âm — RET không có khung nào để đóng',
      },
      {
        stdinLines: ['ops:PUSH 1;JUMP'],
        expected: 'invalid: ops',
        hidden: true,
        label: 'ca âm — lệnh ngoài tập lệnh fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    ops = [o for o in m.get("ops", "").split(";") if o] if m.get("ops") else []\n    hop_le = all(o in ("ADD", "CALL", "RET") or (o.startswith("PUSH ") and o.split()[1].isdigit()) for o in ops)\n    if set(m) != {"ops"} or not ops or not hop_le:\n        print("invalid: ops")\n    else:\n        stack, frames, loi = [], 0, ""\n        for o in ops:\n            if o.startswith("PUSH "):\n                stack.append(int(o.split()[1]))\n            elif o == "CALL":\n                frames += 1\n            elif o == "RET":\n                if frames == 0:\n                    loi = "stack-error: stack underflow"\n                    break\n                frames -= 1\n            else:\n                if len(stack) < 2:\n                    loi = "stack-error: thieu toan hang"\n                    break\n                stack.append(stack.pop() + stack.pop())\n        if loi: print(loi)\n        elif stack: print("ok: dinh ngan xep %d" % stack[-1])\n        else: print("ok: ngan xep rong")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, in bytecode thật của một hàm nhỏ bằng công cụ có sẵn của ngôn ngữ bạn dùng, rồi lần theo từng lệnh xem ngăn xếp cao bao nhiêu tại mỗi bước.',
    cards: [
      {
        hoi: 'Vì sao máy ảo phải kiểm điều kiện tiên quyết của từng lệnh?',
        dap: 'Vì bytecode có thể đến từ nguồn không tin cậy; bỏ kiểm là mở đường cho việc đọc/ghi ngoài vùng của máy ảo.',
      },
      {
        hoi: 'Khung lời gọi giữ những gì?',
        dap: 'Địa chỉ trả về, biến cục bộ và phần ngăn xếp toán hạng của lời gọi đó — đóng khung sai là mất cả ba.',
      },
    ],
  }),
]
