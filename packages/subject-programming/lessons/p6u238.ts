// P6-U238 — systems-s4-m1: trình biên dịch cho một ngôn ngữ đồ chơi.
// Hai bài chia theo hai loại lỗi mà hai PHA khác nhau bắt được: phân tích ngữ nghĩa bắt biến
// dùng trước khi khai báo, kiểm kiểu bắt phép toán sai kiểu. Lỗi nào cũng phải kèm SỐ DÒNG,
// vì một trình biên dịch không chỉ ra được chỗ hỏng thì gần như vô dụng với người dùng nó.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U238_LESSONS = [
  systemsSimulation({
    id: 'p6-u238-l1',
    unitId: 'p6-u238',
    title: 'phân tích ngữ nghĩa — biến dùng trước khi khai báo',
    hook: 'Cú pháp đúng không có nghĩa chương trình có nghĩa. `b = c + 1` đọc rất xuôi, cho tới khi trình biên dịch hỏi: c là cái gì?',
    theory:
      'Sau khi dựng cây cú pháp, trình biên dịch duyệt một lượt để xây bảng ký hiệu: mỗi khai báo thêm một tên, mỗi lần dùng phải tra được tên đó. Trace MÔ PHỎNG ở đây duyệt tuần tự từng câu lệnh của ngôn ngữ đồ chơi (`let <tên> = <biểu thức>` hoặc `<tên> = <biểu thức>`) và dừng ở lỗi đầu tiên kèm số dòng — không gọi trình biên dịch thật.',
    workedCode:
      '# MO PHONG bang ky hieu\nkhai = set()\nfor i, ten in enumerate(["a", "b"], 1):\n    khai.add(ten)\nprint("undeclared-var: dong 3" if "c" not in khai else "compiled")',
    predictCode:
      'khai = {"a"}\nrhs = ["c", "+", "1"]\nprint("undeclared-var: dong 2" if any(w.isalpha() and w not in khai for w in rhs) else "compiled: 4 lenh IR")',
    predictChoices: ['undeclared-var: dong 2', 'compiled: 4 lenh IR', 'type-error: dong 2'],
    predictAnswer: 0,
    predictExplain:
      'Bảng ký hiệu mới có a; tên c xuất hiện ở vế phải mà chưa từng được khai báo nên pha ngữ nghĩa dừng tại dòng 2.',
    makePrompt:
      'Đọc `prog:<các câu lệnh ngăn bằng dấu gạch đứng>`. Chương trình rỗng → `invalid: prog`; câu lệnh dưới 3 token → `invalid: dong <n>`; dùng hoặc gán một tên chưa khai báo → `undeclared-var: dong <n>`; hợp lệ → `compiled: <2 × số câu lệnh> lenh IR`. MÔ PHỎNG, không chạy lexer/parser của trình biên dịch thật.',
    testCases: [
      {
        stdinLines: ['prog:let a = 1|let b = a + 1'],
        expected: 'compiled: 4 lenh IR',
        hidden: false,
        label: 'khai báo trước, dùng sau — sinh được IR',
      },
      {
        stdinLines: ['prog:let a = 1|b = c + 1'],
        expected: 'undeclared-var: dong 2',
        hidden: true,
        label: 'ca âm — gán vào tên chưa khai báo',
      },
      {
        stdinLines: ['prog:x = 1'],
        expected: 'undeclared-var: dong 1',
        hidden: true,
        label: 'gán ngay câu đầu mà chưa có khai báo nào',
      },
      {
        stdinLines: ['prog:'],
        expected: 'invalid: prog',
        hidden: true,
        label: 'ca âm — chương trình rỗng fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"prog"} or not m["prog"].strip():\n        print("invalid: prog")\n    else:\n        cau = m["prog"].split("|")\n        khai = set()\n        loi = ""\n        for i, stmt in enumerate(cau, 1):\n            t = stmt.split()\n            if len(t) < 3:\n                loi = "invalid: dong %d" % i\n                break\n            if t[0] == "let":\n                ten, rhs = t[1], t[3:]\n            else:\n                ten, rhs = t[0], t[2:]\n                if ten not in khai:\n                    loi = "undeclared-var: dong %d" % i\n                    break\n            if any(w.isalpha() and w not in khai for w in rhs):\n                loi = "undeclared-var: dong %d" % i\n                break\n            khai.add(ten)\n        print(loi if loi else "compiled: %d lenh IR" % (2 * len(cau)))\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, lấy một trình thông dịch đồ chơi có sẵn, xoá phần kiểm bảng ký hiệu rồi chạy lại để thấy lỗi chuyển từ "báo tại dòng 2" thành "sai kết quả ở đâu đó".',
    cards: [
      {
        hoi: 'Bảng ký hiệu dùng để làm gì?',
        dap: 'Nó ánh xạ tên sang thông tin khai báo (phạm vi, kiểu, vị trí), để pha ngữ nghĩa biết một tên có nghĩa hay không trước khi sinh mã.',
      },
      {
        hoi: 'Vì sao lỗi biên dịch phải kèm số dòng?',
        dap: 'Vì chi phí sửa lỗi phần lớn nằm ở việc tìm chỗ hỏng; báo đúng vị trí biến lỗi thành việc sửa vài giây.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u238-l2',
    unitId: 'p6-u238',
    title: 'hệ thống kiểu — phép toán không hợp kiểu',
    hook: 'Cộng một số với một chuỗi: ngôn ngữ này cho chạy rồi hỏng lúc nửa đêm, ngôn ngữ kia từ chối biên dịch ngay. Khác biệt là ai phải trả giá và trả lúc nào.',
    theory:
      'Trong ngôn ngữ kiểu tĩnh, mỗi nút của cây biểu thức được gán một kiểu và phép toán chỉ hợp lệ khi các toán hạng cùng kiểu. Kiểm kiểu chạy SAU phân tích ngữ nghĩa, nên tới lượt nó mọi tên đều đã tra được. Trace MÔ PHỎNG chỉ xét hai toán hạng và một phép, không chạy bộ suy diễn kiểu thật.',
    workedCode:
      '# MO PHONG kiem kieu mot phep cong\na, b, line = "int", "str", 7\nprint("type-error: dong %d" % line if a != b else "compiled: 2 lenh IR")',
    predictCode:
      'a, b, line = "str", "str", 4\nprint("type-error: dong %d" % line if a != b else "compiled: 2 lenh IR")',
    predictChoices: ['compiled: 2 lenh IR', 'type-error: dong 4', 'invalid: a'],
    predictAnswer: 0,
    predictExplain:
      'Hai toán hạng cùng kiểu chuỗi nên phép cộng được hiểu là nối chuỗi và kiểm kiểu cho qua.',
    makePrompt:
      'Đọc `a:<int|str>,b:<int|str>,op:add,line:<số>`. Thiếu trường → `invalid: field`; kiểu lạ → `invalid: a` hoặc `invalid: b`; phép lạ → `invalid: op`; line sai kiểu → `invalid: line`; hai toán hạng khác kiểu → `type-error: dong <n>`; còn lại → `compiled: 2 lenh IR`. MÔ PHỎNG, không chạy trình biên dịch thật.',
    testCases: [
      {
        stdinLines: ['a:int,b:int,op:add,line:4'],
        expected: 'compiled: 2 lenh IR',
        hidden: false,
        label: 'hai số cộng được',
      },
      {
        stdinLines: ['a:int,b:str,op:add,line:7'],
        expected: 'type-error: dong 7',
        hidden: true,
        label: 'ca âm — cộng số với chuỗi bị chặn kèm số dòng',
      },
      {
        stdinLines: ['a:str,b:str,op:add,line:9'],
        expected: 'compiled: 2 lenh IR',
        hidden: true,
        label: 'hai chuỗi nối được nên vẫn hợp kiểu',
      },
      {
        stdinLines: ['a:float,b:int,op:add,line:2'],
        expected: 'invalid: a',
        hidden: true,
        label: 'ca âm — kiểu ngoài miền của ngôn ngữ đồ chơi',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"a", "b", "op", "line"}: print("invalid: field")\n    elif m["a"] not in {"int", "str"}: print("invalid: a")\n    elif m["b"] not in {"int", "str"}: print("invalid: b")\n    elif m["op"] != "add": print("invalid: op")\n    elif not m["line"].isdigit(): print("invalid: line")\n    elif m["a"] != m["b"]: print("type-error: dong %s" % m["line"])\n    else: print("compiled: 2 lenh IR")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, viết cùng một lỗi cộng số với chuỗi trong một ngôn ngữ kiểu tĩnh và một ngôn ngữ kiểu động, ghi lại lúc nào bạn biết mình sai và cái giá của mỗi cách.',
    cards: [
      {
        hoi: 'Kiểm kiểu tĩnh mua cho ta điều gì?',
        dap: 'Nó chuyển một lớp lỗi từ lúc chạy (đắt, khó tái hiện) về lúc biên dịch (rẻ, có vị trí rõ ràng).',
      },
      {
        hoi: 'Vì sao kiểm kiểu chạy sau phân tích ngữ nghĩa?',
        dap: 'Vì muốn biết kiểu của một tên thì trước hết tên đó phải tra được trong bảng ký hiệu.',
      },
    ],
  }),
]
