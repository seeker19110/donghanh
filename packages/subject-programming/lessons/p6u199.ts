import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U199_LESSONS = [
  devopsSimulation({
    id: 'p6-u199-l1',
    unitId: 'p6-u199',
    title: 'chuỗi cung ứng: sbom, signature, provenance và digest',
    hook: 'Một tạo tác không nói được nó gồm những gì, ai tạo ra và có bị đổi giữa đường không thì không có cách nào phát hành an toàn — kể cả khi nó chạy đúng.',
    theory:
      'Mỗi tạo tác phát hành — gồm cả MÔ HÌNH và TẬP DỮ LIỆU, không riêng ảnh container — phải kèm bốn loại bằng chứng: danh mục thành phần (sbom), chữ ký (signature) chứng minh ai tạo ra, xuất xứ build (provenance) mô tả quy trình nào sinh ra nó, và digest cố định để tham chiếu bất biến. Digest khai báo phải khớp digest đo lại; lệch nghĩa là tạo tác đã bị thay giữa đường, phải từ chối. Giấy phép cũng là bằng chứng bắt buộc vì mô hình và tập dữ liệu thường kèm ràng buộc sử dụng.',
    workedCode:
      '# MÔ PHỎNG bang chung chuoi cung ung\nsbom, signature = "yes", "yes"\nprint("deny: thieu sbom" if sbom == "no" else ("deny: thieu signature" if signature == "no" else "allow: phat hanh tao tac"))',
    predictCode:
      'khai, do_lai = "d1", "d2"\nprint("deny: digest khong khop" if khai != do_lai else "allow: phat hanh tao tac")',
    predictChoices: [
      'deny: digest khong khop',
      'allow: phat hanh tao tac',
      'deny: thieu provenance',
    ],
    predictAnswer: 0,
    predictExplain:
      'Digest khai báo khác digest đo lại nghĩa là nội dung tạo tác đã đổi so với thứ đã được ký, nên phải chặn phát hành.',
    makePrompt:
      'Đọc `sbom:<yes|no>,signature:<yes|no>,provenance:<yes|no>,license:<yes|no>,digest:<chuỗi>,do_lai:<chuỗi>`. Thiếu trường hoặc giá trị ngoài miền → `invalid: <trường>`; thiếu bằng chứng theo thứ tự sbom, signature, provenance, license → `deny: thieu <tên>`; digest khác do_lai → `deny: digest khong khop`; còn lại → `allow: phat hanh tao tac`. MÔ PHỎNG, không ký thật, không đọc kho tạo tác hay khoá thật.',
    testCases: [
      {
        stdinLines: ['sbom:yes,signature:yes,provenance:yes,license:yes,digest:d1,do_lai:d1'],
        expected: 'allow: phat hanh tao tac',
        hidden: false,
        label: 'đủ bốn bằng chứng và digest khớp',
      },
      {
        stdinLines: ['sbom:no,signature:yes,provenance:yes,license:yes,digest:d1,do_lai:d1'],
        expected: 'deny: thieu sbom',
        hidden: true,
        label: 'thiếu danh mục thành phần',
      },
      {
        stdinLines: ['sbom:yes,signature:yes,provenance:yes,license:yes,digest:d1,do_lai:d2'],
        expected: 'deny: digest khong khop',
        hidden: true,
        label: 'ca âm — tạo tác bị đổi giữa đường',
      },
      {
        stdinLines: ['sbom:yes,signature:maybe,provenance:yes,license:yes,digest:d1,do_lai:d1'],
        expected: 'invalid: signature',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'CHUNG = ["sbom", "signature", "provenance", "license"]\ntry:\n    m = dict(p.split(":", 1) for p in input().strip().split(","))\n    if set(m) != set(CHUNG) | {"digest", "do_lai"}: print("invalid: field")\n    else:\n        xau = next((k for k in CHUNG if m[k] not in {"yes", "no"}), None)\n        thieu = next((k for k in CHUNG if m[k] == "no"), None)\n        if xau: print(f"invalid: {xau}")\n        elif thieu: print(f"deny: thieu {thieu}")\n        elif m["digest"] != m["do_lai"]: print("deny: digest khong khop")\n        else: print("allow: phat hanh tao tac")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, chọn một tạo tác thật trong hệ của bạn và thử trả lời bằng tài liệu sẵn có: nó gồm thư viện nào, ai ký, quy trình nào sinh ra, digest là gì. Ghi lại câu nào bạn KHÔNG trả lời được — đó chính là lỗ hổng chuỗi cung ứng cần vá đầu tiên.',
    cards: [
      {
        hoi: 'Vì sao mô hình và tập dữ liệu cũng cần sbom, chữ ký và xuất xứ?',
        dap: 'Chúng là tạo tác nhị phân đi vào sản xuất y như ảnh container, lại thường kèm ràng buộc giấy phép và rủi ro dữ liệu, nên thiếu bằng chứng là thiếu ở chỗ nguy hiểm nhất.',
      },
      {
        hoi: 'Digest khác thẻ phiên bản (tag) ở chỗ nào?',
        dap: 'Thẻ có thể được trỏ lại sang nội dung khác, còn digest băm chính nội dung nên là tham chiếu bất biến — muốn tái lập được thì phải ghim theo digest.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u199-l2',
    unitId: 'p6-u199',
    title: 'rotate bí mật quá hạn và thứ tự ưu tiên khi luật mâu thuẫn',
    hook: 'Hai luật chính sách mâu thuẫn mà hệ thống chọn ngẫu nhiên thì bản thân chính sách trở nên vô nghĩa — kết quả phải tất định, và mặc định phải nghiêng về phía an toàn.',
    theory:
      'Bí mật tập trung có tuổi và có hạn xoay vòng; quá hạn thì phải `rotate` và chặn phát hành cho tới khi xoay xong, vì một khoá sống quá lâu là khoá đã có nhiều cơ hội rò rỉ. Khi hai luật chính sách cho kết luận trái nhau, thứ tự ưu tiên phải cố định và deny luôn thắng allow — đó là fail closed ở tầng chính sách. Simulator chỉ làm việc với TÊN THAM CHIẾU của bí mật, không bao giờ in giá trị: nhật ký là nơi bí mật hay rò nhất.',
    workedCode:
      '# MÔ PHỎNG xoay vong bi mat (chi tham chieu, khong in gia tri)\ntuoi, han, ref = 40, 30, "db-password"\nprint(f"rotate: bi mat qua han, chan phat hanh (ref {ref})" if tuoi > han else "allow: phat hanh")',
    predictCode:
      'luat_a, luat_b = "allow", "deny"\nprint("deny: luat mau thuan, uu tien deny" if "deny" in (luat_a, luat_b) else "allow: phat hanh")',
    predictChoices: [
      'deny: luat mau thuan, uu tien deny',
      'allow: phat hanh',
      'rotate: bi mat qua han, chan phat hanh',
    ],
    predictAnswer: 0,
    predictExplain:
      'Khi hai luật mâu thuẫn, deny thắng theo thứ tự ưu tiên cố định — nhờ vậy cùng một đầu vào luôn cho cùng một kết quả.',
    makePrompt:
      'Đọc `ref:<tên>,tuoi:<số>,han:<số>,luatA:<allow|deny>,luatB:<allow|deny>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; tuoi > han → `rotate: bi mat qua han, chan phat hanh (ref <tên>)`; có luật deny → `deny: luat mau thuan, uu tien deny`; còn lại → `allow: phat hanh`. Chỉ in TÊN THAM CHIẾU, không in giá trị bí mật. MÔ PHỎNG, không đọc kho bí mật hay khoá thật.',
    testCases: [
      {
        stdinLines: ['ref:db-password,tuoi:10,han:30,luatA:allow,luatB:allow'],
        expected: 'allow: phat hanh',
        hidden: false,
        label: 'bí mật còn hạn và hai luật đều cho phép',
      },
      {
        stdinLines: ['ref:db-password,tuoi:40,han:30,luatA:allow,luatB:allow'],
        expected: 'rotate: bi mat qua han, chan phat hanh (ref db-password)',
        hidden: true,
        label: 'quá hạn xoay vòng thì chặn phát hành',
      },
      {
        stdinLines: ['ref:db-password,tuoi:10,han:30,luatA:allow,luatB:deny'],
        expected: 'deny: luat mau thuan, uu tien deny',
        hidden: true,
        label: 'hai luật mâu thuẫn giải theo thứ tự tất định',
      },
      {
        stdinLines: ['ref:db-password,tuoi:muoi,han:30,luatA:allow,luatB:allow'],
        expected: 'invalid: tuoi',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(p.split(":", 1) for p in input().strip().split(","))\n    if set(m) != {"ref", "tuoi", "han", "luatA", "luatB"}: print("invalid: field")\n    elif not m["tuoi"].isdigit(): print("invalid: tuoi")\n    elif not m["han"].isdigit(): print("invalid: han")\n    elif m["luatA"] not in {"allow", "deny"}: print("invalid: luatA")\n    elif m["luatB"] not in {"allow", "deny"}: print("invalid: luatB")\n    elif int(m["tuoi"]) > int(m["han"]): print(f"rotate: bi mat qua han, chan phat hanh (ref {m[\'ref\']})")\n    elif "deny" in (m["luatA"], m["luatB"]): print("deny: luat mau thuan, uu tien deny")\n    else: print("allow: phat hanh")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, liệt kê mọi bí mật một dịch vụ thật đang dùng kèm lần xoay vòng gần nhất; đánh dấu cái nào chưa từng xoay và viết ra cái gì sẽ gãy nếu bạn xoay nó ngay hôm nay — đó là chi phí thật của việc trì hoãn.',
    cards: [
      {
        hoi: 'Vì sao deny phải thắng allow khi hai luật mâu thuẫn?',
        dap: 'Chọn nhánh an toàn khi thiếu đồng thuận giữ hệ fail closed; chọn allow nghĩa là chỉ cần viết thêm một luật lỏng là vô hiệu hoá được mọi luật chặt.',
      },
      {
        hoi: 'Vì sao simulator chỉ in tên tham chiếu của bí mật?',
        dap: 'Nhật ký và thông báo lỗi là nơi bí mật rò rỉ phổ biến nhất; tham chiếu đủ để lần ra bí mật nào mà không phát tán giá trị.',
      },
    ],
  }),
]
