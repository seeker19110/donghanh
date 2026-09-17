import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U200_LESSONS = [
  devopsSimulation({
    id: 'p6-u200-l1',
    unitId: 'p6-u200',
    title: 'ước lượng bộ nhớ gpu: trọng số, kv cache và quantization',
    hook: 'Câu hỏi "một máy phục vụ được bao nhiêu luồng song song" trả lời được bằng số học trước khi chạm tới phần cứng — và trả lời sai thì bạn phát hiện lúc đang có tải thật.',
    theory:
      'Bộ nhớ gpu cần cho một cấu hình phục vụ mô hình xấp xỉ bằng trọng số cộng kv cache, trong đó kv cache = số lớp × số đầu × độ dài ngữ cảnh × số luồng song song × độ rộng lượng tử hoá (quantization) chia cho 8 bit rồi quy về MB. Hệ quả kiểm chứng được: giữ nguyên mọi tham số khác mà nhân đôi độ dài ngữ cảnh thì kv cache cũng nhân đôi. Đây là ƯỚC LƯỢNG bằng công thức trên fixture để chuẩn bị quyết định, không phải phép đo trên phần cứng; máy chủ phục vụ mô hình cụ thể chỉ là chi tiết triển khai, có thể thay bằng máy chủ khác mà công thức vẫn đúng. Vượt ngân sách bộ nhớ thì phải `reject` kèm số MB còn thiếu, vì "không đủ" mà không nói thiếu bao nhiêu thì không ai biết nên giảm ngữ cảnh hay giảm số luồng.',
    workedCode:
      '# MÔ PHỎNG uoc luong kv cache\nlop, dau, ctx, song, bit = 8, 8, 1024, 2, 8\nprint("kv", lop * dau * ctx * song * bit // (8 * 1024), "MB")',
    predictCode:
      'lop, dau, song, bit = 8, 8, 2, 8\na = lop * dau * 1024 * song * bit // (8 * 1024)\nb = lop * dau * 2048 * song * bit // (8 * 1024)\nprint(a, b)',
    predictChoices: ['128 256', '128 128', '256 128'],
    predictAnswer: 0,
    predictExplain:
      'kv cache tỉ lệ thuận với độ dài ngữ cảnh, nên nhân đôi ngữ cảnh từ 1024 lên 2048 làm kv cache nhân đôi từ 128 lên 256 MB.',
    makePrompt:
      'Đọc `lop:<số>,dau:<số>,ctx:<số>,song:<số>,bit:<4|8|16>,trongso:<số MB>,budget:<số MB>`. Sai kiểu, giá trị ≤ 0 hoặc bit ngoài {4,8,16} → `invalid: <trường>`; tính kv = lop*dau*ctx*song*bit//(8*1024) và tong = trongso + kv; tong > budget → `reject: thieu <tong-budget> MB`; còn lại → `allow: cau hinh vua bo nho gpu, kv <kv> MB`. MÔ PHỎNG bằng công thức trên fixture, không chạm gpu, cụm hay máy chủ mô hình thật.',
    testCases: [
      {
        stdinLines: ['lop:8,dau:8,ctx:1024,song:2,bit:8,trongso:512,budget:1024'],
        expected: 'allow: cau hinh vua bo nho gpu, kv 128 MB',
        hidden: false,
        label: 'cấu hình vừa ngân sách bộ nhớ',
      },
      {
        stdinLines: ['lop:8,dau:8,ctx:2048,song:2,bit:8,trongso:512,budget:1024'],
        expected: 'allow: cau hinh vua bo nho gpu, kv 256 MB',
        hidden: false,
        label: 'kiểm chứng ngược — gấp đôi ngữ cảnh thì kv cache gấp đôi',
      },
      {
        stdinLines: ['lop:8,dau:8,ctx:4096,song:2,bit:8,trongso:512,budget:800'],
        expected: 'reject: thieu 224 MB',
        hidden: true,
        label: 'vượt ngân sách bị từ chối kèm số MB thiếu',
      },
      {
        stdinLines: ['lop:8,dau:8,ctx:1024,song:2,bit:7,trongso:512,budget:1024'],
        expected: 'invalid: bit',
        hidden: true,
        label: 'ca âm — độ rộng lượng tử hoá ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'SO = ["lop", "dau", "ctx", "song", "bit", "trongso", "budget"]\ntry:\n    m = dict(p.split(":", 1) for p in input().strip().split(","))\n    if set(m) != set(SO): print("invalid: field")\n    else:\n        xau = next((k for k in SO if not m[k].isdigit() or int(m[k]) <= 0), None)\n        if xau: print(f"invalid: {xau}")\n        elif int(m["bit"]) not in (4, 8, 16): print("invalid: bit")\n        else:\n            v = {k: int(m[k]) for k in SO}\n            kv = v["lop"] * v["dau"] * v["ctx"] * v["song"] * v["bit"] // (8 * 1024)\n            tong = v["trongso"] + kv\n            if tong > v["budget"]: print(f"reject: thieu {tong - v[\'budget\']} MB")\n            else: print(f"allow: cau hinh vua bo nho gpu, kv {kv} MB")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, chọn một mô hình mở bạn tự chạy được, tính ước lượng theo công thức trên rồi ĐO bộ nhớ thật lúc phục vụ; ghi lại khoảng lệch và giải thích phần lệch đến từ đâu (phân mảnh, bộ đệm kích hoạt, chi phí khung chạy).',
    cards: [
      {
        hoi: 'Vì sao kv cache tăng theo số luồng song song còn trọng số thì không?',
        dap: 'Trọng số nạp một lần dùng chung cho mọi luồng, còn kv cache là trạng thái riêng của từng chuỗi đang sinh nên cộng dồn theo số luồng.',
      },
      {
        hoi: 'Vì sao ước lượng bằng công thức vẫn hữu ích dù luôn lệch với số đo thật?',
        dap: 'Nó đủ chính xác để loại sớm các cấu hình chắc chắn không vừa và để biết nên vặn tham số nào — phép đo thật dùng để hiệu chỉnh, không phải để bắt đầu.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u200-l2',
    unitId: 'p6-u200',
    title: 'cascade nhỏ→lớn, fallback có trần và cost-per-success',
    hook: 'Định tuyến thác không bao giờ leo thang là đã trả tiền mô hình lớn vô ích; luôn leo thang thì mô hình nhỏ chỉ là một lớp trì hoãn tốn thêm tiền.',
    theory:
      'Định tuyến thác (cascade) thử mô hình nhỏ trước, chỉ leo thang lên mô hình lớn khi kết quả không đạt ngưỡng chất lượng. Chuỗi dự phòng (fallback) phải có trần số bước, vì cấu hình trỏ vòng sẽ quay mãi mà không ai phát hiện. Thước đo FinOps đúng là chi phí trên mỗi lần THÀNH CÔNG (cost-per-success), không phải chi phí mỗi lượt gọi — lượt hỏng vẫn tốn tiền. Mẫu thành công bằng 0 thì không chia được, phải trả `unknown` thay vì ném lỗi. Tỉ lệ leo thang bằng 0 hoặc bằng 100% đều là dấu hiệu ngưỡng đặt sai, phải gắn cờ để người xem lại.',
    workedCode:
      '# MÔ PHỎNG cost-per-success\nchiphi, thanhcong = 900, 30\nprint("unknown: mau thanh cong bang 0" if thanhcong == 0 else f"allow: cost-per-success {chiphi // thanhcong}")',
    predictCode:
      'buoc, tran = 7, 3\nprint("reject: chuoi fallback vuot tran vong lap" if buoc > tran else "allow: dinh tuyen")',
    predictChoices: [
      'reject: chuoi fallback vuot tran vong lap',
      'allow: dinh tuyen',
      'unknown: mau thanh cong bang 0',
    ],
    predictAnswer: 0,
    predictExplain:
      'Trần số bước là thứ duy nhất chặn được chuỗi dự phòng trỏ vòng; vượt trần thì từ chối chứ không đi tiếp.',
    makePrompt:
      'Đọc `goi:<số>,thanhcong:<số>,leothang:<số>,chiphi:<số>,buoc:<số>,tran:<số>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; buoc > tran → `reject: chuoi fallback vuot tran vong lap`; thanhcong = 0 → `unknown: mau thanh cong bang 0`; leothang = 0 hoặc leothang = goi → `deny: cascade gan co, nguong dinh tuyen sai`; còn lại → `allow: cost-per-success <chiphi//thanhcong>`. MÔ PHỎNG, không gọi mô hình, cụm hay dịch vụ tính tiền thật.',
    testCases: [
      {
        stdinLines: ['goi:100,thanhcong:30,leothang:20,chiphi:900,buoc:2,tran:3'],
        expected: 'allow: cost-per-success 30',
        hidden: false,
        label: 'thác leo thang có chọn lọc, chia được chi phí',
      },
      {
        stdinLines: ['goi:100,thanhcong:30,leothang:100,chiphi:900,buoc:2,tran:3'],
        expected: 'deny: cascade gan co, nguong dinh tuyen sai',
        hidden: true,
        label: 'luôn leo thang thì mô hình nhỏ vô dụng',
      },
      {
        stdinLines: ['goi:100,thanhcong:0,leothang:20,chiphi:900,buoc:2,tran:3'],
        expected: 'unknown: mau thanh cong bang 0',
        hidden: true,
        label: 'ca âm — cấm chia cho 0',
      },
      {
        stdinLines: ['goi:100,thanhcong:30,leothang:20,chiphi:900,buoc:7,tran:3'],
        expected: 'reject: chuoi fallback vuot tran vong lap',
        hidden: true,
        label: 'ca âm — chuỗi dự phòng trỏ vòng bị trần chặn',
      },
    ],
    sampleSolution:
      'SO = ["goi", "thanhcong", "leothang", "chiphi", "buoc", "tran"]\ntry:\n    m = dict(p.split(":", 1) for p in input().strip().split(","))\n    if set(m) != set(SO): print("invalid: field")\n    else:\n        xau = next((k for k in SO if not m[k].isdigit()), None)\n        if xau: print(f"invalid: {xau}")\n        else:\n            v = {k: int(m[k]) for k in SO}\n            if v["buoc"] > v["tran"]: print("reject: chuoi fallback vuot tran vong lap")\n            elif v["thanhcong"] == 0: print("unknown: mau thanh cong bang 0")\n            elif v["leothang"] in (0, v["goi"]): print("deny: cascade gan co, nguong dinh tuyen sai")\n            else: print(f"allow: cost-per-success {v[\'chiphi\'] // v[\'thanhcong\']}")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, lấy nhật ký một tuần của một luồng gọi mô hình thật và tính chi phí trên mỗi lần thành công; so với chi phí mỗi lượt gọi và ghi lại tỉ lệ thất bại đã âm thầm làm đội giá lên bao nhiêu phần trăm.',
    cards: [
      {
        hoi: 'Vì sao đo chi phí trên mỗi lần thành công thay vì mỗi lượt gọi?',
        dap: 'Lượt hỏng vẫn tiêu token và vẫn phải thử lại; chỉ số theo lượt gọi giấu mất phần tiền trả cho những lần không mang lại kết quả nào.',
      },
      {
        hoi: 'Vì sao chuỗi dự phòng bắt buộc có trần số bước?',
        dap: 'Cấu hình dự phòng trỏ vòng là lỗi phổ biến và im lặng; trần vòng lặp biến một vòng lặp vô hạn thành một lần từ chối nhìn thấy được.',
      },
    ],
  }),
]
