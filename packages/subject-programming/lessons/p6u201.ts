import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U201_LESSONS = [
  devopsSimulation({
    id: 'p6-u201-l1',
    unitId: 'p6-u201',
    title: 'phân rã độ trễ: ttft, thời gian giữa token và span truy hồi',
    hook: 'Một con số "độ trễ trung bình" không cho biết nên sửa gì; phải tách được phần chờ token đầu, phần sinh token sau và phần đi truy hồi dữ liệu.',
    theory:
      'Độ trễ của một luồng AI phải tách tối thiểu hai phần: thời gian tới token đầu (ttft) phản ánh chi phí xếp hàng, nạp ngữ cảnh và truy hồi; còn thời gian giữa các token phản ánh tốc độ sinh. Mỗi chặng — truy hồi, mô hình, công cụ — là một span trong cây vết; span thiếu cha thì cây gãy và mọi phép cộng đều sai, nên phải fail closed thay vì đoán. Phân vị tính trên mẫu nhỏ hơn ngưỡng cũng vô nghĩa và phải trả `unknown`. Các con số ở đây là MÔ PHỎNG để tập đọc, không phải cam kết vận hành cho bất kỳ mô hình nào.',
    workedCode:
      '# MÔ PHỎNG phan ra do tre\nttft, itl = 320, 25\nprint(f"allow: phan ra do tre ttft {ttft} itl {itl}")',
    predictCode:
      'span_cha = "no"\nprint("deny: span thieu cha, fail closed" if span_cha == "no" else "allow: phan ra do tre")',
    predictChoices: [
      'deny: span thieu cha, fail closed',
      'allow: phan ra do tre',
      'unknown: mau duoi nguong phan vi',
    ],
    predictAnswer: 0,
    predictExplain:
      'Span không có cha thì không gắn được vào cây vết; cộng nó vào tổng sẽ tạo ra con số sai mà không ai phát hiện, nên từ chối là lựa chọn an toàn.',
    makePrompt:
      'Đọc `mau:<số>,nguong:<số>,ttft:<số>,itl:<số>,spanCha:<yes|no>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; spanCha no → `deny: span thieu cha, fail closed`; mau < nguong → `unknown: mau duoi nguong phan vi`; còn lại → `allow: phan ra do tre ttft <ttft> itl <itl>`. MÔ PHỎNG, không đọc hệ thu thập vết hay dịch vụ mô hình thật.',
    testCases: [
      {
        stdinLines: ['mau:200,nguong:50,ttft:320,itl:25,spanCha:yes'],
        expected: 'allow: phan ra do tre ttft 320 itl 25',
        hidden: false,
        label: 'mẫu đủ lớn và cây vết liền mạch',
      },
      {
        stdinLines: ['mau:200,nguong:50,ttft:320,itl:25,spanCha:no'],
        expected: 'deny: span thieu cha, fail closed',
        hidden: true,
        label: 'span mồ côi làm gãy cây vết',
      },
      {
        stdinLines: ['mau:10,nguong:50,ttft:320,itl:25,spanCha:yes'],
        expected: 'unknown: mau duoi nguong phan vi',
        hidden: true,
        label: 'ca âm — phân vị trên mẫu nhỏ là vô nghĩa',
      },
      {
        stdinLines: ['mau:200,nguong:50,ttft:-5,itl:25,spanCha:yes'],
        expected: 'invalid: ttft',
        hidden: true,
        label: 'ca âm — độ trễ âm fail closed',
      },
    ],
    sampleSolution:
      'SO = ["mau", "nguong", "ttft", "itl"]\ntry:\n    m = dict(p.split(":", 1) for p in input().strip().split(","))\n    if set(m) != set(SO) | {"spanCha"}: print("invalid: field")\n    else:\n        xau = next((k for k in SO if not m[k].isdigit()), None)\n        if xau: print(f"invalid: {xau}")\n        elif m["spanCha"] not in {"yes", "no"}: print("invalid: spanCha")\n        elif m["spanCha"] == "no": print("deny: span thieu cha, fail closed")\n        elif int(m["mau"]) < int(m["nguong"]): print("unknown: mau duoi nguong phan vi")\n        else: print(f"allow: phan ra do tre ttft {m[\'ttft\']} itl {m[\'itl\']}")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, gắn vết cho một luồng AI thật và tách riêng thời gian tới token đầu với thời gian sinh phần còn lại; ghi lại chặng nào chiếm phần lớn ttft và bạn sẽ vặn gì trước để giảm nó.',
    cards: [
      {
        hoi: 'Vì sao phải tách ttft khỏi thời gian giữa các token?',
        dap: 'Hai phần này do hai nguyên nhân khác nhau gây ra — xếp hàng/truy hồi so với tốc độ sinh — nên cách sửa cũng khác nhau; gộp lại thì không biết vặn chỗ nào.',
      },
      {
        hoi: 'Vì sao span thiếu cha lại nguy hiểm hơn là thiếu hẳn span?',
        dap: 'Thiếu hẳn thì nhìn ra ngay là thiếu, còn span mồ côi vẫn được cộng vào thống kê và tạo ra một con số trông hợp lý nhưng sai.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u201-l2',
    unitId: 'p6-u201',
    title: 'postmortem không đổ lỗi và đo toil trước mùa tải cao',
    hook: 'Một bản postmortem thiếu chủ sở hữu hành động và ngày xem lại thì chỉ là một bài kể chuyện — sự cố y hệt sẽ quay lại.',
    theory:
      'Postmortem không đổ lỗi tách con người khỏi hệ thống: câu hỏi là "điều kiện nào khiến hành động đó trông hợp lý lúc ấy", không phải "ai sai". Bản ghi chỉ được coi là đủ khi có đồng thời dòng thời gian, nguyên nhân gốc, chủ sở hữu cho từng hành động sửa và ngày xem lại; thiếu bất kỳ mục nào thì trả `incomplete` kèm tên mục. Song song đó phải đo việc thủ công lặp lại (toil) bằng giờ để quyết định tự động hoá cái gì trước mùa tải cao đã biết trước. Ước lượng toil âm là lỗi nhập liệu, không phải "tiết kiệm được giờ".',
    workedCode:
      '# MÔ PHỎNG kiem tra postmortem\nmuc = {"dongthoigian": "yes", "nguyennhan": "yes", "chusohuu": "yes", "ngayreview": "no"}\nthieu = next((k for k, v in muc.items() if v == "no"), None)\nprint(f"incomplete: thieu {thieu}" if thieu else "allow: postmortem day du")',
    predictCode: 'toil = -4\nprint("invalid: toil am" if toil < 0 else f"allow: toil {toil} gio")',
    predictChoices: ['invalid: toil am', 'allow: toil -4 gio', 'incomplete: thieu ngayreview'],
    predictAnswer: 0,
    predictExplain:
      'Số giờ việc thủ công không thể âm; nhận nó nghĩa là để một lỗi nhập liệu làm đẹp báo cáo tự động hoá.',
    makePrompt:
      'Đọc `dongthoigian:<yes|no>,nguyennhan:<yes|no>,chusohuu:<yes|no>,ngayreview:<yes|no>,toil:<số nguyên>`. Thiếu trường hoặc giá trị ngoài miền → `invalid: <trường>`; toil < 0 → `invalid: toil am`; thiếu mục theo thứ tự đã nêu → `incomplete: thieu <mục>`; còn lại → `allow: postmortem khong do loi day du, toil <số> gio`. MÔ PHỎNG, không đọc kho sự cố hay hệ ticket thật.',
    testCases: [
      {
        stdinLines: ['dongthoigian:yes,nguyennhan:yes,chusohuu:yes,ngayreview:yes,toil:12'],
        expected: 'allow: postmortem khong do loi day du, toil 12 gio',
        hidden: false,
        label: 'đủ bốn mục và số giờ toil hợp lệ',
      },
      {
        stdinLines: ['dongthoigian:yes,nguyennhan:yes,chusohuu:no,ngayreview:yes,toil:12'],
        expected: 'incomplete: thieu chusohuu',
        hidden: true,
        label: 'hành động sửa không có chủ sở hữu',
      },
      {
        stdinLines: ['dongthoigian:yes,nguyennhan:yes,chusohuu:yes,ngayreview:yes,toil:-4'],
        expected: 'invalid: toil am',
        hidden: true,
        label: 'ca âm — số giờ việc thủ công không thể âm',
      },
      {
        stdinLines: ['dongthoigian:yes,nguyennhan:yes,chusohuu:yes,ngayreview:sau,toil:12'],
        expected: 'invalid: ngayreview',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'MUC = ["dongthoigian", "nguyennhan", "chusohuu", "ngayreview"]\n\ndef so(x):\n    try: return int(x)\n    except ValueError: return None\n\ntry:\n    m = dict(p.split(":", 1) for p in input().strip().split(","))\n    if set(m) != set(MUC) | {"toil"}: print("invalid: field")\n    else:\n        xau = next((k for k in MUC if m[k] not in {"yes", "no"}), None)\n        thieu = next((k for k in MUC if m[k] == "no"), None)\n        toil = so(m["toil"])\n        if xau: print(f"invalid: {xau}")\n        elif toil is None: print("invalid: toil")\n        elif toil < 0: print("invalid: toil am")\n        elif thieu: print(f"incomplete: thieu {thieu}")\n        else: print(f"allow: postmortem khong do loi day du, toil {toil} gio")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, lấy một postmortem thật đã viết và chấm nó theo bốn mục trên; với mỗi hành động sửa chưa có chủ sở hữu, hãy gán người và ngày xem lại, rồi ước lượng số giờ toil mà hành động đó cắt được mỗi tháng.',
    cards: [
      {
        hoi: 'Vì sao postmortem không đổ lỗi lại cho ra nhiều thông tin hơn?',
        dap: 'Khi người ta không sợ bị quy trách nhiệm, họ kể đúng thứ tự sự việc và nói ra những gì mình không biết lúc đó — đó mới là dữ liệu để sửa hệ thống.',
      },
      {
        hoi: 'Đo toil bằng giờ để làm gì?',
        dap: 'Nó biến cảm giác "việc này mệt" thành con số so sánh được với chi phí tự động hoá, nhờ vậy chọn được đúng việc nên tự động trước mùa tải cao.',
      },
    ],
  }),
]
