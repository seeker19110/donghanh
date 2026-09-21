// lessons/p6u244.ts — P6-U244: HƯỚNG GAME, chặng S1 — module `game-s1-m3` (cảm giác chơi:
// gia tốc, ma sát, lực nhảy, coyote time, jump buffer).
//
// Bài 1 dạy CỬA SỔ THA THỨ khi người chơi bấm MUỘN (coyote time), bài 2 dạy cửa sổ tha thứ khi
// người chơi bấm SỚM (jump buffer) cùng bộ tham số gia tốc/ma sát phải là số dương.
// Nguyên tắc xuyên suốt: cảm giác chơi mô tả bằng SỐ, không bằng tính từ.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: cửa sổ tính bằng SỐ KHUNG HÌNH, không đồng hồ thật, không engine.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U244_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u244-l1',
    unitId: 'p6-u244',
    language: 'python',
    title: 'MÔ PHỎNG coyote time: cửa sổ vẫn nhảy được sau khi đã rời mép nền',
    hook: 'Người chơi thề rằng họ đã bấm nhảy khi còn đứng trên nền — và họ nói thật, chỉ là họ bấm muộn ba khung hình.',
    theory:
      'Coyote time là cửa sổ vài khung hình sau khi nhân vật rời mép nền mà lệnh nhảy vẫn được chấp nhận. Nó tồn tại vì con người không bấm phím chính xác tới từng khung hình: ở 60 khung hình một giây, ba khung hình chỉ là 50 mili-giây — ngắn hơn độ trễ phản xạ, nên người chơi không cảm thấy mình được tha thứ, họ chỉ cảm thấy trò chơi "đúng ý". Cửa sổ phải là một con số cấu hình được và phải DƯƠNG: cửa sổ 0 hoặc âm là lỗi cấu hình, không phải "tắt tính năng", nên cổng trả `invalid` thay vì âm thầm coi như tắt. Cảm giác chơi luôn mô tả bằng số như thế — "nhảy đã tay" không kiểm được, "cửa sổ tha thứ 5 khung hình" thì kiểm được. Đây là MÔ PHỎNG hữu hạn đếm khung hình, không engine, không đồng hồ hệ thống.',
    workedExample: {
      code: `# MO PHONG coyote time; moi so la SO KHUNG HINH, khong phai giay that.\nkhung_da_roi, cua_so, tren_nen = 3, 5, 0\n# Con dung tren nen thi nhay duoc ngay; roi mep thi con cua so tha thu.\nduoc = tren_nen == 1 or khung_da_roi <= cua_so\nprint("allow: nhay trong cua so coyote" if duoc else "deny: da roi qua lau")`,
      stdinLines: [],
    },
    predict: {
      code: `khung_da_roi, cua_so = 9, 5\nprint("allow: nhay trong cua so coyote" if khung_da_roi <= cua_so else "deny: da roi qua lau")`,
      question:
        'Nhân vật đã rời mép nền 9 khung hình, cửa sổ coyote là 5 khung hình. MÔ PHỎNG in gì?',
      choices: [
        'deny: da roi qua lau',
        'allow: nhay trong cua so coyote',
        'invalid: cua so',
        'unknown: chua du thong tin',
      ],
      answerIndex: 0,
      explain:
        'Cửa sổ tha thứ đã đóng từ khung hình thứ sáu, nên đây là một cú nhảy giữa không trung thật sự — cho phép nó nghĩa là nhân vật bay được, và cả thiết kế màn chơi dựa trên khoảng cách nhảy sẽ sai theo.',
    },
    parsons: {
      prompt:
        'Xếp cổng coyote time: kiểm cấu hình trước, rồi mới xét đang đứng nền hay đã rời mép.',
      lines: [
        'if cua_so <= 0:',
        '    print("invalid: cua so")',
        'elif tren_nen == 1:',
        '    print("allow: dang dung tren nen")',
        'elif khung_da_roi <= cua_so:',
        '    print("allow: nhay trong cua so coyote")',
        'else:',
        '    print("deny: da roi qua lau")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng nhảy có coyote time. Đọc `tren_nen:<0|1>,khung_da_roi:<int>,cua_so:<int>`. Thiếu/thừa trường → `invalid: field`; tren_nen ngoài {0,1} → `invalid: tren_nen`; khung_da_roi không phải số nguyên không âm → `invalid: khung_da_roi`; cua_so không phải số nguyên hoặc ≤ 0 → `invalid: cua so`; tren_nen = 1 → `allow: dang dung tren nen`; khung_da_roi ≤ cua_so → `allow: nhay trong cua so coyote`; còn lại → `deny: da roi qua lau`. Không đồng hồ thật, không engine, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG coyote time; đếm khung hình, không đọc đồng hồ hệ thống.\n',
      testCases: [
        {
          stdinLines: ['tren_nen:0,khung_da_roi:3,cua_so:5'],
          expected: 'allow: nhay trong cua so coyote',
          match: 'contains',
          hidden: false,
          label: 'bấm muộn 3 khung hình vẫn nhảy được — cửa sổ tha thứ còn mở',
        },
        {
          stdinLines: ['tren_nen:0,khung_da_roi:9,cua_so:5'],
          expected: 'deny: da roi qua lau',
          match: 'contains',
          hidden: true,
          label: 'ngoài cửa sổ và không đứng nền thì không nhảy giữa không trung được',
        },
        {
          stdinLines: ['tren_nen:1,khung_da_roi:0,cua_so:5'],
          expected: 'allow: dang dung tren nen',
          match: 'contains',
          hidden: true,
          label: 'đang đứng nền thì không cần tới coyote time',
        },
        {
          stdinLines: ['tren_nen:0,khung_da_roi:5,cua_so:5'],
          expected: 'allow: nhay trong cua so coyote',
          match: 'contains',
          hidden: true,
          label: 'đúng khung hình cuối của cửa sổ vẫn nằm trong cửa sổ',
        },
        {
          stdinLines: ['tren_nen:0,khung_da_roi:3,cua_so:0'],
          expected: 'invalid: cua so',
          match: 'contains',
          hidden: true,
          label: 'ca âm — cửa sổ bằng 0 là lỗi cấu hình, không phải "tắt tính năng"',
        },
      ],
      hints: [
        'Kiểm cấu hình (cua_so) TRƯỚC mọi thứ: cấu hình hỏng thì kết quả nào cũng không đáng tin.',
        'Biên của cửa sổ tính bằng `<=`: khung hình cuối cùng vẫn phải được tha thứ.',
        'Không dùng `time`, `datetime.now`, file, socket hay subprocess.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"tren_nen", "khung_da_roi", "cua_so"}:
        print("invalid: field")
    elif m["tren_nen"] not in {"0", "1"}:
        print("invalid: tren_nen")
    elif so(m["khung_da_roi"]) is None:
        print("invalid: khung_da_roi")
    elif so(m["cua_so"]) is None or so(m["cua_so"]) <= 0:
        print("invalid: cua so")
    elif m["tren_nen"] == "1":
        print("allow: dang dung tren nen")
    elif so(m["khung_da_roi"]) <= so(m["cua_so"]):
        print("allow: nhay trong cua so coyote")
    else:
        print("deny: da roi qua lau")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity thêm coyote time cho nhân vật của bạn và để cửa sổ ở một biến chỉnh được lúc chạy. Cho ba người chưa từng chơi thử lần lượt các giá trị 0, 4 và 12 khung hình; ghi lại họ rơi xuống vực bao nhiêu lần ở mỗi giá trị và câu họ nói về cảm giác — đó là dữ liệu, còn "thấy mượt hơn" thì không.',
    srsCards: [
      {
        hoi: 'Coyote time có làm trò chơi dễ đi không, và vì sao người chơi không nhận ra nó?',
        dap: 'Nó chỉ bù cho độ trễ phản xạ của con người chứ không bỏ luật: vài khung hình ở 60Hz là vài chục mili-giây, ngắn hơn ngưỡng cảm nhận, nên người chơi chỉ thấy trò chơi "đúng ý mình" chứ không thấy được tha.',
      },
      {
        hoi: 'Vì sao cửa sổ coyote bằng 0 nên trả `invalid` thay vì hiểu là "tắt tính năng"?',
        dap: 'Vì hai ý định ấy không phân biệt được ở giá trị 0, và đoán nhầm sẽ giấu một lỗi cấu hình thật; bắt khai tường minh khiến người soạn số phải nói rõ mình muốn gì.',
      },
    ],
  },
  {
    id: 'p6-u244-l2',
    unitId: 'p6-u244',
    language: 'python',
    title: 'MÔ PHỎNG jump buffer và bộ tham số cảm giác: gia tốc, ma sát, lực nhảy',
    hook: 'Người chơi bấm nhảy hai khung hình trước khi chạm đất; không có bộ nhớ đệm, cú nhảy đó biến mất và họ tưởng phím bị liệt.',
    theory:
      'Jump buffer là cửa sổ ngược chiều với coyote time: coyote tha thứ cho người bấm MUỘN, buffer tha thứ cho người bấm SỚM. Khi lệnh nhảy tới lúc nhân vật còn cách đất vài khung hình, ta ghi lệnh vào bộ nhớ đệm; chạm đất trong cửa sổ đó thì thực hiện luôn cú nhảy. Cả hai cửa sổ đều là SỐ khung hình cấu hình được, và cả bộ tham số cảm giác còn lại — gia tốc, ma sát, lực nhảy — cũng vậy: chúng phải dương, vì gia tốc âm là đi lùi khi bấm tiến, ma sát âm là càng phanh càng nhanh, lực nhảy âm là nhảy xuống đất. Cổng chặn những giá trị đó ngay khi nạp cấu hình, trước khi chúng biến thành một lỗi "chơi thấy kỳ kỳ" không ai tả nổi. Đây là MÔ PHỎNG hữu hạn, đếm khung hình, không engine, không đồng hồ thật.',
    workedExample: {
      code: `# MO PHONG jump buffer; lenh bam SOM duoc nho lai trong cua so.\nkhung_truoc_khi_cham, cua_so = 2, 4\nprint("allow: nhay tu bo nho dem" if khung_truoc_khi_cham <= cua_so else "deny: lenh nhay da het han")`,
      stdinLines: [],
    },
    predict: {
      code: `gia_toc, ma_sat, luc_nhay = 800, -20, 400\nxau = [t for t in (gia_toc, ma_sat, luc_nhay) if t <= 0]\nprint("invalid: tham so cam giac" if xau else "allow: cau hinh hop le")`,
      question: 'Bộ tham số cảm giác có hệ số ma sát âm. MÔ PHỎNG in gì?',
      choices: [
        'invalid: tham so cam giac',
        'allow: cau hinh hop le',
        'deny: lenh nhay da het han',
        'clamp: ve gia tri toi thieu',
      ],
      answerIndex: 0,
      explain:
        'Ma sát âm nghĩa là càng phanh càng nhanh — nhân vật sẽ trượt tăng tốc vô hạn. Cổng chặn ngay lúc nạp cấu hình, vì để nó chạy thì lỗi chỉ lộ ra dưới dạng "chơi thấy kỳ kỳ" mà không ai chỉ được nguyên nhân.',
    },
    parsons: {
      prompt: 'Xếp cổng cấu hình cảm giác chơi: tham số hỏng thì không được đụng tới cửa sổ nhảy.',
      lines: [
        'if gia_toc <= 0 or ma_sat <= 0 or luc_nhay <= 0:',
        '    print("invalid: tham so cam giac")',
        'elif cua_so <= 0:',
        '    print("invalid: cua so")',
        'elif khung_truoc_khi_cham <= cua_so:',
        '    print("allow: nhay tu bo nho dem")',
        'else:',
        '    print("deny: lenh nhay da het han")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng jump buffer kèm kiểm tham số cảm giác. Đọc `gia_toc:<int>,ma_sat:<int>,luc_nhay:<int>,cua_so:<int>,khung_truoc_khi_cham:<int>`. Thiếu/thừa trường → `invalid: field`; bất kỳ trường nào không phải số nguyên (cho phép âm) → `invalid: so`; gia_toc, ma_sat hoặc luc_nhay ≤ 0 → `invalid: tham so cam giac`; cua_so ≤ 0 → `invalid: cua so`; khung_truoc_khi_cham < 0 → `invalid: khung_truoc_khi_cham`; khung_truoc_khi_cham ≤ cua_so → `allow: nhay tu bo nho dem`; còn lại → `deny: lenh nhay da het han`. Không engine, không đồng hồ thật, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG jump buffer; cảm giác chơi mô tả bằng SỐ, không bằng tính từ.\n',
      testCases: [
        {
          stdinLines: ['gia_toc:800,ma_sat:20,luc_nhay:400,cua_so:4,khung_truoc_khi_cham:2'],
          expected: 'allow: nhay tu bo nho dem',
          match: 'contains',
          hidden: false,
          label: 'bấm sớm 2 khung hình vẫn được nhớ lại và thực hiện khi chạm đất',
        },
        {
          stdinLines: ['gia_toc:800,ma_sat:20,luc_nhay:400,cua_so:4,khung_truoc_khi_cham:11'],
          expected: 'deny: lenh nhay da het han',
          match: 'contains',
          hidden: true,
          label: 'bấm quá sớm thì lệnh hết hạn, không treo lơ lửng vô thời hạn',
        },
        {
          stdinLines: ['gia_toc:800,ma_sat:20,luc_nhay:400,cua_so:4,khung_truoc_khi_cham:4'],
          expected: 'allow: nhay tu bo nho dem',
          match: 'contains',
          hidden: true,
          label: 'đúng biên cửa sổ vẫn được nhận',
        },
        {
          stdinLines: ['gia_toc:800,ma_sat:-20,luc_nhay:400,cua_so:4,khung_truoc_khi_cham:2'],
          expected: 'invalid: tham so cam giac',
          match: 'contains',
          hidden: true,
          label: 'ma sát âm bị chặn ngay lúc nạp cấu hình',
        },
        {
          stdinLines: ['gia_toc:800,ma_sat:20,luc_nhay:400,cua_so:bon,khung_truoc_khi_cham:2'],
          expected: 'invalid: so',
          match: 'contains',
          hidden: true,
          label: 'ca âm — cửa sổ sai kiểu fail closed',
        },
      ],
      hints: [
        'Kiểm kiểu của cả năm số một lượt trước, rồi mới kiểm miền giá trị từng nhóm.',
        'Ba tham số cảm giác kiểm chung một nhánh; cửa sổ kiểm riêng vì lời báo lỗi phải khác nhau.',
        'Không dùng `time`, `datetime.now`, file, socket hay subprocess.',
      ],
      sampleSolution: `KHOA = ("gia_toc", "ma_sat", "luc_nhay", "cua_so", "khung_truoc_khi_cham")


def so(x):
    lo = x[1:] if x.startswith("-") else x
    return int(x) if lo.isdigit() and lo != "" else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(KHOA):
        print("invalid: field")
    elif any(so(m[k]) is None for k in KHOA):
        print("invalid: so")
    else:
        v = {k: so(m[k]) for k in KHOA}
        if v["gia_toc"] <= 0 or v["ma_sat"] <= 0 or v["luc_nhay"] <= 0:
            print("invalid: tham so cam giac")
        elif v["cua_so"] <= 0:
            print("invalid: cua so")
        elif v["khung_truoc_khi_cham"] < 0:
            print("invalid: khung_truoc_khi_cham")
        elif v["khung_truoc_khi_cham"] <= v["cua_so"]:
            print("allow: nhay tu bo nho dem")
        else:
            print("deny: lenh nhay da het han")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity đưa cả năm con số (gia tốc, ma sát, lực nhảy, cửa sổ coyote, cửa sổ buffer) ra một tệp cấu hình sửa được mà không biên dịch lại. Chơi thử ba bộ số khác nhau, quay màn hình từng bộ, rồi viết một bảng ba dòng: bộ số — điều bạn cảm thấy — điều người chơi thử nói. Không dùng tính từ nào mà không có số đi kèm.',
    srsCards: [
      {
        hoi: 'Coyote time và jump buffer tha thứ cho hai lỗi ngược nhau nào của người chơi?',
        dap: 'Coyote time tha thứ cho người bấm nhảy MUỘN, sau khi đã rời mép nền; jump buffer tha thứ cho người bấm SỚM, trước khi kịp chạm đất. Có cả hai thì gần như mọi cú bấm "hụt" đều thành cú nhảy đúng ý.',
      },
      {
        hoi: 'Vì sao phải mô tả cảm giác chơi bằng số thay vì bằng tính từ như "đã tay"?',
        dap: 'Tính từ không kiểm được, không truyền lại được cho người khác và không so sánh được giữa hai bản; con số thì đưa vào tệp cấu hình, thử A/B với người chơi thật và ghi lại được kết quả.',
      },
    ],
  },
]
