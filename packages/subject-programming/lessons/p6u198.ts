import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U198_LESSONS = [
  devopsSimulation({
    id: 'p6-u198-l1',
    unitId: 'p6-u198',
    title: 'golden path: khuôn mẫu dịch vụ và cổng tự phục vụ',
    hook: 'Nền tảng nội bộ chỉ có giá trị khi lối đi lát sẵn là lối DỄ NHẤT — một dịch vụ đi vòng qua khuôn mẫu là một dịch vụ không ai biết nó thiếu cổng nào.',
    theory:
      'Lối đi lát sẵn (golden path) là khuôn mẫu dịch vụ đã cắm sẵn các cổng bắt buộc: kiểm thử, quét phụ thuộc, ký tạo tác, sổ tay vận hành. Cổng tự phục vụ cho đội sản phẩm tự tạo dịch vụ mà không mở ticket, nhưng đổi lại nền tảng phải TỪ CHỐI được dịch vụ đi vòng qua khuôn mẫu và nêu rõ còn thiếu bao nhiêu cổng — từ chối im lặng thì đội không biết đường sửa.',
    workedCode:
      '# MÔ PHỎNG cổng tự phục vụ\npassed, required = 4, 4\nprint("allow: golden path du cong" if passed >= required else "deny: thieu cong")',
    predictCode:
      'template, passed, required = "no", 1, 4\nprint(f"deny: bo qua golden path, thieu {required - passed} cong" if template == "no" else "allow: golden path du cong")',
    predictChoices: [
      'deny: bo qua golden path, thieu 3 cong',
      'allow: golden path du cong',
      'deny: thieu cong',
    ],
    predictAnswer: 0,
    predictExplain:
      'Dịch vụ không dựng từ khuôn mẫu thì bị từ chối, và lời từ chối phải nêu số cổng còn thiếu (4 − 1 = 3) để đội sản phẩm biết đường quay lại lối đi lát sẵn.',
    makePrompt:
      'Đọc fixture `template:<yes|no>,passed:<số>,required:<số>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; template no → `deny: bo qua golden path, thieu <required-passed> cong`; passed < required → `deny: thieu cong`; còn lại → `allow: golden path du cong`. MÔ PHỎNG, không gọi cổng tự phục vụ hay kho khuôn mẫu thật.',
    testCases: [
      {
        stdinLines: ['template:yes,passed:4,required:4'],
        expected: 'allow: golden path du cong',
        hidden: false,
        label: 'dựng từ khuôn mẫu và qua đủ cổng',
      },
      {
        stdinLines: ['template:no,passed:1,required:4'],
        expected: 'deny: bo qua golden path, thieu 3 cong',
        hidden: true,
        label: 'đi vòng qua khuôn mẫu bị từ chối kèm số cổng thiếu',
      },
      {
        stdinLines: ['template:yes,passed:2,required:4'],
        expected: 'deny: thieu cong',
        hidden: true,
        label: 'đúng khuôn mẫu nhưng chưa qua đủ cổng',
      },
      {
        stdinLines: ['template:yes,passed:hai,required:4'],
        expected: 'invalid: passed',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"template", "passed", "required"}: print("invalid: field")\n    elif m["template"] not in {"yes", "no"}: print("invalid: template")\n    elif not m["passed"].isdigit(): print("invalid: passed")\n    elif not m["required"].isdigit(): print("invalid: required")\n    elif m["template"] == "no": print(f"deny: bo qua golden path, thieu {int(m[\'required\']) - int(m[\'passed\'])} cong")\n    elif int(m["passed"]) < int(m["required"]): print("deny: thieu cong")\n    else: print("allow: golden path du cong")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, lấy một dịch vụ thật trong tổ chức bạn và liệt kê mọi bước từ "tạo repo" tới "chạy sản xuất"; đánh dấu bước nào đã có trong khuôn mẫu, bước nào vẫn phải làm tay, rồi ước lượng thời gian tiết kiệm được nếu lát sẵn bước làm tay đó.',
    cards: [
      {
        hoi: 'Vì sao lối đi lát sẵn phải là lối dễ nhất, không chỉ là lối đúng nhất?',
        dap: 'Nếu đi đúng khó hơn đi tắt thì đội sản phẩm sẽ đi tắt; nền tảng chỉ thực sự áp được chuẩn khi tuân thủ rẻ hơn né tránh.',
      },
      {
        hoi: 'Vì sao từ chối phải nêu rõ cổng còn thiếu?',
        dap: 'Từ chối không kèm lý do biến nền tảng thành vật cản: đội không biết sửa gì, sẽ tìm đường vòng thay vì quay lại khuôn mẫu.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u198-l2',
    unitId: 'p6-u198',
    title: 'DORA: bốn chỉ số và cái bẫy mẫu quá nhỏ',
    hook: 'Bốn chỉ số DORA rất dễ tính sai theo hướng có lợi: mẫu nhỏ quy về 0, hoặc tính MTTR cho sự cố còn đang chạy.',
    theory:
      'Bốn chỉ số DORA — tần suất phát hành, thời gian dẫn (lead time), tỉ lệ thất bại thay đổi và thời gian khôi phục — chỉ có nghĩa khi mẫu đủ lớn. Thời gian dẫn âm là dấu hiệu lệch đồng hồ giữa hệ CI và hệ phát hành, phải báo invalid chứ không kẹp về 0. Mẫu dưới ngưỡng phải trả `unknown`, vì quy một mẫu rỗng về 0 sẽ vẽ ra bức tranh "không bao giờ hỏng". Sự cố chưa khôi phục xong cũng chưa có MTTR: cộng nó vào lúc này là đo một quãng chưa kết thúc.',
    workedCode:
      '# MÔ PHỎNG cong DORA\nmau, nguong = 2, 10\nprint("unknown: mau duoi nguong" if mau < nguong else "allow: dora du dieu kien")',
    predictCode:
      'lead = -3\nprint("invalid: lead am hoac lech dong ho" if lead < 0 else "allow: dora du dieu kien")',
    predictChoices: [
      'invalid: lead am hoac lech dong ho',
      'allow: dora du dieu kien',
      'unknown: mau duoi nguong',
    ],
    predictAnswer: 0,
    predictExplain:
      'Thời gian dẫn âm không thể xảy ra về mặt vật lý; nó tố cáo hai đồng hồ lệch nhau, nên fail closed thay vì kẹp về 0 và báo cáo một con số đẹp giả.',
    makePrompt:
      'Đọc `lead:<số nguyên>,mau:<số>,nguong:<số>,khoiphuc:<done|running>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; lead < 0 → `invalid: lead am hoac lech dong ho`; mau < nguong → `unknown: mau duoi nguong`; khoiphuc running → `unknown: khoi phuc chua xong`; còn lại → `allow: dora du dieu kien`. MÔ PHỎNG trên nhật ký phát hành hữu hạn, không đọc hệ CI hay kho sự cố thật.',
    testCases: [
      {
        stdinLines: ['lead:12,mau:20,nguong:10,khoiphuc:done'],
        expected: 'allow: dora du dieu kien',
        hidden: false,
        label: 'mẫu đủ lớn và sự cố đã khôi phục xong',
      },
      {
        stdinLines: ['lead:12,mau:3,nguong:10,khoiphuc:done'],
        expected: 'unknown: mau duoi nguong',
        hidden: true,
        label: 'mẫu nhỏ trả unknown chứ không quy về 0',
      },
      {
        stdinLines: ['lead:12,mau:20,nguong:10,khoiphuc:running'],
        expected: 'unknown: khoi phuc chua xong',
        hidden: true,
        label: 'sự cố đang chạy chưa được tính vào MTTR',
      },
      {
        stdinLines: ['lead:-3,mau:20,nguong:10,khoiphuc:done'],
        expected: 'invalid: lead am hoac lech dong ho',
        hidden: true,
        label: 'ca âm — thời gian dẫn âm fail closed',
      },
    ],
    sampleSolution:
      'def so(x):\n    try: return int(x)\n    except ValueError: return None\n\ntry:\n    m = dict(p.split(":", 1) for p in input().strip().split(","))\n    if set(m) != {"lead", "mau", "nguong", "khoiphuc"}: print("invalid: field")\n    elif so(m["lead"]) is None: print("invalid: lead")\n    elif so(m["mau"]) is None: print("invalid: mau")\n    elif so(m["nguong"]) is None: print("invalid: nguong")\n    elif m["khoiphuc"] not in {"done", "running"}: print("invalid: khoiphuc")\n    elif so(m["lead"]) < 0: print("invalid: lead am hoac lech dong ho")\n    elif so(m["mau"]) < so(m["nguong"]): print("unknown: mau duoi nguong")\n    elif m["khoiphuc"] == "running": print("unknown: khoi phuc chua xong")\n    else: print("allow: dora du dieu kien")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, lấy nhật ký phát hành 90 ngày của một dịch vụ thật và tự tính bốn chỉ số DORA; ghi lại bạn đã phải bỏ bao nhiêu bản ghi vì thiếu mốc thời gian, và ngưỡng mẫu nào bạn thấy là tối thiểu để con số có nghĩa.',
    cards: [
      {
        hoi: 'Vì sao mẫu dưới ngưỡng phải trả `unknown` thay vì 0?',
        dap: 'Số 0 đọc như "chưa từng hỏng", còn `unknown` đọc đúng sự thật là "chưa đủ dữ liệu để kết luận" — hai thông điệp dẫn tới hai quyết định trái ngược.',
      },
      {
        hoi: 'Vì sao sự cố đang chạy không được tính vào thời gian khôi phục?',
        dap: 'Quãng chưa kết thúc thì chưa có độ dài; cộng nó vào sẽ kéo chỉ số xuống giả tạo rồi nhảy vọt khi sự cố đóng.',
      },
    ],
  }),
]
