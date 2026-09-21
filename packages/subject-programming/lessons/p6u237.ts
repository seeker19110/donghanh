// P6-U237 — systems-s3-m4: đồng thời không khoá.
// Không dùng thread thật ở đây là CỐ Ý: một lỗi thứ tự bộ nhớ có thể không lộ ra sau hàng triệu
// lần chạy thử, nên dạy bằng máy trạng thái tường minh mới kiểm chứng được, còn chạy thử thì không.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U237_LESSONS = [
  systemsSimulation({
    id: 'p6-u237-l1',
    unitId: 'p6-u237',
    title: 'hàng rào bộ nhớ tại điểm công bố',
    hook: 'Luồng ghi dữ liệu xong rồi mới công bố con trỏ. Luồng đọc thấy con trỏ nhưng đọc ra rác. Không luồng nào sai thứ tự trong mã nguồn — phần cứng và trình biên dịch mới là bên sắp xếp lại.',
    theory:
      'Mô hình bộ nhớ cho phép sắp xếp lại các lệnh miễn là kết quả của MỘT luồng không đổi; ràng buộc giữa hai luồng phải nói ra bằng memory barrier. Thiếu hàng rào ở điểm công bố thì luồng đọc có thể thấy chỉ số mới trước khi thấy dữ liệu mới, sinh race. Trace MÔ PHỎNG chỉ xét ba trường, không tạo luồng thật.',
    workedCode:
      '# MO PHONG diem cong bo\nbarrier = "no"\nprint("race: thieu memory barrier tai diem cong bo" if barrier == "no" else "linearizable: thu tu doc-ghi hop le")',
    predictCode:
      'barrier, publish, reader = "yes", 3, 5\nif barrier == "no":\n    print("race: thieu memory barrier tai diem cong bo")\nelif reader > publish:\n    print("race: doc truoc khi ghi cong bo")\nelse:\n    print("linearizable: thu tu doc-ghi hop le")',
    predictChoices: [
      'race: doc truoc khi ghi cong bo',
      'linearizable: thu tu doc-ghi hop le',
      'race: thieu memory barrier tai diem cong bo',
    ],
    predictAnswer: 0,
    predictExplain:
      'Có hàng rào nhưng luồng đọc lấy chỉ số 5 trong khi nhà sản xuất mới công bố tới 3, tức là đọc phần chưa được ghi.',
    makePrompt:
      'Đọc `publish:<số>,barrier:<yes|no>,reader:<số>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; barrier no → `race: thieu memory barrier tai diem cong bo`; reader > publish → `race: doc truoc khi ghi cong bo`; còn lại → `linearizable: thu tu doc-ghi hop le`. MÔ PHỎNG, không chạy luồng thật.',
    testCases: [
      {
        stdinLines: ['publish:5,barrier:yes,reader:3'],
        expected: 'linearizable: thu tu doc-ghi hop le',
        hidden: false,
        label: 'đủ hàng rào và đọc trong phần đã công bố',
      },
      {
        stdinLines: ['publish:5,barrier:no,reader:3'],
        expected: 'race: thieu memory barrier tai diem cong bo',
        hidden: true,
        label: 'ca âm — thiếu hàng rào là race dù chạy thử vẫn ra đúng',
      },
      {
        stdinLines: ['publish:3,barrier:yes,reader:5'],
        expected: 'race: doc truoc khi ghi cong bo',
        hidden: true,
        label: 'đọc vượt điểm công bố',
      },
      {
        stdinLines: ['publish:3,barrier:maybe,reader:1'],
        expected: 'invalid: barrier',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"publish", "barrier", "reader"}: print("invalid: field")\n    elif not m["publish"].isdigit(): print("invalid: publish")\n    elif not m["reader"].isdigit(): print("invalid: reader")\n    elif m["barrier"] not in {"yes", "no"}: print("invalid: barrier")\n    elif m["barrier"] == "no": print("race: thieu memory barrier tai diem cong bo")\n    elif int(m["reader"]) > int(m["publish"]): print("race: doc truoc khi ghi cong bo")\n    else: print("linearizable: thu tu doc-ghi hop le")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, đọc tài liệu mô hình bộ nhớ của ngôn ngữ bạn dùng, viết một cặp publish/consume rồi dùng công cụ kiểm chứng đồng thời thật để xem nó báo gì khi bạn hạ cấp hàng rào xuống relaxed.',
    cards: [
      {
        hoi: 'Vì sao chạy thử nhiều lần không chứng minh được code lock-free là đúng?',
        dap: 'Sắp xếp lại lệnh chỉ lộ ra ở một số kiến trúc, một số tải và một số thời điểm; không gặp lỗi chỉ nghĩa là chưa gặp, không phải là không có.',
      },
      {
        hoi: 'Memory barrier làm gì?',
        dap: 'Nó cấm phần cứng và trình biên dịch di chuyển các thao tác bộ nhớ qua một điểm, nhờ đó thứ tự mà luồng khác nhìn thấy đúng như ý định.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u237-l2',
    unitId: 'p6-u237',
    title: 'hàng đợi lock-free — rỗng và tràn là trạng thái, không phải tai nạn',
    hook: 'Hàng đợi lock-free hỏng thường không hỏng lúc đầy tải, mà hỏng lúc rỗng: một lần lấy nhầm khi chưa có phần tử là đủ để cả hệ thống sai.',
    theory:
      'Một hàng đợi vòng có sức chứa cố định chỉ có ba kết cục hợp lệ cho mỗi thao tác: thành công, rỗng, hoặc đầy. Trace MÔ PHỎNG chạy tuần tự chuỗi thao tác và dừng ngay ở trạng thái biên đầu tiên gặp được, để người học thấy rằng rỗng và tràn phải được TRẢ VỀ, không được để rơi vào nhánh không xác định. Không chạy luồng hay cấp phát thật.',
    workedCode:
      '# MO PHONG hang doi vong\ncap, size = 2, 0\nfor op in ["PUSH", "PUSH", "PUSH"]:\n    if size == cap:\n        print("deny: tran capacity")\n        break\n    size += 1\nelse:\n    print("linearizable: con %d phan tu" % size)',
    predictCode:
      'size = 0\nfor op in ["POP"]:\n    if size == 0:\n        print("empty: hang doi rong")\n        break\nelse:\n    print("linearizable: con %d phan tu" % size)',
    predictChoices: ['empty: hang doi rong', 'linearizable: con 0 phan tu', 'deny: tran capacity'],
    predictAnswer: 0,
    predictExplain:
      'Consumer lấy khi chưa có phần tử nào; hàng đợi trả trạng thái rỗng thay vì đọc ô chưa ghi.',
    makePrompt:
      'Đọc `cap:<số>,ops:<chuỗi PUSH/POP ngăn bằng dấu chấm phẩy>`. Thiếu trường, cap không phải số dương, hoặc có thao tác lạ → `invalid: <trường>`; POP khi rỗng → `empty: hang doi rong`; PUSH khi đã đầy → `deny: tran capacity`; chạy hết chuỗi → `linearizable: con <n> phan tu`. MÔ PHỎNG bằng máy trạng thái, không chạy luồng thật.',
    testCases: [
      {
        stdinLines: ['cap:3,ops:PUSH;PUSH;POP'],
        expected: 'linearizable: con 1 phan tu',
        hidden: false,
        label: 'chuỗi thao tác hợp lệ chạy hết',
      },
      {
        stdinLines: ['cap:3,ops:POP'],
        expected: 'empty: hang doi rong',
        hidden: true,
        label: 'lấy khi rỗng phải trả trạng thái, không crash',
      },
      {
        stdinLines: ['cap:2,ops:PUSH;PUSH;PUSH'],
        expected: 'deny: tran capacity',
        hidden: true,
        label: 'ca âm — vượt sức chứa cố định fail closed',
      },
      {
        stdinLines: ['cap:2,ops:PUSH;PEEK'],
        expected: 'invalid: ops',
        hidden: true,
        label: 'ca âm — thao tác lạ fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    ops = m.get("ops", "").split(";") if m.get("ops") else []\n    if set(m) != {"cap", "ops"}: print("invalid: field")\n    elif not m["cap"].isdigit() or int(m["cap"]) <= 0: print("invalid: cap")\n    elif any(op not in ("PUSH", "POP") for op in ops) or not ops: print("invalid: ops")\n    else:\n        cap = int(m["cap"])\n        size = 0\n        loi = ""\n        for op in ops:\n            if op == "PUSH" and size == cap:\n                loi = "deny: tran capacity"\n                break\n            if op == "POP" and size == 0:\n                loi = "empty: hang doi rong"\n                break\n            size += 1 if op == "PUSH" else -1\n        print(loi if loi else "linearizable: con %d phan tu" % size)\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, đọc mã nguồn một hàng đợi lock-free có sẵn và tìm xem nó xử lý ca rỗng, ca đầy và ca ABA ở đâu, rồi viết lại ba ca đó thành test.',
    cards: [
      {
        hoi: 'Vì sao hàng đợi phải trả trạng thái rỗng thay vì đọc bừa?',
        dap: 'Ô chưa ghi chứa giá trị không xác định; đọc nó làm lỗi lan ra toàn hệ thống mà không có dấu vết tại chỗ hỏng.',
      },
      {
        hoi: 'Lock-free bảo đảm điều gì?',
        dap: 'Bảo đảm luôn có ít nhất một luồng tiến được, dù luồng khác bị dừng; nó không bảo đảm nhanh hơn, cũng không bảo đảm dễ viết đúng hơn.',
      },
    ],
  }),
]
